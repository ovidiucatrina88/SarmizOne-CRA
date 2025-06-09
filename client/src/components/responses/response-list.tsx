import { useState } from "react";
import { RiskResponse, Risk } from "@shared/schema";
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
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, Shield } from "lucide-react";
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

type ResponseListProps = {
  responses: RiskResponse[];
  risks: Risk[];
  onEdit: (response: RiskResponse) => void;
};

export function ResponseList({ responses, risks, onEdit }: ResponseListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<RiskResponse | null>(null);
  const [detailsResponse, setDetailsResponse] = useState<RiskResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const itemsPerPage = 10;

  // Filter responses based on search query and filters
  const filteredResponses = responses?.filter((response) => {
    // Get associated risk name for searching
    const risk = risks.find(r => r.riskId === response.riskId);
    const riskName = risk ? risk.name : "";
    
    const matchesSearch =
      response.riskId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      riskName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || response.responseType === filterType;
    
    return matchesSearch && matchesType;
  }) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);
  const paginatedResponses = filteredResponses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle response deletion confirmation
  const handleDeleteClick = (response: RiskResponse) => {
    setResponseToDelete(response);
    setDeleteConfirmOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (responseId: number) => {
      return apiRequest("DELETE", `/api/responses/${responseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({
        title: "Response deleted",
        description: "The risk response has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete risk response: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Execute response deletion
  const confirmDelete = () => {
    if (responseToDelete) {
      deleteMutation.mutate(responseToDelete.id);
    }
    setDeleteConfirmOpen(false);
  };
  
  // Handle view details
  const handleViewDetails = (response: RiskResponse) => {
    setDetailsResponse(response);
    setDetailsOpen(true);
  };
  
  // Get response type badge color
  const getResponseTypeColor = (type: string) => {
    switch(type) {
      case "mitigate": return "bg-blue-100 text-blue-800";
      case "transfer": return "bg-purple-100 text-purple-800";
      case "avoid": return "bg-red-100 text-red-800";
      case "accept": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format response type for display
  const formatResponseType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Get risk name from risk ID
  const getRiskName = (riskId: string) => {
    const risk = risks.find(r => r.riskId === riskId);
    return risk ? risk.name : "Unknown Risk";
  };
  
  // Get risk severity badge
  const getRiskSeverity = (riskId: string) => {
    const risk = risks.find(r => r.riskId === riskId);
    if (!risk) return null;
    
    const getSeverityColor = (severity: string) => {
      switch(severity) {
        case "critical": return "bg-red-100 text-red-800";
        case "high": return "bg-amber-100 text-amber-800";
        case "medium": return "bg-yellow-100 text-yellow-800";
        case "low": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
      }
    };
    
    return (
      <Badge className={getSeverityColor(risk.severity)}>
        {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5">
          <CardTitle>Risk Response Register</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search responses..."
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
                <SelectValue placeholder="Response Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mitigate">Mitigate</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="avoid">Avoid</SelectItem>
                <SelectItem value="accept">Accept</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk ID</TableHead>
                  <TableHead>Risk Name</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Response Type</TableHead>
                  <TableHead>Controls</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedResponses.length > 0 ? (
                  paginatedResponses.map((response) => (
                    <TableRow key={response.id} className="cursor-pointer" onClick={() => handleViewDetails(response)}>
                      <TableCell className="font-medium">{response.riskId}</TableCell>
                      <TableCell>{getRiskName(response.riskId)}</TableCell>
                      <TableCell>{getRiskSeverity(response.riskId)}</TableCell>
                      <TableCell>
                        <Badge className={getResponseTypeColor(response.responseType)}>
                          {formatResponseType(response.responseType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {response.responseType === "mitigate" ? (
                          response.assignedControls && response.assignedControls.length > 0 ? (
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-1 text-green-600" />
                              <span>{response.assignedControls.length}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(response);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(response);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No risk responses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
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
              This will permanently delete the risk response for &quot;{responseToDelete?.riskId}&quot;.
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

      {/* Response details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risk Response Details</DialogTitle>
            <DialogDescription>
              Detailed information about this risk response
            </DialogDescription>
          </DialogHeader>

          {detailsResponse ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Risk ID</h4>
                  <p>{detailsResponse.riskId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Response Type</h4>
                  <Badge className={getResponseTypeColor(detailsResponse.responseType)}>
                    {formatResponseType(detailsResponse.responseType)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Risk</h4>
                <p className="font-medium">{getRiskName(detailsResponse.riskId)}</p>
                <div className="mt-1">
                  {getRiskSeverity(detailsResponse.riskId)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Justification</h4>
                <p className="text-sm">{detailsResponse.justification || "No justification provided."}</p>
              </div>

              {detailsResponse.responseType === "mitigate" && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Assigned Controls</h4>
                  {detailsResponse.assignedControls && detailsResponse.assignedControls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {detailsResponse.assignedControls.map((controlId, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {controlId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No controls assigned.</p>
                  )}
                </div>
              )}

              {detailsResponse.responseType === "transfer" && detailsResponse.transferMethod && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Transfer Method</h4>
                  <p className="text-sm">{detailsResponse.transferMethod}</p>
                </div>
              )}

              {detailsResponse.responseType === "avoid" && detailsResponse.avoidanceStrategy && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Avoidance Strategy</h4>
                  <p className="text-sm">{detailsResponse.avoidanceStrategy}</p>
                </div>
              )}

              {detailsResponse.responseType === "accept" && detailsResponse.acceptanceReason && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Acceptance Reason</h4>
                  <p className="text-sm">{detailsResponse.acceptanceReason}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button onClick={() => onEdit(detailsResponse)} className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Response
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
