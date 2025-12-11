import { z } from 'zod';

// Define confidence enum for FAIR parameters with case insensitivity
const confidenceEnum = z.enum(['low', 'medium', 'high']).transform(val =>
  val.toLowerCase() as 'low' | 'medium' | 'high'
);

// Helper function to handle both string and numeric values
const numericStringOrNumber = z.union([
  z.string(),
  z.number().transform(n => n.toString())
]);

// Helper function for decimal/float values that should remain as numbers
const decimalNumber = z.union([
  z.number(),
  z.string().transform(val => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })
]);

// Base risk schema
export const riskBaseSchema = z.object({
  riskId: z.string(),
  name: z.string(),
  description: z.string().default(''),
  associatedAssets: z.array(z.string()).default([]),
  threatCommunity: z.string().default(''),
  vulnerability: z.string().default(''),
  riskCategory: z.enum(['operational', 'strategic', 'compliance', 'financial']).transform(val => val.toLowerCase()),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  inherentRisk: numericStringOrNumber.default('0'),
  residualRisk: numericStringOrNumber.default('0'),

  // FAIR-U parameters
  threatEventFrequency: numericStringOrNumber.optional(),
  threatEventFrequencyMin: numericStringOrNumber.optional(),
  threatEventFrequencyMax: numericStringOrNumber.optional(),
  threatEventFrequencyML: numericStringOrNumber.optional(),
  threatEventFrequencyConfidence: confidenceEnum.optional(),

  vulnerabilityRating: numericStringOrNumber.optional(),
  vulnerabilityRatingMin: numericStringOrNumber.optional(),
  vulnerabilityRatingMax: numericStringOrNumber.optional(),
  vulnerabilityRatingML: numericStringOrNumber.optional(),
  vulnerabilityRatingConfidence: confidenceEnum.optional(),

  primaryLossMin: numericStringOrNumber.optional(),
  primaryLossMax: numericStringOrNumber.optional(),
  primaryLossML: numericStringOrNumber.optional(),
  primaryLossConfidence: confidenceEnum.optional(),

  secondaryLossMin: numericStringOrNumber.optional(),
  secondaryLossMax: numericStringOrNumber.optional(),
  secondaryLossML: numericStringOrNumber.optional(),
  secondaryLossConfidence: confidenceEnum.optional(),

  // Contact Frequency parameters - Fixed to handle decimal values properly
  contactFrequencyMin: decimalNumber.optional(),
  contactFrequencyAvg: decimalNumber.optional(),
  contactFrequencyMax: decimalNumber.optional(),
  contactFrequencyConfidence: confidenceEnum.optional(),

  // Probability of Action parameters - Fixed to handle decimal values properly
  probabilityOfActionMin: decimalNumber.optional(),
  probabilityOfActionAvg: decimalNumber.optional(),
  probabilityOfActionMax: decimalNumber.optional(),
  probabilityOfActionConfidence: confidenceEnum.optional(),

  // Secondary Loss parameters (crucial for risk calculation)
  secondaryLossMagnitudeMin: numericStringOrNumber.optional(),
  secondaryLossMagnitudeAvg: numericStringOrNumber.optional(),
  secondaryLossMagnitudeMax: numericStringOrNumber.optional(),
  secondaryLossMagnitudeConfidence: confidenceEnum.optional(),
  secondaryLossEventFrequencyMin: decimalNumber.optional(),
  secondaryLossEventFrequencyAvg: decimalNumber.optional(),
  secondaryLossEventFrequencyMax: decimalNumber.optional(),
  secondaryLossEventFrequencyConfidence: confidenceEnum.optional(),

  // Primary Loss Magnitude parameters
  primaryLossMagnitudeMin: numericStringOrNumber.optional(),
  primaryLossMagnitudeAvg: numericStringOrNumber.optional(),
  primaryLossMagnitudeMax: numericStringOrNumber.optional(),
  primaryLossMagnitudeConfidence: confidenceEnum.optional(),

  threatEventFrequencyNotes: z.string().optional(),
  vulnerabilityNotes: z.string().optional(),
  primaryLossNotes: z.string().optional(),
  secondaryLossNotes: z.string().optional(),

  // FAIR-CAM parameters - Fixed to handle decimal values properly
  threatCapability: decimalNumber.optional(),
  threatCapabilityMin: decimalNumber.optional(),
  threatCapabilityAvg: decimalNumber.optional(),
  threatCapabilityMax: decimalNumber.optional(),
  threatCapabilityML: decimalNumber.optional(),
  threatCapabilityConfidence: confidenceEnum.optional(),

  // Resistance Strength parameters - Fixed to handle decimal values properly
  resistanceStrengthMin: decimalNumber.optional(),
  resistanceStrengthAvg: decimalNumber.optional(),
  resistanceStrengthMax: decimalNumber.optional(),
  resistanceStrengthConfidence: confidenceEnum.optional(),

  controlStrength: numericStringOrNumber.optional(),
  controlStrengthMin: numericStringOrNumber.optional(),
  controlStrengthMax: numericStringOrNumber.optional(),
  controlStrengthML: numericStringOrNumber.optional(),
  controlStrengthConfidence: confidenceEnum.optional(),

  lossMagnitude: numericStringOrNumber.optional(),
  lossMagnitudeMin: numericStringOrNumber.optional(),
  lossMagnitudeMax: numericStringOrNumber.optional(),
  lossMagnitudeML: numericStringOrNumber.optional(),
  lossMagnitudeConfidence: confidenceEnum.optional(),
});

// Schema for creating a new risk
export const createRiskSchema = riskBaseSchema;
export type CreateRiskDto = z.infer<typeof createRiskSchema>;

// Schema for updating an existing risk
export const updateRiskSchema = riskBaseSchema.partial();
export type UpdateRiskDto = z.infer<typeof updateRiskSchema>;

// Schema for risk filtering
export const riskFilterSchema = z.object({
  category: z.enum(['operational', 'strategic', 'compliance', 'financial']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assetId: z.string().optional(),
  entityId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'riskId', 'createdAt', 'residualRisk', 'severity']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
});

export type RiskFilterDto = z.infer<typeof riskFilterSchema>;