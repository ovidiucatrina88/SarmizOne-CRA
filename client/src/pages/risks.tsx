import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Risk } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, PlusCircle } from "lucide-react";
import { RiskList } from "@/modules/risks/components/risk-list";
import { EnhancedAssetGroupedRiskList } from "@/modules/risks/components/enhanced-asset-grouped-risk-list";
import { ViewToggle } from "@/modules/risks/components/view-toggle";
import { RiskForm } from "@/modules/risks/components";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/layout/layout";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

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

  // Page actions for top bar
  const pageActions = (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleRefresh} 
        disabled={isRefreshing}
        title="Refresh risk data"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
      <Button onClick={handleCreateNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Risk
      </Button>
    </div>
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
        <h2 className="text-xl font-bold text-red-500">Error loading risks</h2>
        <p className="mt-2 text-gray-600">
          Please try again later or contact support.
        </p>
      </div>
    );
  }
  
  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Risk Register</h1>
          <div className="flex items-center gap-2">
            <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              title="Refresh risk data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Risk
            </Button>
          </div>
        </div>

        {!Array.isArray(risks) || risks.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No Risks Added Yet</h3>
              <p className="text-gray-500 mb-4">Click "Add New Risk" to create a new risk.</p>
            </div>
          </Card>
        ) : viewMode === 'grouped' ? (
          <EnhancedAssetGroupedRiskList
            risks={risks}
            onRiskEdit={handleEdit}
            onRiskDelete={handleDelete}
          />
        ) : (
          <RiskList
            risks={risks}
            onEdit={handleEdit}
          />
        )}

      {/* Risk Form Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRisk ? "Edit Risk" : "Create New Risk"}</DialogTitle>
            <DialogDescription>
              Define risk parameters using the FAIR-U methodology
            </DialogDescription>
          </DialogHeader>
          <RiskForm 
            risk={selectedRisk} 
            onClose={handleClose} 
          />
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}