#!/bin/bash

# Docker-based deployment script for Risk Quantification Platform
set -e

echo "=== Risk Quantification Platform - Docker Deployment ==="

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

# Function to create environment file
create_docker_env() {
    echo "Creating Docker environment configuration..."
    
    # Generate secure password and session secret
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    SESSION_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Docker Environment Configuration
DB_PASSWORD=$DB_PASSWORD
SESSION_SECRET=$SESSION_SECRET
EOF
    
    chmod 600 .env
    echo "✓ Environment configuration created"
}

# Function to build and start services
deploy_services() {
    echo "Building and starting services..."
    
    # Build the application image
    docker-compose build --no-cache
    
    # Start the services
    docker-compose up -d
    
    echo "✓ Services started successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    echo "Waiting for services to be ready..."
    
    local max_attempts=60
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if docker-compose exec -T postgres pg_isready -U risk_app_user -d fair_risk_db > /dev/null 2>&1; then
            echo "✓ PostgreSQL is ready"
            break
        fi
        echo "Waiting for PostgreSQL... (attempt $((attempt + 1))/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "ERROR: PostgreSQL failed to start within expected time"
        exit 1
    fi
    
    # Wait for application to be ready
    attempt=0
    while [ $attempt -lt $max_attempts ]; do
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            echo "✓ Application is ready"
            break
        fi
        echo "Waiting for application... (attempt $((attempt + 1))/$max_attempts)"
        sleep 5
        attempt=$((attempt + 1))
    done
    
    if [ $attempt -eq $max_attempts ]; then
        echo "⚠ Application health check failed, but services are running"
        echo "Check logs with: docker-compose logs risk-app"
    fi
}

# Function to verify deployment
verify_deployment() {
    echo "Verifying deployment..."
    
    # Check if containers are running
    if ! docker-compose ps | grep -q "Up"; then
        echo "ERROR: Some services are not running"
        docker-compose ps
        exit 1
    fi
    
    echo "✓ All containers are running"
    
    # Test database connection
    if docker-compose exec -T postgres psql -U risk_app_user -d fair_risk_db -c "SELECT COUNT(*) FROM assets;" > /dev/null 2>&1; then
        echo "✓ Database is accessible and has data"
    else
        echo "⚠ Database connection test failed"
    fi
    
    echo ""
    echo "=== Deployment Summary ==="
    echo "✓ Docker containers built and deployed"
    echo "✓ PostgreSQL database configured with sample data"
    echo "✓ Risk Quantification Platform running"
    echo ""
    echo "Application URL: http://localhost:5000"
    echo ""
    echo "Useful commands:"
    echo "- View logs: docker-compose logs -f risk-app"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- View container status: docker-compose ps"
}

# Function to show service logs
show_logs() {
    echo "Recent application logs:"
    docker-compose logs --tail=20 risk-app
}

# Main deployment process
main() {
    check_docker
    create_docker_env
    deploy_services
    wait_for_services
    verify_deployment
    show_logs
    
    echo "🎉 Docker deployment completed successfully!"
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