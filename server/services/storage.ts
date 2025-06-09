import {
  Asset,
  InsertAsset,
  Risk,
  InsertRisk,
  Control,
  InsertControl,
  RiskResponse,
  InsertRiskResponse,
  ActivityLog,
  InsertActivityLog,
  LegalEntity,
  InsertLegalEntity,
  RiskCalculationParams,
  assets,
  risks,
  controls,
  riskResponses,
  activityLogs,
  legalEntities,
  riskControls,
  riskCosts
} from "@shared/schema";
import { calculateRiskValues, calculateInherentRisk } from "@shared/utils/calculations";
import { db } from "../db";
import { eq, desc, inArray, sql, and } from "drizzle-orm";

// Interface for all storage operations
export interface IStorage {
  // Assets
  getAllAssets(): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetByAssetId(assetId: string): Promise<Asset | undefined>;
  getAssetsByIds(assetIds: string[]): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;

  // Risks
  getAllRisks(): Promise<Risk[]>;
  getRisk(id: number): Promise<Risk | undefined>;
  getRiskByRiskId(riskId: string): Promise<Risk | undefined>;
  getRisksForAsset(assetId: string): Promise<Risk[]>;
  createRisk(risk: InsertRisk): Promise<Risk>;
  updateRisk(id: number, risk: Partial<Risk>): Promise<Risk | undefined>;
  deleteRisk(id: number): Promise<boolean>;

  // Controls
  getAllControls(): Promise<Control[]>;
  getControl(id: number): Promise<Control | undefined>;
  getControlByControlId(controlId: string): Promise<Control | undefined>;
  createControl(control: InsertControl): Promise<Control>;
  updateControl(id: number, control: Partial<Control>): Promise<Control | undefined>;
  deleteControl(id: number): Promise<boolean>;

  // Risk Responses
  getAllRiskResponses(): Promise<RiskResponse[]>;
  getRiskResponse(id: number): Promise<RiskResponse | undefined>;
  getRiskResponseByRiskId(riskId: string): Promise<RiskResponse | undefined>;
  createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse>;
  updateRiskResponse(id: number, response: Partial<RiskResponse>): Promise<RiskResponse | undefined>;
  deleteRiskResponse(id: number): Promise<boolean>;

  // Activity Logs
  getAllActivityLogs(): Promise<ActivityLog[]>;
  getActivityLog(id: number): Promise<ActivityLog | undefined>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Legal Entities
  getAllLegalEntities(): Promise<LegalEntity[]>;
  getLegalEntity(id: number): Promise<LegalEntity | undefined>;
  getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined>;
  createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity>;
  updateLegalEntity(id: number, entity: Partial<LegalEntity>): Promise<LegalEntity | undefined>;
  deleteLegalEntity(id: number): Promise<boolean>;
  getAssetsForLegalEntity(entityId: string): Promise<Asset[]>;

  // Risk Library methods
  getAllRiskLibraryItems(): Promise<any[]>;
  getRiskLibraryItem(id: number): Promise<any | undefined>;
  createRiskLibraryItem(data: any): Promise<any>;
  
  // Control Library methods
  getAllControlLibraryItems(): Promise<any[]>;
  getControlLibraryItem(id: number): Promise<any | undefined>;
  createControlLibraryItem(data: any): Promise<any>;
  
  // Specialized methods
  getControlsForRisk(riskId: string): Promise<Control[]>;
  getAssetsForRisk(riskId: string): Promise<Asset[]>;
  getRisksForAsset(assetId: string): Promise<Risk[]>;
  getRisksForControl(controlId: string): Promise<Risk[]>;
  getControlEffectivenessForRisk(riskId: string): Promise<number>;
  calculateRiskValues(riskId: string): Promise<{ 
    inherentRisk: number, 
    residualRisk: number, 
    monteCarloResults?: { mean: number; p10: number; p50: number; p90: number; max: number } 
  }>;
}

export class MemStorage implements IStorage {
  private assets: Map<number, Asset>;
  private risks: Map<number, Risk>;
  private controls: Map<number, Control>;
  private riskResponses: Map<number, RiskResponse>;
  private activityLogs: Map<number, ActivityLog>;
  private legalEntities: Map<number, LegalEntity>;

  private assetId: number;
  private riskId: number;
  private controlId: number;
  private responseId: number;
  private logId: number;
  private entityId: number;

  constructor() {
    this.assets = new Map();
    this.risks = new Map();
    this.controls = new Map();
    this.riskResponses = new Map();
    this.activityLogs = new Map();
    this.legalEntities = new Map();

    this.assetId = 1;
    this.riskId = 1;
    this.controlId = 1;
    this.responseId = 1;
    this.logId = 1;
    this.entityId = 1;

    // Initialize with data from database
    this.initializeData();
  }
  
  // Legal Entities
  async getAllLegalEntities(): Promise<LegalEntity[]> {
    return Array.from(this.legalEntities.values());
  }

  async getLegalEntity(id: number): Promise<LegalEntity | undefined> {
    return this.legalEntities.get(id);
  }

  async getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined> {
    return Array.from(this.legalEntities.values()).find(entity => entity.entityId === entityId);
  }

  async createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity> {
    const id = this.entityId++;
    const timestamp = new Date();
    const newEntity: LegalEntity = { ...entity, id, createdAt: timestamp };
    this.legalEntities.set(id, newEntity);
    return newEntity;
  }

  async updateLegalEntity(id: number, entity: Partial<LegalEntity>): Promise<LegalEntity | undefined> {
    const existingEntity = this.legalEntities.get(id);
    if (!existingEntity) return undefined;

    const updatedEntity = { ...existingEntity, ...entity };
    this.legalEntities.set(id, updatedEntity);
    return updatedEntity;
  }

  async deleteLegalEntity(id: number): Promise<boolean> {
    return this.legalEntities.delete(id);
  }

  async getAssetsForLegalEntity(entityId: string): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => 
      asset.legalEntity === entityId);
  }

  // Assets
  async getAllAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.assetId === assetId);
  }
  
  async getAssetsByIds(assetIds: string[]): Promise<Asset[]> {
    if (!assetIds || assetIds.length === 0) {
      console.log("Warning: getAssetsByIds called with empty array in MemStorage");
      return [];
    }
    
    return Array.from(this.assets.values()).filter(asset => 
      assetIds.includes(asset.assetId)
    );
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const timestamp = new Date();
    const newAsset: Asset = { ...asset, id, createdAt: timestamp };
    this.assets.set(id, newAsset);
    return newAsset;
  }

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined> {
    const existingAsset = this.assets.get(id);
    if (!existingAsset) return undefined;

    const updatedAsset = { ...existingAsset, ...asset };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    // First, find the asset to get its assetId
    const asset = this.assets.get(id);
    if (!asset) return false;
    
    // Find all risks that reference this asset
    const assetId = asset.assetId;
    console.log(`Deleting asset ${assetId} (ID: ${id}) - updating associated risks...`);
    
    // Get all risks with this asset in associatedAssets
    const allRisks = await this.getAllRisks();
    const affectedRisks = allRisks.filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(assetId)
    );
    
    console.log(`Found ${affectedRisks.length} risks associated with asset ${assetId}`);
    
    // For each affected risk, remove this asset from associatedAssets and recalculate
    for (const risk of affectedRisks) {
      if (risk.id) {
        // Create a new associatedAssets array without the deleted asset
        const updatedAssets = risk.associatedAssets.filter(a => a !== assetId);
        console.log(`Updating risk ${risk.riskId}: removing asset ${assetId} from associations`);
        
        // Update the risk with the new associatedAssets array
        await this.updateRisk(risk.id, { 
          associatedAssets: updatedAssets 
        });
        
        // Recalculate risk values
        await this.calculateRiskValues(risk.riskId);
      }
    }
    
    // Now delete the asset
    return this.assets.delete(id);
  }

  // Risks
  async getAllRisks(): Promise<Risk[]> {
    return Array.from(this.risks.values());
  }

  async getRisk(id: number): Promise<Risk | undefined> {
    return this.risks.get(id);
  }

  async getRiskByRiskId(riskId: string): Promise<Risk | undefined> {
    return Array.from(this.risks.values()).find(risk => risk.riskId === riskId);
  }

  async createRisk(risk: InsertRisk): Promise<Risk> {
    const id = this.riskId++;
    const timestamp = new Date();
    
    // Use the new Monte Carlo risk calculator with FAIR v3.0 parameters
    const results = await calculateRiskValues(risk, 0); // Start with zero resistance (no controls)
    
    const newRisk: Risk = { 
      ...risk, 
      id, 
      createdAt: timestamp,
      updatedAt: timestamp,
      inherentRisk: results.inherentRisk.toString(),
      residualRisk: results.residualRisk.toString()
    };
    
    this.risks.set(id, newRisk);
    return newRisk;
  }

  async updateRisk(id: number, risk: Partial<Risk>): Promise<Risk | undefined> {
    const existingRisk = this.risks.get(id);
    if (!existingRisk) return undefined;

    const updatedRisk = { 
      ...existingRisk, 
      ...risk, 
      updatedAt: new Date() 
    };
    
    // If risk calculation parameters updated, recalculate inherent and residual risk
    if (risk.contactFrequencyMin !== undefined || 
        risk.contactFrequencyAvg !== undefined ||
        risk.contactFrequencyMax !== undefined ||
        risk.probabilityOfActionMin !== undefined ||
        risk.probabilityOfActionAvg !== undefined || 
        risk.probabilityOfActionMax !== undefined ||
        risk.threatCapabilityMin !== undefined ||
        risk.threatCapabilityAvg !== undefined ||
        risk.threatCapabilityMax !== undefined ||
        risk.resistanceStrengthMin !== undefined ||
        risk.resistanceStrengthAvg !== undefined ||
        risk.resistanceStrengthMax !== undefined ||
        risk.primaryLossMagnitudeMin !== undefined ||
        risk.primaryLossMagnitudeAvg !== undefined ||
        risk.primaryLossMagnitudeMax !== undefined ||
        risk.secondaryLossEventFrequencyMin !== undefined ||
        risk.secondaryLossEventFrequencyAvg !== undefined ||
        risk.secondaryLossEventFrequencyMax !== undefined ||
        risk.secondaryLossMagnitudeMin !== undefined ||
        risk.secondaryLossMagnitudeAvg !== undefined ||
        risk.secondaryLossMagnitudeMax !== undefined) {
      
      // Just use the inherent and residual risk values sent from client directly
      console.log("Risk parameters updated, using client-calculated risk values:", {
        inherentRisk: risk.inherentRisk,
        residualRisk: risk.residualRisk
      });
      
      // We no longer need to calculate risks here as they're properly calculated on the client
      // and passed to us with the request
    }
    
    // Always make sure to use the inherentRisk and residualRisk values from the request
    if (risk.inherentRisk !== undefined) {
      console.log("Using client inherent risk value:", risk.inherentRisk);
      updatedRisk.inherentRisk = risk.inherentRisk;
    }
    
    if (risk.residualRisk !== undefined) {
      console.log("Using client residual risk value:", risk.residualRisk);
      updatedRisk.residualRisk = risk.residualRisk;
    }
    
    this.risks.set(id, updatedRisk);
    return updatedRisk;
  }

  async deleteRisk(id: number): Promise<boolean> {
    return this.risks.delete(id);
  }

  // Controls
  async getAllControls(): Promise<Control[]> {
    return Array.from(this.controls.values());
  }

  async getControl(id: number): Promise<Control | undefined> {
    return this.controls.get(id);
  }

  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    return Array.from(this.controls.values()).find(control => control.controlId === controlId);
  }

  async createControl(control: InsertControl): Promise<Control> {
    const id = this.controlId++;
    const timestamp = new Date();
    const newControl: Control = { 
      ...control, 
      id, 
      createdAt: timestamp,
      updatedAt: timestamp 
    };
    
    this.controls.set(id, newControl);
    
    // Update residual risk for associated risks
    if (control.associatedRisks && control.associatedRisks.length > 0) {
      for (const riskId of control.associatedRisks) {
        const risk = await this.getRiskByRiskId(riskId);
        if (risk) {
          await this.calculateRiskValues(riskId);
        }
      }
    }
    
    return newControl;
  }

  async updateControl(id: number, control: Partial<Control>): Promise<Control | undefined> {
    const existingControl = this.controls.get(id);
    if (!existingControl) return undefined;

    const updatedControl = { 
      ...existingControl, 
      ...control, 
      updatedAt: new Date() 
    };
    
    this.controls.set(id, updatedControl);
    
    // Update residual risk for associated risks if control effectiveness changes
    if (control.controlEffectiveness !== undefined || 
        control.implementationStatus !== undefined ||
        control.associatedRisks !== undefined) {
      
      const riskIds = updatedControl.associatedRisks || [];
      for (const riskId of riskIds) {
        await this.calculateRiskValues(riskId);
      }
    }
    
    return updatedControl;
  }

  async deleteControl(id: number): Promise<boolean> {
    const control = this.controls.get(id);
    if (!control) return false;
    
    // Before deleting, update residual risks
    if (control.associatedRisks && control.associatedRisks.length > 0) {
      for (const riskId of control.associatedRisks) {
        const risk = await this.getRiskByRiskId(riskId);
        if (risk) {
          const riskControls = (await this.getControlsForRisk(riskId)).filter(c => c.id !== id);
          const resistance = riskControls.length > 0 
            ? Math.max(...riskControls.map(c => c.controlEffectiveness))
            : 0;
          
          if (risk.id) {
            // Use the new Monte Carlo risk calculator
            const results = await calculateRiskValues(risk, resistance);
            await this.updateRisk(risk.id, {
              residualRisk: results.residualRisk.toString()
            });
          }
        }
      }
    }
    
    return this.controls.delete(id);
  }

  // Risk Responses
  async getAllRiskResponses(): Promise<RiskResponse[]> {
    return Array.from(this.riskResponses.values());
  }

  async getRiskResponse(id: number): Promise<RiskResponse | undefined> {
    return this.riskResponses.get(id);
  }

  async getRiskResponseByRiskId(riskId: string): Promise<RiskResponse | undefined> {
    return Array.from(this.riskResponses.values()).find(response => response.riskId === riskId);
  }

  async createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse> {
    const id = this.responseId++;
    const timestamp = new Date();
    const newResponse: RiskResponse = { 
      ...response, 
      id, 
      createdAt: timestamp,
      updatedAt: timestamp 
    };
    
    this.riskResponses.set(id, newResponse);
    return newResponse;
  }

  async updateRiskResponse(id: number, response: Partial<RiskResponse>): Promise<RiskResponse | undefined> {
    const existingResponse = this.riskResponses.get(id);
    if (!existingResponse) return undefined;

    const updatedResponse = { 
      ...existingResponse, 
      ...response, 
      updatedAt: new Date() 
    };
    
    this.riskResponses.set(id, updatedResponse);
    return updatedResponse;
  }

  async deleteRiskResponse(id: number): Promise<boolean> {
    return this.riskResponses.delete(id);
  }

  // Activity Logs
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    return this.activityLogs.get(id);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.logId++;
    const timestamp = new Date();
    const newLog: ActivityLog = { ...log, id, createdAt: timestamp };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  // Specialized methods
  async getControlsForRisk(riskId: string): Promise<Control[]> {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk) return [];
    
    const allControls = await this.getAllControls();
    return allControls.filter(control => 
      control.associatedRisks && control.associatedRisks.includes(riskId)
    );
  }

  async getAssetsForRisk(riskId: string): Promise<Asset[]> {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk || !risk.associatedAssets || risk.associatedAssets.length === 0) {
      return [];
    }
    
    const assets: Asset[] = [];
    for (const assetId of risk.associatedAssets) {
      const asset = await this.getAssetByAssetId(assetId);
      if (asset) {
        assets.push(asset);
      }
    }
    
    return assets;
  }
  
  async getRisksForAsset(assetId: string): Promise<Risk[]> {
    return (await this.getAllRisks()).filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(assetId)
    );
  }
  
  async getRisksForControl(controlId: string): Promise<Risk[]> {
    const control = await this.getControlByControlId(controlId);
    if (!control || !control.associatedRisks || control.associatedRisks.length === 0) {
      return [];
    }
    
    const risks: Risk[] = [];
    for (const riskId of control.associatedRisks) {
      const risk = await this.getRiskByRiskId(riskId);
      if (risk) {
        risks.push(risk);
      }
    }
    
    return risks;
  }
  
  async getControlEffectivenessForRisk(riskId: string): Promise<number> {
    const controls = await this.getControlsForRisk(riskId);
    
    if (controls.length === 0) {
      return 0;
    }
    
    // Get the most effective control for resistance calculation (FAIR v3.0 approach)
    const maxEffectiveness = Math.max(...controls.map(c => c.controlEffectiveness));
    return maxEffectiveness;
  }
  
  async calculateRiskValues(riskId: string): Promise<{ 
    inherentRisk: number, 
    residualRisk: number, 
    monteCarloResults?: { mean: number; p10: number; p50: number; p90: number; max: number } 
  }> {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk) {
      throw new Error(`Risk with ID ${riskId} not found`);
    }
    
    const resistance = await this.getControlEffectivenessForRisk(riskId);
    console.log(`Calculating risk values for ${riskId} with resistance ${resistance}`);
    
    // Use the new Monte Carlo risk calculator (from shared/utils/calculations.ts)
    const results = await calculateRiskValues(risk, resistance);
    
    if (risk.id) {
      await this.updateRisk(risk.id, {
        inherentRisk: results.inherentRisk.toString(),
        residualRisk: results.residualRisk.toString()
      });
    }
    
    return results;
  }
  
  // Risk Library methods
  async getAllRiskLibraryItems(): Promise<any[]> {
    return Array.from(this.risks.values()).filter(risk => 
      risk.itemType === "template"
    );
  }
  
  async getRiskLibraryItem(id: number): Promise<any | undefined> {
    const item = this.risks.get(id);
    return item && item.itemType === "template" ? item : undefined;
  }
  
  async createRiskLibraryItem(data: any): Promise<any> {
    const id = this.riskId++;
    const timestamp = new Date();
    const newItem = { 
      ...data, 
      id, 
      createdAt: timestamp,
      itemType: "template"
    };
    this.risks.set(id, newItem);
    return newItem;
  }
  
  // Control Library methods
  async getAllControlLibraryItems(): Promise<any[]> {
    return Array.from(this.controls.values()).filter(control => 
      control.itemType === "template"
    );
  }
  
  async getControlLibraryItem(id: number): Promise<any | undefined> {
    const item = this.controls.get(id);
    return item && item.itemType === "template" ? item : undefined;
  }
  
  async createControlLibraryItem(data: any): Promise<any> {
    const id = this.controlId++;
    const timestamp = new Date();
    const newItem = { 
      ...data, 
      id, 
      createdAt: timestamp,
      itemType: "template"
    };
    this.controls.set(id, newItem);
    return newItem;
  }

  // Initialize with data from the database
  private async initializeData() {
    console.log("MemStorage initialized - loading data from database only");
    
    try {
      // Attempt to load data from the database where possible
      const dbAssets = await db.select().from(assets);
      if (dbAssets && dbAssets.length > 0) {
        console.log(`Loaded ${dbAssets.length} assets from the database`);
        dbAssets.forEach(asset => {
          this.assets.set(asset.id, asset);
          // Update counter to be higher than max id
          if (asset.id >= this.assetId) {
            this.assetId = asset.id + 1;
          }
        });
      }
      
      const dbRisks = await db.select().from(risks);
      if (dbRisks && dbRisks.length > 0) {
        console.log(`Loaded ${dbRisks.length} risks from the database`);
        dbRisks.forEach(risk => {
          this.risks.set(risk.id, risk);
          // Update counter to be higher than max id
          if (risk.id >= this.riskId) {
            this.riskId = risk.id + 1;
          }
        });
      }
      
      const dbControls = await db.select().from(controls);
      if (dbControls && dbControls.length > 0) {
        console.log(`Loaded ${dbControls.length} controls from the database`);
        dbControls.forEach(control => {
          this.controls.set(control.id, control);
          // Update counter to be higher than max id
          if (control.id >= this.controlId) {
            this.controlId = control.id + 1;
          }
        });
      }
      
      const dbLegalEntities = await db.select().from(legalEntities);
      if (dbLegalEntities && dbLegalEntities.length > 0) {
        console.log(`Loaded ${dbLegalEntities.length} legal entities from the database`);
        dbLegalEntities.forEach(entity => {
          this.legalEntities.set(entity.id, entity);
          // Update counter to be higher than max id
          if (entity.id >= this.entityId) {
            this.entityId = entity.id + 1;
          }
        });
      }
      
      const dbRiskResponses = await db.select().from(riskResponses);
      if (dbRiskResponses && dbRiskResponses.length > 0) {
        console.log(`Loaded ${dbRiskResponses.length} risk responses from the database`);
        dbRiskResponses.forEach(response => {
          this.riskResponses.set(response.id, response);
          // Update counter to be higher than max id
          if (response.id >= this.responseId) {
            this.responseId = response.id + 1;
          }
        });
      }
      
      const dbActivityLogs = await db.select().from(activityLogs);
      if (dbActivityLogs && dbActivityLogs.length > 0) {
        console.log(`Loaded ${dbActivityLogs.length} activity logs from the database`);
        dbActivityLogs.forEach(log => {
          this.activityLogs.set(log.id, log);
          // Update counter to be higher than max id
          if (log.id >= this.logId) {
            this.logId = log.id + 1;
          }
        });
      }
    } catch (error) {
      console.error("Error loading data from database:", error);
    }
  }
}

export class DatabaseStorage implements IStorage {
  async getAllAssets(): Promise<Asset[]> {
    return await db.select().from(assets);
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    try {
      if (isNaN(id)) {
        console.error("Invalid asset ID (NaN) provided to getAsset");
        return undefined;
      }
      const [asset] = await db.select().from(assets).where(eq(assets.id, id));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by id:", error);
      throw error;
    }
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    try {
      const [asset] = await db.select().from(assets).where(eq(assets.assetId, assetId));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by assetId:", error);
      throw error;
    }
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined> {
    const [updatedAsset] = await db
      .update(assets)
      .set(asset)
      .where(eq(assets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    await db.delete(assets).where(eq(assets.id, id));
    return true;
  }

  async getAllRisks(): Promise<Risk[]> {
    return await db.select().from(risks);
  }

  async getRisk(id: number): Promise<Risk | undefined> {
    const [risk] = await db.select().from(risks).where(eq(risks.id, id));
    return risk;
  }

  async getRiskByRiskId(riskId: string): Promise<Risk | undefined> {
    const [risk] = await db.select().from(risks).where(eq(risks.riskId, riskId));
    return risk;
  }

  async createRisk(risk: InsertRisk): Promise<Risk> {
    const [newRisk] = await db.insert(risks).values(risk).returning();
    return newRisk;
  }

  async updateRisk(id: number, risk: Partial<Risk>): Promise<Risk | undefined> {
    const [updatedRisk] = await db
      .update(risks)
      .set(risk)
      .where(eq(risks.id, id))
      .returning();
    return updatedRisk;
  }

  async deleteRisk(id: number): Promise<boolean> {
    try {
      console.log(`DatabaseStorage.deleteRisk: Deleting risk with ID ${id}`);
      
      // First, check if the risk exists
      const risk = await this.getRisk(id);
      if (!risk) {
        console.log(`Risk with ID ${id} not found, cannot delete.`);
        return false;
      }

      console.log(`Found risk: ${JSON.stringify(risk)}`);
      
      // We need to delete records from several tables to handle foreign key constraints
      // Step 1: Delete any risk responses associated with this risk
      try {
        // Using risk.riskId (string ID) since risk_responses references the riskId field
        await db.delete(riskResponses)
          .where(eq(riskResponses.riskId, risk.riskId))
          .execute();
        console.log(`Deleted risk responses for risk ${risk.riskId}`);
      } catch (error) {
        console.error(`Error deleting risk responses for risk ${risk.riskId}:`, error);
        // Continue with deletion even if this fails
      }
      
      // Step 2: Delete any risk-control mappings
      try {
        // The risk_controls table uses the numeric ID (id) not the string ID (riskId)
        // First, try using the ORM to delete
        await db.delete(riskControls)
          .where(eq(riskControls.riskId, id))
          .execute();
        console.log(`Deleted risk-control mappings for risk ID ${id}`);
        
        // Double-check with direct SQL to ensure deletion
        await db.execute(sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-control mappings for risk ID ${id}:`, error);
        // Try direct SQL as fallback
        try {
          await db.execute(sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-control mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-control mappings failed:`, fallbackError);
        }
      }
      
      // Step 3: Delete any risk-cost mappings
      try {
        // The risk_costs table uses the numeric ID (id) not the string ID (riskId)
        // First, try using the ORM to delete
        await db.delete(riskCosts)
          .where(eq(riskCosts.riskId, id))
          .execute();
        console.log(`Deleted risk-cost mappings for risk ID ${id}`);
        
        // Double-check with direct SQL to ensure deletion
        await db.execute(sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-cost mappings for risk ID ${id}:`, error);
        // Try direct SQL as fallback
        try {
          await db.execute(sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-cost mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-cost mappings failed:`, fallbackError);
        }
      }
      
      // Step 4: Now we can delete the risk itself
      console.log(`Attempting to delete the risk record with ID ${id}`);
      
      // Skip the ORM and use direct SQL for guaranteed removal
      try {
        console.log(`Using direct SQL for risk deletion to ensure success`);
        
        // Delete the risk using raw SQL - this bypasses any ORM issues
        await db.execute(sql`DELETE FROM risks WHERE id = ${id}`);
        console.log(`Direct SQL deletion executed for risk ID ${id}`);
        
        // Also try to delete by risk_id just to be thorough
        if (risk && risk.riskId) {
          await db.execute(sql`DELETE FROM risks WHERE risk_id = ${risk.riskId}`);
          console.log(`Also attempted deletion by risk_id = ${risk.riskId}`);
        }
        
        // Verify the risk is truly gone from the database
        const verifyCheck = await db.execute(sql`SELECT id FROM risks WHERE id = ${id}`);
        const rows = verifyCheck.rows || [];
        const isDeleted = rows.length === 0;
        
        console.log(`Risk deletion verification: Risk ${id} is ${isDeleted ? 'DELETED' : 'STILL PRESENT'}`);
        return isDeleted;
      } catch (deleteError) {
        console.error(`Error during risk deletion for ID ${id}:`, deleteError);
        throw deleteError;
      }
    } catch (error) {
      console.error(`Error in deleteRisk(${id}):`, error);
      throw error;
    }
  }

  async getAllControls(): Promise<Control[]> {
    return await db.select().from(controls);
  }

  async getControl(id: number): Promise<Control | undefined> {
    const [control] = await db.select().from(controls).where(eq(controls.id, id));
    return control;
  }

  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    const [control] = await db
      .select()
      .from(controls)
      .where(eq(controls.controlId, controlId));
    return control;
  }

  async createControl(control: InsertControl): Promise<Control> {
    const [newControl] = await db.insert(controls).values(control).returning();
    return newControl;
  }

  async updateControl(id: number, control: Partial<Control>): Promise<Control | undefined> {
    const [updatedControl] = await db
      .update(controls)
      .set(control)
      .where(eq(controls.id, id))
      .returning();
    return updatedControl;
  }

  async deleteControl(id: number): Promise<boolean> {
    await db.delete(controls).where(eq(controls.id, id));
    return true;
  }

  async getAllRiskResponses(): Promise<RiskResponse[]> {
    return await db.select().from(riskResponses);
  }

  async getRiskResponse(id: number): Promise<RiskResponse | undefined> {
    const [response] = await db
      .select()
      .from(riskResponses)
      .where(eq(riskResponses.id, id));
    return response;
  }

  async getRiskResponseByRiskId(riskId: string): Promise<RiskResponse | undefined> {
    const [response] = await db
      .select()
      .from(riskResponses)
      .where(eq(riskResponses.riskId, riskId));
    return response;
  }

  async createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse> {
    const [newResponse] = await db
      .insert(riskResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async updateRiskResponse(
    id: number,
    response: Partial<RiskResponse>
  ): Promise<RiskResponse | undefined> {
    const [updatedResponse] = await db
      .update(riskResponses)
      .set(response)
      .where(eq(riskResponses.id, id))
      .returning();
    return updatedResponse;
  }

  async deleteRiskResponse(id: number): Promise<boolean> {
    await db.delete(riskResponses).where(eq(riskResponses.id, id));
    return true;
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt));
  }

  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    const [log] = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.id, id));
    return log;
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  async getAllLegalEntities(): Promise<LegalEntity[]> {
    return await db.select().from(legalEntities);
  }

  async getLegalEntity(id: number): Promise<LegalEntity | undefined> {
    const [entity] = await db
      .select()
      .from(legalEntities)
      .where(eq(legalEntities.id, id));
    return entity;
  }

  async getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined> {
    const [entity] = await db
      .select()
      .from(legalEntities)
      .where(eq(legalEntities.entityId, entityId));
    return entity;
  }

  async createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity> {
    const [newEntity] = await db
      .insert(legalEntities)
      .values(entity)
      .returning();
    return newEntity;
  }

  async updateLegalEntity(
    id: number,
    entity: Partial<LegalEntity>
  ): Promise<LegalEntity | undefined> {
    const [updatedEntity] = await db
      .update(legalEntities)
      .set(entity)
      .where(eq(legalEntities.id, id))
      .returning();
    return updatedEntity;
  }

  async deleteLegalEntity(id: number): Promise<boolean> {
    await db.delete(legalEntities).where(eq(legalEntities.id, id));
    return true;
  }

  async getAssetsForLegalEntity(entityId: string): Promise<Asset[]> {
    return await db
      .select()
      .from(assets)
      .where(eq(assets.legalEntity, entityId));
  }

  async getControlsForRisk(riskId: string): Promise<Control[]> {
    const allControls = await this.getAllControls();
    return allControls.filter(control => 
      control.associatedRisks && control.associatedRisks.includes(riskId)
    );
  }

  async getAssetsForRisk(riskId: string): Promise<Asset[]> {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk || !risk.associatedAssets || risk.associatedAssets.length === 0) {
      return [];
    }
    
    return await db
      .select()
      .from(assets)
      .where(inArray(assets.assetId, risk.associatedAssets));
  }
  
  async getRisksForAsset(assetId: string): Promise<Risk[]> {
    const allRisks = await this.getAllRisks();
    return allRisks.filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(assetId)
    );
  }
  
  async getRisksForControl(controlId: string): Promise<Risk[]> {
    const control = await this.getControlByControlId(controlId);
    if (!control || !control.associatedRisks || control.associatedRisks.length === 0) {
      return [];
    }
    
    const risks: Risk[] = [];
    for (const riskId of control.associatedRisks) {
      const risk = await this.getRiskByRiskId(riskId);
      if (risk) {
        risks.push(risk);
      }
    }
    
    return risks;
  }
  
  async getControlEffectivenessForRisk(riskId: string): Promise<number> {
    const controls = await this.getControlsForRisk(riskId);
    
    if (controls.length === 0) {
      return 0;
    }
    
    // Get the most effective control for resistance calculation (FAIR v3.0 approach)
    const maxEffectiveness = Math.max(...controls.map(c => c.controlEffectiveness));
    return maxEffectiveness;
  }

  async calculateRiskValues(riskId: string): Promise<{
    inherentRisk: number;
    residualRisk: number;
    monteCarloResults?: {
      mean: number;
      p10: number;
      p50: number;
      p90: number;
      max: number;
    };
  }> {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk) {
      throw new Error(`Risk with ID ${riskId} not found`);
    }

    const resistance = await this.getControlEffectivenessForRisk(riskId);
    const results = await calculateRiskValues(risk, resistance);

    if (risk.id) {
      await this.updateRisk(risk.id, {
        inherentRisk: results.inherentRisk.toString(),
        residualRisk: results.residualRisk.toString(),
      });
    }

    return results;
  }

  async recalculateRiskSummaries(): Promise<void> {
    console.log('Risk summaries recalculation requested - placeholder implementation');
  }
}

// Always use the DatabaseStorage to make sure we're using the database
export const storage = new DatabaseStorage();