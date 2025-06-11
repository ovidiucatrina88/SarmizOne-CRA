import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Asset, insertAssetSchema, LegalEntity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
// formatCurrency no longer needed
import { ArrowUp, Loader2 } from "lucide-react";

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

// Extended schema with validation
const assetFormSchema = insertAssetSchema.extend({
  assetId: z.string().optional(), // Made optional to allow auto-generation
  name: z.string().min(1, "Asset name is required"),
  type: z.enum([
    "data", "application", "device", "system", "network", "facility", "personnel", "other",
    // Only L4 and L5 enterprise architecture types
    "application_service", "technical_component"
  ], {
    required_error: "Asset type is required",
  }),
  // Add required fields from database schema
  hierarchy_level: z.enum(['strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component']).optional(),
  business_unit: z.string().optional(),
  architecture_domain: z.string().optional(),
  status: z.enum(["Active", "Decommissioned", "To Adopt"], {
    required_error: "Asset status is required",
  }).default("Active"),
  owner: z.string().min(1, "Owner is required"),
  confidentiality: z.enum(["low", "medium", "high"], {
    required_error: "Confidentiality rating is required",
  }),
  integrity: z.enum(["low", "medium", "high"], {
    required_error: "Integrity rating is required",
  }),
  availability: z.enum(["low", "medium", "high"], {
    required_error: "Availability rating is required",
  }),
  assetValue: z.union([
    z.number().min(0, "Asset value must be a positive number"),
    z.string().transform(val => {
      // Remove commas, currency symbols, etc.
      const cleanVal = val.replace(/[^0-9.-]/g, '');
      const numValue = parseFloat(cleanVal);
      return isNaN(numValue) ? 0 : numValue;
    })
  ]),
  currency: z.enum(["USD", "EUR"], {
    required_error: "Currency is required",
  }),
  regulatoryImpact: z.array(z.string()).optional(),
  externalInternal: z.enum(["external", "internal"], {
    required_error: "Location is required",
  }),
  dependencies: z.array(z.string()).optional(),
  description: z.union([
    z.string(),
    z.number().transform(val => String(val)),
    z.any().transform(() => '')
  ]).default(''),
  // Enterprise architecture fields - only keeping parentId for hierarchy
  parentId: z.number().optional().nullable(),
});

// Regulatory frameworks list
const regulatoryOptions = [
  { value: "GDPR", label: "GDPR" },
  { value: "HIPAA", label: "HIPAA" },
  { value: "PCI-DSS", label: "PCI-DSS" },
  { value: "SOX", label: "SOX" },
  { value: "CCPA", label: "CCPA" },
  { value: "ISO27001", label: "ISO 27001" },
  { value: "NIST", label: "NIST CSF" },
];

type AssetFormProps = {
  asset: Asset | null;
  onClose: () => void;
};

export function AssetForm({ asset, onClose }: AssetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Track the current asset type to show appropriate parent options
  const [selectedAssetType, setSelectedAssetType] = useState<string>(
    asset?.type || 'application_service'
  );
  const [selectedRegulations, setSelectedRegulations] = useState<string[]>(
    asset?.regulatoryImpact || []
  );

  // Not needed anymore since we're handling the conversion directly in the Input component
  
  // Fetch legal entities for dropdown
  const { data: legalEntitiesResponse, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/legal-entities'],
  });
  
  // Fetch assets for parent selection (L4 assets for L5 components)
  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['/api/assets'],
  });
  
  // Fetch enterprise architecture items (L3 items for L4 assets)
  const { data: enterpriseResponse, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: ['/api/enterprise-architecture'],
  });
  
  // Process assets data to handle different response formats
  const allAssets = useMemo(() => {
    // Handle different response formats
    if (assetsResponse?.data) {
      return assetsResponse.data;
    }
    // If the response is in the old format (direct array)
    if (Array.isArray(assetsResponse)) {
      return assetsResponse;
    }
    // Default to empty array
    return [];
  }, [assetsResponse]);
  
  // Process enterprise architecture items (L3 level items)
  const enterpriseItems = useMemo(() => {
    // Handle different response formats
    if (enterpriseResponse?.data) {
      return enterpriseResponse.data.filter(item => 
        item.hierarchyLevel === 'business_service' || 
        item.level === 'L3'
      );
    }
    // If the response is in the old format (direct array)
    if (Array.isArray(enterpriseResponse)) {
      return enterpriseResponse.filter(item => 
        item.hierarchyLevel === 'business_service' || 
        item.level === 'L3'
      );
    }
    // Default to empty array
    return [];
  }, [enterpriseResponse]);
  
  // Application service assets (L4) for L5 technical components
  const applicationServiceAssets = useMemo(() => {
    return allAssets.filter(asset => 
      asset.type === 'application_service' || 
      asset.hierarchy_level === 'application_service'
    );
  }, [allAssets]);
  
  // Ensure we handle both response formats (direct array or data.data structure)
  const legalEntities = useState(() => {
    if (!legalEntitiesResponse) return [];
    if (Array.isArray(legalEntitiesResponse)) return legalEntitiesResponse;
    return legalEntitiesResponse.data || [];
  })[0];

  // Initialize form with asset data or defaults
  const form = useForm<z.infer<typeof assetFormSchema>>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: asset
      ? { ...asset }
      : {
          assetId: "",
          name: "",
          type: "technical_component", // Default to L5 (Technical Component)
          status: "Active", // Default to Active status
          owner: "",
          confidentiality: "medium",
          integrity: "medium",
          availability: "medium",
          assetValue: 0,
          currency: "USD",
          regulatoryImpact: [],
          externalInternal: "internal",
          dependencies: [],
          agentCount: 1, // Default number of agents
          description: "",
          // Only keeping parentId for hierarchy
          parentId: null, // Use null instead of undefined to match expected database format
          parentBusinessServiceId: null, // New field for L3 business service parent
          business_unit: "Information Technology",
          hierarchy_level: "technical_component",
          architecture_domain: "Application",
        },
  });
  
  // Watch the asset type field to dynamically update parent options
  const assetType = form.watch('type');

  // Create mutation for adding/updating asset
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof assetFormSchema>) => {
      // Include the selected regulations
      values.regulatoryImpact = selectedRegulations;

      if (asset) {
        // Update existing asset
        return apiRequest("PUT", `/api/assets/${asset.id}`, values);
      } else {
        // Create new asset
        return apiRequest("POST", "/api/assets", values);
      }
    },
    onSuccess: (response) => {
      // Invalidate assets query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      
      // If we're updating an existing asset, also invalidate the specific asset
      if (asset) {
        queryClient.invalidateQueries({ queryKey: [`/api/assets/${asset.id}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/assets/${asset.assetId}`] });
      }
      
      // Invalidate associated data that depends on assets
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
      
      // Also invalidate any related risk data for this asset
      if (asset) {
        queryClient.invalidateQueries({ queryKey: [`/api/assets/${asset.assetId}/risks`] });
      }
      
      console.log(`Asset ${asset ? 'updated' : 'created'} successfully`, response);
      
      // Show success message
      toast({
        title: asset ? "Asset updated" : "Asset created",
        description: asset
          ? "The asset has been updated successfully."
          : "A new asset has been added to your inventory.",
      });
      
      // Close the form modal
      onClose();
    },
    onError: (error) => {
      // Show error message
      toast({
        title: "Error",
        description: `Failed to ${asset ? "update" : "create"} asset: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof assetFormSchema>) => {
    // Create a completely new object with only the exact fields needed by the API
    // This avoids sending any unexpected or removed fields
    // Create a sequential asset ID following the existing pattern in the database
    // Looking at existing assets, they use AST-XXX format (e.g., AST-001, AST-002)
    // Create a higher number to avoid conflicts
    const uniqueAssetId = `AST-${(Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0')}`;
    
    // Create payload that exactly matches the server-side validation schema
    const payload = {
      // Use provided ID or the unique one we generated
      assetId: values.assetId || uniqueAssetId,
      name: values.name,
      // Must match server's enum exactly - using 'application' for both our new types
      type: values.type === 'application_service' || values.type === 'technical_component' 
        ? 'application' 
        : values.type,
      status: values.status,
      // Required server fields
      owner: values.owner || "System Administrator",
      // Convert empty string to null for optional fields
      legalEntity: values.legalEntity || null,
      confidentiality: values.confidentiality,
      integrity: values.integrity,
      availability: values.availability,
      // Server expects number
      assetValue: Number(typeof values.assetValue === 'string' 
        ? values.assetValue.replace(/[^0-9.-]/g, '') 
        : values.assetValue) || 0,
      currency: values.currency || "USD",
      regulatoryImpact: selectedRegulations,
      externalInternal: values.externalInternal || "internal",
      dependencies: Array.isArray(values.dependencies) ? values.dependencies : [],
      agentCount: Number(values.agentCount) || 1,
      // Description must be a non-null string, not an empty string
      description: String(values.description || " ").trim() || "No description provided",
      // Include these as fields that will be stored in the database but ignored by validation
      businessUnit: "Information Technology",
      criticality: "medium",
      // PARENT RELATIONSHIP HANDLING
      // For Application Services using the business service parent
      ...(values.type === 'application_service' && {
        parentId: typeof values.parentBusinessServiceId === "string" 
          ? (values.parentBusinessServiceId === "none" ? null : parseInt(values.parentBusinessServiceId)) 
          : values.parentBusinessServiceId
      }),
      
      // For Technical Components using the application service parent
      ...(values.type === 'technical_component' && {
        parentId: typeof values.parentId === "string" 
          ? (values.parentId === "none" ? null : parseInt(values.parentId)) 
          : values.parentId
      }),
      // Map the hierarchy_level to one of the allowed values in the schema
      hierarchy_level: values.type === 'application_service' ? 'application_service' : 
                      values.type === 'technical_component' ? 'technical_component' : 
                      'application_service',
      architecture_domain: "Application",
      // Extra fields to ensure we match all server requirements
      location: null,
      custodian: null,
      notes: null
    };
    
    console.log('Submitting asset with carefully formatted data:', payload);
    mutation.mutate(payload);
  };

  // Handle regulatory impact selection change
  const handleRegulationChange = (checked: boolean, regulation: string) => {
    setSelectedRegulations(
      checked
        ? [...selectedRegulations, regulation]
        : selectedRegulations.filter((r) => r !== regulation)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-6 pr-2">
          <div className="grid grid-cols-2 gap-4">
          {/* Asset ID field */}
          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Leave blank for auto-generation" {...field} />
                </FormControl>
                <FormDescription>
                  If left blank, an ID will be automatically generated
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Asset Name field */}
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

          {/* Asset Type field */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Only L4 and L5 Enterprise Architecture types */}
                    <SelectItem value="application_service">Application Service (L4)</SelectItem>
                    <SelectItem value="technical_component">Technical Component (L5)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The asset's type (only L4 or L5 enterprise architecture levels)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Asset Status field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                    <SelectItem value="To Adopt">To Adopt</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Active/To Adopt assets contribute to risk calculations, Decommissioned assets are excluded
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Unit field removed */}

          {/* Owner field */}
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner</FormLabel>
                <FormControl>
                  <Input placeholder="Person responsible for the asset" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Asset Value field */}
          <FormField
            control={form.control}
            name="assetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Value</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {form.getValues().currency === 'EUR' ? '€' : '$'}
                    </span>
                    <Input
                      type="text"
                      placeholder="100000"
                      className="pl-8 pr-20"
                      value={field.value || ""}
                      onChange={(e) => {
                        // Just store the raw input value
                        field.onChange(e.target.value);
                      }}
                    />
                    {field.value && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-700 text-white px-2 py-0.5 rounded pointer-events-none">
                        {typeof field.value === 'number' 
                          ? field.value.toLocaleString('en-US')
                          : parseFloat(field.value.toString().replace(/[^0-9.-]/g, '')).toLocaleString('en-US') || '0'}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Enter the asset value. You can use formatted numbers like "50,000,000" (with commas).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Application service parent to Business Service (L4 to L3) */}
          {assetType === 'application_service' && (
            <FormField
              control={form.control}
              name="parentBusinessServiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Business Service (L3)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value !== "none" ? Number(value) : null)}
                    value={field.value !== null ? String(field.value) : "none"}
                    disabled={isLoadingEnterprise}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent business service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Independent Application Service)</SelectItem>
                      
                      {enterpriseItems.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name} {item.level && `(${item.level})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Associate this application service (L4) with a business service (L3). Can be independent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Technical component parent to Application Service (L5 to L4) */}
          {assetType === 'technical_component' && (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Application Service (L4)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value !== "none" ? Number(value) : null)}
                    value={field.value !== null ? String(field.value) : "none"}
                    disabled={isLoadingAssets}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent application service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Independent Technical Component)</SelectItem>
                      
                      {applicationServiceAssets.map((asset) => (
                        <SelectItem key={asset.id} value={String(asset.id)}>
                          {asset.name} {asset.assetId && `(${asset.assetId})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Associate this technical component (L5) with an application service (L4). Can be independent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Currency field */}
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Update the asset value field display when currency changes
                    const assetValueField = form.getValues("assetValue");
                    if (assetValueField) {
                      setTimeout(() => {
                        form.setValue("assetValue", assetValueField, { shouldValidate: true });
                      }, 0);
                    }
                  }}
                  defaultValue={field.value || "USD"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confidentiality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confidentiality</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
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

          {/* Integrity field */}
          <FormField
            control={form.control}
            name="integrity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integrity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
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

          {/* Availability field */}
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
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

          {/* External/Internal field */}
          <FormField
            control={form.control}
            name="externalInternal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
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

          {/* Agent Count field */}
          <FormField
            control={form.control}
            name="agentCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of agents/users for this asset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Legal Entity field */}
          <FormField
            control={form.control}
            name="legalEntity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Entity</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoadingEntities}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal entity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!legalEntities || legalEntities.length === 0 ? (
                      <SelectItem value="Unknown">No legal entities found</SelectItem>
                    ) : (
                      legalEntities.map((entity) => (
                        <SelectItem key={entity.entityId} value={entity.name}>
                          {entity.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Legal entity that owns this asset
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Parent Asset field */}
          <FormField
            control={form.control}
            name="parentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Asset</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "none" ? null : parseInt(value))}
                  value={field.value?.toString() || "none"}
                  disabled={isLoadingAssets}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent asset (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None (Top-level asset)</SelectItem>
                    {!allAssets || allAssets.length === 0 ? (
                      <SelectItem value="no-assets" disabled>No assets found</SelectItem>
                    ) : (
                      allAssets
                        .filter(a => !asset || a.id !== asset.id) // Don't show current asset as potential parent
                        .map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.name} ({a.type})
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The parent asset in the hierarchy (if any)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Hierarchy Level field removed */}
          
          {/* Architecture Domain field removed */}
        </div>

        {/* Regulatory Impact field */}
        <div>
          <FormLabel>Regulatory Impact</FormLabel>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {regulatoryOptions.map((regulation) => (
              <div className="flex items-center space-x-2" key={regulation.value}>
                <Checkbox
                  id={`regulation-${regulation.value}`}
                  checked={selectedRegulations.includes(regulation.value)}
                  onCheckedChange={(checked) =>
                    handleRegulationChange(checked as boolean, regulation.value)
                  }
                />
                <label
                  htmlFor={`regulation-${regulation.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {regulation.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Dependencies field */}
        <FormField
          control={form.control}
          name="dependencies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dependencies (comma-separated asset IDs)</FormLabel>
              <FormControl>
                <Input
                  placeholder="AST-002, AST-003"
                  value={field.value?.join(", ") || ""}
                  onChange={(e) => {
                    // Convert comma-separated string to array
                    const deps = e.target.value
                      .split(",")
                      .map((dep) => dep.trim())
                      .filter((dep) => dep !== "");
                    field.onChange(deps);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description field */}
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

        </div>
        
        {/* Sticky footer with form actions */}
        <div className="sticky bottom-0 bg-white border-t pt-4 mt-6">
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
              {asset ? "Update Asset" : "Create Asset"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
