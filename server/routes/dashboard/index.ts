import express from 'express';
// import { isAuthenticated } from '../../auth';
import { riskService, assetService, controlService } from '../../services';
import { riskSummaryService } from '../../services/riskSummaryService';
import { optimizedRiskCalculation } from '../../services/optimizedRiskCalculation';
import { DatabaseStorage } from '../../services/repositoryStorage';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import irisBenchmarksRouter from './iris-benchmarks';
import { db } from '../../db';
import { sql } from 'drizzle-orm';

const router = express.Router();
const repository = new DatabaseStorage();

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    // Get risks for summary calculations - remove filter parameter for compatibility
    const risks = await riskService.getAllRisks();

    // Calculate risk metrics
    const totalRisks = risks.length;
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const mediumRisks = risks.filter(r => r.severity === 'medium').length;
    const lowRisks = risks.filter(r => r.severity === 'low').length;

    // Calculate risk category metrics
    const operationalRisks = risks.filter(r => r.riskCategory === 'operational').length;
    const strategicRisks = risks.filter(r => r.riskCategory === 'strategic').length;
    const complianceRisks = risks.filter(r => r.riskCategory === 'compliance').length;
    const financialRisks = risks.filter(r => r.riskCategory === 'financial').length;

    // Calculate total risk exposure with detailed logging
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;

    console.log(`[Dashboard] Processing ${risks.length} risks for exposure calculation`);

    risks.forEach((risk, index) => {
      const inherentRiskValue = parseFloat(risk.inherentRisk) || 0;
      const residualRiskValue = parseFloat(risk.residualRisk) || 0;

      if (index < 3) { // Log first 3 risks for debugging
        console.log(`[Dashboard] Risk ${risk.riskId}: inherent=${risk.inherentRisk} (${inherentRiskValue}), residual=${risk.residualRisk} (${residualRiskValue})`);
      }

      totalInherentRisk += inherentRiskValue;
      totalResidualRisk += residualRiskValue;
    });

    console.log(`[Dashboard] Total calculated exposure - Inherent: ${totalInherentRisk}, Residual: ${totalResidualRisk}`);

    // Get controls for dashboard - remove filter parameter for compatibility
    const controls = await controlService.getAllControls();
    const implementedControls = controls.filter(c =>
      c.implementationStatus === 'fully_implemented').length;
    const inProgressControls = controls.filter(c =>
      c.implementationStatus === 'in_progress').length;
    const plannedControls = controls.filter(c =>
      c.implementationStatus === 'planned').length;
    const notImplementedControls = controls.filter(c =>
      c.implementationStatus === 'not_implemented').length;

    // Get assets for dashboard - remove filter parameter for compatibility
    const assets = await assetService.getAllAssets();

    // Get recent activity
    // Get recent activity logs using correct column names from database
    const activityQuery = await db.execute(sql`SELECT activity, "user", entity, entity_type, entity_id, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 10`);
    const recentLogs = activityQuery.rows || [];

    // Calculate exposure curve data from current risks
    const exposureCurveData = [];
    const sortedRisks = [...risks]
      .filter(r => parseFloat(r.residualRisk) > 0)
      .sort((a, b) => parseFloat(b.residualRisk) - parseFloat(a.residualRisk));

    if (sortedRisks.length > 0) {
      sortedRisks.forEach((risk, index) => {
        const impact = parseFloat(risk.residualRisk);
        const probability = (index + 1) / sortedRisks.length;
        exposureCurveData.push({ impact, probability });
      });
    }

    // Calculate percentiles using Monte Carlo simulation
    const stats = riskSummaryService.calculateExposureStatistics(risks);
    const minimumExposure = stats.min;
    const maximumExposure = stats.max;
    const meanExposure = stats.avg;
    const medianExposure = stats.median;
    const percentile95Exposure = stats.p95;
    const percentile99Exposure = stats.p99;
    const tenthPercentileExposure = stats.p10;
    const ninetiethPercentileExposure = stats.p90;

    console.log(`[Dashboard] Calculated exposure metrics - Min: ${minimumExposure}, Max: ${maximumExposure}, Mean: ${meanExposure}, P10: ${tenthPercentileExposure}, P90: ${ninetiethPercentileExposure}`);

    // Top performing controls based on ROI and Risk Reduction
    const topControls = controls
      .filter(c =>
        c.implementationStatus === 'fully_implemented' ||
        c.implementationStatus === 'in_progress'
      )
      .map(c => {
        // 1. Calculate Risk Reduction
        // Find all risks associated with this control
        // Note: c.associatedRisks is an array of strings (risk IDs)
        const associatedRiskIds = c.associatedRisks || [];
        const associatedRisks = risks.filter(r => associatedRiskIds.includes(r.id.toString()) || associatedRiskIds.includes(r.riskId));

        let totalRiskReduction = 0;

        const uniqueAssetIds = new Set<string>();

        associatedRisks.forEach(r => {
          // Calculate Inherent Risk
          // Use the pre-calculated inherentRisk column if available, otherwise try to calculate from parameters
          let inherentRisk = parseFloat(r.inherentRisk || '0');

          if (inherentRisk === 0 && r.parameters) {
            // Try to calculate from JSON parameters if column is empty
            const params = r.parameters as any;
            const lossMagnitude = parseFloat(params.primaryLossMagnitude?.avg || '0');
            const probability = parseFloat(params.probabilityOfAction?.avg || '0');
            inherentRisk = lossMagnitude * probability;
          }

          // Calculate reduction based on Historical Data (Inherent - Residual)
          // This aligns with the Control ROI page logic
          let residualRisk = parseFloat(r.residualRisk || '0');

          // Fallback if residual risk is missing (consistent with frontend logic)
          if (residualRisk === 0) {
            residualRisk = inherentRisk * 0.5;
          }

          const reduction = Math.max(0, inherentRisk - residualRisk);
          totalRiskReduction += reduction;

          // Collect associated assets for cost calculation
          if (r.associatedAssets && Array.isArray(r.associatedAssets)) {
            r.associatedAssets.forEach(assetId => uniqueAssetIds.add(assetId));
          }
        });

        // 2. Calculate Total Cost (Hybrid Approach)
        const implementationCost = parseFloat(c.implementationCost || '0');

        // Calculate total agent count from all unique assets associated with the risks this control mitigates
        let totalAgentCount = 0;
        if (c.isPerAgent) {
          uniqueAssetIds.forEach(assetId => {
            const asset = assets.find(a => a.assetId === assetId);
            if (asset) {
              totalAgentCount += (asset.agentCount || 0);
            }
          });
        }

        const agentCost = c.isPerAgent
          ? totalAgentCount * parseFloat(c.costPerAgent || '0')
          : 0;

        const totalCost = implementationCost + agentCost;

        // 3. Calculate ROI
        // ROI = (Gain from Investment - Cost of Investment) / Cost of Investment
        // If cost is 0, ROI is theoretically infinite. We'll cap it or handle it gracefully.
        let roi = 0;
        if (totalCost > 0) {
          roi = ((totalRiskReduction - totalCost) / totalCost) * 100;
        } else if (totalRiskReduction > 0) {
          roi = 9999; // Infinite ROI placeholder
        }

        return {
          code: c.controlId,
          name: c.name,
          roi: roi,
          riskReduction: totalRiskReduction,
          cost: totalCost,
          // Keep score for frontend compatibility, but format it as ROI
          score: totalCost === 0 && totalRiskReduction > 0 ? "∞% ROI" : `${Math.round(roi)}% ROI`
        };
      })
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);

    return sendSuccess(res, {
      riskSummary: {
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        totalInherentRisk,
        totalResidualRisk,
        riskReduction: totalInherentRisk > 0
          ? (1 - (totalResidualRisk / totalInherentRisk)) * 100
          : 0,
        // Use freshly calculated exposure curve data
        exposureCurveData,
        minimumExposure,
        maximumExposure,
        meanExposure,
        medianExposure,
        percentile95Exposure,
        percentile99Exposure,
        tenthPercentileExposure,
        ninetiethPercentileExposure
      },
      riskByCategory: {
        operational: operationalRisks,
        strategic: strategicRisks,
        compliance: complianceRisks,
        financial: financialRisks
      },
      controlSummary: {
        totalControls: controls.length,
        implementedControls,
        inProgressControls,
        plannedControls,
        notImplementedControls,
        implementationRate: controls.length > 0
          ? (implementedControls / controls.length) * 100
          : 0
      },
      assetSummary: {
        totalAssets: assets.length,
        byType: {
          data: assets.filter(a => a.type === 'data').length,
          application: assets.filter(a => a.type === 'application').length,
          system: assets.filter(a => a.type === 'system').length,
          device: assets.filter(a => a.type === 'device').length,
          network: assets.filter(a => a.type === 'network').length,
          facility: assets.filter(a => a.type === 'facility').length,
          personnel: assets.filter(a => a.type === 'personnel').length,
          other: assets.filter(a => a.type === 'other').length,
        }
      },
      recentActivity: recentLogs || [],
      topControls // Add topControls to response
    });
  } catch (error) {
    return sendError(res, error);
  }
});

// Get latest risk summary (dedicated endpoint for exposure curve data)
router.get('/risk-summary/latest', async (req, res) => {
  try {
    const { entityId } = req.query;
    const summary = await riskSummaryService.getLatestRiskSummary(entityId as string);

    if (!summary) {
      return sendError(res, { message: 'No risk summary found' }, 404);
    }

    return sendSuccess(res, summary);
  } catch (error) {
    return sendError(res, error);
  }
});

// Force risk summary update endpoint
router.post('/risk-summary/force-update', async (req, res) => {
  try {
    console.log('Force updating risk summaries...');
    await riskSummaryService.updateRiskSummaries();
    console.log('Risk summaries force update completed');
    return sendSuccess(res, { message: 'Risk summaries updated successfully' });
  } catch (error) {
    console.error('Error force updating risk summaries:', error);
    return sendError(res, error);
  }
});

// Mount IRIS benchmarks router
router.use('/iris-benchmarks', irisBenchmarksRouter);

export default router;