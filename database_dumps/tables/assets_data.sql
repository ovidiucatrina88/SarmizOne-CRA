--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (3, 'AST-003', 'customer database', 'data', 'business', 'tech-platform', 'high', 'low', 'high', 50000000.00, '{GDPR}', 'internal', '{}', 'Test description', '2025-05-04 18:37:54.176', 'USD', 10, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (14, 'AST-850', 'SIEM', 'application', 'Information Technology', 'Ovi', 'medium', 'medium', 'medium', 100000.00, '{}', 'internal', '{}', 'No description provided', '2025-05-21 16:09:48.78301', 'USD', 1, 'Company Group', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (15, 'AST-595', 'datalake', 'application', 'Information Technology', 'Ovi', 'medium', 'medium', 'medium', 100000.00, '{}', 'internal', '{}', 'No description provided', '2025-05-21 16:10:19.659471', 'USD', 1, 'Company Group', 'Active', 14, 'technical_component', 'Application');
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (19, 'TEST-003', 'Fixed Test Asset', 'application', 'Information Technology', 'Test Owner', 'medium', 'medium', 'medium', 20000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:57:12.604382', 'USD', 1, 'Test Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (20, 'FINAL-TEST', 'Final Production Test', 'application', 'Information Technology', 'Final Test', 'high', 'high', 'high', 25000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:57:24.309023', 'USD', 1, 'Test Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (21, 'PROD-READY-001', 'Production Ready Asset', 'application', 'Information Technology', 'Production Team', 'high', 'high', 'high', 75000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:59:04.196991', 'USD', 1, 'Main Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (9, 'AST-008', 'Test Server For Risk Recalculation', 'system', 'IT', 'Admin Team', 'high', 'high', 'high', 15000000.00, '{GDPR,PCI-DSS}', 'internal', '{}', 'Test server for demonstrating risk recalculation with SQL fix', '2025-05-15 21:29:48.956', 'USD', 60, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (5, 'AST-005', 'candidate Database', 'data', 'ovi', 'ovi', 'high', 'high', 'high', 10000000.00, '{GDPR}', 'internal', '{}', '0', '2025-05-12 20:40:52.303', 'EUR', 10, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (1, 'AST-001', 'SalesForce', 'application', 'CIT', 'Ovidiu', 'high', 'high', 'low', 50000000.00, '{GDPR}', 'external', '{}', 'my salesforce', '2025-04-29 21:46:52.224', 'USD', 1, 'Company Y US', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (11, 'AST-002', 'Web Application Server', 'application', 'IT', 'System Admin', 'medium', 'high', 'high', 30000000.00, '{PCI-DSS}', 'external', '{}', 'Public-facing web application server', '2025-05-15 23:12:38.221355', 'USD', 30, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) VALUES (8, 'AST-007', 'Another Test Server', 'system', 'IT', 'Admin Team', 'high', 'high', 'high', 1600000.00, '{GDPR,PCI-DSS}', 'internal', '{}', 'Another test server for demonstrating risk recalculation', '2025-05-15 21:27:45.325', 'USD', 60, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assets_id_seq', 21, true);


--
-- PostgreSQL database dump complete
--

