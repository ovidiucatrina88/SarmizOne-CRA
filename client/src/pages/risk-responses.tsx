import React, { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RiskResponseForm } from "@/components/risk-responses/risk-response-form";
import { Search, RefreshCw, PlusCircle, Edit, Trash2 } from "lucide-react";

type RiskResponse = {
  id: number;
  riskId: string;
  responseType: "mitigate" | "transfer" | "avoid" | "accept";
  assignedControls?: string[];
  transferMethod?: string;
  avoidanceStrategy?: string;
  acceptanceReason?: string;
  justification?: string;
};

const responseTone: Record<RiskResponse["responseType"], string> = {
  mitigate: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
  transfer: "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
  avoid: "border-rose-400/30 bg-rose-500/10 text-rose-100",
  accept: "border-amber-400/30 bg-amber-500/10 text-amber-100",
};

export default function RiskResponses() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<RiskResponse | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: responsesData,
    isLoading: responsesLoading,
    refetch: refetchResponses,
  } = useQuery({
    queryKey: ["/api/risk-responses"],
  });

  const { data: risksData, isLoading: risksLoading } = useQuery({
    queryKey: ["/api/risks"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/risk-responses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete risk response");
      return response.json();
    },
    onSuccess: () => {
      refetchResponses();
      toast({ title: "Response deleted" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting response",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const riskResponses: RiskResponse[] = (responsesData as any)?.data ?? [];
  const risks: Risk[] = (risksData as any)?.data ?? [];
  const isLoading = responsesLoading || risksLoading;

  const filteredResponses = useMemo(() => {
    return riskResponses.filter(
      (response) =>
        !searchQuery ||
        response.responseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getRiskName(response.riskId, risks)
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        response.justification?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [riskResponses, searchQuery, risks]);

  const stats = useMemo(() => {
    const total = riskResponses.length;
    const typeCounts = riskResponses.reduce(
      (acc, response) => {
        acc[response.responseType] = (acc[response.responseType] || 0) + 1;
        return acc;
      },
      { mitigate: 0, transfer: 0, avoid: 0, accept: 0 } as Record<RiskResponse["responseType"], number>,
    );
    return { total, ...typeCounts, coverage: total ? Math.round((typeCounts.mitigate / total) * 100) : 0 };
  }, [riskResponses]);

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    refetchResponses();
    toast({ title: "Response added", description: "Risk response added successfully." });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedResponse(null);
    refetchResponses();
    toast({ title: "Response updated", description: "Risk response updated successfully." });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const getRiskName = (riskId: string, riskList: Risk[]) => {
    const risk = riskList.find((r) => r.riskId === riskId);
    return risk ? risk.name : "Unknown Risk";
  };

  const pageActions = (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        className="rounded-full border border-white/10 text-white hover:bg-white/10"
        onClick={() => refetchResponses()}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
      <Button className="rounded-full bg-primary px-5 text-primary-foreground" onClick={() => setIsAddDialogOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Response
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <Layout pageTitle="Risk Responses" pageDescription="Plan, track, and analyze risk treatment strategies." pageActions={pageActions}>
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <GlowCard key={idx} compact className="border-white/10">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="mt-4 h-6 w-32 rounded-[10px]" />
                <Skeleton className="mt-2 h-4 w-16 rounded-full" />
              </GlowCard>
            ))}
          </div>
          <GlowCard className="p-8">
            <Skeleton className="h-96 w-full rounded-[32px]" />
          </GlowCard>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Risk Responses" pageDescription="Plan, track, and analyze risk treatment strategies." pageActions={pageActions}>
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Responses" value={stats.total.toLocaleString()} delta={`${filteredResponses.length} in view`} />
          <KpiCard label="Mitigate" value={stats.mitigate.toLocaleString()} delta="Mitigation actions" trendColor="#86efac" />
          <KpiCard label="Transfer" value={stats.transfer.toLocaleString()} delta="Insurance/offloading" trendColor="#c4b5fd" />
          <KpiCard label="Mitigation Coverage" value={`${stats.coverage}%`} delta="Share of mitigation responses" trendColor="#fda4af" />
        </section>

        <GlowCard className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Filters</p>
              <p className="text-lg font-semibold text-white">Locate responses by risk or treatment type</p>
            </div>
            <div className="text-sm text-white/60">
              {filteredResponses.length} of {riskResponses.length} responses
            </div>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search responses by risk, response type, or justification…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
            />
          </div>
        </GlowCard>

        <GlowCard className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Responses</p>
              <p className="text-lg font-semibold text-white">Treatment library</p>
            </div>
            <div className="text-sm text-white/60">{filteredResponses.length} entries</div>
          </div>
          {!filteredResponses.length ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-white/5 p-12 text-center text-white/60">
              No risk responses found. Use “Add Response” to create one.
            </div>
          ) : (
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <Table>
                <TableHeader className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
                  <TableRow>
                    <TableHead>Risk</TableHead>
                    <TableHead>Response Type</TableHead>
                    <TableHead>Justification</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow key={response.id} className="border-b border-white/5">
                      <TableCell className="align-top text-sm font-semibold text-white">
                        {getRiskName(response.riskId, risks)}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge className={`rounded-full border px-3 py-0.5 text-xs capitalize ${responseTone[response.responseType]}`}>
                          {response.responseType}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-sm text-white/70">
                        {response.justification || "Not documented"}
                      </TableCell>
                      <TableCell className="align-top text-sm text-white/70">
                        {response.responseType === "mitigate" && (
                          <>
                            <span className="text-white/60 text-xs uppercase tracking-wide">Controls</span>
                            <p>{response.assignedControls?.length ? response.assignedControls.join(", ") : "None assigned"}</p>
                          </>
                        )}
                        {response.responseType === "transfer" && (
                          <>
                            <span className="text-white/60 text-xs uppercase tracking-wide">Transfer Method</span>
                            <p>{response.transferMethod || "Not specified"}</p>
                          </>
                        )}
                        {response.responseType === "avoid" && (
                          <>
                            <span className="text-white/60 text-xs uppercase tracking-wide">Avoidance Strategy</span>
                            <p>{response.avoidanceStrategy || "Not specified"}</p>
                          </>
                        )}
                        {response.responseType === "accept" && (
                          <>
                            <span className="text-white/60 text-xs uppercase tracking-wide">Acceptance Reason</span>
                            <p>{response.acceptanceReason || "Not specified"}</p>
                          </>
                        )}
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-full border border-white/10 text-white hover:bg-white/10"
                            onClick={() => {
                              setSelectedResponse(response);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-full border border-rose-400/20 text-rose-200 hover:bg-rose-500/10"
                            onClick={() => handleDelete(response.id)}
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
          )}
        </GlowCard>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Add Risk Response</DialogTitle>
          </DialogHeader>
          <RiskResponseForm risks={risks} onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/95 text-white">
          <DialogHeader>
            <DialogTitle>Edit Risk Response</DialogTitle>
          </DialogHeader>
          {selectedResponse && (
            <RiskResponseForm risks={risks} response={selectedResponse} onSuccess={handleEditSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
