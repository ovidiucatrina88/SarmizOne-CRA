# Production Database Migration - Schema Alignment

This migration aligns your production PostgreSQL database with the current Neon development schema.

## Files
- `production_schema_aligned.sql` - Complete schema rebuild with all current columns
- `production_data_dump.sql` - Essential user and reference data

## Migration Steps

### 1. Backup Current Production Database
```bash
pg_dump -h YOUR_HOST -U YOUR_USER -d fair_risk_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Apply Schema Migration
```bash
psql -h YOUR_HOST -U YOUR_USER -d fair_risk_db -f production_schema_aligned.sql
```

### 3. Insert Essential Data
```bash
psql -h YOUR_HOST -U YOUR_USER -d fair_risk_db -f production_data_dump.sql
```

### 4. Verify Schema Alignment
```bash
psql -h YOUR_HOST -U YOUR_USER -d fair_risk_db -c "
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'legal_entities' 
ORDER BY ordinal_position;"
```

Expected columns: id, entity_id, name, description, parent_entity_id, created_at, type, jurisdiction, regulatory_framework, updated_at

### 5. Test Application
```bash
# Restart your application container
docker stop risk-platform
docker rm risk-platform
docker run -d --name risk-platform --env-file docker-production.env -p 5000:5000 risk-platform

# Test API endpoints
curl -H "Content-Type: application/json" https://sarmiz-one.io/api/legal-entities
curl -H "Content-Type: application/json" https://sarmiz-one.io/api/controls
```

## Key Schema Fixes

### Legal Entities Table
- Added: `type`, `jurisdiction`, `regulatory_framework`, `updated_at`

### Controls Table  
- Added: `is_per_agent`, `cost_per_agent`, `deployed_agent_count`, `is_per_agent_pricing`
- Added: compliance and mapping columns

### All Tables
- Proper ENUM types aligned with development
- All missing columns from development schema
- Proper indexes and constraints

## Rollback Plan
If migration fails, restore from backup:
```bash
psql -h YOUR_HOST -U YOUR_USER -d fair_risk_db < backup_TIMESTAMP.sql
```

## Validation Queries
```sql
-- Check if all required columns exist
SELECT 'legal_entities' as table_name, column_name 
FROM information_schema.columns 
WHERE table_name = 'legal_entities' 
ORDER BY ordinal_position;

SELECT 'controls' as table_name, column_name 
FROM information_schema.columns 
WHERE table_name = 'controls' AND column_name LIKE '%agent%';

-- Verify admin user exists
SELECT username, role FROM users WHERE username = 'admin';
```

This migration ensures your production database exactly matches your working development schema.