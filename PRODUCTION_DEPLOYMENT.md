# Risk Quantification Platform - Production Deployment Guide

## Prerequisites

Your Linux server should have:
- PostgreSQL 15+ installed and running
- Node.js 18+ installed
- Git installed
- Port 5000 available for the application

## Database Setup

1. **Create Database and User:**
```bash
sudo -u postgres psql -c "CREATE DATABASE fair_risk_db;"
sudo -u postgres psql -c "CREATE USER risk_app_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fair_risk_db TO risk_app_user;"
sudo -u postgres psql -c "ALTER USER risk_app_user CREATEDB;"
```

2. **Deploy Schema:**
```bash
cd database_dumps
psql -h localhost -U risk_app_user -d fair_risk_db -f schema_postgres15.sql
```

3. **Load Sample Data:**
```bash
psql -h localhost -U risk_app_user -d fair_risk_db -f fresh_data_deployment.sql
```

## Application Configuration

1. **Update Environment Variables:**
Create a `.env.production` file:
```bash
# Database Configuration
DATABASE_URL=postgresql://risk_app_user:your_secure_password@localhost:5432/fair_risk_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=fair_risk_db
PGUSER=risk_app_user
PGPASSWORD=your_secure_password

# Application Configuration
NODE_ENV=production
SESSION_SECRET=your_very_secure_session_secret_at_least_32_characters
BYPASS_AUTH=true

# Production deployment flag
PRODUCTION_DEPLOYMENT=true
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Build Application:**
```bash
npm run build
```

## Running the Application

### Development Mode:
```bash
npm run dev
```

### Production Mode:
```bash
NODE_ENV=production npm start
```

### Production with Environment File:
```bash
NODE_ENV=production node --env-file=.env.production server/index.js
```

## Systemd Service (Recommended for Production)

Create `/etc/systemd/system/risk-app.service`:
```ini
[Unit]
Description=Risk Quantification Platform
After=network.target postgresql.service

[Service]
Type=simple
User=your_app_user
WorkingDirectory=/path/to/your/app
Environment=NODE_ENV=production
EnvironmentFile=/path/to/your/app/.env.production
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable risk-app
sudo systemctl start risk-app
sudo systemctl status risk-app
```

## Database Connection Test

Test your database connection:
```bash
psql -h localhost -U risk_app_user -d fair_risk_db -c "SELECT COUNT(*) FROM assets;"
```

## Firewall Configuration

Ensure port 5000 is accessible:
```bash
sudo ufw allow 5000
```

## Application Features

The deployed application includes:
- **18 Database Tables** with complete schema
- **13 API Endpoints** for full CRUD operations
- **Sample Data**: 11 assets, 6 risks, 4 controls, 4 legal entities
- **FAIR-U Risk Quantification** with Monte Carlo simulation
- **Interactive Dashboard** with real-time risk metrics
- **Enterprise Architecture** visualization
- **Vulnerability Management** system
- **Dark Theme UI** with responsive design

## Verification Steps

1. **Database Connection:**
   - Application logs should show "Database initialization successful"
   - No connection timeout errors

2. **API Endpoints:**
   - Visit `http://your-server:5000/health` for health check
   - All API routes under `/api/*` should respond correctly

3. **Frontend Loading:**
   - Dashboard should display risk metrics and charts
   - All navigation links should work
   - Data should load from your PostgreSQL database

## Troubleshooting

### Database Connection Issues:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check user permissions: `sudo -u postgres psql -c "\du"`
- Test connection: `psql -h localhost -U risk_app_user -d fair_risk_db`

### Application Startup Issues:
- Check logs: `sudo journalctl -u risk-app -f`
- Verify Node.js version: `node --version`
- Check environment variables: `printenv | grep -E '(DATABASE|NODE)'`

### Port Access Issues:
- Check if port is in use: `sudo netstat -tlnp | grep :5000`
- Verify firewall rules: `sudo ufw status`

## Security Considerations

1. **Database Security:**
   - Use strong passwords for database user
   - Restrict database access to localhost only
   - Regular backup strategy

2. **Application Security:**
   - Change default session secret
   - Consider enabling authentication in production
   - Use HTTPS with reverse proxy (nginx/apache)

3. **System Security:**
   - Run application as non-root user
   - Keep system and dependencies updated
   - Monitor application logs

## Performance Optimization

1. **Database:**
   - Regular VACUUM and ANALYZE operations
   - Monitor connection pool usage
   - Consider read replicas for high load

2. **Application:**
   - Use process manager (PM2) for clustering
   - Implement caching strategies
   - Monitor memory usage

Your cybersecurity risk quantification platform is now ready for production deployment with full PostgreSQL database integration and enterprise-grade features.