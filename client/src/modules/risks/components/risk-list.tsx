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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  const filteredRisks = risks?.filter((risk) => {
    const matchesSearch =
      risk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.riskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.threatCommunity.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || risk.riskCategory === filterCategory;
    const matchesSeverity = filterSeverity === "all" || risk.severity === filterSeverity;
    
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
  
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-amber-100 text-amber-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "operational": return "bg-blue-100 text-blue-800";
      case "strategic": return "bg-indigo-100 text-indigo-800";
      case "compliance": return "bg-purple-100 text-purple-800";
      case "financial": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg border border-gray-600">
        {/* Search and Filter Controls */}
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search risks..."
                className="w-full pl-8 bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={filterCategory}
              onValueChange={(value) => {
                setFilterCategory(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
                <SelectItem value="operational" className="text-white hover:bg-gray-600">Operational</SelectItem>
                <SelectItem value="strategic" className="text-white hover:bg-gray-600">Strategic</SelectItem>
                <SelectItem value="compliance" className="text-white hover:bg-gray-600">Compliance</SelectItem>
                <SelectItem value="financial" className="text-white hover:bg-gray-600">Financial</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterSeverity}
              onValueChange={(value) => {
                setFilterSeverity(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Severities</SelectItem>
                <SelectItem value="critical" className="text-white hover:bg-gray-600">Critical</SelectItem>
                <SelectItem value="high" className="text-white hover:bg-gray-600">High</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-600">Medium</SelectItem>
                <SelectItem value="low" className="text-white hover:bg-gray-600">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-0">
          {paginatedRisks.length > 0 ? (
            <>
              {/* Grid Header */}
              <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
                <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div>Risk Information</div>
                  <div>Category & Severity</div>
                  <div>Inherent Risk</div>
                  <div>Residual Risk</div>
                  <div>Threat Community</div>
                  <div className="text-right">Actions</div>
                </div>
              </div>
              
              {/* Risk rows */}
              <div className="divide-y divide-gray-600">
                {paginatedRisks.map((risk) => (
                  <div key={risk.id} className="px-6 py-4 hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => handleViewDetails(risk)}>
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Risk Information */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-8 rounded flex items-center justify-center border ${
                            risk.severity === 'critical' ? 'bg-red-600 border-red-500' : 
                            risk.severity === 'high' ? 'bg-orange-600 border-orange-500' : 
                            risk.severity === 'medium' ? 'bg-yellow-600 border-yellow-500' : 
                            risk.severity === 'low' ? 'bg-green-600 border-green-500' : 'bg-gray-600 border-gray-500'
                          }`}>
                            {risk.severity === 'critical' ? 
                              <AlertTriangle className="h-4 w-4 text-white" /> : 
                              <Shield className="h-4 w-4 text-white" />
                            }
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{risk.name}</div>
                          <div className="text-xs text-gray-400">ID: {risk.riskId}</div>
                        </div>
                      </div>

                      {/* Category & Severity */}
                      <div>
                        <div className="text-sm text-gray-300 capitalize">{risk.riskCategory || 'Unknown'}</div>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(risk.severity || 'unknown')}`}>
                            {risk.severity ? risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1) : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Inherent Risk */}
                      <div>
                        <div className="text-sm font-medium text-red-400">
                          {formatCurrency(risk.inherentRisk || 0)}
                        </div>
                      </div>

                      {/* Residual Risk */}
                      <div>
                        <div className="text-sm font-medium text-green-400">
                          {formatCurrency(risk.residualRisk || 0)}
                        </div>
                      </div>

                      {/* Threat Community */}
                      <div>
                        <div className="text-sm text-gray-300">{risk.threatCommunity || 'Unknown'}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                        {isTemplateView && onCreateFromTemplate ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onCreateFromTemplate(risk.id);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(risk);
                              }}
                              className="text-gray-300 hover:bg-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(risk);
                              }}
                              className="text-gray-300 hover:bg-gray-600 hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCalculate(risk);
                              }}
                              className="border-gray-500 text-gray-300 hover:bg-gray-600"
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="border-gray-500 text-gray-300 hover:bg-gray-600"
                            >
                              <Link href={`/risks/${risk.id}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEdit(risk);
                              }}
                              className="text-gray-300 hover:bg-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(risk);
                              }}
                              className="text-gray-300 hover:bg-gray-600 hover:text-red-400"
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
            <div className="flex flex-col items-center justify-center h-64">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No risks found</h3>
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' || severityFilter !== 'all' 
                  ? "No risks match your current filters" 
                  : "Get started by creating your first risk"}
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4 px-6 bg-gray-800 border-t border-gray-600 rounded-b-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </div>
      </div>

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