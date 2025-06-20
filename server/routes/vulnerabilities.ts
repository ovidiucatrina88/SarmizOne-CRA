import express from 'express';
import { storage } from '../services/storage';
import { sendError, sendSuccess } from './common/responses/apiResponse';

const router = express.Router();

/**
 * GET /api/vulnerabilities - Get all vulnerabilities
 */
router.get('/', async (req, res) => {
  try {
    const vulnerabilities = await storage.getVulnerabilities();
    sendSuccess(res, vulnerabilities);
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    sendError(res, 'Failed to fetch vulnerabilities', 500);
  }
});

/**
 * GET /api/vulnerabilities/:id - Get vulnerability by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const vulnerability = await storage.getVulnerabilityById(parseInt(req.params.id));
    if (!vulnerability) {
      return sendError(res, 'Vulnerability not found', 404);
    }
    sendSuccess(res, vulnerability);
  } catch (error) {
    console.error('Error fetching vulnerability:', error);
    sendError(res, 'Failed to fetch vulnerability', 500);
  }
});

/**
 * POST /api/vulnerabilities - Create new vulnerability
 */
router.post('/', async (req, res) => {
  try {
    const vulnerability = await storage.createVulnerability(req.body);
    sendSuccess(res, vulnerability);
  } catch (error) {
    console.error('Error creating vulnerability:', error);
    sendError(res, 'Failed to create vulnerability', 500);
  }
});

export default router;