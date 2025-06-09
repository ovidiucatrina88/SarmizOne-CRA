-- PostgreSQL Permission Setup Script
-- Run this as a superuser (postgres) to grant necessary permissions

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO risk_app_user;

-- Grant create privileges on public schema
GRANT CREATE ON SCHEMA public TO risk_app_user;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO risk_app_user;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO risk_app_user;

-- Grant privileges on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO risk_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO risk_app_user;

-- Make risk_app_user owner of the database (optional, for full control)
-- ALTER DATABASE fair_risk_db OWNER TO risk_app_user;

\echo 'Permissions granted successfully to risk_app_user'