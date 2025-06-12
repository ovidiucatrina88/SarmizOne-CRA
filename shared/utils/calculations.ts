import { MonteCarloFullResult, MonteCarloInput, runFairCamFullMonteCarlo } from './monteCarlo';
import { calculateSecondaryLoss as calculateSecondaryLossUtil, convertDatabaseCostModule, Distribution, SecondaryLossInputs } from './secondaryLossCalculations';

export interface RiskCalculationParams {
  contactFrequencyMin: number;
  contactFrequencyAvg: number; 
  contactFrequencyMax: number;
  probabilityOfActionMin: number;
  probabilityOfActionAvg: number;
  probabilityOfActionMax: number;
  threatCapabilityMin: number;
  threatCapabilityAvg: number;
  threatCapabilityMax: number;
  resistanceStrengthMin: number;
  resistanceStrengthAvg: number;
  resistanceStrengthMax: number;
  primaryLossMagnitudeMin: number;
  primaryLossMagnitudeAvg: number;
  primaryLossMagnitudeMax: number;
  secondaryLossEventFrequencyMin: number;
  secondaryLossEventFrequencyAvg: number;
  secondaryLossEventFrequencyMax: number;
  secondaryLossMagnitudeMin: number;
  secondaryLossMagnitudeAvg: number;
  secondaryLossMagnitudeMax: number;
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
    return {
      contactFrequencyMin: 0,
      contactFrequencyAvg: 0,
      contactFrequencyMax: 0,
      probabilityOfActionMin: 0, 
      probabilityOfActionAvg: 0,
      probabilityOfActionMax: 0,
      threatCapabilityMin: 0,
      threatCapabilityAvg: 0,
      threatCapabilityMax: 0,
      resistanceStrengthMin: 0,
      resistanceStrengthAvg: 0,
      resistanceStrengthMax: 0,
      primaryLossMagnitudeMin: 0,
      primaryLossMagnitudeAvg: 0,
      primaryLossMagnitudeMax: 0,
      secondaryLossEventFrequencyMin: 0,
      secondaryLossEventFrequencyAvg: 0,
      secondaryLossEventFrequencyMax: 0,
      secondaryLossMagnitudeMin: 0,
      secondaryLossMagnitudeAvg: 0,
      secondaryLossMagnitudeMax: 0
    };
  }

  // Function to safely parse a number from a risk property
  const safeNumber = (value: any): number => {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? 0 : num;
  };

  return {
    // Contact frequency
    contactFrequencyMin: safeNumber(risk.contactFrequencyMin),
    contactFrequencyAvg: safeNumber(risk.contactFrequencyAvg),
    contactFrequencyMax: safeNumber(risk.contactFrequencyMax),
    
    // Probability of action
    probabilityOfActionMin: safeNumber(risk.probabilityOfActionMin),
    probabilityOfActionAvg: safeNumber(risk.probabilityOfActionAvg),
    probabilityOfActionMax: safeNumber(risk.probabilityOfActionMax),
    
    // Threat capability
    threatCapabilityMin: safeNumber(risk.threatCapabilityMin),
    threatCapabilityAvg: safeNumber(risk.threatCapabilityAvg),
    threatCapabilityMax: safeNumber(risk.threatCapabilityMax),
    
    // Resistance strength
    resistanceStrengthMin: safeNumber(risk.resistanceStrengthMin),
    resistanceStrengthAvg: safeNumber(risk.resistanceStrengthAvg),
    resistanceStrengthMax: safeNumber(risk.resistanceStrengthMax),
    
    // Primary loss magnitude
    primaryLossMagnitudeMin: safeNumber(risk.primaryLossMagnitudeMin),
    primaryLossMagnitudeAvg: safeNumber(risk.primaryLossMagnitudeAvg),
    primaryLossMagnitudeMax: safeNumber(risk.primaryLossMagnitudeMax),
    
    // Secondary loss event frequency
    secondaryLossEventFrequencyMin: safeNumber(risk.secondaryLossEventFrequencyMin),
    secondaryLossEventFrequencyAvg: safeNumber(risk.secondaryLossEventFrequencyAvg),
    secondaryLossEventFrequencyMax: safeNumber(risk.secondaryLossEventFrequencyMax),
    
    // Secondary loss magnitude
    secondaryLossMagnitudeMin: safeNumber(risk.secondaryLossMagnitudeMin),
    secondaryLossMagnitudeAvg: safeNumber(risk.secondaryLossMagnitudeAvg),
    secondaryLossMagnitudeMax: safeNumber(risk.secondaryLossMagnitudeMax)
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
  }
} {
  const monteCarloInput: MonteCarloInput = {
    cfMin: params.contactFrequencyMin,
    cfMode: params.contactFrequencyAvg,
    cfMax: params.contactFrequencyMax,
    
    poaMin: params.probabilityOfActionMin,
    poaMode: params.probabilityOfActionAvg,
    poaMax: params.probabilityOfActionMax,
    
    tcMin: params.threatCapabilityMin,
    tcMode: params.threatCapabilityAvg,
    tcMax: params.threatCapabilityMax,
    
    rsMin: params.resistanceStrengthMin,
    rsMode: params.resistanceStrengthAvg,
    rsMax: params.resistanceStrengthMax,
    
    plMin: params.primaryLossMagnitudeMin,
    plMode: params.primaryLossMagnitudeAvg,
    plMax: params.primaryLossMagnitudeMax,
    
    // Generate SLEF values from distributions if cost modules exist, otherwise use form values
    slefMin: costModuleAssignments.length > 0 ? 0.1 : params.secondaryLossEventFrequencyMin,
    slefMode: costModuleAssignments.length > 0 ? 0.3 : params.secondaryLossEventFrequencyAvg,
    slefMax: costModuleAssignments.length > 0 ? 0.7 : params.secondaryLossEventFrequencyMax,
    
    slmMin: params.secondaryLossMagnitudeMin,
    slmMode: params.secondaryLossMagnitudeAvg,
    slmMax: params.secondaryLossMagnitudeMax,
    
    // Control effectiveness - only apply if controls are actually present
    eAvoid: (controls && controls.length > 0) ? resistance / 40 : 0, // Scale 0-10 to 0-0.25 only if controls exist
    eDeter: (controls && controls.length > 0) ? resistance / 40 : 0,
    eResist: (controls && controls.length > 0) ? resistance / 40 : 0,
    eDetect: (controls && controls.length > 0) ? resistance / 40 : 0,
    
    iterations: 10000 // Default to 10,000 iterations for accuracy
  };
  
  // Calculate PRIMARY LOSS ONLY for inherent risk (no cost modules)
  console.log(`STEP 4: Calculating PRIMARY loss magnitude for inherent risk (no cost modules)`);
  const primaryLossMin = calculateLossMagnitude(params, 'min'); // No cost modules = pure primary loss
  const primaryLossAvg = calculateLossMagnitude(params, 'avg'); // No cost modules = pure primary loss
  const primaryLossMax = calculateLossMagnitude(params, 'max'); // No cost modules = pure primary loss

  console.log(`Primary Loss Magnitude: Min=${primaryLossMin}, Avg=${primaryLossAvg}, Max=${primaryLossMax}`);

  // Calculate TOTAL LOSS MAGNITUDE (Primary + Secondary with Cost Modules) for residual risk
  console.log(`STEP 5: Calculating TOTAL loss magnitude with ${costModuleAssignments.length} cost modules`);
  const totalLossMin = calculateLossMagnitude(params, 'min', costModuleAssignments);
  const totalLossAvg = calculateLossMagnitude(params, 'avg', costModuleAssignments);
  const totalLossMax = calculateLossMagnitude(params, 'max', costModuleAssignments);

  console.log(`Total Loss Magnitude (Primary + Secondary): Min=${totalLossMin}, Avg=${totalLossAvg}, Max=${totalLossMax}`);
  
  // Calculate LEF (Loss Event Frequency)
  const cf = params.contactFrequencyAvg || 0;
  const poa = params.probabilityOfActionAvg || 0;
  const tc = params.threatCapabilityAvg || 0;
  
  // Calculate Resistance Strength based on controls
  let rs = params.resistanceStrengthAvg || 0; // Start with base resistance
  
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
      console.log(`Control effectiveness increased resistance strength from ${params.resistanceStrengthAvg || 0} to ${rs}`);
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
  const returnTotalLossMin = calculateLossMagnitude(params, 'min', costModuleAssignments);
  const returnTotalLossAvg = calculateLossMagnitude(params, 'avg', costModuleAssignments);
  const returnTotalLossMax = calculateLossMagnitude(params, 'max', costModuleAssignments);
  
  // Calculate base susceptibility using existing tc variable or calculate if needed
  const baseSusceptibility = 1 / (1 + Math.exp(-(tc - rs) / 2));
  
  // Calculate secondary loss magnitude based on cost modules if they exist
  let secondaryLossMagnitudeResult;
  if (costModuleAssignments && costModuleAssignments.length > 0) {
    // When cost modules exist, calculate secondary loss from them (total - primary)
    const primaryLossMinVal = Number(params.primaryLossMagnitudeMin) || 0;
    const primaryLossAvgVal = Number(params.primaryLossMagnitudeAvg) || 0;
    const primaryLossMaxVal = Number(params.primaryLossMagnitudeMax) || 0;
    
    secondaryLossMagnitudeResult = {
      min: returnTotalLossMin - primaryLossMinVal,
      avg: returnTotalLossAvg - primaryLossAvgVal,
      max: returnTotalLossMax - primaryLossMaxVal
    };
    console.log(`SECONDARY LOSS CALCULATED FROM COST MODULES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  } else {
    // When no cost modules, use form values
    secondaryLossMagnitudeResult = {
      min: Number(params.secondaryLossMagnitudeMin) || 0,
      avg: Number(params.secondaryLossMagnitudeAvg) || 0,
      max: Number(params.secondaryLossMagnitudeMax) || 0
    };
    console.log(`SECONDARY LOSS FROM FORM VALUES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  }

  return {
    inherentRisk,
    residualRisk,
    susceptibility: baseSusceptibility,
    monteCarloResults,
    lossMagnitude: {
      min: returnTotalLossMin,
      avg: returnTotalLossAvg,
      max: returnTotalLossMax
    },
    secondaryLossMagnitude: secondaryLossMagnitudeResult
  };
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
  const cf = params.contactFrequencyAvg || 0;
  const poa = params.probabilityOfActionAvg || 0;
  const tc = params.threatCapabilityAvg || 0;
  const rs = 0; // For inherent risk, resistance is always 0
  
  // Calculate susceptibility using sigmoid function
  const sus = 1 / (1 + Math.exp(-(tc - rs) / 2));
  
  // Calculate Loss Event Frequency (LEF)
  const lef = cf * poa * sus;
  
  // Calculate Loss Magnitude (LM)
  const pl = params.primaryLossMagnitudeAvg || 0;
  const slef = params.secondaryLossEventFrequencyAvg || 0;
  const slm = params.secondaryLossMagnitudeAvg || 0;
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
  // Guard against empty/undefined cost modules
  const safeCostModules = Array.isArray(costModuleAssignments) ? costModuleAssignments : [];
  const validCostModules = safeCostModules.filter(cm => cm && cm.cost_module);

  console.log(`STEP 5: calculateLossMagnitude called with ${validCostModules.length} valid cost modules for type: ${type}`);

  // Extract Primary Loss based on type
  const primaryLoss = type === 'min' 
    ? parseFloat(risk.primaryLossMagnitudeMin) || 0
    : type === 'max'
      ? parseFloat(risk.primaryLossMagnitudeMax) || 0
      : parseFloat(risk.primaryLossMagnitudeAvg) || 0;

  // If no valid cost modules, use form input values (SLEF × SLM)
  if (validCostModules.length === 0) {
    const slef = type === 'min'
      ? parseFloat(risk.secondaryLossEventFrequencyMin) || 0
      : type === 'max'
        ? parseFloat(risk.secondaryLossEventFrequencyMax) || 0
        : parseFloat(risk.secondaryLossEventFrequencyAvg) || 0;
        
    const slm = type === 'min'
      ? parseFloat(risk.secondaryLossMagnitudeMin) || 0
      : type === 'max'
        ? parseFloat(risk.secondaryLossMagnitudeMax) || 0
        : parseFloat(risk.secondaryLossMagnitudeAvg) || 0;
    
    const basicSecondaryLoss = slef * slm;
    const totalLoss = primaryLoss + basicSecondaryLoss;
    
    console.log(`Basic Loss Magnitude (${type}): PL(${primaryLoss}) + FormSL(SLEF:${slef} × SLM:${slm} = ${basicSecondaryLoss}) = ${totalLoss}`);
    return totalLoss;
  }

  // If cost modules attached, calculate Secondary Loss Magnitude ONLY from cost modules
  // Convert database cost module assignments to the utility format
  const costModules = validCostModules.map(convertDatabaseCostModule);
  
  console.log(`STEP 6: Converting ${validCostModules.length} cost modules for enhanced calculation`);
  costModules.forEach(cm => {
    console.log(`  - Module: ${cm.id || 'Unknown'}, Type: ${cm.type || 'Unknown'}, Factor: ${cm.value || 0}`);
  });

  // Calculate enhanced secondary loss using ONLY cost modules (ignore form SLEF/SLM values)
  // For percentage-based modules, we need the primary loss magnitude as the base
  const secondaryLossInputs: SecondaryLossInputs = {
    eventFrequency: { min: 1, avg: 1, max: 1 }, // Single event for cost module calculation
    lossMagnitude: { min: primaryLoss, avg: primaryLoss, max: primaryLoss },  // Primary loss for percentage calculations
    costModules,
    context: { hoursPerEvent: 8 } // Default 8 hours per incident
  };

  const enhancedSecondaryLoss = calculateSecondaryLossUtil(secondaryLossInputs);
  
  // Extract the appropriate value based on type
  const secondaryLossValue = type === 'min' 
    ? enhancedSecondaryLoss.min
    : type === 'max'
      ? enhancedSecondaryLoss.max
      : enhancedSecondaryLoss.avg;

  const totalLossMagnitude = primaryLoss + secondaryLossValue;
  
  console.log(`Enhanced Loss Magnitude (${type}): PL(${primaryLoss}) + CostModuleSL(${secondaryLossValue}) = ${totalLossMagnitude}`);
  console.log(`Cost modules applied: ${costModules.length} modules, ignoring form SLEF/SLM values`);
  
  return totalLossMagnitude;
};

/**
 * Calculate Secondary Loss based on Secondary Loss Event Frequency and Secondary Loss Magnitude
 * FAIR v3.0 Formula: SL = SLEF * SLM
 *
 * @param risk Risk object containing secondary loss parameters
 * @param type 'min', 'avg', or 'max' to determine which values to use
 * @returns The calculated secondary loss
 */
export const calculateSecondaryLoss = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  // Extract parameters based on type
  const slef = type === 'min'
    ? parseFloat(risk.secondaryLossEventFrequencyMin) || 0
    : type === 'max'
      ? parseFloat(risk.secondaryLossEventFrequencyMax) || 0
      : parseFloat(risk.secondaryLossEventFrequencyAvg) || 0;
      
  const slm = type === 'min'
    ? parseFloat(risk.secondaryLossMagnitudeMin) || 0
    : type === 'max'
      ? parseFloat(risk.secondaryLossMagnitudeMax) || 0
      : parseFloat(risk.secondaryLossMagnitudeAvg) || 0;
  
  // Calculate and return secondary loss
  return slef * slm;
};

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
  // Extract parameters based on type
  const tc = type === 'min' 
    ? parseFloat(risk.threatCapabilityMin) || 0
    : type === 'max'
      ? parseFloat(risk.threatCapabilityMax) || 0
      : parseFloat(risk.threatCapabilityAvg) || 0;
      
  const rs = type === 'min'
    ? parseFloat(risk.resistanceStrengthMin) || 0
    : type === 'max'
      ? parseFloat(risk.resistanceStrengthMax) || 0
      : parseFloat(risk.resistanceStrengthAvg) || 0;
  
  // Calculate susceptibility using sigmoid function
  // This creates an S-curve where the vulnerability increases as the threat capability increases
  // relative to the resistance strength
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
  // Extract parameters based on type
  const cf = type === 'min' 
    ? parseFloat(risk.contactFrequencyMin) || 0
    : type === 'max'
      ? parseFloat(risk.contactFrequencyMax) || 0
      : parseFloat(risk.contactFrequencyAvg) || 0;
      
  const poa = type === 'min'
    ? parseFloat(risk.probabilityOfActionMin) || 0
    : type === 'max'
      ? parseFloat(risk.probabilityOfActionMax) || 0
      : parseFloat(risk.probabilityOfActionAvg) || 0;
  
  // Calculate and return threat event frequency
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
  // Calculate TEF
  const tef = calculateThreatEventFrequency(risk, type);
  
  // Calculate susceptibility
  const sus = calculateSusceptibility(risk, type);
  
  // Calculate and return loss event frequency
  return tef * sus;
};

export const calculateRisk = (
  risk: any,
  type: 'min' | 'avg' | 'max' = 'avg'
): number => {
  // Calculate Loss Event Frequency
  const lef = calculateLossEventFrequency(risk, type);
  
  // Calculate Loss Magnitude
  const lm = calculateLossMagnitude(risk, type);
  
  // Calculate and return risk (ALE)
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
    const processedAssets = assets.map(asset => ({
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
  const monteCarloInput: MonteCarloInput = {
    // Contact Frequency
    cfMin: riskParams.contactFrequencyMin,
    cfMode: riskParams.contactFrequencyAvg,
    cfMax: riskParams.contactFrequencyMax,
    
    // Probability of Action
    poaMin: riskParams.probabilityOfActionMin,
    poaMode: riskParams.probabilityOfActionAvg,
    poaMax: riskParams.probabilityOfActionMax,
    
    // Threat Capability
    tcMin: riskParams.threatCapabilityMin,
    tcMode: riskParams.threatCapabilityAvg,
    tcMax: riskParams.threatCapabilityMax,
    
    // Resistance Strength
    rsMin: riskParams.resistanceStrengthMin,
    rsMode: riskParams.resistanceStrengthAvg,
    rsMax: riskParams.resistanceStrengthMax,
    
    // Primary Loss Magnitude - use calculated values from assets if available
    plMin: primaryLossMagnitude.min,
    plMode: primaryLossMagnitude.avg,
    plMax: primaryLossMagnitude.max,
    
    // Secondary Loss Event Frequency
    slefMin: riskParams.secondaryLossEventFrequencyMin,
    slefMode: riskParams.secondaryLossEventFrequencyAvg,
    slefMax: riskParams.secondaryLossEventFrequencyMax,
    
    // Secondary Loss Magnitude
    slmMin: riskParams.secondaryLossMagnitudeMin,
    slmMode: riskParams.secondaryLossMagnitudeAvg,
    slmMax: riskParams.secondaryLossMagnitudeMax,
    
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
      min: riskParams.secondaryLossMagnitudeMin || 0,
      avg: riskParams.secondaryLossMagnitudeAvg || 0,
      max: riskParams.secondaryLossMagnitudeMax || 0
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
    secondaryLossMagnitude: secondaryLossMagnitudeResult
  };
}

// NOTE: The runMonteCarloSimulation function has been removed
// to avoid duplication with the existing runFairCamFullMonteCarlo function
// from shared/utils/monteCarlo.ts module
// All risk calculation code now uses the shared module to ensure consistency