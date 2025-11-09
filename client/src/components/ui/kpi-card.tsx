import { GlowCard } from "./glow-card";
import { TrendSparkline } from "./trend-sparkline";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trendSeries?: number[];
  trendColor?: string;
  trendLabel?: string;
  className?: string;
  suffixNode?: ReactNode;
}

export function KpiCard({
  label,
  value,
  delta,
  trendSeries = [],
  trendColor,
  trendLabel = "30 Day Trend",
  className,
  suffixNode,
}: KpiCardProps) {
  return (
    <GlowCard compact className={cn("h-[150px]", className)}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
            {delta && <p className="mt-1 text-xs text-primary">{delta}</p>}
          </div>
          <div className="text-[0.55rem] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
            {trendLabel}
            {suffixNode}
          </div>
        </div>
        <TrendSparkline values={trendSeries} color={trendColor} height={35} />
      </div>
    </GlowCard>
  );
}
