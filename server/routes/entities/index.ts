import express from 'express';
// import { canWriteOtherResources } from '../../auth';
import { storage } from '../../services/storage';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { validate, validateId } from '../common/middleware/validate';
import { z } from 'zod';

const router = express.Router();

// Entity validation schema
const entitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  entityId: z.string().min(1, 'Entity ID is required'),
  parentEntityId: z.string().nullable().optional()
});

// Get all legal entities
router.get('/', async (req, res) => {
  try {
    const entities = await storage.getAllLegalEntities();
    return sendSuccess(res, entities);
  } catch (error) {
    return sendError(res, error);
  }
});

// Get a single legal entity
router.get('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entity = await storage.getLegalEntity(id);
    
    if (!entity) {
      return sendError(res, { message: 'Legal entity not found' }, 404);
    }
    
    return sendSuccess(res, entity);
  } catch (error) {
    return sendError(res, error);
  }
});

// Create a new legal entity
router.post('/', 
  validate(entitySchema), async (req, res) => {
  try {
    const entity = req.body;
    const newEntity = await storage.createLegalEntity(entity);
    return sendSuccess(res, newEntity, 201);
  } catch (error) {
    return sendError(res, error);
  }
});

// Update a legal entity
router.put('/:id', 
  validateId, validate(entitySchema), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entity = req.body;
    
    const updatedEntity = await storage.updateLegalEntity(id, entity);
    
    if (!updatedEntity) {
      return sendError(res, { message: 'Legal entity not found' }, 404);
    }
    
    return sendSuccess(res, updatedEntity);
  } catch (error) {
    return sendError(res, error);
  }
});

// Delete a legal entity
router.delete('/:id', validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if there are any associated assets before deletion
    const allAssets = await storage.getAllAssets();
    const associatedAssets = allAssets.filter((asset: any) => asset.legalEntity === id.toString());
    
    if (associatedAssets.length > 0) {
      return sendError(res, { 
        message: 'Cannot delete entity with associated assets',
        associatedAssets 
      }, 400);
    }
    
    const deleted = await storage.deleteLegalEntity(id);
    
    if (!deleted) {
      return sendError(res, { message: 'Legal entity not found' }, 404);
    }
    
    return sendSuccess(res, { message: 'Legal entity deleted successfully' });
  } catch (error) {
    return sendError(res, error);
  }
});

export default router;