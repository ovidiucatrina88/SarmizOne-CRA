import React, { useState, useMemo } from "react";
import { Control } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Shield, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2,
  AlertTriangle 
} from "lucide-react";

interface FrameworkGroupedControlListProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

interface FrameworkControlGroup {
  framework: string;
  frameworkName: string;
  controls: Control[];
  totalCost: number;
  implementationRate: number;
  controlCounts: {
    total: number;
    fully_implemented: number;
    in_progress: number;
    not_implemented: number;
  };
}

export function FrameworkGroupedControlList({ 
  controls, 
  onControlEdit, 
  onControlDelete 
}: FrameworkGroupedControlListProps) {
  const [expandedFrameworks, setExpandedFrameworks] = useState<Set<string>>(new Set());
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getFrameworkDisplayName = (framework: string) => {
    const names = {
      'ISO27001': 'ISO 27001',
      'NIST': 'NIST Cybersecurity Framework',
      'SOC2': 'SOC 2',
      'CIS': 'CIS Controls',
      'Custom': 'Custom Controls'
    };
    return names[framework as keyof typeof names] || framework;
  };

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

  // Group controls by framework
  const frameworkGroups = useMemo(() => {
    const groups = new Map<string, FrameworkControlGroup>();
    
    controls.forEach(control => {
      const framework = (control as any).complianceFramework || 'Custom';
      const frameworkName = getFrameworkDisplayName(framework);

      if (!groups.has(framework)) {
        groups.set(framework, {
          framework,
          frameworkName,
          controls: [],
          totalCost: 0,
          implementationRate: 0,
          controlCounts: {
            total: 0,
            fully_implemented: 0,
            in_progress: 0,
            not_implemented: 0
          }
        });
      }
      
      const group = groups.get(framework)!;
      group.controls.push(control);
      group.totalCost += calculateControlCost(control);
      
      // Update counts
      group.controlCounts.total++;
      group.controlCounts[control.implementationStatus as keyof typeof group.controlCounts]++;
    });

    // Calculate implementation rates
    groups.forEach(group => {
      const implementedCount = group.controlCounts.fully_implemented + (group.controlCounts.in_progress * 0.5);
      group.implementationRate = (implementedCount / group.controlCounts.total) * 100;
    });

    return Array.from(groups.values())
      .sort((a, b) => {
        // Sort by implementation rate (highest first), then by name
        if (b.implementationRate !== a.implementationRate) {
          return b.implementationRate - a.implementationRate;
        }
        return a.frameworkName.localeCompare(b.frameworkName);
      });
  }, [controls]);

  const toggleFrameworkExpansion = (framework: string) => {
    const newExpanded = new Set(expandedFrameworks);
    if (newExpanded.has(framework)) {
      newExpanded.delete(framework);
    } else {
      newExpanded.add(framework);
    }
    setExpandedFrameworks(newExpanded);
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

  return (
    <div className="space-y-4">
      {frameworkGroups.length === 0 ? (
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
        frameworkGroups.map(group => (
          <Card key={group.framework} className="overflow-hidden">
            <Collapsible 
              open={expandedFrameworks.has(group.framework)}
              onOpenChange={() => toggleFrameworkExpansion(group.framework)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedFrameworks.has(group.framework) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{group.frameworkName}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {group.controlCounts.total} control{group.controlCounts.total !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Total Cost: {formatCurrency(group.totalCost)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Implementation:</span>
                            <Progress value={group.implementationRate} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {group.implementationRate.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
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