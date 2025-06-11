-- Database Schema Dump for Cybersecurity Risk Quantification Platform
-- Generated on 2025-06-11
-- PostgreSQL Database Schema with ALTER/CREATE IF NOT EXISTS statements

-- Drop existing enums if they exist and recreate
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

-- Create enums
CREATE TYPE cost_module_type AS ENUM ('fixed', 'per_event', 'per_hour', 'percentage');
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
CREATE TYPE vulnerability_status AS ENUM ('open', 'in_progress', 'mitigated', 'resolved', 'false_positive');
CREATE TYPE vulnerability_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE item_type AS ENUM ('template', 'instance');
CREATE TYPE auth_type AS ENUM ('local', 'sso');
CREATE TYPE user_role AS ENUM ('admin', 'analyst', 'viewer');

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

-- Assets Table
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
    replacement_cost NUMERIC(15,2) DEFAULT 0,
    operating_cost NUMERIC(15,2) DEFAULT 0,
    currency currency DEFAULT 'USD',
    legal_entity TEXT REFERENCES legal_entities(entity_id),
    owner TEXT,
    location TEXT,
    criticality_level INTEGER DEFAULT 3,
    data_classification TEXT,
    compliance_requirements TEXT[],
    vendor TEXT,
    version TEXT,
    support_contact TEXT,
    business_unit TEXT,
    parent_id INTEGER REFERENCES assets(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    associated_assets TEXT[],
    threat_community TEXT,
    vulnerability TEXT,
    item_type item_type,
    threat_event_frequency_min TEXT,
    threat_event_frequency_ml TEXT,
    threat_event_frequency_max TEXT,
    threat_event_frequency_avg NUMERIC,
    threat_event_frequency_confidence TEXT,
    susceptibility_min TEXT,
    susceptibility_ml TEXT,
    susceptibility_max TEXT,
    susceptibility_avg NUMERIC,
    susceptibility_confidence TEXT,
    primary_loss_magnitude_min TEXT,
    primary_loss_magnitude_ml TEXT,
    primary_loss_magnitude_max TEXT,
    primary_loss_magnitude_avg NUMERIC,
    primary_loss_magnitude_confidence TEXT,
    secondary_loss_magnitude_min TEXT,
    secondary_loss_magnitude_ml TEXT,
    secondary_loss_magnitude_max TEXT,
    secondary_loss_magnitude_avg NUMERIC,
    secondary_loss_magnitude_confidence TEXT,
    loss_magnitude_min TEXT,
    loss_magnitude_ml TEXT,
    loss_magnitude_max TEXT,
    loss_magnitude_avg NUMERIC,
    loss_magnitude_confidence TEXT,
    inherent_risk NUMERIC DEFAULT 0,
    residual_risk NUMERIC DEFAULT 0,
    risk_reduction_percentage NUMERIC DEFAULT 0,
    monte_carlo_mean NUMERIC,
    monte_carlo_p10 NUMERIC,
    monte_carlo_p50 NUMERIC,
    monte_carlo_p90 NUMERIC,
    monte_carlo_max NUMERIC,
    rank_score NUMERIC DEFAULT 0,
    rank_percentile NUMERIC DEFAULT 0,
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
    cost NUMERIC(12,2) DEFAULT 0,
    currency currency DEFAULT 'USD',
    implementation_date DATE,
    review_date DATE,
    responsible_party TEXT,
    testing_frequency TEXT,
    last_test_date DATE,
    test_results TEXT,
    legal_entity TEXT REFERENCES legal_entities(entity_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Controls Mapping Table
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

-- Risk Responses Table
CREATE TABLE IF NOT EXISTS risk_responses (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL,
    response_type risk_response_type NOT NULL,
    justification TEXT,
    assigned_controls TEXT[],
    transfer_method TEXT,
    avoidance_strategy TEXT,
    acceptance_reason TEXT,
    implementation_timeline TEXT,
    responsible_party TEXT,
    monitoring_plan TEXT,
    review_date DATE,
    cost_estimate NUMERIC(12,2) DEFAULT 0,
    currency currency DEFAULT 'USD',
    approval_status TEXT DEFAULT 'pending',
    approved_by TEXT,
    approval_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cost Modules Table
CREATE TABLE IF NOT EXISTS cost_modules (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    module_type cost_module_type NOT NULL,
    base_cost NUMERIC(12,2) DEFAULT 0,
    currency currency DEFAULT 'USD',
    calculation_formula TEXT,
    applicable_categories TEXT[],
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Costs Table
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

-- Risk Summaries Table
CREATE TABLE IF NOT EXISTS risk_summaries (
    id SERIAL PRIMARY KEY,
    legal_entity_id TEXT REFERENCES legal_entities(entity_id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_risks INTEGER DEFAULT 0,
    critical_risks INTEGER DEFAULT 0,
    high_risks INTEGER DEFAULT 0,
    medium_risks INTEGER DEFAULT 0,
    low_risks INTEGER DEFAULT 0,
    total_inherent_risk NUMERIC DEFAULT 0,
    total_residual_risk NUMERIC DEFAULT 0,
    risk_reduction_percentage NUMERIC DEFAULT 0,
    minimum_exposure NUMERIC DEFAULT 0,
    maximum_exposure NUMERIC DEFAULT 0,
    mean_exposure NUMERIC DEFAULT 0,
    median_exposure NUMERIC DEFAULT 0,
    percentile_95_exposure NUMERIC DEFAULT 0,
    percentile_99_exposure NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset Relationships Table
CREATE TABLE IF NOT EXISTS asset_relationships (
    id SERIAL PRIMARY KEY,
    source_asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    target_asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    relationship_type relationship_type NOT NULL,
    description TEXT,
    strength REAL DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source_asset_id, target_asset_id, relationship_type)
);

-- Control Library Table
CREATE TABLE IF NOT EXISTS control_library (
    id SERIAL PRIMARY KEY,
    control_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type control_type NOT NULL,
    category control_category NOT NULL,
    framework TEXT,
    control_family TEXT,
    baseline_effectiveness REAL DEFAULT 0.0,
    implementation_guidance TEXT,
    testing_procedures TEXT,
    control_references TEXT[],
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Library Table
CREATE TABLE IF NOT EXISTS risk_library (
    id SERIAL PRIMARY KEY,
    risk_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category risk_category NOT NULL,
    severity severity NOT NULL,
    threat_community TEXT,
    vulnerability TEXT,
    threat_event_frequency_min TEXT,
    threat_event_frequency_ml TEXT,
    threat_event_frequency_max TEXT,
    susceptibility_min TEXT,
    susceptibility_ml TEXT,
    susceptibility_max TEXT,
    primary_loss_magnitude_min TEXT,
    primary_loss_magnitude_ml TEXT,
    primary_loss_magnitude_max TEXT,
    secondary_loss_magnitude_min TEXT,
    secondary_loss_magnitude_ml TEXT,
    secondary_loss_magnitude_max TEXT,
    risk_references TEXT[],
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Response Cost Modules Table
CREATE TABLE IF NOT EXISTS response_cost_modules (
    id SERIAL PRIMARY KEY,
    response_id INTEGER NOT NULL REFERENCES risk_responses(id) ON DELETE CASCADE,
    cost_module_id INTEGER NOT NULL REFERENCES cost_modules(id) ON DELETE CASCADE,
    cost_value NUMERIC(12,2) DEFAULT 0,
    calculation_basis TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(response_id, cost_module_id)
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
    department TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Auth Config Table
CREATE TABLE IF NOT EXISTS auth_config (
    id SERIAL PRIMARY KEY,
    auth_type auth_type NOT NULL DEFAULT 'local',
    oidc_enabled BOOLEAN DEFAULT false,
    oidc_issuer TEXT,
    oidc_client_id TEXT,
    oidc_client_secret TEXT,
    oidc_callback_url TEXT,
    oidc_scopes JSON DEFAULT '["openid", "profile", "email"]',
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 300,
    password_min_length INTEGER DEFAULT 8,
    require_password_change BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSON,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vulnerabilities Table
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id SERIAL PRIMARY KEY,
    cve_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    cvss_score REAL,
    cvss_vector TEXT,
    severity vulnerability_severity NOT NULL DEFAULT 'medium',
    status vulnerability_status NOT NULL DEFAULT 'open',
    discovered_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    remediated_date TIMESTAMP WITH TIME ZONE,
    published_date TIMESTAMP WITH TIME ZONE,
    modified_date TIMESTAMP WITH TIME ZONE,
    e_detect_impact REAL DEFAULT 0,
    e_resist_impact REAL DEFAULT 0,
    vuln_references JSON DEFAULT '[]',
    tags JSON DEFAULT '[]',
    remediation TEXT,
    workaround TEXT,
    exploit_available BOOLEAN DEFAULT false,
    discovery_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    severity_cvss3 NUMERIC NOT NULL DEFAULT 0,
    exploitability_subscore NUMERIC,
    impact_subscore NUMERIC,
    temporal_score NUMERIC,
    remediation_date TIMESTAMP WITHOUT TIME ZONE,
    patchable BOOLEAN NOT NULL DEFAULT true,
    source TEXT NOT NULL DEFAULT 'manual',
    e_detect NUMERIC,
    e_resist NUMERIC,
    variance_freq INTEGER,
    variance_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT vulnerabilities_source_check CHECK (source = ANY (ARRAY['scanner'::text, 'pen_test'::text, 'bug_bounty'::text, 'manual'::text])),
    CONSTRAINT vulnerabilities_status_check CHECK (status = ANY (ARRAY['open'::text, 'in_progress'::text, 'remediated'::text, 'exception'::text]))
);

-- Vulnerability Assets Mapping Table
CREATE TABLE IF NOT EXISTS vulnerability_assets (
    id SERIAL PRIMARY KEY,
    vulnerability_id INTEGER NOT NULL REFERENCES vulnerabilities(id) ON DELETE CASCADE,
    asset_id INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    affected_versions JSON DEFAULT '[]',
    patch_level TEXT,
    exploitable BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vulnerability_id, asset_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_legal_entity ON assets(legal_entity);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_risks_severity ON risks(severity);
CREATE INDEX IF NOT EXISTS idx_risks_category ON risks(risk_category);
CREATE INDEX IF NOT EXISTS idx_controls_status ON controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_risk_summaries_entity_date ON risk_summaries(legal_entity_id, year, month);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_status ON vulnerabilities(status);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Grant permissions (adjust as needed for your user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Schema dump completed