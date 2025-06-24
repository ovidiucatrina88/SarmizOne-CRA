import express from 'express';
import { sendError, sendSuccess } from './common/responses/apiResponse';
import { sql } from 'drizzle-orm';

const router = express.Router();

/**
 * GET /api/vulnerabilities - Get all vulnerabilities
 */
router.get('/', async (req, res) => {
  try {
    const { db } = await import('../db');
    const { vulnerabilities } = await import('../../shared/schema');
    
    // Get vulnerabilities using basic query to avoid schema issues
    const result = await db.execute(sql`SELECT id, title, description, severity, status, discovered_date as "discoveredDate", created_at as "createdAt" FROM vulnerabilities LIMIT 50`);
    
    sendSuccess(res, result.rows || []);
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
    const vulnerability = await db.select({
      id: vulnerabilities.id,
      cve_id: vulnerabilities.cveId,
      title: vulnerabilities.title,
      description: vulnerabilities.description,
      discovery_date: vulnerabilities.discoveryDate,
      severity_cvss3: vulnerabilities.severityCvss3,
      patchable: vulnerabilities.patchable,
      source: vulnerabilities.source,
      created_at: vulnerabilities.createdAt,
      updated_at: vulnerabilities.updatedAt,
      severity: vulnerabilities.severity,
      status: vulnerabilities.status,
      e_detect: vulnerabilities.eDetect,
      e_resist: vulnerabilities.eResist,
      remediation: vulnerabilities.remediation
    }).from(vulnerabilities).where(eq(vulnerabilities.id, vulnerabilityId));
    
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
      severityCvss3: cvssScore?.toString() || '0',
      severity,
      status,
      eDetect: eDetectImpact?.toString() || null,
      eResist: eResistImpact?.toString() || null,
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

/**
 * DELETE /api/vulnerabilities/:id - Delete vulnerability
 */
router.delete('/:id', async (req, res) => {
  try {
    const { db } = await import('../db');
    const { vulnerabilities, vulnerabilityAssets } = await import('../../shared/schema');
    const { eq } = await import('drizzle-orm');
    
    const vulnerabilityId = parseInt(req.params.id);
    
    // First delete associated assets using correct column name
    await db.execute(sql`DELETE FROM vulnerability_assets WHERE vulnerability_id = ${vulnerabilityId}`);
    
    // Then delete the vulnerability
    const deleted = await db.delete(vulnerabilities).where(eq(vulnerabilities.id, vulnerabilityId)).returning();
    
    if (deleted.length === 0) {
      return sendError(res, 'Vulnerability not found', 404);
    }
    
    sendSuccess(res, { message: 'Vulnerability deleted successfully', id: vulnerabilityId });
  } catch (error) {
    console.error('Error deleting vulnerability:', error);
    sendError(res, 'Failed to delete vulnerability', 500);
  }
});

export default router;