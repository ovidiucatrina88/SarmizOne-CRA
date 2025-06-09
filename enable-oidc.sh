#!/bin/bash
# Script to enable OKTA OIDC authentication in production

echo "Enabling OKTA OIDC authentication..."

# Update production server to use full auth
sed -i 's/from "\.\/production-auth"/from "\.\/auth"/' server/production.ts

# Update build config to include OIDC dependencies
sed -i '/passport/a\    '\''passport-local'\'',\n    '\''passport-openidconnect'\'',' build.config.js

# Rebuild production server
echo "Rebuilding production server with OIDC support..."
node build.config.js

# Rebuild Docker image
echo "Rebuilding Docker image..."
docker build -t risk-app:latest .

echo "OIDC enabled! Update your .env.production with OKTA credentials and restart container."
echo ""
echo "Next steps:"
echo "1. Update .env.production with OKTA configuration"
echo "2. Remove BYPASS_AUTH=true from .env.production"
echo "3. Restart container: docker restart risk-quantification-app"