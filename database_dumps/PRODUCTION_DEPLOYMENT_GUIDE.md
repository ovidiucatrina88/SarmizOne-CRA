# Production Database Deployment Guide

## Fixed PostgreSQL Schema Issue

The PostgreSQL schema creation error has been resolved. The issue was caused by an empty `search_path` setting that prevented PostgreSQL from knowing which schema to create objects in.

### What Was Fixed

**Problem**: `psql:schema_postgres15.sql:28: ERROR: no schema has been selected to create in`

**Solution**: Updated both `schema_postgres15.sql` and `data_postgres15.sql` to use:
```sql
SELECT pg_catalog.set_config('search_path', 'public', false);
```
Instead of:
```sql
SELECT pg_catalog.set_config('search_path', '', false);
```

## Deployment Options

### Option 1: Use the Automated Deployment Script (Recommended)

```bash
cd database_dumps
./deploy_production.sh <host> <port> <database> <username>
```

**Example:**
```bash
./deploy_production.sh localhost 5432 fair_risk_db risk_app_user
```

The script will:
- Test database connectivity
- Check for existing tables (with option to drop them)
- Deploy the complete schema
- Load initial data
- Verify the deployment
- Provide the DATABASE_URL format

### Option 2: Manual Deployment

If you prefer manual control:

```bash
# 1. Deploy schema
psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f schema_postgres15.sql

# 2. Load data
psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f data_postgres15.sql
```

## Database Connection

After successful deployment, update your application's DATABASE_URL:

```bash
DATABASE_URL=postgresql://risk_app_user:<password>@<host>:<port>/fair_risk_db
```

## Verification

After deployment, verify the database contains:
- 27+ tables including core entities (assets, risks, controls, legal_entities)
- Sample data for testing and demonstration
- All required indexes and constraints

## Tables Created

The deployment creates these core tables:
- `assets` - IT and business assets
- `risks` - Risk register entries
- `controls` - Security controls
- `legal_entities` - Organizational entities
- `risk_responses` - Risk treatment plans
- `activity_logs` - Audit trail
- `users` and `sessions` - Authentication
- `vulnerabilities` - Vulnerability management
- Plus supporting tables for relationships and libraries

## Permission Issue Resolution

If you encounter `permission denied for schema public`, run this command as a PostgreSQL superuser first:

```bash
# As postgres superuser
psql -h localhost -U postgres -d fair_risk_db -f setup_permissions.sql
```

Then retry the deployment:

```bash
# As application user
psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f schema_postgres15.sql
psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f data_postgres15.sql
```

## Alternative: Use the Smart Deployment Script

```bash
# Automatically handles permissions
./deploy_production.sh localhost 5432 fair_risk_db risk_app_user postgres
```

## Production Readiness

The database schema is now fully compatible with PostgreSQL 15+ and ready for production deployment with proper error handling and data integrity constraints.