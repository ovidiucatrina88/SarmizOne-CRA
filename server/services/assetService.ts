import { DatabaseStorage } from './repositoryStorage';
import { Asset, InsertAsset } from '@shared/schema';

export class AssetService {
  private repository: DatabaseStorage;
  
  constructor(repository: DatabaseStorage) {
    this.repository = repository;
  }
  
  /**
   * Get all assets
   */
  async getAllAssets(): Promise<Asset[]> {
    return this.repository.getAllAssets();
  }
  
  /**
   * Get an asset by ID
   */
  async getAsset(id: number): Promise<Asset | undefined> {
    return this.repository.getAsset(id);
  }
  
  /**
   * Get an asset by assetId
   */
  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return this.repository.getAssetByAssetId(assetId);
  }
  
  /**
   * Create a new asset
   */
  async createAsset(assetData: InsertAsset): Promise<Asset> {
    // Create the asset
    const asset = await this.repository.createAsset(assetData);
    
    // Log the asset creation
    await this.logAssetActivity(asset.id, 'create', 'Asset created');
    
    return asset;
  }
  
  /**
   * Update an asset
   */
  async updateAsset(id: number, assetData: Partial<Asset>): Promise<Asset | undefined> {
    const updatedAsset = await this.repository.updateAsset(id, assetData);
    
    if (updatedAsset) {
      // Log the asset update
      await this.logAssetActivity(updatedAsset.id, 'update', 'Asset updated');
    }
    
    return updatedAsset;
  }
  
  /**
   * Delete an asset
   */
  async deleteAsset(id: number): Promise<boolean> {
    // Get risks associated with this asset
    const asset = await this.repository.getAsset(id);
    if (!asset) {
      return false;
    }
    
    // Delete the asset
    const success = await this.repository.deleteAsset(id);
    
    if (success) {
      // Log the asset deletion
      await this.logAssetActivity(id, 'delete', 'Asset deleted');
    }
    
    return success;
  }
  
  /**
   * Get risks associated with an asset
   */
  async getRisksForAsset(assetId: string): Promise<any[]> {
    // This would require a more sophisticated approach going through all risks
    // and checking their associatedAssets array
    const allRisks = await this.repository.getAllRisks();
    
    // Filter risks that have this asset in their associatedAssets array
    return allRisks.filter(risk => 
      risk.associatedAssets && 
      risk.associatedAssets.includes(assetId)
    );
  }
  
  /**
   * Helper to log asset activity
   */
  private async logAssetActivity(assetId: number, actionType: string, description: string): Promise<void> {
    await this.repository.createActivityLog({
      entityType: 'asset',
      entityId: assetId.toString(),
      actionType,
      description,
      userId: 'system', // Default to system for now, could be passed from controller
      timestamp: new Date(),
      createdAt: new Date(),
      details: JSON.stringify({})
    });
  }
}

// Factory function to create a service instance with repository injection
export const assetService = (repository: DatabaseStorage) => new AssetService(repository);