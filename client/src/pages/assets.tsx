import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { AssetList } from "@/components/assets/asset-list";
import { AssetForm } from "@/components/assets/asset-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";

export default function Assets() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Parse URL parameters
  const [, params] = useRoute('/assets');
  const queryParams = new URLSearchParams(window.location.search);
  const selectForRiskId = queryParams.get('selectForRisk');

  // Fetch all assets
  const { data: assetsResponse, isLoading, error } = useQuery<{ success: boolean; data: Asset[] }>({
    queryKey: ["/api/assets"],
  });
  
  // Extract the assets array from the API response
  const assets = assetsResponse?.data || [];

  // Check if we need to handle risk template selection
  useEffect(() => {
    if (selectForRiskId && assets?.length > 0) {
      // Show a toast to inform the user what to do
      toast({
        title: "Select an asset",
        description: "Please select an asset to associate with this risk template",
      });
    }
  }, [selectForRiskId, assets, toast]);

  const handleCreateNew = () => {
    setSelectedAsset(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsCreateModalOpen(true);
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedAsset(null);
  };


  if (isLoading) {
    return (
      <div className="space-y-4">
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
          <h2 className="text-xl font-bold text-red-500">Error loading assets</h2>
          <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
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
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Asset
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="bg-gray-800 rounded-lg border border-gray-600">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">Asset Management</h3>
              <p className="text-sm text-gray-300 mt-1">Manage your organization's digital assets and their risk profiles</p>
            </div>

            {/* Assets Display */}
            <div className="bg-gray-800 p-6 rounded-b-lg">
              {!Array.isArray(assets) || assets.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2 text-white">No Assets Found</h3>
                  <p className="text-gray-400 mb-4">
                    Click "Add New Asset" to create your first asset.
                  </p>
                </div>
              ) : (
                <AssetList assets={assets} onEdit={handleEdit} />
              )}
            </div>
          </div>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            <DialogHeader>
              <DialogTitle>
                {selectedAsset ? "Edit Asset" : "Add New Asset"}
              </DialogTitle>
            </DialogHeader>
            <AssetForm asset={selectedAsset} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
