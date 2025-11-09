import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

const directionMap: Record<
  Direction,
  { icon: typeof ArrowUpRight; className: string }
> = {
  up: {
    icon: ArrowUpRight,
    className: "bg-rose-500/10 text-rose-200 border border-rose-400/30",
  },
  down: {
    icon: ArrowDownRight,
    className: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/30",
  },
  flat: {
    icon: Minus,
    className: "bg-slate-500/10 text-slate-200 border border-slate-400/30",
  },
};

interface MetricPillProps {
  direction: Direction;
  label: string;
  className?: string;
}

export function MetricPill({ direction, label, className }: MetricPillProps) {
  const Icon = directionMap[direction].icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        directionMap[direction].className,
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}
