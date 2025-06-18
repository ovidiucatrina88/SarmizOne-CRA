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
    
    // Get controls with mapping relevance - using correct column names
    const relevantControls = await db.execute(sql`
      SELECT DISTINCT cl.*, 
        CASE 
          WHEN crm.control_id IS NOT NULL THEN 'risk_mapping'
          WHEN cam.control_id IS NOT NULL THEN 'asset_mapping'
          ELSE 'general'
        END as mapping_source,
        crm.relevance_score as risk_relevance,
        crm.impact_type as risk_impact_type,
        cam.relevance_score as asset_relevance
      FROM control_library cl
      LEFT JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
        AND crm.risk_category = ${riskData.riskCategory || 'operational'}
      LEFT JOIN control_asset_mappings cam ON cl.control_id = cam.control_id
      WHERE crm.control_id IS NOT NULL OR cam.control_id IS NOT NULL
      ORDER BY 
        COALESCE(crm.relevance_score, 0) + COALESCE(cam.relevance_score, 0) DESC,
        cl.control_id
    `);
    
    // Get currently associated controls
    const associatedControlsQuery = await db.execute(sql`
      SELECT c.control_id
      FROM risk_controls rc
      JOIN controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${riskData.id}
    `);
    
    const associatedControlIds = new Set(
      Array.isArray(associatedControlsQuery) 
        ? associatedControlsQuery.map((c: any) => c.control_id) 
        : []
    );
    
    const currentExposure = {
      inherent: parseFloat(riskData.inherentRisk || '0'),
      residual: parseFloat(riskData.residualRisk || '0')
    };
    
    const suggestions: ControlSuggestion[] = [];
    
    for (const control of Array.isArray(relevantControls) ? relevantControls : []) {
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
      const assetRelevance = parseFloat(control.asset_relevance || '0');
      const baseScore = Math.max(riskRelevance, assetRelevance, impactCategory.score);
      
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