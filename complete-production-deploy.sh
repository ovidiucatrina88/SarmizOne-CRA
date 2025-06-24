#!/bin/bash

# Complete Production Deployment Script
echo "🚀 Building complete production server with all API fixes..."

# Remove any existing logs directory conflict
rm -rf server/routes/logs

# Build the production server with all routes
echo "📦 Building production server..."
node build.config.js

# Verify the build includes all necessary endpoints
echo "✅ Verifying API endpoints in production build..."
MISSING_ENDPOINTS=0

ENDPOINTS=("auth/users" "logs" "dashboard" "assets" "risks" "controls")
for endpoint in "${ENDPOINTS[@]}"; do
  if grep -q "$endpoint" dist/production.cjs; then
    echo "✓ $endpoint found"
  else
    echo "✗ $endpoint MISSING"
    MISSING_ENDPOINTS=1
  fi
done

if [ $MISSING_ENDPOINTS -eq 0 ]; then
    echo "🎉 All API endpoints present in production build"
    echo "📋 Production server ready for deployment"
    echo ""
    echo "To deploy:"
    echo "1. Copy dist/production.cjs to your production server"
    echo "2. Restart your production application"
    echo "3. Verify https://sarmiz-one.io/api/auth/users returns data"
else
    echo "❌ Missing endpoints detected - build may be incomplete"
fi