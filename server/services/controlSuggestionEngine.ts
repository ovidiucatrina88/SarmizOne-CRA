/**
 * Control Suggestion Engine with FAIR Impact Categorization
 * Reads from configured control mappings (34 risk mappings + 59 asset mappings)
 */

import { db } from '../db';
import { risks } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';
import {
  runEnhancedFairCamMonteCarlo,
  extractControlEfficacyParams,
  FairCamParams
} from '../../shared/utils/fairCamCalculations';

export interface ControlSuggestion {
  controlId: string;
  name: string;
  description: string;
  controlType: string;
  controlCategory: string;
  implementationStatus: string;
  controlEffectiveness: number;
  implementationCost: string;
  costPerAgent: string;
  isPerAgentPricing: boolean;
  impactCategory: 'likelihood' | 'magnitude' | 'both';
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedRiskReduction: number;
  roi: number;
  paybackMonths: number;
  isAssociated: boolean;
}

export interface ControlSuggestionResponse {
  likelihoodControls: ControlSuggestion[];
  magnitudeControls: ControlSuggestion[];
  bothControls: ControlSuggestion[];
  currentRiskExposure: {
    inherent: number;
    residual: number;
  };
}

function categorizeControlImpact(control: any): { category: 'likelihood' | 'magnitude' | 'both', score: number, reasoning: string } {
  const name = (control.name || '').toLowerCase();
  const description = (control.description || '').toLowerCase();
  const controlType = (control.control_type || '').toLowerCase();

  if (name.includes('mfa') || name.includes('authentication') || name.includes('access control') ||
    name.includes('firewall') || name.includes('antivirus') || name.includes('prevention') ||
    controlType === 'preventive') {
    return {
      category: 'likelihood',
      score: 85,
      reasoning: 'Preventive control that reduces attack probability'
    };
  }

  if (name.includes('backup') || name.includes('recovery') || name.includes('insurance') ||
    name.includes('redundancy') || name.includes('encryption') || name.includes('isolation')) {
    return {
      category: 'magnitude',
      score: 80,
      reasoning: 'Control that limits impact when incidents occur'
    };
  }

  if (name.includes('monitoring') || name.includes('siem') || name.includes('logging') ||
    controlType === 'detective') {
    return {
      category: 'both',
      score: 75,
      reasoning: 'Detective control that reduces both likelihood and impact'
    };
  }

  return {
    category: 'likelihood',
    score: 60,
    reasoning: 'General security control with moderate effectiveness'
  };
}

export async function getControlSuggestions(riskId: string): Promise<ControlSuggestionResponse> {
  try {
    // Get the risk - handle both numeric ID and full risk ID
    let risk;

    risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);

    if (risk.length === 0 && /^\d+$/.test(riskId)) {
      risk = await db.select().from(risks).where(eq(risks.id, parseInt(riskId))).limit(1);
    }

    if (risk.length === 0) {
      const partialResults = await db.execute(sql`SELECT * FROM risks WHERE risk_id LIKE ${'%-' + riskId} LIMIT 1`);
      if (Array.isArray(partialResults) && partialResults.length > 0) {
        risk = partialResults;
      }
    }

    if (risk.length === 0) {
      throw new Error('Risk not found');
    }

    const riskData = risk[0];
    console.log(`[ControlSuggestions] Risk data:`, { id: riskData.id, riskId: riskData.riskId, category: riskData.riskCategory });

    // Use a more direct approach with proper error handling
    console.log(`[ControlSuggestions] Testing database connection...`);

    let relevantControls: any[] = [];
    try {
      // Test the query step by step
      const testResult = await db.execute(sql`SELECT COUNT(*) as count FROM control_library`);
      console.log(`[ControlSuggestions] Control library has ${(testResult as any)[0]?.count || 0} records`);

      // Get the full risk library ID string from the risk_library table using the risk's libraryItemId
      let riskLibraryStringId = null;
      const riskLibraryNumericId = riskData.libraryItemId;

      if (riskLibraryNumericId) {
        const riskLibraryResult = await db.execute(sql`
          SELECT risk_id FROM risk_library WHERE id = ${riskLibraryNumericId}
        `);
        if (riskLibraryResult && (riskLibraryResult as any).length > 0) {
          riskLibraryStringId = (riskLibraryResult as any)[0].risk_id;
        }
      }

      console.log(`[ControlSuggestions] Risk library mapping: numeric ID ${riskLibraryNumericId} -> string ID ${riskLibraryStringId}`);

      // Try to find controls mapped to this risk template using the library string ID
      let queryResult: any;
      if (riskLibraryStringId) {
        queryResult = await db.execute(sql`
          SELECT cl.control_id, cl.name, cl.description, cl.control_type, cl.control_category,
                 cl.implementation_status, cl.control_effectiveness, cl.implementation_cost, cl.cost_per_agent,
                 crm.relevance_score as risk_relevance,
                 crm.impact_type as risk_impact_type,
                 crm.reasoning
          FROM control_library cl
          INNER JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
          WHERE crm.risk_library_id = ${riskLibraryStringId}
            AND crm.relevance_score > 0
          ORDER BY crm.relevance_score DESC
          LIMIT 20
        `);
        console.log(`[ControlSuggestions] Found ${queryResult.length || queryResult.rows?.length || 0} controls mapped to template library ID: ${riskLibraryStringId}`);
      }

      // If no exact match, try pattern matching for similar risks (like ORPHANED risks)
      if (!queryResult || (queryResult.length || queryResult.rows?.length || 0) === 0) {
        const riskPattern = riskData.riskId.split('-')[1]; // Extract "ORPHANED" from "RISK-ORPHANED-30"
        console.log(`[ControlSuggestions] Trying pattern match for risk type: ${riskPattern}`);

        queryResult = await db.execute(sql`
          SELECT cl.control_id, cl.name, cl.description, cl.control_type, cl.control_category,
                 cl.implementation_status, cl.control_effectiveness, cl.implementation_cost, cl.cost_per_agent,
                 crm.relevance_score as risk_relevance,
                 crm.impact_type as risk_impact_type,
                 crm.reasoning
          FROM control_library cl
          INNER JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
          WHERE crm.risk_library_id LIKE ${'%' + riskPattern + '%'}
            AND crm.relevance_score > 0
          ORDER BY crm.relevance_score DESC
          LIMIT 20
        `);
        console.log(`[ControlSuggestions] Found ${queryResult.length || queryResult.rows?.length || 0} controls using pattern matching for ${riskPattern}`);
      }

      // If no specific mappings found, return empty results (no fallback)
      if (!queryResult || (queryResult.length || queryResult.rows?.length || 0) === 0) {
        console.log(`[ControlSuggestions] No specific mappings found for this risk type - returning empty suggestions`);
        queryResult = [];
      }

      console.log(`[ControlSuggestions] Query result structure:`, {
        isArray: Array.isArray(queryResult),
        hasRows: queryResult?.rows ? queryResult.rows.length : 'no rows property',
        directLength: queryResult?.length || 0
      });

      // Properly extract rows from Drizzle result
      relevantControls = queryResult?.rows || queryResult || [];

    } catch (error) {
      console.error(`[ControlSuggestions] Database query failed:`, error);
      relevantControls = [];
    }

    console.log(`[ControlSuggestions] Final controls array length: ${relevantControls.length}`);
    if (relevantControls.length > 0) {
      console.log(`[ControlSuggestions] First control:`, relevantControls[0]);
    }

    // Get currently associated controls
    const associatedControlsQuery = await db.execute(sql`
      SELECT c.control_id
      FROM risk_controls rc
      JOIN controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${riskData.id}
    `);

    const associatedRows = Array.isArray(associatedControlsQuery) ? associatedControlsQuery : (associatedControlsQuery.rows || []);
    const associatedControlIds = new Set(associatedRows.map((c: any) => c.control_id));

    const currentExposure = {
      inherent: parseFloat(riskData.inherentRisk || '0'),
      residual: parseFloat(riskData.residualRisk || '0')
    };

    // Calculate baseline risk using FAIR-CAM
    // We need to construct the base risk parameters
    // If risk data is missing/zero, use defaults to ensure we generate meaningful "what-if" scenarios
    const tefMost = parseFloat(riskData.tefMost || '0');
    const lmMost = parseFloat(riskData.lmMost || '0');

    const useDefaults = tefMost === 0 || lmMost === 0;
    if (useDefaults) {
      console.log(`[ControlSuggestions] Risk data incomplete (TEF=${tefMost}, LM=${lmMost}). Using defaults for simulation.`);
    }

    const baseRiskParams = {
      tefMin: parseFloat(riskData.tefMin || '0') || (useDefaults ? 0.1 : 0),
      tefMost: tefMost || (useDefaults ? 1.0 : 0),
      tefMax: parseFloat(riskData.tefMax || '0') || (useDefaults ? 10.0 : 0),
      lmMin: parseFloat(riskData.lmMin || '0') || (useDefaults ? 1000 : 0),
      lmMost: lmMost || (useDefaults ? 10000 : 0),
      lmMax: parseFloat(riskData.lmMax || '0') || (useDefaults ? 50000 : 0),
    };

    // Get current efficacy params from associated controls
    // We need to fetch full control details for associated controls to do this accurately
    // For this implementation, we'll use a simplified approach where we assume 
    // the current residual risk in the DB reflects the current state

    // However, for "what-if", we should ideally run the simulation for current state first
    // to have a consistent baseline.

    // Let's fetch associated controls with their details to build the current baseline
    const currentControlsQuery = await db.execute(sql`
      SELECT c.* 
      FROM controls c
      JOIN risk_controls rc ON c.id = rc.control_id
      WHERE rc.risk_id = ${riskData.id}
    `);

    const currentControls = (currentControlsQuery as any).rows || [];
    const currentFairCamParams = extractControlEfficacyParams({
      ...baseRiskParams,
      controls: currentControls
    });

    // Run baseline simulation (fewer iterations for performance)
    const baselineResult = runEnhancedFairCamMonteCarlo(currentFairCamParams, 1000);
    const baselineALE = baselineResult.aleMean;

    console.log(`[ControlSuggestions] Baseline ALE: ${formatCurrency(baselineALE)}`);

    const suggestions: ControlSuggestion[] = [];

    for (const control of relevantControls) {
      // Only process controls that have explicit mapping data
      if (!control.risk_impact_type || !control.risk_relevance) {
        continue;
      }

      const baseScore = parseFloat(control.risk_relevance || '0');

      // Calculate estimated risk reduction based on control effectiveness and current risk exposure
      const rawEffectiveness = Number(control.control_effectiveness);

      // Default to 7/10 if 0 or missing. Database stores 0-10, UI expects 0-10.
      const controlEffectivenessValue = rawEffectiveness > 0 ? rawEffectiveness : 7;
      const controlEffectivenessRatio = controlEffectivenessValue / 10; // Convert to 0-1 for calculation

      // Map this single control to FAIR-CAM parameters
      const controlFairCamImpact = mapControlToFairCam(control, controlEffectivenessRatio);

      // Create "What-If" scenario: Merge this control's impact with current baseline
      // We assume this new control is "Fully Implemented" for the what-if scenario
      const whatIfParams: FairCamParams = { ...currentFairCamParams };

      // Update efficacy parameters based on the new control
      // We use a simple max function here - if the new control is better than average, it improves the score
      // In a real FAIR-CAM model, we might average them or use a more complex aggregation
      // Here we'll assume the new control *adds* to the efficacy, improving it

      if (controlFairCamImpact.eAvoid) whatIfParams.eAvoid = Math.min(0.95, (whatIfParams.eAvoid || 0) + (controlFairCamImpact.eAvoid * 0.5)); // Diminishing returns
      if (controlFairCamImpact.eDeter) whatIfParams.eDeter = Math.min(0.95, (whatIfParams.eDeter || 0) + (controlFairCamImpact.eDeter * 0.5));
      if (controlFairCamImpact.eDetect) whatIfParams.eDetect = Math.min(0.95, (whatIfParams.eDetect || 0) + (controlFairCamImpact.eDetect * 0.5));
      if (controlFairCamImpact.eResist) whatIfParams.eResist = Math.min(0.95, (whatIfParams.eResist || 0) + (controlFairCamImpact.eResist * 0.5));
      if (controlFairCamImpact.eRespond) whatIfParams.eRespond = Math.min(0.95, (whatIfParams.eRespond || 0) + (controlFairCamImpact.eRespond * 0.5));
      if (controlFairCamImpact.eRecover) whatIfParams.eRecover = Math.min(0.95, (whatIfParams.eRecover || 0) + (controlFairCamImpact.eRecover * 0.5));

      // Run "What-If" simulation
      const whatIfResult = runEnhancedFairCamMonteCarlo(whatIfParams, 1000);
      const whatIfALE = whatIfResult.aleMean;

      const estimatedRiskReduction = Math.max(0, baselineALE - whatIfALE);

      // Calculate implementation cost
      const rawCost = parseFloat(control.implementation_cost || '0');
      // Default to $1000 if 0 or missing
      const baseImplementationCost = rawCost > 0 ? rawCost : 1000;

      const rawAgentCost = parseFloat(control.cost_per_agent || '0');
      // Default to $10/agent if 0 or missing
      const costPerAgentVal = rawAgentCost > 0 ? rawAgentCost : 10;

      const isPerAgentPricing = Boolean(control.is_per_agent_pricing || control.is_per_agent || false);

      // For suggestions, estimate agent count from risk's associated assets (if available)
      // Default to 10 agents as a reasonable estimate for per-agent pricing
      const estimatedAgents = 10;
      const implementationCost = isPerAgentPricing
        ? costPerAgentVal * estimatedAgents
        : baseImplementationCost;

      // Calculate ROI: (risk reduction - implementation cost) / implementation cost
      const roi = implementationCost > 0
        ? ((estimatedRiskReduction - implementationCost) / implementationCost) * 100
        : 0;

      // Calculate payback period in months: (implementation cost / annual risk reduction) × 12
      const paybackMonths = estimatedRiskReduction > 0
        ? (implementationCost / estimatedRiskReduction) * 12
        : 999;

      const suggestion: ControlSuggestion = {
        controlId: String(control.control_id || ''),
        name: String(control.name || ''),
        description: String(control.description || ''),
        controlType: String(control.control_type || 'preventive'),
        controlCategory: String(control.control_category || 'technical'),
        implementationStatus: String(control.implementation_status || 'not_implemented'),
        controlEffectiveness: controlEffectivenessValue,
        implementationCost: String(baseImplementationCost),
        costPerAgent: String(costPerAgentVal),
        isPerAgentPricing: isPerAgentPricing,

        impactCategory: control.risk_impact_type as 'likelihood' | 'magnitude' | 'both',
        matchScore: baseScore,
        priority: baseScore >= 80 ? 'high' : baseScore >= 60 ? 'medium' : 'low',
        reasoning: control.reasoning || 'Control mapped based on risk characteristics',

        estimatedRiskReduction: Math.round(estimatedRiskReduction),
        roi: Math.round(roi * 10) / 10, // Round to 1 decimal place
        paybackMonths: Math.min(Math.round(paybackMonths), 999), // Cap at 999 months
        isAssociated: associatedControlIds.has(String(control.control_id || ''))
      };

      suggestions.push(suggestion);
    }

    suggestions.sort((a, b) => {
      if (a.isAssociated !== b.isAssociated) return a.isAssociated ? -1 : 1;
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
      return b.roi - a.roi;
    });

    const likelihoodControls = suggestions.filter(s => s.impactCategory === 'likelihood');
    const magnitudeControls = suggestions.filter(s => s.impactCategory === 'magnitude');
    const bothControls = suggestions.filter(s => s.impactCategory === 'both');

    return {
      likelihoodControls,
      magnitudeControls,
      bothControls,
      currentRiskExposure: currentExposure
    };

  } catch (error) {
    console.error('Error in getControlSuggestions:', error);
    throw error;
  }
}

/**
 * Helper to map a control to FAIR-CAM efficacy parameters based on its type and effectiveness
 */
function mapControlToFairCam(control: any, effectiveness: number): Partial<FairCamParams> {
  const params: Partial<FairCamParams> = {};
  const type = (control.control_type || '').toLowerCase();

  // Base mapping logic
  if (type === 'preventive') {
    // Preventive controls primarily affect Avoidance and Deterrence
    params.eAvoid = effectiveness * 0.8;
    params.eDeter = effectiveness * 0.6;
  } else if (type === 'detective') {
    // Detective controls affect Detection
    params.eDetect = effectiveness;
  } else if (type === 'corrective') {
    // Corrective controls affect Response and Recovery
    params.eRespond = effectiveness * 0.8;
    params.eRecover = effectiveness * 0.8;
  } else {
    // Default/Fallback
    params.eAvoid = effectiveness * 0.5;
    params.eDetect = effectiveness * 0.5;
  }

  // Additional keyword-based adjustments could go here
  const name = (control.name || '').toLowerCase();
  if (name.includes('backup') || name.includes('redundancy')) {
    params.eRecover = Math.max(params.eRecover || 0, effectiveness);
    params.eResist = Math.max(params.eResist || 0, effectiveness * 0.5); // Resistance to data loss
  }

  if (name.includes('encryption') || name.includes('dlp')) {
    params.eResist = Math.max(params.eResist || 0, effectiveness); // Resistance to data disclosure
  }

  return params;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}