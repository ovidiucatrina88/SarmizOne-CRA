import { Request, Response, NextFunction } from 'express';
import { sendError } from '../responses/apiResponse';

/**
 * Global error handling middleware for consistent error responses
 * 
 * @param err Error or error-like object
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  
  // Determine appropriate status code
  let statusCode = 500;
  
  // Handle known error types and set appropriate status codes
  if (err.status) {
    statusCode = err.status;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  }
  
  // Log detailed error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`${statusCode} Error:`, err);
  }
  
  // Send standardized error response
  return sendError(res, err, statusCode);
}