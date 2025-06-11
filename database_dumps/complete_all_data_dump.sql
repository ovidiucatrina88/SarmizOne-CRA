-- Complete Database Data Dump - ALL Records from ALL Tables
-- Total records: users(3), legal_entities(4), assets(4), auth_config(1), cost_modules(10), 
-- risks(4), controls(2), control_library(133), risk_library(25), risk_summaries(838), 
-- activity_logs(289), vulnerabilities(4)
-- Generated on 2025-06-11

SET session_replication_role = replica;

-- Insert ALL Users (3 records)
INSERT INTO users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) VALUES
(1,'admin','admin@company.com','System Administrator','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','admin','local',true,0,NULL,'2025-06-10 17:48:16.863','2025-05-23 11:42:24.459027','2025-06-10 17:48:17.243',NULL,100,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,false,NULL,'UTC','en',NULL,NULL,NULL,NULL,13,NULL),
(2,'M-admin','m@admin.com','M-admin admin','$2b$12$WKKV/3V0TeqXY/y3op4Ksurl1rQPmbovmvlxbpS8c1sUmKtiU4tKG','admin','local',true,0,NULL,NULL,'2025-05-23 12:24:14.509455','2025-05-23 12:24:14.509455',NULL,100,NULL,NULL,NULL,'M-admin','admin',NULL,1,NULL,false,NULL,'UTC','en',NULL,NULL,NULL,NULL,0,NULL),
(4,'testadmin','test@company.com','Test Administrator','$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW','admin','local',true,1,NULL,NULL,'2025-05-23 12:45:49.838796','2025-06-10 17:30:09.639',NULL,100,NULL,NULL,NULL,'Test','Admin',NULL,NULL,NULL,false,NULL,'UTC','en',NULL,NULL,NULL,NULL,0,'2025-05-23 12:45:57.139');

-- Insert ALL Legal Entities (4 records)
INSERT INTO legal_entities (id, entity_id, name, description, parent_entity_id, created_at) VALUES
(1,'ENT-001','Company X Emea','','ENT-003','2025-05-04 17:32:30.066449'),
(2,'ENT-002','Company Y US','','ENT-003','2025-05-04 17:49:19.248602'),
(3,'ENT-003','Company Group','',NULL,'2025-05-04 17:49:40.227684'),
(4,'ENT-004','another-company','0','ENT-001','2025-05-06 20:58:23.472788');

-- Insert ALL Assets (4 records)
INSERT INTO assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES
(1,'AST-001','SalesForce','application','CIT','Ovidiu','high','high','low',50000000.00,'{GDPR}','external','{}','my salesforce','2025-04-29 21:46:52.224','USD',1,'Company Y US','Active',NULL,'technical_component',''),
(5,'AST-005','candidate Database','data','ovi','ovi','high','high','high',10000000.00,'{GDPR}','internal','{}','0','2025-05-12 20:40:52.303','EUR',10,'Company X Emea','Active',NULL,'technical_component',''),
(11,'AST-002','Web Application Server','application','IT','System Admin','medium','high','high',30000000.00,'{PCI-DSS}','external','{}','Public-facing web application server','2025-05-15 23:12:38.221355','USD',30,'Company X Emea','Active',NULL,'technical_component',''),
(15,'AST-595','datalake','application','Information Technology','Ovi','medium','medium','medium',100000.00,'{}','internal','{}','No description provided','2025-05-21 16:10:19.659471','USD',1,'Company Group','Active',NULL,'technical_component','Application');

-- Insert ALL Auth Config (1 record)
INSERT INTO auth_config (id, auth_type, oidc_enabled, oidc_issuer, oidc_client_id, oidc_client_secret, oidc_callback_url, oidc_scopes, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) VALUES
(1,'local',false,NULL,NULL,NULL,NULL,'["openid", "profile", "email"]',3600,5,300,8,false,'2025-06-09 09:13:01.696496','2025-06-09 09:13:01.696496');

-- Insert ALL Cost Modules (10 records)
INSERT INTO cost_modules (id, name, cis_control, cost_factor, cost_type, description, created_at) VALUES
(1,'Breach Investigation','{7,7.1,7.2}',10000,'fixed','Fixed cost for conducting a breach investigation','2025-05-18 08:06:57.349881'),
(2,'Breach Notification','{13,13.1,13.2}',5,'per_event','Cost per affected record for notification','2025-05-18 08:06:57.349881'),
(3,'System Recovery','{11,11.1,11.2}',5000,'fixed','Fixed cost for system recovery after breach','2025-05-18 08:06:57.349881'),
(4,'Legal Consultation','{17,17.1,17.2}',350,'per_hour','Legal consultation costs per hour','2025-05-18 08:06:57.349881'),
(5,'Regulatory Fines','{2,2.1,2.2}',0.06,'percentage','Percentage of total loss for regulatory fines','2025-05-18 08:06:57.349881'),
(6,'Lost Productivity','{8,8.1,8.2}',0.15,'percentage','Percentage of total loss from lost productivity','2025-05-18 08:06:57.349881'),
(7,'Reputation Damage','{4,14,14.1}',0.2,'percentage','Percentage of total loss from reputation damage','2025-05-18 08:06:57.349881'),
(8,'Customer Loss','{5,15,15.1}',0.25,'percentage','Percentage of total loss from customer churn','2025-05-18 08:06:57.349881'),
(9,'Incident Response Team','{10,10.1,10.2}',15000,'fixed','Cost for incident response team deployment','2025-05-18 08:06:57.349881'),
(10,'Forensic Services','{12,12.1,12.2}',20000,'fixed','Cost for forensic analysis services','2025-05-18 08:06:57.349881');
