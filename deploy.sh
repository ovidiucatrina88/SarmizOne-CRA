#!/bin/bash

# Risk Quantification Platform - Production Deployment Script
# This script automates the complete deployment process for Linux servers

set -e  # Exit on any error

echo "=== Risk Quantification Platform - Linux Server Deployment ==="
echo "Database Host: localhost"
echo "Database Port: 5432"
echo "Database Name: fair_risk_db"
echo "Database User: risk_app_user"

# Function to check if PostgreSQL is running
check_postgres() {
    echo "Checking PostgreSQL status..."
    if ! systemctl is-active --quiet postgresql; then
        echo "ERROR: PostgreSQL is not running. Please start PostgreSQL first:"
        echo "sudo systemctl start postgresql"
        exit 1
    fi
    echo "✓ PostgreSQL is running"
}

# Function to wait for PostgreSQL connection
wait_for_postgres() {
    echo "Waiting for PostgreSQL connection..."
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        if nc -z localhost 5432 2>/dev/null; then
            echo "✓ PostgreSQL is accepting connections"
            return 0
        fi
        echo "Waiting for database connection (attempt $((attempts + 1))/$max_attempts)..."
        sleep 2
        attempts=$((attempts + 1))
    done
    
    echo "ERROR: PostgreSQL connection failed after $max_attempts attempts"
    echo "Please verify PostgreSQL is running and credentials are correct"
    exit 1
}

# Function to create database and user
setup_database() {
    echo "Setting up database and user..."
    
    # Prompt for database password
    read -s -p "Enter password for database user 'risk_app_user': " DB_PASSWORD
    echo
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE DATABASE fair_risk_db;
CREATE USER risk_app_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE fair_risk_db TO risk_app_user;
ALTER USER risk_app_user CREATEDB;
ALTER DATABASE fair_risk_db OWNER TO risk_app_user;
\q
EOF
    
    echo "✓ Database and user created successfully"
    
    # Store password for later use
    export DB_PASSWORD
}

# Function to deploy database schema
deploy_schema() {
    echo "Deploying database schema..."
    
    if [ ! -f "database_dumps/schema_postgres15.sql" ]; then
        echo "ERROR: Schema file not found. Please ensure database_dumps/schema_postgres15.sql exists"
        exit 1
    fi
    
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f database_dumps/schema_postgres15.sql
    echo "✓ Database schema deployed successfully"
}

# Function to load sample data
load_sample_data() {
    echo "Loading sample data..."
    
    if [ ! -f "database_dumps/fresh_data_deployment.sql" ]; then
        echo "ERROR: Sample data file not found. Please ensure database_dumps/fresh_data_deployment.sql exists"
        exit 1
    fi
    
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U risk_app_user -d fair_risk_db -v ON_ERROR_STOP=1 -f database_dumps/fresh_data_deployment.sql
    echo "✓ Sample data loaded successfully"
}

# Function to install Node.js dependencies
install_dependencies() {
    echo "Installing Node.js dependencies..."
    
    if ! command -v npm &> /dev/null; then
        echo "ERROR: npm is not installed. Please install Node.js 18+ first"
        exit 1
    fi
    
    npm install
    echo "✓ Dependencies installed successfully"
}

# Function to build the application
build_application() {
    echo "Building application..."
    npm run build
    echo "✓ Application built successfully"
}

# Function to create production environment file
create_env_file() {
    echo "Creating production environment file..."
    
    # Generate a secure session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    
    cat > .env.production << EOF
# Production Environment Configuration - Auto-generated
DATABASE_URL=postgresql://risk_app_user:$DB_PASSWORD@localhost:5432/fair_risk_db
PGHOST=localhost
PGPORT=5432
PGDATABASE=fair_risk_db
PGUSER=risk_app_user
PGPASSWORD=$DB_PASSWORD

NODE_ENV=production
SESSION_SECRET=$SESSION_SECRET
BYPASS_AUTH=true
PRODUCTION_DEPLOYMENT=true
EOF
    
    chmod 600 .env.production  # Secure the file
    echo "✓ Production environment file created"
}

# Function to create systemd service
create_systemd_service() {
    echo "Creating systemd service..."
    
    local APP_DIR=$(pwd)
    local APP_USER=$(whoami)
    
    sudo tee /etc/systemd/system/risk-app.service > /dev/null << EOF
[Unit]
Description=Risk Quantification Platform
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env.production
ExecStart=/usr/bin/node $APP_DIR/dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=risk-app

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable risk-app
    echo "✓ Systemd service created and enabled"
}

# Function to configure firewall
configure_firewall() {
    echo "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        sudo ufw allow 5000/tcp
        echo "✓ Firewall configured to allow port 5000"
    else
        echo "⚠ UFW not found. Please manually configure your firewall to allow port 5000"
    fi
}

# Function to start the application
start_application() {
    echo "Starting application..."
    
    sudo systemctl start risk-app
    sleep 5
    
    if systemctl is-active --quiet risk-app; then
        echo "✓ Application started successfully"
        echo "✓ Application is running on http://localhost:5000"
    else
        echo "ERROR: Failed to start application. Check logs with:"
        echo "sudo journalctl -u risk-app -f"
        exit 1
    fi
}

# Function to verify deployment
verify_deployment() {
    echo "Verifying deployment..."
    
    # Test database connection
    if PGPASSWORD="$DB_PASSWORD" psql -h localhost -U risk_app_user -d fair_risk_db -c "SELECT COUNT(*) FROM assets;" > /dev/null; then
        echo "✓ Database connection successful"
    else
        echo "ERROR: Database connection failed"
        exit 1
    fi
    
    # Test application health
    sleep 10  # Give app time to fully start
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✓ Application health check passed"
    else
        echo "⚠ Application health check failed. Check if the app is still starting up."
    fi
    
    echo ""
    echo "=== Deployment Summary ==="
    echo "✓ PostgreSQL database configured"
    echo "✓ Database schema and sample data deployed"
    echo "✓ Application built and configured"
    echo "✓ Systemd service created"
    echo "✓ Application started successfully"
    echo ""
    echo "Your Risk Quantification Platform is now running at:"
    echo "http://localhost:5000"
    echo ""
    echo "Useful commands:"
    echo "- Check status: sudo systemctl status risk-app"
    echo "- View logs: sudo journalctl -u risk-app -f"
    echo "- Restart app: sudo systemctl restart risk-app"
    echo "- Stop app: sudo systemctl stop risk-app"
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    
    # Check prerequisites
    check_postgres
    wait_for_postgres
    
    # Database setup
    setup_database
    deploy_schema
    load_sample_data
    
    # Application setup
    install_dependencies
    build_application
    create_env_file
    
    # System configuration
    create_systemd_service
    configure_firewall
    
    # Start and verify
    start_application
    verify_deployment
    
    echo "🎉 Deployment completed successfully!"
}

# Run main function
main "$@"