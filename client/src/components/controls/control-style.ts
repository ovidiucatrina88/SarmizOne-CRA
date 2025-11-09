import { Control } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

export const tone = {
  emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  amber: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  rose: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  sky: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  violet: "border-violet-400/30 bg-violet-500/10 text-violet-100",
  zinc: "border-white/10 bg-white/5 text-white/70",
} as const;

export const statusToneMap: Record<string, keyof typeof tone> = {
  fully_implemented: "emerald",
  in_progress: "amber",
  planned: "sky",
  not_implemented: "rose",
};

export const typeToneMap: Record<string, keyof typeof tone> = {
  preventive: "emerald",
  detective: "sky",
  corrective: "violet",
};

export const categoryToneMap: Record<string, keyof typeof tone> = {
  technical: "violet",
  administrative: "amber",
  physical: "emerald",
};

export const badgeTone = (map: Record<string, keyof typeof tone>, key?: string) => tone[key ? map[key] || "zinc" : "zinc"];

export const formatImplementationStatus = (status: string) => {
  switch (status) {
    case "fully_implemented":
      return "Fully Implemented";
    case "in_progress":
      return "In Progress";
    case "planned":
      return "Planned";
    case "not_implemented":
      return "Not Implemented";
    default:
      return status || "N/A";
  }
};

export const calculateControlCost = (control: Control) => {
  if (control.implementationStatus === "fully_implemented") {
    return control.isPerAgentPricing ? Number(control.costPerAgent) || 0 : Number(control.implementationCost) || 0;
  }
  if (control.implementationStatus === "in_progress") {
    const deployed = Number(control.deployedAgentCount) || 0;
    const costPerAgent = Number(control.costPerAgent) || 0;
    return deployed * costPerAgent;
  }
  return Number(control.implementationCost) || 0;
};

export const formatControlCost = (control: Control) => {
  const totalCost = calculateControlCost(control);
  if (control.implementationStatus === "fully_implemented" && control.isPerAgentPricing) {
    return `${formatCurrency(totalCost)}/agent`;
  }
  return formatCurrency(totalCost);
};
