import { Response } from 'express';

/**
 * Send a success response with data
 */
export const sendSuccess = (res: Response, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

/**
 * Send an error response
 */
export const sendError = (res: Response, error: any, statusCode = 500) => {
  // Determine appropriate status code
  if (!statusCode || statusCode === 500) {
    if (error.name === 'ValidationError' || error.code === 'VALIDATION_ERROR') {
      statusCode = 400;
    } else if (error.name === 'NotFoundError' || error.code === 'NOT_FOUND') {
      statusCode = 404;
    } else if (error.name === 'UnauthorizedError' || error.code === 'UNAUTHORIZED') {
      statusCode = 401;
    } else if (error.name === 'ForbiddenError' || error.code === 'FORBIDDEN') {
      statusCode = 403;
    }
  }
  
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