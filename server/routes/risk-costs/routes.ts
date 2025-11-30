import express from 'express';
import controller from './controller';
import { getRiskCostSummary } from './summary';
import { canWriteOtherResources } from '../../auth';

const router = express.Router();

// Get risk cost summary
router.get('/summary', getRiskCostSummary);

// Get cost assignments for a specific risk
router.get('/:id',

  controller.getRiskCosts.bind(controller)
);

// Calculate cost impact for a specific risk
router.get('/:id/calculate',

  controller.calculateCostImpact.bind(controller)
);

// Save cost assignments for a specific risk
router.post('/:id',


  controller.saveRiskCosts.bind(controller)
);

// Calculate costs for all risks (for dashboard)
router.get('/calculate/all',

  controller.calculateAllRiskCosts.bind(controller)
);

export default router;