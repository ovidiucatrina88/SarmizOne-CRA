import express from 'express';
// import { canWriteOtherResources } from '../../auth';
import { validateId, validate } from '../common/middleware/validate';
import * as entityController from './controller';
import { entitySchema, entityUpdateSchema } from './dto';

const router = express.Router();

// Get all legal entities
router.get('/', 
  
  entityController.getAllEntities
);

// Get legal entity by ID
router.get('/:id',
  
  validateId,
  entityController.getEntityById
);

// Create new legal entity
router.post('/',
  
  
  validate(entitySchema),
  entityController.createEntity
);

// Update legal entity
router.put('/:id',
  
  
  validateId,
  validate(entityUpdateSchema),
  entityController.updateEntity
);

// Delete legal entity
router.delete('/:id',
  
  
  validateId,
  entityController.deleteEntity
);

export default router;