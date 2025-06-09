import { writeFileSync } from 'fs';
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function exportTable(tableName: string): Promise<{data: any[], count: number}> {
  try {
    console.log(`Exporting table ${tableName}...`);
    const result = await db.execute(sql`SELECT * FROM ${sql.identifier(tableName)}`);
    console.log(`Exported ${result.rows.length} rows from ${tableName}`);
    return { data: result.rows, count: result.rows.length };
  } catch (error) {
    console.error(`Error exporting table ${tableName}:`, error);
    return { data: [], count: 0 };
  }
}

async function createInsertStatements(tableName: string, data: any[]): Promise<string> {
  if (!data || data.length === 0) return '';
  
  // Get column names from the first row
  const columns = Object.keys(data[0]);
  
  let insertStatements = `-- Table: ${tableName} (${data.length} records)\n`;
  
  // Create insert statement for each row
  for (const row of data) {
    let values = columns.map(col => {
      const val = row[col];
      if (val === null) return 'NULL';
      if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
      if (typeof val === 'object' && Array.isArray(val)) {
        // Handle arrays
        return `ARRAY[${val.map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ')}]`;
      }
      if (typeof val === 'object' && val !== null) {
        // Handle JSON/JSONB objects
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      }
      return val;
    });
    
    insertStatements += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
  }
  
  return insertStatements + '\n';
}

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
    
    // Schema dump - get create table statements
    const schemaDump = await db.execute(sql`
      SELECT 
        'CREATE TABLE IF NOT EXISTS ' 
        || table_name 
        || ' (' 
        || string_agg(column_name || ' ' || data_type, ', ') 
        || ');' as create_statement
      FROM 
        information_schema.columns
      WHERE 
        table_schema = 'public'
      GROUP BY 
        table_name;
    `);
    
    let fullDumpSQL = '-- Full database dump for cybersecurity risk quantification application\n';
    fullDumpSQL += '-- Generated: ' + new Date().toISOString() + '\n\n';
    
    // Add schema statements
    fullDumpSQL += '-- SCHEMA DEFINITIONS\n';
    for (const row of schemaDump.rows) {
      fullDumpSQL += row.create_statement + '\n';
    }
    fullDumpSQL += '\n';
    
    // Export data from each table
    for (const tableName of tableNames) {
      try {
        const { data } = await exportTable(tableName);
        const insertStatements = await createInsertStatements(tableName, data);
        fullDumpSQL += insertStatements;
      } catch (error) {
        console.error(`Error processing table ${tableName}:`, error);
      }
    }
    
    // Write to file
    writeFileSync('complete_database_export.sql', fullDumpSQL);
    console.log('Full database export completed successfully. Saved to complete_database_export.sql');
    
  } catch (error) {
    console.error('Error exporting database:', error);
  } finally {
    process.exit(0);
  }
}

exportAllTables();