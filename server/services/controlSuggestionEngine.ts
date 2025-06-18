/**
 * Control Suggestion Engine with FAIR Impact Categorization
 * Suggests controls based on their impact on likelihood vs loss magnitude
 */

import { db } from '../db';
import { risks, controls, riskControls } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';
import { calculateRiskExposure } from '../../shared/utils/enhancedRiskCalculations';

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
    
    const inherentResult = calculateRiskExposure(inherentParams, []);
    
    // Simulate with control applied
    const controlEffect = {
      effectiveness: control.controlEffectiveness || 7.5,
      controlType: control.controlType || 'preventive'
    };
    
    const residualResult = calculateRiskExposure(inherentParams, [controlEffect]);
    
    const riskReduction = inherentResult.expectedLoss - residualResult.expectedLoss;
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
 * Get control suggestions for a specific risk
 */
export async function getControlSuggestions(riskId: string): Promise<ControlSuggestionResponse> {
  try {
    // Get the risk
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      throw new Error('Risk not found');
    }
    
    const riskData = risk[0];
    
    // Get all controls
    const allControls = await db.select().from(controls);
    
    // Get currently associated controls
    const associatedControls = await db
      .select({ controlId: controls.id })
      .from(riskControls)
      .innerJoin(controls, eq(riskControls.controlId, controls.id))
      .where(eq(riskControls.riskId, riskData.id));
    
    const associatedControlIds = new Set(associatedControls.map(c => c.controlId));
    
    // Calculate current risk exposure
    const currentExposure = {
      inherent: parseFloat(riskData.inherentRisk || '0'),
      residual: parseFloat(riskData.residualRisk || '0')
    };
    
    // Process each control
    const suggestions: ControlSuggestion[] = [];
    
    for (const control of allControls) {
      const impact = categorizeControlImpact(control);
      const roiMetrics = await calculateControlROI(riskData, control);
      
      const suggestion: ControlSuggestion = {
        controlId: control.controlId,
        name: control.name,
        description: control.description || '',
        controlType: control.controlType,
        controlCategory: control.controlCategory,
        implementationStatus: control.implementationStatus,
        controlEffectiveness: control.controlEffectiveness || 0,
        implementationCost: control.implementationCost || '0',
        costPerAgent: control.costPerAgent || '0',
        isPerAgentPricing: control.isPerAgentPricing || false,
        
        impactCategory: impact.category,
        matchScore: impact.score,
        priority: impact.score >= 85 ? 'high' : impact.score >= 70 ? 'medium' : 'low',
        reasoning: impact.reasoning,
        
        estimatedRiskReduction: roiMetrics.estimatedRiskReduction,
        roi: roiMetrics.roi,
        paybackMonths: roiMetrics.paybackMonths,
        isAssociated: associatedControlIds.has(control.id)
      };
      
      suggestions.push(suggestion);
    }
    
    // Sort by match score and ROI
    suggestions.sort((a, b) => {
      if (a.isAssociated !== b.isAssociated) return a.isAssociated ? -1 : 1;
      return (b.matchScore * 0.7 + b.roi * 0.3) - (a.matchScore * 0.7 + a.roi * 0.3);
    });
    
    // Categorize suggestions
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
    console.error('Error getting control suggestions:', error);
    throw error;
  }
}