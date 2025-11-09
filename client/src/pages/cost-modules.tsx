import { CostModuleList } from "@/components/cost-modules/cost-module-list";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";

export default function CostModulesPage() {
  return (
    <Layout
      pageTitle="Cost Modules"
      pageDescription="Curate the financial building blocks that power risk-to-cost mapping and ROI analysis."
    >
      <div className="space-y-6">
        <CostModuleList />

        <GlowCard className="space-y-4">
          <h3 className="text-lg font-semibold text-white">How Cost Modules Are Used</h3>
          <p className="text-sm text-white/70">
            Cost modules map CIS controls to tangible financial impacts (fixed charges, hourly services, per-event
            costs, or percentages of loss). They are referenced whenever a risk is evaluated so that ROI, transfer,
            and insurance models remain consistent.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                title: "Fixed Cost",
                desc: "One-time investment applied regardless of incident size (e.g., annual retainer).",
              },
              {
                title: "Per Event",
                desc: "Scales with each occurrence (e.g., breach notification per record).",
              },
              {
                title: "Per Hour",
                desc: "Covers hourly services like legal counsel or DFIR retainers.",
              },
              {
                title: "Percentage",
                desc: "Ties to overall loss, useful for regulatory fines or revenue impact.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </Layout>
  );
}
