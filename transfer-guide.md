# Transfer Guide for Hetzner Server

## Current Status
Your Hetzner server has outdated build files. You need the new production.cjs file.

## Quick Transfer Solution

### Option 1: Direct File Transfer
Copy these files from this Replit to your server:

```bash
# On your Hetzner server, create the directory structure:
mkdir -p /root/risk-hetzner/dist/client

# Transfer the production server file:
# Copy dist/production.cjs to /root/risk-hetzner/dist/production.cjs

# Transfer the client file:
# Copy dist/client/index.html to /root/risk-hetzner/dist/client/index.html
```

### Option 2: Download the Archive
Download `production-deployment.tar.gz` from this Replit and extract on your server:

```bash
# On your server:
cd /root/risk-hetzner
tar -xzf production-deployment.tar.gz
```

## Required Files on Your Server

After transfer, your server should have:
- `/root/risk-hetzner/dist/production.cjs` (269KB)
- `/root/risk-hetzner/dist/client/index.html`

## Environment Setup on Server

```bash
export NODE_ENV=production
export DATABASE_URL="your_postgres_connection_string"
export PORT=3000
```

## Start the Server

```bash
cd /root/risk-hetzner
node dist/production.cjs
```

## Expected Output
```
Initializing database connection...
Production mode: Passport-free authentication configured
Starting production server
Found client build files at: /root/risk-hetzner/dist/client
[timestamp] [express] serving on port 3000
```

The server will be available at http://your-server-ip:3000