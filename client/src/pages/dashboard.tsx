import { useQuery } from "@tanstack/react-query";
import { SquareStack, AlertTriangle, Shield, DollarSign, History } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RiskBreakdown } from "@/components/dashboard/risk-breakdown";
import { RiskResponseStatus } from "@/components/dashboard/risk-response-status";
import { TopRisks } from "@/components/dashboard/top-risks";
import Layout from "@/components/layout/layout";
import { LossExceedanceCurveModern } from "@/components/ui/loss-exceedance-curve-modern";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg border border-gray-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-600">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-6">
          <Skeleton className="h-80 w-full" />
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
                currentExposure={riskSummaryData?.current ? {
                  minimumExposure: riskSummaryData.current.minimumExposure,
                  averageExposure: riskSummaryData.current.averageExposure,
                  maximumExposure: riskSummaryData.current.maximumExposure,
                  tenthPercentile: riskSummaryData.current.tenthPercentileExposure,
                  mostLikely: riskSummaryData.current.mostLikelyExposure,
                  ninetiethPercentile: riskSummaryData.current.ninetiethPercentileExposure
                } : undefined}
                previousExposure={showHistoricalComparison && riskSummaryData?.previous ? {
                  minimumExposure: riskSummaryData.previous.minimumExposure,
                  averageExposure: riskSummaryData.previous.averageExposure,
                  maximumExposure: riskSummaryData.previous.maximumExposure,
                  tenthPercentile: riskSummaryData.previous.tenthPercentileExposure,
                  mostLikely: riskSummaryData.previous.mostLikelyExposure,
                  ninetiethPercentile: riskSummaryData.previous.ninetiethPercentileExposure
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

      {/* Risk Breakdown and Top Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RiskBreakdown 
          title="Risk by Severity"
          items={riskBySeverity}
        />
        
        <TopRisks 
          risks={[]}
          maxItems={5}
        />
      </div>

      {/* Risk Response Status and Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <RiskResponseStatus 
          responseTypeData={responseTypeData}
          riskReduction={riskReduction}
        />
        
        <RiskBreakdown 
          title="Risk by Category"
          items={{
            operational: {
              count: 1,
              percentage: 50,
              color: "bg-blue-600"
            },
            strategic: {
              count: 0,
              percentage: 0,
              color: "bg-indigo-600"
            },
            compliance: {
              count: 1,
              percentage: 50,
              color: "bg-purple-600"
            },
            financial: {
              count: 0,
              percentage: 0,
              color: "bg-teal-600"
            }
          }}
        />
      </div>
    </Layout>
  );
}