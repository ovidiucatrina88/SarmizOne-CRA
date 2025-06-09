# PostgreSQL 15.13 Debian Deployment Commands

## Tested with: PostgreSQL 15.13 (Debian 15.13-0+deb12u1)

### 1. Database Setup Commands
```bash
# Install PostgreSQL 15 on Debian 12
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "
CREATE DATABASE cybersecurity_risk_db 
  WITH ENCODING='UTF8' 
  LC_COLLATE='en_US.UTF-8' 
  LC_CTYPE='en_US.UTF-8' 
  TEMPLATE=template0;

CREATE USER app_user WITH 
  ENCRYPTED PASSWORD 'your_secure_password'
  CREATEDB 
  LOGIN;

GRANT ALL PRIVILEGES ON DATABASE cybersecurity_risk_db TO app_user;
ALTER DATABASE cybersecurity_risk_db OWNER TO app_user;
"
```

### 2. PostgreSQL 15 Configuration
```bash
# Edit postgresql.conf for production
sudo nano /etc/postgresql/15/main/postgresql.conf

# Key settings for production:
listen_addresses = 'localhost'          # Security: only local connections
max_connections = 100                   # Adjust based on application needs
shared_buffers = 256MB                  # 25% of available RAM
effective_cache_size = 1GB              # 75% of available RAM
work_mem = 4MB                          # Per-query memory
maintenance_work_mem = 64MB             # Maintenance operations
checkpoint_completion_target = 0.7      # Performance tuning
wal_buffers = 16MB                      # Write-ahead logging
default_statistics_target = 100         # Query planning
```

### 3. Authentication Setup (pg_hba.conf)
```bash
# Edit authentication file
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Add application connection (before other rules):
local   cybersecurity_risk_db   app_user                     md5
host    cybersecurity_risk_db   app_user    127.0.0.1/32     md5
host    cybersecurity_risk_db   app_user    ::1/128          md5

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql
```

### 4. Database Restoration Commands
```bash
# Test connection first
psql -U app_user -d cybersecurity_risk_db -c "SELECT version();"

# Restore using automated script
./restore_production.sh cybersecurity_risk_db app_user

# OR manual restoration:
psql -U app_user -d cybersecurity_risk_db -v ON_ERROR_STOP=1 -f schema_postgres15.sql
psql -U app_user -d cybersecurity_risk_db -v ON_ERROR_STOP=1 -c "SET session_replication_role = replica;"
psql -U app_user -d cybersecurity_risk_db -v ON_ERROR_STOP=1 -f data_postgres15.sql
psql -U app_user -d cybersecurity_risk_db -v ON_ERROR_STOP=1 -c "SET session_replication_role = DEFAULT;"
```

### 5. Verification Commands
```bash
# Check database connection
psql -U app_user -d cybersecurity_risk_db -c "
SELECT 
  schemaname, 
  tablename, 
  n_tup_ins as rows 
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
"

# Verify critical data
psql -U app_user -d cybersecurity_risk_db -c "
SELECT 'Assets' as table_name, COUNT(*) as count FROM assets
UNION ALL
SELECT 'Risks', COUNT(*) FROM risks
UNION ALL  
SELECT 'Controls', COUNT(*) FROM controls
UNION ALL
SELECT 'Legal Entities', COUNT(*) FROM legal_entities
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM activity_logs;
"

# Expected results:
# Assets: 11, Risks: 5, Controls: 3, Legal Entities: 4, Activity Logs: 268
```

### 6. Application Environment Configuration
```bash
# Create .env file for PostgreSQL 15
cat > .env << EOF
DATABASE_URL="postgresql://app_user:your_secure_password@localhost:5432/cybersecurity_risk_db"
SESSION_SECRET="your_session_secret_key_32_chars_min"
NODE_ENV="production"
PGHOST="localhost"
PGPORT="5432"
PGDATABASE="cybersecurity_risk_db"
PGUSER="app_user"
PGPASSWORD="your_secure_password"
EOF
```

### 7. Docker Integration with PostgreSQL 15
```yaml
# docker-compose.yml for application with external PostgreSQL 15
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://app_user:your_secure_password@host.docker.internal:5432/cybersecurity_risk_db
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - wait-for-postgres
    
  wait-for-postgres:
    image: postgres:15
    command: ['pg_isready', '-h', 'host.docker.internal', '-p', '5432', '-U', 'app_user']
    restart: 'no'
```

### 8. Performance Monitoring
```bash
# Monitor active connections
psql -U app_user -d cybersecurity_risk_db -c "
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active' AND datname = 'cybersecurity_risk_db';
"

# Check table sizes
psql -U app_user -d cybersecurity_risk_db -c "
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

## Compatibility Notes
- All dumps generated with `--no-owner --no-privileges` for cross-user compatibility
- Schema uses standard PostgreSQL 15 features only
- Foreign key constraints handled with `session_replication_role`
- Error handling with `ON_ERROR_STOP=1` for reliable restoration
- Supports both manual and automated restoration workflows