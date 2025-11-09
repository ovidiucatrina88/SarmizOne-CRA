import React, { useMemo, useState } from "react";
import { Control, Risk } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ShieldCheck, ChevronDown, ChevronRight, Edit, Trash2, Activity } from "lucide-react";
import {
  badgeTone,
  formatControlCost,
  formatImplementationStatus,
  statusToneMap,
  typeToneMap,
  calculateControlCost,
} from "@/components/controls/control-style";

interface RiskGroupedControlListProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

interface RiskControlGroup {
  riskId: string;
  riskName: string;
  controls: Control[];
  totalCost: number;
  averageEffectiveness: number;
  implementationRate: number;
  controlCounts: {
    total: number;
    fully_implemented: number;
    in_progress: number;
    not_implemented: number;
  };
  riskSeverity: string;
  residualRisk: number;
}

const severityTone: Record<string, string> = {
  critical: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  high: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  medium: "border-yellow-400/30 bg-yellow-500/10 text-yellow-100",
  low: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
};

export function RiskGroupedControlList({
  controls,
  onControlEdit,
  onControlDelete,
}: RiskGroupedControlListProps) {
  const [expandedRisks, setExpandedRisks] = useState<Set<string>>(new Set());
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const { data: risksResponse } = useQuery({
    queryKey: ["/api/risks"],
  });
  const risks: Risk[] = (risksResponse as any)?.data || (risksResponse || []);

  const riskLookup = useMemo(() => {
    const map = new Map<string, { name: string; severity: string; residualRisk: number }>();
    risks.forEach((risk) => {
      map.set(risk.riskId, {
        name: risk.name,
        severity: risk.severity,
        residualRisk: Number(risk.residualRisk) || 0,
      });
    });
    return map;
  }, [risks]);

  const riskGroups = useMemo<RiskControlGroup[]>(() => {
    const groups = new Map<string, RiskControlGroup>();

    controls.forEach((control) => {
      const associatedRisks = Array.isArray(control.associatedRisks)
        ? control.associatedRisks
        : typeof control.associatedRisks === "string"
          ? (control.associatedRisks as string).split(",").map((r) => r.trim())
          : [];

      const targets = associatedRisks.length ? associatedRisks : ["unassigned"];

      targets.forEach((riskId) => {
        const details =
          riskId === "unassigned"
            ? { name: "Unassigned Controls", severity: "low", residualRisk: 0 }
            : riskLookup.get(riskId) || { name: riskId, severity: "low", residualRisk: 0 };

        if (!groups.has(riskId)) {
          groups.set(riskId, {
            riskId,
            riskName: details.name,
            riskSeverity: details.severity ?? "low",
            residualRisk: details.residualRisk ?? 0,
            controls: [],
            totalCost: 0,
            averageEffectiveness: 0,
            implementationRate: 0,
            controlCounts: {
              total: 0,
              fully_implemented: 0,
              in_progress: 0,
              not_implemented: 0,
            },
          });
        }

        const group = groups.get(riskId)!;
        group.controls.push(control);
        group.totalCost += calculateControlCost(control);
        group.controlCounts.total++;
        group.controlCounts[control.implementationStatus as keyof typeof group.controlCounts]++;
      });
    });

    groups.forEach((group) => {
      const implemented =
        group.controlCounts.fully_implemented + group.controlCounts.in_progress * 0.5;
      group.implementationRate =
        group.controlCounts.total > 0 ? (implemented / group.controlCounts.total) * 100 : 0;
      group.averageEffectiveness =
        group.controls.reduce((sum, control) => sum + (control.controlEffectiveness || 0), 0) /
        (group.controls.length || 1);
    });

    return Array.from(groups.values()).sort((a, b) => {
      if (b.residualRisk !== a.residualRisk) {
        return b.residualRisk - a.residualRisk;
      }
      return a.implementationRate - b.implementationRate;
    });
  }, [controls, riskLookup]);

  const toggleRiskExpansion = (riskId: string) => {
    const clone = new Set(expandedRisks);
    if (clone.has(riskId)) {
      clone.delete(riskId);
    } else {
      clone.add(riskId);
    }
    setExpandedRisks(clone);
  };

  return (
    <div className="space-y-4">
      {!riskGroups.length ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
          <Activity className="mx-auto mb-4 h-12 w-12 text-white/40" />
          <p className="text-lg font-semibold text-white">No risk mappings detected</p>
          <p className="text-sm text-white/60">Associate controls with risks to populate this view.</p>
        </div>
      ) : (
        riskGroups.map((group) => (
          <div
            key={group.riskId}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#2a1a2f]/80 via-[#120d1a]/95 to-[#08060d]/95 shadow-[0_35px_110px_rgba(8,6,13,0.75)]"
          >
            <Collapsible open={expandedRisks.has(group.riskId)} onOpenChange={() => toggleRiskExpansion(group.riskId)}>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/5"
                >
                  <div className="flex flex-1 items-center gap-4">
                    {expandedRisks.has(group.riskId) ? (
                      <ChevronDown className="h-5 w-5 text-white/60" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white/60" />
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <ShieldCheck className="h-5 w-5 text-white/70" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-white">{group.riskName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
                          <Badge className={`rounded-full px-3 py-0.5 text-[11px] ${severityTone[group.riskSeverity] || severityTone.low}`}>
                            {group.riskSeverity || "low"} severity
                          </Badge>
                          <span>Residual Risk · {group.residualRisk.toFixed(1)}</span>
                          <span>Controls · {group.controlCounts.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 text-xs text-white/70 md:flex">
                    <Badge className="rounded-full border-white/10 bg-emerald-500/10 text-emerald-100">
                      Avg Eff {(group.averageEffectiveness || 0).toFixed(1)}/10
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-sky-500/10 text-sky-100">
                      Implementation {group.implementationRate.toFixed(0)}%
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-white/10 text-white">
                      Cost {formatCurrency(group.totalCost)}
                    </Badge>
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t border-white/10 px-6 pb-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                        <TableRow>
                          <TableHead className="text-white/70">Control</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Effectiveness</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.controls.map((control) => (
                          <TableRow key={control.id} className="border-b border-white/5">
                            <TableCell className="align-top">
                              <div className="text-sm font-semibold text-white">{control.name}</div>
                              <div className="text-xs uppercase tracking-wide text-white/40">{control.controlId}</div>
                              {control.description && (
                                <p className="mt-1 text-xs text-white/60 line-clamp-2">{control.description}</p>
                              )}
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge
                                className={`rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(
                                  typeToneMap,
                                  control.controlType,
                                )}`}
                              >
                                {control.controlType}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top">
                              <Badge
                                className={`rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(
                                  statusToneMap,
                                  control.implementationStatus,
                                )}`}
                              >
                                {formatImplementationStatus(control.implementationStatus)}
                              </Badge>
                            </TableCell>
                            <TableCell className="align-top">
                              <div className="space-y-1 text-xs text-white/60">
                                <div className="flex items-center justify-between">
                                  <span>Score</span>
                                  <span className="font-semibold text-white">
                                    {(control.controlEffectiveness || 0).toFixed(1)}/10
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-white/5">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400"
                                    style={{ width: `${Math.min((control.controlEffectiveness || 0) * 10, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="align-top text-sm font-semibold text-white">
                              {formatControlCost(control)}
                            </TableCell>
                            <TableCell className="align-top text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                                  onClick={() => onControlEdit?.(control)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                                  onClick={() => setControlToDelete(control)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))
      )}

      <AlertDialog open={!!controlToDelete} onOpenChange={() => setControlToDelete(null)}>
        <AlertDialogContent className="rounded-[28px] border border-white/10 bg-slate-950/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete control</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete “{controlToDelete?.name}”? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-rose-500 text-white hover:bg-rose-400"
              onClick={() => {
                if (controlToDelete) {
                  onControlDelete?.(controlToDelete);
                  setControlToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
