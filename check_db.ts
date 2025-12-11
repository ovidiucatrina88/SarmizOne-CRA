
import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function checkSchema() {
  try {
    const result = await db.execute(sql`SELECT * FROM risk_costs LIMIT 1`);
    console.log('Columns:', result.rows[0] ? Object.keys(result.rows[0]) : 'No rows found');
    
    // Also check column definitions from information_schema
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'risk_costs'
    `);
    console.log('Schema:', columns.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();

