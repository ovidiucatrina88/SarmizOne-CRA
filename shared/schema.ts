// Add Backstage sync tracking table
export const backstageSyncLogs = pgTable('backstage_sync_logs', {
  id: serial('id').primaryKey(),
  syncType: text('sync_type').notNull(),
  entitiesProcessed: integer('entities_processed').default(0),
  assetsCreated: integer('assets_created').default(0),
  assetsUpdated: integer('assets_updated').default(0),
  relationshipsCreated: integer('relationships_created').default(0),
  syncStatus: text('sync_status').notNull(), // 'success', 'failed', 'partial'
  errorDetails: json('error_details'),
  syncDuration: integer('sync_duration'), // in milliseconds
  createdAt: timestamp('created_at').defaultNow(),
});

export type BackstageSyncLog = typeof backstageSyncLogs.$inferSelect;
export type InsertBackstageSyncLog = typeof backstageSyncLogs.$inferInsert;