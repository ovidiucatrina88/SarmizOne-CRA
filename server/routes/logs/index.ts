import { Router } from 'express';
import { isAuthenticated } from '../../auth';
import { storage } from '../../services/storage';

const router = Router();

// GET /activity-logs - Get all activity logs 
router.get('/activity-logs', isAuthenticated, async (req, res) => {
  try {
    const logs = await storage.getActivityLogs();
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity logs'
    });
  }
});

export default router;