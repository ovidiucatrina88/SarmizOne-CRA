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
    <GlowCard compact className={cn("relative isolate h-[165px] overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.05),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/60">{label}</p>
            <p className="text-3xl font-semibold leading-tight text-white">{value}</p>
            {delta && <p className="text-xs font-medium text-emerald-200">{delta}</p>}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.55rem] uppercase tracking-[0.32em] text-white/60">
            {trendLabel}
            {suffixNode && <span className="text-white/80">{suffixNode}</span>}
          </div>
        </div>

        <div className="relative isolate flex-1 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/5 via-transparent to-white/5">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[-10%] h-24"
            style={{
              background: `radial-gradient(circle at 50% 100%, ${trendColor ?? "#86efac"}33 0%, transparent 55%)`,
            }}
          />
          <TrendSparkline values={trendSeries} color={trendColor} height={55} />
        </div>
      </div>
    </GlowCard>
  );
}
