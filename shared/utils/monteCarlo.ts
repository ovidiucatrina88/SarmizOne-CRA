import { triangular } from "./triangular";

// Define local types to avoid circular imports
export interface ControlEffectiveness {
  eAvoid: number;
  eDeter: number;
  eResist: number;
  eDetect: number;
}

// FAIR-CAM calculation functions
export function fairCamRisk(
  cf: number,
  poa: number,
  sus: number,
  pl: number,
  slef: number,
  slm: number,
  eAvoid: number = 0,
  eDeter: number = 0,
  eResist: number = 0,
  eDetect: number = 0
): number {
  // Ensure all inputs are valid numbers - if not, replace with safe defaults
  cf = cleanNumber(cf, 0);
  poa = cleanNumber(poa, 0);
  sus = cleanNumber(sus, 0);
  pl = cleanNumber(pl, 0);
  slef = cleanNumber(slef, 0);
  slm = cleanNumber(slm, 0);
  eAvoid = cleanNumber(eAvoid, 0);
  eDeter = cleanNumber(eDeter, 0);
  eResist = cleanNumber(eResist, 0);
  eDetect = cleanNumber(eDetect, 0);
  
  // Apply FAIR-CAM controls: avoidance and deterrence reduce likelihood
  const adjustedLef = adjustedLEF(cf, poa, sus, eAvoid, eDeter, eResist);
  
  // Detection reduces loss magnitude
  const adjustedLm = adjustedLM(pl, slef, slm, eDetect);
  
  // Calculate risk and ensure result is a valid number (no NaN)
  let result = adjustedLef * adjustedLm;
  return cleanNumber(result, 0);
}

// Helper function to ensure values are valid numbers
function cleanNumber(value: any, defaultValue: number = 0): number {
  // If it's already a number and not NaN, use it
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  
  // If it's a string, try to parse it
  if (typeof value === 'string') {
    // Remove commas and any other non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.-]/g, '');
    const numValue = parseFloat(cleanValue);
    
    if (!isNaN(numValue)) {
      return numValue;
    }
  }
  
  // If all else fails, return the default value
  return defaultValue;
}

// Helper function for adjusted Loss Event Frequency
export function adjustedLEF(
  cf: number,
  poa: number,
  sus: number,
  eAvoid: number,
  eDeter: number,
  eResist: number
): number {
  // Calculate TEF (Threat Event Frequency)
  const tef = cf * poa;
  
  // Avoidance reduces frequency of contact
  const adjustedTef = tef * (1 - eAvoid);
  
  // Deterrence reduces percentage of contacts that become threat events
  const adjustedPoa = poa * (1 - eDeter);
  
  // Resistance reduces percentage of threat events that result in loss events
  const adjustedSus = sus * (1 - eResist);
  
  // Calculate adjusted LEF (Loss Event Frequency)
  return adjustedTef * adjustedSus;
}

// Helper function for adjusted Loss Magnitude
export function adjustedLM(
  pl: number,
  slef: number,
  slm: number,
  eDetect: number
): number {
  // Calculate total loss magnitude (primary + secondary losses)
  const totalLm = pl + (slef * slm);
  
  // Detection reduces overall loss magnitude
  return totalLm * (1 - eDetect);
}

// Map controls to effectiveness values
export function mapControlsToEffectiveness(controls: any[]): ControlEffectiveness {
  // Default effectiveness values (starting with minimal values rather than 0)
  // This ensures we always have some effectiveness when controls are present
  let effectiveness: ControlEffectiveness = {
    eAvoid: 0.05,
    eDeter: 0.05,
    eResist: 0.05,
    eDetect: 0.05,
  };
  
  // Only process if we have controls
  if (!controls || controls.length === 0) {
    return effectiveness;
  }
  
  // Count fully implemented and in-progress controls separately
  const fullyImplemented = controls.filter(
    c => c.implementationStatus === "fully_implemented" || c.implementationStatus === "Fully Implemented"
  );
  
  const inProgress = controls.filter(
    c => c.implementationStatus === "in_progress" || c.implementationStatus === "In Progress"
  );
  
  // Apply a weighted factor for in-progress controls (50% effectiveness)
  const inProgressFactor = 0.5;
  
  // Calculate each effectiveness value based on control capabilities
  // Use average of control effectiveness values
  let avoidCount = 0;
  let deterCount = 0;
  let resistCount = 0;
  let detectCount = 0;
  
  // Process fully implemented controls at 100% effectiveness
  for (const control of fullyImplemented) {
    // If we have specific FAIR-CAM effectiveness values, use those
    if (control.e_avoid > 0 || control.e_deter > 0 || control.e_resist > 0 || control.e_detect > 0) {
      if (control.e_avoid > 0) {
        effectiveness.eAvoid += control.e_avoid;
        avoidCount++;
      }
      
      if (control.e_deter > 0) {
        effectiveness.eDeter += control.e_deter;
        deterCount++;
      }
      
      if (control.e_resist > 0) {
        effectiveness.eResist += control.e_resist;
        resistCount++;
      }
      
      if (control.e_detect > 0) {
        effectiveness.eDetect += control.e_detect;
        detectCount++;
      }
    } 
    // If not, use the controlEffectiveness value (0-10 scale) to populate values based on control type
    else if (control.controlEffectiveness > 0) {
      // Convert from 0-10 scale to 0-1 scale
      const effectivenessValue = control.controlEffectiveness / 10;
      
      // Apply effectiveness based on control type
      if (control.controlType === "preventive") {
        effectiveness.eAvoid += effectivenessValue * 0.5;
        effectiveness.eDeter += effectivenessValue * 0.5;
        avoidCount++;
        deterCount++;
      } else if (control.controlType === "detective") {
        effectiveness.eDetect += effectivenessValue;
        detectCount++;
      } else if (control.controlType === "corrective") {
        effectiveness.eResist += effectivenessValue;
        resistCount++;
      }
    }
  }
  
  // Process in-progress controls at 50% effectiveness
  for (const control of inProgress) {
    // If we have specific FAIR-CAM effectiveness values, use those
    if (control.e_avoid > 0 || control.e_deter > 0 || control.e_resist > 0 || control.e_detect > 0) {
      if (control.e_avoid > 0) {
        effectiveness.eAvoid += control.e_avoid * inProgressFactor;
        avoidCount++;
      }
      
      if (control.e_deter > 0) {
        effectiveness.eDeter += control.e_deter * inProgressFactor;
        deterCount++;
      }
      
      if (control.e_resist > 0) {
        effectiveness.eResist += control.e_resist * inProgressFactor;
        resistCount++;
      }
      
      if (control.e_detect > 0) {
        effectiveness.eDetect += control.e_detect * inProgressFactor;
        detectCount++;
      }
    }
    // If not, use the controlEffectiveness value (0-10 scale) to populate values based on control type
    else if (control.controlEffectiveness > 0) {
      // Convert from 0-10 scale to 0-1 scale and apply progress factor
      const effectivenessValue = (control.controlEffectiveness / 10) * inProgressFactor;
      
      // Apply effectiveness based on control type
      if (control.controlType === "preventive") {
        effectiveness.eAvoid += effectivenessValue * 0.5;
        effectiveness.eDeter += effectivenessValue * 0.5;
        avoidCount++;
        deterCount++;
      } else if (control.controlType === "detective") {
        effectiveness.eDetect += effectivenessValue;
        detectCount++;
      } else if (control.controlType === "corrective") {
        effectiveness.eResist += effectivenessValue;
        resistCount++;
      }
    }
  }
  
  // Calculate averages
  if (avoidCount > 0) effectiveness.eAvoid /= avoidCount;
  if (deterCount > 0) effectiveness.eDeter /= deterCount;
  if (resistCount > 0) effectiveness.eResist /= resistCount;
  if (detectCount > 0) effectiveness.eDetect /= detectCount;
  
  // Cap effectiveness values at 0.95 (95%)
  // Even the best controls can't be 100% effective
  effectiveness.eAvoid = Math.min(effectiveness.eAvoid, 0.95);
  effectiveness.eDeter = Math.min(effectiveness.eDeter, 0.95);
  effectiveness.eResist = Math.min(effectiveness.eResist, 0.95);
  effectiveness.eDetect = Math.min(effectiveness.eDetect, 0.95);
  
  return effectiveness;
}

// Calculate risk with controls applied
export function calculateRiskWithControls(
  cf: number,
  poa: number,
  tc: number,
  rs: number,
  pl: number,
  slef: number,
  slm: number,
  controls: any[]
): number {
  // Calculate susceptibility based on threat capability vs. resistance strength
  const sus = 1 / (1 + Math.exp(-(tc - rs) / 2));
  
  // Get control effectiveness values
  const effectiveness = mapControlsToEffectiveness(controls);
  
  // Apply FAIR-CAM model with control effectiveness
  return fairCamRisk(
    cf,
    poa,
    sus,
    pl,
    slef,
    slm,
    effectiveness.eAvoid,
    effectiveness.eDeter,
    effectiveness.eResist,
    effectiveness.eDetect
  );
}
import {
  MonteCarloInput,
  MonteCarloFullResult,
  TrialResult,
} from "../models/riskParams";
import { Control } from "../models/control";

// Add the controls property to the imported type
// This will make it available throughout the application
declare module "../models/riskParams" {
  interface MonteCarloInput {
    controls?: Control[];
  }
}

// Cache for Monte Carlo simulations to avoid unnecessary recalculations
const monteCarloCache = new Map<string, MonteCarloFullResult>();

// Create a cache key from Monte Carlo parameters and controls
function createCacheKey(params: MonteCarloInput): string {
  // Extract the essential parameters that affect the calculation
  const essentialParams = {
    // Contact Frequency
    cfMin: params.cfMin,
    cfMode: params.cfMode,
    cfMax: params.cfMax,
    
    // Probability of Action
    poaMin: params.poaMin,
    poaMode: params.poaMode,
    poaMax: params.poaMax,
    
    // Threat Capability
    tcMin: params.tcMin,
    tcMode: params.tcMode,
    tcMax: params.tcMax,
    
    // Resistance Strength
    rsMin: params.rsMin,
    rsMode: params.rsMode,
    rsMax: params.rsMax,
    
    // Primary Loss
    plMin: params.plMin,
    plMode: params.plMode,
    plMax: params.plMax,
    
    // Secondary Loss Event Frequency
    slefMin: params.slefMin,
    slefMode: params.slefMode,
    slefMax: params.slefMax,
    
    // Secondary Loss Magnitude
    slmMin: params.slmMin,
    slmMode: params.slmMode,
    slmMax: params.slmMax,
    
    // Control effectiveness values
    eAvoid: params.eAvoid || 0,
    eDeter: params.eDeter || 0,
    eResist: params.eResist || 0,
    eDetect: params.eDetect || 0,
    
    // Asset information if available
    assetCount: params.associatedAssets?.length || 0,
    totalAssetValue: params.associatedAssets?.reduce((sum, asset) => {
      const assetValue = typeof asset.assetValue === 'string' 
        ? parseFloat(asset.assetValue.replace(/[^0-9.-]/g, '')) 
        : Number(asset.assetValue);
      return sum + (isNaN(assetValue) ? 0 : assetValue);
    }, 0) || 0,
  };
  
  // Include control IDs if controls are provided
  const controlIds = params.controls 
    ? params.controls.map(c => c.controlId).sort().join(',')
    : '';
  
  // Create a string key from the parameters and control IDs
  return JSON.stringify(essentialParams) + '|' + controlIds;
}

export function runFairCamFullMonteCarlo(
  params: MonteCarloInput,
): MonteCarloFullResult {
  // Ensure all numeric inputs are properly cleaned
  const sanitizedParams = {
    cfMin: cleanNumber(params.cfMin),
    cfMode: cleanNumber(params.cfMode),
    cfMax: cleanNumber(params.cfMax),
    poaMin: cleanNumber(params.poaMin),
    poaMode: cleanNumber(params.poaMode),
    poaMax: cleanNumber(params.poaMax),
    tcMin: cleanNumber(params.tcMin),
    tcMode: cleanNumber(params.tcMode),
    tcMax: cleanNumber(params.tcMax),
    rsMin: cleanNumber(params.rsMin),
    rsMode: cleanNumber(params.rsMode),
    rsMax: cleanNumber(params.rsMax),
    plMin: cleanNumber(params.plMin),
    plMode: cleanNumber(params.plMode),
    plMax: cleanNumber(params.plMax),
    slefMin: cleanNumber(params.slefMin),
    slefMode: cleanNumber(params.slefMode),
    slefMax: cleanNumber(params.slefMax),
    slmMin: cleanNumber(params.slmMin),
    slmMode: cleanNumber(params.slmMode),
    slmMax: cleanNumber(params.slmMax),
    iterations: cleanNumber(params.iterations, 10000),
    controls: params.controls || [],
    eAvoid: cleanNumber(params.eAvoid),
    eDeter: cleanNumber(params.eDeter),
    eResist: cleanNumber(params.eResist),
    eDetect: cleanNumber(params.eDetect),
    associatedAssets: params.associatedAssets || []
  };
  
  // Generate a cache key for these parameters
  const cacheKey = createCacheKey(sanitizedParams);
  
  // TEMPORARILY DISABLE CACHE TO FORCE FRESH CALCULATIONS
  // This ensures "Run Calculations" button always uses updated parameters
  // Check if we have a cached result (DISABLED FOR NOW)
  // const cachedResult = monteCarloCache.get(cacheKey);
  // if (cachedResult) {
  //   console.log("Using cached Monte Carlo calculation result");
  //   return cachedResult;
  // }
  
  console.log("FORCING FRESH Monte Carlo calculation - cache disabled");
  
  console.log("Calculating new Monte Carlo simulation - this may take a moment");
  const N = sanitizedParams.iterations;
  const trials: TrialResult[] = [];

  // If controls are provided, use them to calculate effectiveness values
  let controlEffectiveness: ControlEffectiveness = {
    eAvoid: sanitizedParams.eAvoid,
    eDeter: sanitizedParams.eDeter,
    eResist: sanitizedParams.eResist,
    eDetect: sanitizedParams.eDetect,
  };

  // If controls are provided from Control Inventory, use them to determine effectiveness values
  if (sanitizedParams.controls && sanitizedParams.controls.length > 0) {
    controlEffectiveness = mapControlsToEffectiveness(sanitizedParams.controls);
    console.log(
      "Control effectiveness mapped from inventory:",
      controlEffectiveness,
    );
  }

  for (let i = 0; i < N; i++) {
    const cf = triangular(params.cfMin, params.cfMode, params.cfMax);
    const poa = triangular(params.poaMin, params.poaMode, params.poaMax);
    const tc = triangular(params.tcMin, params.tcMode, params.tcMax);
    const rs = triangular(params.rsMin, params.rsMode, params.rsMax);
    const sus = 1 / (1 + Math.exp(-(tc - rs) / 2));
    // Get total asset value from associated assets
    let totalAssetValue = 0;

    // Check if we have associated assets with asset values
    if (
      params.associatedAssets &&
      Array.isArray(params.associatedAssets) &&
      params.associatedAssets.length > 0
    ) {
      // Sum up the asset values
      totalAssetValue = params.associatedAssets.reduce((sum, asset) => {
        // Clean and parse asset value
        const cleanValue = asset.assetValue
          ? String(asset.assetValue).replace(/[^0-9.-]/g, "")
          : "0";

        // Parse the cleaned value string to a number
        const assetValue = parseFloat(cleanValue);

        // Cap the asset value at a reasonable maximum (1 billion) to prevent extreme calculations
        const cappedValue = Math.min(
          isNaN(assetValue) ? 0 : assetValue,
          1000000000,
        );

        return sum + cappedValue;
      }, 0);

      console.log(`Monte Carlo using total asset value: ${totalAssetValue}`);
    }

    // If we have asset value, calculate appropriate loss magnitude
    // Otherwise use the standard primary loss parameters
    let plMin, plMode, plMax;

    if (totalAssetValue > 0) {
      // Calculate primary loss magnitudes based on asset value
      // Use 20-50-80% of asset value as min-avg-max loss scenarios
      plMin = totalAssetValue * 0.2;   // 20% of asset value for min loss
      plMode = totalAssetValue * 0.5;  // 50% of asset value for most likely loss
      plMax = totalAssetValue * 0.8;   // 80% of asset value for max loss
      
      console.log("Calculated primary loss from assets:", {
        min: plMin,
        avg: plMode,
        max: plMax
      });
      console.log("Using primary loss values calculated from asset values");
    } else {
      // No valid asset values available, use direct primary loss parameters as provided
      plMin = params.plMin;
      plMode = params.plMode;
      plMax = params.plMax;
      console.log("Using primary loss values from risk params (no valid asset values)");
    }

    // Add safeguards to prevent extreme values
    const MAX_LOSS = 1000000000; // 1 billion max loss
    plMin = Math.min(plMin, MAX_LOSS);
    plMode = Math.min(plMode, MAX_LOSS);
    plMax = Math.min(plMax, MAX_LOSS);

    // Use triangular distribution to get a random value within this range
    const pl = triangular(plMin, plMode, plMax);

    // Secondary loss event frequency isn't typically affected by asset value
    const slef = triangular(params.slefMin, params.slefMode, params.slefMax);

    const slm = triangular(params.slmMin, params.slmMode, params.slmMax);

    const lefUn = cf * poa * sus;
    const lmUn = pl + slef * slm;

    // Calculate with the original fairCamRisk function for compatibility
    const lefCam = fairCamRisk(
      cf,
      poa,
      sus,
      pl,
      slef,
      slm,
      params.eAvoid,
      params.eDeter,
      params.eResist,
      params.eDetect,
    );
    const lmCam = (pl + slef * slm) * (1 - params.eDetect);

    // Calculate adjusted values with Control Inventory effectiveness values
    // Only use these if controls are provided
    let loss = lefCam;

    if (params.controls && params.controls.length > 0) {
      const adjustedLef = adjustedLEF(
        cf,
        poa,
        sus,
        controlEffectiveness.eAvoid,
        controlEffectiveness.eDeter,
        controlEffectiveness.eResist,
      );

      const adjustedLm = adjustedLM(
        pl,
        slef,
        slm,
        controlEffectiveness.eDetect,
      );

      // FAIR formula: Risk = LEF * LM (Loss Event Frequency * Loss Magnitude)
      loss = adjustedLef * adjustedLm;
    }

    trials.push({
      cf,
      poa,
      threatCap: tc,
      resistance: rs,
      susceptibility: sus,
      lefUnadj: lefUn,
      lefCam,
      pl,
      slef,
      slm,
      lmUnadj: lmUn,
      lmCam,
      loss,
    });
  }

  trials.sort((a, b) => a.loss - b.loss);
  const losses = trials.map((t) => t.loss);
  const idx = (q: number) => losses[Math.floor(q * (N - 1))];
  const mean = losses.reduce((s, v) => s + v, 0) / N;

  const exceedance = losses.map((loss, i) => ({
    loss,
    probExceed: 1 - i / (N - 1),
  }));

  // Create the result object
  const result = {
    stats: {
      mean,
      p05: idx(0.05),
      p25: idx(0.25),
      p50: idx(0.5),
      p75: idx(0.75),
      p95: idx(0.95),
      max: losses[N - 1],
    },
    exceedance,
    trials,
  };
  
  // Store the result in our cache
  // Limit cache size to prevent memory issues (store max 100 results)
  if (monteCarloCache.size >= 100) {
    // Remove the oldest entry
    const firstKey = monteCarloCache.keys().next().value;
    if (firstKey) monteCarloCache.delete(firstKey);
  }
  
  // Add current result to cache
  monteCarloCache.set(cacheKey, result);
  
  return result;
}
