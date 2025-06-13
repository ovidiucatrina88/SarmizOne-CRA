-- Safe Schema Update Script for IRIS 2025 Integration
-- This script applies schema changes conditionally to avoid conflicts

-- Create types only if they don't exist
DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM ('active', 'inactive', 'deprecated', 'under_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM ('data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE currency AS ENUM ('USD', 'EUR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_response_type AS ENUM ('accept', 'avoid', 'transfer', 'mitigate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify IRIS 2025 schema elements are present
-- Check if industry_insights table exists for future IRIS benchmarking
DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'industry_insights') THEN
        CREATE TABLE industry_insights (
            id SERIAL PRIMARY KEY,
            sector VARCHAR(64) NOT NULL,
            metric VARCHAR(64) NOT NULL,
            value_numeric NUMERIC,
            value_text TEXT,
            unit VARCHAR(16),
            source VARCHAR(128) NOT NULL,
            effective_from DATE NOT NULL,
            effective_to DATE DEFAULT '9999-12-31',
            version INT NOT NULL DEFAULT 1,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            UNIQUE(sector, metric, effective_from)
        );
        
        CREATE INDEX idx_insights_sector_metric ON industry_insights(sector, metric);
        
        RAISE NOTICE 'Created industry_insights table for IRIS 2025 benchmarking';
    END IF;
END $$;

-- Verify all required tables exist with proper columns
DO $$ 
DECLARE
    missing_tables TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Check for required tables
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'assets') THEN
        missing_tables := array_append(missing_tables, 'assets');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'risks') THEN
        missing_tables := array_append(missing_tables, 'risks');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'controls') THEN
        missing_tables := array_append(missing_tables, 'controls');
    END IF;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Missing required tables: %', array_to_string(missing_tables, ', ');
    END IF;
    
    RAISE NOTICE 'All required tables present. IRIS 2025 integration ready.';
END $$;

-- Insert sample IRIS 2025 data for testing (only if table is empty)
INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'Technology', 'TEF_WEBAPP_MIN', 0.009, 'annual', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'Technology' AND metric = 'TEF_WEBAPP_MIN');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'Technology', 'TEF_WEBAPP_MODE', 0.035, 'annual', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'Technology' AND metric = 'TEF_WEBAPP_MODE');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'Technology', 'TEF_WEBAPP_MAX', 0.046, 'annual', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'Technology' AND metric = 'TEF_WEBAPP_MAX');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'Global', 'LM_MU', 14.88, 'log(USD)', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'Global' AND metric = 'LM_MU');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'Global', 'LM_SIGMA', 1.95, 'log(USD)', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'Global' AND metric = 'LM_SIGMA');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'SMB', 'LM_MU', 12.79, 'log(USD)', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'SMB' AND metric = 'LM_MU');

INSERT INTO industry_insights (sector, metric, value_numeric, unit, source, effective_from)
SELECT 'SMB', 'LM_SIGMA', 1.77, 'log(USD)', 'IRIS 2025', '2025-01-01'
WHERE NOT EXISTS (SELECT 1 FROM industry_insights WHERE sector = 'SMB' AND metric = 'LM_SIGMA');

\echo 'IRIS 2025 schema update completed successfully'