import React, { useState } from "react";
import { Control } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { ExternalLink, Edit, Trash2, AlertTriangle } from "lucide-react";
import {
  badgeTone,
  categoryToneMap,
  formatControlCost,
  formatImplementationStatus,
  statusToneMap,
  typeToneMap,
} from "@/components/controls/control-style";

interface EnhancedControlTableProps {
  controls: Control[];
  onControlEdit?: (control: Control) => void;
  onControlDelete?: (control: Control) => void;
}

export function EnhancedControlTable({ controls, onControlEdit, onControlDelete }: EnhancedControlTableProps) {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [controlToDelete, setControlToDelete] = useState<Control | null>(null);

  const handleControlClick = (control: Control) => {
    setSelectedControl(control);
    setIsDetailDialogOpen(true);
  };

  if (!controls.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-10 text-center text-white/70">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-white/30" />
        <p className="text-lg font-semibold text-white">No controls match these filters</p>
        <p className="text-sm text-white/60">Adjust your filters to see additional controls.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/0">
        <div className="hidden bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-white/60 lg:block">
          Control inventory
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5 text-xs uppercase text-white/60">
              <TableRow className="border-b border-white/5">
                <TableHead className="min-w-[220px] text-white/70">Control</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="min-w-[160px]">Associated Risks</TableHead>
                <TableHead>Status & Effectiveness</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((control) => (
                <TableRow
                  key={control.id}
                  className="group border-b border-white/5 bg-white/0 transition hover:bg-white/[0.03]"
                >
                  <TableCell className="align-top">
                    <button
                      type="button"
                      onClick={() => handleControlClick(control)}
                      className="text-left"
                    >
                      <div className="text-sm font-semibold text-white">{control.name}</div>
                      <div className="text-xs uppercase tracking-wide text-white/40">{control.controlId}</div>
                      {control.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-white/60">{control.description}</p>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className={`rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(typeToneMap, control.controlType)}`}>
                      {control.controlType || "n/a"}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className={`rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(categoryToneMap, control.controlCategory)}`}>
                      {control.controlCategory || "n/a"}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                      {(control as any).complianceFramework || "Custom"}
                    </Badge>
                    {(control as any).cloudDomain && (
                      <div className="mt-1 text-xs text-white/50">{(control as any).cloudDomain}</div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {(control as any).nistMappings?.length ? (
                        <Badge className="rounded-full border border-emerald-400/20 bg-emerald-500/10 text-[11px] text-emerald-100">
                          NIST {(control as any).nistMappings.length}
                        </Badge>
                      ) : null}
                      {(control as any).pciMappings?.length ? (
                        <Badge className="rounded-full border border-violet-400/20 bg-violet-500/10 text-[11px] text-violet-100">
                          PCI {(control as any).pciMappings.length}
                        </Badge>
                      ) : null}
                      {(control as any).cisMappings?.length ? (
                        <Badge className="rounded-full border border-amber-400/20 bg-amber-500/10 text-[11px] text-amber-100">
                          CIS {(control as any).cisMappings.length}
                        </Badge>
                      ) : null}
                      {!((control as any).nistMappings?.length || (control as any).pciMappings?.length || (control as any).cisMappings?.length) && (
                        <span className="text-xs text-white/40">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    {control.associatedRisks && control.associatedRisks.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {control.associatedRisks.slice(0, 3).map((riskId) => (
                          <Badge
                            key={riskId}
                            className="rounded-full border border-white/10 bg-white/5 px-2 text-[11px] text-white/70"
                          >
                            {riskId}
                          </Badge>
                        ))}
                        {control.associatedRisks.length > 3 && (
                          <Badge className="rounded-full border border-white/10 bg-white/5 px-2 text-[11px] text-white/70">
                            +{control.associatedRisks.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-white/40">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="mb-2">
                      <Badge className={`rounded-full px-3 py-0.5 text-xs ${badgeTone(statusToneMap, control.implementationStatus)}`}>
                        {formatImplementationStatus(control.implementationStatus)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-white/60">
                      <div className="flex items-center justify-between">
                        <span>Effectiveness</span>
                        <span className="font-semibold text-white">
                          {(control.controlEffectiveness || 0).toFixed(1)}/10
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
                          style={{ width: `${Math.min((control.controlEffectiveness || 0) * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-sm font-semibold text-white">
                  {formatControlCost(control)}
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleControlClick(control)}
                        className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onControlEdit?.(control)}
                        className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setControlToDelete(control)}
                        className="h-9 w-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
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

      {selectedControl && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/90 text-white backdrop-blur-xl">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold">{selectedControl.name}</DialogTitle>
              <DialogDescription className="text-base text-white/60">{selectedControl.controlId}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <p className="text-sm text-white/70">{selectedControl.description}</p>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-white/40">Type</p>
                  <Badge className={`rounded-full px-3 py-0.5 text-xs ${badgeTone(typeToneMap, selectedControl.controlType)}`}>
                    {selectedControl.controlType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-white/40">Framework</p>
                  <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                    {(selectedControl as any).complianceFramework || "Custom"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-white/40">Implementation</p>
                  <Badge className={`rounded-full px-3 py-0.5 text-xs ${badgeTone(statusToneMap, selectedControl.implementationStatus)}`}>
                    {formatImplementationStatus(selectedControl.implementationStatus)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-white/70">
                  <div className="flex items-center justify-between">
                    <span>Effectiveness</span>
                    <span className="font-semibold text-white">
                      {(selectedControl.controlEffectiveness || 0).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400"
                      style={{ width: `${Math.min((selectedControl.controlEffectiveness || 0) * 10, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  <p className="text-xs uppercase tracking-wide text-white/40">Cost</p>
                  <p className="text-lg font-semibold text-white">{formatControlCost(selectedControl)}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/40">Associated Risks</p>
              {selectedControl.associatedRisks?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedControl.associatedRisks.map((riskId) => (
                    <Badge key={riskId} className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                      {riskId}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-white/60">No risks associated</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
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
