import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Building2, Search, Plus, ListFilter, ChevronRight, Trash2, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Define legal entity types
type LegalEntity = {
  id: number;
  entityId: string;
  name: string;
  description: string;
  parentEntityId: string | null;
  createdAt: string;
};

// Define form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  entityId: z.string().optional(),
  description: z.string().optional(),
  parentEntityId: z.string().optional(),
});

export default function LegalEntityPage() {
  // Routing
  const [match, params] = useRoute("/legal-entities/:id");
  const isEntityDetailsView = !!match;
  
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEntity, setEditingEntity] = useState<LegalEntity | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<LegalEntity | null>(null);
  
  // Toast
  const { toast } = useToast();
  
  // Access the query client
  const queryClient = useQueryClient();
  
  // Fetch all legal entities
  const { data: entitiesResponse, isLoading } = useQuery<{success: boolean, data: LegalEntity[]}>({
    queryKey: ['/api/legal-entities'],
    refetchOnWindowFocus: false,
  });
  
  // Extract entities from the API response
  const entities = entitiesResponse?.data;
  
  // Fetch single entity details if on details view
  const { data: entityDetailsResponse, isLoading: isLoadingDetails } = useQuery<{success: boolean, data: LegalEntity}>({
    queryKey: ['/api/legal-entities', params?.id],
    enabled: isEntityDetailsView,
    refetchOnWindowFocus: false,
  });
  
  // Extract entity details from the API response
  const entityDetails = entityDetailsResponse?.data;
  
  // Create entity mutation
  const createEntityMutation = useMutation({
    mutationFn: (newEntity: z.infer<typeof formSchema>) => {
      return apiRequest('POST', '/api/legal-entities', newEntity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/legal-entities'] });
      setShowCreateDialog(false);
      toast({
        title: "Legal entity created",
        description: "The legal entity was created successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating legal entity",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Update entity mutation
  const updateEntityMutation = useMutation({
    mutationFn: ({id, data}: {id: number, data: z.infer<typeof formSchema>}) => {
      return apiRequest('PUT', `/api/legal-entities/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/legal-entities'] });
      setEditingEntity(null);
      toast({
        title: "Legal entity updated",
        description: "The legal entity was updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating legal entity",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Delete entity mutation
  const deleteEntityMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/legal-entities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/legal-entities'] });
      setDeletingEntity(null);
      toast({
        title: "Legal entity deleted",
        description: "The legal entity was deleted successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting legal entity",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });
  
  // Create form
  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      entityId: "",
      description: "",
      parentEntityId: "",
    },
  });
  
  // Edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      entityId: "",
      description: "",
      parentEntityId: "",
    },
  });
  
  // Update edit form when editing entity changes
  useEffect(() => {
    if (editingEntity) {
      editForm.reset({
        name: editingEntity.name,
        entityId: editingEntity.entityId,
        description: editingEntity.description || "",
        parentEntityId: editingEntity.parentEntityId || "",
      });
    }
  }, [editingEntity, editForm]);
  
  // Handle form submission
  const onCreateSubmit = (values: z.infer<typeof formSchema>) => {
    createEntityMutation.mutate(values);
  };
  
  const onEditSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingEntity) {
      updateEntityMutation.mutate({
        id: editingEntity.id,
        data: values,
      });
    }
  };
  
  // Filter entities based on search term
  const filteredEntities = entities?.length ? entities.filter((entity: LegalEntity) => 
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  ) : [];
  
  // Entity details view
  if (isEntityDetailsView) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/legal-entities">
            <Button variant="outline">Back to List</Button>
          </Link>
          <h1 className="text-2xl font-bold">Legal Entity Details</h1>
        </div>
        
        {isLoadingDetails ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : entityDetails ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  {entityDetails.name}
                </CardTitle>
                <CardDescription>ID: {entityDetails.entityId}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{entityDetails.description || "No description provided"}</p>
                  </div>
                  
                  {entityDetails.parentEntityId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Parent Entity</h3>
                      <p className="mt-1">{entityDetails.parentEntityId}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                    <p className="mt-1">{new Date(entityDetails.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Entity Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setEditingEntity(entityDetails)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Entity
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Entity
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
                          onClick={() => deleteEntityMutation.mutate(entityDetails.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Link href={`/legal-entities/${entityDetails.entityId}/assets`}>
                    <Button className="w-full" variant="outline">
                      View Associated Assets
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center my-8">
            <p>Legal entity not found</p>
            <Link href="/legal-entities">
              <Button variant="link" className="mt-4">Return to list</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
  
  // Main list view
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">LEG</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Legal Entity Management</h1>
            </div>
            <Button onClick={() => setEditingEntity(null)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Legal Entity
            </Button>
          </div>
          <p className="text-gray-300 max-w-2xl">
            Manage legal entities across your organization and their associated assets and risks.
          </p>
        </div>
        
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
        
        <div className="flex items-center gap-4">
          <Button variant="outline" disabled>
            <ListFilter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Entity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Legal Entity</DialogTitle>
                <DialogDescription>
                  Create a new legal entity to associate with assets
                </DialogDescription>
              </DialogHeader>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Legal Entity Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="entityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity ID (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Leave blank for auto-generated ID" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Description" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="parentEntityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Entity ID (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Parent Entity ID" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createEntityMutation.isPending}
                    >
                      {createEntityMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Entity
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          {/* Edit Entity Dialog */}
          <Dialog open={!!editingEntity} onOpenChange={(open) => !open && setEditingEntity(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Legal Entity</DialogTitle>
                <DialogDescription>
                  Update legal entity information
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Legal Entity Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="entityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity ID</FormLabel>
                        <FormControl>
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Description" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="parentEntityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Entity ID (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Parent Entity ID" 
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditingEntity(null)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateEntityMutation.isPending}
                    >
                      {updateEntityMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Entity
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Legal Entities Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : entities && entities.length > 0 ? (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden lg:table-cell">Parent Entity</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntities?.map((entity: LegalEntity) => (
                  <TableRow key={entity.id}>
                    <TableCell className="font-medium">
                      <Link href={`/legal-entities/${entity.entityId}`}>
                        {entity.entityId}
                      </Link>
                    </TableCell>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {entity.description ? 
                        (entity.description.length > 50 
                          ? `${entity.description.substring(0, 50)}...` 
                          : entity.description)
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {entity.parentEntityId || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(entity.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setEditingEntity(entity)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Entity
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      <Dialog open={!!editingEntity} onOpenChange={(open) => !open && setEditingEntity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Legal Entity</DialogTitle>
            <DialogDescription>
              Update the details of this legal entity
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="parentEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Entity ID</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingEntity(null)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateEntityMutation.isPending}
                >
                  {updateEntityMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}