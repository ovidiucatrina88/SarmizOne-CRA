/**
 * Real-time ROI Calculation API Routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { db } from '../../db';
import { risks, controls } from '../../../shared/schema';
import { eq, inArray } from 'drizzle-orm';
import { runEnhancedRiskCalculation } from '../../../shared/utils/enhancedRiskCalculations';

const router = Router();

const roiCalculationSchema = z.object({
  controlIds: z.array(z.string()).min(1, 'At least one control ID required')
});

/**
 * Calculate ROI for selected controls applied to a risk
 * POST /api/risks/:riskId/calculate-roi
 */
router.post('/:riskId/calculate-roi', async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds } = roiCalculationSchema.parse(req.body);
    
    console.log(`[ROICalculation] Calculating ROI for risk ${riskId} with controls:`, controlIds);
    
    // Get the risk
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error('Risk not found'), 404);
    }
    
    const riskData = risk[0];
    
    // Get the selected controls
    const selectedControls = await db.select().from(controls).where(inArray(controls.controlId, controlIds));
    
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error('Some controls not found'), 404);
    }
    
    // Calculate inherent risk (without controls)
    const inherentParams = {
      contactFrequency: { min: riskData.contactFrequencyMin || 0.1, avg: riskData.contactFrequencyAvg || 1, max: riskData.contactFrequencyMax || 10 },
      probabilityOfAction: { min: riskData.probabilityOfActionMin || 0.1, avg: riskData.probabilityOfActionAvg || 0.5, max: riskData.probabilityOfActionMax || 1 },
      threatCapability: { min: riskData.threatCapabilityMin || 1, avg: riskData.threatCapabilityAvg || 5, max: riskData.threatCapabilityMax || 10 },
      resistanceStrength: { min: riskData.resistanceStrengthMin || 1, avg: riskData.resistanceStrengthAvg || 5, max: riskData.resistanceStrengthMax || 10 },
      primaryLossMagnitude: { min: riskData.primaryLossMagnitudeMin || 1000, avg: riskData.primaryLossMagnitudeAvg || 10000, max: riskData.primaryLossMagnitudeMax || 100000 },
      secondaryLossMagnitude: { min: riskData.secondaryLossMagnitudeMin || 100, avg: riskData.secondaryLossMagnitudeAvg || 1000, max: riskData.secondaryLossMagnitudeMax || 10000 }
    };
    
    // Simplified risk calculation for ROI
    const inherentRisk = (inherentParams.primaryLossMagnitude.avg * 
                         inherentParams.contactFrequency.avg * 
                         inherentParams.probabilityOfAction.avg) || 10000;
    
    // Calculate combined control effectiveness
    const totalEffectiveness = selectedControls.reduce((total, control) => {
      return total + (control.controlEffectiveness || 7.5);
    }, 0);
    
    const residualRisk = inherentRisk * (1 - Math.min(totalEffectiveness / 100, 0.95));
    
    // Calculate costs
    const totalImplementationCost = selectedControls.reduce((sum, control) => {
      return sum + parseFloat(control.implementationCost || '0');
    }, 0);
    
    const totalAgentCost = selectedControls.reduce((sum, control) => {
      if (control.isPerAgentPricing) {
        const agentCount = control.deployedAgentCount || 0;
        const costPerAgent = parseFloat(control.costPerAgent || '0');
        return sum + (agentCount * costPerAgent);
      }
      return sum;
    }, 0);
    
    const totalCost = totalImplementationCost + totalAgentCost;
    
    // Calculate metrics
    const riskReduction = inherentRisk - residualRisk;
    const riskReductionPercentage = inherentRisk > 0 ? (riskReduction / inherentRisk) * 100 : 0;
    const roi = totalCost > 0 ? ((riskReduction - totalCost) / totalCost) * 100 : 0;
    const paybackMonths = totalCost > 0 && riskReduction > 0 ? (totalCost / (riskReduction / 12)) : 0;
    
    // Calculate individual control contributions
    const controlContributions = [];
    
    for (const control of selectedControls) {
      const singleControlEffectiveness = (control.controlEffectiveness || 7.5) / 100;
      const singleControlReduction = inherentRisk * singleControlEffectiveness;
      const singleControlCost = parseFloat(control.implementationCost || '0') + 
        (control.isPerAgentPricing ? (control.deployedAgentCount || 0) * parseFloat(control.costPerAgent || '0') : 0);
      
      controlContributions.push({
        controlId: control.controlId,
        name: control.name,
        riskReduction: singleControlReduction,
        cost: singleControlCost,
        roi: singleControlCost > 0 ? ((singleControlReduction - singleControlCost) / singleControlCost) * 100 : 0,
        effectiveness: control.controlEffectiveness || 0
      });
    }
    
    const result = {
      riskExposure: {
        inherent: inherentRisk,
        residual: residualRisk,
        reduction: riskReduction,
        reductionPercentage: riskReductionPercentage
      },
      costs: {
        implementation: totalImplementationCost,
        agents: totalAgentCost,
        total: totalCost
      },
      metrics: {
        roi,
        paybackMonths,
        netBenefit: riskReduction - totalCost
      },
      controlContributions,
      simulationDetails: {
        inherentPercentiles: {
          p10: inherentRisk * 0.1,
          p50: inherentRisk * 0.5,
          p90: inherentRisk * 0.9,
          p95: inherentRisk * 0.95,
          p99: inherentRisk * 0.99
        },
        residualPercentiles: {
          p10: residualRisk * 0.1,
          p50: residualRisk * 0.5,
          p90: residualRisk * 0.9,
          p95: residualRisk * 0.95,
          p99: residualRisk * 0.99
        }
      }
    };
    
    console.log(`[ROICalculation] Risk reduction: ${riskReduction.toFixed(2)}, ROI: ${roi.toFixed(2)}%`);
    
    return sendSuccess(res, result);
    
  } catch (error) {
    console.error('Error calculating ROI:', error);
    return sendError(res, error);
  }
});

export default router;