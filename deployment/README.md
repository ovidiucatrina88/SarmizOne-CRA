# Production Deployment Files

This directory contains the production-ready files for deployment to your Hetzner server.

## Files

- `production.cjs` - Main production server (269KB)
- `client.html` - Client interface
- `deploy.sh` - Deployment script

## Deployment on Hetzner Server

1. Clone or pull this repository on your server
2. Run the deployment script:

```bash
cd /root/risk-hetzner
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

Or manually:

```bash
# Create directory structure
mkdir -p dist/client

# Copy files
cp deployment/production.cjs dist/production.cjs
cp deployment/client.html dist/client/index.html

# Set environment variables
export NODE_ENV=production
export DATABASE_URL="your_postgres_connection_string"

# Start server
node dist/production.cjs
```

The server will be available at http://your-server-ip:5000