import express from 'express';
// import { isAuthenticated } from '../../auth';
import { riskService, assetService, controlService } from '../../services';
import { riskSummaryService } from '../../services/riskSummaryService';
import { optimizedRiskCalculation } from '../../services/optimizedRiskCalculation';
import { DatabaseStorage } from '../../services/repositoryStorage';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import irisBenchmarksRouter from './iris-benchmarks';

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
    // Using repository directly for activity logs
    const allLogs = await repository.getAllActivityLogs();
    const recentLogs = allLogs.slice(0, 10);
    
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
    
    // Calculate percentiles from current data
    const residualValues = risks.map(r => parseFloat(r.residualRisk)).filter(v => v > 0).sort((a, b) => b - a);
    const minimumExposure = residualValues.length > 0 ? Math.min(...residualValues) : 0;
    const maximumExposure = residualValues.length > 0 ? Math.max(...residualValues) : 0;
    const meanExposure = residualValues.length > 0 ? residualValues.reduce((a, b) => a + b, 0) / residualValues.length : 0;
    const medianExposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length / 2)] : 0;
    const percentile95Exposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length * 0.05)] || maximumExposure : 0;
    const percentile99Exposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length * 0.01)] || maximumExposure : 0;
    
    console.log(`[Dashboard] Calculated exposure metrics - Min: ${minimumExposure}, Max: ${maximumExposure}, Mean: ${meanExposure}`);
    
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
        percentile99Exposure
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
      recentActivity: recentLogs || []
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