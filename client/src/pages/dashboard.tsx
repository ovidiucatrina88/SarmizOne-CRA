import { useQuery } from "@tanstack/react-query";
import { SquareStack, AlertTriangle, Shield, DollarSign, History } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RiskBreakdown } from "@/components/dashboard/risk-breakdown";
import { RiskOverviewCombined } from "@/components/dashboard/risk-overview-combined";
import Layout from "@/components/layout/layout";
import { LossExceedanceCurveModern } from "@/components/ui/loss-exceedance-curve-modern";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import IRISBenchmarkCard from "@/components/dashboard/iris-benchmark-card";

import { RiskCategorySeverityCard } from "@/components/dashboard/risk-category-severity-card";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0 p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0">
        <div className="bg-gradient-to-r from-muted/50 to-muted/20 px-6 py-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-600">
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 rounded mr-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg border border-gray-600">
          <div className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // UI state variables
  const [showHistoricalComparison, setShowHistoricalComparison] = useState(true);
  
  // Filter type and selections
  type FilterType = 'all' | 'entity' | 'asset' | 'l1' | 'l2' | 'l3' | 'l4';
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedArchitectureLevel, setSelectedArchitectureLevel] = useState<string | null>(null);
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });
  
  // Fetch assets data for asset filter
  const { data: assetsData } = useQuery({
    queryKey: ["/api/assets"],
  });
  
  // Fetch legal entities data for entity filter
  const { data: legalEntitiesData } = useQuery({
    queryKey: ["/api/legal-entities"],
  });

  // Fetch enterprise architecture data for L1-L4 filters
  const { data: enterpriseArchData } = useQuery({
    queryKey: ["/api/enterprise-architecture"],
  });
  
  // Query for risk response data
  const { data: riskResponseData } = useQuery({
    queryKey: ["/api/risk-responses"],
  });
  
  // Query for risk summary data
  const { data: riskSummaryData, isLoading: isLoadingRiskSummary } = useQuery({
    queryKey: ["/api/risk-summary/latest"],
  });

  // Query for risks data to pass to Loss Exceedance Curve
  const { data: risksData } = useQuery({
    queryKey: ["/api/risks"],
  });

  // Query for IRIS benchmark data
  const { data: irisData } = useQuery({
    queryKey: ["/api/dashboard/iris-benchmarks"],
  });

  if (isLoading) {
    return (
      <Layout
        pageTitle="Risk Dashboard"
        pageIcon="DashboardIcon"
        pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
      >
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    console.error("Dashboard error:", error);
    return (
      <Layout
        pageTitle="Risk Dashboard"
        pageIcon="DashboardIcon"
        pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
      >
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Error loading dashboard data</h2>
          <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
        </div>
      </Layout>
    );
  }
  
  // Use API data directly - extract the data property
  const apiData = data?.data;
  
  // Debug logging
  console.log('Dashboard data received:', data);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  
  // Calculate year-over-year change for risk exposure
  let exposureChangePercent = 0;
  let exposureChangeType: "increase" | "decrease" | "neutral" = "neutral";
  
  if (riskSummaryData?.current && riskSummaryData?.previous) {
    const current = riskSummaryData.current.mostLikelyExposure || 0;
    const previous = riskSummaryData.previous.mostLikelyExposure || 0;
    
    if (previous > 0) {
      const change = ((current - previous) / previous) * 100;
      exposureChangePercent = Math.abs(Math.round(change));
      exposureChangeType = change > 0 ? "increase" : change < 0 ? "decrease" : "neutral";
    }
  }
  
  // Process data for risk breakdown with safety checks
  const riskBySeverity = {
    critical: {
      count: apiData?.riskSummary?.criticalRisks || 0,
      percentage: apiData?.riskSummary?.criticalRisks && apiData?.riskSummary?.totalRisks 
        ? (apiData.riskSummary.criticalRisks / apiData.riskSummary.totalRisks) * 100 
        : 0,
      color: "bg-red-600",
    },
    high: {
      count: apiData?.riskSummary?.highRisks || 0,
      percentage: apiData?.riskSummary?.highRisks && apiData?.riskSummary?.totalRisks 
        ? (apiData.riskSummary.highRisks / apiData.riskSummary.totalRisks) * 100 
        : 0,
      color: "bg-amber-500",
    },
    medium: {
      count: apiData?.riskSummary?.mediumRisks || 0,
      percentage: apiData?.riskSummary?.mediumRisks && apiData?.riskSummary?.totalRisks 
        ? (apiData.riskSummary.mediumRisks / apiData.riskSummary.totalRisks) * 100 
        : 0,
      color: "bg-yellow-400",
    },
    low: {
      count: apiData?.riskSummary?.lowRisks || 0,
      percentage: apiData?.riskSummary?.lowRisks && apiData?.riskSummary?.totalRisks 
        ? (apiData.riskSummary.lowRisks / apiData.riskSummary.totalRisks) * 100 
        : 0,
      color: "bg-green-500",
    },
  };

  // Process risk category data from API
  const riskByCategory = apiData?.riskByCategory || {
    operational: 0,
    strategic: 0,
    compliance: 0,
    financial: 0
  };
  
  // Risk response status data (from API or fallback)
  const responseTypeData = riskResponseData?.responseTypeData || {
    mitigate: { count: 1, percentage: 50 },
    accept: { count: 1, percentage: 50 },
    transfer: { count: 0, percentage: 0 },
    avoid: { count: 0, percentage: 0 }
  };
  
  // Calculate risk reduction data from API
  const riskReduction = {
    inherentRisk: apiData?.riskSummary?.totalInherentRisk || 0,
    residualRisk: apiData?.riskSummary?.totalResidualRisk || 0,
    reduction: (apiData?.riskSummary?.totalInherentRisk || 0) - (apiData?.riskSummary?.totalResidualRisk || 0),
    reductionPercentage: apiData?.riskSummary?.riskReduction || 0
  };
  
  return (
    <Layout
      pageTitle="Risk Dashboard"
      pageIcon="DashboardIcon"
      pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Assets"
          value={apiData?.assetSummary?.totalAssets || 0}
          icon={SquareStack}
          iconBackgroundColor="bg-primary-100"
          iconColor="text-primary-600"
          changeValue="7%"
          changeType="increase"
        />
        <StatsCard
          title="Identified Risks"
          value={apiData?.riskSummary?.totalRisks || 0}
          icon={AlertTriangle}
          iconBackgroundColor="bg-red-100"
          iconColor="text-red-600"
          changeValue="12%"
          changeType="increase"
        />
        <StatsCard
          title="Implemented Controls"
          value={apiData?.controlSummary?.implementedControls || 0}
          icon={Shield}
          iconBackgroundColor="bg-green-100"
          iconColor="text-green-600"
          changeValue="4%"
          changeType="increase"
        />
        <StatsCard
          title="Risk Exposure"
          value={`$${((apiData?.riskSummary?.totalResidualRisk || 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          iconBackgroundColor="bg-amber-100"
          iconColor="text-amber-600"
          changeValue={exposureChangePercent > 0 ? `${exposureChangePercent}%` : ""}
          changeType={exposureChangeType === "neutral" ? undefined : exposureChangeType}
        />
      </div>

      {/* Loss Exceedance Curve */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Loss Exceedance Curve</h3>
              <div className="flex items-center space-x-4">
                {/* Filter Controls */}
                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-1 text-sm rounded border border-gray-500 bg-gray-600 text-white"
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value as FilterType);
                      setSelectedLegalEntity(null);
                      setSelectedAsset(null);
                      setSelectedArchitectureLevel(null);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="l1">L1 - Strategy</option>
                    <option value="l2">L2 - Business Architecture</option>
                    <option value="l3">L3 - Information Systems</option>
                    <option value="l4">L4 - Technology</option>
                    <option value="entity">Legal Entity</option>
                    <option value="asset">Asset</option>
                  </select>
                  
                  {/* Show entity selector when filter type is 'entity' */}
                  {filterType === 'entity' && legalEntitiesData?.data && (
                    <select
                      className="px-3 py-1 text-sm rounded border border-gray-500 bg-gray-600 text-white"
                      value={selectedLegalEntity || ''}
                      onChange={(e) => setSelectedLegalEntity(e.target.value || null)}
                    >
                      <option value="" disabled>Select Entity</option>
                      {Array.isArray(legalEntitiesData.data) && legalEntitiesData.data.map((entity: any) => (
                        <option key={entity.entityId} value={entity.entityId}>
                          {entity.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {/* Show asset selector when filter type is 'asset' */}
                  {filterType === 'asset' && assetsData?.data && (
                    <select
                      className="px-3 py-1 text-sm rounded border border-gray-500 bg-gray-600 text-white"
                      value={selectedAsset || ''}
                      onChange={(e) => setSelectedAsset(e.target.value || null)}
                    >
                      <option value="" disabled>Select Asset</option>
                      {Array.isArray(assetsData.data) && assetsData.data.map((asset: any) => (
                        <option key={asset.assetId} value={asset.assetId}>
                          {asset.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {/* Show architecture level selector when filter type is L1-L4 */}
                  {(filterType === 'l1' || filterType === 'l2' || filterType === 'l3' || filterType === 'l4') && enterpriseArchData?.data && (
                    <select
                      className="px-3 py-1 text-sm rounded border border-gray-500 bg-gray-600 text-white"
                      value={selectedArchitectureLevel || ''}
                      onChange={(e) => setSelectedArchitectureLevel(e.target.value || null)}
                    >
                      <option value="" disabled>Select {filterType.toUpperCase()} Component</option>
                      {Array.isArray(enterpriseArchData.data) && 
                       enterpriseArchData.data
                         .filter((arch: any) => arch.level === filterType.toUpperCase())
                         .map((arch: any) => (
                        <option key={arch.id} value={arch.id}>
                          {arch.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="historical-comparison"
                    checked={showHistoricalComparison}
                    onCheckedChange={setShowHistoricalComparison}
                  />
                  <Label 
                    htmlFor="historical-comparison"
                    className="flex items-center cursor-pointer"
                  >
                    <History className="h-4 w-4 mr-1" />
                    <span>Historical Comparison</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {showHistoricalComparison && isLoadingRiskSummary ? (
              <div className="flex justify-center items-center h-96">
                <p className="text-lg text-gray-500">Loading historical data...</p>
              </div>
            ) : (
              <LossExceedanceCurveModern 
                risks={risksData?.data || []} 
                currentExposure={apiData?.riskSummary ? {
                  minimumExposure: apiData.riskSummary.minimumExposure,
                  averageExposure: apiData.riskSummary.meanExposure,
                  maximumExposure: apiData.riskSummary.maximumExposure,
                  tenthPercentile: apiData.riskSummary.minimumExposure,
                  mostLikely: apiData.riskSummary.meanExposure,
                  ninetiethPercentile: apiData.riskSummary.maximumExposure,
                  exposureCurveData: apiData.riskSummary.exposureCurveData
                } : undefined}
                previousExposure={showHistoricalComparison && riskSummaryData?.previous ? {
                  minimumExposure: riskSummaryData.previous.minimumExposure,
                  averageExposure: riskSummaryData.previous.averageExposure,
                  maximumExposure: riskSummaryData.previous.maximumExposure,
                  tenthPercentile: riskSummaryData.previous.tenthPercentileExposure,
                  mostLikely: riskSummaryData.previous.mostLikelyExposure,
                  ninetiethPercentile: riskSummaryData.previous.ninetiethPercentileExposure,
                  exposureCurveData: riskSummaryData.previous.exposureCurveData
                } : undefined}
                irisBenchmarks={irisData?.data ? {
                  smb: irisData.data.exceedanceCurves?.smb || [],
                  enterprise: irisData.data.exceedanceCurves?.enterprise || []
                } : undefined}
                filterType={filterType}
                selectedEntityId={selectedLegalEntity}
                selectedAssetId={selectedAsset}
                selectedArchitectureId={selectedArchitectureLevel}
              />
            )}
          </div>
        </div>
      </div>

      {/* IRIS Benchmarks and Risk Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <IRISBenchmarkCard />
        
        <RiskCategorySeverityCard 
          riskByCategory={riskByCategory}
          riskBySeverity={riskBySeverity}
        />
      </div>



      {/* Combined Risk Overview */}
      <div className="mb-8">
        <RiskOverviewCombined 
          risks={risksData?.data || []}
          maxItems={5}
          responseTypeData={responseTypeData}
          riskReduction={riskReduction}
        />
      </div>
    </Layout>
  );
}