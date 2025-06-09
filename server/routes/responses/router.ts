import express from 'express';
import { canWriteOtherResources } from '../../auth';
import { validate, validateId } from '../common/middleware/validate';
import { responseController } from './controller';
import { createResponseSchema, updateResponseSchema, responseFilterSchema } from './dto';

const router = express.Router();

// Get all responses with optional filtering
router.get('/',
  
  validate(responseFilterSchema),
  responseController.getAllResponses.bind(responseController)
);

// Get a single response by ID
router.get('/:id',
  
  validateId,
  responseController.getResponseById.bind(responseController)
);

// Get the response associated with a risk
router.get('/risk/:riskId',
  
  responseController.getResponseByRiskId.bind(responseController)
);

// Create a new response
router.post('/',
  
  
  validate(createResponseSchema),
  responseController.createResponse.bind(responseController)
);

// Update an existing response
router.put('/:id',
  
  
  validateId,
  validate(updateResponseSchema),
  responseController.updateResponse.bind(responseController)
);

// Delete a response
router.delete('/:id',
  
  
  validateId,
  responseController.deleteResponse.bind(responseController)
);

export default router;