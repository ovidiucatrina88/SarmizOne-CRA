import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/layout";
import { 
  Shield, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  FileDown,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { toast } = useToast();

  const { data: vulnerabilities, isLoading } = useQuery({
    queryKey: ['/api/assets/vulnerabilities'],
  });

  const vulns = vulnerabilities?.data || [];

  // Filter vulnerabilities based on search and filters
  const filteredVulns = vulns.filter((vuln: any) => {
    const matchesSearch = !searchTerm || 
      vuln.cveId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = !severityFilter || vuln.severity === severityFilter;
    const matchesStatus = !statusFilter || vuln.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Get summary statistics
  const stats = {
    total: vulns.length,
    critical: vulns.filter((v: any) => v.severity === 'critical').length,
    high: vulns.filter((v: any) => v.severity === 'high').length,
    medium: vulns.filter((v: any) => v.severity === 'medium').length,
    low: vulns.filter((v: any) => v.severity === 'low').length,
    open: vulns.filter((v: any) => v.status === 'open').length,
    inProgress: vulns.filter((v: any) => v.status === 'in_progress').length,
    mitigated: vulns.filter((v: any) => v.status === 'mitigated').length,
    resolved: vulns.filter((v: any) => v.status === 'resolved').length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      case 'info': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mitigated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'mitigated': return <Shield className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-current border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vulnerabilities</h1>
            <p className="text-muted-foreground">
              Manage and track security vulnerabilities across your assets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/assets/vulnerabilities/import">
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical/High</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical + stats.high}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list">
          <TabsList>
            <TabsTrigger value="list">Vulnerability List</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vulnerabilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="mitigated">Mitigated</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerabilities Table */}
            <Card>
              <CardHeader>
                <CardTitle>Vulnerabilities ({filteredVulns.length})</CardTitle>
                <CardDescription>
                  {searchTerm || severityFilter || statusFilter 
                    ? `Showing filtered results (${filteredVulns.length} of ${stats.total})`
                    : `Showing all vulnerabilities`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredVulns.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>CVE ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>CVSS</TableHead>
                        <TableHead>Assets</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVulns.map((vuln: any) => (
                        <TableRow key={vuln.id}>
                          <TableCell className="font-mono text-sm">
                            {vuln.cveId}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px]">
                              <p className="font-medium truncate">{vuln.title}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {vuln.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(vuln.severity)}>
                              {vuln.severity?.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(vuln.status)}
                              <Badge variant="outline" className={getStatusColor(vuln.status)}>
                                {vuln.status?.replace('_', ' ')}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono">
                              {vuln.cvssScore ? vuln.cvssScore.toFixed(1) : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {vuln.assetCount || 0} assets
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link href={`/assets/vulnerabilities/${vuln.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchTerm || severityFilter || statusFilter 
                        ? 'No vulnerabilities match your filters'
                        : 'No vulnerabilities found'
                      }
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || severityFilter || statusFilter 
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Get started by importing vulnerability data.'
                      }
                    </p>
                    <Link href="/assets/vulnerabilities/import">
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Vulnerabilities
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        Critical
                      </span>
                      <span>{stats.critical}</span>
                    </div>
                    <Progress value={(stats.critical / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        High
                      </span>
                      <span>{stats.high}</span>
                    </div>
                    <Progress value={(stats.high / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        Medium
                      </span>
                      <span>{stats.medium}</span>
                    </div>
                    <Progress value={(stats.medium / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Low
                      </span>
                      <span>{stats.low}</span>
                    </div>
                    <Progress value={(stats.low / stats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        Open
                      </span>
                      <span>{stats.open}</span>
                    </div>
                    <Progress value={(stats.open / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-yellow-500" />
                        In Progress
                      </span>
                      <span>{stats.inProgress}</span>
                    </div>
                    <Progress value={(stats.inProgress / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-blue-500" />
                        Mitigated
                      </span>
                      <span>{stats.mitigated}</span>
                    </div>
                    <Progress value={(stats.mitigated / stats.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Resolved
                      </span>
                      <span>{stats.resolved}</span>
                    </div>
                    <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}