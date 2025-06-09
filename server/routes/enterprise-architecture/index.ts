import express, { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses';
import { db } from '../../db';
import { 
  enterpriseArchitecture, 
  EnterpriseArchitecture,
  insertEnterpriseArchitectureSchema
} from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

// Get all enterprise architecture items
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await db.select().from(enterpriseArchitecture);
    return sendSuccess(res, items);
  } catch (error) {
    return sendError(res, 'Error fetching enterprise architecture items', error);
  }
});

// Get a specific item
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format');
    }
    
    const [item] = await db.select().from(enterpriseArchitecture).where(eq(enterpriseArchitecture.id, id));
    
    if (!item) {
      return sendError(res, 'Item not found');
    }
    
    return sendSuccess(res, item);
  } catch (error) {
    return sendError(res, 'Error fetching enterprise architecture item', error);
  }
});

// Create a new item
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = insertEnterpriseArchitectureSchema.safeParse(req.body);
    
    if (!validation.success) {
      return sendError(res, 'Validation error', validation.error);
    }
    
    const data = validation.data;
    
    // Auto-generate assetId if not provided
    if (!data.assetId) {
      const prefix = getAssetPrefix(data.type);
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      data.assetId = `${prefix}-${randomId}`;
    }
    
    const [newItem] = await db.insert(enterpriseArchitecture).values(data).returning();
    
    return sendSuccess(res, newItem);
  } catch (error) {
    return sendError(res, 'Error creating enterprise architecture item', error);
  }
});

// Update an item
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format');
    }
    
    // Validate the input data
    const validation = insertEnterpriseArchitectureSchema.safeParse(req.body);
    
    if (!validation.success) {
      return sendError(res, 'Validation error', validation.error);
    }
    
    const data = validation.data;
    
    // Update the item
    const [updatedItem] = await db
      .update(enterpriseArchitecture)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(enterpriseArchitecture.id, id))
      .returning();
    
    if (!updatedItem) {
      return sendError(res, 'Item not found', null, 404);
    }
    
    return sendSuccess(res, updatedItem);
  } catch (error) {
    return sendError(res, 'Error updating enterprise architecture item', error);
  }
});

// Delete an item
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format');
    }
    
    const [deletedItem] = await db
      .delete(enterpriseArchitecture)
      .where(eq(enterpriseArchitecture.id, id))
      .returning();
    
    if (!deletedItem) {
      return sendError(res, 'Item not found', null, 404);
    }
    
    return sendSuccess(res, { message: 'Item deleted successfully', id });
  } catch (error) {
    return sendError(res, 'Error deleting enterprise architecture item', error);
  }
});

// Helper function for asset ID prefixes
function getAssetPrefix(type: string): string {
  switch (type) {
    case 'strategic_capability': 
      return 'SC';
    case 'value_capability': 
      return 'VC';
    case 'business_service': 
      return 'BS';
    case 'product_service': 
      return 'PS';
    default: 
      return 'EA';
  }
}

export default router;