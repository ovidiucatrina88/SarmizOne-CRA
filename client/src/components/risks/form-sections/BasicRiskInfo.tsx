import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Props for the basic risk information component
interface BasicRiskInfoProps {
  form: UseFormReturn<any>;
}

export function BasicRiskInfo({ form }: BasicRiskInfoProps) {
  return (
    <div className="space-y-4 max-w-[500px]">
      <div>
        <h3 className="text-lg font-medium">Basic Risk Information</h3>
        <p className="text-sm text-muted-foreground">
          Provide details about the risk being assessed.
        </p>
      </div>

      {/* Risk ID */}
      <FormField
        control={form.control}
        name="riskId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk ID</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., RISK-DDOS-2025-001" 
                {...field} 
                disabled={field.value && field.value.length > 0}
              />
            </FormControl>
            <FormDescription>
              {field.value && field.value.length > 0 
                ? "Risk ID cannot be changed after creation" 
                : "A unique identifier for the risk, auto-generated if left blank"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Risk Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., DDoS Attack Risk" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              A descriptive name for the risk
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Risk Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe the risk in detail..." 
                {...field} 
                className="min-h-[80px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Threat Community */}
      <FormField
        control={form.control}
        name="threatCommunity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Threat Community</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., External Threat Actor" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              The likely source of the threat
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vulnerability */}
      <FormField
        control={form.control}
        name="vulnerability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vulnerability</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Unpatched Server" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              The vulnerability that could be exploited
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[400px]">
        {/* Risk Category */}
        <FormField
          control={form.control}
          name="riskCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Severity */}
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}