import React, { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  calculatePrimaryLossFromAssets,
} from "@shared/utils/calculations";

// Confidence levels for risk parameters
const CONFIDENCE_LEVELS = ["low", "medium", "high"];

// Props for the risk form preview with editable controls
interface RiskFormPreviewEditableProps {
  form: UseFormReturn<any>;
  selectedAssets?: string[];
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
}: RiskFormPreviewEditableProps) {
  const riskId = form.watch("riskId");

  const { data: calculatedRiskData } = useQuery({
    queryKey: ["/api/risks", riskId, "calculate"],
    enabled: !!riskId,
    refetchInterval: 5000,
    queryFn: async () => {
      const res = await fetch(`/api/risks/${riskId}/calculate`);
      if (!res.ok) throw new Error("Failed to fetch risk calculation");
      const result = await res.json();
      return result.data;
    },
  });

  const inherentRisk =
    calculatedRiskData?.inherentRisk ?? Number(form.watch("inherentRisk") || 0);
  const residualRisk =
    calculatedRiskData?.residualRisk ??
    calculatedRiskData?.inherentRisk ??
    Number(form.watch("residualRisk") || 0);

  const { data: assetsResponse } = useQuery({
    queryKey: ["/api/assets"],
  });

  const allAssets = useMemo<Asset[]>(() => {
    if (assetsResponse?.data) {
      return assetsResponse.data as Asset[];
    }
    if (Array.isArray(assetsResponse)) {
      return assetsResponse as Asset[];
    }
    return [];
  }, [assetsResponse]);

  useEffect(() => {
    if (allAssets.length === 0) return;
    if (!window.__ASSET_CACHE__) {
      window.__ASSET_CACHE__ = {};
    }
    allAssets.forEach((asset) => {
      window.__ASSET_CACHE__![asset.assetId] = {
        id: asset.id,
        name: asset.name,
        assetValue: asset.assetValue,
        currency: asset.currency,
      };
    });
  }, [allAssets]);

  const selectedAssetObjects = useMemo(() => {
    if (!selectedAssets?.length) return [];
    return allAssets.filter((asset) =>
      selectedAssets.includes(asset.assetId),
    );
  }, [allAssets, selectedAssets]);

  useEffect(() => {
    if (selectedAssetObjects.length === 0) return;
    const severity = form.getValues("severity") || "medium";
    const impactFactor = {
      min: severity === "critical" ? 0.2 : severity === "high" ? 0.1 : 0.05,
      avg: severity === "critical" ? 0.5 : severity === "high" ? 0.3 : 0.15,
      max: severity === "critical" ? 0.8 : severity === "high" ? 0.6 : 0.3,
    };

    const primaryLossValues = calculatePrimaryLossFromAssets(
      selectedAssetObjects,
      impactFactor,
    );

    if (primaryLossValues.min > 0) {
      form.setValue("primaryLossMagnitudeMin", primaryLossValues.min, {
        shouldValidate: true,
      });
      form.setValue("primaryLossMagnitudeAvg", primaryLossValues.avg, {
        shouldValidate: true,
      });
      form.setValue("primaryLossMagnitudeMax", primaryLossValues.max, {
        shouldValidate: true,
      });
    }
  }, [selectedAssetObjects, form]);

  const watchNumber = (field: string) => {
    const value = form.watch(field as any);
    if (value === undefined || value === null || value === "") return 0;
    const numeric = typeof value === "string" ? Number(value) : value;
    return Number.isFinite(numeric) ? Number(numeric) : 0;
  };

  const formatRange = (
    min: number,
    avg: number,
    max: number,
    options: { unit?: string; currency?: boolean } = {},
  ) => {
    const formatValue = (val: number) => {
      if (options.currency) {
        return `$${formatNumberAbbreviated(val)}`;
      }
      const suffix = options.unit ? ` ${options.unit}` : "";
      return `${Number(val || 0).toFixed(2)}${suffix}`;
    };

    return `${formatValue(min)} • ${formatValue(avg)} • ${formatValue(max)}`;
  };

  const tefMin = watchNumber("threatEventFrequencyMin");
  const tefAvg = watchNumber("threatEventFrequencyAvg");
  const tefMax = watchNumber("threatEventFrequencyMax");
  const lossEventFrequencyMin = watchNumber("lossEventFrequencyMin");
  const lossEventFrequencyAvg = watchNumber("lossEventFrequencyAvg");
  const lossEventFrequencyMax = watchNumber("lossEventFrequencyMax");
  const susceptibilityMin = watchNumber("susceptibilityMin");
  const susceptibilityAvg = watchNumber("susceptibilityAvg");
  const susceptibilityMax = watchNumber("susceptibilityMax");
  const lossMagnitudeMin = watchNumber("lossMagnitudeMin");
  const lossMagnitudeAvg = watchNumber("lossMagnitudeAvg");
  const lossMagnitudeMax = watchNumber("lossMagnitudeMax");

  const assetCount = selectedAssetObjects.length;
  const totalAssetValue = selectedAssetObjects.reduce((sum, asset) => {
    const value = Number(asset.assetValue) || 0;
    return sum + value;
  }, 0);

  const calculatedSummaries = [
    {
      title: "Loss Event Frequency",
      subtitle: "TEF × Vulnerability",
      range: formatRange(
        lossEventFrequencyMin,
        lossEventFrequencyAvg,
        lossEventFrequencyMax,
        { unit: "events/yr" },
      ),
    },
    {
      title: "Susceptibility",
      subtitle: "Threat Capability ÷ Resistance Strength",
      range: formatRange(
        susceptibilityMin,
        susceptibilityAvg,
        susceptibilityMax,
      ),
    },
    {
      title: "Loss Magnitude",
      subtitle: "Primary + Secondary Loss",
      range: formatRange(
        lossMagnitudeMin,
        lossMagnitudeAvg,
        lossMagnitudeMax,
        { currency: true },
      ),
    },
  ];

  const parameterSections = [
    {
      key: "tef",
      title: "Threat Event Frequency",
      badge: "Driver inputs",
      description:
        "Model how often an adversary comes into contact with the scenario and how likely they are to act.",
      formula: "TEF = Contact Frequency × Probability of Action",
      range: formatRange(tefMin, tefAvg, tefMax, { unit: "events/yr" }),
      columns: 2,
      fields: [
        {
          label: "Contact Frequency",
          helper: "Annualized number of engagement attempts",
          minField: "contactFrequencyMin",
          avgField: "contactFrequencyAvg",
          maxField: "contactFrequencyMax",
          confidenceField: "contactFrequencyConfidence",
          min: 0,
          max: 365,
          step: 0.1,
          unit: "per yr",
        },
        {
          label: "Probability of Action",
          helper: "Likelihood an adversary follows through",
          minField: "probabilityOfActionMin",
          avgField: "probabilityOfActionAvg",
          maxField: "probabilityOfActionMax",
          confidenceField: "probabilityOfActionConfidence",
          min: 0,
          max: 1,
          step: 0.01,
          unit: "%",
        },
      ],
    },
    {
      key: "vulnerability",
      title: "Vulnerability Profile",
      badge: "Defensive balance",
      description:
        "Compare adversary capability to the strength of your controls to derive susceptibility.",
      formula: "Vulnerability = Threat Capability ÷ Resistance Strength",
      range: formatRange(susceptibilityMin, susceptibilityAvg, susceptibilityMax),
      columns: 2,
      fields: [
        {
          label: "Threat Capability",
          helper: "Skill and resources of the attacker",
          minField: "threatCapabilityMin",
          avgField: "threatCapabilityAvg",
          maxField: "threatCapabilityMax",
          confidenceField: "threatCapabilityConfidence",
          min: 0,
          max: 10,
          step: 0.1,
          unit: "level",
        },
        {
          label: "Resistance Strength",
          helper: "Effectiveness of current controls",
          minField: "resistanceStrengthMin",
          avgField: "resistanceStrengthAvg",
          maxField: "resistanceStrengthMax",
          confidenceField: "resistanceStrengthConfidence",
          min: 0,
          max: 10,
          step: 0.1,
          unit: "level",
        },
      ],
    },
    {
      key: "loss-magnitude",
      title: "Loss Magnitude Inputs",
      badge: "Impact modeling",
      description:
        "Blend primary and secondary losses. Link assets to auto-populate primary loss magnitude.",
      formula: "Loss Magnitude = Primary + Secondary Loss",
      range: formatRange(
        lossMagnitudeMin,
        lossMagnitudeAvg,
        lossMagnitudeMax,
        { currency: true },
      ),
      columns: 3,
      fields: [
        {
          label: "Primary Loss Magnitude",
          helper: assetCount
            ? `Derived from ${assetCount} assets (${formatCurrency(totalAssetValue)})`
            : "Select assets to auto-derive primary loss values.",
          minField: "primaryLossMagnitudeMin",
          avgField: "primaryLossMagnitudeAvg",
          maxField: "primaryLossMagnitudeMax",
          confidenceField: "primaryLossMagnitudeConfidence",
          min: 0,
          max: 1000000000,
          step: 1000,
          unit: "$",
        },
        {
          label: "Secondary Loss Event Frequency",
          helper: "Probability of downstream losses (legal, PR, etc.)",
          minField: "secondaryLossEventFrequencyMin",
          avgField: "secondaryLossEventFrequencyAvg",
          maxField: "secondaryLossEventFrequencyMax",
          confidenceField: "secondaryLossEventFrequencyConfidence",
          min: 0,
          max: 1,
          step: 0.01,
          unit: "%",
        },
        {
          label: "Secondary Loss Magnitude",
          helper: "Financial impact of secondary effects",
          minField: "secondaryLossMagnitudeMin",
          avgField: "secondaryLossMagnitudeAvg",
          maxField: "secondaryLossMagnitudeMax",
          confidenceField: "secondaryLossMagnitudeConfidence",
          min: 0,
          max: 1000000000,
          step: 1000,
          unit: "$",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-3">
        {calculatedSummaries.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-inner shadow-white/5 backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">
                  {card.title}
                </p>
                <p className="text-xs text-white/60">{card.subtitle}</p>
              </div>
              <Badge
                variant="outline"
                className="border-white/20 bg-transparent text-[11px] uppercase tracking-widest text-white/70"
              >
                Calculated
              </Badge>
            </div>
            <p className="mt-4 text-base text-white/70">{card.range}</p>
          </div>
        ))}
      </div>

      {parameterSections.map((section) => {
        const columnClass =
          section.columns === 3
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2";
        return (
          <div key={section.key} className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">
                  {section.badge}
                </p>
                <h4 className="text-2xl font-semibold text-white">
                  {section.title}
                </h4>
                <p className="max-w-3xl text-sm text-white/60">
                  {section.description}
                </p>
              </div>
              <div className="text-right">
                <Badge
                  variant="outline"
                  className="border-white/20 bg-white/5 text-xs text-white/80"
                >
                  {section.formula}
                </Badge>
                <p className="mt-3 text-sm text-white/60">Range {section.range}</p>
              </div>
            </div>

            <div className={`grid gap-4 ${columnClass}`}>
              {section.fields.map((field) => (
                <div
                  key={`${section.key}-${field.minField}`}
                  className="rounded-3xl border border-white/10 bg-[#0f1729]/80 p-5 shadow-[0_20px_60px_rgba(5,10,30,0.35)] backdrop-blur"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {field.label}
                      </p>
                      {field.helper && (
                        <p className="text-xs text-white/60">{field.helper}</p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] text-white/70"
                    >
                      Input
                    </Badge>
                  </div>
                  <TriangularFormField
                    form={form}
                    title=""
                    description=""
                    minField={field.minField}
                    avgField={field.avgField}
                    maxField={field.maxField}
                    confidenceField={field.confidenceField}
                    unit={field.unit}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    hideTitle
                    darkMode
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>Inherent risk: {formatCurrency(inherentRisk)}</span>
          <span>Residual risk: {formatCurrency(residualRisk)}</span>
        </div>
      </div>
    </div>
  );
}
