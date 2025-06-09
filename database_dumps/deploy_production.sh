#!/bin/bash

# Production Database Deployment Script
# This script sets up the complete database schema and data for the Risk Management application

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Risk Management Database Deployment ===${NC}"
echo ""

# Check if required parameters are provided
if [ "$#" -lt 4 ] || [ "$#" -gt 5 ]; then
    echo -e "${RED}Usage: $0 <host> <port> <database> <username> [superuser]${NC}"
    echo "Example: $0 localhost 5432 fair_risk_db risk_app_user"
    echo "         $0 localhost 5432 fair_risk_db risk_app_user postgres"
    exit 1
fi

HOST="$1"
PORT="$2"
DATABASE="$3"
USERNAME="$4"
SUPERUSER="${5:-postgres}"

echo -e "${YELLOW}Connection Details:${NC}"
echo "Host: $HOST"
echo "Port: $PORT"
echo "Database: $DATABASE"
echo "Username: $USERNAME"
echo ""

# Test database connection
echo -e "${BLUE}Testing database connection...${NC}"
if ! psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Cannot connect to database. Please check your connection parameters and ensure the database exists.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Database connection successful${NC}"

# Check and setup permissions if needed
echo -e "${BLUE}Checking database permissions...${NC}"
PERMISSION_TEST=$(psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -t -c "SELECT has_schema_privilege('$USERNAME', 'public', 'CREATE');" 2>/dev/null | xargs)

if [ "$PERMISSION_TEST" != "t" ]; then
    echo -e "${YELLOW}User $USERNAME does not have CREATE privileges on public schema.${NC}"
    echo -e "${BLUE}Setting up permissions using superuser $SUPERUSER...${NC}"
    
    if ! psql -h "$HOST" -p "$PORT" -U "$SUPERUSER" -d "$DATABASE" -f "setup_permissions.sql" > /dev/null 2>&1; then
        echo -e "${RED}ERROR: Failed to setup permissions. Please run the following as a superuser:${NC}"
        echo -e "${YELLOW}psql -h $HOST -p $PORT -U $SUPERUSER -d $DATABASE -f setup_permissions.sql${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Permissions setup successful${NC}"
else
    echo -e "${GREEN}✓ User already has necessary permissions${NC}"
fi

# Check if tables already exist
echo -e "${BLUE}Checking existing schema...${NC}"
TABLE_COUNT=$(psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('assets', 'risks', 'controls', 'legal_entities');" 2>/dev/null | xargs)

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Warning: Found $TABLE_COUNT existing core tables in the database.${NC}"
    read -p "Do you want to continue? This will DROP existing tables. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Deployment cancelled by user.${NC}"
        exit 0
    fi
    
    echo -e "${YELLOW}Dropping existing tables...${NC}"
    psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -v ON_ERROR_STOP=1 << 'EOF'
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.vulnerability_assets CASCADE;
DROP TABLE IF EXISTS public.vulnerabilities CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.risk_summaries CASCADE;
DROP TABLE IF EXISTS public.asset_relationships CASCADE;
DROP TABLE IF EXISTS public.enterprise_architecture CASCADE;
DROP TABLE IF EXISTS public.risk_costs CASCADE;
DROP TABLE IF EXISTS public.risk_responses CASCADE;
DROP TABLE IF EXISTS public.risk_controls CASCADE;
DROP TABLE IF EXISTS public.risk_library CASCADE;
DROP TABLE IF EXISTS public.control_library CASCADE;
DROP TABLE IF EXISTS public.controls CASCADE;
DROP TABLE IF EXISTS public.risks CASCADE;
DROP TABLE IF EXISTS public.legal_entities CASCADE;
DROP TABLE IF EXISTS public.assets CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop enums
DROP TYPE IF EXISTS public.vulnerability_severity CASCADE;
DROP TYPE IF EXISTS public.vulnerability_status CASCADE;
DROP TYPE IF EXISTS public.auth_type CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.item_type CASCADE;
DROP TYPE IF EXISTS public.currency CASCADE;
DROP TYPE IF EXISTS public.severity CASCADE;
DROP TYPE IF EXISTS public.risk_response_type CASCADE;
DROP TYPE IF EXISTS public.implementation_status CASCADE;
DROP TYPE IF EXISTS public.control_category CASCADE;
DROP TYPE IF EXISTS public.control_type CASCADE;
DROP TYPE IF EXISTS public.risk_category CASCADE;
DROP TYPE IF EXISTS public.relationship_type CASCADE;
DROP TYPE IF EXISTS public.hierarchy_level CASCADE;
DROP TYPE IF EXISTS public.external_internal CASCADE;
DROP TYPE IF EXISTS public.cia_rating CASCADE;
DROP TYPE IF EXISTS public.asset_status CASCADE;
DROP TYPE IF EXISTS public.asset_type CASCADE;
DROP TYPE IF EXISTS public.cost_module_type CASCADE;
EOF
    echo -e "${GREEN}✓ Existing tables dropped${NC}"
fi

# Deploy schema
echo -e "${BLUE}Deploying database schema...${NC}"
if psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -v ON_ERROR_STOP=1 -f "schema_postgres15.sql" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Schema deployment successful${NC}"
else
    echo -e "${RED}ERROR: Schema deployment failed${NC}"
    exit 1
fi

# Deploy data
echo -e "${BLUE}Loading initial data...${NC}"
if psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -v ON_ERROR_STOP=1 -f "data_postgres15.sql" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Data loading successful${NC}"
else
    echo -e "${RED}ERROR: Data loading failed${NC}"
    exit 1
fi

# Verify deployment
echo -e "${BLUE}Verifying deployment...${NC}"
VERIFICATION_RESULT=$(psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" -t << 'EOF'
SELECT 
    'Tables: ' || COUNT(DISTINCT table_name) ||
    ', Assets: ' || (SELECT COUNT(*) FROM public.assets) ||
    ', Risks: ' || (SELECT COUNT(*) FROM public.risks) ||
    ', Controls: ' || (SELECT COUNT(*) FROM public.controls) ||
    ', Legal Entities: ' || (SELECT COUNT(*) FROM public.legal_entities)
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('assets', 'risks', 'controls', 'legal_entities', 'risk_responses', 'activity_logs', 'users', 'sessions');
EOF
)

echo -e "${GREEN}✓ Deployment verification: $VERIFICATION_RESULT${NC}"

# Display connection string format
echo ""
echo -e "${BLUE}=== Deployment Complete ===${NC}"
echo ""
echo -e "${YELLOW}Database URL format for your application:${NC}"
echo "postgresql://$USERNAME:<password>@$HOST:$PORT/$DATABASE"
echo ""
echo -e "${YELLOW}Environment variable:${NC}"
echo "DATABASE_URL=postgresql://$USERNAME:<password>@$HOST:$PORT/$DATABASE"
echo ""
echo -e "${GREEN}✓ Your Risk Management application database is ready for production use!${NC}"