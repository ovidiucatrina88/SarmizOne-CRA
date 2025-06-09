import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Risk, Asset } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { RiskList } from "@/components/risks/risk-list";
import { RiskForm } from "@/components/risks/risk-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RiskLibrary() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssetSelectionOpen, setIsAssetSelectionOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [templateIdForAssetSelection, setTemplateIdForAssetSelection] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  // Fetch all risk templates from the library
  const { data: riskTemplatesResponse, isLoading: isLoadingTemplates, error: errorTemplates } = useQuery({
    queryKey: ["/api/risk-library"],
  });

  // Extract risk templates from API response
  const riskTemplates = React.useMemo(() => {
    if (riskTemplatesResponse?.data && Array.isArray(riskTemplatesResponse.data)) {
      return riskTemplatesResponse.data;
    }
    if (Array.isArray(riskTemplatesResponse)) {
      return riskTemplatesResponse;
    }
    return [];
  }, [riskTemplatesResponse]);
  
  // Fetch all assets for selection
  const { data: assetsResponse, isLoading: isLoadingAssets, error: errorAssets } = useQuery({
    queryKey: ["/api/assets"],
    // Only fetch assets when asset selection dialog is open
    enabled: isAssetSelectionOpen,
  });

  // Extract assets from API response
  const assets = React.useMemo(() => {
    if (assetsResponse?.data && Array.isArray(assetsResponse.data)) {
      return assetsResponse.data;
    }
    if (Array.isArray(assetsResponse)) {
      return assetsResponse;
    }
    return [];
  }, [assetsResponse]);

  const handleCreateNew = () => {
    setSelectedRisk(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsCreateModalOpen(true);
  };

  // Mutation for creating a risk instance from a template
  const createFromTemplateMutation = useMutation({
    mutationFn: async ({ templateId, assetId }: { templateId: number, assetId: string }) => {
      return apiRequest("POST", `/api/risk-library/${templateId}/create-instance`, { assetId });
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      
      toast({
        title: "Success",
        description: "Risk assigned to asset successfully",
      });
      
      // Close the asset selection dialog
      setIsAssetSelectionOpen(false);
      
      // Navigate to the risks page to see the new instance
      setLocation("/risks");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to assign risk to asset: ${error.message}`,
        variant: "destructive",
      });
      
      // Close the asset selection dialog on error as well
      setIsAssetSelectionOpen(false);
    },
  });

  const handleOpenAssetSelection = (templateId: number) => {
    setTemplateIdForAssetSelection(templateId);
    setSelectedAssetId("");
    setIsAssetSelectionOpen(true);
  };
  
  const handleAssignRiskToAsset = () => {
    if (templateIdForAssetSelection && selectedAssetId) {
      createFromTemplateMutation.mutate({ 
        templateId: templateIdForAssetSelection, 
        assetId: selectedAssetId 
      });
    } else {
      toast({
        title: "Error",
        description: "Please select an asset first",
        variant: "destructive",
      });
    }
  };
  
  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedRisk(null);
  };

  if (isLoadingTemplates) {
    return (
      
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6">
              <Skeleton className="h-8 w-full mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      
    );
  }

  if (errorTemplates) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Error loading risk templates</h2>
          <p className="mt-2 text-gray-400">Please try again later or contact support.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 bg-gray-900 min-h-screen text-white">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Risk Library</h1>
            <p className="text-gray-400">Manage risk templates and create risk instances</p>
          </div>
          <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Risk Template
        </Button>
      }
    >
      {/* Risk Templates List */}
      <RiskList 
        risks={riskTemplates || []} 
        onEdit={handleEdit} 
        isTemplateView={true}
        onCreateFromTemplate={handleOpenAssetSelection}
      />
      
      {/* Risk Template Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedRisk ? "Edit Risk Template" : "Add New Risk Template"}
            </DialogTitle>
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
        <DialogContent className="bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Select Asset for Risk Assignment</DialogTitle>
            <DialogDescription className="text-gray-400">
              Choose an asset to assign this risk to
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingAssets ? (
            <div className="py-6">
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2 text-gray-300">Loading assets...</span>
              </div>
            </div>
          ) : errorAssets ? (
            <div className="py-6 text-center text-red-500">
              Error loading assets. Please try again.
            </div>
          ) : (
            <>
              <div className="py-4">
                <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {assets && assets.length > 0 ? (
                      assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.assetId} className="text-white hover:bg-gray-600">
                          {asset.name} ({asset.assetId})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-assets" disabled className="text-gray-400">
                        No assets available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAssetSelectionOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAssignRiskToAsset}
                  disabled={!selectedAssetId || createFromTemplateMutation.isPending}
                >
                  {createFromTemplateMutation.isPending ? "Assigning..." : "Assign Risk"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}