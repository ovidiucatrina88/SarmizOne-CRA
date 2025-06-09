import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Cost module schema
const costModuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cisControl: z.array(z.string()).min(1, "At least one CIS control is required"),
  costFactor: z.coerce.number().positive("Cost factor must be positive"),
  costType: z.enum(["fixed", "per_event", "per_hour", "percentage"]),
  description: z.string().optional(),
});

type CostModuleFormData = z.infer<typeof costModuleSchema>;

interface CostModuleFormProps {
  module?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CostModuleForm({ module, onSuccess, onCancel }: CostModuleFormProps) {
  const [controlInput, setControlInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize form with normalized field names
  const form = useForm<CostModuleFormData>({
    resolver: zodResolver(costModuleSchema),
    defaultValues: {
      name: module?.name || "",
      cisControl: module?.cisControl || module?.cis_control || [],
      costFactor: module?.costFactor || module?.cost_factor || 0,
      costType: (module?.costType || module?.cost_type || "fixed") as CostType,
      description: module?.description || "",
    },
  });

  // Create/update mutation
  const mutation = useMutation({
    mutationFn: async (data: CostModuleFormData) => {
      const url = module 
        ? `/api/cost-modules/${module.id}` 
        : '/api/cost-modules';
      
      const method = module ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${module ? 'update' : 'create'} cost module`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cost-modules'] });
      toast({
        title: module ? "Cost module updated" : "Cost module created",
        description: module 
          ? "The cost module has been updated successfully." 
          : "The cost module has been created successfully."
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: `Failed to ${module ? 'update' : 'create'} cost module`,
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Add CIS control to the form
  const addCisControl = () => {
    if (!controlInput.trim()) return;
    
    const currentControls = form.getValues("cisControl") || [];
    
    // Check if this control already exists
    if (!currentControls.includes(controlInput.trim())) {
      form.setValue("cisControl", [...currentControls, controlInput.trim()]);
    }
    
    setControlInput("");
  };

  // Remove CIS control from the form
  const removeCisControl = (control: string) => {
    const currentControls = form.getValues("cisControl") || [];
    form.setValue(
      "cisControl", 
      currentControls.filter(c => c !== control)
    );
  };

  // Handle form submission
  const onSubmit = (data: CostModuleFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Breach Investigation" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for this cost module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cisControl"
          render={() => (
            <FormItem>
              <FormLabel>CIS Controls</FormLabel>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="7.1"
                  value={controlInput}
                  onChange={(e) => setControlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCisControl();
                    }
                  }}
                />
                <Button type="button" onClick={addCisControl}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.watch("cisControl")?.map((control) => (
                  <Badge key={control} variant="secondary" className="flex items-center gap-1">
                    {control}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCisControl(control)}
                    />
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Maps to CIS Control IDs (e.g., 7, 7.1)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="costFactor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Factor</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="10000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The cost amount or percentage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Cost</SelectItem>
                    <SelectItem value="per_event">Per Event</SelectItem>
                    <SelectItem value="per_hour">Per Hour</SelectItem>
                    <SelectItem value="percentage">Percentage of Loss</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How this cost is applied
                </FormDescription>
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
                  placeholder="Fixed cost for conducting a breach investigation"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of this cost module
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {module ? "Updating..." : "Creating..."}
              </>
            ) : (
              module ? "Update" : "Create"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}