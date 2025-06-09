import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../../auth';
import { storage } from '../../services/storage';

const router = Router();

// GET /logs - Get all activity logs (admin only)
router.get('/logs', isAuthenticated, isAdmin, async (req, res) => {
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