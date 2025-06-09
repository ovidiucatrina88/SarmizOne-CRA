#!/bin/bash

# Docker-based deployment script for Risk Quantification Platform (External Database)
set -e

echo "=== Risk Quantification Platform - Docker Build and Deploy ==="

# Function to check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "ERROR: Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    echo "✓ Docker is available"
}

# Function to check environment file
check_env_file() {
    if [ ! -f ".env.production" ]; then
        echo "ERROR: .env.production file not found"
        echo "Please create .env.production with your database credentials"
        echo "You can use .env.external-db as a template"
        exit 1
    fi
    
    echo "✓ Environment file .env.production found"
}

# Function to test external database connection
test_database_connection() {
    echo "Testing connection to external PostgreSQL database..."
    
    # Extract database host from .env.production
    DB_HOST=$(grep "^PGHOST=" .env.production | cut -d'=' -f2)
    DB_PORT=$(grep "^PGPORT=" .env.production | cut -d'=' -f2)
    
    if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
        echo "WARNING: Could not extract database host/port from .env.production"
        echo "Assuming default 172.17.0.1:5432"
        DB_HOST="172.17.0.1"
        DB_PORT="5432"
    fi
    
    # Check if database is reachable
    if ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        echo "ERROR: Cannot reach database at $DB_HOST:$DB_PORT"
        echo "Please ensure your PostgreSQL database is running and accessible"
        exit 1
    fi
    
    echo "✓ External database at $DB_HOST:$DB_PORT is reachable"
}

# Function to build application image
build_application() {
    echo "Building application Docker image..."
    
    # Build the application image with your exact command
    docker build -t risk-app:latest .
    
    if [ $? -eq 0 ]; then
        echo "✓ Application image built successfully"
    else
        echo "ERROR: Failed to build application image"
        exit 1
    fi
}

# Function to stop existing container if running
stop_existing_container() {
    echo "Checking for existing container..."
    
    if docker ps -q -f name=risk-quantification-app | grep -q .; then
        echo "Stopping existing container..."
        docker stop risk-quantification-app
        docker rm risk-quantification-app
        echo "✓ Existing container stopped and removed"
    else
        echo "✓ No existing container found"
    fi
}

# Function to start application container
start_application() {
    echo "Starting application container..."
    
    # Start the application container with your exact command
    docker run -d \
        --name risk-quantification-app \
        --restart unless-stopped \
        -p 5000:5000 \
        --add-host=host.docker.internal:host-gateway \
        --env-file .env.production \
        risk-app:latest
    
    if [ $? -eq 0 ]; then
        echo "✓ Application container started successfully"
    else
        echo "ERROR: Failed to start application container"
        exit 1
    fi
}

# Function to wait for application to be ready
wait_for_application() {
    echo "Waiting for application to be ready..."
    
    local max_attempts=60
    local attempt=0
    
    # Wait for application to be ready
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            echo "✓ Application is ready and responding"
            break
        fi
        echo "Waiting for application... (attempt $((attempt + 1))/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "ERROR: Application failed to start within expected time"
        echo "Check logs with: docker logs risk-quantification-app"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo "Verifying deployment..."
    
    # Check if container is running
    if ! docker ps | grep -q "risk-quantification-app"; then
        echo "ERROR: Application container is not running"
        docker ps
        exit 1
    fi
    
    echo "✓ Application container is running"
    
    # Test external database connection through application
    if curl -f http://localhost:5000/api/assets > /dev/null 2>&1; then
        echo "✓ Application can connect to external database"
    else
        echo "⚠ Application database connection test failed"
        echo "Check database connectivity and credentials"
    fi
    
    echo ""
    echo "=== Deployment Summary ==="
    echo "✓ Application container built and deployed"
    echo "✓ Connected to external PostgreSQL database"
    echo "✓ Risk Quantification Platform running"
    echo ""
    echo "Application URL: http://localhost:5000"
    echo ""
    echo "Management commands:"
    echo "- View logs: docker logs -f risk-quantification-app"
    echo "- Stop application: docker stop risk-quantification-app"
    echo "- Restart application: docker restart risk-quantification-app"
    echo "- Remove container: docker rm -f risk-quantification-app"
    echo "- Test database: curl http://localhost:5000/api/assets"
}

# Function to show application logs
show_logs() {
    echo "Recent application logs:"
    docker logs --tail=20 risk-quantification-app
}

# Main deployment process
main() {
    check_docker
    check_env_file
    test_database_connection
    stop_existing_container
    build_application
    start_application
    wait_for_application
    verify_deployment
    show_logs
    
    echo "Application deployment completed successfully!"
}

# Handle cleanup on script exit
cleanup() {
    if [ $? -ne 0 ]; then
        echo "Deployment failed. Container may need manual cleanup."
        echo "Run: docker rm -f risk-quantification-app"
    fi
}

trap cleanup EXIT

# Run main function
main "$@"