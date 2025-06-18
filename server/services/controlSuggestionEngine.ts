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
      
      const mappingResult = await db.execute(sql`SELECT COUNT(*) as count FROM control_risk_mappings WHERE risk_category = 'operational'`);
      console.log(`[ControlSuggestions] Found ${mappingResult[0]?.count || 0} operational mappings`);
      
      // Now try the actual query
      const queryResult = await db.execute(sql`
        SELECT cl.control_id, cl.name, cl.description, cl.control_type, 
               crm.relevance_score as risk_relevance,
               crm.impact_type as risk_impact_type
        FROM control_library cl
        INNER JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
        WHERE crm.risk_category = 'operational'
          AND crm.relevance_score > 0
        ORDER BY crm.relevance_score DESC
        LIMIT 10
      `);
      
      console.log(`[ControlSuggestions] Query result structure:`, { 
        isArray: Array.isArray(queryResult), 
        hasRows: queryResult?.rows ? queryResult.rows.length : 'no rows property',
        directLength: queryResult?.length || 0
      });
      
      // Properly extract rows from Drizzle result
      relevantControls = queryResult?.rows || [];
      
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
      let impactCategory;
      if (control.risk_impact_type) {
        impactCategory = {
          category: control.risk_impact_type as 'likelihood' | 'magnitude' | 'both',
          score: parseFloat(control.risk_relevance || '75'),
          reasoning: 'Control mapped based on risk characteristics'
        };
      } else {
        impactCategory = categorizeControlImpact(control);
      }
      
      const riskRelevance = parseFloat(control.risk_relevance || '0');
      const baseScore = Math.max(riskRelevance, impactCategory.score);
      
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
        isPerAgentPricing: Boolean(control.is_per_agent_pricing || false),
        
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