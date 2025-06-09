import express from 'express';
import { assetController } from './controller';
import { validateBody, validateParams, validateId } from '../common/middleware/validate';
import { assetSchema, assetUpdateSchema, assetIdParamSchema } from './dto';

const router = express.Router();

// GET /api/assets - Get all assets
router.get('/', assetController.getAllAssets.bind(assetController));

// GET /api/assets/:id - Get asset by ID
router.get(
  '/:id', 
  validateId,
  assetController.getAssetById.bind(assetController)
);

// POST /api/assets - Create a new asset
router.post(
  '/', 
  validateBody(assetSchema),
  assetController.createAsset.bind(assetController)
);

// PUT /api/assets/:id - Update an asset
router.put(
  '/:id', 
  validateId,
  validateBody(assetUpdateSchema),
  assetController.updateAsset.bind(assetController)
);

// DELETE /api/assets/:id - Delete an asset
router.delete(
  '/:id', 
  validateId,
  assetController.deleteAsset.bind(assetController)
);

// GET /api/assets/:id/risks - Get risks associated with an asset
router.get(
  '/:id/risks', 
  validateId,
  assetController.getAssetRisks.bind(assetController)
);

export default router;