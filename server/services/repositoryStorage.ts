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
  assets,
  risks,
  controls,
  riskResponses,
  activityLogs,
  legalEntities,
  riskControls,
  riskSummaries,
  InsertRiskSummary,
  controlLibrary,
  riskLibrary,
  assetRelationships,
  vulnerabilityAssets
} from "@shared/schema";
import { db } from "../db";
import { eq, desc, inArray, sql, and, or, isNull } from "drizzle-orm";

/**
 * DatabaseStorage class that focuses solely on database access operations
 * No business logic, risk calculations or cascade effects - these are handled by service classes
 */
export class DatabaseStorage {
  /**
   * ASSET REPOSITORY METHODS
   */
  
  async getAllAssets(): Promise<Asset[]> {
    return db.select().from(assets);
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.assetId, assetId));
    return asset;
  }

  async getAssetsByIds(assetIds: string[]): Promise<Asset[]> {
    // Safeguard against empty arrays which would cause SQL errors
    if (!assetIds || assetIds.length === 0) {
      console.log("Warning: getAssetsByIds called with empty array");
      return [];
    }
    
    // Log the asset IDs being requested for debugging
    console.log(`Looking up assets by IDs: ${assetIds.join(', ')}`);
    
    const fetchedAssets = await db.select().from(assets).where(inArray(assets.assetId, assetIds));
    console.log(`Found ${fetchedAssets.length} assets matching the IDs`);
    
    // Process assets to ensure all numeric values (especially assetValue) are properly handled
    return fetchedAssets.map(asset => {
      // Convert any string values to numbers - handle both regular and formatted (with commas) values
      let numericAssetValue = 0;
      
      if (typeof asset.assetValue === 'number') {
        numericAssetValue = asset.assetValue;
      } else if (typeof asset.assetValue === 'string') {
        // Remove any non-numeric characters except decimal point
        const cleanValue = asset.assetValue.replace(/[^0-9.-]/g, '');
        numericAssetValue = parseFloat(cleanValue);
      }
      
      // Ensure it's not NaN
      if (isNaN(numericAssetValue)) {
        numericAssetValue = 0;
      }
      
      console.log(`Processed asset ${asset.assetId} with value: ${numericAssetValue}`);
      
      return {
        ...asset,
        assetValue: numericAssetValue,
        // Also ensure we have a value field for legacy compatibility
        value: numericAssetValue
      };
    });
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [createdAsset] = await db.insert(assets).values(asset).returning();
    return createdAsset;
  }

  async updateAsset(id: number, data: Partial<Asset>): Promise<Asset | undefined> {
    const [updatedAsset] = await db
      .update(assets)
      .set(data)
      .where(eq(assets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteAsset(id: number): Promise<boolean> {
    await db.delete(assets).where(eq(assets.id, id));
    return true;
  }

  async deleteAssetWithCascade(id: number): Promise<boolean> {
    // Get the asset to find its assetId
    const asset = await this.getAsset(id);
    if (!asset) {
      return false;
    }

    console.log(`Starting cascade deletion for asset ${asset.assetId} (ID: ${id})`);

    try {
      // Step 1: Find all risks associated with this asset
      const allRisks = await db.select().from(risks);
      const affectedRisks = allRisks.filter(risk => 
        risk.associatedAssets && risk.associatedAssets.includes(asset.assetId)
      );

      console.log(`Found ${affectedRisks.length} risks associated with asset ${asset.assetId}`);

      // Step 2: For each affected risk, remove the asset reference or delete the risk if it becomes orphaned
      for (const risk of affectedRisks) {
        const updatedAssets = risk.associatedAssets.filter(a => a !== asset.assetId);
        
        if (updatedAssets.length === 0) {
          // Risk has no more assets - delete the risk and its dependencies
          console.log(`Risk ${risk.riskId} has no remaining assets - deleting risk and dependencies`);
          
          // Delete risk-control relationships
          await db.delete(riskControls).where(eq(riskControls.riskId, risk.id));
          
          // Delete risk responses
          await db.delete(riskResponses).where(eq(riskResponses.riskId, risk.riskId));
          
          // Delete risk costs using SQL query since table uses snake_case naming
          await db.execute(sql`DELETE FROM risk_costs WHERE risk_id = ${risk.id}`);
          
          // Delete the risk itself
          await db.delete(risks).where(eq(risks.id, risk.id));
          
          console.log(`Deleted risk ${risk.riskId} and all its dependencies`);
        } else {
          // Update the risk to remove the asset reference
          await db.update(risks)
            .set({ associatedAssets: updatedAssets })
            .where(eq(risks.id, risk.id));
          
          console.log(`Updated risk ${risk.riskId} - removed asset ${asset.assetId} from associations`);
        }
      }

      // Step 3: Delete asset relationships
      await db.delete(assetRelationships)
        .where(or(
          eq(assetRelationships.sourceAssetId, id),
          eq(assetRelationships.targetAssetId, id)
        ));

      console.log(`Deleted asset relationships for asset ${asset.assetId}`);

      // Step 4: Update vulnerability_assets table if it exists
      try {
        await db.delete(vulnerabilityAssets).where(eq(vulnerabilityAssets.assetId, id));
        console.log(`Deleted vulnerability associations for asset ${asset.assetId}`);
      } catch (error) {
        // Vulnerability table might not exist or be empty - continue
        console.log(`No vulnerability associations to delete for asset ${asset.assetId}`);
      }

      // Step 5: Delete the asset itself
      await db.delete(assets).where(eq(assets.id, id));
      console.log(`Deleted asset ${asset.assetId} (ID: ${id})`);

      // Step 6: Update risk summaries to reflect the changes
      try {
        const { riskSummaryService } = await import('./riskSummaryService');
        await riskSummaryService.updateRiskSummaries();
        console.log(`Updated risk summaries after asset deletion`);
      } catch (error) {
        console.error(`Failed to update risk summaries:`, error);
      }

      // Step 7: Log the cascade deletion activity
      await this.createActivityLog({
        activity: 'cascade_delete',
        user: 'System User',
        entity: `Asset ${asset.assetId}`,
        entityType: 'asset',
        entityId: id.toString()
      });

      console.log(`Completed cascade deletion for asset ${asset.assetId}`);
      return true;

    } catch (error) {
      console.error(`Error during cascade deletion of asset ${asset.assetId}:`, error);
      throw error;
    }
  }

  /**
   * RISK REPOSITORY METHODS
   */
  
  async getAllRisks(): Promise<Risk[]> {
    return db.select().from(risks);
  }

  async getRisksByIds(ids: number[]): Promise<Risk[]> {
    return db.select().from(risks).where(inArray(risks.id, ids));
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
    const [createdRisk] = await db.insert(risks).values(risk).returning();
    return createdRisk;
  }

  async updateRisk(id: number, data: Partial<Risk>): Promise<Risk | undefined> {
    const [updatedRisk] = await db
      .update(risks)
      .set(data)
      .where(eq(risks.id, id))
      .returning();
    
    return updatedRisk;
  }

  async deleteRisk(id: number): Promise<boolean> {
    await db.delete(risks).where(eq(risks.id, id));
    
    // Trigger risk summary update after deletion
    try {
      const { riskSummaryService } = await import('./riskSummaryService');
      await riskSummaryService.updateRiskSummaries();
      console.log('Risk summaries updated after risk deletion (database layer)');
    } catch (error) {
      console.error('Error updating risk summaries after deletion (database layer):', error);
    }
    
    return true;
  }

  /**
   * CONTROL REPOSITORY METHODS
   */
  
  async getAllControls(): Promise<Control[]> {
    return db.select().from(controls);
  }

  async getControlsByIds(ids: number[]): Promise<Control[]> {
    return db.select().from(controls).where(inArray(controls.id, ids));
  }

  async getControl(id: number): Promise<Control | undefined> {
    const [control] = await db.select().from(controls).where(eq(controls.id, id));
    return control;
  }

  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    const [control] = await db.select().from(controls).where(eq(controls.controlId, controlId));
    return control;
  }

  async createControl(control: InsertControl): Promise<Control> {
    const [createdControl] = await db.insert(controls).values(control).returning();
    return createdControl;
  }

  async updateControl(id: number, data: Partial<Control>): Promise<Control | undefined> {
    console.log("Updating control with data:", data);
    
    // Create an object with only the fields that exist in the database
    const validData: any = {};
    
    // Map fields to their database column names
    if (data.controlEffectiveness !== undefined) validData.controlEffectiveness = data.controlEffectiveness;
    
    // Handle FAIR methodology effectiveness fields (using camelCase names from schema)
    if ((data as any).eAvoid !== undefined) validData.eAvoid = (data as any).eAvoid;
    if ((data as any).eDeter !== undefined) validData.eDeter = (data as any).eDeter;
    if ((data as any).eDetect !== undefined) validData.eDetect = (data as any).eDetect;
    if ((data as any).eResist !== undefined) validData.eResist = (data as any).eResist;
    if ((data as any).varFreq !== undefined) validData.varFreq = (data as any).varFreq;
    if ((data as any).varDuration !== undefined) validData.varDuration = (data as any).varDuration;
    
    // Other fields that might be updated
    if (data.name !== undefined) validData.name = data.name;
    if (data.description !== undefined) validData.description = data.description;
    if (data.controlId !== undefined) validData.controlId = data.controlId;
    if (data.controlType !== undefined) validData.controlType = data.controlType;
    if (data.controlCategory !== undefined) validData.controlCategory = data.controlCategory;
    if (data.implementationStatus !== undefined) validData.implementationStatus = data.implementationStatus;
    if (data.implementationCost !== undefined) validData.implementationCost = data.implementationCost;
    if (data.costPerAgent !== undefined) validData.costPerAgent = data.costPerAgent;
    if (data.isPerAgentPricing !== undefined) validData.isPerAgentPricing = data.isPerAgentPricing;
    if (data.deployedAgentCount !== undefined) validData.deployedAgentCount = data.deployedAgentCount;
    if (data.notes !== undefined) validData.notes = data.notes;
    if (data.associatedRisks !== undefined) validData.associatedRisks = data.associatedRisks;
    
    console.log("Filtered valid data for update:", validData);
    
    if (Object.keys(validData).length === 0) {
      console.error("No valid data provided for update");
      return undefined;
    }
    
    const [updatedControl] = await db
      .update(controls)
      .set(validData)
      .where(eq(controls.id, id))
      .returning();
      
    return updatedControl;
  }

  async deleteControl(id: number): Promise<boolean> {
    // Delete only from the controls table, not affecting control_library
    await db.delete(controls).where(eq(controls.id, id));
    return true;
  }
  
  /**
   * CONTROL LIBRARY REPOSITORY METHODS
   */
  
  async getAllControlLibraryItems(): Promise<any[]> {
    return db.select().from(controlLibrary);
  }
  
  async getControlLibraryItem(id: number): Promise<any | undefined> {
    const [template] = await db.select().from(controlLibrary).where(eq(controlLibrary.id, id));
    return template;
  }
  
  async createControlLibraryItem(item: any): Promise<any> {
    const [createdItem] = await db.insert(controlLibrary).values(item).returning();
    return createdItem;
  }
  
  async updateControlLibraryItem(id: number, data: any): Promise<any | undefined> {
    const [updatedItem] = await db
      .update(controlLibrary)
      .set(data)
      .where(eq(controlLibrary.id, id))
      .returning();
    return updatedItem;
  }
  
  async deleteControlLibraryItem(id: number): Promise<boolean> {
    await db.delete(controlLibrary).where(eq(controlLibrary.id, id));
    return true;
  }

  /**
   * RISK RESPONSE REPOSITORY METHODS
   */
  
  async getAllRiskResponses(): Promise<RiskResponse[]> {
    return db.select().from(riskResponses);
  }

  async getRiskResponse(id: number): Promise<RiskResponse | undefined> {
    const [response] = await db.select().from(riskResponses).where(eq(riskResponses.id, id));
    return response;
  }

  async getRiskResponsesForRisk(riskId: string): Promise<RiskResponse[]> {
    return db.select().from(riskResponses).where(eq(riskResponses.riskId, riskId));
  }

  async createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse> {
    const [createdResponse] = await db.insert(riskResponses).values(response).returning();
    return createdResponse;
  }

  async updateRiskResponse(id: number, data: Partial<RiskResponse>): Promise<RiskResponse | undefined> {
    const [updatedResponse] = await db
      .update(riskResponses)
      .set(data)
      .where(eq(riskResponses.id, id))
      .returning();
    return updatedResponse;
  }

  async deleteRiskResponse(id: number): Promise<boolean> {
    await db.delete(riskResponses).where(eq(riskResponses.id, id));
    return true;
  }

  /**
   * ACTIVITY LOG REPOSITORY METHODS
   */
  
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    // Map to both old and new schema fields for compatibility
    const processedLog = {
      // New schema fields
      action: log.action || 'system_action',
      entityType: log.entityType || 'unknown',
      entityId: log.entityId || '',
      userId: log.userId || 1,
      details: log.details || null,
      createdAt: log.createdAt || new Date(),
      // Old schema fields for compatibility (required by database)
      activity: log.action || 'system_action',
      user: 'System User',
      entity: typeof log.details === 'object' && log.details?.message ? log.details.message : (log.entityType || 'Entity')
    };
    
    const [createdLog] = await db.insert(activityLogs).values(processedLog).returning();
    return createdLog;
  }

  /**
   * LEGAL ENTITY REPOSITORY METHODS
   */
  
  async getAllLegalEntities(): Promise<LegalEntity[]> {
    return db.select().from(legalEntities);
  }

  async getLegalEntity(id: number): Promise<LegalEntity | undefined> {
    const [entity] = await db.select().from(legalEntities).where(eq(legalEntities.id, id));
    return entity;
  }

  async getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined> {
    const [entity] = await db.select().from(legalEntities).where(eq(legalEntities.entityId, entityId));
    return entity;
  }

  async createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity> {
    const [createdEntity] = await db.insert(legalEntities).values(entity).returning();
    return createdEntity;
  }

  async updateLegalEntity(id: number, data: Partial<LegalEntity>): Promise<LegalEntity | undefined> {
    const [updatedEntity] = await db
      .update(legalEntities)
      .set(data)
      .where(eq(legalEntities.id, id))
      .returning();
    return updatedEntity;
  }

  async deleteLegalEntity(id: number): Promise<boolean> {
    await db.delete(legalEntities).where(eq(legalEntities.id, id));
    return true;
  }
  
  /**
   * RISK SUMMARY REPOSITORY METHODS
   */
  
  async getLatestRiskSummary(): Promise<any | null> {
    const results = await db
      .select()
      .from(riskSummaries)
      .orderBy(desc(riskSummaries.createdAt))
      .limit(1);
      
    return results.length > 0 ? results[0] : null;
  }
  
  async createRiskSummary(summary: InsertRiskSummary): Promise<any> {
    // Make sure year and month are always provided
    const now = new Date();
    const summaryWithDate = {
      ...summary,
      year: summary.year || now.getFullYear(),
      month: summary.month || now.getMonth() + 1, // JavaScript months are 0-based
    };
    
    const [createdSummary] = await db
      .insert(riskSummaries)
      .values(summaryWithDate)
      .returning();
    return createdSummary;
  }

  /**
   * RISK-CONTROL RELATIONSHIP REPOSITORY METHODS
   */
  
  async getControlsForRisk(riskId: number): Promise<Control[]> {
    try {
      const risk = await this.getRisk(riskId);
      if (!risk) {
        console.log(`No risk found with ID ${riskId}`);
        return [];
      }
      
      console.log(`Getting controls for risk ID ${riskId}, riskId: ${risk.riskId}`);
      
      // Get the join records
      const joinRecords = await db
        .select()
        .from(riskControls)
        .where(eq(riskControls.riskId, riskId));
      
      console.log(`Found ${joinRecords.length} risk-control relationships`);
      
      if (joinRecords.length === 0) return [];
      
      // Get the control IDs
      const controlIds = joinRecords.map(record => record.controlId);
      console.log(`Control IDs: ${controlIds.join(', ')}`);
      
      // Get the controls
      const controlsList = await this.getControlsByIds(controlIds);
      console.log(`Found ${controlsList.length} controls`);
      
      return controlsList;
    } catch (error) {
      console.error(`Error getting controls for risk ${riskId}:`, error);
      return [];
    }
  }
  
  async getRisksForControl(controlId: number): Promise<Risk[]> {
    // Get the join records
    const joinRecords = await db
      .select()
      .from(riskControls)
      .where(eq(riskControls.controlId, controlId));
    
    if (joinRecords.length === 0) return [];
    
    // Get the risk IDs
    const riskIds = joinRecords.map(record => record.riskId);
    
    // Get the risks
    return this.getRisksByIds(riskIds);
  }
  
  async addControlToRisk(riskId: number, controlId: number): Promise<void> {
    // Check if the relationship already exists
    const [existing] = await db
      .select()
      .from(riskControls)
      .where(
        and(
          eq(riskControls.riskId, riskId),
          eq(riskControls.controlId, controlId)
        )
      );
    
    // If it doesn't exist, create it
    if (!existing) {
      await db.insert(riskControls).values({
        riskId,
        controlId
      });
    }
  }
  
  async removeControlFromRisk(riskId: number, controlId: number): Promise<void> {
    await db
      .delete(riskControls)
      .where(
        and(
          eq(riskControls.riskId, riskId),
          eq(riskControls.controlId, controlId)
        )
      );
  }
  
  async removeControlsFromRisk(riskId: number): Promise<void> {
    await db
      .delete(riskControls)
      .where(eq(riskControls.riskId, riskId));
  }
  
  async removeControlFromAllRisks(controlId: number): Promise<void> {
    await db
      .delete(riskControls)
      .where(eq(riskControls.controlId, controlId));
  }

  /**
   * RISK SUMMARY REPOSITORY METHODS
   */
  
  async recalculateRiskSummaries(): Promise<void> {
    // This method would trigger risk summary recalculation
    // For now, we'll implement a simple placeholder
    // In a full implementation, this would:
    // 1. Recalculate all risk values
    // 2. Update aggregate statistics
    // 3. Refresh dashboard data
    console.log('Risk summaries recalculation requested - placeholder implementation');
  }

  /**
   * CONTROL LIBRARY REPOSITORY METHODS
   */
  
  async getAllControlLibraryItems(): Promise<any[]> {
    return db.select().from(controlLibrary);
  }
  
  async getControlLibraryItem(id: number): Promise<any | undefined> {
    const [item] = await db.select().from(controlLibrary).where(eq(controlLibrary.id, id));
    return item;
  }
  
  async createControlLibraryItem(data: any): Promise<any> {
    const [item] = await db.insert(controlLibrary).values(data).returning();
    return item;
  }
  
  async updateControlLibraryItem(id: number, data: any): Promise<any> {
    const [item] = await db
      .update(controlLibrary)
      .set(data)
      .where(eq(controlLibrary.id, id))
      .returning();
    return item;
  }
  
  async deleteControlLibraryItem(id: number): Promise<void> {
    await db.delete(controlLibrary).where(eq(controlLibrary.id, id));
  }
  
  /**
   * RISK SUMMARY RECALCULATION
   */
  async recalculateRiskSummaries(): Promise<void> {
    // Get all risks
    const allRisks = await this.getAllRisks();
    
    // Calculate total inherent and residual risk
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;
    
    for (const risk of allRisks) {
      // Only include valid numerical risk values
      if (risk.inherentRisk && !isNaN(Number(risk.inherentRisk))) {
        totalInherentRisk += Number(risk.inherentRisk);
      }
      
      if (risk.residualRisk && !isNaN(Number(risk.residualRisk))) {
        totalResidualRisk += Number(risk.residualRisk);
      }
    }
    
    // Create new risk summary entry
    const now = new Date();
    await this.createRiskSummary({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      totalInherentRisk: String(totalInherentRisk),
      totalResidualRisk: String(totalResidualRisk),
      riskCount: allRisks.length,
      createdAt: now
    });
    
    console.log(`Risk summaries recalculated: inherent=${totalInherentRisk}, residual=${totalResidualRisk}`);
  }

  /**
   * COST MODULE REPOSITORY METHODS
   */
  
  async getRiskCosts(riskId: number): Promise<any[]> {
    const result = await db.execute(sql`
      SELECT rc.*, cm.name as module_name, cm.cost_type, cm.cost_factor, cm.cis_control
      FROM risk_costs rc
      JOIN cost_modules cm ON rc.cost_module_id = cm.id
      WHERE rc.risk_id = ${riskId}
    `);
    return result.rows as any[];
  }
  
  async getCostModule(id: number): Promise<any | undefined> {
    const result = await db.execute(sql`
      SELECT * FROM cost_modules WHERE id = ${id}
    `);
    return result.rows[0] as any;
  }

  /**
   * RISK LIBRARY REPOSITORY METHODS
   */
  
  async getAllRiskLibraryItems(): Promise<any[]> {
    return db.select().from(riskLibrary);
  }
  
  async getRiskLibraryItem(id: number): Promise<any | undefined> {
    const [item] = await db.select().from(riskLibrary).where(eq(riskLibrary.id, id));
    return item;
  }
  
  async createRiskLibraryItem(data: any): Promise<any> {
    const [item] = await db.insert(riskLibrary).values(data).returning();
    return item;
  }
  
  async updateRiskLibraryItem(id: number, data: any): Promise<any> {
    const [item] = await db
      .update(riskLibrary)
      .set(data)
      .where(eq(riskLibrary.id, id))
      .returning();
    return item;
  }
  
  async deleteRiskLibraryItem(id: number): Promise<void> {
    await db.delete(riskLibrary).where(eq(riskLibrary.id, id));
  }

  /**
   * ASSET-RISK RELATIONSHIP METHODS
   */
  async getRisksByAssetId(assetId: number): Promise<Risk[]> {
    // Get risks associated with the asset
    const assetRecord = await this.getAsset(assetId);
    if (!assetRecord) return [];
    
    // Find risks that include this asset in their associated_assets array
    const allRisks = await this.getAllRisks();
    return allRisks.filter(risk => 
      risk.associatedAssets && risk.associatedAssets.includes(assetRecord.assetId)
    );
  }

  async getAssetsForLegalEntity(entityId: number): Promise<Asset[]> {
    // Get the legal entity to find its entityId
    const entity = await this.getLegalEntity(entityId);
    if (!entity) return [];
    
    // Find assets belonging to this legal entity
    const allAssets = await this.getAllAssets();
    return allAssets.filter(asset => asset.legalEntity === entity.entityId);
  }

  async getAssetsByLegalEntity(entityId: number): Promise<Asset[]> {
    return this.getAssetsForLegalEntity(entityId);
  }
}

// Create a singleton instance of the repository
export const repositoryStorage = new DatabaseStorage();