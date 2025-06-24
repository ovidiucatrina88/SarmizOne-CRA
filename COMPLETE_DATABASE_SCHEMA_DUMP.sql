-- =====================================================
-- COMPLETE DATABASE SCHEMA DUMP
-- Risk Quantification Platform Production Schema
-- Generated: June 24, 2025
-- Database: PostgreSQL 15+
-- Total Tables: 25
-- =====================================================

-- =====================================================
-- ENUMS (PostgreSQL User-Defined Types)
-- =====================================================

-- Asset type enumeration
CREATE TYPE asset_type AS ENUM (
    'data', 'application', 'device', 'system', 'network', 'facility', 
    'personnel', 'other', 'strategic_capability', 'value_capability', 
    'business_service', 'product_service', 'application_service', 'technical_component'
);

-- CIA rating levels
CREATE TYPE cia_rating AS ENUM ('low', 'medium', 'high');

-- Control classifications
CREATE TYPE control_category AS ENUM ('technical', 'administrative', 'physical');
CREATE TYPE control_type AS ENUM ('preventive', 'detective', 'corrective');

-- Asset classifications
CREATE TYPE external_internal AS ENUM ('external', 'internal');
CREATE TYPE asset_status AS ENUM ('Active', 'Decommissioned', 'To Adopt');

-- Implementation status tracking
CREATE TYPE implementation_status AS ENUM ('not_implemented', 'in_progress', 'fully_implemented', 'planned');

-- Risk management enums
CREATE TYPE risk_category AS ENUM ('operational', 'strategic', 'compliance', 'financial');
CREATE TYPE risk_response_type AS ENUM ('accept', 'avoid', 'transfer', 'mitigate');
CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Financial and organizational enums
CREATE TYPE currency AS ENUM ('USD', 'EUR');
CREATE TYPE item_type AS ENUM ('template', 'instance');

-- Enterprise architecture hierarchy
CREATE TYPE hierarchy_level AS ENUM (
    'strategic_capability', 'value_capability', 'business_service', 
    'application_service', 'technical_component'
);

-- Asset relationships
CREATE TYPE relationship_type AS ENUM ('part_of', 'depends_on', 'contains');

-- Authentication types
CREATE TYPE auth_type AS ENUM ('local', 'oidc', 'hybrid');

-- Compliance frameworks
CREATE TYPE compliance_framework AS ENUM (
    'CIS', 'NIST', 'ISO27001', 'SOC2', 'PCI_DSS', 'HIPAA', 'GDPR', 'Custom', 'CCM'
);

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Activity logging for audit trail
CREATE TABLE activity_logs (
    id integer NOT NULL DEFAULT nextval('activity_logs_id_seq'::regclass),
    activity text NOT NULL DEFAULT 'system_action'::text,
    user text NOT NULL DEFAULT 'System User'::text,
    entity text NOT NULL DEFAULT 'Entity'::text,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    action text,
    user_id integer,
    details jsonb,
    timestamp timestamp without time zone DEFAULT now(),
    CONSTRAINT activity_logs_pkey PRIMARY KEY (id)
);

-- Asset relationships mapping
CREATE TABLE asset_relationships (
    id integer NOT NULL DEFAULT nextval('asset_relationships_id_seq'::regclass),
    source_asset_id integer NOT NULL,
    target_asset_id integer NOT NULL,
    relationship_type relationship_type NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT asset_relationships_pkey PRIMARY KEY (id),
    CONSTRAINT asset_relationships_source_asset_id_target_asset_id_relatio_key UNIQUE (source_asset_id, target_asset_id, relationship_type),
    CONSTRAINT asset_relationships_source_asset_id_fkey FOREIGN KEY (source_asset_id) REFERENCES assets(id),
    CONSTRAINT asset_relationships_target_asset_id_fkey FOREIGN KEY (target_asset_id) REFERENCES assets(id)
);

-- Core assets table with enterprise architecture support
CREATE TABLE assets (
    id integer NOT NULL DEFAULT nextval('assets_id_seq'::regclass),
    asset_id text NOT NULL,
    name text NOT NULL,
    type asset_type NOT NULL,
    business_unit text NOT NULL,
    owner text NOT NULL,
    confidentiality cia_rating NOT NULL,
    integrity cia_rating NOT NULL,
    availability cia_rating NOT NULL,
    asset_value numeric NOT NULL,
    regulatory_impact text[] DEFAULT '{none}'::text[],
    external_internal external_internal NOT NULL,
    dependencies text[] DEFAULT '{}'::text[],
    description text NOT NULL DEFAULT ''::text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    currency currency NOT NULL DEFAULT 'USD'::currency,
    agent_count integer NOT NULL DEFAULT 1,
    legal_entity text DEFAULT 'Unknown'::text,
    status asset_status NOT NULL DEFAULT 'Active'::asset_status,
    parent_id integer,
    hierarchy_level hierarchy_level NOT NULL DEFAULT 'technical_component'::hierarchy_level,
    architecture_domain text,
    backstage_entity_ref text,
    backstage_metadata jsonb,
    last_backstage_sync timestamp without time zone,
    CONSTRAINT assets_pkey PRIMARY KEY (id),
    CONSTRAINT assets_asset_id_unique UNIQUE (asset_id),
    CONSTRAINT assets_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES assets(id)
);

-- Authentication configuration
CREATE TABLE auth_config (
    id integer NOT NULL DEFAULT nextval('auth_config_id_seq'::regclass),
    auth_type text NOT NULL DEFAULT 'local'::text,
    oidc_enabled boolean NOT NULL DEFAULT false,
    oidc_issuer text,
    oidc_client_id text,
    oidc_client_secret text,
    oidc_callback_url text,
    oidc_redirect_uri text,
    oidc_scopes json DEFAULT '["openid", "profile", "email"]'::json,
    allow_local_auth boolean NOT NULL DEFAULT true,
    default_role text NOT NULL DEFAULT 'viewer'::text,
    session_timeout integer DEFAULT 3600,
    max_login_attempts integer DEFAULT 5,
    lockout_duration integer DEFAULT 300,
    password_min_length integer DEFAULT 8,
    require_password_change boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT auth_config_pkey PRIMARY KEY (id)
);

-- Backstage integration sync logs
CREATE TABLE backstage_sync_logs (
    id integer NOT NULL DEFAULT nextval('backstage_sync_logs_id_seq'::regclass),
    sync_type text NOT NULL,
    entities_processed integer DEFAULT 0,
    assets_created integer DEFAULT 0,
    assets_updated integer DEFAULT 0,
    relationships_created integer DEFAULT 0,
    sync_status text NOT NULL,
    error_details jsonb,
    sync_duration integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT backstage_sync_logs_pkey PRIMARY KEY (id)
);

-- Control to asset type mappings for intelligent suggestions
CREATE TABLE control_asset_mappings (
    id integer NOT NULL DEFAULT nextval('control_asset_mappings_id_seq'::regclass),
    control_id text NOT NULL,
    asset_type text NOT NULL,
    relevance_score integer DEFAULT 50,
    reasoning text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT control_asset_mappings_pkey PRIMARY KEY (id),
    CONSTRAINT control_asset_mappings_control_id_asset_type_key UNIQUE (control_id, asset_type),
    CONSTRAINT control_asset_mappings_relevance_score_check CHECK ((relevance_score >= 0) AND (relevance_score <= 100))
);

-- Control library templates with CIS Controls integration
CREATE TABLE control_library (
    id integer NOT NULL DEFAULT nextval('control_library_id_seq'::regclass),
    control_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL DEFAULT 'planned'::implementation_status,
    control_effectiveness real NOT NULL DEFAULT 0,
    implementation_cost numeric NOT NULL DEFAULT 0,
    cost_per_agent numeric NOT NULL DEFAULT 0,
    is_per_agent_pricing boolean NOT NULL DEFAULT false,
    notes text NOT NULL DEFAULT ''::text,
    nist_csf text[] NOT NULL DEFAULT '{}'::text[],
    iso27001 text[] NOT NULL DEFAULT '{}'::text[],
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    associated_risks text[],
    library_item_id integer,
    item_type text,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer,
    compliance_framework compliance_framework DEFAULT 'Custom'::compliance_framework,
    cloud_domain text,
    nist_mappings text[] DEFAULT '{}'::text[],
    pci_mappings text[] DEFAULT '{}'::text[],
    cis_mappings text[] DEFAULT '{}'::text[],
    gap_level text,
    implementation_guidance text,
    architectural_relevance json,
    organizational_relevance json,
    ownership_model text,
    cloud_service_model text[] DEFAULT '{}'::text[],
    addendum text DEFAULT 'N/A'::text,
    ownership_mapping text,
    service_models jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT control_library_pkey PRIMARY KEY (id),
    CONSTRAINT control_library_control_id_unique UNIQUE (control_id),
    CONSTRAINT control_library_item_type_check CHECK (item_type = ANY (ARRAY['template'::text, 'instance'::text]))
);

-- Control to risk mappings for suggestion engine
CREATE TABLE control_risk_mappings (
    id integer NOT NULL DEFAULT nextval('control_risk_mappings_id_seq'::regclass),
    control_id text NOT NULL,
    threat_community text,
    risk_category text,
    vulnerability_pattern text,
    relevance_score integer DEFAULT 50,
    impact_type text DEFAULT 'both'::text,
    reasoning text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    risk_library_id text,
    CONSTRAINT control_risk_mappings_pkey PRIMARY KEY (id),
    CONSTRAINT control_risk_mappings_relevance_score_check CHECK ((relevance_score >= 0) AND (relevance_score <= 100)),
    CONSTRAINT control_risk_mappings_impact_type_check CHECK (impact_type = ANY (ARRAY['inherent'::text, 'residual'::text, 'both'::text]))
);

-- Control instances deployed from templates
CREATE TABLE controls (
    id integer NOT NULL DEFAULT nextval('controls_id_seq'::regclass),
    control_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    associated_risks text[] DEFAULT '{}'::text[],
    control_type control_type NOT NULL,
    control_category control_category NOT NULL,
    implementation_status implementation_status NOT NULL,
    control_effectiveness numeric,
    implementation_cost numeric NOT NULL DEFAULT 0,
    notes text NOT NULL DEFAULT ''::text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    cost_per_agent numeric NOT NULL DEFAULT 0,
    is_per_agent_pricing boolean NOT NULL DEFAULT false,
    library_item_id integer,
    item_type item_type DEFAULT 'instance'::item_type,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer DEFAULT 0,
    compliance_framework compliance_framework DEFAULT 'CIS'::compliance_framework,
    is_per_agent boolean DEFAULT false,
    cloud_domain text,
    nist_mappings jsonb DEFAULT '[]'::jsonb,
    pci_mappings jsonb DEFAULT '[]'::jsonb,
    cis_mappings jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT controls_pkey PRIMARY KEY (id),
    CONSTRAINT controls_control_id_unique UNIQUE (control_id),
    CONSTRAINT controls_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES control_library(id)
);

-- Cost calculation modules for risk responses
CREATE TABLE cost_modules (
    id integer NOT NULL DEFAULT nextval('cost_modules_id_seq'::regclass),
    name text NOT NULL,
    cis_control text[] NOT NULL,
    cost_factor numeric NOT NULL,
    cost_type text NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT cost_modules_pkey PRIMARY KEY (id)
);

-- Enterprise architecture mapping
CREATE TABLE enterprise_architecture (
    id integer NOT NULL DEFAULT nextval('enterprise_architecture_id_seq'::regclass),
    asset_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text,
    level text NOT NULL,
    type text NOT NULL,
    architecture_domain text,
    parent_id integer,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT enterprise_architecture_pkey PRIMARY KEY (id),
    CONSTRAINT enterprise_architecture_asset_id_key UNIQUE (asset_id),
    CONSTRAINT enterprise_architecture_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES enterprise_architecture(id),
    CONSTRAINT enterprise_architecture_level_check CHECK (level = ANY (ARRAY['L1'::text, 'L2'::text, 'L3'::text, 'L4'::text, 'L5'::text])),
    CONSTRAINT enterprise_architecture_type_check CHECK (type = ANY (ARRAY['capability'::text, 'service'::text, 'component'::text]))
);

-- Industry insights and benchmarks (IRIS 2025 data)
CREATE TABLE industry_insights (
    id integer NOT NULL DEFAULT nextval('industry_insights_id_seq'::regclass),
    sector character varying NOT NULL,
    metric character varying NOT NULL,
    value_numeric numeric,
    value_text text,
    unit character varying,
    source character varying NOT NULL,
    effective_from date NOT NULL,
    effective_to date DEFAULT '9999-12-31'::date,
    version integer NOT NULL DEFAULT 1,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT industry_insights_pkey PRIMARY KEY (id),
    CONSTRAINT industry_insights_sector_metric_effective_from_key UNIQUE (sector, metric, effective_from)
);

-- Legal entities for organizational structure
CREATE TABLE legal_entities (
    id integer NOT NULL DEFAULT nextval('legal_entities_id_seq'::regclass),
    entity_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    parent_entity_id text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    type text,
    jurisdiction text,
    regulatory_framework text[],
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT legal_entities_pkey PRIMARY KEY (id)
);

-- Schema versioning for production deployments
CREATE TABLE production_schema_version (
    version integer NOT NULL,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text,
    CONSTRAINT production_schema_version_pkey PRIMARY KEY (version)
);

-- Response cost module associations
CREATE TABLE response_cost_modules (
    id integer NOT NULL DEFAULT nextval('response_cost_modules_id_seq'::regclass),
    response_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    multiplier numeric DEFAULT 1.0,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT response_cost_modules_pkey PRIMARY KEY (id),
    CONSTRAINT response_cost_modules_response_id_cost_module_id_key UNIQUE (response_id, cost_module_id),
    CONSTRAINT response_cost_modules_response_id_fkey FOREIGN KEY (response_id) REFERENCES risk_responses(id),
    CONSTRAINT response_cost_modules_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id)
);

-- Risk to control effectiveness mappings
CREATE TABLE risk_controls (
    id integer NOT NULL DEFAULT nextval('risk_controls_id_seq'::regclass),
    risk_id integer NOT NULL,
    control_id integer NOT NULL,
    effectiveness real NOT NULL DEFAULT 0,
    notes text NOT NULL DEFAULT ''::text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT risk_controls_pkey PRIMARY KEY (id),
    CONSTRAINT risk_controls_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES risks(id),
    CONSTRAINT risk_controls_control_id_fkey FOREIGN KEY (control_id) REFERENCES controls(id)
);

-- Risk cost associations
CREATE TABLE risk_costs (
    id integer NOT NULL DEFAULT nextval('risk_costs_id_seq'::regclass),
    risk_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    weight numeric NOT NULL DEFAULT 1.0,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT risk_costs_pkey PRIMARY KEY (id),
    CONSTRAINT risk_costs_risk_id_cost_module_id_key UNIQUE (risk_id, cost_module_id),
    CONSTRAINT risk_costs_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES risks(id),
    CONSTRAINT risk_costs_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES cost_modules(id)
);

-- Risk library templates with FAIR methodology parameters
CREATE TABLE risk_library (
    id integer NOT NULL DEFAULT nextval('risk_library_id_seq'::regclass),
    risk_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    threat_community text NOT NULL DEFAULT ''::text,
    vulnerability text NOT NULL DEFAULT ''::text,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL DEFAULT 'medium'::severity,
    contact_frequency_min real NOT NULL DEFAULT 0,
    contact_frequency_avg real NOT NULL DEFAULT 0,
    contact_frequency_max real NOT NULL DEFAULT 0,
    contact_frequency_confidence text NOT NULL DEFAULT 'Medium'::text,
    probability_of_action_min real NOT NULL DEFAULT 0,
    probability_of_action_avg real NOT NULL DEFAULT 0,
    probability_of_action_max real NOT NULL DEFAULT 0,
    probability_of_action_confidence text NOT NULL DEFAULT 'Medium'::text,
    threat_capability_min real NOT NULL DEFAULT 0,
    threat_capability_avg real NOT NULL DEFAULT 0,
    threat_capability_max real NOT NULL DEFAULT 0,
    threat_capability_confidence text NOT NULL DEFAULT 'Medium'::text,
    resistance_strength_min real NOT NULL DEFAULT 0,
    resistance_strength_avg real NOT NULL DEFAULT 0,
    resistance_strength_max real NOT NULL DEFAULT 0,
    resistance_strength_confidence text NOT NULL DEFAULT 'Medium'::text,
    primary_loss_magnitude_min real NOT NULL DEFAULT 0,
    primary_loss_magnitude_avg real NOT NULL DEFAULT 0,
    primary_loss_magnitude_max real NOT NULL DEFAULT 0,
    primary_loss_magnitude_confidence text NOT NULL DEFAULT 'Medium'::text,
    secondary_loss_event_frequency_min real NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_avg real NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_max real NOT NULL DEFAULT 0,
    secondary_loss_event_frequency_confidence text NOT NULL DEFAULT 'Medium'::text,
    secondary_loss_magnitude_min real NOT NULL DEFAULT 0,
    secondary_loss_magnitude_avg real NOT NULL DEFAULT 0,
    secondary_loss_magnitude_max real NOT NULL DEFAULT 0,
    secondary_loss_magnitude_confidence text NOT NULL DEFAULT 'Medium'::text,
    recommended_controls text[] NOT NULL DEFAULT '{}'::text[],
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    threat_actor text,
    threat_capability jsonb,
    threat_event text,
    primary_loss jsonb,
    secondary_loss jsonb,
    compliance_framework compliance_framework DEFAULT 'Custom'::compliance_framework,
    item_type item_type DEFAULT 'template'::item_type,
    CONSTRAINT risk_library_pkey PRIMARY KEY (id)
);

-- Risk response strategies and implementations
CREATE TABLE risk_responses (
    id integer NOT NULL DEFAULT nextval('risk_responses_id_seq'::regclass),
    risk_id text NOT NULL,
    response_type risk_response_type NOT NULL,
    justification text NOT NULL DEFAULT ''::text,
    assigned_controls text[] NOT NULL DEFAULT '{}'::text[],
    transfer_method text NOT NULL DEFAULT ''::text,
    avoidance_strategy text NOT NULL DEFAULT ''::text,
    acceptance_reason text NOT NULL DEFAULT ''::text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    cost_module_ids text[] DEFAULT '{}'::integer[],
    description text,
    implementation_cost numeric,
    expected_effectiveness real,
    responsible_party text,
    target_date timestamp without time zone,
    CONSTRAINT risk_responses_pkey PRIMARY KEY (id),
    CONSTRAINT risk_responses_risk_id_risks_risk_id_fk FOREIGN KEY (risk_id) REFERENCES risks(risk_id)
);

-- Risk exposure summaries for dashboard analytics
CREATE TABLE risk_summaries (
    id integer NOT NULL DEFAULT nextval('risk_summaries_id_seq'::regclass),
    year integer NOT NULL,
    month integer NOT NULL,
    legal_entity_id text,
    tenth_percentile_exposure double precision NOT NULL DEFAULT 0,
    most_likely_exposure double precision NOT NULL DEFAULT 0,
    ninetieth_percentile_exposure double precision NOT NULL DEFAULT 0,
    minimum_exposure double precision NOT NULL DEFAULT 0,
    maximum_exposure double precision NOT NULL DEFAULT 0,
    average_exposure double precision NOT NULL DEFAULT 0,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
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
    exposure_curve_data jsonb DEFAULT '[]'::jsonb,
    percentile_10_exposure real DEFAULT 0,
    percentile_25_exposure real DEFAULT 0,
    percentile_50_exposure real DEFAULT 0,
    percentile_75_exposure real DEFAULT 0,
    percentile_90_exposure real DEFAULT 0,
    twenty_fifth_percentile_exposure numeric,
    fiftieth_percentile_exposure numeric,
    seventy_fifth_percentile_exposure numeric,
    risk_reduction real DEFAULT 0,
    CONSTRAINT risk_summaries_pkey PRIMARY KEY (id)
);

-- Core risks table with FAIR methodology support
CREATE TABLE risks (
    id integer NOT NULL DEFAULT nextval('risks_id_seq'::regclass),
    risk_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL DEFAULT ''::text,
    threat_community text,
    vulnerability text,
    risk_category risk_category NOT NULL,
    severity severity NOT NULL,
    contact_frequency real DEFAULT 0,
    probability_of_action real DEFAULT 0,
    threat_event_frequency real NOT NULL DEFAULT 0,
    threat_capability real DEFAULT 0,
    resistance_strength real NOT NULL DEFAULT 0,
    susceptibility real DEFAULT 0,
    primary_loss_magnitude real NOT NULL DEFAULT 0,
    secondary_loss_event_frequency real DEFAULT 0,
    secondary_loss_magnitude real DEFAULT 0,
    inherent_risk real NOT NULL DEFAULT 0,
    residual_risk real NOT NULL DEFAULT 0,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    associated_assets text[] DEFAULT '{}'::text[],
    library_item_id integer,
    item_type item_type DEFAULT 'instance'::item_type,
    CONSTRAINT risks_pkey PRIMARY KEY (id),
    CONSTRAINT risks_risk_id_unique UNIQUE (risk_id),
    CONSTRAINT risks_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES risk_library(id)
);

-- User management and authentication
CREATE TABLE users (
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username text,
    email text NOT NULL,
    password_hash text,
    display_name text NOT NULL,
    role text NOT NULL DEFAULT 'viewer'::text,
    auth_type text NOT NULL DEFAULT 'local'::text,
    is_active boolean NOT NULL DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_username_unique UNIQUE (username)
);

-- Session management
CREATE TABLE sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (sid)
);

-- Vulnerability management system
CREATE TABLE vulnerabilities (
    id integer NOT NULL DEFAULT nextval('vulnerabilities_id_seq'::regclass),
    cve_id text NOT NULL,
    discovery_date timestamp without time zone NOT NULL DEFAULT now(),
    severity_cvss3 numeric NOT NULL,
    exploitability_subscore numeric,
    impact_subscore numeric,
    temporal_score numeric,
    status text NOT NULL,
    remediation_date timestamp without time zone,
    patchable boolean NOT NULL DEFAULT true,
    source text NOT NULL,
    e_detect numeric,
    e_resist numeric,
    variance_freq integer,
    variance_duration integer,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    title character varying,
    description text,
    cvss_score real,
    cvss_vector text,
    discovered_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    remediated_date timestamp without time zone,
    published_date timestamp without time zone,
    modified_date timestamp without time zone,
    e_detect_impact real DEFAULT 0,
    e_resist_impact real DEFAULT 0,
    vuln_references json DEFAULT '[]'::json,
    tags json DEFAULT '[]'::json,
    remediation text,
    severity character varying DEFAULT 'medium'::character varying,
    CONSTRAINT vulnerabilities_pkey PRIMARY KEY (id)
);

-- Vulnerability to asset associations
CREATE TABLE vulnerability_assets (
    id integer NOT NULL DEFAULT nextval('vulnerability_assets_id_seq'::regclass),
    vulnerability_id integer NOT NULL,
    asset_id integer NOT NULL,
    host_name text,
    ip_address text,
    port integer,
    protocol text,
    service text,
    affected_component text,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT vulnerability_assets_pkey PRIMARY KEY (id),
    CONSTRAINT vulnerability_assets_vulnerability_id_vulnerabilities_id_fk FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    CONSTRAINT vulnerability_assets_asset_id_assets_id_fk FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- =====================================================

-- Asset indexes
CREATE INDEX idx_assets_parent_id ON assets(parent_id);
CREATE INDEX idx_assets_asset_id ON assets(asset_id);
CREATE INDEX idx_assets_legal_entity ON assets(legal_entity);

-- Risk indexes
CREATE INDEX idx_risks_created_at ON risks(created_at);
CREATE INDEX idx_risks_severity ON risks(severity);
CREATE INDEX idx_risks_risk_id ON risks(risk_id);

-- Control indexes
CREATE INDEX idx_controls_control_id ON controls(control_id);

-- Session management index
CREATE INDEX "IDX_session_expire" ON sessions(expire);

-- =====================================================
-- CONSTRAINTS AND CHECKS
-- =====================================================

-- Relevance score constraints
ALTER TABLE control_asset_mappings ADD CONSTRAINT control_asset_mappings_relevance_score_check 
    CHECK ((relevance_score >= 0) AND (relevance_score <= 100));

ALTER TABLE control_risk_mappings ADD CONSTRAINT control_risk_mappings_relevance_score_check 
    CHECK ((relevance_score >= 0) AND (relevance_score <= 100));

-- Impact type constraint
ALTER TABLE control_risk_mappings ADD CONSTRAINT control_risk_mappings_impact_type_check 
    CHECK (impact_type = ANY (ARRAY['inherent'::text, 'residual'::text, 'both'::text]));

-- Item type constraints
ALTER TABLE control_library ADD CONSTRAINT control_library_item_type_check 
    CHECK (item_type = ANY (ARRAY['template'::text, 'instance'::text]));

-- Enterprise architecture constraints
ALTER TABLE enterprise_architecture ADD CONSTRAINT enterprise_architecture_level_check 
    CHECK (level = ANY (ARRAY['L1'::text, 'L2'::text, 'L3'::text, 'L4'::text, 'L5'::text]));

ALTER TABLE enterprise_architecture ADD CONSTRAINT enterprise_architecture_type_check 
    CHECK (type = ANY (ARRAY['capability'::text, 'service'::text, 'component'::text]));

-- =====================================================
-- SCHEMA METADATA AND VERSIONING
-- =====================================================

INSERT INTO production_schema_version (version, description) VALUES 
(1, 'Initial production schema with complete FAIR risk quantification support');

-- =====================================================
-- SCHEMA SUMMARY
-- =====================================================
-- Total Tables: 25
-- Primary Tables:
--   - assets: Enterprise asset management with hierarchy
--   - risks: FAIR-based risk quantification 
--   - controls: CIS control framework implementation
--   - risk_library: Risk scenario templates
--   - control_library: Control templates with CCM mapping
--   - vulnerabilities: Security vulnerability tracking
--   - users: Authentication and user management
--   - risk_summaries: Aggregated risk analytics
--
-- Key Features:
--   - Complete FAIR methodology support
--   - CIS Controls v8 integration
--   - Enterprise architecture mapping (5 levels)
--   - Vulnerability management system
--   - Backstage integration for service catalogs
--   - Multi-currency financial calculations
--   - Comprehensive audit logging
--   - PostgreSQL arrays for complex data structures
--   - JSONB for flexible metadata storage
-- =====================================================