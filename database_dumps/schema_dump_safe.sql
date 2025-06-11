-- Safe Database Schema Dump for Cybersecurity Risk Quantification Platform
-- Generated on 2025-06-11
-- This version safely applies to existing databases without conflicts

-- Create essential enum types only if they don't exist
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
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'hierarchy_level') THEN
        CREATE TYPE hierarchy_level AS ENUM ('strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relationship_type') THEN
        CREATE TYPE relationship_type AS ENUM ('part_of', 'depends_on', 'contains');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_category') THEN
        CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_type') THEN
        CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_category') THEN
        CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'implementation_status') THEN
        CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_response_type') THEN
        CREATE TYPE risk_response_type AS ENUM ('accept', 'avoid', 'transfer', 'mitigate');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity') THEN
        CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currency') THEN
        CREATE TYPE currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vulnerability_status') THEN
        CREATE TYPE vulnerability_status AS ENUM ('open', 'in_progress', 'mitigated', 'resolved', 'false_positive');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vulnerability_severity') THEN
        CREATE TYPE vulnerability_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_type') THEN
        CREATE TYPE item_type AS ENUM ('template', 'instance');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auth_type') THEN
        CREATE TYPE auth_type AS ENUM ('local', 'sso');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'viewer');
    END IF;
END $$;

-- Legal Entities Table
CREATE TABLE IF NOT EXISTS legal_entities (
    id SERIAL PRIMARY KEY,
    entity_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES legal_entities(id),
    hierarchy_level hierarchy_level NOT NULL DEFAULT 'business_service',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets Table (compatible with existing structure)
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type asset_type NOT NULL,
    status asset_status NOT NULL DEFAULT 'Active',
    integrity cia_rating NOT NULL DEFAULT 'medium',
    availability cia_rating NOT NULL DEFAULT 'medium',
    confidentiality cia_rating NOT NULL DEFAULT 'medium',
    legal_entity TEXT REFERENCES legal_entities(entity_id),
    owner TEXT,
    business_unit TEXT,
    asset_value NUMERIC(15,2) DEFAULT 0,
    currency currency DEFAULT 'USD',
    parent_id INTEGER REFERENCES assets(id),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Enterprise Architecture Table
CREATE TABLE IF NOT EXISTS enterprise_architecture (
    id SERIAL PRIMARY KEY,
    component_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    hierarchy_level hierarchy_level NOT NULL,
    parent_id INTEGER REFERENCES enterprise_architecture(id),
    legal_entity TEXT REFERENCES legal_entities(entity_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risks Table
CREATE TABLE IF NOT EXISTS risks (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    severity severity NOT NULL,
    risk_category risk_category NOT NULL,
    item_type item_type,
    inherent_risk NUMERIC DEFAULT 0,
    residual_risk NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Controls Table
CREATE TABLE IF NOT EXISTS controls (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type control_type NOT NULL,
    category control_category NOT NULL,
    implementation_status implementation_status NOT NULL DEFAULT 'not_implemented',
    effectiveness REAL DEFAULT 0.0,
    legal_entity TEXT REFERENCES legal_entities(entity_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    first_name TEXT,
    last_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auth Config Table
CREATE TABLE IF NOT EXISTS auth_config (
    id SERIAL PRIMARY KEY,
    auth_type auth_type NOT NULL DEFAULT 'local',
    oidc_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vulnerabilities Table
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    severity vulnerability_severity NOT NULL DEFAULT 'medium',
    status vulnerability_status NOT NULL DEFAULT 'open',
    discovery_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    severity_cvss3 NUMERIC NOT NULL DEFAULT 0,
    patchable BOOLEAN NOT NULL DEFAULT true,
    source TEXT NOT NULL DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT vulnerabilities_source_check CHECK (source = ANY (ARRAY['scanner'::text, 'pen_test'::text, 'bug_bounty'::text, 'manual'::text])),
    CONSTRAINT vulnerabilities_status_check CHECK (status = ANY (ARRAY['open'::text, 'in_progress'::text, 'remediated'::text, 'exception'::text]))
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Safe schema application completed successfully
-- This version avoids column conflicts and applies safely to existing databases