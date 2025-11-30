import express from 'express';
// import { canWriteOtherResources } from '../../auth';
import { validate, validateId } from '../common/middleware/validate';
import { controlController } from './controller';
import { createControlSchema, updateControlSchema, controlFilterSchema } from './dto';

const router = express.Router();

// Get all controls with optional filtering
router.get('/',

  validate(controlFilterSchema),
  controlController.getAllControls.bind(controlController)
);

// Get control summary statistics
router.get('/summary',
  controlController.getControlSummary.bind(controlController)
);

// Get a single control by ID
router.get('/:id',

  validateId,
  controlController.getControlById.bind(controlController)
);

// Create a new control
router.post('/',


  validate(createControlSchema),
  controlController.createControl.bind(controlController)
);

// Update an existing control
router.put('/:id',


  validateId,
  validate(updateControlSchema),
  controlController.updateControl.bind(controlController)
);

// Delete a control
router.delete('/:id',


  validateId,
  controlController.deleteControl.bind(controlController)
);

// Get risks associated with a control
router.get('/:id/risks',

  validateId,
  controlController.getRisksForControl.bind(controlController)
);

export default router;