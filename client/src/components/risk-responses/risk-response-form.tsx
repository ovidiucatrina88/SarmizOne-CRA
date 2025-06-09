import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Define the form schema
const responseFormSchema = z.object({
  riskId: z.string().min(1, "Risk is required"),
  responseType: z.enum(["mitigate", "transfer", "avoid", "accept"], {
    required_error: "Response type is required",
  }),
  justification: z.string().optional(),
  assignedControls: z.array(z.string()).optional(),
  transferMethod: z.string().optional(),
  avoidanceStrategy: z.string().optional(),
  acceptanceReason: z.string().optional(),
});

type ResponseFormValues = z.infer<typeof responseFormSchema>;

interface RiskResponseFormProps {
  risks: any[];
  response?: any;
  onSuccess: () => void;
}

export function RiskResponseForm({ risks, response, onSuccess }: RiskResponseFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch controls for dropdown
  const { data: controlsData } = useQuery({
    queryKey: ["/api/controls"],
  });

  const controls = controlsData?.data || [];
  
  // Map controls to format needed for MultiSelect
  const controlOptions = controls.map((control) => ({
    value: control.controlId,
    label: `${control.controlId} - ${control.name}`,
  }));

  // Set default values
  const defaultValues: ResponseFormValues = {
    riskId: response?.riskId || "",
    responseType: response?.responseType || "mitigate",
    justification: response?.justification || "",
    assignedControls: response?.assignedControls || [],
    transferMethod: response?.transferMethod || "",
    avoidanceStrategy: response?.avoidanceStrategy || "",
    acceptanceReason: response?.acceptanceReason || "",
  };

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseFormSchema),
    defaultValues,
  });

  // Update form when response changes
  useEffect(() => {
    if (response) {
      form.reset({
        riskId: response.riskId || "",
        responseType: response.responseType || "mitigate",
        justification: response.justification || "",
        assignedControls: response.assignedControls || [],
        transferMethod: response.transferMethod || "",
        avoidanceStrategy: response.avoidanceStrategy || "",
        acceptanceReason: response.acceptanceReason || "",
      });
    }
  }, [response, form]);

  // Watch the response type to show/hide relevant fields
  const responseType = form.watch("responseType");

  const onSubmit = async (values: ResponseFormValues) => {
    setIsSubmitting(true);
    try {
      const url = response 
        ? `/api/risk-responses/${response.id}` 
        : "/api/risk-responses";
      
      const method = response ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save risk response");
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="riskId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a risk" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {risks.map((risk) => (
                    <SelectItem key={risk.riskId} value={risk.riskId}>
                      {risk.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The risk you're responding to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responseType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a response type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mitigate">Mitigate</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="avoid">Avoid</SelectItem>
                  <SelectItem value="accept">Accept</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How you plan to address this risk
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="justification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Justification</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Why you chose this response type"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explain the reasoning behind this response
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {responseType === "mitigate" && (
          <FormField
            control={form.control}
            name="assignedControls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Controls</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={controlOptions}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select controls"
                  />
                </FormControl>
                <FormDescription>
                  Controls that will help mitigate this risk
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {responseType === "transfer" && (
          <FormField
            control={form.control}
            name="transferMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transfer Method</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Insurance policy, third-party vendor"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  How the risk will be transferred to another party
                </FormDescription>
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
                    placeholder="How you plan to avoid this risk entirely"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Explain how you'll eliminate or avoid this risk entirely
                </FormDescription>
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
                    placeholder="Why you're choosing to accept this risk"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Explain why you're accepting this risk without further action
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : response ? "Update Response" : "Create Response"}
          </Button>
        </div>
      </form>
    </Form>
  );
}