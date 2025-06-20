import { DatabaseStorage, repositoryStorage } from './repositoryStorage';
import { Risk, InsertRisk, Control, riskLibrary } from '@shared/schema';
import { calculateRiskValues as calculateRiskValuesUtil } from '@shared/utils/calculations';
import { automatedRiskSummary } from './automatedRiskSummary';

// Define filter types for risks
export interface RiskFilterOptions {
  severity?: 'low' | 'medium' | 'high' | 'critical';
  riskCategory?: 'operational' | 'strategic' | 'compliance' | 'financial';
  assetId?: string;
  legalEntityId?: string;
  threatCommunity?: string;
  sortBy?: 'inherentRisk' | 'residualRisk' | 'severity' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export class RiskService {
  private repository: DatabaseStorage;
  
  constructor(repository: DatabaseStorage) {
    this.repository = repository;
  }
  
  /**
   * RISK LIBRARY METHODS
   */

  /**
   * Get all risk library templates
   */
  async getAllRiskLibraryItems(): Promise<any[]> {
    return this.repository.getAllRiskLibraryItems();
  }

  /**
   * Get a single risk library template by ID
   */
  async getRiskLibraryItem(id: number): Promise<any | undefined> {
    return this.repository.getRiskLibraryItem(id);
  }

  /**
   * Create a new risk library template
   */
  async createRiskLibraryItem(data: any): Promise<any> {
    return this.repository.createRiskLibraryItem(data);
  }

  /**
   * Update an existing risk library template
   */
  async updateRiskLibraryItem(id: number, data: any): Promise<any | undefined> {
    return this.repository.updateRiskLibraryItem(id, data);
  }

  /**
   * Delete a risk library template
   */
  async deleteRiskLibraryItem(id: number): Promise<boolean> {
    await this.repository.deleteRiskLibraryItem(id);
    return true;
  }

  /**
   * Create a new risk instance from a library template
   */
  async createRiskFromTemplate(libraryItemId: number, assetId: string): Promise<any> {
    // Get the template
    const template = await this.repository.getRiskLibraryItem(libraryItemId);
    if (!template) {
      throw new Error(`Risk library template with ID ${libraryItemId} not found`);
    }

    // Generate a unique risk ID
    const uniqueId = Math.floor(Math.random() * 1000);
    const riskId = `RISK-${template.riskId ? template.riskId.split('-')[1] : 'TEMPLATE'}-${uniqueId}`;
    
    // Create risk data from template
    const riskData = {
      ...template,
      riskId,
      itemType: 'instance',
      libraryItemId: template.id,
      associatedAssets: [assetId],
      // Exclude the primary key
      id: undefined
    };

    // Create the risk
    return this.createRisk(riskData);
  }
  
  /**
   * Get all risks with optional filtering
   */
  async getAllRisks(filters?: RiskFilterOptions): Promise<Risk[]> {
    const risks = await this.repository.getAllRisks();
    
    if (!filters || Object.keys(filters).length === 0) {
      return risks;
    }
    
    // Apply filters
    let filteredRisks = risks.filter(risk => {
      let match = true;
      
      if (filters.severity && risk.severity !== filters.severity) {
        match = false;
      }
      
      if (filters.riskCategory && risk.riskCategory !== filters.riskCategory) {
        match = false;
      }
      
      if (filters.assetId && (!risk.associatedAssets || !risk.associatedAssets.includes(filters.assetId))) {
        match = false;
      }
      
      // Note: Risk entity filtering would require schema update to add legalEntityId field
      // Currently filtering by associated assets' legal entities instead
      
      if (filters.threatCommunity && risk.threatCommunity !== filters.threatCommunity) {
        match = false;
      }
      
      return match;
    });
    
    // Apply sorting if specified
    if (filters.sortBy) {
      filteredRisks.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (filters.sortBy) {
          case 'inherentRisk':
            valueA = parseFloat(a.inherentRisk);
            valueB = parseFloat(b.inherentRisk);
            break;
          case 'residualRisk':
            valueA = parseFloat(a.residualRisk);
            valueB = parseFloat(b.residualRisk);
            break;
          case 'severity':
            // Convert severity to numeric values for sorting
            const severityMap = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
            valueA = severityMap[a.severity] || 0;
            valueB = severityMap[b.severity] || 0;
            break;
          case 'name':
          default:
            valueA = a.name;
            valueB = b.name;
            break;
        }
        
        // Handle ascending/descending sort
        const sortMultiplier = (filters.sortOrder === 'desc') ? -1 : 1;
        
        // Handle string comparisons vs numeric
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortMultiplier * valueA.localeCompare(valueB);
        } else {
          return sortMultiplier * (valueA - valueB);
        }
      });
    }
    
    return filteredRisks;
  }
  
  /**
   * Get a risk by ID
   */
  async getRisk(id: number): Promise<Risk | undefined> {
    return this.repository.getRisk(id);
  }
  
  /**
   * Alias method for getRisk to maintain compatibility with controller
   */
  async getRiskById(id: number): Promise<Risk | undefined> {
    return this.getRisk(id);
  }
  
  /**
   * Get a risk by riskId
   */
  async getRiskByRiskId(riskId: string): Promise<Risk | undefined> {
    return this.repository.getRiskByRiskId(riskId);
  }
  
  /**
   * Create a new risk
   */
  async createRisk(riskData: InsertRisk): Promise<Risk> {
    // Create the risk
    const risk = await this.repository.createRisk(riskData);
    
    // Trigger automated risk summary recalculation
    await automatedRiskSummary.triggerRecalculation();
    
    return risk;
  }
  
  /**
   * Update a risk
   */
  async updateRisk(id: number, riskData: Partial<Risk>): Promise<Risk | undefined> {
    // Preserve Secondary Loss values if they exist in the incoming data
    const preservedSecondaryLossData: any = {};
    
    // Check if Secondary Loss values are provided in the update data
    if (riskData.secondaryLossMagnitudeMin !== undefined) {
      preservedSecondaryLossData.secondaryLossMagnitudeMin = riskData.secondaryLossMagnitudeMin;
    }
    if (riskData.secondaryLossMagnitudeAvg !== undefined) {
      preservedSecondaryLossData.secondaryLossMagnitudeAvg = riskData.secondaryLossMagnitudeAvg;
    }
    if (riskData.secondaryLossMagnitudeMax !== undefined) {
      preservedSecondaryLossData.secondaryLossMagnitudeMax = riskData.secondaryLossMagnitudeMax;
    }
    if (riskData.secondaryLossMagnitudeConfidence !== undefined) {
      preservedSecondaryLossData.secondaryLossMagnitudeConfidence = riskData.secondaryLossMagnitudeConfidence;
    }
    
    // Same for Secondary Loss Event Frequency
    if (riskData.secondaryLossEventFrequencyMin !== undefined) {
      preservedSecondaryLossData.secondaryLossEventFrequencyMin = riskData.secondaryLossEventFrequencyMin;
    }
    if (riskData.secondaryLossEventFrequencyAvg !== undefined) {
      preservedSecondaryLossData.secondaryLossEventFrequencyAvg = riskData.secondaryLossEventFrequencyAvg;
    }
    if (riskData.secondaryLossEventFrequencyMax !== undefined) {
      preservedSecondaryLossData.secondaryLossEventFrequencyMax = riskData.secondaryLossEventFrequencyMax;
    }
    if (riskData.secondaryLossEventFrequencyConfidence !== undefined) {
      preservedSecondaryLossData.secondaryLossEventFrequencyConfidence = riskData.secondaryLossEventFrequencyConfidence;
    }
    
    // Update the risk with all the data
    const updatedRisk = await this.repository.updateRisk(id, riskData);
    
    // If secondary loss data was provided in the update but might have been 
    // overwritten by calculation processes, apply it again to ensure it persists
    if (updatedRisk && Object.keys(preservedSecondaryLossData).length > 0) {
      // Apply the preserved secondary loss data in a separate update
      await this.repository.updateRisk(id, preservedSecondaryLossData);
    }
    
    if (updatedRisk) {
      // Trigger automated risk summary recalculation
      await automatedRiskSummary.triggerRecalculation();
      
      // Get the updated risk with all changes applied
      return this.repository.getRisk(id);
    }
    
    return updatedRisk;
  }
  
  /**
   * Delete a risk
   */
  async deleteRisk(id: number): Promise<boolean> {
    try {
      // Ensure id is a valid number
      if (isNaN(Number(id))) {
        throw new Error(`Invalid risk ID: ${id}`);
      }
      
      // Use the integer ID value
      const numericId = Number(id);
      const success = await this.repository.deleteRisk(numericId);
      
      if (success) {
        try {
          // Trigger automated risk summary recalculation
          await automatedRiskSummary.triggerRecalculation();
        } catch (summaryError) {
          console.log('Non-fatal error recalculating risk summaries:', summaryError);
          // Continue without failing the deletion operation
        }
      }
      
      return success;
    } catch (error) {
      console.error('Error in risk deletion:', error);
      throw error;
    }
  }
  

  
  /**
   * Calculate risk values for a risk
   * This service method orchestrates the data gathering and calculation process
   * but delegates actual calculation to the pure utility function
   * @param riskId Can be either a numeric ID or a string risk ID like "RISK-DATA-123"
   */
  async calculateRiskValues(riskId: number | string, options: { includeControls?: boolean, controls?: any[] } = {}): Promise<any | undefined> {
    // Retrieve risk data from repository
    let risk: any;
    
    if (typeof riskId === 'string' && riskId.includes('-')) {
      // This is a string ID like "RISK-DATA-123"
      risk = await this.repository.getRiskByRiskId(riskId);
    } else {
      // This is a numeric ID
      risk = await this.repository.getRisk(Number(riskId));
    }
    
    if (!risk) {
      console.log(`Risk not found for ID: ${riskId}`);
      return undefined;
    }
    
    // Get controls associated with this risk - use passed controls if provided, otherwise fetch them
    const numericId = typeof risk.id === 'number' ? risk.id : Number(risk.id);
    let controls = options.controls || await this.repository.getControlsForRisk(numericId);
    
    // Apply includeControls option - if false, use empty controls array for inherent risk calculation
    if (options.includeControls === false) {
      console.log('Calculating INHERENT risk - ignoring controls');
      controls = []; // Use empty controls array for inherent risk
    } else {
      console.log(`Calculating RESIDUAL risk - found ${controls ? controls.length : 0} controls`);
    }
    
    // Retrieve associated assets to use their values in calculations
    let assets = [];
    if (risk.associatedAssets && Array.isArray(risk.associatedAssets) && risk.associatedAssets.length > 0) {
      assets = await this.repository.getAssetsByIds(risk.associatedAssets);
      
      // Process assets to ensure assetValue is always a number
      assets = assets.map(asset => {
        // Convert any string values to numbers - handle both assetValue and asset_value fields
        let numericAssetValue = 0;
        
        if (typeof asset.assetValue === 'number') {
          numericAssetValue = asset.assetValue;
        } else if (typeof asset.assetValue === 'string') {
          // Remove any non-numeric characters except decimal point
          numericAssetValue = parseFloat(asset.assetValue.replace(/[^0-9.-]/g, ''));
        } else {
          // Default to 0 if no valid asset value found
          numericAssetValue = 0;
        }
        
        // Ensure we don't have NaN
        if (isNaN(numericAssetValue)) {
          numericAssetValue = 0;
        }
          
        // Log for debugging
        console.log(`Asset ${asset.assetId || asset.id} value = $${numericAssetValue}`);
        
        return {
          ...asset,
          assetValue: numericAssetValue,
          // Also ensure we have a numeric backup in value field for legacy compatibility
          value: numericAssetValue,
          // Add the snake_case version too for complete compatibility
          asset_value: numericAssetValue
        };
      });
      
      console.log(`Retrieved ${assets.length} assets for risk calculation: ${risk.riskId}`);
      console.log(`Processed asset values: ${assets.map(a => `${a.assetId}: $${a.assetValue}`).join(', ')}`);
    }
    
    // Fetch cost modules for this risk using direct database query
    let costModuleAssignments: any[] = [];
    console.log(`STEP 1: Fetching cost modules for risk ${numericId}`);
    
    try {
      // Import database connection directly
      const { pool } = await import('../db');
      const result = await pool.query(`
        SELECT 
          rc.id,
          rc.risk_id,
          rc.cost_module_id,
          rc.weight,
          cm.name,
          cm.description,
          cm.cost_type,
          cm.cost_factor,
          cm.cis_control
        FROM risk_costs rc 
        JOIN cost_modules cm ON rc.cost_module_id = cm.id 
        WHERE rc.risk_id = $1
      `, [numericId]);
      
      const riskCostAssignments = result.rows;
      console.log(`STEP 2: Found ${riskCostAssignments.length} cost assignments for risk ${numericId}`);
      
      // Convert to the format expected by calculation utility
      costModuleAssignments = riskCostAssignments.map(assignment => ({
        id: assignment.id,
        risk_id: assignment.risk_id,
        cost_module_id: assignment.cost_module_id,
        materiality_weight: parseFloat(assignment.weight) || 1.0,
        cost_module: {
          id: assignment.cost_module_id,
          name: assignment.name,
          costType: assignment.cost_type,
          costFactor: parseFloat(assignment.cost_factor),
          description: assignment.description
        }
      }));
      
      console.log(`STEP 2: Found ${costModuleAssignments.length} cost modules for risk ${numericId}:`);
      costModuleAssignments.forEach(cm => {
        console.log(`  - ${cm.cost_module.name}: ${cm.cost_module.costType} = $${cm.cost_module.costFactor}`);
      });
    } catch (error: any) {
      console.log(`Error fetching cost modules for risk ${numericId}:`, error?.message || 'Unknown error');
      costModuleAssignments = [];
    }

    // Add assets and cost modules to the risk object for the calculation function
    const riskWithEnhancedData = {
      ...risk,
      assetObjects: assets,
      costModuleAssignments
    };
    
    // Clear separation of concerns:
    // 1. Service layer gathers data from repository
    // 2. Calculation module does the pure calculation
    console.log(`STEP 4: About to call calculateRiskValues with ${controls?.length || 0} controls and ${costModuleAssignments.length} cost modules`);
    const calculationResults = calculateRiskValuesUtil(riskWithEnhancedData, 0, controls, costModuleAssignments);
    console.log(`STEP 4: calculateRiskValues returned, inherentRisk=${calculationResults?.inherentRisk}, residualRisk=${calculationResults?.residualRisk}`);
    
    // Update the risk record with calculated values
    if (calculationResults && numericId) {
      console.log(`SERVICE DEBUG: calculationResults exists, controls.length = ${controls?.length || 0}`);
      console.log(`SERVICE DEBUG: inherentRisk = ${calculationResults.inherentRisk}, residualRisk = ${calculationResults.residualRisk}`);
      
      // Only update the database if we got valid calculation results
      if (calculationResults.inherentRisk > 0 || calculationResults.residualRisk > 0) {
        console.log(`Calculation result: inherentRisk = ${calculationResults.inherentRisk} residualRisk = ${calculationResults.residualRisk}`);
        
        // Use default loss magnitude values for now
        const lossMagnitudeMin = risk.primaryLossMagnitudeMin || 0;
        const lossMagnitudeAvg = risk.primaryLossMagnitudeAvg || 0;
        const lossMagnitudeMax = risk.primaryLossMagnitudeMax || 0;
        
        console.log(`Loss magnitude values from calculation: Min=${lossMagnitudeMin}, Avg=${lossMagnitudeAvg}, Max=${lossMagnitudeMax}`);

        console.log(`Saving calculated risk values to database:
        Inherent Risk: ${calculationResults.inherentRisk}
        Residual Risk: ${calculationResults.residualRisk}`);

        // Update the risk record with the newly calculated values including loss magnitude
        // First, get the current values to preserve secondary loss values
        const currentRisk = await this.repository.getRisk(numericId);
        
        // Use the residual risk calculated by the calculation utility function
        // The calculation utility already handles control effectiveness properly
        let residualRiskValue = calculationResults.residualRisk;
        console.log(`Using calculation utility result: residualRisk=${residualRiskValue}`);
        
        // Calculate updated Resistance Strength values when controls are applied
        let updatedResistanceMin = risk.resistanceStrengthMin || 0;
        let updatedResistanceAvg = risk.resistanceStrengthAvg || 0;
        let updatedResistanceMax = risk.resistanceStrengthMax || 0;
        
        if (controls && controls.length > 0) {
          let totalEffectiveness = 0;
          let validControls = 0;
          
          for (const control of controls) {
            if (control.controlEffectiveness && control.controlEffectiveness > 0) {
              const effectiveness = Number(control.controlEffectiveness) || 0;
              
              // Apply implementation status factor
              let implementationFactor = 0;
              if (control.implementationStatus === 'fully_implemented') {
                implementationFactor = 1.0;
              } else if (control.implementationStatus === 'in_progress') {
                implementationFactor = 0.5;
              } else {
                implementationFactor = 0;
              }
              
              const adjustedEffectiveness = effectiveness * implementationFactor;
              totalEffectiveness += adjustedEffectiveness;
              validControls++;
            }
          }
          
          if (validControls > 0) {
            const avgEffectiveness = totalEffectiveness / validControls;
            // Add control effectiveness to resistance strength values
            updatedResistanceMin = Math.min(10, updatedResistanceMin + avgEffectiveness * 0.8); // Min slightly lower
            updatedResistanceAvg = Math.min(10, updatedResistanceAvg + avgEffectiveness);
            updatedResistanceMax = Math.min(10, updatedResistanceMax + avgEffectiveness * 1.2); // Max slightly higher
            
            console.log(`Database update: Resistance Strength updated from (${risk.resistanceStrengthMin || 0}/${risk.resistanceStrengthAvg || 0}/${risk.resistanceStrengthMax || 0}) to (${updatedResistanceMin}/${updatedResistanceAvg}/${updatedResistanceMax})`);
          }
        }

        // Use the calculated secondary loss magnitude values from the calculation utility
        const calculatedSecondaryLoss = (calculationResults as any).secondaryLossMagnitude;
        let secondaryLossMin = parseFloat(calculatedSecondaryLoss?.min) || parseFloat(risk.secondaryLossMagnitudeMin) || 0;
        let secondaryLossAvg = parseFloat(calculatedSecondaryLoss?.avg) || parseFloat(risk.secondaryLossMagnitudeAvg) || 0;
        let secondaryLossMax = parseFloat(calculatedSecondaryLoss?.max) || parseFloat(risk.secondaryLossMagnitudeMax) || 0;

        console.log(`USING CALCULATED SECONDARY LOSS VALUES: Min=${secondaryLossMin}, Avg=${secondaryLossAvg}, Max=${secondaryLossMax}`);

        const updateData = {
          inherentRisk: String(calculationResults.inherentRisk),
          residualRisk: String(residualRiskValue),
          // Update Resistance Strength values to reflect control effectiveness
          resistanceStrengthMin: updatedResistanceMin,
          resistanceStrengthAvg: updatedResistanceAvg,
          resistanceStrengthMax: updatedResistanceMax,
          // Store the Enhanced Loss Magnitude values that include cost modules
          lossMagnitudeMin: String((calculationResults as any).lossMagnitude?.min || lossMagnitudeMin),
          lossMagnitudeAvg: String((calculationResults as any).lossMagnitude?.avg || lossMagnitudeAvg),
          lossMagnitudeMax: String((calculationResults as any).lossMagnitude?.max || lossMagnitudeMax),
          lossMagnitudeConfidence: 'medium',
          // Store calculated secondary loss values
          secondaryLossMagnitudeMin: String(secondaryLossMin),
          secondaryLossMagnitudeAvg: String(secondaryLossAvg),
          secondaryLossMagnitudeMax: String(secondaryLossMax)
        };
        
        console.log(`DATABASE UPDATE: Saving residual risk ${updateData.residualRisk} and resistance strength (${updateData.resistanceStrengthMin}/${updateData.resistanceStrengthAvg}/${updateData.resistanceStrengthMax})`);
        
        await this.repository.updateRisk(numericId, updateData);
        
        // Refresh the risk record after update
        if (typeof riskId === 'string' && riskId.includes('-')) {
          risk = await this.repository.getRiskByRiskId(riskId);
        } else {
          risk = await this.repository.getRisk(Number(riskId));
        }
        
        // Add the calculation results to the returned risk object
        (calculationResults as any).risk = risk;
      }
    }
    
    return calculationResults;
  }
  
  /**
   * Get controls associated with a risk
   * @param riskId The numeric ID of the risk
   * @returns Array of controls associated with the risk
   */
  async getControlsForRisk(riskId: number): Promise<Control[]> {
    return this.repository.getControlsForRisk(riskId);
  }

  /**
   * Get assets associated with a risk
   * @param riskId The numeric ID of the risk
   * @returns Array of assets associated with the risk
   */
  async getAssetsForRisk(riskId: number): Promise<any[]> {
    // Use the internal method for now
    return this.getAssetsForRiskInternal(riskId);
  }

  /**
   * Run ad-hoc Monte Carlo risk calculation without saving to database
   * This allows for immediate, on-demand calculation of risk values based on provided parameters
   * @param params Risk calculation parameters
   * @returns Calculated risk values including Monte Carlo simulation results
   */
  async runAdHocMonteCarloCalculation(params: any): Promise<any | undefined> {
    if (!params) return undefined;
    
    try {
      // Simply delegate to the calculation utility from shared module
      // No business logic or DB operations here - pure calculation delegation
      return calculateRiskValuesUtil(params, 0, []);
    } catch (error) {
      console.error("Error in ad-hoc Monte Carlo calculation:", error);
      return undefined;
    }
  }
  
  /**
   * Get assets associated with a risk (duplicate method - cleanup)
   */
  private async getAssetsForRiskInternal(riskId: number): Promise<any[]> {
    const risk = await this.repository.getRisk(riskId);
    
    if (!risk || !risk.associatedAssets || risk.associatedAssets.length === 0) {
      return [];
    }
    
    return this.repository.getAssetsByIds(risk.associatedAssets);
  }
  
  /**
   * Calculate and update risk values - called by controller
   * This method handles all the logic that was removed from the controller
   */
  async calculateAndUpdateRiskValues(idParam: string): Promise<any> {
    try {
      // Check if the ID is numeric or a risk ID string
      let riskId = idParam;
      let risk = null;
      
      if (!isNaN(parseInt(idParam))) {
        // It's a numeric ID
        const numericId = parseInt(idParam);
        risk = await this.getRiskById(numericId);
        if (risk) {
          riskId = risk.riskId;
        }
      } else {
        // It's a string ID like RISK-DATA-123
        risk = await this.getRiskByRiskId(riskId);
      }
      
      if (!risk) {
        throw new Error('Risk not found');
      }
      
      // Get controls for this risk
      const controls = await this.getControlsForRisk(risk.id);
      console.log(`Retrieved ${controls ? controls.length : 0} controls for risk calculation: ${riskId}`);
      
      // The calculateRiskValues method already handles both inherent and residual calculations
      // and saves the correct values to the database
      console.log('Calling unified calculation that handles both inherent and residual risk...');
      const calculationResult = await this.calculateRiskValues(risk.id, { includeControls: true, controls: controls });
      
      // Get the ACTUAL reduced residual risk from the database after control effects are applied
      const updatedRisk = await this.getRiskById(risk.id);
      const finalInherentRisk = calculationResult?.inherentRisk || 0;
      const finalResidualRisk = updatedRisk?.residualRisk ? parseFloat(updatedRisk.residualRisk) : finalInherentRisk;
      
      console.log(`Service method returning CORRECTED VALUES: inherentRisk=${finalInherentRisk}, residualRisk=${finalResidualRisk}`);
      
      // Return the calculated values with the ACTUAL reduced residual risk
      return {
        inherentRisk: finalInherentRisk,
        residualRisk: finalResidualRisk,
        ...(calculationResult || {})
      };
    } catch (error) {
      console.error('Error in calculateAndUpdateRiskValues:', error);
      throw error;
    }
  }

  /**
   * Recalculate and store risk summaries
   */
  async recalculateRiskSummaries(): Promise<void> {
    // Get all risks for calculation
    const risks = await this.repository.getAllRisks();
    
    // Calculate summary metrics
    const totalInherentRisk = risks.reduce((sum, risk) => {
      const val = parseFloat(risk.inherentRisk);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    
    const totalResidualRisk = risks.reduce((sum, risk) => {
      const val = parseFloat(risk.residualRisk);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    
    // Generate loss exceedance curve data
    const maxLoss = risks.reduce((max, risk) => {
      const val = parseFloat(risk.residualRisk);
      return Math.max(max, isNaN(val) ? 0 : val);
    }, 0);
    
    const lossExceedanceCurve = [];
    
    if (maxLoss > 0) {
      // Generate curve points
      for (let i = 0; i <= 100; i++) {
        const x = i * (maxLoss / 100); // Loss amount
        
        // Probability calculation (simplified):
        // At $0: 100% probability
        // At average loss: 50% probability
        // At max loss: 10% probability
        // Beyond max: approaches 0%
        
        let y = 100 - i; // Simple linear decrease
        
        if (i > 90) {
          // Exponential decrease for tail probabilities
          y = 10 * Math.exp(-0.5 * (i - 90) / 2);
        }
        
        lossExceedanceCurve.push({ x, y: y / 100 });
      }
    }
    
    // Store the new summary
    try {
      const now = new Date();
      
      // Check if we're using the newer API (createRiskSummary) or older API (addRiskSummary)
      if (typeof this.repository.createRiskSummary === 'function') {
        await this.repository.createRiskSummary({
          createdAt: now,
          year: now.getFullYear(),
          month: now.getMonth() + 1, // JavaScript months are 0-based, add 1 for database
          totalRisk: totalResidualRisk,
          lossExceedanceCurve: JSON.stringify(lossExceedanceCurve),
          riskDistribution: JSON.stringify([])
        });
      } else if (typeof this.repository.addRiskSummary === 'function') {
        await this.repository.addRiskSummary({
          createdAt: now,
          year: now.getFullYear(),
          month: now.getMonth() + 1, 
          totalRisk: totalResidualRisk,
          lossExceedanceCurve: JSON.stringify(lossExceedanceCurve),
          riskDistribution: JSON.stringify([])
        });
      } else {
        console.log('Warning: Unable to save risk summary - no appropriate method found');
        // Silently continue without saving summary - the risk calculation itself still worked
      }
    } catch (error) {
      console.log('Error saving risk summary (non-fatal):', error);
      // Continue without failing - the risk calculation itself still worked
    }
  }
}

// Factory function to create a service instance with repository injection
export const riskService = (repository: DatabaseStorage) => new RiskService(repository);