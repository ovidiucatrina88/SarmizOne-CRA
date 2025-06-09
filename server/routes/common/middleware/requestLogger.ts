import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log API requests with timing information
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  // Log request when it starts
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - Started`);
  }
  
  // Add response event listeners
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Create log entry in database for auditing if needed
    // This can be expanded to store logs in database for security/audit requirements
    if (statusCode >= 500) {
      console.error(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    } else if (statusCode >= 400) {
      console.warn(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    } else if (process.env.NODE_ENV !== 'production') {
      console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    }
  });
  
  next();
}