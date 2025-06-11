-- Data Dump for Exact Database Schema
-- Generated on 2025-06-11
-- This script matches your actual database structure exactly

-- Clear all existing data in dependency order
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

-- Reset sequences
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

-- Insert Legal Entities (matching your schema: entity_id, name, description, parent_entity_id, created_at)
INSERT INTO legal_entities (entity_id, name, description, parent_entity_id, created_at) VALUES
('CORP-MAIN', 'Acme Corporation', 'Main corporate entity', NULL, NOW()),
('CORP-TECH', 'Acme Tech Division', 'Technology division responsible for IT infrastructure and development', 'CORP-MAIN', NOW()),
('CORP-FIN', 'Acme Financial Services', 'Financial services and accounting division', 'CORP-MAIN', NOW()),
('CORP-OPS', 'Acme Operations', 'Operations and logistics division', 'CORP-MAIN', NOW());

-- Insert Assets (matching your schema structure)
INSERT INTO assets (asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, legal_entity, status, description, created_at) VALUES
('AST-001', 'Customer Database', 'data', 'Technology', 'John Smith', 'high', 'high', 'high', 250000.00, 'CORP-TECH', 'Active', 'Primary customer information database containing PII and financial data', NOW()),
('AST-002', 'Web Application Server', 'application', 'Technology', 'Jane Doe', 'medium', 'high', 'high', 150000.00, 'CORP-TECH', 'Active', 'Main web application serving customer portal', NOW()),
('AST-003', 'Financial Reporting System', 'application', 'Finance', 'Mike Johnson', 'high', 'high', 'medium', 300000.00, 'CORP-FIN', 'Active', 'Core financial reporting and analytics platform', NOW()),
('AST-004', 'Employee Workstations', 'device', 'Operations', 'IT Operations', 'medium', 'medium', 'medium', 750000.00, 'CORP-OPS', 'Active', 'Fleet of 500 employee workstations across all locations', NOW());

-- Insert Enterprise Architecture (matching your schema: asset_id, name, description, level, type, created_at, updated_at)
INSERT INTO enterprise_architecture (asset_id, name, description, level, type, created_at, updated_at) VALUES
('EA-L1-001', 'Digital Customer Experience', 'Strategic capability for delivering digital customer experiences', 'L1', 'Strategic Capability', NOW(), NOW()),
('EA-L2-001', 'Customer Portal Services', 'Value capability providing customer self-service portal', 'L2', 'Value Capability', NOW(), NOW()),
('EA-L3-001', 'Customer Authentication Service', 'Business service for customer login and authentication', 'L3', 'Business Service', NOW(), NOW());

-- Insert Users (matching your schema: username, email, display_name, password_hash, role, auth_type, is_active)
INSERT INTO users (username, email, display_name, password_hash, role, auth_type, is_active) VALUES
('admin', 'admin@company.com', 'System Administrator', '$2b$10$rFJQVVGI8k1kpBVBzF.o9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mO', 'admin', 'local', true),
('analyst', 'analyst@company.com', 'Risk Analyst', '$2b$10$TQkVlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mP', 'user', 'local', true),
('viewer', 'viewer@company.com', 'Report Viewer', '$2b$10$UPlRlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mQ', 'user', 'local', true);

-- Insert Auth Config (matching your schema structure)
INSERT INTO auth_config (auth_type, oidc_enabled, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) VALUES
('local', false, 3600, 5, 300, 8, false, NOW(), NOW());

-- Insert Cost Modules (matching your schema: name, cis_control, cost_factor, cost_type, description, created_at)
INSERT INTO cost_modules (name, cis_control, cost_factor, cost_type, description, created_at) VALUES
('Investigation and Escalation', '{}', 25000.00, 'per_event', 'Costs associated with incident investigation and escalation procedures', NOW()),
('Business Disruption', '{}', 15000.00, 'per_hour', 'Revenue loss and operational disruption costs during incident response', NOW()),
('Legal and Regulatory', '{}', 500000.00, 'percentage', 'Legal fees, fines, and regulatory compliance costs', NOW()),
('Customer Notification', '{}', 50000.00, 'per_event', 'Costs for notifying affected customers and stakeholders', NOW()),
('Credit Monitoring', '{}', 100000.00, 'per_event', 'Credit monitoring services for affected customers', NOW()),
('System Recovery', '{}', 75000.00, 'fixed', 'Costs to restore systems and data from backups', NOW()),
('Forensic Investigation', '{}', 125000.00, 'per_event', 'Digital forensics and expert investigation services', NOW()),
('Reputation Management', '{}', 200000.00, 'per_event', 'Public relations and reputation recovery efforts', NOW()),
('Insurance Deductible', '{}', 50000.00, 'fixed', 'Insurance policy deductible amounts', NOW()),
('Lost Revenue', '{}', 25000.00, 'per_hour', 'Revenue lost due to business interruption', NOW());

-- Insert Controls (matching your schema structure)
INSERT INTO controls (control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, notes, created_at, updated_at) VALUES
('CTRL-001', 'Multi-Factor Authentication', 'Implement MFA for all user accounts accessing critical systems', 'preventive', 'technical', 'fully_implemented', 0.85, 25000.00, 'All tests passed - 99.2% compliance rate', NOW(), NOW()),
('CTRL-002', 'Encrypt Sensitive Data at Rest', 'Encrypt all sensitive data stored in databases and file systems', 'preventive', 'technical', 'fully_implemented', 0.90, 50000.00, 'Encryption verified across all databases', NOW(), NOW());

-- Insert Risks (matching your schema structure with all FAIR columns)
INSERT INTO risks (risk_id, name, description, associated_assets, threat_community, vulnerability, risk_category, severity, inherent_risk, residual_risk, notes, created_at, updated_at) VALUES
('RISK-CYBER-001', 'Data Breach of Customer Database', 'Unauthorized access to customer database containing PII and financial information', '{AST-001}', 'External Hackers', 'Unpatched database vulnerabilities', 'operational', 'critical', 900000, 450000, 'Customer data breach with regulatory implications', NOW(), NOW()),
('RISK-CYBER-002', 'Web Application SQL Injection', 'SQL injection attack against customer portal web application', '{AST-002}', 'External Hackers', 'Input validation weaknesses', 'operational', 'high', 500000, 300000, 'SQL injection vulnerability in web application', NOW(), NOW()),
('RISK-FIN-001', 'Financial Reporting System Compromise', 'Unauthorized modification of financial reporting data', '{AST-003}', 'Insider Threat', 'Privileged access misuse', 'compliance', 'medium', 225000, 168750, 'Financial system integrity risk', NOW(), NOW()),
('RISK-OPS-001', 'Workstation Malware Infection', 'Malware infection across employee workstation fleet', '{AST-004}', 'External Hackers', 'Email phishing and social engineering', 'operational', 'medium', 360000, 180000, 'Endpoint security risk', NOW(), NOW());

-- Insert Risk Controls (matching your schema: risk_id, control_id, effectiveness, notes, created_at, updated_at)
INSERT INTO risk_controls (risk_id, control_id, effectiveness, notes, created_at, updated_at) VALUES
(1, 1, 0.35, 'MFA reduces data breach risk significantly', NOW(), NOW()),
(1, 2, 0.45, 'Encryption provides additional protection for sensitive data', NOW(), NOW());

-- Insert Risk Costs (matching your schema: risk_id, cost_module_id, weight, created_at)
INSERT INTO risk_costs (risk_id, cost_module_id, weight, created_at) VALUES
(1, 1, 3.0, NOW()),
(1, 3, 5.0, NOW()),
(1, 4, 2.0, NOW()),
(2, 1, 2.0, NOW()),
(2, 6, 1.5, NOW());

-- Insert Vulnerabilities (matching your schema structure)
INSERT INTO vulnerabilities (cve_id, title, description, discovery_date, severity_cvss3, patchable, source, created_at, updated_at) VALUES
('CVE-2024-0001', 'Critical Remote Code Execution', 'A critical vulnerability allowing remote code execution in web applications', NOW(), 9.8, true, 'scanner', NOW(), NOW()),
('CVE-2024-0002', 'SQL Injection in Database Layer', 'SQL injection vulnerability in the database access layer', NOW(), 8.1, true, 'scanner', NOW(), NOW()),
('CVE-2024-0003', 'Cross-Site Scripting Vulnerability', 'Stored XSS vulnerability in user input fields', NOW(), 6.1, true, 'pen_test', NOW(), NOW()),
('CVE-2024-0004', 'Information Disclosure', 'Sensitive information disclosed in error messages', NOW(), 5.3, true, 'manual', NOW(), NOW());

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

-- Data dump completed successfully
-- Core records inserted:
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