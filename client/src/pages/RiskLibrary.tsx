import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Risk, RiskLibraryItem, Asset } from "@shared/schema";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { RiskForm } from "@/components/risks";
import { Search, PlusCircle, RefreshCw, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const severityTone: Record<string, string> = {
  critical: "border-red-400/30 bg-red-500/10 text-red-100",
  high: "border-orange-400/30 bg-orange-500/10 text-orange-100",
  medium: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  low: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
};

const categoryPalette: Record<string, string> = {
  operational: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  strategic: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  compliance: "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
  financial: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
};

export default function RiskLibrary() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: templatesResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["/api/risk-library"],
    queryFn: async () => {
      const response = await fetch("/api/risk-library");
      if (!response.ok) throw new Error("Failed to fetch risk templates");
      return response.json();
    },
  });

  const riskTemplates: RiskLibraryItem[] = useMemo(
    () => (templatesResponse?.data ? (templatesResponse.data as RiskLibraryItem[]) : []),
    [templatesResponse],
  );

  const filteredTemplates = useMemo(() => {
    return riskTemplates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.riskId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || template.riskCategory === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [riskTemplates, searchQuery, filterCategory]);

  const filteredCount = filteredTemplates.length;

  const stats = useMemo(() => {
    const total = riskTemplates.length;
    const critical = riskTemplates.filter((template) => template.severity === "critical").length;
    const operational = riskTemplates.filter((template) => template.riskCategory === "operational").length;
    const coverage = total ? Math.round((critical / total) * 100) : 0;
    return { total, critical, operational, coverage };
  }, [riskTemplates]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/risk-library"] });
      await refetch();
      toast({ title: "Data refreshed", description: "Latest risk templates loaded." });
    } catch {
      toast({
        title: "Refresh failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    template: RiskLibraryItem | null;
  }>({ isOpen: false, template: null });

  const handleDelete = (template: RiskLibraryItem) => {
    setDeleteConfirmDialog({ isOpen: true, template });
  };

  const confirmDelete = async () => {
    const template = deleteConfirmDialog.template;
    if (!template) return;
    try {
      const response = await fetch(`/api/risk-library/${template.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to delete risk template");
      queryClient.invalidateQueries({ queryKey: ["/api/risk-library"] });
      toast({ title: "Template deleted", description: "Risk template removed from library." });
    } catch (err: any) {
      toast({
        title: "Error deleting template",
        description: err.message || "Failed to delete risk template",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmDialog({ isOpen: false, template: null });
    }
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedRisk(null);
  };

  const [isAssetSelectionOpen, setIsAssetSelectionOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RiskLibraryItem | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState("");

  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["/api/assets"],
    enabled: isAssetSelectionOpen,
  });

  const assets: Asset[] = useMemo(
    () => (assetsResponse?.data ? (assetsResponse.data as Asset[]) : []),
    [assetsResponse],
  );

  const createRiskFromTemplateMutation = useMutation({
    mutationFn: async (data: { templateId: number; assetId: string }) => {
      const response = await fetch(`/api/risk-library/from-template/${data.templateId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: data.assetId }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Failed to create risk from template");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      toast({ title: "Risk created", description: "New risk instance created from template." });
      handleCloseAssetSelection();
      const targetId = data?.riskId || data?.id;
      if (targetId) navigate(`/risks/${targetId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating risk",
        description: error.message || "Failed to create risk from template",
        variant: "destructive",
      });
    },
  });

  const handleApplyTemplate = (template: RiskLibraryItem) => {
    setSelectedTemplate(template);
    setSelectedAssetId(null);
    setIsAssetSelectionOpen(true);
  };

  const handleConfirmAssetSelection = () => {
    if (!selectedTemplate || !selectedAssetId) {
      toast({
        title: "Selection required",
        description: "Choose an asset for the new risk instance.",
        variant: "destructive",
      });
      return;
    }
    createRiskFromTemplateMutation.mutate({
      templateId: selectedTemplate.id,
      assetId: selectedAssetId,
    });
  };

  const handleCloseAssetSelection = () => {
    setIsAssetSelectionOpen(false);
    setSelectedTemplate(null);
    setSelectedAssetId(null);
  };

  const pageDescription = "Curate reusable risk templates and instantiate them against critical assets instantly.";
  const pageActions = (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="rounded-full border border-white/10 text-white hover:bg-white/10"
        onClick={handleRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
      <Button className="rounded-full bg-primary px-5 text-primary-foreground" onClick={() => setIsCreateModalOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Template
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <Layout pageTitle="Risk Library" pageDescription={pageDescription} pageActions={pageActions}>
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <GlowCard key={idx} compact className="border-white/10">
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-[12px]" />
                  <Skeleton className="h-4 w-20 rounded-full" />
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
      <Layout pageTitle="Risk Library" pageDescription={pageDescription} pageActions={pageActions}>
        <GlowCard className="p-10 text-center text-white/80">
          <h2 className="text-2xl font-semibold text-destructive">Unable to load risk templates</h2>
          <p className="mt-2 text-white/60">Please try again later or contact support.</p>
          <Button onClick={handleRefresh} className="mt-4 rounded-full">
            Retry
          </Button>
        </GlowCard>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Risk Library" pageDescription={pageDescription} pageActions={pageActions}>
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Templates" value={stats.total.toLocaleString()} delta={`${filteredCount} in view`} />
          <KpiCard
            label="Critical Exposure"
            value={stats.critical.toLocaleString()}
            delta="Top severity"
            trendColor="#fda4af"
          />
          <KpiCard
            label="Operational Coverage"
            value={stats.operational.toLocaleString()}
            delta="Operational category"
            trendColor="#c4b5fd"
          />
          <KpiCard
            label="Severity Coverage"
            value={`${stats.coverage}%`}
            delta="Critical severity share"
            trendColor="#86efac"
          />
        </section>

        <GlowCard className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Filters</p>
              <p className="text-lg font-semibold text-white">Refine templates by category or severity</p>
            </div>
            <div className="text-sm text-white/60">
              {filteredCount} of {riskTemplates.length} templates
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search risk templates..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="h-11 rounded-full border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-slate-900 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </GlowCard>

        <GlowCard className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Templates</p>
              <p className="text-lg font-semibold text-white">Reusable scenarios</p>
            </div>
            <div className="text-sm text-white/60">{filteredCount} templates shown</div>
          </div>
          {!filteredCount ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center text-white/60">
              No risk templates match your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-5 transition hover:bg-white/[0.07]"
                >
                  <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center">
                    <div>
                      <p className="text-sm font-semibold text-white">{template.name}</p>
                      <p className="text-xs uppercase tracking-wide text-white/40 mt-1">ID: {template.riskId}</p>
                      <p className="mt-2 text-sm text-white/70 line-clamp-2">
                        {template.description || "No description available"}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={`rounded-full border px-3 py-0.5 text-xs capitalize ${
                          categoryPalette[template.riskCategory || ""] || "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        {template.riskCategory || "General"}
                      </Badge>
                      <Badge
                        className={`rounded-full border px-3 py-0.5 text-xs capitalize ${
                          severityTone[template.severity || "medium"]
                        }`}
                      >
                        {template.severity || "Medium"}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-white/70">
                      <span>Template status</span>
                      <Badge className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white">
                        Ready
                      </Badge>
                    </div>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                        onClick={() => {
                          setSelectedRisk(template as any);
                          setIsCreateModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                        onClick={() => handleDelete(template)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
                        onClick={() => handleApplyTemplate(template)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Risk
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlowCard>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-[32px] border-white/10 bg-[#040b1c]/95">
          <DialogHeader>
            <DialogTitle>{selectedRisk ? "Edit Risk Template" : "Create Risk Template"}</DialogTitle>
          </DialogHeader>
          <RiskForm risk={selectedRisk} onClose={handleClose} isTemplate />
        </DialogContent>
      </Dialog>

      <Dialog open={isAssetSelectionOpen} onOpenChange={setIsAssetSelectionOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Select Asset</DialogTitle>
            <DialogDescription className="text-white/70">
              Choose an asset for the template <span className="font-semibold text-white">{selectedTemplate?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-white/40" />
            <Input
              placeholder="Search assets..."
              value={assetSearchQuery}
              onChange={(event) => setAssetSearchQuery(event.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>
          <div className="mt-4">
            {isLoadingAssets ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            ) : (
              <ScrollArea className="max-h-[360px] pr-2">
                <div className="space-y-3">
                  {assets
                    .filter(
                      (asset) =>
                        asset.name.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                        asset.assetId.toLowerCase().includes(assetSearchQuery.toLowerCase()),
                    )
                    .map((asset) => (
                      <button
                        key={asset.assetId}
                        type="button"
                        className={`w-full rounded-[24px] border border-white/10 p-4 text-left transition ${
                          selectedAssetId === asset.assetId ? "border-white/40 bg-white/10" : "bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={() => setSelectedAssetId(asset.assetId)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">{asset.name}</p>
                            <p className="text-xs uppercase tracking-wide text-white/40">ID: {asset.assetId}</p>
                          </div>
                          <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                            {asset.type}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  {!assets.length && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/60">
                      No assets available.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10" onClick={handleCloseAssetSelection}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-primary px-6 text-primary-foreground disabled:opacity-50"
              onClick={handleConfirmAssetSelection}
              disabled={createRiskFromTemplateMutation.isPending || !selectedAssetId}
            >
              {createRiskFromTemplateMutation.isPending ? "Creating..." : "Create Risk"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmDialog.isOpen} onOpenChange={(open) => setDeleteConfirmDialog({ isOpen: open, template: open ? deleteConfirmDialog.template : null })}>
        <DialogContent className="rounded-[28px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Delete Risk Template</DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to delete “{deleteConfirmDialog.template?.name}”? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10" onClick={() => setDeleteConfirmDialog({ isOpen: false, template: null })}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-full" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
