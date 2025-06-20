import express from 'express';
import { sendError, sendSuccess } from './common/responses/apiResponse';

const router = express.Router();

/**
 * GET /api/vulnerabilities - Get all vulnerabilities
 */
router.get('/', async (req, res) => {
  try {
    const { db } = await import('../db');
    const { vulnerabilities } = await import('../../shared/schema');
    
    const allVulnerabilities = await db.select().from(vulnerabilities);
    sendSuccess(res, allVulnerabilities);
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
    const { db } = await import('../db');
    const { vulnerabilities } = await import('../../shared/schema');
    const { eq } = await import('drizzle-orm');
    
    const vulnerabilityId = parseInt(req.params.id);
    const vulnerability = await db.select().from(vulnerabilities).where(eq(vulnerabilities.id, vulnerabilityId));
    
    if (vulnerability.length === 0) {
      return sendError(res, 'Vulnerability not found', 404);
    }
    
    sendSuccess(res, vulnerability[0]);
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
    const { db } = await import('../db');
    const { vulnerabilities, vulnerabilityAssets } = await import('../../shared/schema');
    
    const {
      cveId,
      title,
      description,
      cvssScore,
      severity,
      status,
      eDetectImpact,
      eResistImpact,
      selectedAssets,
      remediation,
      references
    } = req.body;

    // Create vulnerability using the correct column names
    const [newVulnerability] = await db.insert(vulnerabilities).values({
      cveId,
      title,
      description,
      severityCvss3: cvssScore || null,
      severity,
      status,
      eDetect: eDetectImpact || null,
      eResist: eResistImpact || null,
      source: 'manual'
    }).returning();

    // Associate with assets if specified
    if (selectedAssets && selectedAssets.length > 0) {
      const assetAssociations = selectedAssets.map((assetId: number) => ({
        vulnerabilityId: newVulnerability.id,
        assetId: assetId
      }));
      
      await db.insert(vulnerabilityAssets).values(assetAssociations);
    }

    sendSuccess(res, newVulnerability);
  } catch (error) {
    console.error('Error creating vulnerability:', error);
    sendError(res, 'Failed to create vulnerability', 500);
  }
});

export default router;