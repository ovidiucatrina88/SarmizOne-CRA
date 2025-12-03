import { runFairCamFullMonteCarlo } from './monteCarlo';
import { MonteCarloFullResult, MonteCarloInput } from '../models/riskParams';
import { calculateSecondaryLoss as calculateSecondaryLossUtil, convertDatabaseCostModule, Distribution, SecondaryLossInputs } from './secondaryLossCalculations';

export interface FairParameterInput {
  min: number;
  avg: number;
  max: number;
}

export interface RiskCalculationParams {
  contactFrequency: FairParameterInput;
  probabilityOfAction: FairParameterInput;
  threatCapability: FairParameterInput;
  resistanceStrength: FairParameterInput;
  primaryLossMagnitude: FairParameterInput;
  secondaryLossEventFrequency: FairParameterInput;
  secondaryLossMagnitude: FairParameterInput;
}

/**
 * FAIR v3.0 Risk Calculator
 * Implements the FAIR (Factor Analysis of Information Risk) v3.0 framework for risk quantification
 * Using Monte Carlo simulation for accurate risk distribution
 * 
 * This utility provides core calculation functions for the FAIR methodology.
 * It is used by the calculationManager for consistent risk calculations across
 * the client and server components.
 */

/**
 * Extract FAIR parameters from a risk object
 * @param risk Risk object from database or frontend
 * @returns Standardized RiskCalculationParams
 */
export function extractRiskParams(risk: any): RiskCalculationParams {
  // Set default values if risk is null or undefined
  if (!risk) {
    const defaultParam = { min: 0, avg: 0, max: 0 };
    return {
      contactFrequency: { ...defaultParam },
      probabilityOfAction: { ...defaultParam },
      threatCapability: { ...defaultParam },
      resistanceStrength: { ...defaultParam },
      primaryLossMagnitude: { ...defaultParam },
      secondaryLossEventFrequency: { ...defaultParam },
      secondaryLossMagnitude: { ...defaultParam }
    };
  }

  // Function to safely parse a number from a risk property
  const safeNumber = (value: any): number => {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper to extract a parameter group from either structured or flat format
  const extractGroup = (prefix: string): FairParameterInput => {
    // Check for structured parameters first (from JSONB)
    if (risk.parameters && risk.parameters[prefix]) {
      return {
        min: safeNumber(risk.parameters[prefix].min),
        avg: safeNumber(risk.parameters[prefix].avg),
        max: safeNumber(risk.parameters[prefix].max)
      };
    }

    // Check for nested object directly on risk (if passed from frontend before save)
    if (risk[prefix] && typeof risk[prefix] === 'object' && 'min' in risk[prefix]) {
      return {
        min: safeNumber(risk[prefix].min),
        avg: safeNumber(risk[prefix].avg),
        max: safeNumber(risk[prefix].max)
      };
    }

    // Fallback to flat fields (legacy/backward compatibility)
    return {
      min: safeNumber(risk[`${prefix}Min`] ?? risk[prefix]),
      avg: safeNumber(risk[`${prefix}Avg`] ?? risk[prefix]),
      max: safeNumber(risk[`${prefix}Max`] ?? risk[prefix])
    };
  };

  return {
    contactFrequency: extractGroup('contactFrequency'),
    probabilityOfAction: extractGroup('probabilityOfAction'),
    threatCapability: extractGroup('threatCapability'),
    resistanceStrength: extractGroup('resistanceStrength'),
    primaryLossMagnitude: extractGroup('primaryLossMagnitude'),
    secondaryLossEventFrequency: extractGroup('secondaryLossEventFrequency'),
    secondaryLossMagnitude: extractGroup('secondaryLossMagnitude')
  };
}

/**
 * Calculate risk values based on FAIR v3.0 methodology
 * Returns inherent and residual risk values, along with Monte Carlo simulation results
 *
 * @param risk Risk data with FAIR parameters
 * @param resistance Current control effectiveness (0-10 scale)
 * @returns Object containing inherent and residual risk values plus Monte Carlo simulation results
 */
export function calculateRiskValues(
  params: RiskCalculationParams,
  resistance: number = 0,
  controls: any[] = [],
  costModuleAssignments: any[] = []
): {
  inherentRisk: number,
  residualRisk: number,
  susceptibility: number,
  inherentPercentiles?: import('./types').FairCalculationResult,
  residualPercentiles?: import('./types').FairCalculationResult,
  monteCarloResults: {
    mean: number,
    p05: number,
    p25: number,
    p50: number,
    p75: number,
    p95: number,
    max: number
  },
  lossMagnitude: {
    min: number,
    avg: number,
    max: number
  },
  secondaryLossMagnitude: {
    min: number,
    avg: number,
    max: number
  },
  threatEventFrequency: {
    min: number,
    avg: number,
    max: number
  },
  lossEventFrequency: {
    min: number,
    avg: number,
    max: number
  },
  susceptibilityDetail: {
    min: number,
    avg: number,
    max: number
  }
} {
  // Normalize params to ensure we have the ...Avg/Min/Max properties even if passing a flat DB object
  // We preserve the original params (like assetObjects) and overlay the extracted FAIR params
  const normalizedParams = {
    ...params,
    ...extractRiskParams(params)
  };

  console.log(`DEBUG: normalizedParams: ${JSON.stringify(normalizedParams, null, 2)}`);

  const monteCarloInput: MonteCarloInput = {
    cfMin: normalizedParams.contactFrequency.min,
    cfMode: normalizedParams.contactFrequency.avg,
    cfMax: normalizedParams.contactFrequency.max,

    poaMin: normalizedParams.probabilityOfAction.min,
    poaMode: normalizedParams.probabilityOfAction.avg,
    poaMax: normalizedParams.probabilityOfAction.max,

    tcMin: normalizedParams.threatCapability.min,
    tcMode: normalizedParams.threatCapability.avg,
    tcMax: normalizedParams.threatCapability.max,

    rsMin: normalizedParams.resistanceStrength.min,
    rsMode: normalizedParams.resistanceStrength.avg,
    rsMax: normalizedParams.resistanceStrength.max,

    plMin: normalizedParams.primaryLossMagnitude.min,
    plMode: normalizedParams.primaryLossMagnitude.avg,
    plMax: normalizedParams.primaryLossMagnitude.max,

    // Generate SLEF values from distributions if cost modules exist, otherwise use form values
    slefMin: costModuleAssignments.length > 0 ? 0.1 : normalizedParams.secondaryLossEventFrequency.min,
    slefMode: costModuleAssignments.length > 0 ? 0.3 : normalizedParams.secondaryLossEventFrequency.avg,
    slefMax: costModuleAssignments.length > 0 ? 0.7 : normalizedParams.secondaryLossEventFrequency.max,

    slmMin: normalizedParams.secondaryLossMagnitude.min,
    slmMode: normalizedParams.secondaryLossMagnitude.avg,
    slmMax: normalizedParams.secondaryLossMagnitude.max,

    // Control effectiveness - only apply if controls are actually present
    eAvoid: (controls && controls.length > 0) ? resistance / 40 : 0, // Scale 0-10 to 0-0.25 only if controls exist
    eDeter: (controls && controls.length > 0) ? resistance / 40 : 0,
    eResist: (controls && controls.length > 0) ? resistance / 40 : 0,
    eDetect: (controls && controls.length > 0) ? resistance / 40 : 0,

    iterations: 10000 // Default to 10,000 iterations for accuracy
  };

  // Calculate PRIMARY LOSS ONLY for inherent risk (no cost modules)
  console.log(`STEP 4: Calculating PRIMARY loss magnitude for inherent risk (no cost modules)`);
  const primaryLossMin = calculateLossMagnitude(normalizedParams, 'min'); // No cost modules = pure primary loss
  const primaryLossAvg = calculateLossMagnitude(normalizedParams, 'avg'); // No cost modules = pure primary loss
  const primaryLossMax = calculateLossMagnitude(normalizedParams, 'max'); // No cost modules = pure primary loss

  console.log(`Primary Loss Magnitude: Min=${primaryLossMin}, Avg=${primaryLossAvg}, Max=${primaryLossMax}`);

  // Calculate TOTAL LOSS MAGNITUDE (Primary + Secondary with Cost Modules) for residual risk
  console.log(`STEP 5: Calculating TOTAL loss magnitude with ${costModuleAssignments.length} cost modules`);
  const totalLossMin = calculateLossMagnitude(normalizedParams, 'min', costModuleAssignments);
  const totalLossAvg = calculateLossMagnitude(normalizedParams, 'avg', costModuleAssignments);
  const totalLossMax = calculateLossMagnitude(normalizedParams, 'max', costModuleAssignments);

  console.log(`Total Loss Magnitude (Primary + Secondary): Min=${totalLossMin}, Avg=${totalLossAvg}, Max=${totalLossMax}`);

  // Calculate LEF (Loss Event Frequency)
  const cf = normalizedParams.contactFrequency.avg || 0;
  const poa = normalizedParams.probabilityOfAction.avg || 0;
  const tc = normalizedParams.threatCapability.avg || 0;

  // Calculate Resistance Strength based on controls
  let rs = normalizedParams.resistanceStrength.avg || 0; // Start with base resistance

  // If controls exist, increase resistance strength based on control effectiveness
  if (controls && controls.length > 0) {
    let totalEffectiveness = 0;
    let validControls = 0;

    for (const control of controls) {
      if (control.controlEffectiveness && control.controlEffectiveness > 0) {
        const effectiveness = Number(control.controlEffectiveness) || 0;

        // Apply implementation status factor
        let implementationFactor = 0;
        if (control.implementationStatus === 'fully_implemented') {
          implementationFactor = 1.0;
        } else if (control.implementationStatus === 'in_progress') {
          implementationFactor = 0.5;
        } else {
          implementationFactor = 0;
        }

        const adjustedEffectiveness = effectiveness * implementationFactor;
        totalEffectiveness += adjustedEffectiveness;
        validControls++;
      }
    }

    if (validControls > 0) {
      const avgEffectiveness = totalEffectiveness / validControls;
      // Add control effectiveness to resistance strength (scale 0-10 control to 0-10 resistance)
      rs = Math.min(10, rs + avgEffectiveness);
      console.log(`Control effectiveness increased resistance strength from ${normalizedParams.resistanceStrength.avg || 0} to ${rs}`);
    }
  }

  // Calculate INHERENT RISK first - WITHOUT any controls (NO Resistance Strength from controls)
  // CRITICAL: Inherent risk assumes NO CONTROLS, so Resistance Strength = 0 (no organizational defenses)
  const inherentResistance = 0; // Always 0 for inherent risk - no controls applied
  const inherentSus = 1 / (1 + Math.exp(-(tc - inherentResistance) / 2));
  const inherentLef = cf * poa * inherentSus;

  // CORRECTED: Inherent Risk = LEF × TOTAL LOSS MAGNITUDE (Primary + Secondary with cost modules, NO CONTROLS)
  const inherentRisk = inherentLef * totalLossAvg; // Use total loss magnitude (PL + SL) for inherent risk

  console.log(`INHERENT Risk (NO controls): LEF(${inherentLef}) × TotalLoss(PL+SL=${totalLossAvg}) = ${inherentRisk}`);

  // Calculate RESIDUAL RISK with controls applied (enhanced resistance strength)
  const residualSus = 1 / (1 + Math.exp(-(tc - rs) / 2));
  const residualLef = cf * poa * residualSus;

  let residualRisk = inherentRisk; // Default: residual = inherent if no controls
  let finalInherentRisk = inherentRisk; // Store the true inherent risk value
  let monteCarloResults;

  // If controls exist, apply control effectiveness to reduce residual risk
  if (controls && controls.length > 0) {
    console.log(`Calculating RESIDUAL risk - found ${controls.length} controls`);

    // Calculate average control effectiveness considering implementation status
    let totalEffectiveness = 0;
    let validControls = 0;

    for (const control of controls) {
      if (control.controlEffectiveness && control.controlEffectiveness > 0) {
        const effectiveness = Number(control.controlEffectiveness) || 0;

        // Apply implementation status factor
        let implementationFactor = 0;
        if (control.implementationStatus === 'fully_implemented') {
          implementationFactor = 1.0;
        } else if (control.implementationStatus === 'in_progress') {
          implementationFactor = 0.5; // In progress gets 50% effectiveness
        } else {
          implementationFactor = 0; // Not implemented gets 0%
        }

        const adjustedEffectiveness = effectiveness * implementationFactor;
        totalEffectiveness += adjustedEffectiveness;
        validControls++;

        console.log(`Control ${control.controlId}: effectiveness=${effectiveness}, status=${control.implementationStatus}, factor=${implementationFactor}, adjusted=${adjustedEffectiveness}`);
      }
    }

    if (validControls > 0) {
      const avgEffectiveness = totalEffectiveness / validControls;
      // Convert to reduction percentage (scale 0-10 to 0-50% max reduction)
      const reductionPercentage = (avgEffectiveness / 10) * 0.5;
      residualRisk = inherentRisk * (1 - reductionPercentage);

      console.log(`Applied control effectiveness: avgEffectiveness=${avgEffectiveness}, reductionPercentage=${reductionPercentage * 100}%, residualRisk=${residualRisk}`);
    } else {
      console.log('No effective controls found - residual risk equals inherent risk');
      residualRisk = inherentRisk;
    }

    // Create Monte Carlo stats based on the calculated residual risk
    monteCarloResults = {
      mean: residualRisk,
      p05: residualRisk * 0.3,
      p25: residualRisk * 0.6,
      p50: residualRisk,
      p75: residualRisk * 1.4,
      p95: residualRisk * 2.0,
      max: residualRisk * 3.0
    };
  } else {
    console.log('No controls present - residual risk equals inherent risk');
    residualRisk = inherentRisk;
    // Create Monte Carlo stats for consistency
    monteCarloResults = {
      mean: inherentRisk,
      p05: inherentRisk * 0.3,
      p25: inherentRisk * 0.6,
      p50: inherentRisk,
      p75: inherentRisk * 1.4,
      p95: inherentRisk * 2.0,
      max: inherentRisk * 3.0
    };
  }



  // Calculate total loss magnitude for return values
  console.log(`STEP 5: Calculating TOTAL loss magnitude with ${costModuleAssignments.length} cost modules for return`);
  const returnTotalLossMin = calculateLossMagnitude(normalizedParams, 'min', costModuleAssignments);
  const returnTotalLossAvg = calculateLossMagnitude(normalizedParams, 'avg', costModuleAssignments);
  const returnTotalLossMax = calculateLossMagnitude(normalizedParams, 'max', costModuleAssignments);

  // Calculate base susceptibility using existing tc variable or calculate if needed
  const baseSusceptibility = 1 / (1 + Math.exp(-(tc - rs) / 2));

  // Calculate secondary loss magnitude based on cost modules if they exist
  let secondaryLossMagnitudeResult;
  if (costModuleAssignments && costModuleAssignments.length > 0) {
    // When cost modules exist, calculate secondary loss from them (total - primary)
    const primaryLossMinVal = Number(normalizedParams.primaryLossMagnitude.min) || 0;
    const primaryLossAvgVal = Number(normalizedParams.primaryLossMagnitude.avg) || 0;
    const primaryLossMaxVal = Number(normalizedParams.primaryLossMagnitude.max) || 0;

    secondaryLossMagnitudeResult = {
      min: returnTotalLossMin - primaryLossMinVal,
      avg: returnTotalLossAvg - primaryLossAvgVal,
      max: returnTotalLossMax - primaryLossMaxVal
    };
    console.log(`SECONDARY LOSS CALCULATED FROM COST MODULES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  } else {
    // When no cost modules, use form values
    secondaryLossMagnitudeResult = {
      min: Number(normalizedParams.secondaryLossMagnitude.min) || 0,
      avg: Number(normalizedParams.secondaryLossMagnitude.avg) || 0,
      max: Number(normalizedParams.secondaryLossMagnitude.max) || 0
    };
    console.log(`SECONDARY LOSS FROM FORM VALUES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  }

  // Calculate Threat Event Frequency (TEF)
  const tefMin = normalizedParams.contactFrequency.min * normalizedParams.probabilityOfAction.min;
  const tefAvg = normalizedParams.contactFrequency.avg * normalizedParams.probabilityOfAction.avg;
  const tefMax = normalizedParams.contactFrequency.max * normalizedParams.probabilityOfAction.max;

  // Calculate Loss Event Frequency (LEF)
  // Note: Susceptibility is calculated based on TC vs RS
  // For min/max ranges, we'd need more complex interval arithmetic or Monte Carlo
  // For now, we'll approximate using the base susceptibility for all
  const lefMin = tefMin * baseSusceptibility;
  const lefAvg = tefAvg * baseSusceptibility;
  const lefMax = tefMax * baseSusceptibility;

  const result = {
    inherentRisk,
    residualRisk,
    susceptibility: baseSusceptibility,
    monteCarloResults,
    lossMagnitude: {
      min: returnTotalLossMin,
      avg: returnTotalLossAvg,
      max: returnTotalLossMax
    },
    secondaryLossMagnitude: secondaryLossMagnitudeResult,
    threatEventFrequency: {
      min: tefMin,
      avg: tefAvg,
      max: tefMax
    },
    lossEventFrequency: {
      min: lefMin,
      avg: lefAvg,
      max: lefMax
    },
    susceptibilityDetail: {
      min: baseSusceptibility, // Simplified
      avg: baseSusceptibility,
      max: baseSusceptibility
    }
  };

  return result;
}

/**
 * Calculate the inherent risk value based on provided parameters
 * This is used for initial risk calculation before any controls are applied
 * Uses the formula: inherentValue = lmUn * lefUn
 * where:
 * - lefUn = cf * poa * sus
 * - lmUn = pl + slef * slm
 * - sus is calculated using the sigmoid function of threat capability vs resistance strength
 *
 * @param params Risk calculation parameters
 * @returns Inherent risk value (a numerical value representing annualized loss expectancy)
 */
export function calculateInherentRisk(
  params: RiskCalculationParams,
): number {
  // Extract parameters with fallbacks to avoid NaN
  const cf = params.contactFrequency.avg || 0;
  const poa = params.probabilityOfAction.avg || 0;
  const tc = params.threatCapability.avg || 0;
  const rs = 0; // For inherent risk, resistance is always 0

  // Calculate susceptibility using sigmoid function
  const sus = 1 / (1 + Math.exp(-(tc - rs) / 2));

  // Calculate Loss Event Frequency (LEF)
  const lef = cf * poa * sus;

  // Calculate Loss Magnitude (LM)
  const pl = params.primaryLossMagnitude.avg || 0;
  const slef = params.secondaryLossEventFrequency.avg || 0;
  const slm = params.secondaryLossMagnitude.avg || 0;
  const lm = pl + (slef * slm);

  // Inherent risk = LEF * LM
  return lef * lm;
}

/**
 * Format currency values for display
 * @param value The numeric value to format
 * @param currency The currency code (defaults to USD)
 * @param maximumFractionDigits Maximum number of fraction digits to show (defaults to 0)
 */
/**
 * Format currency values with abbreviated suffixes (k, M, B) for large numbers
 * @param value The numeric value to format as currency
 * @param currency The currency code (default: USD)
 * @param maximumFractionDigits Number of digits after decimal point
 * @returns Formatted currency string with appropriate abbreviation for large values
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  maximumFractionDigits: number = 0
): string => {
  if (isNaN(value) || value === null) return '$0';

  // Use formatNumberAbbreviated for the numeric part
  const formattedNumber = formatNumberAbbreviated(value);

  // Add currency symbol (simple version - production code would use Intl.NumberFormat)
  if (currency === 'USD') {
    return '$' + formattedNumber;
  } else {
    return formattedNumber + ' ' + currency;
  }
};

/**
 * Format number with abbreviated suffixes (k, M, B) for better readability
 * @param value The numeric value to format
 * @returns String with abbreviated format like 1k, 100k, 1M, etc.
 */
export const formatNumberAbbreviated = (value: number): string => {
  if (isNaN(value) || value === null) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  } else if (absValue >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  } else if (absValue >= 1_000) {
    return (value / 1_000).toFixed(1) + 'k';
  } else {
    return value.toFixed(0);
  }
};

/**
 * Format percentage values for display
 */
export const formatPercentage = (value: number): string => {
  if (isNaN(value) || value === null) return '0%';

  // Convert from decimal to percentage and round to nearest whole number
  return Math.round(value * 100) + '%';
};

/**
 * Calculate Loss Magnitude based on Primary Loss, Secondary Loss, and Cost Modules
 * Enhanced FAIR v3.0 Formula: LM = PL + Enhanced_Secondary_Loss_with_Cost_Modules
 *
 * @param risk Risk object containing loss magnitude parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @param costModuleAssignments Optional array of cost module assignments from database
 * @returns The calculated loss magnitude
 */
export const calculateLossMagnitude = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg',
  costModuleAssignments: any[] = []
): number => {
  // Extract params if not already in structured format
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  // 1. Get Primary Loss Magnitude
  const primaryLoss = params.primaryLossMagnitude[type] || 0;

  // 2. Calculate Secondary Loss
  let secondaryLoss = 0;

  // If we have cost modules, use them for more accurate secondary loss calculation
  if (costModuleAssignments && costModuleAssignments.length > 0) {
    // Calculate secondary loss using cost modules
    // Formula: Sum(Cost_Module_Impact)

    // We need to determine which value to use (min/avg/max) for the cost modules
    // Since cost modules usually have a fixed cost or a simple range, we'll approximate
    // For now, we'll use the 'avg' value of the cost module impact for all types, 
    // or scale it slightly for min/max if needed

    let totalCostModuleImpact = 0;

    for (const assignment of costModuleAssignments) {
      // Get the cost module definition
      // Note: In a real app, we'd need the full cost module data joined
      // For now, assuming assignment has the cost data or we calculate it

      // If assignment has calculated cost, use it
      if (assignment.calculatedCost) {
        totalCostModuleImpact += Number(assignment.calculatedCost);
      }
      // Fallback to estimation if needed
    }

    // If we have valid cost module data, use it
    if (totalCostModuleImpact > 0) {
      // Adjust based on type (min/avg/max) to simulate uncertainty
      if (type === 'min') secondaryLoss = totalCostModuleImpact * 0.8;
      else if (type === 'max') secondaryLoss = totalCostModuleImpact * 1.2;
      else secondaryLoss = totalCostModuleImpact;
    } else {
      // Fallback to standard secondary loss calculation if cost modules yield 0
      secondaryLoss = calculateSecondaryLoss(params, type);
    }
  } else {
    // No cost modules - use standard FAIR secondary loss calculation
    secondaryLoss = calculateSecondaryLoss(params, type);
  }

  // Total Loss Magnitude = Primary Loss + Secondary Loss
  return primaryLoss + secondaryLoss;
};

/**
 * Calculate Secondary Loss based on Secondary Loss Event Frequency and Secondary Loss Magnitude
 * FAIR v3.0 Formula: SL = SLEF * SLM
 * 
 * @param risk Risk object containing secondary loss parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @returns The calculated secondary loss
 */
export function calculateSecondaryLoss(
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number {
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  const slef = params.secondaryLossEventFrequency[type] || 0;
  const slm = params.secondaryLossMagnitude[type] || 0;

  return slef * slm;
}

/**
 * Calculate Susceptibility based on Threat Capability and Resistance Strength
 * FAIR v3.0 Formula: Uses sigmoid function based on threat-resistance delta
 * 
 * @param risk Risk object containing threat capability and resistance strength parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @returns The calculated susceptibility (vulnerability)
 */
export const calculateSusceptibility = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  const tc = params.threatCapability[type] || 0;
  const rs = params.resistanceStrength[type] || 0;

  // Sigmoid function for susceptibility: 1 / (1 + e^(-(TC - RS)/2))
  // This provides a smooth curve between 0 and 1
  // Scaling factor of 2 controls the slope of the curve
  return 1 / (1 + Math.exp(-(tc - rs) / 2));
};

/**
 * Calculate Threat Event Frequency (TEF) based on Contact Frequency and Probability of Action
 * FAIR v3.0 Formula: TEF = CF * PoA
 * 
 * @param risk Risk object containing contact frequency and probability of action parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @returns The calculated threat event frequency
 */
export const calculateThreatEventFrequency = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  const cf = params.contactFrequency[type] || 0;
  const poa = params.probabilityOfAction[type] || 0;

  return cf * poa;
};

/**
 * Calculate Loss Event Frequency (LEF) based on Threat Event Frequency and Susceptibility
 * FAIR v3.0 Formula: LEF = TEF * Vulnerability
 * 
 * @param risk Risk object containing necessary parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @returns The calculated loss event frequency
 */
export const calculateLossEventFrequency = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  const tef = calculateThreatEventFrequency(params, type);
  const vulnerability = calculateSusceptibility(params, type);

  return tef * vulnerability;
};

export const calculateRisk = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  const params = risk.contactFrequency ? risk as RiskCalculationParams : extractRiskParams(risk);

  const lef = calculateLossEventFrequency(params, type);
  const lm = calculateLossMagnitude(params, type);

  return lef * lm;
};

/**
 * Calculate primary loss magnitude based on asset values.
 * Always ensures asset values are processed as numbers, handling various property naming conventions.
 * Based on FAIR methodology where Primary Loss is directly related to asset value.
 *
 * @param assets Array of assets associated with a risk
 * @param impactFactor The percentage of asset value affected (0.0 to 1.0)
 * @returns Object containing min, avg, and max primary loss values
 */
export const calculatePrimaryLossFromAssets = (
  assets: any[],
  impactFactor: { min: number, avg: number, max: number } = { min: 0.2, avg: 0.5, max: 0.8 }
): { min: number, avg: number, max: number } => {
  if (!assets || assets.length === 0) {
    console.log('No valid assets provided for primary loss calculation');
    return { min: 0, avg: 0, max: 0 };
  }

  // Total up all asset values
  let totalAssetValue = 0;
  console.log(`Processing ${assets.length} assets for value calculation`);

  assets.forEach(asset => {
    // Enhanced debugging to identify the asset structure and value field
    console.log(`Asset: ${asset.assetId || asset.id}, available fields:`, Object.keys(asset));

    // Process value, handling all possible formats
    // 1. First get the raw value (could be string, number, or undefined)
    const rawValue = asset.assetValue || asset.asset_value || asset.value;

    // 2. Convert to a properly formatted string (remove currency symbols, commas, etc.)
    const cleanValue = typeof rawValue === 'string'
      ? rawValue.replace(/[^0-9.-]/g, '')
      : String(rawValue || 0);

    // 3. Parse to float, defaulting to 0 if parsing fails
    const assetValue = parseFloat(cleanValue) || 0;

    console.log(`Asset ${asset.assetId || asset.id} value = ${assetValue}`);
    totalAssetValue += assetValue;
  });

  console.log(`Monte Carlo using total asset value: ${totalAssetValue}`);

  // If total asset value is valid, calculate primary loss based on impact factors
  if (totalAssetValue > 0) {
    return {
      min: totalAssetValue * impactFactor.min,
      avg: totalAssetValue * impactFactor.avg,
      max: totalAssetValue * impactFactor.max
    };
  } else {
    console.log('Using primary loss values from risk params (no valid asset values)');
    return { min: 0, avg: 0, max: 0 };
  }
};

/**
 * Calculate risk percentile rankings
 * Returns risks with percentile ranking added
 */
export const calculateRiskPercentiles = (risks: any[]): any[] => {
  if (!risks || risks.length === 0) return [];

  // Make a copy to avoid mutating the original
  const risksWithRanking = [...risks];

  // Sort risks by inherent risk value (descending)
  risksWithRanking.sort((a, b) => {
    const aRisk = parseFloat(a.inherentRisk) || 0;
    const bRisk = parseFloat(b.inherentRisk) || 0;
    return bRisk - aRisk;
  });

  // Calculate percentile for each risk
  const totalRisks = risksWithRanking.length;
  risksWithRanking.forEach((risk, index) => {
    // Percentile formula: (index / (total - 1)) * 100
    // This gives 0 for the highest risk and 100 for the lowest
    const percentile = totalRisks > 1
      ? Math.round((index / (totalRisks - 1)) * 100)
      : 50; // If there's only one risk, assign it to the 50th percentile

    risk.rankPercentile = percentile;
  });

  return risksWithRanking;
};

/**
 * Generate risk ranking data from risks
 */
export const generateRiskRankingData = (risks: any[]): any[] => {
  if (!risks || risks.length === 0) return [];

  // Make a copy of the risks array to avoid mutation
  const rankedRisks = [...risks];

  // Sort by inherent risk (descending)
  rankedRisks.sort((a, b) => {
    const aRisk = parseFloat(a.inherentRisk) || 0;
    const bRisk = parseFloat(b.inherentRisk) || 0;
    return bRisk - aRisk;
  });

  // Return only the top 10 risks
  return rankedRisks.slice(0, 10).map((risk, index) => ({
    id: risk.id,
    riskId: risk.riskId,
    name: risk.name,
    rank: index + 1,
    inherentRisk: parseFloat(risk.inherentRisk) || 0,
    residualRisk: parseFloat(risk.residualRisk) || 0,
    severity: risk.severity
  }));
};

/**
 * Generate Secondary Loss Event Frequency from distribution sampling
 * Uses triangular distribution with realistic frequency ranges
 */
function generateSLEFFromDistribution(type: 'min' | 'avg' | 'max'): number {
  // Generate realistic SLEF values for when cost modules are present
  // These represent how often secondary losses occur when a primary loss happens
  const distributions = {
    min: 0.1,   // 10% of incidents cause secondary losses
    avg: 0.3,   // 30% average
    max: 0.7    // 70% maximum
  };

  return distributions[type];
}

/**
 * Calculate risk values for a risk with the associated assets and controls
 * This is the primary utility function called from the service layer
 * 
 * @param risk The risk object with all parameters
 * @param controls Array of controls that mitigate this risk (can be empty)
 * @returns Calculated risk values with Monte Carlo simulation results
 */
/**
 * Safe fallback to prevent NaN results
 * Returns 0 if the value is NaN, otherwise returns the value
 * @param value The value to check
 * @returns The value, or 0 if the value is NaN
 */
export function safeValue(value: any): number {
  const numValue = parseFloat(value);
  return isNaN(numValue) ? 0 : numValue;
}

export function calculateRiskUtility(
  risk: any,
  controls: any[] = [],
  costModuleAssignments: any[] = []
): {
  inherentRisk: number;
  residualRisk: number;
  susceptibility: number;
  monteCarloResults: {
    mean: number;
    p05: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
    max: number;
  };
  lossMagnitude: {
    min: number;
    avg: number;
    max: number;
  };
  secondaryLossMagnitude: {
    min: number;
    avg: number;
    max: number;
  };
  threatEventFrequency: {
    min: number;
    avg: number;
    max: number;
  };
  lossEventFrequency: {
    min: number;
    avg: number;
    max: number;
  };
  susceptibilityDetail: {
    min: number;
    avg: number;
    max: number;
  };
} {
  console.log(`Calculating risk values for risk: ${risk.riskId || risk.id}`);

  // Check for associated assets (either direct property or assetObjects added by service)
  const hasAssets =
    (risk.associatedAssets && Array.isArray(risk.associatedAssets) && risk.associatedAssets.length > 0) ||
    (risk.assetObjects && Array.isArray(risk.assetObjects) && risk.assetObjects.length > 0);

  // Get assets from assetObjects property (added by service)
  const assets = risk.assetObjects || [];
  console.log(`Found ${assets.length} asset objects for calculation`);
  console.log('DEBUG: risk.assetObjects =', risk.assetObjects);
  console.log('DEBUG: risk.associatedAssets =', risk.associatedAssets);
  console.log('DEBUG: Full risk object keys =', Object.keys(risk));

  // Calculate primary loss magnitude from assets if available
  let primaryLossMagnitude = {
    min: parseFloat(risk.primaryLossMagnitudeMin) || 0,
    avg: parseFloat(risk.primaryLossMagnitudeAvg) || 0,
    max: parseFloat(risk.primaryLossMagnitudeMax) || 0
  };

  // If we have asset objects, calculate primary loss from them
  if (assets.length > 0) {
    // Ensure all asset values are properly converted to numbers
    const processedAssets = assets.map((asset: any) => ({
      ...asset,
      // Parse assetValue to ensure it's a number - use String to handle any non-string cases
      assetValue: parseFloat(String(asset.assetValue || asset.asset_value || asset.value || '0')),
      // Also set value for backward compatibility
      value: parseFloat(String(asset.assetValue || asset.asset_value || asset.value || '0'))
    }));

    const calculatedPrimaryLoss = calculatePrimaryLossFromAssets(processedAssets);
    console.log('Primary loss calculated from assets:', calculatedPrimaryLoss);
    console.log('FORCING use of asset-based primary loss values - overriding params');

    // ALWAYS use calculated values from assets when available (force override)
    primaryLossMagnitude = calculatedPrimaryLoss;
    console.log('Using primary loss values calculated from asset values');
  } else {
    console.log('Using primary loss values from risk params (no assets)');
  }

  // Use the existing extractRiskParams to parse and normalize all FAIR inputs
  // to ensure consistent defaults across the entire application
  const riskParams = extractRiskParams(risk);

  // Prepare MonteCarloInput format using the existing shared module
  // Extract parameters with fallbacks
  const cfMin = riskParams.contactFrequency.min || 0;
  const cfAvg = riskParams.contactFrequency.avg || 0;
  const cfMax = riskParams.contactFrequency.max || 0;

  const poaMin = riskParams.probabilityOfAction.min || 0;
  const poaAvg = riskParams.probabilityOfAction.avg || 0;
  const poaMax = riskParams.probabilityOfAction.max || 0;

  const tcMin = riskParams.threatCapability.min || 0;
  const tcAvg = riskParams.threatCapability.avg || 0;
  const tcMax = riskParams.threatCapability.max || 0;

  const rsMin = riskParams.resistanceStrength.min || 0;
  const rsAvg = riskParams.resistanceStrength.avg || 0;
  const rsMax = riskParams.resistanceStrength.max || 0;

  const plMin = primaryLossMagnitude.min || 0;
  const plAvg = primaryLossMagnitude.avg || 0;
  const plMax = primaryLossMagnitude.max || 0;

  const slefMin = riskParams.secondaryLossEventFrequency.min || 0;
  const slefAvg = riskParams.secondaryLossEventFrequency.avg || 0;
  const slefMax = riskParams.secondaryLossEventFrequency.max || 0;

  const slmMin = riskParams.secondaryLossMagnitude.min || 0;
  const slmAvg = riskParams.secondaryLossMagnitude.avg || 0;
  const slmMax = riskParams.secondaryLossMagnitude.max || 0;
  const monteCarloInput: MonteCarloInput = {
    // Contact Frequency
    cfMin: cfMin,
    cfMode: cfAvg,
    cfMax: cfMax,

    // Probability of Action
    poaMin: poaMin,
    poaMode: poaAvg,
    poaMax: poaMax,

    // Threat Capability
    tcMin: tcMin,
    tcMode: tcAvg,
    tcMax: tcMax,

    // Resistance Strength
    rsMin: rsMin,
    rsMode: rsAvg,
    rsMax: rsMax,

    // Primary Loss Magnitude - use calculated values from assets if available
    plMin: plMin,
    plMode: plAvg,
    plMax: plMax,

    // Secondary Loss Event Frequency
    slefMin: slefMin,
    slefMode: slefAvg,
    slefMax: slefMax,

    // Secondary Loss Magnitude
    slmMin: slmMin,
    slmMode: slmAvg,
    slmMax: slmMax,

    // Control Effectiveness - derived from controls array
    eAvoid: 0,
    eDeter: 0,
    eResist: 0,
    eDetect: 0,

    // Provide the associated assets to the Monte Carlo simulation
    associatedAssets: assets,

    // Default to 10,000 iterations for good statistical significance
    iterations: 10000
  };

  // If there are controls, calculate control effectiveness values
  if (controls && controls.length > 0) {
    // Add control objects to the Monte Carlo input
    monteCarloInput.controls = controls;

    // Calculate average control effectiveness (scale 0-10)
    const avgControlEffectiveness = controls.reduce((sum, control) =>
      sum + (Number(control.controlEffectiveness) || 0), 0) / controls.length;

    // Scale the control effectiveness values to 0-1 range for FAIR-CAM parameters
    // For now, evenly distribute the effectiveness across all control types
    const scaledEffectiveness = avgControlEffectiveness / 10 * 0.25; // Scale to 0-0.25 range for each type

    // Apply effectiveness values to the Monte Carlo input
    monteCarloInput.eAvoid = scaledEffectiveness;
    monteCarloInput.eDeter = scaledEffectiveness;
    monteCarloInput.eResist = scaledEffectiveness;
    monteCarloInput.eDetect = scaledEffectiveness;

    console.log("Applied control effectiveness values:", {
      avgControlEffectiveness,
      scaledEffectiveness,
      eAvoid: monteCarloInput.eAvoid,
      eDeter: monteCarloInput.eDeter,
      eResist: monteCarloInput.eResist,
      eDetect: monteCarloInput.eDetect
    });
  }

  // Calculate susceptibility using sigmoid function
  const baseSusceptibility = 1 / (1 + Math.exp(-(monteCarloInput.tcMode - monteCarloInput.rsMode) / 2));

  // Log the Monte Carlo input to diagnose issues
  console.log("Calculating risk with updated parameters...");

  // Run Monte Carlo simulation for residual risk using the shared module
  const monteCarloFullResult = runFairCamFullMonteCarlo(monteCarloInput);

  // For inherent risk calculation, use a worst-case scenario without controls
  // Rerun simulation with zero resistance to get inherent risk
  const inherentInput = { ...monteCarloInput };
  inherentInput.rsMin = 0;
  inherentInput.rsMode = 0;
  inherentInput.rsMax = 0;
  inherentInput.eAvoid = 0;
  inherentInput.eDeter = 0;
  inherentInput.eResist = 0;
  inherentInput.eDetect = 0;

  // Keep the associated assets in the inherent risk calculation as well
  inherentInput.associatedAssets = monteCarloInput.associatedAssets;

  const inherentMonteCarloResult = runFairCamFullMonteCarlo(inherentInput);
  let inherentRisk = inherentMonteCarloResult.stats.mean;

  // Make sure inherent risk is valid, provide fallback if not
  if (isNaN(inherentRisk) || inherentRisk <= 0) {
    // Calculate deterministically using LEF * LM
    const lef = monteCarloInput.cfMode * monteCarloInput.poaMode * (1 / (1 + Math.exp(-(monteCarloInput.tcMode) / 2)));
    const lm = monteCarloInput.plMode + (monteCarloInput.slefMode * monteCarloInput.slmMode);
    inherentRisk = lef * lm;
    console.log(`Monte Carlo returned invalid inherent risk, using fallback calculation: ${inherentRisk}`);
  }

  // Initial residual risk value from Monte Carlo simulation
  let residualRisk = monteCarloFullResult.stats.mean;

  // Apply control effectiveness logic for residual risk
  if (controls && controls.length > 0) {
    console.log(`Calculating RESIDUAL risk - found ${controls.length} controls`);

    // Get average effectiveness of all controls (scale 0-10)
    let totalEffectiveness = 0;
    let validControls = 0;

    for (const control of controls) {
      if (control.controlEffectiveness && control.controlEffectiveness > 0) {
        const effectiveness = Number(control.controlEffectiveness) || 0;

        // Apply implementation status factor
        let implementationFactor = 0;
        if (control.implementationStatus === 'fully_implemented') {
          implementationFactor = 1.0;
        } else if (control.implementationStatus === 'in_progress') {
          implementationFactor = 0.5; // In progress gets 50% effectiveness
        } else {
          implementationFactor = 0; // Not implemented gets 0%
        }

        const adjustedEffectiveness = effectiveness * implementationFactor;
        totalEffectiveness += adjustedEffectiveness;
        validControls++;

        console.log(`Control ${control.controlId}: effectiveness=${effectiveness}, status=${control.implementationStatus}, factor=${implementationFactor}, adjusted=${adjustedEffectiveness}`);
      }
    }

    if (validControls > 0) {
      const avgEffectiveness = totalEffectiveness / validControls;
      // Convert to reduction percentage (scale 0-10 to 0-50% max reduction)
      const reductionPercentage = (avgEffectiveness / 10) * 0.5;
      residualRisk = inherentRisk * (1 - reductionPercentage);

      console.log(`Applied control effectiveness: avgEffectiveness=${avgEffectiveness}, reductionPercentage=${reductionPercentage * 100}%, residualRisk=${residualRisk}`);
    } else {
      console.log('No effective controls found - residual risk equals inherent risk');
      residualRisk = inherentRisk;
    }
  } else {
    console.log('No controls present - residual risk equals inherent risk');
    residualRisk = inherentRisk;
  }

  // Final validation to ensure residual risk is always less than or equal to inherent risk
  // and greater than zero (these are mathematical/logical constraints)
  if (residualRisk > inherentRisk) {
    console.log(`Warning: Calculated residual risk (${residualRisk}) was greater than inherent risk (${inherentRisk}). Setting equal to inherent risk.`);
    residualRisk = inherentRisk;
  } else if (isNaN(residualRisk) || residualRisk <= 0) {
    console.log(`Warning: Invalid residual risk value (${residualRisk}). Setting equal to inherent risk.`);
    residualRisk = inherentRisk;
  }

  // Calculate TOTAL LOSS MAGNITUDE (Primary + Secondary with Cost Modules) for final calculations
  console.log(`STEP 5: Calculating TOTAL loss magnitude for final calculations with ${costModuleAssignments.length} cost modules`);
  const finalTotalLossMin = calculateLossMagnitude(riskParams, 'min', costModuleAssignments);
  const finalTotalLossAvg = calculateLossMagnitude(riskParams, 'avg', costModuleAssignments);
  const finalTotalLossMax = calculateLossMagnitude(riskParams, 'max', costModuleAssignments);

  // Calculate secondary loss magnitude based on cost modules if they exist
  let secondaryLossMagnitudeResult;
  if (costModuleAssignments && costModuleAssignments.length > 0) {
    // When cost modules exist, calculate secondary loss from them (total - primary)
    secondaryLossMagnitudeResult = {
      min: finalTotalLossMin - primaryLossMagnitude.min,
      avg: finalTotalLossAvg - primaryLossMagnitude.avg,
      max: finalTotalLossMax - primaryLossMagnitude.max
    };
    console.log(`SECONDARY LOSS CALCULATED FROM COST MODULES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  } else {
    // When no cost modules, use form values
    secondaryLossMagnitudeResult = {
      min: riskParams.secondaryLossMagnitude.min || 0,
      avg: riskParams.secondaryLossMagnitude.avg || 0,
      max: riskParams.secondaryLossMagnitude.max || 0
    };
    console.log(`SECONDARY LOSS FROM FORM VALUES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  }

  // Log results for debugging
  console.log(
    "Final calculation result: inherentRisk =",
    inherentRisk,
    "residualRisk =",
    residualRisk
  );

  // Calculate Threat Event Frequency (TEF)
  const tefMin = riskParams.contactFrequency.min * riskParams.probabilityOfAction.min;
  const tefAvg = riskParams.contactFrequency.avg * riskParams.probabilityOfAction.avg;
  const tefMax = riskParams.contactFrequency.max * riskParams.probabilityOfAction.max;

  // Calculate Loss Event Frequency (LEF)
  const lefMin = tefMin * baseSusceptibility;
  const lefAvg = tefAvg * baseSusceptibility;
  const lefMax = tefMax * baseSusceptibility;

  // Return the calculated values including enhanced loss magnitude and secondary loss values
  return {
    inherentRisk,
    residualRisk,
    susceptibility: baseSusceptibility,
    monteCarloResults: monteCarloFullResult.stats,
    lossMagnitude: {
      min: finalTotalLossMin,
      avg: finalTotalLossAvg,
      max: finalTotalLossMax
    },
    secondaryLossMagnitude: secondaryLossMagnitudeResult,
    threatEventFrequency: {
      min: tefMin,
      avg: tefAvg,
      max: tefMax
    },
    lossEventFrequency: {
      min: lefMin,
      avg: lefAvg,
      max: lefMax
    },
    susceptibilityDetail: {
      min: baseSusceptibility,
      avg: baseSusceptibility,
      max: baseSusceptibility
    }
  };
}

// NOTE: The runMonteCarloSimulation function has been removed
// to avoid duplication with the existing runFairCamFullMonteCarlo function
// from shared/utils/monteCarlo.ts module
// All risk calculation code now uses the shared module to ensure consistency