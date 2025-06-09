#!/bin/bash

# Quick permission fix script
echo "Setting up PostgreSQL permissions for risk_app_user..."

psql -h localhost -U postgres -d fair_risk_db << 'EOF'
-- Grant usage and create on public schema
GRANT USAGE ON SCHEMA public TO risk_app_user;
GRANT CREATE ON SCHEMA public TO risk_app_user;

-- Grant all privileges on existing tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO risk_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO risk_app_user;

-- Grant privileges on future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO risk_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO risk_app_user;

-- Optional: Make risk_app_user owner of the database for full control
ALTER DATABASE fair_risk_db OWNER TO risk_app_user;

SELECT 'Permissions granted successfully to risk_app_user' AS status;
EOF

echo "Permission setup complete. Now try running the schema deployment again."