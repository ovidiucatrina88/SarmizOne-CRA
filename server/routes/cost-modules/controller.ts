import { Request, Response } from 'express';
import { db } from '../../db';
import { eq, sql } from 'drizzle-orm';

// Send a success response with data
const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

// Send an error response
const sendError = (res: Response, error: any, statusCode = 500) => {
  // Format error message
  const message = error.message || 'An unexpected error occurred';
  
  // Log server errors
  if (statusCode >= 500) {
    console.error(`Server error: ${message}`, error);
  }
  
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: error.code,
      details: error.details || undefined
    }
  });
};

/**
 * Cost Modules Controller
 * 
 * Handles API requests for cost modules used in FAIR-MAM risk cost calculations
 */
export class CostModulesController {
  /**
   * Get all cost modules
   */
  async getAllCostModules(req: Request, res: Response) {
    try {
      // Add query performance optimization with index hint and limit columns
      const results = await db.execute(sql`
        SELECT id, name, cis_control, cost_factor, cost_type, description 
        FROM cost_modules 
        ORDER BY name
        LIMIT 100
      `);
      
      console.log(`Retrieved ${results.rows.length} cost modules`);
      return sendSuccess(res, results.rows);
    } catch (error) {
      console.error('Error getting cost modules:', error);
      return sendError(res, error);
    }
  }

  /**
   * Get cost module by ID
   */
  async getCostModuleById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError(res, { message: 'Invalid ID format' }, 400);
      }

      const result = await db.execute(sql`
        SELECT * FROM cost_modules WHERE id = ${id}
      `);
      
      if (!result.rows.length) {
        return sendError(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      
      return sendSuccess(res, result.rows[0]);
    } catch (error) {
      console.error('Error getting cost module:', error);
      return sendError(res, error);
    }
  }

  /**
   * Create new cost module
   */
  async createCostModule(req: Request, res: Response) {
    try {
      const { name, cisControl, costFactor, costType, description = '' } = req.body;
      
      if (!name || !cisControl || !costFactor || !costType) {
        return sendError(res, { message: 'Missing required fields' }, 400);
      }
      
      // Validate cost type
      const validCostTypes = ['fixed', 'per_event', 'per_hour', 'percentage'];
      if (!validCostTypes.includes(costType)) {
        return sendError(res, { message: 'Invalid cost type. Must be one of: fixed, per_event, per_hour, percentage' }, 400);
      }
      
      // Process cisControl to ensure it's properly formatted as text[] for PostgreSQL
      try {
        // Convert to array if it's not already
        const cisControlArray = Array.isArray(cisControl) 
          ? cisControl 
          : (typeof cisControl === 'string' ? JSON.parse(cisControl) : [cisControl]);
        
        // Use SQL array constructor for proper PostgreSQL array typing
        const cisControlValue = sql`ARRAY[${sql.join(cisControlArray, sql`,`)}]::text[]`;
        
        const result = await db.execute(sql`
          INSERT INTO cost_modules (name, cis_control, cost_factor, cost_type, description)
          VALUES (${name}, ${cisControlValue}, ${costFactor}, ${costType}, ${description})
          RETURNING *
        `);
        
        return sendSuccess(res, result.rows[0], 201);
      } catch (e) {
        console.error('Error processing cisControl:', e);
        return sendError(res, { message: 'Invalid cisControl format' }, 400);
      }
    } catch (error) {
      console.error('Error creating cost module:', error);
      return sendError(res, error);
    }
  }

  /**
   * Update existing cost module
   */
  async updateCostModule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError(res, { message: 'Invalid ID format' }, 400);
      }
      
      // Check if module exists
      const existingResult = await db.execute(sql`
        SELECT * FROM cost_modules WHERE id = ${id}
      `);
      
      if (!existingResult.rows.length) {
        return sendError(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      
      const existing = existingResult.rows[0];
      const { name, cisControl, costFactor, costType, description } = req.body;
      
      // Process cisControl to ensure it's properly formatted as text[] for PostgreSQL
      let cisControlValue = existing.cis_control;
      if (cisControl !== undefined) {
        try {
          // Convert to array if it's not already
          const cisControlArray = Array.isArray(cisControl) 
            ? cisControl 
            : (typeof cisControl === 'string' ? JSON.parse(cisControl) : [cisControl]);
          
          // Use SQL array constructor for proper PostgreSQL array typing
          cisControlValue = sql`ARRAY[${sql.join(cisControlArray, sql`,`)}]::text[]`;
        } catch (e) {
          console.error('Error processing cisControl:', e);
          return sendError(res, { message: 'Invalid cisControl format' }, 400);
        }
      }
      
      // Build SET part of update query based on provided fields
      const updateResult = await db.execute(sql`
        UPDATE cost_modules
        SET 
          name = ${name !== undefined ? name : existing.name},
          ${cisControl !== undefined ? sql`cis_control = ${cisControlValue},` : sql``}
          cost_factor = ${costFactor !== undefined ? costFactor : existing.cost_factor},
          cost_type = ${costType !== undefined ? costType : existing.cost_type},
          description = ${description !== undefined ? description : existing.description}
        WHERE id = ${id}
        RETURNING *
      `);
      
      return sendSuccess(res, updateResult.rows[0]);
    } catch (error) {
      console.error('Error updating cost module:', error);
      return sendError(res, error);
    }
  }

  /**
   * Delete cost module
   */
  async deleteCostModule(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError(res, { message: 'Invalid ID format' }, 400);
      }
      
      // Check if module exists before attempting to delete
      const existingResult = await db.execute(sql`
        SELECT id FROM cost_modules WHERE id = ${id}
      `);
      
      if (!existingResult.rows.length) {
        return sendError(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      
      // Delete the module
      await db.execute(sql`
        DELETE FROM cost_modules WHERE id = ${id}
      `);
      
      return sendSuccess(res, { message: 'Cost module deleted successfully' });
    } catch (error) {
      console.error('Error deleting cost module:', error);
      return sendError(res, error);
    }
  }
}

export default new CostModulesController();