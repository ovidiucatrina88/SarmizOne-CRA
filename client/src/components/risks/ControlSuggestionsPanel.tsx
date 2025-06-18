import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingDown, TrendingUp, DollarSign, Calendar, Shield, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ControlSuggestion {
  controlId: string;
  name: string;
  description: string;
  controlType: string;
  controlCategory: string;
  implementationStatus: string;
  controlEffectiveness: number;
  implementationCost: string;
  costPerAgent: string;
  isPerAgentPricing: boolean;
  impactCategory: 'likelihood' | 'magnitude' | 'both';
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedRiskReduction: number;
  roi: number;
  paybackMonths: number;
  isAssociated: boolean;
}

interface ControlSuggestionsResponse {
  likelihoodControls: ControlSuggestion[];
  magnitudeControls: ControlSuggestion[];
  bothControls: ControlSuggestion[];
  currentRiskExposure: {
    inherent: number;
    residual: number;
  };
}

interface ControlSuggestionsPanelProps {
  riskId: string;
}

export function ControlSuggestionsPanel({ riskId }: ControlSuggestionsPanelProps) {
  const queryClient = useQueryClient();
  const [selectedControls, setSelectedControls] = useState<string[]>([]);

  const { data: response, isLoading, error } = useQuery({
    queryKey: [`/api/risks/${riskId}/control-suggestions`],
    enabled: !!riskId
  });

  // Extract the data from the API response structure  
  const suggestions = response?.data as ControlSuggestionsResponse;

  const associateControlMutation = useMutation({
    mutationFn: async (controlId: string) => {
      const response = await fetch(`/api/risks/${riskId}/controls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ controlIds: [controlId], associationType: 'manual' })
      });
      if (!response.ok) throw new Error('Failed to associate control');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/risks/${riskId}/control-suggestions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/risks/${riskId}/controls`] });
      toast({ title: 'Control associated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to associate control', variant: 'destructive' });
    }
  });

  const handleControlSelection = (controlId: string) => {
    if (selectedControls.includes(controlId)) {
      setSelectedControls(prev => prev.filter(id => id !== controlId));
    } else {
      setSelectedControls(prev => [...prev, controlId]);
    }
  };

  const handleAssociateControl = (controlId: string) => {
    associateControlMutation.mutate(controlId);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderControlCard = (control: ControlSuggestion) => (
    <Card key={control.controlId} className="mb-4 bg-[#2a2a2a] border-gray-600">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{control.name}</CardTitle>
            <CardDescription className="text-sm">{control.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(control.priority)}>
              {control.priority} priority
            </Badge>
            <Badge variant="outline">
              {Math.round(control.matchScore)}% match
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>{control.controlEffectiveness}/10 effectiveness</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-green-500" />
            <span>{formatCurrency(control.estimatedRiskReduction)} reduction</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <span>{control.roi > 0 ? '+' : ''}{control.roi.toFixed(1)}% ROI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{control.paybackMonths.toFixed(1)} mo payback</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <strong>Reasoning:</strong> {control.reasoning}
        </div>

        <div className="text-sm">
          <strong>Implementation Cost:</strong> {formatCurrency(Number(control.implementationCost))}
          {control.isPerAgentPricing && (
            <span className="text-gray-500"> + {formatCurrency(Number(control.costPerAgent))}/agent</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{control.controlType}</Badge>
            <Badge variant="outline">{control.controlCategory}</Badge>
          </div>
          
          {control.isAssociated ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              Already Associated
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => handleAssociateControl(control.controlId)}
              disabled={associateControlMutation.isPending}
            >
              {associateControlMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Associate Control'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card className="bg-[#1e1e1e] border-gray-700">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-white">Loading control suggestions...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1e1e1e] border-gray-700">
        <CardContent className="py-8 text-center">
          <p className="text-red-400 mb-2">Failed to load control suggestions</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) {
    return (
      <Card className="bg-[#1e1e1e] border-gray-700">
        <CardContent className="py-8 text-center text-gray-400">
          No control suggestions available
        </CardContent>
      </Card>
    );
  }

  // Debug logging to see what data we're receiving
  console.log('Control suggestions data:', suggestions);
  console.log('Likelihood controls:', suggestions.likelihoodControls?.length || 0);
  console.log('Magnitude controls:', suggestions.magnitudeControls?.length || 0);
  console.log('Both controls:', suggestions.bothControls?.length || 0);

  return (
    <div className="space-y-6">
      {/* Risk Exposure Summary */}
      <Card className="bg-[#1e1e1e] border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Current Risk Exposure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-400">Inherent Risk</div>
              <div className="text-2xl font-bold text-red-400">
                {formatCurrency(suggestions.currentRiskExposure?.inherent || 0)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-400">Residual Risk</div>
              <div className="text-2xl font-bold text-orange-400">
                {formatCurrency(suggestions.currentRiskExposure?.residual || 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Suggestions Tabs */}
      <Tabs defaultValue="likelihood" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#2a2a2a] border-gray-600">
          <TabsTrigger value="likelihood" className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4" />
            <span>Reduce Likelihood ({suggestions.likelihoodControls?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="magnitude" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Reduce Impact ({suggestions.magnitudeControls?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="both" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Both ({suggestions.bothControls?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="likelihood" className="mt-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              These controls primarily reduce the likelihood of the risk event occurring.
            </div>
            {suggestions.likelihoodControls?.length > 0 ? (
              suggestions.likelihoodControls.map(renderControlCard)
            ) : (
              <Card className="bg-[#1e1e1e] border-gray-700">
                <CardContent className="py-8 text-center text-gray-400">
                  No likelihood-focused controls available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="magnitude" className="mt-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              These controls primarily reduce the impact or loss magnitude if the risk event occurs.
            </div>
            {suggestions.magnitudeControls?.length > 0 ? (
              suggestions.magnitudeControls.map(renderControlCard)
            ) : (
              <Card className="bg-[#1e1e1e] border-gray-700">
                <CardContent className="py-8 text-center text-gray-400">
                  No impact-focused controls available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="both" className="mt-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-400">
              These controls affect both the likelihood and impact of the risk event.
            </div>
            {suggestions.bothControls?.length > 0 ? (
              suggestions.bothControls.map(renderControlCard)
            ) : (
              <Card className="bg-[#1e1e1e] border-gray-700">
                <CardContent className="py-8 text-center text-gray-400">
                  No dual-impact controls available
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}