import { Response } from 'express';

/**
 * Standardized success response format
 * 
 * @param res Express response object
 * @param data Data to send in response
 * @param statusCode HTTP status code (defaults to 200)
 * @returns Express response
 */
export function sendSuccess(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}

/**
 * Standardized error response format
 * 
 * @param res Express response object
 * @param error Error object or message
 * @param statusCode HTTP status code (defaults to 500)
 * @returns Express response
 */
export function sendError(res: Response, error: any, statusCode = 500) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : error.message || 'Internal server error';
  
  const errorDetails = process.env.NODE_ENV === 'production'
    ? undefined
    : error.stack || error;

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details: errorDetails
  });
}