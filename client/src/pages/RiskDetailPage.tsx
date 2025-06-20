import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Risk, Control, Asset } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskOverview } from "@/modules/risks/components/risk-overview";
import { VulnerabilityMetrics } from "@/modules/risks/components/vulnerability-metrics";
import { RiskCostAssignment } from "@/modules/risks/components/risk-cost-assignment";
import {
  ChevronLeft,
  Eye,
  Loader,
  PenLine,
  BarChart,
  Shield,
  CheckCircle2,
  AlertCircle,
  Bug,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@shared/utils/calculations";
import { Badge } from "@/components/ui/badge";
import { RiskForm } from "@/modules/risks/components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Layout from "@/components/layout/layout";

export default function RiskDetailPage() {
  const { id } = useParams();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch assets for agent capacity calculations
  const { data: assets } = useQuery({
    queryKey: ["/api/assets"],
  });

  // Calculate total asset capacity including hierarchy
  const calculateTotalAssetCapacity = (assetIds: string[]) => {
    if (!assets?.data || !assetIds || assetIds.length === 0) return 0;
    
    let totalCapacity = 0;
    const processedAssets = new Set();
    
    assetIds.forEach(assetId => {
      if (!processedAssets.has(assetId)) {
        const hierarchyCapacity = calculateAssetHierarchyCapacity(assetId, assets.data);
        totalCapacity += hierarchyCapacity;
        processedAssets.add(assetId);
      }
    });
    
    return totalCapacity;
  };

  // Calculate agent capacity for an asset and its entire hierarchy tree
  const calculateAssetHierarchyCapacity = (rootAssetId: string, allAssets: any[]) => {
    let hierarchyCapacity = 0;
    const processedInHierarchy = new Set();
    
    const addAssetAndChildren = (assetId: string) => {
      if (processedInHierarchy.has(assetId)) return;
      processedInHierarchy.add(assetId);
      
      const asset = allAssets.find(a => a.assetId === assetId);
      if (asset && asset.agentCount) {
        hierarchyCapacity += Number(asset.agentCount) || 0;
      }
      
      // Find child assets (where parentId matches current asset)
      const children = allAssets.filter(a => a.parentId === asset?.id);
      children.forEach(child => {
        addAssetAndChildren(child.assetId);
      });
    };
    
    addAssetAndChildren(rootAssetId);
    return hierarchyCapacity;
  };

  // Get all risks for direct filtering - most robust approach
  const { data: risksResponse, isLoading: loadingAllRisks } = useQuery({
    queryKey: ["/api/risks"],
    staleTime: 0,
  });

  // Extract the risk from all risks based on ID or riskId
  const risk = useMemo(() => {
    // Ensure we have a proper array of risks, regardless of response format
    let allRisks: Risk[] = [];
    
    if (risksResponse?.data && Array.isArray(risksResponse.data)) {
      // New service format with data property
      allRisks = risksResponse.data;
    } else if (Array.isArray(risksResponse)) {
      // Old format with direct array
      allRisks = risksResponse;
    }

    if (allRisks.length === 0) {
      console.log("No valid risk array available yet", risksResponse);
      return null;
    }

    // First, check if we can find it by string riskId (most likely case for template-created risks)
    const riskByStringId = allRisks.find((r) => r.riskId === id);
    if (riskByStringId) {
      console.log(`Found risk by string riskId: ${id}`);
      return riskByStringId;
    }

    // Then try by numeric ID
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      const riskByNumericId = allRisks.find((r) => r.id === numericId);
      if (riskByNumericId) {
        console.log(`Found risk by numeric ID: ${numericId}`);
        return riskByNumericId;
      }
    }

    console.log(`Could not find risk with ID: ${id}`);
    return null;
  }, [risksResponse, id]);

  // Derived state
  const isLoading = loadingAllRisks;
  const error = null; // Don't show error even if risk not found, we'll handle it in the UI
  const refetch = () => {}; // Placeholder since we're using a different approach

  // Only fetch controls after we have the risk data and can use its riskId
  const { data: controlsResponse = { data: [] } } = useQuery<{ success: boolean, data: Control[] }>({
    queryKey: [risk ? `/api/risks/${risk.riskId}/controls` : "no-controls"], // Use riskId not the numeric id
    enabled: !!risk, // Only fetch if we have a risk loaded
    staleTime: 0, // Don't cache the response
  });
  
  // Extract the controls from the response
  const controls = useMemo(() => {
    return controlsResponse?.data || [];
  }, [controlsResponse]);



  // Log controls for debugging
  useEffect(() => {
    if (risk?.riskId) {
      console.log("Risk data loaded, fetching controls for:", risk.riskId);
    }

    console.log("Current controls:", controls);
  }, [risk?.riskId, controls]);

  // Calculate the implementation cost for a control
  const calculateImplementationCost = (control: Control) => {
    if (!control) return 0;

    // For "in_progress" status, use deployed agent count * cost per agent
    if (control.implementationStatus === "in_progress" && control.isPerAgentPricing) {
      return (Number(control.costPerAgent) || 0) * (control.deployedAgentCount || 0);
    }

    // For "fully_implemented" status with per-agent pricing, use total asset capacity
    if (control.implementationStatus === "fully_implemented" && control.isPerAgentPricing) {
      const totalCapacity = calculateTotalAssetCapacity(risk?.associatedAssets || []);
      return (Number(control.costPerAgent) || 0) * totalCapacity;
    }

    // If it's not per-agent pricing, return the implementation cost directly
    return Number(control.implementationCost) || 0;
  };

  // Risk categories and severity styles
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "operational":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "strategic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "compliance":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "financial":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!risk) {
    return (
      <Layout>
        <div className="text-center p-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Risk Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The risk with ID "{id}" couldn't be found. It may have been deleted
              or the ID is incorrect.
            </p>
          </div>
          <Button asChild>
            <Link href="/risks">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Risks
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-full mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <Link href="/risks">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">{risk.riskId}</p>
          </div>
          <h1 className="text-3xl font-bold">{risk.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setEditDialogOpen(true)}
            className="gap-2"
          >
            <PenLine className="h-4 w-4" />
            Edit Risk
          </Button>
        </div>
      </div>
      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="mt-6 w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="details">Risk Details</TabsTrigger>
          <TabsTrigger value="assets">Affected Assets</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="costs">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Cost Modules
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 w-full">
          <RiskOverview risk={risk} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Risk Description</h2>
            <p className="mb-4">{risk.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-md font-medium mb-2">Threat Community</h3>
                <p className="text-sm">{risk.threatCommunity}</p>
              </div>
              <div>
                <h3 className="text-md font-medium mb-2">Vulnerability</h3>
                <p className="text-sm">{risk.vulnerability}</p>
              </div>
            </div>

            {/* Additional notes section can be added if needed */}
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Affected Assets</h2>
            {risk.associatedAssets?.length > 0 ? (
              <ul className="space-y-2">
                {risk.associatedAssets.map((assetId) => (
                  <li
                    key={assetId}
                    className="p-2 border rounded-md flex items-center"
                  >
                    <div className="mr-auto">{assetId}</div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/assets/${assetId}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                No assets associated with this risk.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Applicable Controls</h2>
            {controls.length > 0 ? (
              <div className="space-y-4">
                {controls.map((control) => (
                  <div key={control.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">
                        <span className="font-bold text-primary mr-2">
                          {control.controlId}:
                        </span>
                        {control.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {control.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Type
                        </span>
                        <div className="flex items-center gap-1">
                          {control.controlType === "preventive" && (
                            <Shield className="h-4 w-4 text-green-500" />
                          )}
                          {control.controlType === "detective" && (
                            <Eye className="h-4 w-4 text-blue-500" />
                          )}
                          {control.controlType === "corrective" && (
                            <CheckCircle2 className="h-4 w-4 text-purple-500" />
                          )}
                          <span className="capitalize">
                            {control.controlType}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Category
                        </span>
                        <span className="capitalize">
                          {control.controlCategory}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Implementation Status
                        </span>
                        <div className="flex items-center gap-1">
                          {control.implementationStatus ===
                            "fully_implemented" && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {control.implementationStatus === "in_progress" && (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          )}
                          {control.implementationStatus ===
                            "not_implemented" && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="capitalize">
                            {control.implementationStatus.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Effectiveness
                        </span>
                        <span>{control.controlEffectiveness}/10</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Implementation Cost
                        </span>
                        <span>
                          {formatCurrency(
                            calculateImplementationCost(control),
                            "USD",
                          )}
                        </span>
                        {control.isPerAgentPricing && (
                          <span className="text-xs text-muted-foreground mt-1">
                            (
                            {formatCurrency(
                              Number(control.costPerAgent) || 0,
                              "USD",
                            )}{" "}
                            per agent)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Agent Deployment
                        </span>
                        {control.implementationStatus === "in_progress" ? (
                          <div className="space-y-1">
                            <span className="font-medium">
                              {control.deployedAgentCount || 0} / {calculateTotalAssetCapacity(risk?.associatedAssets || [])} agents
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  (control.deployedAgentCount || 0) > calculateTotalAssetCapacity(risk?.associatedAssets || [])
                                    ? 'bg-red-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ 
                                  width: `${Math.min(
                                    ((control.deployedAgentCount || 0) / Math.max(calculateTotalAssetCapacity(risk?.associatedAssets || []), 1)) * 100,
                                    100
                                  )}%` 
                                }}
                              />
                            </div>
                            {(control.deployedAgentCount || 0) > calculateTotalAssetCapacity(risk?.associatedAssets || []) && (
                              <span className="text-xs text-red-500">
                                ⚠️ Over-deployed
                              </span>
                            )}
                          </div>
                        ) : control.implementationStatus === "fully_implemented" ? (
                          <span className="text-green-600 font-medium">
                            {calculateTotalAssetCapacity(risk?.associatedAssets || [])} agents (Full)
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            Not deployed
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/controls/${control.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View Control Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No controls are currently associated with this risk.
              </p>
            )}
          </Card>
        </TabsContent>

        {/* Cost Modules Tab */}
        <TabsContent value="costs" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Cost Module Assignment</h2>
            <p className="text-muted-foreground mb-4">
              Assign cost modules to this risk with materiality weights for
              FAIR-MAM financial impact calculations.
            </p>
            {risk && <RiskCostAssignment riskId={risk.id} />}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Define risk parameters using the FAIR-U methodology
            </DialogDescription>
          </DialogHeader>
          <RiskForm
            risk={risk}
            onClose={() => {
              setEditDialogOpen(false);
              // Manually refetch after form closes to ensure latest data
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}
