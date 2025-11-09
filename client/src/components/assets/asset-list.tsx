import React, { useState, useEffect } from "react";
import { Asset } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useLocation } from "wouter";

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
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, ExternalLink, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlowCard } from "@/components/ui/glow-card";

type AssetListProps = {
  assets: Asset[] | any;
  onEdit: (asset: Asset) => void;
};

export function AssetList({ assets, onEdit }: AssetListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  // Get the risk template ID from URL if it exists
  const queryParams = new URLSearchParams(window.location.search);
  const selectForRiskId = queryParams.get('selectForRisk');
  
  // Create risk from template mutation
  const createRiskFromTemplateMutation = useMutation({
    mutationFn: async (assetId: string) => {
      if (!selectForRiskId) return null;
      
      const response = await fetch(`/api/risks/from-template/${selectForRiskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assetId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create risk from template');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/risks'] });
      
      if (data?.id) {
        toast({
          title: "Risk created successfully",
          description: "A new risk instance has been created from the template."
        });
        
        // Navigate to the newly created risk
        navigate(`/risks/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error creating risk",
        description: error.message || "Failed to create risk from template",
        variant: "destructive"
      });
    }
  });
  
  // Function to handle asset selection for risk template
  const handleSelectAssetForRisk = (asset: Asset) => {
    if (selectForRiskId) {
      createRiskFromTemplateMutation.mutate(asset.assetId);
    }
  };
  
  const itemsPerPage = 10;

  // Filter assets based on search query and filter type
  const filteredAssets = assets?.filter((asset: Asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.business_unit?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      asset.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || asset.type === filterType;
    
    return matchesSearch && matchesType;
  }) || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle asset deletion confirmation
  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteConfirmOpen(true);
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (assetId: number) => {
      return apiRequest("DELETE", `/api/assets/${assetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      toast({
        title: "Asset deleted",
        description: "The asset has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete asset: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Execute asset deletion
  const confirmDelete = () => {
    if (assetToDelete) {
      deleteMutation.mutate(assetToDelete.id);
    }
    setDeleteConfirmOpen(false);
  };
  
  const getCIARatingColor = (rating: string) => {
    switch (rating) {
      case "high":
        return "border-rose-400/40 bg-rose-500/15 text-rose-100";
      case "medium":
        return "border-amber-400/40 bg-amber-500/15 text-amber-100";
      case "low":
        return "border-emerald-400/40 bg-emerald-500/15 text-emerald-100";
      default:
        return "border-white/10 bg-white/5 text-white/70";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "border-emerald-400/40 bg-emerald-500/15 text-emerald-100";
      case "Decommissioned":
        return "border-rose-400/40 bg-rose-500/15 text-rose-100";
      case "To Adopt":
        return "border-sky-400/40 bg-sky-500/15 text-sky-100";
      default:
        return "border-white/10 bg-white/5 text-white/70";
    }
  };
  
  // Using the imported formatCurrency function

  return (
    <>
      <GlowCard className="p-0">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                type="search"
                placeholder="Search assets by name, ID, or owner"
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48 rounded-2xl border border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-surface-muted text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="application">Application</SelectItem>
                <SelectItem value="device">Device</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="facility">Facility</SelectItem>
                <SelectItem value="personnel">Personnel</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-0">
          {paginatedAssets.length > 0 ? (
            <>
              <div className="border-b border-white/5 bg-white/5 px-6 py-3">
                <div className="grid grid-cols-5 gap-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <div>Asset Information</div>
                  <div>Type & Status</div>
                  <div>Business Details</div>
                  <div>CIA Rating</div>
                  <div className="text-right">Value & Actions</div>
                </div>
              </div>
              
              <div className="divide-y divide-white/5">
                {paginatedAssets.map((asset: Asset) => {
                  const getAssetTypeAbbr = (type: string) => {
                    switch(type) {
                      case 'application': return 'APP';
                      case 'data': return 'DATA';
                      case 'device': return 'DEV';
                      case 'system': return 'SYS';
                      case 'network': return 'NET';
                      case 'facility': return 'FAC';
                      case 'personnel': return 'PER';
                      default: return 'OTH';
                    }
                  };
                  
                  return (
                    <div key={asset.id} className="px-6 py-4 transition-colors hover:bg-white/5">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        {/* Asset Information */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                              <span className="text-xs font-semibold text-white">{getAssetTypeAbbr(asset.type)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{asset.name}</div>
                            <div className="text-xs text-white/50">ID: {asset.assetId}</div>
                          </div>
                        </div>

                        {/* Type & Status */}
                        <div>
                          <div className="text-sm text-white/80 capitalize">{asset.type}</div>
                          <Badge className={`mt-2 border ${getStatusColor(asset.status || "Active")}`}>
                            {asset.status || "Active"}
                          </Badge>
                        </div>

                        <div>
                          <div className="text-sm text-white/85">{asset.business_unit || "N/A"}</div>
                          <div className="text-xs text-white/50">Owner: {asset.owner}</div>
                        </div>

                        <div className="flex space-x-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCIARatingColor(
                              asset.confidentiality,
                            )}`}
                          >
                            C:{asset.confidentiality.charAt(0).toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCIARatingColor(
                              asset.integrity,
                            )}`}
                          >
                            I:{asset.integrity.charAt(0).toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCIARatingColor(
                              asset.availability,
                            )}`}
                          >
                            A:{asset.availability.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Value & Actions */}
                        <div className="flex items-center justify-end space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-emerald-200">
                              {formatCurrency(Number(asset.assetValue), asset.currency)}
                            </div>
                            <div className="text-xs text-white/40">{asset.currency} value</div>
                          </div>
                          <div className="flex space-x-1">
                            {selectForRiskId ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSelectAssetForRisk(asset)}
                                disabled={createRiskFromTemplateMutation.isPending}
                                className="rounded-full bg-primary px-4 text-primary-foreground"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Select
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/assets/${asset.assetId}`)}
                                  className="rounded-full border border-white/10 text-white hover:bg-white/10"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(asset)}
                                  className="rounded-full text-white hover:bg-white/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(asset)}
                                  className="rounded-full text-white hover:bg-rose-500/20 hover:text-rose-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-400">No assets found.</div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 border-t border-white/5 bg-white/5 px-6 py-4">
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
              This will permanently delete the asset &quot;{assetToDelete?.name}&quot; ({assetToDelete?.assetId}).
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
    </>
  );
}
