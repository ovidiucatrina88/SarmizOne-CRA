import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarLoader } from "@/components/ui/barloader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnterpriseHierarchyForm } from "@/components/enterprise/enterprise-hierarchy-form";

// Define a node in the hierarchy tree
interface EnterpriseNode {
  id: number;
  assetId: string;
  name: string;
  level: string;
  type: string;
  architectureDomain?: string;
  children: EnterpriseNode[];
}

export default function EnterpriseArchitecturePage() {
  const [activeTab, setActiveTab] = useState("hierarchy");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch enterprise architecture data
  const { data: enterpriseResponse, isLoading: isLoadingEnterprise } = useQuery({
    queryKey: ["/api/enterprise-architecture"],
  });

  // Process enterprise architecture data to handle different response formats
  const allEnterpriseItems = useMemo(() => {
    // Check for standard API response format
    if (enterpriseResponse?.data && Array.isArray(enterpriseResponse.data)) {
      return enterpriseResponse.data;
    }
    // Check for direct array response
    if (Array.isArray(enterpriseResponse)) {
      return enterpriseResponse;
    }
    // Handle unexpected response format safely
    if (enterpriseResponse && typeof enterpriseResponse === 'object') {
      const data = (enterpriseResponse as any).data;
      if (Array.isArray(data)) {
        return data;
      }
    }
    // Default to empty array
    return [];
  }, [enterpriseResponse]);

  // Build the hierarchy tree
  const hierarchyTree = useMemo(() => {
    // Start with empty tree
    const tree: EnterpriseNode[] = [];
    
    if (!allEnterpriseItems || allEnterpriseItems.length === 0) return tree;
    
    // First, map all items by ID for quick lookup
    const itemMap = new Map<number, any>();
    allEnterpriseItems.forEach((item: any) => {
      itemMap.set(item.id, item);
    });
    
    // Create a map to store nodes by ID
    const nodeMap = new Map<number, EnterpriseNode>();
    
    // Initialize all nodes
    allEnterpriseItems.forEach((item: any) => {
      nodeMap.set(item.id, {
        id: item.id,
        assetId: item.assetId || "",
        name: item.name || "",
        level: item.level || "",
        type: item.type || "",
        architectureDomain: item.architectureDomain,
        children: []
      });
    });
    
    // Build the tree by adding children to their parents
    allEnterpriseItems.forEach((item: any) => {
      if (item.parentId) {
        const parentNode = nodeMap.get(item.parentId);
        const currentNode = nodeMap.get(item.id);
        
        if (parentNode && currentNode) {
          parentNode.children.push(currentNode);
        }
      } else {
        // Top-level items (no parent)
        const node = nodeMap.get(item.id);
        if (node) {
          tree.push(node);
        }
      }
    });
    
    return tree;
  }, [allEnterpriseItems]);

  // Determine the badge color for different types
  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "strategic_capability": return "default";
      case "value_capability": return "secondary";
      case "business_service": return "outline";
      case "product_service": return "outline";
      default: return "outline";
    }
  };

  // Get level badge text
  const getLevelBadge = (level: string) => {
    switch (level) {
      case "L1": return "Strategic Capability";
      case "L2": return "Value Capability";
      case "L3": return "Business Service";
      default: return level;
    }
  };

  // Recursive function to render hierarchy nodes
  const renderHierarchyNode = (node: EnterpriseNode) => {
    return (
      <div key={node.id} className="py-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{node.name}</span>
              <Badge className="ml-2" variant={getTypeBadgeVariant(node.type)}>
                {node.level}
              </Badge>
              {node.architectureDomain && (
                <Badge variant="outline" className="ml-2">
                  {node.architectureDomain}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {node.assetId} · {getLevelBadge(node.level)}
            </div>
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="pl-5 mt-2 border-l">
            {node.children.map(childNode => renderHierarchyNode(childNode))}
          </div>
        )}
      </div>
    );
  };

  // Group items by architecture domain for domain view
  const domainGroups = useMemo(() => {
    const groups: Record<string, EnterpriseNode[]> = {};
    
    allEnterpriseItems.forEach((item: any) => {
      const domain = item.architectureDomain || "Uncategorized";
      if (!groups[domain]) {
        groups[domain] = [];
      }
      
      const node: EnterpriseNode = {
        id: item.id,
        assetId: item.assetId || "",
        name: item.name || "",
        level: item.level || "",
        type: item.type || "",
        architectureDomain: item.architectureDomain,
        children: []
      };
      
      groups[domain].push(node);
    });
    
    return groups;
  }, [allEnterpriseItems]);

  return (
    <div>
      <div className="mb-6">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Architecture Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add Enterprise Architecture Item</DialogTitle>
            </DialogHeader>
            <EnterpriseHierarchyForm onClose={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingEnterprise ? (
        <div className="bg-gray-800 rounded-lg border border-gray-600 mt-4">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4"><BarLoader /></div>
            <p className="text-gray-400">Loading enterprise architecture data...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="hierarchy" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="hierarchy">Hierarchy Tree</TabsTrigger>
            <TabsTrigger value="domains">Architecture Domains</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hierarchy">
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">Enterprise Architecture Hierarchy</h3>
                <p className="text-gray-400">
                  Visualizing enterprise architecture capabilities and services:
                  L1 (Strategic Capabilities) → L2 (Value Capabilities) → L3 (Business/Product Services)
                </p>
              </div>
              <div className="p-6">
                {hierarchyTree.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Share2 className="mx-auto h-12 w-12 opacity-20 mb-2" />
                    <p>No enterprise architecture hierarchy defined yet.</p>
                    <p className="text-sm">
                      Create Strategic Capabilities (L1), Value Capabilities (L2), and Business Services (L3) to build your hierarchy.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add First Capability
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hierarchyTree.map(node => renderHierarchyNode(node))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="domains">
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white">Architecture Domains</h3>
                <p className="text-gray-400">
                  View enterprise architecture capabilities and services grouped by domain
                </p>
              </div>
              <div className="p-6">
                {Object.keys(domainGroups).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No architecture domains defined yet.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setIsFormOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(domainGroups).map(([domain, items]) => (
                      <div key={domain} className="space-y-2">
                        <h3 className="text-lg font-semibold">{domain}</h3>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {items.map(item => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <CardTitle className="text-base">{item.name}</CardTitle>
                                  <Badge variant={getTypeBadgeVariant(item.type)}>
                                    {item.level}
                                  </Badge>
                                </div>
                                <CardDescription className="text-xs">
                                  {item.assetId} · {getLevelBadge(item.level)}
                                </CardDescription>
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}