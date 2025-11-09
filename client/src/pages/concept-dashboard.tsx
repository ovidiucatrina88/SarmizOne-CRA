import { ArrowDownRight, ArrowUpRight, BarChart3, ShieldCheck } from "lucide-react";
import { GlowCard } from "@/components/ui/glow-card";
import { MetricPill } from "@/components/ui/metric-pill";
import { KpiCard } from "@/components/ui/kpi-card";

const kpiCards = [
  { 
    label: "Likelihood", 
    value: "2.48%", 
    delta: "-0.15%", 
    tone: "text-emerald-300",
    series: [2.9, 2.7, 2.8, 2.6, 2.55, 2.5, 2.48],
  },
  { 
    label: "Loss Magnitude", 
    value: "$200M", 
    delta: "+1.05%", 
    tone: "text-rose-300",
    series: [190, 192, 194, 196, 198, 201, 200],
  },
  { 
    label: "Time Horizon", 
    value: "3 Months", 
    delta: "~350M", 
    tone: "text-slate-200",
    series: [320, 330, 335, 345, 350, 355, 350],
  },
];

const scenarios = [
  { name: "Credit Monitoring – DDoS", likelihood: "↓ 25%", loss: "↓ $122" },
  { name: "Ransomware + Exfiltration", likelihood: "↓ 21%", loss: "↓ $25" },
  { name: "Digital – APTs", likelihood: "↓ 18%", loss: "↓ $21" },
];

const riskTable = [
  { name: "IP training Gen AI model", likelihood: "97%", loss: "$18K", actor: "Privileged Insider", category: "Data Exfiltration", trend: { direction: "up" as const, value: "+5%" } },
  { name: "Insider shares PII", likelihood: "97%", loss: "$6.6M", actor: "Privileged Insider", category: "Data Exfiltration", trend: { direction: "down" as const, value: "-2%" } },
  { name: "Company IP leaked", likelihood: "97%", loss: "$18K", actor: "Privileged Insider", category: "Data Exfiltration", trend: { direction: "flat" as const, value: "0%" } },
  { name: "Threat actor steals model", likelihood: "43%", loss: "$348K", actor: "Cyber Criminal", category: "Data Exfiltration", trend: { direction: "up" as const, value: "+8%" } },
];

const topControls = [
  { code: "THM", name: "Application Threat Modeling", score: "95%" },
  { code: "NDR", name: "Network Detection & Response", score: "95%" },
  { code: "CSP", name: "Cyber Security Policies", score: "95%" },
];


export default function ConceptDashboard() {
  return (
    <div className="min-h-screen bg-[#050913] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Safe One Concept</p>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">Risk Intelligence Workspace</h1>
          <p className="text-slate-300 sm:text-lg">
            Premium visualization of FAIR scenarios, benchmarks, and remediation maturity.
          </p>
        </header>

        {/* KPI row */}
        <div className="grid gap-6 sm:grid-cols-3">
          {kpiCards.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              trendSeries={kpi.series}
              trendColor={kpi.tone.includes("rose") ? "#fda4af" : "#86efac"}
            />
          ))}
        </div>

        {/* Loss timeline + scenario list */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Loss Exceedance</p>
                <p className="text-2xl font-semibold text-white">Materiality Assessment</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">SMB</button>
                <button className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-200">Enterprise</button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-b from-white/5 to-transparent p-6">
              <div className="flex items-baseline justify-between text-sm text-slate-300">
                <span>-50M</span>
                <span>0</span>
                <span>3 Months</span>
              </div>
              <svg viewBox="0 0 400 180" className="mt-4 w-full">
                <defs>
                  <linearGradient id="curve" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5ef1c7" stopOpacity="1" />
                    <stop offset="100%" stopColor="#5ef1c7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 150 Q50 40 110 80 T220 60 T330 90 T400 70"
                  fill="none"
                  stroke="url(#curve)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </GlowCard>

          <GlowCard>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-emerald-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Scenario Trends</p>
                <p className="text-2xl font-semibold">Monitored Events</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.name}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  <div>
                    <p className="font-medium text-white">{scenario.name}</p>
                    <p className="text-xs text-slate-400">Cyber criminals • DDoS</p>
                  </div>
                  <div className="flex gap-6">
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ArrowDownRight className="h-4 w-4" /> {scenario.likelihood}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ArrowDownRight className="h-4 w-4" /> {scenario.loss}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Risk table */}
        <GlowCard gradient="from-[#2b1838]/70 via-[#170e1f]/80 to-[#0f0714]/90">
          <div className="flex items-center gap-3">
            <AlertIcon />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-rose-200">Risk Scenarios</p>
              <p className="text-2xl font-semibold">Data Exfiltration Watchlist</p>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl bg-white/5">
            <table className="w-full text-left text-sm text-white/90">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Likelihood</th>
                  <th className="px-6 py-3">Loss Magnitude</th>
                  <th className="px-6 py-3">Signal</th>
                  <th className="px-6 py-3">Threat Actor</th>
                  <th className="px-6 py-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {riskTable.map((risk) => (
                  <tr key={risk.name} className="text-sm">
                    <td className="px-6 py-4 font-medium text-white">{risk.name}</td>
                    <td className="px-6 py-4 text-rose-200">{risk.likelihood}</td>
                    <td className="px-6 py-4">{risk.loss}</td>
                    <td className="px-6 py-4">
                      <MetricPill direction={risk.trend.direction} label={risk.trend.value} />
                    </td>
                    <td className="px-6 py-4">{risk.actor}</td>
                    <td className="px-6 py-4">{risk.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>

        {/* Control maturity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-sky-300" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Control Performance</p>
                <p className="text-2xl font-semibold text-white">Top Maturity Scores</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {topControls.map((control) => (
                <div
                  key={control.code}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(46,154,255,0.4)]">
                      {control.code}
                    </div>
                    <div>
                      <p className="text-base font-medium">{control.name}</p>
                      <p className="text-xs text-slate-400">Continuous monitoring</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm text-emerald-300">
                    {control.score}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard>
            <div className="flex h-full flex-col gap-5">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Narrative</p>
                <p className="text-2xl font-semibold text-white">Executive Snapshot</p>
              </div>
              <p className="text-sm text-slate-200">
                Confidence improved by 12% MoM while loss tolerance remains below $10M. Incident response
                thresholds are configured for both SMB and Enterprise segments, enabling board-ready storytelling.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-200">
                <p className="font-medium text-white">Key Signals</p>
                <ul className="mt-3 list-disc space-y-2 pl-4">
                  <li>Benchmark vs. IRIS shows below-industry residual risk.</li>
                  <li>Controls THM/NDR/CSP sustain 95% maturity.</li>
                  <li>Priority: reduce insider-driven data exfiltration exposure.</li>
                </ul>
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-400 text-white shadow-lg shadow-rose-500/30">
      <ArrowUpRight className="h-6 w-6" />
    </div>
  );
}
