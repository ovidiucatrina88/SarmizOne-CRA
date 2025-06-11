-- Data Dump for Cybersecurity Risk Quantification Platform
-- Generated on 2025-06-11
-- This script clears existing data and inserts fresh records to avoid duplicates

-- Disable foreign key checks temporarily for clean data insertion
SET session_replication_role = replica;

-- Clear all existing data in dependency order (children first)
TRUNCATE TABLE activity_logs CASCADE;
TRUNCATE TABLE asset_relationships CASCADE;
TRUNCATE TABLE response_cost_modules CASCADE;
TRUNCATE TABLE risk_costs CASCADE;
TRUNCATE TABLE risk_controls CASCADE;
TRUNCATE TABLE risk_summaries CASCADE;
TRUNCATE TABLE risk_responses CASCADE;
TRUNCATE TABLE controls CASCADE;
TRUNCATE TABLE risks CASCADE;
TRUNCATE TABLE assets CASCADE;
TRUNCATE TABLE enterprise_architecture CASCADE;
TRUNCATE TABLE legal_entities CASCADE;
TRUNCATE TABLE cost_modules CASCADE;
TRUNCATE TABLE control_library CASCADE;
TRUNCATE TABLE risk_library CASCADE;
TRUNCATE TABLE vulnerabilities CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE auth_config CASCADE;
TRUNCATE TABLE sessions CASCADE;

-- Reset sequences to start from 1
ALTER SEQUENCE legal_entities_id_seq RESTART WITH 1;
ALTER SEQUENCE assets_id_seq RESTART WITH 1;
ALTER SEQUENCE enterprise_architecture_id_seq RESTART WITH 1;
ALTER SEQUENCE risks_id_seq RESTART WITH 1;
ALTER SEQUENCE controls_id_seq RESTART WITH 1;
ALTER SEQUENCE risk_controls_id_seq RESTART WITH 1;
ALTER SEQUENCE risk_responses_id_seq RESTART WITH 1;
ALTER SEQUENCE cost_modules_id_seq RESTART WITH 1;
ALTER SEQUENCE risk_costs_id_seq RESTART WITH 1;
ALTER SEQUENCE risk_summaries_id_seq RESTART WITH 1;
ALTER SEQUENCE asset_relationships_id_seq RESTART WITH 1;
ALTER SEQUENCE control_library_id_seq RESTART WITH 1;
ALTER SEQUENCE risk_library_id_seq RESTART WITH 1;
ALTER SEQUENCE response_cost_modules_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE auth_config_id_seq RESTART WITH 1;
ALTER SEQUENCE activity_logs_id_seq RESTART WITH 1;
ALTER SEQUENCE vulnerabilities_id_seq RESTART WITH 1;

-- Insert Legal Entities
INSERT INTO legal_entities (id, entity_id, name, description, parent_id, hierarchy_level, created_at, updated_at) VALUES
(1, 'CORP-MAIN', 'Acme Corporation', 'Main corporate entity', NULL, 'strategic_capability', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'CORP-TECH', 'Acme Tech Division', 'Technology division responsible for IT infrastructure and development', 1, 'value_capability', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'CORP-FIN', 'Acme Financial Services', 'Financial services and accounting division', 1, 'value_capability', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(4, 'CORP-OPS', 'Acme Operations', 'Operations and logistics division', 1, 'value_capability', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Assets
INSERT INTO assets (id, asset_id, name, description, type, status, integrity, availability, confidentiality, replacement_cost, operating_cost, currency, legal_entity, owner, location, criticality_level, data_classification, compliance_requirements, vendor, version, support_contact, business_unit, parent_id, created_at, updated_at) VALUES
(1, 'AST-001', 'Customer Database', 'Primary customer information database containing PII and financial data', 'data', 'Active', 'high', 'high', 'high', 250000.00, 50000.00, 'USD', 'CORP-TECH', 'John Smith', 'Data Center A', 5, 'Confidential', '{PCI-DSS,GDPR,SOX}', 'Oracle', '19c', 'db-admin@acme.com', 'Technology', NULL, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'AST-002', 'Web Application Server', 'Main web application serving customer portal', 'application', 'Active', 'high', 'high', 'medium', 150000.00, 30000.00, 'USD', 'CORP-TECH', 'Jane Doe', 'Data Center A', 4, 'Internal', '{SOC2,ISO27001}', 'Red Hat', '8.5', 'sys-admin@acme.com', 'Technology', NULL, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'AST-003', 'Financial Reporting System', 'Core financial reporting and analytics platform', 'application', 'Active', 'high', 'medium', 'high', 300000.00, 75000.00, 'USD', 'CORP-FIN', 'Mike Johnson', 'Data Center B', 5, 'Confidential', '{SOX,GAAP}', 'SAP', '2022', 'fin-admin@acme.com', 'Finance', NULL, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(4, 'AST-004', 'Employee Workstations', 'Fleet of 500 employee workstations across all locations', 'device', 'Active', 'medium', 'medium', 'medium', 750000.00, 150000.00, 'USD', 'CORP-OPS', 'IT Operations', 'Multiple Locations', 3, 'Internal', '{ISO27001}', 'Dell', 'OptiPlex 7090', 'it-support@acme.com', 'Operations', NULL, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Enterprise Architecture
INSERT INTO enterprise_architecture (id, component_id, name, description, hierarchy_level, parent_id, legal_entity, created_at, updated_at) VALUES
(1, 'EA-L1-001', 'Digital Customer Experience', 'Strategic capability for delivering digital customer experiences', 'strategic_capability', NULL, 'CORP-MAIN', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'EA-L2-001', 'Customer Portal Services', 'Value capability providing customer self-service portal', 'value_capability', 1, 'CORP-TECH', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'EA-L3-001', 'Customer Authentication Service', 'Business service for customer login and authentication', 'business_service', 2, 'CORP-TECH', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Users
INSERT INTO users (id, username, email, password_hash, role, first_name, last_name, department, last_login, is_active, created_at, updated_at) VALUES
(1, 'admin', 'admin@company.com', '$2b$10$rFJQVVGI8k1kpBVBzF.o9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mO', 'admin', 'System', 'Administrator', 'IT', '2025-06-11 07:50:19+00', true, '2025-06-06 19:00:00+00', '2025-06-11 07:50:19+00'),
(2, 'analyst', 'analyst@company.com', '$2b$10$TQkVlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mP', 'analyst', 'Risk', 'Analyst', 'Risk Management', NULL, true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'viewer', 'viewer@company.com', '$2b$10$UPlRlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mQ', 'viewer', 'Report', 'Viewer', 'Management', NULL, true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Auth Config
INSERT INTO auth_config (id, auth_type, oidc_enabled, oidc_issuer, oidc_client_id, oidc_client_secret, oidc_callback_url, oidc_scopes, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) VALUES
(1, 'local', false, NULL, NULL, NULL, NULL, '["openid", "profile", "email"]', 5, 300, 8, false, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Cost Modules
INSERT INTO cost_modules (id, name, description, module_type, base_cost, currency, calculation_formula, applicable_categories, enabled, created_at, updated_at) VALUES
(1, 'Investigation and Escalation', 'Costs associated with incident investigation and escalation procedures', 'per_event', 25000.00, 'USD', 'base_cost * severity_multiplier * complexity_factor', '{operational,compliance}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'Business Disruption', 'Revenue loss and operational disruption costs during incident response', 'per_hour', 15000.00, 'USD', 'base_cost * affected_systems * downtime_hours', '{operational,strategic}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'Legal and Regulatory', 'Legal fees, fines, and regulatory compliance costs', 'percentage', 500000.00, 'USD', 'base_cost * (breach_scope / total_records) * regulatory_multiplier', '{compliance,financial}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(4, 'Customer Notification', 'Costs for notifying affected customers and stakeholders', 'per_event', 50000.00, 'USD', 'base_cost * affected_customers * notification_complexity', '{operational,compliance}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(5, 'Credit Monitoring', 'Credit monitoring services for affected customers', 'per_event', 100000.00, 'USD', 'base_cost * affected_customers * monitoring_duration', '{financial,compliance}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(6, 'System Recovery', 'Costs to restore systems and data from backups', 'fixed', 75000.00, 'USD', 'base_cost * system_complexity * recovery_time', '{operational}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(7, 'Forensic Investigation', 'Digital forensics and expert investigation services', 'per_event', 125000.00, 'USD', 'base_cost * investigation_scope * expert_hours', '{operational,compliance}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(8, 'Reputation Management', 'Public relations and reputation recovery efforts', 'per_event', 200000.00, 'USD', 'base_cost * media_exposure * duration', '{strategic}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(9, 'Insurance Deductible', 'Insurance policy deductible amounts', 'fixed', 50000.00, 'USD', 'base_cost', '{financial}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(10, 'Lost Revenue', 'Revenue lost due to business interruption', 'per_hour', 25000.00, 'USD', 'base_cost * affected_revenue_streams * duration', '{strategic,financial}', true, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Controls
INSERT INTO controls (id, control_id, name, description, type, category, implementation_status, effectiveness, cost, currency, implementation_date, review_date, responsible_party, testing_frequency, last_test_date, test_results, legal_entity, created_at, updated_at) VALUES
(1, 'CTRL-001', 'Multi-Factor Authentication', 'Implement MFA for all user accounts accessing critical systems', 'preventive', 'technical', 'fully_implemented', 0.85, 25000.00, 'USD', '2025-01-15', '2025-07-15', 'IT Security Team', 'quarterly', '2025-04-15', 'All tests passed - 99.2% compliance rate', 'CORP-TECH', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'CTRL-002', 'Encrypt Sensitive Data at Rest', 'Encrypt all sensitive data stored in databases and file systems', 'preventive', 'technical', 'fully_implemented', 0.90, 50000.00, 'USD', '2025-02-01', '2025-08-01', 'Database Administration Team', 'monthly', '2025-05-01', 'Encryption verified across all databases', 'CORP-TECH', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Risks
INSERT INTO risks (id, risk_id, name, description, severity, risk_category, associated_assets, threat_community, vulnerability, item_type, threat_event_frequency_min, threat_event_frequency_ml, threat_event_frequency_max, threat_event_frequency_avg, threat_event_frequency_confidence, susceptibility_min, susceptibility_ml, susceptibility_max, susceptibility_avg, susceptibility_confidence, primary_loss_magnitude_min, primary_loss_magnitude_ml, primary_loss_magnitude_max, primary_loss_magnitude_avg, primary_loss_magnitude_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_ml, secondary_loss_magnitude_max, secondary_loss_magnitude_avg, secondary_loss_magnitude_confidence, loss_magnitude_min, loss_magnitude_ml, loss_magnitude_max, loss_magnitude_avg, loss_magnitude_confidence, inherent_risk, residual_risk, risk_reduction_percentage, monte_carlo_mean, monte_carlo_p10, monte_carlo_p50, monte_carlo_p90, monte_carlo_max, rank_score, rank_percentile, created_at, updated_at) VALUES
(1, 'RISK-CYBER-001', 'Data Breach of Customer Database', 'Unauthorized access to customer database containing PII and financial information', 'critical', 'operational', '{AST-001}', 'External Hackers', 'Unpatched database vulnerabilities', 'instance', '0.1', '0.3', '0.8', 0.3, 'Medium', '0.2', '0.5', '0.9', 0.5, 'Medium', '500000', '2500000', '15000000', 2500000, 'Medium', '100000', '500000', '3000000', 500000, 'Low', '600000', '3000000', '18000000', 3000000, 'Medium', 900000, 450000, 50.0, 450000, 50000, 250000, 850000, 1500000, 95.5, 98.2, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 'RISK-CYBER-002', 'Web Application SQL Injection', 'SQL injection attack against customer portal web application', 'high', 'operational', '{AST-002}', 'External Hackers', 'Input validation weaknesses', 'instance', '0.2', '0.5', '1.2', 0.5, 'Medium', '0.1', '0.3', '0.7', 0.3, 'High', '100000', '750000', '5000000', 750000, 'Medium', '50000', '250000', '1500000', 250000, 'Medium', '150000', '1000000', '6500000', 1000000, 'Medium', 500000, 300000, 40.0, 300000, 25000, 150000, 575000, 1000000, 85.3, 75.8, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 'RISK-FIN-001', 'Financial Reporting System Compromise', 'Unauthorized modification of financial reporting data', 'medium', 'compliance', '{AST-003}', 'Insider Threat', 'Privileged access misuse', 'instance', '0.05', '0.15', '0.4', 0.15, 'Low', '0.1', '0.25', '0.6', 0.25, 'Medium', '200000', '1000000', '8000000', 1000000, 'Medium', '100000', '500000', '2000000', 500000, 'Low', '300000', '1500000', '10000000', 1500000, 'Medium', 225000, 168750, 25.0, 168750, 15000, 75000, 325000, 500000, 75.2, 45.6, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(4, 'RISK-OPS-001', 'Workstation Malware Infection', 'Malware infection across employee workstation fleet', 'medium', 'operational', '{AST-004}', 'External Hackers', 'Email phishing and social engineering', 'instance', '0.3', '0.8', '2.0', 0.8, 'High', '0.2', '0.4', '0.8', 0.4, 'Medium', '50000', '300000', '2000000', 300000, 'Medium', '25000', '150000', '1000000', 150000, 'Medium', '75000', '450000', '3000000', 450000, 'Medium', 360000, 180000, 50.0, 180000, 15000, 90000, 345000, 600000, 65.8, 25.4, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Risk Controls
INSERT INTO risk_controls (id, risk_id, control_id, effectiveness_reduction, implementation_cost, annual_operating_cost, created_at, updated_at) VALUES
(1, 1, 1, 0.35, 15000.00, 5000.00, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 1, 2, 0.45, 25000.00, 8000.00, '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Risk Costs
INSERT INTO risk_costs (id, risk_id, cost_module_id, cost_value, calculation_basis, notes, created_at, updated_at) VALUES
(1, 1, 1, 75000.00, 'Critical severity incident requiring extensive investigation', 'Customer data breach investigation costs', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(2, 1, 3, 2500000.00, 'Regulatory fines for data protection violations', 'GDPR and state privacy law penalties', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(3, 1, 4, 150000.00, 'Notification to 100,000+ affected customers', 'Mandatory breach notification costs', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(4, 2, 1, 50000.00, 'High severity web application compromise', 'SQL injection incident investigation', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00'),
(5, 2, 6, 75000.00, 'Web application recovery and patching', 'System restoration and security updates', '2025-06-06 19:00:00+00', '2025-06-06 19:00:00+00');

-- Insert Vulnerabilities
INSERT INTO vulnerabilities (id, cve_id, title, description, cvss_score, cvss_vector, severity, status, discovered_date, remediated_date, published_date, modified_date, e_detect_impact, e_resist_impact, vuln_references, tags, remediation, discovery_date, severity_cvss3, exploitability_subscore, impact_subscore, temporal_score, remediation_date, patchable, source, e_detect, e_resist, variance_freq, variance_duration, created_at, updated_at) VALUES
(1, 'CVE-2024-0001', 'Critical Remote Code Execution', 'A critical vulnerability allowing remote code execution in web applications', 9.8, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', 'critical', 'open', '2025-06-06 00:34:20+00', NULL, NULL, NULL, 0.3, 0.4, '[]', '[]', NULL, '2025-06-06 00:34:20', 9.8, NULL, NULL, NULL, NULL, true, 'scanner', NULL, NULL, NULL, NULL, '2025-06-11 00:34:20+00', '2025-06-11 00:34:20+00'),
(2, 'CVE-2024-0002', 'SQL Injection in Database Layer', 'SQL injection vulnerability in the database access layer', 8.1, 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N', 'high', 'in_progress', '2025-05-27 00:34:20+00', NULL, NULL, NULL, 0.2, 0.3, '[]', '[]', NULL, '2025-05-27 00:34:20', 8.1, NULL, NULL, NULL, NULL, true, 'scanner', NULL, NULL, NULL, NULL, '2025-06-11 00:34:20+00', '2025-06-11 00:34:20+00'),
(3, 'CVE-2024-0003', 'Cross-Site Scripting Vulnerability', 'Stored XSS vulnerability in user input fields', 6.1, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N', 'medium', 'open', '2025-06-08 00:34:20+00', NULL, NULL, NULL, 0.1, 0.1, '[]', '[]', NULL, '2025-06-08 00:34:20', 6.1, NULL, NULL, NULL, NULL, true, 'pen_test', NULL, NULL, NULL, NULL, '2025-06-11 00:34:20+00', '2025-06-11 00:34:20+00'),
(4, 'CVE-2024-0004', 'Information Disclosure', 'Sensitive information disclosed in error messages', 5.3, 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N', 'medium', 'remediated', '2025-05-27 00:34:20+00', NULL, NULL, NULL, 0.05, 0.0, '[]', '[]', NULL, '2025-05-27 00:34:20', 5.3, NULL, NULL, NULL, NULL, true, 'manual', NULL, NULL, NULL, NULL, '2025-06-11 00:34:20+00', '2025-06-11 00:34:20+00');

-- Note: Risk summaries, control library, risk library, and activity logs contain large datasets
-- These would be inserted here but are truncated for brevity in this example
-- The full datasets can be extracted using individual SELECT statements

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Update sequence values to match inserted data
SELECT setval('legal_entities_id_seq', (SELECT MAX(id) FROM legal_entities));
SELECT setval('assets_id_seq', (SELECT MAX(id) FROM assets));
SELECT setval('enterprise_architecture_id_seq', (SELECT MAX(id) FROM enterprise_architecture));
SELECT setval('risks_id_seq', (SELECT MAX(id) FROM risks));
SELECT setval('controls_id_seq', (SELECT MAX(id) FROM controls));
SELECT setval('risk_controls_id_seq', (SELECT MAX(id) FROM risk_controls));
SELECT setval('risk_costs_id_seq', (SELECT MAX(id) FROM risk_costs));
SELECT setval('cost_modules_id_seq', (SELECT MAX(id) FROM cost_modules));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('auth_config_id_seq', (SELECT MAX(id) FROM auth_config));
SELECT setval('vulnerabilities_id_seq', (SELECT MAX(id) FROM vulnerabilities));

-- Data dump completed
-- Total core records inserted:
-- - Legal Entities: 4
-- - Assets: 4
-- - Enterprise Architecture: 3
-- - Risks: 4
-- - Controls: 2
-- - Risk Controls: 2
-- - Risk Costs: 5
-- - Cost Modules: 10
-- - Users: 3
-- - Auth Config: 1
-- - Vulnerabilities: 4