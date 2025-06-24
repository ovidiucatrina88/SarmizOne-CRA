-- Production Database Schema - Aligned with Neon Development
-- Generated from current development schema for production deployment
-- This ensures production matches the latest application requirements

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Drop existing schema if it exists (for clean rebuild)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Create all ENUM types first
CREATE TYPE asset_type AS ENUM (
    'data',
    'application', 
    'device',
    'system',
    'network',
    'facility',
    'personnel',
    'other',
    'strategic_capability',
    'value_capability',
    'business_service',
    'product_service'
);

CREATE TYPE asset_status AS ENUM (
    'Active',
    'Decommissioned',
    'To Adopt'
);

CREATE TYPE cia_rating AS ENUM (
    'Low',
    'Medium',
    'High'
);

CREATE TYPE external_internal AS ENUM (
    'External',
    'Internal'
);

CREATE TYPE hierarchy_level AS ENUM (
    'strategic_objective',
    'business_capability',
    'business_service',
    'application_component',
    'technical_component'
);

CREATE TYPE control_type AS ENUM (
    'preventive',
    'detective',
    'corrective'
);

CREATE TYPE control_category AS ENUM (
    'technical',
    'administrative',
    'physical'
);

CREATE TYPE implementation_status AS ENUM (
    'not_implemented',
    'planned',
    'in_progress',
    'fully_implemented'
);

CREATE TYPE risk_category AS ENUM (
    'operational',
    'strategic',
    'compliance',
    'financial'
);

CREATE TYPE severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

CREATE TYPE risk_response_type AS ENUM (
    'accept',
    'avoid',
    'transfer',
    'mitigate'
);

CREATE TYPE currency AS ENUM (
    'USD',
    'EUR'
);

CREATE TYPE user_role AS ENUM (
    'admin',
    'analyst',
    'viewer'
);

CREATE TYPE auth_type AS ENUM (
    'local',
    'openid'
);

CREATE TYPE item_type AS ENUM (
    'template',
    'instance'
);

CREATE TYPE compliance_framework AS ENUM (
    'CIS',
    'NIST',
    'PCI',
    'SOX',
    'GDPR',
    'HIPAA',
    'ISO27001'
);

CREATE TYPE vulnerability_status AS ENUM (
    'open',
    'in_progress',
    'resolved',
    'risk_accepted'
);

CREATE TYPE vulnerability_severity AS ENUM (
    'info',
    'low',
    'medium',
    'high',
    'critical'
);

-- Create all tables with exact column structure from development

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT,
    display_name TEXT,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'viewer',
    auth_type auth_type NOT NULL DEFAULT 'local',
    is_active BOOLEAN NOT NULL DEFAULT true,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    password_salt TEXT,
    password_iterations INTEGER DEFAULT 100,
    account_locked_until TIMESTAMP,
    sso_subject TEXT,
    sso_provider TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    created_by TEXT,
    updated_by TEXT,
    is_email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    phone TEXT,
    department TEXT,
    job_title TEXT,
    manager_id INTEGER,
    login_count INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP
);

-- Legal Entities table (with ALL required columns)
CREATE TABLE legal_entities (
    id SERIAL PRIMARY KEY,
    entity_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    parent_entity_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    type TEXT,
    jurisdiction TEXT,
    regulatory_framework TEXT[],
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Assets table
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    asset_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type asset_type NOT NULL,
    business_unit TEXT NOT NULL,
    owner TEXT NOT NULL,
    confidentiality cia_rating NOT NULL,
    integrity cia_rating NOT NULL,
    availability cia_rating NOT NULL,
    asset_value NUMERIC(15,2) NOT NULL,
    regulatory_impact TEXT[] NOT NULL DEFAULT '{none}',
    external_internal external_internal NOT NULL,
    dependencies TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    currency currency NOT NULL DEFAULT 'USD',
    agent_count INTEGER NOT NULL DEFAULT 1,
    legal_entity TEXT NOT NULL DEFAULT 'Unknown',
    status asset_status NOT NULL DEFAULT 'Active',
    parent_id INTEGER,
    hierarchy_level hierarchy_level NOT NULL DEFAULT 'technical_component',
    architecture_domain TEXT,
    backstage_entity_ref TEXT,
    backstage_metadata JSONB,
    last_backstage_sync TIMESTAMP
);

-- Controls table (with ALL agent-related columns)
CREATE TABLE controls (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    associated_risks TEXT[] NOT NULL DEFAULT '{}',
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL,
    control_effectiveness NUMERIC(5,2) NOT NULL,
    implementation_cost NUMERIC(15,2) NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cost_per_agent NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_per_agent_pricing BOOLEAN NOT NULL DEFAULT false,
    library_item_id INTEGER,
    item_type item_type DEFAULT 'instance',
    asset_id TEXT,
    risk_id INTEGER,
    legal_entity_id TEXT,
    deployed_agent_count INTEGER DEFAULT 0,
    compliance_framework compliance_framework DEFAULT 'CIS',
    is_per_agent BOOLEAN DEFAULT false,
    cloud_domain TEXT,
    nist_mappings JSONB DEFAULT '[]',
    pci_mappings JSONB DEFAULT '[]',
    cis_mappings JSONB DEFAULT '[]'
);

-- Risks table
CREATE TABLE risks (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    inherent_risk NUMERIC(15,2),
    residual_risk NUMERIC(15,2),
    associated_assets JSON DEFAULT '[]',
    library_item_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Enterprise Architecture table
CREATE TABLE enterprise_architecture (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    hierarchy_level hierarchy_level NOT NULL,
    parent_id INTEGER REFERENCES enterprise_architecture(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Risk Controls junction table
CREATE TABLE risk_controls (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    control_id INTEGER NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Risk Responses table
CREATE TABLE risk_responses (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    response_type risk_response_type NOT NULL,
    description TEXT,
    implementation_cost NUMERIC(15,2),
    expected_effectiveness REAL,
    responsible_party TEXT,
    target_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Risk Costs table
CREATE TABLE risk_costs (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    cost_module_id INTEGER NOT NULL,
    cost_value NUMERIC(15,2) NOT NULL,
    frequency TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Asset Relationships table
CREATE TABLE asset_relationships (
    id SERIAL PRIMARY KEY,
    source_asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    target_asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Risk Summaries table
CREATE TABLE risk_summaries (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_risks INTEGER NOT NULL DEFAULT 0,
    critical_risks INTEGER NOT NULL DEFAULT 0,
    high_risks INTEGER NOT NULL DEFAULT 0,
    medium_risks INTEGER NOT NULL DEFAULT 0,
    low_risks INTEGER NOT NULL DEFAULT 0,
    total_inherent_risk NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_residual_risk NUMERIC(15,2) NOT NULL DEFAULT 0,
    risk_reduction NUMERIC(5,2) NOT NULL DEFAULT 0,
    exposure_curve_data JSONB NOT NULL DEFAULT '[]',
    minimum_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    maximum_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    mean_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    median_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    percentile95_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    percentile99_exposure NUMERIC(15,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sessions table for authentication
CREATE TABLE sessions (
    sid TEXT PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Auth Config table
CREATE TABLE auth_config (
    id SERIAL PRIMARY KEY,
    auth_type auth_type NOT NULL,
    config JSONB NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Library tables
CREATE TABLE risk_library (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    contact_frequency_min NUMERIC(10,4) DEFAULT 0,
    contact_frequency_avg NUMERIC(10,4) DEFAULT 0,
    contact_frequency_max NUMERIC(10,4) DEFAULT 0,
    contact_frequency_confidence TEXT DEFAULT 'Medium',
    probability_of_action_min NUMERIC(10,4) DEFAULT 0,
    probability_of_action_avg NUMERIC(10,4) DEFAULT 0,
    probability_of_action_max NUMERIC(10,4) DEFAULT 0,
    probability_of_action_confidence TEXT DEFAULT 'Medium',
    threat_capability_min NUMERIC(10,4) DEFAULT 0,
    threat_capability_avg NUMERIC(10,4) DEFAULT 0,
    threat_capability_max NUMERIC(10,4) DEFAULT 0,
    threat_capability_confidence TEXT DEFAULT 'Medium',
    resistance_strength_min NUMERIC(10,4) DEFAULT 0,
    resistance_strength_avg NUMERIC(10,4) DEFAULT 0,
    resistance_strength_max NUMERIC(10,4) DEFAULT 0,
    resistance_strength_confidence TEXT DEFAULT 'Medium',
    primary_loss_magnitude_min NUMERIC(15,2) DEFAULT 0,
    primary_loss_magnitude_avg NUMERIC(15,2) DEFAULT 0,
    primary_loss_magnitude_max NUMERIC(15,2) DEFAULT 0,
    primary_loss_magnitude_confidence TEXT DEFAULT 'Medium',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE control_library (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_cost NUMERIC(15,2) DEFAULT 0,
    control_effectiveness NUMERIC(5,2) DEFAULT 70,
    cost_per_agent NUMERIC(10,2) DEFAULT 0,
    deployed_agent_count INTEGER DEFAULT 0,
    is_per_agent_pricing BOOLEAN DEFAULT false,
    compliance_framework compliance_framework DEFAULT 'CIS',
    nist_mappings JSONB DEFAULT '[]',
    pci_mappings JSONB DEFAULT '[]',
    cis_mappings JSONB DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Mapping tables
CREATE TABLE control_risk_mappings (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    risk_library_id INTEGER,
    risk_category risk_category,
    relevance_score INTEGER DEFAULT 0,
    impact_type TEXT,
    reasoning TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE control_asset_mappings (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    asset_type asset_type NOT NULL,
    relevance_score INTEGER DEFAULT 0,
    reasoning TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Industry insights and benchmark data
CREATE TABLE industry_insights (
    id SERIAL PRIMARY KEY,
    sector TEXT NOT NULL,
    metric TEXT NOT NULL,
    value_numeric NUMERIC(15,4),
    value_text TEXT,
    confidence_level TEXT DEFAULT 'Medium',
    sample_size INTEGER,
    effective_from DATE DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'IRIS 2025',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Vulnerability management
CREATE TABLE vulnerabilities (
    id SERIAL PRIMARY KEY,
    vulnerability_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    severity vulnerability_severity NOT NULL,
    cvss_score NUMERIC(3,1),
    status vulnerability_status NOT NULL DEFAULT 'open',
    discovered_date TIMESTAMP NOT NULL DEFAULT NOW(),
    due_date TIMESTAMP,
    resolved_date TIMESTAMP,
    assignee TEXT,
    source TEXT,
    cve_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE vulnerability_assets (
    id SERIAL PRIMARY KEY,
    vulnerability_id INTEGER NOT NULL REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Backstage integration
CREATE TABLE backstage_sync_logs (
    id SERIAL PRIMARY KEY,
    sync_type TEXT NOT NULL,
    status TEXT NOT NULL,
    entities_processed INTEGER DEFAULT 0,
    entities_created INTEGER DEFAULT 0,
    entities_updated INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_controls_control_id ON controls(control_id);
CREATE INDEX idx_risks_risk_id ON risks(risk_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_legal_entities_entity_id ON legal_entities(entity_id);
CREATE INDEX idx_risk_controls_risk_id ON risk_controls(risk_id);
CREATE INDEX idx_risk_controls_control_id ON risk_controls(control_id);
CREATE INDEX idx_vulnerabilities_vulnerability_id ON vulnerabilities(vulnerability_id);
CREATE INDEX idx_vulnerability_assets_vulnerability_id ON vulnerability_assets(vulnerability_id);
CREATE INDEX idx_vulnerability_assets_asset_id ON vulnerability_assets(asset_id);

-- Schema version tracking
CREATE TABLE production_schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO production_schema_version (version, description) 
VALUES (3, 'Complete schema alignment with Neon development database');

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO risk_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO risk_app_user;