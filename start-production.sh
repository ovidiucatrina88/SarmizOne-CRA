#!/bin/bash

# Production startup script for SARMIZ-ONE Risk Management Platform

# Load environment variables from .env.production
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '#' | xargs)
    echo "Loaded environment variables from .env.production"
else
    echo "Warning: .env.production file not found"
fi

# Ensure required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL is not set. Please configure your database connection."
    echo "Example: export DATABASE_URL='postgresql://user:password@localhost:5432/riskapp'"
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    echo "Warning: SESSION_SECRET not set. Using default (not recommended for production)"
    export SESSION_SECRET="your-super-secure-session-secret-here"
fi

# Set production defaults
export NODE_ENV=production
export PORT=${PORT:-5000}
export HOST=${HOST:-0.0.0.0}

echo "Starting SARMIZ-ONE Risk Management Platform in production mode..."
echo "Database: ${DATABASE_URL}"
echo "Port: ${PORT}"
echo "Host: ${HOST}"

# Start the application
node dist/production.cjs