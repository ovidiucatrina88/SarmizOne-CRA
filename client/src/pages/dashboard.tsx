import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";

import Layout from "@/components/layout/layout";
import { LossExceedanceCurveModern } from "@/components/ui/loss-exceedance-curve-modern";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { MetricPill } from "@/components/ui/metric-pill";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import IRISBenchmarkCard from "@/components/dashboard/iris-benchmark-card";
import { RiskCategorySeverityCard } from "@/components/dashboard/risk-category-severity-card";
import { Skeleton } from "@/components/ui/skeleton";



interface WatchlistRow {
  name: string;
  likelihood: string;
  loss: string;
  actor: string;
  category: string;
}

const FALLBACK_WATCHLIST: WatchlistRow[] = [
  {
    name: "IP training Gen AI model",
    likelihood: "97%",
    loss: "$18K",
    actor: "Privileged Insider",
    category: "Data Exfiltration",
  },
  {
    name: "Insider shares PII",
    likelihood: "97%",
    loss: "$6.6M",
    actor: "Privileged Insider",
    category: "Data Exfiltration",
  },
  {
    name: "Company IP leaked",
    likelihood: "97%",
    loss: "$18K",
    actor: "Privileged Insider",
    category: "Data Exfiltration",
  },
  {
    name: "Threat actor steals model",
    likelihood: "43%",
    loss: "$348K",
    actor: "Cyber Criminal",
    category: "Data Exfiltration",
  },
];





function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <GlowCard key={idx} compact className="h-[150px]">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded" />
              </div>
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </GlowCard>
        ))}
      </div>
      <GlowCard className="h-[420px]">
        <Skeleton className="h-full w-full rounded-[32px]" />
      </GlowCard>
    </div>
  );
}

export default function Dashboard() {
  type FilterType = "all" | "entity" | "asset" | "l1" | "l2" | "l3" | "l4";

  const [showHistoricalComparison, setShowHistoricalComparison] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedLegalEntity, setSelectedLegalEntity] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedArchitectureLevel, setSelectedArchitectureLevel] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });
  const { data: assetsData } = useQuery({
    queryKey: ["/api/assets"],
  });
  const { data: legalEntitiesData } = useQuery({
    queryKey: ["/api/legal-entities"],
  });
  const { data: enterpriseArchData } = useQuery({
    queryKey: ["/api/enterprise-architecture"],
  });
  const { data: riskResponseData } = useQuery({
    queryKey: ["/api/risk-responses"],
  });
  const { data: riskSummaryData, isLoading: isLoadingRiskSummary } = useQuery({
    queryKey: ["/api/risk-summary/latest"],
  });
  const { data: risksData } = useQuery({
    queryKey: ["/api/risks"],
  });
  const { data: irisData } = useQuery({
    queryKey: ["/api/dashboard/iris-benchmarks"],
  });

  if (isLoading) {
    return (
      <Layout
        pageTitle="Risk Dashboard"
        pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
      >
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout
        pageTitle="Risk Dashboard"
        pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
      >
        <GlowCard className="p-8 text-center">
          <p className="text-lg font-semibold text-destructive">Unable to load dashboard data.</p>
          <p className="text-muted-foreground mt-2">Please refresh or contact support.</p>
        </GlowCard>
      </Layout>
    );
  }

  const apiData = data?.data;
  const totalAssets = apiData?.assetSummary?.totalAssets ?? 0;
  const totalRisks = apiData?.riskSummary?.totalRisks ?? 0;
  const implementedControls = apiData?.controlSummary?.implementedControls ?? 0;
  const residualExposure = apiData?.riskSummary?.totalResidualRisk ?? 0;

  console.log("Dashboard API Data:", apiData);
  console.log("Top Controls:", apiData?.topControls);

  const kpiTiles = [
    {
      label: "Total Assets",
      value: totalAssets.toLocaleString(),
      delta: apiData?.trends?.assets?.delta || "0% vs last month",
      series: apiData?.trends?.assets?.series || [],
      color: "#5ef1c7",
    },
    {
      label: "Identified Risks",
      value: totalRisks.toLocaleString(),
      delta: apiData?.trends?.risks?.delta || "0% vs last month",
      series: apiData?.trends?.risks?.series || [],
      color: "#fda4af",
    },
    {
      label: "Implemented Controls",
      value: implementedControls.toLocaleString(),
      delta: apiData?.trends?.controls?.delta || "0% vs last month",
      series: apiData?.trends?.controls?.series || [],
      color: "#93c5fd",
    },
    {
      label: "Risk Exposure",
      value: formatCurrency(residualExposure),
      delta: apiData?.trends?.exposure?.delta || "0% QoQ",
      series: apiData?.trends?.exposure?.series || [],
      color: "#fef08a",
    },
  ];

  const safeRisks = Array.isArray(risksData?.data)
    ? (risksData?.data as any[])
    : Array.isArray(risksData)
      ? (risksData as any[])
      : [];

  const watchlistData: WatchlistRow[] =
    safeRisks.length > 0
      ? safeRisks.slice(0, 4).map((risk, index) => ({
        name: risk?.name || FALLBACK_WATCHLIST[index]?.name || `Scenario ${index + 1}`,
        likelihood: risk?.likelihood ? `${risk.likelihood}%` : FALLBACK_WATCHLIST[index]?.likelihood || "N/A",
        loss: risk?.loss
          ? formatCurrency(risk.loss)
          : FALLBACK_WATCHLIST[index]?.loss || formatCurrency((index + 1) * 10000),
        actor: risk?.threatActor || FALLBACK_WATCHLIST[index]?.actor || "Unknown Actor",
        category: risk?.category || FALLBACK_WATCHLIST[index]?.category || "Unknown",
      }))
      : FALLBACK_WATCHLIST;

  const riskBySeverity = {
    critical: {
      count: apiData?.riskSummary?.criticalRisks || 0,
      percentage:
        apiData?.riskSummary?.criticalRisks && apiData?.riskSummary?.totalRisks
          ? (apiData.riskSummary.criticalRisks / apiData.riskSummary.totalRisks) * 100
          : 0,
      color: "bg-red-600",
    },
    high: {
      count: apiData?.riskSummary?.highRisks || 0,
      percentage:
        apiData?.riskSummary?.highRisks && apiData?.riskSummary?.totalRisks
          ? (apiData.riskSummary.highRisks / apiData.riskSummary.totalRisks) * 100
          : 0,
      color: "bg-amber-500",
    },
    medium: {
      count: apiData?.riskSummary?.mediumRisks || 0,
      percentage:
        apiData?.riskSummary?.mediumRisks && apiData?.riskSummary?.totalRisks
          ? (apiData.riskSummary.mediumRisks / apiData.riskSummary.totalRisks) * 100
          : 0,
      color: "bg-yellow-400",
    },
    low: {
      count: apiData?.riskSummary?.lowRisks || 0,
      percentage:
        apiData?.riskSummary?.lowRisks && apiData?.riskSummary?.totalRisks
          ? (apiData.riskSummary.lowRisks / apiData.riskSummary.totalRisks) * 100
          : 0,
      color: "bg-green-500",
    },
  };

  const riskByCategory = apiData?.riskByCategory || {
    operational: 0,
    strategic: 0,
    compliance: 0,
    financial: 0,
  };

  const toleranceOptions = [
    "Show History",
    "Show Tolerance",
    "Show Inherent Risk",
    "Configure Thresholds",
    "Industry Benchmarks",
    "SMB",
    "Enterprise",
  ];

  return (
    <Layout
      pageTitle="Risk Dashboard"
      pageDescription="Overview of cybersecurity risks, controls, and key metrics across your organization."
    >
      <div className="space-y-8">
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {kpiTiles.map((tile) => (
            <KpiCard
              key={tile.label}
              label={tile.label}
              value={tile.value}
              delta={tile.delta}
              trendSeries={tile.series}
              trendColor={tile.color}
            />
          ))}
        </section>

        <section className="space-y-6">
          <GlowCard className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Loss Exceedance</p>
                <h2 className="text-2xl font-semibold text-white">Materiality Assessment</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <select
                  className="rounded-2xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm text-white focus-visible:outline-none"
                  value={filterType}
                  onChange={(event) => {
                    const value = event.target.value as FilterType;
                    setFilterType(value);
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
                {filterType === "entity" && legalEntitiesData?.data && (
                  <select
                    className="rounded-2xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm text-white focus-visible:outline-none"
                    value={selectedLegalEntity || ""}
                    onChange={(event) => setSelectedLegalEntity(event.target.value || null)}
                  >
                    <option value="" disabled>
                      Select Entity
                    </option>
                    {Array.isArray(legalEntitiesData.data) &&
                      legalEntitiesData.data.map((entity: any) => (
                        <option key={entity.entityId} value={entity.entityId}>
                          {entity.name}
                        </option>
                      ))}
                  </select>
                )}
                {filterType === "asset" && assetsData?.data && (
                  <select
                    className="rounded-2xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm text-white focus-visible:outline-none"
                    value={selectedAsset || ""}
                    onChange={(event) => setSelectedAsset(event.target.value || null)}
                  >
                    <option value="" disabled>
                      Select Asset
                    </option>
                    {Array.isArray(assetsData.data) &&
                      assetsData.data.map((asset: any) => (
                        <option key={asset.assetId} value={asset.assetId}>
                          {asset.name}
                        </option>
                      ))}
                  </select>
                )}
                {["l1", "l2", "l3", "l4"].includes(filterType) && enterpriseArchData?.data && (
                  <select
                    className="rounded-2xl border border-white/10 bg-surface-muted/80 px-3 py-2 text-sm text-white focus-visible:outline-none"
                    value={selectedArchitectureLevel || ""}
                    onChange={(event) => setSelectedArchitectureLevel(event.target.value || null)}
                  >
                    <option value="" disabled>
                      Select {filterType.toUpperCase()} Component
                    </option>
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
                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs tracking-wide text-muted-foreground">Historical Comparison</span>
                  <Switch checked={showHistoricalComparison} onCheckedChange={setShowHistoricalComparison} />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              {toleranceOptions.map((option) => (
                <span
                  key={option}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] text-white/80"
                >
                  {option}
                </span>
              ))}
            </div>

            <div className="rounded-[28px] border border-white/8 bg-surface-muted/70 p-4">
              {showHistoricalComparison && isLoadingRiskSummary ? (
                <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                  Loading historical data...
                </div>
              ) : (
                <LossExceedanceCurveModern
                  risks={safeRisks}
                  currentExposure={
                    apiData?.riskSummary
                      ? {
                        minimumExposure: apiData.riskSummary.minimumExposure,
                        averageExposure: apiData.riskSummary.meanExposure,
                        maximumExposure: apiData.riskSummary.maximumExposure,
                        tenthPercentile: apiData.riskSummary.tenthPercentileExposure || apiData.riskSummary.minimumExposure,
                        mostLikely: apiData.riskSummary.medianExposure || apiData.riskSummary.meanExposure,
                        ninetiethPercentile: apiData.riskSummary.ninetiethPercentileExposure || apiData.riskSummary.maximumExposure,
                        exposureCurveData: apiData.riskSummary.exposureCurveData,
                      }
                      : undefined
                  }
                  previousExposure={
                    showHistoricalComparison && riskSummaryData?.previous
                      ? {
                        minimumExposure: riskSummaryData.previous.minimumExposure,
                        averageExposure: riskSummaryData.previous.averageExposure,
                        maximumExposure: riskSummaryData.previous.maximumExposure,
                        tenthPercentile: riskSummaryData.previous.tenthPercentileExposure,
                        mostLikely: riskSummaryData.previous.mostLikelyExposure,
                        ninetiethPercentile: riskSummaryData.previous.ninetiethPercentileExposure,
                        exposureCurveData: riskSummaryData.previous.exposureCurveData,
                      }
                      : undefined
                  }
                  irisBenchmarks={
                    irisData?.data
                      ? {
                        smb: irisData.data.exceedanceCurves?.smb || [],
                        enterprise: irisData.data.exceedanceCurves?.enterprise || [],
                      }
                      : undefined
                  }
                  filterType={filterType}
                  selectedEntityId={selectedLegalEntity}
                  selectedAssetId={selectedAsset}
                  selectedArchitectureId={selectedArchitectureLevel}
                />
              )}
            </div>
          </GlowCard>

        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <GlowCard variant="purple" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">Risk Scenarios</p>
                <h3 className="text-2xl font-semibold text-white">Data Exfiltration Watchlist</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Updated 5 mins ago</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase tracking-[0.3em] text-white/40">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Likelihood</th>
                    <th className="px-4 py-3">Loss Magnitude</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {watchlistData.map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-4 font-medium text-white">{row.name}</td>
                      <td className="px-4 py-4">{row.likelihood}</td>
                      <td className="px-4 py-4">{row.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>

          <GlowCard className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Controls</p>
                <h3 className="text-2xl font-semibold text-white">Top Performing Controls</h3>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">Maturity</span>
            </div>
            <div className="space-y-4">
              {apiData?.topControls && apiData.topControls.length > 0 ? (
                apiData.topControls.map((control: any) => (
                  <div
                    key={control.code}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/3 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 px-4 py-2 text-sm font-semibold text-foreground">
                        {control.code}
                      </div>
                      <div>
                        <p className="text-base font-medium text-white">{control.name}</p>
                        <p className="text-xs text-white/60">ROI & Risk Reduction</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm text-emerald-200">
                      {control.score}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-white/10 bg-white/3 px-4 text-center text-sm text-muted-foreground">
                  No implemented controls found.
                </div>
              )}
            </div>
          </GlowCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <GlowCard>
            <div className="-m-4 sm:-m-6">
              <IRISBenchmarkCard />
            </div>
          </GlowCard>
          <GlowCard>
            <div className="-m-4 sm:-m-6">
              <RiskCategorySeverityCard riskByCategory={riskByCategory} riskBySeverity={riskBySeverity} />
            </div>
          </GlowCard>
        </section>
      </div>
    </Layout>
  );
}
