/**
 * Risk calculation shared type definitions
 */

export interface RiskParams {
  tefMin: number;
  tefMost: number;
  tefMax: number;
  lmMin: number;
  lmMost: number;
  lmMax: number;
}

export interface FairCalculationResult {
  ale10: number;
  ale25: number;
  ale50: number;
  ale75: number;
  ale90: number;
  ale95: number;
  ale99: number;
  aleMean: number;
  aleMedian: number;
}

export interface AnnualizedLossRange {
  min: number;
  avg: number;
  max: number;
}