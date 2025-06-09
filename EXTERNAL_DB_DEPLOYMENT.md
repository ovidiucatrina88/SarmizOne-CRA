# Risk Quantification Platform - External Database Deployment

## Overview
Deploy only the application container connecting to your existing PostgreSQL database at 172.17.0.1:5432.

## Quick Deployment

### Step 1: Run Deployment Script
```bash
./docker-deploy.sh
```

### Step 2: Manual Deployment (Alternative)
```bash
# Copy environment template
cp .env.external-db .env

# Build and start application
docker-compose build
docker-compose up -d

# Verify deployment
curl http://localhost:5000/health
```

## Configuration Details

### Environment Variables
Your application will use these settings:
```
NODE_ENV=production
DATABASE_URL=postgresql://risk_app_user:KhViS-6cU9yufFkQZ9B3@172.17.0.1:5432/fair_risk_db
PGHOST=172.17.0.1
PGPORT=5432
PGUSER=risk_app_user
PGPASSWORD=KhViS-6cU9yufFkQZ9B3
PGDATABASE=fair_risk_db
HOST=0.0.0.0
PORT=5000
```

### Network Configuration
- Container uses host network mode for external database connectivity
- Application accessible at http://localhost:5000
- Database connection through Docker host networking

## Verification Commands

### Check Application Status
```bash
# Container status
docker-compose ps

# Application health
curl http://localhost:5000/health

# Database connectivity test
curl http://localhost:5000/api/assets
```

### View Logs
```bash
# Application logs
docker-compose logs -f risk-app

# Recent logs only
docker-compose logs --tail=50 risk-app
```

### Management Commands
```bash
# Stop application
docker-compose down

# Restart application
docker-compose restart

# Rebuild and restart
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running: `systemctl status postgresql`
2. Test direct connection: `psql -h 172.17.0.1 -U risk_app_user -d fair_risk_db`
3. Check firewall settings for port 5432

### Application Issues
1. Check container logs: `docker-compose logs risk-app`
2. Verify environment variables: `docker-compose exec risk-app env`
3. Test health endpoint: `curl -v http://localhost:5000/health`

### Build Issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild: `docker-compose build --no-cache`
3. Check Dockerfile syntax and file paths

Your application container will connect to the existing database without creating additional PostgreSQL containers or data volumes.