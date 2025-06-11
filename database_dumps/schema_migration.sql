-- Schema Migration Script for Cybersecurity Risk Quantification Platform
-- This script adds missing columns to existing tables
-- Generated on 2025-06-11

-- Create missing enum types if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cost_module_type') THEN
        CREATE TYPE cost_module_type AS ENUM ('fixed', 'per_event', 'per_hour', 'percentage');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_type') THEN
        CREATE TYPE asset_type AS ENUM ('data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_status') THEN
        CREATE TYPE asset_status AS ENUM ('Active', 'Decommissioned', 'To Adopt');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cia_rating') THEN
        CREATE TYPE cia_rating AS ENUM ('low', 'medium', 'high');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vulnerability_status') THEN
        CREATE TYPE vulnerability_status AS ENUM ('open', 'in_progress', 'mitigated', 'resolved', 'false_positive');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vulnerability_severity') THEN
        CREATE TYPE vulnerability_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
    END IF;
END $$;

-- Add missing columns to assets table
DO $$
BEGIN
    -- Add replacement_cost if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'replacement_cost') THEN
        ALTER TABLE assets ADD COLUMN replacement_cost NUMERIC(15,2) DEFAULT 0;
    END IF;
    
    -- Add operating_cost if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'operating_cost') THEN
        ALTER TABLE assets ADD COLUMN operating_cost NUMERIC(15,2) DEFAULT 0;
    END IF;
    
    -- Add location if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'location') THEN
        ALTER TABLE assets ADD COLUMN location TEXT;
    END IF;
    
    -- Add criticality_level if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'criticality_level') THEN
        ALTER TABLE assets ADD COLUMN criticality_level INTEGER DEFAULT 3;
    END IF;
    
    -- Add data_classification if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'data_classification') THEN
        ALTER TABLE assets ADD COLUMN data_classification TEXT;
    END IF;
    
    -- Add compliance_requirements if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'compliance_requirements') THEN
        ALTER TABLE assets ADD COLUMN compliance_requirements TEXT[];
    END IF;
    
    -- Add vendor if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'vendor') THEN
        ALTER TABLE assets ADD COLUMN vendor TEXT;
    END IF;
    
    -- Add version if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'version') THEN
        ALTER TABLE assets ADD COLUMN version TEXT;
    END IF;
    
    -- Add support_contact if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'support_contact') THEN
        ALTER TABLE assets ADD COLUMN support_contact TEXT;
    END IF;
END $$;

-- Add missing columns to risks table
DO $$
BEGIN
    -- Add associated_assets if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'associated_assets') THEN
        ALTER TABLE risks ADD COLUMN associated_assets TEXT[];
    END IF;
    
    -- Add threat_community if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'threat_community') THEN
        ALTER TABLE risks ADD COLUMN threat_community TEXT;
    END IF;
    
    -- Add vulnerability if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'vulnerability') THEN
        ALTER TABLE risks ADD COLUMN vulnerability TEXT;
    END IF;
    
    -- Add FAIR methodology columns if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'threat_event_frequency_min') THEN
        ALTER TABLE risks ADD COLUMN threat_event_frequency_min TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'threat_event_frequency_ml') THEN
        ALTER TABLE risks ADD COLUMN threat_event_frequency_ml TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'threat_event_frequency_max') THEN
        ALTER TABLE risks ADD COLUMN threat_event_frequency_max TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'threat_event_frequency_avg') THEN
        ALTER TABLE risks ADD COLUMN threat_event_frequency_avg NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'susceptibility_min') THEN
        ALTER TABLE risks ADD COLUMN susceptibility_min TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'susceptibility_ml') THEN
        ALTER TABLE risks ADD COLUMN susceptibility_ml TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'susceptibility_max') THEN
        ALTER TABLE risks ADD COLUMN susceptibility_max TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'susceptibility_avg') THEN
        ALTER TABLE risks ADD COLUMN susceptibility_avg NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'primary_loss_magnitude_min') THEN
        ALTER TABLE risks ADD COLUMN primary_loss_magnitude_min TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'primary_loss_magnitude_ml') THEN
        ALTER TABLE risks ADD COLUMN primary_loss_magnitude_ml TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'primary_loss_magnitude_max') THEN
        ALTER TABLE risks ADD COLUMN primary_loss_magnitude_max TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'primary_loss_magnitude_avg') THEN
        ALTER TABLE risks ADD COLUMN primary_loss_magnitude_avg NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'secondary_loss_magnitude_min') THEN
        ALTER TABLE risks ADD COLUMN secondary_loss_magnitude_min TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'secondary_loss_magnitude_ml') THEN
        ALTER TABLE risks ADD COLUMN secondary_loss_magnitude_ml TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'secondary_loss_magnitude_max') THEN
        ALTER TABLE risks ADD COLUMN secondary_loss_magnitude_max TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'secondary_loss_magnitude_avg') THEN
        ALTER TABLE risks ADD COLUMN secondary_loss_magnitude_avg NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'risk_reduction_percentage') THEN
        ALTER TABLE risks ADD COLUMN risk_reduction_percentage NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'monte_carlo_mean') THEN
        ALTER TABLE risks ADD COLUMN monte_carlo_mean NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'monte_carlo_p10') THEN
        ALTER TABLE risks ADD COLUMN monte_carlo_p10 NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'monte_carlo_p50') THEN
        ALTER TABLE risks ADD COLUMN monte_carlo_p50 NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'monte_carlo_p90') THEN
        ALTER TABLE risks ADD COLUMN monte_carlo_p90 NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'monte_carlo_max') THEN
        ALTER TABLE risks ADD COLUMN monte_carlo_max NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'rank_score') THEN
        ALTER TABLE risks ADD COLUMN rank_score NUMERIC DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'rank_percentile') THEN
        ALTER TABLE risks ADD COLUMN rank_percentile NUMERIC DEFAULT 0;
    END IF;
END $$;

-- Add missing columns to controls table
DO $$
BEGIN
    -- Add cost if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'cost') THEN
        ALTER TABLE controls ADD COLUMN cost NUMERIC(12,2) DEFAULT 0;
    END IF;
    
    -- Add currency if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'currency') THEN
        ALTER TABLE controls ADD COLUMN currency TEXT DEFAULT 'USD';
    END IF;
    
    -- Add implementation_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'implementation_date') THEN
        ALTER TABLE controls ADD COLUMN implementation_date DATE;
    END IF;
    
    -- Add review_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'review_date') THEN
        ALTER TABLE controls ADD COLUMN review_date DATE;
    END IF;
    
    -- Add responsible_party if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'responsible_party') THEN
        ALTER TABLE controls ADD COLUMN responsible_party TEXT;
    END IF;
    
    -- Add testing_frequency if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'testing_frequency') THEN
        ALTER TABLE controls ADD COLUMN testing_frequency TEXT;
    END IF;
    
    -- Add last_test_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'last_test_date') THEN
        ALTER TABLE controls ADD COLUMN last_test_date DATE;
    END IF;
    
    -- Add test_results if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'test_results') THEN
        ALTER TABLE controls ADD COLUMN test_results TEXT;
    END IF;
END $$;

-- Add missing columns to vulnerabilities table
DO $$
BEGIN
    -- Add cvss_score if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'cvss_score') THEN
        ALTER TABLE vulnerabilities ADD COLUMN cvss_score REAL;
    END IF;
    
    -- Add cvss_vector if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'cvss_vector') THEN
        ALTER TABLE vulnerabilities ADD COLUMN cvss_vector TEXT;
    END IF;
    
    -- Add discovered_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'discovered_date') THEN
        ALTER TABLE vulnerabilities ADD COLUMN discovered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add remediated_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'remediated_date') THEN
        ALTER TABLE vulnerabilities ADD COLUMN remediated_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add published_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'published_date') THEN
        ALTER TABLE vulnerabilities ADD COLUMN published_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add modified_date if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'modified_date') THEN
        ALTER TABLE vulnerabilities ADD COLUMN modified_date TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add e_detect_impact if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'e_detect_impact') THEN
        ALTER TABLE vulnerabilities ADD COLUMN e_detect_impact REAL DEFAULT 0;
    END IF;
    
    -- Add e_resist_impact if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'e_resist_impact') THEN
        ALTER TABLE vulnerabilities ADD COLUMN e_resist_impact REAL DEFAULT 0;
    END IF;
    
    -- Add vuln_references if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'vuln_references') THEN
        ALTER TABLE vulnerabilities ADD COLUMN vuln_references JSON DEFAULT '[]';
    END IF;
    
    -- Add tags if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'tags') THEN
        ALTER TABLE vulnerabilities ADD COLUMN tags JSON DEFAULT '[]';
    END IF;
    
    -- Add remediation if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'remediation') THEN
        ALTER TABLE vulnerabilities ADD COLUMN remediation TEXT;
    END IF;
    
    -- Add workaround if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'workaround') THEN
        ALTER TABLE vulnerabilities ADD COLUMN workaround TEXT;
    END IF;
    
    -- Add exploit_available if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'exploit_available') THEN
        ALTER TABLE vulnerabilities ADD COLUMN exploit_available BOOLEAN DEFAULT false;
    END IF;
    
    -- Add exploitability_subscore if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'exploitability_subscore') THEN
        ALTER TABLE vulnerabilities ADD COLUMN exploitability_subscore NUMERIC;
    END IF;
    
    -- Add impact_subscore if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'impact_subscore') THEN
        ALTER TABLE vulnerabilities ADD COLUMN impact_subscore NUMERIC;
    END IF;
    
    -- Add temporal_score if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'temporal_score') THEN
        ALTER TABLE vulnerabilities ADD COLUMN temporal_score NUMERIC;
    END IF;
    
    -- Add e_detect if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'e_detect') THEN
        ALTER TABLE vulnerabilities ADD COLUMN e_detect NUMERIC;
    END IF;
    
    -- Add e_resist if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'e_resist') THEN
        ALTER TABLE vulnerabilities ADD COLUMN e_resist NUMERIC;
    END IF;
    
    -- Add variance_freq if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'variance_freq') THEN
        ALTER TABLE vulnerabilities ADD COLUMN variance_freq INTEGER;
    END IF;
    
    -- Add variance_duration if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'variance_duration') THEN
        ALTER TABLE vulnerabilities ADD COLUMN variance_duration INTEGER;
    END IF;
END $$;

-- Create missing tables
CREATE TABLE IF NOT EXISTS cost_modules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    module_type cost_module_type NOT NULL,
    base_cost NUMERIC(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    calculation_formula TEXT,
    applicable_categories TEXT[],
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_controls (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    control_id INTEGER NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    effectiveness_reduction REAL DEFAULT 0.0,
    implementation_cost NUMERIC(12,2) DEFAULT 0,
    annual_operating_cost NUMERIC(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(risk_id, control_id)
);

CREATE TABLE IF NOT EXISTS risk_costs (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    cost_module_id INTEGER NOT NULL REFERENCES cost_modules(id) ON DELETE CASCADE,
    cost_value NUMERIC(12,2) DEFAULT 0,
    calculation_basis TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(risk_id, cost_module_id)
);

-- Create indexes safely with column existence checks
DO $$
BEGIN
    -- Create index on assets.legal_entity if column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'legal_entity') THEN
        CREATE INDEX IF NOT EXISTS idx_assets_legal_entity ON assets(legal_entity);
    END IF;
    
    -- Create index on risks.severity if column exists and has proper type
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'severity') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_risks_severity ON risks(severity);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails due to type issues
            RAISE NOTICE 'Skipping risks severity index due to type mismatch';
        END;
    END IF;
    
    -- Create index on controls.implementation_status if column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'implementation_status') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_controls_implementation_status ON controls(implementation_status);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping controls implementation_status index due to type mismatch';
        END;
    END IF;
    
    -- Create index on vulnerabilities.severity if column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'severity') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping vulnerabilities severity index due to type mismatch';
        END;
    END IF;
    
    -- Create index on vulnerabilities.status if column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'status') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(status);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Skipping vulnerabilities status index due to type mismatch';
        END;
    END IF;
END $$;

-- Migration completed successfully