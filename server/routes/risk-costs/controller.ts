import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses';
import { sql } from 'drizzle-orm';
import { db } from '../../db';

class RiskCostsController {
  /**
   * Get risk cost assignments for a specific risk
   */
  async getRiskCosts(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError(res, { message: 'Invalid risk ID format' }, 400);
      }
      
      console.log(`Retrieving risk costs for risk ID: ${riskId}`);
      
      // Join with cost_modules to get full details
      const result = await db.execute(sql`
        SELECT rc.*, cm.name as module_name, cm.cost_type, cm.cost_factor, cm.cis_control
        FROM risk_costs rc
        JOIN cost_modules cm ON rc.cost_module_id = cm.id
        WHERE rc.risk_id = ${riskId}
      `);
      
      console.log(`Found ${result.rows.length} risk cost assignments for risk ID ${riskId}`);
      
      return sendSuccess(res, result.rows);
    } catch (error) {
      console.error('Error fetching risk costs:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Calculate total cost impact for a specific risk based on assigned cost modules
   */
  async calculateCostImpact(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError(res, { message: 'Invalid risk ID format' }, 400);
      }
      
      // Get risk details to determine materiality
      const riskResult = await db.execute(sql`
        SELECT inherent_risk, residual_risk FROM risks WHERE id = ${riskId}
      `);
      
      if (!riskResult.rows.length) {
        return sendError(res, { message: 'Risk not found' }, 404);
      }
      
      const risk = riskResult.rows[0];
      const riskMagnitude = parseFloat(risk.inherent_risk) || 0;
      
      // Get assigned cost modules with weights
      const assignmentsResult = await db.execute(sql`
        SELECT rc.*, cm.name as module_name, cm.cost_factor, cm.cost_type, cm.description, cm.cis_control
        FROM risk_costs rc
        JOIN cost_modules cm ON rc.cost_module_id = cm.id
        WHERE rc.risk_id = ${riskId}
      `);
      
      if (!assignmentsResult.rows.length) {
        return sendSuccess(res, { 
          totalCost: 0,
          weightedCosts: {},
          riskMagnitude
        });
      }
      
      // Calculate weighted cost for each assignment
      let totalCost = 0;
      const weightedCosts = {};
      
      for (const assignment of assignmentsResult.rows) {
        let cost = 0;
        const weight = assignment.weight || 1.0;
        const costModuleId = assignment.cost_module_id;
        
        // Calculate cost based on cost type
        switch (assignment.cost_type) {
          case 'fixed':
            cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
            break;
          case 'per_event':
            cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
            break;
          case 'per_hour':
            cost = parseFloat(assignment.cost_factor) * (assignment.hours || 1);
            break;
          case 'percentage':
            // For percentage, apply to the risk magnitude (inherent risk)
            cost = riskMagnitude * parseFloat(assignment.cost_factor);
            if (assignment.custom_factor) {
              // Allow custom percentage override
              cost = riskMagnitude * parseFloat(assignment.custom_factor);
            }
            break;
        }
        
        // Apply materiality weight
        const weightedCost = cost * weight;
        totalCost += weightedCost;
        
        // Store for detailed breakdown
        weightedCosts[costModuleId] = {
          id: costModuleId,
          name: assignment.module_name,
          costType: assignment.cost_type,
          baseCost: cost,
          weight,
          cost: weightedCost
        };
      }
      
      return sendSuccess(res, {
        totalCost,
        weightedCosts,
        riskMagnitude
      });
    } catch (error) {
      console.error('Error calculating cost impact:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Save risk cost assignments (replace existing)
   */
  async saveRiskCosts(req: Request, res: Response) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError(res, { message: 'Invalid risk ID format' }, 400);
      }
      
      // Validate request body
      const assignments = req.body;
      if (!Array.isArray(assignments)) {
        return sendError(res, { message: 'Request body must be an array of assignments' }, 400);
      }
      
      console.log('Saving risk costs for risk ID:', riskId, 'Assignments:', JSON.stringify(assignments));
      
      try {
        // Start transaction
        await db.execute(sql`BEGIN`);
        
        // Delete existing assignments for this risk using Drizzle ORM
        await db.execute(sql`
          DELETE FROM risk_costs WHERE risk_id = ${riskId}
        `);
        
        // Insert new assignments
        for (const assignment of assignments) {
          const { costModuleId, weight } = assignment;
          
          if (!costModuleId || typeof costModuleId !== 'number') {
            await db.execute(sql`ROLLBACK`);
            return sendError(res, { message: 'Each assignment must have a valid costModuleId' }, 400);
          }
          
          const effectiveWeight = weight || 1.0;
          
          console.log(`Inserting cost module ${costModuleId} with weight ${effectiveWeight}`);
          
          await db.execute(sql`
            INSERT INTO risk_costs (risk_id, cost_module_id, weight)
            VALUES (${riskId}, ${costModuleId}, ${effectiveWeight})
          `);
        }
        
        // Commit transaction
        await db.execute(sql`COMMIT`);
        
        console.log('Risk cost assignments saved successfully');
        return sendSuccess(res, { message: 'Risk cost assignments saved successfully' });
      } catch (error) {
        // Rollback transaction on error
        await db.execute(sql`ROLLBACK`);
        throw error;
      }
    } catch (error) {
      console.error('Error saving risk costs:', error);
      return sendError(res, error);
    }
  }
  
  /**
   * Calculate materiality-weighted costs for all risks (used in dashboard and cost mapping page)
   */
  async calculateAllRiskCosts(req: Request, res: Response) {
    try {
      // Get all risks with inherent risk values
      const risksResult = await db.execute(sql`
        SELECT id, risk_id, name, inherent_risk, residual_risk FROM risks
      `);
      
      if (!risksResult.rows.length) {
        return sendSuccess(res, []);
      }
      
      const results = [];
      
      for (const risk of risksResult.rows) {
        // Get assigned cost modules with weights
        const assignmentsResult = await db.execute(sql`
          SELECT rc.*, cm.name as module_name, cm.cost_factor, cm.cost_type, cm.description, cm.cis_control
          FROM risk_costs rc
          JOIN cost_modules cm ON rc.cost_module_id = cm.id
          WHERE rc.risk_id = ${risk.id}
        `);
        
        const riskMagnitude = parseFloat(risk.inherent_risk) || 0;
        let totalCost = 0;
        
        // Calculate total cost if there are assignments
        if (assignmentsResult.rows.length > 0) {
          for (const assignment of assignmentsResult.rows) {
            let cost = 0;
            const weight = assignment.weight || 1.0;
            
            // Calculate cost based on cost type
            switch (assignment.cost_type) {
              case 'fixed':
                cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
                break;
              case 'per_event':
                cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
                break;
              case 'per_hour':
                cost = parseFloat(assignment.cost_factor) * (assignment.hours || 1);
                break;
              case 'percentage':
                cost = riskMagnitude * parseFloat(assignment.cost_factor);
                if (assignment.custom_factor) {
                  cost = riskMagnitude * parseFloat(assignment.custom_factor);
                }
                break;
            }
            
            // Apply materiality weight
            totalCost += cost * weight;
          }
        }
        
        results.push({
          id: risk.id,
          riskId: risk.risk_id,
          name: risk.name,
          inherentRisk: riskMagnitude,
          costImpact: totalCost,
          assignmentCount: assignmentsResult.rows.length
        });
      }
      
      return sendSuccess(res, results);
    } catch (error) {
      console.error('Error calculating all risk costs:', error);
      return sendError(res, error);
    }
  }
}

export default new RiskCostsController();