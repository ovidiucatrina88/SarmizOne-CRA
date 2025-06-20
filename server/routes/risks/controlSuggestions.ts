/**
 * Control Suggestions API Routes
 */

import { Router } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { getControlSuggestions } from "../../../services/controlSuggestionEngine';

const router = Router();

/**
 * Get control suggestions for a specific risk
 * GET /api/risks/:riskId/control-suggestions
 */
router.get('/:riskId/control-suggestions', async (req, res) => {
  try {
    const { riskId } = req.params;
    
    console.log(`[ControlSuggestions] Getting suggestions for risk: ${riskId}`);
    
    const suggestions = await getControlSuggestions(riskId);
    
    console.log(`[ControlSuggestions] Found ${suggestions.likelihoodControls.length} likelihood controls, ${suggestions.magnitudeControls.length} magnitude controls, ${suggestions.bothControls.length} both controls`);
    console.log(`[ControlSuggestions] Sample controls:`, suggestions.likelihoodControls.slice(0, 2).map(c => c.name), suggestions.magnitudeControls.slice(0, 2).map(c => c.name));
    
    return sendSuccess(res, suggestions);
  } catch (error) {
    console.error('Error getting control suggestions:', error);
    return sendError(res, error);
  }
});

export default router;