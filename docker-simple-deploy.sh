#!/bin/bash

# Simple Docker deployment script matching your build process
set -e

echo "=== Risk Quantification Platform - Simple Docker Deployment ==="

# Function to check if .env.production exists
check_env_file() {
    if [ ! -f ".env.production" ]; then
        echo "ERROR: .env.production file not found"
        echo "Create .env.production with your database credentials:"
        echo ""
        echo "NODE_ENV=production"
        echo "DATABASE_URL=postgresql://user:password@172.17.0.1:5432/dbname"
        echo "PGHOST=172.17.0.1"
        echo "PGPORT=5432"
        echo "PGUSER=your_user"
        echo "PGPASSWORD=your_password" 
        echo "PGDATABASE=your_database"
        echo "HOST=0.0.0.0"
        echo "PORT=5000"
        echo "SESSION_SECRET=your_secure_session_secret"
        echo "BYPASS_AUTH=true"
        echo "PRODUCTION_DEPLOYMENT=true"
        exit 1
    fi
    echo "✓ Environment file found"
}

# Function to stop existing container
stop_existing() {
    if docker ps -q -f name=risk-quantification-app | grep -q .; then
        echo "Stopping existing container..."
        docker stop risk-quantification-app
        docker rm risk-quantification-app
        echo "✓ Existing container removed"
    else
        echo "✓ No existing container found"
    fi
}

# Function to build image
build_image() {
    echo "Building Docker image..."
    docker build -t risk-app:latest .
    
    if [ $? -eq 0 ]; then
        echo "✓ Image built successfully"
    else
        echo "ERROR: Failed to build image"
        exit 1
    fi
}

# Function to start container
start_container() {
    echo "Starting container..."
    docker run -d \
        --name risk-quantification-app \
        --restart unless-stopped \
        -p 5000:5000 \
        --add-host=host.docker.internal:host-gateway \
        --env-file .env.production \
        risk-app:latest
    
    if [ $? -eq 0 ]; then
        echo "✓ Container started successfully"
    else
        echo "ERROR: Failed to start container"
        exit 1
    fi
}

# Function to wait for application
wait_for_app() {
    echo "Waiting for application to start..."
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            echo "✓ Application is responding"
            return 0
        fi
        echo "Waiting... (attempt $((attempt + 1))/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "⚠ Application may not be ready. Check logs: docker logs risk-quantification-app"
    return 1
}

# Function to show status
show_status() {
    echo ""
    echo "=== Deployment Status ==="
    docker ps --filter name=risk-quantification-app --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Application URL: http://localhost:5000"
    echo ""
    echo "Management commands:"
    echo "  docker logs -f risk-quantification-app    # View logs"
    echo "  docker stop risk-quantification-app       # Stop app"
    echo "  docker restart risk-quantification-app    # Restart app"
    echo ""
    echo "Recent logs:"
    docker logs --tail=10 risk-quantification-app
}

# Main execution
main() {
    check_env_file
    stop_existing
    build_image
    start_container
    wait_for_app
    show_status
    
    echo "Deployment completed!"
}

# Run main function
main "$@"