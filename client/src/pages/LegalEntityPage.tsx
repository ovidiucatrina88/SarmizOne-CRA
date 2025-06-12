import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Building2, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  Loader2 
} from "lucide-react";

interface LegalEntity {
  id: number;
  entityId: string;
  name: string;
  description?: string;
  parentEntityId?: string;
  createdAt: string;
}

const legalEntitySchema = z.object({
  entityId: z.string().min(1, "Entity ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().default(""),
  parentEntityId: z.string().optional().default(""),
});

type LegalEntityFormData = z.infer<typeof legalEntitySchema>;

export default function LegalEntityPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LegalEntityFormData>({
    resolver: zodResolver(legalEntitySchema),
    defaultValues: {
      entityId: "",
      name: "",
      description: "",
      parentEntityId: "",
    },
  });

  // Reset form when editing entity changes
  React.useEffect(() => {
    if (editingEntity) {
      form.reset({
        entityId: editingEntity.entityId,
        name: editingEntity.name,
        description: editingEntity.description || "",
        parentEntityId: editingEntity.parentEntityId || "",
      });
      setDialogOpen(true);
    } else {
      form.reset({
        entityId: "",
        name: "",
        description: "",
        parentEntityId: "",
      });
    }
  }, [editingEntity, form]);

  // Check if we're viewing a specific entity
  const entityId = location.split("/")[2];

  // Fetch legal entities
  const { data: entitiesResponse, isLoading } = useQuery({
    queryKey: ["/api/legal-entities"],
  });
  const entities = (entitiesResponse as any)?.data || [];

  // Filter entities based on search
  const filteredEntities = useMemo(() => {
    if (!searchTerm) return entities;
    return entities.filter((entity: LegalEntity) =>
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entity.description && entity.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [entities, searchTerm]);

  // Create/Update mutation
  const saveEntityMutation = useMutation({
    mutationFn: (data: LegalEntityFormData) => {
      if (editingEntity) {
        return apiRequest("PATCH", `/api/legal-entities/${editingEntity.id}`, data);
      } else {
        return apiRequest("POST", "/api/legal-entities", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal-entities"] });
      toast({
        title: "Success",
        description: editingEntity ? "Legal entity updated successfully" : "Legal entity created successfully",
      });
      setDialogOpen(false);
      setEditingEntity(null);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Legal entity save error:", error);
      const errorMessage = error?.response?.data?.error?.message || 
                          error?.message || 
                          (editingEntity ? "Failed to update legal entity" : "Failed to create legal entity");
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteEntityMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/legal-entities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal-entities"] });
      toast({
        title: "Success",
        description: "Legal entity deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete legal entity",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LegalEntityFormData) => {
    console.log("Legal entity form submission:", data);
    console.log("Form errors:", form.formState.errors);
    
    // Clean up the data to ensure proper types
    const cleanedData = {
      ...data,
      description: data.description || "",
      parentEntityId: data.parentEntityId || "",
    };
    
    console.log("API Request to /api/legal-entities with data:", cleanedData);
    saveEntityMutation.mutate(cleanedData);
  };

  const handleAddEntity = () => {
    setEditingEntity(null);
    setDialogOpen(true);
  };

  const handleEditEntity = (entity: LegalEntity) => {
    setEditingEntity(entity);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntity(null);
    form.reset();
  };

  // Single entity view
  if (entityId) {
    const entity = entities.find((e: LegalEntity) => e.entityId === entityId);
    
    if (!entity) {
      return (
        <Layout
          pageTitle="Legal Entity Not Found"
          pageIcon="LEG"
          pageDescription="The requested legal entity could not be found."
        >
          <div className="flex flex-col items-center justify-center h-64">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Entity not found</h3>
            <p className="text-muted-foreground mb-4">
              The legal entity with ID "{entityId}" does not exist.
            </p>
            <Link href="/legal-entities">
              <Button>Back to Legal Entities</Button>
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout
        pageTitle={entity.name}
        pageIcon="LEG"
        pageDescription={`Details for legal entity ${entity.entityId}`}
        pageActions={
          <Link href="/legal-entities">
            <Button variant="outline">Back to List</Button>
          </Link>
        }
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">{entity.name}</CardTitle>
            <p className="text-sm text-gray-400">{entity.entityId}</p>
          </CardHeader>
          <CardContent>
            {entity.description && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-200">Description</h3>
                <p className="text-gray-300">{entity.description}</p>
              </div>
            )}
            
            {entity.parentEntityId && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-200">Parent Entity</h3>
                <p className="text-gray-300">{entity.parentEntityId}</p>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-gray-200">Created</h3>
              <p className="text-gray-300">{new Date(entity.createdAt).toLocaleDateString()}</p>
            </div>
            
            <Button onClick={() => setEditingEntity(entity)} className="bg-blue-600 hover:bg-blue-700">
              Edit Entity
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }
  
  // Main list view
  return (
    <Layout
      pageTitle="Legal Entity Management"
      pageIcon="LEG"
      pageDescription="Manage legal entities across your organization and their associated assets and risks."
      pageActions={
        <Button onClick={handleAddEntity} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Legal Entity
        </Button>
      }
    >
      {/* Actions Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search" 
            placeholder="Search entities..." 
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Legal Entities Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : entities && entities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntities?.map((entity: LegalEntity) => (
            <Card key={entity.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-100">
                        <Link 
                          href={`/legal-entities/${entity.entityId}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {entity.name}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-gray-400">{entity.entityId}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-200"
                      onClick={() => handleEditEntity(entity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            legal entity and may affect any assets and risks associated with it.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteEntityMutation.mutate(entity.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {entity.description && (
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {entity.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {new Date(entity.createdAt).toLocaleDateString()}</span>
                    {entity.parentEntityId && (
                      <span>Parent: {entity.parentEntityId}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No legal entities found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "No entities match your search criteria" 
              : "Get started by creating your first legal entity"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button onClick={handleAddEntity}>
              <Plus className="mr-2 h-4 w-4" />
              New Entity
            </Button>
          )}
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-y-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingEntity ? "Edit Legal Entity" : "Create Legal Entity"}</DialogTitle>
            <DialogDescription>
              {editingEntity ? "Update the details of this legal entity." : "Create a new legal entity for your organization."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ENTITY-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Legal entity name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Optional description" 
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parentEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Entity ID (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Parent entity reference" 
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveEntityMutation.isPending}>
                  {saveEntityMutation.isPending ? "Saving..." : (editingEntity ? "Update" : "Create")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}