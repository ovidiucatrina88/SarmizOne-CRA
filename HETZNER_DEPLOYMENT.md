# Hetzner Server Deployment Instructions

## Missing Files on Your Server

Your Hetzner server has outdated files. You need to replace them with the correct production build.

## Current Files on Replit (Ready for Transfer)

1. **production-server.cjs** (269KB) - Main server application
2. **client-index.html** (2KB) - Client interface

## Transfer Steps

### Step 1: Remove Old Files
On your Hetzner server:
```bash
cd /root/risk-hetzner/dist
rm -f index.js production.js
rm -rf public
```

### Step 2: Create Directory Structure
```bash
mkdir -p /root/risk-hetzner/dist/client
```

### Step 3: Copy Files from Replit

Download these files from this Replit workspace:
- `production-server.cjs` → Copy to `/root/risk-hetzner/dist/production.cjs`  
- `client-index.html` → Copy to `/root/risk-hetzner/dist/client/index.html`

### Step 4: Set Environment Variables
On your Hetzner server:
```bash
export NODE_ENV=production
export DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
export PORT=3000
```

### Step 5: Start Production Server
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
New database client connected
Database initialization successful
```

## Access Your Application
http://your-server-ip:3000

## File Sizes to Verify
- production.cjs: 269,144 bytes
- client/index.html: ~2,000 bytes

The production build uses CommonJS format to resolve all ESM compatibility issues that were preventing deployment.