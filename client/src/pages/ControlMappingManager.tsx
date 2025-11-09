import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import Layout from "@/components/layout/layout";
import { getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Search, Plus, Trash2, Download, Upload } from "lucide-react";

interface ControlRiskMapping {
  id: number;
  control_id: string;
  risk_library_id: string;
  relevance_score: number;
  impact_type: "likelihood" | "magnitude" | "both";
  reasoning: string;
}

interface Control {
  controlId: string;
  name: string;
  description?: string;
  controlType?: string;
  controlCategory?: string;
  complianceFramework?: string;
}

interface RiskTemplate {
  risk_id?: string;
  riskId?: string;
  name: string;
  description?: string;
  riskCategory?: string;
}

const typeTone: Record<string, string> = {
  preventive: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  detective: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  corrective: "border-violet-400/30 bg-violet-500/10 text-violet-100",
};

const impactTone: Record<ControlRiskMapping["impact_type"], string> = {
  likelihood: "border-sky-400/30 bg-sky-500/10 text-sky-100",
  magnitude: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100",
  both: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
};

function ControlMappingManager() {
  const { toast } = useToast();
  const [controlSearchQuery, setControlSearchQuery] = useState("");
  const [controlFilterFramework, setControlFilterFramework] = useState("all");
  const [controlFilterType, setControlFilterType] = useState("all");
  const [riskSearchQuery, setRiskSearchQuery] = useState("");
  const [riskFilterCategory, setRiskFilterCategory] = useState("all");
  const [newRiskMapping, setNewRiskMapping] = useState({
    control_id: "",
    risk_library_ids: [] as string[],
    relevance_score: 55,
    impact_type: "both" as ControlRiskMapping["impact_type"],
    reasoning: "",
  });

  const { data: controls } = useQuery({
    queryKey: ["/api/control-library"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: riskLibrary } = useQuery({
    queryKey: ["/api/risk-library"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: riskMappings, refetch: refetchRiskMappings } = useQuery({
    queryKey: ["/api/control-mappings/risks"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const controlLibraryData = (controls as any)?.data ?? [];
  const riskLibraryData = (riskLibrary as any)?.data ?? [];
  const riskMappingsData: ControlRiskMapping[] = (riskMappings as any)?.data ?? [];

  const stats = useMemo(() => {
    const avgScore = riskMappingsData.length
      ? riskMappingsData.reduce((sum, mapping) => sum + (mapping.relevance_score || 0), 0) / riskMappingsData.length
      : 0;
    return {
      controls: controlLibraryData.length,
      risks: riskLibraryData.length,
      mappings: riskMappingsData.length,
      avgScore,
    };
  }, [controlLibraryData.length, riskLibraryData.length, riskMappingsData]);

  const filteredControls: Control[] = useMemo(() => {
    return controlLibraryData.filter((control: Control) => {
      const matchesSearch =
        !controlSearchQuery ||
        control.name?.toLowerCase().includes(controlSearchQuery.toLowerCase()) ||
        control.controlId?.toLowerCase().includes(controlSearchQuery.toLowerCase()) ||
        control.description?.toLowerCase().includes(controlSearchQuery.toLowerCase());
      const matchesFramework =
        controlFilterFramework === "all" ||
        control.complianceFramework?.toLowerCase() === controlFilterFramework.toLowerCase();
      const matchesType =
        controlFilterType === "all" ||
        control.controlType?.toLowerCase() === controlFilterType.toLowerCase();
      return matchesSearch && matchesFramework && matchesType;
    });
  }, [controlLibraryData, controlSearchQuery, controlFilterFramework, controlFilterType]);

  const filteredRisks: RiskTemplate[] = useMemo(() => {
    return riskLibraryData.filter((risk: RiskTemplate) => {
      const matchesSearch =
        !riskSearchQuery ||
        risk.name?.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
        risk.riskId?.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
        risk.description?.toLowerCase().includes(riskSearchQuery.toLowerCase());
      const matchesCategory =
        riskFilterCategory === "all" ||
        risk.riskCategory?.toLowerCase() === riskFilterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [riskLibraryData, riskSearchQuery, riskFilterCategory]);

  const createRiskMappingMutation = useMutation({
    mutationFn: async (mapping: typeof newRiskMapping) => {
      const requests = mapping.risk_library_ids.map((risk_library_id) =>
        fetch("/api/control-mappings/risks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            control_id: mapping.control_id,
            risk_library_id,
            relevance_score: mapping.relevance_score,
            impact_type: mapping.impact_type,
            reasoning: mapping.reasoning,
          }),
        }).then((response) => {
          if (!response.ok) throw new Error(`Failed to create mapping for ${risk_library_id}`);
          return response.json();
        }),
      );
      return Promise.all(requests);
    },
    onSuccess: (results) => {
      refetchRiskMappings();
      setNewRiskMapping({
        control_id: "",
        risk_library_ids: [],
        relevance_score: 55,
        impact_type: "both",
        reasoning: "",
      });
      toast({
        title: "Mappings created",
        description: `Linked control to ${results.length} risk template${results.length === 1 ? "" : "s"}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create mappings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRiskMappingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/control-mappings/risks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete risk mapping");
      return response.json();
    },
    onSuccess: () => {
      refetchRiskMappings();
      toast({ title: "Risk mapping deleted" });
    },
  });

  const selectedControl = controlLibraryData.find(
    (control: Control) => String(control.controlId) === newRiskMapping.control_id,
  );

  const builderDisabled =
    !newRiskMapping.control_id || !newRiskMapping.risk_library_ids.length || !newRiskMapping.reasoning.trim();

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Control Templates" value={stats.controls.toLocaleString()} delta={`${filteredControls.length} in view`} />
        <KpiCard
          label="Risk Templates"
          value={stats.risks.toLocaleString()}
          delta="Available context"
          trendColor="#c4b5fd"
        />
        <KpiCard
          label="Mappings"
          value={stats.mappings.toLocaleString()}
          delta="Active pairings"
          trendColor="#86efac"
        />
        <KpiCard
          label="Avg Relevance"
          value={`${stats.avgScore.toFixed(1)}%`}
          delta="Quality score"
          trendColor="#fda4af"
        />
      </section>

      <GlowCard className="space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Builder</p>
            <p className="text-lg font-semibold text-white">Map controls to risk templates</p>
          </div>
          <div className="text-sm text-white/60">
            {newRiskMapping.risk_library_ids.length ? `${newRiskMapping.risk_library_ids.length} risks selected` : "Select risks to map"}
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Control Library</span>
              <span>{filteredControls.length} results</span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search controls..."
                  value={controlSearchQuery}
                  onChange={(event) => {
                    setControlSearchQuery(event.target.value);
                  }}
                  className="h-10 rounded-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
                />
              </div>
              <Select value={controlFilterFramework} onValueChange={setControlFilterFramework}>
                <SelectTrigger className="h-10 flex-1 rounded-full border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Framework" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  <SelectItem value="all">All Frameworks</SelectItem>
                  <SelectItem value="cis">CIS</SelectItem>
                  <SelectItem value="nist">NIST</SelectItem>
                  <SelectItem value="iso27001">ISO 27001</SelectItem>
                  <SelectItem value="soc2">SOC 2</SelectItem>
                </SelectContent>
              </Select>
              <Select value={controlFilterType} onValueChange={setControlFilterType}>
                <SelectTrigger className="h-10 flex-1 rounded-full border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="detective">Detective</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
              {!filteredControls.length && (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
                  No controls match your filters.
                </div>
              )}
              {filteredControls.map((control) => {
                const controlId = String(control.controlId);
                const isSelected = newRiskMapping.control_id === controlId;
                return (
                  <button
                    key={controlId}
                    type="button"
                    className={cn(
                      "w-full rounded-[24px] border border-white/10 bg-white/5 p-4 text-left transition-all",
                      isSelected && "border-white/40 bg-white/10 shadow-[0_10px_45px_rgba(15,23,42,0.45)]",
                    )}
                    onClick={() =>
                      setNewRiskMapping((prev) => ({
                        ...prev,
                        control_id: isSelected ? "" : controlId,
                      }))
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{control.name}</p>
                        <p className="text-xs uppercase tracking-wide text-white/40">ID: {controlId}</p>
                        {control.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-white/60">{control.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={cn("rounded-full border px-3 py-0.5 text-xs capitalize", typeTone[control.controlType || ""])}>{control.controlType || "N/A"}</Badge>
                        <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                          {control.complianceFramework || "Custom"}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Risk Library</span>
              <span>{filteredRisks.length} results</span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  placeholder="Search risks..."
                  value={riskSearchQuery}
                  onChange={(event) => setRiskSearchQuery(event.target.value)}
                  className="h-10 rounded-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
                />
              </div>
              <Select value={riskFilterCategory} onValueChange={setRiskFilterCategory}>
                <SelectTrigger className="h-10 flex-1 rounded-full border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900 text-white">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[360px] space-y-3 overflow-y-auto pr-2">
              {!filteredRisks.length && (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
                  No risks match your filters.
                </div>
              )}
              {filteredRisks.map((risk) => {
                const riskId = String(risk.risk_id || risk.riskId);
                const isSelected = newRiskMapping.risk_library_ids.includes(riskId);
                return (
                  <button
                    key={riskId}
                    type="button"
                    className={cn(
                      "w-full rounded-[24px] border border-white/10 bg-white/5 p-4 text-left transition-all",
                      isSelected && "border-primary bg-primary/10 text-white shadow-[0_10px_45px_rgba(15,23,42,0.45)]",
                    )}
                    onClick={() =>
                      setNewRiskMapping((prev) => ({
                        ...prev,
                        risk_library_ids: isSelected
                          ? prev.risk_library_ids.filter((id) => id !== riskId)
                          : [...prev.risk_library_ids, riskId],
                      }))
                    }
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{risk.name}</p>
                        <p className="text-xs uppercase tracking-wide text-white/40">ID: {riskId}</p>
                        {risk.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-white/60">{risk.description}</p>
                        )}
                      </div>
                      <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs capitalize text-white/70">
                        {risk.riskCategory || "General"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <Label className="text-sm font-semibold text-white">Impact emphasis</Label>
            <div className="mt-3 flex gap-2 text-sm font-medium text-white/70">
              {(["likelihood", "magnitude", "both"] as ControlRiskMapping["impact_type"][]).map((impact) => (
                <button
                  key={impact}
                  type="button"
                  className={cn(
                    "flex-1 rounded-full border border-white/10 px-4 py-2 transition",
                    newRiskMapping.impact_type === impact ? "bg-white text-slate-900" : "bg-transparent text-white/70",
                  )}
                  onClick={() => setNewRiskMapping((prev) => ({ ...prev, impact_type: impact }))}
                >
                  {impact === "both" ? "Likelihood + Impact" : impact.charAt(0).toUpperCase() + impact.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Relevance score</span>
                <span className="font-semibold text-white">{newRiskMapping.relevance_score}%</span>
              </div>
              <Slider
                value={[newRiskMapping.relevance_score]}
                onValueChange={(value) => setNewRiskMapping((prev) => ({ ...prev, relevance_score: value[0] }))}
                max={100}
                step={5}
                className="mt-4"
              />
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <Label className="text-sm font-semibold text-white">Reasoning</Label>
            <Textarea
              placeholder="Explain why this control mitigates the selected risk scenario..."
              value={newRiskMapping.reasoning}
              onChange={(event) => setNewRiskMapping((prev) => ({ ...prev, reasoning: event.target.value }))}
              className="mt-3 min-h-[140px] border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
            <p className="mt-2 text-xs text-white/50">
              Use this narrative to inform intelligent suggestions and reporting context.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <div>
            {selectedControl ? (
              <span>
                Mapping <span className="font-semibold text-white">{selectedControl.name}</span> to{" "}
                <span className="font-semibold text-white">{newRiskMapping.risk_library_ids.length}</span> risk
                template{newRiskMapping.risk_library_ids.length === 1 ? "" : "s"}.
              </span>
            ) : (
              <span>Select a control and at least one risk template to enable mapping.</span>
            )}
          </div>
          <Button
            className="rounded-full bg-primary px-6 text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => createRiskMappingMutation.mutate(newRiskMapping)}
            disabled={builderDisabled || createRiskMappingMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {createRiskMappingMutation.isPending ? "Creating..." : `Create Mapping${newRiskMapping.risk_library_ids.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      </GlowCard>

      <GlowCard className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Mappings</p>
            <p className="text-lg font-semibold text-white">Existing control-to-risk links</p>
          </div>
          <div className="text-sm text-white/60">{riskMappingsData.length} mappings configured</div>
        </div>
        {riskMappingsData.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center text-white/60">
            No control mappings found. Use the builder above to create your first pairing.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-white/10">
            <Table>
              <TableHeader className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                <TableRow>
                  <TableHead>Control</TableHead>
                  <TableHead>Risk Template</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {riskMappingsData.map((mapping) => (
                  <TableRow key={mapping.id} className="border-b border-white/5">
                    <TableCell className="align-top">
                      <div className="text-sm font-semibold text-white">{mapping.control_id}</div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-white/70">
                        {mapping.risk_library_id || "Legacy"}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge className={cn("rounded-full border px-3 py-0.5 text-xs capitalize", impactTone[mapping.impact_type])}>
                        {mapping.impact_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-sm font-semibold text-white">
                      {mapping.relevance_score}%
                    </TableCell>
                    <TableCell className="align-top text-sm text-white/70">
                      {mapping.reasoning || "—"}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                        onClick={() => deleteRiskMappingMutation.mutate(mapping.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </GlowCard>
    </div>
  );
}

export default function ControlMappingManagerPage() {
  const pageActions = (
    <div className="flex gap-2">
      <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/10">
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>
    </div>
  );

  return (
    <Layout
      pageTitle="Control Mapping Manager"
      pageDescription="Configure intelligent control suggestions based on risk characteristics."
      pageActions={pageActions}
    >
      <ControlMappingManager />
    </Layout>
  );
}
