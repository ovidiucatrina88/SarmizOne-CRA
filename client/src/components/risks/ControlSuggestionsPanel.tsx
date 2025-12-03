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

  const { data: response, isLoading, error } = useQuery<{ data: ControlSuggestionsResponse }>({
    queryKey: [`/api/risks/${riskId}/control-suggestions`],
    enabled: !!riskId
  });

  // Extract the data from the API response structure  
  const suggestions = response?.data;

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
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const renderControlCard = (control: ControlSuggestion) => (
    <Card key={control.controlId} className="mb-3 bg-gray-800 border-gray-600">
      <CardHeader className="pb-2 bg-gray-700">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base text-white">{control.name}</CardTitle>
            <CardDescription className="text-xs text-gray-400">{control.description}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getPriorityColor(control.priority)} text-xs px-2 py-0.5`}>
              {control.priority}
            </Badge>
            <Badge variant="outline" className="border-gray-500 text-gray-300 text-xs px-2 py-0.5">
              {Math.round(control.matchScore)}% match
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-300">
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>{control.controlEffectiveness}/10 eff.</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-3 w-3 text-green-400" />
            <span>{formatCurrency(control.estimatedRiskReduction)} red.</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-3 w-3 text-purple-400" />
            <span>{control.roi > 0 ? '+' : ''}{control.roi.toFixed(1)}% ROI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 w-3 text-orange-400" />
            <span>{control.paybackMonths.toFixed(1)} mo payback</span>
          </div>
        </div>

        <div className="text-xs text-gray-300">
          <strong className="text-white">Reasoning:</strong> {control.reasoning}
        </div>

        <div className="text-xs text-gray-300">
          <strong className="text-white">Cost:</strong> {formatCurrency(Number(control.implementationCost))}
          {control.isPerAgentPricing && (
            <span className="text-gray-400"> + {formatCurrency(Number(control.costPerAgent))}/agent</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-gray-600 text-gray-200 text-[10px] px-1.5 py-0.5">{control.controlType}</Badge>
            <Badge variant="outline" className="border-gray-500 text-gray-300 text-[10px] px-1.5 py-0.5">{control.controlCategory}</Badge>
          </div>

          {control.isAssociated ? (
            <Badge variant="default" className="bg-green-600 text-white text-xs">
              Associated
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => handleAssociateControl(control.controlId)}
              disabled={associateControlMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 h-7 text-xs px-3"
            >
              {associateControlMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Associate'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-white">Loading control suggestions...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="py-8 text-center">
          <p className="text-red-400 mb-2">Failed to load control suggestions</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) {
    return (
      <Card className="bg-gray-800 border-gray-600">
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
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="bg-gray-700">
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
        <TabsList className="grid w-full grid-cols-3 bg-gray-700 border-gray-600">
          <TabsTrigger value="likelihood" className="flex items-center space-x-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <TrendingDown className="h-4 w-4" />
            <span>Reduce Likelihood ({suggestions.likelihoodControls?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="magnitude" className="flex items-center space-x-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4" />
            <span>Reduce Impact ({suggestions.magnitudeControls?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="both" className="flex items-center space-x-2 data-[state=active]:bg-gray-800 data-[state=active]:text-white">
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
              <Card className="bg-gray-800 border-gray-600">
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
              <Card className="bg-gray-800 border-gray-600">
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
              <Card className="bg-gray-800 border-gray-600">
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
