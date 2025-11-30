import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Control } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ControlList } from "@/components/controls/control-list";
import { EnhancedControlTable } from "@/components/controls/enhanced-control-table";
import { FrameworkGroupedControlList } from "@/components/controls/framework-grouped-control-list";
import { RiskGroupedControlList } from "@/components/controls/risk-grouped-control-list";
import { ControlFiltersComponent, ControlFilters } from "@/components/controls/control-filters";
import { ControlViewToggle, ControlViewMode } from "@/components/controls/control-view-toggle";
import { ControlForm } from "@/components/controls/control-form";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Controls() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [viewMode, setViewMode] = useState<ControlViewMode>('list');
  const [filters, setFilters] = useState<ControlFilters>({
    search: '',
    type: 'all',
    category: 'all',
    status: 'all',
    framework: 'all'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all control instances
  const {
    data: controlsResponse,
    isLoading: isLoadingControls,
    error: controlsError
  } = useQuery<{ success: boolean; data: Control[] }>({
    queryKey: ["/api/controls"],
  });

  // Fetch control summary with trends
  const { data: summaryResponse } = useQuery({
    queryKey: ["/api/controls/summary"],
  });

  const summary = summaryResponse?.data || {
    stats: { total: 0, fully: 0, progress: 0, corrective: 0, totalCost: 0 },
    trends: {
      total: { series: [], delta: "0% vs last month" },
      fully: { series: [], delta: "0% vs last month" },
      progress: { series: [], delta: "0% vs last month" },
      corrective: { series: [], delta: "0% vs last month" },
      totalCost: { series: [], delta: "0% vs last month" }
    }
  };

  // Extract the controls array from the API response and ensure it's always an array
  const allControls = (controlsResponse?.data || []) as Control[];

  // Filter controls based on current filters
  const filteredControls = useMemo(() => {
    return allControls.filter(control => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          control.name.toLowerCase().includes(searchLower) ||
          control.controlId.toLowerCase().includes(searchLower) ||
          (control.description && control.description.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'all' && control.controlType !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all' && control.controlCategory !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && filters.status !== 'all' && control.implementationStatus !== filters.status) {
        return false;
      }

      // Framework filter - note: using description as proxy for framework since complianceFramework doesn't exist
      if (filters.framework && filters.framework !== 'all') {
        const frameworkInDescription = control.description?.toLowerCase().includes(filters.framework.toLowerCase());
        if (!frameworkInDescription) return false;
      }

      return true;
    });
  }, [allControls, filters]);

  // Control counts for filter summary
  const controlCounts = useMemo(() => {
    return {
      total: allControls.length,
      filtered: filteredControls.length
    };
  }, [allControls.length, filteredControls.length]);

  // Filter controls to only show instances (not templates)
  const controlInstances = React.useMemo(() => {
    return allControls.filter((control: Control) => control.itemType === 'instance' || !control.itemType);
  }, [allControls]);

  const handleCreateNewControl = () => {
    setSelectedControl(null);
    setIsCreateModalOpen(true);
  };

  const handleEditControl = (control: Control) => {
    setSelectedControl(control);
    setIsCreateModalOpen(true);
  };

  // Delete control mutation
  const deleteControlMutation = useMutation({
    mutationFn: async (controlId: number) => {
      return apiRequest("DELETE", `/api/controls/${controlId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
      toast({
        title: "Control deleted",
        description: "The control has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete control",
        variant: "destructive",
      });
    },
  });

  const handleDeleteControl = (control: Control) => {
    console.log('Deleting control:', control.name);
    deleteControlMutation.mutate(control.id);
  };

  const handleCloseControl = () => {
    setIsCreateModalOpen(false);
    setSelectedControl(null);
  };

  const isLoading = isLoadingControls;
  const error = controlsError;

  // Page actions for top bar
  const pageActions = (
    <Button onClick={handleCreateNewControl}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Control
    </Button>
  );



  if (isLoading) {
    return (
      <Layout pageTitle="Control Library">
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
      <Layout pageTitle="Control Library">
        <GlowCard className="p-8 text-center text-white/80">
          <h2 className="text-xl font-semibold text-destructive">Error loading controls</h2>
          <p className="mt-2 text-muted-foreground">Please try again later or contact support.</p>
        </GlowCard>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle="Control Library"
      pageDescription="Monitor preventive, detective, and corrective coverage across frameworks."
      pageActions={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded-full border border-white/10 text-white hover:bg-white/5"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/controls"] })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="rounded-full bg-primary px-5 text-primary-foreground" onClick={handleCreateNewControl}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Control
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Controls"
            value={summary.stats.total.toLocaleString()}
            delta={summary.trends.total.delta}
            trendSeries={summary.trends.total.series}
          />
          <KpiCard
            label="Fully Implemented"
            value={summary.stats.fully.toLocaleString()}
            delta={summary.trends.fully.delta}
            trendSeries={summary.trends.fully.series}
            trendColor="#86efac"
          />
          <KpiCard
            label="In Progress"
            value={summary.stats.progress.toLocaleString()}
            delta={summary.trends.progress.delta}
            trendSeries={summary.trends.progress.series}
            trendColor="#fde68a"
          />
          <KpiCard
            label="Corrective Coverage"
            value={summary.stats.corrective.toLocaleString()}
            delta={summary.trends.corrective.delta}
            trendSeries={summary.trends.corrective.series}
            trendColor="#c4b5fd"
          />
        </section>

        <GlowCard className="space-y-4">
          <ControlFiltersComponent filters={filters} onFiltersChange={setFilters} controlCounts={controlCounts} />
          <div className="flex items-center justify-between text-sm text-white/60">
            <ControlViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            <div>
              {controlCounts.filtered} of {controlCounts.total} controls
            </div>
          </div>
          {!filteredControls.length ? (
            <div className="py-16 text-center text-white/70">
              <h3 className="text-xl font-semibold">No controls found</h3>
              <p className="text-sm text-white/50">
                {allControls.length === 0 ? 'Use “Add Control” to create your first control.' : 'No controls match your filters.'}
              </p>
            </div>
          ) : viewMode === "risk" ? (
            <RiskGroupedControlList
              controls={filteredControls}
              onControlEdit={handleEditControl}
              onControlDelete={handleDeleteControl}
            />
          ) : viewMode === "framework" ? (
            <FrameworkGroupedControlList
              controls={filteredControls}
              onControlEdit={handleEditControl}
              onControlDelete={handleDeleteControl}
            />
          ) : viewMode === "list" ? (
            <EnhancedControlTable controls={filteredControls} onControlEdit={handleEditControl} onControlDelete={handleDeleteControl} />
          ) : (
            <ControlList controls={filteredControls} onEdit={handleEditControl} onDelete={handleDeleteControl} />
          )}
        </GlowCard>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border-white/10 bg-background/95">
            <DialogHeader>
              <DialogTitle>{selectedControl ? "Edit Control" : "Add New Control"}</DialogTitle>
              <DialogDescription>
                {selectedControl
                  ? "Update the control details and configuration below."
                  : "Create a new control instance with specific configuration for your environment."}
              </DialogDescription>
            </DialogHeader>
            <ControlForm control={selectedControl} onClose={handleCloseControl} />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
