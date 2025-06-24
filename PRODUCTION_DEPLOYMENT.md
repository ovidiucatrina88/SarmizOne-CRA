# Production Deployment Guide

## Quick Setup

### 1. Set Environment Variables

Create a `.env` file in your production directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Session Security
SESSION_SECRET=your-secure-random-session-secret-here

# Application Settings
NODE_ENV=production
PORT=5000
HTTPS_ENABLED=true

# Optional: Authentication (if using OIDC)
# OIDC_ISSUER=https://your-oidc-provider.com
# OIDC_CLIENT_ID=your-client-id
# OIDC_CLIENT_SECRET=your-client-secret
```

### 2. Start the Application

```bash
# Set environment and start
NODE_ENV=production node dist/production.cjs
```

## Database Setup

### Option 1: Use Existing PostgreSQL
Set `DATABASE_URL` to your existing PostgreSQL instance:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/riskapp
```

### Option 2: Use Neon Database (Recommended)
1. Create account at https://neon.tech
2. Create new database
3. Copy connection string to `DATABASE_URL`

### Option 3: Local PostgreSQL
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createuser --interactive
sudo -u postgres createdb riskapp

# Set connection string
DATABASE_URL=postgresql://username:password@localhost:5432/riskapp
```

## Initial Database Setup

The application will automatically create tables on first run. To populate with sample data:

```bash
# Import the database schema and data
psql $DATABASE_URL < database_schema_dump.sql
psql $DATABASE_URL < database_data_dump.sql
```

## Security Checklist

- [ ] `SESSION_SECRET` is set to a secure random string
- [ ] `DATABASE_URL` uses strong password
- [ ] `HTTPS_ENABLED=true` for production domains
- [ ] Database firewall configured (if applicable)
- [ ] Application runs on non-root user

## Default Login

After setup, login with:
- Username: `admin`
- Password: `admin123`

**Important:** Change the admin password immediately after first login.

## Troubleshooting

### Database Connection Error
```
Error: DATABASE_URL must be set
```
**Solution:** Set the `DATABASE_URL` environment variable.

### Session Issues
If authentication doesn't persist, ensure:
- `SESSION_SECRET` is set
- `HTTPS_ENABLED=true` for HTTPS domains
- Cookies are enabled in browser

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the `PORT` environment variable or stop conflicting processes.

## Performance Optimization

For production deployments:

1. **Use a process manager:**
```bash
npm install -g pm2
pm2 start dist/production.cjs --name risk-app
pm2 startup
pm2 save
```

2. **Configure reverse proxy (nginx):**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **SSL Certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Support

For issues or questions, check the application logs:
```bash
# If using pm2
pm2 logs risk-app

# If running directly
NODE_ENV=production node dist/production.cjs 2>&1 | tee app.log
```