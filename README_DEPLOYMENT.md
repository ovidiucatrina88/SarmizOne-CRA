# Risk Quantification Platform - Production Deployment

## Complete Deployment Package

Your cybersecurity risk quantification platform is ready for production deployment with three deployment options:

### 🐳 Option 1: Docker Deployment (Recommended)
**One-command deployment with containerized PostgreSQL**

```bash
./docker-deploy.sh
```

**Features:**
- Automated PostgreSQL setup with sample data
- Multi-stage optimized containers
- Built-in health monitoring
- Easy scaling and management
- Complete isolation and security

### 🔧 Option 2: Traditional Linux Deployment
**Direct installation on your server**

```bash
./deploy.sh
```

**Features:**
- Native PostgreSQL installation
- Systemd service integration
- Local file system optimization
- Direct hardware access

### 📦 Option 3: Manual Deployment
**Step-by-step configuration for custom setups**

Follow the detailed guides in:
- `PRODUCTION_DEPLOYMENT.md` - Traditional deployment
- `DOCKER_DEPLOYMENT.md` - Container deployment

## Quick Start Summary

### Prerequisites Met
- ✅ PostgreSQL 15+ (or Docker for containerized)
- ✅ Node.js 18+ (or Docker for containerized)
- ✅ Complete database schema (18 tables)
- ✅ Sample data with 11 assets, 6 risks, 4 controls
- ✅ Production-optimized build process

### Application Features Deployed
- ✅ FAIR-U Risk Quantification with Monte Carlo simulation
- ✅ Interactive Dashboard with real-time metrics
- ✅ Asset Management with enterprise architecture
- ✅ Vulnerability Management with CVE tracking
- ✅ Control Library with effectiveness scoring
- ✅ Legal Entity compliance tracking
- ✅ Activity logging and audit trails
- ✅ Loss Exceedance Curve analysis

### Security & Performance
- ✅ Production environment variables
- ✅ Secure session management
- ✅ Database connection pooling
- ✅ Health check endpoints
- ✅ Error handling and logging
- ✅ Non-root user execution

## File Structure

```
risk-quantification-platform/
├── deploy.sh                    # Traditional deployment script
├── docker-deploy.sh            # Docker deployment script
├── docker-compose.yml          # Container orchestration
├── Dockerfile                  # Multi-stage container build
├── .env.production             # Production environment template
├── database_dumps/             # Database schema and data
│   ├── schema_postgres15.sql   # Complete database schema
│   └── fresh_data_deployment.sql # Clean sample data
├── PRODUCTION_DEPLOYMENT.md    # Traditional deployment guide
├── DOCKER_DEPLOYMENT.md        # Container deployment guide
└── README_DEPLOYMENT.md        # This overview file
```

## Deployment Verification

After deployment, your platform will be accessible at `http://localhost:5000` with:

### Dashboard Metrics
- Risk Summary: 6 total risks (1 critical, 2 high, 3 medium)
- Control Summary: 4 implemented controls (100% implementation rate)
- Asset Summary: 11 assets across multiple types
- Real-time risk calculations and exposure analysis

### API Endpoints (13 available)
- `/api/assets` - Asset management
- `/api/risks` - Risk assessment and quantification
- `/api/controls` - Security control management
- `/api/legal-entities` - Compliance tracking
- `/api/dashboard/summary` - Executive metrics
- `/api/risk-responses` - Risk treatment plans
- `/api/vulnerabilities` - CVE and vulnerability data
- And 6 additional specialized endpoints

### Database Tables (18 deployed)
- Complete FAIR-U risk model implementation
- Enterprise architecture relationships
- Vulnerability management schema
- Activity logging and audit trails
- User authentication framework

## Support Commands

### Docker Deployment
```bash
# View application logs
docker-compose logs -f risk-app

# Check service status
docker-compose ps

# Restart services
docker-compose restart

# Stop deployment
docker-compose down
```

### Traditional Deployment
```bash
# Check service status
sudo systemctl status risk-app

# View application logs
sudo journalctl -u risk-app -f

# Restart application
sudo systemctl restart risk-app
```

### Database Operations
```bash
# Connect to database (Docker)
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db

# Connect to database (Traditional)
psql -h localhost -U risk_app_user -d fair_risk_db

# Check table count
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

# Verify sample data
SELECT COUNT(*) FROM assets;
SELECT COUNT(*) FROM risks;
SELECT COUNT(*) FROM controls;
```

## Production Considerations

### Performance Optimization
- Connection pooling configured (max 10 connections)
- Query timeout settings (30 seconds)
- Optimized Docker multi-stage builds
- Efficient static file serving

### Security Hardening
- Generated secure passwords and session secrets
- Non-root container execution
- Environment variable protection
- Input validation and sanitization

### Monitoring & Maintenance
- Built-in health check endpoints
- Comprehensive error logging
- Activity audit trails
- Database connection monitoring

### Backup Strategy
- PostgreSQL dump scripts included
- Volume persistence for Docker
- Environment configuration backup
- Application state preservation

Your enterprise-grade cybersecurity risk quantification platform is now ready for production use with complete FAIR-U methodology implementation, interactive visualizations, and comprehensive risk management capabilities.