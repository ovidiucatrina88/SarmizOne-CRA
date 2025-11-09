import React, { useMemo, useState } from "react";
import { Control } from "@shared/schema";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Edit, ExternalLink, Trash2 } from "lucide-react";
import {
  badgeTone,
  categoryToneMap,
  formatControlCost,
  formatImplementationStatus,
  statusToneMap,
  typeToneMap,
} from "@/components/controls/control-style";

type ControlListProps = {
  controls: Control[];
  onEdit: (control: Control) => void;
  onDelete?: (control: Control) => void;
};

const gradients = [
  "from-[#2f2b54]/90 via-[#1d1a32]/90 to-[#110f1f]/95",
  "from-[#103e35]/85 via-[#0b2d26]/90 to-[#051612]/95",
  "from-[#1e2b52]/85 via-[#121a30]/90 to-[#090d18]/95",
];

export function ControlList({ controls, onEdit, onDelete }: ControlListProps) {
  const [detailsControl, setDetailsControl] = useState<Control | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Control | null>(null);

  const cards = useMemo(() => controls || [], [controls]);

  if (!cards.length) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center text-white/70">
        <p className="text-lg font-semibold text-white">No controls match the current filters.</p>
        <p className="text-sm text-white/60">Adjust filters or create a new control to populate this view.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((control, index) => (
          <GlowCard
            key={control.id}
            compact
            className={`h-full rounded-[28px] border-white/10 bg-gradient-to-b ${gradients[index % gradients.length]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">{control.controlId}</p>
                <h3 className="mt-1 text-xl font-semibold text-white">{control.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">{control.description || "No description provided."}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                  onClick={() => setDetailsControl(control)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:bg-white/10"
                  onClick={() => onEdit(control)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                    onClick={() => setDeleteCandidate(control)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Type</p>
                <Badge className={`mt-1 rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(typeToneMap, control.controlType)}`}>
                  {control.controlType || "n/a"}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Category</p>
                <Badge
                  className={`mt-1 rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(categoryToneMap, control.controlCategory)}`}
                >
                  {control.controlCategory || "n/a"}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Status</p>
                <Badge
                  className={`mt-1 rounded-full px-3 py-0.5 text-xs capitalize ${badgeTone(
                    statusToneMap,
                    control.implementationStatus,
                  )}`}
                >
                  {formatImplementationStatus(control.implementationStatus)}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Effectiveness</p>
                <p className="mt-1 text-base font-semibold text-white">
                  {(control.controlEffectiveness || 0).toFixed(1)}
                  <span className="text-sm text-white/50"> / 10</span>
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400"
                    style={{ width: `${Math.min((control.controlEffectiveness || 0) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[18px] border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              <p className="text-xs uppercase tracking-wide text-white/40">Cost</p>
              <p className="text-lg font-semibold text-white">{formatControlCost(control)}</p>
            </div>
            {control.associatedRisks?.length ? (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-white/40">Associated Risks</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {control.associatedRisks.slice(0, 3).map((riskId) => (
                    <Badge key={riskId} className="rounded-full border border-white/10 bg-white/5 px-2 text-[11px] text-white/70">
                      {riskId}
                    </Badge>
                  ))}
                  {control.associatedRisks.length > 3 && (
                    <Badge className="rounded-full border border-white/10 bg-white/5 px-2 text-[11px] text-white/70">
                      +{control.associatedRisks.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ) : null}
          </GlowCard>
        ))}
      </div>

      <Dialog open={!!detailsControl} onOpenChange={() => setDetailsControl(null)}>
        <DialogContent className="max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/90 text-white">
          <DialogHeader>
            <DialogTitle>{detailsControl?.name}</DialogTitle>
            <DialogDescription className="text-white/60">{detailsControl?.controlId}</DialogDescription>
          </DialogHeader>
          {detailsControl && (
            <div className="space-y-4 text-sm text-white/70">
              <p>{detailsControl.description || "No description provided."}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">Framework</p>
                  <Badge className="mt-1 rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                    {(detailsControl as any).complianceFramework || "Custom"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/40">Cost</p>
                  <p className="mt-1 text-lg font-semibold text-white">{formatControlCost(detailsControl)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">Associated Risks</p>
                {detailsControl.associatedRisks?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detailsControl.associatedRisks.map((riskId) => (
                      <Badge key={riskId} className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                        {riskId}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-white/60">No risks associated.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCandidate} onOpenChange={() => setDeleteCandidate(null)}>
        <AlertDialogContent className="rounded-[28px] border border-white/10 bg-slate-950/90 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete control</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              This will permanently delete “{deleteCandidate?.name}”. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-rose-500 text-white hover:bg-rose-400"
              onClick={() => {
                if (deleteCandidate && onDelete) {
                  onDelete(deleteCandidate);
                }
                setDeleteCandidate(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
