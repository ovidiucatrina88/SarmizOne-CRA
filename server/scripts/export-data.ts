import { writeFileSync } from 'fs';
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function exportAllTables() {
  try {
    console.log('Starting database export...');
    
    // Get all table names
    const tablesResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    const tableNames = tablesResult.rows.map((row: any) => row.table_name);
    console.log(`Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
    
    const fullDump: Record<string, any[]> = {};
    
    // Export data from each table
    for (const tableName of tableNames) {
      try {
        console.log(`Exporting data from ${tableName}...`);
        const dataResult = await db.execute(sql`SELECT * FROM ${sql.identifier(tableName)}`);
        fullDump[tableName] = dataResult.rows;
        console.log(`Exported ${dataResult.rows.length} rows from ${tableName}`);
      } catch (error) {
        console.error(`Error exporting table ${tableName}:`, error);
      }
    }
    
    // Write to file
    writeFileSync('database_full_export.json', JSON.stringify(fullDump, null, 2));
    console.log('Database export completed successfully. Saved to database_full_export.json');
    
  } catch (error) {
    console.error('Error exporting database:', error);
  } finally {
    process.exit(0);
  }
}

exportAllTables();