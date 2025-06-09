import express from 'express';
import { dashboardController } from './controller';
import { isAuthenticated } from '../../auth';

const router = express.Router();

// GET /api/dashboard/summary - Get dashboard summary statistics
router.get('/summary', 
  isAuthenticated,
  dashboardController.getDashboardSummary.bind(dashboardController)
);

// GET /api/dashboard/risk-summary - Get risk summary data for charts
router.get('/risk-summary', 
  isAuthenticated,
  dashboardController.getRiskSummary.bind(dashboardController)
);

// GET /api/risk-summary/latest - Get latest risk summary data for Loss Exceedance Curve
router.get('/risk-summary/latest', 
  isAuthenticated,
  dashboardController.getLatestRiskSummary.bind(dashboardController)
);

export default router;