import express from 'express';
// import { canWriteAssets } from '../../auth';
import { assetService } from '../../services';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { validate, validateId } from '../common/middleware/validate';
import { z } from 'zod';
import { parseAssetData } from './dto';
import { generateTrend } from '../../utils/trends';

const router = express.Router();

// Define the asset schema for validation with proper null handling
const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.union([z.string(), z.null()]).optional(),
  assetId: z.string().min(1, 'Asset ID is required'),
  type: z.enum(['data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other']),
  status: z.enum(['Active', 'Decommissioned', 'To Adopt']),
  businessUnit: z.union([z.string(), z.null()]).optional(),
  confidentiality: z.enum(['low', 'medium', 'high']),
  integrity: z.enum(['low', 'medium', 'high']),
  availability: z.enum(['low', 'medium', 'high']),
  criticality: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  legalEntity: z.union([z.string(), z.null()]).optional(),
  currency: z.enum(['USD', 'EUR']).optional().default('USD'),
  assetValue: z.union([z.number(), z.string()]).transform(val =>
    typeof val === 'string' ? Number(val.replace(/[^0-9.-]/g, '')) : val
  ),
  regulatoryImpact: z.array(z.string()).optional().default([]),
  externalInternal: z.enum(['external', 'internal']).default('internal'),
  owner: z.union([z.string(), z.null()]).optional(),
  custodian: z.union([z.string(), z.null()]).optional(),
  location: z.union([z.string(), z.null()]).optional(),
  dependencies: z.array(z.string()).optional().default([]),
  notes: z.union([z.string(), z.null()]).optional(),
  agentCount: z.number().optional().default(1),
  // Additional fields that UI might send
  hierarchy_level: z.union([z.string(), z.null()]).optional(),
  architecture_domain: z.union([z.string(), z.null()]).optional()
}).transform(data => ({
  ...data,
  // Clean up null values for database storage
  description: data.description || '',
  businessUnit: data.businessUnit || 'Information Technology',
  owner: data.owner || '',
  custodian: data.custodian || '',
  location: data.location || '',
  notes: data.notes || ''
}));

// GET /assets/summary - Get asset summary statistics
router.get('/summary', async (req, res) => {
  try {
    const assets = await assetService.getAllAssets();

    const total = assets.length;
    const active = assets.filter((asset) => asset.status === "Active").length;
    const apps = assets.filter((asset) => asset.type === "application" || asset.type === "application_service").length;
    const totalValue = assets.reduce((sum, asset) => {
      const value = typeof asset.assetValue === "number" ? asset.assetValue : parseFloat(asset.assetValue || "0");
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const trends = {
      total: generateTrend(total),
      active: generateTrend(active),
      apps: generateTrend(apps),
      totalValue: generateTrend(Math.max(totalValue / 1_000_000, 5)) // Normalize for display if needed, but keeping consistent with frontend logic
    };

    sendSuccess(res, {
      stats: { total, active, apps, totalValue },
      trends
    });
  } catch (error) {
    console.error('Error fetching asset summary:', error);
    sendError(res, 'Failed to fetch asset summary', 500);
  }
});

// GET /assets/vulnerabilities/summary - Get vulnerability summary statistics
router.get('/vulnerabilities/summary', async (req, res) => {
  try {
    const { db } = await import('../../db');
    const { sql } = await import('drizzle-orm');

    // Fetch all vulnerabilities to calculate stats
    // In a real app, we would do this with aggregation queries for performance
    const result = await db.execute(sql`
      SELECT severity, status FROM vulnerabilities
    `);

    const vulns = result.rows as any[];

    const total = vulns.length;
    const critical = vulns.filter((v) => v.severity === "critical").length;
    const high = vulns.filter((v) => v.severity === "high").length;
    const open = vulns.filter((v) => v.status === "open").length;
    const resolved = vulns.filter((v) => v.status === "resolved").length;

    const trends = {
      total: generateTrend(total),
      criticalHigh: generateTrend(critical + high),
      open: generateTrend(open),
      resolved: generateTrend(resolved)
    };

    sendSuccess(res, {
      stats: { total, critical, high, open, resolved },
      trends
    });
  } catch (error) {
    console.error('Error fetching vulnerability summary:', error);
    sendError(res, 'Failed to fetch vulnerability summary', 500);
  }
});

// GET /assets/vulnerabilities - Get vulnerabilities for assets (must come before /:id)
router.get('/vulnerabilities', async (req, res) => {
  try {
    const { db } = await import('../../db');
    const { sql } = await import('drizzle-orm');

    // Use raw query to avoid schema compatibility issues
    const result = await db.execute(sql`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.severity,
        v.status,
        v.discovered_date as discovery_date,
        v.created_at,
        COUNT(va.id) as affected_assets
      FROM vulnerabilities v
      LEFT JOIN vulnerability_assets va ON v.id = va.vulnerability_id
      GROUP BY v.id, v.title, v.description, v.severity, v.status, v.discovered_date, v.created_at
      ORDER BY v.created_at DESC
      LIMIT 50
    `);

    sendSuccess(res, result.rows || []);
  } catch (error) {
    console.error('Error fetching asset vulnerabilities:', error);
    sendError(res, 'Failed to fetch asset vulnerabilities', 500);
  }
});

// GET /assets/vulnerabilities/:id - Get specific vulnerability
router.get('/vulnerabilities/:id', async (req, res) => {
  try {
    const { db } = await import('../../db');
    const { vulnerabilities } = await import('../../../shared/schema');
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

// GET /assets/vulnerabilities/:id/assets - Get assets affected by vulnerability
router.get('/vulnerabilities/:id/assets', async (req, res) => {
  try {
    const { db } = await import('../../db');
    const { vulnerabilityAssets, assets } = await import('../../../shared/schema');
    const { eq } = await import('drizzle-orm');

    const vulnerabilityId = parseInt(req.params.id);
    const affectedAssets = await db
      .select({
        id: assets.id,
        assetId: assets.assetId,
        name: assets.name,
        type: assets.type,
        status: assets.status,
        value: assets.assetValue
      })
      .from(vulnerabilityAssets)
      .innerJoin(assets, eq(vulnerabilityAssets.assetId, assets.id))
      .where(eq(vulnerabilityAssets.vulnerabilityId, vulnerabilityId));

    sendSuccess(res, affectedAssets);
  } catch (error) {
    console.error('Error fetching vulnerability assets:', error);
    sendError(res, 'Failed to fetch vulnerability assets', 500);
  }
});

// POST /assets/vulnerabilities - Create new vulnerability
router.post('/vulnerabilities', async (req, res) => {
  try {
    const { db } = await import('../../db');
    const { vulnerabilities, vulnerabilityAssets } = await import('../../../shared/schema');

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

// POST /assets/vulnerabilities/import - Import vulnerabilities
router.post('/vulnerabilities/import', async (req, res) => {
  try {
    const result = { imported: 0, message: 'Vulnerability import not yet implemented' };
    sendSuccess(res, result);
  } catch (error) {
    console.error('Error importing vulnerabilities:', error);
    sendError(res, 'Failed to import vulnerabilities', 500);
  }
});

// Get all assets with optional filtering
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const assets = await assetService.getAllAssets();
    return sendSuccess(res, assets);
  } catch (error) {
    return sendError(res, error);
  }
});

// Get a single asset by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = await assetService.getAsset(id);

    if (!asset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }

    return sendSuccess(res, asset);
  } catch (error) {
    return sendError(res, error);
  }
});

// Create a new asset
router.post('/', async (req, res) => {
  try {
    // Make sure to use a more permissive approach for validation
    let asset = req.body;

    // Ensure required fields are present
    if (!asset.name) {
      return sendError(res, { message: 'Asset name is required' }, 400);
    }

    if (!asset.assetId) {
      return sendError(res, { message: 'Asset ID is required' }, 400);
    }

    // Default values for required fields
    asset = {
      ...asset,
      type: asset.type || 'application',
      status: asset.status || 'Active',
      description: asset.description || 'No description provided',
      hierarchy_level: asset.hierarchy_level || 'application_service',
      // Handle both camelCase and snake_case field names
      business_unit: asset.business_unit || asset.businessUnit || 'Information Technology',
      architecture_domain: asset.architecture_domain || asset.architectureDomain || 'Application',
      confidentiality: asset.confidentiality || 'medium',
      integrity: asset.integrity || 'medium',
      availability: asset.availability || 'medium',
      criticality: asset.criticality || 'medium',
      assetValue: typeof asset.assetValue === 'string' ?
        Number(asset.assetValue.replace(/[^0-9.-]/g, '')) :
        (asset.assetValue || 0)
    };

    // Check if asset ID already exists
    const existingAsset = await assetService.getAssetByAssetId(asset.assetId);
    if (existingAsset) {
      return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
    }

    const newAsset = await assetService.createAsset(asset);
    return sendSuccess(res, newAsset, 201);
  } catch (error) {
    console.error('Error creating asset:', error);
    return sendError(res, { message: 'Error creating asset', details: (error as any).message || error }, 500);
  }
});

// Update an asset
router.put('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Check if asset exists
    const existingAsset = await assetService.getAsset(id);
    if (!existingAsset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }

    // Check if assetId is changed and if it conflicts with another asset
    if (updates.assetId && updates.assetId !== existingAsset.assetId) {
      const conflictingAsset = await assetService.getAssetByAssetId(updates.assetId);
      if (conflictingAsset) {
        return sendError(res, { message: `Asset ID ${updates.assetId} already exists` }, 400);
      }
    }

    // Merge updates with existing asset data
    const assetData = {
      ...existingAsset,
      ...updates,
      id // Ensure ID stays the same
    };

    const updatedAsset = await assetService.updateAsset(id, assetData);
    return sendSuccess(res, updatedAsset);
  } catch (error) {
    return sendError(res, error);
  }
});

// Delete an asset
router.delete('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Attempting to delete asset with ID: ${id}`);

    // Get the asset to find its assetId
    const asset = await assetService.getAsset(id);
    if (!asset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }

    console.log(`Found asset with assetId: ${asset.assetId}, proceeding with cascade deletion`);

    // Use cascade deletion to handle all related data
    const deleted = await assetService.deleteAssetWithCascade(id);

    if (!deleted) {
      return sendError(res, { message: 'Failed to delete asset' }, 500);
    }

    console.log(`Asset ${id} deleted successfully`);
    return sendSuccess(res, { message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return sendError(res, {
      message: 'Error deleting asset',
      details: error.message || String(error)
    }, 500);
  }
});

// Get risks associated with an asset
router.get('/:id/risks', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Verify asset exists
    const asset = await assetService.getAsset(id);
    if (!asset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }

    const risks = await assetService.getRisksForAsset(asset.assetId);
    const assetRisks = risks.filter(risk =>
      risk.associatedAssets && risk.associatedAssets.includes(id.toString())
    );
    return sendSuccess(res, assetRisks);
  } catch (error) {
    return sendError(res, error);
  }
});

export default router;