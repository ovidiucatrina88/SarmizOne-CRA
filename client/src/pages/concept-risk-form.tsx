import { Calculator, Link2, NotebookPen, RefreshCw, Sparkles } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { RiskFormPreviewEditableConcept } from "@/components/risks/risk-form-preview-editable-concept";

const DEFAULT_FAIR_VALUES = {
  // Contact Frequency (CF)
  contactFrequencyMin: 0,
  contactFrequencyAvg: 0,
  contactFrequencyMax: 0,
  contactFrequencyConfidence: "medium",

  // Probability of Action (POA)
  probabilityOfActionMin: 0,
  probabilityOfActionAvg: 0,
  probabilityOfActionMax: 0,
  probabilityOfActionConfidence: "medium",

  // Threat Capability (TCap)
  threatCapabilityMin: 0,
  threatCapabilityAvg: 0,
  threatCapabilityMax: 0,
  threatCapabilityConfidence: "medium",

  // Resistance Strength (RS)
  resistanceStrengthMin: 0,
  resistanceStrengthAvg: 0,
  resistanceStrengthMax: 0,
  resistanceStrengthConfidence: "medium",

  // Primary Loss Magnitude (PL)
  primaryLossMagnitudeMin: 0,
  primaryLossMagnitudeAvg: 0,
  primaryLossMagnitudeMax: 0,
  primaryLossMagnitudeConfidence: "medium",

  // Secondary Loss Event Frequency (SLEF)
  secondaryLossEventFrequencyMin: 0,
  secondaryLossEventFrequencyAvg: 0,
  secondaryLossEventFrequencyMax: 0,
  secondaryLossEventFrequencyConfidence: "medium",

  // Secondary Loss Magnitude (SLM)
  secondaryLossMagnitudeMin: 0,
  secondaryLossMagnitudeAvg: 0,
  secondaryLossMagnitudeMax: 0,
  secondaryLossMagnitudeConfidence: "medium",

  // Calculated values defaults
  threatEventFrequencyMin: 0,
  threatEventFrequencyAvg: 0,
  threatEventFrequencyMax: 0,
  threatEventFrequencyConfidence: "medium",

  lossEventFrequencyMin: 0,
  lossEventFrequencyAvg: 0,
  lossEventFrequencyMax: 0,
  lossEventFrequencyConfidence: "medium",

  susceptibilityMin: 0,
  susceptibilityAvg: 0,
  susceptibilityMax: 0,
  susceptibilityConfidence: "medium",

  lossMagnitudeMin: 0,
  lossMagnitudeAvg: 0,
  lossMagnitudeMax: 0,

  riskId: "RISK-ORPHANED-374",
  inherentRisk: 12400000,
  residualRisk: 5100000,
  severity: "medium",
};

const linkedAssets = [
  { name: "Digital Banking", id: "AST-780", value: "$28M", owner: "Finance IT" },
  { name: "Customer Analytics Cluster", id: "AST-102", value: "$12M", owner: "Data Science" },
];

export default function ConceptRiskForm() {
  const form = useForm({
    defaultValues: DEFAULT_FAIR_VALUES,
  });

  return (
    <div className="min-h-screen bg-[#030714] text-white">
      <Form {...form}>
        <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-6 py-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">Concept Demo</p>
              <h1 className="text-4xl font-semibold">Edit Risk (FAIR Studio)</h1>
              <p className="text-sm text-white/60">Polished, dependency-aware shell used for stakeholder reviews.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="rounded-full border border-white/10 text-white">
                Cancel
              </Button>
              <Button className="rounded-full bg-emerald-400 px-6 text-slate-900">
                <Sparkles className="mr-2 h-4 w-4" />
                Update Risk
              </Button>
            </div>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <GlowCard compact className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Profile</p>
                    <h2 className="text-2xl font-semibold">Risk overview</h2>
                    <p className="text-sm text-white/60">
                      Capture the scenario context so quantification stays aligned to the business objective.
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-200">FAIR-U</Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Risk ID</p>
                    <div className="rounded-2xl bg-black/20 px-4 py-3 font-mono">RISK-ORPHANED-374</div>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Risk Name</p>
                      <div className="rounded-2xl bg-black/20 px-4 py-3">Orphaned accounts, excessive privileges</div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Category / Severity</p>
                      <div className="flex gap-3">
                        <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-emerald-200">Operational</div>
                        <div className="rounded-2xl bg-amber-500/10 px-4 py-3 text-amber-200">Medium</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Description</p>
                    <div className="rounded-2xl bg-black/20 px-4 py-4 text-sm text-white/80">
                      Risk of orphaned accounts and excessive privileges intersecting with external workforce models,
                      affecting enterprise data mesh and banking APIs.
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Threat Community</p>
                      <div className="rounded-2xl bg-black/20 px-4 py-3">External Workforce Vendors</div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Vulnerability</p>
                      <div className="rounded-2xl bg-black/20 px-4 py-3">Unpatched IAM workflows</div>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <GlowCard compact className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Associations</p>
                    <h3 className="text-xl font-semibold">Assets & ownership</h3>
                  </div>
                  <Button variant="ghost" className="rounded-full border border-white/10 text-xs text-white/70">
                    <Link2 className="mr-2 h-4 w-4" />
                    Manage assets
                  </Button>
                </div>
                <div className="space-y-4">
                  {linkedAssets.map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold">{asset.name}</p>
                        <p className="text-xs text-white/60">{asset.id} • Owner: {asset.owner}</p>
                      </div>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        {asset.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard compact className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <NotebookPen className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-[0.35em]">Notes</span>
                </div>
                <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-white/70">
                  Outline key assumptions, compensating controls, or approval notes. (Static demo block)
                </div>
              </GlowCard>
            </div>

            <div className="space-y-6">
              <GlowCard compact className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Fair Summary</p>
                    <h3 className="text-xl font-semibold">Dynamic calculations</h3>
                  </div>
                  <Button variant="ghost" className="rounded-full border border-white/10 text-xs text-white/80">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run calculations
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SummaryTile title="Annualized loss before controls" value="$12.4M" />
                  <SummaryTile title="After mitigations" value="$5.1M" />
                  <SummaryTile title="Average events per year" value="0.8 / yr" />
                  <SummaryTile title="Average loss per occurrence" value="$15.0k" />
                </div>
              </GlowCard>

            </div>
          </div>

          <GlowCard className="space-y-6">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">FAIR Parameter Editor</p>
                <p className="text-xl font-semibold">Dependency chain</p>
              </div>
            </div>
            <RiskFormPreviewEditableConcept form={form} selectedAssets={linkedAssets.map(a => a.id)} />
          </GlowCard>
        </div>
      </Form>
    </div>
  );
}

function SummaryTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
