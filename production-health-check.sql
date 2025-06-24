-- Production Database Health Check
-- Run this to verify database schema and connectivity

-- Check if all required tables exist
SELECT 
  'Table Existence Check' as check_type,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('controls', 'control_library', 'risks', 'assets', 'users', 'sessions')
ORDER BY table_name;

-- Check critical columns in controls table
SELECT 
  'Controls Column Check' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'controls' 
  AND column_name IN ('is_per_agent', 'is_per_agent_pricing', 'cost_per_agent', 'deployed_agent_count')
ORDER BY column_name;

-- Check if session store is working
SELECT 
  'Session Store Check' as check_type,
  COUNT(*) as session_count,
  MAX(expire) as latest_expiry
FROM sessions;

-- Check if users table has admin user
SELECT 
  'Admin User Check' as check_type,
  username,
  role,
  auth_type
FROM users 
WHERE username = 'admin';

-- Final connectivity test
SELECT 
  'Database Connectivity' as check_type,
  version() as postgres_version,
  current_database() as database_name,
  current_timestamp as current_time;