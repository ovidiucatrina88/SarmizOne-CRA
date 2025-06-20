import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
// Removed checkbox import - using card-based selection pattern
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
    risk_library_ids: [] as string[],
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
      // Create multiple mappings, one for each selected risk
      const promises = mapping.risk_library_ids.map(risk_library_id => 
        fetch('/api/control-mappings/risks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            control_id: mapping.control_id,
            risk_library_id,
            relevance_score: mapping.relevance_score,
            impact_type: mapping.impact_type,
            reasoning: mapping.reasoning
          })
        }).then(response => {
          if (!response.ok) throw new Error(`Failed to create mapping for ${risk_library_id}`);
          return response.json();
        })
      );
      
      return Promise.all(promises);
    },
    onSuccess: (results) => {
      refetchRiskMappings();
      setNewRiskMapping({
        control_id: '',
        risk_library_ids: [],
        relevance_score: 50,
        impact_type: 'both',
        reasoning: ''
      });
      toast({ 
        title: `Successfully created ${results.length} control mapping(s)`,
        description: `Control mapped to ${results.length} risk(s) from library`
      });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to create mappings', 
        description: error.message,
        variant: 'destructive' 
      });
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
                Map one control from control-library to multiple risks from risk-library for intelligent suggestions
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
                  <Label className="text-sm font-medium">Risks from Library (Multiple Selection)</Label>
                  <div className="mt-2 border border-gray-600 rounded-md max-h-60 overflow-y-auto bg-gray-800">
                    {riskLibrary?.data?.map((risk: any, index: number) => {
                      const isSelected = newRiskMapping.risk_library_ids.includes(risk.risk_id);
                      
                      const getCategoryColor = (category: string) => {
                        switch (category?.toLowerCase()) {
                          case 'operational': return 'bg-blue-100 text-blue-800 border-blue-200';
                          case 'strategic': return 'bg-purple-100 text-purple-800 border-purple-200';
                          case 'compliance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                          case 'financial': return 'bg-green-100 text-green-800 border-green-200';
                          default: return 'bg-gray-100 text-gray-800 border-gray-200';
                        }
                      };
                      
                      return (
                        <div 
                          key={`risk-lib-${index}-${risk.risk_id}`}
                          className={`px-6 py-4 cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setNewRiskMapping(prev => ({
                                ...prev,
                                risk_library_ids: prev.risk_library_ids.filter(id => id !== risk.risk_id)
                              }));
                            } else {
                              setNewRiskMapping(prev => ({
                                ...prev,
                                risk_library_ids: [...prev.risk_library_ids, risk.risk_id]
                              }));
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                                  <span className="text-xs font-medium text-gray-200">RSK</span>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-white text-sm">{risk.name}</div>
                                <div className="text-xs text-gray-400">ID: {risk.risk_id}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getCategoryColor(risk.riskCategory || 'operational')}`}>
                                {(risk.riskCategory || 'operational').charAt(0).toUpperCase() + (risk.riskCategory || 'operational').slice(1)}
                              </span>
                              {isSelected && (
                                <div className="h-3 w-3 rounded-full bg-white"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Selected: {newRiskMapping.risk_library_ids.length} risk(s)
                  </p>
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
                disabled={!newRiskMapping.control_id || newRiskMapping.risk_library_ids.length === 0 || !newRiskMapping.reasoning}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create {newRiskMapping.risk_library_ids.length > 0 ? `${newRiskMapping.risk_library_ids.length} ` : ''}Mapping{newRiskMapping.risk_library_ids.length > 1 ? 's' : ''}
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