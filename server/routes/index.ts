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
import adminRouter from './admin';
import vulnerabilitiesRouter from './vulnerabilities';
import reportsRouter from './reports';
import integrationsRouter from './integrations';
import riskSummaryRouter from './risk-summary';
import controlMappingRouter from './controlMapping';
import controlMappingsRouter from './controlMappings';
import controlSuggestionsRouter from './risks/controlSuggestions';
import roiCalculationRouter from './risks/roiCalculation';
import controlAssociationsRouter from './risks/controlAssociations';
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
  apiRouter.use('/risk-summary', riskSummaryRouter);
  apiRouter.use('/dashboard', dashboardRouter);
  apiRouter.use('/logs', logsRouter);
  apiRouter.use('/cost-modules', costModulesRouter);
  apiRouter.use('/risk-costs', riskCostsRouter);
  apiRouter.use('/enterprise-architecture', enterpriseArchitectureRouter);
  apiRouter.use('/admin', adminRouter);
  apiRouter.use('/vulnerabilities', vulnerabilitiesRouter);
  apiRouter.use('/reports', reportsRouter);
  apiRouter.use('/integrations', integrationsRouter);
  apiRouter.use('/', authRouter);
  apiRouter.use('/control-mapping', controlMappingRouter);
  apiRouter.use('/control-mappings', controlMappingsRouter);
  apiRouter.use('/risks', controlSuggestionsRouter);
  apiRouter.use('/risks', roiCalculationRouter);
  apiRouter.use('/risks', controlAssociationsRouter);
  
  // Add API router to app
  app.use('/api', apiRouter);
  
  // Add error handler middleware last
  app.use(errorHandler);
  
  // Return the server instance created in server/index.ts
  const server = new Server(app);
  return server;
}