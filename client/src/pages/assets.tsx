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

  const pageActions = (
    <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add New Asset
    </Button>
  );

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
    <Layout
      pageTitle="Asset Management"
      pageDescription="Manage your organization's digital assets and their risk profiles"
      pageActions={pageActions}
    >
      <div>
        <AssetList assets={assets} onEdit={handleEdit} />

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-6xl w-full">
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
