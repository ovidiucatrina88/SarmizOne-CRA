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
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-50" />
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-foreground">Cost Modules</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage cost factors associated with CIS controls
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="shadow-md hover:shadow-lg transition-shadow">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cost Module
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {costModules.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">No cost modules have been added yet.</p>
            <p className="text-sm">
              Add cost modules to map financial impacts to CIS controls.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costModules.map((module: any) => (
              <Card key={module.id} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <DollarSign className="w-5 h-5 text-white" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-lg font-bold">{module.name}</CardTitle>
                        <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                          {formatCostType(module.costType || module.cost_type)}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
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
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                        onClick={() => {
                          setModuleToDelete(module);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">Cost Factor</p>
                    <p className="text-foreground font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{formatCostFactor(module)}</p>
                  </div>
                  
                  {module.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wide font-medium">Description</p>
                      <p className="text-foreground/80 text-sm leading-relaxed">{module.description}</p>
                    </div>
                  )}
                  
                  {(module.cisControl || module.cis_control) && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide font-medium">CIS Controls</p>
                      <div className="flex flex-wrap gap-2">
                        {(module.cisControl || module.cis_control)?.map((control: string) => (
                          <Badge key={control} variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                            {control}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Cost Module</DialogTitle>
          </DialogHeader>
          <CostModuleForm 
            onSuccess={() => setIsCreateDialogOpen(false)} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cost Module</DialogTitle>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Cost Module</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete the cost module "{moduleToDelete?.name}"?
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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
    </Card>
  );
}