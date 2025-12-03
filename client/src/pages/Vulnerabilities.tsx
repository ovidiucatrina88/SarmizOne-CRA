import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileDown,
  Plus,
  Search,
  Shield,
  Upload,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function VulnerabilitiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: vulnerabilities, isLoading } = useQuery({
    queryKey: ["/api/assets/vulnerabilities"],
  });

  // Fetch vulnerability summary with trends
  const { data: summaryResponse } = useQuery({
    queryKey: ["/api/assets/vulnerabilities/summary"],
  });

  const summary = summaryResponse?.data || {
    stats: { total: 0, critical: 0, high: 0, open: 0, resolved: 0 },
    trends: {
      total: { series: [], delta: "0% vs last month" },
      criticalHigh: { series: [], delta: "0% vs last month" },
      open: { series: [], delta: "0% vs last month" },
      resolved: { series: [], delta: "0% vs last month" }
    }
  };

  const vulns = vulnerabilities?.data || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/assets/vulnerabilities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets/vulnerabilities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assets/vulnerabilities/summary"] });
      toast({
        title: "Vulnerability deleted",
        description: "The vulnerability has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete vulnerability.",
        variant: "destructive",
      });
    },
  });

  const severityStyles: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    info: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  const statusConfig: Record<string, { pill: string; icon: React.ReactNode }> = {
    open: {
      pill: "bg-red-500/10 text-red-400 border border-red-500/20",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    in_progress: {
      pill: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      icon: <Clock className="h-3 w-3" />,
    },
    mitigated: {
      pill: "bg-green-500/10 text-green-400 border border-green-500/20",
      icon: <Shield className="h-3 w-3" />,
    },
    resolved: {
      pill: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
      icon: <CheckCircle className="h-3 w-3" />,
    },
  };

  const filteredVulns = useMemo(() => {
    return vulns.filter((vuln: any) => {
      const matchesSearch =
        vuln.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.cve_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vuln.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || vuln.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [vulns, searchTerm, severityFilter, statusFilter]);



  if (isLoading) {
    return (
      <Layout pageTitle="Vulnerability Management">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <GlowCard key={idx} compact className="h-[150px]">
                <div className="flex h-full flex-col justify-between">
                  <Skeleton className="h-3 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded" />
                  <Skeleton className="h-5 w-full rounded-full" />
                </div>
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
    <Layout
      pageTitle="Vulnerability Management"
      pageDescription="Monitor CVEs, coordinate fixes, and keep leadership informed."
      pageActions={
        <div className="flex gap-2">
          <Button variant="ghost" className="rounded-full border border-white/10 text-white hover:bg-white/5">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Link href="/assets/vulnerabilities/import">
            <Button className="rounded-full bg-primary px-5 text-primary-foreground">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total Findings"
            value={summary.stats.total.toLocaleString()}
            delta={summary.trends.total.delta}
          />
          <KpiCard
            label="Critical + High"
            value={(summary.stats.critical + summary.stats.high).toLocaleString()}
            delta={summary.trends.criticalHigh.delta}
            trendColor="#fca5a5"
          />
          <KpiCard
            label="Open"
            value={summary.stats.open.toLocaleString()}
            delta={summary.trends.open.delta}
            trendColor="#fdba74"
          />
          <KpiCard
            label="Resolved"
            value={summary.stats.resolved.toLocaleString()}
            delta={summary.trends.resolved.delta}
            trendColor="#86efac"
          />
        </section>

        <GlowCard className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by CVE, title, or description"
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40 focus-visible:ring-0"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48 rounded-2xl border border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-surface-muted text-white">
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 rounded-2xl border border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-surface-muted text-white">
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="inventory" className="space-y-4">
            <TabsList className="rounded-2xl border border-white/10 bg-white/5 text-white">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="inventory">
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/2">
                <Table>
                  <TableHeader className="bg-white/3 text-xs uppercase tracking-[0.3em] text-white/50">
                    <TableRow>
                      <TableHead className="text-white/60">Vulnerability</TableHead>
                      <TableHead className="text-white/60">Severity</TableHead>
                      <TableHead className="text-white/60">Status</TableHead>
                      <TableHead className="text-white/60">Asset</TableHead>
                      <TableHead className="text-right text-white/60">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVulns.map((vuln: any) => (
                      <TableRow key={vuln.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-white">{vuln.title || vuln.cve_id}</p>
                            <p className="text-xs text-white/50">{vuln.description?.slice(0, 120) || "No description"}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityStyles[vuln.severity] || severityStyles.info}`}>
                            {vuln.severity?.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusConfig[vuln.status]?.pill}`}>
                            {statusConfig[vuln.status]?.icon}
                            {vuln.status?.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-white/80">{vuln.asset_name || "N/A"}</div>
                          <div className="text-xs text-white/50">Owner: {vuln.owner || "Unassigned"}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-white hover:bg-rose-500/20 hover:text-rose-200"
                              onClick={() => deleteMutation.mutate(vuln.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredVulns.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-16 text-center text-white/60">
                          No vulnerabilities match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </GlowCard>
      </div>
    </Layout>
  );
}
