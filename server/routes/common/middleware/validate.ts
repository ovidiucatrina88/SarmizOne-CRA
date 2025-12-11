import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Middleware to validate request body against a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @returns Express middleware function
 */
export function validate(schema: z.ZodType<any, any>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = req[source];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const formatted = result.error.format();
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: formatted
        });
      }

      // Update the request object with the validated (and potentiall coerced/transformed) data
      // We use Object.assign because req.query might be a getter in some Express environments
      if (source === 'query' || source === 'params') {
        Object.assign(req[source], result.data);
      } else {
        req[source] = result.data;
      }
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: `Invalid request ${source}`,
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };
}

/**
 * Middleware to validate ID parameter is a valid number or risk ID string
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Response if invalid, otherwise continues to next middleware
 */
export function validateId(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;

  // Allow both numeric IDs and string IDs that match the RISK-* pattern
  const isNumericId = !isNaN(parseInt(id));
  const isRiskStringId = /^RISK-[A-Z0-9-]+$/.test(id);

  if (!isNumericId && !isRiskStringId) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      details: 'ID must be a number or a valid risk ID string (e.g., RISK-DATA-123)'
    });
  }

  next();
}