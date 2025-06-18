# Risk Quantification Platform

## Overview

This is a sophisticated enterprise cybersecurity risk quantification platform built using the FAIR (Factor Analysis of Information Risk) methodology. The platform implements advanced risk calculation models including FAIR-CAM (Controls Assessment Model) with IRIS 2025 actuarial data integration for industry-backed risk assessments.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theming
- **Data Visualization**: D3.js for risk charts and dashboards
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Runtime**: Node.js 18+ with Express.js framework
- **Language**: TypeScript with ESM module support
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local and OIDC strategies (bypassed in production)
- **Session Management**: Express-session with PostgreSQL store

### Database Architecture
- **Primary Database**: PostgreSQL 15+ with 20+ tables
- **Schema Management**: Drizzle Kit for migrations
- **Key Tables**: risks, assets, controls, risk_library, control_library, cost_modules
- **Relationships**: Complex foreign key relationships with cascade deletion support

## Key Components

### 1. FAIR Risk Calculation Engine
- **Monte Carlo Simulation**: 10,000+ iteration risk modeling
- **IRIS 2025 Integration**: Empirically-derived actuarial parameters
- **Distribution Functions**: Log-normal and Beta-PERT distributions
- **Control Efficacy**: FAIR-CAM methodology with reliability adjustments

### 2. Asset Management System
- **Hierarchy Support**: 5-level enterprise architecture mapping
- **Value Tracking**: Multi-currency asset valuation
- **CIA Ratings**: Confidentiality, Integrity, Availability assessments
- **Dependency Mapping**: Asset relationship tracking

### 3. Control Framework
- **CIS Controls**: 56+ security controls from CIS framework
- **Implementation Tracking**: Status monitoring with agent deployment
- **Cost Analysis**: ROI calculations with per-agent pricing
- **Effectiveness Metrics**: FAIR-CAM efficacy parameters

### 4. Risk Library System
- **Template Management**: 27+ risk scenario templates
- **FAIR Parameters**: Pre-configured threat and vulnerability parameters
- **Instance Creation**: Risk instantiation from templates
- **Association Tracking**: Asset and control linkages

## Data Flow

### Risk Calculation Flow
1. **Input Collection**: FAIR parameters from risk forms
2. **IRIS Enhancement**: Automatic population of actuarial parameters
3. **Monte Carlo Execution**: Statistical simulation with control adjustments
4. **Result Aggregation**: Percentile calculations and exposure metrics
5. **Dashboard Updates**: Real-time risk summary updates

### Asset-Risk Relationship Flow
1. **Asset Registration**: Asset creation with valuation and classification
2. **Risk Association**: Linking risks to affected assets
3. **Impact Calculation**: Asset value integration into loss magnitude
4. **Control Assignment**: Protective control mapping to assets
5. **Exposure Tracking**: Aggregated risk exposure by asset portfolio

## External Dependencies

### Production Dependencies
- **Database**: PostgreSQL with connection pooling
- **Authentication**: Passport.js (optional OIDC integration)
- **Cryptography**: bcryptjs for password hashing
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **HTTP Client**: Axios for external API calls

### Development Dependencies
- **Build Tools**: esbuild, Vite, TypeScript compiler
- **Code Quality**: ESLint, Prettier (implicit)
- **Testing**: Built-in API testing utilities
- **Monitoring**: Custom logging and diagnostic scripts

## Deployment Strategy

### Docker Containerization
- **Multi-stage Build**: Separate builder and production stages
- **External Database**: Connects to existing PostgreSQL instance
- **Port Configuration**: 5000 (application) with proxy support
- **Environment Management**: Production-specific configuration files

### Production Configuration
- **Database URL**: postgresql://user:password@host:port/database
- **Session Security**: Secure cookies with HTTPS
- **Authentication Bypass**: Configurable for deployment flexibility
- **Logging**: Structured logging with request tracking

### Migration Strategy
- **Schema Rebuild**: Complete database recreation with production-migration.sql
- **Data Preservation**: Reference data import with data-dumps.sql
- **Rollback Support**: Automated backup generation before migration

## Changelog

- June 18, 2025. Initial setup
- June 18, 2025. Added inherent risk curve to Loss Exceedance Curve with smooth interpolation and proper scaling
- June 18, 2025. Merged "Risk Response Status" and "Top Risks" into single combined card for streamlined dashboard layout
- June 18, 2025. Implemented intelligent control recommendation system with threat-specific mapping and auto-association API
- June 18, 2025. Removed "Factors" tab from risk detail view, streamlined interface to focus on Control Suggestions as primary tab
- June 18, 2025. Created comprehensive asset-type and risk-based control mapping system with intelligent suggestion engine
- June 18, 2025. Added Control Mapping Manager UI for configuring control relevance based on asset types and risk characteristics
- June 18, 2025. Fixed all API parameter order issues and validated complete CRUD functionality across application
- June 18, 2025. Completed Control Mapping Manager with proper sidebar navigation integration and SelectItem validation fixes

## User Preferences

Preferred communication style: Simple, everyday language.