# Database Dumps - Cybersecurity Risk Quantification Platform

## Overview
This directory contains comprehensive database dumps for the FAIR-based risk management platform, including schema definitions and sample data for development and deployment purposes.

## Files Description

### 1. `schema_dump.sql`
**Purpose**: Complete database schema with conditional table creation
- Contains all table definitions with `CREATE TABLE IF NOT EXISTS` statements
- Includes all custom PostgreSQL enums and data types
- Handles existing tables gracefully without data loss
- Creates proper indexes and constraints
- Safe for production deployment over existing databases

**Usage:**
```bash
psql -h localhost -U your_user -d your_database -f schema_dump.sql
```

### 2. `data_dump_clean_insert.sql`
**Purpose**: Core dataset with table clearing to prevent duplicates
- Truncates all tables before inserting fresh data
- Resets all sequence counters to start from 1
- Contains essential business data (4 entities, 4 assets, 4 risks, etc.)
- Ideal for clean development environment setup
- **Warning**: This will delete all existing data

**Usage:**
```bash
psql -h localhost -U your_user -d your_database -f data_dump_clean_insert.sql
```

### 3. `complete_data_dump.sql`
**Purpose**: Comprehensive dataset for full application functionality
- Includes all core entities and relationships
- Contains production-ready sample data
- Preserves data integrity with proper foreign key relationships
- Suitable for demonstration and testing environments

**Usage:**
```bash
psql -h localhost -U your_user -d your_database -f complete_data_dump.sql
```

## Database Schema Overview

### Core Tables
- **legal_entities**: Corporate hierarchy (4 entities)
- **assets**: Business assets ($1.45M total value)
- **risks**: Quantified risks with FAIR methodology
- **controls**: Security controls and effectiveness measures
- **vulnerabilities**: CVE tracking with severity scoring
- **users**: Authentication and authorization
- **cost_modules**: FAIR cost calculation modules

### Large Datasets (Not included in basic dumps)
- **risk_summaries**: 838+ time-series risk calculations
- **control_library**: 133+ security control templates
- **risk_library**: 25+ risk scenario templates
- **activity_logs**: 289+ audit trail records

## Deployment Instructions

### Fresh Installation
1. Apply schema: `psql -f schema_dump.sql`
2. Load data: `psql -f complete_data_dump.sql`

### Existing Database Update
1. Backup existing data: `pg_dump your_db > backup.sql`
2. Apply schema updates: `psql -f schema_dump.sql`
3. Verify data integrity

### Development Environment
1. Reset database: `psql -f data_dump_clean_insert.sql`
2. Restart application to verify functionality

## Data Integrity Notes

- All dumps maintain referential integrity
- Sequence values are properly reset after data insertion
- Foreign key constraints are temporarily disabled during bulk operations
- Custom enums and types are recreated to prevent conflicts

## Authentication Data

Default user accounts (password: `admin123`):
- **admin**: Full system access
- **analyst**: Risk analysis capabilities  
- **viewer**: Read-only dashboard access

## Column Name Updates

The following reserved keyword conflicts have been resolved:
- `references` columns renamed to `control_references` and `risk_references`
- All PostgreSQL reserved words avoided in table definitions

## Production Notes

- Schema supports PostgreSQL 12+ with JSON columns
- Optimized indexes for dashboard performance
- FAIR methodology compliance with proper cost calculations
- Full audit trail support with activity logging

---
Generated: 2025-06-11
Platform: Cybersecurity Risk Quantification Dashboard
Database: PostgreSQL with Drizzle ORM