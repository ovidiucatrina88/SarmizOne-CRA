import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Global connection tracking variables
let isConnected = false;
let lastError: Error | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Create connection pool for standard PostgreSQL
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000, // 15 seconds timeout
  max: 10, // Reduce max connections to prevent overwhelming
  min: 1, // Minimum 1 connection
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  statement_timeout: 30000, // 30 seconds statement timeout
  query_timeout: 30000, // 30 seconds query timeout
  keepAlive: true,
  keepAliveInitialDelayMillis: 5000, // Reduce initial delay
  application_name: 'risk-platform-prod', // Identify connections
});

// Log database connection status
pool.on('connect', (client) => {
  console.log('New database client connected');
  isConnected = true;
  reconnectAttempts = 0;
  lastError = null;
  
  // Set connection-level timeouts to prevent hanging connections
  client.query('SET statement_timeout = 60000').catch(() => {});
  client.query('SET idle_in_transaction_session_timeout = 60000').catch(() => {});
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
  isConnected = false;
  lastError = err;
  
  // Don't overwhelm with reconnection attempts
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
    setTimeout(() => {
      checkDatabaseConnection().catch(e => 
        console.error('Reconnection attempt failed:', e)
      );
    }, 5000 * reconnectAttempts); // Exponential backoff
  }
});

// Create Drizzle ORM instance with standard PostgreSQL driver
export const db = drizzle(pool, { schema });

// Helper function to verify database connection
export async function checkDatabaseConnection() {
  try {
    // Use a simple query to test the connection
    const result = await pool.query('SELECT 1 as connection_test');
    if (result.rows.length > 0) {
      if (!isConnected) {
        console.log('Successfully connected to the database');
      }
      isConnected = true;
      reconnectAttempts = 0;
      return true;
    }
    isConnected = false;
    return false;
  } catch (error) {
    console.error('Database connection check failed:', error);
    isConnected = false;
    lastError = error as Error;
    return false;
  }
}

// Wrapper function to execute queries with retry logic
export async function executeQueryWithRetry<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      retries++;
      console.error(`Query failed (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      
      // Check connection before retry
      await checkDatabaseConnection();
    }
  }
  
  // This shouldn't be reached due to the throw in the loop, but TypeScript requires a return
  throw new Error('Max retries exceeded');
}

// Initialize database connection
console.log('Initializing database connection...');
checkDatabaseConnection()
  .then(isConnected => {
    if (isConnected) {
      console.log('Database initialization successful');
    } else {
      console.error('Failed to connect to the database');
    }
  })
  .catch(err => {
    console.error('Error during database initialization:', err);
  });