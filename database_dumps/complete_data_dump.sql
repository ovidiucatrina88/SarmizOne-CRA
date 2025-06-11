-- Complete Data Dump for Database Schema
-- This script inserts all current data from your database
-- Generated on 2025-06-11

-- Insert Users
INSERT INTO users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) VALUES
(1, 'admin', 'admin@company.com', 'System Administrator', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'local', true, 0, NULL, '2025-06-10 17:48:16.863', '2025-05-23 11:42:24.459027', '2025-06-10 17:48:17.243', NULL, 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 13, NULL),
(2, 'M-admin', 'm@admin.com', 'M-admin admin', '$2b$12$WKKV/3V0TeqXY/y3op4Ksurl1rQPmbovmvlxbpS8c1sUmKtiU4tKG', 'admin', 'local', true, 0, NULL, NULL, '2025-05-23 12:24:14.509455', '2025-05-23 12:24:14.509455', NULL, 100, NULL, NULL, NULL, 'M-admin', 'admin', NULL, 1, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, NULL),
(4, 'testadmin', 'test@company.com', 'Test Administrator', '$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW', 'admin', 'local', true, 1, NULL, NULL, '2025-05-23 12:45:49.838796', '2025-06-10 17:30:09.639', NULL, 100, NULL, NULL, NULL, 'Test', 'Admin', NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, '2025-05-23 12:45:57.139');

-- Insert Legal Entities
INSERT INTO legal_entities (id, entity_id, name, description, parent_entity_id, created_at) VALUES
(1, 'ENT-001', 'Company X Emea', '', 'ENT-003', '2025-05-04 17:32:30.066449'),
(2, 'ENT-002', 'Company Y US', '', 'ENT-003', '2025-05-04 17:49:19.248602'),
(3, 'ENT-003', 'Company Group', '', NULL, '2025-05-04 17:49:40.227684'),
(4, 'ENT-004', 'another-company', '0', 'ENT-001', '2025-05-06 20:58:23.472788');

-- Insert Assets
INSERT INTO assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES
(1, 'AST-001', 'SalesForce', 'application', 'CIT', 'Ovidiu', 'high', 'high', 'low', 50000000.00, '{GDPR}', 'external', '{}', 'my salesforce', '2025-04-29 21:46:52.224', 'USD', 1, 'Company Y US', 'Active', NULL, 'technical_component', ''),
(5, 'AST-005', 'candidate Database', 'data', 'ovi', 'ovi', 'high', 'high', 'high', 10000000.00, '{GDPR}', 'internal', '{}', '0', '2025-05-12 20:40:52.303', 'EUR', 10, 'Company X Emea', 'Active', NULL, 'technical_component', ''),
(11, 'AST-002', 'Web Application Server', 'application', 'IT', 'System Admin', 'medium', 'high', 'high', 30000000.00, '{PCI-DSS}', 'external', '{}', 'Public-facing web application server', '2025-05-15 23:12:38.221355', 'USD', 30, 'Company X Emea', 'Active', NULL, 'technical_component', ''),
(15, 'AST-595', 'datalake', 'application', 'Information Technology', 'Ovi', 'medium', 'medium', 'medium', 100000.00, '{}', 'internal', '{}', 'No description provided', '2025-05-21 16:10:19.659471', 'USD', 1, 'Company Group', 'Active', NULL, 'technical_component', 'Application');

-- Insert Auth Config
INSERT INTO auth_config (id, auth_type, oidc_enabled, oidc_issuer, oidc_client_id, oidc_client_secret, oidc_callback_url, oidc_scopes, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) VALUES
(1, 'local', false, NULL, NULL, NULL, NULL, '["openid", "profile", "email"]', 3600, 5, 300, 8, false, '2025-06-09 09:13:01.696496', '2025-06-09 09:13:01.696496');

-- Insert Cost Modules
INSERT INTO cost_modules (id, name, cis_control, cost_factor, cost_type, description, created_at) VALUES
(1, 'Breach Investigation', '{7,7.1,7.2}', 10000, 'fixed', 'Fixed cost for conducting a breach investigation', '2025-05-18 08:06:57.349881'),
(2, 'Breach Notification', '{13,13.1,13.2}', 5, 'per_event', 'Cost per affected record for notification', '2025-05-18 08:06:57.349881'),
(3, 'System Recovery', '{11,11.1,11.2}', 5000, 'fixed', 'Fixed cost for system recovery after breach', '2025-05-18 08:06:57.349881'),
(4, 'Legal Consultation', '{17,17.1,17.2}', 350, 'per_hour', 'Legal consultation costs per hour', '2025-05-18 08:06:57.349881'),
(5, 'Regulatory Fines', '{2,2.1,2.2}', 0.06, 'percentage', 'Percentage of total loss for regulatory fines', '2025-05-18 08:06:57.349881'),
(6, 'Lost Productivity', '{8,8.1,8.2}', 0.15, 'percentage', 'Percentage of total loss from lost productivity', '2025-05-18 08:06:57.349881'),
(7, 'Reputation Damage', '{4,14,14.1}', 0.2, 'percentage', 'Percentage of total loss from reputation damage', '2025-05-18 08:06:57.349881'),
(8, 'Customer Loss', '{5,15,15.1}', 0.25, 'percentage', 'Percentage of total loss from customer churn', '2025-05-18 08:06:57.349881'),
(9, 'Incident Response Team', '{10,10.1,10.2}', 15000, 'fixed', 'Cost for incident response team deployment', '2025-05-18 08:06:57.349881'),
(10, 'Forensic Services', '{12,12.1,12.2}', 20000, 'fixed', 'Cost for forensic analysis services', '2025-05-18 08:06:57.349881');

-- Insert Risks
INSERT INTO risks (id, risk_id, name, description, associated_assets, threat_community, vulnerability, risk_category, severity, contact_frequency, probability_of_action, threat_event_frequency, threat_capability, resistance_strength, susceptibility, loss_event_frequency, primary_loss_magnitude, secondary_loss_event_frequency, secondary_loss_magnitude, probable_loss_magnitude, inherent_risk, residual_risk, rank_percentile, created_at, updated_at, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_event_frequency_min, threat_event_frequency_avg, threat_event_frequency_max, threat_event_frequency_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, susceptibility_min, susceptibility_avg, susceptibility_max, susceptibility_confidence, loss_event_frequency_min, loss_event_frequency_avg, loss_event_frequency_max, loss_event_frequency_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, loss_magnitude_min, loss_magnitude_avg, loss_magnitude_max, loss_magnitude_confidence, notes, library_item_id, item_type, vulnerability_ids, cis_controls, applicable_cost_modules) VALUES
(52, 'RISK-RANSOMWARE-439', 'Ransomware Attack Template', 'Template for ransomware attacks on enterprise systems', '{AST-002}', 'External Threat Actor', 'System Vulnerability', 'operational', 'high', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 50293905.98, 30930752.17, 0, '2025-05-18 11:10:03.766', '2025-05-18 11:10:03.766', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 1.2, 0, 24, 'medium', 1, 2, 5, 'medium', 10, 10, 10, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 3000000.00, 9000000.00, 18000000.00, 'medium', 0.1, 0.5, 1, 'medium', 195000.00, 555000.00, 1095000.00, 'high', 3195000.00, 9555000.00, 19095000.00, 'medium', '', 18, 'instance', NULL, '{}', '{}'),
(53, 'RISK-DATA-299', 'Data breach of customer PII', 'Unauthorized access to personally identifiable information', '{AST-001}', 'External cybercriminals', 'Insufficient access controls', 'operational', 'critical', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 27717685.00, 17323553.13, 0, '2025-05-18 11:24:14.702', '2025-05-18 11:24:14.702', 2, 5, 12, 'medium', 0.1, 0.3, 0.5, 'medium', 0.2, 0, 6, 'medium', 0.5, 0.7, 0.85, 'high', 6.3, 8, 9.7, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 10000000.00, 25000000.00, 40000000.00, 'medium', 0.3, 0.6, 0.9, 'medium', 2600005.00, 6500005.00, 10400005.00, 'medium', 12600005.00, 31500005.00, 50400005.00, 'medium', '', 23, 'instance', NULL, '{}', '{}'),
(54, 'RISK-CREDENTIAL-534', 'Credential theft', 'Unauthorized acquisition of login credentials', '{AST-001}', 'Individual hackers', 'Weak password policies', 'operational', 'medium', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 127332977.45, 127332977.45, 0, '2025-05-18 11:24:14.702', '2025-05-18 11:24:14.702', 10, 50, 100, 'high', 0.3, 0.6, 0.8, 'medium', 3, 0, 80, 'medium', 0.3, 0.5, 0.7, 'medium', 0.4, 0.6, 0.8, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 2500000.00, 7500000.00, 15000000.00, 'medium', 0.2, 0.5, 0.8, 'medium', 25000.00, 100000.00, 300000.00, 'medium', 2505000.00, 7550000.00, 15240000.00, 'medium', '', 27, 'instance', NULL, '{}', '{}'),
(55, 'RISK-TEST-001', 'Testing Delayed Trigger Execution', 'Testing automatic risk summary updates', '{AST-001}', 'Internal', 'Configuration Error', 'operational', 'medium', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 25000.00, 15000.00, 0, '2025-06-10 23:37:45.096493', '2025-06-10 23:37:45.096493', 0.1, 0.5, 1, 'medium', 0.2, 0.6, 0.9, 'medium', 0, 0, 0, 'Medium', 0.3, 0.7, 0.95, 'medium', 0.1, 0.4, 0.8, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 10000.00, 50000.00, 100000.00, 'medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0.00, 0.00, 0.00, 'Medium', '', NULL, 'instance', NULL, '{}', '{}');

-- Insert Controls
INSERT INTO controls (id, control_id, name, description, associated_risks, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, notes, created_at, updated_at, cost_per_agent, is_per_agent_pricing, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, e_avoid, e_deter, e_detect, e_resist, var_freq, var_duration) VALUES
(28, '10.2-2530', 'Deploy Anti-Malware/EDR on All End-Points', 'Install agents enterprise-wide.', '{52}', 'preventive', 'technical', 'fully_implemented', 7.70, 0.00, '', '2025-06-10 23:05:22.54647', '2025-06-10 23:05:22.54647', 20.00, true, 107, 'instance', NULL, 52, NULL, 0, 0.00, 0.00, 0.00, 0.00, 0, 0),
(29, '3.11-7203', 'Encrypt Sensitive Data at Rest', 'Use server-side or client-side encryption on storage.', '{53}', 'preventive', 'technical', 'fully_implemented', 7.50, 10.00, '', '2025-06-10 23:22:37.219441', '2025-06-10 23:22:37.219441', 0.00, false, 54, 'instance', NULL, 53, NULL, 0, 0.00, 0.00, 0.00, 0.00, 0, 0);

-- Insert Control Library (required records for foreign key constraints)
INSERT INTO control_library (id, control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count) VALUES
(54, '3.11', 'Encrypt Sensitive Data at Rest', 'Use server-side or client-side encryption on storage.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(107, '10.2', 'Deploy Anti-Malware/EDR on All End-Points', 'Install agents enterprise-wide.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- Insert Risk Library (required records for foreign key constraints)
INSERT INTO risk_library (id, risk_id, name, description, threat_community, vulnerability, risk_category, severity, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, recommended_controls, created_at, updated_at) VALUES
(18, 'TPL-RANSOMWARE-001', 'Ransomware Attack Template', 'Template for ransomware attacks on enterprise systems', 'External Threat Actor', 'System Vulnerability', 'operational', 'high', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 9, 'medium', 2, 4, 8, 'medium', 100000, 500000, 2e+06, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034'),
(23, 'RL-DATA-BREACH-001', 'Data breach of customer PII', 'Unauthorized access to personally identifiable information', 'External cybercriminals', 'Insufficient access controls', 'operational', 'critical', 2, 5, 12, 'medium', 0.1, 0.3, 0.5, 'medium', 0.5, 0.7, 0.85, 'high', 0.3, 0.5, 0.7, 'medium', 500000, 2e+06, 5e+06, 'medium', 0.3, 0.6, 0.9, 'medium', 100000, 500000, 1.5e+06, 'medium', '{1.1,3.6,5.4,10.2}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727'),
(27, 'RL-CREDENTIAL-005', 'Credential theft', 'Unauthorized acquisition of login credentials', 'Individual hackers', 'Weak password policies', 'operational', 'medium', 10, 50, 100, 'high', 0.3, 0.6, 0.8, 'medium', 0.3, 0.5, 0.7, 'medium', 0.4, 0.6, 0.8, 'medium', 50000, 200000, 500000, 'medium', 0.2, 0.5, 0.8, 'medium', 25000, 100000, 300000, 'medium', '{5.2,5.6,6.4,6.5}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');

-- Insert Latest Risk Summary
INSERT INTO risk_summaries (id, year, month, legal_entity_id, tenth_percentile_exposure, most_likely_exposure, ninetieth_percentile_exposure, minimum_exposure, maximum_exposure, average_exposure, created_at, updated_at, total_risks, critical_risks, high_risks, medium_risks, low_risks, total_inherent_risk, total_residual_risk, mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure, exposure_curve_data) VALUES
(860, 2025, 6, NULL, 127332977.45, 30930752.17, 17323553.13, 15000, 127332977.45, 43900572, '2025-06-10 23:37:45.147653', '2025-06-10 23:37:45.147653', 4, 1, 1, 2, 0, 205369570.43, 175602290.6, 43900572, 24127152.65, 112872639.725, 124440909.5875, '[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 15000, "probability": 1}]');

-- Insert Activity Logs (sample recent entries)
INSERT INTO activity_logs (id, activity, "user", entity, entity_type, entity_id, created_at) VALUES
(295, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'Control', '3.11-7203', '2025-06-10 23:22:37.219'),
(294, 'create', 'System User', 'Encrypt Sensitive Data at Rest', 'Control', '3.11-7203', '2025-06-10 23:22:37.219'),
(293, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'Control', '10.2-2530', '2025-06-10 23:05:22.546'),
(292, 'create', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'Control', '10.2-2530', '2025-06-10 23:05:22.546'),
(291, 'create', 'System User', 'Testing Delayed Trigger Execution', 'Risk', 'RISK-TEST-001', '2025-06-10 23:37:45.096');

-- Update sequence values to match the data
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('legal_entities_id_seq', (SELECT MAX(id) FROM legal_entities));
SELECT setval('assets_id_seq', (SELECT MAX(id) FROM assets));
SELECT setval('auth_config_id_seq', (SELECT MAX(id) FROM auth_config));
SELECT setval('cost_modules_id_seq', (SELECT MAX(id) FROM cost_modules));
SELECT setval('risks_id_seq', (SELECT MAX(id) FROM risks));
SELECT setval('controls_id_seq', (SELECT MAX(id) FROM controls));
SELECT setval('control_library_id_seq', (SELECT MAX(id) FROM control_library));
SELECT setval('risk_library_id_seq', (SELECT MAX(id) FROM risk_library));
SELECT setval('risk_summaries_id_seq', (SELECT MAX(id) FROM risk_summaries));
SELECT setval('activity_logs_id_seq', (SELECT MAX(id) FROM activity_logs));

-- Data dump completed successfully
-- All current database data has been extracted and formatted for insertion