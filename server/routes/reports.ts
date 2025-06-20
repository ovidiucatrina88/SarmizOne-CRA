import express from 'express';
import { storage } from '../services/storage';
import { sendError, sendSuccess } from './common/responses/apiResponse';

const router = express.Router();

/**
 * GET /api/reports - Get available reports
 */
router.get('/', async (req, res) => {
  try {
    const reports = [
      {
        id: 'risk-summary',
        name: 'Risk Summary Report',
        description: 'Comprehensive risk assessment across the organization',
        type: 'executive'
      },
      {
        id: 'control-effectiveness',
        name: 'Control Effectiveness Report',
        description: 'Analysis of security control implementation and effectiveness',
        type: 'operational'
      },
      {
        id: 'asset-risk-matrix',
        name: 'Asset Risk Matrix',
        description: 'Risk exposure breakdown by asset category',
        type: 'technical'
      }
    ];
    sendSuccess(res, reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    sendError(res, 'Failed to fetch reports', 500);
  }
});

/**
 * GET /api/reports/:id - Generate specific report
 */
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    let reportData;

    switch (reportId) {
      case 'risk-summary':
        const risks = await storage.getRisks();
        reportData = {
          title: 'Risk Summary Report',
          generatedAt: new Date().toISOString(),
          summary: {
            totalRisks: risks.length,
            criticalRisks: risks.filter(r => r.inherentRiskLevel === 'critical').length,
            highRisks: risks.filter(r => r.inherentRiskLevel === 'high').length
          },
          risks: risks
        };
        break;
      
      case 'control-effectiveness':
        const controls = await storage.getControls();
        reportData = {
          title: 'Control Effectiveness Report',
          generatedAt: new Date().toISOString(),
          summary: {
            totalControls: controls.length,
            implementedControls: controls.filter(c => c.implementationStatus === 'implemented').length
          },
          controls: controls
        };
        break;
      
      default:
        return sendError(res, 'Report not found', 404);
    }

    sendSuccess(res, reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    sendError(res, 'Failed to generate report', 500);
  }
});

export default router;