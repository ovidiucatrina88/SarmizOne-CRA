# Docker Production Deployment Guide

## Quick Start with Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start with your current configuration
docker-compose up --build -d

# Check logs
docker-compose logs -f app

# Stop the application
docker-compose down
```

### Option 2: Using Docker Run

```bash
# Build the image
docker build -t risk-app .

# Run with environment file
docker run -d \
  --name risk-app \
  --env-file docker-production.env \
  --network host \
  --restart unless-stopped \
  risk-app

# Check logs
docker logs -f risk-app

# Stop the container
docker stop risk-app
docker rm risk-app
```

### Option 3: Manual Environment Variables

```bash
docker run -d \
  --name risk-app \
  --network host \
  --restart unless-stopped \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://risk_app_user:mysecurepassword@172.17.0.1:5432/fair_risk_db" \
  -e SESSION_SECRET="528966b8f8e0698925fb61e8fe1c5fba0df41742ad589e95f55a426dadb884e27c90b68a007e8d14674cdcf1011fde7503465c33201e00b6e08205b982690d4a" \
  -e HOST=0.0.0.0 \
  -e PORT=5000 \
  -e BYPASS_AUTH=false \
  risk-app
```

## Configuration Files Created

1. **docker-production.env** - Environment variables for Docker
2. **Updated Dockerfile** - Production-ready with health checks
3. **Updated docker-compose.yml** - Uses your database configuration

## Network Configuration

The setup uses `--network host` to allow the container to connect to your PostgreSQL instance at `172.17.0.1:5432`. This matches your current configuration.

## Health Checks

The container includes health checks that verify:
- Application is responding on port 5000
- Authentication endpoint is accessible
- Database connectivity is working

## Monitoring

```bash
# Check container status
docker ps

# View application logs
docker logs -f risk-app

# Check health status
docker inspect risk-app | grep Health -A 10

# Monitor resource usage
docker stats risk-app
```

## Default Credentials

- **Username**: admin
- **Password**: admin123

## Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker logs risk-app

# Verify environment variables
docker exec risk-app env | grep DATABASE_URL
```

### Database connection issues
```bash
# Test database connectivity from container
docker exec risk-app curl -f http://localhost:5000/api/auth/user
```

### Port conflicts
```bash
# Check what's using port 5000
netstat -tulpn | grep 5000

# Use different port if needed
docker run -p 8080:5000 risk-app
```

The application is now fully configured for Docker production deployment with your existing database setup.