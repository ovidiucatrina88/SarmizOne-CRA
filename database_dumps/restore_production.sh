#!/bin/bash

# Cybersecurity Risk Quantification Database Restoration Script
# Compatible with PostgreSQL 15.13 (Debian 15.13-0+deb12u1)
# Usage: ./restore_production.sh [database_name] [username]

DB_NAME=${1:-cybersecurity_risk_db}
DB_USER=${2:-app_user}

echo "=== PostgreSQL 15.13 Database Restoration ==="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Target: PostgreSQL 15.13 (Debian)"
echo

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo "✓ $1 completed successfully"
    else
        echo "✗ $1 failed"
        exit 1
    fi
}

# Check PostgreSQL version compatibility
echo "Checking PostgreSQL version..."
PG_VERSION=$(psql -U $DB_USER -d postgres -t -c "SELECT version();" 2>/dev/null | grep -o "PostgreSQL [0-9][0-9]*\.[0-9][0-9]*" | head -1)
echo "Detected: $PG_VERSION"

# Step 1: Create database structure using PostgreSQL 15 compatible dump
echo "Step 1: Restoring database schema (PostgreSQL 15 compatible)..."
psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -f schema_postgres15.sql -q
check_status "Schema restoration"

# Step 2: Set session parameters for PostgreSQL 15
echo "Step 2: Configuring session for PostgreSQL 15..."
psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -c "
SET session_replication_role = replica;
SET client_min_messages = warning;
SET search_path = public;
" -q
check_status "Session configuration"

# Step 3: Restore data using PostgreSQL 15 compatible dump
echo "Step 3: Restoring application data (PostgreSQL 15 compatible)..."
psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -f data_postgres15.sql -q
check_status "Data restoration"

# Step 4: Reset session parameters
echo "Step 4: Finalizing database setup..."
psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -c "
SET session_replication_role = DEFAULT;
RESET client_min_messages;
" -q
check_status "Session reset"

# Step 5: Grant permissions for PostgreSQL 15
echo "Step 5: Setting up PostgreSQL 15 permissions..."
psql -U $DB_USER -d $DB_NAME -v ON_ERROR_STOP=1 -c "
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;
" -q
check_status "Permission setup"

# Step 6: Verify restoration
echo "Step 6: Verifying data restoration..."
ASSET_COUNT=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM assets;" | tr -d ' ')
RISK_COUNT=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM risks;" | tr -d ' ')
CONTROL_COUNT=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM controls;" | tr -d ' ')
ENTITY_COUNT=$(psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM legal_entities;" | tr -d ' ')

echo "Database restoration verification:"
echo "  Assets: $ASSET_COUNT (expected: 11)"
echo "  Risks: $RISK_COUNT (expected: 5)"
echo "  Controls: $CONTROL_COUNT (expected: 3)"
echo "  Legal Entities: $ENTITY_COUNT (expected: 4)"

if [ "$ASSET_COUNT" = "11" ] && [ "$RISK_COUNT" = "5" ] && [ "$CONTROL_COUNT" = "3" ] && [ "$ENTITY_COUNT" = "4" ]; then
    echo "✓ Database restoration completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Configure APPLICATION_URL in your application:"
    echo "   DATABASE_URL=\"postgresql://$DB_USER:password@localhost:5432/$DB_NAME\""
    echo "2. Start your application container"
    echo "3. Verify dashboard shows: 5 risks, 11 assets, 3 controls"
else
    echo "⚠ Warning: Data counts don't match expected values"
    echo "Review restoration logs for potential issues"
fi