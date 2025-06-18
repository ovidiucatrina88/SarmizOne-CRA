/**
 * Control Suggestion Engine with FAIR Impact Categorization
 * Suggests controls based on their impact on likelihood vs loss magnitude
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
  
  // Categorization
  impactCategory: 'likelihood' | 'magnitude' | 'both';
  matchScore: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  
  // ROI metrics
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

// Enhanced mapping rules with FAIR impact categorization
const FAIR_CONTROL_MAPPINGS = {
  likelihood: {
    // These controls primarily reduce the frequency of threat events
    patterns: [
      { pattern: /access.*control|authentication|identity.*management/i, score: 90, reasoning: 'Reduces unauthorized access frequency' },
      { pattern: /firewall|network.*security|perimeter/i, score: 85, reasoning: 'Blocks threat actor access attempts' },
      { pattern: /security.*awareness|training|education/i, score: 80, reasoning: 'Reduces human error frequency' },
      { pattern: /patch.*management|vulnerability.*management/i, score: 85, reasoning: 'Reduces exploitable vulnerabilities' },
      { pattern: /multi.*factor|mfa|two.*factor/i, score: 95, reasoning: 'Significantly reduces credential compromise' },
      { pattern: /monitoring|detection|siem/i, score: 75, reasoning: 'Early detection reduces successful attacks' }
    ]
  },
  magnitude: {
    // These controls primarily reduce the impact when threats occur
    patterns: [
      { pattern: /encrypt.*data|encryption|data.*protection/i, score: 95, reasoning: 'Reduces data breach impact' },
      { pattern: /backup|data.*recovery|disaster.*recovery/i, score: 90, reasoning: 'Reduces operational disruption cost' },
      { pattern: /incident.*response|emergency.*response/i, score: 85, reasoning: 'Minimizes damage duration and scope' },
      { pattern: /data.*loss.*prevention|dlp/i, score: 80, reasoning: 'Limits data exfiltration volume' },
      { pattern: /segmentation|isolation|containment/i, score: 85, reasoning: 'Contains damage spread' },
      { pattern: /insurance|coverage/i, score: 70, reasoning: 'Transfers financial impact' }
    ]
  },
  both: {
    // These controls impact both likelihood and magnitude
    patterns: [
      { pattern: /endpoint.*protection|edr|anti.*malware/i, score: 90, reasoning: 'Prevents attacks and limits damage' },
      { pattern: /privileged.*access|pam/i, score: 85, reasoning: 'Reduces high-impact account compromise' },
      { pattern: /security.*orchestration|soar/i, score: 80, reasoning: 'Automated response reduces both frequency and impact' }
    ]
  }
};

/**
 * Categorize control based on its primary FAIR impact
 */
function categorizeControlImpact(control: any): { category: 'likelihood' | 'magnitude' | 'both', score: number, reasoning: string } {
  const controlText = `${control.name} ${control.description}`.toLowerCase();
  
  let bestMatch: { category: 'likelihood' | 'magnitude' | 'both', score: number, reasoning: string } = { 
    category: 'both', 
    score: 0, 
    reasoning: 'General security control' 
  };
  
  // Check each category
  for (const [category, config] of Object.entries(FAIR_CONTROL_MAPPINGS)) {
    for (const rule of config.patterns) {
      if (rule.pattern.test(controlText)) {
        if (rule.score > bestMatch.score) {
          bestMatch = {
            category: category as 'likelihood' | 'magnitude' | 'both',
            score: rule.score,
            reasoning: rule.reasoning
          };
        }
      }
    }
  }
  
  return bestMatch;
}

/**
 * Calculate ROI metrics for a control applied to a specific risk
 */
async function calculateControlROI(risk: any, control: any): Promise<{
  estimatedRiskReduction: number;
  roi: number;
  paybackMonths: number;
}> {
  try {
    // Calculate inherent risk (current risk without this control)
    const inherentParams = {
      contactFrequency: { min: risk.contactFrequencyMin || 0.1, avg: risk.contactFrequencyAvg || 1, max: risk.contactFrequencyMax || 10 },
      probabilityOfAction: { min: risk.probabilityOfActionMin || 0.1, avg: risk.probabilityOfActionAvg || 0.5, max: risk.probabilityOfActionMax || 1 },
      threatCapability: { min: risk.threatCapabilityMin || 1, avg: risk.threatCapabilityAvg || 5, max: risk.threatCapabilityMax || 10 },
      resistanceStrength: { min: risk.resistanceStrengthMin || 1, avg: risk.resistanceStrengthAvg || 5, max: risk.resistanceStrengthMax || 10 },
      primaryLossMagnitude: { min: risk.primaryLossMagnitudeMin || 1000, avg: risk.primaryLossMagnitudeAvg || 10000, max: risk.primaryLossMagnitudeMax || 100000 },
      secondaryLossMagnitude: { min: risk.secondaryLossMagnitudeMin || 100, avg: risk.secondaryLossMagnitudeAvg || 1000, max: risk.secondaryLossMagnitudeMax || 10000 }
    };
    
    // Simplified calculation for ROI estimation
    const inherentRisk = (inherentParams.primaryLossMagnitude.avg * 
                         inherentParams.contactFrequency.avg * 
                         inherentParams.probabilityOfAction.avg) || 10000;
    
    // Apply control effectiveness reduction
    const effectiveness = (control.controlEffectiveness || 7.5) / 10;
    const residualRisk = inherentRisk * (1 - effectiveness / 100);
    
    const riskReduction = inherentRisk - residualRisk;
    const implementationCost = parseFloat(control.implementationCost || '0');
    const roi = implementationCost > 0 ? ((riskReduction - implementationCost) / implementationCost) * 100 : 0;
    const paybackMonths = implementationCost > 0 ? (implementationCost / (riskReduction / 12)) : 0;
    
    return {
      estimatedRiskReduction: riskReduction,
      roi,
      paybackMonths
    };
  } catch (error) {
    console.error('Error calculating control ROI:', error);
    return {
      estimatedRiskReduction: 0,
      roi: 0,
      paybackMonths: 0
    };
  }
}

/**
 * Calculate control relevance based on asset types and risk characteristics
 */
async function calculateIntelligentRelevance(control: any, riskData: any): Promise<{
  score: number;
  reasoning: string[];
  category: 'likelihood' | 'magnitude' | 'both';
}> {
  const reasoning: string[] = [];
  let totalScore = 0;
  let assetMatchCount = 0;
  let riskMatchCount = 0;

  // Get associated assets for this risk
  const riskAssets = riskData.associatedAssets || [];
  
  if (riskAssets.length > 0) {
    // Get asset details
    const assetDetails = await db.select()
      .from(assets)
      .where(inArray(assets.assetId, riskAssets));
    
    const assetTypes = assetDetails.map(a => a.type);
    
    // Check asset-type mappings
    const assetMappings = await db.query(`
      SELECT relevance_score, reasoning, asset_type 
      FROM control_asset_mappings 
      WHERE control_id = $1 AND asset_type = ANY($2)
    `, [control.controlId, assetTypes]);
    
    if (assetMappings.rows.length > 0) {
      const avgAssetScore = assetMappings.rows.reduce((sum, row) => sum + row.relevance_score, 0) / assetMappings.rows.length;
      totalScore += avgAssetScore * 0.4; // 40% weight for asset matching
      assetMatchCount = assetMappings.rows.length;
      reasoning.push(`Asset relevance: ${Math.round(avgAssetScore)}% (${assetTypes.join(', ')})`);
    }
  }

  // Check risk-based mappings
  const riskMappings = await db.query(`
    SELECT relevance_score, impact_type, reasoning 
    FROM control_risk_mappings 
    WHERE control_id = $1 
    AND (
      threat_community = $2 OR threat_community IS NULL
    )
    AND (
      risk_category = $3 OR risk_category IS NULL
    )
    ORDER BY relevance_score DESC
    LIMIT 3
  `, [control.controlId, riskData.threatCommunity, riskData.riskCategory]);

  let riskScore = 0;
  let impactCategory: 'likelihood' | 'magnitude' | 'both' = 'both';

  if (riskMappings.rows.length > 0) {
    riskScore = riskMappings.rows.reduce((sum, row) => sum + row.relevance_score, 0) / riskMappings.rows.length;
    totalScore += riskScore * 0.4; // 40% weight for risk matching
    riskMatchCount = riskMappings.rows.length;
    
    // Use the highest-scoring mapping's impact type
    impactCategory = riskMappings.rows[0].impact_type || 'both';
    reasoning.push(`Risk relevance: ${Math.round(riskScore)}% (${riskData.threatCommunity || 'general'} threats)`);
  }

  // Fallback to pattern matching if no database mappings
  if (assetMatchCount === 0 && riskMatchCount === 0) {
    const patternMatch = categorizeControlImpact(control);
    totalScore = patternMatch.score * 0.2; // Lower weight for pattern matching
    impactCategory = patternMatch.category;
    reasoning.push(`Pattern match: ${patternMatch.reasoning}`);
  } else {
    // Add pattern matching as a bonus
    const patternMatch = categorizeControlImpact(control);
    totalScore += patternMatch.score * 0.2; // 20% weight for pattern matching
    reasoning.push(`Pattern bonus: ${patternMatch.reasoning}`);
  }

  // Ensure score doesn't exceed 100
  totalScore = Math.min(totalScore, 100);

  return {
    score: totalScore,
    reasoning,
    category: impactCategory
  };
}

/**
 * Get control suggestions for a specific risk using intelligent asset-type and risk-based mapping
 */
export async function getControlSuggestions(riskId: string): Promise<ControlSuggestionResponse> {
  try {
    // Get the risk - handle both numeric ID and full risk ID
    let risk;
    
    // First try to find by riskId (full ID like "RISK-CREDENTIAL-534")
    risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    
    // If not found and riskId looks like a number, try finding by numeric ID
    if (risk.length === 0 && /^\d+$/.test(riskId)) {
      risk = await db.select().from(risks).where(eq(risks.id, parseInt(riskId))).limit(1);
    }
    
    // If still not found, try finding by partial match (e.g., "534" -> "RISK-*-534")
    if (risk.length === 0) {
      const partialResults = await db.execute(sql`SELECT * FROM risks WHERE risk_id LIKE ${'%-' + riskId} LIMIT 1`);
      if (partialResults.length > 0) {
        risk = partialResults;
      }
    }
    
    if (risk.length === 0) {
      throw new Error('Risk not found');
    }
    
    const riskData = risk[0];
    
    // Get controls that have mapping relevance for this risk
    const relevantControls = await db.execute(sql`
      SELECT DISTINCT cl.*, 
        CASE 
          WHEN crm.control_id IS NOT NULL THEN 'risk_mapping'
          WHEN cam.control_id IS NOT NULL THEN 'asset_mapping'
          ELSE 'general'
        END as mapping_source,
        crm.relevance_score as risk_relevance,
        cam.relevance_score as asset_relevance
      FROM control_library cl
      LEFT JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
        AND (crm.risk_characteristic = ${riskData.riskCategory || 'operational'} 
             OR crm.risk_characteristic = 'all')
      LEFT JOIN control_asset_mappings cam ON cl.control_id = cam.control_id
      WHERE crm.control_id IS NOT NULL OR cam.control_id IS NOT NULL
      ORDER BY 
        COALESCE(crm.relevance_score, 0) + COALESCE(cam.relevance_score, 0) DESC,
        cl.control_id
    `);
    
    // Get currently associated controls for this risk
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
    
    // Calculate current risk exposure
    const currentExposure = {
      inherent: parseFloat(riskData.inherentRisk || '0'),
      residual: parseFloat(riskData.residualRisk || '0')
    };
    
    // Process each control with intelligent relevance calculation
    const suggestions: ControlSuggestion[] = [];
    
    for (const control of relevantControls) {
      const impactCategory = categorizeControlImpact(control);
      
      // Calculate match score based on mapping relevance
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
        
        estimatedRiskReduction: Math.min(25, baseScore / 4), // Simplified calculation
        roi: 2.5,
        paybackMonths: 12,
        isAssociated: associatedControlIds.has(String(control.control_id || ''))
      };
      
      suggestions.push(suggestion);
    }
    
    // Sort by relevance score, then ROI, with associated controls first
    suggestions.sort((a, b) => {
      if (a.isAssociated !== b.isAssociated) return a.isAssociated ? -1 : 1;
      return (b.matchScore * 0.6 + Math.max(0, b.roi) * 0.4) - (a.matchScore * 0.6 + Math.max(0, a.roi) * 0.4);
    });
    
    // Categorize suggestions
    const likelihoodControls = suggestions.filter(s => s.impactCategory === 'likelihood').slice(0, 10);
    const magnitudeControls = suggestions.filter(s => s.impactCategory === 'magnitude').slice(0, 10);
    const bothControls = suggestions.filter(s => s.impactCategory === 'both').slice(0, 10);
    
    return {
      likelihoodControls,
      magnitudeControls,
      bothControls,
      currentRiskExposure: currentExposure
    };
    
  } catch (error) {
    console.error('Error getting control suggestions:', error);
    throw error;
  }
}