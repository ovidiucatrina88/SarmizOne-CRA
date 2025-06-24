/**
 * Backstage Integration API Routes
 */

import express from 'express';
import { z } from 'zod';
import BackstageClient from '../integrations/backstage.js';
import { db } from '../db.js';
import { backstageSyncLogs, assets } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';
import { sendSuccess, sendError } from './common/index.js';

const router = express.Router();

// Validation schemas
const backstageConfigSchema = z.object({
  baseUrl: z.string().url(),
  token: z.string().optional(),
  namespace: z.string().default('default'),
  catalogFilter: z.string().optional(),
  syncInterval: z.string().default('1h'),
});

/**
 * POST /api/backstage/test-connection - Test Backstage connection
 */
router.post('/test-connection', async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const client = new BackstageClient(config);
    
    const result = await client.testConnection();
    
    if (result.success) {
      sendSuccess(res, result);
    } else {
      sendError(res, result.message, 400);
    }
  } catch (error: any) {
    console.error('Error testing Backstage connection:', error);
    if (error instanceof z.ZodError) {
      sendError(res, 'Invalid configuration', 400, error.errors);
    } else {
      sendError(res, 'Failed to test connection', 500);
    }
  }
});

/**
 * POST /api/backstage/sync - Trigger manual sync
 */
router.post('/sync', async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const dryRun = req.query.dryRun === 'true';
    
    const client = new BackstageClient(config);
    const startTime = Date.now();
    
    console.log(`[Backstage] Starting ${dryRun ? 'dry run' : 'sync'}...`);
    
    const result = await client.syncEntities(dryRun);
    const syncDuration = Date.now() - startTime;
    
    // Log sync result
    if (!dryRun) {
      await db.insert(backstageSyncLogs).values({
        syncType: 'manual',
        entitiesProcessed: result.entitiesProcessed,
        assetsCreated: result.assetsCreated,
        assetsUpdated: result.assetsUpdated,
        relationshipsCreated: result.relationshipsCreated,
        syncStatus: result.success ? 'success' : 'failed',
        errorDetails: result.errors.length > 0 ? result.errors : null,
        syncDuration,
      });
    }
    
    sendSuccess(res, {
      ...result,
      syncDuration,
      dryRun,
    });
    
  } catch (error: any) {
    console.error('Error syncing Backstage entities:', error);
    
    // Log failed sync
    await db.insert(backstageSyncLogs).values({
      syncType: 'manual',
      syncStatus: 'failed',
      errorDetails: [error.message],
      syncDuration: 0,
    });
    
    if (error instanceof z.ZodError) {
      sendError(res, 'Invalid configuration', 400, error.errors);
    } else {
      sendError(res, 'Sync failed', 500);
    }
  }
});

/**
 * GET /api/backstage/sync-history - Get sync history
 */
router.get('/sync-history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const syncHistory = await db
      .select()
      .from(backstageSyncLogs)
      .orderBy(backstageSyncLogs.createdAt)
      .limit(limit);
    
    sendSuccess(res, syncHistory);
  } catch (error: any) {
    console.error('Error fetching sync history:', error);
    sendError(res, 'Failed to fetch sync history', 500);
  }
});

/**
 * GET /api/backstage/assets - Get Backstage-imported assets
 */
router.get('/assets', async (req, res) => {
  try {
    const backstageAssets = await db
      .select()
      .from(assets)
      .where(eq(assets.backstageEntityRef, assets.backstageEntityRef))
      .orderBy(assets.lastBackstageSync);
    
    // Filter out nulls
    const validAssets = backstageAssets.filter(asset => asset.backstageEntityRef);
    
    sendSuccess(res, validAssets);
  } catch (error: any) {
    console.error('Error fetching Backstage assets:', error);
    sendError(res, 'Failed to fetch Backstage assets', 500);
  }
});

/**
 * GET /api/backstage/entities/preview - Preview entities from Backstage
 */
router.post('/entities/preview', async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const limit = parseInt(req.query.limit as string) || 10;
    
    const client = new BackstageClient(config);
    const entities = await client.fetchEntities();
    
    // Transform preview data
    const preview = entities.slice(0, limit).map(entity => {
      const { assetData } = client.transformEntityToAsset(entity);
      return {
        entityRef: `${entity.kind}:${entity.metadata.namespace || 'default'}/${entity.metadata.name}`,
        name: entity.metadata.title || entity.metadata.name,
        kind: entity.kind,
        type: entity.spec?.type,
        owner: entity.spec?.owner,
        lifecycle: entity.spec?.lifecycle,
        description: entity.metadata.description,
        willCreateAsset: assetData,
      };
    });
    
    sendSuccess(res, {
      totalEntities: entities.length,
      preview,
      previewCount: preview.length,
    });
    
  } catch (error: any) {
    console.error('Error previewing Backstage entities:', error);
    if (error instanceof z.ZodError) {
      sendError(res, 'Invalid configuration', 400, error.errors);
    } else {
      sendError(res, 'Failed to preview entities', 500);
    }
  }
});

/**
 * DELETE /api/backstage/assets - Remove all Backstage assets
 */
router.delete('/assets', async (req, res) => {
  try {
    const result = await db
      .delete(assets)
      .where(eq(assets.backstageEntityRef, assets.backstageEntityRef))
      .returning({ id: assets.id });
    
    const deletedCount = result.filter(r => r.id).length;
    
    sendSuccess(res, {
      message: `Removed ${deletedCount} Backstage assets`,
      deletedCount,
    });
    
  } catch (error: any) {
    console.error('Error removing Backstage assets:', error);
    sendError(res, 'Failed to remove Backstage assets', 500);
  }
});

export default router;