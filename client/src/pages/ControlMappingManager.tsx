import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Download, Upload } from "lucide-react";

interface ControlAssetMapping {
  id: number;
  control_id: string;
  asset_type: string;
  relevance_score: number;
  reasoning: string;
}

interface ControlRiskMapping {
  id: number;
  control_id: string;
  threat_community: string;
  risk_category: string;
  vulnerability_pattern: string;
  relevance_score: number;
  impact_type: 'likelihood' | 'magnitude' | 'both';
  reasoning: string;
}

interface Control {
  control_id: string;
  name: string;
  control_category: string;
}

export default function ControlMappingManager() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("asset-mappings");
  
  // New mapping form states
  const [newAssetMapping, setNewAssetMapping] = useState({
    control_id: '',
    asset_type: '',
    relevance_score: 50,
    reasoning: ''
  });
  
  const [newRiskMapping, setNewRiskMapping] = useState({
    control_id: '',
    threat_community: '',
    risk_category: 'operational',
    vulnerability_pattern: '',
    relevance_score: 50,
    impact_type: 'both' as 'likelihood' | 'magnitude' | 'both',
    reasoning: ''
  });

  // Fetch data
  const { data: controls } = useQuery({
    queryKey: ['/api/control-library'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  const { data: assetMappings, refetch: refetchAssetMappings } = useQuery({
    queryKey: ['/api/control-mappings/assets'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  const { data: riskMappings, refetch: refetchRiskMappings } = useQuery({
    queryKey: ['/api/control-mappings/risks'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  // Mutations
  const createAssetMappingMutation = useMutation({
    mutationFn: async (mapping: typeof newAssetMapping) => {
      const response = await fetch('/api/control-mappings/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping)
      });
      if (!response.ok) throw new Error('Failed to create asset mapping');
      return response.json();
    },
    onSuccess: () => {
      refetchAssetMappings();
      setNewAssetMapping({ control_id: '', asset_type: '', relevance_score: 50, reasoning: '' });
      toast({ title: 'Asset mapping created successfully' });
    }
  });

  const createRiskMappingMutation = useMutation({
    mutationFn: async (mapping: typeof newRiskMapping) => {
      const response = await fetch('/api/control-mappings/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping)
      });
      if (!response.ok) throw new Error('Failed to create risk mapping');
      return response.json();
    },
    onSuccess: () => {
      refetchRiskMappings();
      setNewRiskMapping({
        control_id: '',
        threat_community: '',
        risk_category: 'operational',
        vulnerability_pattern: '',
        relevance_score: 50,
        impact_type: 'both',
        reasoning: ''
      });
      toast({ title: 'Risk mapping created successfully' });
    }
  });

  const deleteAssetMappingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/control-mappings/assets/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete asset mapping');
      return response.json();
    },
    onSuccess: () => {
      refetchAssetMappings();
      toast({ title: 'Asset mapping deleted successfully' });
    }
  });

  const deleteRiskMappingMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/control-mappings/risks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete risk mapping');
      return response.json();
    },
    onSuccess: () => {
      refetchRiskMappings();
      toast({ title: 'Risk mapping deleted successfully' });
    }
  });

  const assetTypes = ['application', 'data', 'system', 'network', 'device', 'facility', 'personnel', 'other'];
  const threatCommunities = ['External Threat Actor', 'External cybercriminals', 'Individual hackers', 'Internal threats'];
  const riskCategories = ['operational', 'strategic', 'compliance', 'financial'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control Mapping Manager</h1>
          <p className="text-muted-foreground">
            Configure intelligent control suggestions based on asset types and risk characteristics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="asset-mappings">Asset Type Mappings</TabsTrigger>
          <TabsTrigger value="risk-mappings">Risk-Based Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="asset-mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Asset-Type Mapping</CardTitle>
              <CardDescription>
                Map controls to specific asset types to improve suggestion relevance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="asset-control">Control</Label>
                  <Select value={newAssetMapping.control_id} onValueChange={(value) => 
                    setNewAssetMapping(prev => ({ ...prev, control_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control" />
                    </SelectTrigger>
                    <SelectContent>
                      {controls?.data?.map((control: Control) => (
                        <SelectItem key={control.control_id} value={control.control_id}>
                          {control.control_id} - {control.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="asset-type">Asset Type</Label>
                  <Select value={newAssetMapping.asset_type} onValueChange={(value) => 
                    setNewAssetMapping(prev => ({ ...prev, asset_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="asset-relevance">Relevance Score: {newAssetMapping.relevance_score}%</Label>
                <Slider
                  value={[newAssetMapping.relevance_score]}
                  onValueChange={(value) => setNewAssetMapping(prev => ({ ...prev, relevance_score: value[0] }))}
                  max={100}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="asset-reasoning">Reasoning</Label>
                <Textarea
                  value={newAssetMapping.reasoning}
                  onChange={(e) => setNewAssetMapping(prev => ({ ...prev, reasoning: e.target.value }))}
                  placeholder="Explain why this control is relevant to this asset type..."
                />
              </div>
              
              <Button 
                onClick={() => createAssetMappingMutation.mutate(newAssetMapping)}
                disabled={!newAssetMapping.control_id || !newAssetMapping.asset_type || !newAssetMapping.reasoning}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Mapping
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Asset Mappings</CardTitle>
              <CardDescription>
                {assetMappings?.data?.length || 0} mappings configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control</TableHead>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Relevance</TableHead>
                    <TableHead>Reasoning</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetMappings?.data?.map((mapping: ControlAssetMapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-mono">{mapping.control_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{mapping.asset_type}</Badge>
                      </TableCell>
                      <TableCell>{mapping.relevance_score}%</TableCell>
                      <TableCell className="max-w-md truncate">{mapping.reasoning}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAssetMappingMutation.mutate(mapping.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-mappings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Risk-Based Mapping</CardTitle>
              <CardDescription>
                Map controls to risk characteristics for intelligent threat-specific suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="risk-control">Control</Label>
                  <Select value={newRiskMapping.control_id} onValueChange={(value) => 
                    setNewRiskMapping(prev => ({ ...prev, control_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select control" />
                    </SelectTrigger>
                    <SelectContent>
                      {controls?.data?.map((control: Control) => (
                        <SelectItem key={control.control_id} value={control.control_id}>
                          {control.control_id} - {control.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="threat-community">Threat Community</Label>
                  <Select value={newRiskMapping.threat_community} onValueChange={(value) => 
                    setNewRiskMapping(prev => ({ ...prev, threat_community: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select threat community" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any threat</SelectItem>
                      {threatCommunities.map(threat => (
                        <SelectItem key={threat} value={threat}>{threat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="risk-category">Risk Category</Label>
                  <Select value={newRiskMapping.risk_category} onValueChange={(value) => 
                    setNewRiskMapping(prev => ({ ...prev, risk_category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk category" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vulnerability-pattern">Vulnerability Pattern</Label>
                  <Input
                    value={newRiskMapping.vulnerability_pattern}
                    onChange={(e) => setNewRiskMapping(prev => ({ ...prev, vulnerability_pattern: e.target.value }))}
                    placeholder="e.g., credential theft, data breach"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="impact-type">Impact Type</Label>
                  <Select value={newRiskMapping.impact_type} onValueChange={(value) => 
                    setNewRiskMapping(prev => ({ ...prev, impact_type: value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="likelihood">Likelihood</SelectItem>
                      <SelectItem value="magnitude">Magnitude</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk-relevance">Relevance Score: {newRiskMapping.relevance_score}%</Label>
                  <Slider
                    value={[newRiskMapping.relevance_score]}
                    onValueChange={(value) => setNewRiskMapping(prev => ({ ...prev, relevance_score: value[0] }))}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="risk-reasoning">Reasoning</Label>
                <Textarea
                  value={newRiskMapping.reasoning}
                  onChange={(e) => setNewRiskMapping(prev => ({ ...prev, reasoning: e.target.value }))}
                  placeholder="Explain why this control is effective against this risk scenario..."
                />
              </div>
              
              <Button 
                onClick={() => createRiskMappingMutation.mutate(newRiskMapping)}
                disabled={!newRiskMapping.control_id || !newRiskMapping.reasoning}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Mapping
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Risk Mappings</CardTitle>
              <CardDescription>
                {riskMappings?.data?.length || 0} mappings configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control</TableHead>
                    <TableHead>Threat</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskMappings?.data?.map((mapping: ControlRiskMapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-mono">{mapping.control_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.threat_community || 'Any'}</Badge>
                      </TableCell>
                      <TableCell>{mapping.risk_category}</TableCell>
                      <TableCell>{mapping.vulnerability_pattern}</TableCell>
                      <TableCell>
                        <Badge variant={
                          mapping.impact_type === 'likelihood' ? 'default' :
                          mapping.impact_type === 'magnitude' ? 'secondary' : 'destructive'
                        }>
                          {mapping.impact_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{mapping.relevance_score}%</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRiskMappingMutation.mutate(mapping.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}