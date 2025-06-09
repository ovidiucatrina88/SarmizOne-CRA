import { Request, Response } from 'express';
import { dashboardService } from './service';
import { sendSuccess, sendError } from '../common/responses/apiResponse';

/**
 * Controller for dashboard-related endpoints
 */
export class DashboardController {
  /**
   * Get dashboard summary data
   */
  async getDashboardSummary(req: Request, res: Response) {
    try {
      const summary = await dashboardService.getDashboardSummary();
      sendSuccess(res, summary);
    } catch (error) {
      sendError(res, error);
    }
  }

  /**
   * Get risk summary data for charts
   */
  async getRiskSummary(req: Request, res: Response) {
    try {
      const summary = await dashboardService.getRiskSummary();
      sendSuccess(res, summary);
    } catch (error) {
      sendError(res, error);
    }
  }
  
  /**
   * Get latest risk summary for Loss Exceedance Curve
   */
  async getLatestRiskSummary(req: Request, res: Response) {
    try {
      const summary = await dashboardService.getRiskSummary();
      sendSuccess(res, summary);
    } catch (error) {
      sendError(res, error);
    }
  }
}

// Export a singleton instance
export const dashboardController = new DashboardController();