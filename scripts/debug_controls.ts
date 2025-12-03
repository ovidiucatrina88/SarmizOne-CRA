
import { db } from '../server/db';
import { sql } from 'drizzle-orm';

async function main() {
    try {
        console.log('Querying control_library...');
        const result = await db.execute(sql`
      SELECT name, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing 
      FROM control_library 
      LIMIT 5
    `);
        console.log('Results:', result.rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
