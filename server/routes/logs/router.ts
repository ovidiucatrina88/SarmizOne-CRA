import express from 'express';
import { isAdmin } from '../../auth';
import { validate, validateId } from '../common/middleware/validate';
import { logController } from './controller';
import { logFilterSchema } from './dto';

const router = express.Router();

// Get all logs with optional filtering - requires admin rights
router.get('/',
  
  isAdmin,
  validate(logFilterSchema),
  logController.getAllLogs.bind(logController)
);

// Get a single log by ID - requires admin rights
router.get('/:id',
  
  isAdmin,
  validateId,
  logController.getLogById.bind(logController)
);

// Get log statistics (counts by level, action, resource) - requires admin rights
router.get('/stats',
  
  isAdmin,
  logController.getLogStats.bind(logController)
);

// Delete logs older than a specific date - requires admin rights
router.delete('/',
  
  isAdmin,
  logController.deleteLogs.bind(logController)
);

export default router;