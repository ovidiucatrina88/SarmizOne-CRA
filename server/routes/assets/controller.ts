import { Request, Response } from 'express';
import { assetService } from '../../services';
import { parseAssetData } from './dto';
import { sendSuccess, sendError } from '../common/responses/apiResponse';

/**
 * Controller for asset-related endpoints
 */
export class AssetController {
  /**
   * Get all assets
   */
  async getAllAssets(req: Request, res: Response) {
    try {
      const assets = await assetService.getAllAssets();
      sendSuccess(res, assets);
    } catch (error) {
      sendError(res, error);
    }
  }

  /**
   * Get single asset by ID
   */
  async getAssetById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return sendError(res, { 
          status: 400, 
          message: 'Invalid ID format', 
          details: 'ID must be a number' 
        });
      }
      
      const asset = await assetService.getAssetById(id);
      
      if (!asset) {
        return sendError(res, { 
          status: 404, 
          message: 'Asset not found', 
          details: `No asset found with ID ${id}` 
        });
      }
      
      sendSuccess(res, asset);
    } catch (error) {
      sendError(res, error);
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(req: Request, res: Response) {
    try {
      // Debug logs
      console.log('⭐ Creating asset with data:', JSON.stringify(req.body, null, 2));
      
      try {
        // Special case for empty assetId - set to generate a new one server-side
        if (req.body.assetId === "") {
          req.body.assetId = `AST-${Date.now().toString().substring(6)}`;
        }
        
        // Ensure description is a string
        req.body.description = String(req.body.description || "");
        
        // Ensure assetValue is a number
        if (typeof req.body.assetValue === 'string') {
          req.body.assetValue = parseFloat(req.body.assetValue.replace(/[^0-9.-]/g, ''));
        } else if (typeof req.body.assetValue !== 'number') {
          req.body.assetValue = 0;
        }
        
        // Ensure regulatoryImpact is an array
        if (!Array.isArray(req.body.regulatoryImpact)) {
          req.body.regulatoryImpact = [];
        }
        
        // Ensure dependencies is an array
        if (!Array.isArray(req.body.dependencies)) {
          req.body.dependencies = [];
        }
        
        // Ensure agentCount is a number
        req.body.agentCount = Number(req.body.agentCount || 1);
        
        console.log('⭐ Sanitized asset data:', JSON.stringify(req.body, null, 2));
        
        // Parse and validate the request body
        const assetData = parseAssetData(req.body);
        console.log('⭐ Parsed asset data:', JSON.stringify(assetData, null, 2));
        const newAsset = await assetService.createAsset(assetData);
        console.log('⭐ Asset created successfully:', JSON.stringify(newAsset, null, 2));
        sendSuccess(res, newAsset, 201);
      } catch (error) {
        console.error('⭐ Validation error details:', JSON.stringify(error, null, 2));
        if (error instanceof Error) {
          console.error('⭐ Error stack:', error.stack);
        }
        sendError(res, {
          status: 400,
          message: 'Validation error: ' + (error.message || JSON.stringify(error)),
          details: error
        });
      }
    } catch (error) {
      console.error('⭐ Unexpected error in createAsset:', error);
      if (error instanceof Error) {
        console.error('⭐ Error stack:', error.stack);
      }
      sendError(res, error);
    }
  }

  /**
   * Update an existing asset
   */
  async updateAsset(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return sendError(res, { 
          status: 400, 
          message: 'Invalid ID format', 
          details: 'ID must be a number' 
        });
      }
      
      // Check if asset exists
      const existingAsset = await assetService.getAssetById(id);
      if (!existingAsset) {
        return sendError(res, { 
          status: 404, 
          message: 'Asset not found', 
          details: `No asset found with ID ${id}` 
        });
      }
      
      // Parse and validate the request body (partial update)
      const assetData = parseAssetData(req.body, true);
      const updatedAsset = await assetService.updateAsset(id, assetData);
      
      sendSuccess(res, updatedAsset);
    } catch (error) {
      sendError(res, error);
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return sendError(res, { 
          status: 400, 
          message: 'Invalid ID format', 
          details: 'ID must be a number' 
        });
      }
      
      // Check if asset exists
      const existingAsset = await assetService.getAssetById(id);
      if (!existingAsset) {
        return sendError(res, { 
          status: 404, 
          message: 'Asset not found', 
          details: `No asset found with ID ${id}` 
        });
      }
      
      await assetService.deleteAsset(id);
      sendSuccess(res, { 
        message: 'Asset deleted successfully', 
        id 
      });
    } catch (error) {
      sendError(res, error);
    }
  }

  /**
   * Get risks associated with an asset
   */
  async getAssetRisks(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return sendError(res, { 
          status: 400, 
          message: 'Invalid ID format', 
          details: 'ID must be a number' 
        });
      }
      
      // Check if asset exists
      const existingAsset = await assetService.getAssetById(id);
      if (!existingAsset) {
        return sendError(res, { 
          status: 404, 
          message: 'Asset not found', 
          details: `No asset found with ID ${id}` 
        });
      }
      
      const risks = await assetService.getAssetRisks(id);
      sendSuccess(res, risks);
    } catch (error) {
      sendError(res, error);
    }
  }
}

// Export a singleton instance
export const assetController = new AssetController();