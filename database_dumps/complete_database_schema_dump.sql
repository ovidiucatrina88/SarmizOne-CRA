-- Complete Database Schema Dump
-- This script drops all existing tables, types, and constraints, then recreates the entire database from scratch
-- Generated from actual database structure on 2025-06-11

-- Drop all existing tables in correct dependency order
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS asset_relationships CASCADE;
DROP TABLE IF EXISTS response_cost_modules CASCADE;
DROP TABLE IF EXISTS risk_costs CASCADE;
DROP TABLE IF EXISTS risk_controls CASCADE;
DROP TABLE IF EXISTS risk_summaries CASCADE;
DROP TABLE IF EXISTS risk_responses CASCADE;
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
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS asset_type CASCADE;
DROP TYPE IF EXISTS auth_type CASCADE;
DROP TYPE IF EXISTS cia_rating CASCADE;
DROP TYPE IF EXISTS control_category CASCADE;
DROP TYPE IF EXISTS control_type CASCADE;
DROP TYPE IF EXISTS currency CASCADE;
DROP TYPE IF EXISTS external_internal CASCADE;
DROP TYPE IF EXISTS hierarchy_level CASCADE;
DROP TYPE IF EXISTS implementation_status CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS relationship_type CASCADE;
DROP TYPE IF EXISTS risk_category CASCADE;
DROP TYPE IF EXISTS risk_response_type CASCADE;
DROP TYPE IF EXISTS severity CASCADE;

-- Create all enum types
CREATE TYPE asset_status AS ENUM ('Active', 'Decommissioned', 'To Adopt');
CREATE TYPE asset_type AS ENUM ('data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'strategic_capability', 'value_capability', 'business_service', 'product_service', 'application_service', 'technical_component');
CREATE TYPE auth_type AS ENUM ('local', 'oidc', 'hybrid');
CREATE TYPE cia_rating AS ENUM ('low', 'medium', 'high');
CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
CREATE TYPE currency AS ENUM ('USD', 'EUR');
CREATE TYPE external_internal AS ENUM ('external', 'internal');
CREATE TYPE hierarchy_level AS ENUM ('strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component');
CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');
CREATE TYPE item_type AS ENUM ('template', 'instance');
CREATE TYPE relationship_type AS ENUM ('part_of', 'depends_on', 'contains');
CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
CREATE TYPE risk_response_type AS ENUM ('accept', 'avoid', 'transfer', 'mitigate');
CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Create all tables with exact column definitions

-- Activity Logs Table
CREATE TABLE activity_logs (
    id INTEGER DEFAULT nextval('activity_logs_id_seq'::regclass) PRIMARY KEY,
    activity TEXT NOT NULL,
    "user" TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Asset Relationships Table
CREATE TABLE asset_relationships (
    id INTEGER DEFAULT nextval('asset_relationships_id_seq'::regclass) PRIMARY KEY,
    source_asset_id INTEGER NOT NULL,
    target_asset_id INTEGER NOT NULL,
    relationship_type relationship_type NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Assets Table
CREATE TABLE assets (
    id INTEGER DEFAULT nextval('assets_id_seq'::regclass) PRIMARY KEY,
    asset_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type asset_type NOT NULL,
    business_unit TEXT NOT NULL,
    owner TEXT NOT NULL,
    confidentiality cia_rating NOT NULL,
    integrity cia_rating NOT NULL,
    availability cia_rating NOT NULL,
    asset_value NUMERIC NOT NULL,
    regulatory_impact TEXT[] DEFAULT '{none}'::text[],
    external_internal external_internal NOT NULL,
    dependencies TEXT[] DEFAULT '{}'::text[],
    description TEXT DEFAULT ''::text,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    currency currency DEFAULT 'USD'::currency,
    agent_count INTEGER DEFAULT 1,
    legal_entity TEXT DEFAULT 'Unknown'::text,
    status asset_status DEFAULT 'Active'::asset_status,
    parent_id INTEGER,
    hierarchy_level hierarchy_level DEFAULT 'technical_component'::hierarchy_level,
    architecture_domain TEXT
);

-- Auth Config Table
CREATE TABLE auth_config (
    id INTEGER DEFAULT nextval('auth_config_id_seq'::regclass) PRIMARY KEY,
    auth_type auth_type DEFAULT 'local'::auth_type,
    oidc_enabled BOOLEAN DEFAULT false,
    oidc_issuer TEXT,
    oidc_client_id TEXT,
    oidc_client_secret TEXT,
    oidc_callback_url TEXT,
    oidc_scopes JSON DEFAULT '["openid", "profile", "email"]'::json,
    session_timeout INTEGER DEFAULT 3600,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 300,
    password_min_length INTEGER DEFAULT 8,
    require_password_change BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Control Library Table
CREATE TABLE control_library (
    id INTEGER DEFAULT nextval('control_library_id_seq'::regclass) PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status DEFAULT 'planned'::implementation_status,
    control_effectiveness REAL DEFAULT 0,
    implementation_cost NUMERIC DEFAULT 0,
    cost_per_agent NUMERIC DEFAULT 0,
    is_per_agent_pricing BOOLEAN DEFAULT false,
    notes TEXT DEFAULT ''::text,
    nist_csf TEXT[] DEFAULT '{}'::text[],
    iso27001 TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    associated_risks TEXT[],
    library_item_id INTEGER,
    item_type TEXT,
    asset_id TEXT,
    risk_id INTEGER,
    legal_entity_id TEXT,
    deployed_agent_count INTEGER
);

-- Controls Table
CREATE TABLE controls (
    id INTEGER DEFAULT nextval('controls_id_seq'::regclass) PRIMARY KEY,
    control_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    associated_risks TEXT[] DEFAULT '{}'::text[],
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL,
    control_effectiveness NUMERIC NOT NULL,
    implementation_cost NUMERIC DEFAULT 0,
    notes TEXT DEFAULT ''::text,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    cost_per_agent NUMERIC DEFAULT 0,
    is_per_agent_pricing BOOLEAN DEFAULT false,
    library_item_id INTEGER,
    item_type item_type DEFAULT 'instance'::item_type,
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

-- Cost Modules Table
CREATE TABLE cost_modules (
    id INTEGER DEFAULT nextval('cost_modules_id_seq'::regclass) PRIMARY KEY,
    name TEXT NOT NULL,
    cis_control TEXT[] NOT NULL,
    cost_factor NUMERIC NOT NULL,
    cost_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Enterprise Architecture Table
CREATE TABLE enterprise_architecture (
    id INTEGER DEFAULT nextval('enterprise_architecture_id_seq'::regclass) PRIMARY KEY,
    asset_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    level TEXT NOT NULL,
    type TEXT NOT NULL,
    architecture_domain TEXT,
    parent_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Legal Entities Table
CREATE TABLE legal_entities (
    id INTEGER DEFAULT nextval('legal_entities_id_seq'::regclass) PRIMARY KEY,
    entity_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    parent_entity_id TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Response Cost Modules Table
CREATE TABLE response_cost_modules (
    id INTEGER DEFAULT nextval('response_cost_modules_id_seq'::regclass) PRIMARY KEY,
    response_id INTEGER NOT NULL,
    cost_module_id INTEGER NOT NULL,
    multiplier NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Risk Controls Table
CREATE TABLE risk_controls (
    id INTEGER DEFAULT nextval('risk_controls_id_seq'::regclass) PRIMARY KEY,
    risk_id INTEGER NOT NULL,
    control_id INTEGER NOT NULL,
    effectiveness REAL DEFAULT 0,
    notes TEXT DEFAULT ''::text,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Risk Costs Table
CREATE TABLE risk_costs (
    id INTEGER DEFAULT nextval('risk_costs_id_seq'::regclass) PRIMARY KEY,
    risk_id INTEGER NOT NULL,
    cost_module_id INTEGER NOT NULL,
    weight NUMERIC DEFAULT 1.0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Risk Library Table
CREATE TABLE risk_library (
    id INTEGER DEFAULT nextval('risk_library_id_seq'::regclass) PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    threat_community TEXT DEFAULT ''::text,
    vulnerability TEXT DEFAULT ''::text,
    risk_category risk_category NOT NULL,
    severity severity DEFAULT 'medium'::severity,
    contact_frequency_min REAL DEFAULT 0,
    contact_frequency_avg REAL DEFAULT 0,
    contact_frequency_max REAL DEFAULT 0,
    contact_frequency_confidence TEXT DEFAULT 'Medium'::text,
    probability_of_action_min REAL DEFAULT 0,
    probability_of_action_avg REAL DEFAULT 0,
    probability_of_action_max REAL DEFAULT 0,
    probability_of_action_confidence TEXT DEFAULT 'Medium'::text,
    threat_capability_min REAL DEFAULT 0,
    threat_capability_avg REAL DEFAULT 0,
    threat_capability_max REAL DEFAULT 0,
    threat_capability_confidence TEXT DEFAULT 'Medium'::text,
    resistance_strength_min REAL DEFAULT 0,
    resistance_strength_avg REAL DEFAULT 0,
    resistance_strength_max REAL DEFAULT 0,
    resistance_strength_confidence TEXT DEFAULT 'Medium'::text,
    primary_loss_magnitude_min REAL DEFAULT 0,
    primary_loss_magnitude_avg REAL DEFAULT 0,
    primary_loss_magnitude_max REAL DEFAULT 0,
    primary_loss_magnitude_confidence TEXT DEFAULT 'Medium'::text,
    secondary_loss_event_frequency_min REAL DEFAULT 0,
    secondary_loss_event_frequency_avg REAL DEFAULT 0,
    secondary_loss_event_frequency_max REAL DEFAULT 0,
    secondary_loss_event_frequency_confidence TEXT DEFAULT 'Medium'::text,
    secondary_loss_magnitude_min REAL DEFAULT 0,
    secondary_loss_magnitude_avg REAL DEFAULT 0,
    secondary_loss_magnitude_max REAL DEFAULT 0,
    secondary_loss_magnitude_confidence TEXT DEFAULT 'Medium'::text,
    recommended_controls TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Risk Responses Table
CREATE TABLE risk_responses (
    id INTEGER DEFAULT nextval('risk_responses_id_seq'::regclass) PRIMARY KEY,
    risk_id TEXT NOT NULL,
    response_type risk_response_type NOT NULL,
    justification TEXT DEFAULT ''::text,
    assigned_controls TEXT[] DEFAULT '{}'::text[],
    transfer_method TEXT DEFAULT ''::text,
    avoidance_strategy TEXT DEFAULT ''::text,
    acceptance_reason TEXT DEFAULT ''::text,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    cost_module_ids INTEGER[] DEFAULT '{}'::integer[]
);

-- Risk Summaries Table
CREATE TABLE risk_summaries (
    id INTEGER DEFAULT nextval('risk_summaries_id_seq'::regclass) PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    legal_entity_id TEXT,
    tenth_percentile_exposure DOUBLE PRECISION DEFAULT 0,
    most_likely_exposure DOUBLE PRECISION DEFAULT 0,
    ninetieth_percentile_exposure DOUBLE PRECISION DEFAULT 0,
    minimum_exposure DOUBLE PRECISION DEFAULT 0,
    maximum_exposure DOUBLE PRECISION DEFAULT 0,
    average_exposure DOUBLE PRECISION DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
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
    exposure_curve_data JSONB DEFAULT '[]'::jsonb
);

-- Risks Table
CREATE TABLE risks (
    id INTEGER DEFAULT nextval('risks_id_seq'::regclass) PRIMARY KEY,
    risk_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT ''::text,
    associated_assets TEXT[] NOT NULL,
    threat_community TEXT NOT NULL,
    vulnerability TEXT NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    contact_frequency REAL DEFAULT 0,
    probability_of_action REAL DEFAULT 0,
    threat_event_frequency REAL DEFAULT 0,
    threat_capability REAL DEFAULT 0,
    resistance_strength REAL DEFAULT 0,
    susceptibility NUMERIC DEFAULT 0,
    loss_event_frequency REAL DEFAULT 0,
    primary_loss_magnitude REAL DEFAULT 0,
    secondary_loss_event_frequency REAL DEFAULT 0,
    secondary_loss_magnitude REAL DEFAULT 0,
    probable_loss_magnitude REAL DEFAULT 0,
    inherent_risk NUMERIC DEFAULT 0,
    residual_risk NUMERIC DEFAULT 0,
    rank_percentile REAL DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    contact_frequency_min REAL DEFAULT 0,
    contact_frequency_avg REAL DEFAULT 0,
    contact_frequency_max REAL DEFAULT 0,
    contact_frequency_confidence TEXT DEFAULT 'Medium'::text,
    probability_of_action_min REAL DEFAULT 0,
    probability_of_action_avg REAL DEFAULT 0,
    probability_of_action_max REAL DEFAULT 0,
    probability_of_action_confidence TEXT DEFAULT 'Medium'::text,
    threat_event_frequency_min REAL DEFAULT 0,
    threat_event_frequency_avg REAL DEFAULT 0,
    threat_event_frequency_max REAL DEFAULT 0,
    threat_event_frequency_confidence TEXT DEFAULT 'Medium'::text,
    threat_capability_min REAL DEFAULT 0,
    threat_capability_avg REAL DEFAULT 0,
    threat_capability_max REAL DEFAULT 0,
    threat_capability_confidence TEXT DEFAULT 'Medium'::text,
    resistance_strength_min REAL DEFAULT 0,
    resistance_strength_avg REAL DEFAULT 0,
    resistance_strength_max REAL DEFAULT 0,
    resistance_strength_confidence TEXT DEFAULT 'Medium'::text,
    susceptibility_min REAL DEFAULT 0,
    susceptibility_avg REAL DEFAULT 0,
    susceptibility_max REAL DEFAULT 0,
    susceptibility_confidence TEXT DEFAULT 'Medium'::text,
    loss_event_frequency_min REAL DEFAULT 0,
    loss_event_frequency_avg REAL DEFAULT 0,
    loss_event_frequency_max REAL DEFAULT 0,
    loss_event_frequency_confidence TEXT DEFAULT 'Medium'::text,
    primary_loss_magnitude_min NUMERIC DEFAULT 0,
    primary_loss_magnitude_avg NUMERIC DEFAULT 0,
    primary_loss_magnitude_max NUMERIC DEFAULT 0,
    primary_loss_magnitude_confidence TEXT DEFAULT 'Medium'::text,
    secondary_loss_event_frequency_min REAL DEFAULT 0,
    secondary_loss_event_frequency_avg REAL DEFAULT 0,
    secondary_loss_event_frequency_max REAL DEFAULT 0,
    secondary_loss_event_frequency_confidence TEXT DEFAULT 'Medium'::text,
    secondary_loss_magnitude_min NUMERIC DEFAULT 0,
    secondary_loss_magnitude_avg NUMERIC DEFAULT 0,
    secondary_loss_magnitude_max NUMERIC DEFAULT 0,
    secondary_loss_magnitude_confidence TEXT DEFAULT 'Medium'::text,
    loss_magnitude_min NUMERIC DEFAULT 0,
    loss_magnitude_avg NUMERIC DEFAULT 0,
    loss_magnitude_max NUMERIC DEFAULT 0,
    loss_magnitude_confidence TEXT DEFAULT 'Medium'::text,
    notes TEXT DEFAULT ''::text,
    library_item_id INTEGER,
    item_type item_type DEFAULT 'instance'::item_type,
    vulnerability_ids TEXT[],
    cis_controls TEXT[] DEFAULT '{}'::text[],
    applicable_cost_modules INTEGER[] DEFAULT '{}'::integer[]
);

-- Sessions Table
CREATE TABLE sessions (
    sid CHARACTER VARYING NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Users Table
CREATE TABLE users (
    id INTEGER DEFAULT nextval('users_id_seq'::regclass) PRIMARY KEY,
    username CHARACTER VARYING,
    email CHARACTER VARYING,
    display_name CHARACTER VARYING NOT NULL,
    password_hash CHARACTER VARYING,
    role CHARACTER VARYING DEFAULT 'user'::character varying,
    auth_type CHARACTER VARYING DEFAULT 'local'::character varying,
    is_active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITHOUT TIME ZONE,
    last_login TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    password_salt CHARACTER VARYING,
    password_iterations INTEGER DEFAULT 100,
    account_locked_until TIMESTAMP WITHOUT TIME ZONE,
    sso_subject CHARACTER VARYING,
    sso_provider CHARACTER VARYING,
    first_name CHARACTER VARYING,
    last_name CHARACTER VARYING,
    profile_image_url CHARACTER VARYING,
    created_by INTEGER,
    updated_by INTEGER,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITHOUT TIME ZONE,
    timezone CHARACTER VARYING DEFAULT 'UTC',
    language CHARACTER VARYING DEFAULT 'en',
    phone CHARACTER VARYING,
    department CHARACTER VARYING,
    job_title CHARACTER VARYING,
    manager_id INTEGER,
    login_count INTEGER DEFAULT 0,
    last_failed_login TIMESTAMP WITHOUT TIME ZONE
);

-- Vulnerabilities Table
CREATE TABLE vulnerabilities (
    id INTEGER DEFAULT nextval('vulnerabilities_id_seq'::regclass) PRIMARY KEY,
    cve_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    discovery_date TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    severity_cvss3 NUMERIC DEFAULT 0,
    patchable BOOLEAN DEFAULT TRUE,
    source TEXT DEFAULT 'manual'::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
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

-- Create sequences for serial columns
CREATE SEQUENCE IF NOT EXISTS activity_logs_id_seq OWNED BY activity_logs.id;
CREATE SEQUENCE IF NOT EXISTS asset_relationships_id_seq OWNED BY asset_relationships.id;
CREATE SEQUENCE IF NOT EXISTS assets_id_seq OWNED BY assets.id;
CREATE SEQUENCE IF NOT EXISTS auth_config_id_seq OWNED BY auth_config.id;
CREATE SEQUENCE IF NOT EXISTS control_library_id_seq OWNED BY control_library.id;
CREATE SEQUENCE IF NOT EXISTS controls_id_seq OWNED BY controls.id;
CREATE SEQUENCE IF NOT EXISTS cost_modules_id_seq OWNED BY cost_modules.id;
CREATE SEQUENCE IF NOT EXISTS enterprise_architecture_id_seq OWNED BY enterprise_architecture.id;
CREATE SEQUENCE IF NOT EXISTS legal_entities_id_seq OWNED BY legal_entities.id;
CREATE SEQUENCE IF NOT EXISTS response_cost_modules_id_seq OWNED BY response_cost_modules.id;
CREATE SEQUENCE IF NOT EXISTS risk_controls_id_seq OWNED BY risk_controls.id;
CREATE SEQUENCE IF NOT EXISTS risk_costs_id_seq OWNED BY risk_costs.id;
CREATE SEQUENCE IF NOT EXISTS risk_library_id_seq OWNED BY risk_library.id;
CREATE SEQUENCE IF NOT EXISTS risk_responses_id_seq OWNED BY risk_responses.id;
CREATE SEQUENCE IF NOT EXISTS risk_summaries_id_seq OWNED BY risk_summaries.id;
CREATE SEQUENCE IF NOT EXISTS risks_id_seq OWNED BY risks.id;
CREATE SEQUENCE IF NOT EXISTS users_id_seq OWNED BY users.id;
CREATE SEQUENCE IF NOT EXISTS vulnerabilities_id_seq OWNED BY vulnerabilities.id;

-- Add foreign key constraints
ALTER TABLE asset_relationships ADD CONSTRAINT asset_relationships_target_asset_id_fkey FOREIGN KEY (target_asset_id) REFERENCES assets(id);
ALTER TABLE asset_relationships ADD CONSTRAINT asset_relationships_source_asset_id_fkey FOREIGN KEY (source_asset_id) REFERENCES assets(id);
ALTER TABLE assets ADD CONSTRAINT assets_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES assets(id);
ALTER TABLE controls ADD CONSTRAINT controls_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES control_library(id);
ALTER TABLE enterprise_architecture ADD CONSTRAINT enterprise_architecture_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES enterprise_architecture(id);
ALTER TABLE response_cost_modules ADD CONSTRAINT response_cost_modules_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id);
ALTER TABLE response_cost_modules ADD CONSTRAINT response_cost_modules_response_id_fkey FOREIGN KEY (response_id) REFERENCES risk_responses(id);
ALTER TABLE risk_controls ADD CONSTRAINT risk_controls_control_id_fkey FOREIGN KEY (control_id) REFERENCES controls(id);
ALTER TABLE risk_controls ADD CONSTRAINT risk_controls_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES risks(id);
ALTER TABLE risk_costs ADD CONSTRAINT risk_costs_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES risks(id);
ALTER TABLE risk_costs ADD CONSTRAINT risk_costs_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id);
ALTER TABLE risk_responses ADD CONSTRAINT risk_responses_risk_id_risks_risk_id_fk FOREIGN KEY (risk_id) REFERENCES risks(risk_id);
ALTER TABLE risks ADD CONSTRAINT risks_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES risk_library(id);

-- Create indexes for performance
CREATE INDEX idx_assets_legal_entity ON assets(legal_entity);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_risks_severity ON risks(severity);
CREATE INDEX idx_risks_category ON risks(risk_category);
CREATE INDEX idx_controls_implementation_status ON controls(implementation_status);
CREATE INDEX idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX idx_sessions_expire ON sessions(expire);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_risk_summaries_entity_date ON risk_summaries(legal_entity_id, year, month);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_sso_subject ON users(sso_subject);

-- Complete database schema recreation finished successfully