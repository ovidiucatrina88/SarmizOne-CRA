import express from 'express';
import { controlLibraryController } from './controller';

const router = express.Router();

// GET /api/control-library - Get all control library templates
router.get('/', controlLibraryController.getAllTemplates);

// GET /api/control-library/:id - Get a specific template by ID
router.get('/:id', controlLibraryController.getTemplateById);

// POST /api/control-library - Create a new template
router.post('/', controlLibraryController.createTemplate);

// PUT /api/control-library/:id - Update a template
router.put('/:id', controlLibraryController.updateTemplate);

// DELETE /api/control-library/:id - Delete a template
router.delete('/:id', controlLibraryController.deleteTemplate);

// POST /api/control-library/:id/create-instance - Create a control instance from template
router.post('/:id/create-instance', controlLibraryController.createInstanceFromTemplate);

export default router;