import { z } from 'zod';

// Define enums for control properties
const controlTypeEnum = z.enum(['preventive', 'detective', 'corrective']);
const controlCategoryEnum = z.enum(['technical', 'administrative', 'physical']);
const implementationStatusEnum = z.enum(['not_implemented', 'in_progress', 'fully_implemented', 'planned']);

// Base control schema
export const controlBaseSchema = z.object({
  controlId: z.string(),
  name: z.string().min(1),
  description: z.string().default(''),
  controlType: controlTypeEnum,
  controlCategory: controlCategoryEnum,
  implementationStatus: implementationStatusEnum,
  implementationCost: z.number().optional(),
  implementationTime: z.number().optional(),
  maintainCost: z.number().optional(),
  effectivenessRating: z.number().min(0).max(100).optional(),

  // FAIR-U Control Effectiveness
  controlEffectiveness: z.number().min(0).max(10).optional(),

  // FAIR-CAM effectiveness parameters
  e_avoid: z.number().min(0).max(1).optional(),
  e_deter: z.number().min(0).max(1).optional(),
  e_detect: z.number().min(0).max(1).optional(),
  e_resist: z.number().min(0).max(1).optional(),

  // Cost calculation fields
  costPerAgent: z.number().min(0).optional(),
  isPerAgentPricing: z.boolean().optional(),
  deployedAgentCount: z.number().min(0).optional(),

  vendor: z.string().optional(),
  technicalDetails: z.string().optional(),
  implementationNotes: z.string().optional(),
  attachments: z.array(z.string()).default([]),
  frameworkReferences: z.array(z.string()).default([]),
  legalEntityId: z.string().nullable().optional(),
  riskId: z.number().nullable().optional(),
  assetId: z.string().nullable().optional()
});

// Schema for creating a new control
export const createControlSchema = controlBaseSchema;
export type CreateControlDto = z.infer<typeof createControlSchema>;

// Schema for updating an existing control
export const updateControlSchema = controlBaseSchema.partial();
export type UpdateControlDto = z.infer<typeof updateControlSchema>;

// Schema for control filtering
export const controlFilterSchema = z.object({
  type: controlTypeEnum.optional(),
  category: controlCategoryEnum.optional(),
  status: implementationStatusEnum.optional(),
  riskId: z.coerce.number().optional(),
  assetId: z.string().optional(),
  entityId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'controlId', 'controlType', 'implementationStatus', 'effectivenessRating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
});

export type ControlFilterDto = z.infer<typeof controlFilterSchema>;