import express from 'express';
import { riskLibraryController } from './controller';

// Create a router for risk library endpoints
const riskLibraryRouter = express.Router();

// Configure routes for risk library operations
riskLibraryRouter.get('/', riskLibraryController.getAllRiskLibraryItems.bind(riskLibraryController));
riskLibraryRouter.get('/:id', riskLibraryController.getRiskLibraryItemById.bind(riskLibraryController));
riskLibraryRouter.post('/', riskLibraryController.createRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.put('/:id', riskLibraryController.updateRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.delete('/:id', riskLibraryController.deleteRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.post('/from-template/:id', riskLibraryController.createRiskFromTemplate.bind(riskLibraryController));

export default riskLibraryRouter;