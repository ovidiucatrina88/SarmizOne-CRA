export interface MonteCarloInput {
  cfMin: number;
  cfMode: number;
  cfMax: number;
  poaMin: number;
  poaMode: number;
  poaMax: number;
  tcMin: number;
  tcMode: number;
  tcMax: number;
  rsMin: number;
  rsMode: number;
  rsMax: number;
  plMin: number;
  plMode: number;
  plMax: number;
  slefMin: number;
  slefMode: number;
  slefMax: number;
  slmMin: number;
  slmMode: number;
  slmMax: number;
  eAvoid: number;
  eDeter: number;
  eResist: number;
  eDetect: number;
  iterations?: number;
  // IRIS 2025 actuarial parameters
  tefMin?: number;
  tefMode?: number;
  tefMax?: number;
  plMu?: number;
  plSigma?: number;
  // This property is used to access the actual associated asset objects with their values
  associatedAssets?: Array<{
    id: number;
    name: string;
    assetValue: string | number;
    currency?: string;
    // Include other relevant asset properties if needed
  }>;
}

export interface TrialResult {
  cf: number;
  poa: number;
  threatCap: number;
  resistance: number;
  susceptibility: number;
  lefUnadj: number;
  lefCam: number;
  pl: number;
  slef: number;
  slm: number;
  lmUnadj: number;
  lmCam: number;
  loss: number;
}

export interface MonteCarloFullResult {
  stats: {
    mean: number;
    p05: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
    max: number;
  };
  exceedance: { loss: number; probExceed: number }[];
  trials: TrialResult[];
}