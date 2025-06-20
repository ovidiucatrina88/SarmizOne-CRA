import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Asset, Risk } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import Layout from "@/components/layout/layout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ExternalLink,
  Plus,
  AlertTriangle,
  Shield,
  Database,
  Server,
  Laptop,
  Network,
  Building,
  User,
  FileText,
} from "lucide-react";
import { RiskForm } from "@/modules/risks/components/risk-form";

export default function AssetDetail() {
  const { assetId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createRiskDialogOpen, setCreateRiskDialogOpen] = useState(false);
  const [selectedRiskTemplate, setSelectedRiskTemplate] = useState<Risk | null>(null);

  // Get assets by ID by first loading all assets and then filtering
  const { data: allAssets, isLoading: isLoadingAllAssets, error: allAssetsError } = useQuery<Asset[]>({
    queryKey: ['/api/assets'],
  });

  // Filter assets to find the one matching the assetId (the user-friendly ID) from URL params
  const asset = React.useMemo(() => {
    if (!allAssets) return null;
    
    // Handle both array and object with data property (API response formats)
    const assets = Array.isArray(allAssets) ? allAssets : allAssets.data || [];
    return assets.find(a => a.assetId === assetId);
  }, [allAssets, assetId]);

  // Derive loading and error states
  const isLoadingAsset = isLoadingAllAssets;
  const assetError = allAssetsError;

  // Fetch risks associated with this asset
  const { data: assetRisksResponse, isLoading: isLoadingRisks } = useQuery({
    queryKey: ['/api/risks'],
    enabled: !!asset,
  });
  
  // Filter risks for this asset
  const assetRisks = React.useMemo(() => {
    if (!assetRisksResponse || !asset) return [];
    
    // Handle both array and object with data property
    const risks = Array.isArray(assetRisksResponse) 
      ? assetRisksResponse 
      : assetRisksResponse.data || [];
      
    return risks.filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(asset.assetId)
    );
  }, [assetRisksResponse, asset]);

  // Fetch risk templates from library
  const { data: riskTemplates, isLoading: isLoadingTemplates } = useQuery<Risk[]>({
    queryKey: ["/api/risk-library"],
  });

  // Create risk from template mutation
  const createRiskFromTemplateMutation = useMutation({
    mutationFn: async (templateId: number) => {
      return apiRequest("POST", `/api/assets/${assetId}/create-risk/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${assetId}/risks`] });
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      toast({
        title: "Success",
        description: "Risk created from template and mapped to this asset",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create risk: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Get icon for asset type
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case "data":
        return <Database className="h-5 w-5 mr-2" />;
      case "application":
        return <Shield className="h-5 w-5 mr-2" />;
      case "device":
        return <Laptop className="h-5 w-5 mr-2" />;
      case "system":
        return <Server className="h-5 w-5 mr-2" />;
      case "network":
        return <Network className="h-5 w-5 mr-2" />;
      case "facility":
        return <Building className="h-5 w-5 mr-2" />;
      case "personnel":
        return <User className="h-5 w-5 mr-2" />;
      default:
        return <FileText className="h-5 w-5 mr-2" />;
    }
  };

  // Handle create risk from template
  const handleCreateRiskFromTemplate = (templateId: number) => {
    createRiskFromTemplateMutation.mutate(templateId);
  };

  // Loading state
  if (isLoadingAsset) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (assetError) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-500">Error loading asset details</h2>
        <p className="mt-2 text-gray-600">
          Please try again later or contact support.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/assets')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
      </div>
    );
  }

  // If asset doesn't exist
  if (!asset) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-amber-500">Asset not found</h2>
        <p className="mt-2 text-gray-600">
          The requested asset could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/assets')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>
      </div>
    );
  }

  // Get CIA rating badge color
  const getCIARatingColor = (rating: string) => {
    switch(rating) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/assets')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Button>
          <h1 className="text-2xl font-bold mt-2 flex items-center">
            {getAssetTypeIcon(asset.type)}
            {asset.name} <span className="ml-2 text-sm text-muted-foreground">({asset.assetId})</span>
          </h1>
        </div>
        <Button 
          onClick={() => navigate('/risk-library')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Risk Library
        </Button>
      </div>

      {/* Asset details card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Business Unit</div>
              <div>{asset.businessUnit || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Owner</div>
              <div>{asset.owner || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">CIA Rating</div>
              <div className="flex space-x-2 mt-1">
                <Badge className={getCIARatingColor(asset.confidentiality)}>
                  Confidentiality: {asset.confidentiality.charAt(0).toUpperCase() + asset.confidentiality.slice(1)}
                </Badge>
                <Badge className={getCIARatingColor(asset.integrity)}>
                  Integrity: {asset.integrity.charAt(0).toUpperCase() + asset.integrity.slice(1)}
                </Badge>
                <Badge className={getCIARatingColor(asset.availability)}>
                  Availability: {asset.availability.charAt(0).toUpperCase() + asset.availability.slice(1)}
                </Badge>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Asset Value</div>
              <div className="text-lg font-semibold">{formatCurrency(Number(asset.assetValue), asset.currency)}</div>
            </div>
            {asset.description && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div className="text-sm mt-1">{asset.description}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risks associated with this asset */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Associated Risks</CardTitle>
              <CardDescription>
                Risks mapped to this asset
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCreateRiskDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Risk from Template
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingRisks ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : assetRisks && assetRisks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Inherent Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetRisks.map((risk) => (
                    <TableRow key={risk.id}>
                      <TableCell className="font-medium">{risk.riskId}</TableCell>
                      <TableCell>{risk.name}</TableCell>
                      <TableCell>
                        <Badge className={`${
                          risk.riskCategory === 'operational' ? 'bg-blue-100 text-blue-800' :
                          risk.riskCategory === 'strategic' ? 'bg-indigo-100 text-indigo-800' :
                          risk.riskCategory === 'compliance' ? 'bg-purple-100 text-purple-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          risk.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          risk.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                          risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(Number(risk.inherentRisk) || 0, 'USD')}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/risks/${risk.id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No risks associated with this asset yet.</div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setCreateRiskDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Risk from Template
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog to select a risk template */}
      <Dialog open={createRiskDialogOpen} onOpenChange={setCreateRiskDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Risk from Template</DialogTitle>
            <DialogDescription>
              Select a risk template to create a risk instance for this asset.
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingTemplates ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : riskTemplates && riskTemplates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.riskId}</TableCell>
                    <TableCell>{template.name}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        template.riskCategory === 'operational' ? 'bg-blue-100 text-blue-800' :
                        template.riskCategory === 'strategic' ? 'bg-indigo-100 text-indigo-800' :
                        template.riskCategory === 'compliance' ? 'bg-purple-100 text-purple-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {template.riskCategory.charAt(0).toUpperCase() + template.riskCategory.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${
                        template.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        template.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                        template.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {template.severity.charAt(0).toUpperCase() + template.severity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleCreateRiskFromTemplate(template.id)}
                      >
                        Add to Asset
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No risk templates available.</div>
              <Button
                onClick={() => {
                  setCreateRiskDialogOpen(false);
                  navigate('/risk-library');
                }}
                className="mt-4"
              >
                Go to Risk Library
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}