import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { riskService } from '../../services';

/**
 * Controller for risk library API endpoints
 * Uses the service architecture for improved separation of concerns
 */
export class RiskLibraryController {
  /**
   * Get all risk library templates
   */
  async getAllRiskLibraryItems(req: Request, res: Response) {
    try {
      const items = await riskService.getAllRiskLibraryItems();
      return sendSuccess(res, items);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get a single risk library template by ID
   */
  async getRiskLibraryItemById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const item = await riskService.getRiskLibraryItem(id);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create a new risk library template
   */
  async createRiskLibraryItem(req: Request, res: Response) {
    try {
      const data = req.body;
      const item = await riskService.createRiskLibraryItem(data);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Update an existing risk library template
   */
  async updateRiskLibraryItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const item = await riskService.updateRiskLibraryItem(id, data);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Delete a risk library template
   */
  async deleteRiskLibraryItem(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await riskService.deleteRiskLibraryItem(id);
      return sendSuccess(res, { message: 'Risk library item deleted successfully' });
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Create risk instance from template
   */
  async createRiskFromTemplate(req: Request, res: Response) {
    try {
      const templateId = parseInt(req.params.id);
      const { assetId } = req.body;
      
      if (!templateId || !assetId) {
        return sendError(res, new Error('Template ID and Asset ID are required'));
      }

      const risk = await riskService.createRiskFromTemplate(templateId, assetId);
      return sendSuccess(res, risk);
    } catch (error) {
      return sendError(res, error);
    }
  }
}

// Create a single instance of the controller
export const riskLibraryController = new RiskLibraryController();