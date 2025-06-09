# Database Restoration Guide

This directory contains complete database dumps for the Cybersecurity Risk Quantification application.

## Files Structure

### Schema Dump
- `schema_dump.sql` - Complete database schema including tables, types, constraints, and indexes

### Data Dumps
- `data_dump.sql` - Complete data dump with INSERT statements
- `data_dump_with_triggers.sql` - Data dump with trigger handling for circular foreign keys
- `tables/` - Individual table data dumps for granular restoration

### Table Inventory (18 tables)
1. **activity_logs** - System activity tracking (268 records)
2. **assets** - Asset inventory (11 records)
3. **risks** - Risk assessments (5 records)
4. **controls** - Security controls (3 records)
5. **legal_entities** - Legal entity structure (4 records)
6. **risk_responses** - Risk mitigation responses (1 record)
7. **enterprise_architecture** - Architecture components (3 records)
8. **control_library** - Control templates
9. **risk_library** - Risk templates
10. **cost_modules** - Cost calculation modules
11. **risk_controls** - Risk-control relationships
12. **risk_costs** - Risk cost associations
13. **risk_summaries** - Risk summary calculations
14. **asset_relationships** - Asset dependencies
15. **response_cost_modules** - Response cost mappings
16. **users** - User accounts
17. **sessions** - User sessions
18. **vulnerabilities** - Vulnerability tracking

## Restoration Process

### 1. Create Database and User
```bash
# On your production PostgreSQL server
sudo -u postgres psql
CREATE DATABASE cybersecurity_risk_db;
CREATE USER app_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cybersecurity_risk_db TO app_user;
ALTER USER app_user CREATEDB;
\q
```

### 2. Restore Schema
```bash
# Restore database structure
psql -U app_user -d cybersecurity_risk_db -f schema_dump.sql
```

### 3. Restore Data (Choose one method)

#### Method A: Complete Data Restore
```bash
# Restore all data at once (handles foreign key constraints)
psql -U app_user -d cybersecurity_risk_db -f data_dump_with_triggers.sql
```

#### Method B: Table-by-Table Restore
```bash
# Restore tables in dependency order
psql -U app_user -d cybersecurity_risk_db -f tables/legal_entities_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/assets_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/risks_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/controls_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/risk_responses_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/activity_logs_data.sql
psql -U app_user -d cybersecurity_risk_db -f tables/enterprise_architecture_data.sql
# Continue with remaining tables...
```

### 4. Verify Restoration
```bash
# Check table counts
psql -U app_user -d cybersecurity_risk_db -c "
SELECT schemaname, tablename, n_tup_ins as row_count 
FROM pg_stat_user_tables 
ORDER BY tablename;"

# Verify specific data
psql -U app_user -d cybersecurity_risk_db -c "SELECT COUNT(*) FROM assets;"
psql -U app_user -d cybersecurity_risk_db -c "SELECT COUNT(*) FROM risks;"
psql -U app_user -d cybersecurity_risk_db -c "SELECT COUNT(*) FROM controls;"
```

## Environment Configuration

After database restoration, configure your application:

```bash
# .env file for production
DATABASE_URL="postgresql://app_user:your_secure_password@localhost:5432/cybersecurity_risk_db"
SESSION_SECRET="your_session_secret_key"
NODE_ENV="production"
```

## Expected Data Volumes
- **Assets**: 11 records ($365M total value across legal entities)
- **Risks**: 5 records ($25.7M inherent → $14.2M residual exposure)
- **Controls**: 3 controls (100% implementation rate)
- **Legal Entities**: 4 entities (Company Group hierarchy)
- **Activity Logs**: 268 historical operations
- **Risk Responses**: 1 mitigation strategy

## Troubleshooting

### Foreign Key Constraint Issues
If you encounter foreign key constraint errors:
```bash
# Disable triggers during restore
psql -U app_user -d cybersecurity_risk_db -c "SET session_replication_role = replica;"
# Run your data restore
psql -U app_user -d cybersecurity_risk_db -f data_dump.sql
# Re-enable triggers
psql -U app_user -d cybersecurity_risk_db -c "SET session_replication_role = DEFAULT;"
```

### Permission Issues
Ensure the application user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
```