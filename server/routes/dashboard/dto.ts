import { z } from 'zod';

// Define schemas for dashboard date range filtering
export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional()
});

export type DateRangeFilter = z.infer<typeof dateRangeSchema>;