import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Upload, Search, Filter } from 'lucide-react';

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
  
  const { data: vulnerabilities, isLoading } = useQuery({
    queryKey: ['/api/assets/vulnerabilities'],
    queryFn: async () => {
      const response = await fetch('/api/assets/vulnerabilities');
      if (!response.ok) throw new Error('Failed to fetch vulnerabilities');
      const result = await response.json();
      return result.data as Vulnerability[];
    }
  });

  const handleImportVulnerabilities = async () => {
    try {
      const response = await fetch('/api/assets/vulnerabilities/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'vulnerability_scanner' })
      });
      
      if (!response.ok) throw new Error('Import failed');
      const result = await response.json();
      console.log('Import result:', result);
    } catch (error) {
      console.error('Import error:', error);
    }
  };

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
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'mitigated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'false_positive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Asset Vulnerabilities</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage security vulnerabilities across your asset inventory
          </p>
        </div>
        <Button onClick={handleImportVulnerabilities} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Vulnerabilities
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search vulnerabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {vulnerabilities && vulnerabilities.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Vulnerabilities Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No vulnerabilities have been discovered for your assets yet. 
              Import vulnerability scan results to get started.
            </p>
            <Button onClick={handleImportVulnerabilities} className="flex items-center gap-2 mx-auto">
              <Upload className="h-4 w-4" />
              Import Vulnerabilities
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vulnerabilities?.map((vuln) => (
            <Card key={vuln.id} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {vuln.cveId}
                      <Badge className={getSeverityColor(vuln.severity)}>
                        {vuln.severity.toUpperCase()}
                      </Badge>
                      {vuln.cvssScore && (
                        <Badge variant="outline">
                          CVSS {vuln.cvssScore}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {vuln.title}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(vuln.status)}>
                    {vuln.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {vuln.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>Discovered: {new Date(vuln.discoveredDate).toLocaleDateString()}</span>
                  <span>{vuln.affectedAssets.length} affected assets</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}