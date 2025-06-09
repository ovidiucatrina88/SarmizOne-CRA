import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Control, Risk } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { ControlList } from "@/components/controls/control-list";
import { ControlForm } from "@/components/controls/control-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Controls() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
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
      <Layout
        pageTitle="Security Controls"
        pageIcon="CTL"
        pageDescription="Implement and monitor security controls to reduce risk exposure and improve your security posture."
        pageActions={pageActions}
      >
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
      <Layout
        pageTitle="Security Controls"
        pageIcon="CTL"
        pageDescription="Implement and monitor security controls to reduce risk exposure and improve your security posture."
        pageActions={pageActions}
      >
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Error loading controls</h2>
          <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
        </div>
      
    );
  }

  return (
    <Layout
      pageTitle="Security Controls"
      pageIcon="CTL"
      pageDescription="Implement and monitor security controls to reduce risk exposure and improve your security posture."
      pageActions={pageActions}
    >
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
    
  );
}