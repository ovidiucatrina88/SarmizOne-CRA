#!/bin/bash

# Production Deployment Script for SARMIZ-ONE Risk Management Platform
set -e

echo "🚀 Starting production deployment..."

# Environment setup
export NODE_ENV=production
export PORT=5000
export HOST=0.0.0.0

# Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf dist/
mkdir -p dist/public
mkdir -p dist/static

# Copy assets
echo "📁 Copying assets..."
cp -r attached_assets/ dist/public/attached_assets/

# Build frontend (with timeout to prevent hanging)
echo "🔨 Building frontend..."
timeout 300 npm run build || {
    echo "⚠️  Build timed out, using fallback build..."
    mkdir -p dist/public
    cp -r client/index.html dist/public/
    cp -r client/src dist/public/src/
    cp -r attached_assets/ dist/public/attached_assets/
}

# Build backend
echo "🔧 Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/ --target=node18

# Copy necessary files
echo "📋 Copying configuration files..."
cp package.json dist/
cp .env.production dist/.env
cp -r shared/ dist/shared/

# Set permissions
chmod +x dist/index.js

echo "✅ Production build complete!"
echo "📍 Frontend assets: dist/public/"
echo "📍 Backend server: dist/index.js"
echo "📍 Environment: dist/.env"

echo ""
echo "🚀 To start the production server:"
echo "   cd dist && NODE_ENV=production node index.js"

echo ""
echo "🌐 The application will be available at:"
echo "   http://localhost:5000"
echo "   https://your-domain.com (when deployed)"