import {
  React,
  useState,
  useEffect,
  useForm,
  zodResolver,
  z,
  useMutation,
  useQueryClient,
} from "@/common/react-import";
import { Risk, insertRiskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MonteCarloInput } from "@shared/models/riskParams";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { BasicRiskInfo } from "./form-sections";
import { AssetSelection } from "./form-sections/AssetSelection";

import { RiskFormPreviewEditable } from "./risk-form-preview-editable";
import { calculateRiskFromForm } from "./risk-utils";
import {
  formatCurrency,
  calculateSusceptibility,
  calculateThreatEventFrequency,
  calculateLossEventFrequency,
  calculateLossMagnitude,
  inherentRisk,
} from "@shared/utils/calculations";

// Default FAIR-U parameter values for new risks
const DEFAULT_FAIR_VALUES = {
  // Contact Frequency (CF)
  contactFrequencyMin: 0,
  contactFrequencyAvg: 0,
  contactFrequencyMax: 0,
  contactFrequencyConfidence: "medium" as ConfidenceLevel,

  // Probability of Action (POA)
  probabilityOfActionMin: 0,
  probabilityOfActionAvg: 0,
  probabilityOfActionMax: 0,
  probabilityOfActionConfidence: "medium" as ConfidenceLevel,

  // Threat Capability (TCap)
  threatCapabilityMin: 0,
  threatCapabilityAvg: 0,
  threatCapabilityMax: 0,
  threatCapabilityConfidence: "medium" as ConfidenceLevel,

  // Resistance Strength (RS)
  resistanceStrengthMin: 0,
  resistanceStrengthAvg: 0,
  resistanceStrengthMax: 0,
  resistanceStrengthConfidence: "medium" as ConfidenceLevel,

  // Primary Loss Magnitude (PL)
  primaryLossMagnitudeMin: 0,
  primaryLossMagnitudeAvg: 0,
  primaryLossMagnitudeMax: 0,
  primaryLossMagnitudeConfidence: "medium" as ConfidenceLevel,

  // Secondary Loss Event Frequency (SLEF)
  secondaryLossEventFrequencyMin: 0,
  secondaryLossEventFrequencyAvg: 0,
  secondaryLossEventFrequencyMax: 0,
  secondaryLossEventFrequencyConfidence: "medium" as ConfidenceLevel,

  // Secondary Loss Magnitude (SLM)
  secondaryLossMagnitudeMin: 0,
  secondaryLossMagnitudeAvg: 0,
  secondaryLossMagnitudeMax: 0,
  secondaryLossMagnitudeConfidence: "medium" as ConfidenceLevel,
};

// Zero values for calculated FAIR-U parameters when no assets are associated
const ZERO_CALCULATED_VALUES = {
  // Threat Event Frequency (TEF) - Calculated
  threatEventFrequencyMin: 0,
  threatEventFrequencyAvg: 0,
  threatEventFrequencyMax: 0,
  threatEventFrequencyConfidence: "medium" as ConfidenceLevel,

  // Susceptibility - Calculated
  susceptibilityMin: 0,
  susceptibilityAvg: 0,
  susceptibilityMax: 0,
  susceptibilityConfidence: "medium" as ConfidenceLevel,

  // Loss Event Frequency (LEF) - Calculated
  lossEventFrequencyMin: 0,
  lossEventFrequencyAvg: 0,
  lossEventFrequencyMax: 0,
  lossEventFrequencyConfidence: "medium" as ConfidenceLevel,

  // Loss Magnitude (LM) - Calculated
  lossMagnitudeMin: 0,
  lossMagnitudeAvg: 0,
  lossMagnitudeMax: 0,
  lossMagnitudeConfidence: "medium" as ConfidenceLevel,

  // Risk values
  inherentRisk: 0,
  residualRisk: 0,
};

// Helper function to create risk update data from form values
/**
 * Creates a standardized risk update object from form values
 * @param values Form values to transform into update data
 * @param associatedAssets Array of asset IDs to associate with risk
 * @returns Update data object ready for API submission
 */
const createRiskUpdateData = (values: any, associatedAssets: string[]) => {
  // Helper function to safely convert to string - avoiding NaN values
  const safeToString = (value: any): string => {
    if (value === undefined || value === null) return "0";
    const num = Number(value);
    return isNaN(num) ? "0" : String(num);
  };

  // Helper function to normalize confidence values to lowercase
  const normalizeConfidence = (value: any): string => {
    if (!value) return "medium";
    const lowercaseValue = String(value).toLowerCase();
    return ["low", "medium", "high"].includes(lowercaseValue) 
      ? lowercaseValue 
      : "medium";
  };

  // Starting with basic risk information
  const updateData = {
    name: values.name,
    description: values.description || "",
    riskCategory: values.riskCategory,
    severity: values.severity,
    associatedAssets: associatedAssets,

    // Contact Frequency
    contactFrequencyMin: safeToString(values.contactFrequencyMin),
    contactFrequencyAvg: safeToString(values.contactFrequencyAvg),
    contactFrequencyMax: safeToString(values.contactFrequencyMax),
    contactFrequencyConfidence: normalizeConfidence(values.contactFrequencyConfidence),

    // Probability of Action
    probabilityOfActionMin: safeToString(values.probabilityOfActionMin),
    probabilityOfActionAvg: safeToString(values.probabilityOfActionAvg),
    probabilityOfActionMax: safeToString(values.probabilityOfActionMax),
    probabilityOfActionConfidence: normalizeConfidence(values.probabilityOfActionConfidence),

    // Threat Capability
    threatCapabilityMin: safeToString(values.threatCapabilityMin),
    threatCapabilityAvg: safeToString(values.threatCapabilityAvg),
    threatCapabilityMax: safeToString(values.threatCapabilityMax),
    threatCapabilityConfidence: normalizeConfidence(values.threatCapabilityConfidence),

    // Resistance Strength
    resistanceStrengthMin: safeToString(values.resistanceStrengthMin),
    resistanceStrengthAvg: safeToString(values.resistanceStrengthAvg),
    resistanceStrengthMax: safeToString(values.resistanceStrengthMax),
    resistanceStrengthConfidence: normalizeConfidence(values.resistanceStrengthConfidence),

    // Primary Loss Magnitude
    primaryLossMagnitudeMin: safeToString(values.primaryLossMagnitudeMin),
    primaryLossMagnitudeAvg: safeToString(values.primaryLossMagnitudeAvg),
    primaryLossMagnitudeMax: safeToString(values.primaryLossMagnitudeMax),
    primaryLossMagnitudeConfidence: normalizeConfidence(values.primaryLossMagnitudeConfidence),

    // Secondary Loss Event Frequency
    secondaryLossEventFrequencyMin: safeToString(values.secondaryLossEventFrequencyMin),
    secondaryLossEventFrequencyAvg: safeToString(values.secondaryLossEventFrequencyAvg),
    secondaryLossEventFrequencyMax: safeToString(values.secondaryLossEventFrequencyMax),
    secondaryLossEventFrequencyConfidence: normalizeConfidence(values.secondaryLossEventFrequencyConfidence),

    // Secondary Loss Magnitude
    secondaryLossMagnitudeMin: safeToString(values.secondaryLossMagnitudeMin),
    secondaryLossMagnitudeAvg: safeToString(values.secondaryLossMagnitudeAvg),
    secondaryLossMagnitudeMax: safeToString(values.secondaryLossMagnitudeMax),
    secondaryLossMagnitudeConfidence: normalizeConfidence(values.secondaryLossMagnitudeConfidence),

    // Threat Event Frequency (calculated fields)
    threatEventFrequencyMin: safeToString(values.threatEventFrequencyMin),
    threatEventFrequencyAvg: safeToString(values.threatEventFrequencyAvg),
    threatEventFrequencyMax: safeToString(values.threatEventFrequencyMax),
    threatEventFrequencyConfidence: normalizeConfidence(values.threatEventFrequencyConfidence),

    // Susceptibility (calculated fields)
    susceptibilityMin: safeToString(values.susceptibilityMin),
    susceptibilityAvg: safeToString(values.susceptibilityAvg),
    susceptibilityMax: safeToString(values.susceptibilityMax),
    susceptibilityConfidence: normalizeConfidence(values.susceptibilityConfidence),

    // Loss Event Frequency (calculated fields)
    lossEventFrequencyMin: safeToString(values.lossEventFrequencyMin),
    lossEventFrequencyAvg: safeToString(values.lossEventFrequencyAvg),
    lossEventFrequencyMax: safeToString(values.lossEventFrequencyMax),
    lossEventFrequencyConfidence: normalizeConfidence(values.lossEventFrequencyConfidence),

    // Loss Magnitude (calculated fields)
    lossMagnitudeMin: safeToString(values.lossMagnitudeMin),
    lossMagnitudeAvg: safeToString(values.lossMagnitudeAvg),
    lossMagnitudeMax: safeToString(values.lossMagnitudeMax),
    lossMagnitudeConfidence: normalizeConfidence(values.lossMagnitudeConfidence),

    // Add calculated risk values - stored as strings in the database
    inherentRisk: safeToString(values.inherentRisk),
    residualRisk: safeToString(values.residualRisk),
  };

  return updateData;
};

/**
 * Helper function to create a risk-like object from form values
 * that can be used with the shared calculation utilities.
 *
 * @param formValues The form values to convert
 * @returns An object that works with shared calculation utilities
 */
const createRiskObjectFromFormValues = (formValues: any) => {
  // Convert all relevant values to numbers to ensure calculation accuracy
  return {
    contactFrequencyMin: Number(formValues.contactFrequencyMin || 0),
    contactFrequencyAvg: Number(formValues.contactFrequencyAvg || 0),
    contactFrequencyMax: Number(formValues.contactFrequencyMax || 0),

    probabilityOfActionMin: Number(formValues.probabilityOfActionMin || 0),
    probabilityOfActionAvg: Number(formValues.probabilityOfActionAvg || 0),
    probabilityOfActionMax: Number(formValues.probabilityOfActionMax || 0),

    threatCapabilityMin: Number(formValues.threatCapabilityMin || 0),
    threatCapabilityAvg: Number(formValues.threatCapabilityAvg || 0),
    threatCapabilityMax: Number(formValues.threatCapabilityMax || 0),

    resistanceStrengthMin: Number(formValues.resistanceStrengthMin || 0),
    resistanceStrengthAvg: Number(formValues.resistanceStrengthAvg || 0),
    resistanceStrengthMax: Number(formValues.resistanceStrengthMax || 0),

    primaryLossMagnitudeMin: Number(formValues.primaryLossMagnitudeMin || 0),
    primaryLossMagnitudeAvg: Number(formValues.primaryLossMagnitudeAvg || 0),
    primaryLossMagnitudeMax: Number(formValues.primaryLossMagnitudeMax || 0),

    secondaryLossEventFrequencyMin: Number(
      formValues.secondaryLossEventFrequencyMin || 0.1,
    ),
    secondaryLossEventFrequencyAvg: Number(
      formValues.secondaryLossEventFrequencyAvg || 0.3,
    ),
    secondaryLossEventFrequencyMax: Number(
      formValues.secondaryLossEventFrequencyMax || 0.5,
    ),

    secondaryLossMagnitudeMin: Number(
      formValues.secondaryLossMagnitudeMin || 5000,
    ),
    secondaryLossMagnitudeAvg: Number(
      formValues.secondaryLossMagnitudeAvg || 25000,
    ),
    secondaryLossMagnitudeMax: Number(
      formValues.secondaryLossMagnitudeMax || 50000,
    ),

    // Include calculated values for completeness
    threatEventFrequency: Number(formValues.threatEventFrequency || 0),
    threatEventFrequencyMin: Number(formValues.threatEventFrequencyMin || 0),
    threatEventFrequencyAvg: Number(formValues.threatEventFrequencyAvg || 0),
    threatEventFrequencyMax: Number(formValues.threatEventFrequencyMax || 0),

    susceptibility: Number(formValues.susceptibility || 0),
    susceptibilityMin: Number(formValues.susceptibilityMin || 0),
    susceptibilityAvg: Number(formValues.susceptibilityAvg || 0),
    susceptibilityMax: Number(formValues.susceptibilityMax || 0),

    lossEventFrequency: Number(formValues.lossEventFrequency || 0),
    lossEventFrequencyMin: Number(formValues.lossEventFrequencyMin || 0),
    lossEventFrequencyAvg: Number(formValues.lossEventFrequencyAvg || 0),
    lossEventFrequencyMax: Number(formValues.lossEventFrequencyMax || 0),

    lossMagnitudeMin: Number(formValues.lossMagnitudeMin || 0),
    lossMagnitudeAvg: Number(formValues.lossMagnitudeAvg || 0),
    lossMagnitudeMax: Number(formValues.lossMagnitudeMax || 0),
  };
};

// Define the confidence type to ensure consistency
const confidenceEnum = z.enum(["low", "medium", "high"]);
type ConfidenceLevel = z.infer<typeof confidenceEnum>;

// Helper function to get confidence level with fallback to "medium"
const getConfidenceWithFallback = (value: any): ConfidenceLevel => {
  return (value || "medium") as ConfidenceLevel;
};

// Extended schema with validation
const riskFormSchema = insertRiskSchema.extend({
  riskId: z.string().min(1, "Risk ID is required"),
  name: z.string().min(1, "Risk name is required"),
  description: z.string().optional(),
  associatedAssets: z.array(z.string()), // Allow empty array of assets
  threatCommunity: z.string().min(1, "Threat community is required"),
  vulnerability: z.string().min(1, "Vulnerability is required"),
  riskCategory: z.enum(
    ["operational", "strategic", "compliance", "financial"],
    {
      required_error: "Risk category is required",
    },
  ),
  severity: z.enum(["low", "medium", "high", "critical"], {
    required_error: "Severity is required",
  }),

  // FAIR-U Parameters - Contact Frequency
  contactFrequencyMin: z.number().min(0, "Must be a positive number"),
  contactFrequencyAvg: z.number().min(0, "Must be a positive number"),
  contactFrequencyMax: z.number().min(0, "Must be a positive number"),
  contactFrequencyConfidence: confidenceEnum,

  // FAIR-U Parameters - Probability of Action
  probabilityOfActionMin: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  probabilityOfActionAvg: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  probabilityOfActionMax: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  probabilityOfActionConfidence: confidenceEnum,

  // FAIR-U Parameters - Threat Event Frequency (Triangular distribution)
  threatEventFrequencyMin: z.number().min(0, "Must be a positive number"),
  threatEventFrequencyAvg: z.number().min(0, "Must be a positive number"),
  threatEventFrequencyMax: z.number().min(0, "Must be a positive number"),
  threatEventFrequencyConfidence: confidenceEnum,

  // FAIR-U Parameters - Threat Capability
  threatCapabilityMin: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  threatCapabilityAvg: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  threatCapabilityMax: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  threatCapabilityConfidence: confidenceEnum,

  // FAIR-U Parameters - Resistance Strength
  resistanceStrengthMin: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  resistanceStrengthAvg: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  resistanceStrengthMax: z
    .number()
    .min(0, "Must be a positive number")
    .max(10, "Must be between 0 and 10"),
  resistanceStrengthConfidence: confidenceEnum,

  // Note: Using only the triangle distribution values, not single fields

  // FAIR-U Parameters - Primary Loss Magnitude
  primaryLossMagnitudeMin: z.number().min(0, "Must be a positive number"),
  primaryLossMagnitudeAvg: z.number().min(0, "Must be a positive number"),
  primaryLossMagnitudeMax: z.number().min(0, "Must be a positive number"),
  primaryLossMagnitudeConfidence: confidenceEnum,

  // FAIR-U Parameters - Secondary Loss Event Frequency
  secondaryLossEventFrequencyMin: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  secondaryLossEventFrequencyAvg: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  secondaryLossEventFrequencyMax: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  secondaryLossEventFrequencyConfidence: confidenceEnum,

  // FAIR-U Parameters - Secondary Loss Magnitude
  secondaryLossMagnitudeMin: z.number().min(0, "Must be a positive number"),
  secondaryLossMagnitudeAvg: z.number().min(0, "Must be a positive number"),
  secondaryLossMagnitudeMax: z.number().min(0, "Must be a positive number"),
  secondaryLossMagnitudeConfidence: confidenceEnum,

  // FAIR-U Parameters - Probable Loss Magnitude
  probableLossMagnitude: z.number().min(0, "Must be a positive number"),
  lossMagnitudeMin: z.number().optional(),
  lossMagnitudeAvg: z.number().optional(),
  lossMagnitudeMax: z.number().optional(),
  lossMagnitudeConfidence: confidenceEnum.optional(),

  // FAIR-U Parameters - Susceptibility (Calculated)
  susceptibilityMin: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  susceptibilityAvg: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  susceptibilityMax: z
    .number()
    .min(0, "Must be a positive number")
    .max(1, "Must be between 0 and 1"),
  susceptibilityConfidence: confidenceEnum,

  // FAIR-U Parameters - Loss Event Frequency (Calculated)
  lossEventFrequencyMin: z.number().min(0, "Must be a positive number"),
  lossEventFrequencyAvg: z.number().min(0, "Must be a positive number"),
  lossEventFrequencyMax: z.number().min(0, "Must be a positive number"),
  lossEventFrequencyConfidence: confidenceEnum,

  // FAIR-U Parameters - Risk Metrics
  inherentRisk: z.number().min(0, "Must be a positive number"),
  residualRisk: z.number().min(0, "Must be a positive number"),
  rankPercentile: z.number().optional(),
  notes: z.string().optional(),
});

// Define type for form data
export type RiskFormData = z.infer<typeof riskFormSchema>;

// Component props
type RiskFormProps = {
  risk: Risk | null;
  onClose: () => void;
  isTemplate?: boolean;
};

// Helper function to get asset-dependent risk values
const getAssetDependentRiskValues = (
  values: RiskFormData,
  hasAssociatedAssets: boolean,
) => {
  if (hasAssociatedAssets) {
    // Return the calculated values from the form
    return {
      threatEventFrequencyMin: values.threatEventFrequencyMin,
      threatEventFrequencyAvg: values.threatEventFrequencyAvg,
      threatEventFrequencyMax: values.threatEventFrequencyMax,
      threatEventFrequencyConfidence: values.threatEventFrequencyConfidence,

      susceptibilityMin: values.susceptibilityMin,
      susceptibilityAvg: values.susceptibilityAvg,
      susceptibilityMax: values.susceptibilityMax,
      susceptibilityConfidence: values.susceptibilityConfidence,

      lossEventFrequencyMin: values.lossEventFrequencyMin,
      lossEventFrequencyAvg: values.lossEventFrequencyAvg,
      lossEventFrequencyMax: values.lossEventFrequencyMax,
      lossEventFrequencyConfidence: values.lossEventFrequencyConfidence,

      lossMagnitudeMin: values.lossMagnitudeMin,
      lossMagnitudeAvg: values.lossMagnitudeAvg,
      lossMagnitudeMax: values.lossMagnitudeMax,
      lossMagnitudeConfidence: values.lossMagnitudeConfidence,
    };
  } else {
    // Set all calculation-based fields to zero when no assets are associated
    return ZERO_CALCULATED_VALUES;
  }
};

// Main component
export function RiskForm({ risk, onClose, isTemplate = false }: RiskFormProps): JSX.Element {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    risk?.associatedAssets || [],
  );
  const [calculatedInherentRisk, setCalculatedInherentRisk] = useState<number>(
    risk?.inherentRisk ? Number(risk.inherentRisk) : 0,
  );
  // We're using just a single form view now without tabs

  // Define default values for a new risk using FAIR-U standards
  const defaultRiskValues: RiskFormData = {
    // Basic string fields
    riskId: "",
    name: "",
    description: "",
    associatedAssets: [],
    threatCommunity: "",
    vulnerability: "",
    riskCategory: "operational",
    severity: "medium",

    // Use our DEFAULT_FAIR_VALUES constant for standard FAIR-U parameters
    ...DEFAULT_FAIR_VALUES,

    // Include calculated fields with zero values since there are no assets by default
    ...ZERO_CALCULATED_VALUES,
    rankPercentile: 50,
    notes: "",
  };

  // Convert existing risk data to the proper format for the form
  const existingRiskValues = risk
    ? {
        // Basic string fields
        riskId: risk.riskId,
        name: risk.name,
        description:
          typeof risk.description === "number"
            ? String(risk.description)
            : risk.description,
        associatedAssets: risk.associatedAssets,
        threatCommunity: risk.threatCommunity,
        vulnerability: risk.vulnerability,
        riskCategory: risk.riskCategory as any,
        severity: risk.severity as any,

        // Convert all numeric fields safely with Number()
        ...Object.keys(risk).reduce((acc, key) => {
          // Skip string fields and arrays
          if (
            key !== "riskId" &&
            key !== "name" &&
            key !== "description" &&
            key !== "associatedAssets" &&
            key !== "threatCommunity" &&
            key !== "vulnerability" &&
            key !== "riskCategory" &&
            key !== "severity" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "notes" &&
            !Array.isArray(risk[key as keyof Risk])
          ) {
            // Convert to number
            acc[key as keyof RiskFormData] = Number(risk[key as keyof Risk]);
          }
          return acc;
        }, {} as any),

        // Set all confidence levels with fallback to "medium"
        contactFrequencyConfidence: getConfidenceWithFallback(
          risk.contactFrequencyConfidence,
        ),
        probabilityOfActionConfidence: getConfidenceWithFallback(
          risk.probabilityOfActionConfidence,
        ),
        threatEventFrequencyConfidence: getConfidenceWithFallback(
          risk.threatEventFrequencyConfidence,
        ),
        threatCapabilityConfidence: getConfidenceWithFallback(
          risk.threatCapabilityConfidence,
        ),
        resistanceStrengthConfidence: getConfidenceWithFallback(
          risk.resistanceStrengthConfidence,
        ),
        susceptibilityConfidence: getConfidenceWithFallback(
          risk.susceptibilityConfidence,
        ),
        lossEventFrequencyConfidence: getConfidenceWithFallback(
          risk.lossEventFrequencyConfidence,
        ),
        primaryLossMagnitudeConfidence: getConfidenceWithFallback(
          risk.primaryLossMagnitudeConfidence,
        ),
        secondaryLossEventFrequencyConfidence: getConfidenceWithFallback(
          risk.secondaryLossEventFrequencyConfidence,
        ),
        secondaryLossMagnitudeConfidence: getConfidenceWithFallback(
          risk.secondaryLossMagnitudeConfidence,
        ),
        lossMagnitudeConfidence: getConfidenceWithFallback(
          risk.lossMagnitudeConfidence,
        ),

        // Include notes if available
        notes: risk.notes || "",
      }
    : null;

  // Initialize form with default values or existing risk values
  const form = useForm<RiskFormData>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: existingRiskValues || defaultRiskValues,
  });
  
  // When editing an existing risk, fetch the latest calculated values from the server
  useEffect(() => {
    if (risk && risk.riskId) {
      // Use the API to get the latest calculated values
      fetch(`/api/risks/${risk.riskId}/calculate`)
        .then(response => response.json())
        .then(data => {
          if (data.success && data.data) {
            const calculatedValues = data.data;
            console.log(`Loaded calculated values from server for ${risk.riskId}:`, calculatedValues);
            
            // Update form with server-calculated values
            if (calculatedValues.inherentRisk) {
              form.setValue('inherentRisk', Number(calculatedValues.inherentRisk));
            }
            if (calculatedValues.residualRisk) {
              form.setValue('residualRisk', Number(calculatedValues.residualRisk));
            }
          }
        })
        .catch(error => {
          console.error("Error fetching risk calculation:", error);
        });
    }
  }, [risk]);

  // Calculate risk values and update the state
  const calculateRisk = async () => {
    try {
      console.log("Calculating risk with updated parameters...");

      // Get current form values
      const values = form.getValues();
      
      // Check for existing risk values in edit mode
      const existingInherentRisk = risk?.inherentRisk && Number(risk.inherentRisk);
      const existingResidualRisk = risk?.residualRisk && Number(risk.residualRisk);
      
      // If we're editing an existing risk with valid values, prioritize preserving those values
      const isExistingRiskWithValues = risk && existingInherentRisk > 0;

      // Check if there are any assets associated
      const hasAssociatedAssets =
        values.associatedAssets && values.associatedAssets.length > 0;

      // Safely set form values with proper typing
      const safeSetValue = (
        fieldName: keyof RiskFormData,
        value: any,
        options = { shouldValidate: false },
      ) => {
        if (value !== undefined) {
          form.setValue(fieldName, value, options);
        }
      };

      // If no assets and we're not editing an existing risk with values, use zeros
      if (!hasAssociatedAssets && !isExistingRiskWithValues) {
        console.log("No assets associated and no existing risk values, using zero values");
        setCalculatedInherentRisk(0);
        safeSetValue("inherentRisk", 0);
        safeSetValue("residualRisk", 0);

        // Zero out all calculated fields
        Object.entries(ZERO_CALCULATED_VALUES).forEach(([key, value]) => {
          safeSetValue(key as keyof RiskFormData, value);
        });
        return;
      }
      
      // If we're editing an existing risk with values but no assets are associated,
      // preserve the existing values and return early
      if (!hasAssociatedAssets && isExistingRiskWithValues) {
        console.log("Preserving existing risk values:", { 
          inherentRisk: existingInherentRisk, 
          residualRisk: existingResidualRisk 
        });
        setCalculatedInherentRisk(existingInherentRisk);
        safeSetValue("inherentRisk", existingInherentRisk);
        safeSetValue("residualRisk", existingResidualRisk);
        return;
      }

      // Try server-side calculation first
      let serverCalcSuccess = false;
      try {
        let calculationEndpoint = "";
        let calculationMethod = "GET";
        let requestData = null;

        if (risk?.id || risk?.riskId) {
          // If editing an existing risk, use the GET endpoint with risk ID
          const riskIdForQuery = risk?.riskId || risk?.id?.toString();
          calculationEndpoint = `/api/risks/${riskIdForQuery}/calculate`;
          console.log(
            `Using server calculation for existing risk: ${riskIdForQuery}`,
          );
        } else {
          // For new risks with assets, use the POST endpoint with form data
          calculationEndpoint = `/api/risks/calculate`;
          calculationMethod = "POST";

          // Create a minimal data object with the FAIR parameters needed for calculation
          requestData = {
            associatedAssets: values.associatedAssets || [],
            contactFrequencyMin: Number(values.contactFrequencyMin || 0),
            contactFrequencyAvg: Number(values.contactFrequencyAvg || 0),
            contactFrequencyMax: Number(values.contactFrequencyMax || 0),
            contactFrequencyConfidence:
              values.contactFrequencyConfidence || "medium",
            probabilityOfActionMin: Number(values.probabilityOfActionMin || 0),
            probabilityOfActionAvg: Number(values.probabilityOfActionAvg || 0),
            probabilityOfActionMax: Number(values.probabilityOfActionMax || 0),
            probabilityOfActionConfidence:
              values.probabilityOfActionConfidence || "medium",
            threatCapabilityMin: Number(values.threatCapabilityMin || 0),
            threatCapabilityAvg: Number(values.threatCapabilityAvg || 0),
            threatCapabilityMax: Number(values.threatCapabilityMax || 0),
            threatCapabilityConfidence:
              values.threatCapabilityConfidence || "medium",
            resistanceStrengthMin: Number(values.resistanceStrengthMin || 0),
            resistanceStrengthAvg: Number(values.resistanceStrengthAvg || 0),
            resistanceStrengthMax: Number(values.resistanceStrengthMax || 0),
            resistanceStrengthConfidence:
              values.resistanceStrengthConfidence || "medium",
            primaryLossMagnitudeMin: Number(
              values.primaryLossMagnitudeMin || 0,
            ),
            primaryLossMagnitudeAvg: Number(
              values.primaryLossMagnitudeAvg || 0,
            ),
            primaryLossMagnitudeMax: Number(
              values.primaryLossMagnitudeMax || 0,
            ),
            primaryLossMagnitudeConfidence:
              values.primaryLossMagnitudeConfidence || "medium",
            secondaryLossEventFrequencyMin: Number(
              values.secondaryLossEventFrequencyMin || 0,
            ),
            secondaryLossEventFrequencyAvg: Number(
              values.secondaryLossEventFrequencyAvg || 0,
            ),
            secondaryLossEventFrequencyMax: Number(
              values.secondaryLossEventFrequencyMax || 0,
            ),
            secondaryLossEventFrequencyConfidence:
              values.secondaryLossEventFrequencyConfidence || "medium",
            secondaryLossMagnitudeMin: Number(
              values.secondaryLossMagnitudeMin || 0,
            ),
            secondaryLossMagnitudeAvg: Number(
              values.secondaryLossMagnitudeAvg || 0,
            ),
            secondaryLossMagnitudeMax: Number(
              values.secondaryLossMagnitudeMax || 0,
            ),
            secondaryLossMagnitudeConfidence:
              values.secondaryLossMagnitudeConfidence || "medium",
          };

          console.log(`Using server calculation with POST for new risk`);
        }

        // Make the API request
        if (calculationEndpoint) {
          console.log(
            `Making API request: ${calculationMethod} ${calculationEndpoint}`,
          );
          const response = await apiRequest(
            calculationMethod,
            calculationEndpoint,
            requestData,
          );

          console.log("Server calculation response:", response);

          if (
            response &&
            typeof response === "object" &&
            "inherentRisk" in response
          ) {
            // Update with values from server
            const inherentRiskValue = Number(response.inherentRisk) || 0;
            const residualRiskValue = Number(response.residualRisk) || 0;

            console.log("Server calculated risk values:", {
              inherentRisk: inherentRiskValue,
              residualRisk: residualRiskValue,
            });

            // Update state and form values
            setCalculatedInherentRisk(inherentRiskValue);
            safeSetValue("inherentRisk", inherentRiskValue);
            safeSetValue("residualRisk", residualRiskValue);

            // Check for warnings/errors
            if (response.error) {
              console.warn("Server calculation warning:", response.error);
            }

            serverCalcSuccess = true;
            return;
          }
        }
      } catch (serverError) {
        console.error(
          "Error using server-side calculation, falling back to local calculation:",
          serverError,
        );
      }

      // If server calculation failed or was skipped, calculate locally
      if (!serverCalcSuccess) {
        console.log("Using local risk calculation");
        const calcResults = calculateRiskFromForm(form);

        console.log(
          "Local calculation result: inherentRisk =",
          calcResults.inherentRisk,
          "residualRisk =",
          calcResults.residualRisk,
        );

        // Set all calculated fields
        safeSetValue(
          "lossEventFrequencyMin",
          calcResults.lossEventFrequencyMin,
        );
        safeSetValue(
          "lossEventFrequencyAvg",
          calcResults.lossEventFrequencyAvg,
        );
        safeSetValue(
          "lossEventFrequencyMax",
          calcResults.lossEventFrequencyMax,
        );

        safeSetValue("lossMagnitudeMin", calcResults.lossMagnitudeMin);
        safeSetValue("lossMagnitudeAvg", calcResults.lossMagnitudeAvg);
        safeSetValue("lossMagnitudeMax", calcResults.lossMagnitudeMax);

        safeSetValue(
          "threatEventFrequencyMin",
          calcResults.threatEventFrequencyMin,
        );
        safeSetValue(
          "threatEventFrequencyAvg",
          calcResults.threatEventFrequencyAvg,
        );
        safeSetValue(
          "threatEventFrequencyMax",
          calcResults.threatEventFrequencyMax,
        );

        safeSetValue("susceptibilityMin", calcResults.susceptibilityMin);
        safeSetValue("susceptibilityAvg", calcResults.susceptibilityAvg);
        safeSetValue("susceptibilityMax", calcResults.susceptibilityMax);

        safeSetValue("inherentRisk", calcResults.inherentRisk);
        safeSetValue("residualRisk", calcResults.residualRisk);

        setCalculatedInherentRisk(calcResults.inherentRisk || 0);
      }
    } catch (error) {
      console.error("Error calculating risk:", error);
    }
  };

  // Watch for input changes and recalculate risk
  useEffect(() => {
    let initialCalcTimer: NodeJS.Timeout | null = null;

    // Check if we're editing an existing risk with valid inherent risk values
    const existingInherentRisk = risk?.inherentRisk ? Number(risk.inherentRisk) : 0;
    const skipInitialCalc = risk && existingInherentRisk > 0;

    if (skipInitialCalc) {
      console.log("Skipping initial calculation for existing risk with value:", existingInherentRisk);
      
      // Set the existing values in the form
      form.setValue("inherentRisk", existingInherentRisk);
      form.setValue("residualRisk", risk.residualRisk ? Number(risk.residualRisk) : 0);
      setCalculatedInherentRisk(existingInherentRisk);
    } else {
      // Initial calculation - delayed to ensure form is fully initialized
      initialCalcTimer = setTimeout(() => {
        calculateRisk().catch((err) => {
          console.error("Error in initial risk calculation:", err);
        });
      }, 100);
    }

    // Add event listener for manual recalculation triggered by parameter editor
    const handleRecalculate = () => {
      console.log("Recalculation triggered by parameter editor");
      // Call calculateRisk and handle promise errors
      calculateRisk().catch((err) => {
        console.error("Error in manual risk recalculation:", err);
      });
    };

    window.addEventListener("recalculateRisk", handleRecalculate);

    // Cleanup function
    return () => {
      if (initialCalcTimer) {
        clearTimeout(initialCalcTimer);
      }
      window.removeEventListener("recalculateRisk", handleRecalculate);
    };
  }, [risk, form]);

  // Mutation for adding/updating risk
  const mutation = useMutation({
    mutationFn: async (values: RiskFormData) => {
      try {
        console.log(">>> MUTATION TRIGGERED with values:", values);

        // Ensure selected assets are included
        values.associatedAssets = selectedAssets;

        // Make sure all values are properly set
        if (values.name === undefined || values.name === "") {
          throw new Error("Risk name is required");
        }

        // Convert any string numeric values to actual numbers
        const processedValues = { ...values };

        // Ensure notes is always a string
        if (
          processedValues.notes !== undefined &&
          typeof processedValues.notes !== "string"
        ) {
          processedValues.notes = String(processedValues.notes);
        }

        // Convert numerical fields from strings to numbers
        Object.keys(processedValues).forEach((key) => {
          const value = processedValues[key as keyof RiskFormData];
          if (
            typeof value === "string" &&
            !isNaN(Number(value)) &&
            key !== "riskId" &&
            key !== "name" &&
            key !== "description" &&
            key !== "notes"
          ) {
            (processedValues as any)[key] = Number(value);
          }
        });

        // Add itemType for template/instance
        processedValues.itemType = isTemplate ? "template" : "instance";

        // Check if there are associated assets - for templates, assets might be optional
        const hasAssociatedAssets = 
          Array.isArray(processedValues.associatedAssets) &&
          processedValues.associatedAssets.length > 0;

        if (risk) {
          // Update existing risk or template
          console.log(`Updating ${isTemplate ? 'template' : 'risk'} with ID ${risk.id}...`);

          // Create update data using the helper function
          const updateData = {
            // Use our common helper function for FAIR-U parameters
            ...createRiskUpdateData(
              processedValues,
              processedValues.associatedAssets,
            ),

            // Get the values to use based on asset association
            ...(isTemplate || hasAssociatedAssets ? 
              getAssetDependentRiskValues(processedValues, true) : 
              getAssetDependentRiskValues(processedValues, false)),

            // Convert all numeric fields to ensure they're numbers, not strings
            contactFrequencyMin: Number(processedValues.contactFrequencyMin),
            contactFrequencyAvg: Number(processedValues.contactFrequencyAvg),
            contactFrequencyMax: Number(processedValues.contactFrequencyMax),
            probabilityOfActionMin: Number(processedValues.probabilityOfActionMin),
            probabilityOfActionAvg: Number(processedValues.probabilityOfActionAvg),
            probabilityOfActionMax: Number(processedValues.probabilityOfActionMax),
            threatCapabilityMin: Number(processedValues.threatCapabilityMin),
            threatCapabilityAvg: Number(processedValues.threatCapabilityAvg),
            threatCapabilityMax: Number(processedValues.threatCapabilityMax),
            resistanceStrengthMin: Number(processedValues.resistanceStrengthMin),
            resistanceStrengthAvg: Number(processedValues.resistanceStrengthAvg),
            resistanceStrengthMax: Number(processedValues.resistanceStrengthMax),
            primaryLossMagnitudeMin: Number(processedValues.primaryLossMagnitudeMin),
            primaryLossMagnitudeAvg: Number(processedValues.primaryLossMagnitudeAvg),
            primaryLossMagnitudeMax: Number(processedValues.primaryLossMagnitudeMax),
            
            // Ensure confidence values match the expected enum values
            contactFrequencyConfidence: String(processedValues.contactFrequencyConfidence).toLowerCase(),
            probabilityOfActionConfidence: String(processedValues.probabilityOfActionConfidence).toLowerCase(),
            threatCapabilityConfidence: String(processedValues.threatCapabilityConfidence).toLowerCase(),
            resistanceStrengthConfidence: String(processedValues.resistanceStrengthConfidence).toLowerCase(),
            primaryLossMagnitudeConfidence: String(processedValues.primaryLossMagnitudeConfidence).toLowerCase(),
            
            // The inherent and residual risk values should be 0 if no assets (unless it's a template)
            inherentRisk: (isTemplate || hasAssociatedAssets)
              ? Number(processedValues.inherentRisk)
              : 0,
            residualRisk: (isTemplate || hasAssociatedAssets)
              ? Number(processedValues.residualRisk)
              : 0,
            rankPercentile: Number(processedValues.rankPercentile || 50),

            // Include any notes
            notes: processedValues.notes,
            
            // Set the itemType properly
            itemType: isTemplate ? "template" : "instance",
          };

          console.log("Sending update with data:", updateData);
          
          // Select the appropriate endpoint based on whether this is a template or instance
          const endpoint = isTemplate 
            ? `/api/risk-library/${risk.id}` 
            : `/api/risks/${risk.id}`;
            
          return apiRequest("PUT", endpoint, updateData);
        } else {
          // Create new risk or template
          console.log(`Creating new ${isTemplate ? 'template' : 'risk'}...`);
          
          // Use separate endpoints for templates and instances
          const endpoint = isTemplate ? "/api/risk-templates" : "/api/risks";
          
          // Make sure we explicitly set the itemType in the request 
          processedValues.itemType = isTemplate ? "template" : "instance";
          console.log(`Creating ${isTemplate ? 'template' : 'instance'} with itemType: ${processedValues.itemType} using endpoint ${endpoint}`);
            
          return apiRequest("POST", endpoint, processedValues);
        }
      } catch (error: any) {
        console.error("Error in mutation execution:", error);
        throw error; // Re-throw to trigger onError
      }
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      
      // If this is a template, also invalidate the risk library
      if (isTemplate) {
        queryClient.invalidateQueries({ queryKey: ["/api/risk-library"] });
      }

      // Also invalidate this specific risk or template
      if (risk?.id) {
        const endpoint = isTemplate ? `/api/risk-library/${risk.id}` : `/api/risks/${risk.id}`;
        queryClient.invalidateQueries({
          queryKey: [endpoint],
        });
      }

      // Log successful update with received data for debugging
      console.log("Risk updated successfully:", data);

      // Show success message
      toast({
        title: risk ? "Risk updated" : "Risk created",
        description: risk
          ? "The risk has been updated successfully."
          : "The risk has been created successfully.",
      });

      // Close the form
      onClose();
    },
    onError: (error: any) => {
      // Show error message
      toast({
        title: "Error",
        description: `Failed to ${risk ? "update" : "create"} risk: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Register watch for key fields to trigger calculations when they change
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (
        name &&
        type === "change" &&
        (String(name).includes("Min") ||
          String(name).includes("Avg") ||
          String(name).includes("Max") ||
          String(name).includes("Confidence") ||
          String(name) === "resistanceStrength")
      ) {
        // Debounce the calculation to avoid too many updates
        const timer = setTimeout(() => {
          calculateRisk();
        }, 300);
        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Form submission handler
  const onSubmit = (data: any) => {
    try {
      console.log("Form submission started with data:", data);

      // Get all current form values
      const formValues = form.getValues();
      console.log("Current form values after getValues():", formValues);

      // Convert to our expected type with proper handling
      const values: RiskFormData = { ...formValues };
      
      // Ensure we have valid numeric values for inherentRisk and residualRisk
      if (!values.inherentRisk || isNaN(Number(values.inherentRisk))) {
        values.inherentRisk = "0";
      }
      
      if (!values.residualRisk || isNaN(Number(values.residualRisk))) {
        values.residualRisk = "0";
      }
      
      console.log("Submitting with inherentRisk:", values.inherentRisk, "residualRisk:", values.residualRisk);

      // Force a final calculation to ensure all derived values are current
      // This will handle asset dependency check and set risk to 0 if no assets
      const calculationResult = calculateRiskFromForm(form);
      console.log(
        "Final calculated inherent risk:",
        calculationResult.inherentRisk,
        "residual risk:",
        calculationResult.residualRisk,
      );

      // Set calculated values from risk-utils.ts calculation
      // Make sure calculated values are converted to strings for database storage
      // This ensures compatibility with the database schema
      values.inherentRisk = calculationResult.inherentRisk
        ? String(calculationResult.inherentRisk)
        : "0";
      values.residualRisk = calculationResult.residualRisk
        ? String(calculationResult.residualRisk)
        : "0";

      // Also ensure the main susceptibility value is included
      // Use the single susceptibility value (avg) from calculation result
      if (calculationResult.susceptibility !== undefined) {
        values.susceptibilityAvg = String(
          calculationResult.susceptibility || 0,
        );
      }

      // Include loss event frequency calculated values if available
      if (calculationResult.lossEventFrequency !== undefined) {
        values.lossEventFrequency = String(
          calculationResult.lossEventFrequency || 0,
        );
      }

      // For logging/debugging
      console.log(
        "Saving to database - Inherent risk:",
        values.inherentRisk,
        "Residual risk:",
        values.residualRisk,
      );

      // Ensure all numeric values are properly converted to numbers
      // This fixes issues with the update operation

      // Ensure notes is always a string
      if (values.notes !== undefined && typeof values.notes !== "string") {
        values.notes = String(values.notes);
      }

      // Convert numerical fields from strings to numbers
      Object.keys(values).forEach((key) => {
        const value = values[key as keyof RiskFormData];
        if (typeof value === "string" && !isNaN(Number(value))) {
          if (
            key !== "riskId" &&
            key !== "name" &&
            key !== "description" &&
            key !== "notes"
          ) {
            (values as any)[key] = Number(value);
          }
        }
      });

      // Ensure associatedAssets is an array
      if (!Array.isArray(values.associatedAssets)) {
        values.associatedAssets = selectedAssets;
      }

      // Set the itemType based on isTemplate flag when creating a new risk
      if (!risk) {
        // Add itemType field to the form values
        (values as any).itemType = isTemplate ? 'template' : 'instance';
        console.log(`Creating ${isTemplate ? 'template' : 'instance'} with itemType: ${(values as any).itemType}`);
      }

      // Log the processed values
      console.log("Final submission values:", {
        inherentRisk: values.inherentRisk,
        residualRisk: values.residualRisk,
        associatedAssets: values.associatedAssets,
        itemType: (values as any).itemType
      });

      // Submit form directly since calculation has been completed
      mutation.mutate(values as RiskFormData);
    } catch (error: any) {
      console.error("Error in form submission:", error);
      toast({
        title: "Error",
        description:
          "There was a problem processing your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {risk ? "Edit Risk" : isTemplate ? "Create Risk Template" : "Create Risk"}
          </h2>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {risk ? (
              // For update, create a completely separate button
              <Button
                type="button" // Changed to button to prevent form submission
                disabled={mutation.isPending}
                className="gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  console.log("Update button clicked with manual data sending");
                  if (risk) {
                    try {
                      // Get current form values
                      const formValues = form.getValues();

                      // Calculate the risk values before we create the update data
                      let calculationResult = null;
                      try {
                        // We don't want to calculate on the client-side
                        // Instead use the values from the risk object directly or make a server call
                        // Leave the current values untouched - server calculation will happen after save
                      } catch (error) {
                        console.error("Error calculating risk values:", error);
                        // Use safe defaults if calculation fails
                        formValues.inherentRisk = formValues.inherentRisk || 0;
                        formValues.residualRisk = formValues.residualRisk || 0;
                      }

                      // Create update data using the helper function with updated values
                      const updateData = createRiskUpdateData(
                        formValues,
                        selectedAssets,
                      );

                      console.log(
                        "Manually sending update with data:",
                        updateData,
                      );

                      // Direct API call
                      fetch(`/api/risks/${risk.id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(updateData),
                      })
                        .then(async (response) => {
                          if (!response.ok) {
                            // Get response text to understand the error
                            const errorText = await response.text();
                            console.error("Server error response:", errorText);
                            
                            // Check if the response is HTML (common for server errors)
                            if (errorText.includes('<!DOCTYPE html>') || errorText.includes('<html>')) {
                              throw new Error(`Server error (${response.status}). Please try again.`);
                            }
                            
                            // Otherwise, try to parse as JSON if possible
                            try {
                              const errorJson = JSON.parse(errorText);
                              throw new Error(errorJson.message || `HTTP error ${response.status}`);
                            } catch (e) {
                              // If can't parse, just use the status
                              throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
                            }
                          }
                          
                          // For successful responses, safely handle empty or non-JSON responses
                          try {
                            const text = await response.text();
                            return text ? JSON.parse(text) : {};
                          } catch (e) {
                            console.warn("Response was not valid JSON, but request was successful");
                            return {};
                          }
                        })
                        .then((data) => {
                          console.log("Risk updated successfully:", data);

                          // Invalidate queries
                          queryClient.invalidateQueries({
                            queryKey: ["/api/risks"],
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["/api/assets"],
                          });
                          queryClient.invalidateQueries({
                            queryKey: ["/api/dashboard/summary"],
                          });
                          // Invalidate risk summary for Loss Exceedance Curve
                          queryClient.invalidateQueries({
                            queryKey: ["/api/risk-summary/latest"],
                          });

                          // Show success toast
                          toast({
                            title: "Risk updated",
                            description:
                              "The risk has been updated successfully.",
                          });

                          // Close form
                          onClose();
                        })
                        .catch((error) => {
                          console.error("Error updating risk:", error);
                          toast({
                            title: "Error",
                            description: `Failed to update risk: ${error.message}`,
                            variant: "destructive",
                          });
                        });
                    } catch (error: any) {
                      console.error("Error in manual update:", error);
                      toast({
                        title: "Error",
                        description: `Failed to update risk: ${error.message || "Unknown error"}`,
                        variant: "destructive",
                      });
                    }
                  }
                }}
              >
                {mutation.isPending && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}
                Update Risk
              </Button>
            ) : (
              // For create, use the React Query mutation
              <Button
                type="button"
                disabled={mutation.isPending}
                className="gap-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  console.log("Create button clicked using React Query mutation");
                  try {
                    // Get current form values
                    const values = form.getValues();

                    // Calculate the risk values
                    try {
                      // Calculate using the form object
                      const calculationResult = calculateRiskFromForm(form);
                      values.inherentRisk = calculationResult.inherentRisk;
                      values.residualRisk = calculationResult.residualRisk;
                    } catch (error) {
                      console.error("Error calculating risk values:", error);
                      values.inherentRisk = values.inherentRisk || 0;
                      values.residualRisk = values.residualRisk || 0;
                    }
                    
                    // Make sure to set the correct item type
                    values.itemType = isTemplate ? "template" : "instance";
                    console.log(`Creating ${isTemplate ? 'template' : 'risk'} using mutation`);
                    
                    // Use the React Query mutation (which uses the correct endpoint)
                    mutation.mutate(values as RiskFormData);

                    // Create risk data object using our helper function with extra fields
                    const riskData = {
                      // Use our helper function for FAIR-U parameters
                      ...createRiskUpdateData(formValues, selectedAssets),

                      // Add extra fields specific to risk creation
                      riskId:
                        formValues.riskId ||
                        `RISK-${Math.floor(Math.random() * 10000)}`,
                      threatCommunity:
                        formValues.threatCommunity || "External Actor",
                      vulnerability:
                        formValues.vulnerability || "System Vulnerability",

                      // Calculate FAIR-U parameters differently based on asset association
                      ...(selectedAssets.length > 0
                        ? {
                            // Calculate Threat Event Frequency (TEF = CF * POA) using shared utility
                            threatEventFrequencyMin:
                              calculateThreatEventFrequency(
                                createRiskObjectFromFormValues(formValues),
                                "min",
                              ),
                            threatEventFrequencyAvg:
                              calculateThreatEventFrequency(
                                createRiskObjectFromFormValues(formValues),
                                "avg",
                              ),
                            threatEventFrequencyMax:
                              calculateThreatEventFrequency(
                                createRiskObjectFromFormValues(formValues),
                                "max",
                              ),
                            threatEventFrequencyConfidence:
                              formValues.contactFrequencyConfidence || "medium",

                            // Calculate Susceptibility (vulnerability) using shared utility functions
                            susceptibilityMin: calculateSusceptibility(
                              createRiskObjectFromFormValues(formValues),
                              "min",
                            ),
                            susceptibilityAvg: calculateSusceptibility(
                              createRiskObjectFromFormValues(formValues),
                              "avg",
                            ),
                            susceptibilityMax: calculateSusceptibility(
                              createRiskObjectFromFormValues(formValues),
                              "max",
                            ),
                            susceptibilityConfidence: "medium",

                            // Calculate Loss Event Frequency (LEF = TEF * Vulnerability) using shared utility
                            lossEventFrequencyMin: calculateLossEventFrequency(
                              createRiskObjectFromFormValues(formValues),
                              "min",
                            ),
                            lossEventFrequencyAvg: calculateLossEventFrequency(
                              createRiskObjectFromFormValues(formValues),
                              "avg",
                            ),
                            lossEventFrequencyMax: calculateLossEventFrequency(
                              createRiskObjectFromFormValues(formValues),
                              "max",
                            ),
                            lossEventFrequencyConfidence: "medium",

                            // Calculate Loss Magnitude (LM = PL + (SLEF * SLM)) using shared utility
                            lossMagnitudeMin: calculateLossMagnitude(
                              createRiskObjectFromFormValues(formValues),
                              "min",
                            ),
                            lossMagnitudeAvg: calculateLossMagnitude(
                              createRiskObjectFromFormValues(formValues),
                              "avg",
                            ),
                            lossMagnitudeMax: calculateLossMagnitude(
                              createRiskObjectFromFormValues(formValues),
                              "max",
                            ),
                            lossMagnitudeConfidence: "medium",
                          }
                        : {
                            // Set minimal values if no assets are associated
                            threatEventFrequencyMin: 0,
                            threatEventFrequencyAvg: 0,
                            threatEventFrequencyMax: 0,
                            threatEventFrequencyConfidence: "medium",

                            susceptibilityMin: 0,
                            susceptibilityAvg: 0,
                            susceptibilityMax: 0,
                            susceptibilityConfidence: "medium",

                            lossEventFrequencyMin: 0,
                            lossEventFrequencyAvg: 0,
                            lossEventFrequencyMax: 0,
                            lossEventFrequencyConfidence: "medium",

                            lossMagnitudeMin: 0,
                            lossMagnitudeAvg: 0,
                            lossMagnitudeMax: 0,
                            lossMagnitudeConfidence: "medium",
                          }),

                      // Calculate risk values - stored as strings in the database
                      inherentRisk: String(formValues.inherentRisk || 0),
                      residualRisk: String(formValues.residualRisk || 0),
                      rankPercentile: Number(formValues.rankPercentile || 50),

                      notes: formValues.notes || "",
                    };

                    console.log(
                      "Manually sending create request with data:",
                      riskData,
                    );

                    // Use the right endpoint based on whether we're creating a template or instance
                    const endpoint = isTemplate ? "/api/risk-templates" : "/api/risks";
                    console.log(`Creating ${isTemplate ? 'template' : 'instance'} with endpoint: ${endpoint}`);
                    
                    // Set itemType explicitly
                    riskData.itemType = isTemplate ? "template" : "instance";
                    
                    // Send request to the appropriate endpoint
                    fetch(endpoint, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(riskData),
                    })
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error(`HTTP error ${response.status}`);
                        }
                        return response.json();
                      })
                      .then((data) => {
                        console.log("Risk created successfully:", data);

                        // Invalidate queries
                        queryClient.invalidateQueries({
                          queryKey: ["/api/risks"],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["/api/assets"],
                        });
                        queryClient.invalidateQueries({
                          queryKey: ["/api/dashboard/summary"],
                        });
                        // Invalidate risk summary for Loss Exceedance Curve
                        queryClient.invalidateQueries({
                          queryKey: ["/api/risk-summary/latest"],
                        });

                        // Show success toast
                        toast({
                          title: "Risk created",
                          description:
                            "The risk has been created successfully.",
                        });

                        // Close form
                        onClose();
                      })
                      .catch((error) => {
                        console.error("Error creating risk:", error);
                        toast({
                          title: "Error",
                          description: `Failed to create risk: ${error.message}`,
                          variant: "destructive",
                        });
                      });
                  } catch (error: any) {
                    console.error("Error in manual create:", error);
                    toast({
                      title: "Error",
                      description: `Failed to create risk: ${error.message || "Unknown error"}`,
                      variant: "destructive",
                    });
                  }
                }}
              >
                {mutation.isPending && (
                  <Loader className="h-4 w-4 animate-spin" />
                )}
                {isTemplate ? "Create Template" : "Create Risk"}
              </Button>
            )}
          </div>
        </div>

        {/* New 2-column Grid Layout with controlled width and column ratio */}
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_2fr] gap-8">
          {/* Left Column - Basic Risk Information */}
          <div className="space-y-6">
            {/* Basic Risk Information */}
            <BasicRiskInfo form={form} />

            {/* Asset Selection - Simplified version */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium">Associated Assets</h3>
              <div className="border rounded-md p-4 bg-muted/20">
                <div className="flex flex-wrap gap-2">
                  {selectedAssets.map((asset, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 rounded-md bg-primary/10 text-sm"
                    >
                      {typeof asset === "string"
                        ? asset
                        : asset.name || `Asset ${index + 1}`}
                    </div>
                  ))}
                  {selectedAssets.length === 0 && (
                    <div className="text-sm text-muted-foreground py-2">
                      No assets selected. Select assets to calculate risk.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4 mt-6">
              <h4 className="text-md font-medium">Additional Notes</h4>
              <Textarea
                placeholder="Additional notes about this risk"
                className="min-h-[100px]"
                {...form.register("notes")}
              />
            </div>
          </div>

          {/* Right Column - FAIR-U Risk Parameters Visualization */}
          <div className="space-y-6 w-full">
            {/* Calculated Inherent Risk Display */}
            <div className="bg-muted/50 p-4 rounded-md mb-6">
              <h4 className="text-lg font-medium mb-2">
                Calculated Inherent Risk
              </h4>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(calculatedInherentRisk)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Annualized expected loss based on the parameters below
              </p>
            </div>

            {/* Editable Risk Parameter UI */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Click on any parameter box below to edit its values. Changes
                will automatically update the calculated risk.
              </p>
              <RiskFormPreviewEditable
                form={form}
                selectedAssets={selectedAssets}
                setSelectedAssets={setSelectedAssets}
                onParameterEdit={() => {
                  // Trigger manual calculation when button is clicked
                  console.log("Manual calculation triggered from Run Calculations button");
                  calculateRisk().catch((err) => {
                    console.error("Error in manual risk recalculation:", err);
                  });
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
