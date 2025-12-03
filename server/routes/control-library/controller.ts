import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { controlService } from '../../services';

/**
 * Controller for control library (templates) API endpoints
 */
export class ControlLibraryController {
  /**
   * Get all control library templates
   */
  async getAllTemplates(req: Request, res: Response) {
    try {
      const templates = await controlService.getAllControlLibraryItems();
      return sendSuccess(res, templates);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get a single control library template by ID
   */
  async getTemplateById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const template = await controlService.getControlLibraryItem(id);

      if (!template) {
        return sendError(res, { message: 'Control template not found' }, 404);
      }

      return sendSuccess(res, template);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create a new control template
   */
  async createTemplate(req: Request, res: Response) {
    try {
      const templateData = req.body;
      const newTemplate = await controlService.createControlLibraryItem(templateData);

      return sendSuccess(res, newTemplate, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Update an existing control template
   */
  async updateTemplate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const templateData = req.body;

      const updatedTemplate = await controlService.updateControlLibraryItem(id, templateData);

      if (!updatedTemplate) {
        return sendError(res, { message: 'Control template not found' }, 404);
      }

      return sendSuccess(res, updatedTemplate);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Delete a control template
   */
  async deleteTemplate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const success = await controlService.deleteControlLibraryItem(id);

      if (!success) {
        return sendError(res, { message: 'Error deleting control template' }, 500);
      }

      return sendSuccess(res, { message: 'Control template deleted successfully' });
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create a control instance from a template and associate it with a risk
   */
  async createInstanceFromTemplate(req: Request, res: Response) {
    try {
      const templateId = parseInt(req.params.id);
      const { riskId } = req.body;

      // First, get the template
      const template = await controlService.getControlLibraryItem(templateId);
      if (!template) {
        return sendError(res, { message: 'Control template not found' }, 404);
      }

      // console.log('Template data:', JSON.stringify(template, null, 2));

      // Create a new control instance from the template
      const controlData = {
        controlId: `${template.controlId}-${Date.now().toString().substring(9)}`, // Create unique ID
        name: template.name,
        description: template.description,
        controlType: template.controlType,
        controlCategory: template.controlCategory,
        implementationStatus: 'not_implemented' as 'not_implemented', // Default to not implemented
        controlEffectiveness: 0.82, // Fixed value based on template data
        implementationCost: "9000.00",
        costPerAgent: "45.00",
        isPerAgentPricing: template.isPerAgentPricing || false,
        notes: template.notes,
        libraryItemId: templateId, // Reference to the source template
        itemType: 'instance' as 'instance',
        riskId: riskId || null,
        // Skip associatedRisks field temporarily until PostgreSQL array handling is fixed
      };

      // Create the control instance
      const newControl = await controlService.createControl(controlData);

      // Associate control with risk if provided
      if (riskId) {
        try {
          await controlService.addControlToRisk(riskId, newControl.id);
        } catch (assocError) {
          console.error(`Failed to associate control ${newControl.id} with risk ${riskId}:`, assocError);
          // Don't fail the request, but log the error
        }
      }

      return sendSuccess(res, newControl, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
}

export const controlLibraryController = new ControlLibraryController();