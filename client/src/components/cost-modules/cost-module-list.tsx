import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, DollarSign, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CostModuleForm } from "./cost-module-form";

// Define cost module types
type CostType = 'fixed' | 'per_event' | 'per_hour' | 'percentage';

interface CostModule {
  id: number;
  name: string;
  cis_control?: string[]; // From database
  cisControl?: string[];  // For frontend consistency
  cost_factor?: number;   // From database
  costFactor?: number;    // For frontend consistency
  cost_type?: CostType;   // From database
  costType?: CostType;    // For frontend consistency  
  description?: string;
}

export function CostModuleList() {
  const [editModule, setEditModule] = useState<CostModule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<CostModule | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch cost modules
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/cost-modules"],
  });
  
  // Extract and ensure costModules is an array, then normalize field names
  const costModules = data?.data 
    ? (Array.isArray(data.data) 
      ? data.data.map((module: any) => ({
          ...module,
          // Normalize field names for consistency in the UI
          cisControl: module.cis_control || module.cisControl,
          costFactor: module.cost_factor || module.costFactor,
          costType: module.cost_type || module.costType
        })) 
      : [])
    : [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/cost-modules/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete cost module");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cost-modules"] });
      toast({
        title: "Cost module deleted",
        description: "The cost module has been deleted successfully."
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete cost module",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Format cost factor based on type
  const formatCostFactor = (module: CostModule) => {
    // Get the cost factor value, checking both camelCase and snake_case properties
    const costFactor = module.costFactor || module.cost_factor || 0;
    
    // Get the cost type value, checking both camelCase and snake_case properties
    const costType = module.costType || module.cost_type || 'fixed';
    
    switch (costType) {
      case 'fixed':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costFactor);
      case 'per_event':
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costFactor)} per event`;
      case 'per_hour':
        return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costFactor)} per hour`;
      case 'percentage':
        return `${(costFactor * 100).toFixed(2)}%`;
      default:
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(costFactor);
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

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg">
        <CardHeader>
          <CardTitle>Cost Modules</CardTitle>
          <CardDescription>Loading cost modules...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg">
        <CardHeader>
          <CardTitle>Cost Modules</CardTitle>
          <CardDescription>Error loading cost modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-destructive">
            An error occurred while loading the cost modules. Please try again.
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => refetch()}>Retry</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Cost Module
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-800 rounded-lg border border-gray-600">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white">Cost Modules</h3>
            <p className="text-gray-400 text-sm">Manage cost factors associated with CIS controls</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-b-lg">
            {costModules.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-gray-500" />
                <p className="mt-4 text-white">No cost modules have been added yet.</p>
                <p className="text-sm text-gray-400">
                  Add cost modules to map financial impacts to CIS controls.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {costModules.map((module: any) => (
                  <div key={module.id} className="bg-gray-700 rounded-lg border border-gray-600 p-4 hover:bg-gray-650 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white text-lg font-bold">{module.name}</h4>
                          <div className="text-sm text-gray-400 uppercase tracking-wide font-medium">
                            {formatCostType(module.costType || module.cost_type)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-600"
                          onClick={() => {
                            setEditModule(module);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-300 hover:bg-gray-600"
                          onClick={() => {
                            setModuleToDelete(module);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-medium">Cost Factor</p>
                        <p className="text-white font-bold text-lg">{formatCostFactor(module)}</p>
                      </div>
                      
                      {module.description && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1 uppercase tracking-wide font-medium">Description</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{module.description}</p>
                        </div>
                      )}
                      
                      {(module.cisControl || module.cis_control) && (
                        <div className="pt-2 border-t border-gray-600">
                          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide font-medium">CIS Controls</p>
                          <div className="flex flex-wrap gap-2">
                            {(module.cisControl || module.cis_control)?.map((control: string) => (
                              <Badge key={control} variant="secondary" className="bg-blue-600 text-blue-100 border-blue-500">
                                {control}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Cost Module</DialogTitle>
          </DialogHeader>
          <CostModuleForm 
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Cost Module</DialogTitle>
          </DialogHeader>
          {editModule && (
            <CostModuleForm 
              module={editModule} 
              onSuccess={() => setIsEditDialogOpen(false)} 
              onCancel={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Cost Module</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              Are you sure you want to delete the cost module "{moduleToDelete?.name}"?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (moduleToDelete) {
                  deleteMutation.mutate(moduleToDelete.id);
                }
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}