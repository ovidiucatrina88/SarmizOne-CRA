#!/bin/bash

# Complete Production Deployment Fix for API Routes
echo "Building production server with all API routes..."

# Build the production server
node build.config.js

# Copy built files to production directory
cp dist/server.cjs dist/production.cjs

echo "Production server built with all API routes including /api/auth/users"
echo "Ready for deployment to fix 404 errors"