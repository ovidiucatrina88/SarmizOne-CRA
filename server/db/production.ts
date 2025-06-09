import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Production PostgreSQL configuration for dedicated server deployment
console.log('🚀 Initializing production PostgreSQL connection');

// Build connection configuration from environment variables
const connectionConfig = {
  host: process.env.PGHOST || process.env.DB_HOST,
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
  user: process.env.PGUSER || process.env.DB_USER,
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  database: process.env.PGDATABASE || process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '15000'),
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
};

console.log('Production database configuration:', {
  host: connectionConfig.host,
  port: connectionConfig.port,
  user: connectionConfig.user,
  database: connectionConfig.database,
  ssl: connectionConfig.ssl,
  password: connectionConfig.password ? '***masked***' : 'NOT SET'
});

// Validate required environment variables
const requiredVars = ['host', 'user', 'password', 'database'];
const missing = requiredVars.filter(key => !connectionConfig[key as keyof typeof connectionConfig]);

if (missing.length > 0) {
  throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
}

// Create PostgreSQL connection pool
export const pool = new Pool(connectionConfig);

// Enhanced error handling
pool.on('error', (err) => {
  console.error('Production database connection error:', err.message);
  // Don't exit process, allow for reconnection
});

pool.on('connect', (client) => {
  console.log('New production database connection established');
});

pool.on('remove', (client) => {
  console.log('Production database connection removed from pool');
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Connection test function
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    client.release();
    
    console.log(`Production database connection successful: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL version: ${result.rows[0].version.split(' ')[0]}`);
    return true;
  } catch (error) {
    console.error('Production database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing production database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing production database connections...');
  await pool.end();
  process.exit(0);
});