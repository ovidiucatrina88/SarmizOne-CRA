import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { AssetList } from "@/components/assets/asset-list";
import { AssetForm } from "@/components/assets/asset-form";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

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


  const stats = useMemo(() => {
    const total = assets.length;
    const active = assets.filter((asset) => asset.status === "Active").length;
    const apps = assets.filter((asset) => asset.type === "application" || asset.type === "application_service").length;
    const totalValue = assets.reduce((sum, asset) => {
      const value = typeof asset.assetValue === "number" ? asset.assetValue : parseFloat(asset.assetValue || "0");
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return { total, active, apps, totalValue };
  }, [assets]);

  const generateSeries = (seed: number) => {
    const base = seed || 20;
    return Array.from({ length: 7 }).map((_, index) =>
      Number((base * (1 + Math.sin(index / 1.3) * 0.08)).toFixed(2)),
    );
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Asset Inventory" pageDescription="Manage your organization's assets, architecture, and risk posture.">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <GlowCard key={idx} compact className="h-[150px]">
                <div className="flex h-full flex-col justify-between space-y-3">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded" />
                  <Skeleton className="h-5 w-full rounded-full" />
                </div>
              </GlowCard>
            ))}
          </div>
          <GlowCard className="p-8">
            <Skeleton className="h-96 w-full rounded-[32px]" />
          </GlowCard>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout pageTitle="Asset Inventory">
        <GlowCard className="p-8 text-center">
          <h2 className="text-xl font-bold text-destructive">Error loading assets</h2>
          <p className="mt-2 text-muted-foreground">Please try again later or contact support.</p>
        </GlowCard>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle="Asset Inventory"
      pageDescription="Monitor enterprise assets, architecture layers, and ownership context."
      pageActions={
        <Button onClick={handleCreateNew} className="rounded-full bg-primary px-5 py-2 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Asset
        </Button>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Assets"
            value={stats.total.toLocaleString()}
            delta="+3% vs last month"
            trendSeries={generateSeries(stats.total || 20)}
          />
          <KpiCard
            label="Active Assets"
            value={stats.active.toLocaleString()}
            delta="+5% vs last month"
            trendSeries={generateSeries(stats.active || 15)}
            trendColor="#93c5fd"
          />
          <KpiCard
            label="Application Services"
            value={stats.apps.toLocaleString()}
            delta="+2 onboarding"
            trendSeries={generateSeries(stats.apps || 10)}
            trendColor="#c4b5fd"
          />
          <KpiCard
            label="Portfolio Value"
            value={formatCurrency(stats.totalValue)}
            delta="+$1.2M YoY"
            trendSeries={generateSeries(Math.max(stats.totalValue / 1_000_000, 5))}
            trendColor="#fef08a"
          />
        </section>

        <GlowCard className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Catalog</p>
            <h2 className="text-2xl font-semibold text-white">Asset Explorer</h2>
            <p className="text-sm text-muted-foreground">
              Search, filter, and curate enterprise assets with ownership context.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full border-white/20 bg-white/5 text-white">
              Export CSV
            </Button>
            <Button onClick={handleCreateNew} className="rounded-full bg-primary px-5 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </GlowCard>

        {!Array.isArray(assets) || assets.length === 0 ? (
          <GlowCard className="py-16 text-center text-white/70">
            <h3 className="text-xl font-semibold">No assets found</h3>
            <p className="mt-2 text-sm text-muted-foreground">Use the “Add Asset” button to create your first record.</p>
          </GlowCard>
        ) : (
          <AssetList assets={assets} onEdit={handleEdit} />
        )}

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
            <DialogHeader>
              <DialogTitle>{selectedAsset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
            </DialogHeader>
            <AssetForm asset={selectedAsset} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
