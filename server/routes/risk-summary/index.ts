import express from 'express';
import { riskSummaryService } from '../../services/riskSummaryService';
import { sendError, sendSuccess } from '../common/responses/apiResponse';

const router = express.Router();

// Get latest risk summary data
router.get('/latest', async (req, res) => {
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