import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ControlROI } from "@shared/models/control";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateControlRoi } from "@shared/utils/controlRoi";

interface ApiResponse<T> {
  success?: boolean;
  data: T;
}

interface RiskData {
  id: number;
  riskId: string;
  inherentRisk?: number | string;
  residualRisk?: number | string;
  lossMagnitudeAvg?: number | string;
  primaryLossMagnitudeAvg?: number | string;
  associatedAssets?: string[];
}

interface ControlData {
  id: number;
  name: string;
  implementationCost?: number | string;
  costPerAgent?: number | string;
  controlEffectiveness?: number | string;
  isPerAgentPricing?: boolean;
  associatedRisks?: string[] | string;
  controlType?: string;
}

interface AssetData {
  assetId: string;
  [key: string]: unknown;
}

const responsePalette: Record<string, string> = {
  preventive: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  detective: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  corrective: "border-violet-400/30 bg-violet-500/10 text-violet-100",
};

const maturityPalette = {
  M4: "border-green-400/30 bg-green-500/10 text-green-100",
  M3: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  M2: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  M1: "border-orange-400/30 bg-orange-500/10 text-orange-100",
  M0: "border-rose-400/30 bg-rose-500/10 text-rose-100",
};

export function ControlROIAnalysis() {
  const { data: controlsResponse, isLoading: controlsLoading } = useQuery<ApiResponse<ControlData[]>>({
    queryKey: ["/api/controls"],
  });
  const { data: risksResponse, isLoading: risksLoading } = useQuery<ApiResponse<RiskData[]>>({
    queryKey: ["/api/risks"],
  });
  const { data: assetsResponse, isLoading: assetsLoading } = useQuery<ApiResponse<AssetData[]>>({
    queryKey: ["/api/assets"],
  });

  const controls = controlsResponse?.data ?? [];
  const assets = assetsResponse?.data ?? [];
  const risks = (risksResponse?.data ?? []) as RiskData[];

  const risksForAnalysis = useMemo(() => {
    return risks.map((risk) => {
      const inherent =
        risk.inherentRisk ??
        risk.lossMagnitudeAvg ??
        risk.primaryLossMagnitudeAvg ??
        0;
      const inherentValue = Number(inherent) || 0;
      const residualValue =
        Number(risk.residualRisk) ||
        Number((inherentValue * 0.5).toFixed(2));
      return {
        id: risk.id,
        riskId: risk.riskId,
        inherentRisk: inherentValue,
        residualRisk: residualValue,
        associatedAssets: risk.associatedAssets ?? [],
      };
    });
  }, [risks]);

  const roiResults: ControlROI[] = useMemo(() => {
    if (!controls.length || !risksForAnalysis.length) return [];
    return controls
      .map((control) => {
        const normalizedControl = {
          ...control,
          associatedRisks: Array.isArray(control.associatedRisks)
            ? control.associatedRisks
            : control.associatedRisks
            ? [control.associatedRisks]
            : [],
          implementationCost:
            typeof control.implementationCost === "string"
              ? parseFloat(control.implementationCost) || 0
              : control.implementationCost || 0,
          costPerAgent:
            typeof control.costPerAgent === "string"
              ? parseFloat(control.costPerAgent) || 0
              : control.costPerAgent || 0,
          controlEffectiveness:
            typeof control.controlEffectiveness === "string"
              ? parseFloat(control.controlEffectiveness) || 0
              : control.controlEffectiveness || 0,
        };
        return calculateControlRoi(normalizedControl as any, risksForAnalysis, assets);
      })
      .filter(Boolean)
      .sort((a, b) => (b.roi || 0) - (a.roi || 0));
  }, [controls, risksForAnalysis, assets]);

  const stats = useMemo(() => {
    const totalReduction = roiResults.reduce(
      (sum, control) => sum + (Number(control.riskReduction) || 0),
      0,
    );
    const totalInvestment = roiResults.reduce(
      (sum, control) => sum + (Number(control.implementationCost) || 0),
      0,
    );
    const avgRoi = roiResults.length
      ? roiResults.reduce((sum, control) => sum + (Number(control.roi) || 0), 0) /
        roiResults.length
      : 0;
    const upgradeCandidates = roiResults.filter((control) => (control.roi || 0) > 0.5).length;
    return { totalReduction, totalInvestment, avgRoi, upgradeCandidates };
  }, [roiResults]);

  const isLoading = controlsLoading || risksLoading || assetsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <GlowCard key={idx} compact className="border-white/10">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="mt-4 h-6 w-32 rounded-lg" />
              <Skeleton className="mt-2 h-4 w-12 rounded-full" />
            </GlowCard>
          ))}
        </div>
        <GlowCard>
          <Skeleton className="h-96 w-full rounded-[32px]" />
        </GlowCard>
      </div>
    );
  }

  if (!roiResults.length) {
    return (
      <GlowCard className="text-center text-white/70">
        <p className="text-lg font-semibold text-white">No control ROI data</p>
        <p className="mt-2">
          Add controls with associated risks to see where investment creates the biggest impact.
        </p>
      </GlowCard>
    );
  }

  const topOpportunities = roiResults.slice(0, 5);

  const getMaturityLevel = (effectiveness: number) => {
    if (effectiveness >= 9) return "M4";
    if (effectiveness >= 7) return "M3";
    if (effectiveness >= 5) return "M2";
    if (effectiveness >= 3) return "M1";
    return "M0";
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Risk Reduction"
          value={formatCurrency(stats.totalReduction)}
          delta="Value protected"
        />
        <KpiCard
          label="Investment"
          value={formatCurrency(stats.totalInvestment)}
          delta="Total control spend"
          trendColor="#c4b5fd"
        />
        <KpiCard
          label="Average ROI"
          value={`${(stats.avgRoi * 100).toFixed(1)}%`}
          delta="Portfolio return"
          trendColor="#86efac"
        />
        <KpiCard
          label="Upgrade Candidates"
          value={stats.upgradeCandidates.toString()}
          delta="Controls with >50% ROI"
          trendColor="#fda4af"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlowCard className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Controls</p>
              <p className="text-lg font-semibold text-white">Investment vs. protection value</p>
            </div>
            <div className="text-sm text-white/60">{roiResults.length} controls analyzed</div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                <TableRow>
                  <TableHead>Control</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Maturity</TableHead>
                  <TableHead>Risk Reduction</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roiResults.map((result) => {
                  const effectiveness = Number(result.controlEffectiveness) || 0;
                  const maturity = getMaturityLevel(effectiveness);
                  return (
                    <TableRow key={result.id} className="border-b border-white/5">
                      <TableCell className="font-semibold text-white">{result.name}</TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-full border px-3 py-0.5 text-xs capitalize ${
                            responsePalette[result.controlType || "preventive"] ||
                            "border-white/10 bg-white/5 text-white/70"
                          }`}
                        >
                          {result.controlType || "preventive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-full border px-3 py-0.5 text-xs ${maturityPalette[maturity]}`}>
                          {maturity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-white">
                        {formatCurrency(result.riskReduction || 0)}
                      </TableCell>
                      <TableCell className="text-sm text-white/70">
                        {formatCurrency(result.implementationCost || 0)}
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-white">
                        {((result.roi || 0) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </GlowCard>

        <div className="space-y-6">
          <GlowCard>
            <p className="text-xs uppercase tracking-wide text-white/50">Top Performing Controls</p>
            <p className="text-lg font-semibold text-white">Highest ROI opportunities</p>
            <div className="mt-4 space-y-4">
              {topOpportunities.map((control, idx) => {
                const width =
                  ((control.roi || 0) /
                    (topOpportunities[0].roi || 1)) *
                  100;
                return (
                  <div key={control.id}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        {idx + 1}. {control.name}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {((control.roi || 0) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
                        style={{ width: `${Math.max(width, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>

          <GlowCard>
            <p className="text-xs uppercase tracking-wide text-white/50">Investment Direction</p>
            <div className="mt-4 space-y-4 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                <span>Increase funding for controls with ROI &gt; 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowDownRight className="h-4 w-4 text-rose-300" />
                <span>Review spend on controls with negative ROI</span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowUpRight className="h-4 w-4 text-white/50" />
                <span>Maintain balanced investment for controls between 0% and 50% ROI</span>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
