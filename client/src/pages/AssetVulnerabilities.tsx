import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Upload, Search, Filter, Bug, Shield, Calendar, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Vulnerability {
  id: string;
  cveId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  cvssScore?: number;
  status: 'open' | 'in_progress' | 'mitigated' | 'resolved' | 'false_positive';
  discoveredDate: string;
  affectedAssets: string[];
}

export default function AssetVulnerabilities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: vulnerabilities, isLoading } = useQuery({
    queryKey: ['/api/assets/vulnerabilities'],
    queryFn: async () => {
      const response = await fetch('/api/assets/vulnerabilities');
      if (!response.ok) throw new Error('Failed to fetch vulnerabilities');
      const result = await response.json();
      return result.data as Vulnerability[];
    }
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/assets/vulnerabilities/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'vulnerability_scanner' })
      });
      
      if (!response.ok) throw new Error('Import failed');
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Import Complete",
        description: result.message || `Imported ${result.imported || 0} vulnerabilities`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assets/vulnerabilities'] });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200';
      case 'mitigated': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200';
      case 'false_positive': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const filteredVulnerabilities = vulnerabilities?.filter(vuln => {
    const matchesSearch = !searchTerm || 
      vuln.cveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || vuln.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Asset Vulnerabilities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage security vulnerabilities across your asset inventory
          </p>
        </div>
        <Button 
          onClick={() => importMutation.mutate()} 
          disabled={importMutation.isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="h-4 w-4" />
          {importMutation.isPending ? 'Importing...' : 'Import Vulnerabilities'}
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by CVE ID or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="mitigated">Mitigated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {!filteredVulnerabilities || filteredVulnerabilities.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <Bug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
                ? 'No vulnerabilities match your filters' 
                : 'No Vulnerabilities Found'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || severityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'No vulnerabilities have been discovered for your assets yet. Import vulnerability scan results to get started.'
              }
            </p>
            {(!searchTerm && severityFilter === 'all' && statusFilter === 'all') && (
              <Button 
                onClick={() => importMutation.mutate()} 
                disabled={importMutation.isPending}
                className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4" />
                Import Vulnerabilities
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Vulnerabilities ({filteredVulnerabilities.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-700 dark:text-gray-300">CVE ID</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Severity</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">CVSS</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Assets</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Discovered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVulnerabilities.map((vuln) => (
                  <TableRow key={vuln.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <TableCell className="font-mono text-sm text-gray-900 dark:text-white">
                      {vuln.cveId}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-900 dark:text-white">
                      {vuln.title}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(vuln.severity)}>
                        {vuln.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {vuln.cvssScore ? (
                        <Badge variant="outline" className="border-gray-300 dark:border-gray-600">
                          {vuln.cvssScore}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vuln.status)}>
                        {vuln.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-gray-400" />
                        {vuln.affectedAssets.length}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(vuln.discoveredDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}