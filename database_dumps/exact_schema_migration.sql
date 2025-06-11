-- Exact Schema Migration Script for Existing Database
-- This script adds missing columns to match your current database structure
-- Generated on 2025-06-11

-- Add missing columns to vulnerabilities table to match schema expectations
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

-- Add missing columns to assets table to match application expectations
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

-- Add missing columns to controls table
DO $$
BEGIN
    -- Add cost if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'cost') THEN
        ALTER TABLE controls ADD COLUMN cost NUMERIC(12,2) DEFAULT 0;
    END IF;
    
    -- Add currency if missing (using text to match existing structure)
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
    
    -- Add legal_entity if missing (to match application expectations)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'legal_entity') THEN
        ALTER TABLE controls ADD COLUMN legal_entity TEXT;
    END IF;
END $$;

-- Create essential indexes that are safe with current schema
DO $$
BEGIN
    -- Create index on assets.legal_entity if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assets' AND column_name = 'legal_entity') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_assets_legal_entity ON assets(legal_entity);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails
            NULL;
        END;
    END IF;
    
    -- Create index on vulnerabilities.severity if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'severity') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails
            NULL;
        END;
    END IF;
    
    -- Create index on vulnerabilities.status if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vulnerabilities' AND column_name = 'status') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(status);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails
            NULL;
        END;
    END IF;
    
    -- Create index on risks.severity if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'severity') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_risks_severity ON risks(severity);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails
            NULL;
        END;
    END IF;
    
    -- Create index on controls.implementation_status if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'controls' AND column_name = 'implementation_status') THEN
        BEGIN
            CREATE INDEX IF NOT EXISTS idx_controls_implementation_status ON controls(implementation_status);
        EXCEPTION WHEN OTHERS THEN
            -- Skip if index creation fails
            NULL;
        END;
    END IF;
END $$;

-- Migration completed successfully - all missing columns added to match application schema expectations