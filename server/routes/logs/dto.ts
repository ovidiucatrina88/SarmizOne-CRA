import { z } from 'zod';

// Define enums for filtering logs
const logLevelEnum = z.enum(['info', 'warning', 'error', 'debug']);
const logActionEnum = z.enum(['create', 'update', 'delete', 'view', 'calculate', 'auth', 'system']);
const logResourceEnum = z.enum(['asset', 'risk', 'control', 'response', 'entity', 'user', 'system']);

// Schema for log filtering
export const logFilterSchema = z.object({
  level: logLevelEnum.optional(),
  action: logActionEnum.optional(),
  resource: logResourceEnum.optional(),
  userId: z.string().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(),   // ISO date string
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  sortBy: z.enum(['timestamp', 'level', 'action', 'resource']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export type LogFilterDto = z.infer<typeof logFilterSchema>;