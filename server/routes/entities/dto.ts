import { z } from 'zod';

// Base entity schema
export const entitySchema = z.object({
  id: z.number().optional(),
  entityId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  parentEntityId: z.string().optional().nullable(),
  createdAt: z.date().optional()
});

// Schema for partial updates
export const entityUpdateSchema = entitySchema.partial();

// Types
export type Entity = z.infer<typeof entitySchema>;
export type EntityUpdate = z.infer<typeof entityUpdateSchema>;

// ID validation schema for route parameters
export const entityIdParamSchema = z.object({
  id: z.string().refine(val => !isNaN(parseInt(val)), {
    message: 'ID must be a valid number'
  })
});

// Parser functions with error handling
export function parseEntityData(data: unknown, isPartial = false): Entity | EntityUpdate {
  try {
    return isPartial 
      ? entityUpdateSchema.parse(data)
      : entitySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw { status: 400, message: 'Validation error', details: error.issues };
    }
    throw error;
  }
}