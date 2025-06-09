import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Risk, RiskLibraryItem, Asset } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { RefreshCw, PlusCircle, Plus, Search } from "lucide-react";
import { RiskList } from "@/components/risks/risk-list";
import { RiskForm } from "@/components/risks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import Layout from "@/components/layout/layout";

export default function RiskLibrary() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch risk templates from the risk_library table
  const {
    data: templatesResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/risks", "templates"],
    queryFn: async () => {
      const response = await fetch('/api/risk-library');
      if (!response.ok) {
        throw new Error('Failed to fetch risk templates');
      }
      return response.json();
    }
  });
  
  // Extract risk templates from API response - use only the new service architecture format
  const riskTemplates = React.useMemo(() => {
    // In the new service architecture, responses always have a data property
    return templatesResponse?.data ? templatesResponse.data as RiskLibraryItem[] : [];
  }, [templatesResponse]);
  
  // Function to manually refresh risk library data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/risk-library"] });
      await refetch();
      toast({
        title: "Data refreshed",
        description: "The latest risk library data has been loaded."
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedRisk(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsCreateModalOpen(true);
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedRisk(null);
  };

  // State for asset selection dialog
  const [isAssetSelectionOpen, setIsAssetSelectionOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RiskLibraryItem | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState("");

  // Fetch all assets (for the asset selection dialog)
  const { data: assetsResponse, isLoading: isLoadingAssets, refetch: refetchAssets } = useQuery({
    queryKey: ["/api/assets"],
    // Always fetch assets to ensure they're available when needed
    enabled: true,
  });

  // Process assets data - use only the new service architecture format
  const assets = React.useMemo(() => {
    // In the new service architecture, responses always have a data property
    return assetsResponse?.data ? assetsResponse.data as Asset[] : [];
  }, [assetsResponse]);

  // Mutation for creating a risk instance from template
  const createRiskFromTemplateMutation = useMutation({
    mutationFn: async (data: { templateId: number; assetId: string }) => {
      // Updated to correct endpoint path
      const response = await fetch(`/api/risk-library/from-template/${data.templateId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assetId: data.assetId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create risk from template');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      
      toast({
        title: "Risk created successfully",
        description: "A new risk instance has been created from the template."
      });
      
      // Close the dialog and navigate to the new risk
      handleCloseAssetSelection();
      
      if (data?.riskId) {
        navigate(`/risks/${data.riskId}`);
      } else if (data?.id) {
        // Fallback to ID if riskId is not available (though it should be)
        navigate(`/risks/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error creating risk",
        description: error.message || "Failed to create risk from template",
        variant: "destructive"
      });
    }
  });

  // Close the asset selection dialog
  const handleCloseAssetSelection = () => {
    setIsAssetSelectionOpen(false);
    setSelectedTemplate(null);
    setSelectedAssetId(null);
  };
  
  // Handler for confirming the asset selection
  const handleConfirmAssetSelection = () => {
    if (!selectedAssetId || !selectedTemplate) {
      toast({
        title: "Selection required",
        description: "Please select an asset to assign the risk to.",
        variant: "destructive"
      });
      return;
    }
    
    createRiskFromTemplateMutation.mutate({
      templateId: selectedTemplate.id,
      assetId: selectedAssetId
    });
  };

  // Function to handle template selection and open asset dialog
  const handleApplyTemplate = (template: RiskLibraryItem) => {
    setSelectedTemplate(template);
    setSelectedAssetId(null);
    setIsAssetSelectionOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Card>
          <div className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading risk library</h2>
        <p className="mt-2 text-gray-600">
          Please try again later or contact support.
        </p>
      </div>
    );
  }
  
  return (
    <Layout>
      <div>
      <div className="mb-6 flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Risk to Library
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="ml-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-600">
          {/* Search and Filter Controls */}
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search risk templates..."
                  className="w-full pl-8 bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
                  <SelectItem value="operational" className="text-white hover:bg-gray-600">Operational</SelectItem>
                  <SelectItem value="strategic" className="text-white hover:bg-gray-600">Strategic</SelectItem>
                  <SelectItem value="compliance" className="text-white hover:bg-gray-600">Compliance</SelectItem>
                  <SelectItem value="financial" className="text-white hover:bg-gray-600">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-0">
            {!Array.isArray(riskTemplates) || riskTemplates.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">No Risk Templates Available</div>
                <p className="text-gray-500 mb-4">Click "Add New Template" to create a new risk template.</p>
              </div>
            ) : (
              <>
                {/* Grid Header */}
                <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
                  <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div>Risk Information</div>
                    <div>Category & Severity</div>
                    <div>Risk Details</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                </div>
                
                {/* Risk template rows */}
                <div className="divide-y divide-gray-600">
                  {riskTemplates
                    .filter((template) => {
                      const matchesSearch = 
                        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.riskId.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesCategory = filterCategory === "all" || template.riskCategory === filterCategory;
                      return matchesSearch && matchesCategory;
                    })
                    .map((template) => {
                      const getSeverityColor = (severity: string) => {
                        switch(severity) {
                          case 'critical': return 'bg-red-100 text-red-800 border-red-200';
                          case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
                          case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          case 'low': return 'bg-green-100 text-green-800 border-green-200';
                          default: return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };

                      const getCategoryColor = (category: string) => {
                        switch(category) {
                          case 'operational': return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'strategic': return 'bg-purple-100 text-purple-800 border-purple-200';
                          case 'compliance': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                          case 'financial': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
                          default: return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };
                      
                      return (
                        <div key={template.id} className="px-6 py-4 hover:bg-gray-700 transition-colors">
                          <div className="grid grid-cols-5 gap-4 items-center">
                            {/* Risk Information */}
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                                  <span className="text-xs font-medium text-gray-200">RSK</span>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-white text-sm">{template.name}</div>
                                <div className="text-xs text-gray-400">ID: {template.riskId}</div>
                              </div>
                            </div>

                            {/* Category & Severity */}
                            <div>
                              <div className="mb-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(template.riskCategory || 'operational')}`}>
                                  {(template.riskCategory || 'operational').charAt(0).toUpperCase() + (template.riskCategory || 'operational').slice(1)}
                                </span>
                              </div>
                              <div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(template.severity || 'medium')}`}>
                                  {(template.severity || 'medium').charAt(0).toUpperCase() + (template.severity || 'medium').slice(1)}
                                </span>
                              </div>
                            </div>

                            {/* Risk Details */}
                            <div>
                              <div className="text-sm text-gray-300 truncate">
                                {template.description || 'No description available'}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                Template
                              </div>
                            </div>

                            {/* Status */}
                            <div>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-green-100 text-green-800 border-green-200">
                                Active
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(template)}
                                className="border-gray-500 text-gray-300 hover:bg-gray-600"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleApplyTemplate(template)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Create Risk
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Risk Form Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRisk ? "Edit Risk Template" : "Create New Risk Template"}</DialogTitle>
          </DialogHeader>
          <RiskForm 
            risk={selectedRisk} 
            onClose={handleClose}
            isTemplate={true}
          />
        </DialogContent>
      </Dialog>
      
      {/* Asset Selection Dialog */}
      <Dialog open={isAssetSelectionOpen} onOpenChange={setIsAssetSelectionOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Asset for Risk</DialogTitle>
            <DialogDescription>
              Choose an asset to apply the risk template <strong>{selectedTemplate?.name}</strong> to.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center mb-4">
              <Search className="mr-2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search assets..." 
                className="flex-1"
                value={assetSearchQuery}
                onChange={(e) => setAssetSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoadingAssets ? (
              <div className="py-8 text-center">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : assets && assets.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {assets
                    .filter(asset => 
                      asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                      asset.assetId.toLowerCase().includes(assetSearchQuery.toLowerCase())
                    )
                    .map(asset => (
                      <div 
                        key={asset.id} 
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          selectedAssetId === asset.assetId 
                            ? 'border-primary bg-primary/10' 
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setSelectedAssetId(asset.assetId)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{asset.name}</h4>
                            <p className="text-sm text-muted-foreground">ID: {asset.assetId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                              {asset.type}
                            </span>
                            {selectedAssetId === asset.assetId && (
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {assets.filter(asset => 
                    asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                    asset.assetId.toLowerCase().includes(assetSearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      No assets matching your search. Try a different search term.
                    </div>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p className="mb-2">Loading assets or no assets found. Please try refreshing.</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
                    toast({
                      title: "Refreshing assets",
                      description: "Attempting to reload the asset list."
                    });
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Assets
                </Button>
              </div>
            )}
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleCloseAssetSelection}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmAssetSelection}
                disabled={createRiskFromTemplateMutation.isPending || !selectedAssetId}
              >
                {createRiskFromTemplateMutation.isPending ? "Creating..." : "Create Risk"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}