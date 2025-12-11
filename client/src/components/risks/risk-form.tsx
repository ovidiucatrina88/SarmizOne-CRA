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
import { Risk, RiskWithParams, insertRiskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MonteCarloInput } from "@shared/models/riskParams";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/glow-card";

import { BasicRiskInfo } from "./form-sections";
import { AssetSelection } from "./form-sections/AssetSelection";

import { RiskFormPreviewEditable } from "./risk-form-preview-editable";
import { RiskFormPreviewEditableConcept } from "./risk-form-preview-editable-concept";
import {
  formatCurrency,
  calculateSusceptibility,
  calculateThreatEventFrequency,
  calculateLossEventFrequency,
  calculateLossMagnitude,
} from "@shared/utils/calculations";

// Default FAIR-U parameter values for new risks
const DEFAULT_FAIR_VALUES = {
  parameters: {
    // Contact Frequency (CF)
    contactFrequency: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Probability of Action (POA)
    probabilityOfAction: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Threat Capability (TCap)
    threatCapability: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Resistance Strength (RS)
    resistanceStrength: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Primary Loss Magnitude (PL)
    primaryLossMagnitude: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Secondary Loss Event Frequency (SLEF)
    secondaryLossEventFrequency: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Secondary Loss Magnitude (SLM)
    secondaryLossMagnitude: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },
  }
};

// Zero values for calculated FAIR-U parameters when no assets are associated
const ZERO_CALCULATED_VALUES = {
  parameters: {
    // Threat Event Frequency (TEF) - Calculated
    threatEventFrequency: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Susceptibility - Calculated
    susceptibility: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Loss Event Frequency (LEF) - Calculated
    lossEventFrequency: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },

    // Loss Magnitude (LM) - Calculated
    lossMagnitude: {
      min: 0,
      avg: 0,
      max: 0,
      confidence: "medium" as ConfidenceLevel,
    },
  },

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

  // Helper to format a parameter group
  const formatParam = (group: any) => ({
    min: safeToString(group?.min),
    avg: safeToString(group?.avg),
    max: safeToString(group?.max),
    confidence: normalizeConfidence(group?.confidence)
  });

  // Starting with basic risk information
  const updateData = {
    name: values.name,
    description: values.description || "",
    riskCategory: values.riskCategory,
    severity: values.severity,
    associatedAssets: associatedAssets,

    // Structured Parameters
    parameters: {
      contactFrequency: formatParam(values.parameters?.contactFrequency),
      probabilityOfAction: formatParam(values.parameters?.probabilityOfAction),
      threatCapability: formatParam(values.parameters?.threatCapability),
      resistanceStrength: formatParam(values.parameters?.resistanceStrength),
      primaryLossMagnitude: formatParam(values.parameters?.primaryLossMagnitude),
      secondaryLossEventFrequency: formatParam(values.parameters?.secondaryLossEventFrequency),
      secondaryLossMagnitude: formatParam(values.parameters?.secondaryLossMagnitude),

      // Calculated parameters (optional to store, but good for caching)
      threatEventFrequency: formatParam(values.parameters?.threatEventFrequency),
      susceptibility: formatParam(values.parameters?.susceptibility),
      lossEventFrequency: formatParam(values.parameters?.lossEventFrequency),
      lossMagnitude: formatParam(values.parameters?.lossMagnitude),
    },

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
  const p = formValues.parameters || {};

  // Convert all relevant values to numbers to ensure calculation accuracy
  return {
    contactFrequency: {
      min: Number(p.contactFrequency?.min || 0),
      avg: Number(p.contactFrequency?.avg || 0),
      max: Number(p.contactFrequency?.max || 0)
    },
    probabilityOfAction: {
      min: Number(p.probabilityOfAction?.min || 0),
      avg: Number(p.probabilityOfAction?.avg || 0),
      max: Number(p.probabilityOfAction?.max || 0)
    },
    threatCapability: {
      min: Number(p.threatCapability?.min || 0),
      avg: Number(p.threatCapability?.avg || 0),
      max: Number(p.threatCapability?.max || 0)
    },
    resistanceStrength: {
      min: Number(p.resistanceStrength?.min || 0),
      avg: Number(p.resistanceStrength?.avg || 0),
      max: Number(p.resistanceStrength?.max || 0)
    },
    primaryLossMagnitude: {
      min: Number(p.primaryLossMagnitude?.min || 0),
      avg: Number(p.primaryLossMagnitude?.avg || 0),
      max: Number(p.primaryLossMagnitude?.max || 0)
    },
    secondaryLossEventFrequency: {
      min: Number(p.secondaryLossEventFrequency?.min || 0.1),
      avg: Number(p.secondaryLossEventFrequency?.avg || 0.3),
      max: Number(p.secondaryLossEventFrequency?.max || 0.5)
    },
    secondaryLossMagnitude: {
      min: Number(p.secondaryLossMagnitude?.min || 5000),
      avg: Number(p.secondaryLossMagnitude?.avg || 25000),
      max: Number(p.secondaryLossMagnitude?.max || 50000)
    },

    // Include calculated values for completeness
    threatEventFrequency: {
      min: Number(p.threatEventFrequency?.min || 0),
      avg: Number(p.threatEventFrequency?.avg || 0),
      max: Number(p.threatEventFrequency?.max || 0)
    },
    susceptibility: {
      min: Number(p.susceptibility?.min || 0),
      avg: Number(p.susceptibility?.avg || 0),
      max: Number(p.susceptibility?.max || 0)
    },
    lossEventFrequency: {
      min: Number(p.lossEventFrequency?.min || 0),
      avg: Number(p.lossEventFrequency?.avg || 0),
      max: Number(p.lossEventFrequency?.max || 0)
    },
    lossMagnitude: {
      min: Number(p.lossMagnitude?.min || 0),
      avg: Number(p.lossMagnitude?.avg || 0),
      max: Number(p.lossMagnitude?.max || 0)
    }
  };
};

// Define the confidence type to ensure consistency
const confidenceEnum = z.enum(["low", "medium", "high"]);
type ConfidenceLevel = z.infer<typeof confidenceEnum>;

// Helper function to get confidence level with fallback to "medium"
const getConfidenceWithFallback = (value: any): ConfidenceLevel => {
  return (value || "medium") as ConfidenceLevel;
};

// Define the FAIR parameter schema
const fairParameterSchema = z.object({
  min: z.number().min(0, "Must be a positive number"),
  avg: z.number().min(0, "Must be a positive number"),
  max: z.number().min(0, "Must be a positive number"),
  confidence: confidenceEnum
});

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
  itemType: z.enum(["template", "instance"]).optional(),

  // Structured Parameters
  parameters: z.object({
    contactFrequency: fairParameterSchema,
    probabilityOfAction: fairParameterSchema.extend({
      min: z.number().min(0).max(1),
      avg: z.number().min(0).max(1),
      max: z.number().min(0).max(1)
    }),
    threatCapability: fairParameterSchema.extend({
      min: z.number().min(0).max(10),
      avg: z.number().min(0).max(10),
      max: z.number().min(0).max(10)
    }),
    resistanceStrength: fairParameterSchema.extend({
      min: z.number().min(0).max(10),
      avg: z.number().min(0).max(10),
      max: z.number().min(0).max(10)
    }),
    primaryLossMagnitude: fairParameterSchema,
    secondaryLossEventFrequency: fairParameterSchema.extend({
      min: z.number().min(0).max(1),
      avg: z.number().min(0).max(1),
      max: z.number().min(0).max(1)
    }),
    secondaryLossMagnitude: fairParameterSchema,

    // Calculated parameters (optional validation)
    threatEventFrequency: fairParameterSchema.optional(),
    susceptibility: fairParameterSchema.optional(),
    lossEventFrequency: fairParameterSchema.optional(),
    lossMagnitude: fairParameterSchema.optional(),
  }),

  // FAIR-U Parameters - Probable Loss Magnitude
  probableLossMagnitude: z.number().min(0, "Must be a positive number"),

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
  risk: RiskWithParams | null;
  onClose: () => void;
  isTemplate?: boolean;
  variant?: "default" | "concept";
};

// Helper function to get asset-dependent risk values
const getAssetDependentRiskValues = (
  values: RiskFormData,
  hasAssociatedAssets: boolean,
) => {
  if (hasAssociatedAssets) {
    // Return the calculated values from the form
    return {
      parameters: {
        threatEventFrequency: values.parameters.threatEventFrequency,
        susceptibility: values.parameters.susceptibility,
        lossEventFrequency: values.parameters.lossEventFrequency,
        lossMagnitude: values.parameters.lossMagnitude,
      }
    };
  } else {
    // Set all calculation-based fields to zero when no assets are associated
    return ZERO_CALCULATED_VALUES;
  }
};

// Main component
export function RiskForm({ risk, onClose, isTemplate = false, variant = "default" }: RiskFormProps): JSX.Element {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const useConceptLayout = variant === "concept";
  const [selectedAssets, setSelectedAssets] = useState<string[]>(risk?.associatedAssets || []);
  const [calculatedInherentRisk, setCalculatedInherentRisk] = useState<number>(
    risk?.inherentRisk ? Number(risk.inherentRisk) : 0,
  );
  const [isRecalculating, setIsRecalculating] = useState(false);
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

    // Merge parameters from both defaults
    parameters: {
      ...DEFAULT_FAIR_VALUES.parameters,
      ...ZERO_CALCULATED_VALUES.parameters
    },

    rankPercentile: 50,
    notes: "",
    probableLossMagnitude: 0,
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
      probableLossMagnitude: Number((risk as RiskWithParams).probableLossMagnitude) || 0,

      // Structured Parameters
      parameters: {
        contactFrequency: {
          min: Number(risk.parameters?.contactFrequency?.min || risk.contactFrequencyMin || 0),
          avg: Number(risk.parameters?.contactFrequency?.avg || risk.contactFrequencyAvg || 0),
          max: Number(risk.parameters?.contactFrequency?.max || risk.contactFrequencyMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.contactFrequency?.confidence || risk.contactFrequencyConfidence)
        },
        probabilityOfAction: {
          min: Number(risk.parameters?.probabilityOfAction?.min || risk.probabilityOfActionMin || 0),
          avg: Number(risk.parameters?.probabilityOfAction?.avg || risk.probabilityOfActionAvg || 0),
          max: Number(risk.parameters?.probabilityOfAction?.max || risk.probabilityOfActionMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.probabilityOfAction?.confidence || risk.probabilityOfActionConfidence)
        },
        threatCapability: {
          min: Number(risk.parameters?.threatCapability?.min || risk.threatCapabilityMin || 0),
          avg: Number(risk.parameters?.threatCapability?.avg || risk.threatCapabilityAvg || 0),
          max: Number(risk.parameters?.threatCapability?.max || risk.threatCapabilityMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.threatCapability?.confidence || risk.threatCapabilityConfidence)
        },
        resistanceStrength: {
          min: Number(risk.parameters?.resistanceStrength?.min || risk.resistanceStrengthMin || 0),
          avg: Number(risk.parameters?.resistanceStrength?.avg || risk.resistanceStrengthAvg || 0),
          max: Number(risk.parameters?.resistanceStrength?.max || risk.resistanceStrengthMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.resistanceStrength?.confidence || risk.resistanceStrengthConfidence)
        },
        primaryLossMagnitude: {
          min: Number(risk.parameters?.primaryLossMagnitude?.min || risk.primaryLossMagnitudeMin || 0),
          avg: Number(risk.parameters?.primaryLossMagnitude?.avg || risk.primaryLossMagnitudeAvg || 0),
          max: Number(risk.parameters?.primaryLossMagnitude?.max || risk.primaryLossMagnitudeMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.primaryLossMagnitude?.confidence || risk.primaryLossMagnitudeConfidence)
        },
        secondaryLossEventFrequency: {
          min: Number(risk.parameters?.secondaryLossEventFrequency?.min || risk.secondaryLossEventFrequencyMin || 0),
          avg: Number(risk.parameters?.secondaryLossEventFrequency?.avg || risk.secondaryLossEventFrequencyAvg || 0),
          max: Number(risk.parameters?.secondaryLossEventFrequency?.max || risk.secondaryLossEventFrequencyMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.secondaryLossEventFrequency?.confidence || risk.secondaryLossEventFrequencyConfidence)
        },
        secondaryLossMagnitude: {
          min: Number(risk.parameters?.secondaryLossMagnitude?.min || risk.secondaryLossMagnitudeMin || 0),
          avg: Number(risk.parameters?.secondaryLossMagnitude?.avg || risk.secondaryLossMagnitudeAvg || 0),
          max: Number(risk.parameters?.secondaryLossMagnitude?.max || risk.secondaryLossMagnitudeMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.secondaryLossMagnitude?.confidence || risk.secondaryLossMagnitudeConfidence)
        },

        // Calculated
        threatEventFrequency: {
          min: Number(risk.parameters?.threatEventFrequency?.min || risk.threatEventFrequencyMin || 0),
          avg: Number(risk.parameters?.threatEventFrequency?.avg || risk.threatEventFrequencyAvg || 0),
          max: Number(risk.parameters?.threatEventFrequency?.max || risk.threatEventFrequencyMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.threatEventFrequency?.confidence || risk.threatEventFrequencyConfidence)
        },
        susceptibility: {
          min: Number(risk.parameters?.susceptibility?.min || risk.susceptibilityMin || 0),
          avg: Number(risk.parameters?.susceptibility?.avg || risk.susceptibilityAvg || 0),
          max: Number(risk.parameters?.susceptibility?.max || risk.susceptibilityMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.susceptibility?.confidence || risk.susceptibilityConfidence)
        },
        lossEventFrequency: {
          min: Number(risk.parameters?.lossEventFrequency?.min || risk.lossEventFrequencyMin || 0),
          avg: Number(risk.parameters?.lossEventFrequency?.avg || risk.lossEventFrequencyAvg || 0),
          max: Number(risk.parameters?.lossEventFrequency?.max || risk.lossEventFrequencyMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.lossEventFrequency?.confidence || risk.lossEventFrequencyConfidence)
        },
        lossMagnitude: {
          min: Number(risk.parameters?.lossMagnitude?.min || risk.lossMagnitudeMin || 0),
          avg: Number(risk.parameters?.lossMagnitude?.avg || risk.lossMagnitudeAvg || 0),
          max: Number(risk.parameters?.lossMagnitude?.max || risk.lossMagnitudeMax || 0),
          confidence: getConfidenceWithFallback(risk.parameters?.lossMagnitude?.confidence || risk.lossMagnitudeConfidence)
        },
      },

      // Include notes if available
      notes: risk.notes || "",
      itemType: risk.itemType || (isTemplate ? "template" : "instance"),

      // Legacy flat fields for backward compatibility if needed by other components
      inherentRisk: Number(risk.inherentRisk || 0),
      residualRisk: Number(risk.residualRisk || 0),
    }
    : null;

  // Initialize form with default values or existing risk values
  const initialValues = existingRiskValues || {
    ...defaultRiskValues,
    itemType: isTemplate ? "template" : "instance",
  };

  const form = useForm<RiskFormData>({
    resolver: zodResolver(riskFormSchema),
    defaultValues: initialValues,
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
      console.log("Calculating risk with updated parameters (Server-Side Only)...");

      // Get current form values
      const values = form.getValues();

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

      // Always use the POST endpoint with current form data for "what-if" analysis
      // This ensures we calculate based on what the user sees, not what's in the DB
      const calculationEndpoint = `/api/risks/calculate/monte-carlo`;
      const calculationMethod = "POST";

      // Create a minimal data object with the FAIR parameters needed for calculation
      const requestData = {
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

      console.log(`Making API request: ${calculationMethod} ${calculationEndpoint}`);
      const response: any = await apiRequest(
        calculationMethod,
        calculationEndpoint,
        requestData,
      );

      console.log("Server calculation response:", response);

      if (response && typeof response === "object") {
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

        // Update all other calculated fields if present in response
        if (response.lossEventFrequencyMin !== undefined) safeSetValue("lossEventFrequencyMin", response.lossEventFrequencyMin);
        if (response.lossEventFrequencyAvg !== undefined) safeSetValue("lossEventFrequencyAvg", response.lossEventFrequencyAvg);
        if (response.lossEventFrequencyMax !== undefined) safeSetValue("lossEventFrequencyMax", response.lossEventFrequencyMax);

        if (response.lossMagnitudeMin !== undefined) safeSetValue("lossMagnitudeMin", response.lossMagnitudeMin);
        if (response.lossMagnitudeAvg !== undefined) safeSetValue("lossMagnitudeAvg", response.lossMagnitudeAvg);
        if (response.lossMagnitudeMax !== undefined) safeSetValue("lossMagnitudeMax", response.lossMagnitudeMax);

        if (response.threatEventFrequencyMin !== undefined) safeSetValue("threatEventFrequencyMin", response.threatEventFrequencyMin);
        if (response.threatEventFrequencyAvg !== undefined) safeSetValue("threatEventFrequencyAvg", response.threatEventFrequencyAvg);
        if (response.threatEventFrequencyMax !== undefined) safeSetValue("threatEventFrequencyMax", response.threatEventFrequencyMax);

        if (response.susceptibilityMin !== undefined) safeSetValue("susceptibilityMin", response.susceptibilityMin);
        if (response.susceptibilityAvg !== undefined) safeSetValue("susceptibilityAvg", response.susceptibilityAvg);
        if (response.susceptibilityMax !== undefined) safeSetValue("susceptibilityMax", response.susceptibilityMax);

        // Check for warnings/errors
        if (response.error) {
          console.warn("Server calculation warning:", response.error);
          toast({
            title: "Calculation Warning",
            description: response.error,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error calculating risk:", error);
      toast({
        title: "Calculation Failed",
        description: "Could not perform server-side calculation. Please check your connection.",
        variant: "destructive",
      });
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
      if (values.inherentRisk === undefined || isNaN(Number(values.inherentRisk))) {
        values.inherentRisk = 0;
      }

      if (values.residualRisk === undefined || isNaN(Number(values.residualRisk))) {
        values.residualRisk = 0;
      }

      console.log("Submitting with inherentRisk:", values.inherentRisk, "residualRisk:", values.residualRisk);

      // We no longer force a client-side calculation here.
      // The user should have clicked "Run calculations" to see the impact,
      // or the server will handle it on the next fetch/update cycle.
      // We trust the form values as they are.

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

  const residualRiskValue = Number(form.watch("residualRisk") || 0);
  const lossEventFrequencyValue = Number(
    form.watch("lossEventFrequencyAvg") || 0,
  );
  const lossMagnitudeValue = Number(form.watch("lossMagnitudeAvg") || 0);
  const susceptibilityValue = Number(form.watch("susceptibilityAvg") || 0);

  const summaryMetrics = [
    {
      label: "Inherent Risk",
      helper: "Annualized loss before controls",
      value: formatCurrency(calculatedInherentRisk),
    },
    {
      label: "Residual Risk",
      helper: "After mitigations",
      value: formatCurrency(residualRiskValue),
    },
    {
      label: "Loss Event Frequency",
      helper: "Average events per year",
      value: `${lossEventFrequencyValue.toFixed(2)} / yr`,
    },
    {
      label: "Loss Magnitude",
      helper: "Average loss per occurrence",
      value: formatCurrency(lossMagnitudeValue),
    },
  ];

  const handleAssetSelectionChange = (assets: string[]) => {
    setSelectedAssets(assets);
    form.setValue("associatedAssets", assets, { shouldValidate: true });
    try {
      const recalcEvent = new CustomEvent("recalculateRisk");
      window.dispatchEvent(recalcEvent);
    } catch (error) {
      console.warn("Failed to dispatch recalculation event", error);
    }
  };

  const handleManualRecalculation = async () => {
    try {
      setIsRecalculating(true);
      await calculateRisk();
      toast({
        title: "Risk recalculated",
        description: "Derived FAIR values were refreshed.",
      });
    } catch (error) {
      console.error("Manual recalculation failed", error);
      toast({
        title: "Calculation failed",
        description: "Unable to refresh derived values. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          useConceptLayout
            ? "space-y-10 rounded-[28px] bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.02] p-1 pb-10"
            : "space-y-8 pb-8"
        }
      >
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/5 bg-[#040915]/80 px-6 py-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                {isTemplate ? "Risk Template" : risk ? "Edit Risk" : "New Risk"}
              </p>
              {useConceptLayout && null}
            </div>
            <h2 className="text-3xl font-semibold text-white">
              {risk ? risk.name : isTemplate ? "Create Risk Template" : "Create Risk"}
            </h2>
            {!useConceptLayout && (
              <p className="text-sm text-white/60">
                Configure FAIR parameters, associate assets, and quantify exposure without leaving the page.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-full border border-white/20 bg-white/5 px-5 text-white hover:bg-white/10"
              onClick={onClose}
            >
              Cancel
            </Button>
            {risk ? (
              // For update, create a completely separate button
              <Button
                type="button" // Changed to button to prevent form submission
                disabled={mutation.isPending}
                className="gap-1 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  console.log("Update button clicked with manual data sending");
                  if (risk) {
                    try {
                      // Get current form values
                      const formValues = form.getValues();

                      // We don't want to calculate on the client-side
                      // Instead use the values from the risk object directly or make a server call
                      // Leave the current values untouched - server calculation will happen after save

                      // Use current form values for risk
                      // If they are 0, the server recalculation will update them


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
                className="gap-1 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  console.log("Create button clicked using React Query mutation");
                  try {
                    // Get current form values
                    const values = form.getValues();
                    // Use current form values for risk
                    // If they are 0, the server recalculation will update them
                    values.inherentRisk = values.inherentRisk || 0;
                    values.residualRisk = values.residualRisk || 0;
                    values.itemType = isTemplate ? "template" : "instance";
                    mutation.mutate(values as RiskFormData);
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

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr]">
          {/* Left column: risk overview */}
          <div className="space-y-6">
            <GlowCard className="space-y-8">
              <BasicRiskInfo form={form} />
            </GlowCard>
          </div>

          {/* Right column: associations, notes, calculations */}
          <div className="space-y-6">
            <GlowCard className="space-y-6">
              <AssetSelection
                form={form}
                selectedAssetIds={selectedAssets}
                onChange={handleAssetSelectionChange}
              />
            </GlowCard>

            <GlowCard className="space-y-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
                  Notes
                </p>
                <h4 className="text-xl font-semibold text-white">
                  Additional context
                </h4>
              </div>
              <Textarea
                placeholder="Document decisions, assumptions, or mitigation details"
                className="min-h-[140px] rounded-2xl border border-white/10 bg-black/20 text-white placeholder:text-white/40"
                {...form.register("notes")}
              />
            </GlowCard>

            <GlowCard className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Dynamic calculations</h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full border border-white/20 bg-white/5 px-5 text-white hover:bg-white/10"
                  onClick={handleManualRecalculation}
                  disabled={isRecalculating}
                >
                  {isRecalculating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Run Calculations
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {summaryMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-white/50">
                      {metric.helper}
                    </p>
                    <p className="text-xl font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                Susceptibility Avg: {susceptibilityValue.toFixed(2)}
              </div>
            </GlowCard>
          </div>
        </div>

        <div className="space-y-6">
          <GlowCard className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {useConceptLayout ? "" : "Risk Evaluation"}
                </h3>
                <p className="text-sm text-white/60">Linked assets: {selectedAssets.length || 0}</p>
              </div>
            </div>
            <div className="w-full">
              <RiskFormPreviewEditableConcept form={form} selectedAssets={selectedAssets} />
            </div>
          </GlowCard>
        </div>
      </form>
    </Form>
  );
}
