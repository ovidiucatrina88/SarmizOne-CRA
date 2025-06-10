import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Control, Risk, ControlLibraryItem, controlTypeEnum, controlCategoryEnum, implementationStatusEnum } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { RefreshCw, Search, Plus, PlusCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/layout/layout";

// Form schema for adding a new control to the library
const controlLibraryFormSchema = z.object({
  controlId: z.string().min(1, "Control ID is required"),
  name: z.string().min(1, "Control name is required"),
  description: z.string().min(1, "Description is required"),
  controlType: z.enum(controlTypeEnum.enumValues, {
    required_error: "Control type is required",
  }),
  controlCategory: z.enum(controlCategoryEnum.enumValues, {
    required_error: "Control category is required",
  }),
  implementationStatus: z.enum(implementationStatusEnum.enumValues, {
    required_error: "Implementation status is required",
  }),
  controlEffectiveness: z.coerce.number().min(0).max(10).optional(),
  implementationCost: z.coerce.number().min(0).optional(),
  isPerAgentPricing: z.boolean().default(false),
  costPerAgent: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  iso27001: z.array(z.string()).optional(),
  nistCsf: z.array(z.string()).optional(),
});

type ControlLibraryFormValues = z.infer<typeof controlLibraryFormSchema>;

export default function ControlLibrary() {
  const [isRiskSelectionOpen, setIsRiskSelectionOpen] = useState(false);
  const [isCreateLibraryModalOpen, setIsCreateLibraryModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedControl, setSelectedControl] = useState<ControlLibraryItem | null>(null);
  const [selectedRiskId, setSelectedRiskId] = useState<number | null>(null);
  const [selectedControls, setSelectedControls] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form for creating a new control library item
  const form = useForm<ControlLibraryFormValues>({
    resolver: zodResolver(controlLibraryFormSchema),
    defaultValues: {
      controlId: "",
      name: "",
      description: "",
      controlType: "preventive",
      controlCategory: "technical",
      implementationStatus: "not_implemented",
      controlEffectiveness: 5,
      implementationCost: 0,
      isPerAgentPricing: false,
      costPerAgent: 0,
      notes: "",
      iso27001: [],
      nistCsf: [],
    },
  });
  
  // Reset form when modal is closed
  useEffect(() => {
    if (!isCreateLibraryModalOpen) {
      form.reset();
    }
  }, [isCreateLibraryModalOpen, form]);
  
  // Mutation for creating a new control library item
  const createControlLibraryMutation = useMutation({
    mutationFn: async (data: ControlLibraryFormValues) => {
      // Add item_type = 'template' to the request
      return apiRequest("POST", "/api/control-library", {
        ...data,
        item_type: "template"
      });
    },
    onSuccess: () => {
      // Invalidate the control library query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/controls?tab=templates"] });
      
      // Close the modal
      setIsCreateLibraryModalOpen(false);
      
      // Show success toast
      toast({
        title: "Control added to library",
        description: "The control template has been successfully added to the library.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating control",
        description: `Failed to add control to the library: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handler for form submission
  const onSubmit = (data: ControlLibraryFormValues) => {
    createControlLibraryMutation.mutate(data);
  };

  // Fetch control library templates from dedicated control library endpoint
  const { 
    data: controlLibraryResponse, 
    isLoading: isLoadingControlLibrary, 
    error: controlLibraryError,
    refetch
  } = useQuery({
    queryKey: ["/api/control-library"],
  });
  
  // Extract control library templates from API response
  const controlLibrary = React.useMemo(() => {
    // If the response is in the new service architecture format with a data property
    if (controlLibraryResponse?.data && Array.isArray(controlLibraryResponse.data)) {
      return controlLibraryResponse.data as ControlLibraryItem[];
    }
    // If the response is in the old format (direct array)
    if (Array.isArray(controlLibraryResponse)) {
      return controlLibraryResponse as ControlLibraryItem[];
    }
    // Default to empty array
    return [] as ControlLibraryItem[];
  }, [controlLibraryResponse]);

  // Filter and search controls
  const filteredControls = React.useMemo(() => {
    let filtered = controlLibrary;

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(control =>
        control.name?.toLowerCase().includes(searchLower) ||
        control.controlId?.toLowerCase().includes(searchLower) ||
        control.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(control => control.controlType === filterType);
    }

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(control => control.controlCategory === filterCategory);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(control => control.implementationStatus === filterStatus);
    }

    return filtered;
  }, [controlLibrary, searchQuery, filterType, filterCategory, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredControls.length / itemsPerPage);
  const paginatedControls = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredControls.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredControls, currentPage, itemsPerPage]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory, filterStatus]);
  
  // Fetch all risks (for the risk selection dialog)
  const { data: risksResponse, isLoading: isLoadingRisks, error: risksError } = useQuery({
    queryKey: ["/api/risks"],
    // Only fetch risks when the risk selection dialog is open
    enabled: isRiskSelectionOpen,
  });
  
  // Extract risks data, ensuring it's an array
  const risks = React.useMemo(() => {
    if (risksResponse?.data && Array.isArray(risksResponse.data)) {
      return risksResponse.data as Risk[];
    }
    if (Array.isArray(risksResponse)) {
      return risksResponse as Risk[];
    }
    return [] as Risk[];
  }, [risksResponse]);
  
  // State for risk search filter
  const [riskSearchQuery, setRiskSearchQuery] = useState("");
  
  // Function to manually refresh control library data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["/api/controls?tab=templates"] });
      await refetch();
      toast({
        title: "Control Library refreshed",
        description: "The control library has been refreshed with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "There was an error refreshing the control library.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handler for opening the risk selection dialog
  const handleCreateInstanceFromTemplate = (template: ControlLibraryItem) => {
    setSelectedControl(template);
    setSelectedRiskId(null);
    setIsRiskSelectionOpen(true);
  };
  
  // Close the risk selection dialog
  const handleCloseRiskSelection = () => {
    setIsRiskSelectionOpen(false);
    setSelectedControl(null);
    setSelectedRiskId(null);
  };
  
  // Mutation for creating a control instance from template
  const createControlInstanceMutation = useMutation({
    mutationFn: async (data: { controlLibraryId: number; riskId: number }) => {
      return apiRequest("POST", `/api/control-library/${data.controlLibraryId}/create-instance`, {
        riskId: data.riskId
      });
    },
    onSuccess: (data: any) => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      
      toast({
        title: "Control assigned to risk",
        description: `The control "${data.name || 'Template'}" has been assigned to the selected risk.`
      });
      
      // Close the dialog
      handleCloseRiskSelection();
    },
    onError: (error: any) => {
      toast({
        title: "Error assigning control",
        description: `Failed to assign control to risk: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Handler for confirming the risk selection
  const handleConfirmRiskSelection = () => {
    if (!selectedRiskId || !selectedControl) {
      toast({
        title: "Selection required",
        description: "Please select a risk to assign the control to.",
        variant: "destructive"
      });
      return;
    }
    
    createControlInstanceMutation.mutate({
      controlLibraryId: selectedControl.id,
      riskId: selectedRiskId
    });
  };
  
  // Handler for selecting/deselecting controls for deletion
  const toggleControlSelection = (id: number) => {
    setSelectedControls(prevSelected => 
      prevSelected.includes(id) 
        ? prevSelected.filter(controlId => controlId !== id) 
        : [...prevSelected, id]
    );
  };
  
  // Handler for delete button click
  const handleDeleteSelected = () => {
    if (selectedControls.length > 0) {
      setIsDeleteConfirmOpen(true);
    } else {
      toast({
        title: "No controls selected",
        description: "Please select at least one control to delete.",
        variant: "destructive"
      });
    }
  };
  
  // Delete controls mutation
  const deleteControlsMutation = useMutation({
    mutationFn: async (controlIds: number[]) => {
      const results = await Promise.allSettled(
        controlIds.map(id => 
          apiRequest("DELETE", `/api/control-library/${id}`)
        )
      );
      
      // Process results to separate successful and failed deletions
      const successful: number[] = [];
      const failed: {id: number, error: string}[] = [];
      
      results.forEach((result, index) => {
        const id = controlIds[index];
        if (result.status === "fulfilled") {
          successful.push(id);
        } else if (result.status === "rejected") {
          // Try to parse error response for more details
          let errorMessage = result.reason.message || "Unknown error";
          
          // Check if this is a foreign key constraint error
          if (result.reason.response && result.reason.response.data) {
            const errorData = result.reason.response.data;
            if (errorData.error === "Foreign key constraint violation") {
              errorMessage = errorData.message;
            }
          }
          
          failed.push({ id, error: errorMessage });
        }
      });
      
      // Return both successful and failed operations
      return { successful, failed };
    },
    onSuccess: (result) => {
      // Force refetch the data to ensure UI is updated
      refetch();
      
      // Also invalidate any other related queries
      queryClient.invalidateQueries({ queryKey: ["/api/controls"] });
      
      setSelectedControls([]);
      setIsDeleteConfirmOpen(false);
      
      // Show success message if any deletions succeeded
      if (result.successful.length > 0) {
        toast({
          title: "Controls deleted",
          description: `${result.successful.length} control template(s) have been successfully removed from the library.`,
        });
      }
      
      // Show error message if any deletions failed
      if (result.failed.length > 0) {
        toast({
          title: "Some controls could not be deleted",
          description: result.failed.length === 1 
            ? result.failed[0].error
            : `${result.failed.length} controls could not be deleted because they are in use by control instances. Delete the instances first.`,
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting controls",
        description: `Failed to delete controls: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const isLoading = isLoadingControlLibrary;
  const error = controlLibraryError;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Card>
          <div className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading control library</h2>
        <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <Layout>
      <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Control Library</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsCreateLibraryModalOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Control to Library
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={selectedControls.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedControls.length})
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Control Templates</h3>
          <div className="text-sm text-gray-500">
            {filteredControls.length} of {controlLibrary.length} templates {searchQuery || filterType !== "all" || filterCategory !== "all" || filterStatus !== "all" ? "shown" : "available"}
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="bg-gray-800 rounded-lg border border-gray-600 mb-6">
          <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search controls..."
                  className="w-full pl-8 bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Types</SelectItem>
                  <SelectItem value="preventive" className="text-white hover:bg-gray-600">Preventive</SelectItem>
                  <SelectItem value="detective" className="text-white hover:bg-gray-600">Detective</SelectItem>
                  <SelectItem value="corrective" className="text-white hover:bg-gray-600">Corrective</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterCategory}
                onValueChange={(value) => {
                  setFilterCategory(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-40 bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
                  <SelectItem value="technical" className="text-white hover:bg-gray-600">Technical</SelectItem>
                  <SelectItem value="administrative" className="text-white hover:bg-gray-600">Administrative</SelectItem>
                  <SelectItem value="physical" className="text-white hover:bg-gray-600">Physical</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <SelectTrigger className="w-48 bg-gray-600 border-gray-500 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all" className="text-white hover:bg-gray-600">All Statuses</SelectItem>
                  <SelectItem value="fully_implemented" className="text-white hover:bg-gray-600">Fully Implemented</SelectItem>
                  <SelectItem value="partially_implemented" className="text-white hover:bg-gray-600">Partially Implemented</SelectItem>
                  <SelectItem value="in_progress" className="text-white hover:bg-gray-600">In Progress</SelectItem>
                  <SelectItem value="planned" className="text-white hover:bg-gray-600">Planned</SelectItem>
                  <SelectItem value="not_implemented" className="text-white hover:bg-gray-600">Not Implemented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Control Library Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-600">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={controlLibrary.length > 0 && selectedControls.length === controlLibrary.length} 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedControls(controlLibrary.map(control => control.id));
                      } else {
                        setSelectedControls([]);
                      }
                    }}
                    aria-label="Select all controls"
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Effectiveness</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedControls.length > 0 ? (
                paginatedControls.map((control) => (
                  <TableRow 
                    key={control.id}
                    className={selectedControls.includes(control.id) ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedControls.includes(control.id)} 
                        onCheckedChange={() => toggleControlSelection(control.id)}
                        aria-label={`Select ${control.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{control.controlId}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="font-medium">{control.name}</div>
                      {control.description && (
                        <div className="text-sm text-gray-500 truncate">{control.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        control.controlType === 'preventive' ? 'default' : 
                        control.controlType === 'detective' ? 'outline' : 
                        'secondary'
                      }>
                        {control.controlType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {control.controlCategory}
                    </TableCell>
                    <TableCell>
                      {control.controlEffectiveness ? `${control.controlEffectiveness}/10` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        control.implementationStatus === 'fully_implemented' ? 'default' : 
                        control.implementationStatus === 'in_progress' ? 'outline' : 
                        'destructive'
                      }>
                        {control.implementationStatus?.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateInstanceFromTemplate(control)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Risk
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery || filterType !== "all" || filterCategory !== "all" || filterStatus !== "all" 
                      ? "No controls match your current filters" 
                      : "No control templates found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4 px-6 bg-gray-800 border-t border-gray-600 rounded-b-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous Page</span>
              </Button>
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-gray-500 text-gray-300 hover:bg-gray-600"
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next Page</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Risk Selection Dialog */}
        <Dialog open={isRiskSelectionOpen} onOpenChange={setIsRiskSelectionOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Control to Risk</DialogTitle>
              <DialogDescription>
                Select a risk to assign the control "{selectedControl?.name}" to:
              </DialogDescription>
            </DialogHeader>
            
            {/* Search and filters */}
            <div className="flex items-center space-x-2 my-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search risks by name, ID or description..."
                  className="pl-8"
                  value={riskSearchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiskSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {isLoadingRisks ? (
              <div className="py-6 space-y-4">
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            ) : risksError ? (
              <div className="py-6 text-center text-red-500">
                Error loading risks. Please try again.
              </div>
            ) : risks && risks.length > 0 ? (
              <ScrollArea className="max-h-[400px] pr-4">
                <RadioGroup
                  value={selectedRiskId?.toString()}
                  onValueChange={(value) => setSelectedRiskId(parseInt(value))}
                  className="space-y-3"
                >
                  {risks
                    .filter(risk => 
                      risk.name.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
                      risk.riskId.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
                      (risk.description && risk.description.toLowerCase().includes(riskSearchQuery.toLowerCase()))
                    )
                    .map((risk) => (
                      <div 
                        key={risk.id} 
                        className="flex items-start space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedRiskId(risk.id)}
                      >
                        <RadioGroupItem value={risk.id.toString()} id={`risk-${risk.id}`} className="mt-1" />
                        <Label htmlFor={`risk-${risk.id}`} className="flex-1 font-normal cursor-pointer">
                          <div className="font-semibold text-base">{risk.name}</div>
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">ID: {risk.riskId}</span>
                            {risk.severity && (
                              <span className={`px-2 py-0.5 rounded-md ${
                                risk.severity === "low" ? "bg-blue-100 text-blue-800" :
                                risk.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                                risk.severity === "high" ? "bg-orange-100 text-orange-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                              </span>
                            )}
                            {risk.associatedAssets && risk.associatedAssets.length > 0 && (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md">
                                {risk.associatedAssets.length} asset{risk.associatedAssets.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          {risk.description && (
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2">{risk.description}</div>
                          )}
                        </Label>
                      </div>
                    ))
                  }
                </RadioGroup>
                
                {risks.filter(risk => 
                  risk.name.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
                  risk.riskId.toLowerCase().includes(riskSearchQuery.toLowerCase()) ||
                  (risk.description && risk.description.toLowerCase().includes(riskSearchQuery.toLowerCase()))
                ).length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    No risks matching your search. Try a different search term.
                  </div>
                )}
              </ScrollArea>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No risks available. Please create risks first in the Risk Register.
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseRiskSelection}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmRiskSelection}
                disabled={createControlInstanceMutation.isPending || !selectedRiskId}
              >
                {createControlInstanceMutation.isPending ? "Assigning..." : "Assign Control"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Create Control Library Modal */}
      <Dialog open={isCreateLibraryModalOpen} onOpenChange={setIsCreateLibraryModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Control to Library</DialogTitle>
            <DialogDescription>
              Create a new control template in the library. All templates can be applied to risks as needed.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="controlId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Control ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., CIS-1-TPL" {...field} />
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
                        <Input placeholder="Control name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed description of the control..." 
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="controlType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Control Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a control type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {controlTypeEnum.enumValues.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="controlCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Control Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {controlCategoryEnum.enumValues.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="implementationStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Implementation Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {implementationStatusEnum.enumValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="controlEffectiveness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Control Effectiveness (0-10)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          max={10} 
                          step={0.1}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Rate from 0 (ineffective) to 10 (highly effective)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="implementationCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Implementation Cost</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPerAgentPricing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Per-Agent Pricing</FormLabel>
                          <FormDescription>
                            Enable if this control is priced per agent/endpoint
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("isPerAgentPricing") && (
                    <FormField
                      control={form.control}
                      name="costPerAgent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Per Agent</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0}
                              step={0.01}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about this control..." 
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateLibraryModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createControlLibraryMutation.isPending}
                >
                  {createControlLibraryMutation.isPending ? "Creating..." : "Add Control to Library"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedControls.length} control template{selectedControls.length !== 1 ? 's' : ''}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Control templates that are currently being used by control instances will not be affected, but you'll no longer be able to create new instances from these templates.
            </p>
          </div>
          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteControlsMutation.mutate(selectedControls)}
              disabled={deleteControlsMutation.isPending}
            >
              {deleteControlsMutation.isPending ? "Deleting..." : "Delete Controls"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
}