-- Direct permission fix - run as postgres superuser
\c fair_risk_db

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO risk_app_user;
GRANT CREATE ON SCHEMA public TO risk_app_user;

-- Grant table and sequence permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO risk_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO risk_app_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO risk_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO risk_app_user;

-- Change database ownership
ALTER DATABASE fair_risk_db OWNER TO risk_app_user;

-- Verify permissions
\du risk_app_user
\l fair_risk_db

SELECT 'Permission setup complete for risk_app_user' AS status;