import express from 'express';
// import { isAuthenticated } from '../../auth';
import { riskService, assetService, controlService } from '../../services';
import { riskSummaryService } from '../../services/riskSummaryService';
import { DatabaseStorage } from '../../services/repositoryStorage';
import { sendError, sendSuccess } from '../common/responses/apiResponse';

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
    
    // Calculate total risk exposure
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;
    
    risks.forEach(risk => {
      const inherentRiskValue = parseFloat(risk.inherentRisk) || 0;
      const residualRiskValue = parseFloat(risk.residualRisk) || 0;
      
      totalInherentRisk += inherentRiskValue;
      totalResidualRisk += residualRiskValue;
    });
    
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
    
    // Return dashboard data
    // Get latest risk summary from centralized service
    const latestRiskSummary = await riskSummaryService.getLatestRiskSummary();
    
    return sendSuccess(res, {
      riskSummary: latestRiskSummary ? {
        totalRisks: latestRiskSummary.totalRisks,
        criticalRisks: latestRiskSummary.criticalRisks,
        highRisks: latestRiskSummary.highRisks,
        mediumRisks: latestRiskSummary.mediumRisks,
        lowRisks: latestRiskSummary.lowRisks,
        totalInherentRisk: latestRiskSummary.totalInherentRisk,
        totalResidualRisk: latestRiskSummary.totalResidualRisk,
        riskReduction: latestRiskSummary.totalInherentRisk > 0 
          ? (1 - (latestRiskSummary.totalResidualRisk / latestRiskSummary.totalInherentRisk)) * 100 
          : 0,
        // Include exposure curve data
        exposureCurveData: latestRiskSummary.exposureCurveData,
        minimumExposure: latestRiskSummary.minimumExposure,
        maximumExposure: latestRiskSummary.maximumExposure,
        meanExposure: latestRiskSummary.meanExposure,
        medianExposure: latestRiskSummary.medianExposure,
        percentile95Exposure: latestRiskSummary.percentile95Exposure,
        percentile99Exposure: latestRiskSummary.percentile99Exposure
      } : {
        // Fallback to calculated values if no summary exists
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        totalInherentRisk,
        totalResidualRisk,
        riskReduction: totalInherentRisk > 0 
          ? (1 - (totalResidualRisk / totalInherentRisk)) * 100 
          : 0
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

export default router;