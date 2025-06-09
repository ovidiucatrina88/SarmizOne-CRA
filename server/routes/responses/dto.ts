import { z } from 'zod';

// Define enum for response types
const responseTypeEnum = z.enum(['accept', 'avoid', 'transfer', 'mitigate']);

// Base response schema
export const responseBaseSchema = z.object({
  riskId: z.string(),
  responseType: responseTypeEnum,
  justification: z.string().default(''),
  assignedControls: z.array(z.string()).default([]),
  transferMethod: z.string().default(''),
  avoidanceStrategy: z.string().default(''),
  acceptanceReason: z.string().default('')
});

// Schema for creating a new response
export const createResponseSchema = responseBaseSchema;
export type CreateResponseDto = z.infer<typeof createResponseSchema>;

// Schema for updating an existing response
export const updateResponseSchema = responseBaseSchema.partial();
export type UpdateResponseDto = z.infer<typeof updateResponseSchema>;

// Schema for response filtering
export const responseFilterSchema = z.object({
  type: responseTypeEnum.optional(),
  riskId: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional()
});

export type ResponseFilterDto = z.infer<typeof responseFilterSchema>;