import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Risk } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCw, PlusCircle } from "lucide-react";
import { RiskList } from "@/components/risks/risk-list";
import { EnhancedAssetGroupedRiskList } from "@/components/risks/enhanced-asset-grouped-risk-list";
import { ViewToggle } from "@/components/risks/view-toggle";
import { RiskForm } from "@/components/risks";
import Layout from "@/components/layout/layout";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Risks() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('grouped');
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all risks
  const {
    data: risksResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/risks"],
  });

  // Fetch risk summary with trends
  const { data: summaryResponse } = useQuery({
    queryKey: ["/api/risks/summary"],
  });

  const summary = summaryResponse?.data || {
    stats: { total: 0, open: 0, mitigated: 0, high: 0 },
    trends: {
      total: { series: [], delta: "0% vs last month" },
      open: { series: [], delta: "0% vs last month" },
      mitigated: { series: [], delta: "0% vs last month" },
      high: { series: [], delta: "0% vs last month" }
    }
  };

  // Extract risks array from the API response and ensure it's always an array
  const allRisks = ((risksResponse as any)?.data || []) as Risk[];

  console.log("Loaded", allRisks.length, "total risks from the server");

  // Filter risks based on their type (only instances)
  const risks = React.useMemo(() => {
    return allRisks.filter((risk: Risk) => risk.itemType === 'instance' || !risk.itemType);
  }, [allRisks]);

  // Function to manually refresh risk data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      await refetch();
      toast({
        title: "Data refreshed",
        description: "The latest risk data has been loaded."
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

  // Log loaded risks data (only when initially loaded, prevent infinite loops)
  useEffect(() => {
    if (Array.isArray(risks) && risks.length > 0) {
      console.log(`Loaded ${risks.length} total risks from the server`);
    }
  }, [risks.length]); // Only trigger when the count changes, not the content

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

  const handleDelete = (risk: Risk) => {
    // This function is passed to child components for risk deletion
    // The actual deletion logic is handled within the risk list components
    console.log('Risk deletion initiated for:', risk.name);
  };




  if (isLoading) {
    return (
      <Layout pageTitle="Risk Register">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <GlowCard key={idx} compact className="h-[150px]">
                <div className="flex h-full flex-col justify-between">
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
      <Layout pageTitle="Risk Register">
        <GlowCard className="p-8 text-center text-white/80">
          <h2 className="text-xl font-semibold text-destructive">Error loading risks</h2>
          <p className="mt-2 text-muted-foreground">Please try again later or contact support.</p>
        </GlowCard>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle="Risk Register"
      pageDescription="FAIR-based insights into your top risk scenarios."
      pageActions={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-white/10 text-white hover:bg-white/5"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="rounded-full bg-primary px-5 text-primary-foreground" onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Risk
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Risks"
            value={summary.stats.total.toLocaleString()}
            delta={summary.trends.total.delta}
          />
          <KpiCard
            label="Critical/High"
            value={summary.stats.high.toLocaleString()}
            delta={summary.trends.high.delta}
            trendColor="#fca5a5"
          />
          <KpiCard
            label="Open"
            value={summary.stats.open.toLocaleString()}
            delta={summary.trends.open.delta}
            trendColor="#fdba74"
          />
          <KpiCard
            label="Mitigated"
            value={summary.stats.mitigated.toLocaleString()}
            delta={summary.trends.mitigated.delta}
            trendColor="#86efac"
          />
        </section>

        <GlowCard className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Risk Catalog</p>
              <h2 className="text-2xl font-semibold text-white">FAIR Register</h2>
              <p className="text-sm text-muted-foreground">Toggle views to analyze risks by asset or in a simple list.</p>
            </div>
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          </div>

          {!Array.isArray(risks) || risks.length === 0 ? (
            <div className="py-16 text-center text-white/70">
              <h3 className="text-xl font-semibold">No risks added</h3>
              <p className="mt-2 text-sm text-white/50">Use “Add Risk” to capture your first FAIR scenario.</p>
            </div>
          ) : viewMode === "grouped" ? (
            <EnhancedAssetGroupedRiskList risks={risks} onRiskEdit={handleEdit} onRiskDelete={handleDelete} />
          ) : (
            <RiskList risks={risks} onEdit={handleEdit} />
          )}
        </GlowCard>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="h-[92vh] w-[96vw] max-w-[96vw] overflow-y-auto rounded-[32px] border-white/10 bg-[#040b1c]/95">
            <DialogHeader>
              <DialogTitle>{selectedRisk ? "Edit Risk" : "Create New Risk"}</DialogTitle>

            </DialogHeader>
            <RiskForm
              risk={selectedRisk}
              onClose={handleClose}
              variant={selectedRisk ? "concept" : "default"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
