import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { controlService, riskService } from '../../services';
import { ControlFilterDto, CreateControlDto, UpdateControlDto } from './dto';
import { generateTrend } from '../../utils/trends';

/**
 * Controller for control-related API endpoints
 * Uses the new service architecture for improved separation of concerns
 */
export class ControlController {
  /**
   * Get all controls with optional filtering
   */
  async getAllControls(req: Request, res: Response) {
    try {
      const filters = req.query as unknown as ControlFilterDto;
      const controls = await controlService.getAllControls(filters);
      return sendSuccess(res, controls);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get control summary statistics
   */
  async getControlSummary(req: Request, res: Response) {
    try {
      const controls = await controlService.getAllControls({});

      // Filter to only show instances (not templates)
      const controlInstances = controls.filter(c => c.itemType === 'instance' || !c.itemType);

      const total = controlInstances.length;
      const fully = controlInstances.filter((c) => c.implementationStatus === "fully_implemented").length;
      const progress = controlInstances.filter((c) => c.implementationStatus === "in_progress").length;
      const corrective = controlInstances.filter((c) => c.controlType === "corrective").length;
      const totalCost = controlInstances.reduce((sum, control) => sum + Number(control.implementationCost || 0), 0);

      const trends = {
        total: generateTrend(total),
        fully: generateTrend(fully),
        progress: generateTrend(progress),
        corrective: generateTrend(corrective),
        totalCost: generateTrend(totalCost)
      };

      return sendSuccess(res, {
        stats: { total, fully, progress, corrective, totalCost },
        trends
      });
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get a single control by ID
   */
  async getControlById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const control = await controlService.getControl(id);

      if (!control) {
        return sendError(res, { message: 'Control not found' }, 404);
      }

      return sendSuccess(res, control);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create a new control
   */
  async createControl(req: Request, res: Response) {
    try {
      const controlData: CreateControlDto = req.body;

      // The service layer now handles all risk recalculations internally
      const newControl = await controlService.createControl(controlData);

      return sendSuccess(res, newControl, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Update an existing control
   */
  async updateControl(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      console.log("Controller received update request for control ID:", id);
      console.log("Raw request body BEFORE typing:", JSON.stringify(req.body, null, 2));

      const controlData: UpdateControlDto = req.body;
      console.log("Update data AFTER typing:", JSON.stringify(controlData, null, 2));

      // Add direct SQL update for control effectiveness and implementation cost values if they exist
      if (typeof controlData.controlEffectiveness === 'number' ||
        typeof controlData.e_avoid === 'number' ||
        typeof controlData.e_deter === 'number' ||
        typeof controlData.e_detect === 'number' ||
        typeof controlData.e_resist === 'number' ||
        controlData.implementationCost !== undefined) {

        try {
          // Get existing control
          const control = await controlService.getControl(id);
          if (!control) {
            return sendError(res, { message: 'Control not found' }, 404);
          }

          // Construct an update object with only the fields that are provided
          const updateData: any = {};

          if (typeof controlData.controlEffectiveness === 'number') {
            updateData.controlEffectiveness = controlData.controlEffectiveness;
          }

          if (typeof controlData.e_avoid === 'number') {
            updateData.e_avoid = controlData.e_avoid;
          }

          if (typeof controlData.e_deter === 'number') {
            updateData.e_deter = controlData.e_deter;
          }

          if (typeof controlData.e_detect === 'number') {
            updateData.e_detect = controlData.e_detect;
          }

          if (typeof controlData.e_resist === 'number') {
            updateData.e_resist = controlData.e_resist;
          }

          // Include implementation cost in the update
          if (controlData.implementationCost !== undefined) {
            updateData.implementationCost = controlData.implementationCost;
          }

          // Include implementation status in the update
          if (controlData.implementationStatus !== undefined) {
            updateData.implementationStatus = controlData.implementationStatus;
          }

          console.log("Processing cost fields for status:", controlData.implementationStatus);

          // Business Logic: Database insertion rules based on implementation status
          if (controlData.implementationStatus === "fully_implemented") {
            // Fully Implemented: Save either implementationCost OR agent-based cost
            if (controlData.isPerAgentPricing) {
              // Agent-based cost for fully implemented
              updateData.costPerAgent = controlData.costPerAgent || 0;
              updateData.isPerAgentPricing = true;
              updateData.implementationCost = 0; // Clear total cost
              updateData.deployedAgentCount = 0; // Clear deployed count
              console.log("Fully implemented - agent-based cost:", controlData.costPerAgent);
            } else {
              // Total cost for fully implemented
              updateData.implementationCost = controlData.implementationCost || 0;
              updateData.isPerAgentPricing = false;
              updateData.costPerAgent = 0; // Clear agent cost
              updateData.deployedAgentCount = 0; // Clear deployed count
              console.log("Fully implemented - total cost:", controlData.implementationCost);
            }
          } else if (controlData.implementationStatus === "in_progress") {
            // In Progress: Save deployedAgentCount + costPerAgent
            updateData.deployedAgentCount = controlData.deployedAgentCount || 0;
            updateData.costPerAgent = controlData.costPerAgent || 0;
            updateData.isPerAgentPricing = true; // In progress assumes agent-based
            updateData.implementationCost = 0; // Clear total cost
            console.log("In progress - deployed agents:", controlData.deployedAgentCount, "cost per agent:", controlData.costPerAgent);
          } else {
            // Not implemented or other status - clear all cost fields
            updateData.implementationCost = 0;
            updateData.costPerAgent = 0;
            updateData.deployedAgentCount = 0;
            updateData.isPerAgentPricing = false;
            console.log("Other status - clearing all cost fields");
          }

          console.log("Using filtered update data:", updateData);

          // The service layer now handles all risk recalculations internally
          const updatedControl = await controlService.updateControl(id, updateData);

          if (!updatedControl) {
            return sendError(res, { message: 'Control update failed' }, 500);
          }

          return sendSuccess(res, updatedControl);
        } catch (error) {
          console.error("Error updating control effectiveness:", error);
          return sendError(res, error);
        }
      } else {
        // Regular update path
        const updatedControl = await controlService.updateControl(id, controlData);

        if (!updatedControl) {
          return sendError(res, { message: 'Control not found' }, 404);
        }

        return sendSuccess(res, updatedControl);
      }
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Delete a control
   */
  async deleteControl(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      // The service layer now handles control existence checks, risk recalculations, and logging
      const success = await controlService.deleteControl(id);

      if (!success) {
        return sendError(res, { message: 'Error deleting control' }, 500);
      }

      return sendSuccess(res, { message: 'Control deleted successfully' });
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get risks associated with a control
   */
  async getRisksForControl(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const risks = await controlService.getRisksForControl(id);
      return sendSuccess(res, risks);
    } catch (error) {
      return sendError(res, error);
    }
  }
}

export const controlController = new ControlController();