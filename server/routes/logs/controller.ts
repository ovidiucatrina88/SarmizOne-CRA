import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../common/responses/apiResponse';
import { storage } from '../../services/storage';
import { LogFilterDto } from './dto';

/**
 * Controller for log-related API endpoints
 */
export class LogController {
  /**
   * Get all logs with optional filtering
   */
  async getAllLogs(req: Request, res: Response) {
    try {
      const filters = req.query as unknown as LogFilterDto;
      
      // Parse date strings to Date objects if provided
      if (filters.startDate) {
        filters.startDate = new Date(filters.startDate).toISOString();
      }
      
      if (filters.endDate) {
        filters.endDate = new Date(filters.endDate).toISOString();
      }
      
      const logs = await storage.getLogs(filters);
      return sendSuccess(res, logs);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get a single log by ID
   */
  async getLogById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const log = await storage.getLogById(id);
      
      if (!log) {
        return sendError(res, { message: 'Log not found' }, 404);
      }
      
      return sendSuccess(res, log);
    } catch (error) {
      return sendError(res, error);
    }
  }

  /**
   * Get log statistics (counts by level, action, resource)
   */
  async getLogStats(req: Request, res: Response) {
    try {
      const stats = await storage.getLogStats();
      return sendSuccess(res, stats);
    } catch (error) {
      return sendError(res, error);
    }
  }
  
  /**
   * Delete logs older than a specific date
   */
  async deleteLogs(req: Request, res: Response) {
    try {
      const { olderThan } = req.body;
      
      if (!olderThan) {
        return sendError(res, { message: 'olderThan date is required' }, 400);
      }
      
      const date = new Date(olderThan);
      
      if (isNaN(date.getTime())) {
        return sendError(res, { message: 'Invalid date format' }, 400);
      }
      
      const count = await storage.deleteLogsBefore(date);
      
      return sendSuccess(res, { 
        message: `Successfully deleted ${count} logs older than ${date.toISOString()}`,
        count
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
}

export const logController = new LogController();