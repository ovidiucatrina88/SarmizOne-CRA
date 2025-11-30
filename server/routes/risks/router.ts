import express from 'express';
// import { canWriteOtherResources } from '../../auth';
import { validate, validateId } from '../common/middleware/validate';
import { riskController } from './controller';
import { createRiskSchema, updateRiskSchema, riskFilterSchema } from './dto';

const router = express.Router();

// Get all risks with optional filtering
router.get('/',

  validate(riskFilterSchema),
  riskController.getAllRisks.bind(riskController)
);

// Get risk summary statistics
router.get('/summary',
  riskController.getRiskSummary.bind(riskController)
);

// Get a single risk by ID
router.get('/:id',

  validateId,
  riskController.getRiskById.bind(riskController)
);

// Create a new risk
router.post('/',


  validate(createRiskSchema),
  riskController.createRisk.bind(riskController)
);

// Update an existing risk
router.put('/:id',


  validateId,
  validate(updateRiskSchema),
  riskController.updateRisk.bind(riskController)
);

// Delete a risk
router.delete('/:id',


  validateId,
  riskController.deleteRisk.bind(riskController)
);

// Get controls associated with a risk
router.get('/:id/controls',

  validateId,
  riskController.getControlsForRisk.bind(riskController)
);

// Get assets associated with a risk
router.get('/:id/assets',

  validateId,
  riskController.getAssetsForRisk.bind(riskController)
);

// Calculate risk values for existing risk
router.get('/:id/calculate',

  validateId,
  riskController.calculateRiskValues.bind(riskController)
);

// Ad-hoc Monte Carlo calculation endpoint
router.post('/calculate/monte-carlo',

  riskController.runAdHocMonteCarloCalculation.bind(riskController)
);

// Update secondary loss values separately
router.post('/:id/secondary-loss',


  validateId,
  riskController.updateSecondaryLoss.bind(riskController)
);

// Update contact frequency values separately
router.post('/:id/contact-frequency',


  validateId,
  riskController.updateContactFrequency.bind(riskController)
);

// Update probability of action values separately
router.post('/:id/probability-of-action',


  validateId,
  riskController.updateProbabilityOfAction.bind(riskController)
);

// Update threat capability values separately
router.post('/:id/threat-capability',


  validateId,
  riskController.updateThreatCapability.bind(riskController)
);

// Update resistance strength values separately
router.post('/:id/resistance-strength',


  validateId,
  riskController.updateResistanceStrength.bind(riskController)
);

export default router;