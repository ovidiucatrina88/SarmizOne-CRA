import { MonteCarloInput, MonteCarloFullResult } from "../models/riskParams";
import { runFairCamFullMonteCarlo } from "./monteCarlo";

/**
 * Adapter to run Monte Carlo simulation for risk calculation
 * This function adapts risk form data to the format expected by the Monte Carlo simulator
 * and adds inherentRisk and residualRisk properties to the result
 */
export function calculateRiskWithMonteCarlo(riskData: any): {
  inherentRisk: number;
  residualRisk: number;
  monteCarloResults: MonteCarloFullResult["stats"];
} {
  // Create input for Monte Carlo simulation from risk form data
  const monteCarloInput: MonteCarloInput = {
    // Contact Frequency
    cfMin: Number(riskData.contactFrequencyMin) || 0,
    cfMode: Number(riskData.contactFrequencyAvg) || 0,
    cfMax: Number(riskData.contactFrequencyMax) || 0,
    
    // Probability of Action
    poaMin: Number(riskData.probabilityOfActionMin) || 0,
    poaMode: Number(riskData.probabilityOfActionAvg) || 0,
    poaMax: Number(riskData.probabilityOfActionMax) || 0,
    
    // Threat Capability
    tcMin: Number(riskData.threatCapabilityMin) || 0,
    tcMode: Number(riskData.threatCapabilityAvg) || 0,
    tcMax: Number(riskData.threatCapabilityMax) || 0,
    
    // Resistance Strength (For residual risk)
    rsMin: Number(riskData.resistanceStrengthMin) || 0,
    rsMode: Number(riskData.resistanceStrengthAvg) || 0,
    rsMax: Number(riskData.resistanceStrengthMax) || 0,
    
    // Primary Loss Magnitude (adjusted by asset value)
    plMin: Number(riskData.primaryLossMagnitudeMin || 0) * (Number(riskData.assetValue || 1)),
    plMode: Number(riskData.primaryLossMagnitudeAvg || 0) * (Number(riskData.assetValue || 1)),
    plMax: Number(riskData.primaryLossMagnitudeMax || 0) * (Number(riskData.assetValue || 1)),
    
    // Secondary Loss Event Frequency
    slefMin: Number(riskData.secondaryLossEventFrequencyMin) || 0,
    slefMode: Number(riskData.secondaryLossEventFrequencyAvg) || 0,
    slefMax: Number(riskData.secondaryLossEventFrequencyMax) || 0,
    
    // Secondary Loss Magnitude
    slmMin: Number(riskData.secondaryLossMagnitudeMin) || 0,
    slmMode: Number(riskData.secondaryLossMagnitudeAvg) || 0,
    slmMax: Number(riskData.secondaryLossMagnitudeMax) || 0,
    
    // Control Effectiveness values
    eAvoid: Number(riskData.eAvoid) || 0,
    eDeter: Number(riskData.eDeter) || 0,
    eResist: Number(riskData.eResist) || 0,
    eDetect: Number(riskData.eDetect) || 0,
    
    // Iterations
    iterations: Number(riskData.iterations) || 10000
  };
  
  // Run Monte Carlo simulation for residual risk
  console.log("Running Monte Carlo simulation with inputs:", monteCarloInput);
  const monteCarloFullResult = runFairCamFullMonteCarlo(monteCarloInput);
  const residualRisk = monteCarloFullResult.stats.mean;
  
  // For inherent risk calculation, use a worst-case scenario without controls
  // Rerun simulation with zero resistance to get inherent risk
  const inherentInput = {...monteCarloInput};
  inherentInput.rsMin = 0;
  inherentInput.rsMode = 0;
  inherentInput.rsMax = 0;
  inherentInput.eAvoid = 0;
  inherentInput.eDeter = 0;
  inherentInput.eResist = 0;
  inherentInput.eDetect = 0;
  
  const inherentMonteCarloResult = runFairCamFullMonteCarlo(inherentInput);
  const inherentRisk = inherentMonteCarloResult.stats.mean;
  
  console.log("Calculation complete:", {
    inherentRisk,
    residualRisk, 
    stats: monteCarloFullResult.stats
  });
  
  return {
    inherentRisk,
    residualRisk,
    monteCarloResults: monteCarloFullResult.stats
  };
}