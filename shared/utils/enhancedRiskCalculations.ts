/**
 * Enhanced Risk Calculations with FAIR-CAM Integration
 * 
 * This module provides enhanced risk calculation functions that utilize
 * the FAIR-CAM methodology with complete percentile distributions.
 */

import { 
  runMonteCarloSimulation, 
  runEnhancedFairCamMonteCarlo, 
  extractControlEfficacyParams,
  FairCamParams 
} from './fairCamCalculations';
import { FairCalculationResult } from './types';
import { RiskCalculationParams } from './calculations';

export interface EnhancedRiskCalculationResult {
  inherentRisk: number;
  residualRisk: number;
  susceptibility: number;
  inherentPercentiles: FairCalculationResult;
  residualPercentiles: FairCalculationResult;
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
}

/**
 * Enhanced risk calculation using FAIR-CAM methodology with complete percentile distributions
 * 
 * @param risk Risk object with FAIR parameters
 * @param controls Array of controls associated with the risk
 * @param costModuleAssignments Array of cost module assignments
 * @returns Enhanced calculation results with full percentile distributions
 */
export function calculateEnhancedRiskValues(
  risk: any,
  controls: any[] = [],
  costModuleAssignments: any[] = []
): EnhancedRiskCalculationResult {
  
  // Extract FAIR-CAM parameters for inherent risk (no controls)
  const inherentParams: FairCamParams = {
    tefMin: parseFloat(risk.threatEventFrequencyMin) || 0,
    tefMost: parseFloat(risk.threatEventFrequencyAvg) || 0,
    tefMax: parseFloat(risk.threatEventFrequencyMax) || 0,
    lmMin: parseFloat(risk.primaryLossMagnitudeMin) || 0,
    lmMost: parseFloat(risk.primaryLossMagnitudeAvg) || 0,
    lmMax: parseFloat(risk.primaryLossMagnitudeMax) || 0,
    // No control efficacy for inherent risk
    eAvoid: 0,
    eDeter: 0,
    eDetect: 0,
    eResist: 0,
    eRespond: 0,
    eRecover: 0
  };

  // Calculate inherent risk percentiles using pure FAIR methodology
  const inherentPercentiles = runMonteCarloSimulation({
    tefMin: inherentParams.tefMin,
    tefMost: inherentParams.tefMost,
    tefMax: inherentParams.tefMax,
    lmMin: inherentParams.lmMin,
    lmMost: inherentParams.lmMost,
    lmMax: inherentParams.lmMax
  }, 10000);

  // Extract FAIR-CAM parameters for residual risk (with controls)
  const residualParams = extractControlEfficacyParams(risk);
  residualParams.eAvoid = 0;
  residualParams.eDeter = 0;
  residualParams.eDetect = 0;
  residualParams.eResist = 0;
  residualParams.eRespond = 0;
  residualParams.eRecover = 0;

  // Apply control effectiveness if controls exist
  if (controls && controls.length > 0) {
    let totalEAvoid = 0;
    let totalEDeter = 0;
    let totalEDetect = 0;
    let totalEResist = 0;
    let totalERespond = 0;
    let totalERecover = 0;
    let controlCount = 0;

    // Only count implemented controls
    const implementedControls = controls.filter((control: any) => 
      control.implementationStatus === 'fully_implemented' || 
      control.implementationStatus === 'in_progress'
    );

    controlCount = implementedControls.length;

    if (controlCount > 0) {
      for (const control of implementedControls) {
        const implFactor = control.implementationStatus === 'fully_implemented' ? 1.0 : 0.5;
        
        // Map control effectiveness to FAIR-CAM parameters
        const effectiveness = Number(control.controlEffectiveness) || 0;
        const normalizedEffectiveness = (effectiveness / 10) * 0.8; // Scale 0-10 to 0-0.8 max
        
        // Distribute effectiveness based on control type
        if (control.controlType === 'preventive') {
          totalEAvoid += normalizedEffectiveness * implFactor;
          totalEDeter += normalizedEffectiveness * 0.5 * implFactor;
        } else if (control.controlType === 'detective') {
          totalEDetect += normalizedEffectiveness * implFactor;
          totalERespond += normalizedEffectiveness * 0.3 * implFactor;
        } else if (control.controlType === 'corrective') {
          totalERecover += normalizedEffectiveness * implFactor;
          totalERespond += normalizedEffectiveness * 0.7 * implFactor;
        }
        
        // All controls contribute to resistance
        totalEResist += normalizedEffectiveness * 0.6 * implFactor;
      }

      // Calculate averages
      residualParams.eAvoid = totalEAvoid / controlCount;
      residualParams.eDeter = totalEDeter / controlCount;
      residualParams.eDetect = totalEDetect / controlCount;
      residualParams.eResist = totalEResist / controlCount;
      residualParams.eRespond = totalERespond / controlCount;
      residualParams.eRecover = totalERecover / controlCount;
    }
  }

  // Calculate residual risk percentiles using FAIR-CAM methodology
  const residualPercentiles = runEnhancedFairCamMonteCarlo(residualParams, 10000);

  // Calculate basic risk values
  const inherentRisk = inherentPercentiles.aleMean;
  const residualRisk = residualPercentiles.aleMean;

  // Calculate susceptibility
  const tc = parseFloat(risk.threatCapabilityAvg) || 0;
  const rs = parseFloat(risk.resistanceStrengthAvg) || 0;
  const susceptibility = 1 / (1 + Math.exp(-(tc - rs) / 2));

  // Create Monte Carlo results for compatibility
  const monteCarloResults = {
    mean: residualRisk,
    p05: residualPercentiles.ale10 * 0.5,
    p25: residualPercentiles.ale25,
    p50: residualPercentiles.ale50,
    p75: residualPercentiles.ale75,
    p95: residualPercentiles.ale95,
    max: residualPercentiles.ale99 * 1.2
  };

  // Calculate loss magnitude
  const lossMagnitude = {
    min: parseFloat(risk.primaryLossMagnitudeMin) || 0,
    avg: parseFloat(risk.primaryLossMagnitudeAvg) || 0,
    max: parseFloat(risk.primaryLossMagnitudeMax) || 0
  };

  // Calculate secondary loss magnitude
  const secondaryLossMagnitude = {
    min: parseFloat(risk.secondaryLossMagnitudeMin) || 0,
    avg: parseFloat(risk.secondaryLossMagnitudeAvg) || 0,
    max: parseFloat(risk.secondaryLossMagnitudeMax) || 0
  };

  return {
    inherentRisk,
    residualRisk,
    susceptibility,
    inherentPercentiles,
    residualPercentiles,
    monteCarloResults,
    lossMagnitude,
    secondaryLossMagnitude
  };
}

/**
 * Convert risk database record to calculation parameters
 * 
 * @param risk Risk record from database
 * @returns RiskCalculationParams object
 */
export function convertRiskToCalculationParams(risk: any): RiskCalculationParams {
  return {
    contactFrequencyMin: parseFloat(risk.contactFrequencyMin) || 0,
    contactFrequencyAvg: parseFloat(risk.contactFrequencyAvg) || 0,
    contactFrequencyMax: parseFloat(risk.contactFrequencyMax) || 0,
    probabilityOfActionMin: parseFloat(risk.probabilityOfActionMin) || 0,
    probabilityOfActionAvg: parseFloat(risk.probabilityOfActionAvg) || 0,
    probabilityOfActionMax: parseFloat(risk.probabilityOfActionMax) || 0,
    threatCapabilityMin: parseFloat(risk.threatCapabilityMin) || 0,
    threatCapabilityAvg: parseFloat(risk.threatCapabilityAvg) || 0,
    threatCapabilityMax: parseFloat(risk.threatCapabilityMax) || 0,
    resistanceStrengthMin: parseFloat(risk.resistanceStrengthMin) || 0,
    resistanceStrengthAvg: parseFloat(risk.resistanceStrengthAvg) || 0,
    resistanceStrengthMax: parseFloat(risk.resistanceStrengthMax) || 0,
    primaryLossMagnitudeMin: parseFloat(risk.primaryLossMagnitudeMin) || 0,
    primaryLossMagnitudeAvg: parseFloat(risk.primaryLossMagnitudeAvg) || 0,
    primaryLossMagnitudeMax: parseFloat(risk.primaryLossMagnitudeMax) || 0,
    secondaryLossEventFrequencyMin: parseFloat(risk.secondaryLossEventFrequencyMin) || 0,
    secondaryLossEventFrequencyAvg: parseFloat(risk.secondaryLossEventFrequencyAvg) || 0,
    secondaryLossEventFrequencyMax: parseFloat(risk.secondaryLossEventFrequencyMax) || 0,
    secondaryLossMagnitudeMin: parseFloat(risk.secondaryLossMagnitudeMin) || 0,
    secondaryLossMagnitudeAvg: parseFloat(risk.secondaryLossMagnitudeAvg) || 0,
    secondaryLossMagnitudeMax: parseFloat(risk.secondaryLossMagnitudeMax) || 0
  };
}