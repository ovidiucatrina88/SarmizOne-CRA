/**
 * Client-side risk calculation utilities
 * 
 * This file provides utility functions for risk calculations in the client,
 * leveraging the shared calculation utilities from our service architecture.
 */

import { Risk, Control, RiskCalculationParams } from '@shared/schema';
import { 
  calculateRiskFromParameters, 
  extractCalculationParamsFromRisk,
  RiskCalculationResult
} from '@shared/utils/calculationManager';

/**
 * Calculate risk from form values
 * 
 * @param formValues The form values to use for calculation
 * @param controls Optional array of controls that affect the risk
 * @returns Calculation results with inherent and residual risk values
 */
export function calculateRiskFromForm(
  formValues: any, 
  controls: Control[] = []
): RiskCalculationResult {
  // Extract calculation parameters from form values
  const params: RiskCalculationParams = {
    // Contact Frequency (CF)
    contactFrequencyMin: parseFloat(formValues.contactFrequencyMin || '0'),
    contactFrequencyAvg: parseFloat(formValues.contactFrequencyAvg || '0'),
    contactFrequencyMax: parseFloat(formValues.contactFrequencyMax || '0'),
    contactFrequencyConfidence: formValues.contactFrequencyConfidence || 'medium',
    
    // Probability of Action (POA)
    probabilityOfActionMin: parseFloat(formValues.probabilityOfActionMin || '0'),
    probabilityOfActionAvg: parseFloat(formValues.probabilityOfActionAvg || '0'),
    probabilityOfActionMax: parseFloat(formValues.probabilityOfActionMax || '0'),
    probabilityOfActionConfidence: formValues.probabilityOfActionConfidence || 'medium',
    
    // Threat Capability (TCap)
    threatCapabilityMin: parseFloat(formValues.threatCapabilityMin || '0'),
    threatCapabilityAvg: parseFloat(formValues.threatCapabilityAvg || '0'),
    threatCapabilityMax: parseFloat(formValues.threatCapabilityMax || '0'),
    threatCapabilityConfidence: formValues.threatCapabilityConfidence || 'medium',
    
    // Resistance Strength (RS)
    resistanceStrengthMin: parseFloat(formValues.resistanceStrengthMin || '0'),
    resistanceStrengthAvg: parseFloat(formValues.resistanceStrengthAvg || '0'),
    resistanceStrengthMax: parseFloat(formValues.resistanceStrengthMax || '0'),
    resistanceStrengthConfidence: formValues.resistanceStrengthConfidence || 'medium',
    
    // Primary Loss Magnitude (PL)
    primaryLossMagnitudeMin: parseFloat(formValues.primaryLossMagnitudeMin || '0'),
    primaryLossMagnitudeAvg: parseFloat(formValues.primaryLossMagnitudeAvg || '0'),
    primaryLossMagnitudeMax: parseFloat(formValues.primaryLossMagnitudeMax || '0'),
    primaryLossMagnitudeConfidence: formValues.primaryLossMagnitudeConfidence || 'medium',
    
    // Secondary Loss Event Frequency (SLEF) - Optional
    secondaryLossEventFrequencyMin: parseFloat(formValues.secondaryLossEventFrequencyMin || '0'),
    secondaryLossEventFrequencyAvg: parseFloat(formValues.secondaryLossEventFrequencyAvg || '0'),
    secondaryLossEventFrequencyMax: parseFloat(formValues.secondaryLossEventFrequencyMax || '0'),
    secondaryLossEventFrequencyConfidence: formValues.secondaryLossEventFrequencyConfidence || 'medium',
    
    // Secondary Loss Magnitude (SLM) - Optional
    secondaryLossMagnitudeMin: parseFloat(formValues.secondaryLossMagnitudeMin || '0'),
    secondaryLossMagnitudeAvg: parseFloat(formValues.secondaryLossMagnitudeAvg || '0'),
    secondaryLossMagnitudeMax: parseFloat(formValues.secondaryLossMagnitudeMax || '0'),
    secondaryLossMagnitudeConfidence: formValues.secondaryLossMagnitudeConfidence || 'medium'
  };
  
  // Use the shared calculation utility
  return calculateRiskFromParameters(params, controls);
}

/**
 * Extract risk calculation parameters from a Risk object
 * 
 * @param risk The Risk object to extract parameters from
 * @returns RiskCalculationParams object
 */
export function extractRiskCalculationParams(risk: Risk): RiskCalculationParams {
  return extractCalculationParamsFromRisk(risk);
}

/**
 * Format risk API response to ensure consistent structure
 * This handles API responses from both old structure and new service architecture
 * 
 * @param response The API response to format
 * @returns Properly formatted response data
 */
export function formatRiskAPIResponse(response: any): any {
  // If the response is already in the expected format, return it as is
  if (typeof response === 'object' && 'inherentRisk' in response) {
    return response;
  }
  
  // If response is in the new service architecture format with a data property
  if (response?.data && typeof response.data === 'object' && 'inherentRisk' in response.data) {
    return response.data;
  }
  
  // If everything else fails, return a default response
  return {
    inherentRisk: 0,
    residualRisk: 0,
    monteCarloResults: {
      mean: 0,
      p10: 0,
      p50: 0,
      p90: 0,
      max: 0
    }
  };
}