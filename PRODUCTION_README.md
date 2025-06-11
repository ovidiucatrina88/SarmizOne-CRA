# SARMIZ-ONE Risk Management Platform - Production Deployment Guide

## Overview
SARMIZ-ONE is a comprehensive cybersecurity risk quantification platform using advanced FAIR methodology for enterprise risk management, now fully configured for production deployment.

## Production Features
- ✅ SARMIZ-ONE branded logo integration
- ✅ Complete PostgreSQL database with authentic production data
- ✅ FAIR methodology risk calculations
- ✅ User management with role-based access control
- ✅ Asset management and enterprise architecture mapping
- ✅ Vulnerability tracking and control management
- ✅ Loss Exceedance Curve calculations
- ✅ Data export capabilities (CSV, Excel, PDF)
- ✅ Activity logging and audit trails
- ✅ Production-optimized build configuration

## Deployment Instructions

### 1. Environment Setup
Copy the production environment file:
```bash
cp .env.production .env
```

Configure your database connection in `.env`:
```
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-session-secret
```

### 2. Database Setup
Ensure PostgreSQL database is running and accessible. The application will automatically connect using the DATABASE_URL.

### 3. Build for Production
Run the automated deployment script:
```bash
./production-deploy.sh
```

Or manually build:
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```

The application will be available at `http://localhost:5000`

## Production Configuration

### Authentication
- Default admin credentials: `admin` / `admin123`
- Role-based access control (admin, user)
- Session-based authentication with PostgreSQL session store

### Database
- Full PostgreSQL integration with authentic data
- Complete schema with all FAIR methodology fields
- Automated migrations and data integrity checks

### Security Features
- HTTPS-ready configuration
- Secure session management
- Input validation and sanitization
- SQL injection protection via Drizzle ORM

### Performance Optimizations
- Asset bundling with chunk splitting
- Static asset caching
- Database connection pooling
- Optimized queries with indexing

## Application Architecture

### Frontend
- React 18 with TypeScript
- Responsive design with Tailwind CSS
- Real-time data visualization with D3.js and Recharts
- Interactive dashboards and analytics

### Backend
- Express.js with TypeScript
- Drizzle ORM for database operations
- RESTful API design
- Comprehensive error handling

### Data Model
- Assets with CIA ratings and financial valuations
- Risks with FAIR quantification parameters
- Controls with effectiveness measurements
- Legal entities and cost modules
- Vulnerability tracking with CVE integration

## API Endpoints

### Core Endpoints
- `/api/dashboard/summary` - Risk analytics dashboard
- `/api/assets` - Asset management
- `/api/risks` - Risk register operations
- `/api/controls` - Control library management
- `/api/vulnerabilities` - Vulnerability tracking
- `/api/auth` - Authentication and user management

### Export Endpoints
- `/api/assets/export` - Asset data export
- `/api/risks/export` - Risk data export
- `/api/reports/risk-summary` - Comprehensive risk reports

## Monitoring and Maintenance

### Health Checks
The application includes built-in health monitoring:
- Database connectivity checks
- API endpoint validation
- System resource monitoring

### Logging
- Structured application logs
- Database query logging
- User activity tracking
- Error reporting and debugging

### Backup Strategy
Regular database backups are recommended:
- Daily automated backups
- Point-in-time recovery capability
- Schema version control

## Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Session store in PostgreSQL
- Load balancer ready

### Database Optimization
- Connection pooling configured
- Query optimization implemented
- Index strategies in place

## Support and Documentation

### User Guides
- Dashboard navigation and analytics
- Risk assessment workflows
- Control management procedures
- Vulnerability tracking processes

### Technical Documentation
- API reference documentation
- Database schema documentation
- Development setup guides
- Troubleshooting guides

## Production Checklist

- [ ] Database configured and accessible
- [ ] Environment variables set
- [ ] SSL certificates configured (if using HTTPS)
- [ ] Load balancer configured (if applicable)
- [ ] Monitoring systems configured
- [ ] Backup procedures established
- [ ] User accounts created
- [ ] Initial data imported
- [ ] Health checks verified

## Version Information
- Application Version: 1.0.0
- Node.js: 18+
- PostgreSQL: 14+
- Build System: Vite + esbuild

For technical support or deployment assistance, refer to the comprehensive documentation or contact the development team.