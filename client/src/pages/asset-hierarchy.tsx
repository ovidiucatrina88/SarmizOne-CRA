import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Asset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarLoader } from "@/components/ui/barloader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Share2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/layout";

// Define a node in the hierarchy tree
interface HierarchyNode {
  id: number;
  assetId: string;
  name: string;
  type: string;
  hierarchyLevel?: string;
  architectureDomain?: string;
  children: HierarchyNode[];
}

// Define the form schema for hierarchy asset creation
const assetHierarchyFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  assetId: z.string().optional(),
  type: z.enum([
    "strategic_capability", 
    "value_capability", 
    "business_service", 
    "product_service", 
    "application_service", 
    "technical_component"
  ]),
  parentId: z.number().nullable().optional(),
  architectureDomain: z.string().optional(),
  status: z.string().default("Active"),
  // Required fields for the asset schema
  businessUnit: z.string().default("Enterprise Architecture"),
  owner: z.string().default("Architecture Team"),
  legalEntity: z.string().default("Main Organization"),
  confidentiality: z.enum(["low", "medium", "high"]).default("medium"),
  integrity: z.enum(["low", "medium", "high"]).default("medium"),
  availability: z.enum(["low", "medium", "high"]).default("medium"),
  assetValue: z.number().default(1000),
  externalInternal: z.enum(["external", "internal"]).default("internal"),
});

type AssetHierarchyFormValues = z.infer<typeof assetHierarchyFormSchema>;

// HierarchyAssetForm component
function HierarchyAssetForm({ 
  allAssets,
  onClose
}: { 
  allAssets: Asset[],
  onClose: () => void 
}) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  
  // Setup react-hook-form with zod validation
  const form = useForm<AssetHierarchyFormValues>({
    resolver: zodResolver(assetHierarchyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      assetId: "",
      type: "strategic_capability",
      parentId: null,
      architectureDomain: "Information Security",
      status: "active",
    },
  });

  // Create asset mutation
  const createAssetMutation = useMutation({
    mutationFn: async (values: AssetHierarchyFormValues) => {
      // Auto-generate assetId if not provided
      if (!values.assetId) {
        const prefix = getAssetPrefix(values.type);
        const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        values.assetId = `${prefix}-${randomId}`;
      }
      
      // Send to API
      return fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Asset created",
        description: "The asset has been added to the hierarchy",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create asset: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to get prefix based on asset type
  const getAssetPrefix = (type: string) => {
    switch (type) {
      case "strategic_capability": return "SC";
      case "value_capability": return "VC";
      case "business_service": return "BS";
      case "product_service": return "PS";
      case "application_service": return "AS";
      case "technical_component": return "TC";
      default: return "AST";
    }
  };

  // Get available parent assets based on selected type and architecture domain
  const getAvailableParents = () => {
    const selectedType = form.watch("type");
    const architectureDomain = form.watch("architectureDomain");
    
    // Map type to their hierarchy level (L1-L5)
    const typeHierarchy = {
      "strategic_capability": 1,
      "value_capability": 2,
      "business_service": 3,
      "product_service": 3,
      "application_service": 4,
      "technical_component": 5
    };
    
    const currentLevel = typeHierarchy[selectedType as keyof typeof typeHierarchy];
    
    // Filter parent options - parents must be one level above current
    if (currentLevel === 1) return []; // No parents for L1
    
    return allAssets.filter(asset => {
      // Get the hierarchy level for this potential parent
      const parentType = asset.type as keyof typeof typeHierarchy;
      const parentLevel = typeHierarchy[parentType] || 0;
      
      // Parent must be exactly one level above and in the same architecture domain
      return parentLevel === currentLevel - 1 && 
             (!architectureDomain || asset.architectureDomain === architectureDomain);
    });
  };

  // Submit handler
  const onSubmit = (values: AssetHierarchyFormValues) => {
    // Map the asset type to the corresponding hierarchy level
    const typeToHierarchyLevel: Record<string, string> = {
      "strategic_capability": "strategic_capability",
      "value_capability": "value_capability",
      "business_service": "business_service",
      "product_service": "business_service", // Business service level
      "application_service": "application_service",
      "technical_component": "technical_component"
    };
    
    // Add the hierarchyLevel field based on the selected type
    const hierarchyLevel = typeToHierarchyLevel[values.type] || "technical_component";
    
    // Create a complete asset object with all required fields
    const completeAsset = {
      ...values,
      hierarchyLevel,
      // Ensure dependencies is populated to avoid DB errors
      dependencies: []
    };
    
    createAssetMutation.mutate(completeAsset);
  };

  // Get human-readable type label
  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get hierarchy level (L1-L5) based on type
  const getHierarchyLevel = (type: string) => {
    switch (type) {
      case "strategic_capability": return "L1";
      case "value_capability": return "L2";
      case "business_service": 
      case "product_service": return "L3";
      case "application_service": return "L4";
      case "technical_component": return "L5";
      default: return "";
    }
  };
  
  // Watch the current selected type to update UI elements
  const selectedType = form.watch("type");
  const currentLevel = getHierarchyLevel(selectedType);
  const availableParents = getAvailableParents();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">Add New Hierarchy Asset</h2>
              <p className="text-sm text-muted-foreground">
                Create a new asset in the enterprise architecture hierarchy
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-primary/10">
              {currentLevel} Capability
            </Badge>
          </div>

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Reset parent when changing type
                    form.setValue("parentId", null);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strategic_capability">Strategic Capability (L1)</SelectItem>
                    <SelectItem value="value_capability">Value Capability (L2)</SelectItem>
                    <SelectItem value="business_service">Business Service (L3)</SelectItem>
                    <SelectItem value="product_service">Product Service (L3)</SelectItem>
                    <SelectItem value="application_service">Application Service (L4)</SelectItem>
                    <SelectItem value="technical_component">Technical Component (L5)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of asset in the enterprise architecture hierarchy
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={`${getTypeLabel(selectedType)} name`} {...field} />
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
                    placeholder={`Describe this ${getTypeLabel(selectedType)}`} 
                    className="resize-none" 
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
            name="architectureDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Architecture Domain</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Information Security, Data, Business" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Architecture domain this asset belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedType !== "strategic_capability" && (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Asset</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select parent ${currentLevel === "L2" ? "Strategic Capability" : currentLevel === "L3" ? "Value Capability" : currentLevel === "L4" ? "Business Service" : "Application Service"}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableParents.length === 0 ? (
                        <SelectItem value="no-parent" disabled>
                          No available parent assets
                        </SelectItem>
                      ) : (
                        availableParents.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()}>
                            {asset.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {currentLevel === "L2" ? "Select the Strategic Capability this Value Capability belongs to" :
                     currentLevel === "L3" ? "Select the Value Capability this Service belongs to" :
                     currentLevel === "L4" ? "Select the Business Service this Application Service supports" :
                     "Select the Application Service this Technical Component is part of"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated if empty" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Leave empty to auto-generate an ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={createAssetMutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createAssetMutation.isPending}
          >
            {createAssetMutation.isPending ? (
              <>
                <BarLoader />
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              "Create Asset"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function AssetHierarchyPage() {
  const [activeTab, setActiveTab] = useState("hierarchy");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch assets data
  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["/api/assets"],
  });

  // Process assets data to handle service response format
  const allAssets = useMemo(() => {
    const assets = assetsResponse?.data || [];
    
    // Filter assets to only include L1-L5 enterprise architecture items
    return assets.filter((asset: Asset) => {
      const typesToInclude = [
        "strategic_capability",   // L1
        "value_capability",       // L2
        "business_service",       // L3
        "product_service",        // L3
        "application_service",    // L4
        "technical_component"     // L5
      ];
      return typesToInclude.includes(asset.type);
    });
  }, [assetsResponse]);

  // Build the hierarchy tree
  const hierarchyTree = useMemo(() => {
    // Start with empty tree
    const tree: HierarchyNode[] = [];
    
    if (!allAssets || allAssets.length === 0) return tree;
    
    // First, map all assets by ID for quick lookup
    const assetMap = new Map<number, Asset>();
    allAssets.forEach(asset => {
      assetMap.set(asset.id, asset);
    });
    
    // Create a map to store nodes by ID
    const nodeMap = new Map<number, HierarchyNode>();
    
    // Initialize all nodes
    allAssets.forEach(asset => {
      nodeMap.set(asset.id, {
        id: asset.id,
        assetId: asset.assetId,
        name: asset.name,
        type: asset.type || 'other',
        hierarchyLevel: asset.hierarchyLevel || undefined,
        architectureDomain: asset.architectureDomain || undefined,
        children: []
      });
    });
    
    // Build the tree by adding children to their parents
    allAssets.forEach(asset => {
      if (asset.parentId) {
        const parentNode = nodeMap.get(asset.parentId);
        const currentNode = nodeMap.get(asset.id);
        
        if (parentNode && currentNode) {
          parentNode.children.push(currentNode);
        }
      } else {
        // Top-level assets (no parent)
        const node = nodeMap.get(asset.id);
        if (node) {
          tree.push(node);
        }
      }
    });
    
    return tree;
  }, [allAssets]);

  // Function to render a node and its children recursively
  const renderHierarchyNode = (node: HierarchyNode, level: number = 0) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'strategic_capability': return 'bg-purple-100 text-purple-800';
        case 'value_capability': return 'bg-indigo-100 text-indigo-800';
        case 'business_service': return 'bg-blue-100 text-blue-800';
        case 'application_service': return 'bg-teal-100 text-teal-800';
        case 'technical_component': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getLevelPrefix = (type: string) => {
      switch (type) {
        case 'strategic_capability': return 'L1';
        case 'value_capability': return 'L2';
        case 'business_service': return 'L3';
        case 'application_service': return 'L4';
        case 'technical_component': return 'L5';
        default: return '';
      }
    };

    const prefix = getLevelPrefix(node.type);
    const levelPadding = { paddingLeft: `${level * 24}px` };

    return (
      <div key={node.assetId} className="py-2">
        <div 
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition-colors"
          style={levelPadding}
        >
          {node.children.length > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          <div className="flex-1 flex items-center gap-2">
            <span className="font-medium text-white">{node.name}</span>
            <Badge variant="outline" className={`border-gray-600 text-gray-300 ${getTypeColor(node.type)}`}>
              {prefix && `${prefix} | `}{node.type.replace('_', ' ')}
            </Badge>
            {node.architectureDomain && (
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {node.architectureDomain}
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-400">{node.assetId}</div>
        </div>
        
        {node.children.length > 0 && (
          <div className="border-l-2 border-gray-600 ml-3">
            {node.children.map(child => renderHierarchyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Function to render the architecture domains visualization
  const renderDomainView = () => {
    // Group assets by architecture domain
    const domainGroups = new Map<string, Asset[]>();
    
    allAssets.forEach(asset => {
      const domain = asset.architectureDomain || 'Unspecified';
      if (!domainGroups.has(domain)) {
        domainGroups.set(domain, []);
      }
      domainGroups.get(domain)?.push(asset);
    });

    return Array.from(domainGroups.entries()).map(([domain, assets]) => (
      <div key={domain} className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{domain} Domain</h3>
          <p className="text-gray-300 text-sm mt-1">
            {assets.length} asset{assets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-2">
            {assets.map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
                <div>
                  <div className="font-medium text-white">{asset.name}</div>
                  <div className="text-xs text-gray-400">{asset.assetId}</div>
                </div>
                <Badge variant="outline" className="ml-auto border-gray-600 text-gray-300">
                  {asset.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create Hierarchy Asset</DialogTitle>
            <DialogDescription className="text-gray-300">
              Add a new asset to your enterprise architecture hierarchy
            </DialogDescription>
          </DialogHeader>
          <HierarchyAssetForm 
            allAssets={allAssets} 
            onClose={() => setIsFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hierarchy">Hierarchy Tree</TabsTrigger>
          <TabsTrigger value="domains">Architecture Domains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy">
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Enterprise Architecture Hierarchy</h3>
              <p className="text-gray-300 text-sm mt-1">
                Visualizing enterprise architecture capabilities and services:
                L1 (Strategic Capabilities) → L2 (Value Capabilities) → L3 (Business/Product Services)
              </p>
            </div>
            <div className="p-6">
              {isLoadingAssets ? (
                <div className="flex justify-center py-8">
                  <BarLoader />
                </div>
              ) : hierarchyTree.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Share2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>No hierarchical structure defined yet.</p>
                  <p className="text-sm">
                    Create assets with parent-child relationships to build your enterprise architecture hierarchy.
                  </p>
                </div>
              ) : (
                <div className="border border-gray-700 rounded-md">
                  {hierarchyTree.map(node => renderHierarchyNode(node))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="domains">
          <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Architecture Domains</h3>
              <p className="text-gray-300 text-sm mt-1">
                View assets grouped by their architecture domain
              </p>
            </div>
          </div>
          
          {isLoadingAssets ? (
            <div className="flex justify-center py-8">
              <BarLoader />
            </div>
          ) : (
            renderDomainView()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}