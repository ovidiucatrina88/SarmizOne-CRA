import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Bug, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ShieldAlert, 
  Shield, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VulnerabilitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch vulnerabilities data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/vulnerability-metrics'],
  });
  
  // Create sample vulnerabilities data for demonstration purposes
  // This would normally come from a real API
  const vulnerabilities = [
    {
      id: 1,
      cveId: "CVE-2023-0001",
      description: "Remote code execution vulnerability in web server",
      cvss: 8.4,
      status: "open",
      discoveredDate: "2025-04-15",
      affectedAssets: [
        { id: 1, name: "Web Server 1", assetId: "AST-001" }
      ]
    },
    {
      id: 2,
      cveId: "CVE-2023-0002",
      description: "SQL injection vulnerability in application",
      cvss: 7.2,
      status: "in_progress",
      discoveredDate: "2025-04-18",
      affectedAssets: [
        { id: 2, name: "Application Server", assetId: "AST-002" }
      ]
    },
    {
      id: 3,
      cveId: "CVE-2023-0003",
      description: "Cross-site scripting in web portal",
      cvss: 5.4,
      status: "remediated",
      discoveredDate: "2025-04-10",
      remediatedDate: "2025-04-20",
      affectedAssets: [
        { id: 3, name: "Customer Portal", assetId: "AST-003" }
      ]
    }
  ];
  
  // Filter vulnerabilities based on search term and status
  const filteredVulnerabilities = vulnerabilities.filter((vuln: any) => {
    const matchesSearch = 
      vuln.cveId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.affectedAssets?.some((asset: any) => 
        asset.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesStatus = statusFilter === "all" || vuln.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getSeverityColor = (cvss: number) => {
    if (cvss >= 9.0) return "bg-red-100 text-red-800";
    if (cvss >= 7.0) return "bg-orange-100 text-orange-800";
    if (cvss >= 4.0) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "mitigated": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Open";
      case "in_progress": return "In Progress";
      case "mitigated": return "Mitigated";
      case "resolved": return "Resolved";
      default: return status;
    }
  };
  
  return (
    <div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by CVE ID, description, or asset..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "open" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("open")}
          >
            Open
          </Button>
          <Button
            variant={statusFilter === "in_progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("in_progress")}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === "mitigated" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("mitigated")}
          >
            Mitigated
          </Button>
          <Button
            variant={statusFilter === "resolved" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("resolved")}
          >
            Resolved
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">
            <Bug className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <div className="bg-gray-800 rounded-lg border border-gray-600">
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
              <h3 className="text-lg font-semibold text-white">Vulnerabilities</h3>
              <p className="text-gray-400">
                {filteredVulnerabilities.length} vulnerabilities found
              </p>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : filteredVulnerabilities.length === 0 ? (
                <div className="text-center py-8">
                  <Bug className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No vulnerabilities found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search criteria."
                      : "No vulnerabilities have been detected in your environment."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">CVE ID</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">CVSS</TableHead>
                        <TableHead className="w-[120px]">
                          <div className="flex items-center">
                            eDetect
                            <span className="text-xs ml-1" title="Control Detection Effectiveness">
                              (Detection)
                            </span>
                          </div>
                        </TableHead>
                        <TableHead className="w-[120px]">
                          <div className="flex items-center">
                            eResist
                            <span className="text-xs ml-1" title="Control Resistance Effectiveness">
                              (Resistance)
                            </span>
                          </div>
                        </TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="w-[100px]">Assets</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVulnerabilities.map((vuln: any) => (
                        <TableRow key={vuln.id || vuln.cveId}>
                          <TableCell className="font-medium">{vuln.cveId}</TableCell>
                          <TableCell className="max-w-md truncate">{vuln.description}</TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(vuln.cvss3)}>
                              {vuln.cvss3?.toFixed(1) || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Progress value={vuln.eDetect * 100} className="h-2" />
                              <span className="text-xs text-right">{(vuln.eDetect * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Progress value={vuln.eResist * 100} className="h-2" />
                              <span className="text-xs text-right">{(vuln.eResist * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(vuln.status)}>
                              {getStatusLabel(vuln.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {vuln.affectedAssets && vuln.affectedAssets.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {vuln.affectedAssets.slice(0, 2).map((asset: any) => (
                                  <Badge key={asset.id} variant="outline" className="whitespace-nowrap">
                                    {asset.name}
                                  </Badge>
                                ))}
                                {vuln.affectedAssets.length > 2 && (
                                  <Badge variant="outline">+{vuln.affectedAssets.length - 2}</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">None</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/vulnerabilities/${vuln.id}`}>
                                  Details
                                </Link>
                              </Button>
                              {vuln.status !== "resolved" && (
                                <Button size="sm" variant="outline">
                                  Remediate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-yellow-500" />
                  Severity Distribution
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* For demo purposes, we'll just show placeholder content */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Critical (CVSS 9.0-10.0)</span>
                      <span className="text-sm font-medium text-red-600">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">High (CVSS 7.0-8.9)</span>
                      <span className="text-sm font-medium text-orange-600">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Medium (CVSS 4.0-6.9)</span>
                      <span className="text-sm font-medium text-yellow-600">29%</span>
                    </div>
                    <Progress value={29} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Low (CVSS 0.1-3.9)</span>
                      <span className="text-sm font-medium text-green-600">13%</span>
                    </div>
                    <Progress value={13} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg border border-gray-600">
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Remediation Timeline
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* For demo purposes, we'll just show placeholder content */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Time to Remediate</span>
                      <span className="text-sm font-medium">18.5 days</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Critical Vulnerabilities</span>
                      <span className="text-sm font-medium">4.2 days</span>
                    </div>
                    <Progress value={14} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">High Vulnerabilities</span>
                      <span className="text-sm font-medium">12.6 days</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Medium Vulnerabilities</span>
                      <span className="text-sm font-medium">25.3 days</span>
                    </div>
                    <Progress value={84} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}