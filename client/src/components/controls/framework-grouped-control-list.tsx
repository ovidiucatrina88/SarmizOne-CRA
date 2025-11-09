import React, { useMemo, useState } from "react";
import { Control } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Shield, ChevronDown, ChevronRight, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  badgeTone,
  formatControlCost,
  formatImplementationStatus,
  statusToneMap,
  typeToneMap,
  calculateControlCost,
} from "@/components/controls/control-style";

interface FrameworkGroupedControlListProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

interface FrameworkControlGroup {
  framework: string;
  frameworkName: string;
  controls: Control[];
  totalCost: number;
  implementationRate: number;
  controlCounts: {
    total: number;
    fully_implemented: number;
    in_progress: number;
    not_implemented: number;
  };
}

const getFrameworkDisplayName = (framework: string) => {
  const names = {
    ISO27001: "ISO 27001",
    NIST: "NIST Cybersecurity Framework",
    SOC2: "SOC 2",
    CIS: "CIS Controls",
    Custom: "Custom Controls",
  };
  return names[framework as keyof typeof names] || framework;
};

export function FrameworkGroupedControlList({
  controls,
  onControlEdit,
  onControlDelete,
}: FrameworkGroupedControlListProps) {
  const [expandedFrameworks, setExpandedFrameworks] = useState<Set<string>>(new Set());
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const frameworkGroups = useMemo<FrameworkControlGroup[]>(() => {
    const groups = new Map<string, FrameworkControlGroup>();

    controls.forEach((control) => {
      const framework = (control as any).complianceFramework || "Custom";
      const frameworkName = getFrameworkDisplayName(framework);

      if (!groups.has(framework)) {
        groups.set(framework, {
          framework,
          frameworkName,
          controls: [],
          totalCost: 0,
          implementationRate: 0,
          controlCounts: {
            total: 0,
            fully_implemented: 0,
            in_progress: 0,
            not_implemented: 0,
          },
        });
      }

      const group = groups.get(framework)!;
      group.controls.push(control);
      group.totalCost += calculateControlCost(control);
      group.controlCounts.total++;
      group.controlCounts[control.implementationStatus as keyof typeof group.controlCounts]++;
    });

    groups.forEach((group) => {
      const implemented =
        group.controlCounts.fully_implemented + group.controlCounts.in_progress * 0.5;
      group.implementationRate =
        group.controlCounts.total > 0 ? (implemented / group.controlCounts.total) * 100 : 0;
    });

    return Array.from(groups.values()).sort((a, b) => b.implementationRate - a.implementationRate);
  }, [controls]);

  const toggleFrameworkExpansion = (framework: string) => {
    const clone = new Set(expandedFrameworks);
    if (clone.has(framework)) {
      clone.delete(framework);
    } else {
      clone.add(framework);
    }
    setExpandedFrameworks(clone);
  };

  return (
    <div className="space-y-4">
      {!frameworkGroups.length ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-white/40" />
          <p className="text-lg font-semibold text-white">No framework coverage available</p>
          <p className="text-sm text-white/60">Align controls to frameworks to populate this view.</p>
        </div>
      ) : (
        frameworkGroups.map((group) => (
          <div
            key={group.framework}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#151b30]/85 via-[#0d1324]/95 to-[#070b16]/95 shadow-[0_35px_110px_rgba(7,10,22,0.6)]"
          >
            <Collapsible
              open={expandedFrameworks.has(group.framework)}
              onOpenChange={() => toggleFrameworkExpansion(group.framework)}
            >
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-white/5"
                >
                  <div className="flex flex-1 items-center gap-4">
                    {expandedFrameworks.has(group.framework) ? (
                      <ChevronDown className="h-5 w-5 text-white/60" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-white/60" />
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        <Shield className="h-5 w-5 text-white/70" />
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-white">{group.frameworkName}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
                          <Badge className="rounded-full border-white/10 bg-white/10 text-[11px] text-white">
                            {group.controlCounts.total} controls
                          </Badge>
                          <span>Total Cost · {formatCurrency(group.totalCost)}</span>
                          <span>Implementation · {group.implementationRate.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 text-xs text-white/70 md:flex">
                    <Badge className="rounded-full border-white/10 bg-emerald-500/10 text-emerald-100">
                      {group.controlCounts.fully_implemented} Implemented
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-amber-500/10 text-amber-100">
                      {group.controlCounts.in_progress} In Progress
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-rose-500/10 text-rose-100">
                      {group.controlCounts.not_implemented} Not Implemented
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
