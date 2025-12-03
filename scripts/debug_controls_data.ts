import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { sql } from 'drizzle-orm';

const pool = new pg.Pool({
    connectionString: "postgresql://risk_dev:risk_dev@127.0.0.1:5432/risk_dev",
});
const db = drizzle(pool);

async function checkControls() {
    try {
        console.log('Checking for cost = 17325...');
        const costResult = await db.execute(sql`
      SELECT control_id, name, control_effectiveness, implementation_cost 
      FROM control_library 
      WHERE implementation_cost = 17325
    `);
        console.log(JSON.stringify(costResult.rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkControls();
