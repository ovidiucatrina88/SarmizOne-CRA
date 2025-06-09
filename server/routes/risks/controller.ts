import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { riskService } from '../../services';
import { RiskFilterDto, CreateRiskDto, UpdateRiskDto } from './dto';
import { calculateThreatEventFrequency, calculateSusceptibility, calculateInherentRisk } from '../../../shared/utils/calculations';

/**
 * Controller for risk-related API endpoints
 */
export class RiskController {
  /**
   * Get all risks with optional filtering
   */
  async getAllRisks(req: Request, res: Response) {
    try {
      // Convert query parameters to appropriate filter options
      const filterOptions: RiskFilterOptions = {};
      
      // Extract filter options from query params
      if (req.query.severity) {
        filterOptions.severity = req.query.severity as 'low' | 'medium' | 'high' | 'critical';
      }
      
      if (req.query.riskCategory) {
        filterOptions.riskCategory = req.query.riskCategory as 'operational' | 'strategic' | 'compliance' | 'financial';
      }
      
      if (req.query.assetId) {
        filterOptions.assetId = req.query.assetId as string;
      }
      
      if (req.query.legalEntityId) {
        filterOptions.legalEntityId = req.query.legalEntityId as string;
      }
      
      if (req.query.threatCommunity) {
        filterOptions.threatCommunity = req.query.threatCommunity as string;
      }
      
      // Extract sorting options
      if (req.query.sortBy) {
        filterOptions.sortBy = req.query.sortBy as 'inherentRisk' | 'residualRisk' | 'severity' | 'name';
      }
      
      if (req.query.sortOrder) {
        filterOptions.sortOrder = req.query.sortOrder as 'asc' | 'desc';
      }
      
      // Get risks with applied filters
      const risks = await riskService.getAllRisks(filterOptions);
      return sendSuccess(res, risks);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get a single risk by ID
   */
  async getRiskById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const risk = await riskService.getRisk(id);
      
      if (!risk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, risk);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create a new risk
   */
  async createRisk(req: Request, res: Response) {
    try {
      const riskData: CreateRiskDto = req.body;
      const newRisk = await riskService.createRisk(riskData);
      
      // The risk service now handles all cascading operations like risk summaries
      
      return sendSuccess(res, newRisk, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Update an existing risk
   */
  async updateRisk(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const riskData: UpdateRiskDto = req.body;
      
      const updatedRisk = await riskService.updateRisk(id, riskData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      // Risk service now handles recalculation when needed
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Delete a risk
   */
  async deleteRisk(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      
      // Check if the ID is a risk ID string (contains hyphens) or a numeric ID
      if (idParam.includes('-')) {
        // This is a riskId format (like RISK-DATA-123)
        // First, look up the numeric ID from the string ID
        const risk = await riskService.getRiskByRiskId(idParam);
        if (!risk) {
          return sendError(res, { message: `Risk with ID ${idParam} not found` }, 404);
        }
        
        // Now delete using the numeric ID
        const success = await riskService.deleteRisk(risk.id);
        if (!success) {
          return sendError(res, { message: 'Error deleting risk' }, 500);
        }
        
        return sendSuccess(res, { message: 'Risk deleted successfully' });
      } else {
        // Handle as numeric ID
        const id = parseInt(idParam);
        
        // Validate ID is a proper number
        if (isNaN(id)) {
          return sendError(res, { message: `Invalid risk ID format: ${idParam}` }, 400);
        }
        
        const success = await riskService.deleteRisk(id);
        
        if (!success) {
          return sendError(res, { message: 'Risk not found' }, 404);
        }
        
        return sendSuccess(res, { message: 'Risk deleted successfully' });
      }
    } catch (error) {
      console.error('Error in risk deletion controller:', error);
      return sendError(res, error);
    }
  }

  /**
   * Get controls associated with a risk
   */
  async getControlsForRisk(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      console.log(`Fetching controls for risk with ID parameter: ${idParam}`);
      
      // Handle both numeric IDs and string risk IDs
      let risk;
      
      // First try to get the risk by numeric ID if applicable
      if (!isNaN(parseInt(idParam))) {
        const numericId = parseInt(idParam);
        console.log(`ID appears to be numeric (${numericId}), looking up by numeric ID`);
        risk = await riskService.getRiskById(numericId);
      }
      
      // If not found by numeric ID, try by riskId string
      if (!risk) {
        console.log(`Risk not found by numeric ID or ID is not numeric, looking up by riskId string: ${idParam}`);
        // Get all risks and find the one with matching riskId
        const risks = await riskService.getAllRisks();
        if (Array.isArray(risks)) {
          console.log(`Found ${risks.length} risks, searching for matching riskId`);
          risk = risks.find(r => r.riskId === idParam);
        } else {
          console.log(`Error: risks is not an array`);
        }
      }
      
      if (!risk) {
        console.log(`Risk not found for ID: ${idParam}`);
        return sendError(res, { message: `Risk with ID ${idParam} not found` }, 404);
      }
      
      console.log(`Found risk: ID=${risk.id}, riskId=${risk.riskId}, name=${risk.name}`);
      
      // Now that we have the risk, get its controls using the numeric ID
      const controls = await riskService.getControlsForRisk(risk.id);
      console.log(`Retrieved ${controls ? controls.length : 0} controls for risk`);
      
      return sendSuccess(res, controls || []);
    } catch (error) {
      console.error('Error in getControlsForRisk:', error);
      return sendError(res, error);
    }
  }

  /**
   * Get assets associated with a risk
   */
  async getAssetsForRisk(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      
      // Handle both numeric IDs and string riskIds
      if (idParam.includes('-')) {
        // This is a string ID like "RISK-DATA-123"
        const risk = await riskService.getRiskByRiskId(idParam);
        if (risk) {
          const assets = await riskService.getAssetsForRisk(risk.id);
          return sendSuccess(res, assets);
        } else {
          return sendError(res, new Error(`Risk not found with riskId: ${idParam}`));
        }
      } else {
        // This is a numeric ID
        const id = parseInt(idParam);
        if (isNaN(id)) {
          return sendError(res, new Error(`Invalid risk ID: ${idParam}`));
        }
        const assets = await riskService.getAssetsForRisk(id);
        return sendSuccess(res, assets);
      }
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Calculate risk values with updated parameters (for recalculation with form changes)
   */
  async calculateRiskWithUpdatedParams(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const updatedParams = req.body;
      
      console.log(`Recalculating risk ${idParam} with updated parameters:`, updatedParams);
      
      // Get the existing risk
      let risk = null;
      if (!isNaN(parseInt(idParam))) {
        risk = await riskService.getRiskById(parseInt(idParam));
      } else {
        risk = await riskService.getRiskByRiskId(idParam);
      }
      
      if (!risk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      // Merge existing risk with updated parameters
      const updatedRisk = { ...risk, ...updatedParams };
      
      // Calculate with updated values
      const calculatedValues = await riskService.calculateRiskValuesFromParams(updatedRisk);
      
      if (!calculatedValues) {
        return sendError(res, { message: 'Risk calculation failed' }, 500);
      }
      
      // Optionally update the risk in database with new calculated values
      if (updatedParams.saveToDatabase !== false) {
        await riskService.updateRisk(risk.id, {
          ...updatedParams,
          inherentRisk: calculatedValues.inherentRisk.toString(),
          residualRisk: calculatedValues.residualRisk.toString()
        });
      }
      
      return sendSuccess(res, calculatedValues);
    } catch (error) {
      console.error('Error in calculateRiskWithUpdatedParams:', error);
      return sendError(res, error);
    }
  }

  /**
   * Calculate risk values - delegates all calculations to service layer
   */
  async calculateRiskValues(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      
      // Delegate everything to service layer - no calculations in controller
      const result = await riskService.calculateAndUpdateRiskValues(idParam);
      
      if (!result) {
        return sendError(res, { message: 'Risk calculation failed' }, 500);
      }
      
      return sendSuccess(res, result);
    } catch (error) {
      console.error('Error in risk calculation:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Ad-hoc Monte Carlo calculation endpoint - always runs the full calculation on-demand
   * Used for immediate calculation without needing to save the risk parameters first
   */
  async runAdHocMonteCarloCalculation(req: Request, res: Response) {
    try {
      const params = req.body;
      
      if (!params) {
        return sendError(res, { message: 'Missing risk parameters for calculation' }, 400);
      }

      // Ensure all numeric parameters are properly parsed
      const numericalParams = [
        'contactFrequencyMin', 'contactFrequencyAvg', 'contactFrequencyMax',
        'probabilityOfActionMin', 'probabilityOfActionAvg', 'probabilityOfActionMax',
        'threatCapabilityMin', 'threatCapabilityAvg', 'threatCapabilityMax',
        'resistanceStrengthMin', 'resistanceStrengthAvg', 'resistanceStrengthMax',
        'primaryLossMagnitudeMin', 'primaryLossMagnitudeAvg', 'primaryLossMagnitudeMax',
        'secondaryLossEventFrequencyMin', 'secondaryLossEventFrequencyAvg', 'secondaryLossEventFrequencyMax',
        'secondaryLossMagnitudeMin', 'secondaryLossMagnitudeAvg', 'secondaryLossMagnitudeMax'
      ];

      // Safely convert all numerical parameters to numbers
      const safeParams = { ...params };
      numericalParams.forEach(param => {
        if (param in safeParams) {
          const value = safeParams[param];
          if (typeof value === 'string') {
            safeParams[param] = parseFloat(value.replace(/[^0-9.-]/g, ''));
          } else if (typeof value !== 'number') {
            safeParams[param] = 0;
          }

          // Safety check for NaN values
          if (isNaN(safeParams[param])) {
            safeParams[param] = 0;
          }
        }
      });
      
      // Process associated assets if available
      if (safeParams.associatedAssets && Array.isArray(safeParams.associatedAssets)) {
        try {
          // Look up assets to get actual values
          const assetIds = safeParams.associatedAssets.map(a => 
            typeof a === 'string' ? a : (a.assetId || a.id)
          ).filter(Boolean);
          
          if (assetIds.length > 0) {
            console.log(`Looking up assets by IDs: ${assetIds.join(', ')}`);
            // Call asset service to get full asset details
            const assetObjects = await riskService.getAssetsByIds(assetIds);
            if (assetObjects && assetObjects.length > 0) {
              safeParams.assetObjects = assetObjects;
            }
          }
        } catch (err) {
          console.error('Error looking up assets:', err);
        }
      }
      
      const calculatedValues = await riskService.runAdHocMonteCarloCalculation(safeParams);
      
      if (!calculatedValues) {
        return sendError(res, { message: 'Calculation failed - invalid parameters' }, 400);
      }
      
      // Format currency values for display
      const formattedValues = {
        ...calculatedValues,
        inherentRisk: typeof calculatedValues.inherentRisk === 'number' 
          ? calculatedValues.inherentRisk.toFixed(2) 
          : '0.00',
        residualRisk: typeof calculatedValues.residualRisk === 'number' 
          ? calculatedValues.residualRisk.toFixed(2) 
          : '0.00'
      };
      
      return sendSuccess(res, formattedValues);
    } catch (error) {
      console.error('Error in ad hoc calculation:', error);
      return sendError(res, error);
    }
  }
  /**
   * Update Secondary Loss parameters
   * Separate endpoint to specifically update secondary loss values without
   * triggering the standard risk calculation
   */
  async updateSecondaryLoss(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      const secondaryLossData = req.body;
      
      // Validate required fields
      if (!secondaryLossData.secondaryLossMagnitudeMin || 
          !secondaryLossData.secondaryLossMagnitudeAvg ||
          !secondaryLossData.secondaryLossMagnitudeMax ||
          !secondaryLossData.secondaryLossEventFrequencyMin ||
          !secondaryLossData.secondaryLossEventFrequencyAvg ||
          !secondaryLossData.secondaryLossEventFrequencyMax) {
        return sendError(res, { message: 'Missing required secondary loss parameters' }, 400);
      }
      
      // Create an update object with only the secondary loss fields
      const updateData = {
        secondaryLossMagnitudeMin: secondaryLossData.secondaryLossMagnitudeMin,
        secondaryLossMagnitudeAvg: secondaryLossData.secondaryLossMagnitudeAvg,
        secondaryLossMagnitudeMax: secondaryLossData.secondaryLossMagnitudeMax,
        secondaryLossMagnitudeConfidence: secondaryLossData.secondaryLossMagnitudeConfidence || 'medium',
        secondaryLossEventFrequencyMin: secondaryLossData.secondaryLossEventFrequencyMin,
        secondaryLossEventFrequencyAvg: secondaryLossData.secondaryLossEventFrequencyAvg,
        secondaryLossEventFrequencyMax: secondaryLossData.secondaryLossEventFrequencyMax,
        secondaryLossEventFrequencyConfidence: secondaryLossData.secondaryLossEventFrequencyConfidence || 'medium'
      };
      
      // Use the riskService.updateRisk method which properly validates and handles all DTO fields
      const updatedRisk = await riskService.updateRisk(riskId, updateData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error('Error updating secondary loss values:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Update Contact Frequency parameters
   * Separate endpoint to specifically update contact frequency values without
   * triggering the standard risk calculation
   */
  async updateContactFrequency(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      const contactFrequencyData = req.body;
      
      // Validate required fields
      if (!contactFrequencyData.contactFrequencyMin || 
          !contactFrequencyData.contactFrequencyAvg ||
          !contactFrequencyData.contactFrequencyMax) {
        return sendError(res, { message: 'Missing required contact frequency parameters' }, 400);
      }
      
      // Create an update object with only the contact frequency fields
      const updateData = {
        contactFrequencyMin: contactFrequencyData.contactFrequencyMin,
        contactFrequencyAvg: contactFrequencyData.contactFrequencyAvg,
        contactFrequencyMax: contactFrequencyData.contactFrequencyMax,
        contactFrequencyConfidence: contactFrequencyData.contactFrequencyConfidence || 'medium'
      };
      
      // Use the riskService.updateRisk method which properly validates and handles all DTO fields
      const updatedRisk = await riskService.updateRisk(riskId, updateData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error('Error updating contact frequency values:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Update Probability of Action parameters
   * Separate endpoint to specifically update probability of action values without
   * triggering the standard risk calculation
   */
  async updateProbabilityOfAction(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      const poaData = req.body;
      
      // Validate required fields
      if (!poaData.probabilityOfActionMin || 
          !poaData.probabilityOfActionAvg ||
          !poaData.probabilityOfActionMax) {
        return sendError(res, { message: 'Missing required probability of action parameters' }, 400);
      }
      
      // Create an update object with only the probability of action fields
      const updateData = {
        probabilityOfActionMin: poaData.probabilityOfActionMin,
        probabilityOfActionAvg: poaData.probabilityOfActionAvg,
        probabilityOfActionMax: poaData.probabilityOfActionMax,
        probabilityOfActionConfidence: poaData.probabilityOfActionConfidence || 'medium'
      };
      
      // Use the riskService.updateRisk method which properly validates and handles all DTO fields
      const updatedRisk = await riskService.updateRisk(riskId, updateData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error('Error updating probability of action values:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Update Threat Capability parameters
   * Separate endpoint to specifically update threat capability values without
   * triggering the standard risk calculation
   */
  async updateThreatCapability(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      const tcData = req.body;
      
      // Validate required fields
      if (!tcData.threatCapabilityMin || 
          !tcData.threatCapabilityAvg ||
          !tcData.threatCapabilityMax) {
        return sendError(res, { message: 'Missing required threat capability parameters' }, 400);
      }
      
      // Create an update object with only the threat capability fields
      const updateData = {
        threatCapabilityMin: tcData.threatCapabilityMin,
        threatCapabilityAvg: tcData.threatCapabilityAvg,
        threatCapabilityMax: tcData.threatCapabilityMax,
        threatCapabilityConfidence: tcData.threatCapabilityConfidence || 'medium'
      };
      
      // Use the riskService.updateRisk method which properly validates and handles all DTO fields
      const updatedRisk = await riskService.updateRisk(riskId, updateData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error('Error updating threat capability values:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Update Resistance Strength parameters
   * Separate endpoint to specifically update resistance strength values without
   * triggering the standard risk calculation
   */
  async updateResistanceStrength(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      const rsData = req.body;
      
      // Validate required fields
      if (!rsData.resistanceStrengthMin || 
          !rsData.resistanceStrengthAvg ||
          !rsData.resistanceStrengthMax) {
        return sendError(res, { message: 'Missing required resistance strength parameters' }, 400);
      }
      
      // Create an update object with only the resistance strength fields
      const updateData = {
        resistanceStrengthMin: rsData.resistanceStrengthMin,
        resistanceStrengthAvg: rsData.resistanceStrengthAvg,
        resistanceStrengthMax: rsData.resistanceStrengthMax,
        resistanceStrengthConfidence: rsData.resistanceStrengthConfidence || 'medium'
      };
      
      // Use the riskService.updateRisk method which properly validates and handles all DTO fields
      const updatedRisk = await riskService.updateRisk(riskId, updateData);
      
      if (!updatedRisk) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error('Error updating resistance strength values:', error);
      return sendError(res, error);
    }
  }
}

export const riskController = new RiskController();