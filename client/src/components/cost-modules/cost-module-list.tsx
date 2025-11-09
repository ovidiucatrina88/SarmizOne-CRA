import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, DollarSign, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CostModuleForm } from "./cost-module-form";

type CostType = "fixed" | "per_event" | "per_hour" | "percentage";

interface CostModule {
  id: number;
  name: string;
  cis_control?: string[];
  cisControl?: string[];
  cost_factor?: number;
  costFactor?: number;
  cost_type?: CostType;
  costType?: CostType;
  description?: string;
}

const tone: Record<CostType, string> = {
  fixed: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  per_event: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  per_hour: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  percentage: "border-amber-400/30 bg-amber-500/10 text-amber-100",
};

export function CostModuleList() {
  const [editModule, setEditModule] = useState<CostModule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<CostModule | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/cost-modules"],
  });

  const costModules: CostModule[] = Array.isArray(data?.data)
    ? data!.data.map((module: CostModule) => ({
        ...module,
        cisControl: module.cis_control || module.cisControl || [],
        costFactor: module.cost_factor || module.costFactor || 0,
        costType: (module.cost_type || module.costType || "fixed") as CostType,
      }))
    : [];

  const filteredModules = useMemo(() => {
    if (!searchQuery) return costModules;
    const q = searchQuery.toLowerCase();
    return costModules.filter(
      (module) =>
        module.name.toLowerCase().includes(q) ||
        module.description?.toLowerCase().includes(q) ||
        module.cisControl?.some((ctrl) => ctrl.toLowerCase().includes(q)),
    );
  }, [costModules, searchQuery]);

  const stats = useMemo(() => {
    const total = costModules.length;
    const perEvent = costModules.filter((m) => (m.costType || "fixed") === "per_event").length;
    const percentage = costModules.filter((m) => (m.costType || "fixed") === "percentage").length;
    const avgFactor =
      costModules.reduce((sum, module) => sum + (Number(module.costFactor) || 0), 0) / (total || 1);
    return { total, perEvent, percentage, avgFactor };
  }, [costModules]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cost-modules/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete cost module");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cost-modules"] });
      toast({ title: "Cost module deleted", description: "The module was removed successfully." });
      setIsDeleteDialogOpen(false);
    },
    onError: (err: any) => {
      toast({
        title: "Failed to delete cost module",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const formatCostFactor = (module: CostModule) => {
    const value = Number(module.costFactor || 0);
    switch (module.costType) {
      case "fixed":
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
      case "per_event":
        return `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)} per event`;
      case "per_hour":
        return `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)} per hour`;
      case "percentage":
        return `${(value * 100).toFixed(2)}% of loss`;
      default:
        return value;
    }
  };

  const formatCostType = (type: CostType) => {
    switch (type) {
      case "fixed":
        return "Fixed Cost";
      case "per_event":
        return "Per Event";
      case "per_hour":
        return "Per Hour";
      case "percentage":
        return "Percentage";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <GlowCard className="text-center text-white/70">
        <p>Loading cost modules…</p>
      </GlowCard>
    );
  }

  if (error) {
    return (
      <GlowCard className="space-y-4 text-white/80">
        <div>Unable to load cost modules.</div>
        <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10" onClick={() => refetch()}>
          Retry
        </Button>
      </GlowCard>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cost Modules" value={stats.total.toString()} delta={`${filteredModules.length} in view`} />
        <KpiCard
          label="Per-Event Motors"
          value={stats.perEvent.toString()}
          delta="Modules tied to occurrences"
          trendColor="#86efac"
        />
        <KpiCard
          label="Percentage Models"
          value={stats.percentage.toString()}
          delta="Modules tied to loss %"
          trendColor="#c4b5fd"
        />
        <KpiCard
          label="Avg Cost Factor"
          value={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(stats.avgFactor)}
          delta="Baseline value"
          trendColor="#fda4af"
        />
      </section>

      <GlowCard className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search cost modules…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
            />
          </div>
          <Button className="rounded-full bg-primary px-5 text-primary-foreground" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cost Module
          </Button>
        </div>
        {!filteredModules.length ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center text-white/60">
            No cost modules match your search.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredModules.map((module) => (
              <GlowCard key={module.id} compact className="border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{module.name}</p>
                      <Badge className={`mt-1 rounded-full border px-3 py-0.5 text-xs capitalize ${tone[module.costType || "fixed"]}`}>
                        {formatCostType(module.costType || "fixed")}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                      onClick={() => {
                        setEditModule(module);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                      onClick={() => {
                        setModuleToDelete(module);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/40">Cost Factor</p>
                    <p className="text-lg font-semibold text-white">{formatCostFactor(module)}</p>
                  </div>
                  {module.description && <p>{module.description}</p>}
                  {!!(module.cisControl?.length) && (
                    <div className="flex flex-wrap gap-2 pt-2 text-xs">
                      {module.cisControl!.map((control) => (
                        <Badge key={control} className="rounded-full border border-white/10 bg-white/5 text-white/70">
                          {control}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </GlowCard>
            ))}
          </div>
        )}
      </GlowCard>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Add Cost Module</DialogTitle>
          </DialogHeader>
          <CostModuleForm onSuccess={() => setIsCreateDialogOpen(false)} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Edit Cost Module</DialogTitle>
          </DialogHeader>
          {editModule && (
            <CostModuleForm module={editModule} onSuccess={() => setIsEditDialogOpen(false)} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Delete Cost Module</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/70">
            Are you sure you want to delete “{moduleToDelete?.name}”? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => moduleToDelete && deleteMutation.mutate(moduleToDelete.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
