/**
 * Utility to calculate control effectiveness metrics
 * Maps control data to FAIR-CAM effectiveness metrics for reporting
 */

// Control effectiveness interface
export interface ControlEffectiveness {
  eAvoid: number;
  eDeter: number;
  eDetect: number;
  eResist: number;
}

/**
 * Maps controls to effectiveness values based on FAIR-CAM framework
 * 
 * @param controls Array of control objects
 * @returns Object with effectiveness metrics
 */
export function mapControlsToEffectiveness(controls: any[]): ControlEffectiveness {
  // Default effectiveness values (starting with minimal values rather than 0)
  // This ensures we always have some effectiveness when controls are present
  let effectiveness: ControlEffectiveness = {
    eAvoid: 0.05,
    eDeter: 0.05,
    eDetect: 0.05,
    eResist: 0.05,
  };
  
  // Only process if we have controls
  if (!controls || !Array.isArray(controls) || controls.length === 0) {
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
  
  // If we have at least one control, ensure minimum effectiveness of 0.1 (10%)
  if (fullyImplemented.length > 0 || inProgress.length > 0) {
    effectiveness.eAvoid = Math.max(effectiveness.eAvoid, 0.1);
    effectiveness.eDeter = Math.max(effectiveness.eDeter, 0.1);
    effectiveness.eResist = Math.max(effectiveness.eResist, 0.1);
    effectiveness.eDetect = Math.max(effectiveness.eDetect, 0.1);
  }
  
  return effectiveness;
}

/**
 * Helper function to apply a control's effectiveness to risk calculation
 * 
 * @param control Control object
 * @param riskValue Original risk value
 * @returns Reduced risk value after control is applied
 */
export function applyControlEffectiveness(control: any, riskValue: number): number {
  if (!control || !control.controlEffectiveness) {
    return riskValue;
  }
  
  // Convert from 0-10 scale to 0-1 scale
  const effectivenessValue = control.controlEffectiveness / 10;
  
  // Apply implementation status factor
  const implFactor = control.implementationStatus === 'fully_implemented' ? 1.0 : 
                    (control.implementationStatus === 'in_progress' ? 0.5 : 0.0);
  
  // Calculate risk reduction percentage
  const reductionPercent = effectivenessValue * implFactor;
  
  // Apply reduction to risk value
  return riskValue * (1 - reductionPercent);
}