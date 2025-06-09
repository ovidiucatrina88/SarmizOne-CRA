import { RiskCalculationParams } from "@shared/schema";

/**
 * FAIR-U + FAIR-CAM Monte Carlo Risk Calculation (TypeScript)
 * Iterates 1000 simulations for residual risk using probability distributions
 */

function triangular(min: number, mode: number, max: number): number {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

export const calculateMonteCarloResidualRisk = (
  params: RiskCalculationParams,
  iterations: number = 1000,
): {
  mean: number;
  p10: number;
  p50: number;
  p90: number;
  max: number;
  meanTEF: number;
  meanLEF: number;
  susceptibilityMin: number;
  susceptibilityAvg: number;
  susceptibilityMax: number;
  lefMin: number;
  lefAvg: number;
  lefMax: number;
  lmMin: number;
  lmAvg: number;
  lmMax: number;
  slMin: number;
  slAvg: number;
  slMax: number;
} => {
  const riskResults: number[] = [];
  const tefResults: number[] = [];
  const lefResults: number[] = [];
  const susceptibilityValues: number[] = [];
  const lmValues: number[] = [];
  const slValues: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const cf = triangular(
      params.contactFrequencyMin,
      params.contactFrequencyAvg,
      params.contactFrequencyMax,
    );
    const poa = triangular(
      params.probabilityOfActionMin,
      params.probabilityOfActionAvg,
      params.probabilityOfActionMax,
    );
    const threatCap = triangular(
      params.threatCapabilityMin,
      params.threatCapabilityAvg,
      params.threatCapabilityMax,
    );
    const resistanceStr = triangular(
      params.resistanceStrengthMin,
      params.resistanceStrengthAvg,
      params.resistanceStrengthMax,
    );

    const delta = threatCap - resistanceStr;
    const susceptibility = 1 / (1 + Math.exp(-delta / 2));

    const tef = cf * poa;
    const lef = tef * susceptibility;

    const pl = triangular(
      params.primaryLossMagnitudeMin,
      params.primaryLossMagnitudeAvg,
      params.primaryLossMagnitudeMax,
    );
    const slef = triangular(
      params.secondaryLossEventFrequencyMin || 0,
      params.secondaryLossEventFrequencyAvg || 0,
      params.secondaryLossEventFrequencyMax || 0,
    );
    const slm = triangular(
      params.secondaryLossMagnitudeMin || 0,
      params.secondaryLossMagnitudeAvg || 0,
      params.secondaryLossMagnitudeMax || 0,
    );

    const sl = slef * slm;
    const lm = pl + sl;
    const risk = lef * lm;

    riskResults.push(risk);
    tefResults.push(tef);
    lefResults.push(lef);
    susceptibilityValues.push(susceptibility);
    lmValues.push(lm);
    slValues.push(sl);
  }

  riskResults.sort((a, b) => a - b);

  const percentile = (p: number) => {
    const index = Math.floor((p / 100) * riskResults.length);
    return riskResults[index];
  };

  const mean =
    riskResults.reduce((sum, val) => sum + val, 0) / riskResults.length;
  const meanTEF =
    tefResults.reduce((sum, val) => sum + val, 0) / tefResults.length;
  const meanLEF =
    lefResults.reduce((sum, val) => sum + val, 0) / lefResults.length;
  const susceptibilityMin = Math.min(...susceptibilityValues);
  const susceptibilityAvg =
    susceptibilityValues.reduce((sum, val) => sum + val, 0) /
    susceptibilityValues.length;
  const susceptibilityMax = Math.max(...susceptibilityValues);
  const lefMin = Math.min(...lefResults);
  const lefAvg = meanLEF;
  const lefMax = Math.max(...lefResults);
  const lmMin = Math.min(...lmValues);
  const lmAvg = lmValues.reduce((sum, val) => sum + val, 0) / lmValues.length;
  const lmMax = Math.max(...lmValues);
  const slMin = Math.min(...slValues);
  const slAvg = slValues.reduce((sum, val) => sum + val, 0) / slValues.length;
  const slMax = Math.max(...slValues);

  return {
    mean: Math.round(mean),
    p10: Math.round(percentile(10)),
    p50: Math.round(percentile(50)),
    p90: Math.round(percentile(90)),
    max: Math.round(riskResults[riskResults.length - 1]),
    meanTEF: Number(meanTEF.toFixed(2)),
    meanLEF: Number(meanLEF.toFixed(2)),
    susceptibilityMin: Number(susceptibilityMin.toFixed(2)),
    susceptibilityAvg: Number(susceptibilityAvg.toFixed(2)),
    susceptibilityMax: Number(susceptibilityMax.toFixed(2)),
    lefMin: Number(lefMin.toFixed(2)),
    lefAvg: Number(lefAvg.toFixed(2)),
    lefMax: Number(lefMax.toFixed(2)),
    lmMin: Math.round(lmMin),
    lmAvg: Math.round(lmAvg),
    lmMax: Math.round(lmMax),
    slMin: Math.round(slMin),
    slAvg: Math.round(slAvg),
    slMax: Math.round(slMax),
  };
};

export const calculateInherentRisk = (
  params: RiskCalculationParams,
): number => {
  const cf = params.contactFrequencyAvg;
  const poa = params.probabilityOfActionAvg;
  const lef = cf * poa * 1; // Max susceptibility assumed (1.0)

  const pl = params.primaryLossMagnitudeAvg;
  const slef = params.secondaryLossEventFrequencyAvg || 0;
  const slm = params.secondaryLossMagnitudeAvg || 0;

  const lm = pl + slef * slm;
  const risk = lef * lm;

  return Math.round(risk);
};

export const calculateResidualRisk = (
  params: RiskCalculationParams,
): number => {
  const result = calculateMonteCarloResidualRisk(params, 1000);
  return result.mean;
};
