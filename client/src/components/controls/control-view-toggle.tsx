import React from "react";
import { cn } from "@/lib/utils";
import { List, Grid3X3, Shield, ShieldCheck } from "lucide-react";

export type ControlViewMode = 'list' | 'cards' | 'framework' | 'risk';

interface ControlViewToggleProps {
  viewMode: ControlViewMode;
  onViewModeChange: (mode: ControlViewMode) => void;
}

export function ControlViewToggle({ viewMode, onViewModeChange }: ControlViewToggleProps) {
  const options: Array<{ value: ControlViewMode; label: string; icon: React.ElementType }> = [
    { value: "list", label: "Table", icon: List },
    { value: "cards", label: "Cards", icon: Grid3X3 },
    { value: "risk", label: "Risks", icon: ShieldCheck },
    { value: "framework", label: "Frameworks", icon: Shield },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-sm font-medium text-white/70">
      {options.map(({ value, label, icon: Icon }) => {
        const isActive = viewMode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onViewModeChange(value)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1.5 transition-all",
              isActive
                ? "bg-white text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.25)]"
                : "text-white/70 hover:text-white"
            )}
          >
            <Icon className={cn("h-4 w-4", !isActive && "text-white/60")} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
