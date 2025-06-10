import express from 'express';
import { riskSummaryService } from '../services/riskSummaryService';
import { sendSuccess, sendError } from './common/responses/apiResponse';
import { isAdmin } from '../auth';

const router = express.Router();

/**
 * POST /api/admin/recalculate-summaries
 * Force recalculation of all risk summaries
 */
router.post('/recalculate-summaries', isAdmin, async (req, res) => {
  try {
    await riskSummaryService.recalculateAllSummaries();
    
    return sendSuccess(res, { 
      message: 'Risk summaries recalculated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in admin recalculate summaries:', error);
    return sendError(res, error);
  }
});

/**
 * GET /api/admin/risk-summary/latest
 * Get the latest risk summary (admin view with more details)
 */
router.get('/risk-summary/latest', isAdmin, async (req, res) => {
  try {
    const { entityId } = req.query;
    const summary = await riskSummaryService.getLatestRiskSummary(entityId as string);
    
    if (!summary) {
      return sendError(res, { message: 'No risk summary found' }, 404);
    }
    
    return sendSuccess(res, summary);
  } catch (error) {
    console.error('Error getting latest risk summary:', error);
    return sendError(res, error);
  }
});

export default router;