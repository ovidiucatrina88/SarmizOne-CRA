# Production Database Migration Guide

## Overview
Complete migration strategy to rebuild your production database schema from scratch while preserving essential reference data.

## Migration Files
- `production-migration.sql` - Complete schema rebuild script
- `data-dumps.sql` - Essential reference data imports

## Pre-Migration Checklist
1. **Backup Current Production Database**
   ```bash
   pg_dump -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Verify Database Connection**
   ```bash
   psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -c "SELECT version();"
   ```

3. **Stop Application Services**
   - Stop all running application instances
   - Ensure no active connections to the database

## Migration Steps

### Step 1: Execute Schema Migration
```bash
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -f production-migration.sql
```

This script will:
- Drop all existing tables and sequences
- Drop all custom types
- Recreate complete schema with 20 tables
- Set up all foreign key relationships
- Create performance indexes

### Step 2: Import Reference Data
```bash
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -f data-dumps.sql
```

This imports:
- **27 Risk Library Templates** - FAIR methodology risk scenarios
- **56+ CIS Control Library** - Security control frameworks
- **10 Cost Modules** - Financial impact calculation models
- **User Accounts** - Existing production users with passwords
- **Auth Configuration** - Authentication settings
- **IRIS 2025 Data** - Actuarial benchmarking parameters

### Step 3: Verify Migration
```sql
-- Check table counts
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "Rows"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify reference data
SELECT COUNT(*) as risk_templates FROM risk_library;
SELECT COUNT(*) as control_templates FROM control_library;
SELECT COUNT(*) as cost_modules FROM cost_modules;
SELECT COUNT(*) as users FROM users;
SELECT COUNT(*) as iris_data FROM industry_insights;
```

Expected results:
- risk_library: 27 records
- control_library: 56+ records  
- cost_modules: 10 records
- users: 2 records
- industry_insights: 7 records

## Post-Migration Setup

### 1. Restart Application
- Start your application services
- Verify dashboard loads with preserved data
- Test user authentication with existing credentials

### 2. Verify Functionality
- **Dashboard**: Risk summaries and metrics display
- **Risk Library**: Templates available for risk creation
- **Control Library**: CIS controls accessible
- **IRIS Integration**: Benchmark data functioning
- **User Access**: Login with existing credentials

### 3. Data Validation
```sql
-- Check IRIS benchmarking data
SELECT sector, metric, value_numeric 
FROM industry_insights 
WHERE source = 'IRIS 2025';

-- Verify user authentication
SELECT username, email, role, is_active 
FROM users 
WHERE is_active = true;

-- Check control framework coverage
SELECT compliance_framework, COUNT(*) 
FROM control_library 
GROUP BY compliance_framework;
```

## Preserved User Accounts

### Admin Account
- **Email**: admin@company.com
- **Role**: admin
- **Status**: Active
- **Password**: Current production password (hashed)

### Test Account  
- **Email**: test@company.com
- **Role**: user
- **Status**: Active
- **Password**: Current production password (hashed)

## What Gets Reset
- All operational data (risks, assets, controls, summaries)
- Activity logs and audit trails
- Enterprise architecture mappings
- Risk-control relationships
- Current risk assessments

## What Gets Preserved
- Risk library templates with FAIR parameters
- CIS control library with compliance mappings
- Cost calculation modules
- User accounts and authentication
- IRIS 2025 actuarial benchmarking data
- System configuration settings

## Rollback Plan
If migration fails:
1. Stop application
2. Restore from backup:
   ```bash
   psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE < backup_TIMESTAMP.sql
   ```
3. Restart application
4. Investigate issues before retry

## Validation Queries

### Risk Library Validation
```sql
-- Check risk categories and severities
SELECT risk_category, severity, COUNT(*) 
FROM risk_library 
GROUP BY risk_category, severity;

-- Verify FAIR parameters present
SELECT COUNT(*) as complete_templates
FROM risk_library 
WHERE contact_frequency_avg > 0 
  AND primary_loss_magnitude_avg > 0;
```

### Control Library Validation
```sql
-- Check CIS control coverage
SELECT 
  SUBSTRING(control_id FROM 1 FOR 1) as cis_section,
  COUNT(*) as controls
FROM control_library 
WHERE compliance_framework = 'CIS'
GROUP BY SUBSTRING(control_id FROM 1 FOR 1)
ORDER BY cis_section;
```

### IRIS Data Validation
```sql
-- Verify technology sector parameters
SELECT metric, value_numeric 
FROM industry_insights 
WHERE sector = 'Technology' 
  AND source = 'IRIS 2025';

-- Check SMB vs Global parameters
SELECT sector, metric, value_numeric 
FROM industry_insights 
WHERE metric LIKE 'LM_%' 
  AND source = 'IRIS 2025'
ORDER BY sector, metric;
```

## Support Notes
- Migration preserves all password hashes - users keep existing passwords
- IRIS 2025 actuarial data enables advanced risk benchmarking
- CIS control library provides comprehensive security framework
- Default organization entity created for immediate use
- All sequences reset to maintain data integrity

## Timeline
- **Schema Migration**: 2-5 minutes
- **Data Import**: 1-2 minutes  
- **Validation**: 2-3 minutes
- **Total Downtime**: 5-10 minutes

Your production database will be rebuilt with a clean, optimized schema while preserving all essential reference data and user access.