
import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function checkCostModules() {
  try {
    const columns = await db.execute(sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cost_modules'
    `);
    console.log('Cost Modules Schema:', columns.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCostModules();

