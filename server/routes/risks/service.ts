import { storage } from "../../../services/storage';
import { Risk } from '@shared/schema';
import { calculateRiskValues } from '@shared/utils/calculations';
import { riskSummaryService } from '../../dashboard/riskSummaryService';
import { CreateRiskDto, UpdateRiskDto, RiskFilterDto } from './dto';

/**
 * Service for risk-related operations
 */
export class RiskService {
  /**
   * Get all risks with optional filtering
   */
  async getAllRisks(filters?: RiskFilterDto) {
    try {
      let risks = await storage.getAllRisks();
      
      // Apply filters if provided
      if (filters) {
        // Filter by category
        if (filters.category) {
          risks = risks.filter(risk => risk.riskCategory === filters.category);
        }
        
        // Filter by severity
        if (filters.severity) {
          risks = risks.filter(risk => risk.severity === filters.severity);
        }
        
        // Filter by asset ID
        if (filters.assetId) {
          risks = risks.filter(risk => 
            risk.associatedAssets && 
            risk.associatedAssets.includes(filters.assetId as string)
          );
        }
        
        // Filter by entity ID
        if (filters.entityId) {
          // First get all assets for the entity
          const assets = await storage.getAllAssets();
          const entityAssets = assets.filter(asset => asset.legalEntityId === filters.entityId);
          const entityAssetIds = entityAssets.map(asset => asset.assetId);
          
          // Then filter risks that have any of these assets
          risks = risks.filter(risk => 
            risk.associatedAssets && 
            risk.associatedAssets.some(assetId => entityAssetIds.includes(assetId))
          );
        }
        
        // Search by name or ID
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          risks = risks.filter(risk => 
            risk.name.toLowerCase().includes(searchLower) || 
            risk.riskId.toLowerCase().includes(searchLower) ||
            risk.description.toLowerCase().includes(searchLower)
          );
        }
        
        // Apply sorting
        if (filters.sortBy) {
          risks.sort((a, b) => {
            let valA: any = a[filters.sortBy as keyof Risk];
            let valB: any = b[filters.sortBy as keyof Risk];
            
            // Special handling for numeric fields
            if (filters.sortBy === 'residualRisk') {
              valA = parseFloat(valA || '0');
              valB = parseFloat(valB || '0');
            }
            
            // Apply sort order
            const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
            
            if (valA < valB) return -1 * sortOrder;
            if (valA > valB) return 1 * sortOrder;
            return 0;
          });
        }
        
        // Apply pagination
        if (filters.page !== undefined && filters.limit !== undefined) {
          const start = (filters.page - 1) * filters.limit;
          const end = start + filters.limit;
          risks = risks.slice(start, end);
        }
      }
      
      return risks;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single risk by ID
   */
  async getRiskById(id: number | string) {
    try {
      if (typeof id === 'string' && !isNaN(parseInt(id))) {
        id = parseInt(id);
      }
      
      if (typeof id === 'number') {
        return await storage.getRisk(id);
      } else {
        return await storage.getRiskByRiskId(id as string);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new risk
   */
  async createRisk(riskData: CreateRiskDto) {
    try {
      const risk = await storage.createRisk(riskData);
      
      // Calculate and update risk values with enhanced percentiles
      const { calculateEnhancedRiskValues } = await import('../../../shared/utils/enhancedRiskCalculations');
      
      // Get controls for this risk
      const controls = await storage.getControlsForRisk(risk.id);
      
      // Calculate using enhanced FAIR-CAM methodology
      const calculationResults = calculateEnhancedRiskValues(risk, controls, []);
      
      if (calculationResults) {
        const updateData: any = {
          inherentRisk: calculationResults.inherentRisk.toString(),
          residualRisk: calculationResults.residualRisk.toString(),
          
          // Store inherent risk percentiles
          inherentP10: calculationResults.inherentPercentiles.ale10.toString(),
          inherentP25: calculationResults.inherentPercentiles.ale25.toString(),
          inherentP50: calculationResults.inherentPercentiles.ale50.toString(),
          inherentP75: calculationResults.inherentPercentiles.ale75.toString(),
          inherentP90: calculationResults.inherentPercentiles.ale90.toString(),
          inherentP95: calculationResults.inherentPercentiles.ale95.toString(),
          inherentP99: calculationResults.inherentPercentiles.ale99.toString(),
          
          // Store residual risk percentiles
          residualP10: calculationResults.residualPercentiles.ale10.toString(),
          residualP25: calculationResults.residualPercentiles.ale25.toString(),
          residualP50: calculationResults.residualPercentiles.ale50.toString(),
          residualP75: calculationResults.residualPercentiles.ale75.toString(),
          residualP90: calculationResults.residualPercentiles.ale90.toString(),
          residualP95: calculationResults.residualPercentiles.ale95.toString(),
          residualP99: calculationResults.residualPercentiles.ale99.toString(),
        };
        
        await storage.updateRisk(risk.id, updateData);
      }
      
      // Trigger immediate optimized risk summary recalculation
      const { optimizedRiskCalculation } = await import('../../services/optimizedRiskCalculation');
      await optimizedRiskCalculation.onRiskChange();
      
      // Fetch the updated risk
      return await storage.getRisk(risk.id) || risk;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing risk
   */
  async updateRisk(id: number, riskData: UpdateRiskDto) {
    try {
      const updatedRisk = await storage.updateRisk(id, riskData);
      
      if (updatedRisk) {
        // Calculate and update risk values
        const calculationResults = await calculateRiskValues(updatedRisk);
        if (calculationResults) {
          await storage.updateRisk(id, {
            inherentRisk: calculationResults.inherentRisk.toString(),
            residualRisk: calculationResults.residualRisk.toString()
          });
        }
        
        // Trigger immediate optimized risk summary recalculation
        const { optimizedRiskCalculation } = await import('../../services/optimizedRiskCalculation');
        await optimizedRiskCalculation.onRiskChange();
        
        // Fetch the updated risk again
        return await storage.getRisk(id);
      }
      
      return updatedRisk;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a risk
   */
  async deleteRisk(id: number) {
    try {
      const result = await storage.deleteRisk(id);
      
      // Trigger immediate optimized risk summary recalculation
      const { optimizedRiskCalculation } = await import('../../services/optimizedRiskCalculation');
      await optimizedRiskCalculation.onRiskChange();
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get controls associated with a risk
   */
  async getControlsForRisk(riskId: string) {
    try {
      return await storage.getControlsForRisk(riskId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get assets associated with a risk
   */
  async getAssetsForRisk(riskId: string) {
    try {
      return await storage.getAssetsForRisk(riskId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calculate risk values (inherent and residual)
   */
  async calculateRiskValues(riskId: string) {
    try {
      const risk = await storage.getRiskByRiskId(riskId);
      if (!risk) {
        throw new Error('Risk not found');
      }
      
      const results = await calculateRiskValues(risk);
      return results;
    } catch (error) {
      throw error;
    }
  }
}

export const riskService = new RiskService();