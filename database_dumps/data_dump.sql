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
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.activity_logs VALUES (1, 'Added new asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-04-29 21:46:52.406');
INSERT INTO public.activity_logs VALUES (2, 'Added new asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-04-29 21:48:37.074');
INSERT INTO public.activity_logs VALUES (3, 'Added new risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-04-29 22:13:11.07');
INSERT INTO public.activity_logs VALUES (4, 'Added new control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-04-29 22:15:33.962');
INSERT INTO public.activity_logs VALUES (5, 'Added risk response', 'System User', 'Response for RISK-001', 'response', 'RISK-001', '2025-04-29 22:16:14.908');
INSERT INTO public.activity_logs VALUES (6, 'Updated control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-04-29 22:18:13.67');
INSERT INTO public.activity_logs VALUES (7, 'Updated control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-04-29 22:53:47.941');
INSERT INTO public.activity_logs VALUES (8, 'Updated asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-04-29 22:54:11.387');
INSERT INTO public.activity_logs VALUES (9, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-04-29 23:08:12.091');
INSERT INTO public.activity_logs VALUES (10, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-04-29 23:08:32.738');
INSERT INTO public.activity_logs VALUES (11, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 10:56:49.521');
INSERT INTO public.activity_logs VALUES (12, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 11:26:39.333');
INSERT INTO public.activity_logs VALUES (13, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 11:42:05.297');
INSERT INTO public.activity_logs VALUES (14, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-04 11:42:23.686');
INSERT INTO public.activity_logs VALUES (15, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 11:45:03.987');
INSERT INTO public.activity_logs VALUES (16, 'Added new legal entity', 'System User', 'Company X Emea', 'legal_entity', 'ENT-001', '2025-05-04 17:32:30.102');
INSERT INTO public.activity_logs VALUES (17, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-04 17:39:19.033');
INSERT INTO public.activity_logs VALUES (18, 'Updated asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-05-04 17:39:22.392');
INSERT INTO public.activity_logs VALUES (19, 'Added new legal entity', 'System User', 'Company Y US', 'legal_entity', 'ENT-002', '2025-05-04 17:49:19.28');
INSERT INTO public.activity_logs VALUES (20, 'Added new legal entity', 'System User', 'Company Group', 'legal_entity', 'ENT-003', '2025-05-04 17:49:40.252');
INSERT INTO public.activity_logs VALUES (21, 'Updated legal entity', 'System User', 'Company X Emea', 'legal_entity', 'ENT-001', '2025-05-04 17:49:52.75');
INSERT INTO public.activity_logs VALUES (22, 'Updated legal entity', 'System User', 'Company Y US', 'legal_entity', 'ENT-002', '2025-05-04 17:50:06.777');
INSERT INTO public.activity_logs VALUES (23, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-04 17:50:20.447');
INSERT INTO public.activity_logs VALUES (24, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-04 18:26:03.809');
INSERT INTO public.activity_logs VALUES (25, 'Updated asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-05-04 18:29:52.085');
INSERT INTO public.activity_logs VALUES (26, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-04 18:32:40.047');
INSERT INTO public.activity_logs VALUES (27, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 18:33:23.072');
INSERT INTO public.activity_logs VALUES (28, 'Added new asset', 'System User', 'customer database', 'asset', 'AST-003', '2025-05-04 18:37:54.225');
INSERT INTO public.activity_logs VALUES (29, 'Updated risk', 'System User', 'Data leakage, unauthorized access', 'risk', 'RISK-DATA-LEAKAGE--U-151', '2025-05-04 18:39:56.802');
INSERT INTO public.activity_logs VALUES (30, 'Updated risk', 'System User', 'Data leakage, unauthorized access', 'risk', 'RISK-DATA-LEAKAGE--U-151', '2025-05-04 19:48:07.735');
INSERT INTO public.activity_logs VALUES (31, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 19:54:35.395');
INSERT INTO public.activity_logs VALUES (32, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:00:26.156');
INSERT INTO public.activity_logs VALUES (33, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:00:57.024');
INSERT INTO public.activity_logs VALUES (34, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:01:04.252');
INSERT INTO public.activity_logs VALUES (35, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:01:04.309');
INSERT INTO public.activity_logs VALUES (36, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:02:02.822');
INSERT INTO public.activity_logs VALUES (37, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:22:16.036');
INSERT INTO public.activity_logs VALUES (38, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-04 20:25:36.984');
INSERT INTO public.activity_logs VALUES (39, 'Updated risk', 'System User', 'Unauthorized access, privilege escalation', 'risk', 'RISK-UNAUTHORIZED-AC-969', '2025-05-04 20:35:02.788');
INSERT INTO public.activity_logs VALUES (40, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 21:18:38.537');
INSERT INTO public.activity_logs VALUES (41, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-04 21:18:44.635');
INSERT INTO public.activity_logs VALUES (42, 'Updated risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277', '2025-05-04 21:18:54.942');
INSERT INTO public.activity_logs VALUES (43, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-04 21:19:32.237');
INSERT INTO public.activity_logs VALUES (44, 'Updated risk', 'System User', 'Uncoordinated response, delayed recovery', 'risk', 'RISK-UNCOORDINATED-R-583', '2025-05-04 21:19:41.298');
INSERT INTO public.activity_logs VALUES (45, 'Updated risk', 'System User', 'Unsegmented network, rogue devices', 'risk', 'RISK-UNSEGMENTED-NET-571', '2025-05-04 21:25:29.079');
INSERT INTO public.activity_logs VALUES (46, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-04 21:25:56.219');
INSERT INTO public.activity_logs VALUES (47, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-04 21:29:25.497');
INSERT INTO public.activity_logs VALUES (48, 'Updated risk', 'System User', 'Third-party risk, vendor compromise', 'risk', 'RISK-THIRD-PARTY-RIS-177', '2025-05-04 22:09:46.35');
INSERT INTO public.activity_logs VALUES (49, 'Updated risk', 'System User', 'Unauthorized software, unpatched vulnerabilities', 'risk', 'RISK-UNAUTHORIZED-SO-757', '2025-05-04 22:10:43.325');
INSERT INTO public.activity_logs VALUES (50, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-04 22:12:07.668');
INSERT INTO public.activity_logs VALUES (51, 'Updated risk', 'System User', 'Phishing attacks, malware delivery', 'risk', 'RISK-PHISHING-ATTACK-407', '2025-05-05 15:03:54.553');
INSERT INTO public.activity_logs VALUES (52, 'Updated risk', 'System User', 'Lack of visibility, undetected breaches', 'risk', 'RISK-LACK-OF-VISIBIL-973', '2025-05-05 15:04:31.805');
INSERT INTO public.activity_logs VALUES (53, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-05 15:31:16.218');
INSERT INTO public.activity_logs VALUES (54, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-05 15:31:50.143');
INSERT INTO public.activity_logs VALUES (55, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-05 15:37:54.236');
INSERT INTO public.activity_logs VALUES (56, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-05 15:46:51.891');
INSERT INTO public.activity_logs VALUES (57, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-05 15:47:46.294');
INSERT INTO public.activity_logs VALUES (58, 'Added new legal entity', 'System User', 'another-company', 'legal_entity', 'ENT-004', '2025-05-06 20:58:23.497');
INSERT INTO public.activity_logs VALUES (59, 'Added new asset', 'System User', 'moreassets', 'asset', 'AST-004', '2025-05-06 21:06:03.396');
INSERT INTO public.activity_logs VALUES (60, 'Updated risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-06 21:18:51.801');
INSERT INTO public.activity_logs VALUES (61, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-12 11:25:40.912');
INSERT INTO public.activity_logs VALUES (62, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-12 11:26:28.017');
INSERT INTO public.activity_logs VALUES (63, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-12 11:27:14.171');
INSERT INTO public.activity_logs VALUES (64, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-12 11:27:14.502');
INSERT INTO public.activity_logs VALUES (65, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-12 11:27:14.745');
INSERT INTO public.activity_logs VALUES (66, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 11:32:41.098');
INSERT INTO public.activity_logs VALUES (67, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 11:33:40.546');
INSERT INTO public.activity_logs VALUES (68, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 12:02:02.24');
INSERT INTO public.activity_logs VALUES (69, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 12:02:04.174');
INSERT INTO public.activity_logs VALUES (70, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 12:02:05.624');
INSERT INTO public.activity_logs VALUES (71, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-12 12:02:06.832');
INSERT INTO public.activity_logs VALUES (72, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:44:45.384');
INSERT INTO public.activity_logs VALUES (73, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:45:14.42');
INSERT INTO public.activity_logs VALUES (74, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:45:53.789');
INSERT INTO public.activity_logs VALUES (75, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:50:57.288');
INSERT INTO public.activity_logs VALUES (76, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:51:08.087');
INSERT INTO public.activity_logs VALUES (77, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:58:55.354');
INSERT INTO public.activity_logs VALUES (78, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 12:59:09.088');
INSERT INTO public.activity_logs VALUES (79, 'Updated risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277', '2025-05-12 13:50:11.364');
INSERT INTO public.activity_logs VALUES (80, 'Updated risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277', '2025-05-12 13:50:53.536');
INSERT INTO public.activity_logs VALUES (81, 'Updated control', 'System User', 'Malware Defenses', 'control', 'CIS-10', '2025-05-12 17:28:44.091');
INSERT INTO public.activity_logs VALUES (82, 'Updated control', 'System User', 'Malware Defenses', 'control', 'CIS-10', '2025-05-12 17:38:35.364');
INSERT INTO public.activity_logs VALUES (83, 'Updated risk response', 'System User', 'Response for RISK-001', 'response', 'RISK-001', '2025-05-12 17:46:58.8');
INSERT INTO public.activity_logs VALUES (84, 'Updated risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-12 17:51:06.551');
INSERT INTO public.activity_logs VALUES (85, 'Updated control', 'System User', 'Malware Defenses', 'control', 'CIS-10', '2025-05-12 17:52:09.112');
INSERT INTO public.activity_logs VALUES (86, 'Updated asset', 'System User', 'customer database', 'asset', 'AST-003', '2025-05-12 17:53:22.62');
INSERT INTO public.activity_logs VALUES (87, 'Updated asset', 'System User', 'customer database', 'asset', 'AST-003', '2025-05-12 17:53:35.033');
INSERT INTO public.activity_logs VALUES (88, 'Updated asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-05-12 17:53:44.523');
INSERT INTO public.activity_logs VALUES (89, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 18:00:05.69');
INSERT INTO public.activity_logs VALUES (90, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 18:12:00.54');
INSERT INTO public.activity_logs VALUES (91, 'Updated control', 'System User', 'Malware Defenses', 'control', 'CIS-10', '2025-05-12 18:21:24.148');
INSERT INTO public.activity_logs VALUES (92, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 18:33:32.87');
INSERT INTO public.activity_logs VALUES (93, 'Updated risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-12 20:10:40.465');
INSERT INTO public.activity_logs VALUES (94, 'Updated control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-05-12 20:13:15.932');
INSERT INTO public.activity_logs VALUES (95, 'Added new asset', 'System User', 'candidate Database', 'asset', 'AST-005', '2025-05-12 20:40:52.347');
INSERT INTO public.activity_logs VALUES (96, 'Updated control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-05-12 22:48:59.475');
INSERT INTO public.activity_logs VALUES (97, 'Updated risk', 'System User', 'Uncoordinated response, delayed recovery', 'risk', 'RISK-UNCOORDINATED-R-583', '2025-05-13 12:54:49.323');
INSERT INTO public.activity_logs VALUES (98, 'Updated risk', 'System User', 'Unsegmented network, rogue devices', 'risk', 'RISK-UNSEGMENTED-NET-571', '2025-05-13 13:16:25.762');
INSERT INTO public.activity_logs VALUES (99, 'Updated risk', 'System User', 'Third-party risk, vendor compromise', 'risk', 'RISK-THIRD-PARTY-RIS-177', '2025-05-13 13:16:46.162');
INSERT INTO public.activity_logs VALUES (100, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 13:16:57.4');
INSERT INTO public.activity_logs VALUES (101, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 13:17:25.101');
INSERT INTO public.activity_logs VALUES (102, 'Updated risk', 'System User', 'Phishing attacks, malware delivery', 'risk', 'RISK-PHISHING-ATTACK-407', '2025-05-13 13:19:55.418');
INSERT INTO public.activity_logs VALUES (103, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:20:31.827');
INSERT INTO public.activity_logs VALUES (104, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:20:50.606');
INSERT INTO public.activity_logs VALUES (105, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:20:59.725');
INSERT INTO public.activity_logs VALUES (106, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:21:30.852');
INSERT INTO public.activity_logs VALUES (107, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:21:42.775');
INSERT INTO public.activity_logs VALUES (108, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:26:24.967');
INSERT INTO public.activity_logs VALUES (109, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:26:44.221');
INSERT INTO public.activity_logs VALUES (110, 'Updated risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-13 13:27:05.256');
INSERT INTO public.activity_logs VALUES (111, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 13:34:34.94');
INSERT INTO public.activity_logs VALUES (112, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 13:34:34.973');
INSERT INTO public.activity_logs VALUES (113, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:07:40.067');
INSERT INTO public.activity_logs VALUES (114, 'Updated risk', 'System User', 'Lack of visibility, undetected breaches', 'risk', 'RISK-LACK-OF-VISIBIL-973', '2025-05-13 14:09:59.628');
INSERT INTO public.activity_logs VALUES (115, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:11:08.762');
INSERT INTO public.activity_logs VALUES (116, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:22:49.308');
INSERT INTO public.activity_logs VALUES (117, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:31:20.456');
INSERT INTO public.activity_logs VALUES (118, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:47:05.893');
INSERT INTO public.activity_logs VALUES (119, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:57:26.341');
INSERT INTO public.activity_logs VALUES (120, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 14:58:54.629');
INSERT INTO public.activity_logs VALUES (121, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 15:04:59.977');
INSERT INTO public.activity_logs VALUES (122, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 15:14:34.187');
INSERT INTO public.activity_logs VALUES (123, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:21:30.98');
INSERT INTO public.activity_logs VALUES (124, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:21:31.206');
INSERT INTO public.activity_logs VALUES (125, 'Updated control', 'System User', 'Account Management', 'control', 'CIS-5', '2025-05-13 16:22:11.461');
INSERT INTO public.activity_logs VALUES (126, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:22:35.076');
INSERT INTO public.activity_logs VALUES (127, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:24:23.028');
INSERT INTO public.activity_logs VALUES (128, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:28:26.584');
INSERT INTO public.activity_logs VALUES (129, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 16:43:01.706');
INSERT INTO public.activity_logs VALUES (130, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 17:24:57.441');
INSERT INTO public.activity_logs VALUES (131, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 17:59:05.372');
INSERT INTO public.activity_logs VALUES (132, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 18:15:53.606');
INSERT INTO public.activity_logs VALUES (133, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 18:16:00.451');
INSERT INTO public.activity_logs VALUES (134, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 18:16:00.937');
INSERT INTO public.activity_logs VALUES (135, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-13 18:16:11.536');
INSERT INTO public.activity_logs VALUES (136, 'Updated risk', 'System User', 'Uncoordinated response, delayed recovery', 'risk', 'RISK-UNCOORDINATED-R-583', '2025-05-14 15:04:16.041');
INSERT INTO public.activity_logs VALUES (137, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-14 15:50:30.55');
INSERT INTO public.activity_logs VALUES (138, 'Updated risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277', '2025-05-14 15:51:37.201');
INSERT INTO public.activity_logs VALUES (139, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-14 15:57:10.772');
INSERT INTO public.activity_logs VALUES (140, 'Updated risk', 'System User', 'Lack of visibility, undetected breaches', 'risk', 'RISK-LACK-OF-VISIBIL-973', '2025-05-15 08:08:48.619');
INSERT INTO public.activity_logs VALUES (141, 'Updated risk', 'System User', 'Phishing attacks, malware delivery', 'risk', 'RISK-PHISHING-ATTACK-407', '2025-05-15 08:39:50.379');
INSERT INTO public.activity_logs VALUES (142, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 12:19:43.266');
INSERT INTO public.activity_logs VALUES (143, 'Deleted risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276-TPL-Z6I', '2025-05-15 13:06:49.215');
INSERT INTO public.activity_logs VALUES (144, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:32:31.803');
INSERT INTO public.activity_logs VALUES (145, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:32:32.989');
INSERT INTO public.activity_logs VALUES (146, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:32:35.294');
INSERT INTO public.activity_logs VALUES (147, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:32:37.937');
INSERT INTO public.activity_logs VALUES (148, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:32:39.73');
INSERT INTO public.activity_logs VALUES (149, 'Updated risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-15 13:46:54.068');
INSERT INTO public.activity_logs VALUES (150, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 20:48:20.765');
INSERT INTO public.activity_logs VALUES (151, 'Updated asset', 'System User', 'candidate Database', 'asset', 'AST-005', '2025-05-15 20:48:36.496');
INSERT INTO public.activity_logs VALUES (152, 'Updated asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-05-15 20:48:54.74');
INSERT INTO public.activity_logs VALUES (153, 'Updated risk', 'System User', 'Phishing attacks, malware delivery', 'risk', 'RISK-PHISHING-ATTACK-407', '2025-05-15 20:55:16.802');
INSERT INTO public.activity_logs VALUES (154, 'Deleted asset', 'System User', 'Jobseeker-database', 'asset', 'AST-002', '2025-05-15 20:56:39.101');
INSERT INTO public.activity_logs VALUES (155, 'Updated asset', 'System User', 'candidate Database', 'asset', 'AST-005', '2025-05-15 21:04:54.157');
INSERT INTO public.activity_logs VALUES (156, 'Updated risk', 'System User', 'Test Risk', 'risk', 'RISK-DATA-LEAKAGE--U-151', '2025-05-15 21:10:32.15');
INSERT INTO public.activity_logs VALUES (157, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 21:12:55.17');
INSERT INTO public.activity_logs VALUES (158, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 21:13:16.554');
INSERT INTO public.activity_logs VALUES (159, 'Updated risk', 'System User', 'Test Risk', 'risk', 'RISK-DATA-LEAKAGE--U-151', '2025-05-15 21:14:19.085');
INSERT INTO public.activity_logs VALUES (160, 'Updated risk', 'System User', 'Unmanaged devices, shadow IT', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-15 21:16:02.869');
INSERT INTO public.activity_logs VALUES (161, 'Updated asset', 'System User', 'moreassets', 'asset', 'AST-004', '2025-05-15 21:24:52.571');
INSERT INTO public.activity_logs VALUES (162, 'Added new asset', 'System User', 'New Test Server', 'asset', 'AST-006', '2025-05-15 21:27:16.076');
INSERT INTO public.activity_logs VALUES (163, 'Added new asset', 'System User', 'Another Test Server', 'asset', 'AST-007', '2025-05-15 21:27:45.367');
INSERT INTO public.activity_logs VALUES (164, 'Added new asset', 'System User', 'Test Server For Risk Recalculation', 'asset', 'AST-008', '2025-05-15 21:29:49.001');
INSERT INTO public.activity_logs VALUES (165, 'Added new asset', 'System User', 'Final Test Server', 'asset', 'AST-009', '2025-05-15 21:31:30.276');
INSERT INTO public.activity_logs VALUES (166, 'Updated asset', 'System User', 'candidate Database', 'asset', 'AST-005', '2025-05-15 22:26:17.479');
INSERT INTO public.activity_logs VALUES (167, 'Updated asset', 'System User', 'customer database', 'asset', 'AST-003', '2025-05-15 22:37:03.899');
INSERT INTO public.activity_logs VALUES (168, 'Updated asset', 'System User', 'moreassets', 'asset', 'AST-004', '2025-05-15 22:38:33.45');
INSERT INTO public.activity_logs VALUES (169, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 22:41:48.478');
INSERT INTO public.activity_logs VALUES (170, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 22:54:27.353');
INSERT INTO public.activity_logs VALUES (171, 'Updated asset', 'System User', 'SalesForce', 'asset', 'AST-001', '2025-05-15 22:54:49.536');
INSERT INTO public.activity_logs VALUES (172, 'Updated risk', 'System User', 'Unauthorized access, privilege escalation', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-15 22:55:54.49');
INSERT INTO public.activity_logs VALUES (173, 'Updated risk', 'System User', 'Insecure software, OWASP Top 10', 'risk', 'RISK-INSECURE-SOFTWA-165', '2025-05-15 22:56:43.79');
INSERT INTO public.activity_logs VALUES (174, 'Updated control', 'System User', 'Service Provider Management', 'control', 'CIS-15', '2025-05-15 22:57:49.068');
INSERT INTO public.activity_logs VALUES (175, 'Updated asset', 'System User', 'New Test Server', 'asset', 'AST-006', '2025-05-15 23:41:58.284');
INSERT INTO public.activity_logs VALUES (176, 'Updated asset', 'System User', 'New Test Server', 'asset', 'AST-006', '2025-05-15 23:42:12.873');
INSERT INTO public.activity_logs VALUES (177, 'Updated control', 'System User', 'Endpoint Detection & Response', 'control', 'CTL-001', '2025-05-15 23:59:27.54');
INSERT INTO public.activity_logs VALUES (178, 'Created risk "Data breach of customer PII" from template and assigned to asset AST-003', 'system', '32', 'risk', 'RL-DATA-BREACH-001-994', '2025-05-18 12:58:35.549872');
INSERT INTO public.activity_logs VALUES (179, 'Created risk "Data breach of customer PII" from template and assigned to asset AST-003', 'system', '33', 'risk', 'RL-DATA-BREACH-001-074', '2025-05-18 13:10:50.082006');
INSERT INTO public.activity_logs VALUES (180, 'Created risk "Data breach of customer PII" from template and assigned to asset AST-005', 'system', '34', 'risk', 'RL-DATA-BREACH-001-780', '2025-05-18 13:12:18.916944');
INSERT INTO public.activity_logs VALUES (181, 'Created risk "Data breach of customer PII" from template and assigned to asset AST-005', 'system', '35', 'risk', 'RL-DATA-BREACH-001-865', '2025-05-18 13:26:37.196685');
INSERT INTO public.activity_logs VALUES (182, 'Created risk "Unsegmented network, rogue devices" from template and assigned to asset AST-008', 'system', '36', 'risk', 'RISK-UNSEGMENTED-NET-571-657', '2025-05-18 13:33:02.591615');
INSERT INTO public.activity_logs VALUES (183, 'Created risk "Exploited software flaws" from template and assigned to asset AST-007', 'system', '37', 'risk', 'RISK-EXPLOITED-SOFTW-277-197', '2025-05-18 13:35:21.911615');
INSERT INTO public.activity_logs VALUES (184, 'Deleted risk', 'System User', '', 'risk', 'RISK-1920', '2025-05-18 13:50:26.842165');
INSERT INTO public.activity_logs VALUES (185, 'Deleted risk', 'System User', 'template-ransomware', 'risk', 'RISK-6560', '2025-05-18 13:50:30.120876');
INSERT INTO public.activity_logs VALUES (186, 'Deleted risk', 'System User', 'test=tempalte', 'risk', 'RISK-7135', '2025-05-18 13:50:32.514825');
INSERT INTO public.activity_logs VALUES (187, 'Deleted risk', 'System User', 'test-template', 'risk', 'RISK-2124', '2025-05-18 13:50:34.943633');
INSERT INTO public.activity_logs VALUES (188, 'Deleted risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-994', '2025-05-18 13:50:38.355695');
INSERT INTO public.activity_logs VALUES (189, 'Deleted risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-074', '2025-05-18 13:50:39.988494');
INSERT INTO public.activity_logs VALUES (190, 'Deleted risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-780', '2025-05-18 13:50:41.576646');
INSERT INTO public.activity_logs VALUES (191, 'Deleted risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-865', '2025-05-18 13:50:43.099901');
INSERT INTO public.activity_logs VALUES (192, 'Deleted risk', 'System User', 'Unsegmented network, rogue devices', 'risk', 'RISK-UNSEGMENTED-NET-571-657', '2025-05-18 13:50:44.718512');
INSERT INTO public.activity_logs VALUES (193, 'Deleted risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277-197', '2025-05-18 13:50:51.013855');
INSERT INTO public.activity_logs VALUES (194, 'Deleted risk', 'System User', 'hacking of webserver', 'risk', 'RISK-3248', '2025-05-18 13:50:55.763468');
INSERT INTO public.activity_logs VALUES (195, 'Deleted risk', 'System User', '', 'risk', 'RISK-6191', '2025-05-18 13:50:57.991655');
INSERT INTO public.activity_logs VALUES (196, 'Deleted risk', 'System User', '', 'risk', 'RISK-5524', '2025-05-18 13:51:00.604068');
INSERT INTO public.activity_logs VALUES (197, 'Deleted risk', 'System User', '', 'risk', 'RISK-407', '2025-05-18 13:51:03.377594');
INSERT INTO public.activity_logs VALUES (198, 'Deleted risk', 'System User', 'Test Risk', 'risk', 'RISK-DATA-LEAKAGE--U-151', '2025-05-18 13:51:29.172353');
INSERT INTO public.activity_logs VALUES (199, 'Deleted risk', 'System User', 'Ransomware, trojans', 'risk', 'RISK-RANSOMWARE--TRO-529', '2025-05-18 13:51:35.841');
INSERT INTO public.activity_logs VALUES (200, 'Deleted risk', 'System User', 'Lack of visibility, undetected breaches', 'risk', 'RISK-LACK-OF-VISIBIL-973', '2025-05-18 14:33:07.693013');
INSERT INTO public.activity_logs VALUES (201, 'Deleted risk', 'System User', 'Exploited software flaws', 'risk', 'RISK-EXPLOITED-SOFTW-277', '2025-05-18 14:33:13.59792');
INSERT INTO public.activity_logs VALUES (202, 'Deleted risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276-TPL-RL6', '2025-05-18 14:33:29.879057');
INSERT INTO public.activity_logs VALUES (203, 'Deleted risk', 'System User', 'Misconfigurations, default credentials', 'risk', 'RISK-MISCONFIGURATIO-345', '2025-05-18 14:33:32.882656');
INSERT INTO public.activity_logs VALUES (204, 'Deleted risk', 'System User', 'Unauthorized access, privilege escalation', 'risk', 'RISK-UNAUTHORIZED-AC-969', '2025-05-18 14:33:34.878198');
INSERT INTO public.activity_logs VALUES (205, 'Deleted risk', 'System User', 'Phishing, social engineering', 'risk', 'RISK-PHISHING--SOCIA-698', '2025-05-18 14:33:38.234003');
INSERT INTO public.activity_logs VALUES (206, 'Deleted risk', 'System User', 'Third-party risk, vendor compromise', 'risk', 'RISK-THIRD-PARTY-RIS-177', '2025-05-18 14:33:45.064064');
INSERT INTO public.activity_logs VALUES (207, 'Deleted risk', 'System User', 'Ransomware Attack on Core Systems', 'risk', 'RISK-001', '2025-05-18 14:33:47.643462');
INSERT INTO public.activity_logs VALUES (208, 'Deleted risk', 'System User', 'Phishing attacks, malware delivery', 'risk', 'RISK-PHISHING-ATTACK-407', '2025-05-18 14:33:50.233032');
INSERT INTO public.activity_logs VALUES (209, 'Deleted risk', 'System User', 'Insecure software, OWASP Top 10', 'risk', 'RISK-INSECURE-SOFTWA-165', '2025-05-18 14:33:52.390406');
INSERT INTO public.activity_logs VALUES (210, 'Deleted risk', 'System User', 'Unauthorized software, unpatched vulnerabilities', 'risk', 'RISK-UNAUTHORIZED-SO-757', '2025-05-18 14:33:54.906556');
INSERT INTO public.activity_logs VALUES (211, 'Deleted risk', 'System User', 'Unsegmented network, rogue devices', 'risk', 'RISK-UNSEGMENTED-NET-571', '2025-05-18 14:34:13.68216');
INSERT INTO public.activity_logs VALUES (212, 'Deleted risk', 'System User', 'Uncoordinated response, delayed recovery', 'risk', 'RISK-UNCOORDINATED-R-583', '2025-05-18 14:34:22.167351');
INSERT INTO public.activity_logs VALUES (213, 'Deleted risk', 'System User', 'Orphaned accounts, excessive privileges', 'risk', 'RISK-ORPHANED-ACCOUN-276', '2025-05-18 14:34:24.390982');
INSERT INTO public.activity_logs VALUES (214, 'Deleted risk', 'System User', 'Unknown vulnerabilities', 'risk', 'RISK-UNKNOWN-VULNERA-913', '2025-05-18 14:34:26.698724');
INSERT INTO public.activity_logs VALUES (215, 'Deleted risk', 'System User', 'Unauthorized access, privilege escalation', 'risk', 'RISK-UNMANAGED-DEVIC-414', '2025-05-18 14:34:28.615301');
INSERT INTO public.activity_logs VALUES (216, 'Created risk "Data breach of customer PII" from template and assigned to asset AST-003', 'system', '38', 'risk', 'RL-DATA-BREACH-001-262', '2025-05-18 14:35:33.163954');
INSERT INTO public.activity_logs VALUES (217, 'Updated risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-262', '2025-05-18 15:01:42.597972');
INSERT INTO public.activity_logs VALUES (218, 'Updated risk', 'System User', 'Data breach of customer PII', 'risk', 'RL-DATA-BREACH-001-262', '2025-05-18 15:01:42.85018');
INSERT INTO public.activity_logs VALUES (223, 'delete', 'System User', 'Control', 'control', '17', '2025-05-18 17:34:00.738615');
INSERT INTO public.activity_logs VALUES (224, 'delete', 'System User', 'Control', 'control', '18', '2025-05-18 19:49:44.563231');
INSERT INTO public.activity_logs VALUES (225, 'delete', 'System User', 'Control', 'control', '19', '2025-05-18 19:49:47.205544');
INSERT INTO public.activity_logs VALUES (226, 'delete', 'System User', 'Control', 'control', '3', '2025-05-18 19:49:49.507262');
INSERT INTO public.activity_logs VALUES (227, 'delete', 'System User', 'Control', 'control', '6', '2025-05-18 19:49:51.518787');
INSERT INTO public.activity_logs VALUES (228, 'delete', 'System User', 'Control', 'control', '20', '2025-05-18 19:49:55.018516');
INSERT INTO public.activity_logs VALUES (229, 'delete', 'System User', 'Control', 'control', '1', '2025-05-18 19:49:57.061867');
INSERT INTO public.activity_logs VALUES (230, 'create', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 19:50:06.956534');
INSERT INTO public.activity_logs VALUES (231, 'associate', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 19:50:07.075915');
INSERT INTO public.activity_logs VALUES (232, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 19:50:36.251322');
INSERT INTO public.activity_logs VALUES (233, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 19:51:20.618116');
INSERT INTO public.activity_logs VALUES (234, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 20:54:51.590071');
INSERT INTO public.activity_logs VALUES (235, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 21:26:56.987567');
INSERT INTO public.activity_logs VALUES (236, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-18 21:31:17.438649');
INSERT INTO public.activity_logs VALUES (237, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-19 10:49:53.24621');
INSERT INTO public.activity_logs VALUES (238, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-19 10:56:31.162195');
INSERT INTO public.activity_logs VALUES (239, 'update', 'System User', 'Encrypt Sensitive Data at Rest', 'control', '21', '2025-05-19 10:58:57.917743');
INSERT INTO public.activity_logs VALUES (240, 'Response created', 'System', 'Response 2', 'response', '2', '2025-05-19 18:47:50.98');
INSERT INTO public.activity_logs VALUES (241, 'create', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '22', '2025-05-22 14:48:09.98278');
INSERT INTO public.activity_logs VALUES (242, 'create', 'System User', 'Establish and Maintain Malware Defense Process', 'control', '23', '2025-05-22 14:54:28.856989');
INSERT INTO public.activity_logs VALUES (243, 'delete', 'System User', 'Control', 'control', '22', '2025-05-22 14:55:03.518401');
INSERT INTO public.activity_logs VALUES (244, 'delete', 'System User', 'Control', 'control', '23', '2025-05-22 14:55:06.137702');
INSERT INTO public.activity_logs VALUES (245, 'create', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 14:55:21.658912');
INSERT INTO public.activity_logs VALUES (246, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 14:55:48.590031');
INSERT INTO public.activity_logs VALUES (247, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:02:46.538051');
INSERT INTO public.activity_logs VALUES (248, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:03:33.177038');
INSERT INTO public.activity_logs VALUES (249, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:06:34.873897');
INSERT INTO public.activity_logs VALUES (250, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:08:45.390438');
INSERT INTO public.activity_logs VALUES (251, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:08:50.697629');
INSERT INTO public.activity_logs VALUES (252, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:09:12.458391');
INSERT INTO public.activity_logs VALUES (253, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:09:30.217434');
INSERT INTO public.activity_logs VALUES (254, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:10:18.287011');
INSERT INTO public.activity_logs VALUES (255, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:11:45.93022');
INSERT INTO public.activity_logs VALUES (256, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:15:42.434371');
INSERT INTO public.activity_logs VALUES (257, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:16:57.513992');
INSERT INTO public.activity_logs VALUES (258, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:17:40.681671');
INSERT INTO public.activity_logs VALUES (259, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:18:28.168778');
INSERT INTO public.activity_logs VALUES (260, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:21:08.94947');
INSERT INTO public.activity_logs VALUES (261, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:21:49.261664');
INSERT INTO public.activity_logs VALUES (262, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:23:09.424797');
INSERT INTO public.activity_logs VALUES (263, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:28:16.608433');
INSERT INTO public.activity_logs VALUES (264, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:36:14.576579');
INSERT INTO public.activity_logs VALUES (265, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:36:24.051332');
INSERT INTO public.activity_logs VALUES (266, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:45:18.309266');
INSERT INTO public.activity_logs VALUES (267, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:45:54.33439');
INSERT INTO public.activity_logs VALUES (268, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:48:40.562958');
INSERT INTO public.activity_logs VALUES (269, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:48:58.225286');
INSERT INTO public.activity_logs VALUES (270, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 15:49:04.407077');
INSERT INTO public.activity_logs VALUES (271, 'update', 'System User', 'Deploy Anti-Malware/EDR on All End-Points', 'control', '24', '2025-05-22 19:26:19.149854');
INSERT INTO public.activity_logs VALUES (272, 'create', 'System User', 'Production Control', 'control', '25', '2025-06-08 16:59:04.443241');


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.assets VALUES (3, 'AST-003', 'customer database', 'data', 'business', 'tech-platform', 'high', 'low', 'high', 50000000.00, '{GDPR}', 'internal', '{}', 'Test description', '2025-05-04 18:37:54.176', 'USD', 10, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets VALUES (14, 'AST-850', 'SIEM', 'application', 'Information Technology', 'Ovi', 'medium', 'medium', 'medium', 100000.00, '{}', 'internal', '{}', 'No description provided', '2025-05-21 16:09:48.78301', 'USD', 1, 'Company Group', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets VALUES (15, 'AST-595', 'datalake', 'application', 'Information Technology', 'Ovi', 'medium', 'medium', 'medium', 100000.00, '{}', 'internal', '{}', 'No description provided', '2025-05-21 16:10:19.659471', 'USD', 1, 'Company Group', 'Active', 14, 'technical_component', 'Application');
INSERT INTO public.assets VALUES (19, 'TEST-003', 'Fixed Test Asset', 'application', 'Information Technology', 'Test Owner', 'medium', 'medium', 'medium', 20000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:57:12.604382', 'USD', 1, 'Test Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets VALUES (20, 'FINAL-TEST', 'Final Production Test', 'application', 'Information Technology', 'Final Test', 'high', 'high', 'high', 25000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:57:24.309023', 'USD', 1, 'Test Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets VALUES (21, 'PROD-READY-001', 'Production Ready Asset', 'application', 'Information Technology', 'Production Team', 'high', 'high', 'high', 75000.00, '{none}', 'internal', '{}', 'No description provided', '2025-06-08 16:59:04.196991', 'USD', 1, 'Main Entity', 'Active', NULL, 'application_service', 'Application');
INSERT INTO public.assets VALUES (9, 'AST-008', 'Test Server For Risk Recalculation', 'system', 'IT', 'Admin Team', 'high', 'high', 'high', 15000000.00, '{GDPR,PCI-DSS}', 'internal', '{}', 'Test server for demonstrating risk recalculation with SQL fix', '2025-05-15 21:29:48.956', 'USD', 60, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets VALUES (5, 'AST-005', 'candidate Database', 'data', 'ovi', 'ovi', 'high', 'high', 'high', 10000000.00, '{GDPR}', 'internal', '{}', '0', '2025-05-12 20:40:52.303', 'EUR', 10, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets VALUES (1, 'AST-001', 'SalesForce', 'application', 'CIT', 'Ovidiu', 'high', 'high', 'low', 50000000.00, '{GDPR}', 'external', '{}', 'my salesforce', '2025-04-29 21:46:52.224', 'USD', 1, 'Company Y US', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets VALUES (11, 'AST-002', 'Web Application Server', 'application', 'IT', 'System Admin', 'medium', 'high', 'high', 30000000.00, '{PCI-DSS}', 'external', '{}', 'Public-facing web application server', '2025-05-15 23:12:38.221355', 'USD', 30, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);
INSERT INTO public.assets VALUES (8, 'AST-007', 'Another Test Server', 'system', 'IT', 'Admin Team', 'high', 'high', 'high', 1600000.00, '{GDPR,PCI-DSS}', 'internal', '{}', 'Another test server for demonstrating risk recalculation', '2025-05-15 21:27:45.325', 'USD', 60, 'Company X Emea', 'Active', NULL, 'technical_component', NULL);


--
-- Data for Name: asset_relationships; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: control_library; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.control_library VALUES (5, 'CIS-6-TPL', 'Access Control Management', 'Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts for enterprise assets and software.', 'preventive', 'administrative', 'not_implemented', 8.2, 9000.00, 45.00, true, 'CIS Controls v8.1.2, March 2025', '{}', '{}', '2025-05-15 13:17:57.9737', '2025-05-15 13:17:57.9737', NULL, NULL, 'template', NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (54, '3.11', 'Encrypt Sensitive Data at Rest', 'Use server-side or client-side encryption on storage.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (55, '3.12', 'Segment Data Processing and Storage Based on Sensitivity', 'Isolate sensitive data in separate enclaves.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (56, '3.13', 'Deploy a Data Loss Prevention Solution', 'Monitor and block unauthorized data exfiltration.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (57, '3.14', 'Log Sensitive Data Access', 'Record read/write on high-value data.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (58, '4.1', 'Establish and Maintain a Secure Configuration Process', 'Define and document secure baselines & change controls.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (59, '4.2', 'Establish and Maintain a Secure Configuration Process for Network Infrastructure', 'Document secure baselines for firewalls, switches, routers.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (60, '4.3', 'Configure Automatic Session Locking on Enterprise Assets', 'Lock sessions after defined inactivity periods.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (77, '6.2', 'Establish and Maintain an Inventory of Access Permissions', 'Catalog all permission assignments.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (78, '6.3', 'User Access Reviews', 'Quarterly review of user permissions.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (79, '6.4', 'Implement MFA for all Remote Access', 'Enforce MFA on VPN, RDP, SSH.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (80, '6.5', 'Implement MFA for All User Access to Privileged Accounts', 'Require MFA for admin consoles, APIs.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (81, '6.6', 'Ensure Use of Unique Credentials for Each Person', 'Eliminate shared accounts.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (82, '6.7', 'Deny Access Based on Geolocation/IP Reputation', 'Block high-risk geos or Tor exit nodes.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (83, '6.8', 'Remove/Disable Access Immediately Upon Role Change or Termination', 'Automate deprovisioning.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (101, '9.2', 'Ensure Use of Safe Email Gateways', 'Enforce URL/link scanning in mail.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (102, '9.3', 'Block Access to Known Malicious Websites', 'DNS/URL filtering at perimeter.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (103, '9.4', 'Restrict Execution of Office Macros', 'Block or sandbox untrusted macros.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (104, '9.5', 'Enforce Browser Sandboxing', 'Isolate web sessions.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (105, '9.6', 'Enforce URL Reputation/DNS Filtering', 'Block domains with bad reputations.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (111, '11.1', 'Establish and Maintain a Data Recovery Process', 'Document RTO/RPO & workflows.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (112, '11.2', 'Perform Regular Automated Backups of Critical Data', 'Schedule frequent backups.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (113, '11.3', 'Store Backups Offline and/or Off-site', 'Air-gap or cloud storage.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (114, '11.4', 'Perform Backup Integrity Verification', 'Regularly test restoration.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (115, '11.5', 'Document and Test Recovery Procedures', 'Run DR drills.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (116, '11.6', 'Maintain Backup Logs and Monitoring', 'Track backup success/failures.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (117, '12.1', 'Establish and Maintain a Network Infrastructure Process', 'Document network standards & review cycles.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (118, '12.2', 'Ensure Use of Secure Network Diagrams', 'Maintain up-to-date, access-controlled maps.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (119, '12.3', 'Manage Network Device Configurations Securely', 'Version control & peer reviews.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (120, '12.4', 'Perform Regular Network Device Firmware Updates', 'Stay current on patches.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (121, '12.5', 'Enforce Network Segmentation', 'Isolate critical assets.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (122, '12.6', 'Implement Secure Remote Management', 'Use VPN/SSH with MFA.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (32, '1.1', 'Establish and Maintain Detailed Enterprise Asset Inventory', 'Maintain an accurate, detailed inventory of all enterprise assets.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (33, '1.2', 'Address Unauthorized Assets', 'Process to identify and remove or quarantine unauthorized assets.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (34, '1.3', 'Utilize an Active Discovery Tool', 'Automate daily active scans to discover assets on the network.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (35, '1.4', 'Use DHCP Logging to Update Enterprise Asset Inventory', 'Parse DHCP logs to enrich asset inventory.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (36, '1.5', 'Use a Passive Asset Discovery Tool', 'Monitor network traffic passively to identify assets.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (37, '2.1', 'Establish and Maintain a Software Inventory', 'Maintain a current inventory of all installed software.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (38, '2.2', 'Ensure Authorized Software is Currently Supported', 'Flag unsupported software and document exceptions.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (39, '2.3', 'Address Unauthorized Software', 'Remove or quarantine unauthorized software installations.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (40, '2.4', 'Utilize Automated Software Inventory Tools', 'Use automated tools to discover and catalog software.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (41, '2.5', 'Allowlist Authorized Software', 'Only permit execution of approved software.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (42, '2.6', 'Allowlist Authorized Libraries', 'Only permit loading of approved system libraries.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (43, '2.7', 'Allowlist Authorized Scripts', 'Only permit execution of approved scripts.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (44, '3.1', 'Establish and Maintain a Data Management Process', 'Document processes for data classification, handling, retention, and disposal.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (45, '3.2', 'Establish and Maintain a Data Inventory', 'Catalog all sensitive data and its locations.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (46, '3.3', 'Configure Data Access Control Lists', 'Enforce least-privilege data access permissions.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (47, '3.4', 'Enforce Data Retention', 'Ensure data is kept only as long as permitted.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (48, '3.5', 'Securely Dispose of Data', 'Destroy data in accordance with retention policies.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (84, '7.1', 'Establish and Maintain a Vulnerability Management Process', 'Document VM workflow & SLAs.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (85, '7.2', 'Ensure Use of Up-to-Date Vulnerability Scanning Tools', 'Regularly update scanning engine/DB.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (86, '7.3', 'Perform Authenticated Vulnerability Scans', 'Use credentials for deeper discovery.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (87, '7.4', 'Remediate Identified Vulnerabilities in a Timely Manner', 'Track & fix CVEs per SLA.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (88, '7.5', 'Perform Malware Scanning of All Files', 'Endpoint scanning of all file sources.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (89, '7.6', 'Perform Internal Vulnerability Scanning', 'Scan internal subnets.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (90, '7.7', 'Perform External Vulnerability Scanning', 'Scan public IPs from the Internet.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (91, '7.8', 'Facilitate Automated Threat Intelligence Feeds', 'Ingest CVE/IOC feeds.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (92, '7.9', 'Remediate Vulnerabilities in Custom Code', 'SDLC integration for code flaws.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (93, '7.10', 'Perform Automated Configuration Management Scans', 'Detect drift from secure baselines.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (94, '8.1', 'Establish and Maintain an Audit Log Management Process', 'Document log types, retention, and review.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (95, '8.2', 'Ensure Logging is Enabled on All Systems', 'Enable OS, application, network logs.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (96, '8.3', 'Ensure Logs are Collected Centrally', 'Ship logs to SIEM or log server.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (97, '8.4', 'Secure Audit Logs Against Unauthorized Access', 'Protect integrity of log store.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (98, '8.5', 'Perform Log Reviews at Least Daily', 'Automated or manual daily reviews.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (99, '8.6', 'Retain Audit Logs for at Least One Year', 'Ensure compliance retention.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (100, '9.1', 'Deploy Email Anti-Phishing and Spam Filtering', 'Block malicious email campaigns.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.539812', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (106, '10.1', 'Establish and Maintain Malware Defense Process', 'Document AV/EDR workflows.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (107, '10.2', 'Deploy Anti-Malware/EDR on All End-Points', 'Install agents enterprise-wide.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (108, '10.3', 'Ensure Automatic Updates of Signatures/Engines', 'Keep EDR definitions current.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (109, '10.4', 'Enforce Host-Based Detection Policies', 'Configure policies in EDR.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (110, '10.5', 'Perform Automated Quarantine and Remediation', 'Block or auto-remediate infections.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (49, '3.6', 'Encrypt Data on End-User Devices', 'Use full-disk encryption on laptops and mobiles.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (50, '3.7', 'Establish and Maintain a Data Classification Scheme', 'Apply labels such as Confidential, Internal, Public.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (51, '3.8', 'Document Data Flows', 'Diagram how data moves among systems and services.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (52, '3.9', 'Encrypt Data on Removable Media', 'Enforce encryption on USBs, external drives.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (53, '3.10', 'Encrypt Sensitive Data in Transit', 'Use TLS/SSH for all sensitive communications.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (61, '4.4', 'Implement and Manage a Firewall on Servers', 'Use host-based or network firewalls on servers.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (62, '4.5', 'Implement and Manage a Firewall on End-User Devices', 'Enforce host firewalls on workstations/laptops.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (63, '4.6', 'Securely Manage Enterprise Assets and Software', 'Use SSH/HTTPS for admin and IaC for configs.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (64, '4.7', 'Manage Default Accounts on Enterprise Assets and Software', 'Disable or rename vendor default accounts.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (65, '4.8', 'Uninstall or Disable Unnecessary Services on Enterprise Assets and Software', 'Remove unused services and applications.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (66, '4.9', 'Configure Trusted DNS Servers on Enterprise Assets', 'Point to enterprise or known-good DNS.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (67, '4.10', 'Enforce Automatic Device Lockout on Portable End-User Devices', 'Lock after failed auth attempts.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (68, '4.11', 'Enforce Remote Wipe Capability on Portable End-User Devices', 'Be able to erase lost/stolen devices.', 'corrective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (69, '4.12', 'Separate Enterprise Workspaces on Mobile End-User Devices', 'Use containerization or work profiles.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (70, '5.1', 'Establish and Maintain an Inventory of Accounts', 'Catalog user, admin, and service accounts.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (71, '5.2', 'Use Unique Passwords', 'Prevent password reuse across accounts.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (72, '5.3', 'Disable Dormant Accounts', 'Disable accounts after 45 days of inactivity.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (73, '5.4', 'Restrict Administrator Privileges to Dedicated Administrator Accounts', 'Do not do general computing with admin accounts.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (74, '5.5', 'Establish and Maintain an Inventory of Service Accounts', 'Track purpose, owner, and review dates.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (75, '5.6', 'Centralize Account Management', 'Use AD, LDAP, or equivalent directory.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (76, '6.1', 'Establish and Maintain an Access Control Policy', 'Document roles & permission models.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.889698', '2025-05-18 17:18:40.475497', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (123, '12.7', 'Restrict Unused Network Ports and Protocols', 'Disable non-essential ports.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (124, '12.8', 'Continuously Monitor Network Device Health', 'Alert on anomalies.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (125, '13.1', 'Establish and Maintain a Network Monitoring Process', 'Document NOC/SOC workflows.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (126, '13.2', 'Deploy IDS/IPS and NDR Solutions', 'Detect network threats in real-time.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (127, '13.3', 'Monitor for Unauthorized Lateral Movement', 'Alert on horizontal traffic anomalies.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (128, '13.4', 'Analyze Network Flows for Anomalies', 'Use NetFlow, packet analysis.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (129, '13.5', 'Implement Network Deception Technologies', 'Deploy honeypots/honeynets.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (130, '13.6', 'Ensure High-Fidelity Alerting', 'Reduce false positives.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (131, '13.7', 'Perform Regular Network Traffic Baseline Analysis', 'Establish normal patterns.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (132, '13.8', 'Detect and Respond to Rogue Wireless Access Points', 'Scan for unauthorized APs.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (133, '13.9', 'Integrate Network Alerts into SIEM', 'Centralize network event correlation.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:40.976626', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (134, '14.1', 'Establish and Maintain a Security Awareness Program', 'Document annual training plans.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (135, '14.2', 'Provide Role-Based Security Training', 'Customize content by job function.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (136, '14.3', 'Test User Phishing Susceptibility Quarterly', 'Simulate phishing campaigns.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (137, '14.4', 'Measure and Report Training Effectiveness', 'Track metrics & KPIs.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (138, '14.5', 'Update Training Content Annually', 'Refresh modules each year.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (139, '15.1', 'Establish and Maintain a Service Provider Management Process', 'Document third-party risk workflows.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (140, '15.2', 'Inventory All Third-Party Service Providers', 'Catalog vendors & services.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (141, '15.3', 'Define and Enforce Security Requirements in SLAs', 'Embed controls into contracts.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (142, '15.4', 'Perform Onboarding and Offboarding Reviews', 'Validate vendor access lifecycle.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (143, '15.5', 'Monitor Third-Party Compliance Continuously', 'Use questionnaires & attestations.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (144, '15.6', 'Conduct Periodic Third-Party Assessments', 'Audit or pen-test vendors.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (145, '15.7', 'Maintain Evidence of Third-Party Security Compliance', 'Store reports & certifications.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (146, '16.1', 'Establish and Maintain an Application Security Process', 'Document SDLC security gates.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (147, '16.2', 'Inventory All In-House and Third-Party Apps', 'Catalog codebases & binaries.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (148, '16.3', 'Implement DevSecOps Toolchain', 'Integrate SAST/DAST into CI/CD.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (149, '16.4', 'Perform Static Application Security Testing (SAST)', 'Scan source code for flaws.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (150, '16.5', 'Perform Dynamic Application Security Testing (DAST)', 'Test APIs/web apps at runtime.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (151, '16.6', 'Enforce Secure Coding Standards', 'Adopt OWASP/SEI rules.', 'preventive', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (152, '16.7', 'Conduct Periodic Code Reviews', 'Peer review security logic.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (153, '16.8', 'Remediate Application Vulnerabilities', 'Track & fix in sprint backlog.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (154, '16.9', 'Monitor Application Behavior in Production', 'Runtime protection & logging.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (155, '17.1', 'Establish and Maintain an Incident Response Process', 'Document IR plan & SLAs.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (156, '17.2', 'Define and Train IR Team Roles', 'Assign roles & run drills.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (157, '17.3', 'Maintain Incident Playbooks', 'Keep runbooks for common events.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (158, '17.4', 'Conduct Table-Top Exercises Quarterly', 'Simulate incidents with stakeholders.', 'detective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (159, '17.5', 'Perform Post-Incident Reviews and Lessons Learned', 'Update processes after each event.', 'corrective', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (160, '18.1', 'Establish and Maintain a Pen Test Program', 'Define scope, cadence, and reporting.', 'preventive', 'administrative', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (161, '18.2', 'Perform External Penetration Testing Annually', 'Engage third-parties externally.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (162, '18.3', 'Perform Internal Penetration Testing Annually', 'Run internal red-team exercises.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.control_library VALUES (163, '18.4', 'Validate Remediation of Pen Test Findings', 'Re-test to confirm fixes.', 'detective', 'technical', 'planned', 0, 0.00, 0.00, false, '', '{}', '{}', '2025-05-18 12:40:41.015923', '2025-05-18 17:18:40.577296', NULL, NULL, NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: controls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.controls VALUES (21, '3.11-6866', 'Encrypt Sensitive Data at Rest', 'Use server-side or client-side encryption on storage.', '{43}', 'preventive', 'technical', 'fully_implemented', 9.00, 200.00, '', '2025-05-18 19:50:06.883308', '2025-05-18 19:50:06.883308', 0.00, false, 54, 'instance', NULL, 43, NULL, 0, 0.40, 0.50, 0.30, 0.70, 0, 0);
INSERT INTO public.controls VALUES (24, '10.2-1559', 'Deploy Anti-Malware/EDR on All End-Points', 'Install agents enterprise-wide.', '{46}', 'preventive', 'technical', 'fully_implemented', 9.50, 0.00, '', '2025-05-22 14:55:21.58118', '2025-05-22 14:55:21.58118', 25.00, true, 107, 'instance', NULL, 46, NULL, 0, 0.00, 0.00, 0.00, 0.00, 0, 0);
INSERT INTO public.controls VALUES (25, 'PROD-CTRL-001', 'Production Control', '', '{}', 'preventive', 'technical', 'fully_implemented', 9.50, 500.00, '', '2025-06-08 16:59:04.381889', '2025-06-08 16:59:04.381889', 0.00, false, NULL, 'instance', NULL, NULL, NULL, 0, 0.00, 0.00, 0.00, 0.00, 0, 0);


--
-- Data for Name: cost_modules; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cost_modules VALUES (1, 'Breach Investigation', '{7,7.1,7.2}', 10000, 'fixed', 'Fixed cost for conducting a breach investigation', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (2, 'Breach Notification', '{13,13.1,13.2}', 5, 'per_event', 'Cost per affected record for notification', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (4, 'Legal Consultation', '{17,17.1,17.2}', 350, 'per_hour', 'Legal consultation costs per hour', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (6, 'Lost Productivity', '{8,8.1,8.2}', 0.15, 'percentage', 'Percentage of total loss from lost productivity', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (7, 'Reputation Damage', '{4,14,14.1}', 0.2, 'percentage', 'Percentage of total loss from reputation damage', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (8, 'Customer Loss', '{5,15,15.1}', 0.25, 'percentage', 'Percentage of total loss from customer churn', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (9, 'Incident Response Team', '{10,10.1,10.2}', 15000, 'fixed', 'Cost for incident response team deployment', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (10, 'Forensic Services', '{12,12.1,12.2}', 20000, 'fixed', 'Cost for forensic analysis services', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (5, 'Regulatory Fines', '{2,2.1,2.2}', 0.06, 'percentage', 'Percentage of total loss for regulatory fines', '2025-05-18 08:06:57.349881');
INSERT INTO public.cost_modules VALUES (3, 'System Recovery', '{11,11.1,11.2}', 5000, 'fixed', 'Fixed cost for system recovery after breach', '2025-05-18 08:06:57.349881');


--
-- Data for Name: enterprise_architecture; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.enterprise_architecture VALUES (1, 'SC-902', 'Information Security', '', 'L1', 'strategic_capability', 'Information Security', NULL, '2025-05-21 12:05:15.850044', '2025-05-21 12:05:15.850044');
INSERT INTO public.enterprise_architecture VALUES (2, 'VC-401', 'Cyber Defense Department', '', 'L2', 'value_capability', 'Information Security', 1, '2025-05-21 12:05:39.764466', '2025-05-21 12:05:39.764466');
INSERT INTO public.enterprise_architecture VALUES (3, 'BS-609', 'Threat Detection & Monitoring', '', 'L3', 'business_service', 'Information Security', 2, '2025-05-21 12:06:32.31958', '2025-05-21 12:06:32.31958');


--
-- Data for Name: legal_entities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.legal_entities VALUES (3, 'ENT-003', 'Company Group', '', '', '2025-05-04 17:49:40.227684');
INSERT INTO public.legal_entities VALUES (1, 'ENT-001', 'Company X Emea', '', 'ENT-003', '2025-05-04 17:32:30.066449');
INSERT INTO public.legal_entities VALUES (2, 'ENT-002', 'Company Y US', '', 'ENT-003', '2025-05-04 17:49:19.248602');
INSERT INTO public.legal_entities VALUES (4, 'ENT-004', 'another-company', '0', 'ENT-001', '2025-05-06 20:58:23.472788');


--
-- Data for Name: risk_library; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risk_library VALUES (1, 'RISK-ORPHANED-ACCOUN-276-TPL', 'Orphaned accounts, excessive privileges', 'Risk of orphaned accounts, excessive privileges incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 69, 'medium', 0.01, 0.3, 0.1, 'high', 3, 5, 8, 'high', 2, 4, 9, 'high', 1.0561117e+07, 3.168335e+07, 6.33667e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (2, 'RISK-LACK-OF-VISIBIL-973-TPL', 'Lack of visibility, undetected breaches', 'Risk of lack of visibility, undetected breaches incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 1.5061117e+07, 4.5183352e+07, 9.0366704e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 10000, 1.1e+06, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (3, 'RISK-UNKNOWN-VULNERA-913-TPL', 'Unknown vulnerabilities', 'Risk of unknown vulnerabilities incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 5e+06, 1.5e+07, 3e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (4, 'RISK-EXPLOITED-SOFTW-277-TPL', 'Exploited software flaws', 'Risk of exploited software flaws incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 4, 6, 10, 'medium', 4, 6, 10, 'high', 9.5e+06, 2.85e+07, 5.7e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (5, 'RISK-001-TPL', 'Ransomware Attack on Core Systems', '0', 'External Threat Actors', 'Improper configuration of cloud services', 'financial', 'critical', 34, 38, 57, 'low', 0.22, 0.43, 0.66, 'medium', 3, 3, 5, 'high', 2, 4, 6, 'medium', 251574, 545455, 7.0800304e+07, 'high', 0.25, 0.54, 0.75, 'medium', 79225, 643357, 8.502061e+06, 'high', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (6, 'RISK-UNSEGMENTED-NET-571-TPL', 'Unsegmented network, rogue devices', 'Risk of unsegmented network, rogue devices incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 10000, 50000, 200000, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (7, 'RISK-THIRD-PARTY-RIS-177-TPL', 'Third-party risk, vendor compromise', 'Risk of third-party risk, vendor compromise incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 9, 'medium', 2, 4, 8, 'medium', 10000, 50000, 200000, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (8, 'RISK-UNMANAGED-DEVIC-414-TPL', 'Unmanaged devices, shadow IT', 'Risk of unmanaged devices, shadow it incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 9.5e+06, 2.85e+07, 5.7e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (9, 'RISK-UNAUTHORIZED-SO-757-TPL', 'Unauthorized software, unpatched vulnerabilities', 'Risk of unauthorized software, unpatched vulnerabilities incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 100000, 5e+06, 2e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (10, 'RISK-PHISHING-ATTACK-407-TPL', 'Phishing attacks, malware delivery', 'Risk of phishing attacks, malware delivery incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 65, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 8, 'medium', 2, 4, 6, 'medium', 1.5561117e+07, 4.6683352e+07, 9.3366704e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 158879, 294393, 1.1e+07, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (11, 'RISK-UNCOORDINATED-R-583-TPL', 'Uncoordinated response, delayed recovery', 'Risk of uncoordinated response, delayed recovery incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 4.5e+06, 1.35e+07, 2.7e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (12, 'RISK-INSECURE-SOFTWA-165-TPL', 'Insecure software, OWASP Top 10', 'Risk of insecure software, owasp top 10 incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 10000, 50000, 200000, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (13, 'RISK-PHISHING--SOCIA-698-TPL', 'Phishing, social engineering', 'Risk of phishing, social engineering incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 10000, 50000, 200000, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (14, 'RISK-DATA-LEAKAGE--U-151-TPL', 'Test Risk', 'Risk of data leakage, unauthorized access incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 8, 8, 1e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (15, 'RISK-UNAUTHORIZED-AC-969-TPL', 'Unauthorized access, privilege escalation', 'Risk of unauthorized access, privilege escalation incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 202797, 384615, 1e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 100000, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (16, 'RISK-MISCONFIGURATIO-345-TPL', 'Misconfigurations, default credentials', 'Risk of misconfigurations, default credentials incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'high', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 7, 'medium', 2, 4, 6, 'medium', 10000, 50000, 2e+07, 'medium', 0.1, 0.3, 0.5, 'medium', 5000, 25000, 1e+07, 'medium', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (17, 'RISK-RANSOMWARE--TRO-529-TPL', 'Ransomware, trojans', 'Risk of ransomware, trojans incidents affecting enterprise assets and data.', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 4, 6, 9, 'medium', 4, 5, 10, 'medium', 513986, 713287, 1.12e+07, 'high', 0.26, 0.51, 0.97, 'high', 272727, 818182, 1.2e+07, 'high', '{}', '2025-05-15 11:42:04.947472', '2025-05-15 11:42:04.947472');
INSERT INTO public.risk_library VALUES (18, 'TPL-RANSOMWARE-001', 'Ransomware Attack Template', 'Template for ransomware attacks on enterprise systems', 'External Threat Actor', 'System Vulnerability', 'operational', 'high', 12, 24, 48, 'medium', 0.1, 0.3, 0.5, 'medium', 3, 5, 9, 'medium', 2, 4, 8, 'medium', 100000, 500000, 2e+06, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034');
INSERT INTO public.risk_library VALUES (19, 'TPL-PHISHING-001', 'Phishing Campaign Template', 'Template for targeted phishing campaigns against employees', 'External Threat Actor', 'Social Engineering', 'operational', 'medium', 24, 52, 104, 'medium', 0.2, 0.4, 0.6, 'medium', 2, 4, 7, 'medium', 3, 5, 8, 'medium', 50000, 200000, 750000, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034');
INSERT INTO public.risk_library VALUES (20, 'TPL-DATA-BREACH-001', 'Data Breach Template', 'Template for data breaches exposing sensitive customer information', 'External Threat Actor', 'Inadequate Access Controls', 'compliance', 'critical', 6, 12, 24, 'medium', 0.3, 0.5, 0.8, 'medium', 5, 7, 10, 'medium', 3, 5, 7, 'medium', 500000, 2e+06, 5e+06, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034');
INSERT INTO public.risk_library VALUES (21, 'TPL-INSIDER-THREAT-001', 'Insider Threat Template', 'Template for malicious insider activities including data theft and sabotage', 'Internal Threat Actor', 'Excessive Privileges', 'operational', 'high', 2, 4, 8, 'medium', 0.05, 0.1, 0.2, 'medium', 6, 8, 10, 'medium', 3, 5, 7, 'medium', 250000, 750000, 2e+06, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034');
INSERT INTO public.risk_library VALUES (22, 'TPL-SUPPLY-CHAIN-001', 'Supply Chain Attack Template', 'Template for attacks targeting the organization supply chain or vendors', 'External Threat Actor', 'Third-Party Security', 'operational', 'high', 4, 8, 16, 'medium', 0.1, 0.2, 0.4, 'medium', 7, 8, 10, 'medium', 2, 4, 6, 'medium', 300000, 1e+06, 3e+06, 'medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', '{}', '2025-05-18 11:10:03.766034', '2025-05-18 11:10:03.766034');
INSERT INTO public.risk_library VALUES (23, 'RL-DATA-BREACH-001', 'Data breach of customer PII', 'Unauthorized access to personally identifiable information', 'External cybercriminals', 'Insufficient access controls', 'operational', 'critical', 2, 5, 12, 'medium', 0.1, 0.3, 0.5, 'medium', 0.5, 0.7, 0.85, 'high', 0.3, 0.5, 0.7, 'medium', 500000, 2e+06, 5e+06, 'medium', 0.3, 0.6, 0.9, 'medium', 100000, 500000, 1.5e+06, 'medium', '{1.1,3.6,5.4,10.2}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');
INSERT INTO public.risk_library VALUES (24, 'RL-RANSOMWARE-002', 'Ransomware attack', 'Malicious encryption of systems for ransom', 'Organized cybercrime', 'Unpatched systems and social engineering', 'operational', 'critical', 1, 3, 8, 'medium', 0.2, 0.4, 0.6, 'medium', 0.6, 0.8, 0.9, 'high', 0.4, 0.6, 0.8, 'medium', 1e+06, 3e+06, 1e+07, 'medium', 0.4, 0.7, 0.95, 'medium', 500000, 1e+06, 3e+06, 'medium', '{4.4,7.4,11.2,17.1}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');
INSERT INTO public.risk_library VALUES (25, 'RL-COMPLIANCE-003', 'Regulatory non-compliance', 'Failure to comply with data protection regulations', 'Regulatory authorities', 'Incomplete compliance program', 'compliance', 'high', 1, 2, 4, 'high', 0.3, 0.5, 0.7, 'high', 0.7, 0.85, 0.95, 'high', 0.3, 0.5, 0.7, 'medium', 750000, 2.5e+06, 8e+06, 'medium', 0.5, 0.8, 1, 'high', 1e+06, 3e+06, 7e+06, 'high', '{3.1,5.6,15.3,17.5}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');
INSERT INTO public.risk_library VALUES (26, 'RL-SUPPLY-CHAIN-004', 'Supply chain compromise', 'Security breach via third-party vendor or supplier', 'Nation-state actors', 'Inadequate third-party risk management', 'strategic', 'high', 1, 2, 5, 'low', 0.1, 0.25, 0.4, 'low', 0.7, 0.9, 0.98, 'high', 0.2, 0.4, 0.6, 'low', 1e+06, 5e+06, 1.5e+07, 'low', 0.6, 0.85, 1, 'medium', 2e+06, 8e+06, 2e+07, 'low', '{15.1,15.6,15.7}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');
INSERT INTO public.risk_library VALUES (27, 'RL-CREDENTIAL-005', 'Credential theft', 'Unauthorized acquisition of login credentials', 'Individual hackers', 'Weak password policies', 'operational', 'medium', 10, 50, 100, 'high', 0.3, 0.6, 0.8, 'medium', 0.3, 0.5, 0.7, 'medium', 0.4, 0.6, 0.8, 'medium', 50000, 200000, 500000, 'medium', 0.2, 0.5, 0.8, 'medium', 25000, 100000, 300000, 'medium', '{5.2,5.6,6.4,6.5}', '2025-05-18 11:24:14.702727', '2025-05-18 11:24:14.702727');


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risks VALUES (46, 'RISK-RANSOMWARE-644', 'Ransomware, trojans', 'Risk of ransomware, trojans incidents affecting enterprise assets and data.', '{AST-850}', 'External Threat Actor', 'System Vulnerability', 'operational', 'medium', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 143343.35, 75255.26, 0, '2025-05-15 11:42:04.947', '2025-05-15 11:42:04.947', 0, 24, 48, 'medium', 0, 0.3, 0.5, 'medium', 0, 7.2, 24, 'medium', 4, 6, 8.5, 'medium', 10, 10, 10, 'medium', 0.047425874, 0.11920292, 0.32082132, 'Medium', 0, 0.85826105, 7.6997113, 'Medium', 5000.00, 15000.00, 30000.00, 'high', 0.1, 0.3, 0.7, 'high', 5300.00, 5900.00, 6800.00, 'high', 10300.00, 20900.00, 36800.00, 'medium', '', 17, 'instance', NULL, '{}', '{}');
INSERT INTO public.risks VALUES (47, 'TEST-RISK-001', 'Test Risk', '', '{AST-003}', '', '', 'operational', 'medium', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 0.00, 0.00, 0, '2025-06-08 16:50:42.180667', '2025-06-08 16:50:42.180667', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0.00, 0.00, 0.00, 'Medium', '', NULL, 'instance', NULL, '{}', '{}');
INSERT INTO public.risks VALUES (48, 'FINAL-RISK-TEST', 'Final Risk Test', '', '{AST-003}', 'External', 'Test vulnerability', 'operational', 'medium', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 0.00, 0.00, 0, '2025-06-08 16:57:24.402306', '2025-06-08 16:57:24.402306', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0.00, 0.00, 0.00, 'Medium', '', NULL, 'instance', NULL, '{}', '{}');
INSERT INTO public.risks VALUES (43, 'RISK-DATA-236', 'Data breach of customer PII', 'Unauthorized access to personally identifiable information', '{AST-003}', 'External cybercriminals', 'Insufficient access controls', 'operational', 'critical', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 25633838.00, 14098610.90, 0, '2025-05-18 11:24:14.702', '2025-05-18 11:24:14.702', 1, 3, 5, 'medium', 0.2, 0.4, 0.6, 'medium', 0.2, 1.2, 3, 'medium', 0.6, 2, 4, 'high', 10, 10, 10, 'medium', 0.45016602, 0.26894143, 0.07585818, 'Medium', 0.0900332, 0.3227297, 0.22757454, 'Medium', 10000000.00, 29200000.00, 60000000.00, 'medium', 0.3, 0.6, 1, 'medium', 20000.00, 20000.00, 20000.00, 'medium', 10020000.00, 29220000.00, 60020000.00, 'medium', '', 23, 'instance', NULL, '{}', '{}');
INSERT INTO public.risks VALUES (49, 'PROD-READY-RISK', 'Production Ready Risk', '', '{AST-003}', 'External', 'Test vulnerability', 'operational', 'high', 0, 0, 0, 0, 0, 0.00000000, 0, 0, 0, 0, 0, 0.00, 0.00, 0, '2025-06-08 16:59:04.277338', '2025-06-08 16:59:04.277338', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0, 0, 0, 'Medium', 0.00, 0.00, 0.00, 'Medium', 0.00, 0.00, 0.00, 'Medium', '', NULL, 'instance', NULL, '{}', '{}');


--
-- Data for Name: risk_responses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risk_responses VALUES (2, 'RISK-DATA-236', 'mitigate', '', '{3.11-6866}', '', '', '', '2025-05-19 18:47:50.931', '2025-05-19 18:47:50.931', '{}');


--
-- Data for Name: response_cost_modules; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: risk_controls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risk_controls VALUES (2, 43, 21, 5, '', '2025-05-18 19:50:07.013396', '2025-05-18 19:50:07.013396');
INSERT INTO public.risk_controls VALUES (3, 46, 24, 9.5, '', '2025-05-22 15:02:38.972349', '2025-05-22 15:02:38.972349');


--
-- Data for Name: risk_costs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risk_costs VALUES (4, 43, 10, 4.2, '2025-05-19 17:53:48.983887');
INSERT INTO public.risk_costs VALUES (10, 46, 3, 6, '2025-05-22 20:52:34.007077');
INSERT INTO public.risk_costs VALUES (11, 46, 5, 10, '2025-05-22 20:52:34.007077');


--
-- Data for Name: risk_summaries; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.risk_summaries VALUES (16, 2025, 5, NULL, 90000000, 270000000, 550000000, 90000000, 550000000, 270000000, '2025-05-18 14:33:47.852022', '2025-05-18 14:33:47.852022');
INSERT INTO public.risk_summaries VALUES (24, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:23:38.138', '2025-05-18 18:23:38.155342');
INSERT INTO public.risk_summaries VALUES (25, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:27:33.038', '2025-05-18 18:27:33.054802');
INSERT INTO public.risk_summaries VALUES (26, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:35:53.907', '2025-05-18 18:35:53.926524');
INSERT INTO public.risk_summaries VALUES (27, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:35:56.175', '2025-05-18 18:35:56.190779');
INSERT INTO public.risk_summaries VALUES (28, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:36:06.864', '2025-05-18 18:36:06.879814');
INSERT INTO public.risk_summaries VALUES (29, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:40:01.958', '2025-05-18 18:40:01.973916');
INSERT INTO public.risk_summaries VALUES (30, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:52:02.246', '2025-05-18 18:52:02.262524');
INSERT INTO public.risk_summaries VALUES (31, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 18:58:06.595', '2025-05-18 18:58:06.611794');
INSERT INTO public.risk_summaries VALUES (32, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:01:40.633', '2025-05-18 19:01:40.650194');
INSERT INTO public.risk_summaries VALUES (33, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:04:17.468', '2025-05-18 19:04:17.484638');
INSERT INTO public.risk_summaries VALUES (34, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:04:19.322', '2025-05-18 19:04:19.341423');
INSERT INTO public.risk_summaries VALUES (35, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:04:25.265', '2025-05-18 19:04:25.281103');
INSERT INTO public.risk_summaries VALUES (36, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:04:32.706', '2025-05-18 19:04:32.722343');
INSERT INTO public.risk_summaries VALUES (37, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:46:42.507', '2025-05-18 19:46:42.526861');
INSERT INTO public.risk_summaries VALUES (38, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:48:36.513', '2025-05-18 19:48:36.529348');
INSERT INTO public.risk_summaries VALUES (39, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:50:54.215', '2025-05-18 19:50:54.231625');
INSERT INTO public.risk_summaries VALUES (40, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:53:34.394', '2025-05-18 19:53:34.410525');
INSERT INTO public.risk_summaries VALUES (41, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:53:47.072', '2025-05-18 19:53:47.088488');
INSERT INTO public.risk_summaries VALUES (42, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:54:02.839', '2025-05-18 19:54:02.855971');
INSERT INTO public.risk_summaries VALUES (43, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:54:27.68', '2025-05-18 19:54:27.696574');
INSERT INTO public.risk_summaries VALUES (44, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:54:43.152', '2025-05-18 19:54:43.168556');
INSERT INTO public.risk_summaries VALUES (45, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:55:02.735', '2025-05-18 19:55:02.752698');
INSERT INTO public.risk_summaries VALUES (46, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:56:57.781', '2025-05-18 19:56:57.796955');
INSERT INTO public.risk_summaries VALUES (47, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:58:53.923', '2025-05-18 19:58:53.94749');
INSERT INTO public.risk_summaries VALUES (48, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:59:15.279', '2025-05-18 19:59:15.295606');
INSERT INTO public.risk_summaries VALUES (49, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:59:40.512', '2025-05-18 19:59:40.529486');
INSERT INTO public.risk_summaries VALUES (50, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 19:59:50.418', '2025-05-18 19:59:50.434351');
INSERT INTO public.risk_summaries VALUES (51, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:02:07.501', '2025-05-18 20:02:07.5325');
INSERT INTO public.risk_summaries VALUES (52, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:02:21.788', '2025-05-18 20:02:21.805799');
INSERT INTO public.risk_summaries VALUES (53, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:04:37.591', '2025-05-18 20:04:37.610516');
INSERT INTO public.risk_summaries VALUES (54, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:05:16.443', '2025-05-18 20:05:16.458776');
INSERT INTO public.risk_summaries VALUES (55, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:05:37.305', '2025-05-18 20:05:37.320985');
INSERT INTO public.risk_summaries VALUES (56, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:06:19.053', '2025-05-18 20:06:19.069287');
INSERT INTO public.risk_summaries VALUES (57, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:09:27.027', '2025-05-18 20:09:27.04329');
INSERT INTO public.risk_summaries VALUES (58, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:13:28.131', '2025-05-18 20:13:28.150438');
INSERT INTO public.risk_summaries VALUES (59, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:18:52.963', '2025-05-18 20:18:52.980532');
INSERT INTO public.risk_summaries VALUES (60, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:19:05.926', '2025-05-18 20:19:05.945445');
INSERT INTO public.risk_summaries VALUES (61, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:19:08.598', '2025-05-18 20:19:08.614729');
INSERT INTO public.risk_summaries VALUES (62, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:19:20.712', '2025-05-18 20:19:20.727819');
INSERT INTO public.risk_summaries VALUES (63, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:19:21.421', '2025-05-18 20:19:21.438047');
INSERT INTO public.risk_summaries VALUES (64, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:21:14.921', '2025-05-18 20:21:14.936764');
INSERT INTO public.risk_summaries VALUES (65, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:22:27.732', '2025-05-18 20:22:27.750654');
INSERT INTO public.risk_summaries VALUES (66, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:23:17.088', '2025-05-18 20:23:17.110777');
INSERT INTO public.risk_summaries VALUES (67, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:23:38.665', '2025-05-18 20:23:38.682128');
INSERT INTO public.risk_summaries VALUES (68, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:25:05.73', '2025-05-18 20:25:05.74776');
INSERT INTO public.risk_summaries VALUES (69, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:26:48.989', '2025-05-18 20:26:49.005218');
INSERT INTO public.risk_summaries VALUES (70, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:26:52.464', '2025-05-18 20:26:52.480142');
INSERT INTO public.risk_summaries VALUES (71, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:26:57.696', '2025-05-18 20:26:57.712245');
INSERT INTO public.risk_summaries VALUES (72, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:27:05.88', '2025-05-18 20:27:05.89712');
INSERT INTO public.risk_summaries VALUES (73, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:27:10.207', '2025-05-18 20:27:10.223895');
INSERT INTO public.risk_summaries VALUES (74, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:27:31.158', '2025-05-18 20:27:31.174045');
INSERT INTO public.risk_summaries VALUES (75, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:30:51.556', '2025-05-18 20:30:51.575125');
INSERT INTO public.risk_summaries VALUES (76, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:31:25.316', '2025-05-18 20:31:25.33569');
INSERT INTO public.risk_summaries VALUES (77, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:31:47.817', '2025-05-18 20:31:47.837113');
INSERT INTO public.risk_summaries VALUES (78, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:36:45.539', '2025-05-18 20:36:45.555107');
INSERT INTO public.risk_summaries VALUES (79, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:43:02.569', '2025-05-18 20:43:02.586378');
INSERT INTO public.risk_summaries VALUES (80, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:45:17.506', '2025-05-18 20:45:17.521629');
INSERT INTO public.risk_summaries VALUES (81, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:48:38.131', '2025-05-18 20:48:38.154302');
INSERT INTO public.risk_summaries VALUES (82, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:48:47.508', '2025-05-18 20:48:47.524308');
INSERT INTO public.risk_summaries VALUES (83, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:50:07.333', '2025-05-18 20:50:07.348585');
INSERT INTO public.risk_summaries VALUES (84, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:50:12.967', '2025-05-18 20:50:12.986066');
INSERT INTO public.risk_summaries VALUES (85, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:50:22.016', '2025-05-18 20:50:22.031548');
INSERT INTO public.risk_summaries VALUES (86, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:51:06.155', '2025-05-18 20:51:06.173529');
INSERT INTO public.risk_summaries VALUES (87, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:51:25.806', '2025-05-18 20:51:25.82252');
INSERT INTO public.risk_summaries VALUES (88, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:51:28.762', '2025-05-18 20:51:28.778236');
INSERT INTO public.risk_summaries VALUES (89, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:51:36.737', '2025-05-18 20:51:36.75402');
INSERT INTO public.risk_summaries VALUES (90, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:12.481', '2025-05-18 20:52:12.496811');
INSERT INTO public.risk_summaries VALUES (91, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:24.201', '2025-05-18 20:52:24.21781');
INSERT INTO public.risk_summaries VALUES (92, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:24.998', '2025-05-18 20:52:25.016038');
INSERT INTO public.risk_summaries VALUES (93, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:25.822', '2025-05-18 20:52:25.839635');
INSERT INTO public.risk_summaries VALUES (94, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:26.323', '2025-05-18 20:52:26.34328');
INSERT INTO public.risk_summaries VALUES (95, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:26.806', '2025-05-18 20:52:26.823775');
INSERT INTO public.risk_summaries VALUES (96, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:27.278', '2025-05-18 20:52:27.293929');
INSERT INTO public.risk_summaries VALUES (97, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:27.825', '2025-05-18 20:52:27.840894');
INSERT INTO public.risk_summaries VALUES (98, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:28.32', '2025-05-18 20:52:28.338055');
INSERT INTO public.risk_summaries VALUES (99, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:28.807', '2025-05-18 20:52:28.825009');
INSERT INTO public.risk_summaries VALUES (100, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:29.318', '2025-05-18 20:52:29.333694');
INSERT INTO public.risk_summaries VALUES (101, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:29.843', '2025-05-18 20:52:29.858907');
INSERT INTO public.risk_summaries VALUES (102, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:30.338', '2025-05-18 20:52:30.355481');
INSERT INTO public.risk_summaries VALUES (103, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:30.833', '2025-05-18 20:52:30.848856');
INSERT INTO public.risk_summaries VALUES (104, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:31.347', '2025-05-18 20:52:31.363334');
INSERT INTO public.risk_summaries VALUES (105, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:31.814', '2025-05-18 20:52:31.829663');
INSERT INTO public.risk_summaries VALUES (106, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:31.897', '2025-05-18 20:52:31.912239');
INSERT INTO public.risk_summaries VALUES (107, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:32.283', '2025-05-18 20:52:32.305855');
INSERT INTO public.risk_summaries VALUES (108, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:32.769', '2025-05-18 20:52:32.786078');
INSERT INTO public.risk_summaries VALUES (109, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:33.233', '2025-05-18 20:52:33.248648');
INSERT INTO public.risk_summaries VALUES (110, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:33.701', '2025-05-18 20:52:33.716607');
INSERT INTO public.risk_summaries VALUES (111, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:51.408', '2025-05-18 20:52:51.422839');
INSERT INTO public.risk_summaries VALUES (112, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:52:56.782', '2025-05-18 20:52:56.797568');
INSERT INTO public.risk_summaries VALUES (113, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:53:01.302', '2025-05-18 20:53:01.317862');
INSERT INTO public.risk_summaries VALUES (114, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:55:24.439', '2025-05-18 20:55:24.454606');
INSERT INTO public.risk_summaries VALUES (115, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:55:30.344', '2025-05-18 20:55:30.360239');
INSERT INTO public.risk_summaries VALUES (116, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:48.988', '2025-05-18 20:56:49.006953');
INSERT INTO public.risk_summaries VALUES (117, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:51.293', '2025-05-18 20:56:51.309348');
INSERT INTO public.risk_summaries VALUES (118, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:52.055', '2025-05-18 20:56:52.07254');
INSERT INTO public.risk_summaries VALUES (119, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:52.868', '2025-05-18 20:56:52.891945');
INSERT INTO public.risk_summaries VALUES (120, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:53.397', '2025-05-18 20:56:53.416111');
INSERT INTO public.risk_summaries VALUES (121, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:53.879', '2025-05-18 20:56:53.893751');
INSERT INTO public.risk_summaries VALUES (122, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:54.351', '2025-05-18 20:56:54.369077');
INSERT INTO public.risk_summaries VALUES (123, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:54.836', '2025-05-18 20:56:54.856637');
INSERT INTO public.risk_summaries VALUES (124, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:55.338', '2025-05-18 20:56:55.355191');
INSERT INTO public.risk_summaries VALUES (125, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:55.815', '2025-05-18 20:56:55.832426');
INSERT INTO public.risk_summaries VALUES (126, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:56.285', '2025-05-18 20:56:56.30238');
INSERT INTO public.risk_summaries VALUES (127, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:56.466', '2025-05-18 20:56:56.486283');
INSERT INTO public.risk_summaries VALUES (128, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:56.77', '2025-05-18 20:56:56.793994');
INSERT INTO public.risk_summaries VALUES (129, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:57.243', '2025-05-18 20:56:57.259745');
INSERT INTO public.risk_summaries VALUES (130, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:57.715', '2025-05-18 20:56:57.730817');
INSERT INTO public.risk_summaries VALUES (131, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:56:59.315', '2025-05-18 20:56:59.340834');
INSERT INTO public.risk_summaries VALUES (132, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:57:01.019', '2025-05-18 20:57:01.034594');
INSERT INTO public.risk_summaries VALUES (133, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:57:25.66', '2025-05-18 20:57:25.681157');
INSERT INTO public.risk_summaries VALUES (134, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:57:43.449', '2025-05-18 20:57:43.464894');
INSERT INTO public.risk_summaries VALUES (135, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:48.176', '2025-05-18 20:58:48.192833');
INSERT INTO public.risk_summaries VALUES (136, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:50.215', '2025-05-18 20:58:50.231649');
INSERT INTO public.risk_summaries VALUES (137, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:51.018', '2025-05-18 20:58:51.034824');
INSERT INTO public.risk_summaries VALUES (138, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:51.514', '2025-05-18 20:58:51.530001');
INSERT INTO public.risk_summaries VALUES (139, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:51.998', '2025-05-18 20:58:52.013794');
INSERT INTO public.risk_summaries VALUES (140, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:52.488', '2025-05-18 20:58:52.50383');
INSERT INTO public.risk_summaries VALUES (141, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:52.979', '2025-05-18 20:58:52.995478');
INSERT INTO public.risk_summaries VALUES (142, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:53.468', '2025-05-18 20:58:53.483835');
INSERT INTO public.risk_summaries VALUES (143, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:53.936', '2025-05-18 20:58:53.952496');
INSERT INTO public.risk_summaries VALUES (144, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:53.964', '2025-05-18 20:58:53.979981');
INSERT INTO public.risk_summaries VALUES (145, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:54.579', '2025-05-18 20:58:54.596351');
INSERT INTO public.risk_summaries VALUES (146, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:55.065', '2025-05-18 20:58:55.081778');
INSERT INTO public.risk_summaries VALUES (147, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:55.596', '2025-05-18 20:58:55.611901');
INSERT INTO public.risk_summaries VALUES (148, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:56.364', '2025-05-18 20:58:56.380881');
INSERT INTO public.risk_summaries VALUES (149, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 20:58:58.793', '2025-05-18 20:58:58.810415');
INSERT INTO public.risk_summaries VALUES (150, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:02.007', '2025-05-18 21:01:02.025367');
INSERT INTO public.risk_summaries VALUES (151, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:03.917', '2025-05-18 21:01:03.932611');
INSERT INTO public.risk_summaries VALUES (152, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:07.081', '2025-05-18 21:01:07.105019');
INSERT INTO public.risk_summaries VALUES (153, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:11.17', '2025-05-18 21:01:11.185858');
INSERT INTO public.risk_summaries VALUES (154, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:12.043', '2025-05-18 21:01:12.059383');
INSERT INTO public.risk_summaries VALUES (155, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:12.885', '2025-05-18 21:01:12.906253');
INSERT INTO public.risk_summaries VALUES (156, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:13.753', '2025-05-18 21:01:13.774226');
INSERT INTO public.risk_summaries VALUES (157, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:14.326', '2025-05-18 21:01:14.342047');
INSERT INTO public.risk_summaries VALUES (158, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:14.882', '2025-05-18 21:01:14.898895');
INSERT INTO public.risk_summaries VALUES (159, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:15.46', '2025-05-18 21:01:15.47946');
INSERT INTO public.risk_summaries VALUES (160, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:16.008', '2025-05-18 21:01:16.030273');
INSERT INTO public.risk_summaries VALUES (161, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:16.582', '2025-05-18 21:01:16.600401');
INSERT INTO public.risk_summaries VALUES (162, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:17.121', '2025-05-18 21:01:17.141111');
INSERT INTO public.risk_summaries VALUES (163, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:17.642', '2025-05-18 21:01:17.661195');
INSERT INTO public.risk_summaries VALUES (164, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:17.715', '2025-05-18 21:01:17.73815');
INSERT INTO public.risk_summaries VALUES (165, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:18.311', '2025-05-18 21:01:18.329857');
INSERT INTO public.risk_summaries VALUES (166, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:18.974', '2025-05-18 21:01:18.9942');
INSERT INTO public.risk_summaries VALUES (167, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:19.529', '2025-05-18 21:01:19.553215');
INSERT INTO public.risk_summaries VALUES (168, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:20.278', '2025-05-18 21:01:20.294776');
INSERT INTO public.risk_summaries VALUES (169, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:22.429', '2025-05-18 21:01:22.445017');
INSERT INTO public.risk_summaries VALUES (170, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:36.542', '2025-05-18 21:01:36.558151');
INSERT INTO public.risk_summaries VALUES (171, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:01:39.08', '2025-05-18 21:01:39.098252');
INSERT INTO public.risk_summaries VALUES (172, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:19.753', '2025-05-18 21:04:19.770397');
INSERT INTO public.risk_summaries VALUES (173, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:49.334', '2025-05-18 21:04:49.357509');
INSERT INTO public.risk_summaries VALUES (174, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:50.227', '2025-05-18 21:04:50.243507');
INSERT INTO public.risk_summaries VALUES (175, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:50.781', '2025-05-18 21:04:50.797298');
INSERT INTO public.risk_summaries VALUES (176, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:51.335', '2025-05-18 21:04:51.351326');
INSERT INTO public.risk_summaries VALUES (177, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:51.879', '2025-05-18 21:04:51.895129');
INSERT INTO public.risk_summaries VALUES (178, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:52.432', '2025-05-18 21:04:52.449483');
INSERT INTO public.risk_summaries VALUES (179, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:52.979', '2025-05-18 21:04:52.99406');
INSERT INTO public.risk_summaries VALUES (180, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:53.542', '2025-05-18 21:04:53.557947');
INSERT INTO public.risk_summaries VALUES (181, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:54.017', '2025-05-18 21:04:54.034889');
INSERT INTO public.risk_summaries VALUES (182, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:54.155', '2025-05-18 21:04:54.175011');
INSERT INTO public.risk_summaries VALUES (183, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:54.734', '2025-05-18 21:04:54.74949');
INSERT INTO public.risk_summaries VALUES (184, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:55.301', '2025-05-18 21:04:55.317857');
INSERT INTO public.risk_summaries VALUES (185, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:04:55.883', '2025-05-18 21:04:55.899472');
INSERT INTO public.risk_summaries VALUES (186, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:05:00.636', '2025-05-18 21:05:00.651268');
INSERT INTO public.risk_summaries VALUES (187, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:05:03.231', '2025-05-18 21:05:03.25213');
INSERT INTO public.risk_summaries VALUES (188, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:07:03.177', '2025-05-18 21:07:03.196924');
INSERT INTO public.risk_summaries VALUES (189, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:28.975', '2025-05-18 21:11:28.993096');
INSERT INTO public.risk_summaries VALUES (190, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:30.408', '2025-05-18 21:11:30.424498');
INSERT INTO public.risk_summaries VALUES (191, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:30.984', '2025-05-18 21:11:30.999225');
INSERT INTO public.risk_summaries VALUES (192, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:31.54', '2025-05-18 21:11:31.555818');
INSERT INTO public.risk_summaries VALUES (193, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:32.098', '2025-05-18 21:11:32.113255');
INSERT INTO public.risk_summaries VALUES (194, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:32.652', '2025-05-18 21:11:32.668286');
INSERT INTO public.risk_summaries VALUES (195, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:32.821', '2025-05-18 21:11:32.837676');
INSERT INTO public.risk_summaries VALUES (196, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:33.327', '2025-05-18 21:11:33.341786');
INSERT INTO public.risk_summaries VALUES (197, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:33.927', '2025-05-18 21:11:33.943462');
INSERT INTO public.risk_summaries VALUES (198, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:34.507', '2025-05-18 21:11:34.523778');
INSERT INTO public.risk_summaries VALUES (199, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:36.03', '2025-05-18 21:11:36.0454');
INSERT INTO public.risk_summaries VALUES (200, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:11:38.057', '2025-05-18 21:11:38.079116');
INSERT INTO public.risk_summaries VALUES (201, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:12:56.759', '2025-05-18 21:12:56.778222');
INSERT INTO public.risk_summaries VALUES (202, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:14:58.65', '2025-05-18 21:14:58.666455');
INSERT INTO public.risk_summaries VALUES (203, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:00.022', '2025-05-18 21:15:00.038966');
INSERT INTO public.risk_summaries VALUES (204, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:00.495', '2025-05-18 21:15:00.512773');
INSERT INTO public.risk_summaries VALUES (205, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:00.668', '2025-05-18 21:15:00.691459');
INSERT INTO public.risk_summaries VALUES (206, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:01.284', '2025-05-18 21:15:01.299385');
INSERT INTO public.risk_summaries VALUES (207, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:01.873', '2025-05-18 21:15:01.891077');
INSERT INTO public.risk_summaries VALUES (208, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:02.465', '2025-05-18 21:15:02.482486');
INSERT INTO public.risk_summaries VALUES (209, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:03.043', '2025-05-18 21:15:03.060471');
INSERT INTO public.risk_summaries VALUES (210, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:03.598', '2025-05-18 21:15:03.61481');
INSERT INTO public.risk_summaries VALUES (211, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:04.163', '2025-05-18 21:15:04.179447');
INSERT INTO public.risk_summaries VALUES (212, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:04.721', '2025-05-18 21:15:04.736774');
INSERT INTO public.risk_summaries VALUES (213, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:05.268', '2025-05-18 21:15:05.284876');
INSERT INTO public.risk_summaries VALUES (214, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:05.851', '2025-05-18 21:15:05.867446');
INSERT INTO public.risk_summaries VALUES (215, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:06.4', '2025-05-18 21:15:06.416316');
INSERT INTO public.risk_summaries VALUES (216, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:06.97', '2025-05-18 21:15:06.986416');
INSERT INTO public.risk_summaries VALUES (217, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:07.532', '2025-05-18 21:15:07.549713');
INSERT INTO public.risk_summaries VALUES (218, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:08.089', '2025-05-18 21:15:08.105681');
INSERT INTO public.risk_summaries VALUES (219, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:08.677', '2025-05-18 21:15:08.697401');
INSERT INTO public.risk_summaries VALUES (220, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:09.396', '2025-05-18 21:15:09.420225');
INSERT INTO public.risk_summaries VALUES (221, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:10.004', '2025-05-18 21:15:10.02731');
INSERT INTO public.risk_summaries VALUES (222, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:10.609', '2025-05-18 21:15:10.626172');
INSERT INTO public.risk_summaries VALUES (223, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:11.232', '2025-05-18 21:15:11.247238');
INSERT INTO public.risk_summaries VALUES (224, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:11.803', '2025-05-18 21:15:11.819119');
INSERT INTO public.risk_summaries VALUES (225, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:12.359', '2025-05-18 21:15:12.374593');
INSERT INTO public.risk_summaries VALUES (226, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:12.92', '2025-05-18 21:15:12.935365');
INSERT INTO public.risk_summaries VALUES (227, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:13.502', '2025-05-18 21:15:13.522892');
INSERT INTO public.risk_summaries VALUES (228, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:14.109', '2025-05-18 21:15:14.127127');
INSERT INTO public.risk_summaries VALUES (229, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:14.722', '2025-05-18 21:15:14.741038');
INSERT INTO public.risk_summaries VALUES (230, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:15.353', '2025-05-18 21:15:15.37095');
INSERT INTO public.risk_summaries VALUES (231, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:15.916', '2025-05-18 21:15:15.932273');
INSERT INTO public.risk_summaries VALUES (232, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:16.485', '2025-05-18 21:15:16.501589');
INSERT INTO public.risk_summaries VALUES (233, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:17.057', '2025-05-18 21:15:17.074673');
INSERT INTO public.risk_summaries VALUES (234, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:17.617', '2025-05-18 21:15:17.63266');
INSERT INTO public.risk_summaries VALUES (235, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:18.188', '2025-05-18 21:15:18.208852');
INSERT INTO public.risk_summaries VALUES (236, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:18.802', '2025-05-18 21:15:18.820293');
INSERT INTO public.risk_summaries VALUES (237, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:19.458', '2025-05-18 21:15:19.477626');
INSERT INTO public.risk_summaries VALUES (238, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:20.053', '2025-05-18 21:15:20.071831');
INSERT INTO public.risk_summaries VALUES (239, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:20.611', '2025-05-18 21:15:20.626493');
INSERT INTO public.risk_summaries VALUES (240, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:21.165', '2025-05-18 21:15:21.183327');
INSERT INTO public.risk_summaries VALUES (241, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:21.73', '2025-05-18 21:15:21.746598');
INSERT INTO public.risk_summaries VALUES (242, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:22.282', '2025-05-18 21:15:22.298224');
INSERT INTO public.risk_summaries VALUES (243, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:22.826', '2025-05-18 21:15:22.841833');
INSERT INTO public.risk_summaries VALUES (244, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:23.377', '2025-05-18 21:15:23.393331');
INSERT INTO public.risk_summaries VALUES (245, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:23.928', '2025-05-18 21:15:23.944997');
INSERT INTO public.risk_summaries VALUES (246, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:24.471', '2025-05-18 21:15:24.489596');
INSERT INTO public.risk_summaries VALUES (247, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:24.772', '2025-05-18 21:15:24.78842');
INSERT INTO public.risk_summaries VALUES (248, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:25.565', '2025-05-18 21:15:25.582624');
INSERT INTO public.risk_summaries VALUES (249, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:26.17', '2025-05-18 21:15:26.186272');
INSERT INTO public.risk_summaries VALUES (250, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:26.747', '2025-05-18 21:15:26.763443');
INSERT INTO public.risk_summaries VALUES (251, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:15:27.296', '2025-05-18 21:15:27.311642');
INSERT INTO public.risk_summaries VALUES (252, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:19:19.962', '2025-05-18 21:19:19.978303');
INSERT INTO public.risk_summaries VALUES (253, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:19:26.781', '2025-05-18 21:19:26.797784');
INSERT INTO public.risk_summaries VALUES (254, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:19:34.798', '2025-05-18 21:19:34.814923');
INSERT INTO public.risk_summaries VALUES (255, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:19:41.819', '2025-05-18 21:19:41.835475');
INSERT INTO public.risk_summaries VALUES (256, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:26:30.649', '2025-05-18 21:26:30.669629');
INSERT INTO public.risk_summaries VALUES (257, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:26:34.431', '2025-05-18 21:26:34.448638');
INSERT INTO public.risk_summaries VALUES (258, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:26:35.935', '2025-05-18 21:26:35.950089');
INSERT INTO public.risk_summaries VALUES (259, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:35:10.941', '2025-05-18 21:35:10.958252');
INSERT INTO public.risk_summaries VALUES (260, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:35:52.451', '2025-05-18 21:35:52.469322');
INSERT INTO public.risk_summaries VALUES (261, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:36:48.966', '2025-05-18 21:36:48.98176');
INSERT INTO public.risk_summaries VALUES (262, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:37:04.443', '2025-05-18 21:37:04.465416');
INSERT INTO public.risk_summaries VALUES (263, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:37:12.568', '2025-05-18 21:37:12.584649');
INSERT INTO public.risk_summaries VALUES (264, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:37:13.306', '2025-05-18 21:37:13.321232');
INSERT INTO public.risk_summaries VALUES (265, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:37:29.346', '2025-05-18 21:37:29.362269');
INSERT INTO public.risk_summaries VALUES (266, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:37:35.111', '2025-05-18 21:37:35.127392');
INSERT INTO public.risk_summaries VALUES (267, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:38:30.837', '2025-05-18 21:38:30.852805');
INSERT INTO public.risk_summaries VALUES (268, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:39:57.667', '2025-05-18 21:39:57.684316');
INSERT INTO public.risk_summaries VALUES (269, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:40:22.817', '2025-05-18 21:40:22.838064');
INSERT INTO public.risk_summaries VALUES (270, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:40:26.057', '2025-05-18 21:40:26.072781');
INSERT INTO public.risk_summaries VALUES (271, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:40:26.813', '2025-05-18 21:40:26.829661');
INSERT INTO public.risk_summaries VALUES (272, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:40:35.031', '2025-05-18 21:40:35.047137');
INSERT INTO public.risk_summaries VALUES (273, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:40:59.283', '2025-05-18 21:40:59.298569');
INSERT INTO public.risk_summaries VALUES (274, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:41:15.416', '2025-05-18 21:41:15.432034');
INSERT INTO public.risk_summaries VALUES (275, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:41:21.733', '2025-05-18 21:41:21.748745');
INSERT INTO public.risk_summaries VALUES (276, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:42:31.466', '2025-05-18 21:42:31.485156');
INSERT INTO public.risk_summaries VALUES (277, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:42:43.482', '2025-05-18 21:42:43.499648');
INSERT INTO public.risk_summaries VALUES (278, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:43:22.6', '2025-05-18 21:43:22.616265');
INSERT INTO public.risk_summaries VALUES (279, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:43:33.163', '2025-05-18 21:43:33.180266');
INSERT INTO public.risk_summaries VALUES (280, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:43:48.952', '2025-05-18 21:43:48.968257');
INSERT INTO public.risk_summaries VALUES (281, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:44:48.02', '2025-05-18 21:44:48.036877');
INSERT INTO public.risk_summaries VALUES (282, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:44:59.682', '2025-05-18 21:44:59.696465');
INSERT INTO public.risk_summaries VALUES (283, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:45:35.737', '2025-05-18 21:45:35.758343');
INSERT INTO public.risk_summaries VALUES (284, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:49:39.447', '2025-05-18 21:49:39.467242');
INSERT INTO public.risk_summaries VALUES (285, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:50:23.354', '2025-05-18 21:50:23.368622');
INSERT INTO public.risk_summaries VALUES (286, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:51:35.287', '2025-05-18 21:51:35.303438');
INSERT INTO public.risk_summaries VALUES (287, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:54:27.873', '2025-05-18 21:54:27.889229');
INSERT INTO public.risk_summaries VALUES (288, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:54:35.67', '2025-05-18 21:54:35.685964');
INSERT INTO public.risk_summaries VALUES (289, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:54:55.677', '2025-05-18 21:54:55.693615');
INSERT INTO public.risk_summaries VALUES (290, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:07.439', '2025-05-18 21:55:07.461833');
INSERT INTO public.risk_summaries VALUES (291, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:08.105', '2025-05-18 21:55:08.121175');
INSERT INTO public.risk_summaries VALUES (292, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:08.774', '2025-05-18 21:55:08.790536');
INSERT INTO public.risk_summaries VALUES (293, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:09.482', '2025-05-18 21:55:09.50034');
INSERT INTO public.risk_summaries VALUES (294, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:10.195', '2025-05-18 21:55:10.211997');
INSERT INTO public.risk_summaries VALUES (295, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:10.749', '2025-05-18 21:55:10.76446');
INSERT INTO public.risk_summaries VALUES (296, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:10.869', '2025-05-18 21:55:10.885934');
INSERT INTO public.risk_summaries VALUES (297, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:11.518', '2025-05-18 21:55:11.533773');
INSERT INTO public.risk_summaries VALUES (298, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:12.154', '2025-05-18 21:55:12.170498');
INSERT INTO public.risk_summaries VALUES (299, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:12.803', '2025-05-18 21:55:12.819626');
INSERT INTO public.risk_summaries VALUES (300, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:13.916', '2025-05-18 21:55:13.936331');
INSERT INTO public.risk_summaries VALUES (301, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:58.696', '2025-05-18 21:55:58.71144');
INSERT INTO public.risk_summaries VALUES (302, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:59.315', '2025-05-18 21:55:59.333501');
INSERT INTO public.risk_summaries VALUES (303, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:55:59.951', '2025-05-18 21:55:59.965356');
INSERT INTO public.risk_summaries VALUES (304, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:00.6', '2025-05-18 21:56:00.615991');
INSERT INTO public.risk_summaries VALUES (305, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:01.297', '2025-05-18 21:56:01.313079');
INSERT INTO public.risk_summaries VALUES (306, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:01.928', '2025-05-18 21:56:01.943977');
INSERT INTO public.risk_summaries VALUES (307, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:02.563', '2025-05-18 21:56:02.578312');
INSERT INTO public.risk_summaries VALUES (308, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:03.204', '2025-05-18 21:56:03.22049');
INSERT INTO public.risk_summaries VALUES (309, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:03.875', '2025-05-18 21:56:03.892567');
INSERT INTO public.risk_summaries VALUES (310, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:04.511', '2025-05-18 21:56:04.527175');
INSERT INTO public.risk_summaries VALUES (311, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:05.131', '2025-05-18 21:56:05.146329');
INSERT INTO public.risk_summaries VALUES (312, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:05.747', '2025-05-18 21:56:05.762984');
INSERT INTO public.risk_summaries VALUES (313, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:06.361', '2025-05-18 21:56:06.377209');
INSERT INTO public.risk_summaries VALUES (314, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:06.977', '2025-05-18 21:56:06.992309');
INSERT INTO public.risk_summaries VALUES (315, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:07.595', '2025-05-18 21:56:07.609622');
INSERT INTO public.risk_summaries VALUES (316, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:08.216', '2025-05-18 21:56:08.230524');
INSERT INTO public.risk_summaries VALUES (317, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:08.848', '2025-05-18 21:56:08.863414');
INSERT INTO public.risk_summaries VALUES (318, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:09.572', '2025-05-18 21:56:09.59038');
INSERT INTO public.risk_summaries VALUES (319, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:10.254', '2025-05-18 21:56:10.269525');
INSERT INTO public.risk_summaries VALUES (320, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:10.947', '2025-05-18 21:56:10.970862');
INSERT INTO public.risk_summaries VALUES (321, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:11.604', '2025-05-18 21:56:11.619211');
INSERT INTO public.risk_summaries VALUES (322, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:12.222', '2025-05-18 21:56:12.237855');
INSERT INTO public.risk_summaries VALUES (323, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:12.836', '2025-05-18 21:56:12.851987');
INSERT INTO public.risk_summaries VALUES (324, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:13.453', '2025-05-18 21:56:13.4688');
INSERT INTO public.risk_summaries VALUES (325, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:14.07', '2025-05-18 21:56:14.085291');
INSERT INTO public.risk_summaries VALUES (326, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:14.69', '2025-05-18 21:56:14.705517');
INSERT INTO public.risk_summaries VALUES (327, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:15.305', '2025-05-18 21:56:15.320767');
INSERT INTO public.risk_summaries VALUES (328, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:15.922', '2025-05-18 21:56:15.937112');
INSERT INTO public.risk_summaries VALUES (329, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:16.538', '2025-05-18 21:56:16.553875');
INSERT INTO public.risk_summaries VALUES (330, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:17.157', '2025-05-18 21:56:17.172303');
INSERT INTO public.risk_summaries VALUES (331, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:17.79', '2025-05-18 21:56:17.805404');
INSERT INTO public.risk_summaries VALUES (332, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:18.465', '2025-05-18 21:56:18.480953');
INSERT INTO public.risk_summaries VALUES (333, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:19.105', '2025-05-18 21:56:19.121983');
INSERT INTO public.risk_summaries VALUES (334, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:19.809', '2025-05-18 21:56:19.826206');
INSERT INTO public.risk_summaries VALUES (335, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:20.469', '2025-05-18 21:56:20.484554');
INSERT INTO public.risk_summaries VALUES (336, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:21.084', '2025-05-18 21:56:21.099837');
INSERT INTO public.risk_summaries VALUES (337, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:21.701', '2025-05-18 21:56:21.716228');
INSERT INTO public.risk_summaries VALUES (338, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:22.318', '2025-05-18 21:56:22.333764');
INSERT INTO public.risk_summaries VALUES (339, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:22.934', '2025-05-18 21:56:22.949382');
INSERT INTO public.risk_summaries VALUES (340, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:23.549', '2025-05-18 21:56:23.564151');
INSERT INTO public.risk_summaries VALUES (341, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:24.175', '2025-05-18 21:56:24.190371');
INSERT INTO public.risk_summaries VALUES (342, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:24.793', '2025-05-18 21:56:24.808098');
INSERT INTO public.risk_summaries VALUES (343, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:25.416', '2025-05-18 21:56:25.431905');
INSERT INTO public.risk_summaries VALUES (344, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:26.067', '2025-05-18 21:56:26.084457');
INSERT INTO public.risk_summaries VALUES (345, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:26.863', '2025-05-18 21:56:26.887394');
INSERT INTO public.risk_summaries VALUES (346, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:27.547', '2025-05-18 21:56:27.564183');
INSERT INTO public.risk_summaries VALUES (347, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:28.235', '2025-05-18 21:56:28.25192');
INSERT INTO public.risk_summaries VALUES (348, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:28.963', '2025-05-18 21:56:28.979424');
INSERT INTO public.risk_summaries VALUES (349, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:29.598', '2025-05-18 21:56:29.613428');
INSERT INTO public.risk_summaries VALUES (350, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:30.218', '2025-05-18 21:56:30.23392');
INSERT INTO public.risk_summaries VALUES (351, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:30.899', '2025-05-18 21:56:30.914353');
INSERT INTO public.risk_summaries VALUES (352, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:31.513', '2025-05-18 21:56:31.527538');
INSERT INTO public.risk_summaries VALUES (353, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:32.135', '2025-05-18 21:56:32.151');
INSERT INTO public.risk_summaries VALUES (354, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:32.761', '2025-05-18 21:56:32.777563');
INSERT INTO public.risk_summaries VALUES (355, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:33.394', '2025-05-18 21:56:33.40981');
INSERT INTO public.risk_summaries VALUES (356, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:34.014', '2025-05-18 21:56:34.031133');
INSERT INTO public.risk_summaries VALUES (357, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:34.678', '2025-05-18 21:56:34.69367');
INSERT INTO public.risk_summaries VALUES (358, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:35.296', '2025-05-18 21:56:35.312375');
INSERT INTO public.risk_summaries VALUES (359, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:35.921', '2025-05-18 21:56:35.935878');
INSERT INTO public.risk_summaries VALUES (360, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:36.539', '2025-05-18 21:56:36.554157');
INSERT INTO public.risk_summaries VALUES (361, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:37.17', '2025-05-18 21:56:37.18568');
INSERT INTO public.risk_summaries VALUES (362, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:37.625', '2025-05-18 21:56:37.641004');
INSERT INTO public.risk_summaries VALUES (363, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:37.629', '2025-05-18 21:56:37.645195');
INSERT INTO public.risk_summaries VALUES (364, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:37.848', '2025-05-18 21:56:37.866909');
INSERT INTO public.risk_summaries VALUES (365, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:38.201', '2025-05-18 21:56:38.217894');
INSERT INTO public.risk_summaries VALUES (366, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:38.308', '2025-05-18 21:56:38.323229');
INSERT INTO public.risk_summaries VALUES (367, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:38.525', '2025-05-18 21:56:38.540814');
INSERT INTO public.risk_summaries VALUES (368, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:38.769', '2025-05-18 21:56:38.785527');
INSERT INTO public.risk_summaries VALUES (369, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:39.19', '2025-05-18 21:56:39.205373');
INSERT INTO public.risk_summaries VALUES (370, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:39.819', '2025-05-18 21:56:39.83487');
INSERT INTO public.risk_summaries VALUES (371, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:40.45', '2025-05-18 21:56:40.466089');
INSERT INTO public.risk_summaries VALUES (372, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:41.067', '2025-05-18 21:56:41.082934');
INSERT INTO public.risk_summaries VALUES (373, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:41.689', '2025-05-18 21:56:41.704447');
INSERT INTO public.risk_summaries VALUES (374, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:42.314', '2025-05-18 21:56:42.329398');
INSERT INTO public.risk_summaries VALUES (375, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:42.966', '2025-05-18 21:56:42.981203');
INSERT INTO public.risk_summaries VALUES (376, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:43.616', '2025-05-18 21:56:43.633329');
INSERT INTO public.risk_summaries VALUES (377, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:44.254', '2025-05-18 21:56:44.269524');
INSERT INTO public.risk_summaries VALUES (378, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:44.87', '2025-05-18 21:56:44.885168');
INSERT INTO public.risk_summaries VALUES (379, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:45.141', '2025-05-18 21:56:45.156766');
INSERT INTO public.risk_summaries VALUES (380, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:45.535', '2025-05-18 21:56:45.550827');
INSERT INTO public.risk_summaries VALUES (381, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:46.198', '2025-05-18 21:56:46.213411');
INSERT INTO public.risk_summaries VALUES (382, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:46.845', '2025-05-18 21:56:46.860485');
INSERT INTO public.risk_summaries VALUES (383, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:47.47', '2025-05-18 21:56:47.489324');
INSERT INTO public.risk_summaries VALUES (384, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:48.118', '2025-05-18 21:56:48.134028');
INSERT INTO public.risk_summaries VALUES (385, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:48.74', '2025-05-18 21:56:48.755073');
INSERT INTO public.risk_summaries VALUES (386, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:49.367', '2025-05-18 21:56:49.382648');
INSERT INTO public.risk_summaries VALUES (387, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:50.001', '2025-05-18 21:56:50.016312');
INSERT INTO public.risk_summaries VALUES (388, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:50.508', '2025-05-18 21:56:50.523498');
INSERT INTO public.risk_summaries VALUES (389, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:50.568', '2025-05-18 21:56:50.58433');
INSERT INTO public.risk_summaries VALUES (390, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:50.75', '2025-05-18 21:56:50.765965');
INSERT INTO public.risk_summaries VALUES (391, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:51.234', '2025-05-18 21:56:51.250418');
INSERT INTO public.risk_summaries VALUES (392, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:51.385', '2025-05-18 21:56:51.401091');
INSERT INTO public.risk_summaries VALUES (393, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:52.056', '2025-05-18 21:56:52.07321');
INSERT INTO public.risk_summaries VALUES (394, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:52.723', '2025-05-18 21:56:52.739102');
INSERT INTO public.risk_summaries VALUES (395, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:53.361', '2025-05-18 21:56:53.376908');
INSERT INTO public.risk_summaries VALUES (396, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:54.032', '2025-05-18 21:56:54.048356');
INSERT INTO public.risk_summaries VALUES (397, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:54.715', '2025-05-18 21:56:54.73127');
INSERT INTO public.risk_summaries VALUES (398, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:55.361', '2025-05-18 21:56:55.377314');
INSERT INTO public.risk_summaries VALUES (399, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:55.679', '2025-05-18 21:56:55.694047');
INSERT INTO public.risk_summaries VALUES (400, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:56.001', '2025-05-18 21:56:56.017142');
INSERT INTO public.risk_summaries VALUES (401, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:56.639', '2025-05-18 21:56:56.655529');
INSERT INTO public.risk_summaries VALUES (402, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:57.214', '2025-05-18 21:56:57.230992');
INSERT INTO public.risk_summaries VALUES (403, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:57.275', '2025-05-18 21:56:57.290731');
INSERT INTO public.risk_summaries VALUES (404, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:57.822', '2025-05-18 21:56:57.83835');
INSERT INTO public.risk_summaries VALUES (405, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:57.911', '2025-05-18 21:56:57.92677');
INSERT INTO public.risk_summaries VALUES (406, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:58.547', '2025-05-18 21:56:58.563186');
INSERT INTO public.risk_summaries VALUES (407, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:58.659', '2025-05-18 21:56:58.676781');
INSERT INTO public.risk_summaries VALUES (408, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:58.775', '2025-05-18 21:56:58.790602');
INSERT INTO public.risk_summaries VALUES (409, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:59.151', '2025-05-18 21:56:59.166571');
INSERT INTO public.risk_summaries VALUES (410, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:59.242', '2025-05-18 21:56:59.259396');
INSERT INTO public.risk_summaries VALUES (411, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:59.466', '2025-05-18 21:56:59.482087');
INSERT INTO public.risk_summaries VALUES (412, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:59.767', '2025-05-18 21:56:59.788884');
INSERT INTO public.risk_summaries VALUES (413, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:56:59.935', '2025-05-18 21:56:59.950895');
INSERT INTO public.risk_summaries VALUES (414, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:00.672', '2025-05-18 21:57:00.689376');
INSERT INTO public.risk_summaries VALUES (415, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:00.859', '2025-05-18 21:57:00.875018');
INSERT INTO public.risk_summaries VALUES (416, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:01.461', '2025-05-18 21:57:01.477858');
INSERT INTO public.risk_summaries VALUES (417, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:02.084', '2025-05-18 21:57:02.102385');
INSERT INTO public.risk_summaries VALUES (418, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:02.101', '2025-05-18 21:57:02.117164');
INSERT INTO public.risk_summaries VALUES (419, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:02.16', '2025-05-18 21:57:02.176431');
INSERT INTO public.risk_summaries VALUES (420, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:02.796', '2025-05-18 21:57:02.811164');
INSERT INTO public.risk_summaries VALUES (421, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:03.42', '2025-05-18 21:57:03.437305');
INSERT INTO public.risk_summaries VALUES (422, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:04.043', '2025-05-18 21:57:04.058536');
INSERT INTO public.risk_summaries VALUES (423, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:04.666', '2025-05-18 21:57:04.681984');
INSERT INTO public.risk_summaries VALUES (424, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:05.286', '2025-05-18 21:57:05.301283');
INSERT INTO public.risk_summaries VALUES (425, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:05.909', '2025-05-18 21:57:05.924997');
INSERT INTO public.risk_summaries VALUES (426, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:06.143', '2025-05-18 21:57:06.158708');
INSERT INTO public.risk_summaries VALUES (427, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:06.472', '2025-05-18 21:57:06.487206');
INSERT INTO public.risk_summaries VALUES (428, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:06.577', '2025-05-18 21:57:06.595204');
INSERT INTO public.risk_summaries VALUES (429, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:07.157', '2025-05-18 21:57:07.173427');
INSERT INTO public.risk_summaries VALUES (433, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:07.844', '2025-05-18 21:57:07.859789');
INSERT INTO public.risk_summaries VALUES (434, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:08.432', '2025-05-18 21:57:08.447621');
INSERT INTO public.risk_summaries VALUES (437, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:09.237', '2025-05-18 21:57:09.25339');
INSERT INTO public.risk_summaries VALUES (438, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:09.886', '2025-05-18 21:57:09.902094');
INSERT INTO public.risk_summaries VALUES (440, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:10.531', '2025-05-18 21:57:10.549573');
INSERT INTO public.risk_summaries VALUES (442, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:11.165', '2025-05-18 21:57:11.181242');
INSERT INTO public.risk_summaries VALUES (444, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:11.706', '2025-05-18 21:57:11.723891');
INSERT INTO public.risk_summaries VALUES (446, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:12.346', '2025-05-18 21:57:12.362383');
INSERT INTO public.risk_summaries VALUES (455, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:17.063', '2025-05-18 21:57:17.080623');
INSERT INTO public.risk_summaries VALUES (456, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:17.712', '2025-05-18 21:57:17.727947');
INSERT INTO public.risk_summaries VALUES (457, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:18.237', '2025-05-18 21:57:18.253408');
INSERT INTO public.risk_summaries VALUES (459, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:18.902', '2025-05-18 21:57:18.918787');
INSERT INTO public.risk_summaries VALUES (462, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:19.735', '2025-05-18 21:57:19.751645');
INSERT INTO public.risk_summaries VALUES (465, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:20.381', '2025-05-18 21:57:20.39671');
INSERT INTO public.risk_summaries VALUES (467, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:20.944', '2025-05-18 21:57:20.961094');
INSERT INTO public.risk_summaries VALUES (472, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:23.087', '2025-05-18 21:57:23.10301');
INSERT INTO public.risk_summaries VALUES (474, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:23.607', '2025-05-18 21:57:23.623461');
INSERT INTO public.risk_summaries VALUES (475, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:24.26', '2025-05-18 21:57:24.277023');
INSERT INTO public.risk_summaries VALUES (476, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:24.906', '2025-05-18 21:57:24.921838');
INSERT INTO public.risk_summaries VALUES (477, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:25.607', '2025-05-18 21:57:25.625937');
INSERT INTO public.risk_summaries VALUES (479, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:26.304', '2025-05-18 21:57:26.321441');
INSERT INTO public.risk_summaries VALUES (480, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:26.989', '2025-05-18 21:57:27.005597');
INSERT INTO public.risk_summaries VALUES (482, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:27.575', '2025-05-18 21:57:27.59273');
INSERT INTO public.risk_summaries VALUES (484, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:28.229', '2025-05-18 21:57:28.248916');
INSERT INTO public.risk_summaries VALUES (487, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:28.802', '2025-05-18 21:57:28.818103');
INSERT INTO public.risk_summaries VALUES (489, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:29.425', '2025-05-18 21:57:29.440959');
INSERT INTO public.risk_summaries VALUES (492, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:30.229', '2025-05-18 21:57:30.244938');
INSERT INTO public.risk_summaries VALUES (493, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:30.866', '2025-05-18 21:57:30.882134');
INSERT INTO public.risk_summaries VALUES (495, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:31.497', '2025-05-18 21:57:31.513457');
INSERT INTO public.risk_summaries VALUES (496, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:32.116', '2025-05-18 21:57:32.137177');
INSERT INTO public.risk_summaries VALUES (499, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:32.795', '2025-05-18 21:57:32.811463');
INSERT INTO public.risk_summaries VALUES (501, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:33.439', '2025-05-18 21:57:33.454635');
INSERT INTO public.risk_summaries VALUES (502, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:34.076', '2025-05-18 21:57:34.092411');
INSERT INTO public.risk_summaries VALUES (503, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:34.734', '2025-05-18 21:57:34.750343');
INSERT INTO public.risk_summaries VALUES (504, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:35.38', '2025-05-18 21:57:35.396045');
INSERT INTO public.risk_summaries VALUES (510, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:38.062', '2025-05-18 21:57:38.078693');
INSERT INTO public.risk_summaries VALUES (511, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:38.689', '2025-05-18 21:57:38.710147');
INSERT INTO public.risk_summaries VALUES (512, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:39.345', '2025-05-18 21:57:39.366358');
INSERT INTO public.risk_summaries VALUES (514, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:40.004', '2025-05-18 21:57:40.020391');
INSERT INTO public.risk_summaries VALUES (516, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:40.686', '2025-05-18 21:57:40.707164');
INSERT INTO public.risk_summaries VALUES (518, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:41.283', '2025-05-18 21:57:41.298874');
INSERT INTO public.risk_summaries VALUES (522, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:42.056', '2025-05-18 21:57:42.075249');
INSERT INTO public.risk_summaries VALUES (524, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:42.751', '2025-05-18 21:57:42.773317');
INSERT INTO public.risk_summaries VALUES (525, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:43.417', '2025-05-18 21:57:43.433131');
INSERT INTO public.risk_summaries VALUES (526, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:44.059', '2025-05-18 21:57:44.07507');
INSERT INTO public.risk_summaries VALUES (537, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:48.649', '2025-05-18 21:57:48.666055');
INSERT INTO public.risk_summaries VALUES (539, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:49.296', '2025-05-18 21:57:49.313728');
INSERT INTO public.risk_summaries VALUES (542, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:49.9', '2025-05-18 21:57:49.921373');
INSERT INTO public.risk_summaries VALUES (545, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:50.591', '2025-05-18 21:57:50.609046');
INSERT INTO public.risk_summaries VALUES (546, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:51.196', '2025-05-18 21:57:51.212082');
INSERT INTO public.risk_summaries VALUES (430, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:07.209', '2025-05-18 21:57:07.224442');
INSERT INTO public.risk_summaries VALUES (432, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:07.784', '2025-05-18 21:57:07.799619');
INSERT INTO public.risk_summaries VALUES (435, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:08.476', '2025-05-18 21:57:08.491266');
INSERT INTO public.risk_summaries VALUES (436, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:09.083', '2025-05-18 21:57:09.099399');
INSERT INTO public.risk_summaries VALUES (439, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:10.309', '2025-05-18 21:57:10.324337');
INSERT INTO public.risk_summaries VALUES (441, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:10.958', '2025-05-18 21:57:10.973735');
INSERT INTO public.risk_summaries VALUES (443, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:11.545', '2025-05-18 21:57:11.560606');
INSERT INTO public.risk_summaries VALUES (463, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:20.114', '2025-05-18 21:57:20.129612');
INSERT INTO public.risk_summaries VALUES (466, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:20.717', '2025-05-18 21:57:20.733031');
INSERT INTO public.risk_summaries VALUES (473, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:23.103', '2025-05-18 21:57:23.118272');
INSERT INTO public.risk_summaries VALUES (478, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:26.236', '2025-05-18 21:57:26.25154');
INSERT INTO public.risk_summaries VALUES (481, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:27.471', '2025-05-18 21:57:27.486809');
INSERT INTO public.risk_summaries VALUES (486, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:28.719', '2025-05-18 21:57:28.734267');
INSERT INTO public.risk_summaries VALUES (431, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:07.427', '2025-05-18 21:57:07.443474');
INSERT INTO public.risk_summaries VALUES (445, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:11.839', '2025-05-18 21:57:11.855158');
INSERT INTO public.risk_summaries VALUES (447, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:12.493', '2025-05-18 21:57:12.509461');
INSERT INTO public.risk_summaries VALUES (448, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:13.136', '2025-05-18 21:57:13.15227');
INSERT INTO public.risk_summaries VALUES (449, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:13.777', '2025-05-18 21:57:13.792037');
INSERT INTO public.risk_summaries VALUES (450, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:14.417', '2025-05-18 21:57:14.435053');
INSERT INTO public.risk_summaries VALUES (451, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:15.059', '2025-05-18 21:57:15.075189');
INSERT INTO public.risk_summaries VALUES (452, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:15.747', '2025-05-18 21:57:15.762602');
INSERT INTO public.risk_summaries VALUES (453, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:16.385', '2025-05-18 21:57:16.400061');
INSERT INTO public.risk_summaries VALUES (454, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:16.978', '2025-05-18 21:57:16.993168');
INSERT INTO public.risk_summaries VALUES (458, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:18.389', '2025-05-18 21:57:18.409011');
INSERT INTO public.risk_summaries VALUES (460, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:19.067', '2025-05-18 21:57:19.084089');
INSERT INTO public.risk_summaries VALUES (461, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:19.687', '2025-05-18 21:57:19.704289');
INSERT INTO public.risk_summaries VALUES (464, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:20.318', '2025-05-18 21:57:20.333457');
INSERT INTO public.risk_summaries VALUES (468, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:21.031', '2025-05-18 21:57:21.047375');
INSERT INTO public.risk_summaries VALUES (469, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:21.669', '2025-05-18 21:57:21.685002');
INSERT INTO public.risk_summaries VALUES (470, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:22.306', '2025-05-18 21:57:22.321934');
INSERT INTO public.risk_summaries VALUES (471, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:22.966', '2025-05-18 21:57:22.981867');
INSERT INTO public.risk_summaries VALUES (483, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:27.684', '2025-05-18 21:57:27.699998');
INSERT INTO public.risk_summaries VALUES (485, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:28.323', '2025-05-18 21:57:28.338996');
INSERT INTO public.risk_summaries VALUES (488, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:28.961', '2025-05-18 21:57:28.977151');
INSERT INTO public.risk_summaries VALUES (490, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:29.594', '2025-05-18 21:57:29.609825');
INSERT INTO public.risk_summaries VALUES (491, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:30.201', '2025-05-18 21:57:30.217416');
INSERT INTO public.risk_summaries VALUES (494, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:31.497', '2025-05-18 21:57:31.512659');
INSERT INTO public.risk_summaries VALUES (497, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:32.134', '2025-05-18 21:57:32.149445');
INSERT INTO public.risk_summaries VALUES (498, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:32.675', '2025-05-18 21:57:32.691165');
INSERT INTO public.risk_summaries VALUES (500, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:33.324', '2025-05-18 21:57:33.340361');
INSERT INTO public.risk_summaries VALUES (505, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:35.381', '2025-05-18 21:57:35.397294');
INSERT INTO public.risk_summaries VALUES (506, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:36.085', '2025-05-18 21:57:36.10493');
INSERT INTO public.risk_summaries VALUES (507, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:36.731', '2025-05-18 21:57:36.747615');
INSERT INTO public.risk_summaries VALUES (508, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:37.374', '2025-05-18 21:57:37.390357');
INSERT INTO public.risk_summaries VALUES (509, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:38.014', '2025-05-18 21:57:38.030647');
INSERT INTO public.risk_summaries VALUES (513, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:39.857', '2025-05-18 21:57:39.873215');
INSERT INTO public.risk_summaries VALUES (515, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:40.654', '2025-05-18 21:57:40.671884');
INSERT INTO public.risk_summaries VALUES (517, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:41.258', '2025-05-18 21:57:41.27432');
INSERT INTO public.risk_summaries VALUES (519, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:41.352', '2025-05-18 21:57:41.368726');
INSERT INTO public.risk_summaries VALUES (520, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:41.851', '2025-05-18 21:57:41.867397');
INSERT INTO public.risk_summaries VALUES (521, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:41.948', '2025-05-18 21:57:41.966652');
INSERT INTO public.risk_summaries VALUES (523, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:42.058', '2025-05-18 21:57:42.0772');
INSERT INTO public.risk_summaries VALUES (527, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:44.166', '2025-05-18 21:57:44.182353');
INSERT INTO public.risk_summaries VALUES (528, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:44.564', '2025-05-18 21:57:44.580694');
INSERT INTO public.risk_summaries VALUES (529, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:44.692', '2025-05-18 21:57:44.70756');
INSERT INTO public.risk_summaries VALUES (530, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:45.322', '2025-05-18 21:57:45.337657');
INSERT INTO public.risk_summaries VALUES (531, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:45.961', '2025-05-18 21:57:45.977217');
INSERT INTO public.risk_summaries VALUES (532, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:46.596', '2025-05-18 21:57:46.611473');
INSERT INTO public.risk_summaries VALUES (533, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:47.223', '2025-05-18 21:57:47.238487');
INSERT INTO public.risk_summaries VALUES (534, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:47.85', '2025-05-18 21:57:47.866231');
INSERT INTO public.risk_summaries VALUES (535, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:48.433', '2025-05-18 21:57:48.448287');
INSERT INTO public.risk_summaries VALUES (536, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:48.495', '2025-05-18 21:57:48.510706');
INSERT INTO public.risk_summaries VALUES (538, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:49.182', '2025-05-18 21:57:49.20429');
INSERT INTO public.risk_summaries VALUES (540, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:49.665', '2025-05-18 21:57:49.680843');
INSERT INTO public.risk_summaries VALUES (541, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:49.786', '2025-05-18 21:57:49.802164');
INSERT INTO public.risk_summaries VALUES (543, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:50.374', '2025-05-18 21:57:50.390584');
INSERT INTO public.risk_summaries VALUES (544, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:50.558', '2025-05-18 21:57:50.575581');
INSERT INTO public.risk_summaries VALUES (547, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:51.252', '2025-05-18 21:57:51.26773');
INSERT INTO public.risk_summaries VALUES (548, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:51.957', '2025-05-18 21:57:51.974165');
INSERT INTO public.risk_summaries VALUES (549, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:52.497', '2025-05-18 21:57:52.512596');
INSERT INTO public.risk_summaries VALUES (550, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:52.617', '2025-05-18 21:57:52.633803');
INSERT INTO public.risk_summaries VALUES (551, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:53.095', '2025-05-18 21:57:53.110398');
INSERT INTO public.risk_summaries VALUES (552, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:53.294', '2025-05-18 21:57:53.311098');
INSERT INTO public.risk_summaries VALUES (553, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:53.76', '2025-05-18 21:57:53.776008');
INSERT INTO public.risk_summaries VALUES (554, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:53.997', '2025-05-18 21:57:54.013218');
INSERT INTO public.risk_summaries VALUES (555, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:54.397', '2025-05-18 21:57:54.412654');
INSERT INTO public.risk_summaries VALUES (556, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:54.712', '2025-05-18 21:57:54.727603');
INSERT INTO public.risk_summaries VALUES (557, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:55.354', '2025-05-18 21:57:55.370691');
INSERT INTO public.risk_summaries VALUES (558, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:55.994', '2025-05-18 21:57:56.009811');
INSERT INTO public.risk_summaries VALUES (559, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:56.347', '2025-05-18 21:57:56.363381');
INSERT INTO public.risk_summaries VALUES (560, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:56.648', '2025-05-18 21:57:56.663723');
INSERT INTO public.risk_summaries VALUES (561, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:57.291', '2025-05-18 21:57:57.307238');
INSERT INTO public.risk_summaries VALUES (562, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:57.943', '2025-05-18 21:57:57.959004');
INSERT INTO public.risk_summaries VALUES (563, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:57.967', '2025-05-18 21:57:57.982699');
INSERT INTO public.risk_summaries VALUES (564, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:59.132', '2025-05-18 21:57:59.148276');
INSERT INTO public.risk_summaries VALUES (565, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:59.408', '2025-05-18 21:57:59.423022');
INSERT INTO public.risk_summaries VALUES (566, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:59.742', '2025-05-18 21:57:59.759885');
INSERT INTO public.risk_summaries VALUES (569, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:00.96', '2025-05-18 21:58:00.976245');
INSERT INTO public.risk_summaries VALUES (571, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.583', '2025-05-18 21:58:01.599213');
INSERT INTO public.risk_summaries VALUES (572, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.604', '2025-05-18 21:58:01.62049');
INSERT INTO public.risk_summaries VALUES (576, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.231', '2025-05-18 21:58:02.247854');
INSERT INTO public.risk_summaries VALUES (577, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.233', '2025-05-18 21:58:02.248205');
INSERT INTO public.risk_summaries VALUES (583, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.873', '2025-05-18 21:58:02.889186');
INSERT INTO public.risk_summaries VALUES (584, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.925', '2025-05-18 21:58:02.940827');
INSERT INTO public.risk_summaries VALUES (587, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:03.57', '2025-05-18 21:58:03.585712');
INSERT INTO public.risk_summaries VALUES (588, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:04.221', '2025-05-18 21:58:04.236779');
INSERT INTO public.risk_summaries VALUES (590, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:04.868', '2025-05-18 21:58:04.885205');
INSERT INTO public.risk_summaries VALUES (592, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:05.51', '2025-05-18 21:58:05.525336');
INSERT INTO public.risk_summaries VALUES (597, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:08.1', '2025-05-18 21:58:08.115787');
INSERT INTO public.risk_summaries VALUES (599, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:08.854', '2025-05-18 21:58:08.870258');
INSERT INTO public.risk_summaries VALUES (602, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:09.581', '2025-05-18 21:58:09.598704');
INSERT INTO public.risk_summaries VALUES (603, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.187', '2025-05-18 21:58:10.203313');
INSERT INTO public.risk_summaries VALUES (606, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.745', '2025-05-18 21:58:10.760982');
INSERT INTO public.risk_summaries VALUES (608, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.874', '2025-05-18 21:58:10.889874');
INSERT INTO public.risk_summaries VALUES (609, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:11.515', '2025-05-18 21:58:11.530415');
INSERT INTO public.risk_summaries VALUES (612, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:12.156', '2025-05-18 21:58:12.173602');
INSERT INTO public.risk_summaries VALUES (613, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:12.82', '2025-05-18 21:58:12.835828');
INSERT INTO public.risk_summaries VALUES (614, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:13.444', '2025-05-18 21:58:13.459815');
INSERT INTO public.risk_summaries VALUES (617, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:14.108', '2025-05-18 21:58:14.125284');
INSERT INTO public.risk_summaries VALUES (618, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:14.703', '2025-05-18 21:58:14.7183');
INSERT INTO public.risk_summaries VALUES (621, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:15.42', '2025-05-18 21:58:15.436801');
INSERT INTO public.risk_summaries VALUES (622, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:16.091', '2025-05-18 21:58:16.106348');
INSERT INTO public.risk_summaries VALUES (623, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:16.796', '2025-05-18 21:58:16.811798');
INSERT INTO public.risk_summaries VALUES (625, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:17.474', '2025-05-18 21:58:17.489655');
INSERT INTO public.risk_summaries VALUES (626, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:18.135', '2025-05-18 21:58:18.151124');
INSERT INTO public.risk_summaries VALUES (627, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:18.77', '2025-05-18 21:58:18.785647');
INSERT INTO public.risk_summaries VALUES (629, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:19.403', '2025-05-18 21:58:19.41825');
INSERT INTO public.risk_summaries VALUES (630, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:19.635', '2025-05-18 21:58:19.650982');
INSERT INTO public.risk_summaries VALUES (646, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:29.783', '2025-05-18 21:58:29.798909');
INSERT INTO public.risk_summaries VALUES (647, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:30.424', '2025-05-18 21:58:30.440529');
INSERT INTO public.risk_summaries VALUES (648, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:31.09', '2025-05-18 21:58:31.10651');
INSERT INTO public.risk_summaries VALUES (649, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:31.731', '2025-05-18 21:58:31.7482');
INSERT INTO public.risk_summaries VALUES (650, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:32.389', '2025-05-18 21:58:32.405475');
INSERT INTO public.risk_summaries VALUES (651, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:33.031', '2025-05-18 21:58:33.047');
INSERT INTO public.risk_summaries VALUES (652, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:37.073', '2025-05-18 21:58:37.089432');
INSERT INTO public.risk_summaries VALUES (653, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:38.025', '2025-05-18 21:58:38.040785');
INSERT INTO public.risk_summaries VALUES (654, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:38.982', '2025-05-18 21:58:38.997623');
INSERT INTO public.risk_summaries VALUES (655, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:39.629', '2025-05-18 21:58:39.644615');
INSERT INTO public.risk_summaries VALUES (656, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:40.271', '2025-05-18 21:58:40.286674');
INSERT INTO public.risk_summaries VALUES (657, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:40.923', '2025-05-18 21:58:40.938907');
INSERT INTO public.risk_summaries VALUES (658, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:41.564', '2025-05-18 21:58:41.580041');
INSERT INTO public.risk_summaries VALUES (659, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:42.205', '2025-05-18 21:58:42.221211');
INSERT INTO public.risk_summaries VALUES (660, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:42.841', '2025-05-18 21:58:42.857106');
INSERT INTO public.risk_summaries VALUES (661, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:43.526', '2025-05-18 21:58:43.545585');
INSERT INTO public.risk_summaries VALUES (662, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:44.181', '2025-05-18 21:58:44.196868');
INSERT INTO public.risk_summaries VALUES (663, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:44.823', '2025-05-18 21:58:44.83863');
INSERT INTO public.risk_summaries VALUES (664, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:45.523', '2025-05-18 21:58:45.539402');
INSERT INTO public.risk_summaries VALUES (666, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:46.219', '2025-05-18 21:58:46.24341');
INSERT INTO public.risk_summaries VALUES (667, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:47.476', '2025-05-18 21:58:47.492161');
INSERT INTO public.risk_summaries VALUES (668, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:48.14', '2025-05-18 21:58:48.155843');
INSERT INTO public.risk_summaries VALUES (669, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:48.787', '2025-05-18 21:58:48.802862');
INSERT INTO public.risk_summaries VALUES (670, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:49.432', '2025-05-18 21:58:49.448526');
INSERT INTO public.risk_summaries VALUES (671, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:50.084', '2025-05-18 21:58:50.100256');
INSERT INTO public.risk_summaries VALUES (672, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:50.815', '2025-05-18 21:58:50.830853');
INSERT INTO public.risk_summaries VALUES (567, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:57:59.853', '2025-05-18 21:57:59.869878');
INSERT INTO public.risk_summaries VALUES (568, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:00.518', '2025-05-18 21:58:00.533665');
INSERT INTO public.risk_summaries VALUES (570, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.204', '2025-05-18 21:58:01.219874');
INSERT INTO public.risk_summaries VALUES (573, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.768', '2025-05-18 21:58:01.783054');
INSERT INTO public.risk_summaries VALUES (574, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.782', '2025-05-18 21:58:01.800776');
INSERT INTO public.risk_summaries VALUES (575, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:01.911', '2025-05-18 21:58:01.933085');
INSERT INTO public.risk_summaries VALUES (578, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.287', '2025-05-18 21:58:02.302502');
INSERT INTO public.risk_summaries VALUES (579, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.445', '2025-05-18 21:58:02.464387');
INSERT INTO public.risk_summaries VALUES (580, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.515', '2025-05-18 21:58:02.531828');
INSERT INTO public.risk_summaries VALUES (581, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.758', '2025-05-18 21:58:02.773854');
INSERT INTO public.risk_summaries VALUES (582, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:02.85', '2025-05-18 21:58:02.865393');
INSERT INTO public.risk_summaries VALUES (585, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:03.102', '2025-05-18 21:58:03.11742');
INSERT INTO public.risk_summaries VALUES (586, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:03.212', '2025-05-18 21:58:03.227642');
INSERT INTO public.risk_summaries VALUES (589, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:04.406', '2025-05-18 21:58:04.435623');
INSERT INTO public.risk_summaries VALUES (591, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:05.134', '2025-05-18 21:58:05.15008');
INSERT INTO public.risk_summaries VALUES (593, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:05.579', '2025-05-18 21:58:05.595371');
INSERT INTO public.risk_summaries VALUES (594, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:06.207', '2025-05-18 21:58:06.225438');
INSERT INTO public.risk_summaries VALUES (595, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:06.879', '2025-05-18 21:58:06.894829');
INSERT INTO public.risk_summaries VALUES (596, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:07.531', '2025-05-18 21:58:07.547248');
INSERT INTO public.risk_summaries VALUES (598, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:08.19', '2025-05-18 21:58:08.206959');
INSERT INTO public.risk_summaries VALUES (600, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:08.881', '2025-05-18 21:58:08.897032');
INSERT INTO public.risk_summaries VALUES (601, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:09.456', '2025-05-18 21:58:09.472695');
INSERT INTO public.risk_summaries VALUES (604, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.243', '2025-05-18 21:58:10.25889');
INSERT INTO public.risk_summaries VALUES (605, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.674', '2025-05-18 21:58:10.691583');
INSERT INTO public.risk_summaries VALUES (607, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:10.862', '2025-05-18 21:58:10.877364');
INSERT INTO public.risk_summaries VALUES (610, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:11.518', '2025-05-18 21:58:11.535197');
INSERT INTO public.risk_summaries VALUES (611, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:12.157', '2025-05-18 21:58:12.173291');
INSERT INTO public.risk_summaries VALUES (615, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:13.459', '2025-05-18 21:58:13.478573');
INSERT INTO public.risk_summaries VALUES (616, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:14.056', '2025-05-18 21:58:14.071698');
INSERT INTO public.risk_summaries VALUES (619, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:14.78', '2025-05-18 21:58:14.797117');
INSERT INTO public.risk_summaries VALUES (620, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:15.359', '2025-05-18 21:58:15.377442');
INSERT INTO public.risk_summaries VALUES (624, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:17.363', '2025-05-18 21:58:17.380613');
INSERT INTO public.risk_summaries VALUES (628, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:18.939', '2025-05-18 21:58:18.955651');
INSERT INTO public.risk_summaries VALUES (631, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:20.106', '2025-05-18 21:58:20.12208');
INSERT INTO public.risk_summaries VALUES (632, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:20.788', '2025-05-18 21:58:20.803711');
INSERT INTO public.risk_summaries VALUES (633, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:21.441', '2025-05-18 21:58:21.457185');
INSERT INTO public.risk_summaries VALUES (634, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:22.081', '2025-05-18 21:58:22.097301');
INSERT INTO public.risk_summaries VALUES (635, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:22.718', '2025-05-18 21:58:22.733971');
INSERT INTO public.risk_summaries VALUES (636, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:23.375', '2025-05-18 21:58:23.392436');
INSERT INTO public.risk_summaries VALUES (637, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:24.028', '2025-05-18 21:58:24.044585');
INSERT INTO public.risk_summaries VALUES (638, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:24.674', '2025-05-18 21:58:24.690371');
INSERT INTO public.risk_summaries VALUES (639, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:25.305', '2025-05-18 21:58:25.322117');
INSERT INTO public.risk_summaries VALUES (640, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:25.944', '2025-05-18 21:58:25.960778');
INSERT INTO public.risk_summaries VALUES (641, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:26.6', '2025-05-18 21:58:26.615683');
INSERT INTO public.risk_summaries VALUES (642, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:27.238', '2025-05-18 21:58:27.253702');
INSERT INTO public.risk_summaries VALUES (643, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:27.879', '2025-05-18 21:58:27.894616');
INSERT INTO public.risk_summaries VALUES (644, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:28.553', '2025-05-18 21:58:28.570162');
INSERT INTO public.risk_summaries VALUES (645, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:28.769', '2025-05-18 21:58:28.785703');
INSERT INTO public.risk_summaries VALUES (665, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:46.133', '2025-05-18 21:58:46.151158');
INSERT INTO public.risk_summaries VALUES (673, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:53.13', '2025-05-18 21:58:53.146378');
INSERT INTO public.risk_summaries VALUES (674, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:54.093', '2025-05-18 21:58:54.11183');
INSERT INTO public.risk_summaries VALUES (675, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:54.267', '2025-05-18 21:58:54.285791');
INSERT INTO public.risk_summaries VALUES (676, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:55.653', '2025-05-18 21:58:55.668385');
INSERT INTO public.risk_summaries VALUES (677, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:56.292', '2025-05-18 21:58:56.307191');
INSERT INTO public.risk_summaries VALUES (678, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:58:56.934', '2025-05-18 21:58:56.949554');
INSERT INTO public.risk_summaries VALUES (679, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:08.298', '2025-05-18 21:59:08.314806');
INSERT INTO public.risk_summaries VALUES (680, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:08.937', '2025-05-18 21:59:08.952595');
INSERT INTO public.risk_summaries VALUES (681, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:09.623', '2025-05-18 21:59:09.638815');
INSERT INTO public.risk_summaries VALUES (682, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:10.343', '2025-05-18 21:59:10.35812');
INSERT INTO public.risk_summaries VALUES (683, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:10.506', '2025-05-18 21:59:10.521796');
INSERT INTO public.risk_summaries VALUES (684, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:11.461', '2025-05-18 21:59:11.476592');
INSERT INTO public.risk_summaries VALUES (685, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:12.093', '2025-05-18 21:59:12.108744');
INSERT INTO public.risk_summaries VALUES (686, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:12.712', '2025-05-18 21:59:12.72777');
INSERT INTO public.risk_summaries VALUES (687, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 21:59:13.361', '2025-05-18 21:59:13.37845');
INSERT INTO public.risk_summaries VALUES (688, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:03:16.679', '2025-05-18 22:03:16.695811');
INSERT INTO public.risk_summaries VALUES (689, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:03:43.309', '2025-05-18 22:03:43.325467');
INSERT INTO public.risk_summaries VALUES (690, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:03:48.561', '2025-05-18 22:03:48.576829');
INSERT INTO public.risk_summaries VALUES (691, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:04:26.661', '2025-05-18 22:04:26.677467');
INSERT INTO public.risk_summaries VALUES (692, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:06:21.159', '2025-05-18 22:06:21.1767');
INSERT INTO public.risk_summaries VALUES (693, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:06:27.443', '2025-05-18 22:06:27.460239');
INSERT INTO public.risk_summaries VALUES (694, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:12:13.605', '2025-05-18 22:12:13.622781');
INSERT INTO public.risk_summaries VALUES (695, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:13:51.927', '2025-05-18 22:13:51.944563');
INSERT INTO public.risk_summaries VALUES (696, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:14:17.431', '2025-05-18 22:14:17.448054');
INSERT INTO public.risk_summaries VALUES (697, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:15:42.961', '2025-05-18 22:15:42.978884');
INSERT INTO public.risk_summaries VALUES (698, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:15:56.009', '2025-05-18 22:15:56.025734');
INSERT INTO public.risk_summaries VALUES (699, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:17:34.946', '2025-05-18 22:17:34.963375');
INSERT INTO public.risk_summaries VALUES (700, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:22:20.651', '2025-05-18 22:22:20.670912');
INSERT INTO public.risk_summaries VALUES (701, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:22:50.739', '2025-05-18 22:22:50.75479');
INSERT INTO public.risk_summaries VALUES (702, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:22:59.636', '2025-05-18 22:22:59.652015');
INSERT INTO public.risk_summaries VALUES (703, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:23:00.259', '2025-05-18 22:23:00.275937');
INSERT INTO public.risk_summaries VALUES (704, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:23:04.894', '2025-05-18 22:23:04.911397');
INSERT INTO public.risk_summaries VALUES (705, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:23:10.836', '2025-05-18 22:23:10.851624');
INSERT INTO public.risk_summaries VALUES (706, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:23:11.986', '2025-05-18 22:23:12.002276');
INSERT INTO public.risk_summaries VALUES (707, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:23:12.535', '2025-05-18 22:23:12.552654');
INSERT INTO public.risk_summaries VALUES (708, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:28:01.588', '2025-05-18 22:28:01.605068');
INSERT INTO public.risk_summaries VALUES (709, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:28:22.172', '2025-05-18 22:28:22.188433');
INSERT INTO public.risk_summaries VALUES (710, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:28:42.268', '2025-05-18 22:28:42.283843');
INSERT INTO public.risk_summaries VALUES (711, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:03.476', '2025-05-18 22:29:03.492547');
INSERT INTO public.risk_summaries VALUES (712, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:06.578', '2025-05-18 22:29:06.594244');
INSERT INTO public.risk_summaries VALUES (713, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:07.148', '2025-05-18 22:29:07.164309');
INSERT INTO public.risk_summaries VALUES (714, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:14.645', '2025-05-18 22:29:14.661627');
INSERT INTO public.risk_summaries VALUES (715, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:15.421', '2025-05-18 22:29:15.437382');
INSERT INTO public.risk_summaries VALUES (716, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:24.132', '2025-05-18 22:29:24.149028');
INSERT INTO public.risk_summaries VALUES (717, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:28.076', '2025-05-18 22:29:28.096046');
INSERT INTO public.risk_summaries VALUES (718, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:29:28.711', '2025-05-18 22:29:28.72735');
INSERT INTO public.risk_summaries VALUES (719, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:31:42.189', '2025-05-18 22:31:42.208131');
INSERT INTO public.risk_summaries VALUES (720, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:31:45.728', '2025-05-18 22:31:45.746611');
INSERT INTO public.risk_summaries VALUES (721, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:32:54.643', '2025-05-18 22:32:54.669028');
INSERT INTO public.risk_summaries VALUES (722, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:33:15.861', '2025-05-18 22:33:15.876314');
INSERT INTO public.risk_summaries VALUES (723, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:33:31.534', '2025-05-18 22:33:31.559817');
INSERT INTO public.risk_summaries VALUES (724, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:34:35.856', '2025-05-18 22:34:35.873051');
INSERT INTO public.risk_summaries VALUES (725, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:34:47.074', '2025-05-18 22:34:47.090531');
INSERT INTO public.risk_summaries VALUES (726, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:35:02.183', '2025-05-18 22:35:02.198972');
INSERT INTO public.risk_summaries VALUES (727, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:35:02.744', '2025-05-18 22:35:02.760358');
INSERT INTO public.risk_summaries VALUES (728, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:37:49.554', '2025-05-18 22:37:49.572037');
INSERT INTO public.risk_summaries VALUES (729, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:39:47.798', '2025-05-18 22:39:47.814178');
INSERT INTO public.risk_summaries VALUES (730, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:43:23.572', '2025-05-18 22:43:23.589674');
INSERT INTO public.risk_summaries VALUES (731, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:44:01.653', '2025-05-18 22:44:01.674347');
INSERT INTO public.risk_summaries VALUES (732, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:44:06.419', '2025-05-18 22:44:06.43787');
INSERT INTO public.risk_summaries VALUES (733, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:44:51.899', '2025-05-18 22:44:51.917758');
INSERT INTO public.risk_summaries VALUES (734, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:45:58.699', '2025-05-18 22:45:58.717506');
INSERT INTO public.risk_summaries VALUES (735, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:48:17.859', '2025-05-18 22:48:17.875637');
INSERT INTO public.risk_summaries VALUES (736, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:48:19.304', '2025-05-18 22:48:19.32192');
INSERT INTO public.risk_summaries VALUES (737, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:48:19.887', '2025-05-18 22:48:19.902176');
INSERT INTO public.risk_summaries VALUES (738, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:03.93', '2025-05-18 22:54:03.946828');
INSERT INTO public.risk_summaries VALUES (739, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:05.65', '2025-05-18 22:54:05.667609');
INSERT INTO public.risk_summaries VALUES (740, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:14.509', '2025-05-18 22:54:14.524226');
INSERT INTO public.risk_summaries VALUES (741, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:15.05', '2025-05-18 22:54:15.065754');
INSERT INTO public.risk_summaries VALUES (742, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:20.588', '2025-05-18 22:54:20.603301');
INSERT INTO public.risk_summaries VALUES (743, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:21.373', '2025-05-18 22:54:21.393858');
INSERT INTO public.risk_summaries VALUES (744, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:25.901', '2025-05-18 22:54:25.916552');
INSERT INTO public.risk_summaries VALUES (745, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:54:26.631', '2025-05-18 22:54:26.64801');
INSERT INTO public.risk_summaries VALUES (746, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:55:05.42', '2025-05-18 22:55:05.435404');
INSERT INTO public.risk_summaries VALUES (747, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:55:06.011', '2025-05-18 22:55:06.029737');
INSERT INTO public.risk_summaries VALUES (748, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:57:38.953', '2025-05-18 22:57:38.970243');
INSERT INTO public.risk_summaries VALUES (749, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:57:40.063', '2025-05-18 22:57:40.078567');
INSERT INTO public.risk_summaries VALUES (750, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:14.4', '2025-05-18 22:58:14.418022');
INSERT INTO public.risk_summaries VALUES (751, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:14.954', '2025-05-18 22:58:14.968442');
INSERT INTO public.risk_summaries VALUES (752, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:37.413', '2025-05-18 22:58:37.428692');
INSERT INTO public.risk_summaries VALUES (753, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:40.01', '2025-05-18 22:58:40.025742');
INSERT INTO public.risk_summaries VALUES (754, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:41.827', '2025-05-18 22:58:41.846826');
INSERT INTO public.risk_summaries VALUES (755, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:42.411', '2025-05-18 22:58:42.42692');
INSERT INTO public.risk_summaries VALUES (756, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:58:57.244', '2025-05-18 22:58:57.260439');
INSERT INTO public.risk_summaries VALUES (757, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:01.851', '2025-05-18 22:59:01.867709');
INSERT INTO public.risk_summaries VALUES (758, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:04.602', '2025-05-18 22:59:04.619633');
INSERT INTO public.risk_summaries VALUES (759, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:05.224', '2025-05-18 22:59:05.240998');
INSERT INTO public.risk_summaries VALUES (760, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:05.51', '2025-05-18 22:59:05.526685');
INSERT INTO public.risk_summaries VALUES (761, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:06.577', '2025-05-18 22:59:06.591899');
INSERT INTO public.risk_summaries VALUES (762, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:28.498', '2025-05-18 22:59:28.518966');
INSERT INTO public.risk_summaries VALUES (763, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 22:59:29.095', '2025-05-18 22:59:29.113548');
INSERT INTO public.risk_summaries VALUES (764, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:01:18.086', '2025-05-18 23:01:18.102031');
INSERT INTO public.risk_summaries VALUES (765, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:01:27.304', '2025-05-18 23:01:27.319789');
INSERT INTO public.risk_summaries VALUES (766, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:01:38.262', '2025-05-18 23:01:38.279328');
INSERT INTO public.risk_summaries VALUES (767, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:02:01.666', '2025-05-18 23:02:01.682902');
INSERT INTO public.risk_summaries VALUES (768, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:02:04.14', '2025-05-18 23:02:04.157192');
INSERT INTO public.risk_summaries VALUES (769, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:02:57.596', '2025-05-18 23:02:57.612499');
INSERT INTO public.risk_summaries VALUES (770, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:03:23.809', '2025-05-18 23:03:23.827643');
INSERT INTO public.risk_summaries VALUES (771, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:03:33.612', '2025-05-18 23:03:33.627858');
INSERT INTO public.risk_summaries VALUES (772, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:04:13.838', '2025-05-18 23:04:13.853656');
INSERT INTO public.risk_summaries VALUES (773, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:04:29.547', '2025-05-18 23:04:29.563801');
INSERT INTO public.risk_summaries VALUES (774, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:04:42.145', '2025-05-18 23:04:42.161253');
INSERT INTO public.risk_summaries VALUES (775, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:05:24.118', '2025-05-18 23:05:24.134797');
INSERT INTO public.risk_summaries VALUES (776, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:07:34.639', '2025-05-18 23:07:34.657245');
INSERT INTO public.risk_summaries VALUES (777, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:07:43.477', '2025-05-18 23:07:43.494193');
INSERT INTO public.risk_summaries VALUES (778, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:08:04.782', '2025-05-18 23:08:04.798051');
INSERT INTO public.risk_summaries VALUES (779, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:10:31.166', '2025-05-18 23:10:31.182235');
INSERT INTO public.risk_summaries VALUES (780, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:10:53.619', '2025-05-18 23:10:53.633847');
INSERT INTO public.risk_summaries VALUES (781, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:11:37.497', '2025-05-18 23:11:37.516267');
INSERT INTO public.risk_summaries VALUES (782, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:11:47.539', '2025-05-18 23:11:47.555191');
INSERT INTO public.risk_summaries VALUES (783, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:12:42.238', '2025-05-18 23:12:42.254945');
INSERT INTO public.risk_summaries VALUES (784, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:13:21.525', '2025-05-18 23:13:21.542362');
INSERT INTO public.risk_summaries VALUES (785, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:15:12.791', '2025-05-18 23:15:12.807818');
INSERT INTO public.risk_summaries VALUES (786, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:28:36.637', '2025-05-18 23:28:36.654196');
INSERT INTO public.risk_summaries VALUES (787, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:30:55.256', '2025-05-18 23:30:55.272117');
INSERT INTO public.risk_summaries VALUES (788, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:31:01.592', '2025-05-18 23:31:01.611532');
INSERT INTO public.risk_summaries VALUES (789, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:31:02.774', '2025-05-18 23:31:02.790271');
INSERT INTO public.risk_summaries VALUES (790, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:31:03.467', '2025-05-18 23:31:03.485032');
INSERT INTO public.risk_summaries VALUES (791, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:35:19.781', '2025-05-18 23:35:19.797948');
INSERT INTO public.risk_summaries VALUES (792, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:37:39.669', '2025-05-18 23:37:39.685941');
INSERT INTO public.risk_summaries VALUES (793, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:38:06.113', '2025-05-18 23:38:06.132356');
INSERT INTO public.risk_summaries VALUES (794, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:38:12.049', '2025-05-18 23:38:12.065447');
INSERT INTO public.risk_summaries VALUES (795, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:38:21.637', '2025-05-18 23:38:21.653106');
INSERT INTO public.risk_summaries VALUES (796, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:38:29.004', '2025-05-18 23:38:29.020364');
INSERT INTO public.risk_summaries VALUES (797, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:41:38.708', '2025-05-18 23:41:38.724062');
INSERT INTO public.risk_summaries VALUES (798, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:41:41.567', '2025-05-18 23:41:41.583326');
INSERT INTO public.risk_summaries VALUES (799, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:42:44.573', '2025-05-18 23:42:44.593341');
INSERT INTO public.risk_summaries VALUES (800, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:42:46.062', '2025-05-18 23:42:46.081127');
INSERT INTO public.risk_summaries VALUES (801, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:16.751', '2025-05-18 23:44:16.741729');
INSERT INTO public.risk_summaries VALUES (802, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:17.407', '2025-05-18 23:44:17.397834');
INSERT INTO public.risk_summaries VALUES (803, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:18.053', '2025-05-18 23:44:18.044928');
INSERT INTO public.risk_summaries VALUES (804, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:22.305', '2025-05-18 23:44:22.32504');
INSERT INTO public.risk_summaries VALUES (805, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:33.108', '2025-05-18 23:44:33.125249');
INSERT INTO public.risk_summaries VALUES (806, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:49.481', '2025-05-18 23:44:49.502643');
INSERT INTO public.risk_summaries VALUES (807, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:44:56.759', '2025-05-18 23:44:56.775156');
INSERT INTO public.risk_summaries VALUES (808, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:48:12.61', '2025-05-18 23:48:12.62712');
INSERT INTO public.risk_summaries VALUES (809, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:48:15.002', '2025-05-18 23:48:15.018157');
INSERT INTO public.risk_summaries VALUES (810, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:49:33.035', '2025-05-18 23:49:33.051862');
INSERT INTO public.risk_summaries VALUES (811, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:51:52.33', '2025-05-18 23:51:52.347877');
INSERT INTO public.risk_summaries VALUES (812, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:51:57.427', '2025-05-18 23:51:57.443714');
INSERT INTO public.risk_summaries VALUES (813, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-18 23:52:33.964', '2025-05-18 23:52:33.986745');
INSERT INTO public.risk_summaries VALUES (814, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-19 10:46:52.16', '2025-05-19 10:46:52.178546');
INSERT INTO public.risk_summaries VALUES (815, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-19 10:46:54.654', '2025-05-19 10:46:54.669775');
INSERT INTO public.risk_summaries VALUES (816, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-19 10:56:31.066', '2025-05-19 10:56:31.084302');
INSERT INTO public.risk_summaries VALUES (817, 2025, 5, NULL, 0, 0, 0, 0, 0, 0, '2025-05-19 10:58:57.827', '2025-05-19 10:58:57.844982');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES ('LhUoCRxNaYvqgCtzv2USLk26WfvVcljB', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-30T12:21:50.624Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}', '2025-05-30 12:21:51');
INSERT INTO public.sessions VALUES ('DqNJVR0UInDaAh6LnYKyCxtGw_SGwSTu', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-30T12:26:51.911Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}', '2025-05-30 12:26:52');
INSERT INTO public.sessions VALUES ('X0MA407-KxsvP5QRE6rewtSmtwyq5XDq', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-30T12:27:23.698Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}', '2025-05-30 12:27:31');
INSERT INTO public.sessions VALUES ('m7pMoxF8MGKp6uIL6afIpRV-m2YLpl8q', '{"cookie":{"originalMaxAge":604800000,"expires":"2025-05-30T12:22:31.260Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}', '2025-05-30 12:47:34');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (2, 'M-admin', 'm@admin.com', 'M-admin admin', '$2b$12$WKKV/3V0TeqXY/y3op4Ksurl1rQPmbovmvlxbpS8c1sUmKtiU4tKG', 'admin', 'local', true, 0, NULL, NULL, '2025-05-23 12:24:14.509455', '2025-05-23 12:24:14.509455', NULL, 100, NULL, NULL, NULL, 'M-admin', 'admin', NULL, 1, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, NULL);
INSERT INTO public.users VALUES (1, 'admin', 'admin@company.com', 'System Administrator', '$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW', 'admin', 'local', true, 5, NULL, '2025-05-23 12:27:29.863', '2025-05-23 11:42:24.459027', '2025-05-23 12:45:33.369', NULL, 100, '2025-05-23 13:00:33.369', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, '2025-05-23 12:45:33.369');
INSERT INTO public.users VALUES (4, 'testadmin', 'test@company.com', 'Test Administrator', '$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW', 'admin', 'local', true, 1, NULL, NULL, '2025-05-23 12:45:49.838796', '2025-05-23 12:45:57.139', NULL, 100, NULL, NULL, NULL, 'Test', 'Admin', NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, '2025-05-23 12:45:57.139');


--
-- Data for Name: vulnerabilities; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 272, true);


--
-- Name: asset_relationships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asset_relationships_id_seq', 1, false);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assets_id_seq', 21, true);


--
-- Name: control_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.control_library_id_seq', 295, true);


--
-- Name: controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.controls_id_seq', 25, true);


--
-- Name: cost_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cost_modules_id_seq', 10, true);


--
-- Name: enterprise_architecture_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.enterprise_architecture_id_seq', 3, true);


--
-- Name: legal_entities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.legal_entities_id_seq', 4, true);


--
-- Name: response_cost_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.response_cost_modules_id_seq', 1, false);


--
-- Name: risk_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_controls_id_seq', 3, true);


--
-- Name: risk_costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_costs_id_seq', 11, true);


--
-- Name: risk_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_library_id_seq', 27, true);


--
-- Name: risk_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_responses_id_seq', 2, true);


--
-- Name: risk_summaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_summaries_id_seq', 817, true);


--
-- Name: risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risks_id_seq', 49, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vulnerabilities_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

