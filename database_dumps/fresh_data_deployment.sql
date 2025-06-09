-- Fresh Data Deployment - Clears existing data and inserts sample data
-- Run this after schema creation to populate with clean sample data

-- Clear existing data in correct order (respecting foreign key constraints)
TRUNCATE TABLE public.vulnerability_assets CASCADE;
TRUNCATE TABLE public.vulnerabilities CASCADE;
TRUNCATE TABLE public.activity_logs CASCADE;
TRUNCATE TABLE public.risk_summaries CASCADE;
TRUNCATE TABLE public.asset_relationships CASCADE;
TRUNCATE TABLE public.enterprise_architecture CASCADE;
TRUNCATE TABLE public.risk_costs CASCADE;
TRUNCATE TABLE public.risk_responses CASCADE;
TRUNCATE TABLE public.risk_controls CASCADE;
TRUNCATE TABLE public.risk_library CASCADE;
TRUNCATE TABLE public.control_library CASCADE;
TRUNCATE TABLE public.controls CASCADE;
TRUNCATE TABLE public.risks CASCADE;
TRUNCATE TABLE public.assets CASCADE;
TRUNCATE TABLE public.legal_entities CASCADE;
TRUNCATE TABLE public.sessions CASCADE;
TRUNCATE TABLE public.users CASCADE;

-- Reset sequences
SELECT setval('public.activity_logs_id_seq', 1, false);
SELECT setval('public.assets_id_seq', 1, false);
SELECT setval('public.controls_id_seq', 1, false);
SELECT setval('public.risks_id_seq', 1, false);
SELECT setval('public.legal_entities_id_seq', 1, false);
SELECT setval('public.users_id_seq', 1, false);

-- Insert fresh sample data
INSERT INTO public.legal_entities (id, entity_id, name, description, country, regulatory_requirements, risk_appetite) VALUES 
(1, 'ENTITY-001', 'Main Corporation', 'Primary business entity', 'United States', '{SOX,PCI-DSS}', 'medium'),
(2, 'ENTITY-002', 'EU Subsidiary', 'European operations', 'Germany', '{GDPR,NIS2}', 'low'),
(3, 'ENTITY-003', 'APAC Division', 'Asia Pacific operations', 'Singapore', '{PDPA}', 'medium');

INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES
(1, 'AST-001', 'Customer Database', 'data', 'Information Technology', 'Data Team', 'high', 'high', 'high', 5000000.00, '{GDPR,PCI-DSS}', 'internal', '{}', 'Primary customer data repository', NOW(), 'USD', 50, 'Main Corporation', 'Active', NULL, 'technical_component', 'Data'),
(2, 'AST-002', 'Payment Processing System', 'application', 'Finance', 'Payment Team', 'high', 'high', 'high', 2000000.00, '{PCI-DSS}', 'internal', '{}', 'Core payment processing application', NOW(), 'USD', 25, 'Main Corporation', 'Active', NULL, 'application_service', 'Application'),
(3, 'AST-003', 'Employee Portal', 'application', 'Human Resources', 'HR Team', 'medium', 'medium', 'medium', 500000.00, '{GDPR}', 'internal', '{}', 'Internal employee self-service portal', NOW(), 'USD', 500, 'Main Corporation', 'Active', NULL, 'application_service', 'Application');

INSERT INTO public.risks (id, risk_id, name, severity, associated_assets, risk_category, description, created_at, item_type, asset_id, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, inherent_risk, residual_risk) VALUES
(1, 'RISK-001', 'Ransomware Attack', 'critical', '{AST-001,AST-002}', 'operational', 'Risk of ransomware compromising critical systems', NOW(), 'instance', 'AST-001', 1.0, 2.5, 5.0, 'medium', 0.7, 0.8, 0.9, 'high', 0.6, 0.7, 0.8, 'medium', 0.3, 0.4, 0.5, 'medium', 1000000.0, 2500000.0, 5000000.0, 'high', 2000000.0, 800000.0),
(2, 'RISK-002', 'Data Breach', 'high', '{AST-001}', 'compliance', 'Risk of unauthorized access to customer data', NOW(), 'instance', 'AST-001', 0.5, 1.0, 2.0, 'medium', 0.5, 0.6, 0.7, 'medium', 0.5, 0.6, 0.7, 'medium', 0.4, 0.5, 0.6, 'medium', 500000.0, 1500000.0, 3000000.0, 'high', 900000.0, 450000.0);

INSERT INTO public.controls (id, control_id, name, control_type, control_category, implementation_status, effectiveness_rating, cost_per_year, description, created_at, item_type, risk_id, asset_id, monitoring_frequency, last_assessment_date, next_assessment_date, assigned_owner, implementation_notes, compliance_mapping, testing_frequency, notes) VALUES
(1, 'CTL-001', 'Endpoint Detection and Response', 'detective', 'technical', 'fully_implemented', 4, 150000.00, 'Advanced endpoint protection and monitoring', NOW(), 'instance', 1, 'AST-001', 'daily', NOW() - INTERVAL '30 days', NOW() + INTERVAL '90 days', 'Security Team', 'Deployed across all endpoints', '{SOX,PCI-DSS}', 'quarterly', 'High effectiveness control'),
(2, 'CTL-002', 'Data Encryption at Rest', 'preventive', 'technical', 'fully_implemented', 5, 75000.00, 'Database and file system encryption', NOW(), 'instance', 2, 'AST-001', 'weekly', NOW() - INTERVAL '15 days', NOW() + INTERVAL '60 days', 'Data Team', 'AES-256 encryption implemented', '{GDPR,PCI-DSS}', 'monthly', 'Critical control for data protection');

INSERT INTO public.risk_responses (id, risk_id, response_type, justification, assigned_controls, created_at, transfer_method, avoidance_strategy, acceptance_reason) VALUES
(1, 'RISK-001', 'mitigate', 'Implement comprehensive controls to reduce likelihood and impact', '{CTL-001}', NOW(), NULL, NULL, NULL),
(2, 'RISK-002', 'mitigate', 'Apply technical and administrative controls', '{CTL-002}', NOW(), NULL, NULL, NULL);

INSERT INTO public.activity_logs (id, activity, "user", entity, entity_type, entity_id, created_at) VALUES
(1, 'Database initialized', 'System', 'Production Database', 'system', 'SYS-001', NOW()),
(2, 'Sample data loaded', 'System', 'Sample Dataset', 'system', 'SYS-002', NOW());

-- Update sequences to current max values
SELECT setval('public.legal_entities_id_seq', (SELECT MAX(id) FROM public.legal_entities));
SELECT setval('public.assets_id_seq', (SELECT MAX(id) FROM public.assets));
SELECT setval('public.risks_id_seq', (SELECT MAX(id) FROM public.risks));
SELECT setval('public.controls_id_seq', (SELECT MAX(id) FROM public.controls));
SELECT setval('public.risk_responses_id_seq', (SELECT MAX(id) FROM public.risk_responses));
SELECT setval('public.activity_logs_id_seq', (SELECT MAX(id) FROM public.activity_logs));

SELECT 'Fresh sample data deployment completed successfully' AS status;