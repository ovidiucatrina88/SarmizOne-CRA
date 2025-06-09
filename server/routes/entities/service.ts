import { storage } from '../../services/storage';
import { Entity, EntityUpdate } from './dto';

/**
 * Get all legal entities
 */
export async function getAllEntities(): Promise<Entity[]> {
  return await storage.getAllLegalEntities();
}

/**
 * Get legal entity by ID
 */
export async function getEntityById(id: number): Promise<Entity | null> {
  return await storage.getLegalEntity(id);
}

/**
 * Create a new legal entity
 */
export async function createEntity(entityData: Entity): Promise<Entity> {
  // Auto-generate entity ID if not provided
  if (!entityData.entityId || entityData.entityId.trim() === '') {
    const entities = await storage.getAllLegalEntities();
    const nextId = entities.length + 1;
    entityData.entityId = `ENT-${nextId.toString().padStart(3, '0')}`;
  }
  
  return await storage.createLegalEntity(entityData);
}

/**
 * Update an existing legal entity
 */
export async function updateEntity(id: number, updateData: EntityUpdate): Promise<Entity | null> {
  // Get existing entity
  const entity = await storage.getLegalEntity(id);
  if (!entity) {
    throw { status: 404, message: 'Legal entity not found' };
  }
  
  // Update entity
  const updatedEntity = await storage.updateLegalEntity(id, updateData);
  
  // Log activity
  await storage.createActivityLog({
    activity: 'Updated legal entity',
    user: 'System User',
    entity: entity.name,
    entityType: 'legal-entity',
    entityId: entity.entityId,
  });
  
  return updatedEntity;
}

/**
 * Delete a legal entity
 */
export async function deleteEntity(id: number): Promise<{ success: boolean, message: string }> {
  // Get existing entity
  const entity = await storage.getLegalEntity(id);
  if (!entity) {
    throw { status: 404, message: 'Legal entity not found' };
  }
  
  // Delete entity
  const deleted = await storage.deleteLegalEntity(id);
  
  if (deleted) {
    // Log activity
    await storage.createActivityLog({
      activity: 'Deleted legal entity',
      user: 'System User',
      entity: entity.name,
      entityType: 'legal-entity',
      entityId: entity.entityId,
    });
    
    return { 
      success: true,
      message: 'Legal entity deleted successfully'
    };
  }
  
  throw { status: 500, message: 'Failed to delete legal entity' };
}