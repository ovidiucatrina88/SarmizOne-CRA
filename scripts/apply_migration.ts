
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function applyMigration() {
    console.log('Applying manual migration: Add parameters column to risks table...');
    try {
        await db.execute(sql`
      ALTER TABLE risks 
      ADD COLUMN IF NOT EXISTS parameters JSONB DEFAULT '{}'::jsonb;
    `);
        console.log('Migration applied successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
    process.exit(0);
}

applyMigration();
