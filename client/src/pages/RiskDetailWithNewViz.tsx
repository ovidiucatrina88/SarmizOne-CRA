import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, FileEdit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { Risk, RiskCalculationParams } from '@shared/schema';
import XyflowFairVisualization from '../components/risks/XyflowFairVisualization';
import FairVisualizationTemplate from '../components/risks/fair-visualization-template';

const RiskDetailWithNewViz: React.FC = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Fetch risk data
  const { data: risk, isLoading, error } = useQuery<Risk>({
    queryKey: ['/api/risks', id],
    enabled: !!id,
  });
  
  // Extract FAIR risk parameters with type safety
  const getFairParams = (risk: Risk): RiskCalculationParams => {
    // Ensure all numeric values are properly converted from potential string types
    const ensureNumber = (value: string | number | null | undefined, defaultValue: number): number => {
      if (value === null || value === undefined) return defaultValue;
      return typeof value === 'string' ? parseFloat(value) : value;
    };
    
    return {
      // Contact Frequency
      contactFrequencyMin: ensureNumber(risk.contactFrequencyMin, 1),
      contactFrequencyAvg: ensureNumber(risk.contactFrequencyAvg, 10),
      contactFrequencyMax: ensureNumber(risk.contactFrequencyMax, 100),
      contactFrequencyConfidence: risk.contactFrequencyConfidence || 'Medium',
      
      // Probability of Action
      probabilityOfActionMin: ensureNumber(risk.probabilityOfActionMin, 0.1),
      probabilityOfActionAvg: ensureNumber(risk.probabilityOfActionAvg, 0.3),
      probabilityOfActionMax: ensureNumber(risk.probabilityOfActionMax, 0.5),
      probabilityOfActionConfidence: risk.probabilityOfActionConfidence || 'Medium',
      
      // Threat Capability
      threatCapabilityMin: ensureNumber(risk.threatCapabilityMin, 10),
      threatCapabilityAvg: ensureNumber(risk.threatCapabilityAvg, 50),
      threatCapabilityMax: ensureNumber(risk.threatCapabilityMax, 90),
      threatCapabilityConfidence: risk.threatCapabilityConfidence || 'Medium',
      
      // Resistance Strength
      resistanceStrengthMin: ensureNumber(risk.resistanceStrengthMin, 10),
      resistanceStrengthAvg: ensureNumber(risk.resistanceStrengthAvg, 50),
      resistanceStrengthMax: ensureNumber(risk.resistanceStrengthMax, 90),
      resistanceStrengthConfidence: risk.resistanceStrengthConfidence || 'Medium',
      
      // Primary Loss Magnitude
      primaryLossMagnitudeMin: ensureNumber(risk.primaryLossMagnitudeMin, 10000),
      primaryLossMagnitudeAvg: ensureNumber(risk.primaryLossMagnitudeAvg, 100000),
      primaryLossMagnitudeMax: ensureNumber(risk.primaryLossMagnitudeMax, 1000000),
      primaryLossMagnitudeConfidence: risk.primaryLossMagnitudeConfidence || 'Medium',
      
      // Secondary Loss Event Frequency
      secondaryLossEventFrequencyMin: ensureNumber(risk.secondaryLossEventFrequencyMin, 0),
      secondaryLossEventFrequencyAvg: ensureNumber(risk.secondaryLossEventFrequencyAvg, 0),
      secondaryLossEventFrequencyMax: ensureNumber(risk.secondaryLossEventFrequencyMax, 0),
      secondaryLossEventFrequencyConfidence: risk.secondaryLossEventFrequencyConfidence || 'Low',
      
      // Secondary Loss Magnitude
      secondaryLossMagnitudeMin: ensureNumber(risk.secondaryLossMagnitudeMin, 0),
      secondaryLossMagnitudeAvg: ensureNumber(risk.secondaryLossMagnitudeAvg, 0),
      secondaryLossMagnitudeMax: ensureNumber(risk.secondaryLossMagnitudeMax, 0),
      secondaryLossMagnitudeConfidence: risk.secondaryLossMagnitudeConfidence || 'Low',
    };
  };
  
  const handleEditClick = () => {
    if (id) {
      navigate(`/risks/${id}/edit`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !risk) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          <h3 className="text-lg font-medium">Error loading risk</h3>
          <p>There was a problem fetching the risk details. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => navigate('/risks')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Risks
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href={`/risks/${id}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Back to Risk Detail
              </Button>
            </Link>
            <Badge variant="outline" className="bg-slate-100">{risk.riskId}</Badge>
          </div>
          <h1 className="text-2xl font-bold mt-2">{risk.name}</h1>
          <p className="text-slate-500 mt-1">{risk.description}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="shrink-0" 
            onClick={handleEditClick}
          >
            <FileEdit className="mr-2 h-4 w-4" /> Edit Risk
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 sm:grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="xyflow">XyFlow Viz</TabsTrigger>
          <TabsTrigger value="current">Current Viz</TabsTrigger>
          <TabsTrigger value="details">Risk Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Overview</CardTitle>
              <CardDescription>
                Basic information about the risk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Risk ID</h3>
                  <p>{risk.riskId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Category</h3>
                  <p>{risk.riskCategory}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Created At</h3>
                  <p>{new Date(risk.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Updated At</h3>
                  <p>{new Date(risk.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Description</h3>
                <p className="whitespace-pre-line">{risk.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-500">Associated Assets</h3>
                <p>
                  {Array.isArray(risk.associatedAssets) && risk.associatedAssets.length > 0
                    ? risk.associatedAssets.join(', ')
                    : 'None'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="xyflow">
          <XyflowFairVisualization 
            riskName={risk.name}
            riskId={risk.riskId}
            riskDescription={risk.description}
            riskParams={getFairParams(risk)}
          />
        </TabsContent>
        
        <TabsContent value="current">
          <FairVisualizationTemplate 
            riskName={risk.name}
            riskId={risk.riskId}
            riskDescription={risk.description}
            riskParams={getFairParams(risk)}
          />
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FAIR Risk Parameters</CardTitle>
              <CardDescription>
                Detailed risk parameters used in FAIR calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium border-b pb-2">Threat Event Frequency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Contact Frequency</h4>
                      <p>Min: {risk.contactFrequencyMin}, Avg: {risk.contactFrequencyAvg}, Max: {risk.contactFrequencyMax}</p>
                      <p className="text-xs text-slate-500">Confidence: {risk.contactFrequencyConfidence}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Probability of Action</h4>
                      <p>Min: {risk.probabilityOfActionMin}, Avg: {risk.probabilityOfActionAvg}, Max: {risk.probabilityOfActionMax}</p>
                      <p className="text-xs text-slate-500">Confidence: {risk.probabilityOfActionConfidence}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium border-b pb-2">Vulnerability</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Threat Capability</h4>
                      <p>Min: {risk.threatCapabilityMin}, Avg: {risk.threatCapabilityAvg}, Max: {risk.threatCapabilityMax}</p>
                      <p className="text-xs text-slate-500">Confidence: {risk.threatCapabilityConfidence}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Resistance Strength</h4>
                      <p>Min: {risk.resistanceStrengthMin}, Avg: {risk.resistanceStrengthAvg}, Max: {risk.resistanceStrengthMax}</p>
                      <p className="text-xs text-slate-500">Confidence: {risk.resistanceStrengthConfidence}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium border-b pb-2">Loss Magnitude</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Primary Loss</h4>
                      <p>Min: ${risk.primaryLossMagnitudeMin?.toLocaleString()}, Avg: ${risk.primaryLossMagnitudeAvg?.toLocaleString()}, Max: ${risk.primaryLossMagnitudeMax?.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Confidence: {risk.primaryLossMagnitudeConfidence}</p>
                    </div>
                    {risk.secondaryLossMagnitudeAvg && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-500">Secondary Loss</h4>
                        <p>Min: ${risk.secondaryLossMagnitudeMin?.toLocaleString()}, Avg: ${risk.secondaryLossMagnitudeAvg?.toLocaleString()}, Max: ${risk.secondaryLossMagnitudeMax?.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Confidence: {risk.secondaryLossMagnitudeConfidence}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskDetailWithNewViz;