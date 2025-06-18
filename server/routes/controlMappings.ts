/**
 * Control Mappings API Routes
 * Manages asset-type and risk-based control mappings for intelligent suggestions
 */

import { Router } from 'express';
import { pool } from '../db';
import { sendError, sendSuccess } from './common/responses/apiResponse';

const router = Router();

/**
 * Get all asset-type mappings
 * GET /api/control-mappings/assets
 */
router.get('/assets', async (req, res) => {
  try {
    const mappings = await pool.query(`
      SELECT * FROM control_asset_mappings 
      ORDER BY relevance_score DESC, control_id
    `);
    
    return sendSuccess(res, mappings.rows);
  } catch (error) {
    console.error('Error fetching asset mappings:', error);
    return sendError(res, error);
  }
});

/**
 * Create asset-type mapping
 * POST /api/control-mappings/assets
 */
router.post('/assets', async (req, res) => {
  try {
    const { control_id, asset_type, relevance_score, reasoning } = req.body;
    
    if (!control_id || !asset_type || !reasoning) {
      return sendError(res, new Error('Missing required fields'), 400);
    }
    
    const result = await pool.query(`
      INSERT INTO control_asset_mappings (control_id, asset_type, relevance_score, reasoning)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (control_id, asset_type) 
      DO UPDATE SET relevance_score = EXCLUDED.relevance_score, reasoning = EXCLUDED.reasoning
      RETURNING *
    `, [control_id, asset_type, relevance_score || 50, reasoning]);
    
    return sendSuccess(res, result.rows[0]);
  } catch (error) {
    console.error('Error creating asset mapping:', error);
    return sendError(res, error);
  }
});

/**
 * Delete asset-type mapping
 * DELETE /api/control-mappings/assets/:id
 */
router.delete('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      DELETE FROM control_asset_mappings WHERE id = $1 RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return sendError(res, new Error('Asset mapping not found'), 404);
    }
    
    return sendSuccess(res, { message: 'Asset mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset mapping:', error);
    return sendError(res, error);
  }
});

/**
 * Get all risk-based mappings
 * GET /api/control-mappings/risks
 */
router.get('/risks', async (req, res) => {
  try {
    const mappings = await pool.query(`
      SELECT * FROM control_risk_mappings 
      ORDER BY relevance_score DESC, control_id
    `);
    
    return sendSuccess(res, mappings.rows);
  } catch (error) {
    console.error('Error fetching risk mappings:', error);
    return sendError(res, error);
  }
});

/**
 * Create risk-based mapping
 * POST /api/control-mappings/risks
 */
router.post('/risks', async (req, res) => {
  try {
    const { 
      control_id, 
      threat_community, 
      risk_category, 
      vulnerability_pattern, 
      relevance_score, 
      impact_type, 
      reasoning 
    } = req.body;
    
    if (!control_id || !reasoning) {
      return sendError(res, new Error('Control ID and reasoning are required'), 400);
    }
    
    const result = await pool.query(`
      INSERT INTO control_risk_mappings 
      (control_id, threat_community, risk_category, vulnerability_pattern, relevance_score, impact_type, reasoning)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      control_id, 
      threat_community || null, 
      risk_category || 'operational', 
      vulnerability_pattern || null,
      relevance_score || 50, 
      impact_type || 'both', 
      reasoning
    ]);
    
    return sendSuccess(res, result.rows[0]);
  } catch (error) {
    console.error('Error creating risk mapping:', error);
    return sendError(res, error);
  }
});

/**
 * Delete risk-based mapping
 * DELETE /api/control-mappings/risks/:id
 */
router.delete('/risks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      DELETE FROM control_risk_mappings WHERE id = $1 RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return sendError(res, new Error('Risk mapping not found'), 404);
    }
    
    return sendSuccess(res, { message: 'Risk mapping deleted successfully' });
  } catch (error) {
    console.error('Error deleting risk mapping:', error);
    return sendError(res, error);
  }
});

export default router;