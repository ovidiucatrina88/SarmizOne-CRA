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

  const vulns = vulnerabilities?.data || [];

  const stats = useMemo(() => {
    const critical = vulns.filter((v: any) => v.severity === "critical").length;
    const high = vulns.filter((v: any) => v.severity === "high").length;
    const open = vulns.filter((v: any) => v.status === "open").length;
    const resolved = vulns.filter((v: any) => v.status === "resolved").length;
    return {
      total: vulns.length,
      critical,
      high,
      open,
      resolved,
    };
  }, [vulns]);

  const deleteMutation = useMutation({
    mutationFn: (vulnerabilityId: number) => apiRequest("DELETE", `/api/vulnerabilities/${vulnerabilityId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets/vulnerabilities"] });
      toast({ title: "Success", description: "Vulnerability deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vulnerability",
        variant: "destructive",
      });
    },
  });

  const filteredVulns = vulns.filter((vuln: any) => {
    const matchesSearch =
      !searchTerm ||
      vuln.cve_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || vuln.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const severityStyles: Record<string, string> = {
    critical: "bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-100 border border-rose-400/40",
    high: "bg-rose-500/15 text-rose-100 border border-rose-400/40",
    medium: "bg-amber-500/15 text-amber-100 border border-amber-400/40",
    low: "bg-sky-500/15 text-sky-100 border border-sky-400/40",
    info: "bg-white/10 border border-white/20 text-white/70",
  };

  const statusConfig: Record<
    string,
    {
      pill: string;
      icon: React.ReactNode;
    }
  > = {
    open: {
      pill: "bg-rose-500/15 text-rose-200 border border-rose-400/30",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    in_progress: {
      pill: "bg-amber-500/15 text-amber-200 border border-amber-400/30",
      icon: <Clock className="h-4 w-4" />,
    },
    mitigated: {
      pill: "bg-blue-500/15 text-blue-200 border border-blue-400/30",
      icon: <Shield className="h-4 w-4" />,
    },
    resolved: {
      pill: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/30",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  };

  const generateSeries = (seed: number) => {
    const base = seed || 10;
    return Array.from({ length: 7 }).map((_, index) =>
      Number((base * (1 + Math.sin(index / 1.5) * 0.08)).toFixed(2)),
    );
  };

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
          <KpiCard label="Total Findings" value={stats.total.toLocaleString()} delta="+5% vs last month" trendSeries={generateSeries(stats.total)} />
          <KpiCard
            label="Critical + High"
            value={(stats.critical + stats.high).toLocaleString()}
            delta="-2% WoW"
            trendSeries={generateSeries(stats.critical + stats.high)}
            trendColor="#fca5a5"
          />
          <KpiCard
            label="Open"
            value={stats.open.toLocaleString()}
            delta="+3 backlog"
            trendSeries={generateSeries(stats.open)}
            trendColor="#fdba74"
          />
          <KpiCard
            label="Resolved"
            value={stats.resolved.toLocaleString()}
            delta="+12 this week"
            trendSeries={generateSeries(stats.resolved)}
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
