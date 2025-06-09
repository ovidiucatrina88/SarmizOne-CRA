# Risk Quantification Platform - Docker Deployment Guide

## Quick Start (Recommended)

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB+ available RAM
- Port 5000 available

### One-Command Deployment
```bash
chmod +x docker-deploy.sh
./docker-deploy.sh
```

This automated script will:
- Build the application container
- Start PostgreSQL database with sample data
- Deploy the Risk Quantification Platform
- Configure networking and health checks
- Verify deployment success

### Manual Docker Deployment

1. **Clone and prepare the application:**
```bash
git clone <your-repo>
cd risk-quantification-platform
```

2. **Create environment configuration:**
```bash
# Generate secure credentials
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
SESSION_SECRET=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
DB_PASSWORD=$DB_PASSWORD
SESSION_SECRET=$SESSION_SECRET
EOF
```

3. **Build and start services:**
```bash
docker-compose build
docker-compose up -d
```

4. **Verify deployment:**
```bash
# Check service status
docker-compose ps

# View application logs
docker-compose logs -f risk-app

# Test application
curl http://localhost:5000/health
```

## Architecture

The Docker deployment includes:

### PostgreSQL Database Container
- **Image:** postgres:15-alpine
- **Database:** fair_risk_db
- **User:** risk_app_user
- **Port:** 5432 (internal), exposed for development
- **Volume:** Persistent data storage
- **Initialization:** Automatic schema and sample data loading

### Application Container
- **Base Image:** node:18-alpine
- **Port:** 5000
- **Environment:** Production optimized
- **Health Checks:** Built-in endpoint monitoring
- **Dependencies:** All Node.js packages and system tools

### Networking
- **Internal Network:** risk-network (bridge)
- **Database Communication:** Internal DNS resolution
- **External Access:** Port 5000 exposed to host

## Configuration

### Environment Variables
The application uses these environment variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://risk_app_user:${DB_PASSWORD}@postgres:5432/fair_risk_db

# Application Settings
NODE_ENV=production
SESSION_SECRET=${SESSION_SECRET}
BYPASS_AUTH=true
PRODUCTION_DEPLOYMENT=true
```

### Database Schema
The PostgreSQL container automatically:
- Creates the `fair_risk_db` database
- Sets up the `risk_app_user` with proper permissions
- Loads the complete schema (18 tables)
- Populates with sample data (assets, risks, controls, entities)

## Application Features

Your deployed platform includes:

### Core Functionality
- **Asset Management:** 11 sample assets across multiple types
- **Risk Assessment:** 6 risks with FAIR-U quantification
- **Control Management:** 4 security controls with effectiveness tracking
- **Legal Entity Management:** 4 entities with regulatory compliance
- **Enterprise Architecture:** System relationship mapping

### Advanced Features
- **Risk Quantification:** Monte Carlo simulation with FAIR-U methodology
- **Interactive Dashboard:** Real-time metrics and visualizations
- **Loss Exceedance Curves:** Historical risk exposure analysis
- **Vulnerability Management:** CVE tracking and asset correlation
- **Activity Logging:** Complete audit trail

### User Interface
- **Dark Theme:** Professional, modern design
- **Responsive Layout:** Mobile, tablet, and desktop support
- **Real-time Updates:** Live data synchronization
- **Interactive Charts:** D3.js powered visualizations

## Management Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart risk-app

# View service status
docker-compose ps

# Scale application (if needed)
docker-compose up -d --scale risk-app=2
```

### Monitoring and Logs
```bash
# View application logs
docker-compose logs -f risk-app

# View database logs
docker-compose logs -f postgres

# View all logs
docker-compose logs -f

# Check health status
curl http://localhost:5000/health
```

### Database Operations
```bash
# Connect to database
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db

# Backup database
docker-compose exec postgres pg_dump -U risk_app_user fair_risk_db > backup.sql

# View database tables
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db -c "\dt"
```

### Data Management
```bash
# Reset database (careful - deletes all data)
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db -f /docker-entrypoint-initdb.d/fresh_data_deployment.sql

# Check asset count
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db -c "SELECT COUNT(*) FROM assets;"
```

## Troubleshooting

### Container Issues
```bash
# Check container status
docker-compose ps

# View detailed container info
docker inspect risk-app
docker inspect risk-postgres

# Access container shell
docker-compose exec risk-app sh
docker-compose exec postgres bash
```

### Database Connection Issues
```bash
# Test database connectivity
docker-compose exec postgres pg_isready -U risk_app_user -d fair_risk_db

# Check database permissions
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db -c "\du"

# Verify table creation
docker-compose exec postgres psql -U risk_app_user -d fair_risk_db -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

### Application Issues
```bash
# Check application health
curl -f http://localhost:5000/health

# Test API endpoints
curl http://localhost:5000/api/assets
curl http://localhost:5000/api/risks
curl http://localhost:5000/api/dashboard/summary

# View build logs
docker-compose logs risk-app | grep -i error
```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Check memory usage by service
docker-compose exec risk-app ps aux
docker-compose exec postgres ps aux

# View disk usage
docker system df
```

## Security Considerations

### Container Security
- Non-root user execution
- Minimal base images (Alpine Linux)
- Health check endpoints
- Resource limits configured

### Database Security
- Generated secure passwords
- User privilege restrictions
- Network isolation
- Volume encryption support

### Application Security
- Environment variable protection
- Session secret generation
- Input validation enabled
- HTTPS ready (with reverse proxy)

## Production Enhancements

### Reverse Proxy Setup (nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### SSL/TLS Configuration
```bash
# Using Let's Encrypt
certbot --nginx -d your-domain.com
```

### Backup Strategy
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec postgres pg_dump -U risk_app_user fair_risk_db > "backup_${DATE}.sql"
gzip "backup_${DATE}.sql"
```

### Monitoring Setup
```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

Your Risk Quantification Platform is now containerized and ready for scalable production deployment.