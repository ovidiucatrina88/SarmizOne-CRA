/**
 * Control Suggestion Engine with FAIR Impact Categorization
 * Reads from configured control mappings (34 risk mappings + 59 asset mappings)
 */

import { db } from '../db';
import { risks } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';

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
    
    let relevantControls = [];
    try {
      // Test the query step by step
      const testResult = await db.execute(sql`SELECT COUNT(*) as count FROM control_library`);
      console.log(`[ControlSuggestions] Control library has ${testResult[0]?.count || 0} records`);
      
      // Get the full risk library ID string from the risk_library table using the risk's libraryItemId
      let riskLibraryStringId = null;
      const riskLibraryNumericId = riskData.libraryItemId;
      
      if (riskLibraryNumericId) {
        const riskLibraryResult = await db.execute(sql`
          SELECT risk_id FROM risk_library WHERE id = ${riskLibraryNumericId}
        `);
        if (riskLibraryResult && riskLibraryResult.length > 0) {
          riskLibraryStringId = riskLibraryResult[0].risk_id;
        }
      }
      
      console.log(`[ControlSuggestions] Risk library mapping: numeric ID ${riskLibraryNumericId} -> string ID ${riskLibraryStringId}`);
      
      // Try to find controls mapped to this risk template using the library string ID
      let queryResult;
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
    
    const suggestions: ControlSuggestion[] = [];
    
    for (const control of relevantControls) {
      // Only process controls that have explicit mapping data
      if (!control.risk_impact_type || !control.risk_relevance) {
        console.log(`[ControlSuggestions] Skipping control ${control.control_id} - no explicit mapping data`);
        continue;
      }
      
      const impactCategory = {
        category: control.risk_impact_type as 'likelihood' | 'magnitude' | 'both',
        score: parseFloat(control.risk_relevance || '0'),
        reasoning: control.reasoning || 'Control mapped based on risk characteristics'
      };
      const baseScore = parseFloat(control.risk_relevance || '0');
      
      console.log(`[ControlSuggestions] Using explicit mapping for control ${control.control_id}: ${control.risk_impact_type}, score: ${baseScore}`);
      
      const suggestion: ControlSuggestion = {
        controlId: String(control.control_id || ''),
        name: String(control.name || ''),
        description: String(control.description || ''),
        controlType: String(control.control_type || 'preventive'),
        controlCategory: String(control.control_category || 'technical'),
        implementationStatus: String(control.implementation_status || 'not_implemented'),
        controlEffectiveness: Number(control.control_effectiveness || 70),
        implementationCost: String(control.implementation_cost || '1000'),
        costPerAgent: String(control.cost_per_agent || '100'),
        isPerAgentPricing: Boolean(control.is_per_agent_pricing || control.is_per_agent || false),
        
        impactCategory: impactCategory.category,
        matchScore: baseScore,
        priority: baseScore >= 80 ? 'high' : baseScore >= 60 ? 'medium' : 'low',
        reasoning: impactCategory.reasoning,
        
        estimatedRiskReduction: Math.min(25, baseScore / 4),
        roi: 2.5,
        paybackMonths: 12,
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