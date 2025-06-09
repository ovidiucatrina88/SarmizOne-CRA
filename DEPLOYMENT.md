# Linux Server Deployment Guide

## Architecture Overview
- **Linux Server (Debian)**: Host operating system
- **Docker Container**: Application runtime environment
- **PostgreSQL Database**: Standalone installation (non-containerized)

## Database Stack
- **Drizzle ORM**: Type-safe database operations (KEEP)
- **Standard PostgreSQL Driver (pg)**: Replaces Neon for local PostgreSQL
- **Connection Pool**: Optimized for production workloads

## Prerequisites

### 1. PostgreSQL Database Setup
```bash
# Install PostgreSQL on Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE cybersecurity_risk_db;
CREATE USER app_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE cybersecurity_risk_db TO app_user;
\q
```

### 2. Environment Configuration
Create `.env` file with your database connection:
```bash
DATABASE_URL="postgresql://app_user:your_secure_password@localhost:5432/cybersecurity_risk_db"
SESSION_SECRET="your_session_secret_key"
NODE_ENV="production"
```

## Docker Deployment

### 1. Create Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Docker Compose (Optional)
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://app_user:password@host.docker.internal:5432/cybersecurity_risk_db
      - NODE_ENV=production
    depends_on:
      - postgres
    restart: unless-stopped

  # If you prefer PostgreSQL in Docker instead of standalone
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cybersecurity_risk_db
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Database Migration
Run migrations after deployment:
```bash
# Push schema to database
docker exec -it <container_name> npm run db:push

# Or run directly if using standalone PostgreSQL
npm run db:push
```

## Production Optimizations

### 1. Database Connection Pool
The application is configured with:
- **Max Connections**: 10 (adjust based on server capacity)
- **Connection Timeout**: 5 seconds
- **Idle Timeout**: 30 seconds
- **Retry Logic**: 3 attempts with exponential backoff

### 2. Security Considerations
- Use strong passwords for database credentials
- Configure PostgreSQL to accept connections only from application
- Set up SSL/TLS for database connections in production
- Use environment variables for all sensitive configuration

### 3. Monitoring
- Database connection status logged
- Automatic reconnection with exponential backoff
- Health check endpoint available at `/health`

## Key Benefits of This Stack

✅ **No Vendor Lock-in**: Standard PostgreSQL works anywhere
✅ **Lower Latency**: Direct database connection without cloud overhead  
✅ **Cost Effective**: No external database service fees
✅ **Full Control**: Complete database administration access
✅ **High Performance**: Optimized connection pooling and retry logic

## Migration from Neon
The application has been updated to use standard PostgreSQL drivers instead of Neon serverless. All FAIR-U risk quantification functionality remains identical - only the database connection layer changed.

## Testing Deployment
```bash
# Test database connectivity
curl http://localhost:5000/api/dashboard/summary

# Verify all APIs
curl http://localhost:5000/api/assets
curl http://localhost:5000/api/risks
curl http://localhost:5000/api/controls
```