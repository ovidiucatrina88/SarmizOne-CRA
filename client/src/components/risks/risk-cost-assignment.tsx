import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, DollarSign, Loader2, Trash, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";

interface RiskCostAssignmentProps {
  riskId: number;
}

interface CostModule {
  id: number;
  name: string;
  cisControl: string[];
  costFactor: number;
  costType: string;
  description?: string;
}

interface Assignment {
  costModuleId: number;
  weight: number;
  module?: CostModule;
}

export function RiskCostAssignment({ riskId }: RiskCostAssignmentProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch all cost modules
  const { 
    data: costModulesResponse, 
    isLoading: isLoadingModules 
  } = useQuery<{ data: CostModule[] }>({
    queryKey: ["/api/cost-modules"],
  });
  
  // Ensure costModules is always an array, extract from response
  const costModules = costModulesResponse?.data ? 
    (Array.isArray(costModulesResponse.data) ? costModulesResponse.data : []) 
    : [];
  
  // Fetch existing assignments for this risk
  const { 
    data: existingAssignmentsResponse, 
    isLoading: isLoadingAssignments,
    refetch: refetchAssignments
  } = useQuery<{ data: Assignment[] }>({
    queryKey: [`/api/risk-costs/${riskId}`],
    enabled: !!riskId,
  });
  
  // Extract assignments from API response format
  const existingAssignments = existingAssignmentsResponse?.data || [];
  
  // Fetch cost calculation result
  const {
    data: costCalculation,
    isLoading: isCalculating,
    refetch: refetchCalculation
  } = useQuery<{ data: { totalCost: number; weightedCosts?: Record<string, { name?: string; cost?: number }> } }>({
    queryKey: [`/api/risk-costs/${riskId}/calculate`],
    enabled: !!riskId,
  });
  const costCalc = costCalculation?.data;
  
  // Save assignments mutation
  const saveAssignmentsMutation = useMutation({
    mutationFn: async (assignments: Assignment[]) => {
      const response = await fetch(`/api/risk-costs/${riskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignments),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save cost assignments");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/risk-costs/${riskId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/risk-costs/${riskId}/calculate`] });
      toast({
        title: "Cost assignments saved",
        description: "The cost assignments have been saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save cost assignments",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize assignments from existing data
  useEffect(() => {
    if (existingAssignments && Array.isArray(existingAssignments) && 
        existingAssignments.length > 0 && 
        costModules && Array.isArray(costModules) &&
        costModules.length > 0) {
      
      console.log("Processing assignments:", existingAssignments);
      console.log("Available cost modules:", costModules);
      
      const enhancedAssignments = existingAssignments.map((assignment: any) => {
        // Get cost module ID from response - check both formats
        const costModuleId = assignment.costModuleId || assignment.cost_module_id;
        console.log(`Processing assignment with module ID: ${costModuleId}`);
        
        // Find the matching module
        const module = costModules.find((m: any) => m.id === costModuleId);
        console.log("Found module:", module);
        
        if (!module) {
          console.warn(`No matching module found for ID: ${costModuleId}`);
        }
        
        // Parse the weight to ensure it's a number
        const weightValue = typeof assignment.weight === 'string' 
          ? parseFloat(assignment.weight) 
          : (typeof assignment.weight === 'number' ? assignment.weight : 1.0);
        
        return {
          costModuleId: costModuleId,
          weight: weightValue,
          module: module || {
            id: costModuleId,
            name: `Module #${costModuleId}`,
            costType: "unknown",
            costFactor: 0,
            cisControl: []
          }
        };
      });
      
      console.log("Enhanced assignments:", enhancedAssignments);
      setAssignments(enhancedAssignments);
    } else if (existingAssignments && Array.isArray(existingAssignments) && 
               existingAssignments.length === 0 && 
               assignments.length !== 0) {
      // Only reset assignments if we have empty existingAssignments from server
      // and current state is not already empty
      setAssignments([]);
    }
  }, [existingAssignments, costModules]);
  
  // Format cost type for display
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
  
  // Format cost factor for display
  const formatCostFactor = (module: any) => {
    if (!module) return "-";
    
    // Safely access properties with fallbacks
    const costType = module.costType || module.cost_type || 'unknown';
    // Try both camelCase and snake_case formats, or fallback to 0
    const costFactorRaw = module.costFactor || module.cost_factor || 0;
    const costFactor = typeof costFactorRaw === 'string' ? parseFloat(costFactorRaw) : costFactorRaw;
    
    switch (costType) {
      case 'fixed':
        return formatCurrency(costFactor);
      case 'per_event':
        return `${formatCurrency(costFactor)} per event`;
      case 'per_hour':
        return `${formatCurrency(costFactor)} per hour`;
      case 'percentage':
        return `${costFactor.toFixed(2)}%`;
      default:
        return formatCurrency(costFactor);
    }
  };
  
  // Add a new cost module assignment
  const addAssignment = () => {
    if (!selectedModuleId) return;
    
    // Check if this module is already assigned
    const existing = assignments.find(a => a.costModuleId === selectedModuleId);
    if (existing) {
      toast({
        title: "Module already assigned",
        description: "This cost module is already assigned to this risk",
        variant: "destructive",
      });
      return;
    }
    
    // Type check costModules before finding the module
    if (!costModules || !Array.isArray(costModules)) {
      toast({
        title: "Error",
        description: "Cost modules data is not available",
        variant: "destructive",
      });
      return;
    }
    
    const module = costModules.find((m: any) => m.id === selectedModuleId);
    
    if (!module) {
      toast({
        title: "Error",
        description: "Selected cost module not found",
        variant: "destructive",
      });
      return;
    }
    
    setAssignments([
      ...assignments,
      {
        costModuleId: selectedModuleId,
        weight: 1.0,
        module
      }
    ]);
    
    setSelectedModuleId(null);
  };
  
  // Remove a cost module assignment
  const removeAssignment = (costModuleId: number) => {
    setAssignments(assignments.filter(a => a.costModuleId !== costModuleId));
  };
  
  // Update assignment weight
  const updateWeight = (costModuleId: number, weight: number) => {
    setAssignments(
      assignments.map(a =>
        a.costModuleId === costModuleId ? { ...a, weight } : a
      )
    );
  };
  
  // Save all assignments
  const saveAssignments = () => {
    const assignmentData = assignments.map(a => ({
      costModuleId: a.costModuleId,
      weight: Number(a.weight), // Ensure weight is sent as a number
    }));
    
    console.log("Saving assignment data:", assignmentData);
    saveAssignmentsMutation.mutate(assignmentData);
  };
  
  // Loading state
  if (isLoadingModules || isLoadingAssignments) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cost Modules Assignment</CardTitle>
          <CardDescription>Loading cost modules...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Modules Assignment
        </CardTitle>
        <CardDescription>
          Assign cost modules to this risk with weights for FAIR-MAM materiality calculation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Module selection */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Select
              value={selectedModuleId?.toString() || ""}
              onValueChange={(value) => setSelectedModuleId(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a cost module" />
              </SelectTrigger>
              <SelectContent>
                {costModules.map((module: any) => (
                  <SelectItem key={module.id} value={module.id.toString()}>
                    {module.name} ({formatCostType(module.costType || module.cost_type || 'unknown')})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addAssignment} disabled={!selectedModuleId}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Module
          </Button>
        </div>
        
        {/* List of assigned modules */}
        {assignments.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="mt-2 text-muted-foreground">
              No cost modules assigned to this risk.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Add cost modules above to include them in materiality calculations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div 
                key={assignment.costModuleId} 
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{assignment.module?.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCostFactor(assignment.module)}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeAssignment(assignment.costModuleId)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Weight:</span>
                    <span className="text-sm font-medium">
                      {typeof assignment.weight === 'number' 
                        ? assignment.weight.toFixed(1) 
                        : Number(assignment.weight).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[typeof assignment.weight === 'number' 
                        ? assignment.weight 
                        : Number(assignment.weight)]}
                      min={0.1}
                      max={10}
                      step={0.1}
                      onValueChange={(values) => updateWeight(assignment.costModuleId, values[0])}
                    />
                    <Input
                      type="number"
                      min={0.1}
                      max={10}
                      step={0.1}
                      value={typeof assignment.weight === 'number' 
                        ? assignment.weight 
                        : Number(assignment.weight)}
                      onChange={(e) => updateWeight(
                        assignment.costModuleId, 
                        parseFloat(e.target.value) || 0.1
                      )}
                      className="w-20"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {assignment.module?.cisControl && Array.isArray(assignment.module.cisControl) ? 
                    assignment.module.cisControl.map((control) => (
                      <Badge key={control} variant="outline">
                        CIS {control}
                      </Badge>
                    )) : 
                    <span className="text-sm text-muted-foreground">No CIS controls specified</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Cost calculation results */}
        {costCalc && typeof costCalc === 'object' && 
         'totalCost' in costCalc && costCalc.totalCost > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">
              Materiality-Weighted Cost Impact
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Cost Impact:</span>
                <span className="text-xl font-bold">
                  {formatCurrency(costCalc.totalCost)}
                </span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="mt-2 space-y-1">
                {'weightedCosts' in costCalc && 
                 typeof costCalc.weightedCosts === 'object' &&
                 costCalc.weightedCosts && 
                 Object.entries(costCalc.weightedCosts).map(([id, details]: [string, any]) => (
                  <div key={id} className="flex justify-between">
                    <span className="text-sm">{details?.name || 'Unknown Module'}:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(details?.cost || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => {
            refetchAssignments();
            refetchCalculation();
          }}
        >
          Reset
        </Button>
        <Button 
          onClick={saveAssignments}
          disabled={saveAssignmentsMutation.isPending}
        >
          {saveAssignmentsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Assignments'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
