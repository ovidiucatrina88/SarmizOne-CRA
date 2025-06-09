# Risk Quantification Platform

A sophisticated cybersecurity risk quantification platform using the FAIR-U methodology for enterprise deployment.

## Technologies
- **Frontend**: React + TypeScript with D3.js visualizations
- **Backend**: Express.js with Drizzle ORM
- **Database**: PostgreSQL 15+ (external database supported)
- **Deployment**: Docker containerization

## Quick Deployment

### Prerequisites
- Docker installed
- PostgreSQL database running at 172.17.0.1:5432
- Your database credentials

### Deploy Application Container

1. **Create environment file**:
```bash
cp .env.external-db .env.production
# Edit .env.production with your actual database credentials
```

2. **Deploy**:
```bash
./docker-simple-deploy.sh
```

### Manual Deployment
```bash
# Build image
docker build -t risk-app:latest .

# Start container
docker run -d \
  --name risk-quantification-app \
  --restart unless-stopped \
  -p 5000:5000 \
  --add-host=host.docker.internal:host-gateway \
  --env-file .env.production \
  risk-app:latest
```

## Management Commands

```bash
# View logs
docker logs -f risk-quantification-app

# Stop application
docker stop risk-quantification-app

# Restart application
docker restart risk-quantification-app

# Remove container
docker rm -f risk-quantification-app
```

## Application Access
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## File Structure

### Essential Files
- `Dockerfile` - Application container configuration
- `docker-compose.yml` - Development compose file
- `docker-simple-deploy.sh` - Production deployment script
- `.env.external-db` - Environment template
- `EXTERNAL_DB_DEPLOYMENT.md` - Detailed deployment guide

### Database
- `database_dumps/fresh_data_deployment.sql` - Production data
- `database_dumps/data_postgres15_clean.sql` - Clean sample data

The application connects to your existing PostgreSQL database without creating additional database containers.