import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Props for the basic risk information component
interface BasicRiskInfoProps {
  form: UseFormReturn<any>;
}

export function BasicRiskInfo({ form }: BasicRiskInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">
          Profile
        </p>
        <h3 className="text-2xl font-semibold text-white">
          Risk overview
        </h3>
        <p className="text-sm text-white/60 max-w-2xl">
          Capture the FAIR scenario context so quantification stays aligned to the
          business problem you are solving.
        </p>
      </div>

      {/* Risk ID */}
      <FormField
        control={form.control}
        name="riskId"
        render={({ field }) => (
          <FormItem className="text-white">
            <FormLabel className="text-sm text-white/80">Risk ID</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., RISK-DDOS-2025-001" 
                {...field} 
                disabled={field.value && field.value.length > 0}
              />
            </FormControl>
            <FormDescription className="text-xs text-white/50">
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
          <FormItem className="text-white">
            <FormLabel className="text-sm text-white/80">Risk Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., DDoS Attack Risk" 
                {...field} 
              />
            </FormControl>
            <FormDescription className="text-xs text-white/50">
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
          <FormItem className="text-white">
            <FormLabel className="text-sm text-white/80">Description</FormLabel>
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
          <FormItem className="text-white">
            <FormLabel className="text-sm text-white/80">Threat Community</FormLabel>
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
          <FormItem className="text-white">
            <FormLabel className="text-sm text-white/80">Vulnerability</FormLabel>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Category */}
        <FormField
          control={form.control}
          name="riskCategory"
          render={({ field }) => (
            <FormItem className="text-white">
              <FormLabel className="text-sm text-white/80">Category</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="bg-black/20 text-white border-white/10">
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
            <FormItem className="text-white">
              <FormLabel className="text-sm text-white/80">Severity</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="bg-black/20 text-white border-white/10">
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
