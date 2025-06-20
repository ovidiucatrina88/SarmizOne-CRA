import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Download, Upload } from "lucide-react";
import Layout from "@/components/layout/layout";

// Removed ControlAssetMapping interface

interface ControlRiskMapping {
  id: number;
  control_id: string;
  risk_library_id: string;
  relevance_score: number;
  impact_type: 'likelihood' | 'magnitude' | 'both';
  reasoning: string;
}

interface Control {
  control_id: string;
  name: string;
  control_category: string;
}

function ControlMappingManager() {
  const { toast } = useToast();
  
  const [newRiskMapping, setNewRiskMapping] = useState({
    control_id: '',
    risk_library_id: '',
    relevance_score: 50,
    impact_type: 'both' as 'likelihood' | 'magnitude' | 'both',
    reasoning: ''
  });

  // Fetch data
  const { data: controls } = useQuery({
    queryKey: ['/api/control-library'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  const { data: riskLibrary } = useQuery({
    queryKey: ['/api/risk-library'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  // Removed asset mappings query

  const { data: riskMappings, refetch: refetchRiskMappings } = useQuery({
    queryKey: ['/api/control-mappings/risks'],
    queryFn: getQueryFn({ on401: "throw" })
  });

  // Risk mapping mutation

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
        risk_library_id: '',
        relevance_score: 50,
        impact_type: 'both',
        reasoning: ''
      });
      toast({ title: 'Risk mapping created successfully' });
    }
  });

  // Removed asset mapping delete mutation

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

  // No need for static arrays - using risk-library data instead

  return (
    <div className="space-y-6">

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Control Mapping</CardTitle>
              <CardDescription>
                Map controls from control-library to risks from risk-library for intelligent suggestions
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
                      {controls?.data?.map((control: Control, index: number) => (
                        <SelectItem key={`control-${index}-${control.control_id}`} value={control.control_id}>
                          {control.control_id} - {control.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk-library">Risk from Library</Label>
                  <Select value={newRiskMapping.risk_library_id} onValueChange={(value) => 
                    setNewRiskMapping(prev => ({ ...prev, risk_library_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk from library" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLibrary?.data?.map((risk: any, index: number) => (
                        <SelectItem key={`risk-lib-${index}-${risk.risk_id}`} value={risk.risk_id}>
                          {risk.risk_id} - {risk.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                disabled={!newRiskMapping.control_id || !newRiskMapping.risk_library_id || !newRiskMapping.reasoning}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Mapping
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Control Mappings</CardTitle>
              <CardDescription>
                {riskMappings?.data?.length || 0} mappings configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Control</TableHead>
                    <TableHead>Risk Library ID</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskMappings?.data?.map((mapping: any) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-mono">{mapping.control_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.risk_library_id || 'Legacy'}</Badge>
                      </TableCell>
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
      </div>
    </div>
  );
}

export default function ControlMappingManagerPage() {
  return (
    <Layout 
      pageTitle="Control Mapping Manager"
      pageDescription="Configure intelligent control suggestions based on risk characteristics"
      pageActions={
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
      }
    >
      <ControlMappingManager />
    </Layout>
  );
}