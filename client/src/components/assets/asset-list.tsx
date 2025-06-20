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
  
  // Get CIA rating badge color
  const getCIARatingColor = (rating: string) => {
    switch(rating) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get asset status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Decommissioned": return "bg-red-100 text-red-800";
      case "To Adopt": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Using the imported formatCurrency function

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
                placeholder="Search assets..."
                className="w-full pl-8 bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
              <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-600">All Types</SelectItem>
                <SelectItem value="data" className="text-white hover:bg-gray-600">Data</SelectItem>
                <SelectItem value="application" className="text-white hover:bg-gray-600">Application</SelectItem>
                <SelectItem value="device" className="text-white hover:bg-gray-600">Device</SelectItem>
                <SelectItem value="system" className="text-white hover:bg-gray-600">System</SelectItem>
                <SelectItem value="network" className="text-white hover:bg-gray-600">Network</SelectItem>
                <SelectItem value="facility" className="text-white hover:bg-gray-600">Facility</SelectItem>
                <SelectItem value="personnel" className="text-white hover:bg-gray-600">Personnel</SelectItem>
                <SelectItem value="other" className="text-white hover:bg-gray-600">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-0">
          {paginatedAssets.length > 0 ? (
            <>
              {/* Grid Header */}
              <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
                <div className="grid grid-cols-5 gap-4 text-xs font-medium text-gray-300 uppercase tracking-wider">
                  <div>Asset Information</div>
                  <div>Type & Status</div>
                  <div>Business Details</div>
                  <div>CIA Rating</div>
                  <div className="text-right">Value & Actions</div>
                </div>
              </div>
              
              {/* Asset rows */}
              <div className="divide-y divide-gray-600">
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
                    <div key={asset.id} className="px-6 py-4 hover:bg-gray-700 transition-colors">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        {/* Asset Information */}
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                              <span className="text-xs font-medium text-gray-200">{getAssetTypeAbbr(asset.type)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-white text-sm">{asset.name}</div>
                            <div className="text-xs text-gray-400">ID: {asset.assetId}</div>
                          </div>
                        </div>

                        {/* Type & Status */}
                        <div>
                          <div className="text-sm text-gray-300 capitalize">{asset.type}</div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(asset.status || "Active")}`}>
                              {asset.status || "Active"}
                            </span>
                          </div>
                        </div>

                        {/* Business Details */}
                        <div>
                          <div className="text-sm text-gray-300">{asset.business_unit || 'N/A'}</div>
                          <div className="text-xs text-gray-400">Owner: {asset.owner}</div>
                        </div>

                        {/* CIA Rating */}
                        <div className="flex space-x-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCIARatingColor(asset.confidentiality)}`}>
                            C:{asset.confidentiality.charAt(0).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCIARatingColor(asset.integrity)}`}>
                            I:{asset.integrity.charAt(0).toUpperCase()}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCIARatingColor(asset.availability)}`}>
                            A:{asset.availability.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Value & Actions */}
                        <div className="flex items-center justify-end space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-400">
                              {formatCurrency(Number(asset.assetValue), asset.currency)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {asset.currency} value
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {selectForRiskId ? (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSelectAssetForRisk(asset)}
                                disabled={createRiskFromTemplateMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Select
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/assets/${asset.assetId}`)}
                                  className="border-gray-500 text-gray-300 hover:bg-gray-600"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEdit(asset)}
                                  className="text-gray-300 hover:bg-gray-600"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(asset)}
                                  className="text-gray-300 hover:bg-gray-600 hover:text-red-400"
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
