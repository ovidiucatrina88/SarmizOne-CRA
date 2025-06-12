/**
 * FAIR-CAM Model Calculations
 * 
 * Enhanced calculations implementing the FAIR-CAM methodology with vulnerability integration
 */

import {
  RiskParams,
  FairCalculationResult,
  AnnualizedLossRange
} from "./types";
import { triangular } from "./triangular";

/**
 * Interface for the FAIR-CAM parameters
 */
export interface FairCamParams {
  // Threat Event Frequency parameters
  tefMin: number;
  tefMost: number;
  tefMax: number;
  
  // Loss magnitude parameters
  lmMin: number;
  lmMost: number;
  lmMax: number;
  
  // FAIR-CAM efficacy parameters
  eAvoid?: number;  // Control efficacy for threat avoidance
  eDeter?: number;  // Control efficacy for threat deterrence
  eDetect?: number; // Control efficacy for threat detection
  eResist?: number; // Control efficacy for threat resistance
  eRespond?: number; // Control efficacy for incident response
  eRecover?: number; // Control efficacy for recovery
  
  // Variance metrics for reliability adjustments
  varFreq?: number;   // Variance in control performance (frequency)
  varDuration?: number; // Variance in control performance (duration)
}

/**
 * Apply FAIR-CAM model to calculate adjusted risk values based on control efficacy
 * 
 * @param params Base risk parameters from FAIR model
 * @returns Adjusted parameters after applying FAIR-CAM control efficacy metrics
 */
export function applyFairCamAdjustments(params: FairCamParams): FairCamParams {
  // Set defaults for any missing efficacy parameters
  const eAvoid = params.eAvoid !== undefined ? params.eAvoid : 0;
  const eDeter = params.eDeter !== undefined ? params.eDeter : 0;
  const eDetect = params.eDetect !== undefined ? params.eDetect : 0.5;
  const eResist = params.eResist !== undefined ? params.eResist : 0.5;
  const eRespond = params.eRespond !== undefined ? params.eRespond : 0;
  const eRecover = params.eRecover !== undefined ? params.eRecover : 0;
  
  // Calculate reliability adjustment based on variance metrics (if available)
  const varFreq = params.varFreq || 0;
  const varDuration = params.varDuration || 0;
  
  // Calculate operational reliability factor
  // Formula: reliability = (1 - (var_freq/365))^var_duration
  let reliability = 1;
  if (varFreq > 0 && varDuration > 0) {
    reliability = Math.pow(1 - (varFreq / 365), varDuration);
    
    // Ensure reliability is within 0-1 range
    reliability = Math.max(0, Math.min(1, reliability));
  }
  
  // Apply reliability adjustment to efficacy parameters
  const adjustedEAvoid = eAvoid * reliability;
  const adjustedEDeter = eDeter * reliability;
  const adjustedEDetect = eDetect * reliability;
  const adjustedEResist = eResist * reliability;
  const adjustedERespond = eRespond * reliability;
  const adjustedERecover = eRecover * reliability;
  
  // Calculate TEF adjustment factor based on FAIR-CAM model
  // TEF is reduced by avoidance and deterrence controls
  const tefAdjustmentFactor = 1 - (adjustedEAvoid + adjustedEDeter * (1 - adjustedEAvoid));
  
  // Calculate LM adjustment factor based on FAIR-CAM model
  // LM is reduced by resistance, response, and recovery controls
  const lmAdjustmentFactor = 1 - (
    adjustedEResist + 
    adjustedERespond * (1 - adjustedEResist) + 
    adjustedERecover * (1 - adjustedEResist) * (1 - adjustedERespond)
  );
  
  // Apply adjustment factors to the original parameters
  return {
    ...params,
    // Adjust Threat Event Frequency
    tefMin: params.tefMin * tefAdjustmentFactor,
    tefMost: params.tefMost * tefAdjustmentFactor,
    tefMax: params.tefMax * tefAdjustmentFactor,
    
    // Adjust Loss Magnitude
    lmMin: params.lmMin * lmAdjustmentFactor,
    lmMost: params.lmMost * lmAdjustmentFactor,
    lmMax: params.lmMax * lmAdjustmentFactor,
    
    // Store adjusted efficacy parameters for reference
    eAvoid: adjustedEAvoid,
    eDeter: adjustedEDeter,
    eDetect: adjustedEDetect,
    eResist: adjustedEResist,
    eRespond: adjustedERespond,
    eRecover: adjustedERecover
  };
}

/**
 * Run a basic Monte Carlo simulation for risk calculations
 * 
 * @param params Risk parameters for the simulation
 * @param iterations Number of simulation iterations (default: 10000)
 * @returns Risk calculation results
 */
export function runMonteCarloSimulation(
  params: RiskParams,
  iterations: number = 10000
): FairCalculationResult {
  // Array to store the ALE results from each iteration
  const aleResults: number[] = [];
  
  // Run the simulation for the specified number of iterations
  for (let i = 0; i < iterations; i++) {
    // Sample from triangular distributions for TEF and LM
    const tef = triangular(params.tefMin, params.tefMost, params.tefMax);
    const lm = triangular(params.lmMin, params.lmMost, params.lmMax);
    
    // Calculate the Annualized Loss Exposure (ALE) for this iteration
    const ale = tef * lm;
    
    // Store the result
    aleResults.push(ale);
  }
  
  // Sort results for percentile calculations
  aleResults.sort((a, b) => a - b);
  
  // Calculate statistics
  const mean = aleResults.reduce((sum, val) => sum + val, 0) / iterations;
  const median = iterations % 2 === 0
    ? (aleResults[iterations / 2 - 1] + aleResults[iterations / 2]) / 2
    : aleResults[Math.floor(iterations / 2)];
  
  // Calculate enhanced percentiles
  const p10 = aleResults[Math.floor(iterations * 0.1)];
  const p25 = aleResults[Math.floor(iterations * 0.25)];
  const p50 = aleResults[Math.floor(iterations * 0.5)];
  const p75 = aleResults[Math.floor(iterations * 0.75)];
  const p90 = aleResults[Math.floor(iterations * 0.9)];
  const p95 = aleResults[Math.floor(iterations * 0.95)];
  const p99 = aleResults[Math.floor(iterations * 0.99)];
  
  return {
    ale10: p10,
    ale25: p25,
    ale50: p50,
    ale75: p75,
    ale90: p90,
    ale95: p95,
    ale99: p99,
    aleMean: mean,
    aleMedian: median
  };
}

/**
 * Run a Monte Carlo simulation using the FAIR-CAM adjusted parameters
 * 
 * @param params FAIR-CAM parameters for the simulation
 * @param iterations Number of simulation iterations (default: 10000)
 * @returns Risk calculation results
 */
export function runEnhancedFairCamMonteCarlo(
  params: FairCamParams,
  iterations: number = 10000
): FairCalculationResult {
  // Apply FAIR-CAM adjustments to parameters
  const adjustedParams = applyFairCamAdjustments(params);
  
  // Use adjusted params directly in our simulation
  return runMonteCarloSimulation({
    tefMin: adjustedParams.tefMin,
    tefMost: adjustedParams.tefMost, 
    tefMax: adjustedParams.tefMax,
    lmMin: adjustedParams.lmMin,
    lmMost: adjustedParams.lmMost,
    lmMax: adjustedParams.lmMax
  }, iterations);
}

/**
 * Extract control efficacy parameters from a risk object
 * 
 * @param risk Risk object with control efficacy parameters
 * @returns FairCamParams object with extracted efficacy values
 */
export function extractControlEfficacyParams(risk: any): FairCamParams {
  // Base parameters from risk object
  const params: FairCamParams = {
    tefMin: risk.tefMin || 0,
    tefMost: risk.tefMost || 0,
    tefMax: risk.tefMax || 0,
    lmMin: risk.lmMin || 0,
    lmMost: risk.lmMost || 0,
    lmMax: risk.lmMax || 0
  };
  
  // Extract control efficacy parameters if available
  if (risk.controls && Array.isArray(risk.controls)) {
    // Calculate weighted average for each efficacy parameter
    let totalEAvoid = 0;
    let totalEDeter = 0;
    let totalEDetect = 0;
    let totalEResist = 0;
    let totalERespond = 0;
    let totalERecover = 0;
    let controlCount = 0;
    
    // Only count implemented controls
    const implementedControls = risk.controls.filter((control: any) => 
      control.implementationStatus === 'Fully Implemented' || 
      control.implementationStatus === 'In Progress'
    );
    
    controlCount = implementedControls.length;
    
    if (controlCount > 0) {
      // Calculate total efficacy values
      for (const control of implementedControls) {
        // Apply implementation factor (1.0 for fully implemented, 0.5 for in progress)
        const implFactor = control.implementationStatus === 'Fully Implemented' ? 1.0 : 0.5;
        
        totalEAvoid += (control.e_avoid || 0) * implFactor;
        totalEDeter += (control.e_deter || 0) * implFactor;
        totalEDetect += (control.e_detect || 0) * implFactor;
        totalEResist += (control.e_resist || 0) * implFactor;
        totalERespond += (control.e_respond || 0) * implFactor;
        totalERecover += (control.e_recover || 0) * implFactor;
      }
      
      // Calculate averages
      params.eAvoid = totalEAvoid / controlCount;
      params.eDeter = totalEDeter / controlCount;
      params.eDetect = totalEDetect / controlCount;
      params.eResist = totalEResist / controlCount;
      params.eRespond = totalERespond / controlCount;
      params.eRecover = totalERecover / controlCount;
    }
  }
  
  // Check for vulnerability-derived metrics and prioritize them over control-derived metrics
  if (risk.eDetect !== undefined) {
    params.eDetect = risk.eDetect;
  }
  
  if (risk.eResist !== undefined) {
    params.eResist = risk.eResist;
  }
  
  // Add variance metrics if available
  if (risk.varFreq !== undefined) {
    params.varFreq = risk.varFreq;
  }
  
  if (risk.varDuration !== undefined) {
    params.varDuration = risk.varDuration;
  }
  
  return params;
}

/**
 * Calculate residual risk using FAIR-CAM methodology
 * 
 * @param risk Risk object with inherent risk parameters and control data
 * @returns Calculated residual risk values
 */
export function calculateResidualRiskWithFairCam(risk: any): AnnualizedLossRange {
  // Extract FAIR-CAM parameters from risk object
  const fairCamParams = extractControlEfficacyParams(risk);
  
  // Run Monte Carlo simulation with FAIR-CAM adjustments
  const result = runEnhancedFairCamMonteCarlo(fairCamParams);
  
  // Return the annualized loss range
  return {
    min: result.ale10,
    avg: result.aleMean,
    max: result.ale90
  };
}

/**
 * Calculate the adjusted Loss Event Frequency (LEF) using FAIR-CAM controls
 * 
 * @param baseFrequency The base frequency value before applying controls
 * @param controls Array of controls with efficacy parameters
 * @returns Adjusted frequency value after applying control efficacy
 */
export function adjustedLEF(baseFrequency: number, controls: any[]): number {
  if (!controls || controls.length === 0) {
    return baseFrequency;
  }
  
  // Calculate average efficacy values
  let totalEAvoid = 0;
  let totalEDeter = 0;
  let controlCount = 0;
  
  // Only consider implemented controls
  const implementedControls = controls.filter(control => 
    control.implementationStatus === 'Fully Implemented' || 
    control.implementationStatus === 'In Progress'
  );
  
  controlCount = implementedControls.length;
  
  if (controlCount === 0) {
    return baseFrequency;
  }
  
  // Calculate total efficacy values
  for (const control of implementedControls) {
    // Apply implementation factor (1.0 for fully implemented, 0.5 for in progress)
    const implFactor = control.implementationStatus === 'Fully Implemented' ? 1.0 : 0.5;
    
    totalEAvoid += (control.e_avoid || 0) * implFactor;
    totalEDeter += (control.e_deter || 0) * implFactor;
  }
  
  // Calculate averages
  const eAvoid = totalEAvoid / controlCount;
  const eDeter = totalEDeter / controlCount;
  
  // Calculate TEF adjustment factor based on FAIR-CAM model
  // TEF is reduced by avoidance and deterrence controls
  const tefAdjustmentFactor = 1 - (eAvoid + eDeter * (1 - eAvoid));
  
  // Apply adjustment factor to the base frequency
  return baseFrequency * tefAdjustmentFactor;
}

/**
 * Maps controls to their effectiveness parameters based on FAIR-CAM model
 * 
 * @param controls Array of control objects
 * @returns Object containing mapped effectiveness values
 */
/**
 * Calculate the adjusted Loss Magnitude (LM) using FAIR-CAM controls
 * 
 * @param primaryLoss The primary loss value before applying controls
 * @param secondaryLossEventFrequency Secondary loss event frequency (SLEF)
 * @param secondaryLossMagnitude Secondary loss magnitude (SLM)
 * @param detectiveControlEfficacy Efficacy of detective controls (eDetect)
 * @returns Adjusted loss magnitude value after applying control efficacy
 */
export function adjustedLM(
  primaryLoss: number, 
  secondaryLossEventFrequency: number = 0, 
  secondaryLossMagnitude: number = 0,
  detectiveControlEfficacy: number = 0
): number {
  // Base case - just primary loss
  if (!secondaryLossEventFrequency || !secondaryLossMagnitude) {
    return primaryLoss;
  }
  
  // Calculate secondary loss
  const secondaryLoss = secondaryLossEventFrequency * secondaryLossMagnitude;
  
  // Apply adjustment based on detective control efficacy
  // Higher detective control efficacy reduces secondary loss magnitude
  const detectionAdjustmentFactor = 1 - detectiveControlEfficacy;
  const adjustedSecondaryLoss = secondaryLoss * detectionAdjustmentFactor;
  
  // Final loss magnitude is primary loss + adjusted secondary loss
  return primaryLoss + adjustedSecondaryLoss;
}

export function mapControlsToEffectiveness(controls: any[]) {
  if (!controls || controls.length === 0) {
    return {
      eAvoid: 0,
      eDeter: 0,
      eDetect: 0,
      eResist: 0,
      eRespond: 0,
      eRecover: 0
    };
  }
  
  // Calculate average efficacy values
  let totalEAvoid = 0;
  let totalEDeter = 0;
  let totalEDetect = 0;
  let totalEResist = 0;
  let totalERespond = 0;
  let totalERecover = 0;
  let controlCount = 0;
  
  // Only consider implemented controls
  const implementedControls = controls.filter(control => 
    control.implementationStatus === 'Fully Implemented' || 
    control.implementationStatus === 'In Progress'
  );
  
  controlCount = implementedControls.length;
  
  if (controlCount === 0) {
    return {
      e_avoid: 0,
      e_deter: 0,
      e_detect: 0,
      e_resist: 0,
      e_respond: 0,
      e_recover: 0
    };
  }
  
  // Calculate total efficacy values
  for (const control of implementedControls) {
    // Apply implementation factor (1.0 for fully implemented, 0.5 for in progress)
    const implFactor = control.implementationStatus === 'Fully Implemented' ? 1.0 : 0.5;
    
    totalEAvoid += (control.e_avoid || 0) * implFactor;
    totalEDeter += (control.e_deter || 0) * implFactor;
    totalEDetect += (control.e_detect || 0) * implFactor;
    totalEResist += (control.e_resist || 0) * implFactor;
    totalERespond += (control.e_respond || 0) * implFactor;
    totalERecover += (control.e_recover || 0) * implFactor;
  }
  
  // Calculate averages
  return {
    e_avoid: totalEAvoid / controlCount,
    e_deter: totalEDeter / controlCount,
    e_detect: totalEDetect / controlCount,
    e_resist: totalEResist / controlCount,
    e_respond: totalERespond / controlCount,
    e_recover: totalERecover / controlCount
  };
}