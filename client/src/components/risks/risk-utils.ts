import type { UseFormReturn } from "react-hook-form";
import { calculateRiskValues } from "@shared/utils/calculations";

// Declare global window extension for asset cache
declare global {
  interface Window {
    __ASSET_CACHE__?: {
      [id: string]: {
        id: number;
        name: string;
        assetValue: string | number;
        currency?: string;
      }
    }
  }
}

// Get asset from cache if available
export const getAssetFromCache = (id: any) => {
  if (window.__ASSET_CACHE__ && window.__ASSET_CACHE__[id]) {
    return window.__ASSET_CACHE__[id];
  }
  return null;
};

// Check if asset exists in cache
export const isAssetInCache = (id: any) => {
  return !!(window.__ASSET_CACHE__ && window.__ASSET_CACHE__[id]);
};

/**
 * Calculate the total monetary value of all assets
 * @param assets Array of assets to calculate value from
 * @returns Total monetary value of all assets or 0 if no assets
 */
export const calculateTotalAssetValue = (assets: any[]): number => {
  if (!assets || assets.length === 0) {
    return 0;
  }
  
  return assets.reduce((sum, asset) => {
    // Handle both string and number asset values
    const assetValue = asset.assetValue 
      ? (typeof asset.assetValue === 'string' 
          ? parseFloat(asset.assetValue) 
          : Number(asset.assetValue))
      : 0;
    
    return sum + (isNaN(assetValue) ? 0 : assetValue);
  }, 0);
};

/**
 * Calculate the minimum asset value across all assets
 * @param assets Array of assets to calculate minimum value from
 * @returns Minimum asset value or 0 if no assets
 */
export const calculateMinAssetValue = (assets: any[]): number => {
  if (!assets || assets.length === 0) {
    return 0;
  }
  
  // Use 80% of the average value as the minimum value estimate
  return calculateTotalAssetValue(assets) * 0.8 / assets.length;
};

/**
 * Calculate the average asset value
 * @param assets Array of assets to calculate average value from
 * @returns Average asset value or 0 if no assets
 */
export const calculateAvgAssetValue = (assets: any[]): number => {
  if (!assets || assets.length === 0) {
    return 0;
  }
  
  return calculateTotalAssetValue(assets) / assets.length;
};

/**
 * Calculate the maximum asset value across all assets
 * @param assets Array of assets to calculate maximum value from
 * @returns Maximum asset value or 0 if no assets
 */
export const calculateMaxAssetValue = (assets: any[]): number => {
  if (!assets || assets.length === 0) {
    return 0;
  }
  
  // Use 120% of the average value as the maximum value estimate
  return calculateTotalAssetValue(assets) * 1.2 / assets.length;
};

/**
 * Detect if any risk parameters have changed from their original values
 * 
 * @param form The form instance with current values
 * @returns True if any parameter has changed, false if all parameters are unchanged
 */
export const detectParameterChanges = (form: UseFormReturn<any>): boolean => {
  try {
    // Get original values that were loaded into the form
    const originalValues = form.formState.defaultValues || {};
    
    // Get current values in the form
    const currentValues = form.getValues();
    
    // Parameters that affect risk calculation
    const riskParameters = [
      // Contact Frequency
      'contactFrequencyMin',
      'contactFrequencyAvg',
      'contactFrequencyMax',
      
      // Probability of Action
      'probabilityOfActionMin',
      'probabilityOfActionAvg',
      'probabilityOfActionMax',
      
      // Threat Capability
      'threatCapabilityMin',
      'threatCapabilityAvg',
      'threatCapabilityMax',
      
      // Resistance Strength
      'resistanceStrengthMin',
      'resistanceStrengthAvg',
      'resistanceStrengthMax',
      'resistanceStrength', // Legacy field
      
      // Primary Loss Magnitude
      'primaryLossMagnitudeMin',
      'primaryLossMagnitudeAvg',
      'primaryLossMagnitudeMax',
      
      // Secondary Loss Event Frequency
      'secondaryLossEventFrequencyMin',
      'secondaryLossEventFrequencyAvg',
      'secondaryLossEventFrequencyMax',
      
      // Secondary Loss Magnitude
      'secondaryLossMagnitudeMin',
      'secondaryLossMagnitudeAvg',
      'secondaryLossMagnitudeMax',
      
      // Associated Assets
      'associatedAssets'
    ];
    
    // Check if any parameter has changed
    for (const param of riskParameters) {
      const originalValue = originalValues[param];
      const currentValue = currentValues[param];
      
      // Special check for arrays (like associatedAssets)
      if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
        // Check if arrays have different lengths
        if (originalValue.length !== currentValue.length) {
          console.log(`Parameter ${param} changed: different array lengths`);
          return true;
        }
        
        // Check if array contents are different
        for (let i = 0; i < originalValue.length; i++) {
          if (originalValue[i] !== currentValue[i]) {
            console.log(`Parameter ${param} changed: array contents different at index ${i}`);
            return true;
          }
        }
      } 
      // Handle numeric values - convert to numbers for comparison
      else if (
        (typeof originalValue === 'number' || typeof originalValue === 'string') &&
        (typeof currentValue === 'number' || typeof currentValue === 'string')
      ) {
        const numOriginal = Number(originalValue);
        const numCurrent = Number(currentValue);
        
        // Check if values are different, accounting for floating point imprecision
        if (!isNaN(numOriginal) && !isNaN(numCurrent) && Math.abs(numOriginal - numCurrent) > 0.0001) {
          console.log(`Parameter ${param} changed from ${numOriginal} to ${numCurrent}`);
          return true;
        }
      }
      // Simple equality check for other types
      else if (originalValue !== currentValue) {
        console.log(`Parameter ${param} changed from ${originalValue} to ${currentValue}`);
        return true;
      }
    }
    
    // No changes detected
    return false;
  } catch (error) {
    console.error("Error detecting parameter changes:", error);
    // If there's an error, assume changes exist to be safe
    return true;
  }
};

/**
 * Calculate risk values based on form inputs
 * 
 * @param form The form instance
 * @returns Object with inherent risk and other calculated values
 */
export const calculateRiskFromForm = (form: UseFormReturn<any>) => {
  // Create a default result object with zero values
  const defaultResult = {
    inherentRisk: 0,
    residualRisk: 0,
    threatEventFrequency: 0,
    susceptibility: 0,
    lossEventFrequency: 0,
    probableLossMagnitude: 0,
    lossEventFrequencyMin: 0,
    lossEventFrequencyAvg: 0,
    lossEventFrequencyMax: 0,
    probabilityMin: 0,
    probabilityAvg: 0,
    probabilityMax: 0,
    threatEventFrequencyMin: 0,
    threatEventFrequencyAvg: 0,
    threatEventFrequencyMax: 0,
    susceptibilityMin: 0,
    susceptibilityAvg: 0,
    susceptibilityMax: 0,
    lossMagnitudeMin: 0,
    lossMagnitudeAvg: 0,
    lossMagnitudeMax: 0,
    probableLossMagnitudeMin: 0,
    probableLossMagnitudeAvg: 0,
    probableLossMagnitudeMax: 0,
    // Add confidence fields
    contactFrequencyConfidence: "medium",
    probabilityOfActionConfidence: "medium",
    threatCapabilityConfidence: "medium",
    resistanceStrengthConfidence: "medium",
    threatEventFrequencyConfidence: "medium",
    susceptibilityConfidence: "medium",
    lossEventFrequencyConfidence: "medium",
    primaryLossMagnitudeConfidence: "medium",
    secondaryLossEventFrequencyConfidence: "medium",
    secondaryLossMagnitudeConfidence: "medium",
    lossMagnitudeConfidence: "medium"
  };
  
  // Exit early if form is not properly initialized
  if (!form) {
    console.error("Form is undefined in calculateRiskFromForm");
    return defaultResult;
  }
  
  // Check if getValues is a function (more reliable than just checking existence)
  if (typeof form.getValues !== 'function') {
    console.error("Form getValues is not a function in calculateRiskFromForm");
    return defaultResult;
  }

  try {
    // Extremely safe getter function to avoid any undefined values
    const safeGetValue = (fieldName: string, defaultValue = 0) => {
      try {
        // First check if the form has a getValues function
        if (typeof form.getValues !== 'function') {
          console.warn(`getValues is not a function on form when getting ${fieldName}`);
          return defaultValue;
        }
          
        // Try to get the value and convert it safely
        let value;
        try {
          value = form.getValues(fieldName);
        } catch (e) {
          console.warn(`Error in getValues for ${fieldName}`, e);
          return defaultValue;
        }
          
        // Convert to number if possible
        if (typeof value === 'number') return value;
        if (typeof value === 'string' && value !== '') {
          const numValue = Number(value);
          return isNaN(numValue) ? defaultValue : numValue;
        }
        return defaultValue;
      } catch (e) {
        console.warn(`Global error getting value for ${fieldName}`, e);
        return defaultValue;
      }
    };
    
    // Get confidence values
    const getConfidenceValue = (fieldName: string, defaultValue = "medium") => {
      try {
        const value = form.getValues(fieldName);
        return value || defaultValue;
      } catch (e) {
        return defaultValue;
      }
    };
    
    // Calculate primary loss magnitude average - safely
    const primaryLossMagnitudeMin = safeGetValue("primaryLossMagnitudeMin");
    const primaryLossMagnitudeMax = safeGetValue("primaryLossMagnitudeMax");
    // Use triangle distribution mode for primary loss avg - this is more accurate for FAIR
    const primaryLossMagnitudeAvg = safeGetValue("primaryLossMagnitudeAvg") || (primaryLossMagnitudeMin + primaryLossMagnitudeMax) / 2;
    const primaryLossMagnitudeConfidence = getConfidenceValue("primaryLossMagnitudeConfidence");
    
    // Calculate secondary loss magnitude average - safely
    const secondaryLossMagnitudeMin = safeGetValue("secondaryLossMagnitudeMin");
    const secondaryLossMagnitudeMax = safeGetValue("secondaryLossMagnitudeMax");
    // Use triangle distribution mode for secondary loss avg - this is more accurate for FAIR
    const secondaryLossMagnitudeAvg = safeGetValue("secondaryLossMagnitudeAvg") || (secondaryLossMagnitudeMin + secondaryLossMagnitudeMax) / 2;
    const secondaryLossMagnitudeConfidence = getConfidenceValue("secondaryLossMagnitudeConfidence");
    
    // Get secondary loss event frequency values
    const secondaryLossEventFrequencyMin = safeGetValue("secondaryLossEventFrequencyMin");
    const secondaryLossEventFrequencyAvg = safeGetValue("secondaryLossEventFrequencyAvg");
    const secondaryLossEventFrequencyMax = safeGetValue("secondaryLossEventFrequencyMax");
    const secondaryLossEventFrequencyConfidence = getConfidenceValue("secondaryLossEventFrequencyConfidence");
    
    // Calculate values and update them in the form
    // Calculate Threat Event Frequency - safely
    const contactFrequencyMin = safeGetValue("contactFrequencyMin");
    const contactFrequencyAvg = safeGetValue("contactFrequencyAvg");
    const contactFrequencyMax = safeGetValue("contactFrequencyMax");
    const contactFrequencyConfidence = getConfidenceValue("contactFrequencyConfidence");
    
    const probabilityOfActionMin = safeGetValue("probabilityOfActionMin");
    const probabilityOfActionAvg = safeGetValue("probabilityOfActionAvg");
    const probabilityOfActionMax = safeGetValue("probabilityOfActionMax");
    const probabilityOfActionConfidence = getConfidenceValue("probabilityOfActionConfidence");
    
    // Calculate TEF with min, avg, max values
    const threatEventFrequencyMin = contactFrequencyMin * probabilityOfActionMin;
    const threatEventFrequencyAvg = contactFrequencyAvg * probabilityOfActionAvg;
    const threatEventFrequencyMax = contactFrequencyMax * probabilityOfActionMax;
    const threatEventFrequency = threatEventFrequencyAvg; // For compatibility
    const threatEventFrequencyConfidence = getConfidenceValue("threatEventFrequencyConfidence");
    
    // Update TEF values in form - force immediate update
    // FAIR v3.0 Formula: TEF = CF * PoA (Threat Event Frequency = Contact Frequency * Probability of Action)
    form.setValue("threatEventFrequencyMin", threatEventFrequencyMin, { shouldValidate: true, shouldDirty: true });
    form.setValue("threatEventFrequencyAvg", threatEventFrequencyAvg, { shouldValidate: true, shouldDirty: true });
    form.setValue("threatEventFrequencyMax", threatEventFrequencyMax, { shouldValidate: true, shouldDirty: true });
    form.setValue("threatEventFrequency", threatEventFrequencyAvg, { shouldValidate: true, shouldDirty: true });
    
    // Calculate Susceptibility - safely
    const threatCapabilityMin = safeGetValue("threatCapabilityMin");
    const threatCapabilityAvg = safeGetValue("threatCapabilityAvg");
    const threatCapabilityMax = safeGetValue("threatCapabilityMax");
    const threatCapabilityConfidence = getConfidenceValue("threatCapabilityConfidence");
    
    const resistanceStrengthMin = safeGetValue("resistanceStrengthMin");
    const resistanceStrengthAvg = safeGetValue("resistanceStrengthAvg");
    const resistanceStrengthMax = safeGetValue("resistanceStrengthMax");
    const resistanceStrengthConfidence = getConfidenceValue("resistanceStrengthConfidence");
    
    // Calculate susceptibility with min, avg, max values using FAIR-U sigmoid function
    let susceptibilityMin = 0;
    let susceptibilityAvg = 0;
    let susceptibilityMax = 0;
    const susceptibilityConfidence = getConfidenceValue("susceptibilityConfidence");
    
    // FAIR-U model formula for susceptibility/vulnerability calculation using sigmoid function
    const calculateSusceptibilityValue = (threatCap: number, resistanceStr: number): number => {
      // Calculate delta between threat capability and resistance strength
      const delta = threatCap - resistanceStr;
      
      // Calculate susceptibility using sigmoid function (FAIR-U)
      // Formula: 1 / (1 + e^(-delta/2))
      return 1 / (1 + Math.exp(-delta / 2));
    };
    
    // For min susceptibility, use min threat capability and max resistance strength
    if (threatCapabilityMin > 0 && resistanceStrengthMax > 0) {
      susceptibilityMin = calculateSusceptibilityValue(threatCapabilityMin, resistanceStrengthMax);
    }
    
    // For avg susceptibility, use avg threat capability and avg resistance strength
    if (threatCapabilityAvg > 0 && resistanceStrengthAvg > 0) {
      susceptibilityAvg = calculateSusceptibilityValue(threatCapabilityAvg, resistanceStrengthAvg);
    }
    
    // For max susceptibility, use max threat capability and min resistance strength
    if (threatCapabilityMax > 0 && resistanceStrengthMin > 0) {
      susceptibilityMax = calculateSusceptibilityValue(threatCapabilityMax, resistanceStrengthMin);
    }
    
    // Update susceptibility values in form - force update immediately
    form.setValue("susceptibilityMin", susceptibilityMin, { shouldValidate: true, shouldDirty: true });
    form.setValue("susceptibilityAvg", susceptibilityAvg, { shouldValidate: true, shouldDirty: true });
    form.setValue("susceptibilityMax", susceptibilityMax, { shouldValidate: true, shouldDirty: true });
    
    // Calculate Loss Event Frequency with min, avg, max values
    // FAIR v3.0 Formula: LEF = TEF * Vulnerability
    const lossEventFrequencyMin = threatEventFrequencyMin * susceptibilityMin;
    const lossEventFrequencyAvg = threatEventFrequencyAvg * susceptibilityAvg;
    const lossEventFrequencyMax = threatEventFrequencyMax * susceptibilityMax;
    const lossEventFrequency = lossEventFrequencyAvg; // For compatibility
    const lossEventFrequencyConfidence = getConfidenceValue("lossEventFrequencyConfidence");
    
    // Update Loss Event Frequency values in form - force immediate update
    form.setValue("lossEventFrequencyMin", lossEventFrequencyMin, { shouldValidate: true, shouldDirty: true });
    form.setValue("lossEventFrequencyAvg", lossEventFrequencyAvg, { shouldValidate: true, shouldDirty: true });
    form.setValue("lossEventFrequencyMax", lossEventFrequencyMax, { shouldValidate: true, shouldDirty: true });
    form.setValue("lossEventFrequency", lossEventFrequencyAvg, { shouldValidate: true, shouldDirty: true });
    
    // Calculate secondary loss with min, avg, max values
    // FAIR v3.0 Formula: SL = SLEF * SLM
    const secondaryLossMin = secondaryLossEventFrequencyMin * secondaryLossMagnitudeMin;
    const secondaryLossAvg = secondaryLossEventFrequencyAvg * secondaryLossMagnitudeAvg;
    const secondaryLossMax = secondaryLossEventFrequencyMax * secondaryLossMagnitudeMax;
    
    // FAIR v3.0 Formula: LM = PL + SL (Loss Magnitude = Primary Loss + Secondary Loss)
    const probableLossMagnitudeMin = primaryLossMagnitudeMin + secondaryLossMin;
    const probableLossMagnitudeAvg = primaryLossMagnitudeAvg + secondaryLossAvg;
    const probableLossMagnitudeMax = primaryLossMagnitudeMax + secondaryLossMax;
    const probableLossMagnitude = probableLossMagnitudeAvg; // For compatibility
    const lossMagnitudeConfidence = getConfidenceValue("lossMagnitudeConfidence");
    
    // Get the asset data for the calculation (for inherent risk calculation)
    let assetObjects: { assetId: string; assetValue: number; id?: number | string; name?: string }[] = [];
    try {
      const associatedAssets = form.getValues("associatedAssets");
      if (Array.isArray(associatedAssets) && associatedAssets.length > 0) {
        assetObjects = [];
        associatedAssets.forEach(assetId => {
          const cachedAsset = getAssetFromCache(assetId);
          if (cachedAsset && cachedAsset.assetValue !== undefined) {
            assetObjects.push({
              id: cachedAsset.id,
              assetId,
              name: cachedAsset.name,
              assetValue: typeof cachedAsset.assetValue === "string"
                ? parseFloat(cachedAsset.assetValue)
                : Number(cachedAsset.assetValue),
            });
          }
        });
      }
    } catch (error) {
      console.error("Error getting associated assets:", error);
    }
    
    // Build the parameters for inherent risk calculation
    const params: any = {
      // Contact Frequency
      cfMin: contactFrequencyMin,
      cfMode: contactFrequencyAvg,
      cfMax: contactFrequencyMax,
      
      // Probability of Action
      poaMin: probabilityOfActionMin,
      poaMode: probabilityOfActionAvg,
      poaMax: probabilityOfActionMax,
      
      // Threat Capability
      tcMin: threatCapabilityMin,
      tcMode: threatCapabilityAvg,
      tcMax: threatCapabilityMax,
      
      // Resistance Strength
      rsMin: resistanceStrengthMin,
      rsMode: resistanceStrengthAvg,
      rsMax: resistanceStrengthMax,
      
      // Primary Loss Magnitude factors - these will be multiplied by asset value in the Monte Carlo simulation
      plMin: primaryLossMagnitudeMin,
      plMode: primaryLossMagnitudeAvg,
      plMax: primaryLossMagnitudeMax,
      
      // Secondary Loss Event Frequency
      slefMin: secondaryLossEventFrequencyMin,
      slefMode: secondaryLossEventFrequencyAvg,
      slefMax: secondaryLossEventFrequencyMax,
      
      // Secondary Loss Magnitude factors - these will be multiplied by asset value (at 50%) in the Monte Carlo simulation
      slmMin: secondaryLossMagnitudeMin, 
      slmMode: secondaryLossMagnitudeAvg,
      slmMax: secondaryLossMagnitudeMax,
      
      // Control effectiveness factors
      eAvoid: safeGetValue("eAvoid", 0),
      eDeter: safeGetValue("eDeter", 0),
      eResist: safeGetValue("eResist", 0),
      eDetect: safeGetValue("eDetect", 0),
      
      // Default number of iterations for Monte Carlo simulation
      iterations: 10000,
      
      // Pass the full asset objects with their values to the calculation
      associatedAssets: assetObjects
    };
    
    // Log calculation parameters
    console.log("Calculation params:", params);
    
    // Check for existing risk values in the form (for edit mode)
    const existingInherentRisk = Number(form.getValues("inherentRisk") || 0);
    const existingResidualRisk = Number(form.getValues("residualRisk") || 0);
    
    // Check if any parameters have changed from their original values
    // This is the key change: only calculate risk if parameters have changed
    const hasParameterChanges = detectParameterChanges(form);
    
    console.log("Parameter changes detected:", hasParameterChanges);
    
    // Verify full asset data is available
    if (!params.associatedAssets || (params.associatedAssets as any[]).length === 0 || 
        (params.associatedAssets as any[]).every(a => !a.assetValue || parseFloat(String(a.assetValue)) <= 0)) {
      console.log("No assets with values associated - checking for existing values");
      
      // If we have existing values, use them instead of zeroing out
      if (existingInherentRisk > 0 || existingResidualRisk > 0) {
        console.log("Using existing risk values from database:", { 
          inherentRisk: existingInherentRisk, 
          residualRisk: existingResidualRisk 
        });
        
        // Get other values from form or use defaults
        const threatEventFrequency = Number(form.getValues("threatEventFrequency") || 0);
        const susceptibility = Number(form.getValues("susceptibility") || 0);
        const lossEventFrequency = Number(form.getValues("lossEventFrequency") || 0);
        const probableLossMagnitude = Number(form.getValues("probableLossMagnitude") || 0);
        
        // Return existing values with all confidence fields included
        return {
          inherentRisk: existingInherentRisk,
          residualRisk: existingResidualRisk,
          threatEventFrequency,
          susceptibility,
          lossEventFrequency,
          probableLossMagnitude,
          
          // Min/avg/max values
          threatEventFrequencyMin: Number(form.getValues("threatEventFrequencyMin") || 0),
          threatEventFrequencyAvg: Number(form.getValues("threatEventFrequencyAvg") || 0),
          threatEventFrequencyMax: Number(form.getValues("threatEventFrequencyMax") || 0),
          
          susceptibilityMin: Number(form.getValues("susceptibilityMin") || 0),
          susceptibilityAvg: Number(form.getValues("susceptibilityAvg") || 0),
          susceptibilityMax: Number(form.getValues("susceptibilityMax") || 0),
          
          lossMagnitudeMin: Number(form.getValues("lossMagnitudeMin") || 0),
          lossMagnitudeAvg: Number(form.getValues("lossMagnitudeAvg") || 0),
          lossMagnitudeMax: Number(form.getValues("lossMagnitudeMax") || 0),
          
          // All confidence fields
          contactFrequencyConfidence,
          probabilityOfActionConfidence,
          threatCapabilityConfidence,
          resistanceStrengthConfidence,
          threatEventFrequencyConfidence,
          susceptibilityConfidence,
          lossEventFrequencyConfidence,
          primaryLossMagnitudeConfidence,
          secondaryLossEventFrequencyConfidence,
          secondaryLossMagnitudeConfidence,
          lossMagnitudeConfidence
        };
      }
      
      // No existing values and no assets - return zeros
      return defaultResult;
    } else if (!hasParameterChanges && existingInherentRisk > 0) {
      // If we have full asset data but no parameter changes, use database values
      console.log("No parameter changes detected - using existing database values:", {
        inherentRisk: existingInherentRisk,
        residualRisk: existingResidualRisk
      });
      
      return {
        inherentRisk: existingInherentRisk,
        residualRisk: existingResidualRisk,
        threatEventFrequency: Number(form.getValues("threatEventFrequency") || 0),
        susceptibility: Number(form.getValues("susceptibility") || 0),
        lossEventFrequency: Number(form.getValues("lossEventFrequency") || 0),
        probableLossMagnitude: Number(form.getValues("probableLossMagnitude") || 0),
        
        threatEventFrequencyMin: Number(form.getValues("threatEventFrequencyMin") || 0),
        threatEventFrequencyAvg: Number(form.getValues("threatEventFrequencyAvg") || 0),
        threatEventFrequencyMax: Number(form.getValues("threatEventFrequencyMax") || 0),
        
        susceptibilityMin: Number(form.getValues("susceptibilityMin") || 0),
        susceptibilityAvg: Number(form.getValues("susceptibilityAvg") || 0),
        susceptibilityMax: Number(form.getValues("susceptibilityMax") || 0),
        
        lossMagnitudeMin: Number(form.getValues("lossMagnitudeMin") || 0),
        lossMagnitudeAvg: Number(form.getValues("lossMagnitudeAvg") || 0),
        lossMagnitudeMax: Number(form.getValues("lossMagnitudeMax") || 0),
        
        // Add all confidence fields
        contactFrequencyConfidence,
        probabilityOfActionConfidence,
        threatCapabilityConfidence,
        resistanceStrengthConfidence,
        threatEventFrequencyConfidence,
        susceptibilityConfidence,
        lossEventFrequencyConfidence,
        primaryLossMagnitudeConfidence,
        secondaryLossEventFrequencyConfidence,
        secondaryLossMagnitudeConfidence,
        lossMagnitudeConfidence
      };
    }
    
    // If parameters have changed or no existing values, we need to calculate
    console.log("Parameters changed or no existing values - calculating new risk values");
    
    // Log asset values for debugging
    console.log("Asset values for calculation:", 
      (params.associatedAssets as any[]).map(a => ({
        id: a.id, 
        name: a.name, 
        value: a.assetValue
      }))
    );
    
    // Use shared calculation utility with the Monte Carlo input format
    // This ensures we consistently use the FAIR v3.0 formulas from shared/utils/calculations.ts
    // which correctly models Risk = LEF * LM and handles inherent vs. residual risk calculation
    const calculationResult = calculateRiskValues(params, params.rsMode);
    
    console.log("Recalculated inherent risk:", calculationResult.inherentRisk);
    const inherentRisk = calculationResult.inherentRisk;
    const residualRisk = calculationResult.residualRisk;

    // Add lossMagnitude values for the risk form
    const lossMagnitudeMin = probableLossMagnitudeMin || 0;
    const lossMagnitudeAvg = probableLossMagnitudeAvg || 0;
    const lossMagnitudeMax = probableLossMagnitudeMax || 0;

    return {
      inherentRisk,
      residualRisk,
      threatEventFrequency,
      susceptibility: susceptibilityAvg,
      lossEventFrequency: lossEventFrequencyAvg,
      probableLossMagnitude: probableLossMagnitudeAvg,
      
      // Min/avg/max values for visualization
      threatEventFrequencyMin,
      threatEventFrequencyAvg,
      threatEventFrequencyMax,
      
      susceptibilityMin,
      susceptibilityAvg,
      susceptibilityMax,
      
      lossEventFrequencyMin,
      lossEventFrequencyAvg,
      lossEventFrequencyMax,
      
      // Add loss magnitude values to match the form fields
      lossMagnitudeMin,
      lossMagnitudeAvg,
      lossMagnitudeMax,
      
      probableLossMagnitudeMin,
      probableLossMagnitudeAvg,
      probableLossMagnitudeMax,
      
      // Include all confidence fields
      contactFrequencyConfidence,
      probabilityOfActionConfidence,
      threatCapabilityConfidence,
      resistanceStrengthConfidence,
      threatEventFrequencyConfidence,
      susceptibilityConfidence,
      lossEventFrequencyConfidence,
      primaryLossMagnitudeConfidence,
      secondaryLossEventFrequencyConfidence,
      secondaryLossMagnitudeConfidence,
      lossMagnitudeConfidence
    };
    
  } catch (error) {
    console.error("Error calculating risk from form:", error);
    return defaultResult;
  }
};
