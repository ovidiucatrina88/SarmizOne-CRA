import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Asset, Control, Risk, insertControlSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

type ApiListResponse<T> = {
  data: T[];
};

type LegacyControl = Control & {
  associatedRisks?: (string | number)[];
  isPerAgentPricing?: boolean | null;
  deployedAgentCount?: number | null;
  costPerAgent?: number | null;
  notes?: string | null;
  itemType?: "template" | "instance" | null;
  assetId?: string | null;
  legalEntityId?: string | null;
};

type ControlApiResponse = {
  data?: LegacyControl;
};

type AssetWithCapacity = Asset & {
  hierarchy_level?: string;
};

const extractList = <T,>(source?: ApiListResponse<T> | T[]): T[] => {
  if (!source) return [];
  return Array.isArray(source) ? source : source.data ?? [];
};

// Extended schema with validation - simplified without entity associations
const controlFormSchema = insertControlSchema.extend({
  controlId: z.string().min(1, "Control ID is required"),
  name: z.string().min(1, "Control name is required"),
  description: z.string().optional(),
  controlType: z.enum(["preventive", "detective", "corrective"], {
    required_error: "Control type is required",
  }),
  controlCategory: z.enum(["technical", "administrative", "physical"], {
    required_error: "Control category is required",
  }),
  implementationStatus: z.enum(["not_implemented", "planned", "partially_implemented", "in_progress", "fully_implemented"], {
    required_error: "Implementation status is required",
  }),
  controlEffectiveness: z.number().min(0).max(10, "Effectiveness must be between 0 and 10"),
  implementationCost: z.number().min(0, "Implementation cost must be a positive number"),
  costPerAgent: z.number().min(0, "Cost per agent must be a positive number"),
  isPerAgentPricing: z.boolean().default(false),
  deployedAgentCount: z.number().min(0, "Deployed agent count must be a positive number").optional(),
  notes: z.string().optional(),
  // Template/instance classification
  libraryItemId: z.number().optional(),
  itemType: z.enum(["template", "instance"]).default("instance"),
  assetId: z.string().optional(),
  legalEntityId: z.string().optional(),
});

type ControlFormProps = {
  control: LegacyControl | null;
  onClose: () => void;
  isTemplate?: boolean;
};

export function ControlForm({ control, onClose, isTemplate = false }: ControlFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for pricing type
  const [pricingType, setPricingType] = useState<string>(
    control?.isPerAgentPricing ? "agent" : "total"
  );
  const [selectedRisks, setSelectedRisks] = useState<string[]>(
    control?.associatedRisks?.map((riskId) => String(riskId)) || []
  );

  useEffect(() => {
    if (control?.associatedRisks) {
      setSelectedRisks(control.associatedRisks.map((riskId) => String(riskId)));
    } else {
      setSelectedRisks([]);
    }
  }, [control?.associatedRisks]);

  // Fetch risks for read-only display
  const { data: risksResponse } = useQuery<ApiListResponse<Risk> | Risk[]>({
    queryKey: ["/api/risks"],
  });

  // Fetch assets for agent count validation
  const { data: assetsResponse } = useQuery<ApiListResponse<AssetWithCapacity> | AssetWithCapacity[]>({
    queryKey: ["/api/assets"],
  });

  const risksList = useMemo<Risk[]>(() => extractList<Risk>(risksResponse), [risksResponse]);
  const assetsList = useMemo<AssetWithCapacity[]>(() => extractList<AssetWithCapacity>(assetsResponse), [assetsResponse]);

  // Calculate total available agent capacity for control deployment
  const calculateAvailableAgentCapacity = () => {
    if (!assetsList.length) return 0;
    
    // For simplified controls, calculate capacity based on all assets
    let totalCapacity = 0;
    const processedAssets = new Set();
    
    assetsList.forEach((asset) => {
      if (!processedAssets.has(asset.assetId)) {
        const hierarchyCapacity = calculateAssetHierarchyCapacity(asset.assetId, assetsList);
        totalCapacity += hierarchyCapacity;
        processedAssets.add(asset.assetId);
      }
    });
    
    return totalCapacity;
  };

  // Calculate agent capacity for an asset and its entire hierarchy tree
  const calculateAssetHierarchyCapacity = (rootAssetId: string, allAssets: AssetWithCapacity[]) => {
    let hierarchyCapacity = 0;
    const processedInHierarchy = new Set();
    
    // Function to recursively calculate capacity for asset tree
    const addAssetAndChildren = (assetId: string) => {
      if (processedInHierarchy.has(assetId)) return;
      processedInHierarchy.add(assetId);
      
      const asset = allAssets.find(a => a.assetId === assetId);
      if (asset && asset.agentCount) {
        hierarchyCapacity += Number(asset.agentCount) || 0;
      }
      
      // Find child assets (where parentId matches current asset)
      const children = allAssets.filter(a => a.parentId === asset?.id);
      children.forEach(child => {
        addAssetAndChildren(child.assetId);
      });
    };
    
    addAssetAndChildren(rootAssetId);
    return hierarchyCapacity;
  };

  // Initialize form with control data or defaults
  const form = useForm<z.infer<typeof controlFormSchema>>({
    resolver: zodResolver(controlFormSchema),
    defaultValues: control
      ? {
          controlId: control.controlId,
          name: control.name,
          description: control.description || "",
          controlType: control.controlType,
          controlCategory: control.controlCategory,
          implementationStatus: control.implementationStatus,
          controlEffectiveness: Number(control.controlEffectiveness || 0),
          implementationCost: Number(control.implementationCost || 0),
          costPerAgent: Number(control.costPerAgent || 0),
          deployedAgentCount: Number(control.deployedAgentCount || 0),
          isPerAgentPricing: Boolean(control.isPerAgentPricing),
          notes: control.notes || "",
          itemType: (control.itemType || "instance") as "template" | "instance",
          libraryItemId: control.libraryItemId || undefined,
        }
      : {
          controlId: "",
          name: "",
          description: "",
          controlType: "preventive",
          controlCategory: "technical",
          implementationStatus: "not_implemented",
          controlEffectiveness: 0,
          implementationCost: 0,
          costPerAgent: 0,
          isPerAgentPricing: false,
          deployedAgentCount: 0,
          notes: "",
          itemType: "instance",
          libraryItemId: undefined,
        },
  });

  // Create mutation for adding/updating control
  const mutation = useMutation<ControlApiResponse, Error, z.infer<typeof controlFormSchema>>({
    mutationFn: async (values: z.infer<typeof controlFormSchema>) => {
      // Add itemType based on whether this is a template or instance
      values.itemType = isTemplate ? "template" : "instance";

      // Use different endpoints based on isTemplate
      let res: Response;
      if (control) {
        // Update existing control/template
        const endpoint = isTemplate 
          ? `/api/control-library/${control.id}` 
          : `/api/controls/${control.id}`;
        res = await apiRequest("PUT", endpoint, values);
      } else {
        // Create new control/template
        const endpoint = isTemplate 
          ? "/api/control-library" 
          : "/api/controls";
        res = await apiRequest("POST", endpoint, values);
      }
      return res.json() as Promise<ControlApiResponse>;
    },
    onSuccess: (updatedControl) => {
      console.log("Form update successful, updated control:", updatedControl);
      
      // Invalidate appropriate queries based on template vs instance
      if (isTemplate) {
        queryClient.invalidateQueries({ queryKey: ["/api/control-library"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
        
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
        // Invalidate risk summary for Loss Exceedance Curve
        queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
      }
      
      // Update form with the server response to show correct values
      if (control && updatedControl?.data) {
        const normalizedData: z.infer<typeof controlFormSchema> = {
          controlId: updatedControl.data.controlId,
          name: updatedControl.data.name,
          description: updatedControl.data.description || "",
          controlType: updatedControl.data.controlType,
          controlCategory: updatedControl.data.controlCategory,
          implementationStatus: updatedControl.data.implementationStatus,
          controlEffectiveness: Number(updatedControl.data.controlEffectiveness || 0),
          implementationCost: Number(updatedControl.data.implementationCost || 0),
          costPerAgent: Number(updatedControl.data.costPerAgent || 0),
          isPerAgentPricing: Boolean(updatedControl.data.isPerAgentPricing),
          deployedAgentCount: Number(updatedControl.data.deployedAgentCount || 0),
          notes: updatedControl.data.notes || "",
          libraryItemId: updatedControl.data.libraryItemId ?? undefined,
          itemType:
            (updatedControl.data.itemType as "template" | "instance") ||
            (isTemplate ? "template" : "instance"),
          assetId: updatedControl.data.assetId ?? "",
          legalEntityId: updatedControl.data.legalEntityId ?? "",
        };
        form.reset(normalizedData);
        
        // Update pricing type state
        setPricingType(updatedControl.data.isPerAgentPricing ? "agent" : "total");
        setSelectedRisks(
          updatedControl.data.associatedRisks?.map((riskId) => String(riskId)) ||
            [],
        );
      }
      
      // Show success message with appropriate template/instance language
      const entityType = isTemplate ? "Template" : "Control";
      toast({
        title: control ? `${entityType} updated` : `${entityType} created`,
        description: control
          ? `The control ${isTemplate ? "template" : "instance"} has been updated successfully.`
          : `A new control ${isTemplate ? "template" : "instance"} has been added to your library.`,
      });
      
      // Auto-close the form after successful submission (both create and update)
      onClose();
    },
    onError: (error) => {
      // Show error message with template/instance language
      const entityType = isTemplate ? "template" : "control";
      toast({
        title: "Error",
        description: `Failed to ${control ? "update" : "create"} ${entityType}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof controlFormSchema>) => {
    console.log("Form submission - raw values:", values);
    
    // Calculate available agent capacity for validation
    const availableCapacity = calculateAvailableAgentCapacity();
    const requestedAgents = Number(values.deployedAgentCount || 0);
    
    // Validate agent count doesn't exceed asset hierarchy capacity
    if (values.implementationStatus === "in_progress" && requestedAgents > availableCapacity) {
      toast({
        title: "Agent Deployment Error",
        description: `Cannot deploy ${requestedAgents} agents. Available capacity: ${availableCapacity} agents across asset hierarchy.`,
        variant: "destructive",
      });
      console.log(`Validation failed: Requested ${requestedAgents} agents exceeds available capacity ${availableCapacity}`);
      return;
    }
    
    // Ensure all numeric fields are properly converted
    const submissionData = {
      ...values,
      costPerAgent: Number(values.costPerAgent || 0),
      implementationCost: Number(values.implementationCost || 0),
      controlEffectiveness: Number(values.controlEffectiveness || 0),
      deployedAgentCount: Number(values.deployedAgentCount || 0),
      isPerAgentPricing: Boolean(values.isPerAgentPricing),
      associatedRisks: selectedRisks
    };
    
    // Business logic: When status is "fully_implemented", clear deployedAgentCount to 0
    // Total cost will be calculated using asset agent count × cost per agent
    if (submissionData.implementationStatus === "fully_implemented") {
      submissionData.deployedAgentCount = 0;
    }
    
    // Log the final data being sent
    console.log("Form submission - processed data:", submissionData);
    console.log(`Agent validation passed: ${requestedAgents} agents within capacity of ${availableCapacity}`);
    
    mutation.mutate(submissionData);
  };

  // Get associated risks for read-only display
  const getAssociatedRisks = () => {
    if (!selectedRisks.length || !risksList.length) return [];

    return selectedRisks
      .map((riskId) =>
        risksList.find((risk) => String(risk.riskId) === String(riskId)),
      )
      .filter(Boolean)
      .map((risk) => ({
        id: risk!.id,
        riskId: risk!.riskId,
        name: risk!.name,
        severity: risk!.severity,
      }));
  };

  const handleRiskChange = (checked: boolean, riskId: string) => {
    setSelectedRisks((prev) => {
      if (checked) {
        return prev.includes(riskId) ? prev : [...prev, riskId];
      }
      return prev.filter((id) => id !== riskId);
    });
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };


  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Control ID field */}
          <FormField
            control={form.control}
            name="controlId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control ID</FormLabel>
                <FormControl>
                  <Input placeholder="CTL-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Control Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Name</FormLabel>
                <FormControl>
                  <Input placeholder="Multi-factor Authentication" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Control Type field */}
          <FormField
            control={form.control}
            name="controlType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="detective">Detective</SelectItem>
                    <SelectItem value="corrective">Corrective</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Control Category field */}
          <FormField
            control={form.control}
            name="controlCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Implementation Status field */}
          <FormField
            control={form.control}
            name="implementationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implementation Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not_implemented">Not Implemented</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="partially_implemented">Partially Implemented</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="fully_implemented">Fully Implemented</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Implementation Cost Type Selector */}
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="isPerAgentPricing"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Implementation Cost Type</FormLabel>
                  <div className="flex items-center space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="total-cost"
                          className="mr-2"
                          checked={!field.value}
                          onChange={() => {
                            field.onChange(false);
                            // Update form values and ensure they're numbers
                            form.setValue("implementationCost", Number(form.getValues("implementationCost")) || 0);
                            form.setValue("costPerAgent", 0);
                            setPricingType("total");
                          }}
                        />
                        <label htmlFor="total-cost" className="font-medium">Total cost of control</label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Fixed implementation cost for the entire control
                      </p>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="agent-cost"
                          className="mr-2"
                          checked={field.value}
                          onChange={() => {
                            field.onChange(true);
                            // Update form values and ensure they're numbers
                            form.setValue("costPerAgent", Number(form.getValues("costPerAgent")) || 0);
                            form.setValue("implementationCost", 0);
                            setPricingType("agent");
                          }}
                        />
                        <label htmlFor="agent-cost" className="font-medium">Agent based cost</label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cost per agent that scales with deployment size
                      </p>
                    </div>
                  </div>
                  <FormDescription>
                    Choose how this control's implementation cost is calculated
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Both cost fields with conditional display */}
        <div className="space-y-6">
          {/* Total Implementation Cost */}
          <div className={pricingType === "agent" ? "hidden" : ""}>
            <FormField
              control={form.control}
              name="implementationCost"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <FormLabel className="text-base">Total Implementation Cost ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="50000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The total fixed cost for implementing this control across all assets
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Cost Per Agent */}
          {/* Deployed Agent Count - only show when implementation status is "in_progress" */}
          {form.watch("implementationStatus") === "in_progress" && pricingType === "agent" && (
            <div>
              <FormField
                control={form.control}
                name="deployedAgentCount"
                render={({ field }) => (
                  <FormItem className="rounded-lg border p-4">
                    <FormLabel className="text-base">Deployed Agents Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of agents currently deployed for this in-progress control
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {/* Show message for fully implemented */}
          {form.watch("implementationStatus") === "fully_implemented" && pricingType === "agent" && (
            <div className="rounded-lg border p-4 bg-green-50 border-green-200">
              <p className="text-sm text-green-700">
                <strong>Fully Implemented:</strong> Total cost will be calculated using asset agent count × cost per agent
              </p>
            </div>
          )}
          
          <div className={pricingType !== "agent" ? "hidden" : ""}>
            <FormField
              control={form.control}
              name="costPerAgent"
              render={({ field }) => (
                <FormItem className="rounded-lg border p-4">
                  <FormLabel className="text-base">Cost Per Agent ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="250"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    The cost per agent/workload for this control. Total cost will be calculated by multiplying by the number of agents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Control Effectiveness field */}
        <FormField
          control={form.control}
          name="controlEffectiveness"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Control Effectiveness (FAIR-U Resistance Strength)</FormLabel>
                <span className="text-sm">{field.value.toFixed(1)} / 10</span>
              </div>
              <FormControl>
                <Slider
                  value={[field.value]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground mt-1">
                How effective the control is at mitigating risk (0-10 scale)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Associated Risks field */}
        <div>
          <FormLabel>Associated Risks</FormLabel>
          {risksList.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {risksList.map((risk) => (
                <div className="flex items-center space-x-2" key={risk.id}>
                  <Checkbox
                    id={`risk-${risk.id}`}
                    checked={selectedRisks.includes(risk.riskId)}
                    onCheckedChange={(checked) =>
                      handleRiskChange(checked as boolean, risk.riskId)
                    }
                  />
                  <label
                    htmlFor={`risk-${risk.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {risk.name} ({risk.riskId})
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">
              No risks available. Please add risks first.
            </p>
          )}
        </div>

        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the control..."
                  className="h-20"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about implementation..."
                  className="h-20"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />



        {/* Asset and Legal Entity Linking Section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Entity Associations</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Asset Selection */}
            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Asset (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Asset</SelectItem>
                    {assetsList.map((asset) => (
                      <SelectItem key={asset.assetId} value={asset.assetId}>
                        {asset.name} ({asset.assetId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                  <FormDescription>
                    Link this control to a specific asset for targeted protection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Legal Entity Selection */}
            <FormField
              control={form.control}
              name="legalEntityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Entity (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Legal entity ID" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Associate this control with a specific legal entity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="gap-1"
          >
            {mutation.isPending && <Loader className="h-4 w-4 animate-spin" />}
            {control ? "Update Control" : "Create Control"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
