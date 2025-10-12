import React, { useState, useMemo } from "react";
import { Risk } from "@shared/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { RiskDetailView } from "@/components/risks/risk-detail-view";
import { RiskFiltersComponent, RiskFilters } from "./risk-filters";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  ExternalLink, 
  Trash2,
  AlertTriangle 
} from "lucide-react";

interface AssetGroupedRiskListProps {
  risks: Risk[];
  onRiskSelect?: (risk: Risk) => void;
  onRiskEdit?: (risk: Risk) => void;
  onRiskDelete?: (risk: Risk) => void;
}

interface AssetRiskGroup {
  assetId: string;
  assetName: string;
  risks: Risk[];
  totalExposure: number;
  highestSeverity: 'low' | 'medium' | 'high' | 'critical';
  riskCounts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function EnhancedAssetGroupedRiskList({ 
  risks, 
  onRiskSelect, 
  onRiskEdit, 
  onRiskDelete 
}: AssetGroupedRiskListProps) {
  const [filters, setFilters] = useState<RiskFilters>({
    asset: '',
    severity: '',
    category: ''
  });
  const [expandedAssets, setExpandedAssets] = useState<Set<string>>(new Set());
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [riskToDelete, setRiskToDelete] = useState<Risk | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch assets for asset names
  const { data: assetsResponse } = useQuery({
    queryKey: ["/api/assets"],
  });
  const assets = (assetsResponse as any)?.data || [];

  // Create asset lookup map
  const assetLookup = useMemo(() => {
    const lookup = new Map();
    assets.forEach((asset: any) => {
      lookup.set(asset.assetId, asset.name);
    });
    return lookup;
  }, [assets]);

  // Filter risks based on current filters
  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      // Asset filter
      if (filters.asset) {
        const associatedAssets = Array.isArray(risk.associatedAssets) 
          ? risk.associatedAssets 
          : typeof risk.associatedAssets === 'string' 
            ? (risk.associatedAssets as string).split(',').map((a: string) => a.trim())
            : [];
        if (!associatedAssets.includes(filters.asset)) {
          return false;
        }
      }

      // Severity filter
      if (filters.severity && risk.severity !== filters.severity) {
        return false;
      }

      // Category filter
      if (filters.category && risk.riskCategory !== filters.category) {
        return false;
      }

      return true;
    });
  }, [risks, filters]);

  // Group filtered risks by asset
  const assetGroups = useMemo(() => {
    const groups = new Map<string, AssetRiskGroup>();
    
    filteredRisks.forEach(risk => {
      const associatedAssets = Array.isArray(risk.associatedAssets) 
        ? risk.associatedAssets 
        : typeof risk.associatedAssets === 'string' 
          ? (risk.associatedAssets as string).split(',').map((a: string) => a.trim())
          : [];

      // If no associated assets, group under "Unassigned"
      const assetsToProcess = associatedAssets.length > 0 ? associatedAssets : ['unassigned'];

      assetsToProcess.forEach((assetId: any) => {
        const groupKey = assetId;
        const assetName = assetId === 'unassigned' ? 'Unassigned Assets' : (assetLookup.get(assetId) || assetId);

        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            assetId: groupKey,
            assetName,
            risks: [],
            totalExposure: 0,
            highestSeverity: 'low',
            riskCounts: { critical: 0, high: 0, medium: 0, low: 0 }
          });
        }
        
        const group = groups.get(groupKey)!;
        group.risks.push(risk);
        group.totalExposure += Number(risk.residualRisk) || 0;
        
        // Update severity counts and highest severity
        const severity = risk.severity as keyof typeof group.riskCounts;
        if (severity in group.riskCounts) {
          group.riskCounts[severity]++;
          
          // Update highest severity (priority: critical > high > medium > low)
          const severityPriority = { critical: 4, high: 3, medium: 2, low: 1 };
          const currentPriority = severityPriority[group.highestSeverity as keyof typeof severityPriority] || 0;
          const riskPriority = severityPriority[severity];
          
          if (riskPriority > currentPriority) {
            group.highestSeverity = severity;
          }
        }
      });
    });

    return Array.from(groups.values())
      .sort((a, b) => {
        // Sort by total exposure (highest first), then by name
        if (b.totalExposure !== a.totalExposure) {
          return b.totalExposure - a.totalExposure;
        }
        return a.assetName.localeCompare(b.assetName);
      });
  }, [filteredRisks, assetLookup]);

  // Available assets for filter dropdown
  const availableAssets = useMemo(() => {
    return assets.map((asset: any) => ({
      assetId: asset.assetId,
      name: asset.name
    }));
  }, [assets]);

  // Risk counts for filter summary
  const riskCounts = useMemo(() => {
    return {
      total: risks.length,
      filtered: filteredRisks.length
    };
  }, [risks.length, filteredRisks.length]);

  const toggleAssetExpansion = (assetId: string) => {
    const newExpanded = new Set(expandedAssets);
    if (newExpanded.has(assetId)) {
      newExpanded.delete(assetId);
    } else {
      newExpanded.add(assetId);
    }
    setExpandedAssets(newExpanded);
  };

  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsDetailDialogOpen(true);
    onRiskSelect?.(risk);
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

  // Delete risk mutation
  const deleteRiskMutation = useMutation({
    mutationFn: async (riskId: number) => {
      return apiRequest("DELETE", `/api/risks/${riskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      toast({
        title: "Risk deleted",
        description: "The risk has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete risk",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <RiskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        availableAssets={availableAssets}
        riskCounts={riskCounts}
      />

      {/* Asset Groups */}
      <div className="space-y-4">
        {assetGroups.length === 0 ? (
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2 text-white">No risks found</h3>
              <p className="text-gray-400">
                No risks match your current filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          assetGroups.map(group => (
            <Card key={group.assetId} className="overflow-hidden bg-gray-800 border-gray-600">
              <Collapsible 
                open={expandedAssets.has(group.assetId)}
                onOpenChange={() => toggleAssetExpansion(group.assetId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-700 transition-colors bg-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedAssets.has(group.assetId) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <div>
                          <CardTitle className="text-lg text-white">{group.assetName}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                              {group.risks.length} risk{group.risks.length !== 1 ? 's' : ''}
                            </Badge>
                            <Badge className={`text-xs ${getSeverityColor(group.highestSeverity)}`}>
                              Highest: {group.highestSeverity}
                            </Badge>
                            <span className="text-sm text-gray-300">
                              Total Exposure: {formatCurrency(group.totalExposure)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {group.riskCounts.critical > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {group.riskCounts.critical} Critical
                          </Badge>
                        )}
                        {group.riskCounts.high > 0 && (
                          <Badge className="bg-orange-500 text-white text-xs">
                            {group.riskCounts.high} High
                          </Badge>
                        )}
                        {group.riskCounts.medium > 0 && (
                          <Badge className="bg-yellow-500 text-black text-xs">
                            {group.riskCounts.medium} Medium
                          </Badge>
                        )}
                        {group.riskCounts.low > 0 && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {group.riskCounts.low} Low
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0 bg-gray-800">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600 hover:bg-transparent">
                          <TableHead className="text-gray-300">Risk</TableHead>
                          <TableHead className="text-gray-300">Severity</TableHead>
                          <TableHead className="text-gray-300">Category</TableHead>
                          <TableHead className="text-gray-300">Residual Risk</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.risks.map(risk => (
                          <TableRow key={risk.id} className="cursor-pointer hover:bg-gray-700 border-gray-600">
                            <TableCell>
                              <div>
                                <div className="font-medium text-white">{risk.name}</div>
                                <div className="text-sm text-gray-400 line-clamp-2">
                                  {risk.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-gray-500 text-gray-300">{risk.riskCategory}</Badge>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {formatCurrency(Number(risk.residualRisk) || 0)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRiskClick(risk);
                                  }}
                                  className="text-gray-300 hover:bg-gray-600"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRiskEdit?.(risk);
                                  }}
                                  className="text-gray-300 hover:bg-gray-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRiskToDelete(risk);
                                  }}
                                  className="text-gray-300 hover:bg-gray-600 hover:text-red-400"
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
      </div>

      {/* Risk Detail Dialog */}
      {selectedRisk && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-600">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedRisk.name}</DialogTitle>
            </DialogHeader>
            <RiskDetailView risk={selectedRisk} onBack={() => setIsDetailDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!riskToDelete} 
        onOpenChange={() => setRiskToDelete(null)}
      >
        <AlertDialogContent className="bg-gray-800 border-gray-600">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Risk</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{riskToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (riskToDelete) {
                  onRiskDelete?.(riskToDelete);
                  setRiskToDelete(null);
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