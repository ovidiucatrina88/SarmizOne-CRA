import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RiskResponse, Risk, insertRiskResponseSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// Extended schema with validation
const responseFormSchema = insertRiskResponseSchema.extend({
  riskId: z.string().min(1, "Risk ID is required"),
  responseType: z.enum(["accept", "avoid", "transfer", "mitigate"], {
    required_error: "Response type is required",
  }),
  justification: z.string().min(1, "Justification is required"),
  assignedControls: z.array(z.string()).optional(),
  transferMethod: z.string().optional(),
  avoidanceStrategy: z.string().optional(),
  acceptanceReason: z.string().optional(),
});

type ResponseFormProps = {
  response: RiskResponse | null;
  risks: Risk[];
  onClose: () => void;
};

export function ResponseForm({ response, risks, onClose }: ResponseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedControls, setSelectedControls] = useState<string[]>(
    response?.assignedControls || []
  );
  const [responseType, setResponseType] = useState<string>(response?.responseType || "mitigate");

  // Fetch controls for selection when mitigate is chosen
  const { data: controls } = useQuery({
    queryKey: ["/api/controls"],
  });

  // Find risk details for the selected risk
  const selectedRisk = response 
    ? risks.find(risk => risk.riskId === response.riskId) 
    : undefined;

  // Initialize form with response data or defaults
  const form = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: response
      ? { ...response }
      : {
          riskId: "",
          responseType: "mitigate",
          justification: "",
          assignedControls: [],
          transferMethod: "",
          avoidanceStrategy: "",
          acceptanceReason: "",
        },
  });

  // Update selected response type when form value changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.responseType) {
        setResponseType(value.responseType);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Create mutation for adding/updating response
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof responseFormSchema>) => {
      // Include the selected controls for mitigate response
      if (values.responseType === "mitigate") {
        values.assignedControls = selectedControls;
      } else {
        values.assignedControls = [];
      }

      if (response) {
        // Update existing response
        return apiRequest("PUT", `/api/responses/${response.id}`, values);
      } else {
        // Create new response
        return apiRequest("POST", "/api/responses", values);
      }
    },
    onSuccess: () => {
      // Invalidate responses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      
      // Show success message
      toast({
        title: response ? "Response updated" : "Response created",
        description: response
          ? "The risk response has been updated successfully."
          : "A new risk response has been added.",
      });
      
      // Close the form modal
      onClose();
    },
    onError: (error) => {
      // Show error message
      toast({
        title: "Error",
        description: `Failed to ${response ? "update" : "create"} risk response: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof responseFormSchema>) => {
    mutation.mutate(values);
  };

  // Handle control selection change
  const handleControlChange = (checked: boolean, controlId: string) => {
    setSelectedControls(
      checked
        ? [...selectedControls, controlId]
        : selectedControls.filter((c) => c !== controlId)
    );
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-amber-100 text-amber-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Risk ID selector */}
        <FormField
          control={form.control}
          name="riskId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Risk</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedControls([]); // Reset selected controls when risk changes
                }}
                defaultValue={field.value}
                disabled={!!response} // Disable if editing an existing response
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a risk" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {risks.map((risk) => (
                    <SelectItem key={risk.id} value={risk.riskId}>
                      {risk.name} ({risk.riskId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Risk Summary (if a risk is selected) */}
        {selectedRisk && (
          <div className="p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Risk Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Severity:</span>{" "}
                <Badge className={getSeverityColor(selectedRisk.severity)}>
                  {selectedRisk.severity.charAt(0).toUpperCase() + selectedRisk.severity.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>{" "}
                {selectedRisk.riskCategory.charAt(0).toUpperCase() + selectedRisk.riskCategory.slice(1)}
              </div>
              <div>
                <span className="text-gray-500">Inherent Risk:</span>{" "}
                {formatCurrency(selectedRisk.inherentRisk || 0)}
              </div>
              <div>
                <span className="text-gray-500">Residual Risk:</span>{" "}
                {formatCurrency(selectedRisk.residualRisk || 0)}
              </div>
            </div>
          </div>
        )}

        {/* Response Type field */}
        <FormField
          control={form.control}
          name="responseType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Response Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mitigate" id="mitigate" />
                    <label htmlFor="mitigate" className="text-sm font-medium">
                      Mitigate - Implement controls to reduce the risk
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <label htmlFor="transfer" className="text-sm font-medium">
                      Transfer - Share or transfer the risk to a third party
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="avoid" id="avoid" />
                    <label htmlFor="avoid" className="text-sm font-medium">
                      Avoid - Eliminate the risk by removing the cause
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accept" id="accept" />
                    <label htmlFor="accept" className="text-sm font-medium">
                      Accept - Acknowledge and accept the risk consequences
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Justification field */}
        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain the reasoning behind this response strategy..."
                  className="h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields based on response type */}
        {responseType === "mitigate" && (
          <div>
            <FormLabel>Assigned Controls</FormLabel>
            {controls && controls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-2">
                {controls.map((control) => (
                  <div className="flex items-center space-x-2" key={control.id}>
                    <Checkbox
                      id={`control-${control.id}`}
                      checked={selectedControls.includes(control.controlId)}
                      onCheckedChange={(checked) =>
                        handleControlChange(checked as boolean, control.controlId)
                      }
                    />
                    <label
                      htmlFor={`control-${control.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {control.name} ({control.controlId})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                No controls available. Please add controls first.
              </p>
            )}
          </div>
        )}

        {responseType === "transfer" && (
          <FormField
            control={form.control}
            name="transferMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transfer Method</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe how the risk will be transferred (e.g., insurance, outsourcing)..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {responseType === "avoid" && (
          <FormField
            control={form.control}
            name="avoidanceStrategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avoidance Strategy</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain how the risk will be avoided or eliminated..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {responseType === "accept" && (
          <FormField
            control={form.control}
            name="acceptanceReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acceptance Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain why this risk is being accepted..."
                    className="h-20"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="gap-1"
          >
            {mutation.isPending && <Loader className="h-4 w-4 animate-spin" />}
            {response ? "Update Response" : "Create Response"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
