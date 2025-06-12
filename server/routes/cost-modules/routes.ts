import express from 'express';
import controller from './controller';

const router = express.Router();

// Routes for cost modules - order matters for route matching
router.get('/', controller.getAllCostModules.bind(controller));
router.get('/new', controller.getNewCostModuleForm.bind(controller));
router.get('/:id', controller.getCostModuleById.bind(controller));
router.post('/', controller.createCostModule.bind(controller));
router.put('/:id', controller.updateCostModule.bind(controller));
router.delete('/:id', controller.deleteCostModule.bind(controller));

export default router;