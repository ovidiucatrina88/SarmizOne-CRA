# Risk Quantification Platform

## Overview
This project is an enterprise cybersecurity risk quantification platform utilizing the FAIR (Factor Analysis of Information Risk) methodology. It incorporates advanced risk calculation models, including FAIR-CAM (Controls Assessment Model), and integrates with IRIS 2025 actuarial data for industry-backed risk assessments. The platform provides comprehensive capabilities for managing assets, risks, controls, and generating reports, with all core functionalities operational and over 18 API endpoints supporting full CRUD operations. The business vision is to provide a sophisticated tool for organizations to understand, measure, and manage their cybersecurity risks effectively, offering significant market potential in the enterprise risk management sector.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI/UX**: Radix UI with shadcn/ui design system, Tailwind CSS for styling, D3.js for data visualization.
- **State Management**: TanStack Query.
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js 18+ with Express.js.
- **Language**: TypeScript (ESM modules).
- **ORM**: Drizzle ORM.
- **Authentication**: Passport.js (local and OIDC strategies, bypassable in production).
- **Session Management**: Express-session with PostgreSQL store.

### Database
- **Type**: PostgreSQL 15+ (20+ tables).
- **Schema Management**: Drizzle Kit for migrations.
- **Key Features**: Complex foreign key relationships, cascade deletion.

### Key Components
- **FAIR Risk Calculation Engine**: Monte Carlo Simulation (10,000+ iterations), IRIS 2025 integration, Log-normal and Beta-PERT distributions, FAIR-CAM for control efficacy.
- **Asset Management System**: 5-level hierarchy, multi-currency valuation, CIA ratings, dependency mapping.
- **Control Framework**: CIS Controls (56+), implementation tracking, ROI analysis, FAIR-CAM effectiveness metrics.
- **Risk Library System**: 27+ risk scenario templates, pre-configured FAIR parameters, instance creation, asset/control linkages.

### Data Flow
- **Risk Calculation**: Collects FAIR parameters, enhances with IRIS data, executes Monte Carlo, aggregates results, updates dashboards.
- **Asset-Risk Relationship**: Asset registration, risk association, impact calculation, control assignment, aggregated risk exposure tracking.

### Deployment Strategy
- **Containerization**: Docker (multi-stage build).
- **Database**: Connects to external PostgreSQL.
- **Configuration**: Environment management, secure session cookies (SameSite=lax).
- **Migration**: Database recreation (`production-migration.sql`), data import (`data-dumps.sql`), automated backup for rollback.

## External Dependencies

### Production
- **Database**: PostgreSQL
- **Authentication**: Passport.js
- **Cryptography**: bcryptjs
- **Session Store**: connect-pg-simple
- **HTTP Client**: Axios

### Development
- **Build Tools**: esbuild, Vite, TypeScript compiler
- **Code Quality**: ESLint, Prettier (implicit)
- **Testing**: Built-in API testing utilities