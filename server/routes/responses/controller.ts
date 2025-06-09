import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { db } from '../../db';
import { riskResponses, activityLogs } from '@shared/schema';
import { CreateResponseDto, UpdateResponseDto } from './dto';
import { eq } from 'drizzle-orm';

/**
 * Controller for risk response-related API endpoints
 */
export class ResponseController {
  /**
   * Get all responses with optional filtering
   */
  async getAllResponses(req: Request, res: Response) {
    try {
      // Get all responses from database
      const responses = await db.select().from(riskResponses);
      
      // Apply filters if needed
      let filteredResponses = [...responses];
      
      if (req.query.responseType) {
        const responseType = req.query.responseType as string;
        filteredResponses = filteredResponses.filter(
          r => r.responseType === responseType
        );
      }
      
      if (req.query.riskId) {
        const riskId = req.query.riskId as string;
        filteredResponses = filteredResponses.filter(
          r => r.riskId === riskId
        );
      }
      
      return sendSuccess(res, filteredResponses);
    } catch (error) {
      console.error('Error getting responses:', error);
      return sendError(res, error);
    }
  }

  /**
   * Get a single response by ID
   */
  async getResponseById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const [response] = await db.select().from(riskResponses).where(eq(riskResponses.id, id));
      
      if (!response) {
        return sendError(res, { message: 'Response not found' }, 404);
      }
      
      return sendSuccess(res, response);
    } catch (error) {
      console.error('Error getting response by ID:', error);
      return sendError(res, error);
    }
  }

  /**
   * Get the response associated with a risk
   */
  async getResponseByRiskId(req: Request, res: Response) {
    try {
      const riskId = req.params.riskId;
      const responses = await db.select().from(riskResponses).where(eq(riskResponses.riskId, riskId));
      
      if (!responses || responses.length === 0) {
        return sendError(res, { message: 'No response found for this risk' }, 404);
      }
      
      return sendSuccess(res, responses[0]);
    } catch (error) {
      console.error('Error getting response by risk ID:', error);
      return sendError(res, error);
    }
  }

  /**
   * Create a new response
   */
  async createResponse(req: Request, res: Response) {
    try {
      const responseData: CreateResponseDto = req.body;
      
      // Check if a response already exists for this risk
      const existingResponses = await db.select().from(riskResponses).where(eq(riskResponses.riskId, responseData.riskId));
      
      if (existingResponses && existingResponses.length > 0) {
        return sendError(res, { message: 'A response already exists for this risk' }, 400);
      }
      
      // Create the new response
      const [newResponse] = await db.insert(riskResponses).values({
        riskId: responseData.riskId,
        responseType: responseData.responseType,
        justification: responseData.justification || '',
        assignedControls: responseData.assignedControls || [],
        transferMethod: responseData.transferMethod || '',
        avoidanceStrategy: responseData.avoidanceStrategy || '',
        acceptanceReason: responseData.acceptanceReason || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Log the activity
      await db.insert(activityLogs).values({
        activity: 'Response created',
        user: 'System',
        entity: `Response ${newResponse.id}`,
        entityType: 'response',
        entityId: newResponse.id.toString(),
        createdAt: new Date()
      });
      
      return sendSuccess(res, newResponse, 201);
    } catch (error) {
      console.error('Error creating response:', error);
      return sendError(res, error);
    }
  }

  /**
   * Update an existing response
   */
  async updateResponse(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const responseData: UpdateResponseDto = req.body;
      
      // Check if the response exists
      const [existingResponse] = await db.select().from(riskResponses).where(eq(riskResponses.id, id));
      
      if (!existingResponse) {
        return sendError(res, { message: 'Response not found' }, 404);
      }
      
      // Update the response
      const [updatedResponse] = await db.update(riskResponses)
        .set({
          ...responseData,
          updatedAt: new Date()
        })
        .where(eq(riskResponses.id, id))
        .returning();
      
      // Log the activity
      await db.insert(activityLogs).values({
        activity: 'Response updated',
        user: 'System',
        entity: `Response ${id}`,
        entityType: 'response',
        entityId: id.toString(),
        createdAt: new Date()
      });
      
      return sendSuccess(res, updatedResponse);
    } catch (error) {
      console.error('Error updating response:', error);
      return sendError(res, error);
    }
  }

  /**
   * Delete a response
   */
  async deleteResponse(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      // Check if the response exists
      const [existingResponse] = await db.select().from(riskResponses).where(eq(riskResponses.id, id));
      
      if (!existingResponse) {
        return sendError(res, { message: 'Response not found' }, 404);
      }
      
      // Delete the response
      await db.delete(riskResponses).where(eq(riskResponses.id, id));
      
      // Log the activity
      await db.insert(activityLogs).values({
        activity: 'Response deleted',
        user: 'System',
        entity: `Response ${id}`,
        entityType: 'response', 
        entityId: id.toString(),
        createdAt: new Date()
      });
      
      return sendSuccess(res, { message: 'Response deleted successfully' });
    } catch (error) {
      console.error('Error deleting response:', error);
      return sendError(res, error);
    }
  }
}

export const responseController = new ResponseController();