import { useState } from "react";
import { Control } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, Link } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

type ControlListProps = {
  controls: Control[];
  onEdit: (control: Control) => void;
  isTemplateView?: boolean;
  onAssignToRisk?: (control: Control) => void;
};

export function ControlList({ controls, onEdit, isTemplateView = false, onAssignToRisk }: ControlListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);
  const [detailsControl, setDetailsControl] = useState<Control | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const itemsPerPage = 10;

  // Filter controls based on search query and filters
  const filteredControls = (controls || []).filter((control) => {
    const matchesSearch =
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.controlId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (control.description && control.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || control.controlType === filterType;
    const matchesCategory = filterCategory === "all" || control.controlCategory === filterCategory;
    const matchesStatus = filterStatus === "all" || control.implementationStatus === filterStatus;
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  const paginatedControls = filteredControls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle control deletion confirmation
  const handleDeleteClick = (control: Control) => {
    setControlToDelete(control);
    setDeleteConfirmOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (controlId: number) => {
      // Use different endpoints based on whether we're in template view
      const endpoint = isTemplateView 
        ? `/api/control-library/${controlId}` 
        : `/api/controls/${controlId}`;
      return apiRequest("DELETE", endpoint);
    },
    onSuccess: () => {
      // Invalidate appropriate queries based on view
      if (isTemplateView) {
        queryClient.invalidateQueries({ queryKey: ["/api/control-library"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
        queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
        // Invalidate risk summary for Loss Exceedance Curve
        queryClient.invalidateQueries({ queryKey: ["/api/risk-summary/latest"] });
      }
      
      toast({
        title: isTemplateView ? "Template deleted" : "Control deleted",
        description: isTemplateView 
          ? "The control template has been deleted successfully."
          : "The control has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to delete ${isTemplateView ? "template" : "control"}: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Execute control deletion
  const confirmDelete = () => {
    if (controlToDelete) {
      deleteMutation.mutate(controlToDelete.id);
    }
    setDeleteConfirmOpen(false);
  };
  
  // Handle view details
  const handleViewDetails = (control: Control) => {
    setDetailsControl(control);
    setDetailsOpen(true);
  };
  
  // Get control type badge color
  const getControlTypeColor = (type: string) => {
    switch(type) {
      case "preventive": return "bg-green-100 text-green-800";
      case "detective": return "bg-blue-100 text-blue-800";
      case "corrective": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get control category badge color
  const getControlCategoryColor = (category: string) => {
    switch(category) {
      case "technical": return "bg-indigo-100 text-indigo-800";
      case "administrative": return "bg-purple-100 text-purple-800";
      case "physical": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get implementation status badge color
  const getImplementationStatusColor = (status: string) => {
    switch(status) {
      case "fully_implemented": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-amber-100 text-amber-800";
      case "not_implemented": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format implementation status for display
  const formatImplementationStatus = (status: string) => {
    switch(status) {
      case "fully_implemented": return "Fully Implemented";
      case "in_progress": return "In Progress";
      case "not_implemented": return "Not Implemented";
      default: return status;
    }
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate total cost based on business logic
  const calculateTotalCost = (control: Control) => {
    if (control.implementationStatus === "fully_implemented") {
      if (control.isPerAgentPricing) {
        // Agent-based: Show cost per agent (actual calculation done server-side with asset count)
        return Number(control.costPerAgent) || 0;
      } else {
        // Total cost
        return Number(control.implementationCost) || 0;
      }
    } else if (control.implementationStatus === "in_progress") {
      // In progress: deployedAgentCount × costPerAgent
      const deployed = Number(control.deployedAgentCount) || 0;
      const costPerAgent = Number(control.costPerAgent) || 0;
      return deployed * costPerAgent;
    }
    return 0;
  };

  // Format cost display with context
  const formatCostDisplay = (control: Control) => {
    const totalCost = calculateTotalCost(control);
    
    if (control.implementationStatus === "fully_implemented" && control.isPerAgentPricing) {
      return `${formatCurrency(totalCost)}/agent`;
    }
    return formatCurrency(totalCost);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5">
          <CardTitle>{isTemplateView ? "Control Template Library" : "Implemented Controls"}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search controls..."
                className="w-64 pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="detective">Detective</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="fully_implemented">Fully Implemented</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="not_implemented">Not Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {paginatedControls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedControls.map((control) => (
                <Card 
                  key={control.id} 
                  className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(control)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {control.controlId?.substring(0, 3) || 'CTL'}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{control.name}</CardTitle>
                          <div className="text-sm text-gray-400">{control.controlId}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                        {isTemplateView && onAssignToRisk && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAssignToRisk(control);
                            }}
                            title="Assign to Risk"
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(control);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(control);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Type</p>
                        <Badge className={getControlTypeColor(control.controlType)}>
                          {control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Category</p>
                        <Badge className={getControlCategoryColor(control.controlCategory)}>
                          {control.controlCategory.charAt(0).toUpperCase() + control.controlCategory.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Status</p>
                      <Badge className={getImplementationStatusColor(control.implementationStatus)}>
                        {formatImplementationStatus(control.implementationStatus)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Effectiveness</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={(control.controlEffectiveness || 0) * 10} className="flex-1 h-2" />
                        <span className="text-sm text-white">{(control.controlEffectiveness || 0).toFixed(1)}/10</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Cost</p>
                      <p className="text-white font-semibold">{formatCostDisplay(control)}</p>
                    </div>
                    
                    {control.description && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Description</p>
                        <p className="text-gray-300 text-sm line-clamp-2">{control.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
              <Search className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <p className="text-lg">No controls found.</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the control &quot;{controlToDelete?.name}&quot; ({controlToDelete?.controlId}).
              This action cannot be undone and may impact risk calculations.
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

      {/* Control details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Control Details</DialogTitle>
            <DialogDescription>
              Detailed information about this control
            </DialogDescription>
          </DialogHeader>

          {detailsControl ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Control ID</h4>
                  <p>{detailsControl.controlId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p>{detailsControl.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <Badge className={getControlTypeColor(detailsControl.controlType)}>
                    {detailsControl.controlType.charAt(0).toUpperCase() + detailsControl.controlType.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <Badge className={getControlCategoryColor(detailsControl.controlCategory)}>
                    {detailsControl.controlCategory.charAt(0).toUpperCase() + detailsControl.controlCategory.slice(1)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="text-sm">{detailsControl.description || "No description provided."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Implementation Status</h4>
                  <Badge className={getImplementationStatusColor(detailsControl.implementationStatus)}>
                    {formatImplementationStatus(detailsControl.implementationStatus)}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Cost</h4>
                  <p className="font-medium">{formatCostDisplay(detailsControl)}</p>
                </div>
              </div>

              {/* Cost Breakdown Section */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Cost Breakdown</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Pricing Model:</span>
                    <p className="font-semibold text-gray-900">
                      {detailsControl.isPerAgentPricing ? "Per Agent" : "Total Implementation"}
                    </p>
                  </div>
                  {detailsControl.isPerAgentPricing ? (
                    <div>
                      <span className="text-blue-700 font-medium">Cost Per Agent:</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(Number(detailsControl.costPerAgent) || 0)}</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-blue-700 font-medium">Implementation Cost:</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(Number(detailsControl.implementationCost) || 0)}</p>
                    </div>
                  )}
                  {detailsControl.implementationStatus === "in_progress" && (
                    <>
                      <div>
                        <span className="text-blue-700 font-medium">Deployed Agents:</span>
                        <p className="font-semibold text-gray-900">{Number(detailsControl.deployedAgentCount) || 0}</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Current Cost:</span>
                        <p className="font-semibold text-gray-900">{formatCurrency((Number(detailsControl.deployedAgentCount) || 0) * (Number(detailsControl.costPerAgent) || 0))}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Control Effectiveness</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={detailsControl.controlEffectiveness * 10} className="h-2.5" />
                  <span className="text-sm font-medium">{detailsControl.controlEffectiveness.toFixed(1)} / 10</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  FAIR-U resistance strength score - how effectively this control reduces risk
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Associated Risks</h4>
                {detailsControl.associatedRisks && detailsControl.associatedRisks.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {detailsControl.associatedRisks.map((riskId, index) => (
                      <Badge key={index} variant="outline">
                        {riskId}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">No risks associated.</p>
                )}
              </div>

              {detailsControl.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="text-sm">{detailsControl.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button onClick={() => onEdit(detailsControl)} className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Control
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
