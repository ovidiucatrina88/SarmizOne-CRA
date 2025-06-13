-- =====================================================
-- PRODUCTION DATABASE MIGRATION SCRIPT
-- =====================================================
-- This script will:
-- 1. Drop all existing tables and sequences
-- 2. Recreate the complete schema with all custom types
-- 3. Import essential reference data
-- 
-- Run this script on your production database to rebuild from scratch
-- =====================================================

-- Start transaction
BEGIN;

-- Drop all existing tables (in dependency order)
DROP TABLE IF EXISTS response_cost_modules CASCADE;
DROP TABLE IF EXISTS risk_costs CASCADE;
DROP TABLE IF EXISTS risk_controls CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS asset_relationships CASCADE;
DROP TABLE IF EXISTS risk_responses CASCADE;
DROP TABLE IF EXISTS risk_summaries CASCADE;
DROP TABLE IF EXISTS risks CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS controls CASCADE;
DROP TABLE IF EXISTS enterprise_architecture CASCADE;
DROP TABLE IF EXISTS legal_entities CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS vulnerabilities CASCADE;

-- Drop reference data tables
DROP TABLE IF EXISTS risk_library CASCADE;
DROP TABLE IF EXISTS control_library CASCADE;
DROP TABLE IF EXISTS cost_modules CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS auth_config CASCADE;
DROP TABLE IF EXISTS industry_insights CASCADE;

-- Drop all sequences
DROP SEQUENCE IF EXISTS activity_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS asset_relationships_id_seq CASCADE;
DROP SEQUENCE IF EXISTS assets_id_seq CASCADE;
DROP SEQUENCE IF EXISTS auth_config_id_seq CASCADE;
DROP SEQUENCE IF EXISTS control_library_id_seq CASCADE;
DROP SEQUENCE IF EXISTS controls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS cost_modules_id_seq CASCADE;
DROP SEQUENCE IF EXISTS enterprise_architecture_id_seq CASCADE;
DROP SEQUENCE IF EXISTS industry_insights_id_seq CASCADE;
DROP SEQUENCE IF EXISTS legal_entities_id_seq CASCADE;
DROP SEQUENCE IF EXISTS response_cost_modules_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risk_controls_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risk_costs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risk_library_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risk_responses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risk_summaries_id_seq CASCADE;
DROP SEQUENCE IF EXISTS risks_id_seq CASCADE;
DROP SEQUENCE IF EXISTS vulnerabilities_id_seq CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS relationship_type CASCADE;
DROP TYPE IF EXISTS asset_type CASCADE;
DROP TYPE IF EXISTS cia_rating CASCADE;
DROP TYPE IF EXISTS currency CASCADE;
DROP TYPE IF EXISTS asset_status CASCADE;
DROP TYPE IF EXISTS hierarchy_level CASCADE;
DROP TYPE IF EXISTS auth_type CASCADE;
DROP TYPE IF EXISTS control_type CASCADE;
DROP TYPE IF EXISTS control_category CASCADE;
DROP TYPE IF EXISTS implementation_status CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS compliance_framework CASCADE;
DROP TYPE IF EXISTS risk_category CASCADE;
DROP TYPE IF EXISTS severity CASCADE;
DROP TYPE IF EXISTS response_type CASCADE;

-- Create all custom types
CREATE TYPE relationship_type AS ENUM ('depends_on', 'contains', 'processes', 'connected_to');
CREATE TYPE asset_type AS ENUM ('data', 'application', 'system', 'device', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component');
CREATE TYPE cia_rating AS ENUM ('low', 'medium', 'high');
CREATE TYPE currency AS ENUM ('USD', 'EUR');
CREATE TYPE asset_status AS ENUM ('Active', 'Decommissioned', 'To Adopt');
CREATE TYPE hierarchy_level AS ENUM ('business_layer', 'application_layer', 'technology_layer', 'application_service', 'technical_component');
CREATE TYPE auth_type AS ENUM ('local', 'oidc', 'hybrid');
CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');
CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');
CREATE TYPE item_type AS ENUM ('template', 'instance');
CREATE TYPE compliance_framework AS ENUM ('CIS', 'NIST', 'ISO27001', 'PCI', 'SOC2', 'HIPAA', 'GDPR', 'CCM', 'COBIT', 'Custom');
CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE response_type AS ENUM ('accept', 'mitigate', 'transfer', 'avoid');

-- =====================================================
-- CREATE SEQUENCES
-- =====================================================
CREATE SEQUENCE activity_logs_id_seq;
CREATE SEQUENCE asset_relationships_id_seq;
CREATE SEQUENCE assets_id_seq;
CREATE SEQUENCE auth_config_id_seq;
CREATE SEQUENCE control_library_id_seq;
CREATE SEQUENCE controls_id_seq;
CREATE SEQUENCE cost_modules_id_seq;
CREATE SEQUENCE enterprise_architecture_id_seq;
CREATE SEQUENCE industry_insights_id_seq;
CREATE SEQUENCE legal_entities_id_seq;
CREATE SEQUENCE response_cost_modules_id_seq;
CREATE SEQUENCE risk_controls_id_seq;
CREATE SEQUENCE risk_costs_id_seq;
CREATE SEQUENCE risk_library_id_seq;
CREATE SEQUENCE risk_responses_id_seq;
CREATE SEQUENCE risk_summaries_id_seq;
CREATE SEQUENCE risks_id_seq;
CREATE SEQUENCE vulnerabilities_id_seq;

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Reference Data Tables (to be populated with dumps)
CREATE TABLE risk_library (
    id integer DEFAULT nextval('risk_library_id_seq') PRIMARY KEY,
    risk_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '' NOT NULL,
    threat_community text DEFAULT '' NOT NULL,
    vulnerability text DEFAULT '' NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity DEFAULT 'medium' NOT NULL,
    contact_frequency_min real DEFAULT 0 NOT NULL,
    contact_frequency_avg real DEFAULT 0 NOT NULL,
    contact_frequency_max real DEFAULT 0 NOT NULL,
    contact_frequency_confidence text DEFAULT 'Medium' NOT NULL,
    probability_of_action_min real DEFAULT 0 NOT NULL,
    probability_of_action_avg real DEFAULT 0 NOT NULL,
    probability_of_action_max real DEFAULT 0 NOT NULL,
    probability_of_action_confidence text DEFAULT 'Medium' NOT NULL,
    threat_capability_min real DEFAULT 0 NOT NULL,
    threat_capability_avg real DEFAULT 0 NOT NULL,
    threat_capability_max real DEFAULT 0 NOT NULL,
    threat_capability_confidence text DEFAULT 'Medium' NOT NULL,
    resistance_strength_min real DEFAULT 0 NOT NULL,
    resistance_strength_avg real DEFAULT 0 NOT NULL,
    resistance_strength_max real DEFAULT 0 NOT NULL,
    resistance_strength_confidence text DEFAULT 'Medium' NOT NULL,
    primary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_confidence text DEFAULT 'Medium' NOT NULL,
    secondary_loss_event_frequency_min real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_max real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_confidence text DEFAULT 'Medium' NOT NULL,
    secondary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_confidence text DEFAULT 'Medium' NOT NULL,
    recommended_controls text[] DEFAULT '{}' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE control_library (
    id integer DEFAULT nextval('control_library_id_seq') PRIMARY KEY,
    control_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '' NOT NULL,
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status DEFAULT 'planned' NOT NULL,
    control_effectiveness real DEFAULT 0 NOT NULL,
    implementation_cost numeric DEFAULT 0 NOT NULL,
    cost_per_agent numeric DEFAULT 0 NOT NULL,
    is_per_agent_pricing boolean DEFAULT false NOT NULL,
    notes text DEFAULT '' NOT NULL,
    nist_csf text[] DEFAULT '{}' NOT NULL,
    iso27001 text[] DEFAULT '{}' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    associated_risks text[],
    library_item_id integer,
    item_type text,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer,
    compliance_framework compliance_framework DEFAULT 'Custom',
    cloud_domain text,
    nist_mappings text[] DEFAULT '{}',
    pci_mappings text[] DEFAULT '{}',
    cis_mappings text[] DEFAULT '{}',
    gap_level text,
    implementation_guidance text,
    architectural_relevance json,
    organizational_relevance json,
    ownership_model text,
    cloud_service_model text[] DEFAULT '{}'
);

CREATE TABLE cost_modules (
    id integer DEFAULT nextval('cost_modules_id_seq') PRIMARY KEY,
    name text NOT NULL,
    cis_control text[] NOT NULL,
    cost_factor numeric NOT NULL,
    cost_type text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE users (
    id integer PRIMARY KEY,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'user' NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE auth_config (
    id integer DEFAULT nextval('auth_config_id_seq') PRIMARY KEY,
    auth_type auth_type DEFAULT 'local' NOT NULL,
    oidc_enabled boolean DEFAULT false,
    oidc_issuer text,
    oidc_client_id text,
    oidc_client_secret text,
    oidc_callback_url text,
    oidc_scopes json DEFAULT '["openid", "profile", "email"]',
    session_timeout integer DEFAULT 3600,
    max_login_attempts integer DEFAULT 5,
    lockout_duration integer DEFAULT 300,
    password_min_length integer DEFAULT 8,
    require_password_change boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE industry_insights (
    id integer DEFAULT nextval('industry_insights_id_seq') PRIMARY KEY,
    sector character varying NOT NULL,
    metric character varying NOT NULL,
    value_numeric numeric,
    value_text text,
    unit character varying,
    source character varying NOT NULL,
    effective_from date NOT NULL,
    effective_to date DEFAULT '9999-12-31',
    version integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Operational Tables (will be empty after migration)
CREATE TABLE legal_entities (
    id integer DEFAULT nextval('legal_entities_id_seq') PRIMARY KEY,
    entity_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '' NOT NULL,
    parent_entity_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE assets (
    id integer DEFAULT nextval('assets_id_seq') PRIMARY KEY,
    asset_id text NOT NULL,
    name text NOT NULL,
    type asset_type NOT NULL,
    business_unit text NOT NULL,
    owner text NOT NULL,
    confidentiality cia_rating NOT NULL,
    integrity cia_rating NOT NULL,
    availability cia_rating NOT NULL,
    asset_value text NOT NULL,
    regulatory_impact text[] DEFAULT '{none}' NOT NULL,
    external_internal cia_rating NOT NULL,
    dependencies text[] DEFAULT '{}' NOT NULL,
    description text DEFAULT '' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    currency currency DEFAULT 'USD' NOT NULL,
    agent_count integer DEFAULT 1 NOT NULL,
    legal_entity text DEFAULT 'Unknown' NOT NULL,
    status asset_status DEFAULT 'Active' NOT NULL,
    parent_id integer,
    hierarchy_level hierarchy_level DEFAULT 'technical_component' NOT NULL,
    architecture_domain text
);

CREATE TABLE enterprise_architecture (
    id integer DEFAULT nextval('enterprise_architecture_id_seq') PRIMARY KEY,
    asset_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '',
    level text NOT NULL,
    type text NOT NULL,
    architecture_domain text,
    parent_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE vulnerabilities (
    id integer DEFAULT nextval('vulnerabilities_id_seq') PRIMARY KEY,
    cve_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    severity severity NOT NULL,
    cvss_score real,
    affected_assets text[] DEFAULT '{}' NOT NULL,
    patch_available boolean DEFAULT false NOT NULL,
    patch_url text DEFAULT '' NOT NULL,
    discovered_date date,
    patched_date date,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE sessions (
    sid text PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp with time zone NOT NULL
);

CREATE TABLE risks (
    id integer DEFAULT nextval('risks_id_seq') PRIMARY KEY,
    risk_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '' NOT NULL,
    associated_assets text[] NOT NULL,
    threat_community text NOT NULL,
    vulnerability text NOT NULL,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    contact_frequency real DEFAULT 0 NOT NULL,
    probability_of_action real DEFAULT 0 NOT NULL,
    threat_event_frequency real DEFAULT 0 NOT NULL,
    threat_capability real DEFAULT 0 NOT NULL,
    resistance_strength real DEFAULT 0 NOT NULL,
    susceptibility numeric DEFAULT 0 NOT NULL,
    loss_event_frequency real DEFAULT 0 NOT NULL,
    primary_loss_magnitude real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude real DEFAULT 0 NOT NULL,
    probable_loss_magnitude real DEFAULT 0 NOT NULL,
    inherent_risk numeric DEFAULT 0 NOT NULL,
    residual_risk numeric DEFAULT 0 NOT NULL,
    rank_percentile real DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    -- Additional FAIR parameters
    contact_frequency_min real DEFAULT 0 NOT NULL,
    contact_frequency_avg real DEFAULT 0 NOT NULL,
    contact_frequency_max real DEFAULT 0 NOT NULL,
    contact_frequency_confidence text DEFAULT 'Medium' NOT NULL,
    probability_of_action_min real DEFAULT 0 NOT NULL,
    probability_of_action_avg real DEFAULT 0 NOT NULL,
    probability_of_action_max real DEFAULT 0 NOT NULL,
    probability_of_action_confidence text DEFAULT 'Medium' NOT NULL,
    threat_event_frequency_min real DEFAULT 0 NOT NULL,
    threat_event_frequency_avg real DEFAULT 0 NOT NULL,
    threat_event_frequency_max real DEFAULT 0 NOT NULL,
    threat_event_frequency_confidence text DEFAULT 'Medium' NOT NULL,
    threat_capability_min real DEFAULT 0 NOT NULL,
    threat_capability_avg real DEFAULT 0 NOT NULL,
    threat_capability_max real DEFAULT 0 NOT NULL,
    threat_capability_confidence text DEFAULT 'Medium' NOT NULL,
    resistance_strength_min real DEFAULT 0 NOT NULL,
    resistance_strength_avg real DEFAULT 0 NOT NULL,
    resistance_strength_max real DEFAULT 0 NOT NULL,
    resistance_strength_confidence text DEFAULT 'Medium' NOT NULL,
    susceptibility_min real DEFAULT 0 NOT NULL,
    susceptibility_avg real DEFAULT 0 NOT NULL,
    susceptibility_max real DEFAULT 0 NOT NULL,
    susceptibility_confidence text DEFAULT 'Medium' NOT NULL,
    loss_event_frequency_min real DEFAULT 0 NOT NULL,
    loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    loss_event_frequency_max real DEFAULT 0 NOT NULL,
    loss_event_frequency_confidence text DEFAULT 'Medium' NOT NULL,
    primary_loss_magnitude_min numeric DEFAULT 0 NOT NULL,
    primary_loss_magnitude_avg numeric DEFAULT 0 NOT NULL,
    primary_loss_magnitude_max numeric DEFAULT 0 NOT NULL,
    primary_loss_magnitude_confidence text DEFAULT 'Medium' NOT NULL,
    secondary_loss_magnitude_min numeric DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_avg numeric DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_max numeric DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_confidence text DEFAULT 'Medium' NOT NULL,
    library_item_id integer,
    item_type item_type DEFAULT 'instance',
    legal_entity_id text,
    inherent_p10 text,
    inherent_p50 text,
    inherent_p90 text,
    residual_p10 text,
    residual_p50 text,
    residual_p90 text,
    inherent_p05 text,
    inherent_p25 text,
    inherent_p75 text,
    inherent_p95 text,
    inherent_p99 text,
    residual_p05 text,
    residual_p25 text,
    residual_p75 text,
    residual_p95 text,
    residual_p99 text
);

CREATE TABLE controls (
    id integer DEFAULT nextval('controls_id_seq') PRIMARY KEY,
    control_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT '' NOT NULL,
    associated_risks text[] DEFAULT '{}' NOT NULL,
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL,
    control_effectiveness numeric NOT NULL,
    implementation_cost numeric DEFAULT 0 NOT NULL,
    notes text DEFAULT '' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    cost_per_agent numeric DEFAULT 0 NOT NULL,
    is_per_agent_pricing boolean DEFAULT false NOT NULL,
    library_item_id integer,
    item_type item_type DEFAULT 'instance',
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer DEFAULT 0,
    compliance_framework compliance_framework DEFAULT 'CIS'
);

CREATE TABLE asset_relationships (
    id integer DEFAULT nextval('asset_relationships_id_seq') PRIMARY KEY,
    source_asset_id integer NOT NULL,
    target_asset_id integer NOT NULL,
    relationship_type relationship_type NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE risk_controls (
    id integer DEFAULT nextval('risk_controls_id_seq') PRIMARY KEY,
    risk_id integer NOT NULL,
    control_id integer NOT NULL,
    effectiveness real DEFAULT 0 NOT NULL,
    notes text DEFAULT '' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE risk_responses (
    id integer DEFAULT nextval('risk_responses_id_seq') PRIMARY KEY,
    risk_id text NOT NULL,
    response_type response_type NOT NULL,
    justification text DEFAULT '' NOT NULL,
    assigned_controls text[] DEFAULT '{}' NOT NULL,
    transfer_method text DEFAULT '' NOT NULL,
    avoidance_strategy text DEFAULT '' NOT NULL,
    acceptance_reason text DEFAULT '' NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    cost_module_ids integer[] DEFAULT '{}'
);

CREATE TABLE risk_costs (
    id integer DEFAULT nextval('risk_costs_id_seq') PRIMARY KEY,
    risk_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    weight numeric DEFAULT 1.0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE response_cost_modules (
    id integer DEFAULT nextval('response_cost_modules_id_seq') PRIMARY KEY,
    response_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    multiplier numeric DEFAULT 1.0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE risk_summaries (
    id integer DEFAULT nextval('risk_summaries_id_seq') PRIMARY KEY,
    year integer NOT NULL,
    month integer NOT NULL,
    legal_entity_id text,
    tenth_percentile_exposure double precision DEFAULT 0 NOT NULL,
    most_likely_exposure double precision DEFAULT 0 NOT NULL,
    ninetieth_percentile_exposure double precision DEFAULT 0 NOT NULL,
    minimum_exposure double precision DEFAULT 0 NOT NULL,
    maximum_exposure double precision DEFAULT 0 NOT NULL,
    average_exposure double precision DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    total_risks integer DEFAULT 0,
    critical_risks integer DEFAULT 0,
    high_risks integer DEFAULT 0,
    medium_risks integer DEFAULT 0,
    low_risks integer DEFAULT 0,
    total_inherent_risk real DEFAULT 0,
    total_residual_risk real DEFAULT 0,
    mean_exposure real DEFAULT 0,
    median_exposure real DEFAULT 0,
    percentile_95_exposure real DEFAULT 0,
    percentile_99_exposure real DEFAULT 0,
    exposure_curve_data jsonb DEFAULT '[]',
    percentile_10_exposure real DEFAULT 0,
    percentile_25_exposure real DEFAULT 0,
    percentile_50_exposure real DEFAULT 0,
    percentile_75_exposure real DEFAULT 0,
    percentile_90_exposure real DEFAULT 0,
    twenty_fifth_percentile_exposure numeric,
    fiftieth_percentile_exposure numeric,
    seventy_fifth_percentile_exposure numeric
);

CREATE TABLE activity_logs (
    id integer DEFAULT nextval('activity_logs_id_seq') PRIMARY KEY,
    activity text NOT NULL,
    "user" text NOT NULL,
    entity text NOT NULL,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);

-- =====================================================
-- CREATE INDEXES AND CONSTRAINTS
-- =====================================================

-- Primary foreign key relationships
ALTER TABLE asset_relationships ADD FOREIGN KEY (source_asset_id) REFERENCES assets(id) ON DELETE CASCADE;
ALTER TABLE asset_relationships ADD FOREIGN KEY (target_asset_id) REFERENCES assets(id) ON DELETE CASCADE;
ALTER TABLE risk_controls ADD FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE;
ALTER TABLE risk_controls ADD FOREIGN KEY (control_id) REFERENCES controls(id) ON DELETE CASCADE;
ALTER TABLE risk_costs ADD FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE;
ALTER TABLE risk_costs ADD FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id) ON DELETE CASCADE;
ALTER TABLE response_cost_modules ADD FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX idx_risks_risk_id ON risks(risk_id);
CREATE INDEX idx_risks_severity ON risks(severity);
CREATE INDEX idx_risks_category ON risks(risk_category);
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_controls_control_id ON controls(control_id);
CREATE INDEX idx_risk_summaries_date ON risk_summaries(year, month);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Commit the schema creation
COMMIT;

-- =====================================================
-- REFERENCE DATA IMPORTS
-- =====================================================
-- Run the data-dumps.sql file after this schema creation script
-- It contains all the essential reference data:
-- - 27 risk library templates with FAIR parameters
-- - 56+ CIS control library entries  
-- - 10 cost calculation modules
-- - User accounts with existing passwords
-- - Authentication configuration
-- - IRIS 2025 actuarial benchmarking data
