import { DatabaseStorage } from './repositoryStorage';
import { ResilientStorage } from './resilient-storage';
import { RiskService, riskService } from './riskService';
import { AssetService, assetService as assetServiceFactory } from './assetService';
import { ControlService, controlService } from './controlService';
import { ResponseService, responseService } from './responseService';

// Use DatabaseStorage directly for production PostgreSQL database
const repository = new DatabaseStorage();

// Create services with repository dependency injection
const riskServiceInstance = riskService(repository);
const assetServiceInstance = assetServiceFactory(repository);
const controlServiceInstance = controlService(repository);
const responseServiceInstance = responseService(repository);

// Export services
export { 
  riskServiceInstance as riskService,
  assetServiceInstance as assetService,
  controlServiceInstance as controlService,
  responseServiceInstance as responseService,
  // Also export classes for type usage
  RiskService,
  AssetService,
  ControlService,
  ResponseService
};