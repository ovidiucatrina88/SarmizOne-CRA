/**
 * Backstage Integration
 * Imports service catalog from on-premise Backstage deployment
 */

import axios, { AxiosInstance } from 'axios';
import { db } from '../db.js';
import { assets, assetRelationships } from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

export interface BackstageConfig {
  baseUrl: string;
  token?: string;
  namespace?: string;
  catalogFilter?: string;
  syncInterval?: string;
}

export interface BackstageEntity {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
    uid?: string;
    title?: string;
    description?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
    tags?: string[];
  };
  spec?: {
    type?: string;
    lifecycle?: string;
    owner?: string;
    system?: string;
    dependsOn?: string[];
    providesApis?: string[];
    consumesApis?: string[];
    [key: string]: any;
  };
  relations?: Array<{
    type: string;
    targetRef: string;
  }>;
}

export interface SyncResult {
  success: boolean;
  entitiesProcessed: number;
  assetsCreated: number;
  assetsUpdated: number;
  relationshipsCreated: number;
  errors: string[];
  summary: string;
}

export class BackstageClient {
  private client: AxiosInstance;
  private config: BackstageConfig;

  constructor(config: BackstageConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(config.token && { 'Authorization': `Bearer ${config.token}` }),
      },
      timeout: 30000,
    });
  }

  /**
   * Test connection to Backstage
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.client.get('/api/catalog/entities', {
        params: { limit: 1 }
      });
      return {
        success: true,
        message: `Connected to Backstage. Found ${response.data.length || 0} entities.`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }

  /**
   * Fetch entities from Backstage catalog
   */
  async fetchEntities(filter?: string): Promise<BackstageEntity[]> {
    const entities: BackstageEntity[] = [];
    let offset = 0;
    const limit = 100;

    try {
      while (true) {
        const params: any = {
          limit,
          offset,
        };

        if (filter || this.config.catalogFilter) {
          params.filter = filter || this.config.catalogFilter;
        }

        const response = await this.client.get('/api/catalog/entities', { params });
        const batch = response.data || [];

        if (batch.length === 0) break;

        entities.push(...batch);
        offset += batch.length;

        // Prevent infinite loops
        if (offset > 10000) {
          console.warn('[Backstage] Stopping fetch at 10,000 entities limit');
          break;
        }
      }

      console.log(`[Backstage] Fetched ${entities.length} entities from catalog`);
      return entities;
    } catch (error: any) {
      console.error('[Backstage] Error fetching entities:', error.message);
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }
  }

  /**
   * Transform Backstage entity to platform asset
   */
  transformEntityToAsset(entity: BackstageEntity): {
    assetData: any;
    relationships: Array<{ type: string; targetRef: string }>;
  } {
    const { metadata, spec, kind } = entity;
    
    // Determine asset type based on Backstage kind
    let assetType = 'application_service';
    if (kind === 'API') assetType = 'technical_component';
    if (kind === 'Resource') {
      if (spec?.type === 'database') assetType = 'data';
      else if (spec?.type === 'queue') assetType = 'system';
      else assetType = 'system';
    }
    if (kind === 'System') assetType = 'application';

    // Generate asset ID
    const namespace = metadata.namespace || this.config.namespace || 'default';
    const assetId = `BST-${namespace.toUpperCase()}-${metadata.name.toUpperCase()}`;

    const assetData = {
      assetId,
      name: metadata.title || metadata.name,
      description: metadata.description || `${kind} from Backstage catalog`,
      assetType,
      assetStatus: spec?.lifecycle === 'deprecated' ? 'Decommissioned' : 'Active',
      owner: spec?.owner || 'Unknown',
      tags: metadata.tags || [],
      businessCriticalityRating: this.mapCriticalityFromLabels(metadata.labels),
      ciaConfidentialityRating: 'medium' as const,
      ciaIntegrityRating: 'medium' as const,
      ciaAvailabilityRating: 'medium' as const,
      externalInternal: 'internal' as const,
      backstageEntityRef: `${kind}:${namespace}/${metadata.name}`,
      backstageMetadata: {
        kind,
        namespace,
        uid: metadata.uid,
        labels: metadata.labels,
        annotations: metadata.annotations,
        spec,
        lastSyncAt: new Date().toISOString(),
      },
    };

    // Extract relationships
    const relationships: Array<{ type: string; targetRef: string }> = [];
    
    if (spec?.dependsOn) {
      spec.dependsOn.forEach(dep => {
        relationships.push({ type: 'depends_on', targetRef: dep });
      });
    }

    if (spec?.system) {
      relationships.push({ type: 'part_of', targetRef: `system:${namespace}/${spec.system}` });
    }

    if (entity.relations) {
      relationships.push(...entity.relations);
    }

    return { assetData, relationships };
  }

  /**
   * Map business criticality from Backstage labels
   */
  private mapCriticalityFromLabels(labels?: Record<string, string>): 'low' | 'medium' | 'high' {
    if (!labels) return 'medium';
    
    const criticality = labels['backstage.io/business-criticality'] || 
                       labels['criticality'] || 
                       labels['tier'];
    
    switch (criticality?.toLowerCase()) {
      case 'critical':
      case 'tier-1':
      case 'high':
        return 'high';
      case 'low':
      case 'tier-3':
        return 'low';
      default:
        return 'medium';
    }
  }

  /**
   * Sync entities to platform assets
   */
  async syncEntities(dryRun: boolean = false): Promise<SyncResult> {
    const result: SyncResult = {
      success: false,
      entitiesProcessed: 0,
      assetsCreated: 0,
      assetsUpdated: 0,
      relationshipsCreated: 0,
      errors: [],
      summary: '',
    };

    try {
      console.log('[Backstage] Starting entity sync...');
      const entities = await this.fetchEntities();
      result.entitiesProcessed = entities.length;

      if (dryRun) {
        result.summary = `Dry run completed. Would process ${entities.length} entities.`;
        result.success = true;
        return result;
      }

      const relationshipsToCreate: Array<{ assetId: string; targetRef: string; type: string }> = [];

      for (const entity of entities) {
        try {
          const { assetData, relationships } = this.transformEntityToAsset(entity);

          // Check if asset already exists
          const existingAsset = await db
            .select()
            .from(assets)
            .where(eq(assets.backstageEntityRef, assetData.backstageEntityRef))
            .limit(1);

          if (existingAsset.length > 0) {
            // Update existing asset
            await db
              .update(assets)
              .set({
                ...assetData,
                updatedAt: new Date(),
              })
              .where(eq(assets.id, existingAsset[0].id));
            
            result.assetsUpdated++;
          } else {
            // Create new asset
            await db.insert(assets).values({
              ...assetData,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            
            result.assetsCreated++;
          }

          // Store relationships for later processing
          relationships.forEach(rel => {
            relationshipsToCreate.push({
              assetId: assetData.assetId,
              targetRef: rel.targetRef,
              type: rel.type,
            });
          });

        } catch (error: any) {
          result.errors.push(`Entity ${entity.metadata.name}: ${error.message}`);
          console.error(`[Backstage] Error processing entity ${entity.metadata.name}:`, error);
        }
      }

      // Create relationships
      await this.createRelationships(relationshipsToCreate);
      result.relationshipsCreated = relationshipsToCreate.length;

      result.success = true;
      result.summary = `Sync completed: ${result.assetsCreated} created, ${result.assetsUpdated} updated, ${result.relationshipsCreated} relationships created`;
      
      console.log('[Backstage] Sync completed:', result.summary);

    } catch (error: any) {
      result.errors.push(`Sync failed: ${error.message}`);
      console.error('[Backstage] Sync failed:', error);
    }

    return result;
  }

  /**
   * Create asset relationships
   */
  private async createRelationships(
    relationships: Array<{ assetId: string; targetRef: string; type: string }>
  ): Promise<void> {
    for (const rel of relationships) {
      try {
        // Find target asset by Backstage entity ref
        const targetAsset = await db
          .select()
          .from(assets)
          .where(eq(assets.backstageEntityRef, rel.targetRef))
          .limit(1);

        if (targetAsset.length === 0) {
          console.warn(`[Backstage] Target asset not found for relationship: ${rel.targetRef}`);
          continue;
        }

        const sourceAsset = await db
          .select()
          .from(assets)
          .where(eq(assets.assetId, rel.assetId))
          .limit(1);

        if (sourceAsset.length === 0) {
          console.warn(`[Backstage] Source asset not found: ${rel.assetId}`);
          continue;
        }

        // Check if relationship already exists
        const existingRel = await db
          .select()
          .from(assetRelationships)
          .where(
            and(
              eq(assetRelationships.sourceAssetId, sourceAsset[0].id),
              eq(assetRelationships.targetAssetId, targetAsset[0].id),
              eq(assetRelationships.relationshipType, rel.type as any)
            )
          )
          .limit(1);

        if (existingRel.length === 0) {
          await db.insert(assetRelationships).values({
            sourceAssetId: sourceAsset[0].id,
            targetAssetId: targetAsset[0].id,
            relationshipType: rel.type as any,
            createdAt: new Date(),
          });
        }

      } catch (error: any) {
        console.error(`[Backstage] Error creating relationship:`, error);
      }
    }
  }
}

export default BackstageClient;