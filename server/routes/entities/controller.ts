import { Request, Response } from 'express';
import * as entityService from './service';
import { sendSuccess, sendError } from '../common/responses/apiResponse';

/**
 * Get all legal entities
 */
export async function getAllEntities(req: Request, res: Response) {
  try {
    const entities = await entityService.getAllEntities();
    sendSuccess(res, entities);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Get legal entity by ID
 */
export async function getEntityById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const entity = await entityService.getEntityById(id);
    
    if (!entity) {
      return sendError(res, { 
        status: 404, 
        message: 'Legal entity not found',
        details: `No legal entity found with ID ${id}`
      });
    }
    
    sendSuccess(res, entity);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Create a new legal entity
 */
export async function createEntity(req: Request, res: Response) {
  try {
    const entityData = req.body;
    const newEntity = await entityService.createEntity(entityData);
    sendSuccess(res, newEntity, 201);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Update an existing legal entity
 */
export async function updateEntity(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    // Check if entity exists
    const existingEntity = await entityService.getEntityById(id);
    if (!existingEntity) {
      return sendError(res, { 
        status: 404, 
        message: 'Legal entity not found',
        details: `No legal entity found with ID ${id}`
      });
    }
    
    const updatedEntity = await entityService.updateEntity(id, updateData);
    sendSuccess(res, updatedEntity);
  } catch (error) {
    sendError(res, error);
  }
}

/**
 * Delete a legal entity
 */
export async function deleteEntity(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    
    // Check if entity exists
    const existingEntity = await entityService.getEntityById(id);
    if (!existingEntity) {
      return sendError(res, { 
        status: 404, 
        message: 'Legal entity not found',
        details: `No legal entity found with ID ${id}`
      });
    }
    
    await entityService.deleteEntity(id);
    sendSuccess(res, { 
      message: 'Legal entity deleted successfully', 
      id 
    });
  } catch (error) {
    sendError(res, error);
  }
}