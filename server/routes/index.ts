import express, { Express } from 'express';
import { Server } from 'http';
import assetsRouter from './assets';
import entitiesRouter from './entities';
import risksRouter from './risks';
import controlsRouter from './controls';
import controlLibraryRouter from './control-library/routes';
import riskLibraryRouter from './risk-library/routes';
import responsesRouter from './responses';
import costModulesRouter from './cost-modules/routes';
import riskCostsRouter from './risk-costs/routes';
import dashboardRouter from './dashboard';
import logsRouter from './logs';
import enterpriseArchitectureRouter from './enterprise-architecture';
import authRouter from './auth';
import vulnerabilitiesRouter from './vulnerabilities';
import { errorHandler } from './common/middleware/errorHandler';
import { requestLogger } from './common/middleware/requestLogger';
import { healthRouter } from './health';

/**
 * Register all API routes with the Express application
 * 
 * @param app Express application to register routes with
 * @returns HTTP server instance
 */
export function registerRoutes(app: Express): Server {
  // Register health check routes first (before other middleware)
  app.use('/', healthRouter);
  
  // Create main API router
  const apiRouter = express.Router();
  
  // Add common middleware
  apiRouter.use(requestLogger);
  
  // Register module routers
  apiRouter.use('/assets', assetsRouter);
  apiRouter.use('/legal-entities', entitiesRouter);
  apiRouter.use('/risks', risksRouter);
  apiRouter.use('/controls', controlsRouter);
  apiRouter.use('/control-library', controlLibraryRouter);
  apiRouter.use('/risk-library', riskLibraryRouter);
  apiRouter.use('/risk-responses', responsesRouter);
  apiRouter.use('/dashboard', dashboardRouter);
  apiRouter.use('/logs', logsRouter);
  apiRouter.use('/cost-modules', costModulesRouter);
  apiRouter.use('/risk-costs', riskCostsRouter);
  apiRouter.use('/enterprise-architecture', enterpriseArchitectureRouter);
  apiRouter.use('/', vulnerabilitiesRouter);
  apiRouter.use('/', authRouter);
  
  // Add API router to app
  app.use('/api', apiRouter);
  
  // Add error handler middleware last
  app.use(errorHandler);
  
  // Return the server instance created in server/index.ts
  const server = new Server(app);
  return server;
}