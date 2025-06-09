#!/bin/bash

# Production deployment script for Hetzner server
set -e

echo "Deploying Risk Management Platform..."

# Create directory structure
mkdir -p dist/client

# Copy production files
cp deployment/production.cjs dist/production.cjs
cp deployment/client.html dist/client/index.html

echo "Files deployed:"
echo "- dist/production.cjs ($(wc -c < deployment/production.cjs) bytes)"
echo "- dist/client/index.html ($(wc -c < deployment/client.html) bytes)"

# Check for environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "Warning: DATABASE_URL not set"
    echo "Set with: export DATABASE_URL='postgresql://user:pass@host:port/db'"
fi

echo ""
echo "Starting production server..."
echo "Server will be available at http://your-server-ip:5000"

# Set production environment
export NODE_ENV=production

# Start the server
node dist/production.cjs