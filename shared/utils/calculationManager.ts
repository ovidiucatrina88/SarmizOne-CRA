/**
 * Calculation Manager
 * 
 * This utility provides a centralized way to handle risk calculations 
 * across the application, aligning with our service architecture.
 * 
 * It acts as a bridge between the client-side calculation needs and 
 * the server-side services implementation.
 */

import { Risk, Control } from "../schema";
import { calculateInherentRiskValue, calculateResidualRiskValue } from "./calculations";
import { runMonteCarloSimulation } from "./monteCarlo";

/**
 * Interface for FAIR risk calculation parameters
 */
export interface RiskCalculationParams {
  // Contact Frequency (CF)
  contactFrequencyMin: number;
  contactFrequencyAvg: number;
  contactFrequencyMax: number;
  contactFrequencyConfidence: string;
  
  // Probability of Action (POA)
  probabilityOfActionMin: number;
  probabilityOfActionAvg: number;
  probabilityOfActionMax: number;
  probabilityOfActionConfidence: string;
  
  // Threat Capability (TCap)
  threatCapabilityMin: number;
  threatCapabilityAvg: number;
  threatCapabilityMax: number;
  threatCapabilityConfidence: string;
  
  // Resistance Strength (RS)
  resistanceStrengthMin: number;
  resistanceStrengthAvg: number;
  resistanceStrengthMax: number;
  resistanceStrengthConfidence: string;
  
  // Primary Loss Magnitude (PL)
  primaryLossMagnitudeMin: number;
  primaryLossMagnitudeAvg: number;
  primaryLossMagnitudeMax: number;
  primaryLossMagnitudeConfidence: string;
  
  // Secondary Loss Event Frequency (SLEF) - Optional
  secondaryLossEventFrequencyMin: number;
  secondaryLossEventFrequencyAvg: number;
  secondaryLossEventFrequencyMax: number;
  secondaryLossEventFrequencyConfidence: string;
  
  // Secondary Loss Magnitude (SLM) - Optional
  secondaryLossMagnitudeMin: number;
  secondaryLossMagnitudeAvg: number;
  secondaryLossMagnitudeMax: number;
  secondaryLossMagnitudeConfidence: string;
}

/**
 * Standard interface for calculation results returned by any calculation method
 */
export interface RiskCalculationResult {
  inherentRisk: number;
  residualRisk: number;
  monteCarloResults?: {
    mean: number;
    p10: number;
    p50: number;
    p90: number;
    max: number;
  };
}

/**
 * Calculate risk values from a set of FAIR parameters
 * Can be used both on client and server
 * 
 * @param params The FAIR calculation parameters
 * @param controls Optional array of control IDs that affect the risk
 * @returns Risk calculation results with inherent and residual risk values
 */
export function calculateRiskFromParameters(
  params: RiskCalculationParams,
  controls: Control[] = []
): RiskCalculationResult {
  // Calculate inherent risk without controls
  const inherentRisk = calculateInherentRiskValue(params);
  
  // Calculate residual risk with controls
  const residualRisk = calculateResidualRiskValue(params, controls);
  
  // Run Monte Carlo simulation if needed
  const monteCarloResults = runMonteCarloSimulation(params, controls);
  
  return {
    inherentRisk,
    residualRisk,
    monteCarloResults: {
      mean: monteCarloResults.mean,
      p10: monteCarloResults.p10 || monteCarloResults.p05,
      p50: monteCarloResults.p50,
      p90: monteCarloResults.p90 || monteCarloResults.p95,
      max: monteCarloResults.max
    }
  };
}

/**
 * Extract calculation parameters from a risk object for use in calculations
 * 
 * @param risk The risk object to extract parameters from
 * @returns An object with the necessary calculation parameters
 */
export function extractCalculationParamsFromRisk(risk: Risk): RiskCalculationParams {
  return {
    // Use primary fields as source of truth, fall back to legacy fields if primary are not available
    
    // Contact Frequency (CF)
    contactFrequencyMin: risk.contactFrequencyMin || parseFloat(risk.threatEventFrequencyMin || '0'),
    contactFrequencyAvg: risk.contactFrequencyAvg || parseFloat(risk.threatEventFrequencyAvg || '0'),
    contactFrequencyMax: risk.contactFrequencyMax || parseFloat(risk.threatEventFrequencyMax || '0'),
    contactFrequencyConfidence: risk.contactFrequencyConfidence || risk.threatEventFrequencyConfidence || 'medium',
    
    // Probability of Action (POA)
    probabilityOfActionMin: risk.probabilityOfActionMin || 0,
    probabilityOfActionAvg: risk.probabilityOfActionAvg || 0,
    probabilityOfActionMax: risk.probabilityOfActionMax || 0,
    probabilityOfActionConfidence: risk.probabilityOfActionConfidence || 'medium',
    
    // Threat Capability (TCap)
    threatCapabilityMin: risk.threatCapabilityMin || 0,
    threatCapabilityAvg: risk.threatCapabilityAvg || 0,
    threatCapabilityMax: risk.threatCapabilityMax || 0,
    threatCapabilityConfidence: risk.threatCapabilityConfidence || 'medium',
    
    // Resistance Strength (RS)
    resistanceStrengthMin: risk.resistanceStrengthMin || 0,
    resistanceStrengthAvg: risk.resistanceStrengthAvg || 0,
    resistanceStrengthMax: risk.resistanceStrengthMax || 0,
    resistanceStrengthConfidence: risk.resistanceStrengthConfidence || 'medium',
    
    // Primary Loss Magnitude (PL)
    primaryLossMagnitudeMin: risk.primaryLossMagnitudeMin || parseFloat(risk.lossMagnitudeMin || '0'),
    primaryLossMagnitudeAvg: risk.primaryLossMagnitudeAvg || parseFloat(risk.lossMagnitudeAvg || '0'),
    primaryLossMagnitudeMax: risk.primaryLossMagnitudeMax || parseFloat(risk.lossMagnitudeMax || '0'),
    primaryLossMagnitudeConfidence: risk.primaryLossMagnitudeConfidence || risk.lossMagnitudeConfidence || 'medium',
    
    // Secondary Loss Event Frequency (SLEF)
    secondaryLossEventFrequencyMin: risk.secondaryLossEventFrequencyMin || 0,
    secondaryLossEventFrequencyAvg: risk.secondaryLossEventFrequencyAvg || 0,
    secondaryLossEventFrequencyMax: risk.secondaryLossEventFrequencyMax || 0,
    secondaryLossEventFrequencyConfidence: risk.secondaryLossEventFrequencyConfidence || 'medium',
    
    // Secondary Loss Magnitude (SLM)
    secondaryLossMagnitudeMin: risk.secondaryLossMagnitudeMin || 0,
    secondaryLossMagnitudeAvg: risk.secondaryLossMagnitudeAvg || 0,
    secondaryLossMagnitudeMax: risk.secondaryLossMagnitudeMax || 0,
    secondaryLossMagnitudeConfidence: risk.secondaryLossMagnitudeConfidence || 'medium'
  };
}

/**
 * Create a risk object from calculation parameters and basic risk data
 * Used in RiskService to create properly formatted risk objects
 * 
 * @param params The calculation parameters
 * @param baseRisk Basic risk data (ID, name, etc.)
 * @returns A complete risk object with calculation values
 */
export function createRiskFromParams(
  params: RiskCalculationParams,
  baseRisk: Partial<Risk>,
  calculationResult: RiskCalculationResult
): Risk {
  return {
    // Spread base risk properties
    ...baseRisk,
    
    // Set required properties if not already provided
    id: baseRisk.id || 0,
    name: baseRisk.name || '',
    description: baseRisk.description || '',
    riskId: baseRisk.riskId || '',
    associatedAssets: baseRisk.associatedAssets || [],
    threatCommunity: baseRisk.threatCommunity || '',
    vulnerability: baseRisk.vulnerability || '',
    riskCategory: baseRisk.riskCategory || 'operational',
    severity: baseRisk.severity || 'medium',
    status: baseRisk.status || 'active',
    createdAt: baseRisk.createdAt || new Date(),
    updatedAt: baseRisk.updatedAt || new Date(),
    
    // Set calculation parameters
    // Contact Frequency (CF)
    contactFrequencyMin: params.contactFrequencyMin,
    contactFrequencyAvg: params.contactFrequencyAvg,
    contactFrequencyMax: params.contactFrequencyMax,
    contactFrequencyConfidence: params.contactFrequencyConfidence,
    
    // Legacy fields (for backward compatibility)
    threatEventFrequencyMin: params.contactFrequencyMin.toString(),
    threatEventFrequencyAvg: params.contactFrequencyAvg.toString(),
    threatEventFrequencyMax: params.contactFrequencyMax.toString(),
    threatEventFrequencyConfidence: params.contactFrequencyConfidence,
    
    // Probability of Action (POA)
    probabilityOfActionMin: params.probabilityOfActionMin,
    probabilityOfActionAvg: params.probabilityOfActionAvg,
    probabilityOfActionMax: params.probabilityOfActionMax,
    probabilityOfActionConfidence: params.probabilityOfActionConfidence,
    
    // Threat Capability (TCap)
    threatCapabilityMin: params.threatCapabilityMin,
    threatCapabilityAvg: params.threatCapabilityAvg,
    threatCapabilityMax: params.threatCapabilityMax,
    threatCapabilityConfidence: params.threatCapabilityConfidence,
    
    // Resistance Strength (RS)
    resistanceStrengthMin: params.resistanceStrengthMin,
    resistanceStrengthAvg: params.resistanceStrengthAvg,
    resistanceStrengthMax: params.resistanceStrengthMax,
    resistanceStrengthConfidence: params.resistanceStrengthConfidence,
    
    // Primary Loss Magnitude (PL)
    primaryLossMagnitudeMin: params.primaryLossMagnitudeMin,
    primaryLossMagnitudeAvg: params.primaryLossMagnitudeAvg,
    primaryLossMagnitudeMax: params.primaryLossMagnitudeMax,
    primaryLossMagnitudeConfidence: params.primaryLossMagnitudeConfidence,
    
    // Legacy fields (for backward compatibility)
    lossMagnitudeMin: params.primaryLossMagnitudeMin.toString(),
    lossMagnitudeAvg: params.primaryLossMagnitudeAvg.toString(),
    lossMagnitudeMax: params.primaryLossMagnitudeMax.toString(),
    lossMagnitudeConfidence: params.primaryLossMagnitudeConfidence,
    
    // Secondary Loss Event Frequency (SLEF)
    secondaryLossEventFrequencyMin: params.secondaryLossEventFrequencyMin,
    secondaryLossEventFrequencyAvg: params.secondaryLossEventFrequencyAvg,
    secondaryLossEventFrequencyMax: params.secondaryLossEventFrequencyMax,
    secondaryLossEventFrequencyConfidence: params.secondaryLossEventFrequencyConfidence,
    
    // Secondary Loss Magnitude (SLM)
    secondaryLossMagnitudeMin: params.secondaryLossMagnitudeMin,
    secondaryLossMagnitudeAvg: params.secondaryLossMagnitudeAvg,
    secondaryLossMagnitudeMax: params.secondaryLossMagnitudeMax,
    secondaryLossMagnitudeConfidence: params.secondaryLossMagnitudeConfidence,
    
    // Calculation results
    inherentRisk: calculationResult.inherentRisk.toString(),
    residualRisk: calculationResult.residualRisk.toString(),
    
    // Monte Carlo results
    monteCarloMean: calculationResult.monteCarloResults?.mean.toString() || '0',
    monteCarloP10: calculationResult.monteCarloResults?.p10.toString() || '0',
    monteCarloP50: calculationResult.monteCarloResults?.p50.toString() || '0',
    monteCarloP90: calculationResult.monteCarloResults?.p90.toString() || '0',
    monteCarloMax: calculationResult.monteCarloResults?.max.toString() || '0',
    
    // Additional properties needed by the Risk type
    libraryItemId: baseRisk.libraryItemId || null,
    itemType: baseRisk.itemType || 'instance',
    
    // Additional required properties with defaults
    legalEntityId: baseRisk.legalEntityId || null,
    businessCriticality: baseRisk.businessCriticality || 'medium',
    dqrating: baseRisk.dqrating || 'medium',
    controlsRating: baseRisk.controlsRating || 'medium',
    exposure: baseRisk.exposure || 'medium',
    threatRating: baseRisk.threatRating || 'medium',
    vulnerabilityRating: baseRisk.vulnerabilityRating || 'medium',
    impact: baseRisk.impact || 'medium',
    ranking: baseRisk.ranking || 0,
    rankPercentile: baseRisk.rankPercentile || 0,
    recommendedControls: baseRisk.recommendedControls || []
  } as Risk;
}