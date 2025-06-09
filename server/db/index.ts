// Simple environment-based database configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction && !!process.env.DATABASE_URL;

console.log('Database configuration selection:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('- PGHOST present:', !!process.env.PGHOST);
console.log('- Using production PostgreSQL:', isProduction);
console.log('- Using development Neon:', isDevelopment);

let pool: any;
let db: any;

if (isProduction) {
  console.log('🚀 Using production PostgreSQL configuration');
  // Always use standard PostgreSQL in production
  const productionModule = require('./production');
  pool = productionModule.pool;
  db = productionModule.db;
} else if (isDevelopment) {
  console.log('🔧 Using development Neon configuration');
  // Use Neon only for development with valid DATABASE_URL
  const { Pool: NeonPool, neonConfig } = require('@neondatabase/serverless');
  const { drizzle: neonDrizzle } = require('drizzle-orm/neon-serverless');
  const ws = require("ws");
  const schema = require("@shared/schema");

  neonConfig.webSocketConstructor = ws;
  
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
  
  console.log("Connecting to Neon database...");
  pool = new NeonPool(poolConfig);
  db = neonDrizzle({ client: pool, schema });

  pool.on('error', (err: any) => {
    console.error('Development database error:', err.message);
  });
} else {
  throw new Error('No valid database configuration found. Set NODE_ENV=production with PG* variables or provide DATABASE_URL for development.');
}

export { pool, db };