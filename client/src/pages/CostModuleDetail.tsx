import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, CircleDollarSign, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CostModule {
  id: number;
  name: string;
  cis_control?: string[]; // From database
  cisControl?: string[];  // For frontend consistency
  cost_factor?: number;   // From database
  costFactor?: number;    // For frontend consistency
  cost_type?: string;     // From database
  costType?: string;      // For frontend consistency  
  description?: string;
}

export default function CostModuleDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  
  // Fetch cost module details
  const { data: moduleResponse, isLoading, error } = useQuery({
    queryKey: [`/api/cost-modules/${id}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cost-modules')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cost Modules
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-4 w-2/3 mb-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !moduleResponse?.data) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cost-modules')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cost Modules
        </Button>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error Loading Cost Module
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the cost module details.</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/cost-modules')}>
              Return to Cost Modules
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const costModule: CostModule = moduleResponse.data;

  // Normalize fields from snake_case to camelCase for consistency
  const normalizedModule = {
    ...costModule,
    cisControl: costModule.cis_control || costModule.cisControl || [],
    costFactor: costModule.cost_factor || costModule.costFactor || 0,
    costType: costModule.cost_type || costModule.costType || 'fixed'
  };

  // Format cost factor based on type
  const formatCostFactor = (module: any) => {
    switch (module.costType) {
      case 'fixed':
        return formatCurrency(module.costFactor || 0);
      case 'per_event':
        return `${formatCurrency(module.costFactor || 0)} per event`;
      case 'per_hour':
        return `${formatCurrency(module.costFactor || 0)} per hour`;
      case 'percentage':
        return `${((module.costFactor || 0) * 100).toFixed(2)}%`;
      default:
        return formatCurrency(module.costFactor || 0);
    }
  };

  // Format the cost type for display
  const formatCostType = (type: string) => {
    switch (type) {
      case 'fixed':
        return 'Fixed Cost';
      case 'per_event':
        return 'Per Event';
      case 'per_hour':
        return 'Per Hour';
      case 'percentage':
        return 'Percentage of Loss';
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/cost-modules')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cost Modules
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <CircleDollarSign className="mr-2 h-6 w-6 text-primary" />
                {normalizedModule.name}
              </CardTitle>
              <CardDescription>
                Cost Module ID: {normalizedModule.id}
              </CardDescription>
            </div>
            <Badge className="uppercase">{formatCostType(normalizedModule.costType)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">
              {normalizedModule.description || 'No description provided'}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Cost Factor</h3>
            <div className="bg-muted p-4 rounded-lg text-xl font-semibold">
              {formatCostFactor(normalizedModule)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Associated CIS Controls</h3>
            {Array.isArray(normalizedModule.cisControl) && normalizedModule.cisControl.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {normalizedModule.cisControl.map((control, index) => (
                  <Badge key={index} variant="outline" className="flex items-center">
                    <Shield className="mr-1 h-3 w-3" />
                    {control}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No CIS controls associated</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/cost-modules/risk-mapping?moduleId=${normalizedModule.id}`)}
            className="mr-2"
          >
            View Risk Mapping
          </Button>
          <Button 
            onClick={() => navigate('/cost-modules')}
          >
            Back to Cost Modules
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}