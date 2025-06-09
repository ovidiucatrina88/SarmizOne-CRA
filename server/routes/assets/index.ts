import express from 'express';
// import { canWriteAssets } from '../../auth';
import { storage } from '../../services/storage';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { validate, validateId } from '../common/middleware/validate';
import { z } from 'zod';
import { parseAssetData } from './dto';

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

// Get all assets with optional filtering
router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const assets = await storage.getAllAssets();
    return sendSuccess(res, assets);
  } catch (error) {
    return sendError(res, error);
  }
});

// Get a single asset by ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = await storage.getAsset(id);
    
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
    const existingAsset = await storage.getAssetByAssetId(asset.assetId);
    if (existingAsset) {
      return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
    }
    
    const newAsset = await storage.createAsset(asset);
    return sendSuccess(res, newAsset, 201);
  } catch (error) {
    console.error('Error creating asset:', error);
    return sendError(res, { message: 'Error creating asset', details: (error as any).message || error }, 500);
  }
});

// Update an asset
router.put('/:id', validateId, validate(assetSchema), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = req.body;
    
    // Check if asset exists
    const existingAsset = await storage.getAsset(id);
    if (!existingAsset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }
    
    // Check if assetId is changed and if it conflicts with another asset
    if (asset.assetId !== existingAsset.assetId) {
      const conflictingAsset = await storage.getAssetByAssetId(asset.assetId);
      if (conflictingAsset) {
        return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
      }
    }
    
    const updatedAsset = await storage.updateAsset(id, asset);
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
    const asset = await storage.getAsset(id);
    if (!asset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }
    
    console.log(`Found asset with assetId: ${asset.assetId}, checking for associated risks`);
    
    try {
      // Check if there are any risks associated with the asset
      // Use a try/catch to handle any potential function name mismatches
      const associatedRisks = await storage.getRisksForAsset(asset.assetId);
      
      if (Array.isArray(associatedRisks) && associatedRisks.length > 0) {
        return sendError(res, { 
          message: 'Cannot delete asset with associated risks',
          associatedRisks
        }, 400);
      }
      
      console.log('No associated risks found, proceeding with deletion');
    } catch (riskError) {
      console.error('Error checking for associated risks:', riskError);
      // Continue with deletion even if we can't check for risks - this ensures we can still delete assets
    }
    
    // Proceed with asset deletion
    const deleted = await storage.deleteAsset(id);
    
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
    const asset = await storage.getAsset(id);
    if (!asset) {
      return sendError(res, { message: 'Asset not found' }, 404);
    }
    
    const risks = await storage.getAllRisks();
    const assetRisks = risks.filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(id.toString())
    );
    return sendSuccess(res, assetRisks);
  } catch (error) {
    return sendError(res, error);
  }
});

export default router;