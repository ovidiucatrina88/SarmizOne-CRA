import { IStorage } from "./storage";
import { DatabaseStorage } from "./repositoryStorage";
import { MemStorage } from "./storage";
import { 
  Asset, InsertAsset, 
  Risk, InsertRisk,
  Control, InsertControl,
  RiskResponse, InsertRiskResponse,
  ActivityLog, InsertActivityLog,
  LegalEntity, InsertLegalEntity
} from "@shared/schema";
import { checkDatabaseConnection } from "../db";

/**
 * ResilientStorage class that automatically falls back to in-memory storage when DB is unavailable
 * Implements the same IStorage interface so it can be used as a drop-in replacement
 */
export class ResilientStorage implements IStorage {
  private dbStorage: DatabaseStorage;
  private memStorage: MemStorage;
  private usingFallback: boolean = false;
  private checkInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    console.log("🔄 Initializing ResilientStorage with fallback capability");
    
    this.dbStorage = new DatabaseStorage();
    this.memStorage = new MemStorage();
    
    // Initial DB check
    this.checkDatabaseConnection();
    
    // Periodic DB check (every 30 seconds)
    this.checkInterval = setInterval(() => {
      this.checkDatabaseConnection();
    }, 30000);
  }
  
  private async checkDatabaseConnection() {
    try {
      const isConnected = await checkDatabaseConnection();
      
      if (!isConnected && !this.usingFallback) {
        console.warn("⚠️ Database connection unavailable, switching to in-memory fallback");
        this.usingFallback = true;
      } else if (isConnected && this.usingFallback) {
        console.log("✅ Database connection restored, switching back to database storage");
        this.usingFallback = false;
      }
    } catch (error) {
      if (!this.usingFallback) {
        console.error("❌ Error checking database connection, using fallback:", error);
        this.usingFallback = true;
      }
    }
  }
  
  private getCurrentStorage(): IStorage {
    return this.usingFallback ? this.memStorage : this.dbStorage;
  }
  
  /**
   * Helper method to safely call the appropriate storage method with fallback logic
   */
  private async safeStorageCall<T>(
    primaryMethod: () => Promise<T>,
    fallbackMethod: () => Promise<T>
  ): Promise<T> {
    if (this.usingFallback) {
      return fallbackMethod();
    }
    
    try {
      return await primaryMethod();
    } catch (error) {
      console.warn("⚠️ Database operation failed, using fallback storage:", error);
      this.usingFallback = true;
      return fallbackMethod();
    }
  }
  
  // ASSET METHODS
  
  async getAllAssets(): Promise<Asset[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllAssets(),
      () => this.memStorage.getAllAssets()
    );
  }
  
  async getAsset(id: number): Promise<Asset | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getAsset(id),
      () => this.memStorage.getAsset(id)
    );
  }
  
  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getAssetByAssetId(assetId),
      () => this.memStorage.getAssetByAssetId(assetId)
    );
  }
  
  async createAsset(asset: InsertAsset): Promise<Asset> {
    return this.getCurrentStorage().createAsset(asset);
  }
  
  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined> {
    return this.getCurrentStorage().updateAsset(id, asset);
  }
  
  async deleteAsset(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteAsset(id);
  }

  async deleteAssetWithCascade(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteAssetWithCascade(id);
  }
  
  // RISK METHODS
  
  async getAllRisks(): Promise<Risk[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllRisks(),
      () => this.memStorage.getAllRisks()
    );
  }
  
  async getRisk(id: number): Promise<Risk | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getRisk(id),
      () => this.memStorage.getRisk(id)
    );
  }
  
  async getRiskByRiskId(riskId: string): Promise<Risk | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getRiskByRiskId(riskId),
      () => this.memStorage.getRiskByRiskId(riskId)
    );
  }
  
  async createRisk(risk: InsertRisk): Promise<Risk> {
    return this.getCurrentStorage().createRisk(risk);
  }
  
  async updateRisk(id: number, risk: Partial<Risk>): Promise<Risk | undefined> {
    return this.getCurrentStorage().updateRisk(id, risk);
  }
  
  async deleteRisk(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteRisk(id);
  }
  
  // CONTROL METHODS
  
  async getAllControls(): Promise<Control[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllControls(),
      () => this.memStorage.getAllControls()
    );
  }
  
  async getControl(id: number): Promise<Control | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getControl(id),
      () => this.memStorage.getControl(id)
    );
  }
  
  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getControlByControlId(controlId),
      () => this.memStorage.getControlByControlId(controlId)
    );
  }
  
  async createControl(control: InsertControl): Promise<Control> {
    return this.getCurrentStorage().createControl(control);
  }
  
  async updateControl(id: number, control: Partial<Control>): Promise<Control | undefined> {
    return this.getCurrentStorage().updateControl(id, control);
  }
  
  async deleteControl(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteControl(id);
  }
  
  // RISK RESPONSE METHODS
  
  async getAllRiskResponses(): Promise<RiskResponse[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllRiskResponses(),
      () => this.memStorage.getAllRiskResponses()
    );
  }
  
  async getRiskResponse(id: number): Promise<RiskResponse | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getRiskResponse(id),
      () => this.memStorage.getRiskResponse(id)
    );
  }
  
  async getRiskResponseByRiskId(riskId: string): Promise<RiskResponse | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getRiskResponseByRiskId(riskId),
      () => this.memStorage.getRiskResponseByRiskId(riskId)
    );
  }
  
  async createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse> {
    return this.getCurrentStorage().createRiskResponse(response);
  }
  
  async updateRiskResponse(id: number, response: Partial<RiskResponse>): Promise<RiskResponse | undefined> {
    return this.getCurrentStorage().updateRiskResponse(id, response);
  }
  
  async deleteRiskResponse(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteRiskResponse(id);
  }
  
  // ACTIVITY LOG METHODS
  
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllActivityLogs(),
      () => this.memStorage.getAllActivityLogs()
    );
  }
  
  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getActivityLog(id),
      () => this.memStorage.getActivityLog(id)
    );
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    return this.getCurrentStorage().createActivityLog(log);
  }
  
  // LEGAL ENTITY METHODS
  
  async getAllLegalEntities(): Promise<LegalEntity[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllLegalEntities(),
      () => this.memStorage.getAllLegalEntities()
    );
  }
  
  async getLegalEntity(id: number): Promise<LegalEntity | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getLegalEntity(id),
      () => this.memStorage.getLegalEntity(id)
    );
  }
  
  async getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getLegalEntityByEntityId(entityId),
      () => this.memStorage.getLegalEntityByEntityId(entityId)
    );
  }
  
  async createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity> {
    return this.getCurrentStorage().createLegalEntity(entity);
  }
  
  async updateLegalEntity(id: number, entity: Partial<LegalEntity>): Promise<LegalEntity | undefined> {
    return this.getCurrentStorage().updateLegalEntity(id, entity);
  }
  
  async deleteLegalEntity(id: number): Promise<boolean> {
    return this.getCurrentStorage().deleteLegalEntity(id);
  }
  
  async getAssetsForLegalEntity(entityId: string): Promise<Asset[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAssetsForLegalEntity(entityId),
      () => this.memStorage.getAssetsForLegalEntity(entityId)
    );
  }
  
  async getAssetsByIds(assetIds: string[]): Promise<Asset[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAssetsByIds(assetIds),
      () => {
        // Fallback implementation for memory storage
        return Promise.resolve([]);
      }
    );
  }
  
  // RISK LIBRARY METHODS
  
  async getAllRiskLibraryItems(): Promise<any[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllRiskLibraryItems(),
      () => {
        // Fallback implementation for memory storage - return empty array
        return Promise.resolve([]);
      }
    );
  }
  
  async getRiskLibraryItem(id: number): Promise<any | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getRiskLibraryItem(id),
      () => {
        // Fallback implementation for memory storage
        return Promise.resolve(undefined);
      }
    );
  }
  
  async createRiskLibraryItem(data: any): Promise<any> {
    return this.safeStorageCall(
      () => this.dbStorage.createRiskLibraryItem(data),
      () => {
        // Fallback implementation - this would typically save to an in-memory store
        return Promise.resolve({ id: -1, ...data });
      }
    );
  }
  
  // CONTROL LIBRARY METHODS
  
  async getAllControlLibraryItems(): Promise<any[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAllControlLibraryItems(),
      () => {
        // Fallback implementation for memory storage - return empty array
        return Promise.resolve([]);
      }
    );
  }
  
  async getControlLibraryItem(id: number): Promise<any | undefined> {
    return this.safeStorageCall(
      () => this.dbStorage.getControlLibraryItem(id),
      () => {
        // Fallback implementation for memory storage
        return Promise.resolve(undefined);
      }
    );
  }
  
  async createControlLibraryItem(data: any): Promise<any> {
    return this.safeStorageCall(
      () => this.dbStorage.createControlLibraryItem(data),
      () => {
        // Fallback implementation - this would typically save to an in-memory store
        return Promise.resolve({ id: -1, ...data });
      }
    );
  }
  
  // SPECIALIZED METHODS
  
  async getControlsForRisk(riskId: string): Promise<Control[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getControlsForRisk(riskId),
      () => this.memStorage.getControlsForRisk(riskId)
    );
  }
  
  async getAssetsForRisk(riskId: string): Promise<Asset[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getAssetsForRisk(riskId),
      () => this.memStorage.getAssetsForRisk(riskId)
    );
  }
  
  async getRisksForAsset(assetId: string): Promise<Risk[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getRisksForAsset(assetId),
      () => this.memStorage.getRisksForAsset(assetId)
    );
  }
  
  async getRisksForControl(controlId: string): Promise<Risk[]> {
    return this.safeStorageCall(
      () => this.dbStorage.getRisksForControl(controlId),
      () => this.memStorage.getRisksForControl(controlId)
    );
  }
  
  async getControlEffectivenessForRisk(riskId: string): Promise<number> {
    return this.safeStorageCall(
      () => this.dbStorage.getControlEffectivenessForRisk(riskId),
      () => this.memStorage.getControlEffectivenessForRisk(riskId)
    );
  }
  
  async calculateRiskValues(riskId: string): Promise<{ 
    inherentRisk: number, 
    residualRisk: number, 
    monteCarloResults?: { mean: number; p10: number; p50: number; p90: number; max: number } 
  }> {
    return this.safeStorageCall(
      () => this.dbStorage.calculateRiskValues(riskId),
      () => this.memStorage.calculateRiskValues(riskId)
    );
  }
}