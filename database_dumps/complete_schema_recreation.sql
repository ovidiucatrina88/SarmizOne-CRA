-- Complete Schema Recreation Script
-- This script drops all existing tables and recreates the entire database schema from scratch
-- Generated on 2025-06-11

-- Drop all existing tables in correct dependency order
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS asset_relationships CASCADE;
DROP TABLE IF EXISTS response_cost_modules CASCADE;
DROP TABLE IF EXISTS risk_costs CASCADE;
DROP TABLE IF EXISTS risk_controls CASCADE;
DROP TABLE IF EXISTS risk_summaries CASCADE;
DROP TABLE IF EXISTS risk_responses CASCADE;
DROP TABLE IF EXISTS vulnerability_assets CASCADE;
DROP TABLE IF EXISTS vulnerabilities CASCADE;
DROP TABLE IF EXISTS controls CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS enterprise_architecture CASCADE;
DROP TABLE IF EXISTS legal_entities CASCADE;
DROP TABLE IF EXISTS cost_modules CASCADE;
DROP TABLE IF EXISTS control_library CASCADE;
DROP TABLE IF EXISTS risk_library CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth_config CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Drop all existing enum types
DROP TYPE IF EXISTS cost_module_type CASCADE;
DROP TYPE IF EXISTS asset_type CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS cia_rating CASCADE;
DROP TYPE IF EXISTS external_internal CASCADE;
DROP TYPE IF EXISTS hierarchy_level CASCADE;
DROP TYPE IF EXISTS relationship_type CASCADE;
DROP TYPE IF EXISTS risk_category CASCADE;
DROP TYPE IF EXISTS control_type CASCADE;
DROP TYPE IF EXISTS control_category CASCADE;
DROP TYPE IF EXISTS implementation_status CASCADE;
DROP TYPE IF EXISTS risk_response_type CASCADE;
DROP TYPE IF EXISTS severity CASCADE;
DROP TYPE IF EXISTS currency CASCADE;
DROP TYPE IF EXISTS vulnerability_status CASCADE;
DROP TYPE IF EXISTS vulnerability_severity CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS auth_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create all enum types
CREATE TYPE asset_type AS ENUM ('data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component');
CREATE TYPE asset_status AS ENUM ('Active', 'Decommissioned', 'To Adopt');
CREATE TYPE cia_rating AS ENUM ('low', 'medium', 'high');
CREATE TYPE external_internal AS ENUM ('external', 'internal');
CREATE TYPE hierarchy_level AS ENUM ('strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component');
CREATE TYPE relationship_type AS ENUM ('part_of', 'depends_on', 'contains');
CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');
CREATE TYPE risk_response_type AS ENUM ('accept', 'avoid', 'transfer', 'mitigate');
CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK');
CREATE TYPE item_type AS ENUM ('template', 'instance');
CREATE TYPE auth_type AS ENUM ('local', 'sso');

-- Legal Entities Table
CREATE TABLE legal_entities (
    id SERIAL PRIMARY KEY,
    entity_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    parent_entity_id TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Assets Table (exact match to your schema)
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    asset_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type asset_type NOT NULL,
    business_unit TEXT NOT NULL,
    owner TEXT NOT NULL,
    confidentiality cia_rating NOT NULL,
    integrity cia_rating NOT NULL,
    availability cia_rating NOT NULL,
    asset_value NUMERIC NOT NULL,
    regulatory_impact TEXT[] NOT NULL DEFAULT '{none}',
    external_internal external_internal NOT NULL,
    dependencies TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    currency currency NOT NULL DEFAULT 'USD',
    agent_count INTEGER NOT NULL DEFAULT 1,
    legal_entity TEXT NOT NULL DEFAULT 'Unknown',
    status asset_status NOT NULL DEFAULT 'Active',
    parent_id INTEGER,
    hierarchy_level hierarchy_level NOT NULL DEFAULT 'technical_component',
    architecture_domain TEXT
);

-- Enterprise Architecture Table
CREATE TABLE enterprise_architecture (
    id SERIAL PRIMARY KEY,
    asset_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    level TEXT NOT NULL,
    type TEXT NOT NULL,
    architecture_domain TEXT,
    parent_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Risks Table (exact match to your schema)
CREATE TABLE risks (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    associated_assets TEXT[],
    threat_community TEXT NOT NULL,
    vulnerability TEXT NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    contact_frequency REAL NOT NULL DEFAULT 0,
    probability_of_action REAL NOT NULL DEFAULT 0,
    threat_event_frequency REAL NOT NULL DEFAULT 0,
    threat_capability REAL NOT NULL DEFAULT 0,
    resistance_strength REAL NOT NULL DEFAULT 0,
    susceptibility NUMERIC NOT NULL DEFAULT 0,
    loss_event_frequency REAL NOT NULL DEFAULT 0,
    primary_loss_magnitude REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency REAL NOT NULL DEFAULT 0,
    secondary_loss_magnitude REAL NOT NULL DEFAULT 0,
    probable_loss_magnitude REAL NOT NULL DEFAULT 0,
    inherent_risk NUMERIC NOT NULL DEFAULT 0,
    residual_risk NUMERIC NOT NULL DEFAULT 0,
    rank_percentile REAL NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    contact_frequency_min REAL NOT NULL DEFAULT 0,
    contact_frequency_avg REAL NOT NULL DEFAULT 0,
    contact_frequency_max REAL NOT NULL DEFAULT 0,
    contact_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    probability_of_action_min REAL NOT NULL DEFAULT 0,
    probability_of_action_avg REAL NOT NULL DEFAULT 0,
    probability_of_action_max REAL NOT NULL DEFAULT 0,
    probability_of_action_confidence TEXT NOT NULL DEFAULT 'Medium',
    threat_event_frequency_min REAL NOT NULL DEFAULT 0,
    threat_event_frequency_avg REAL NOT NULL DEFAULT 0,
    threat_event_frequency_max REAL NOT NULL DEFAULT 0,
    threat_event_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    threat_capability_min REAL NOT NULL DEFAULT 0,
    threat_capability_avg REAL NOT NULL DEFAULT 0,
    threat_capability_max REAL NOT NULL DEFAULT 0,
    threat_capability_confidence TEXT NOT NULL DEFAULT 'Medium',
    resistance_strength_min REAL NOT NULL DEFAULT 0,
    resistance_strength_avg REAL NOT NULL DEFAULT 0,
    resistance_strength_max REAL NOT NULL DEFAULT 0,
    resistance_strength_confidence TEXT NOT NULL DEFAULT 'Medium',
    susceptibility_min REAL NOT NULL DEFAULT 0,
    susceptibility_avg REAL NOT NULL DEFAULT 0,
    susceptibility_max REAL NOT NULL DEFAULT 0,
    susceptibility_confidence TEXT NOT NULL DEFAULT 'Medium',
    loss_event_frequency_min REAL NOT NULL DEFAULT 0,
    loss_event_frequency_avg REAL NOT NULL DEFAULT 0,
    loss_event_frequency_max REAL NOT NULL DEFAULT 0,
    loss_event_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    primary_loss_magnitude_min NUMERIC NOT NULL DEFAULT 0,
    primary_loss_magnitude_avg NUMERIC NOT NULL DEFAULT 0,
    primary_loss_magnitude_max NUMERIC NOT NULL DEFAULT 0,
    primary_loss_magnitude_confidence TEXT NOT NULL DEFAULT 'Medium',
    secondary_loss_event_frequency_min REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_avg REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_max REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    secondary_loss_magnitude_min NUMERIC NOT NULL DEFAULT 0,
    secondary_loss_magnitude_avg NUMERIC NOT NULL DEFAULT 0,
    secondary_loss_magnitude_max NUMERIC NOT NULL DEFAULT 0,
    secondary_loss_magnitude_confidence TEXT NOT NULL DEFAULT 'Medium',
    loss_magnitude_min NUMERIC NOT NULL DEFAULT 0,
    loss_magnitude_avg NUMERIC NOT NULL DEFAULT 0,
    loss_magnitude_max NUMERIC NOT NULL DEFAULT 0,
    loss_magnitude_confidence TEXT NOT NULL DEFAULT 'Medium',
    notes TEXT NOT NULL DEFAULT '',
    library_item_id INTEGER,
    item_type item_type DEFAULT 'instance',
    vulnerability_ids TEXT[],
    cis_controls TEXT[] DEFAULT '{}',
    applicable_cost_modules INTEGER[] DEFAULT '{}'
);

-- Controls Table (exact match to your schema)
CREATE TABLE controls (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    associated_risks TEXT[] NOT NULL DEFAULT '{}',
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL,
    control_effectiveness NUMERIC NOT NULL,
    implementation_cost NUMERIC NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    cost_per_agent NUMERIC NOT NULL DEFAULT 0,
    is_per_agent_pricing BOOLEAN NOT NULL DEFAULT FALSE,
    library_item_id INTEGER,
    item_type item_type DEFAULT 'instance',
    asset_id TEXT,
    risk_id INTEGER,
    legal_entity_id TEXT,
    deployed_agent_count INTEGER DEFAULT 0,
    e_avoid NUMERIC DEFAULT 0.00,
    e_deter NUMERIC DEFAULT 0.00,
    e_detect NUMERIC DEFAULT 0.00,
    e_resist NUMERIC DEFAULT 0.00,
    var_freq INTEGER DEFAULT 0,
    var_duration INTEGER DEFAULT 0
);

-- Control Library Table
CREATE TABLE control_library (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL DEFAULT 'planned',
    control_effectiveness REAL NOT NULL DEFAULT 0,
    implementation_cost NUMERIC NOT NULL DEFAULT 0,
    cost_per_agent NUMERIC NOT NULL DEFAULT 0,
    is_per_agent_pricing BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT NOT NULL DEFAULT '',
    nist_csf TEXT[] NOT NULL DEFAULT '{}',
    iso27001 TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    associated_risks TEXT[],
    library_item_id INTEGER,
    item_type TEXT,
    asset_id TEXT,
    risk_id INTEGER,
    legal_entity_id TEXT,
    deployed_agent_count INTEGER
);

-- Risk Library Table
CREATE TABLE risk_library (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    threat_community TEXT NOT NULL DEFAULT '',
    vulnerability TEXT NOT NULL DEFAULT '',
    risk_category risk_category NOT NULL,
    severity severity NOT NULL DEFAULT 'medium',
    contact_frequency_min REAL NOT NULL DEFAULT 0,
    contact_frequency_avg REAL NOT NULL DEFAULT 0,
    contact_frequency_max REAL NOT NULL DEFAULT 0,
    contact_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    probability_of_action_min REAL NOT NULL DEFAULT 0,
    probability_of_action_avg REAL NOT NULL DEFAULT 0,
    probability_of_action_max REAL NOT NULL DEFAULT 0,
    probability_of_action_confidence TEXT NOT NULL DEFAULT 'Medium',
    threat_capability_min REAL NOT NULL DEFAULT 0,
    threat_capability_avg REAL NOT NULL DEFAULT 0,
    threat_capability_max REAL NOT NULL DEFAULT 0,
    threat_capability_confidence TEXT NOT NULL DEFAULT 'Medium',
    resistance_strength_min REAL NOT NULL DEFAULT 0,
    resistance_strength_avg REAL NOT NULL DEFAULT 0,
    resistance_strength_max REAL NOT NULL DEFAULT 0,
    resistance_strength_confidence TEXT NOT NULL DEFAULT 'Medium',
    primary_loss_magnitude_min REAL NOT NULL DEFAULT 0,
    primary_loss_magnitude_avg REAL NOT NULL DEFAULT 0,
    primary_loss_magnitude_max REAL NOT NULL DEFAULT 0,
    primary_loss_magnitude_confidence TEXT NOT NULL DEFAULT 'Medium',
    secondary_loss_event_frequency_min REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_avg REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_max REAL NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_confidence TEXT NOT NULL DEFAULT 'Medium',
    secondary_loss_magnitude_min REAL NOT NULL DEFAULT 0,
    secondary_loss_magnitude_avg REAL NOT NULL DEFAULT 0,
    secondary_loss_magnitude_max REAL NOT NULL DEFAULT 0,
    secondary_loss_magnitude_confidence TEXT NOT NULL DEFAULT 'Medium',
    recommended_controls TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cost Modules Table
CREATE TABLE cost_modules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    cis_control TEXT[] NOT NULL,
    cost_factor NUMERIC NOT NULL,
    cost_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Risk Controls Table
CREATE TABLE risk_controls (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL,
    control_id INTEGER NOT NULL,
    effectiveness REAL NOT NULL DEFAULT 0,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Risk Costs Table
CREATE TABLE risk_costs (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL,
    cost_module_id INTEGER NOT NULL,
    weight NUMERIC NOT NULL DEFAULT 1.0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Risk Responses Table
CREATE TABLE risk_responses (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    response_type risk_response_type NOT NULL,
    justification TEXT NOT NULL DEFAULT '',
    assigned_controls TEXT[] NOT NULL DEFAULT '{}',
    transfer_method TEXT NOT NULL DEFAULT '',
    avoidance_strategy TEXT NOT NULL DEFAULT '',
    acceptance_reason TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    cost_module_ids INTEGER[] DEFAULT '{}'
);

-- Response Cost Modules Table
CREATE TABLE response_cost_modules (
    id SERIAL PRIMARY KEY,
    response_id INTEGER NOT NULL,
    cost_module_id INTEGER NOT NULL,
    multiplier NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Risk Summaries Table
CREATE TABLE risk_summaries (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    legal_entity_id TEXT,
    tenth_percentile_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    most_likely_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    ninetieth_percentile_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    minimum_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    maximum_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    average_exposure DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    total_risks INTEGER DEFAULT 0,
    critical_risks INTEGER DEFAULT 0,
    high_risks INTEGER DEFAULT 0,
    medium_risks INTEGER DEFAULT 0,
    low_risks INTEGER DEFAULT 0,
    total_inherent_risk REAL DEFAULT 0,
    total_residual_risk REAL DEFAULT 0,
    mean_exposure REAL DEFAULT 0,
    median_exposure REAL DEFAULT 0,
    percentile_95_exposure REAL DEFAULT 0,
    percentile_99_exposure REAL DEFAULT 0,
    exposure_curve_data JSONB DEFAULT '[]'
);

-- Asset Relationships Table
CREATE TABLE asset_relationships (
    id SERIAL PRIMARY KEY,
    source_asset_id INTEGER NOT NULL,
    target_asset_id INTEGER NOT NULL,
    relationship_type relationship_type NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username CHARACTER VARYING,
    email CHARACTER VARYING,
    display_name CHARACTER VARYING NOT NULL,
    password_hash CHARACTER VARYING,
    role CHARACTER VARYING NOT NULL DEFAULT 'user',
    auth_type CHARACTER VARYING NOT NULL DEFAULT 'local',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    failed_login_attempts INTEGER DEFAULT 0
);

-- Auth Config Table
CREATE TABLE auth_config (
    id SERIAL PRIMARY KEY,
    auth_type auth_type NOT NULL DEFAULT 'local',
    oidc_enabled BOOLEAN DEFAULT FALSE,
    oidc_issuer TEXT,
    oidc_client_id TEXT,
    oidc_client_secret TEXT,
    oidc_callback_url TEXT,
    oidc_scopes JSON DEFAULT '["openid", "profile", "email"]',
    session_timeout INTEGER DEFAULT 3600,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 300,
    password_min_length INTEGER DEFAULT 8,
    require_password_change BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Vulnerabilities Table
CREATE TABLE vulnerabilities (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    discovery_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    severity_cvss3 NUMERIC NOT NULL DEFAULT 0,
    patchable BOOLEAN NOT NULL DEFAULT TRUE,
    source TEXT NOT NULL DEFAULT 'manual',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity CHARACTER VARYING DEFAULT 'medium',
    status CHARACTER VARYING DEFAULT 'open',
    e_detect NUMERIC,
    e_resist NUMERIC,
    variance_freq INTEGER,
    variance_duration INTEGER,
    remediation_date TIMESTAMP WITHOUT TIME ZONE,
    CHECK (source = ANY (ARRAY['scanner'::text, 'pen_test'::text, 'bug_bounty'::text, 'manual'::text])),
    CHECK (status = ANY (ARRAY['open'::text, 'in_progress'::text, 'remediated'::text, 'exception'::text]))
);

-- Activity Logs Table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    "user" TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE sessions (
    sid CHARACTER VARYING PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Add foreign key constraints
ALTER TABLE legal_entities ADD CONSTRAINT legal_entities_parent_fkey FOREIGN KEY (parent_entity_id) REFERENCES legal_entities(entity_id);
ALTER TABLE assets ADD CONSTRAINT assets_parent_fkey FOREIGN KEY (parent_id) REFERENCES assets(id);
ALTER TABLE assets ADD CONSTRAINT assets_legal_entity_fkey FOREIGN KEY (legal_entity) REFERENCES legal_entities(entity_id);
ALTER TABLE enterprise_architecture ADD CONSTRAINT enterprise_architecture_parent_fkey FOREIGN KEY (parent_id) REFERENCES enterprise_architecture(id);
ALTER TABLE risk_controls ADD CONSTRAINT risk_controls_risk_fkey FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE;
ALTER TABLE risk_controls ADD CONSTRAINT risk_controls_control_fkey FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE;
ALTER TABLE risk_costs ADD CONSTRAINT risk_costs_risk_fkey FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE;
ALTER TABLE risk_costs ADD CONSTRAINT risk_costs_cost_module_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id) ON DELETE CASCADE;
ALTER TABLE response_cost_modules ADD CONSTRAINT response_cost_modules_response_fkey FOREIGN KEY (response_id) REFERENCES risk_responses(id) ON DELETE CASCADE;
ALTER TABLE response_cost_modules ADD CONSTRAINT response_cost_modules_cost_module_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id) ON DELETE CASCADE;
ALTER TABLE asset_relationships ADD CONSTRAINT asset_relationships_source_fkey FOREIGN KEY (source_asset_id) REFERENCES assets(id) ON DELETE CASCADE;
ALTER TABLE asset_relationships ADD CONSTRAINT asset_relationships_target_fkey FOREIGN KEY (target_asset_id) REFERENCES assets(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX idx_assets_legal_entity ON assets(legal_entity);
CREATE INDEX idx_risks_severity ON risks(severity);
CREATE INDEX idx_controls_implementation_status ON controls(implementation_status);
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_risk_summaries_entity_date ON risk_summaries(legal_entity_id, year, month);

-- Schema recreation completed successfully