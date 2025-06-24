#!/bin/bash

# Production Deployment Script for Session Cookie Fixes
echo "🚀 Deploying session cookie fixes to production..."

# Build the production server
echo "📦 Building production server..."
node build.config.js

# Copy the built server to production location
echo "📋 Copying production build..."
cp dist/server.cjs dist/production.cjs

# Set environment for production
echo "🔧 Setting production environment..."
export NODE_ENV=production

echo "✅ Session cookie fixes deployed successfully!"
echo "🔄 Restart your production server to apply changes."
echo ""
echo "Commands to restart production:"
echo "  docker-compose restart"
echo "  or"
echo "  pm2 restart all"
echo "  or"
echo "  systemctl restart your-app-service"