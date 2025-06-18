/**
 * Control mapping management routes
 */

import { Router } from 'express';
import { sendError, sendSuccess } from './common/responses/apiResponse';
import { autoMapControlsToRisks, clearAutoMappings, getCurrentMappings } from '../services/controlMapping';

const router = Router();

/**
 * Preview potential control mappings without applying them
 */
router.get('/preview', async (req, res) => {
  try {
    const result = await autoMapControlsToRisks(true); // dry run
    return sendSuccess(res, result);
  } catch (error) {
    console.error('Error previewing control mappings:', error);
    return sendError(res, error);
  }
});

/**
 * Apply automatic control mappings
 */
router.post('/apply', async (req, res) => {
  try {
    const result = await autoMapControlsToRisks(false); // apply changes
    return sendSuccess(res, {
      message: 'Control mappings applied successfully',
      ...result
    });
  } catch (error) {
    console.error('Error applying control mappings:', error);
    return sendError(res, error);
  }
});

/**
 * Clear all control mappings
 */
router.delete('/clear', async (req, res) => {
  try {
    const deletedCount = await clearAutoMappings();
    return sendSuccess(res, {
      message: `Cleared ${deletedCount} control mappings`,
      deletedCount
    });
  } catch (error) {
    console.error('Error clearing control mappings:', error);
    return sendError(res, error);
  }
});

/**
 * Get current control mappings
 */
router.get('/current', async (req, res) => {
  try {
    const mappings = await getCurrentMappings();
    return sendSuccess(res, mappings);
  } catch (error) {
    console.error('Error getting current mappings:', error);
    return sendError(res, error);
  }
});

export default router;