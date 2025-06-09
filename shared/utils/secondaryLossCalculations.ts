// secondaryLossCalculations.ts
// Utility to calculate secondary loss (SL) distribution based on:
//  - SLEF: Secondary Loss Event Frequency (min, avg, max)
//  - SLM: Secondary Loss Magnitude per event (min, avg, max)
//  - Cost modules (fixed, perEvent, perHour, percent of loss)

export type CostModule = {
  id: string;
  // 'fixed'      -> a one-time cost per event
  // 'perEvent'   -> cost applied per incident
  // 'perHour'    -> cost multiplied by hours of downtime (context.hours)
  // 'percent'    -> percentage of the event loss magnitude
  type: 'fixed' | 'perEvent' | 'perHour' | 'percent';
  value: number; // for 'percent', use 0.20 for 20%
};

export type Distribution = {
  min: number;
  avg: number;
  max: number;
};

export interface SecondaryLossInputs {
  eventFrequency: Distribution;  // SLEF - Secondary Loss Event Frequency
  lossMagnitude: Distribution;   // SLM - per-event primary loss magnitude
  costModules: CostModule[];     // Cost modules from risk_costs table
  // Optional context for time-based cost calculations
  context?: { 
    hoursPerEvent?: number;      // Hours of downtime per event
    riskId?: string;             // Risk identifier for audit trail
    legalEntityId?: string;      // Legal entity for regional cost factors
  };
}

/**
 * Calculates the cost contribution of a single module for a given loss magnitude.
 */
function moduleCostFor(
  mod: CostModule,
  magnitude: number,
  hours: number
): number {
  switch (mod.type) {
    case 'fixed':
      return mod.value;
    case 'perEvent':
      return mod.value;
    case 'perHour':
      return mod.value * hours;
    case 'percent':
      return magnitude * mod.value;
    default:
      return 0;
  }
}

/**
 * Calculate the secondary loss distribution (min, avg, max) over one time period
 * by multiplying per-event costs by event frequency.
 */
export function calculateSecondaryLoss(
  inputs: SecondaryLossInputs
): Distribution {
  const { eventFrequency, lossMagnitude, costModules, context = {} } = inputs;
  const hours = context.hoursPerEvent ?? 8; // Default to 8 hours per incident

  // compute per-event costs for min/avg/max magnitudes
  let perEventMin = 0;
  let perEventAvg = 0;
  let perEventMax = 0;

  for (const mod of costModules) {
    perEventMin += moduleCostFor(mod, lossMagnitude.min, hours);
    perEventAvg += moduleCostFor(mod, lossMagnitude.avg, hours);
    perEventMax += moduleCostFor(mod, lossMagnitude.max, hours);
  }

  return {
    min: perEventMin * eventFrequency.min,
    avg: perEventAvg * eventFrequency.avg,
    max: perEventMax * eventFrequency.max,
  };
}

/**
 * Convert database cost module assignment to CostModule format
 * Aligned with risk_costs and cost_modules database schema
 */
export function convertDatabaseCostModule(assignment: any): CostModule {
  // Handle the structure from risk_costs JOIN cost_modules query
  const costType = assignment.cost_module?.costType || assignment.costType || assignment.cost_type;
  const costFactor = assignment.cost_module?.costFactor || assignment.costFactor || assignment.cost_factor;
  const moduleId = assignment.cost_module?.id || assignment.cost_module_id || assignment.id;
  const weight = assignment.materiality_weight || assignment.weight || 1.0;
  
  // Map database cost_type to our CostModule type according to schema
  let type: 'fixed' | 'perEvent' | 'perHour' | 'percent';
  switch (costType) {
    case 'fixed':
      type = 'fixed';
      break;
    case 'per_event':
      type = 'perEvent';
      break;
    case 'per_hour':
      type = 'perHour';
      break;
    case 'percentage':
      type = 'percent';
      break;
    default:
      type = 'fixed'; // Default fallback
  }
  
  // Use the original cost factor WITHOUT applying materiality weight as multiplier
  // Materiality weight should be used for prioritization/importance, not cost amplification
  const originalValue = parseFloat(costFactor) || 0;
  
  console.log(`DEBUG: Converting cost module assignment: ${JSON.stringify(assignment, null, 2)}`);
  console.log(`DEBUG: Extracted values - costType: ${costType}, costFactor: ${costFactor}, moduleId: ${moduleId}, name: ${assignment.cost_module?.name || assignment.name}`);
  console.log(`DEBUG: Converted to CostModule: { id: '${moduleId}', type: '${type}', value: ${originalValue} }`);
  
  return {
    id: moduleId?.toString() || 'unknown',
    type,
    value: originalValue
  };
}