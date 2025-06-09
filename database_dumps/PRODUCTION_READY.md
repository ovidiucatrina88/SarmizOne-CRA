# PostgreSQL 15.13 Production Deployment Package

## ✅ VERIFIED COMPATIBLE WITH PostgreSQL 15.13 (Debian 15.13-0+deb12u1)

### Database Dumps (1.3MB Total)
```
schema_postgres15.sql       68K   - PostgreSQL 15 compatible schema
data_postgres15.sql        480K   - PostgreSQL 15 compatible data with triggers
postgres15_commands.md       8K   - Complete deployment guide
restore_production.sh        4K   - Automated restoration script
```

### Verified Data Content
- **Assets**: 11 records ($156.9M total valuation)
- **Risks**: 5 FAIR-U quantified risks ($25.7M → $14.2M exposure)
- **Controls**: 3 security controls (100% implementation rate)
- **Legal Entities**: 4 entities in organizational hierarchy
- **Activity Logs**: 268 complete audit trail records

## Deployment Commands for Your Debian Server

### 1. Install PostgreSQL 15.13
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database and User
```bash
sudo -u postgres psql -c "
CREATE DATABASE cybersecurity_risk_db 
  WITH ENCODING='UTF8' 
  LC_COLLATE='en_US.UTF-8' 
  LC_CTYPE='en_US.UTF-8';

CREATE USER app_user WITH 
  ENCRYPTED PASSWORD 'your_secure_password'
  CREATEDB LOGIN;

GRANT ALL PRIVILEGES ON DATABASE cybersecurity_risk_db TO app_user;
ALTER DATABASE cybersecurity_risk_db OWNER TO app_user;
"
```

### 3. Transfer and Restore Database
```bash
# Transfer files to your server
scp -r database_dumps/ user@your-server:/opt/cybersecurity-app/

# Run restoration
cd /opt/cybersecurity-app/database_dumps
chmod +x restore_production.sh
./restore_production.sh cybersecurity_risk_db app_user
```

### 4. Configure Application Environment
```bash
# Create production .env file
cat > /opt/cybersecurity-app/.env << EOF
DATABASE_URL="postgresql://app_user:your_secure_password@localhost:5432/cybersecurity_risk_db"
SESSION_SECRET="your_session_secret_key_32_chars_min"
NODE_ENV="production"
EOF
```

### 5. Deploy with Docker
```dockerfile
# Dockerfile (already created in your project)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run container
docker build -t cybersecurity-risk-app .
docker run -d \
  --name cybersecurity-app \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  cybersecurity-risk-app
```

## Expected Results After Deployment

### Dashboard Metrics
- **Risk Summary**: 5 risks with 45% reduction (inherent → residual)
- **Asset Summary**: 11 assets across multiple types and legal entities
- **Control Summary**: 3 controls with 100% implementation effectiveness
- **Activity**: 268 logged operations for complete audit trail

### API Endpoints (All Functional)
- `GET /api/dashboard/summary` - Main dashboard data
- `GET /api/assets` - Asset management
- `GET /api/risks` - FAIR-U risk assessments
- `GET /api/controls` - Security control tracking
- `GET /api/legal-entities` - Organizational structure

## Verification Commands

### Test Database Connection
```bash
psql -U app_user -d cybersecurity_risk_db -c "SELECT version();"
```

### Verify Data Restoration
```bash
psql -U app_user -d cybersecurity_risk_db -c "
SELECT 'Assets' as table_name, COUNT(*) as count FROM assets
UNION ALL SELECT 'Risks', COUNT(*) FROM risks
UNION ALL SELECT 'Controls', COUNT(*) FROM controls;
"
# Expected: Assets=11, Risks=5, Controls=3
```

### Test Application
```bash
curl http://localhost:5000/api/dashboard/summary
# Should return JSON with riskSummary, controlSummary, assetSummary
```

## Key Advantages of This Setup

✅ **No Vendor Lock-in**: Standard PostgreSQL works anywhere  
✅ **Debian Native**: Optimized for your target OS  
✅ **Production Hardened**: Connection pooling, error handling, retry logic  
✅ **Complete FAIR-U**: Full risk quantification methodology operational  
✅ **Docker Ready**: Containerized application with external database  
✅ **Audit Ready**: Complete activity logging and data integrity

Your cybersecurity risk quantification platform is now ready for production deployment on any Debian server with PostgreSQL 15.13.