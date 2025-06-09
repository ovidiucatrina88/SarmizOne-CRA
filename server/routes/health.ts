import { Request, Response, Router } from 'express';

export const healthRouter = Router();

// Import testConnection function conditionally
async function getTestConnection() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    try {
      const dbModule = await import('../db/production');
      return dbModule.testConnection;
    } catch (error) {
      console.error('Failed to import production module:', error);
    }
  }
  
  // Fallback for all environments
  const { pool } = await import('../db');
  return async (): Promise<boolean> => {
    try {
      await pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  };
}

healthRouter.get('/health', async (req: Request, res: Response) => {
  try {
    const testConnection = await getTestConnection();
    const dbConnected = await testConnection();
    
    if (dbConnected) {
      res.json({ 
        status: 'healthy', 
        database: 'connected',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown'
      });
    } else {
      res.status(503).json({ 
        status: 'unhealthy', 
        database: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

healthRouter.get('/ready', async (req: Request, res: Response) => {
  // Readiness probe - check if app is ready to serve traffic
  try {
    const testConnection = await getTestConnection();
    const dbConnected = await testConnection();
    if (dbConnected) {
      res.json({ status: 'ready' });
    } else {
      res.status(503).json({ status: 'not ready' });
    }
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});