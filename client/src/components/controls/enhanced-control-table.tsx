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
      <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-600">
              <TableHead className="text-gray-300">Control</TableHead>
              <TableHead className="text-gray-300">Type</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Framework</TableHead>
              <TableHead className="text-gray-300">Cloud Domain</TableHead>
              <TableHead className="text-gray-300">Compliance Mappings</TableHead>
              <TableHead className="text-gray-300">Associated Risks</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Effectiveness</TableHead>
              <TableHead className="text-gray-300">Cost</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map(control => (
              <TableRow key={control.id} className="cursor-pointer hover:bg-gray-700 border-gray-600">
                <TableCell className="text-white">
                  <div>
                    <div className="font-medium">{control.name}</div>
                    <div className="text-sm text-gray-400">{control.controlId}</div>
                    {control.description && (
                      <div className="text-sm text-gray-400 line-clamp-2 mt-1">
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
                  <Badge variant="outline" className="text-gray-300 border-gray-500">
                    {(control as any).complianceFramework || 'Custom'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {(control as any).cloudDomain ? (
                    <Badge variant="secondary" className="bg-blue-600 text-blue-100">
                      {(control as any).cloudDomain}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(control as any).nistMappings && (control as any).nistMappings.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-green-600 text-green-100 border-green-500">
                        NIST ({(control as any).nistMappings.length})
                      </Badge>
                    )}
                    {(control as any).pciMappings && (control as any).pciMappings.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-purple-600 text-purple-100 border-purple-500">
                        PCI ({(control as any).pciMappings.length})
                      </Badge>
                    )}
                    {(control as any).cisMappings && (control as any).cisMappings.length > 0 && (
                      <Badge variant="outline" className="text-xs bg-orange-600 text-orange-100 border-orange-500">
                        CIS ({(control as any).cisMappings.length})
                      </Badge>
                    )}
                    {!(control as any).nistMappings?.length && !(control as any).pciMappings?.length && !(control as any).cisMappings?.length && (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {control.associatedRisks && control.associatedRisks.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {control.associatedRisks.slice(0, 2).map(riskId => (
                        <Badge key={riskId} variant="secondary" className="text-xs bg-gray-600 text-gray-200">
                          {riskId}
                        </Badge>
                      ))}
                      {control.associatedRisks.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-200">
                          +{control.associatedRisks.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(control.implementationStatus)}>
                    {formatImplementationStatus(control.implementationStatus)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={(control.controlEffectiveness || 0) * 10} className="w-16 h-2" />
                    <span className="text-sm text-gray-300">{(control.controlEffectiveness || 0).toFixed(1)}/10</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
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
                      className="text-gray-400 hover:text-white hover:bg-gray-600"
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
                      className="text-gray-400 hover:text-white hover:bg-gray-600"
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
                      className="text-red-400 hover:text-red-300 hover:bg-gray-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Control Detail Dialog */}
      {selectedControl && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedControl.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="text-gray-300"><span className="font-medium text-white">Control ID:</span> {selectedControl.controlId}</div>
                    <div className="text-gray-300"><span className="font-medium text-white">Type:</span> {selectedControl.controlType}</div>
                    <div className="text-gray-300"><span className="font-medium text-white">Category:</span> {selectedControl.controlCategory}</div>
                    <div className="text-gray-300"><span className="font-medium text-white">Framework:</span> {(selectedControl as any).complianceFramework || 'Custom'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-white">Implementation</h4>
                  <div className="space-y-2">
                    <div className="text-gray-300"><span className="font-medium text-white">Status:</span> {formatImplementationStatus(selectedControl.implementationStatus)}</div>
                    <div className="text-gray-300"><span className="font-medium text-white">Effectiveness:</span> {(selectedControl.controlEffectiveness || 0).toFixed(1)}/10</div>
                    <div className="text-gray-300"><span className="font-medium text-white">Cost:</span> {formatCostDisplay(selectedControl)}</div>
                  </div>
                </div>
              </div>
              {selectedControl.description && (
                <div>
                  <h4 className="font-semibold mb-2 text-white">Description</h4>
                  <p className="text-gray-400">{selectedControl.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2 text-white">Associated Risks</h4>
                {selectedControl.associatedRisks && selectedControl.associatedRisks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedControl.associatedRisks.map(riskId => (
                      <Badge key={riskId} variant="outline" className="text-gray-300 border-gray-500">
                        Risk ID: {riskId}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No risks associated</p>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!controlToDelete} 
        onOpenChange={() => setControlToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Control</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{controlToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500">Cancel</AlertDialogCancel>
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