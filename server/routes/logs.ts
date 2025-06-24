import { Router } from 'express';
import { db } from '../db';
import { activityLogs } from '../../shared/schema';
import { desc, sql } from 'drizzle-orm';

const router = Router();

// Get activity logs
router.get('/', async (req, res) => {
  try {
    console.log('[2025-06-24T22:12:00.000Z] GET /api/logs - Started');
    
    // Get recent activity logs from database
    const logs = await db.select().from(activityLogs)
      .orderBy(desc(activityLogs.timestamp))
      .limit(100);

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs'
    });
  }
});

// Alternative endpoint for activity logs
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await db.select().from(activityLogs)
      .orderBy(desc(activityLogs.timestamp))
      .limit(100);

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