#!/bin/bash

# Docker-based deployment script for Risk Quantification Platform (External Database)
set -e

echo "=== Risk Quantification Platform - Docker Deployment ==="
echo "Database Host: 172.17.0.1"
echo "Database Port: 5432"
echo "Database Name: fair_risk_db"
echo "Database User: risk_app_user"

# Function to check Docker installation
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "ERROR: Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "ERROR: Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "✓ Docker and Docker Compose are available"
}

# Function to test external database connection
test_database_connection() {
    echo "Testing connection to external PostgreSQL database..."
    
    # Check if database is reachable
    if ! nc -z 172.17.0.1 5432 2>/dev/null; then
        echo "ERROR: Cannot reach database at 172.17.0.1:5432"
        echo "Please ensure your PostgreSQL database is running and accessible"
        exit 1
    fi
    
    echo "✓ External database is reachable"
}

# Function to create environment file for external database
create_docker_env() {
    echo "Creating Docker environment configuration for external database..."
    
    # Generate secure session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Docker Environment Configuration (External Database)
NODE_ENV=production
DATABASE_URL=postgresql://risk_app_user:KhViS-6cU9yufFkQZ9B3@172.17.0.1:5432/fair_risk_db
PGHOST=172.17.0.1
PGPORT=5432
PGUSER=risk_app_user
PGPASSWORD=KhViS-6cU9yufFkQZ9B3
PGDATABASE=fair_risk_db
HOST=0.0.0.0
PORT=5000
SESSION_SECRET=$SESSION_SECRET
EOF
    
    chmod 600 .env
    echo "✓ Environment configuration created for external database"
}

# Function to build and start application
deploy_services() {
    echo "Building and starting application container..."
    
    # Build the application image
    docker-compose build --no-cache
    
    # Start the application container
    docker-compose up -d
    
    echo "✓ Application container started successfully"
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
        echo "Check logs with: docker-compose logs risk-app"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo "Verifying deployment..."
    
    # Check if container is running
    if ! docker-compose ps | grep -q "Up"; then
        echo "ERROR: Application container is not running"
        docker-compose ps
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
    echo "✓ Connected to external PostgreSQL database at 172.17.0.1:5432"
    echo "✓ Risk Quantification Platform running"
    echo ""
    echo "Application URL: http://localhost:5000"
    echo ""
    echo "Useful commands:"
    echo "- View logs: docker-compose logs -f risk-app"
    echo "- Stop application: docker-compose down"
    echo "- Restart application: docker-compose restart"
    echo "- View container status: docker-compose ps"
    echo "- Test database: curl http://localhost:5000/api/assets"
}

# Function to show application logs
show_logs() {
    echo "Recent application logs:"
    docker-compose logs --tail=20 risk-app
}

# Main deployment process
main() {
    check_docker
    test_database_connection
    create_docker_env
    deploy_services
    wait_for_application
    verify_deployment
    show_logs
    
    echo "Application deployment completed successfully!"
}

# Handle cleanup on script exit
cleanup() {
    if [ $? -ne 0 ]; then
        echo "Deployment failed. Cleaning up..."
        docker-compose down
    fi
}

trap cleanup EXIT

# Run main function
main "$@"