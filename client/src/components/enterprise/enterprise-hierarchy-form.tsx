import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { BarLoader } from "@/components/ui/barloader";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Define the form schema
const enterpriseHierarchySchema = z.object({
  assetId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  level: z.enum(["L1", "L2", "L3"]),
  type: z.enum([
    "strategic_capability",
    "value_capability",
    "business_service",
    "product_service"
  ]),
  architectureDomain: z.string().min(1, "Architecture domain is required"),
  parentId: z.number().nullable().optional(),
});

type EnterpriseHierarchyFormValues = z.infer<typeof enterpriseHierarchySchema>;

interface EnterpriseHierarchyFormProps {
  onClose: () => void;
}

export function EnterpriseHierarchyForm({ onClose }: EnterpriseHierarchyFormProps) {
  const { toast } = useToast();
  
  // Fetch existing enterprise architecture items
  const { data: enterpriseResponse, isLoading } = useQuery({
    queryKey: ["/api/enterprise-architecture"],
  });
  
  // Extract data safely from the response
  const enterpriseItems = useMemo(() => {
    // Handle standard API response format
    if (enterpriseResponse?.data && Array.isArray(enterpriseResponse.data)) {
      return enterpriseResponse;
    }
    // Handle direct array response
    if (Array.isArray(enterpriseResponse)) {
      return { data: enterpriseResponse };
    }
    // Handle unexpected response formats
    if (enterpriseResponse && typeof enterpriseResponse === 'object') {
      const data = (enterpriseResponse as any).data;
      if (Array.isArray(data)) {
        return { data };
      }
    }
    // Default empty response
    return { data: [] };
  }, [enterpriseResponse]);

  // Create form
  const form = useForm<EnterpriseHierarchyFormValues>({
    resolver: zodResolver(enterpriseHierarchySchema),
    defaultValues: {
      name: "",
      description: "",
      level: "L1",
      type: "strategic_capability",
      architectureDomain: "Information Security",
      parentId: null,
    },
  });

  // Set up the create mutation
  const createMutation = useMutation({
    mutationFn: async (values: EnterpriseHierarchyFormValues) => {
      // Auto-generate assetId if not provided
      if (!values.assetId) {
        const prefix = getAssetPrefix(values.type);
        const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        values.assetId = `${prefix}-${randomId}`;
      }
      
      // Send to API
      return fetch('/api/enterprise-architecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Enterprise architecture item created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enterprise-architecture"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create enterprise architecture item: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const getAssetPrefix = (type: string) => {
    switch (type) {
      case "strategic_capability": return "SC";
      case "value_capability": return "VC";
      case "business_service": return "BS";
      case "product_service": return "PS";
      default: return "EA";
    }
  };

  // Get the type label for UI
  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Watch the selected level to update UI and type options
  const selectedLevel = form.watch("level");
  const selectedType = form.watch("type");

  // Handle level change to update the type accordingly
  const handleLevelChange = (value: string) => {
    form.setValue("level", value as "L1" | "L2" | "L3");
    
    // Update type based on level
    switch (value) {
      case "L1":
        form.setValue("type", "strategic_capability");
        form.setValue("parentId", null);
        break;
      case "L2":
        form.setValue("type", "value_capability");
        break;
      case "L3":
        form.setValue("type", "business_service");
        break;
    }
  };

  // Get available parent options based on level
  const getAvailableParents = () => {
    const items = enterpriseItems?.data || [];
    
    // If data isn't an array, return empty array
    if (!Array.isArray(items)) return [];

    // For L1, no parents
    if (selectedLevel === "L1") return [];
    
    // For L2, show only L1 items
    if (selectedLevel === "L2") {
      return items.filter(item => item.level === "L1");
    }
    
    // For L3, show only L2 items
    if (selectedLevel === "L3") {
      return items.filter(item => item.level === "L2");
    }
    
    return [];
  };

  const availableParents = getAvailableParents();

  // Submit handler
  const onSubmit = (values: EnterpriseHierarchyFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-lg font-semibold">Add Enterprise Architecture Item</h2>
              <p className="text-sm text-muted-foreground">
                Create a new item in your enterprise architecture hierarchy
              </p>
            </div>
            <Badge variant="outline" className="text-sm bg-primary/10">
              {selectedLevel} {selectedLevel === "L1" ? "Strategic Capability" : 
                            selectedLevel === "L2" ? "Value Capability" : 
                            "Business Service"}
            </Badge>
          </div>

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hierarchy Level</FormLabel>
                <Select
                  onValueChange={handleLevelChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hierarchy level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="L1">L1 - Strategic Capability</SelectItem>
                    <SelectItem value="L2">L2 - Value Capability</SelectItem>
                    <SelectItem value="L3">L3 - Business Service</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the level in the enterprise architecture hierarchy
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedLevel === "L1" && (
                      <SelectItem value="strategic_capability">Strategic Capability</SelectItem>
                    )}
                    {selectedLevel === "L2" && (
                      <SelectItem value="value_capability">Value Capability</SelectItem>
                    )}
                    {selectedLevel === "L3" && (
                      <>
                        <SelectItem value="business_service">Business Service</SelectItem>
                        <SelectItem value="product_service">Product Service</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
                  <Input placeholder={`${getTypeLabel(selectedType)} name`} {...field} />
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
                    placeholder={`Describe this ${getTypeLabel(selectedType)}`} 
                    className="resize-none" 
                    {...field} 
                    value={field.value || ""} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="architectureDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Architecture Domain</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Information Security">Information Security</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Data">Data</SelectItem>
                    <SelectItem value="Application">Application</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The domain this {getTypeLabel(selectedType)} belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedLevel !== "L1" && (
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedLevel === "L2" ? 
                          "Select parent Strategic Capability" : 
                          "Select parent Value Capability"} 
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableParents.length === 0 ? (
                        <SelectItem value="no-parent" disabled>
                          No available parent items
                        </SelectItem>
                      ) : (
                        availableParents.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {selectedLevel === "L2" ? 
                      "Select the Strategic Capability this Value Capability belongs to" : 
                      "Select the Value Capability this Business Service belongs to"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated if empty" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  Leave empty to auto-generate an ID
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={createMutation.isPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <BarLoader />
                <span className="ml-2">Creating...</span>
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}