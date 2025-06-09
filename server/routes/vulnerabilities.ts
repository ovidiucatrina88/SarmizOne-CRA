import { Router } from 'express';
import { db } from '../db';
import { vulnerabilities, vulnerabilityAssets, assets } from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Validation schema for vulnerability creation
const createVulnerabilitySchema = z.object({
  cveId: z.string().min(1, "CVE ID is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  cvssScore: z.number().min(0).max(10).optional(),
  cvssVector: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'mitigated', 'resolved', 'false_positive']).default('open'),
  discoveredDate: z.string().optional(),
  eDetectImpact: z.number().min(0).max(1).optional(),
  eResistImpact: z.number().min(0).max(1).optional(),
  affectedAssets: z.array(z.string()).optional().default([])
});

// GET /vulnerabilities - List all vulnerabilities  
router.get('/vulnerabilities', async (req, res) => {
  try {
    const allVulnerabilities = await db.select({
      id: vulnerabilities.id,
      cveId: vulnerabilities.cveId,
      title: vulnerabilities.title,
      description: vulnerabilities.description,
      cvssScore: vulnerabilities.cvssScore,
      cvssVector: vulnerabilities.cvssVector,
      severity: vulnerabilities.severity,
      status: vulnerabilities.status,
      discoveredDate: vulnerabilities.discoveredDate,
      remediatedDate: vulnerabilities.remediatedDate,
      publishedDate: vulnerabilities.publishedDate,
      modifiedDate: vulnerabilities.modifiedDate,
      eDetectImpact: vulnerabilities.eDetectImpact,
      eResistImpact: vulnerabilities.eResistImpact,
      remediation: vulnerabilities.remediation,
      createdAt: vulnerabilities.createdAt,
      updatedAt: vulnerabilities.updatedAt
    }).from(vulnerabilities);
    
    res.json({
      success: true,
      data: allVulnerabilities
    });
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vulnerabilities'
    });
  }
});

// POST /api/vulnerabilities - Create new vulnerability
router.post('/vulnerabilities', async (req, res) => {
  try {
    const validatedData = createVulnerabilitySchema.parse(req.body);
    
    // Create the vulnerability
    const [newVulnerability] = await db
      .insert(vulnerabilities)
      .values({
        cveId: validatedData.cveId,
        title: validatedData.title,
        description: validatedData.description,
        severity: validatedData.severity,
        cvssScore: validatedData.cvssScore,
        cvssVector: validatedData.cvssVector,
        status: validatedData.status,
        discoveredDate: validatedData.discoveredDate ? new Date(validatedData.discoveredDate) : new Date(),
        eDetectImpact: validatedData.eDetectImpact || 0,
        eResistImpact: validatedData.eResistImpact || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    // Associate with assets if provided
    if (validatedData.affectedAssets && validatedData.affectedAssets.length > 0) {
      for (const assetId of validatedData.affectedAssets) {
        // Find asset by assetId
        const [asset] = await db
          .select()
          .from(assets)
          .where(eq(assets.assetId, assetId));

        if (asset) {
          await db
            .insert(vulnerabilityAssets)
            .values({
              vulnerabilityId: newVulnerability.id,
              assetId: asset.id,
              createdAt: new Date(),
              updatedAt: new Date()
            });
        }
      }
    }

    res.status(201).json({
      success: true,
      data: newVulnerability
    });
  } catch (error) {
    console.error('Error creating vulnerability:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create vulnerability'
    });
  }
});

// GET /api/vulnerabilities/:id - Get specific vulnerability
router.get('/vulnerabilities/:id', async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);
    
    const [vulnerability] = await db
      .select()
      .from(vulnerabilities)
      .where(eq(vulnerabilities.id, vulnerabilityId));

    if (!vulnerability) {
      return res.status(404).json({
        success: false,
        error: 'Vulnerability not found'
      });
    }

    // Get associated assets
    const associatedAssets = await db
      .select({
        assetId: assets.assetId,
        assetName: assets.name,
        assetType: assets.type
      })
      .from(vulnerabilityAssets)
      .innerJoin(assets, eq(vulnerabilityAssets.assetId, assets.id))
      .where(eq(vulnerabilityAssets.vulnerabilityId, vulnerabilityId));

    res.json({
      success: true,
      data: {
        ...vulnerability,
        affectedAssets: associatedAssets
      }
    });
  } catch (error) {
    console.error('Error fetching vulnerability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vulnerability'
    });
  }
});

// PUT /api/vulnerabilities/:id - Update vulnerability
router.put('/vulnerabilities/:id', async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);
    const validatedData = createVulnerabilitySchema.partial().parse(req.body);

    const [updatedVulnerability] = await db
      .update(vulnerabilities)
      .set({
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(vulnerabilities.id, vulnerabilityId))
      .returning();

    if (!updatedVulnerability) {
      return res.status(404).json({
        success: false,
        error: 'Vulnerability not found'
      });
    }

    res.json({
      success: true,
      data: updatedVulnerability
    });
  } catch (error) {
    console.error('Error updating vulnerability:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update vulnerability'
    });
  }
});

// DELETE /api/vulnerabilities/:id - Delete vulnerability
router.delete('/vulnerabilities/:id', async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);

    // Delete associated asset relationships first
    await db
      .delete(vulnerabilityAssets)
      .where(eq(vulnerabilityAssets.vulnerabilityId, vulnerabilityId));

    // Delete the vulnerability
    const [deletedVulnerability] = await db
      .delete(vulnerabilities)
      .where(eq(vulnerabilities.id, vulnerabilityId))
      .returning();

    if (!deletedVulnerability) {
      return res.status(404).json({
        success: false,
        error: 'Vulnerability not found'
      });
    }

    res.json({
      success: true,
      message: 'Vulnerability deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vulnerability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete vulnerability'
    });
  }
});

// GET /api/vulnerability-metrics - Get vulnerability metrics for dashboard
router.get('/vulnerability-metrics', async (req, res) => {
  try {
    // Use raw SQL to match actual database structure
    const result = await db.execute(sql`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN severity_cvss3 >= 9.0 THEN 1 END) as critical,
             COUNT(CASE WHEN severity_cvss3 >= 7.0 AND severity_cvss3 < 9.0 THEN 1 END) as high,
             COUNT(CASE WHEN severity_cvss3 >= 4.0 AND severity_cvss3 < 7.0 THEN 1 END) as medium,
             COUNT(CASE WHEN severity_cvss3 < 4.0 THEN 1 END) as low,
             COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
             COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
             AVG(COALESCE(severity_cvss3, 0)) as avg_cvss
      FROM vulnerabilities
    `);
    
    const metrics = {
      total: parseInt(result.rows[0]?.total || 0),
      critical: parseInt(result.rows[0]?.critical || 0),
      high: parseInt(result.rows[0]?.high || 0),
      medium: parseInt(result.rows[0]?.medium || 0),
      low: parseInt(result.rows[0]?.low || 0),
      open: parseInt(result.rows[0]?.open || 0),
      resolved: parseInt(result.rows[0]?.resolved || 0),
      avgCvss: parseFloat(result.rows[0]?.avg_cvss || 0)
    };

    res.json({
      success: true,
      data: {
        metrics,
        vulnerabilities: []
      }
    });
  } catch (error) {
    console.error('Error fetching vulnerability metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vulnerability metrics'
    });
  }
});

export default router;