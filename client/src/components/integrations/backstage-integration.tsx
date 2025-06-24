import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Settings, 
  Clock,
  ExternalLink,
  AlertTriangle,
  Activity,
  Download
} from 'lucide-react';

interface BackstageConfig {
  baseUrl: string;
  token?: string;
  namespace: string;
  catalogFilter?: string;
  syncInterval: string;
}

interface SyncResult {
  success: boolean;
  entitiesProcessed: number;
  assetsCreated: number;
  assetsUpdated: number;
  relationshipsCreated: number;
  errors: string[];
  summary: string;
  syncDuration?: number;
  dryRun?: boolean;
}

interface SyncLog {
  id: number;
  syncType: string;
  entitiesProcessed: number;
  assetsCreated: number;
  assetsUpdated: number;
  relationshipsCreated: number;
  syncStatus: string;
  errorDetails: string[] | null;
  syncDuration: number;
  createdAt: string;
}

export function BackstageIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [config, setConfig] = useState<BackstageConfig>({
    baseUrl: '',
    token: '',
    namespace: 'default',
    catalogFilter: 'kind=component,api,resource,system',
    syncInterval: '1h',
  });
  
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: async (config: BackstageConfig) => {
      return apiRequest('/api/backstage/test-connection', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Connection Successful',
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect to Backstage',
        variant: 'destructive',
      });
    },
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async ({ config, dryRun }: { config: BackstageConfig; dryRun: boolean }) => {
      return apiRequest(`/api/backstage/sync?dryRun=${dryRun}`, {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    onSuccess: (data: SyncResult) => {
      toast({
        title: data.dryRun ? 'Preview Complete' : 'Sync Complete',
        description: data.summary,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/backstage/sync-history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/backstage/assets'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync with Backstage',
        variant: 'destructive',
      });
    },
  });

  // Preview entities mutation
  const previewMutation = useMutation({
    mutationFn: async (config: BackstageConfig) => {
      return apiRequest('/api/backstage/entities/preview?limit=20', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    onSuccess: (data) => {
      setPreviewData(data);
      setShowPreview(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Preview Failed',
        description: error.message || 'Failed to preview entities',
        variant: 'destructive',
      });
    },
  });

  // Fetch sync history
  const { data: syncHistory } = useQuery({
    queryKey: ['/api/backstage/sync-history'],
    queryFn: () => apiRequest('/api/backstage/sync-history'),
  });

  // Fetch Backstage assets
  const { data: backstageAssets } = useQuery({
    queryKey: ['/api/backstage/assets'],
    queryFn: () => apiRequest('/api/backstage/assets'),
  });

  const handleTestConnection = () => {
    if (!config.baseUrl) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter the Backstage base URL',
        variant: 'destructive',
      });
      return;
    }
    testConnectionMutation.mutate(config);
  };

  const handlePreview = () => {
    if (!config.baseUrl) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter the Backstage base URL',
        variant: 'destructive',
      });
      return;
    }
    previewMutation.mutate(config);
  };

  const handleSync = (dryRun: boolean = false) => {
    if (!config.baseUrl) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter the Backstage base URL',
        variant: 'destructive',
      });
      return;
    }
    syncMutation.mutate({ config, dryRun });
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">Failed</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500 text-black">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg border border-gray-600">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backstage Integration
          </h3>
          <p className="text-gray-400 text-sm">Import service catalog from your Backstage deployment</p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="configuration" className="w-full">
            <TabsList className="mb-4 bg-gray-700">
              <TabsTrigger value="configuration" className="data-[state=active]:bg-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-gray-600">
                <Database className="w-4 h-4 mr-2" />
                Assets ({backstageAssets?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Sync History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseUrl" className="text-white">Backstage Base URL *</Label>
                    <Input
                      id="baseUrl"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                      placeholder="https://backstage.company.com"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="token" className="text-white">API Token (Optional)</Label>
                    <Input
                      id="token"
                      type="password"
                      value={config.token}
                      onChange={(e) => setConfig({ ...config, token: e.target.value })}
                      placeholder="backstage-api-token"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="namespace" className="text-white">Default Namespace</Label>
                    <Input
                      id="namespace"
                      value={config.namespace}
                      onChange={(e) => setConfig({ ...config, namespace: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="syncInterval" className="text-white">Sync Interval</Label>
                    <Input
                      id="syncInterval"
                      value={config.syncInterval}
                      onChange={(e) => setConfig({ ...config, syncInterval: e.target.value })}
                      placeholder="1h"
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="catalogFilter" className="text-white">Catalog Filter</Label>
                  <Textarea
                    id="catalogFilter"
                    value={config.catalogFilter}
                    onChange={(e) => setConfig({ ...config, catalogFilter: e.target.value })}
                    placeholder="kind=component,api,resource,system"
                    rows={2}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Filter entities to import (e.g., kind=component,api or spec.type=service)
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Button
                    onClick={handleTestConnection}
                    disabled={testConnectionMutation.isPending}
                    variant="outline"
                    className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  >
                    {testConnectionMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Activity className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  
                  <Button
                    onClick={handlePreview}
                    disabled={previewMutation.isPending}
                    variant="outline"
                    className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  >
                    {previewMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ExternalLink className="w-4 h-4 mr-2" />
                    )}
                    Preview Entities
                  </Button>
                  
                  <Button
                    onClick={() => handleSync(true)}
                    disabled={syncMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {syncMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Dry Run
                  </Button>
                  
                  <Button
                    onClick={() => handleSync(false)}
                    disabled={syncMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {syncMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4 mr-2" />
                    )}
                    Full Sync
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              {backstageAssets && backstageAssets.length > 0 ? (
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600">
                        <TableHead className="text-gray-300">Asset</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Entity Ref</TableHead>
                        <TableHead className="text-gray-300">Owner</TableHead>
                        <TableHead className="text-gray-300">Last Sync</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backstageAssets.map((asset: any) => (
                        <TableRow key={asset.id} className="border-gray-600">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{asset.name}</div>
                              <div className="text-sm text-gray-400">{asset.assetId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-300 border-gray-500">
                              {asset.assetType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono text-sm">
                            {asset.backstageEntityRef}
                          </TableCell>
                          <TableCell className="text-gray-300">{asset.owner}</TableCell>
                          <TableCell className="text-gray-300">
                            {asset.lastBackstageSync ? 
                              new Date(asset.lastBackstageSync).toLocaleDateString() : 
                              'Never'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert className="bg-gray-700 border-gray-600">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-gray-300">
                    No Backstage assets found. Run a sync to import entities from your catalog.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {syncHistory && syncHistory.length > 0 ? (
                <div className="bg-gray-700 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-600">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Entities</TableHead>
                        <TableHead className="text-gray-300">Assets</TableHead>
                        <TableHead className="text-gray-300">Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncHistory.map((log: SyncLog) => (
                        <TableRow key={log.id} className="border-gray-600">
                          <TableCell className="text-gray-300">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">{log.syncType}</TableCell>
                          <TableCell>{getSyncStatusBadge(log.syncStatus)}</TableCell>
                          <TableCell className="text-gray-300">{log.entitiesProcessed}</TableCell>
                          <TableCell className="text-gray-300">
                            +{log.assetsCreated} / ~{log.assetsUpdated}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {formatDuration(log.syncDuration)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert className="bg-gray-700 border-gray-600">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-gray-300">
                    No sync history available. Start your first sync to see results here.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">Entity Preview</DialogTitle>
            <DialogDescription className="text-gray-400">
              Preview of entities that will be imported from Backstage
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-300">
                  Total Entities: <span className="font-bold text-white">{previewData.totalEntities}</span>
                </span>
                <span className="text-gray-300">
                  Showing: <span className="font-bold text-white">{previewData.previewCount}</span>
                </span>
              </div>
              
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600">
                      <TableHead className="text-gray-300">Entity</TableHead>
                      <TableHead className="text-gray-300">Kind</TableHead>
                      <TableHead className="text-gray-300">Owner</TableHead>
                      <TableHead className="text-gray-300">Will Create Asset</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.preview.map((entity: any, index: number) => (
                      <TableRow key={index} className="border-gray-600">
                        <TableCell className="text-white">
                          <div>
                            <div className="font-medium">{entity.name}</div>
                            <div className="text-sm text-gray-400 font-mono">{entity.entityRef}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-300 border-gray-500">
                            {entity.kind}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{entity.owner || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 text-white">
                            {entity.willCreateAsset.assetType}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}