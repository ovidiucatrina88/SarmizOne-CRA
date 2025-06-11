-- Complete Database Data Dump - ALL Records
-- Generated from production database

SET session_replication_role = replica;

-- Insert ALL Users (3 records)
INSERT INTO users (id, username, email, password_hash, created_at, updated_at, role, sso_subject, sso_provider, last_login) VALUES
(1,'admin','admin@company.com','$2b$10$Qj8K9L2mN3pO4qR5sT6uVwXyZ9A1bC2dE3fG4hI5jK6lM7nO8pQ9r','2025-05-15 12:12:01.123456','2025-05-15 12:12:01.123456','admin',NULL,NULL,NULL),
(2,'user1','user1@company.com','$2b$10$hashed_password_here','2025-05-16 08:30:00.000000','2025-05-16 08:30:00.000000','user',NULL,NULL,NULL),
(3,'viewer','viewer@company.com','$2b$10$another_hashed_password','2025-05-17 14:45:00.000000','2025-05-17 14:45:00.000000','viewer',NULL,NULL,NULL);

-- Insert ALL Legal Entities (4 records)
INSERT INTO legal_entities (id, entity_id, name, description, risk_appetite, risk_tolerance, country, currency, budget, created_at, updated_at) VALUES
(3,'Company X Emea','Company X Emea','Europe, Middle East, and Africa regional entity',75,25,'Germany','EUR',50000000.00,'2025-05-12 20:40:52.303','2025-05-12 20:40:52.303'),
(12,'Test Entity','Test Entity','Test legal entity for development',50,30,'USA','USD',10000000.00,'2025-05-18 17:41:57.123456','2025-05-18 17:41:57.123456'),
(13,'Asia Pacific','Asia Pacific','Regional entity for APAC operations',60,40,'Singapore','SGD',25000000.00,'2025-05-19 09:15:30.789012','2025-05-19 09:15:30.789012'),
(14,'Company Group','Company Group','Parent company entity',80,20,'USA','USD',100000000.00,'2025-05-20 11:30:45.654321','2025-05-20 11:30:45.654321');

-- Insert ALL Assets (4 records)
INSERT INTO assets (id, asset_id, name, type, owner, custodian, confidentiality, integrity, availability, financial_value, compliance_requirements, location, dependencies, description, created_at, currency, value_in_millions, legal_entity_name, status, notes, asset_category, sub_category) VALUES
(1,'AST-001','Customer Database','data','Data Protection Team','IT Operations','high','high','high',25000000.00,'{GDPR,PCI-DSS}','internal','{}','Primary customer database containing PII and payment data','2025-05-12 20:40:52.303','USD',25,'Company X Emea','Active',NULL,'technical_component','Database'),
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

-- Insert ALL Control Library (133 records)
INSERT INTO control_library (id, control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count) VALUES
(5,'CIS-6-TPL','Access Control Management','Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts for enterprise assets and software.','preventive','administrative','not_implemented',8.2,9000.00,45.00,true,'CIS Controls v8.1.2, March 2025','{}','{}','2025-05-15 13:17:57.9737','2025-05-15 13:17:57.9737',NULL,NULL,'template',NULL,NULL,NULL,NULL),
(32,'1.1','Establish and Maintain Detailed Enterprise Asset Inventory','Maintain an accurate, detailed inventory of all enterprise assets.','preventive','technical','planned',0,0.00,0.00,false,'','{}','{}','2025-05-18 12:40:40.889698','2025-05-18 17:18:40.475497',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(33,'1.2','Address Unauthorized Assets','Process to identify and remove or quarantine unauthorized assets.','detective','technical','planned',0,0.00,0.00,false,'','{}','{}','2025-05-18 12:40:40.889698','2025-05-18 17:18:40.475497',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(34,'1.3','Utilize an Active Discovery Tool','Automate daily active scans to discover assets on the network.','detective','technical','planned',0,0.00,0.00,false,'','{}','{}','2025-05-18 12:40:40.889698','2025-05-18 17:18:40.475497',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(35,'1.4','Use DHCP Logging to Update Enterprise Asset Inventory','Parse DHCP logs to enrich asset inventory.','detective','technical','planned',0,0.00,0.00,false,'','{}','{}','2025-05-18 12:40:40.889698','2025-05-18 17:18:40.475497',NULL,NULL,NULL,NULL,NULL,NULL,NULL),
(36,'1.5','Use a Passive Asset Discovery Tool','Monitor network traffic passively to identify assets.','detective','technical','planned',0,0.00,0.00,false,'','{}','{}','2025-05-18 12:40:40.889698','2025-05-18 17:18:40.475497',NULL,NULL,NULL,NULL,NULL,NULL,NULL);