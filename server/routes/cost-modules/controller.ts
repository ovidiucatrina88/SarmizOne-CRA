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
   * Get new cost module form data
   */
  async getNewCostModuleForm(req: Request, res: Response) {
    try {
      // Return form metadata and options for creating a new cost module
      const formData = {
        costTypes: [
          { value: 'fixed', label: 'Fixed Cost', description: 'One-time cost regardless of impact size' },
          { value: 'per_event', label: 'Per Event', description: 'Cost applied per occurrence' },
          { value: 'per_hour', label: 'Per Hour', description: 'Hourly cost rate' },
          { value: 'percentage', label: 'Percentage', description: 'Percentage of total loss' }
        ],
        cisControls: [
          '1.1', '1.2', '1.3', '1.4', '1.5',
          '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
          '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12',
          '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12',
          '5.1', '5.2', '5.3', '5.4', '5.5',
          '6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8',
          '7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7',
          '8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10', '8.11', '8.12',
          '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7',
          '10.1', '10.2', '10.3', '10.4', '10.5', '10.6', '10.7',
          '11.1', '11.2', '11.3', '11.4', '11.5',
          '12.1', '12.2', '12.3', '12.4', '12.5', '12.6', '12.7', '12.8',
          '13.1', '13.2', '13.3', '13.4', '13.5', '13.6', '13.7', '13.8', '13.9', '13.10', '13.11',
          '14.1', '14.2', '14.3', '14.4', '14.5', '14.6', '14.7', '14.8', '14.9',
          '15.1', '15.2', '15.3', '15.4', '15.5', '15.6', '15.7',
          '16.1', '16.2', '16.3', '16.4', '16.5', '16.6', '16.7', '16.8', '16.9', '16.10', '16.11', '16.12', '16.13', '16.14',
          '17.1', '17.2', '17.3', '17.4', '17.5', '17.6', '17.7', '17.8', '17.9',
          '18.1', '18.2', '18.3', '18.4', '18.5',
          '19.1', '19.2', '19.3', '19.4', '19.5', '19.6', '19.7'
        ]
      };
      
      return sendSuccess(res, formData);
    } catch (error) {
      console.error('Error getting new cost module form:', error);
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