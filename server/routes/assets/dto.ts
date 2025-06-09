import { z } from 'zod';

// Base asset schema
export const assetSchema = z.object({
  id: z.number().optional(),
  assetId: z.string(),
  name: z.string(),
  description: z.union([
    z.string(),
    z.number().transform(val => String(val)),
    z.null(),
    z.undefined()
  ]).optional().nullable().default(''),
  type: z.enum(['data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component'])
    .transform(val => {
      // For backward compatibility, map application_service and technical_component 
      // to application on the server-side
      if (val === 'application_service' || val === 'technical_component') {
        return 'application';
      }
      return val;
    }),
  status: z.enum(['Active', 'Decommissioned', 'To Adopt']).optional().default('Active'),
  // Required fields from database schema
  hierarchy_level: z.enum(['strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component']).optional().default('application_service'),
  business_unit: z.string().default('Information Technology'),
  architecture_domain: z.string().default('Application'),
  // CIA triad fields
  confidentiality: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  integrity: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  availability: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  criticality: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  // Other fields
  owner: z.string().optional(),
  legalEntity: z.string().optional(),
  currency: z.enum(['USD', 'EUR']).optional().default('USD'),
  assetValue: z.union([z.number(), z.string(), z.null(), z.undefined()]).transform(val => {
    if (val === null || val === undefined) return 0;
    return typeof val === 'string' ? Number(val.replace(/[^0-9.-]/g, '')) : val;
  }).default(0),
  regulatoryImpact: z.array(z.string()).optional().default([]),
  externalInternal: z.enum(['external', 'internal']).optional().default('internal'),
  custodian: z.string().optional().nullable(),
  classification: z.string().optional().nullable(),
  regulatoryRequirements: z.array(z.string()).optional(),
  businessValue: z.string().optional().nullable(),
  businessValueAmount: z.number().optional().nullable(),
  businessImpact: z.enum(['low', 'medium', 'high']).optional(),
  dependencies: z.array(z.string()).optional().default([]),
  agentCount: z.number().optional().default(1),
  createdAt: z.date().optional()
});

// Schema for partial updates
export const assetUpdateSchema = assetSchema.partial();

// Types
export type Asset = z.infer<typeof assetSchema>;
export type AssetUpdate = z.infer<typeof assetUpdateSchema>;

// ID validation schema for route parameters
export const assetIdParamSchema = z.object({
  id: z.string().refine(val => !isNaN(parseInt(val)), {
    message: 'ID must be a valid number'
  })
});

// Parser functions with error handling
export function parseAssetData(data: unknown, isPartial = false): Asset | AssetUpdate {
  try {
    return isPartial 
      ? assetUpdateSchema.parse(data)
      : assetSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw { status: 400, message: 'Validation error', details: error.issues };
    }
    throw error;
  }
}