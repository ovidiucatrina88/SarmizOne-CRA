import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Control } from "@/shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Simplified control form schema without entity associations
const controlFormSchema = z.object({
  controlId: z.string().min(1, "Control ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  controlType: z.enum(["preventive", "detective", "corrective"]),
  controlCategory: z.enum(["technical", "administrative", "physical"]),
  implementationStatus: z.enum([
    "not_implemented",
    "in_progress", 
    "fully_implemented",
    "planned",
    "partially_implemented"
  ]),
  controlEffectiveness: z.number().min(0).max(100),
  implementationCost: z.number().min(0),
  costPerAgent: z.number().min(0).optional(),
  isPerAgentPricing: z.boolean().default(false),
  deployedAgentCount: z.number().min(0).optional(),
  notes: z.string().optional(),
  itemType: z.enum(["template", "instance"]).default("instance"),
  libraryItemId: z.number().optional(),
  complianceFramework: z.enum([
    "CIS",
    "NIST_800_53",
    "ISO_27001",
    "PCI_DSS",
    "SOX",
    "GDPR",
    "HIPAA",
    "FedRAMP",
    "CSF",
    "Custom"
  ]).optional(),
});

type ControlFormProps = {
  control: Control | null;
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

  // Fetch risks for read-only display
  const { data: risks } = useQuery({
    queryKey: ["/api/risks"],
  });

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
          complianceFramework: control.complianceFramework as any || undefined,
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
          complianceFramework: undefined,
        },
  });

  // Create mutation for adding/updating control
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof controlFormSchema>) => {
      // Add itemType based on whether this is a template or instance
      values.itemType = isTemplate ? "template" : "instance";

      // Use different endpoints based on isTemplate
      if (control) {
        // Update existing control/template
        const endpoint = isTemplate 
          ? `/api/control-library/${control.id}` 
          : `/api/controls/${control.id}`;
        return apiRequest("PUT", endpoint, values);
      } else {
        // Create new control/template
        const endpoint = isTemplate 
          ? "/api/control-library" 
          : "/api/controls";
        return apiRequest("POST", endpoint, values);
      }
    },
    onSuccess: (updatedControl) => {
      console.log("Form update successful, updated control:", updatedControl);
      
      // Invalidate appropriate queries based on template vs instance
      if (isTemplate) {
        queryClient.invalidateQueries({ queryKey: ["/api/control-library"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
        queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
        queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
      }
      
      // Show success message
      const entityType = isTemplate ? "Template" : "Control";
      toast({
        title: control ? `${entityType} updated` : `${entityType} created`,
        description: control
          ? `The control ${isTemplate ? "template" : "instance"} has been updated successfully.`
          : `A new control ${isTemplate ? "template" : "instance"} has been added to your library.`,
      });
      
      onClose();
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Failed to save control. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof controlFormSchema>) => {
    console.log("Form submission - raw values:", values);
    
    const submissionData = { ...values };
    
    console.log("Form submission - processed data:", submissionData);
    mutation.mutate(submissionData);
  };

  // Get associated risks for read-only display
  const getAssociatedRisks = () => {
    if (!control?.associatedRisks || !risks?.data) return [];
    
    return control.associatedRisks.map(dbId => {
      const risk = risks.data.find((r: any) => r.id.toString() === dbId.toString());
      return risk ? { id: risk.id, riskId: risk.riskId, name: risk.name, severity: risk.severity } : null;
    }).filter(Boolean);
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
                  <Input placeholder="e.g., CTRL-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter control name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  placeholder="Describe the control's purpose and implementation"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Control Type */}
          <FormField
            control={form.control}
            name="controlType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control type" />
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

          {/* Control Category */}
          <FormField
            control={form.control}
            name="controlCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Implementation Status */}
          <FormField
            control={form.control}
            name="implementationStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implementation Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="not_implemented">Not Implemented</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="partially_implemented">Partially Implemented</SelectItem>
                    <SelectItem value="fully_implemented">Fully Implemented</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Control Effectiveness */}
          <FormField
            control={form.control}
            name="controlEffectiveness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Effectiveness (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="0.1"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Compliance Framework */}
        <FormField
          control={form.control}
          name="complianceFramework"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compliance Framework (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compliance framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CIS">CIS Controls</SelectItem>
                  <SelectItem value="NIST_800_53">NIST 800-53</SelectItem>
                  <SelectItem value="ISO_27001">ISO 27001</SelectItem>
                  <SelectItem value="PCI_DSS">PCI DSS</SelectItem>
                  <SelectItem value="SOX">SOX</SelectItem>
                  <SelectItem value="GDPR">GDPR</SelectItem>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="FedRAMP">FedRAMP</SelectItem>
                  <SelectItem value="CSF">NIST CSF</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Configuration</CardTitle>
            <CardDescription>
              Configure how this control's costs are calculated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pricing Type Selection */}
            <div className="space-y-3">
              <Label>Pricing Model</Label>
              <RadioGroup
                value={pricingType}
                onValueChange={(value) => {
                  setPricingType(value);
                  form.setValue("isPerAgentPricing", value === "agent");
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="total" id="total" />
                  <Label htmlFor="total">Total Implementation Cost</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agent" id="agent" />
                  <Label htmlFor="agent">Per-Agent Pricing</Label>
                </div>
              </RadioGroup>
            </div>

            {pricingType === "total" ? (
              <FormField
                control={form.control}
                name="implementationCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Implementation Cost</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costPerAgent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Agent</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          placeholder="0.00"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deployedAgentCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployed Agent Count</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          placeholder="0"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Associated Risks - Read Only */}
        {control && (
          <Card>
            <CardHeader>
              <CardTitle>Associated Risks</CardTitle>
              <CardDescription>
                Risks that this control helps mitigate (read-only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getAssociatedRisks().length > 0 ? (
                <div className="space-y-2">
                  {getAssociatedRisks().map((risk: any) => (
                    <div key={risk.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{risk.riskId}</div>
                        <div className="text-sm text-muted-foreground">{risk.name}</div>
                      </div>
                      <Badge variant={
                        risk.severity === "critical" ? "destructive" :
                        risk.severity === "high" ? "destructive" :
                        risk.severity === "medium" ? "default" :
                        "secondary"
                      }>
                        {risk.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No risks currently associated with this control
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Notes field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes or implementation details"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit buttons */}
        <div className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : (control ? "Update Control" : "Create Control")}
          </Button>
        </div>
      </form>
    </Form>
  );
}