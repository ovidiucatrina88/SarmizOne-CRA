import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap, Cell } from "recharts";
import { LegalEntityCostMatrix } from "@/components/legal-entity/legal-entity-cost-matrix";

interface RiskCostRecord {
  id: number;
  riskId: string;
  name: string;
  severity?: string;
  totalCost?: number;
  costImpact?: number;
  costModules?: Array<{ moduleId: number; value: number; weight: number }>;
}

interface CostModule {
  id: number;
  name: string;
  moduleType?: string;
  cost_type?: string;
}

export default function RiskCostMappingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: risksResponse, isLoading: isLoadingRisks } = useQuery({ queryKey: ["/api/risks"] });
  const { data: costModulesResponse } = useQuery({ queryKey: ["/api/cost-modules"] });
  const {
    data: riskCostsResponse,
    isLoading: isLoadingCosts,
    refetch: refetchCosts,
  } = useQuery({ queryKey: ["/api/risk-costs/calculate/all"] });
  const { data: legalEntitiesResponse, isLoading: isLoadingEntities } = useQuery({ queryKey: ["/api/legal-entities"] });
  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({ queryKey: ["/api/assets"] });

  // Fetch risk cost summary with trends
  const { data: summaryResponse } = useQuery({
    queryKey: ["/api/risk-costs/summary"],
  });

  const summary = summaryResponse?.data || {
    stats: { totalMapped: 0, totalCost: 0, avgCost: 0, highSeverity: 0 },
    trends: {
      totalMapped: { series: [], delta: "0% vs last month" },
      totalCost: { series: [], delta: "0% vs last month" },
      avgCost: { series: [], delta: "0% vs last month" },
      highSeverity: { series: [], delta: "0% vs last month" }
    }
  };

  const risks = (risksResponse?.data as any[]) ?? [];
  const costModules: CostModule[] = ((costModulesResponse?.data as any[]) ?? []).map((module) => ({
    ...module,
    moduleType: module.moduleType || module.cost_type || "direct",
  }));
  const riskCosts: RiskCostRecord[] = (riskCostsResponse?.data as any[]) ?? [];
  const legalEntities = (legalEntitiesResponse?.data as any[]) ?? [];
  const assets = (assetsResponse?.data as any[]) ?? [];

  const enrichedRisks = useMemo(() => {
    return risks.map((risk) => {
      const costMatch = riskCosts.find(
        (cost) => cost.riskId === risk.riskId || cost.id === risk.id,
      );
      return {
        ...risk,
        totalCost: costMatch?.totalCost ?? costMatch?.costImpact ?? 0,
      };
    });
  }, [risks, riskCosts]);

  const filteredRisks = useMemo(() => {
    if (!searchTerm) return enrichedRisks;
    const q = searchTerm.toLowerCase();
    return enrichedRisks.filter(
      (risk) =>
        risk.name?.toLowerCase().includes(q) ||
        risk.riskId?.toLowerCase().includes(q) ||
        (risk.totalCost || 0).toString().includes(q),
    );
  }, [enrichedRisks, searchTerm]);



  const moduleCostData = useMemo(() => {
    const totals = new Map<string, number>();
    riskCosts.forEach((record) => {
      record.costModules?.forEach((module) => {
        const type = costModules.find((m) => m.id === module.moduleId)?.moduleType || "Other";
        const prev = totals.get(type) || 0;
        totals.set(type, prev + (module.value || 0) * (module.weight || 1));
      });
    });
    return Array.from(totals.entries()).map(([name, value]) => ({ name, value }));
  }, [riskCosts, costModules]);

  const riskTreemapData = useMemo(() => {
    return riskCosts
      .map((record) => ({
        name: record.name || record.riskId,
        size: record.totalCost || record.costImpact || 0,
      }))
      .filter((item) => item.size > 0);
  }, [riskCosts]);

  const isLoading = isLoadingRisks || isLoadingCosts || isLoadingEntities || isLoadingAssets;

  return (
    <Layout
      pageTitle="Risk-to-Cost Mapping"
      pageDescription="Understand how each risk translates into financial exposure across modules, entities, and assets."
    >
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Mapped Risks"
            value={summary.stats.totalMapped.toString()}
            delta={summary.trends.totalMapped.delta}
            trendSeries={summary.trends.totalMapped.series}
          />
          <KpiCard
            label="Total Cost Exposure"
            value={formatCurrency(summary.stats.totalCost)}
            delta={summary.trends.totalCost.delta}
            trendSeries={summary.trends.totalCost.series}
            trendColor="#fda4af"
          />
          <KpiCard
            label="Average Cost / Risk"
            value={formatCurrency(summary.stats.avgCost)}
            delta={summary.trends.avgCost.delta}
            trendSeries={summary.trends.avgCost.series}
            trendColor="#c4b5fd"
          />
          <KpiCard
            label="High Severity Risks"
            value={summary.stats.highSeverity.toString()}
            delta={summary.trends.highSeverity.delta}
            trendSeries={summary.trends.highSeverity.series}
            trendColor="#86efac"
          />
        </section>

        <GlowCard className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="Search risks by name, ID, or cost impact…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
              />
            </div>
            <Button
              variant="ghost"
              className="rounded-full border border-white/10 text-white hover:bg-white/10"
              onClick={() => refetchCosts()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate Costs
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white/80">
              <thead className="text-xs uppercase tracking-wide text-white/40">
                <tr className="border-b border-white/10">
                  <th className="py-3 text-left">Risk</th>
                  <th className="py-3 text-left">Severity</th>
                  <th className="py-3 text-left">Modeled Cost</th>
                  <th className="py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((risk) => (
                  <tr key={risk.id} className="border-b border-white/5">
                    <td className="py-3">
                      <p className="font-semibold text-white">{risk.name}</p>
                      <p className="text-xs uppercase tracking-wide text-white/40">ID: {risk.riskId}</p>
                    </td>
                    <td className="py-3">
                      <Badge className="rounded-full border border-white/10 bg-white/5 text-xs capitalize">
                        {risk.severity || "medium"}
                      </Badge>
                    </td>
                    <td className="py-3 text-white font-semibold">
                      {risk.totalCost ? formatCurrency(risk.totalCost) : "Not mapped"}
                    </td>
                    <td className="py-3 text-white/70 text-xs">
                      {risk.totalCost ? "Cost modules applied" : "Pending mapping"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredRisks.length && (
              <div className="py-10 text-center text-white/60">No risks match your filters.</div>
            )}
          </div>
        </GlowCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Module Types</p>
              <p className="text-lg font-semibold text-white">Cost impact by module type</p>
            </div>
            {isLoading ? (
              <Skeleton className="h-64 w-full rounded-[28px]" />
            ) : moduleCostData.length ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={moduleCostData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="value" radius={[12, 12, 12, 12]}>
                      {moduleCostData.map((entry, index) => (
                        <Cell key={entry.name} fill={["#0ea5e9", "#8b5cf6", "#f97316", "#14b8a6"][index % 4]} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-white/60">No cost data available yet.</p>
            )}
          </GlowCard>

          <GlowCard className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Cost Concentration</p>
              <p className="text-lg font-semibold text-white">Risks with largest financial impact</p>
            </div>
            {riskTreemapData.length ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={riskTreemapData}
                    dataKey="size"
                    stroke="#1f2937"
                    fill="#22d3ee"
                    content={({ x, y, width, height, name, size }) =>
                      width > 60 && height > 30 ? (
                        <g>
                          <rect x={x} y={y} width={width} height={height} fill="#0ea5e9" opacity={0.8} />
                          <text x={x + 8} y={y + 20} fill="#fff" fontSize={12} fontWeight={600}>
                            {name}
                          </text>
                          <text x={x + 8} y={y + 38} fill="#e2e8f0" fontSize={10}>
                            {formatCurrency(size)}
                          </text>
                        </g>
                      ) : null
                    }
                  />
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-white/60">No modeled cost data to display.</p>
            )}
          </GlowCard>
        </div>

        <GlowCard className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Legal Entities</p>
            <p className="text-lg font-semibold text-white">Cost allocation matrix</p>
          </div>
          <LegalEntityCostMatrix
            legalEntities={legalEntities}
            assets={assets}
            riskCosts={riskCosts}
            risks={risks}
            isLoading={isLoadingEntities || isLoadingAssets || isLoadingCosts}
          />
        </GlowCard>
      </div>
    </Layout>
  );
}
