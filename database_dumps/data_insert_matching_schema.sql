-- Data Insert Script for Complete Schema
-- This script inserts sample data matching your exact database structure
-- Generated on 2025-06-11

-- Insert Legal Entities
INSERT INTO legal_entities (entity_id, name, description, parent_entity_id, created_at) VALUES
('CORP-MAIN', 'Acme Corporation', 'Main corporate entity', NULL, NOW()),
('CORP-TECH', 'Acme Tech Division', 'Technology division responsible for IT infrastructure and development', 'CORP-MAIN', NOW()),
('CORP-FIN', 'Acme Financial Services', 'Financial services and accounting division', 'CORP-MAIN', NOW()),
('CORP-OPS', 'Acme Operations', 'Operations and logistics division', 'CORP-MAIN', NOW());

-- Insert Assets (matching your exact schema)
INSERT INTO assets (asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES
('AST-001', 'Customer Database', 'data', 'Technology', 'John Smith', 'high', 'high', 'high', 250000.00, '{PCI-DSS,GDPR,SOX}', 'internal', '{}', 'Primary customer information database containing PII and financial data', NOW(), 'USD', 1, 'CORP-TECH', 'Active', NULL, 'technical_component', 'Data Management'),
('AST-002', 'Web Application Server', 'application', 'Technology', 'Jane Doe', 'medium', 'high', 'high', 150000.00, '{SOC2,ISO27001}', 'internal', '{}', 'Main web application serving customer portal', NOW(), 'USD', 1, 'CORP-TECH', 'Active', NULL, 'application_service', 'Application Layer'),
('AST-003', 'Financial Reporting System', 'application', 'Finance', 'Mike Johnson', 'high', 'high', 'medium', 300000.00, '{SOX,GAAP}', 'internal', '{}', 'Core financial reporting and analytics platform', NOW(), 'USD', 1, 'CORP-FIN', 'Active', NULL, 'business_service', 'Financial Systems'),
('AST-004', 'Employee Workstations', 'device', 'Operations', 'IT Operations', 'medium', 'medium', 'medium', 750000.00, '{ISO27001}', 'internal', '{}', 'Fleet of 500 employee workstations across all locations', NOW(), 'USD', 500, 'CORP-OPS', 'Active', NULL, 'technical_component', 'End User Computing');

-- Insert Enterprise Architecture
INSERT INTO enterprise_architecture (asset_id, name, description, level, type, architecture_domain, parent_id, created_at, updated_at) VALUES
('EA-L1-001', 'Digital Customer Experience', 'Strategic capability for delivering digital customer experiences', 'L1', 'Strategic Capability', 'Customer Experience', NULL, NOW(), NOW()),
('EA-L2-001', 'Customer Portal Services', 'Value capability providing customer self-service portal', 'L2', 'Value Capability', 'Digital Services', 1, NOW(), NOW()),
('EA-L3-001', 'Customer Authentication Service', 'Business service for customer login and authentication', 'L3', 'Business Service', 'Security Services', 2, NOW(), NOW());

-- Insert Users
INSERT INTO users (username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts) VALUES
('admin', 'admin@company.com', 'System Administrator', '$2b$10$rFJQVVGI8k1kpBVBzF.o9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mO', 'admin', 'local', true, 0),
('analyst', 'analyst@company.com', 'Risk Analyst', '$2b$10$TQkVlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mP', 'user', 'local', true, 0),
('viewer', 'viewer@company.com', 'Report Viewer', '$2b$10$UPlRlYRXZ8p1mBOVGQ.p9OzYMNvCgF4XZHM7WBGzBsVrQNWwgb0mQ', 'user', 'local', true, 0);

-- Insert Auth Config
INSERT INTO auth_config (auth_type, oidc_enabled, oidc_issuer, oidc_client_id, oidc_client_secret, oidc_callback_url, oidc_scopes, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) VALUES
('local', false, NULL, NULL, NULL, NULL, '["openid", "profile", "email"]', 3600, 5, 300, 8, false, NOW(), NOW());

-- Insert Cost Modules
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

-- Insert Controls
INSERT INTO controls (control_id, name, description, associated_risks, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, notes, created_at, updated_at, cost_per_agent, is_per_agent_pricing, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, e_avoid, e_deter, e_detect, e_resist, var_freq, var_duration) VALUES
('CTRL-001', 'Multi-Factor Authentication', 'Implement MFA for all user accounts accessing critical systems', '{}', 'preventive', 'technical', 'fully_implemented', 0.85, 25000.00, 'All tests passed - 99.2% compliance rate', NOW(), NOW(), 0, false, NULL, 'instance', 'AST-001', NULL, 'CORP-TECH', 500, 0.20, 0.15, 0.30, 0.20, 0, 0),
('CTRL-002', 'Encrypt Sensitive Data at Rest', 'Encrypt all sensitive data stored in databases and file systems', '{}', 'preventive', 'technical', 'fully_implemented', 0.90, 50000.00, 'Encryption verified across all databases', NOW(), NOW(), 0, false, NULL, 'instance', 'AST-001', NULL, 'CORP-TECH', 0, 0.00, 0.00, 0.10, 0.80, 0, 0);

-- Insert Control Library
INSERT INTO control_library (control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count) VALUES
('LIB-CTRL-001', 'Access Control Management', 'Implement comprehensive access control policies and procedures', 'preventive', 'administrative', 'planned', 0.75, 30000.00, 0, false, 'Standard access control framework', '{PR.AC-1,PR.AC-4}', '{A.9.1.1,A.9.2.1}', NOW(), NOW(), NULL, NULL, 'template', NULL, NULL, NULL, NULL),
('LIB-CTRL-002', 'Network Segmentation', 'Implement network segmentation to limit attack surface', 'preventive', 'technical', 'planned', 0.80, 75000.00, 0, false, 'Network isolation controls', '{PR.AC-5,PR.DS-5}', '{A.13.1.3,A.13.2.1}', NOW(), NOW(), NULL, NULL, 'template', NULL, NULL, NULL, NULL);

-- Insert Risks
INSERT INTO risks (risk_id, name, description, associated_assets, threat_community, vulnerability, risk_category, severity, contact_frequency, probability_of_action, threat_event_frequency, threat_capability, resistance_strength, susceptibility, loss_event_frequency, primary_loss_magnitude, secondary_loss_event_frequency, secondary_loss_magnitude, probable_loss_magnitude, inherent_risk, residual_risk, rank_percentile, created_at, updated_at, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_event_frequency_min, threat_event_frequency_avg, threat_event_frequency_max, threat_event_frequency_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, susceptibility_min, susceptibility_avg, susceptibility_max, susceptibility_confidence, loss_event_frequency_min, loss_event_frequency_avg, loss_event_frequency_max, loss_event_frequency_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, loss_magnitude_min, loss_magnitude_avg, loss_magnitude_max, loss_magnitude_confidence, notes, library_item_id, item_type, vulnerability_ids, cis_controls, applicable_cost_modules) VALUES
('RISK-CYBER-001', 'Data Breach of Customer Database', 'Unauthorized access to customer database containing PII and financial information', '{AST-001}', 'External Hackers', 'Unpatched database vulnerabilities', 'operational', 'critical', 0.3, 0.5, 0.15, 0.7, 0.3, 0.233, 0.035, 2500000, 0.7, 500000, 1050000, 900000, 450000, 95.5, NOW(), NOW(), 0.1, 0.3, 0.8, 'Medium', 0.2, 0.5, 0.9, 'Medium', 0.05, 0.15, 0.4, 'Low', 0.3, 0.7, 0.95, 'High', 0.1, 0.3, 0.7, 'Medium', 0.1, 0.233, 0.5, 'Medium', 0.01, 0.035, 0.1, 'Low', 500000, 2500000, 15000000, 'Medium', 0.5, 0.7, 0.9, 'High', 100000, 500000, 3000000, 'Low', 600000, 3000000, 18000000, 'Medium', 'Customer data breach with regulatory implications', NULL, 'instance', '{CVE-2024-0001}', '{CIS-3,CIS-4}', '{1,3,4}'),
('RISK-CYBER-002', 'Web Application SQL Injection', 'SQL injection attack against customer portal web application', '{AST-002}', 'External Hackers', 'Input validation weaknesses', 'operational', 'high', 0.5, 0.3, 0.15, 0.6, 0.4, 0.18, 0.027, 750000, 0.5, 250000, 292500, 500000, 300000, 85.3, NOW(), NOW(), 0.2, 0.5, 1.2, 'Medium', 0.1, 0.3, 0.7, 'High', 0.05, 0.15, 0.4, 'Medium', 0.2, 0.6, 0.9, 'Medium', 0.2, 0.4, 0.8, 'Medium', 0.1, 0.18, 0.4, 'High', 0.01, 0.027, 0.08, 'Medium', 100000, 750000, 5000000, 'Medium', 0.3, 0.5, 0.8, 'Medium', 50000, 250000, 1500000, 'Medium', 150000, 1000000, 6500000, 'Medium', 'SQL injection vulnerability in web application', NULL, 'instance', '{CVE-2024-0002}', '{CIS-11,CIS-16}', '{1,6}'),
('RISK-FIN-001', 'Financial Reporting System Compromise', 'Unauthorized modification of financial reporting data', '{AST-003}', 'Insider Threat', 'Privileged access misuse', 'compliance', 'medium', 0.15, 0.25, 0.0375, 0.8, 0.6, 0.15, 0.00563, 1000000, 0.3, 500000, 78125, 225000, 168750, 75.2, NOW(), NOW(), 0.05, 0.15, 0.4, 'Low', 0.1, 0.25, 0.6, 'Medium', 0.01, 0.0375, 0.1, 'Low', 0.5, 0.8, 0.95, 'High', 0.3, 0.6, 0.9, 'Medium', 0.05, 0.15, 0.35, 'Medium', 0.001, 0.00563, 0.02, 'Low', 200000, 1000000, 8000000, 'Medium', 0.2, 0.3, 0.5, 'Low', 100000, 500000, 2000000, 'Low', 300000, 1500000, 10000000, 'Medium', 'Financial system integrity risk', NULL, 'instance', '{}', '{CIS-1,CIS-5}', '{1,3}'),
('RISK-OPS-001', 'Workstation Malware Infection', 'Malware infection across employee workstation fleet', '{AST-004}', 'External Hackers', 'Email phishing and social engineering', 'operational', 'medium', 0.8, 0.4, 0.32, 0.5, 0.5, 0.32, 0.16, 300000, 0.4, 150000, 105000, 360000, 180000, 65.8, NOW(), NOW(), 0.3, 0.8, 2.0, 'High', 0.2, 0.4, 0.8, 'Medium', 0.1, 0.32, 0.8, 'High', 0.2, 0.5, 0.8, 'Medium', 0.2, 0.5, 0.9, 'Medium', 0.1, 0.32, 0.7, 'Medium', 0.05, 0.16, 0.4, 'Medium', 50000, 300000, 2000000, 'Medium', 0.2, 0.4, 0.7, 'Medium', 25000, 150000, 1000000, 'Medium', 75000, 450000, 3000000, 'Medium', 'Endpoint security risk', NULL, 'instance', '{}', '{CIS-7,CIS-8}', '{1,2,10}');

-- Insert Risk Library
INSERT INTO risk_library (risk_id, name, description, threat_community, vulnerability, risk_category, severity, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, recommended_controls, created_at, updated_at) VALUES
('LIB-RISK-001', 'Ransomware Attack', 'Ransomware encryption of critical business systems', 'Cybercriminals', 'Unpatched systems and weak endpoint protection', 'operational', 'critical', 0.2, 0.6, 1.5, 'Medium', 0.3, 0.7, 0.95, 'High', 0.4, 0.8, 0.95, 'High', 0.2, 0.4, 0.8, 'Medium', 100000, 1500000, 10000000, 'Medium', 0.6, 0.8, 0.95, 'High', 50000, 750000, 5000000, 'Medium', '{Backup Systems,Endpoint Protection,Network Segmentation}', NOW(), NOW()),
('LIB-RISK-002', 'Insider Data Theft', 'Malicious insider stealing sensitive company data', 'Insider Threat', 'Excessive user privileges and weak monitoring', 'operational', 'high', 0.05, 0.2, 0.6, 'Low', 0.1, 0.4, 0.8, 'Medium', 0.3, 0.6, 0.9, 'Medium', 0.1, 0.3, 0.7, 'Medium', 50000, 500000, 5000000, 'Medium', 0.2, 0.4, 0.7, 'Medium', 25000, 250000, 2500000, 'Medium', '{Access Controls,User Monitoring,Data Loss Prevention}', NOW(), NOW());

-- Insert Risk Controls
INSERT INTO risk_controls (risk_id, control_id, effectiveness, notes, created_at, updated_at) VALUES
(1, 1, 0.35, 'MFA reduces data breach risk significantly', NOW(), NOW()),
(1, 2, 0.45, 'Encryption provides additional protection for sensitive data', NOW(), NOW()),
(2, 1, 0.25, 'MFA helps prevent unauthorized access to web applications', NOW(), NOW());

-- Insert Risk Costs
INSERT INTO risk_costs (risk_id, cost_module_id, weight, created_at) VALUES
(1, 1, 3.0, NOW()),
(1, 3, 5.0, NOW()),
(1, 4, 2.0, NOW()),
(2, 1, 2.0, NOW()),
(2, 6, 1.5, NOW()),
(3, 1, 1.5, NOW()),
(3, 3, 3.0, NOW()),
(4, 1, 1.0, NOW()),
(4, 2, 2.0, NOW()),
(4, 10, 2.5, NOW());

-- Insert Risk Responses
INSERT INTO risk_responses (risk_id, response_type, justification, assigned_controls, transfer_method, avoidance_strategy, acceptance_reason, created_at, updated_at, cost_module_ids) VALUES
('RISK-CYBER-001', 'mitigate', 'Implement comprehensive security controls to reduce likelihood and impact', '{CTRL-001,CTRL-002}', '', '', '', NOW(), NOW(), '{1,3,4}'),
('RISK-CYBER-002', 'mitigate', 'Deploy secure coding practices and input validation', '{CTRL-001}', '', '', '', NOW(), NOW(), '{1,6}'),
('RISK-FIN-001', 'accept', 'Risk level acceptable given current control environment', '{}', '', '', 'Existing controls provide adequate protection for compliance requirements', NOW(), NOW(), '{}'),
('RISK-OPS-001', 'mitigate', 'Enhance endpoint protection and user awareness training', '{}', '', '', '', NOW(), NOW(), '{1,2,10}');

-- Insert Response Cost Modules
INSERT INTO response_cost_modules (response_id, cost_module_id, multiplier, created_at) VALUES
(1, 1, 3.0, NOW()),
(1, 3, 5.0, NOW()),
(1, 4, 2.0, NOW()),
(2, 1, 2.0, NOW()),
(2, 6, 1.5, NOW()),
(4, 1, 1.0, NOW()),
(4, 2, 2.0, NOW()),
(4, 10, 2.5, NOW());

-- Insert Risk Summaries
INSERT INTO risk_summaries (year, month, legal_entity_id, tenth_percentile_exposure, most_likely_exposure, ninetieth_percentile_exposure, minimum_exposure, maximum_exposure, average_exposure, created_at, updated_at, total_risks, critical_risks, high_risks, medium_risks, low_risks, total_inherent_risk, total_residual_risk, mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure, exposure_curve_data) VALUES
(2025, 6, 'CORP-MAIN', 50000, 1250000, 8500000, 15000, 12000000, 2500000, NOW(), NOW(), 4, 1, 1, 2, 0, 1985000, 1098750, 2500000, 1250000, 9500000, 11500000, '[{"impact": 15000, "probability": 1.0}, {"impact": 1250000, "probability": 0.5}, {"impact": 8500000, "probability": 0.1}]'),
(2025, 5, 'CORP-MAIN', 45000, 1100000, 7800000, 12000, 11000000, 2200000, NOW(), NOW(), 4, 1, 1, 2, 0, 1985000, 1098750, 2200000, 1100000, 8800000, 10500000, '[{"impact": 12000, "probability": 1.0}, {"impact": 1100000, "probability": 0.5}, {"impact": 7800000, "probability": 0.1}]');

-- Insert Asset Relationships
INSERT INTO asset_relationships (source_asset_id, target_asset_id, relationship_type, created_at) VALUES
(2, 1, 'depends_on', NOW()),
(3, 1, 'depends_on', NOW()),
(4, 2, 'depends_on', NOW());

-- Insert Vulnerabilities
INSERT INTO vulnerabilities (cve_id, title, description, discovery_date, severity_cvss3, patchable, source, created_at, updated_at, severity, status, e_detect, e_resist, variance_freq, variance_duration, remediation_date) VALUES
('CVE-2024-0001', 'Critical Remote Code Execution', 'A critical vulnerability allowing remote code execution in web applications', NOW(), 9.8, true, 'scanner', NOW(), NOW(), 'critical', 'open', 0.3, 0.4, NULL, NULL, NULL),
('CVE-2024-0002', 'SQL Injection in Database Layer', 'SQL injection vulnerability in the database access layer', NOW(), 8.1, true, 'scanner', NOW(), NOW(), 'high', 'in_progress', 0.2, 0.3, NULL, NULL, NULL),
('CVE-2024-0003', 'Cross-Site Scripting Vulnerability', 'Stored XSS vulnerability in user input fields', NOW(), 6.1, true, 'pen_test', NOW(), NOW(), 'medium', 'open', 0.1, 0.1, NULL, NULL, NULL),
('CVE-2024-0004', 'Information Disclosure', 'Sensitive information disclosed in error messages', NOW(), 5.3, true, 'manual', NOW(), NOW(), 'medium', 'remediated', 0.05, 0.0, NULL, NULL, NOW());

-- Insert Activity Logs
INSERT INTO activity_logs (activity, "user", entity, entity_type, entity_id, created_at) VALUES
('create', 'System User', 'Multi-Factor Authentication', 'Control', 'CTRL-001', NOW()),
('create', 'System User', 'Encrypt Sensitive Data at Rest', 'Control', 'CTRL-002', NOW()),
('update', 'System User', 'Data Breach of Customer Database', 'Risk', 'RISK-CYBER-001', NOW()),
('create', 'admin', 'Customer Database', 'Asset', 'AST-001', NOW()),
('update', 'analyst', 'Web Application SQL Injection', 'Risk', 'RISK-CYBER-002', NOW());

-- Data insertion completed successfully
-- All tables populated with sample data matching your exact schema structure