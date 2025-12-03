import { Asset } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";

// Define utils locally
type ApiListResponse<T> = {
  success: boolean;
  data: T[];
};

function extractList<T>(response: ApiListResponse<T> | T[] | undefined): T[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  return response.data || [];
}

type AssetOption = Asset & {
  parentBusinessServiceId?: number | null;
  hierarchy_level?: string;
};

type EnterpriseItem = {
  id: number;
  name: string;
  level: string;
  hierarchyLevel?: string;
};

type AssetFormProps = {
  asset?: Asset | null;
  onClose: () => void;
};

const assetFormSchema = z.object({
  assetId: z.string().optional(),
  name: z.string().min(1, "Asset name is required"),
  type: z.enum(["application", "data", "device", "system", "network", "facility", "personnel", "other", "application_service", "technical_component"]),
  status: z.enum(["Active", "Decommissioned", "To Adopt"]),
  owner: z.string().min(1, "Owner is required"),
  description: z.string().optional(),
  confidentiality: z.enum(["low", "medium", "high"]),
  integrity: z.enum(["low", "medium", "high"]),
  availability: z.enum(["low", "medium", "high"]),
  assetValue: z.number().min(0, "Asset value must be a positive number"),
  currency: z.enum(["USD", "EUR"]),
  regulatoryImpact: z.array(z.string()).default([]),
  externalInternal: z.enum(["internal", "external"]),
  dependencies: z.array(z.string()).default([]),
  agentCount: z.number().min(1, "At least one agent is required"),
  legalEntity: z.string().nullable().optional(),
  parentId: z.number().nullable().optional(),
  parentBusinessServiceId: z.number().nullable().optional(),
});

export function AssetForm({ asset, onClose }: AssetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: legalEntitiesResponse, isLoading: isLoadingEntities } = useQuery<ApiListResponse<any> | any[]>({
    queryKey: ['/api/legal-entities'],
  });

  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery<ApiListResponse<AssetOption> | AssetOption[]>({
    queryKey: ['/api/assets'],
  });

  const { data: enterpriseResponse, isLoading: isLoadingEnterprise } = useQuery<ApiListResponse<EnterpriseItem> | EnterpriseItem[]>({
    queryKey: ['/api/enterprise-architecture'],
  });

  const allAssets = extractList(assetsResponse);
  const enterpriseItems = extractList(enterpriseResponse);
  const legalEntities = extractList(legalEntitiesResponse);

  // Safeguard against malformed regulatoryImpact
  const initialRegulations = useMemo(() => {
    if (!asset) return [];
    if (Array.isArray(asset.regulatoryImpact)) return asset.regulatoryImpact;
    return [];
  }, [asset]);

  const [selectedRegulations, setSelectedRegulations] = useState<string[]>(initialRegulations);

  const form = useForm<z.infer<typeof assetFormSchema>>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: asset
      ? {
        assetId: asset.assetId || "",
        name: asset.name || "",
        type: (asset.type as any) || "application",
        status: (asset.status as any) || "Active",
        owner: asset.owner || "",
        description: asset.description || "",
        confidentiality: (asset.confidentiality as any) || "medium",
        integrity: (asset.integrity as any) || "medium",
        availability: (asset.availability as any) || "medium",
        assetValue: typeof asset.assetValue === 'string' ? parseFloat(asset.assetValue) || 0 : asset.assetValue || 0,
        currency: (asset.currency as any) || "USD",
        regulatoryImpact: asset.regulatoryImpact || [],
        externalInternal: (asset.externalInternal as any) || "internal",
        dependencies: asset.dependencies || [],
        agentCount: asset.agentCount || 1,
        legalEntity: asset.legalEntity || null,
        parentId: asset.parentId || null,
        parentBusinessServiceId: (asset as any).parentBusinessServiceId || null,
      }
      : {
        assetId: "",
        name: "",
        type: "application",
        status: "Active",
        owner: "",
        description: "",
        confidentiality: "medium",
        integrity: "medium",
        availability: "medium",
        assetValue: 0,
        currency: "USD",
        regulatoryImpact: [],
        externalInternal: "internal",
        dependencies: [],
        agentCount: 1,
        legalEntity: null,
        parentId: null,
        parentBusinessServiceId: null,
      },
  });

  // Watch asset type to conditionally show parent fields
  const assetType = form.watch("type");

  function onSubmit(data: z.infer<typeof assetFormSchema>) {
    // If creating a new asset, remove the ID if it's empty so the backend generates it
    if (!asset && !data.assetId) {
      delete (data as any).assetId;
    }

    // Ensure numeric values are numbers
    const formattedData = {
      ...data,
      assetValue: Number(data.assetValue),
      agentCount: Number(data.agentCount),
      parentId: data.parentId ? Number(data.parentId) : null,
      parentBusinessServiceId: data.parentBusinessServiceId ? Number(data.parentBusinessServiceId) : null,
      regulatoryImpact: selectedRegulations
    };

    mutation.mutate(formattedData);
  }

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Use fetch directly since apiRequest is not available locally
      const url = asset ? `/api/assets/${asset.id}` : "/api/assets";
      const method = asset ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${asset ? "update" : "create"} asset`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: asset ? "Asset updated" : "Asset created",
        description: asset
          ? "The asset has been updated successfully."
          : "The new asset has been created successfully.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to ${asset ? "update" : "create"} asset: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle regulatory impact selection change
  const handleRegulationChange = (checked: boolean, regulation: string) => {
    setSelectedRegulations(
      checked
        ? [...selectedRegulations, regulation]
        : selectedRegulations.filter((r) => r !== regulation)
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{asset ? "Edit Asset" : "Create New Asset"}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Name</FormLabel>
                <FormControl>
                  <Input placeholder="Customer Database" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about the asset..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="regulatoryImpact"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Regulatory Impact</FormLabel>
                  <FormDescription>
                    Select the regulations that apply to this asset.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {["GDPR", "CCPA", "HIPAA", "PCI DSS", "SOX", "FISMA", "NIST", "ISO 27001"].map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="regulatoryImpact"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={selectedRegulations.includes(item)}
                                onCheckedChange={(checked) => {
                                  handleRegulationChange(checked as boolean, item);
                                  // Update the form field as well
                                  const current = selectedRegulations;
                                  const updated = checked
                                    ? [...current, item]
                                    : current.filter((value) => value !== item);
                                  field.onChange(updated);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  <Input placeholder="Owner" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="application">Application</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="device">Device</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="facility">Facility</SelectItem>
                      <SelectItem value="personnel">Personnel</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                      <SelectItem value="To Adopt">To Adopt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="assetValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="externalInternal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External/Internal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="legalEntity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Entity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select legal entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {legalEntities.map((entity: any) => (
                        <SelectItem key={entity.id} value={entity.name}>
                          {entity.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="confidentiality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidentiality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="integrity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Integrity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="dependencies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dependencies</FormLabel>
                <FormControl>
                  <div className="border rounded-md p-4 max-h-40 overflow-y-auto space-y-2">
                    {allAssets.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No other assets available.</p>
                    ) : (
                      allAssets
                        .filter(a => a.id !== asset?.id) // Prevent self-dependency
                        .map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(item.assetId)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                const updated = checked
                                  ? [...current, item.assetId]
                                  : current.filter((val) => val !== item.assetId);
                                field.onChange(updated);
                              }}
                            />
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {item.name} ({item.assetId})
                            </label>
                          </div>
                        ))
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Select other assets that this asset depends on.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />







          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Architecture Item</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                  defaultValue={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent item (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    {enterpriseItems.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name} ({item.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional Parent Fields */}
          {(assetType === "application" || assetType === "data") && (
            <FormField
              control={form.control}
              name="parentBusinessServiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Business Service</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                    defaultValue={field.value ? String(field.value) : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enterpriseItems
                        .filter(item => item.level === "Business Service")
                        .map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
              {mutation.isPending && <span className="animate-spin">⏳</span>}
              {asset ? "Update Asset" : "Create Asset"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
