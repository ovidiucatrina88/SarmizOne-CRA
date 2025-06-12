import React, { useState } from "react";
import { Control } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, 
  Trash2,
  ExternalLink,
  AlertTriangle 
} from "lucide-react";

interface EnhancedControlTableProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

export function EnhancedControlTable({ 
  controls, 
  onControlEdit, 
  onControlDelete 
}: EnhancedControlTableProps) {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const calculateControlCost = (control: Control) => {
    if (control.implementationStatus === "fully_implemented") {
      if (control.isPerAgentPricing) {
        return Number(control.costPerAgent) || 0;
      } else {
        return Number(control.implementationCost) || 0;
      }
    } else if (control.implementationStatus === "in_progress") {
      const deployed = Number(control.deployedAgentCount) || 0;
      const costPerAgent = Number(control.costPerAgent) || 0;
      return deployed * costPerAgent;
    }
    return 0;
  };

  const formatCostDisplay = (control: Control) => {
    const totalCost = calculateControlCost(control);
    
    if (control.implementationStatus === "fully_implemented" && control.isPerAgentPricing) {
      return `${formatCurrency(totalCost)}/agent`;
    }
    return formatCurrency(totalCost);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      fully_implemented: "bg-green-500 text-white",
      in_progress: "bg-yellow-500 text-black",
      not_implemented: "bg-red-500 text-white"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      preventive: "bg-blue-500 text-white",
      detective: "bg-purple-500 text-white",
      corrective: "bg-orange-500 text-white"
    };
    return colors[type as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technical: "bg-indigo-500 text-white",
      administrative: "bg-pink-500 text-white",
      physical: "bg-teal-500 text-white"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500 text-white";
  };

  const formatImplementationStatus = (status: string) => {
    const labels = {
      fully_implemented: "Fully Implemented",
      in_progress: "In Progress",
      not_implemented: "Not Implemented"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleControlClick = (control: Control) => {
    setSelectedControl(control);
    setIsDetailDialogOpen(true);
  };

  // Delete control mutation
  const deleteControlMutation = useMutation({
    mutationFn: async (controlId: number) => {
      return apiRequest(`/api/controls/${controlId}`, "DELETE");
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

  if (controls.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No controls found</h3>
          <p className="text-muted-foreground">
            No controls match your current filter criteria.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map(control => (
                <TableRow key={control.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{control.name}</div>
                      <div className="text-sm text-muted-foreground">{control.controlId}</div>
                      {control.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {control.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(control.controlType)}>
                      {control.controlType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(control.controlCategory)}>
                      {control.controlCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {(control as any).complianceFramework || 'Custom'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(control.implementationStatus)}>
                      {formatImplementationStatus(control.implementationStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(control.controlEffectiveness || 0) * 10} className="w-16 h-2" />
                      <span className="text-sm">{(control.controlEffectiveness || 0).toFixed(1)}/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCostDisplay(control)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleControlClick(control);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onControlEdit?.(control);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setControlToDelete(control);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Control Detail Dialog */}
      {selectedControl && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedControl.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Control ID:</span> {selectedControl.controlId}</div>
                    <div><span className="font-medium">Type:</span> {selectedControl.controlType}</div>
                    <div><span className="font-medium">Category:</span> {selectedControl.controlCategory}</div>
                    <div><span className="font-medium">Framework:</span> {(selectedControl as any).complianceFramework || 'Custom'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Implementation</h4>
                  <div className="space-y-2">
                    <div><span className="font-medium">Status:</span> {formatImplementationStatus(selectedControl.implementationStatus)}</div>
                    <div><span className="font-medium">Effectiveness:</span> {(selectedControl.controlEffectiveness || 0).toFixed(1)}/10</div>
                    <div><span className="font-medium">Cost:</span> {formatCostDisplay(selectedControl)}</div>
                  </div>
                </div>
              </div>
              {selectedControl.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedControl.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!controlToDelete} 
        onOpenChange={() => setControlToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Control</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{controlToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (controlToDelete) {
                  onControlDelete?.(controlToDelete);
                  setControlToDelete(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}