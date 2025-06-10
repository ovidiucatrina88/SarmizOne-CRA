import { storage } from '../../services/storage';
import type { Asset, AssetUpdate } from './dto';

/**
 * Service class for asset management functionality
 */
export class AssetService {
  /**
   * Get all assets
   */
  async getAllAssets(): Promise<Asset[]> {
    try {
      return await storage.getAllAssets();
    } catch (error) {
      throw { status: 500, message: 'Failed to retrieve assets', details: error };
    }
  }

  /**
   * Get asset by ID
   */
  async getAssetById(id: number): Promise<Asset> {
    try {
      const asset = await storage.getAsset(id);
      if (!asset) {
        throw { status: 404, message: 'Asset not found' };
      }
      return asset;
    } catch (error) {
      if (error.status === 404) throw error;
      throw { status: 500, message: 'Failed to retrieve asset', details: error };
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(assetData: Asset): Promise<Asset> {
    try {
      return await storage.createAsset(assetData);
    } catch (error) {
      throw { status: 500, message: 'Failed to create asset', details: error };
    }
  }

  /**
   * Update an existing asset
   */
  async updateAsset(id: number, assetData: AssetUpdate): Promise<Asset> {
    try {
      const asset = await storage.getAsset(id);
      if (!asset) {
        throw { status: 404, message: 'Asset not found' };
      }
      
      return await storage.updateAsset(id, assetData);
    } catch (error) {
      if (error.status === 404) throw error;
      throw { status: 500, message: 'Failed to update asset', details: error };
    }
  }

  /**
   * Delete an asset with cascade operations
   */
  async deleteAsset(id: number): Promise<void> {
    try {
      const asset = await storage.getAsset(id);
      if (!asset) {
        throw { status: 404, message: 'Asset not found' };
      }
      
      await storage.deleteAssetWithCascade(id);
    } catch (error) {
      if (error.status === 404) throw error;
      throw { status: 500, message: 'Failed to delete asset', details: error };
    }
  }

  /**
   * Get risks associated with an asset
   */
  async getAssetRisks(id: number): Promise<any[]> {
    try {
      const asset = await storage.getAsset(id);
      if (!asset) {
        throw { status: 404, message: 'Asset not found' };
      }
      
      return await storage.getAssetRisks(id);
    } catch (error) {
      if (error.status === 404) throw error;
      throw { status: 500, message: 'Failed to retrieve asset risks', details: error };
    }
  }
}

// Export a singleton instance
export const assetService = new AssetService();