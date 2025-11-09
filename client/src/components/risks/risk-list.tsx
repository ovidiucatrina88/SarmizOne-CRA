import { useState } from "react";
import { Risk } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { RiskDetailView } from "@/components/risks/risk-detail-view";
import { AnnualizedLossFactors } from "@/components/risks/annualized-loss-factors";
import { Link, useLocation } from "wouter";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, Calculator, Tv, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { GlowCard } from "@/components/ui/glow-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RiskListProps = {
  risks: Risk[];
  onEdit: (risk: Risk) => void;
  isTemplateView?: boolean;
  onCreateFromTemplate?: (templateId: number) => void;
};

export function RiskList({ 
  risks, 
  onEdit, 
  isTemplateView = false,
  onCreateFromTemplate
}: RiskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [riskToDelete, setRiskToDelete] = useState<Risk | null>(null);
  const [detailsRisk, setDetailsRisk] = useState<Risk | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showFactorsView, setShowFactorsView] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const itemsPerPage = 10;

  // Filter risks based on search query and filters
  const filteredRisks =
    risks?.filter((risk) => {
      const matchesSearch =
        risk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.riskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.threatCommunity.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || risk.riskCategory?.toLowerCase() === filterCategory;
      const matchesSeverity =
        filterSeverity === "all" || risk.severity?.toLowerCase() === filterSeverity;

      return matchesSearch && matchesCategory && matchesSeverity;
    }) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredRisks.length / itemsPerPage);
  const paginatedRisks = filteredRisks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle risk deletion confirmation
  const handleDeleteClick = (risk: Risk) => {
    setRiskToDelete(risk);
    setDeleteConfirmOpen(true);
  };

  // Delete mutation - works with both regular risks and risk library templates
  const deleteMutation = useMutation({
    mutationFn: async (risk: {id: number, riskId: string}) => {
      if (isTemplateView) {
        // For risk library templates, use the risk-library endpoint
        const response = await apiRequest("DELETE", `/api/risk-library/${risk.id}`);
        console.log("Risk library template deletion response:", response);
        return response;
      } else {
        // For regular risks, try deleting by numeric ID first
        try {
          const response = await apiRequest("DELETE", `/api/risks/${risk.id}`);
          console.log("Risk deletion response:", response);
          return response;
        } catch (error) {
          console.error("Error deleting by ID:", error);
          // If that fails, try deleting by string riskId
          return apiRequest("DELETE", `/api/risks/${risk.riskId}`);
        }
      }
    },
    onSuccess: () => {
      if (isTemplateView) {
        queryClient.invalidateQueries({ queryKey: ["/api/risk-library"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
        queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
        
        // Force refresh the risk list
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        }, 500);
      }
      
      toast({
        title: isTemplateView ? "Risk template deleted" : "Risk deleted",
        description: isTemplateView ? "The risk template has been deleted successfully." : "The risk has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Risk deletion error:", error);
      toast({
        title: "Error",
        description: `Failed to delete risk: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Execute risk deletion
  const confirmDelete = async () => {
    if (riskToDelete) {
      try {
        // Use mutateAsync to wait for completion before continuing
        await deleteMutation.mutateAsync({
          id: riskToDelete.id,
          riskId: riskToDelete.riskId
        });
        
        console.log(`Risk ${riskToDelete.id} (${riskToDelete.riskId}) deleted successfully`);
        
        // Immediately update local UI by filtering out the deleted risk
        // This makes the deletion appear to happen instantly
        const currentRisks = queryClient.getQueryData<Risk[]>(["/api/risks"]) || [];
        const updatedRisks = currentRisks.filter(r => r.id !== riskToDelete.id);
        
        // Update the cache directly for instant UI feedback
        queryClient.setQueryData(["/api/risks"], updatedRisks);
        
        // Set timeout to force a refresh after deletion completes
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
          queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
        }, 300);
      } catch (error) {
        console.error("Error in risk deletion:", error);
      } finally {
        // Always close the dialog when done
        setDeleteConfirmOpen(false);
        // Clear the risk to delete reference
        setRiskToDelete(null);
      }
    } else {
      setDeleteConfirmOpen(false);
    }
  };

  // Calculate risk mutation
  const calculateMutation = useMutation({
    mutationFn: async (riskId: string) => {
      // Use the server-side calculation which properly handles associated assets
      // and returns consistent values that match the Risk Quantification component
      return apiRequest("GET", `/api/risks/${riskId}/calculate`);
    },
    onSuccess: (data: any) => {
      // Make sure to invalidate the queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      // Invalidate risk summary for Loss Exceedance Curve
      queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
      
      // Show the calculated values to the user
      toast({
        title: "Risk calculation completed",
        description: `Inherent risk: ${formatCurrency(data.inherentRisk || 0, 'USD')}, Residual risk: ${formatCurrency(data.residualRisk || 0, 'USD')}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to calculate risk: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle calculate risk
  const handleCalculate = (risk: Risk) => {
    calculateMutation.mutate(risk.riskId);
  };
  
  // Handle view details
  const handleViewDetails = (risk: Risk) => {
    setDetailsRisk(risk);
    setDetailsOpen(true);
  };
  const severityStyles: Record<string, string> = {
    Critical: "bg-rose-500/15 text-rose-200 border border-rose-400/40",
    High: "bg-amber-500/15 text-amber-200 border border-amber-400/40",
    Medium: "bg-sky-500/15 text-sky-200 border border-sky-400/40",
    Low: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/40",
  };

  return (
    <>
      <GlowCard className="p-0">
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                type="search"
                placeholder="Search risks..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48 rounded-2xl border border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-surface-muted text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterSeverity}
              onValueChange={(value) => {
                setFilterSeverity(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48 rounded-2xl border border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-surface-muted text-white">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-0">
          {paginatedRisks.length > 0 ? (
            <>
              <div className="border-b border-white/10 bg-white/5 px-6 py-3 text-xs font-medium uppercase tracking-[0.3em] text-white/50">
                <div className="grid grid-cols-6 gap-4">
                  <div>Risk</div>
                  <div>Category</div>
                  <div>Severity</div>
                  <div>Inherent</div>
                  <div>Residual</div>
                  <div className="text-right">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {paginatedRisks.map((risk) => (
                  <div
                    key={risk.id}
                    className="cursor-pointer px-6 py-4 transition-colors hover:bg-white/5"
                    onClick={() => handleViewDetails(risk)}
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      <div>
                        <div className="text-sm font-semibold text-white">{risk.name}</div>
                        <div className="text-xs text-white/50">ID: {risk.riskId}</div>
                      </div>
                      <div className="text-sm text-white/70 capitalize">{risk.riskCategory || "Unknown"}</div>
                      {(() => {
                        const severityKey = risk.severity
                          ? `${risk.severity.charAt(0).toUpperCase()}${risk.severity.slice(1).toLowerCase()}`
                          : "Unknown";
                        return (
                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                severityStyles[severityKey] || "bg-white/10 border border-white/10 text-white/70"
                              }`}
                            >
                              {severityKey}
                            </span>
                          </div>
                        );
                      })()}
                      <div>
                        <div className="text-sm font-semibold text-white/90">{formatCurrency(risk.inherentRisk || 0)}</div>
                        <div className="text-xs text-white/50">Inherent</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-emerald-200">
                          {formatCurrency(risk.residualRisk || 0)}
                        </div>
                        <div className="text-xs text-white/50">Residual</div>
                      </div>
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {isTemplateView && onCreateFromTemplate ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full border border-white/10 text-white hover:bg-white/10"
                              onClick={() => onCreateFromTemplate(risk.id)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10" onClick={() => onEdit(risk)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-white hover:bg-rose-500/20 hover:text-rose-200"
                              onClick={() => handleDeleteClick(risk)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full border border-white/10 text-white hover:bg-white/10"
                              onClick={() => handleCalculate(risk)}
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full border border-white/10 text-white hover:bg-white/10"
                            >
                              <Link href={`/risks/${risk.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10" onClick={() => onEdit(risk)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-white hover:bg-rose-500/20 hover:text-rose-200"
                              onClick={() => handleDeleteClick(risk)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-white/70">
              <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No risks found</h3>
              <p className="text-sm text-white/50">
                {searchQuery || filterCategory !== "all" || filterSeverity !== "all"
                  ? "No risks match your current filters"
                  : "Get started by creating your first risk"}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 border-t border-white/10 bg-white/5 px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 text-white hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-white/60">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 text-white hover:bg-white/10 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </div>
      </GlowCard>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the risk &quot;{riskToDelete?.name}&quot; ({riskToDelete?.riskId}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Risk details dark theme view */}
      {detailsRisk && detailsOpen && (
        <RiskDetailView 
          risk={detailsRisk} 
          onBack={() => setDetailsOpen(false)} 
        />
      )}
      
      {/* Alternate dialog for the Annualized Loss Factors view */}
      <Dialog open={showFactorsView} onOpenChange={setShowFactorsView}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {detailsRisk && (
            <>
              <div aria-hidden className="absolute left-0 top-0 opacity-0 h-0 w-0 overflow-hidden">
                <DialogTitle>Risk Analysis</DialogTitle>
                <DialogDescription>
                  Annualized Loss Factors Analysis
                </DialogDescription>
              </div>
              <AnnualizedLossFactors risk={detailsRisk} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
