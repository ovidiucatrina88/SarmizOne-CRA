import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Control } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Shield, 
  Loader, 
  PenLine, 
  CheckCircle2, 
  AlertCircle, 
  Eye 
} from "lucide-react";
import { formatCurrency } from "@shared/utils/calculations";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout/layout";

export default function ControlDetailPage() {
  const { id } = useParams();
  
  // Fetch control details
  const { data: control, isLoading, error } = useQuery<Control>({
    queryKey: [`/api/controls/${id}`],
    staleTime: 0,  // Don't cache the response
  });
  
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading control details...</span>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (error || !control) {
    return (
      <Layout>
        <div className="p-6">
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/controls">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Controls
              </Link>
            </Button>
          </div>
          <Card className="p-6 bg-destructive/10 border-destructive">
            <h1 className="text-2xl font-bold text-destructive mb-2">Error Loading Control</h1>
            <p>Unable to load control details. Please try again later.</p>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" asChild>
          <Link href="/controls">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Controls
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">
          <span className="text-primary">{control.controlId}:</span> {control.name}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Control Details</h2>
            <p className="text-muted-foreground mb-6">{control.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Control Type</h3>
                <div className="flex items-center gap-2">
                  {control.controlType === 'preventive' && <Shield className="h-4 w-4 text-green-500" />}
                  {control.controlType === 'detective' && <Eye className="h-4 w-4 text-blue-500" />}
                  {control.controlType === 'corrective' && <CheckCircle2 className="h-4 w-4 text-purple-500" />}
                  <span className="capitalize">{control.controlType}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                <span className="capitalize">{control.controlCategory}</span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Implementation Status</h3>
                <div className="flex items-center gap-2">
                  {control.implementationStatus === 'fully_implemented' && (
                    <Badge className="bg-green-500">Fully Implemented</Badge>
                  )}
                  {control.implementationStatus === 'in_progress' && (
                    <Badge className="bg-amber-500">In Progress</Badge>
                  )}
                  {control.implementationStatus === 'not_implemented' && (
                    <Badge className="bg-red-500">Not Implemented</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Effectiveness</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary rounded-full h-2.5" 
                      style={{ width: `${(control.controlEffectiveness / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{control.controlEffectiveness}/10</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Implementation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Implementation Cost</h3>
                <span className="text-lg font-medium">
                  {formatCurrency(Number(control.implementationCost) || 0, 'USD')}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Cost Per Agent</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">
                    {formatCurrency(Number(control.costPerAgent) || 0, 'USD')}
                  </span>
                  {control.isPerAgentPricing && (
                    <Badge variant="outline">Per Agent</Badge>
                  )}
                </div>
              </div>
            </div>
            
            {control.notes && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                <p className="text-sm">{control.notes}</p>
              </div>
            )}
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Associated Risks</h2>
            {control.associatedRisks && control.associatedRisks.length > 0 ? (
              <div className="space-y-2">
                {control.associatedRisks.map((riskId) => (
                  <Button 
                    key={riskId} 
                    variant="outline" 
                    className="w-full justify-between text-left" 
                    asChild
                  >
                    <Link href={`/risks/${riskId}`}>
                      <span>{riskId}</span>
                      <ChevronLeft className="h-4 w-4 rotate-180" />
                    </Link>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No risks associated with this control.</p>
            )}
          </Card>
        </div>
        </div>
      </div>
    </Layout>
  );
}