import React, { useState, useMemo } from "react";
import { Risk } from "@shared/schema";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { RiskDetailView } from "@/components/risks/risk-detail-view";
import { Link } from "wouter";

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
} from "@/components/ui/dialog";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Edit, 
  Trash2, 
  Search, 
  Calculator, 
  ExternalLink, 
  Shield, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  Building2,
  Filter,
  X
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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500 text-white';
    case 'high': return 'bg-orange-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getSeverityPriority = (severity: string): number => {
  switch (severity) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};

export function AssetGroupedRiskList({ 
  risks, 
  onRiskSelect, 
  onRiskEdit, 
  onRiskDelete 
}: AssetGroupedRiskListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [assetFilter, setAssetFilter] = useState<string>("all");
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

  // Group risks by assets
  const assetGroups = useMemo(() => {
    const groups = new Map<string, AssetRiskGroup>();

    risks.forEach(risk => {
      const associatedAssets = Array.isArray(risk.associatedAssets) 
        ? risk.associatedAssets 
        : typeof risk.associatedAssets === 'string' 
          ? risk.associatedAssets.split(',').map(a => a.trim())
          : [];

      // If no associated assets, create an "Unassigned" group
      if (associatedAssets.length === 0) {
        const groupKey = "unassigned";
        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            assetId: groupKey,
            assetName: "Unassigned Risks",
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
          if (getSeverityPriority(severity) > getSeverityPriority(group.highestSeverity)) {
            group.highestSeverity = severity;
          }
        }
      } else {
        // Create groups for each associated asset
        associatedAssets.forEach(assetId => {
          if (!groups.has(assetId)) {
            groups.set(assetId, {
              assetId,
              assetName: assetLookup.get(assetId) || assetId,
              risks: [],
              totalExposure: 0,
              highestSeverity: 'low',
              riskCounts: { critical: 0, high: 0, medium: 0, low: 0 }
            });
          }
          
          const group = groups.get(assetId)!;
          group.risks.push(risk);
          group.totalExposure += risk.residualRisk || 0;
          
          // Update severity counts and highest severity
          const severity = risk.severity as keyof typeof group.riskCounts;
          if (severity in group.riskCounts) {
            group.riskCounts[severity]++;
            if (getSeverityPriority(severity) > getSeverityPriority(group.highestSeverity)) {
              group.highestSeverity = severity;
            }
          }
        });
      }
    });

    return Array.from(groups.values());
  }, [risks, assetLookup]);

  // Apply filters
  const filteredGroups = useMemo(() => {
    return assetGroups.filter(group => {
      // Asset filter
      if (assetFilter !== "all" && group.assetId !== assetFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesAsset = group.assetName.toLowerCase().includes(searchLower);
        const matchesRisk = group.risks.some(risk => 
          risk.name.toLowerCase().includes(searchLower) ||
          risk.description.toLowerCase().includes(searchLower)
        );
        if (!matchesAsset && !matchesRisk) {
          return false;
        }
      }

      // Filter risks within each group
      group.risks = group.risks.filter(risk => {
        // Severity filter
        if (severityFilter !== "all" && risk.severity !== severityFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== "all" && risk.riskCategory !== categoryFilter) {
          return false;
        }

        return true;
      });

      // Only include groups that have risks after filtering
      return group.risks.length > 0;
    });
  }, [assetGroups, searchTerm, severityFilter, categoryFilter, assetFilter]);

  // Sort groups by highest severity and total exposure
  const sortedGroups = useMemo(() => {
    return [...filteredGroups].sort((a, b) => {
      const severityDiff = getSeverityPriority(b.highestSeverity) - getSeverityPriority(a.highestSeverity);
      if (severityDiff !== 0) return severityDiff;
      return b.totalExposure - a.totalExposure;
    });
  }, [filteredGroups]);

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

  // Get unique values for filters
  const uniqueAssets = useMemo(() => {
    return Array.from(new Set(assetGroups.map(group => group.assetId)))
      .map(assetId => ({
        id: assetId,
        name: assetGroups.find(g => g.assetId === assetId)?.assetName || assetId
      }));
  }, [assetGroups]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(risks.map(risk => risk.riskCategory).filter(Boolean)));
  }, [risks]);

  const clearFilters = () => {
    setSearchTerm("");
    setSeverityFilter("all");
    setCategoryFilter("all");
    setAssetFilter("all");
  };

  const hasActiveFilters = searchTerm || severityFilter !== "all" || categoryFilter !== "all" || assetFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Risk Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search risks or assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Asset Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset</label>
              <Select value={assetFilter} onValueChange={setAssetFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {uniqueAssets.map(asset => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="h-8"
              >
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {sortedGroups.length} asset group(s)
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asset Groups */}
      <div className="space-y-4">
        {sortedGroups.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No risks found</h3>
              <p className="text-muted-foreground">
                No risks match your current filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedGroups.map(group => (
            <Card key={group.assetId} className="overflow-hidden">
              <Collapsible 
                open={expandedAssets.has(group.assetId)}
                onOpenChange={() => toggleAssetExpansion(group.assetId)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedAssets.has(group.assetId) ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">{group.assetName}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {group.risks.length} risk{group.risks.length !== 1 ? 's' : ''}
                            </Badge>
                            <Badge className={`text-xs ${getSeverityColor(group.highestSeverity)}`}>
                              Highest: {group.highestSeverity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
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
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Risk</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Residual Risk</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.risks.map(risk => (
                          <TableRow key={risk.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <div>
                                <div className="font-medium">{risk.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-2">
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
                              <Badge variant="outline">{risk.riskCategory}</Badge>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(risk.residualRisk || 0)}
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
      </div>

      {/* Risk Detail Dialog */}
      {selectedRisk && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRisk.name}</DialogTitle>
            </DialogHeader>
            <RiskDetailView risk={selectedRisk} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!riskToDelete} 
        onOpenChange={() => setRiskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Risk</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{riskToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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