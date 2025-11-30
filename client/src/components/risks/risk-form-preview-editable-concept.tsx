import React, { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
    description?: string;
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
    compact?: boolean;
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
    compact = false,
}: TriangularFormFieldProps) {
    const textColor = darkMode ? "text-white" : "text-slate-800";
    const labelColor = darkMode ? "text-slate-400" : "text-slate-600";
    const inputBgColor = darkMode ? "bg-slate-900/50" : "bg-white";
    const borderColor = darkMode ? "border-white/10" : "border-slate-200";

    const isMoneyField = minField.includes("LossMagnitude") || unit === "$";

    const formatMoneyValue = (value: number): string => {
        return isMoneyField ? formatNumberAbbreviated(value) : String(value);
    };

    const noSpinnerClass = "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

    // ... (Keep existing change handlers: handleMinChange, handleAvgChange, handleMaxChange)
    // Handle min field changes with validation - Fixed for decimal input
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        if (val === '' || val === '.') { field.onChange(val); return; }
        const decimalCount = (val.match(/\./g) || []).length;
        if (decimalCount > 1) return;
        const numVal = parseFloat(val);
        if (!isNaN(numVal) && !val.endsWith('.')) {
            if (numVal < min) { field.onChange(min); return; }
            const maxValue = form.getValues(maxField);
            if (maxValue !== undefined && maxValue !== '' && parseFloat(maxValue) > 0 && numVal > parseFloat(maxValue)) {
                field.onChange(parseFloat(maxValue));
                return;
            }
            field.onChange(numVal);
            return;
        }
        field.onChange(val);
    };

    const handleAvgChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        if (val === '' || val === '.') { field.onChange(val); return; }
        const decimalCount = (val.match(/\./g) || []).length;
        if (decimalCount > 1) return;
        const numVal = parseFloat(val);
        if (!isNaN(numVal) && !val.endsWith('.')) {
            const minValueRaw = form.getValues(minField);
            const maxValueRaw = form.getValues(maxField);
            const minValue = Number(minValueRaw);
            const maxValue = Number(maxValueRaw);
            if (!Number.isNaN(minValue) && numVal < minValue) { field.onChange(minValue); return; }
            if (!Number.isNaN(maxValue) && maxValueRaw !== '' && numVal > maxValue) { field.onChange(maxValue); return; }
            field.onChange(numVal);
            return;
        }
        field.onChange(val);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        if (val === '' || val === '.') { field.onChange(val); return; }
        const decimalCount = (val.match(/\./g) || []).length;
        if (decimalCount > 1) return;
        const numVal = parseFloat(val);
        if (!isNaN(numVal) && !val.endsWith('.')) {
            if (max !== undefined && numVal > max) { field.onChange(max); return; }
            const minValueRaw = form.getValues(minField);
            const minValue = Number(minValueRaw);
            if (!Number.isNaN(minValue) && numVal < minValue) { field.onChange(minValue); return; }
            field.onChange(numVal);
            return;
        }
        field.onChange(val);
    };

    const renderInput = (name: string, label: string, handler: any) => (
        <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-2 space-y-0">
                    <FormLabel className={`text-[10px] font-medium ${labelColor} min-w-[60px]`}>{label}</FormLabel>
                    <FormControl>
                        <div className="relative w-16">
                            <Input
                                {...field}
                                type="text"
                                inputMode="numeric"
                                className={`h-6 text-right text-[10px] ${inputBgColor} ${textColor} ${borderColor} px-1 ${noSpinnerClass} rounded-sm`}
                                onChange={(e) => handler(e, field)}
                            />
                        </div>
                    </FormControl>
                </FormItem>
            )}
        />
    );

    return (
        <div className="space-y-3">
            {!hideTitle && (
                <div className="mb-2 text-center">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${textColor}`}>{title}</h3>
                    {description && <p className={`text-[10px] ${labelColor}`}>{description}</p>}
                </div>
            )}

            <div className="flex flex-col gap-2 px-2">
                {renderInput(minField, "Min", handleMinChange)}
                {renderInput(avgField, "Most Likely", handleAvgChange)}
                {renderInput(maxField, "Max", handleMaxChange)}
            </div>

            <div className="flex items-center justify-between pt-2 px-1">
                <FormField
                    control={form.control}
                    name={confidenceField}
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel className={`text-[10px] ${labelColor}`}>Conf.</FormLabel>
                            <Select value={field.value || "medium"} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className={`h-6 w-[80px] text-[10px] ${inputBgColor} ${textColor} ${borderColor} rounded-md`}>
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CONFIDENCE_LEVELS.map((level) => (
                                        <SelectItem key={level} value={level} className="text-xs">
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />
                {unit && <span className={`text-[10px] ${labelColor} opacity-70`}>{unit}</span>}
            </div>
        </div>
    );
}

// Helper component for Tree Nodes
const TreeNode = ({
    title,
    subtitle,
    children,
    type = "calculated", // calculated | input
    valueRange,
    className = ""
}: {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    type?: "calculated" | "input";
    valueRange?: string;
    className?: string;
}) => {
    const isInput = type === "input";
    const bgColor = isInput ? "bg-[#0f1729]/80" : "bg-slate-900/40";
    const borderColor = isInput ? "border-emerald-500/20" : "border-blue-500/20";
    const titleColor = isInput ? "text-emerald-100" : "text-blue-100";

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div className={`
        relative z-10 w-full max-w-[280px] rounded-xl border ${borderColor} ${bgColor} 
        p-3 shadow-lg backdrop-blur-sm transition-all hover:border-opacity-50
      `}>
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${titleColor}`}>{title}</h4>
                        {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
                    </div>
                    {valueRange && (
                        <Badge variant="outline" className="bg-black/20 text-[10px] border-white/10">
                            {valueRange}
                        </Badge>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
};

// Connector Lines
const VerticalLine = ({ height = "h-8" }) => (
    <div className={`w-px ${height} bg-slate-700/50`}></div>
);

const HorizontalBranch = ({ width = "w-full" }) => (
    <div className="flex w-full justify-center">
        <div className={`h-px ${width} bg-slate-700/50 relative top-0`}>
            <div className="absolute left-0 top-0 h-2 w-px bg-slate-700/50 -translate-y-full"></div>
            <div className="absolute right-0 top-0 h-2 w-px bg-slate-700/50 -translate-y-full"></div>
            <div className="absolute left-1/2 top-0 h-4 w-px bg-slate-700/50 -translate-x-1/2"></div>
        </div>
    </div>
);

export function RiskFormPreviewEditableConcept({
    form,
    selectedAssets = [],
}: RiskFormPreviewEditableProps) {
    // ... (Keep existing data fetching and calculation logic)
    const riskId = form.watch("riskId");
    const { data: calculatedRiskData } = useQuery<{ data: { inherentRisk?: number; residualRisk?: number } }>({
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

    const calcValues = calculatedRiskData?.data;
    const inherentRisk = calcValues?.inherentRisk ?? Number(form.watch("inherentRisk") || 0);
    const residualRisk = calcValues?.residualRisk ?? calcValues?.inherentRisk ?? Number(form.watch("residualRisk") || 0);

    const { data: assetsResponse } = useQuery<{ data: Asset[] }>({ queryKey: ["/api/assets"] });
    const allAssets = useMemo<Asset[]>(() => {
        if (assetsResponse?.data) return assetsResponse.data as Asset[];
        if (Array.isArray(assetsResponse)) return assetsResponse as Asset[];
        return [];
    }, [assetsResponse]);

    useEffect(() => {
        if (allAssets.length === 0) return;
        if (!window.__ASSET_CACHE__) window.__ASSET_CACHE__ = {};
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
        return allAssets.filter((asset) => selectedAssets.includes(asset.assetId));
    }, [allAssets, selectedAssets]);

    useEffect(() => {
        if (selectedAssetObjects.length === 0) return;
        const severity = form.getValues("severity") || "medium";
        const impactFactor = {
            min: severity === "critical" ? 0.2 : severity === "high" ? 0.1 : 0.05,
            avg: severity === "critical" ? 0.5 : severity === "high" ? 0.3 : 0.15,
            max: severity === "critical" ? 0.8 : severity === "high" ? 0.6 : 0.3,
        };
        const primaryLossValues = calculatePrimaryLossFromAssets(selectedAssetObjects, impactFactor);
        if (primaryLossValues.min > 0) {
            form.setValue("primaryLossMagnitudeMin", primaryLossValues.min, { shouldValidate: true });
            form.setValue("primaryLossMagnitudeAvg", primaryLossValues.avg, { shouldValidate: true });
            form.setValue("primaryLossMagnitudeMax", primaryLossValues.max, { shouldValidate: true });
        }
    }, [selectedAssetObjects, form]);

    const watchNumber = (field: string) => {
        const value = form.watch(field as any);
        if (value === undefined || value === null || value === "") return 0;
        const numeric = typeof value === "string" ? Number(value) : value;
        return Number.isFinite(numeric) ? Number(numeric) : 0;
    };

    const formatRange = (min: number, avg: number, max: number, options: { unit?: string; currency?: boolean } = {}) => {
        const formatValue = (val: number) => {
            if (options.currency) return `$${formatNumberAbbreviated(val)}`;
            const suffix = options.unit ? ` ${options.unit}` : "";
            return `${Number(val || 0).toFixed(2)}${suffix}`;
        };
        return `${formatValue(min)} - ${formatValue(max)}`;
    };

    // Watch values
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

    return (
        <div className="w-full overflow-x-auto pb-4">
            {/* Compact container without scaling */}
            <div className="min-w-fit flex flex-col items-center space-y-2 p-2">

                {/* Level 1: Risk Summary */}
                <div className="flex flex-col items-center">
                    <div className="rounded-lg border border-white/10 bg-gradient-to-b from-slate-800 to-slate-900 p-2 shadow-xl w-[260px] text-center">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-white mb-1">Risk (Loss Expectancy)</h3>
                        <div className="flex justify-center gap-4">
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase">Inherent</p>
                                <p className="text-base font-bold text-white">{formatCurrency(inherentRisk)}</p>
                            </div>
                            <div className="w-px bg-white/10"></div>
                            <div>
                                <p className="text-[9px] text-slate-400 uppercase">Residual</p>
                                <p className="text-base font-bold text-emerald-400">{formatCurrency(residualRisk)}</p>
                            </div>
                        </div>
                    </div>
                    <VerticalLine height="h-3" />
                </div>

                {/* Branching to LEF and LM */}
                <div className="relative w-[60%] flex justify-between px-[5%]">
                    {/* Connector Lines */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-2 border-t border-l border-r border-slate-700/50 rounded-t-lg"></div>
                </div>

                {/* Level 2: LEF and LM */}
                <div className="grid grid-cols-2 gap-16 w-full max-w-5xl">

                    {/* LEFT BRANCH: Loss Event Frequency */}
                    <div className="flex flex-col items-center">
                        <TreeNode
                            title="Loss Event Freq"
                            subtitle="TEF × Vuln"
                            valueRange={formatRange(lossEventFrequencyMin, lossEventFrequencyAvg, lossEventFrequencyMax, { unit: "evt/yr" })}
                            className="w-[200px]"
                        />
                        <VerticalLine height="h-3" />

                        {/* Branching to TEF and Susceptibility */}
                        <div className="relative w-full flex justify-center gap-2">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-2 border-t border-l border-r border-slate-700/50 rounded-t-lg"></div>

                            {/* TEF Node */}
                            <div className="flex flex-col items-center pt-2">
                                <TreeNode
                                    title="Threat Event Freq"
                                    subtitle="Contact × Action"
                                    valueRange={formatRange(tefMin, tefAvg, tefMax, { unit: "evt/yr" })}
                                    className="w-[180px]"
                                />
                                <VerticalLine height="h-2" />
                                <div className="flex gap-1">
                                    <TreeNode title="Contact Freq" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="Contact Freq"
                                            minField="contactFrequencyMin"
                                            avgField="contactFrequencyAvg"
                                            maxField="contactFrequencyMax"
                                            confidenceField="contactFrequencyConfidence"
                                            unit="/yr"
                                            min={0} max={365} step={0.1}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                    <TreeNode title="Prob of Action" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="Prob Action"
                                            minField="probabilityOfActionMin"
                                            avgField="probabilityOfActionAvg"
                                            maxField="probabilityOfActionMax"
                                            confidenceField="probabilityOfActionConfidence"
                                            unit="%"
                                            min={0} max={1} step={0.01}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                </div>
                            </div>

                            {/* Susceptibility Node */}
                            <div className="flex flex-col items-center pt-2">
                                <TreeNode
                                    title="Susceptibility"
                                    subtitle="Cap ÷ Resist"
                                    valueRange={formatRange(susceptibilityMin, susceptibilityAvg, susceptibilityMax)}
                                    className="w-[180px]"
                                />
                                <VerticalLine height="h-2" />
                                <div className="flex gap-1">
                                    <TreeNode title="Threat Cap" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="Threat Cap"
                                            minField="threatCapabilityMin"
                                            avgField="threatCapabilityAvg"
                                            maxField="threatCapabilityMax"
                                            confidenceField="threatCapabilityConfidence"
                                            unit="lvl"
                                            min={0} max={10} step={0.1}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                    <TreeNode title="Resistance" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="Resistance"
                                            minField="resistanceStrengthMin"
                                            avgField="resistanceStrengthAvg"
                                            maxField="resistanceStrengthMax"
                                            confidenceField="resistanceStrengthConfidence"
                                            unit="lvl"
                                            min={0} max={10} step={0.1}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT BRANCH: Loss Magnitude */}
                    <div className="flex flex-col items-center">
                        <TreeNode
                            title="Loss Magnitude"
                            subtitle="Pri + Sec"
                            valueRange={formatRange(lossMagnitudeMin, lossMagnitudeAvg, lossMagnitudeMax, { currency: true })}
                            className="w-[200px]"
                        />
                        <VerticalLine height="h-3" />

                        {/* Branching to Primary and Secondary Loss */}
                        <div className="relative w-full flex justify-center gap-2">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-2 border-t border-l border-r border-slate-700/50 rounded-t-lg"></div>

                            {/* Primary Loss Node */}
                            <div className="flex flex-col items-center pt-2">
                                {/* Spacer to align with Level 3 nodes (TEF, Susc, Sec Loss) */}
                                <div className="h-[60px] w-px bg-slate-700/50 mb-2"></div>
                                <TreeNode
                                    title="Primary Loss"
                                    subtitle="Asset × Impact"
                                    type="input"
                                    className="w-[160px]"
                                >
                                    <TriangularFormField
                                        form={form}
                                        title="Primary Loss"
                                        minField="primaryLossMagnitudeMin"
                                        avgField="primaryLossMagnitudeAvg"
                                        maxField="primaryLossMagnitudeMax"
                                        confidenceField="primaryLossMagnitudeConfidence"
                                        unit="$"
                                        min={0} max={1000000000} step={1000}
                                        hideTitle compact darkMode
                                    />
                                </TreeNode>
                            </div>

                            {/* Secondary Loss Node */}
                            <div className="flex flex-col items-center pt-2">
                                <TreeNode
                                    title="Secondary Loss"
                                    subtitle="SLEF × SLM"
                                    type="calculated"
                                    className="w-[180px]"
                                />
                                <VerticalLine height="h-2" />
                                <div className="flex gap-1">
                                    <TreeNode title="Sec Loss Freq" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="SLEF"
                                            minField="secondaryLossEventFrequencyMin"
                                            avgField="secondaryLossEventFrequencyAvg"
                                            maxField="secondaryLossEventFrequencyMax"
                                            confidenceField="secondaryLossEventFrequencyConfidence"
                                            unit="%"
                                            min={0} max={1} step={0.01}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                    <TreeNode title="Sec Loss Mag" type="input" className="mt-1 w-[140px]">
                                        <TriangularFormField
                                            form={form}
                                            title="SLM"
                                            minField="secondaryLossMagnitudeMin"
                                            avgField="secondaryLossMagnitudeAvg"
                                            maxField="secondaryLossMagnitudeMax"
                                            confidenceField="secondaryLossMagnitudeConfidence"
                                            unit="$"
                                            min={0} max={1000000000} step={1000}
                                            hideTitle compact darkMode
                                        />
                                    </TreeNode>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
