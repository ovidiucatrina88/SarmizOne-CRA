import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Control, Risk } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, RefreshCw } from "lucide-react";
import { ControlList } from "@/components/controls/control-list";
import { EnhancedControlTable } from "@/components/controls/enhanced-control-table";
import { FrameworkGroupedControlList } from "@/components/controls/framework-grouped-control-list";
import { ControlFiltersComponent, ControlFilters } from "@/components/controls/control-filters";
import { ControlViewToggle, ControlViewMode } from "@/components/controls/control-view-toggle";
import { ControlForm } from "@/components/controls/control-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";

export default function Controls() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [viewMode, setViewMode] = useState<ControlViewMode>('list');
  const [filters, setFilters] = useState<ControlFilters>({
    search: '',
    type: '',
    category: '',
    status: '',
    framework: ''
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
      if (filters.type && control.controlType !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && control.controlCategory !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && control.implementationStatus !== filters.status) {
        return false;
      }

      // Framework filter - note: using description as proxy for framework since complianceFramework doesn't exist
      if (filters.framework) {
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
        <h2 className="text-xl font-bold text-red-500">Error loading controls</h2>
        <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Controls</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor security controls
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Control
          </Button>
        </div>

        <ControlList controls={controlInstances || []} onEdit={handleEditControl} />
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedControl ? "Edit Control" : "Add New Control"}
            </DialogTitle>
          </DialogHeader>
          <ControlForm control={selectedControl} onClose={handleCloseControl} />
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}