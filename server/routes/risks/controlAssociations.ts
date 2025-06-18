/**
 * Control Association Management API Routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { db } from '../../db';
import { risks, controls, riskControls, activityLogs } from '../../../shared/schema';
import { eq, and, inArray } from 'drizzle-orm';

const router = Router();

const associateControlsSchema = z.object({
  controlIds: z.array(z.string()).min(1, 'At least one control ID required'),
  associationType: z.enum(['manual', 'wizard', 'bulk']).default('manual')
});

const removeControlSchema = z.object({
  controlId: z.string().min(1, 'Control ID required')
});

/**
 * Associate controls with a risk
 * POST /api/risks/:riskId/controls
 */
router.post('/:riskId/controls', async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds, associationType } = associateControlsSchema.parse(req.body);
    
    console.log(`[ControlAssociation] Associating controls ${controlIds} with risk ${riskId}`);
    
    // Get the risk
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error('Risk not found'), 404);
    }
    
    const riskData = risk[0];
    
    // Get the controls
    const selectedControls = await db.select().from(controls).where(inArray(controls.controlId, controlIds));
    
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error('Some controls not found'), 404);
    }
    
    // Check for existing associations
    const existingAssociations = await db
      .select()
      .from(riskControls)
      .where(
        and(
          eq(riskControls.riskId, riskData.id),
          inArray(riskControls.controlId, selectedControls.map(c => c.id))
        )
      );
    
    const existingControlIds = new Set(existingAssociations.map(a => a.controlId));
    const newControls = selectedControls.filter(c => !existingControlIds.has(c.id));
    
    // Create new associations
    const newAssociations = [];
    for (const control of newControls) {
      const association = await db.insert(riskControls).values({
        riskId: riskData.id,
        controlId: control.id
      }).returning();
      
      newAssociations.push(association[0]);
      
      // Log the activity
      await db.insert(activityLogs).values({
        activity: 'control_associated',
        entityType: 'risk',
        entity: riskData.riskId,
        user: 'admin',
        entityId: riskData.id.toString()
      });
    }
    
    console.log(`[ControlAssociation] Created ${newAssociations.length} new associations`);
    
    // Return updated control list
    const allAssociatedControls = await db
      .select({
        id: controls.id,
        controlId: controls.controlId,
        name: controls.name,
        description: controls.description,
        controlType: controls.controlType,
        controlCategory: controls.controlCategory,
        implementationStatus: controls.implementationStatus,
        controlEffectiveness: controls.controlEffectiveness,
        implementationCost: controls.implementationCost,
        costPerAgent: controls.costPerAgent,
        isPerAgentPricing: controls.isPerAgentPricing
      })
      .from(riskControls)
      .innerJoin(controls, eq(riskControls.controlId, controls.id))
      .where(eq(riskControls.riskId, riskData.id));
    
    return sendSuccess(res, {
      message: `Associated ${newAssociations.length} new controls with risk`,
      newAssociations: newAssociations.length,
      skippedExisting: selectedControls.length - newAssociations.length,
      allAssociatedControls
    });
    
  } catch (error) {
    console.error('Error associating controls:', error);
    return sendError(res, error);
  }
});

/**
 * Remove control association from a risk
 * DELETE /api/risks/:riskId/controls/:controlId
 */
router.delete('/:riskId/controls/:controlId', async (req, res) => {
  try {
    const { riskId, controlId } = req.params;
    
    console.log(`[ControlAssociation] Removing control ${controlId} from risk ${riskId}`);
    
    // Get the risk and control
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error('Risk not found'), 404);
    }
    
    const control = await db.select().from(controls).where(eq(controls.controlId, controlId)).limit(1);
    if (control.length === 0) {
      return sendError(res, new Error('Control not found'), 404);
    }
    
    const riskData = risk[0];
    const controlData = control[0];
    
    // Remove the association
    const deletedAssociations = await db
      .delete(riskControls)
      .where(
        and(
          eq(riskControls.riskId, riskData.id),
          eq(riskControls.controlId, controlData.id)
        )
      );
    
    if (deletedAssociations.rowCount === 0) {
      return sendError(res, new Error('Association not found'), 404);
    }
    
    // Log the activity
    await db.insert(activityLogs).values({
      activity: 'control_disassociated',
      entityType: 'risk',
      entity: riskData.riskId,
      user: 'admin',
      entityId: riskData.id.toString()
    });
    
    console.log(`[ControlAssociation] Removed association successfully`);
    
    return sendSuccess(res, {
      message: 'Control association removed successfully',
      riskId: riskData.riskId,
      controlId: controlData.controlId
    });
    
  } catch (error) {
    console.error('Error removing control association:', error);
    return sendError(res, error);
  }
});

/**
 * Get all controls associated with a risk
 * GET /api/risks/:riskId/controls
 */
router.get('/:riskId/controls', async (req, res) => {
  try {
    const { riskId } = req.params;
    
    // Get the risk
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error('Risk not found'), 404);
    }
    
    const riskData = risk[0];
    
    // Get associated controls
    const associatedControls = await db
      .select({
        id: controls.id,
        controlId: controls.controlId,
        name: controls.name,
        description: controls.description,
        controlType: controls.controlType,
        controlCategory: controls.controlCategory,
        implementationStatus: controls.implementationStatus,
        controlEffectiveness: controls.controlEffectiveness,
        implementationCost: controls.implementationCost,
        costPerAgent: controls.costPerAgent,
        isPerAgentPricing: controls.isPerAgentPricing,
        deployedAgentCount: controls.deployedAgentCount
      })
      .from(riskControls)
      .innerJoin(controls, eq(riskControls.controlId, controls.id))
      .where(eq(riskControls.riskId, riskData.id));
    
    return sendSuccess(res, associatedControls);
    
  } catch (error) {
    console.error('Error getting associated controls:', error);
    return sendError(res, error);
  }
});

/**
 * Bulk update control associations
 * PUT /api/risks/:riskId/controls
 */
router.put('/:riskId/controls', async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds } = associateControlsSchema.parse(req.body);
    
    console.log(`[ControlAssociation] Bulk updating controls for risk ${riskId}`);
    
    // Get the risk
    const risk = await db.select().from(risks).where(eq(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error('Risk not found'), 404);
    }
    
    const riskData = risk[0];
    
    // Get the controls
    const selectedControls = await db.select().from(controls).where(inArray(controls.controlId, controlIds));
    
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error('Some controls not found'), 404);
    }
    
    // Remove all existing associations
    await db.delete(riskControls).where(eq(riskControls.riskId, riskData.id));
    
    // Create new associations
    const newAssociations = [];
    for (const control of selectedControls) {
      const association = await db.insert(riskControls).values({
        riskId: riskData.id,
        controlId: control.id
      }).returning();
      
      newAssociations.push(association[0]);
    }
    
    // Log the activity
    await db.insert(activityLogs).values({
      activity: 'controls_bulk_updated',
      entityType: 'risk',
      entity: riskData.riskId,
      user: 'admin',
      entityId: riskData.id.toString()
    });
    
    console.log(`[ControlAssociation] Created ${newAssociations.length} associations`);
    
    return sendSuccess(res, {
      message: `Updated control associations for risk`,
      associationCount: newAssociations.length,
      controlIds: selectedControls.map(c => c.controlId)
    });
    
  } catch (error) {
    console.error('Error bulk updating control associations:', error);
    return sendError(res, error);
  }
});

export default router;