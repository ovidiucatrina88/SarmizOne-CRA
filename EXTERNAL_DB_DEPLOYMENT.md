# Risk Quantification Platform - External Database Deployment

## Overview
Deploy only the application container connecting to your existing PostgreSQL database.

## Production Deployment

### Step 1: Create Environment File
Copy the template and add your credentials:
```bash
cp .env.external-db .env.production
# Edit .env.production with your actual database credentials
```

### Step 2: Run Deployment Script
```bash
./docker-deploy.sh
```

### Step 3: Manual Deployment (Alternative)
```bash
# Build application image
docker build -t risk-app:latest .

# Start application container
docker run -d \
  --name risk-quantification-app \
  --restart unless-stopped \
  -p 5000:5000 \
  --add-host=host.docker.internal:host-gateway \
  --env-file .env.production \
  risk-app:latest
```

## Configuration Details

### Environment File Template (.env.production)
```
NODE_ENV=production
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@172.17.0.1:5432/YOUR_DB_NAME
PGHOST=172.17.0.1
PGPORT=5432
PGUSER=YOUR_DB_USER
PGPASSWORD=YOUR_DB_PASSWORD
PGDATABASE=YOUR_DB_NAME
HOST=0.0.0.0
PORT=5000
SESSION_SECRET=GENERATE_SECURE_SESSION_SECRET
BYPASS_AUTH=true
PRODUCTION_DEPLOYMENT=true
```

### Network Configuration
- Container uses --add-host for external database connectivity
- Application accessible at http://localhost:5000
- Database connection through host.docker.internal gateway

## Verification Commands

### Check Application Status
```bash
# Container status
docker ps | grep risk-quantification-app

# Application health
curl http://localhost:5000/health

# Database connectivity test
curl http://localhost:5000/api/assets
```

### View Logs
```bash
# Application logs
docker logs -f risk-quantification-app

# Recent logs only
docker logs --tail=50 risk-quantification-app
```

### Management Commands
```bash
# Stop application
docker stop risk-quantification-app

# Restart application
docker restart risk-quantification-app

# Remove container
docker rm -f risk-quantification-app

# Rebuild and restart
docker build -t risk-app:latest .
docker rm -f risk-quantification-app
docker run -d --name risk-quantification-app --restart unless-stopped -p 5000:5000 --add-host=host.docker.internal:host-gateway --env-file .env.production risk-app:latest
```

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running and accessible
2. Test direct connection: `psql -h 172.17.0.1 -U your_user -d your_db`
3. Check firewall settings for port 5432
4. Verify credentials in .env.production

### Application Issues
1. Check container logs: `docker logs risk-quantification-app`
2. Verify environment variables: `docker exec risk-quantification-app env`
3. Test health endpoint: `curl -v http://localhost:5000/health`

### Build Issues
1. Clear Docker cache: `docker system prune -a`
2. Rebuild: `docker build --no-cache -t risk-app:latest .`
3. Check Dockerfile syntax and file paths

Your application container connects to the existing database without creating additional PostgreSQL containers or data volumes.