import React, { useState, useMemo } from "react";
import { Control, Risk } from "@shared/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2,
  AlertTriangle 
} from "lucide-react";

interface RiskGroupedControlListProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

interface RiskControlGroup {
  riskId: string;
  riskName: string;
  controls: Control[];
  totalCost: number;
  averageEffectiveness: number;
  implementationRate: number;
  controlCounts: {
    total: number;
    fully_implemented: number;
    in_progress: number;
    not_implemented: number;
  };
  riskSeverity: string;
  residualRisk: number;
}

export function RiskGroupedControlList({ 
  controls, 
  onControlEdit, 
  onControlDelete 
}: RiskGroupedControlListProps) {
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch risks for risk names and details
  const { data: risksResponse } = useQuery({
    queryKey: ["/api/risks"],
  });
  const risks = (risksResponse as any)?.data || [];

  // Create risk lookup map
  const riskLookup = useMemo(() => {
    const lookup = new Map();
    risks.forEach((risk: Risk) => {
      lookup.set(risk.riskId, {
        name: risk.name,
        severity: risk.severity,
        residualRisk: Number(risk.residualRisk) || 0
      });
    });
    return lookup;
  }, [risks]);

  // Group controls by associated risks
  const riskGroups = useMemo(() => {
    const groups = new Map<string, RiskControlGroup>();
    
    controls.forEach(control => {
      const associatedRisks = Array.isArray(control.associatedRisks) 
        ? control.associatedRisks 
        : typeof control.associatedRisks === 'string' 
          ? (control.associatedRisks as string).split(',').map((r: string) => r.trim())
          : [];

      // If no associated risks, group under "Unassigned"
      const risksToProcess = associatedRisks.length > 0 ? associatedRisks : ['unassigned'];

      risksToProcess.forEach((riskId: any) => {
        const groupKey = riskId;
        const riskInfo = riskId === 'unassigned' 
          ? { name: 'Unassigned Controls', severity: 'low', residualRisk: 0 }
          : (riskLookup.get(riskId) || { name: riskId, severity: 'low', residualRisk: 0 });

        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            riskId: groupKey,
            riskName: riskInfo.name,
            controls: [],
            totalCost: 0,
            averageEffectiveness: 0,
            implementationRate: 0,
            controlCounts: {
              total: 0,
              fully_implemented: 0,
              in_progress: 0,
              not_implemented: 0
            },
            riskSeverity: riskInfo.severity,
            residualRisk: riskInfo.residualRisk
          });
        }
        
        const group = groups.get(groupKey)!;
        group.controls.push(control);
        group.totalCost += calculateControlCost(control);
        
        // Update counts
        group.controlCounts.total++;
        group.controlCounts[control.implementationStatus as keyof typeof group.controlCounts]++;
      });
    });

    // Calculate averages and rates
    groups.forEach(group => {
      const implementedCount = group.controlCounts.fully_implemented + (group.controlCounts.in_progress * 0.5);
      group.implementationRate = (implementedCount / group.controlCounts.total) * 100;
      
      const totalEffectiveness = group.controls.reduce((sum, control) => sum + (control.controlEffectiveness || 0), 0);
      group.averageEffectiveness = totalEffectiveness / group.controls.length;
    });

    return Array.from(groups.values())
      .sort((a, b) => {
        // Sort by residual risk (highest first), then by implementation rate (lowest first)
        if (b.residualRisk !== a.residualRisk) {
          return b.residualRisk - a.residualRisk;
        }
        return a.implementationRate - b.implementationRate;
      });
  }, [controls, riskLookup]);

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

  const toggleRiskExpansion = (riskId: string) => {
    const newExpanded = new Set(expandedRisks);
    if (newExpanded.has(riskId)) {
      newExpanded.delete(riskId);
    } else {
      newExpanded.add(riskId);
    }
    setExpandedRisks(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-500 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-black",
      low: "bg-green-500 text-white"
    };
    return colors[severity as keyof typeof colors] || "bg-gray-500 text-white";
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

  const formatImplementationStatus = (status: string) => {
    const labels = {
      fully_implemented: "Fully Implemented",
      in_progress: "In Progress",
      not_implemented: "Not Implemented"
    };
    return labels[status as keyof typeof labels] || status;
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

  return (
    <div className="space-y-4">
      {riskGroups.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No controls found</h3>
            <p className="text-muted-foreground">
              No controls match your current filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        riskGroups.map(group => (
          <Card key={group.riskId} className="overflow-hidden">
            <Collapsible 
              open={expandedRisks.has(group.riskId)}
              onOpenChange={() => toggleRiskExpansion(group.riskId)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedRisks.has(group.riskId) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{group.riskName}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {group.controlCounts.total} control{group.controlCounts.total !== 1 ? 's' : ''}
                          </Badge>
                          <Badge className={`text-xs ${getSeverityColor(group.riskSeverity)}`}>
                            {group.riskSeverity} severity
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Total Cost: {formatCurrency(group.totalCost)}
                          </span>
                          {group.riskId !== 'unassigned' && (
                            <span className="text-sm text-muted-foreground">
                              Risk Exposure: {formatCurrency(group.residualRisk)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Implementation:</span>
                        <Progress value={group.implementationRate} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">
                          {group.implementationRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.controlCounts.fully_implemented > 0 && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {group.controlCounts.fully_implemented} Implemented
                          </Badge>
                        )}
                        {group.controlCounts.in_progress > 0 && (
                          <Badge className="bg-yellow-500 text-black text-xs">
                            {group.controlCounts.in_progress} In Progress
                          </Badge>
                        )}
                        {group.controlCounts.not_implemented > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {group.controlCounts.not_implemented} Not Implemented
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Control</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Effectiveness</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.controls.map(control => (
                        <TableRow key={control.id} className="hover:bg-muted/50">
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
                            {formatCurrency(calculateControlCost(control))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onControlEdit?.(control)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setControlToDelete(control)}
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
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))
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