import React, { useState, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Asset } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCurrency,
  formatNumberAbbreviated,
  calculatePrimaryLossFromAssets
} from "@shared/utils/calculations";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AssetSelection } from "./form-sections/AssetSelection";

// Confidence levels for risk parameters
const CONFIDENCE_LEVELS = ["low", "medium", "high"];

// Props for the risk form preview with editable controls
interface RiskFormPreviewEditableProps {
  form: UseFormReturn<any>;
  selectedAssets?: string[];
  setSelectedAssets?: (assets: string[]) => void;
  onParameterEdit?: () => void;
}

// Props for the triangular distribution form field
interface TriangularFormFieldProps {
  form: UseFormReturn<any>;
  title: string;
  description: string;
  minField: string;
  avgField: string;
  maxField: string;
  confidenceField: string;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  hideTitle?: boolean;
  darkMode?: boolean;
}

// Triangular form field component
function TriangularFormField({
  form,
  title,
  description,
  minField,
  avgField,
  maxField,
  confidenceField,
  unit = "",
  min = 0,
  max = 100,
  step = 1,
  hideTitle = false,
  darkMode = false,
}: TriangularFormFieldProps) {
  // Simple colors based on dark mode
  const textColor = darkMode ? "text-white" : "text-slate-800";
  const labelColor = darkMode ? "text-slate-100" : "text-slate-600";
  const inputBgColor = darkMode ? "bg-slate-700" : "bg-white";
  
  // Check if this is a money field
  const isMoneyField = minField.includes("LossMagnitude") || unit === "$";
  
  // Simple formatter for displayed values
  const formatMoneyValue = (value: number): string => {
    return isMoneyField ? formatNumberAbbreviated(value) : String(value);
  };

  // Basic CSS to remove spinner buttons from inputs
  const noSpinnerClass = "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  // Handle min field changes with validation - Fixed for decimal input
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    
    // Allow empty input or just a decimal point
    if (val === '' || val === '.') {
      field.onChange(val);
      return;
    }
    
    // Check for valid decimal format (prevent multiple decimal points)
    const decimalCount = (val.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return; // Don't update if multiple decimal points
    }
    
    const numVal = parseFloat(val);
    
    // Only validate if we have a complete number (not ending with decimal)
    if (!isNaN(numVal) && !val.endsWith('.')) {
      // Ensure min value is within bounds
      if (numVal < min) {
        field.onChange(min);
        return;
      }
      
      // Ensure min doesn't exceed current max value
      const maxValue = form.getValues(maxField);
      if (maxValue !== undefined && maxValue !== '' && parseFloat(maxValue) > 0 && numVal > parseFloat(maxValue)) {
        field.onChange(parseFloat(maxValue));
        return;
      }
      
      // Store as number for complete values
      field.onChange(numVal);
      return;
    }
    
    // Allow partial decimal input (like "1." or "0.1") as string
    field.onChange(val);
  };
  
  // Handle avg field changes with validation - Fixed for decimal input
  const handleAvgChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    
    // Allow empty input or just a decimal point
    if (val === '' || val === '.') {
      field.onChange(val);
      return;
    }
    
    // Check for valid decimal format (prevent multiple decimal points)
    const decimalCount = (val.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return; // Don't update if multiple decimal points
    }
    
    const numVal = parseFloat(val);
    
    // Only validate if we have a complete number (not ending with decimal)
    if (!isNaN(numVal) && !val.endsWith('.')) {
      const minValue = parseFloat(form.getValues(minField)) || min;
      const maxValue = parseFloat(form.getValues(maxField)) || max;
      
      // Ensure avg is between min and max
      if (numVal < minValue) {
        field.onChange(minValue);
        return;
      }
      
      if (maxValue !== undefined && maxValue !== '' && numVal > maxValue) {
        field.onChange(maxValue);
        return;
      }
      
      // Store as number for complete values
      field.onChange(numVal);
      return;
    }
    
    // Allow partial decimal input (like "1." or "0.1") as string
    field.onChange(val);
  };
  
  // Handle max field changes with validation - Fixed for decimal input
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    
    // Allow empty input or just a decimal point
    if (val === '' || val === '.') {
      field.onChange(val);
      return;
    }
    
    // Check for valid decimal format (prevent multiple decimal points)
    const decimalCount = (val.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return; // Don't update if multiple decimal points
    }
    
    const numVal = parseFloat(val);
    
    // Only validate if we have a complete number (not ending with decimal)
    if (!isNaN(numVal) && !val.endsWith('.')) {
      // Ensure max doesn't exceed upper bound
      if (max !== undefined && numVal > max) {
        field.onChange(max);
        return;
      }
      
      // Ensure max isn't less than current min value
      const minValue = parseFloat(form.getValues(minField));
      if (minValue !== undefined && !isNaN(minValue) && numVal < minValue) {
        field.onChange(minValue);
        return;
      }
      
      // Store as number for complete values
      field.onChange(numVal);
      return;
    }
    
    // Allow partial decimal input (like "1." or "0.1") as string
    field.onChange(val);
  };

  return (
    <div className="space-y-3">
      {/* Title section if not hidden */}
      {!hideTitle && (
        <div className="flex justify-between items-center">
          <div>
            <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
            <p className={`text-xs ${darkMode ? "text-slate-200" : "text-muted-foreground"}`}>
              {description}
            </p>
          </div>
        </div>
      )}

      {/* Fields grid */}
      <div className="grid grid-cols-1 gap-2">
        {/* Min Field */}
        <FormField
          control={form.control}
          name={minField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-[10px] ${labelColor}`}>Min</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field}
                    type="text" 
                    inputMode="numeric"
                    className={`h-7 text-xs py-1 px-2 ${inputBgColor} ${textColor} pr-12 ${noSpinnerClass}`}
                    onChange={(e) => handleMinChange(e, field)}
                  />
                  {isMoneyField && field.value && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-60 pointer-events-none">
                      {formatMoneyValue(Number(field.value))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        
        {/* Average Field */}
        <FormField
          control={form.control}
          name={avgField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-[10px] ${labelColor}`}>Avg</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field}
                    type="text" 
                    inputMode="numeric"
                    className={`h-7 text-xs py-1 px-2 ${inputBgColor} ${textColor} pr-12 ${noSpinnerClass}`}
                    onChange={(e) => handleAvgChange(e, field)}
                  />
                  {isMoneyField && field.value && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-60 pointer-events-none">
                      {formatMoneyValue(Number(field.value))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
        
        {/* Max Field */}
        <FormField
          control={form.control}
          name={maxField}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-[10px] ${labelColor}`}>Max</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field}
                    type="text" 
                    inputMode="numeric"
                    className={`h-7 text-xs py-1 px-2 ${inputBgColor} ${textColor} pr-12 ${noSpinnerClass}`}
                    onChange={(e) => handleMaxChange(e, field)}
                  />
                  {isMoneyField && field.value && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-60 pointer-events-none">
                      {formatMoneyValue(Number(field.value))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={confidenceField}
        render={({ field }) => (
          <FormItem className="space-y-1">
            <div className="flex items-center">
              <FormLabel className={`text-[10px] ${labelColor} mr-2`}>
                Confidence
              </FormLabel>
              {unit && (
                <span className={`text-xs ${labelColor}`}>{unit}</span>
              )}
            </div>
            <Select
              value={field.value || "medium"}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger
                  className={`h-7 text-xs py-1 px-2 ${inputBgColor} ${textColor}`}
                >
                  <SelectValue placeholder="Select confidence" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONFIDENCE_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-[10px]" />
          </FormItem>
        )}
      />
    </div>
  );
}

export function RiskFormPreviewEditable({
  form,
  selectedAssets = [],
  setSelectedAssets,
  onParameterEdit,
}: RiskFormPreviewEditableProps) {
  // Initialize toast hook at the component level
  const { toast } = useToast();
  
  // Get risk ID for fetching real-time calculated values
  const riskId = form.watch("riskId");
  
  // Fetch real-time calculated risk values from server (includes control effectiveness)
  const { data: calculatedRiskData } = useQuery({
    queryKey: ["/api/risks", riskId, "calculate"],
    enabled: !!riskId,
    refetchInterval: 5000, // Refresh every 5 seconds to show live control effects
    queryFn: async () => {
      const res = await fetch(`/api/risks/${riskId}/calculate`);
      if (!res.ok) throw new Error("Failed to fetch risk calculation");
      const result = await res.json();
      return result.data; // Return the data portion of the API response
    },
  });
  
  // Use server-calculated values (with control effectiveness) instead of form values
  const inherentRisk = calculatedRiskData?.inherentRisk || 0;
  const residualRisk = calculatedRiskData?.residualRisk || calculatedRiskData?.inherentRisk || 0;

  // Initialize local state for assets if none provided
  const [localSelectedAssets, setLocalSelectedAssets] = useState<string[]>(selectedAssets);
  const [calculatedPrimaryLoss, setCalculatedPrimaryLoss] = useState<{
    min: number;
    avg: number;
    max: number;
  }>({ min: 0, avg: 0, max: 0 });
  
  // Fetch full asset data for calculations
  // Get assets data with proper type handling for the new service architecture
  const { data: assetsResponse } = useQuery({
    queryKey: ["/api/assets"],
  });
  
  // Process assets data to handle different response formats
  const allAssets = useMemo(() => {
    // In the new service architecture, responses always have a data property
    if (assetsResponse?.data) {
      return assetsResponse.data as Asset[];
    }
    // If the response is in the old format (direct array)
    if (Array.isArray(assetsResponse)) {
      return assetsResponse as Asset[];
    }
    // Default to empty array
    return [] as Asset[];
  }, [assetsResponse]);
  
  // Filter the full asset objects for selected assets
  const selectedAssetObjects = useMemo(() => {
    const effectiveAssetIds = setSelectedAssets ? selectedAssets : localSelectedAssets;
    return allAssets.filter(asset => 
      effectiveAssetIds.includes(asset.assetId)
    );
  }, [allAssets, selectedAssets, localSelectedAssets, setSelectedAssets]);
  
  // Populate global asset cache for calculations
  useEffect(() => {
    if (allAssets.length > 0) {
      // Initialize cache if it doesn't exist
      if (!window.__ASSET_CACHE__) {
        window.__ASSET_CACHE__ = {};
      }
      
      // Populate cache with all assets
      allAssets.forEach(asset => {
        window.__ASSET_CACHE__![asset.assetId] = {
          id: asset.id,
          name: asset.name,
          assetValue: asset.assetValue,
          currency: asset.currency
        };
      });
      
      console.log("Populated asset cache with", allAssets.length, "assets");
    }
  }, [allAssets]);
  
  // Calculate primary loss from asset values
  useEffect(() => {
    if (selectedAssetObjects.length > 0) {
      // Get risk severity from form
      const severity = form.getValues("severity") || "medium";
      
      // Use custom impact factors based on risk severity
      const impactFactor = { 
        min: severity === 'critical' ? 0.2 : severity === 'high' ? 0.1 : 0.05, 
        avg: severity === 'critical' ? 0.5 : severity === 'high' ? 0.3 : 0.15, 
        max: severity === 'critical' ? 0.8 : severity === 'high' ? 0.6 : 0.3 
      };
      
      const primaryLossValues = calculatePrimaryLossFromAssets(selectedAssetObjects, impactFactor);
      console.log("Calculated primary loss from assets:", primaryLossValues);
      
      // Update state with calculated values
      setCalculatedPrimaryLoss(primaryLossValues);
      
      // Update form values with the calculated primary loss
      if (primaryLossValues.min > 0) {
        form.setValue("primaryLossMagnitudeMin", primaryLossValues.min, { shouldValidate: true });
        form.setValue("primaryLossMagnitudeAvg", primaryLossValues.avg, { shouldValidate: true });
        form.setValue("primaryLossMagnitudeMax", primaryLossValues.max, { shouldValidate: true });
      }
      
      console.log("Using primary loss values calculated from asset values");
    } else {
      console.log("No asset objects available, using original primary loss values");
    }
  }, [selectedAssetObjects, form]);
  
  // Use the setter from props if available, otherwise use local state
  const handleAssetChange = (assets: string[]) => {
    if (setSelectedAssets) {
      setSelectedAssets(assets);
    } else {
      setLocalSelectedAssets(assets);
    }
    
    // Also update the form values
    form.setValue("associatedAssets", assets, {
      shouldValidate: true
    });
    
    // Store the asset objects in form context for calculation
    // This allows the risk-utils.ts to have access to full asset data
    form.setValue("_associatedAssetData", 
      allAssets.filter(asset => assets.includes(asset.assetId)),
      { shouldValidate: false }
    );
    
    // Trigger a recalculation by dispatching an event that the parent risk-form component listens for
    try {
      const recalculateEvent = new CustomEvent("recalculateRisk");
      window.dispatchEvent(recalculateEvent);
    } catch (error) {
      console.warn("Could not dispatch recalculate event", error);
    }
  };

  // Determine which selectedAssets to use (props or local state)
  const effectiveSelectedAssets = setSelectedAssets ? selectedAssets : localSelectedAssets;
  
  // Sync local state with props when they change
  useEffect(() => {
    if (selectedAssets) {
      setLocalSelectedAssets(selectedAssets);
    }
  }, [selectedAssets]);

  // Format risk values for display
  const formattedInherentRisk = formatCurrency(inherentRisk);
  const formattedResidualRisk = formatCurrency(residualRisk);

  // Calculate risk reduction percentage
  const riskReduction =
    inherentRisk > 0 ? ((inherentRisk - residualRisk) / inherentRisk) * 100 : 0;

  // Function to handle manual calculation
  const handleManualCalculation = () => {
    try {
      console.log("Manual calculation triggered by Run Calculations button");
      // Check if the onParameterEdit callback is provided
      if (onParameterEdit) {
        // This will trigger the recalculation defined in the parent component
        onParameterEdit();
        
        // Provide user feedback that calculation is in progress
        toast({
          title: "Calculating Risk Values",
          description: "FAIR parameters are being calculated based on current values.",
        });
      }
    } catch (error) {
      console.error("Error triggering manual calculation:", error);
      toast({
        title: "Calculation Error",
        description: "There was a problem calculating risk values. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            Risk Quantification
            <Badge variant="outline" className="ml-2 text-xs font-normal">
              FAIR-U v3.0
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Inherent Risk:</span>
              <span className="text-sm font-bold">{formattedInherentRisk}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Residual Risk:</span>
              <span className="text-sm font-bold">{formattedResidualRisk}</span>
            </div>
            {inherentRisk > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Reduction:</span>
                <span className="text-sm font-bold text-green-500">
                  {riskReduction.toFixed(2)}%
                </span>
              </div>
            )}
            
            {/* Display associated assets */}
            {selectedAssetObjects.length > 0 && (
              <div className="pt-3 border-t mt-2 border-gray-100">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium">Associated Assets:</span>
                  <Badge variant="outline" className="ml-2">
                    {selectedAssetObjects.length}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  {selectedAssetObjects.map((asset) => (
                    <div key={asset.id} className="flex justify-between">
                      <span>{asset.name}</span>
                      <span className="font-medium">
                        {asset.value ? formatCurrency(parseFloat(asset.value)) : 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 items-center">
          <h3 className="text-lg font-semibold">FAIR Parameters</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Associated Assets: {selectedAssetObjects.length}</span>
          </div>
        </div>
        <Button 
          onClick={() => {
            if (onParameterEdit) {
              onParameterEdit();
              
              // Get toast from the imported hook
              toast({
                title: "Calculating Risk Values",
                description: "FAIR parameters are being calculated based on current values."
              });
            }
          }}
          variant="secondary"
          className="gap-1"
          size="sm"
        >
          Run Calculations
        </Button>
      </div>

      <Tabs defaultValue="fair-parameters">
        <TabsList className="hidden">
          <TabsTrigger value="fair-parameters">FAIR Parameters</TabsTrigger>
        </TabsList>

        <TabsContent value="fair-parameters" className="space-y-6">
          {/* Risk Card - Top Level */}
          <div className="relative mb-8">
            <div
              className="bg-gradient-to-br from-red-400 to-rose-600 rounded-lg p-2 shadow-lg mb-2"
              style={{ maxWidth: "280px", margin: "0 auto" }}
            >
              <h3 className="text-white font-semibold text-xs mb-1">Risk</h3>

              {/* Calculated Value */}
              <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                <span>Formula:</span>
                <span className="px-1 py-0.5 bg-violet-500/50 rounded">
                  LEF
                </span>
                <span className="mx-1">×</span>
                <span className="px-1 py-0.5 bg-teal-500/50 rounded">LM</span>
              </div>
              {/* Min/Max Values - Server calculated only */}
              <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                <span>
                  Min: $
                  {formatNumberAbbreviated(
                    form.getValues().inherentRisk ? form.getValues().inherentRisk * 0.4 : 0,
                  )}
                </span>
                <span>
                  Avg: $
                  {formatNumberAbbreviated(
                    form.getValues().inherentRisk || 0,
                  )}
                </span>
                <span>
                  Max: $
                  {formatNumberAbbreviated(
                    form.getValues().inherentRisk ? form.getValues().inherentRisk * 2 : 0,
                  )}
                </span>
              </div>
            </div>

            {/* Arrow pointing to the connected components */}
            <div className="flex justify-center mb-1">
              <svg
                width="20"
                height="10"
                viewBox="0 0 40 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 20L0 0H40L20 20Z" fill="#F43F5E" />
              </svg>
            </div>
          </div>

          {/* Level 1 Components: Loss Event Frequency (LEF) and Loss Magnitude (LM) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full max-w-[1100px] mx-auto">
            {/* Loss Event Frequency (LEF) - Level 1 */}
            <div className="relative">
              <div
                className="bg-gradient-to-br from-purple-400 to-violet-600 rounded-lg p-2 shadow-lg mb-2"
                style={{ maxWidth: "280px", margin: "0 auto" }}
              >
                <h3 className="text-white font-semibold text-xs mb-1">
                  Loss Event Frequency (LEF)
                </h3>

                {/* Calculated Value */}
                <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                  <span>Formula:</span>
                  <span className="px-1 py-0.5 bg-blue-500/50 rounded">
                    TEF
                  </span>
                  <span className="mx-1">×</span>
                  <span className="px-1 py-0.5 bg-orange-500/50 rounded">
                    Vuln
                  </span>
                </div>

                {/* Min/Max Values */}
                <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                  <span>
                    Min:{" "}
                    {calculateLossEventFrequency(
                      form.getValues(),
                      "min",
                    ).toFixed(2)}
                  </span>
                  <span>
                    Avg:{" "}
                    {calculateLossEventFrequency(
                      form.getValues(),
                      "avg",
                    ).toFixed(2)}
                  </span>
                  <span>
                    Max:{" "}
                    {calculateLossEventFrequency(
                      form.getValues(),
                      "max",
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Arrow pointing to the connected components */}
              <div className="flex justify-center mb-1">
                <svg
                  width="20"
                  height="10"
                  viewBox="0 0 40 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 20L0 0H40L20 20Z" fill="#8B5CF6" />
                </svg>
              </div>

              {/* Level 2 Components: TEF and Vuln at same level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
                {/* 1. Threat Event Frequency Card - Level 2 */}
                <div className="relative">
                  <div
                    className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg p-2 shadow-lg mb-2"
                    style={{ maxWidth: "250px", margin: "0 auto" }}
                  >
                    <h3 className="text-white font-semibold text-xs mb-1">
                      Threat Event Frequency (TEF)
                    </h3>

                    {/* Calculated Value */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                      <span>Formula:</span>
                      <span className="px-1 py-0.5 bg-indigo-500/50 rounded">
                        CF
                      </span>
                      <span className="mx-1">×</span>
                      <span className="px-1 py-0.5 bg-pink-500/50 rounded">
                        POA
                      </span>
                    </div>

                    {/* Min/Avg/Max Values */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                      <span>
                        Min:{" "}
                        {calculateThreatEventFrequency(
                          form.getValues(),
                          "min",
                        ).toFixed(2)}
                      </span>
                      <span>
                        Avg:{" "}
                        {calculateThreatEventFrequency(
                          form.getValues(),
                          "avg",
                        ).toFixed(2)}
                      </span>
                      <span>
                        Max:{" "}
                        {calculateThreatEventFrequency(
                          form.getValues(),
                          "max",
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow pointing to the connected components */}
                  <div className="flex justify-center mb-1">
                    <svg
                      width="20"
                      height="10"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 20L0 0H40L20 20Z" fill="#4F46E5" />
                    </svg>
                  </div>

                  {/* Connected components - Contact Frequency and Probability of Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Contact Frequency */}
                    <div
                      className="bg-gradient-to-br from-indigo-400 to-blue-600 rounded-lg p-2 shadow-lg border border-indigo-300"
                      style={{ maxWidth: "240px", margin: "0 auto" }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Contact Frequency
                      </h3>
                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="contactFrequencyMin"
                        avgField="contactFrequencyAvg"
                        maxField="contactFrequencyMax"
                        confidenceField="contactFrequencyConfidence"
                        unit=""
                        min={0}
                        max={365}
                        step={0.1}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>

                    {/* Probability of Action */}
                    <div
                      className="bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg p-2 shadow-lg border border-pink-300"
                      style={{ maxWidth: "240px", margin: "0 auto" }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Probability of Action
                      </h3>
                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="probabilityOfActionMin"
                        avgField="probabilityOfActionAvg"
                        maxField="probabilityOfActionMax"
                        confidenceField="probabilityOfActionConfidence"
                        unit="%"
                        min={0}
                        max={1}
                        step={0.01}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Vulnerability Card - Level 2 */}
                <div className="relative">
                  <div
                    className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg p-2 shadow-lg mb-2"
                    style={{ maxWidth: "250px", margin: "0 auto" }}
                  >
                    <h3 className="text-white font-semibold text-xs mb-1">
                      Vulnerability (Vuln)
                    </h3>

                    {/* Calculated Value */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                      <span>Formula:</span>
                      <span className="px-1 py-0.5 bg-red-500/50 rounded">
                        TCap
                      </span>
                      <span className="mx-1">÷</span>
                      <span className="px-1 py-0.5 bg-green-500/50 rounded">
                        RS
                      </span>
                    </div>

                    {/* Min/Max Values */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                      <span>
                        Min:{" "}
                        {calculateSusceptibility(
                          form.getValues(),
                          "min",
                        ).toFixed(2)}
                      </span>
                      <span>
                        Avg:{" "}
                        {calculateSusceptibility(
                          form.getValues(),
                          "avg",
                        ).toFixed(2)}
                      </span>
                      <span>
                        Max:{" "}
                        {calculateSusceptibility(
                          form.getValues(),
                          "max",
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Arrow pointing to the connected components */}
                  <div className="flex justify-center mb-1">
                    <svg
                      width="20"
                      height="10"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 20L0 0H40L20 20Z" fill="#F59E0B" />
                    </svg>
                  </div>

                  {/* Connected components - Threat Capability and Resistance Strength */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Threat Capability */}
                    <div
                      className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-2 shadow-lg border border-red-300"
                      style={{ maxWidth: "200px", margin: "0 auto" }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Threat Capability
                      </h3>
                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="threatCapabilityMin"
                        avgField="threatCapabilityAvg"
                        maxField="threatCapabilityMax"
                        confidenceField="threatCapabilityConfidence"
                        unit="level"
                        min={0}
                        max={10}
                        step={0.1}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>

                    {/* Resistance Strength */}
                    <div
                      className="bg-gradient-to-br from-lime-400 to-green-600 rounded-lg p-2 shadow-lg border border-lime-300"
                      style={{ maxWidth: "200px", margin: "0 auto" }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Resistance Strength
                      </h3>
                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="resistanceStrengthMin"
                        avgField="resistanceStrengthAvg"
                        maxField="resistanceStrengthMax"
                        confidenceField="resistanceStrengthConfidence"
                        unit="level"
                        min={0}
                        max={10}
                        step={0.1}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loss Magnitude (LM) - Level 1 */}
            <div className="relative">
              <div
                className="bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg p-2 shadow-lg mb-2"
                style={{ maxWidth: "280px", margin: "0 auto" }}
              >
                <h3 className="text-white font-semibold text-xs mb-1">
                  Loss Magnitude (LM)
                </h3>

                {/* Calculated Value */}
                <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                  <span>Formula:</span>
                  <span className="px-1 py-0.5 bg-green-500/50 rounded">
                    PL
                  </span>
                  <span className="mx-1">+</span>
                  <span className="px-1 py-0.5 bg-purple-500/50 rounded">
                    SL
                  </span>
                </div>

                {/* Min/Max Values - Server calculated values only */}
                <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                  <span>
                    Min: $
                    {formatNumberAbbreviated(
                      form.getValues().lossMagnitudeMin || 0,
                    )}
                  </span>
                  <span>
                    Avg: $
                    {formatNumberAbbreviated(
                      form.getValues().lossMagnitudeAvg || 0,
                    )}
                  </span>
                  <span>
                    Max: $
                    {formatNumberAbbreviated(
                      form.getValues().lossMagnitudeMax || 0,
                    )}
                  </span>
                </div>
              </div>

              {/* Arrow pointing to the connected components */}
              <div className="flex justify-center mb-1">
                <svg
                  width="20"
                  height="10"
                  viewBox="0 0 40 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 20L0 0H40L20 20Z" fill="#14B8A6" />
                </svg>
              </div>

              {/* Level 2 Components: Primary Loss and Secondary Loss at same level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
                {/* Primary Loss - Level 2 */}
                <div className="relative">
                  <div
                    className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg p-2 shadow-lg mb-2"
                    style={{ maxWidth: "250px", margin: "0 auto" }}
                  >
                    <h3 className="text-white font-semibold text-xs mb-1">
                      Primary Loss (PL)
                    </h3>

                    {/* Calculated Value */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                      <span>Formula:</span>
                      <span className="font-bold">
                        $
                        {formatNumberAbbreviated(
                          form.getValues().primaryLossMagnitudeAvg || 0,
                        )}
                      </span>
                    </div>

                    {/* Min/Avg/Max Values */}
                    <div className="flex justify-between items-center text-white text-[10px] my-1">
                      <span>
                        Min: $
                        {formatNumberAbbreviated(
                          form.getValues().primaryLossMagnitudeMin || 0,
                        )}
                      </span>
                      <span>
                        Max: $
                        {formatNumberAbbreviated(
                          form.getValues().primaryLossMagnitudeMax || 0,
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Arrow pointing to the connected components */}
                  <div className="flex justify-center mb-1">
                    <svg
                      width="20"
                      height="10"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 20L0 0H40L20 20Z" fill="#10B981" />
                    </svg>
                  </div>

                  {/* Primary Loss Magnitude Component */}
                  <div
                    className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg p-2 shadow-lg border border-green-300"
                    style={{ maxWidth: "200px", margin: "0 auto" }}
                  >
                    <h3 className="text-white font-semibold text-xs mb-1">
                      Primary Loss Magnitude
                    </h3>
                    <TriangularFormField
                      form={form}
                      title=""
                      description=""
                      minField="primaryLossMagnitudeMin"
                      avgField="primaryLossMagnitudeAvg"
                      maxField="primaryLossMagnitudeMax"
                      confidenceField="primaryLossMagnitudeConfidence"
                      unit="$"
                      min={0}
                      max={1000000}
                      step={1000}
                      hideTitle={true}
                      darkMode={true}
                    />
                  </div>
                </div>

                {/* Secondary Loss - Level 2 */}
                <div className="relative">
                  <div
                    className="bg-gradient-to-br from-purple-400 to-fuchsia-600 rounded-lg p-2 shadow-lg mb-2"
                    style={{ maxWidth: "250px", margin: "0 auto" }}
                  >
                    <h3 className="text-white font-semibold text-xs mb-1">
                      Secondary Loss (SL)
                    </h3>

                    {/* Calculated Value */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center mb-1 text-xs">
                      <span>Formula:</span>
                      <span className="px-1 py-0.5 bg-fuchsia-500/50 rounded">
                        SLEF
                      </span>
                      <span className="mx-1">×</span>
                      <span className="px-1 py-0.5 bg-violet-500/50 rounded">
                        SLM
                      </span>
                    </div>

                    {/* Min/Max Values */}
                    <div className="bg-black/20 text-white p-1 rounded flex justify-between items-center text-white text-[10px] my-1">
                      <span>
                        Min: $
                        {formatNumberAbbreviated(
                          calculateSecondaryLoss(form.getValues(), "min"),
                        )}
                      </span>
                      <span>
                        Avg: $
                        {formatNumberAbbreviated(
                          calculateSecondaryLoss(form.getValues(), "avg"),
                        )}
                      </span>
                      <span>
                        Max: $
                        {formatNumberAbbreviated(
                          calculateSecondaryLoss(form.getValues(), "max"),
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Arrow pointing to the connected components */}
                  <div className="flex justify-center mb-1">
                    <svg
                      width="20"
                      height="10"
                      viewBox="0 0 40 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 20L0 0H40L20 20Z" fill="#A855F7" />
                    </svg>
                  </div>

                  {/* Connected components - Secondary Loss Event Frequency and Secondary Loss Magnitude */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {/* Secondary Loss Event Frequency */}
                    <div
                      className="bg-gradient-to-br from-fuchsia-400 to-purple-600 rounded-lg p-2 shadow-lg border border-fuchsia-300"
                      style={{
                        minWidth: "100px",
                        maxWidth: "200px",
                        margin: "0 auto",
                      }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Secondary Loss
                      </h3>
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Event Frequency
                      </h3>
                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="secondaryLossEventFrequencyMin"
                        avgField="secondaryLossEventFrequencyAvg"
                        maxField="secondaryLossEventFrequencyMax"
                        confidenceField="secondaryLossEventFrequencyConfidence"
                        unit="%"
                        min={0}
                        max={1}
                        step={0.01}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>

                    {/* Secondary Loss Magnitude */}
                    <div
                      className="bg-gradient-to-br from-violet-400 to-indigo-600 rounded-lg p-2 shadow-lg border border-violet-300"
                      style={{
                        minWidth: "130px",
                        maxWidth: "210px",
                        margin: "0 auto",
                      }}
                    >
                      <h3 className="text-white font-semibold text-xs mb-1">
                        Secondary Loss Magnitude
                      </h3>

                      <TriangularFormField
                        form={form}
                        title=""
                        description=""
                        minField="secondaryLossMagnitudeMin"
                        avgField="secondaryLossMagnitudeAvg"
                        maxField="secondaryLossMagnitudeMax"
                        confidenceField="secondaryLossMagnitudeConfidence"
                        unit="$"
                        min={0}
                        max={1000000000}
                        step={1000}
                        hideTitle={true}
                        darkMode={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
