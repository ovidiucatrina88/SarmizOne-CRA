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

COPY public.activity_logs (id, activity, "user", entity, entity_type, entity_id, created_at) FROM stdin;
1	Added new asset	System User	SalesForce	asset	AST-001	2025-04-29 21:46:52.406
2	Added new asset	System User	Jobseeker-database	asset	AST-002	2025-04-29 21:48:37.074
3	Added new risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-04-29 22:13:11.07
4	Added new control	System User	Endpoint Detection & Response	control	CTL-001	2025-04-29 22:15:33.962
5	Added risk response	System User	Response for RISK-001	response	RISK-001	2025-04-29 22:16:14.908
6	Updated control	System User	Endpoint Detection & Response	control	CTL-001	2025-04-29 22:18:13.67
7	Updated control	System User	Endpoint Detection & Response	control	CTL-001	2025-04-29 22:53:47.941
8	Updated asset	System User	Jobseeker-database	asset	AST-002	2025-04-29 22:54:11.387
9	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-04-29 23:08:12.091
10	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-04-29 23:08:32.738
11	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 10:56:49.521
12	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 11:26:39.333
13	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 11:42:05.297
14	Updated asset	System User	SalesForce	asset	AST-001	2025-05-04 11:42:23.686
15	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 11:45:03.987
16	Added new legal entity	System User	Company X Emea	legal_entity	ENT-001	2025-05-04 17:32:30.102
17	Updated asset	System User	SalesForce	asset	AST-001	2025-05-04 17:39:19.033
18	Updated asset	System User	Jobseeker-database	asset	AST-002	2025-05-04 17:39:22.392
19	Added new legal entity	System User	Company Y US	legal_entity	ENT-002	2025-05-04 17:49:19.28
20	Added new legal entity	System User	Company Group	legal_entity	ENT-003	2025-05-04 17:49:40.252
21	Updated legal entity	System User	Company X Emea	legal_entity	ENT-001	2025-05-04 17:49:52.75
22	Updated legal entity	System User	Company Y US	legal_entity	ENT-002	2025-05-04 17:50:06.777
23	Updated asset	System User	SalesForce	asset	AST-001	2025-05-04 17:50:20.447
24	Updated asset	System User	SalesForce	asset	AST-001	2025-05-04 18:26:03.809
25	Updated asset	System User	Jobseeker-database	asset	AST-002	2025-05-04 18:29:52.085
26	Updated asset	System User	SalesForce	asset	AST-001	2025-05-04 18:32:40.047
27	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 18:33:23.072
28	Added new asset	System User	customer database	asset	AST-003	2025-05-04 18:37:54.225
29	Updated risk	System User	Data leakage, unauthorized access	risk	RISK-DATA-LEAKAGE--U-151	2025-05-04 18:39:56.802
30	Updated risk	System User	Data leakage, unauthorized access	risk	RISK-DATA-LEAKAGE--U-151	2025-05-04 19:48:07.735
31	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 19:54:35.395
32	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:00:26.156
33	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:00:57.024
34	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:01:04.252
35	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:01:04.309
36	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:02:02.822
37	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:22:16.036
38	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-04 20:25:36.984
39	Updated risk	System User	Unauthorized access, privilege escalation	risk	RISK-UNAUTHORIZED-AC-969	2025-05-04 20:35:02.788
40	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 21:18:38.537
41	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-04 21:18:44.635
42	Updated risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277	2025-05-04 21:18:54.942
43	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-04 21:19:32.237
44	Updated risk	System User	Uncoordinated response, delayed recovery	risk	RISK-UNCOORDINATED-R-583	2025-05-04 21:19:41.298
45	Updated risk	System User	Unsegmented network, rogue devices	risk	RISK-UNSEGMENTED-NET-571	2025-05-04 21:25:29.079
46	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-04 21:25:56.219
47	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-04 21:29:25.497
48	Updated risk	System User	Third-party risk, vendor compromise	risk	RISK-THIRD-PARTY-RIS-177	2025-05-04 22:09:46.35
49	Updated risk	System User	Unauthorized software, unpatched vulnerabilities	risk	RISK-UNAUTHORIZED-SO-757	2025-05-04 22:10:43.325
50	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-04 22:12:07.668
51	Updated risk	System User	Phishing attacks, malware delivery	risk	RISK-PHISHING-ATTACK-407	2025-05-05 15:03:54.553
52	Updated risk	System User	Lack of visibility, undetected breaches	risk	RISK-LACK-OF-VISIBIL-973	2025-05-05 15:04:31.805
53	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-05 15:31:16.218
54	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-05 15:31:50.143
55	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-05 15:37:54.236
56	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-05 15:46:51.891
57	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-05 15:47:46.294
58	Added new legal entity	System User	another-company	legal_entity	ENT-004	2025-05-06 20:58:23.497
59	Added new asset	System User	moreassets	asset	AST-004	2025-05-06 21:06:03.396
60	Updated risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-06 21:18:51.801
61	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-12 11:25:40.912
62	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-12 11:26:28.017
63	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-12 11:27:14.171
64	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-12 11:27:14.502
65	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-12 11:27:14.745
66	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 11:32:41.098
67	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 11:33:40.546
68	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 12:02:02.24
69	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 12:02:04.174
70	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 12:02:05.624
71	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-12 12:02:06.832
72	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:44:45.384
73	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:45:14.42
74	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:45:53.789
75	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:50:57.288
76	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:51:08.087
77	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:58:55.354
78	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 12:59:09.088
79	Updated risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277	2025-05-12 13:50:11.364
80	Updated risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277	2025-05-12 13:50:53.536
81	Updated control	System User	Malware Defenses	control	CIS-10	2025-05-12 17:28:44.091
82	Updated control	System User	Malware Defenses	control	CIS-10	2025-05-12 17:38:35.364
83	Updated risk response	System User	Response for RISK-001	response	RISK-001	2025-05-12 17:46:58.8
84	Updated risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-12 17:51:06.551
85	Updated control	System User	Malware Defenses	control	CIS-10	2025-05-12 17:52:09.112
86	Updated asset	System User	customer database	asset	AST-003	2025-05-12 17:53:22.62
87	Updated asset	System User	customer database	asset	AST-003	2025-05-12 17:53:35.033
88	Updated asset	System User	Jobseeker-database	asset	AST-002	2025-05-12 17:53:44.523
89	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 18:00:05.69
90	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 18:12:00.54
91	Updated control	System User	Malware Defenses	control	CIS-10	2025-05-12 18:21:24.148
92	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 18:33:32.87
93	Updated risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-12 20:10:40.465
94	Updated control	System User	Endpoint Detection & Response	control	CTL-001	2025-05-12 20:13:15.932
95	Added new asset	System User	candidate Database	asset	AST-005	2025-05-12 20:40:52.347
96	Updated control	System User	Endpoint Detection & Response	control	CTL-001	2025-05-12 22:48:59.475
97	Updated risk	System User	Uncoordinated response, delayed recovery	risk	RISK-UNCOORDINATED-R-583	2025-05-13 12:54:49.323
98	Updated risk	System User	Unsegmented network, rogue devices	risk	RISK-UNSEGMENTED-NET-571	2025-05-13 13:16:25.762
99	Updated risk	System User	Third-party risk, vendor compromise	risk	RISK-THIRD-PARTY-RIS-177	2025-05-13 13:16:46.162
100	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 13:16:57.4
101	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 13:17:25.101
102	Updated risk	System User	Phishing attacks, malware delivery	risk	RISK-PHISHING-ATTACK-407	2025-05-13 13:19:55.418
103	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:20:31.827
104	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:20:50.606
105	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:20:59.725
106	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:21:30.852
107	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:21:42.775
108	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:26:24.967
109	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:26:44.221
110	Updated risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-13 13:27:05.256
111	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 13:34:34.94
112	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 13:34:34.973
113	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:07:40.067
114	Updated risk	System User	Lack of visibility, undetected breaches	risk	RISK-LACK-OF-VISIBIL-973	2025-05-13 14:09:59.628
115	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:11:08.762
116	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:22:49.308
117	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:31:20.456
118	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:47:05.893
119	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:57:26.341
120	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 14:58:54.629
121	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 15:04:59.977
122	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 15:14:34.187
123	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:21:30.98
124	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:21:31.206
125	Updated control	System User	Account Management	control	CIS-5	2025-05-13 16:22:11.461
126	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:22:35.076
127	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:24:23.028
128	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:28:26.584
129	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 16:43:01.706
130	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 17:24:57.441
131	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 17:59:05.372
132	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 18:15:53.606
133	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 18:16:00.451
134	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 18:16:00.937
135	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-13 18:16:11.536
136	Updated risk	System User	Uncoordinated response, delayed recovery	risk	RISK-UNCOORDINATED-R-583	2025-05-14 15:04:16.041
137	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-14 15:50:30.55
138	Updated risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277	2025-05-14 15:51:37.201
139	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-14 15:57:10.772
140	Updated risk	System User	Lack of visibility, undetected breaches	risk	RISK-LACK-OF-VISIBIL-973	2025-05-15 08:08:48.619
141	Updated risk	System User	Phishing attacks, malware delivery	risk	RISK-PHISHING-ATTACK-407	2025-05-15 08:39:50.379
142	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 12:19:43.266
143	Deleted risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276-TPL-Z6I	2025-05-15 13:06:49.215
144	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:32:31.803
145	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:32:32.989
146	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:32:35.294
147	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:32:37.937
148	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:32:39.73
149	Updated risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-15 13:46:54.068
150	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 20:48:20.765
151	Updated asset	System User	candidate Database	asset	AST-005	2025-05-15 20:48:36.496
152	Updated asset	System User	Jobseeker-database	asset	AST-002	2025-05-15 20:48:54.74
153	Updated risk	System User	Phishing attacks, malware delivery	risk	RISK-PHISHING-ATTACK-407	2025-05-15 20:55:16.802
154	Deleted asset	System User	Jobseeker-database	asset	AST-002	2025-05-15 20:56:39.101
155	Updated asset	System User	candidate Database	asset	AST-005	2025-05-15 21:04:54.157
156	Updated risk	System User	Test Risk	risk	RISK-DATA-LEAKAGE--U-151	2025-05-15 21:10:32.15
157	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 21:12:55.17
158	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 21:13:16.554
159	Updated risk	System User	Test Risk	risk	RISK-DATA-LEAKAGE--U-151	2025-05-15 21:14:19.085
160	Updated risk	System User	Unmanaged devices, shadow IT	risk	RISK-UNMANAGED-DEVIC-414	2025-05-15 21:16:02.869
161	Updated asset	System User	moreassets	asset	AST-004	2025-05-15 21:24:52.571
162	Added new asset	System User	New Test Server	asset	AST-006	2025-05-15 21:27:16.076
163	Added new asset	System User	Another Test Server	asset	AST-007	2025-05-15 21:27:45.367
164	Added new asset	System User	Test Server For Risk Recalculation	asset	AST-008	2025-05-15 21:29:49.001
165	Added new asset	System User	Final Test Server	asset	AST-009	2025-05-15 21:31:30.276
166	Updated asset	System User	candidate Database	asset	AST-005	2025-05-15 22:26:17.479
167	Updated asset	System User	customer database	asset	AST-003	2025-05-15 22:37:03.899
168	Updated asset	System User	moreassets	asset	AST-004	2025-05-15 22:38:33.45
169	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 22:41:48.478
170	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 22:54:27.353
171	Updated asset	System User	SalesForce	asset	AST-001	2025-05-15 22:54:49.536
172	Updated risk	System User	Unauthorized access, privilege escalation	risk	RISK-UNMANAGED-DEVIC-414	2025-05-15 22:55:54.49
173	Updated risk	System User	Insecure software, OWASP Top 10	risk	RISK-INSECURE-SOFTWA-165	2025-05-15 22:56:43.79
174	Updated control	System User	Service Provider Management	control	CIS-15	2025-05-15 22:57:49.068
175	Updated asset	System User	New Test Server	asset	AST-006	2025-05-15 23:41:58.284
176	Updated asset	System User	New Test Server	asset	AST-006	2025-05-15 23:42:12.873
177	Updated control	System User	Endpoint Detection & Response	control	CTL-001	2025-05-15 23:59:27.54
178	Created risk "Data breach of customer PII" from template and assigned to asset AST-003	system	32	risk	RL-DATA-BREACH-001-994	2025-05-18 12:58:35.549872
179	Created risk "Data breach of customer PII" from template and assigned to asset AST-003	system	33	risk	RL-DATA-BREACH-001-074	2025-05-18 13:10:50.082006
180	Created risk "Data breach of customer PII" from template and assigned to asset AST-005	system	34	risk	RL-DATA-BREACH-001-780	2025-05-18 13:12:18.916944
181	Created risk "Data breach of customer PII" from template and assigned to asset AST-005	system	35	risk	RL-DATA-BREACH-001-865	2025-05-18 13:26:37.196685
182	Created risk "Unsegmented network, rogue devices" from template and assigned to asset AST-008	system	36	risk	RISK-UNSEGMENTED-NET-571-657	2025-05-18 13:33:02.591615
183	Created risk "Exploited software flaws" from template and assigned to asset AST-007	system	37	risk	RISK-EXPLOITED-SOFTW-277-197	2025-05-18 13:35:21.911615
184	Deleted risk	System User		risk	RISK-1920	2025-05-18 13:50:26.842165
185	Deleted risk	System User	template-ransomware	risk	RISK-6560	2025-05-18 13:50:30.120876
186	Deleted risk	System User	test=tempalte	risk	RISK-7135	2025-05-18 13:50:32.514825
187	Deleted risk	System User	test-template	risk	RISK-2124	2025-05-18 13:50:34.943633
188	Deleted risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-994	2025-05-18 13:50:38.355695
189	Deleted risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-074	2025-05-18 13:50:39.988494
190	Deleted risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-780	2025-05-18 13:50:41.576646
191	Deleted risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-865	2025-05-18 13:50:43.099901
192	Deleted risk	System User	Unsegmented network, rogue devices	risk	RISK-UNSEGMENTED-NET-571-657	2025-05-18 13:50:44.718512
193	Deleted risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277-197	2025-05-18 13:50:51.013855
194	Deleted risk	System User	hacking of webserver	risk	RISK-3248	2025-05-18 13:50:55.763468
195	Deleted risk	System User		risk	RISK-6191	2025-05-18 13:50:57.991655
196	Deleted risk	System User		risk	RISK-5524	2025-05-18 13:51:00.604068
197	Deleted risk	System User		risk	RISK-407	2025-05-18 13:51:03.377594
198	Deleted risk	System User	Test Risk	risk	RISK-DATA-LEAKAGE--U-151	2025-05-18 13:51:29.172353
199	Deleted risk	System User	Ransomware, trojans	risk	RISK-RANSOMWARE--TRO-529	2025-05-18 13:51:35.841
275	create	System User	API Test Control	control	27	2025-06-09 10:44:12.272869
200	Deleted risk	System User	Lack of visibility, undetected breaches	risk	RISK-LACK-OF-VISIBIL-973	2025-05-18 14:33:07.693013
201	Deleted risk	System User	Exploited software flaws	risk	RISK-EXPLOITED-SOFTW-277	2025-05-18 14:33:13.59792
202	Deleted risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276-TPL-RL6	2025-05-18 14:33:29.879057
203	Deleted risk	System User	Misconfigurations, default credentials	risk	RISK-MISCONFIGURATIO-345	2025-05-18 14:33:32.882656
204	Deleted risk	System User	Unauthorized access, privilege escalation	risk	RISK-UNAUTHORIZED-AC-969	2025-05-18 14:33:34.878198
205	Deleted risk	System User	Phishing, social engineering	risk	RISK-PHISHING--SOCIA-698	2025-05-18 14:33:38.234003
206	Deleted risk	System User	Third-party risk, vendor compromise	risk	RISK-THIRD-PARTY-RIS-177	2025-05-18 14:33:45.064064
207	Deleted risk	System User	Ransomware Attack on Core Systems	risk	RISK-001	2025-05-18 14:33:47.643462
208	Deleted risk	System User	Phishing attacks, malware delivery	risk	RISK-PHISHING-ATTACK-407	2025-05-18 14:33:50.233032
209	Deleted risk	System User	Insecure software, OWASP Top 10	risk	RISK-INSECURE-SOFTWA-165	2025-05-18 14:33:52.390406
210	Deleted risk	System User	Unauthorized software, unpatched vulnerabilities	risk	RISK-UNAUTHORIZED-SO-757	2025-05-18 14:33:54.906556
211	Deleted risk	System User	Unsegmented network, rogue devices	risk	RISK-UNSEGMENTED-NET-571	2025-05-18 14:34:13.68216
212	Deleted risk	System User	Uncoordinated response, delayed recovery	risk	RISK-UNCOORDINATED-R-583	2025-05-18 14:34:22.167351
213	Deleted risk	System User	Orphaned accounts, excessive privileges	risk	RISK-ORPHANED-ACCOUN-276	2025-05-18 14:34:24.390982
214	Deleted risk	System User	Unknown vulnerabilities	risk	RISK-UNKNOWN-VULNERA-913	2025-05-18 14:34:26.698724
215	Deleted risk	System User	Unauthorized access, privilege escalation	risk	RISK-UNMANAGED-DEVIC-414	2025-05-18 14:34:28.615301
216	Created risk "Data breach of customer PII" from template and assigned to asset AST-003	system	38	risk	RL-DATA-BREACH-001-262	2025-05-18 14:35:33.163954
217	Updated risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-262	2025-05-18 15:01:42.597972
218	Updated risk	System User	Data breach of customer PII	risk	RL-DATA-BREACH-001-262	2025-05-18 15:01:42.85018
223	delete	System User	Control	control	17	2025-05-18 17:34:00.738615
224	delete	System User	Control	control	18	2025-05-18 19:49:44.563231
225	delete	System User	Control	control	19	2025-05-18 19:49:47.205544
226	delete	System User	Control	control	3	2025-05-18 19:49:49.507262
227	delete	System User	Control	control	6	2025-05-18 19:49:51.518787
228	delete	System User	Control	control	20	2025-05-18 19:49:55.018516
229	delete	System User	Control	control	1	2025-05-18 19:49:57.061867
230	create	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 19:50:06.956534
231	associate	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 19:50:07.075915
232	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 19:50:36.251322
233	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 19:51:20.618116
234	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 20:54:51.590071
235	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 21:26:56.987567
236	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-18 21:31:17.438649
237	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-19 10:49:53.24621
238	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-19 10:56:31.162195
239	update	System User	Encrypt Sensitive Data at Rest	control	21	2025-05-19 10:58:57.917743
240	Response created	System	Response 2	response	2	2025-05-19 18:47:50.98
241	create	System User	Deploy Anti-Malware/EDR on All End-Points	control	22	2025-05-22 14:48:09.98278
242	create	System User	Establish and Maintain Malware Defense Process	control	23	2025-05-22 14:54:28.856989
243	delete	System User	Control	control	22	2025-05-22 14:55:03.518401
244	delete	System User	Control	control	23	2025-05-22 14:55:06.137702
245	create	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 14:55:21.658912
246	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 14:55:48.590031
247	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:02:46.538051
248	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:03:33.177038
249	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:06:34.873897
250	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:08:45.390438
251	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:08:50.697629
252	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:09:12.458391
253	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:09:30.217434
254	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:10:18.287011
255	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:11:45.93022
256	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:15:42.434371
257	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:16:57.513992
258	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:17:40.681671
259	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:18:28.168778
260	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:21:08.94947
261	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:21:49.261664
262	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:23:09.424797
263	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:28:16.608433
264	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:36:14.576579
265	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:36:24.051332
266	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:45:18.309266
267	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:45:54.33439
268	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:48:40.562958
269	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:48:58.225286
270	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 15:49:04.407077
271	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	24	2025-05-22 19:26:19.149854
272	create	System User	Production Control	control	25	2025-06-08 16:59:04.443241
273	create	System User	Test Control Fixed	control	26	2025-06-08 19:24:53.578455
274	update	System User	Test Control Fixed	control	26	2025-06-08 19:25:22.618715
276	delete	System User	Control	control	27	2025-06-09 10:44:26.704839
277	Response created	System	Response 3	response	3	2025-06-10 21:58:36.694
278	cascade_delete	System User	Asset AST-003	asset	3	2025-06-10 22:06:50.636103
280	cascade_delete	System User	Asset AST-850	asset	14	2025-06-10 22:08:07.916044
282	cascade_delete	System User	Asset PROD-READY-001	asset	21	2025-06-10 22:08:39.880005
283	Deleted asset with cascade	System User	Production Ready Asset	asset	21	2025-06-10 22:08:39.909728
284	delete	System User	Control	control	21	2025-06-10 22:19:53.782748
285	delete	System User	Control	control	24	2025-06-10 22:19:55.912808
286	delete	System User	Control	control	25	2025-06-10 22:19:57.698685
287	delete	System User	Control	control	26	2025-06-10 22:19:59.574226
288	create	System User	Deploy Anti-Malware/EDR on All End-Points	control	28	2025-06-10 23:05:22.711447
289	associate	System User	Deploy Anti-Malware/EDR on All End-Points	control	28	2025-06-10 23:05:22.843886
290	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	28	2025-06-10 23:05:53.363905
291	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	28	2025-06-10 23:08:34.262134
292	update	System User	Deploy Anti-Malware/EDR on All End-Points	control	28	2025-06-10 23:09:11.668559
293	create	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-10 23:22:37.341858
294	associate	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-10 23:22:37.465039
295	update	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-10 23:23:05.957503
296	create	System User	Asset created	asset	33	2025-06-11 17:06:37.134302
297	update	System User	Asset updated	asset	1	2025-06-12 15:15:13.622703
298	create	System User	Remote Locate	control	31	2025-06-13 09:26:02.392508
299	associate	System User	Remote Locate	control	31	2025-06-13 09:26:02.530646
300	create	System User	Test Control with FAIR Fields	control	32	2025-06-13 09:39:48.315236
301	create	System User	FAIR Control Test with All Fields	control	33	2025-06-13 09:40:44.255031
302	create	System User	Complete FAIR Schema Test Control	control	34	2025-06-13 09:42:11.328019
303	create	System User	Debug FAIR Fields Test	control	35	2025-06-13 09:42:39.571372
304	create	System User	Clean Control Test	control	36	2025-06-13 10:02:34.731805
305	create	System User	Final Clean Control	control	37	2025-06-13 10:03:04.693403
306	update	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-13 10:05:01.631756
307	update	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-13 10:32:30.146335
308	update	System User	Encrypt Sensitive Data at Rest	control	29	2025-06-13 10:32:36.481736
\.


--
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assets (id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain) FROM stdin;
5	AST-005	candidate Database	data	ovi	ovi	high	high	high	10000000.00	{GDPR}	internal	{}	0	2025-05-12 20:40:52.303	EUR	10	Company X Emea	Active	\N	technical_component	\N
11	AST-002	Web Application Server	application	IT	System Admin	medium	high	high	30000000.00	{PCI-DSS}	external	{}	Public-facing web application server	2025-05-15 23:12:38.221355	USD	30	Company X Emea	Active	\N	technical_component	\N
15	AST-595	datalake	application	Information Technology	Ovi	medium	medium	medium	100000.00	{}	internal	{}	No description provided	2025-05-21 16:10:19.659471	USD	1	Company Group	Active	\N	technical_component	Application
33	TEST-001	Test Asset	application	Information Technology	Test Owner	medium	medium	medium	0.00	{none}	internal	{}	Test asset for validation	2025-06-11 17:06:37.089683	USD	1	Unknown	Active	\N	application_service	Application
1	AST-001	SalesForce	application	CIT	Ovidiu	high	high	low	5000000.00	{GDPR}	external	{}	my salesforce	2025-04-29 21:46:52.224	USD	1	Company Y US	Active	\N	technical_component	\N
\.


--
-- Data for Name: asset_relationships; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asset_relationships (id, source_asset_id, target_asset_id, relationship_type, created_at) FROM stdin;
\.


--
-- Data for Name: auth_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_config (id, auth_type, oidc_enabled, oidc_issuer, oidc_client_id, oidc_client_secret, oidc_callback_url, oidc_scopes, session_timeout, max_login_attempts, lockout_duration, password_min_length, require_password_change, created_at, updated_at) FROM stdin;
1	local	f	\N	\N	\N	\N	["openid", "profile", "email"]	3600	100	0	8	f	2025-06-09 09:13:01.696496	2025-06-09 09:13:01.696496
\.


--
-- Data for Name: control_library; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.control_library (id, control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, compliance_framework, cloud_domain, nist_mappings, pci_mappings, cis_mappings, gap_level, implementation_guidance, architectural_relevance, organizational_relevance, ownership_model, cloud_service_model) FROM stdin;
5	CIS-6-TPL	Access Control Management	Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts for enterprise assets and software.	preventive	administrative	not_implemented	8.2	9000.00	45.00	t	CIS Controls v8.1.2, March 2025	{}	{}	2025-05-15 13:17:57.9737	2025-05-15 13:17:57.9737	\N	\N	template	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
54	3.11	Encrypt Sensitive Data at Rest	Use server-side or client-side encryption on storage.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
55	3.12	Segment Data Processing and Storage Based on Sensitivity	Isolate sensitive data in separate enclaves.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
56	3.13	Deploy a Data Loss Prevention Solution	Monitor and block unauthorized data exfiltration.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
57	3.14	Log Sensitive Data Access	Record read/write on high-value data.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
58	4.1	Establish and Maintain a Secure Configuration Process	Define and document secure baselines & change controls.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
59	4.2	Establish and Maintain a Secure Configuration Process for Network Infrastructure	Document secure baselines for firewalls, switches, routers.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
60	4.3	Configure Automatic Session Locking on Enterprise Assets	Lock sessions after defined inactivity periods.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
77	6.2	Establish and Maintain an Inventory of Access Permissions	Catalog all permission assignments.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
78	6.3	User Access Reviews	Quarterly review of user permissions.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
79	6.4	Implement MFA for all Remote Access	Enforce MFA on VPN, RDP, SSH.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
80	6.5	Implement MFA for All User Access to Privileged Accounts	Require MFA for admin consoles, APIs.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
81	6.6	Ensure Use of Unique Credentials for Each Person	Eliminate shared accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
82	6.7	Deny Access Based on Geolocation/IP Reputation	Block high-risk geos or Tor exit nodes.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
83	6.8	Remove/Disable Access Immediately Upon Role Change or Termination	Automate deprovisioning.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
101	9.2	Ensure Use of Safe Email Gateways	Enforce URL/link scanning in mail.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
102	9.3	Block Access to Known Malicious Websites	DNS/URL filtering at perimeter.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
103	9.4	Restrict Execution of Office Macros	Block or sandbox untrusted macros.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
104	9.5	Enforce Browser Sandboxing	Isolate web sessions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
105	9.6	Enforce URL Reputation/DNS Filtering	Block domains with bad reputations.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
111	11.1	Establish and Maintain a Data Recovery Process	Document RTO/RPO & workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
112	11.2	Perform Regular Automated Backups of Critical Data	Schedule frequent backups.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
113	11.3	Store Backups Offline and/or Off-site	Air-gap or cloud storage.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
114	11.4	Perform Backup Integrity Verification	Regularly test restoration.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
115	11.5	Document and Test Recovery Procedures	Run DR drills.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
116	11.6	Maintain Backup Logs and Monitoring	Track backup success/failures.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
117	12.1	Establish and Maintain a Network Infrastructure Process	Document network standards & review cycles.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
118	12.2	Ensure Use of Secure Network Diagrams	Maintain up-to-date, access-controlled maps.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
119	12.3	Manage Network Device Configurations Securely	Version control & peer reviews.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
120	12.4	Perform Regular Network Device Firmware Updates	Stay current on patches.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
121	12.5	Enforce Network Segmentation	Isolate critical assets.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
122	12.6	Implement Secure Remote Management	Use VPN/SSH with MFA.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
32	1.1	Establish and Maintain Detailed Enterprise Asset Inventory	Maintain an accurate, detailed inventory of all enterprise assets.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
33	1.2	Address Unauthorized Assets	Process to identify and remove or quarantine unauthorized assets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
34	1.3	Utilize an Active Discovery Tool	Automate daily active scans to discover assets on the network.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
35	1.4	Use DHCP Logging to Update Enterprise Asset Inventory	Parse DHCP logs to enrich asset inventory.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
36	1.5	Use a Passive Asset Discovery Tool	Monitor network traffic passively to identify assets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
37	2.1	Establish and Maintain a Software Inventory	Maintain a current inventory of all installed software.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
38	2.2	Ensure Authorized Software is Currently Supported	Flag unsupported software and document exceptions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
39	2.3	Address Unauthorized Software	Remove or quarantine unauthorized software installations.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
40	2.4	Utilize Automated Software Inventory Tools	Use automated tools to discover and catalog software.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
41	2.5	Allowlist Authorized Software	Only permit execution of approved software.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
42	2.6	Allowlist Authorized Libraries	Only permit loading of approved system libraries.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
43	2.7	Allowlist Authorized Scripts	Only permit execution of approved scripts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
44	3.1	Establish and Maintain a Data Management Process	Document processes for data classification, handling, retention, and disposal.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
45	3.2	Establish and Maintain a Data Inventory	Catalog all sensitive data and its locations.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
46	3.3	Configure Data Access Control Lists	Enforce least-privilege data access permissions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
47	3.4	Enforce Data Retention	Ensure data is kept only as long as permitted.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
48	3.5	Securely Dispose of Data	Destroy data in accordance with retention policies.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
84	7.1	Establish and Maintain a Vulnerability Management Process	Document VM workflow & SLAs.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
85	7.2	Ensure Use of Up-to-Date Vulnerability Scanning Tools	Regularly update scanning engine/DB.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
86	7.3	Perform Authenticated Vulnerability Scans	Use credentials for deeper discovery.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
87	7.4	Remediate Identified Vulnerabilities in a Timely Manner	Track & fix CVEs per SLA.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
88	7.5	Perform Malware Scanning of All Files	Endpoint scanning of all file sources.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
89	7.6	Perform Internal Vulnerability Scanning	Scan internal subnets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
90	7.7	Perform External Vulnerability Scanning	Scan public IPs from the Internet.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
91	7.8	Facilitate Automated Threat Intelligence Feeds	Ingest CVE/IOC feeds.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
92	7.9	Remediate Vulnerabilities in Custom Code	SDLC integration for code flaws.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
93	7.10	Perform Automated Configuration Management Scans	Detect drift from secure baselines.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
94	8.1	Establish and Maintain an Audit Log Management Process	Document log types, retention, and review.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
95	8.2	Ensure Logging is Enabled on All Systems	Enable OS, application, network logs.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
96	8.3	Ensure Logs are Collected Centrally	Ship logs to SIEM or log server.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
97	8.4	Secure Audit Logs Against Unauthorized Access	Protect integrity of log store.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
98	8.5	Perform Log Reviews at Least Daily	Automated or manual daily reviews.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
99	8.6	Retain Audit Logs for at Least One Year	Ensure compliance retention.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
100	9.1	Deploy Email Anti-Phishing and Spam Filtering	Block malicious email campaigns.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
106	10.1	Establish and Maintain Malware Defense Process	Document AV/EDR workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
107	10.2	Deploy Anti-Malware/EDR on All End-Points	Install agents enterprise-wide.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
108	10.3	Ensure Automatic Updates of Signatures/Engines	Keep EDR definitions current.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
109	10.4	Enforce Host-Based Detection Policies	Configure policies in EDR.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
110	10.5	Perform Automated Quarantine and Remediation	Block or auto-remediate infections.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
49	3.6	Encrypt Data on End-User Devices	Use full-disk encryption on laptops and mobiles.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
50	3.7	Establish and Maintain a Data Classification Scheme	Apply labels such as Confidential, Internal, Public.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
51	3.8	Document Data Flows	Diagram how data moves among systems and services.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
52	3.9	Encrypt Data on Removable Media	Enforce encryption on USBs, external drives.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
53	3.10	Encrypt Sensitive Data in Transit	Use TLS/SSH for all sensitive communications.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
61	4.4	Implement and Manage a Firewall on Servers	Use host-based or network firewalls on servers.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
62	4.5	Implement and Manage a Firewall on End-User Devices	Enforce host firewalls on workstations/laptops.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
63	4.6	Securely Manage Enterprise Assets and Software	Use SSH/HTTPS for admin and IaC for configs.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
64	4.7	Manage Default Accounts on Enterprise Assets and Software	Disable or rename vendor default accounts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
65	4.8	Uninstall or Disable Unnecessary Services on Enterprise Assets and Software	Remove unused services and applications.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
66	4.9	Configure Trusted DNS Servers on Enterprise Assets	Point to enterprise or known-good DNS.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
67	4.10	Enforce Automatic Device Lockout on Portable End-User Devices	Lock after failed auth attempts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
68	4.11	Enforce Remote Wipe Capability on Portable End-User Devices	Be able to erase lost/stolen devices.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
69	4.12	Separate Enterprise Workspaces on Mobile End-User Devices	Use containerization or work profiles.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
70	5.1	Establish and Maintain an Inventory of Accounts	Catalog user, admin, and service accounts.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
71	5.2	Use Unique Passwords	Prevent password reuse across accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
72	5.3	Disable Dormant Accounts	Disable accounts after 45 days of inactivity.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
73	5.4	Restrict Administrator Privileges to Dedicated Administrator Accounts	Do not do general computing with admin accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
74	5.5	Establish and Maintain an Inventory of Service Accounts	Track purpose, owner, and review dates.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
75	5.6	Centralize Account Management	Use AD, LDAP, or equivalent directory.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
76	6.1	Establish and Maintain an Access Control Policy	Document roles & permission models.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
123	12.7	Restrict Unused Network Ports and Protocols	Disable non-essential ports.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
124	12.8	Continuously Monitor Network Device Health	Alert on anomalies.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
125	13.1	Establish and Maintain a Network Monitoring Process	Document NOC/SOC workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
126	13.2	Deploy IDS/IPS and NDR Solutions	Detect network threats in real-time.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
127	13.3	Monitor for Unauthorized Lateral Movement	Alert on horizontal traffic anomalies.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
128	13.4	Analyze Network Flows for Anomalies	Use NetFlow, packet analysis.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
129	13.5	Implement Network Deception Technologies	Deploy honeypots/honeynets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
130	13.6	Ensure High-Fidelity Alerting	Reduce false positives.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
131	13.7	Perform Regular Network Traffic Baseline Analysis	Establish normal patterns.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
132	13.8	Detect and Respond to Rogue Wireless Access Points	Scan for unauthorized APs.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
133	13.9	Integrate Network Alerts into SIEM	Centralize network event correlation.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
134	14.1	Establish and Maintain a Security Awareness Program	Document annual training plans.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
135	14.2	Provide Role-Based Security Training	Customize content by job function.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
136	14.3	Test User Phishing Susceptibility Quarterly	Simulate phishing campaigns.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
137	14.4	Measure and Report Training Effectiveness	Track metrics & KPIs.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
138	14.5	Update Training Content Annually	Refresh modules each year.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
139	15.1	Establish and Maintain a Service Provider Management Process	Document third-party risk workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
140	15.2	Inventory All Third-Party Service Providers	Catalog vendors & services.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
141	15.3	Define and Enforce Security Requirements in SLAs	Embed controls into contracts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
142	15.4	Perform Onboarding and Offboarding Reviews	Validate vendor access lifecycle.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
143	15.5	Monitor Third-Party Compliance Continuously	Use questionnaires & attestations.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
144	15.6	Conduct Periodic Third-Party Assessments	Audit or pen-test vendors.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
145	15.7	Maintain Evidence of Third-Party Security Compliance	Store reports & certifications.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
146	16.1	Establish and Maintain an Application Security Process	Document SDLC security gates.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
147	16.2	Inventory All In-House and Third-Party Apps	Catalog codebases & binaries.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
148	16.3	Implement DevSecOps Toolchain	Integrate SAST/DAST into CI/CD.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
149	16.4	Perform Static Application Security Testing (SAST)	Scan source code for flaws.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
150	16.5	Perform Dynamic Application Security Testing (DAST)	Test APIs/web apps at runtime.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
151	16.6	Enforce Secure Coding Standards	Adopt OWASP/SEI rules.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
152	16.7	Conduct Periodic Code Reviews	Peer review security logic.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
153	16.8	Remediate Application Vulnerabilities	Track & fix in sprint backlog.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
154	16.9	Monitor Application Behavior in Production	Runtime protection & logging.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
155	17.1	Establish and Maintain an Incident Response Process	Document IR plan & SLAs.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
156	17.2	Define and Train IR Team Roles	Assign roles & run drills.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
157	17.3	Maintain Incident Playbooks	Keep runbooks for common events.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
158	17.4	Conduct Table-Top Exercises Quarterly	Simulate incidents with stakeholders.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
159	17.5	Perform Post-Incident Reviews and Lessons Learned	Update processes after each event.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
160	18.1	Establish and Maintain a Pen Test Program	Define scope, cadence, and reporting.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
161	18.2	Perform External Penetration Testing Annually	Engage third-parties externally.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
162	18.3	Perform Internal Penetration Testing Annually	Run internal red-team exercises.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
163	18.4	Validate Remediation of Pen Test Findings	Re-test to confirm fixes.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N	CIS	\N	{}	{}	{}	\N	\N	\N	\N	\N	{}
296	A&A-01	Audit and Assurance Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\naudit and assurance policies and procedures and standards. Review and update\nthe policies and procedures at least annually.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.436905	2025-06-13 09:08:42.436905	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-1}	{12.1.1,12.1.2}	{3.14}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":false,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
490	UEM-12	Remote Locate	Enable remote geo-location capabilities for all managed mobile endpoints.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.808477	2025-06-13 09:08:48.808477	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{CM-8,CM-8(8)}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
297	A&A-02	Independent Assessments	Conduct independent audit and assurance assessments according to\nrelevant standards at least annually.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.486897	2025-06-13 09:08:42.486897	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-2,CA-2(1),CA-2(2),CA-7,CA-7(1)}	{"No Mapping"}	{3.14}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
298	A&A-03	Risk Based Planning Assessment	Perform independent audit and assurance assessments according to\nrisk-based plans and policies.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.521081	2025-06-13 09:08:42.521081	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-2,CA-2(1)-(3),PL-10,PL-11}	{"No Mapping"}	{3.14}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
299	A&A-04	Requirements Compliance	Verify compliance with all relevant standards, regulations, legal/contractual,\nand statutory requirements applicable to the audit.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.553851	2025-06-13 09:08:42.553851	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-1}	{"No Mapping"}	{3.14}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
300	A&A-05	Audit Management Process	Define and implement an Audit Management process to support audit\nplanning, risk analysis, security control assessment, conclusion, remediation\nschedules, report generation, and review of past reports and supporting evidence.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.586504	2025-06-13 09:08:42.586504	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-1,CA-2,PM-4}	{"No Mapping"}	{3.14}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
301	A&A-06	Remediation	Establish, document, approve, communicate, apply, evaluate and maintain\na risk-based corrective action plan to remediate audit findings, review and\nreport remediation status to relevant stakeholders.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Audit & Assurance	{}	{}	2025-06-13 09:08:42.619111	2025-06-13 09:08:42.619111	\N	\N	\N	\N	\N	\N	\N	CCM	A&A	{CA-5,CA-5(1),PM-4}	{"No Mapping"}	{3.14}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
302	AIS-01	Application and Interface Security Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for application security to provide guidance to the\nappropriate planning, delivery and support of the organization's application\nsecurity capabilities. Review and update the policies and procedures at least\nannually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.652092	2025-06-13 09:08:42.652092	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{CM-3,CM-3(2),PM-20,PM-20(1),SA-1,SA-4,SA-8,SA-8(29)-(33),SI-17}	{12.1.1,12.1.2,6.1.1,6.2.1,6.2.3}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
303	AIS-02	Application Security Baseline Requirements	Establish, document and maintain baseline requirements for securing\ndifferent applications.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.684737	2025-06-13 09:08:42.684737	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{CM-2,CM-2(2),CM-2(3),SA-8,SA-8(8),SA-8(14),SA-8(23),SA-8(29),SA-8(31)}	{6.2.1}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
304	AIS-03	Application Security Metrics	Define and implement technical and operational metrics in alignment\nwith business objectives, security requirements, and compliance obligations.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.717558	2025-06-13 09:08:42.717558	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{SA-15,SA-15(1)}	{"No Mapping"}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
305	AIS-04	Secure Application Design and Development	Define and implement a SDLC process for application design, development,\ndeployment, and operation in accordance with security requirements defined by\nthe organization.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.750662	2025-06-13 09:08:42.750662	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{PL-2,PL-8,PL-8(1),SA-3,SA-3(1),SA-4,SA-4(2),SA-4(3),SA-4(8),SA-4(9),SA-5,SA-8,SA-8(1)-(7),SA-8(9)-(13),SA-8(15)-(20),SA-8(22),SA-8(24)-(28),SA-8(30)-(33),SA-17,SA-17(1)-(9)}	{6.2.1,6.2.3,6.5.2}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
306	AIS-05	Automated Application Security Testing	Implement a testing strategy, including criteria for acceptance of\nnew information systems, upgrades and new versions, which provides application\nsecurity assurance and maintains compliance while enabling organizational speed\nof delivery goals. Automate when applicable and possible.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.783506	2025-06-13 09:08:42.783506	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{SA-11,SA-11(1)-(9),SI-6,SI-6(2),SI-6(3),SI-10,SI-10(1)-(6)}	{6.2.4,6.4.1,6.4.2,6.5.1}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
307	AIS-06	Automated Secure Application Deployment	Establish and implement strategies and capabilities for secure, standardized,\nand compliant application deployment. Automate where possible.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.816071	2025-06-13 09:08:42.816071	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{SA-3,SA-3(2),SA-3(3),SA-4,SA-4(3),SA-8,SA-8(31),SA-16,SR-9,SR-9(1)}	{6.5.1}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
308	AIS-07	Application Vulnerability Remediation	Define and implement a process to remediate application security\nvulnerabilities, automating remediation when possible.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Application & Interface Security	{}	{}	2025-06-13 09:08:42.848857	2025-06-13 09:08:42.848857	\N	\N	\N	\N	\N	\N	\N	CCM	AIS	{SI-2,SI-2(2)-(6),SA-11,SA-11(2),SA-15,SA-15(1)-(3),SA-15(5)-(8),SA-15(10)-(12)}	{6.3.1,11.3.1,11.3.1.1}	{16.1,16.2,16.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
309	BCR-01	Business Continuity Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\nbusiness continuity management and operational resilience policies and procedures.\nReview and update the policies and procedures at least annually.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:42.881734	2025-06-13 09:08:42.881734	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-1,CP-2,PL-2}	{12.1.1,12.1.2}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
310	BCR-02	Risk Assessment and Impact Analysis	Determine the impact of business disruptions and risks to establish\ncriteria for developing business continuity and operational resilience strategies\nand capabilities.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:42.914278	2025-06-13 09:08:42.914278	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-2,PM-8,PM-9}	{12.3.1,12.10.1}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
311	BCR-03	Business Continuity Strategy	Establish strategies to reduce the impact of, withstand, and recover\nfrom business disruptions within risk appetite.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:42.946841	2025-06-13 09:08:42.946841	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-1,CP-2,CP-2(1),CP-2(2),CP-2(5),CP-2(7)}	{12.3.1,12.10.1}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
312	BCR-04	Business Continuity Planning	Establish, document, approve, communicate, apply, evaluate and maintain\na business continuity plan based on the results of the operational resilience\nstrategies and capabilities.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:42.986211	2025-06-13 09:08:42.986211	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-2,CP-4,PM-8}	{12.10.1,12.10.5}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
313	BCR-05	Documentation	Develop, identify, and acquire documentation that is relevant to\nsupport the business continuity and operational resilience programs. Make the\ndocumentation available to authorized stakeholders and review periodically.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.019159	2025-06-13 09:08:43.019159	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-1,CP-2,CP-4}	{12.10.1,12.10.2,12.10.6}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
314	BCR-06	Business Continuity Exercises	Exercise and test business continuity and operational resilience\nplans at least annually or upon significant changes.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.052905	2025-06-13 09:08:43.052905	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{AT-3,AT-3(3),CP-3,CP-3(1),CP-4,CP-4(4),IR-4,IR-4(3)}	{12.10.2}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
315	BCR-07	Communication	Establish communication with stakeholders and participants in the\ncourse of business continuity and resilience procedures.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.085754	2025-06-13 09:08:43.085754	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-2,CP-2(1)}	{12.10.1}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
316	BCR-08	Backup	Periodically backup data stored in the cloud. Ensure the confidentiality,\nintegrity and availability of the backup, and verify data restoration from backup\nfor resiliency.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.119083	2025-06-13 09:08:43.119083	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-4,CP-4(4),CP-6,CP-6(1)-(3),CP-9,CP-9(1),CP-9(2),CP-10,CP-10(2),CP-10(4)}	{12.10.1,10.3.3}	{11.1,11.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":true,"App":false,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
317	BCR-09	Disaster Response Plan	Establish, document, approve, communicate, apply, evaluate and maintain\na disaster response plan to recover from natural and man-made disasters. Update\nthe plan at least annually or upon significant changes.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.151428	2025-06-13 09:08:43.151428	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-2(1),CP-2(2),CP-2(3),CP-2(5),CP-2(6),CP-2(7),CP-2(8),PE-13,PE-13(1),PE-13(2),PE-13(4)}	{"No Mapping"}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
318	BCR-10	Response Plan Exercise	Exercise the disaster response plan annually or upon significant\nchanges, including if possible local emergency authorities.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.184706	2025-06-13 09:08:43.184706	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{AT-2,AT-2(1),AT-3,AT-3(3),AT-4,CP-3,CP-3(1),IR-3,IR-3(2),IR-3(3),IR-9,IR-9(2)}	{"No Mapping"}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
319	BCR-11	Equipment Redundancy	Supplement business-critical equipment with redundant equipment independently\nlocated at a reasonable minimum distance in accordance with applicable industry\nstandards.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Business Continuity Management and Operational Resilience	{}	{}	2025-06-13 09:08:43.218134	2025-06-13 09:08:43.218134	\N	\N	\N	\N	\N	\N	\N	CCM	BCR	{CP-2,CP-2(2),CP-4(3),CP-6,CP-6(1),CP-7,CP-8,CP-8(1)-(3),CP-9,CP-9(6)}	{"No Mapping"}	{11.1,11.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
320	CCC-01	Change Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for managing the risks associated with applying changes\nto organization assets, including application, systems, infrastructure, configuration,\netc., regardless of whether the assets are managed internally or externally\n(i.e., outsourced). Review and update the policies and procedures at least annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.250673	2025-06-13 09:08:43.250673	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-1,CM-9,CM-9(1),CM-10,CM-10(1),CM-11,PM-9,PS-8,SA-8,SA-8(1),SA-8(24),SI-12}	{12.1.1,12.1.2,6.1.1,6.5.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
321	CCC-02	Quality Testing	Follow a defined quality change control, approval and testing process\nwith established baselines, testing, and release standards.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.283608	2025-06-13 09:08:43.283608	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-2,CM-2(2),CM-2(6),CM-3,CM-3(2),CM-3(7),CM-4,CM-4(1),CM-4(2)}	{6.5.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
322	CCC-03	Change Management Technology	Manage the risks associated with applying changes to organization\nassets, including application, systems, infrastructure, configuration, etc.,\nregardless of whether the assets are managed internally or externally (i.e.,\noutsourced).	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.31635	2025-06-13 09:08:43.31635	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-2,CM-2(2),CM-2(3),CM-2(7),CM-3,CM-3(2),CM-3(3),CM-3(5),CM-3(6),CM-4,CM-4(1),CM-5,CM-5(5),CM-5(6),CM-7,CM-7(2)-(7),CM-11,CM-11(2),CM-14,SA-10,SA-10(7),SA-11,SA-11(9)}	{12.3.1,6.5.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
323	CCC-04	Unauthorized Change Protection	Restrict the unauthorized addition, removal, update, and management\nof organization assets.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.34929	2025-06-13 09:08:43.34929	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CA-7,CA-7(4),CM-3,CM-3(1),CM-3(5),CM-3(7),CM-3(8),CM-5,CM-5(1),CM-5(4),CM-5(5),CM-6,CM-6(1),CM-6(2),CM-7,CM-7(1),CM-7(4),CM-7(5),CM-7(9)}	{6.5.1,6.5.2}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
324	CCC-05	Change Agreements	Include provisions limiting changes directly impacting CSCs owned\nenvironments/tenants to explicitly authorized requests within service level\nagreements between CSPs and CSCs.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.382335	2025-06-13 09:08:43.382335	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-3,CM-3(1),CM-3(2)}	{"No mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
325	CCC-06	Change Management Baseline	Establish change management baselines for all relevant authorized\nchanges on organization assets.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.41468	2025-06-13 09:08:43.41468	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-2,CM-2(3),CM-5,CM-5(6),CM-8,CM-8(1)-(9),CM-9,CM-9(1),CM-14}	{"No mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
326	CCC-07	Detection of Baseline Deviation	Implement detection measures with proactive notification in case\nof changes deviating from the established baseline.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.447684	2025-06-13 09:08:43.447684	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-6,CM-6(2),SI-2,SI-2(2)-(6)}	{11.5.2,11.6.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
327	CCC-08	Exception Management	'Implement a procedure for the management of exceptions, including\nemergencies, in the change and configuration process. Align the procedure with\nthe requirements of GRC-04: Policy Exception Process.'	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.480415	2025-06-13 09:08:43.480415	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-3,CM-3(1)}	{"No mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
328	CCC-09	Change Restoration	Define and implement a process to proactively roll back changes to\na previous known good state in case of errors or security concerns.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Change Control and Configuration Management	{}	{}	2025-06-13 09:08:43.513611	2025-06-13 09:08:43.513611	\N	\N	\N	\N	\N	\N	\N	CCM	CCC	{CM-2,CM-2(3),CM-3,CM-3(3),CM-3(7),SA-8,SA-8(24)}	{6.5.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
329	CEK-01	Encryption and Key Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for Cryptography, Encryption and Key Management. Review\nand update the policies and procedures at least annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.54634	2025-06-13 09:08:43.54634	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-1,SA-9,SA-9(6),SC-12,SC-12(2),SC-12(3)}	{12.1.1,12.1.2,3.1.1,3.6.1,3.7.8,4.1.1}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
330	CEK-02	CEK Roles and Responsibilities	Define and implement cryptographic, encryption and key management\nroles and responsibilities.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.578556	2025-06-13 09:08:43.578556	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{IA-7,IA-8,IA-8(5),SA-9,SA-9(1),SA-9(6),SC-12,SC-12(6),SC-13}	{3.1.2,3.7.8}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
331	CEK-03	Data Encryption	Provide cryptographic protection to data at-rest and in-transit,\nusing cryptographic libraries certified to approved standards.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.611019	2025-06-13 09:08:43.611019	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{AC-19,AC-19(5),SC-8,SC-8(1),SC-8(3),SC-8(4),SC-12,SC-12(2),SC-12(3),SC-28,SC-28(1)-(3),SI-4,SI-4(10),SI-7,SI-7(6)}	{2.2.7,3.5.1,4.2.1,4.2.1.2,4.2.2}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
332	CEK-04	Encryption Algorithm	Use encryption algorithms that are appropriate for data protection,\nconsidering the classification of data, associated risks, and usability of the\nencryption technology.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.643787	2025-06-13 09:08:43.643787	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3),SC-28,SC-28(1)}	{2.2.7,3.5.1,4.2.1,4.2.1.2,4.2.2}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
333	CEK-05	Encryption Change Management	Establish a standard change management procedure, to accommodate\nchanges from internal and external sources, for review, approval, implementation\nand communication of cryptographic, encryption and key management technology\nchanges.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.676497	2025-06-13 09:08:43.676497	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{CM-3,CM-3(6),SI-7,SI-7(6)}	{3.7.9,6.5.1,12.3.3}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
334	CEK-06	Encryption Change Cost Benefit Analysis	Manage and adopt changes to cryptography-, encryption-, and key management-related\nsystems (including policies and procedures) that fully account for downstream\neffects of proposed changes, including residual risk, cost, and benefits analysis.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.708814	2025-06-13 09:08:43.708814	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{CM-3,CM-3(6),PL-2}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
335	CEK-07	Encryption Risk Management	Establish and maintain an encryption and key management risk program\nthat includes provisions for risk assessment, risk treatment, risk context,\nmonitoring, and feedback.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.741581	2025-06-13 09:08:43.741581	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{CM-3,CM-3(6),PM-31,SC-28,SC-28(1),SC-28(3)}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
336	CEK-08	CSC Key Management Capability	CSPs must provide the capability for CSCs to manage their own data\nencryption keys.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.774343	2025-06-13 09:08:43.774343	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{CP-9,CP-9(8),SA-9,SA-9(6),SC-12,SC-12(6)}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
337	CEK-09	Encryption and Key Management Audit	Audit encryption and key management systems, policies, and processes\nwith a frequency that is proportional to the risk exposure of the system with\naudit occurring preferably continuously but at least annually and after any\nsecurity event(s).	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.806782	2025-06-13 09:08:43.806782	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{AU-9,AU-9(3),PM-31}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
338	CEK-10	Key Generation	Generate Cryptographic keys using industry accepted cryptographic\nlibraries specifying the algorithm strength and the random number generator\nused.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.839505	2025-06-13 09:08:43.839505	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3),SC-13}	{3.6.1,3.6.1.1,3.7.1}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
339	CEK-11	Key Purpose	Manage cryptographic secret and private keys that are provisioned\nfor a unique purpose.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.872177	2025-06-13 09:08:43.872177	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{IA-5,IA-5(2),PM-32,SC-12,SC-12(2),SC-12(3),SC-13}	{2.2.7,3.6.1,3.6.1.2,3.7.1,3.7.2,3.7.4,3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
340	CEK-12	Key Rotation	Rotate cryptographic keys in accordance with the calculated cryptoperiod,\nwhich includes provisions for considering the risk of information disclosure\nand legal and regulatory requirements.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.904988	2025-06-13 09:08:43.904988	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3),SC-13}	{3.7.4,3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
341	CEK-13	Key Revocation	Define, implement and evaluate processes, procedures and technical\nmeasures to revoke and remove cryptographic keys prior to the end of its established\ncryptoperiod, when a key is compromised, or an entity is no longer part of the\norganization, which include provisions for legal and regulatory requirements.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.937574	2025-06-13 09:08:43.937574	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3)}	{3.7.4,3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
342	CEK-14	Key Destruction	Define, implement and evaluate processes, procedures and technical\nmeasures to destroy keys stored outside a secure environment and revoke keys\nstored in Hardware Security Modules (HSMs) when they are no longer needed, which\ninclude provisions for legal and regulatory requirements.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:43.970815	2025-06-13 09:08:43.970815	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3)}	{3.7.4,3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
343	CEK-15	Key Activation	Define, implement and evaluate processes, procedures and technical\nmeasures to create keys in a pre-activated state when they have been generated\nbut not authorized for use, which include provisions for legal and regulatory\nrequirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.003163	2025-06-13 09:08:44.003163	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3),SC-13}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
344	CEK-16	Key Suspension	Define, implement and evaluate processes, procedures and technical\nmeasures to monitor, review and approve key transitions from any state to/from\nsuspension, which include provisions for legal and regulatory requirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.035645	2025-06-13 09:08:44.035645	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{PM-31,SC-12,SC-12(2),SC-12(3),SC-13}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
345	CEK-17	Key Deactivation	Define, implement and evaluate processes, procedures and technical\nmeasures to deactivate keys at the time of their expiration date, which include\nprovisions for legal and regulatory requirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.068354	2025-06-13 09:08:44.068354	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(2),SC-12(3)}	{"No Mapping"}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
346	CEK-18	Key Archival	Define, implement and evaluate processes, procedures and technical\nmeasures to manage archived keys in a secure repository requiring least privilege\naccess, which include provisions for legal and regulatory requirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.100603	2025-06-13 09:08:44.100603	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(1)-(3),SC-28,SC-28(3)}	{3.6.1,3.6.1.3,3.6.1.4,3.7.3}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
347	CEK-19	Key Compromise	Define, implement and evaluate processes, procedures and technical\nmeasures to use compromised keys to encrypt information only in controlled circumstance,\nand thereafter exclusively for decrypting data and never for encrypting data,\nwhich include provisions for legal and regulatory requirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.133035	2025-06-13 09:08:44.133035	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(1)-(3)}	{3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
348	CEK-20	Key Recovery	Define, implement and evaluate processes, procedures and technical\nmeasures to assess the risk to operational continuity versus the risk of the\nkeying material and the information it protects being exposed if control of\nthe keying material is lost, which include provisions for legal and regulatory\nrequirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.168053	2025-06-13 09:08:44.168053	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{CM-3,CM-3(6),CP-9,CP-9(8),SC-12,SC-12(1)-(3)}	{3.7.5}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
349	CEK-21	Key Inventory Management	Define, implement and evaluate processes, procedures and technical\nmeasures in order for the key management system to track and report all cryptographic\nmaterials and changes in status, which include provisions for legal and regulatory\nrequirements.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Cryptography, Encryption & Key Management	{}	{}	2025-06-13 09:08:44.200223	2025-06-13 09:08:44.200223	\N	\N	\N	\N	\N	\N	\N	CCM	CEK	{SC-12,SC-12(1)-(3),SC-12(6)}	{3.6.1,3.6.1.1,4.2.1.1,12.3.3}	{3.11}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
350	DCS-01	Off-Site Equipment Disposal Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the secure disposal of equipment used outside the\norganization's premises. If the equipment is not physically destroyed a data\ndestruction procedure that renders recovery of information impossible must be\napplied. Review and update the policies and procedures at least annually.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.232564	2025-06-13 09:08:44.232564	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{MP-6,MP-6(1)-(3),MP-6(8),MP-7(2),MP-8}	{12.1.1,12.1.2,9.1.1,9.4.7}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
351	DCS-02	Off-Site Transfer Authorization Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the relocation or transfer of hardware, software,\nor data/information to an offsite or alternate location. The relocation or transfer\nrequest requires the written or cryptographically verifiable authorization.\nReview and update the policies and procedures at least annually.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.265106	2025-06-13 09:08:44.265106	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{AC-1,AC-4,CA-3,MP-5,MP-5(3),SC-4,SC-4(2)}	{12.1.1,12.1.2,9.1.1,9.4.3,9.4.4}	{12.1,12.2}	Partial Gap	Missing specification(s) in NIST 800-53:\n'The relocation or transfer request requires the written or cryptographically verifiable authorization'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
352	DCS-03	Secure Area Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for maintaining a safe and secure working environment\nin offices, rooms, and facilities. Review and update the policies and procedures\nat least annually.	preventive	physical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.297468	2025-06-13 09:08:44.297468	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{PE-1,PE-6,PE-6(1)-(4),SC-15,SC-15(1),SC-15(3),SC-15(4)}	{12.1.1,12.1.2,9.3.1,9.3.2}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
353	DCS-04	Secure Media Transportation Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the secure transportation of physical media. Review\nand update the policies and procedures at least annually.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.330398	2025-06-13 09:08:44.330398	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{MP-1,MP-5,MP-5(3)}	{9.1.1,9.4.3,9.4.4,12.1.1,12.1.2}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
354	DCS-05	Assets Classification	Classify and document the physical, and logical assets (e.g., applications)\nbased on the organizational business risk.	preventive	physical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.363057	2025-06-13 09:08:44.363057	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{CM-8,CM-8(1),CM-8(2),CM-8(4),CM-8(6),CM-8(7),CM-8(9),PM-5,PM-5(1),PE-20}	{9.4.2}	{12.1,12.2}	No Gap	Missing specification(s) in NIST 800-53:\n'based on the organizational business risk'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
355	DCS-06	Assets Cataloguing and Tracking	Catalogue and track all relevant physical and logical assets located\nat all of the CSP's sites within a secured system.	preventive	physical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.395955	2025-06-13 09:08:44.395955	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{CM-8,CM-8(1),CM-8(2),CM-8(4),CM-8(7),CM-8(8)}	{3.6.1.1,6.3.2,9.4.2,9.4.3,12.5.1}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
373	DSP-09	Data Protection Impact Assessment	Conduct a Data Protection Impact Assessment (DPIA) to evaluate the\norigin, nature, particularity and severity of the risks upon the processing\nof personal data, according to any applicable laws, regulations and industry\nbest practices.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.982438	2025-06-13 09:08:44.982438	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{CM-4,CM-4(1),CM-4(2),PT-3,RA-8,SA-4,SA-9,SA-9(1)}	{3.2.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
356	DCS-07	Controlled Access Points	Implement physical security perimeters to safeguard personnel, data,\nand information systems. Establish physical security perimeters between the\nadministrative and business areas and the data storage and processing facilities\nareas.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.428553	2025-06-13 09:08:44.428553	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{AT-3(2),PE-2,PE-2(1),PE-2(3),PE-3,PE-3(2)-(5),PE-3(7),PE-3(8),PE-6,PE-6(1)-(4),PE-8,PE-8(1)}	{9.2.1,9.2.1.1,9.2.2,9.2.3,9.2.4}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
357	DCS-08	Equipment Identification	Use equipment identification as a method for connection authentication.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.460827	2025-06-13 09:08:44.460827	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{AC-18,AC-18(1),IA-3,IA-3(3),IA-3(4)}	{"No Mapping"}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
358	DCS-09	Secure Area Authorization	Allow only authorized personnel access to secure areas, with all\ningress and egress points restricted, documented, and monitored by physical\naccess control mechanisms. Retain access control records on a periodic basis\nas deemed appropriate by the organization.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.493343	2025-06-13 09:08:44.493343	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{MP-4(2),PE-3,PE-3(8),PE-5,PE-6,PE-6(1)-(4),PE-18,SC-42}	{9.2.1,9.2.1.1,9.3.1,9.3.1.1,9.3.2,9.3.3,9.3.4}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
359	DCS-10	Surveillance System	Implement, maintain, and operate datacenter surveillance systems\nat the external perimeter and at all the ingress and egress points to detect\nunauthorized ingress and egress attempts.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.525961	2025-06-13 09:08:44.525961	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{PE-6,PE-6(1)-(3)}	{9.2.1.1}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
360	DCS-11	Unauthorized Access Response Training	Train datacenter personnel to respond to unauthorized ingress or\negress attempts.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.558417	2025-06-13 09:08:44.558417	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{AT-3,AT-3(2),IR-2,IR-2(1)-(3)}	{12.6.3.1,12.10.4}	{12.1,12.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":true}	CSP-Owned	{IaaS,PaaS,SaaS}
361	DCS-12	Cabling Security	Define, implement and evaluate processes, procedures and technical\nmeasures that ensure a risk-based protection of power and telecommunication\ncables from a threat of interception, interference or damage at all facilities,\noffices and rooms.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.591085	2025-06-13 09:08:44.591085	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{PE-9,PE-9(1),PE-9(2),PE-19,PE-19(1)}	{"No Mapping"}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
362	DCS-13	Environmental Systems	Implement and maintain data center environmental control systems\nthat monitor, maintain and test for continual effectiveness the temperature\nand humidity conditions within accepted industry standards.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.623062	2025-06-13 09:08:44.623062	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{MA-6,MA-6(1),MA-6(2),PE-13,PE-13(1),PE-13(4),PE-14,PE-14(1),PE-15,PE-15(1)}	{"No Mapping"}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
363	DCS-14	Secure Utilities	Secure, monitor, maintain, and test utilities services for continual\neffectiveness at planned intervals.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.655809	2025-06-13 09:08:44.655809	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{MA-6,MA-6(1),MA-6(2)}	{"No Mapping"}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
364	DCS-15	Equipment Location	Keep business-critical equipment away from locations subject to high\nprobability for environmental risk events.	preventive	physical	planned	6	0.00	0.00	f	CCM Domain: Datacenter Security	{}	{}	2025-06-13 09:08:44.688092	2025-06-13 09:08:44.688092	\N	\N	\N	\N	\N	\N	\N	CCM	DCS	{PE-18,PE-23}	{"No Mapping"}	{12.1,12.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
365	DSP-01	Security and Privacy Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the classification, protection and handling of data\nthroughout its lifecycle, and according to all applicable laws and regulations,\nstandards, and risk level. Review and update the policies and procedures at\nleast annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.721259	2025-06-13 09:08:44.721259	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PL-2,PL-7,PM-17,PM-18,PM-19,PM-20,PM-20(1),PM-23,PM-24,PM-26,PT-1,PT-5,PT-5(2),PT-6,PT-6(1),PT-7,PT-7(2)}	{12.1.1,12.1.2,12.1.3,12.1.4,12.3.1,12.3.2,12.4.1,12.10.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
366	DSP-02	Secure Disposal	Apply industry accepted methods for the secure disposal of data from\nstorage media such that data is not recoverable by any forensic means.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.753837	2025-06-13 09:08:44.753837	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-22,SI-12,SI-12(3),SI-18,SI-18(1),SI-18(4),SI-18(5)}	{3.2.1,3.7.5,9.4.7}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
367	DSP-03	Data Inventory	Create and maintain a data inventory, at least for any sensitive\ndata and personal data.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.786537	2025-06-13 09:08:44.786537	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{CM-12,CM-12(1),PM-5,PM-5(1),SI-12,SI-12(1),SI-19,SI-19(1),SI-19(2)}	{3.2.1,9.4.5}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
368	DSP-04	Data Classification	Classify data according to its type and sensitivity level.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.819498	2025-06-13 09:08:44.819498	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{AC-16,AC-16(9),PM-22,PM-23,PT-2,PT-2(1),SI-18,SI-18(2),SI-19,SI-19(6)}	{9.4.2,9.4.3}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
369	DSP-05	Data Flow Documentation	Create data flow documentation to identify what data is processed,\nstored or transmitted where. Review data flow documentation at defined intervals,\nat least annually, and after any change.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.852094	2025-06-13 09:08:44.852094	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{AC-4,AC-4(1)-(3),AC-4(5)-(8),AC-4(10),AC-4(12),AC-16,AC-16(3),AC-16(7),AC-16(8),AC-4(13),AC-4(19),SA-5,SA-17,SA-17(3),SC-7,SC-7(24)}	{1.2.4,12.5.2}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
370	DSP-06	Data Ownership and Stewardship	Document ownership and stewardship of all relevant documented personal\nand sensitive data. Perform review at least annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.885079	2025-06-13 09:08:44.885079	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-18,PM-19,PM-22,PT-2,PT-2(1),PS-6,PS-6(2),SI-12,SI-12(1)}	{3.1.1,3.2.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
371	DSP-07	Data Protection by Design and Default	Develop systems, products, and business practices based upon a principle\nof security by design and industry best practices.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.917707	2025-06-13 09:08:44.917707	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-17,PM-24,PM-25,PT-2,PT-2(2),SA-3,SA-4,SA-5,SA-8,SA-8(9),SA-8(13),SA-8(18),SA-8(20),SA-8(22),SA-8(23),SA-8(33),SA-15,SA-15(12),SC-3,SC-3(3),SC-7,SC-7(24),SC-8,SC-8(1)-(4),SC-28,SC-28(1),SI-12,SI-12(1)-(3)}	{6.2.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
372	DSP-08	Data Privacy by Design and Default	Develop systems, products, and business practices based upon a principle\nof privacy by design and industry best practices. Ensure that systems' privacy\nsettings are configured by default, according to all applicable laws and regulations.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:44.950291	2025-06-13 09:08:44.950291	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-22,PM-24,PT-1,PT-2,PT-2(1),PT-5,PT-5(1),PT-5(2),PT-6,PT-8,SA-11,SA-11(3),SI-18,SI-18(3),SA-19,SI-19(1),SI-19(5),SI-19(6),SI-19(8)}	{"No Mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
374	DSP-10	Sensitive Data Transfer	Define, implement and evaluate processes, procedures and technical\nmeasures that ensure any transfer of personal or sensitive data is protected\nfrom unauthorized access and only processed within scope as permitted by the\nrespective laws and regulations.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.014863	2025-06-13 09:08:45.014863	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{AC-4,AC-4(23)-(25),CA-3,CA-3(6),CA-6,CA-6(1),CA-6(2),SC-4,SC-4(2),SC-7,SC-7(10),SC-7(24),SC-8,SC-8(1)-(5),SC-16,SC-16(1)-(3)}	{4.1.1,4.2.1,4.2.2}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
375	DSP-11	Personal Data Access, Reversal, Rectification and Deletion	Define and implement, processes, procedures and technical measures\nto enable data subjects to request access to, modification, or deletion of their\npersonal data, according to any applicable laws and regulations.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.047252	2025-06-13 09:08:45.047252	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-22,PM-24,PT-2,PT-2(1),PT-4,PT-4(1),PT-4(3),PT-6,PT-6(2),PT-7,PT-7(2),SI-12,SI-12(1),SI-19,SI-19(1),SI-19(7)}	{"No Mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
376	DSP-12	Limitation of Purpose in Personal Data Processing	Define, implement and evaluate processes, procedures and technical\nmeasures to ensure that personal data is processed according to any applicable\nlaws and regulations and for the purposes declared to the data subject.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.080028	2025-06-13 09:08:45.080028	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-23,PM-27,PM-32,PT-2,PT-2(1),PT-3,PT-3(1),PT-3(2),PT-4,PT-4(2),PT-4(3),PT-6,PT-6(1),PT-6(2),SI-12,SI-12(1),SI-19,SI-19(1)}	{"No Mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
377	DSP-13	Personal Data Sub-processing	Define, implement and evaluate processes, procedures and technical\nmeasures for the transfer and sub-processing of personal data within the service\nsupply chain, according to any applicable laws and regulations.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.112735	2025-06-13 09:08:45.112735	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{CM-13,PT-3,PT-3(1),SA-9,SA-9(1),SA-9(3),SA-9(5),SR-3,SR-3(3),SR-4,SR-4(1)}	{12.8.2,12.9.2}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
378	DSP-14	Disclosure of Data Sub-processors	Define, implement and evaluate processes, procedures and technical\nmeasures to disclose the details of any personal or sensitive data access by\nsub-processors to the data owner prior to initiation of that processing.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.145711	2025-06-13 09:08:45.145711	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PM-22,PT-6,PT-6(1),PT-6(2),PT-8,SR-4,SR-4(1)}	{"No Mapping"}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
379	DSP-15	Limitation of Production Data Use	Obtain authorization from data owners, and manage associated risk\nbefore replicating or using production data in non-production environments.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.178429	2025-06-13 09:08:45.178429	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{SA-3,SA-3(2),SI-19,SI-19(3)}	{6.5.5}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
380	DSP-16	Data Retention and Deletion	Data retention, archiving and deletion is managed in accordance with\nbusiness requirements, applicable laws and regulations.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.210708	2025-06-13 09:08:45.210708	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{SI-12,SI-12(1)-(3),SI-18,SI-18(1),SI-18(4),SI-18(5),SI-19,SI-19(2)}	{3.2.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":true,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
381	DSP-17	Sensitive Data Protection	Define and implement, processes, procedures and technical measures\nto protect sensitive data throughout it's lifecycle.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.24402	2025-06-13 09:08:45.24402	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{PL-2,PM-22,PM-24,PT-7,PT-7(1),PT-7(2),PT-8,SC-8,SC-8(1)-(5),SC-28,SC-28(1)}	{3.1.1,4.1.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
382	DSP-18	Disclosure Notification	The CSP must have in place, and describe to CSCs the procedure to\nmanage and respond to requests for disclosure of Personal Data by Law Enforcement\nAuthorities according to applicable laws and regulations. The CSP must give\nspecial attention to the notification procedure to interested CSCs, unless otherwise\nprohibited, such as a prohibition under criminal law to preserve confidentiality\nof a law enforcement investigation.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.276276	2025-06-13 09:08:45.276276	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{IR-6,IR-6(3),PM-21,SR-8}	{12.10.1}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
383	DSP-19	Data Location	Define and implement, processes, procedures and technical measures\nto specify and document the physical locations of data, including any locations\nin which data is processed or backed up.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Data Security and Privacy Lifecycle Management	{}	{}	2025-06-13 09:08:45.308911	2025-06-13 09:08:45.308911	\N	\N	\N	\N	\N	\N	\N	CCM	DSP	{CA-3,CA-3(6),CM-8,CM-8(8),CM-12,CM-12(1),PM-5,PM-5(1),PM-22,PM-24,SA-9,SA-9(5),SA-9(8)}	{12.5.2,A3.2.1,A3.2.5}	{3.1,3.2,3.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
384	GRC-01	Governance Program Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for an information governance program, which is sponsored\nby the leadership of the organization. Review and update the policies and procedures\nat least annually.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.341525	2025-06-13 09:08:45.341525	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PL-1,PM-1,PM-17,AC-1,AT-1,AU-1,CA-1,CM-1,CP-1,IA-1,IR-1,MA-1,MP-1,PE-1,PS-1,PT-1,RA-1,SA-1,SC-1,SI-1,SR-1}	{12.1.1,12.1.2,12.1.3,12.1.4,A3.1.1}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
385	GRC-02	Risk Management Program	Establish a formal, documented, and leadership-sponsored Enterprise\nRisk Management (ERM) program that includes policies and procedures for identification,\nevaluation, ownership, treatment, and acceptance of cloud security and privacy\nrisks.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.374513	2025-06-13 09:08:45.374513	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PL-1,PL-2,PM-4,PM-9,PM-10,PM-28}	{12.3.1,12.3.2}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
386	GRC-03	Organizational Policy Reviews	Review all relevant organizational policies and associated procedures\nat least annually or when a substantial change occurs within the organization.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.406874	2025-06-13 09:08:45.406874	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PL-1,PM-1,PM-14,PM-17}	{12.1.2}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
387	GRC-04	Policy Exception Process	Establish and follow an approved exception process as mandated by\nthe governance program whenever a deviation from an established policy occurs.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.439309	2025-06-13 09:08:45.439309	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{CM-6}	{"No Mapping"}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
388	GRC-05	Information Security Program	Develop and implement an Information Security Program, which includes\nprograms for all the relevant domains of the CCM.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.471442	2025-06-13 09:08:45.471442	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PM-1,PM-3,PM-14,PL-2,PM-18,PM-31}	{12.4.1,A3.1.1}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
389	GRC-06	Governance Responsibility Model	Define and document roles and responsibilities for planning, implementing,\noperating, assessing, and improving governance programs.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.503905	2025-06-13 09:08:45.503905	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PM-29}	{1.1.2,2.1.2,3.1.2,4.1.2,5.1.2,6.1.2,7.1.2,8.1.2,9.1.2,10.1.2,11.1.2,12.4.1,A3.1.1}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
390	GRC-07	Information System Regulatory Mapping	Identify and document all relevant standards, regulations, legal/contractual,\nand statutory requirements, which are applicable to your organization.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.536513	2025-06-13 09:08:45.536513	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PL-1}	{"No Mapping"}	{1.1,2.1}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
391	GRC-08	Special Interest Groups	Establish and maintain contact with cloud-related special interest\ngroups and other relevant entities in line with business context.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Governance, Risk and Compliance	{}	{}	2025-06-13 09:08:45.568995	2025-06-13 09:08:45.568995	\N	\N	\N	\N	\N	\N	\N	CCM	GRC	{PM-15}	{"No Mapping"}	{1.1,2.1}	No Gap	Missing specification(s) in NIST 800-53:\n'cloud-related special interest groups'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
392	HRS-01	Background Screening Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for background verification of all new employees (including\nbut not limited to remote employees, contractors, and third parties) according\nto local laws, regulations, ethics, and contractual constraints and proportional\nto the data classification to be accessed, the business requirements, and acceptable\nrisk. Review and update the policies and procedures at least annually.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.601948	2025-06-13 09:08:45.601948	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{IA-12,IA-12(2),IA-12(3),MA-5,MA-5(2)-(4),PS-1,PS-2,PS-3,PS-3(1),PS-3(2),PS-3(4)}	{12.1.1,12.1.2,12.7.1}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":false,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
393	HRS-02	Acceptable Use of Technology Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for defining allowances and conditions for the acceptable\nuse of organizationally-owned or managed assets. Review and update the policies\nand procedures at least annually.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.639883	2025-06-13 09:08:45.639883	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PL-4,PL-4(1),PS-1,PS-6,PS-6(2)}	{12.1.1,12.1.2,12.2.1}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
394	HRS-03	Clean Desk Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures that require unattended workspaces to not have openly\nvisible confidential data. Review and update the policies and procedures at\nleast annually.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.672251	2025-06-13 09:08:45.672251	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AC-11,AC-11(1),MP-4,PS-1}	{12.1.1,12.1.2}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
395	HRS-04	Remote and Home Working Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures to protect information accessed, processed or stored\nat remote sites and locations. Review and update the policies and procedures\nat least annually.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.705195	2025-06-13 09:08:45.705195	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AC-17,AC-17(6),AC-17(9),AC-20,AC-20(1)-(5),PE-17,PS-1,SC-7,SC-7(7)}	{12.1.1,12.1.2}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
396	HRS-05	Asset returns	Establish and document procedures for the return of organization-owned\nassets by terminated employees.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.737855	2025-06-13 09:08:45.737855	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PS-1,PS-4,PS-4(1),PS-6,PS-6(3)}	{8.2.5}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
397	HRS-06	Employment Termination	Establish, document, and communicate to all personnel the procedures\noutlining the roles and responsibilities concerning changes in employment.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.770034	2025-06-13 09:08:45.770034	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AC-17,AC-17(9),PS-1,PS-4,PS-4(1),PS-4(2),PS-5,PS-6,PS-6(3),SI-4,SI-4(19),SI-4(21)}	{"No Mapping"}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
398	HRS-07	Employment Agreement Process	Employees sign the employee agreement prior to being granted access\nto organizational information systems, resources and assets.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.802037	2025-06-13 09:08:45.802037	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PE-3,PE-3(1),PS-6,PS-6(2),PS-9}	{"No Mapping"}	{14.1,14.2}	No Gap	N/A	{"Phys":true,"Network":false,"Compute":false,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
399	HRS-08	Employment Agreement Content	The organization includes within the employment agreements provisions\nand/or terms for adherence to established information governance and security\npolicies.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.834158	2025-06-13 09:08:45.834158	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PL-4,PL-4(1),PS-6,PS-6(2),PS-6(3),PS-7}	{"No Mapping"}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
400	HRS-09	Personnel Roles and Responsibilities	Document and communicate roles and responsibilities of employees,\nas they relate to information assets and security.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.86682	2025-06-13 09:08:45.86682	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AC-1,AT-1,PS-1}	{12.1.3,1.1.2,2.1.2,3.1.2,3.7.8,4.1.2,5.1.2,6.1.2,7.1.2,8.1.2,9.1.2,10.1.2,11.1.2,A3.1.3}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
401	HRS-10	Non-Disclosure Agreements	Identify, document, and review, at planned intervals, requirements\nfor non-disclosure/confidentiality agreements reflecting the organization's\nneeds for the protection of data and operational details.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.899073	2025-06-13 09:08:45.899073	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PL-4,PS-6,PS-6(2)}	{"No Mapping"}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
402	HRS-11	Security Awareness Training	Establish, document, approve, communicate, apply, evaluate and maintain\na security awareness training program for all employees of the organization\nand provide regular training updates.	corrective	administrative	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.931322	2025-06-13 09:08:45.931322	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AT-1,AT-2,AT-2(1)-(6),AT-4,AT-6}	{12.6.1,12.6.2,12.6.3,12.6.3.1,12.6.3.2,A3.1.4}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
403	HRS-12	Personal and Sensitive Data Awareness and Training	Provide all employees with access to sensitive organizational and\npersonal data with appropriate security awareness training and regular updates\nin organizational procedures, processes, and policies relating to their professional\nfunction relative to the organization.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.96425	2025-06-13 09:08:45.96425	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{AT-3,AT-3(1),AT-3(2),AT-3(3),AT-3(5),AT-4,AT-6,IR-9,IR-9(2),PM-12,PM-16,SR-11,SR-11(1)}	{12.6.1,12.6.2,12.6.3,12.6.3.1,12.6.3.2,A3.1.4}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
404	HRS-13	Compliance User Responsibility	Make employees aware of their roles and responsibilities for maintaining\nawareness and compliance with established policies and procedures and applicable\nlegal, statutory, or regulatory compliance obligations.	corrective	administrative	planned	6	0.00	0.00	f	CCM Domain: Human Resources	{}	{}	2025-06-13 09:08:45.996487	2025-06-13 09:08:45.996487	\N	\N	\N	\N	\N	\N	\N	CCM	HRS	{PL-4,PL-4(1),PS-1,PS-6,PS-6(2)}	{12.6.1}	{14.1,14.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
405	IAM-01	Identity and Access Management Policy and Procedures	Establish, document, approve, communicate, implement, apply, evaluate\nand maintain policies and procedures for identity and access management. Review\nand update the policies and procedures at least annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.028936	2025-06-13 09:08:46.028936	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-1,AC-2,AC-2(3),AC-2(9),AC-2(11),AC-16,AC-16(1),AC-16(6),IA-4,IA-4(5),IA-4(6),IA-5,IA-5(16),IA-8,IA-8(4),IA-12,IA-12(2)-(6)}	{12.1.1,12.1.2,7.1.1,8.1.1}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
406	IAM-02	Strong Password Policy and Procedures	Establish, document, approve, communicate, implement, apply, evaluate\nand maintain strong password policies and procedures. Review and update the\npolicies and procedures at least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.061248	2025-06-13 09:08:46.061248	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-2,AC-2(3),AC-2(11),AC-3,AC-3(3),AC-12,AC-12(1),IA-2,IA-2(10),IA-5,IA-5(1),IA-5(18)}	{8.1.1,8.3.8}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
407	IAM-03	Identity Inventory	Manage, store, and review the information of system identities, and\nlevel of access.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.093704	2025-06-13 09:08:46.093704	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AU-10,AU-10(1),AU-10(2),AU-16,AU-16(1),IA-4,IA-4(8),IA-4(9),IA-5,IA-5(5),IA-8,IA-8(4),PM-5(1),SA-8,SA-8(22)}	{7.2.5,7.2.5.1}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
408	IAM-04	Separation of Duties	Employ the separation of duties principle when implementing information\nsystem access.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.126062	2025-06-13 09:08:46.126062	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-2,AC-2(3),AC-2(11),AC-6,AC-6(1)-(10)}	{6.5.3,6.5.4,7.2.1,7.2.2}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
409	IAM-05	Least Privilege	Employ the least privilege principle when implementing information\nsystem access.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.158694	2025-06-13 09:08:46.158694	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-6,AC-6(4),IA-12,IA-12(2),IA-12(3)}	{7.2.1,7.2.2,7.2.5,7.2.6}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
410	IAM-06	User Access Provisioning	Define and implement a user access provisioning process which authorizes,\nrecords, and communicates access changes to data and assets.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.191511	2025-06-13 09:08:46.191511	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-3,AC-16,AC-16(2),AC-16(4),AC-16(10),IA-12,IA-12(1)}	{7.2.2,7.2.3,8.2.4}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
411	IAM-07	User Access Changes and Revocation	De-provision or respectively modify access of movers / leavers or\nsystem identity changes in a timely manner in order to effectively adopt and\ncommunicate identity and access management policies.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.223802	2025-06-13 09:08:46.223802	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-2,AC-2(1),AC-2(2),AC-2(6),AC-2(8),AC-3,AC-3(8),AC-6,AC-6(7),AU-10,AU-10(4),AU-16,AU-16(1),CM-7,CM-7(1)}	{8.2.5,8.2.6}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
412	IAM-08	User Access Review	Review and revalidate user access for least privilege and separation\nof duties with a frequency that is commensurate with organizational risk tolerance.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.255875	2025-06-13 09:08:46.255875	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-6,AC-6(4),AC-6(8),IA-8,IA-8(4)}	{7.2.5.1,7.2.5,7.2.4}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
413	IAM-09	Segregation of Privileged Access Roles	Define, implement and evaluate processes, procedures and technical\nmeasures for the segregation of privileged access roles such that administrative\naccess to data, encryption and key management capabilities and logging capabilities\nare distinct and separated.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.288176	2025-06-13 09:08:46.288176	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-6,AC-3(7),AC-6(4),AC-6(8),IA-5,IA-5(6),IA-8,IA-8(4)}	{3.6.1,3.7.6,6.5.3,6.5.4,7.2.1,7.2.2,10.3.1}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
414	IAM-10	Management of Privileged Access Roles	Define and implement an access process to ensure privileged access\nroles and rights are granted for a time limited period, and implement procedures\nto prevent the culmination of segregated privileged access.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.320479	2025-06-13 09:08:46.320479	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-2,AC-2(7),AC-3,AC-3(4),AC-3(11),AC-3(13),AC-3(14),AC-6,AC-6(4),AC-6(5),AC-6(8),AC-12,AC-12(3),AC-17,AC-17(4),IA-8,IA-8(4)}	{7.2.1,7.2.2}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
415	IAM-11	CSCs Approval for Agreed Privileged Access Roles	Define, implement and evaluate processes and procedures for customers\nto participate, where applicable, in the granting of access for agreed, high\nrisk (as defined by the organizational risk assessment) privileged access roles.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.352754	2025-06-13 09:08:46.352754	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-6,AC-6(4),AC-6(6),AU-10,AU-10(4),CA-6,CA-6(2),IA-2,IA-2(1),IA-2(2),IA-2(12),IA-12,IA-12(2),IA-12(4)}	{7.2.3}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
416	IAM-12	Safeguard Logs Integrity	Define, implement and evaluate processes, procedures and technical\nmeasures to ensure the logging infrastructure is read-only for all with write\naccess, including privileged access roles, and that the ability to disable it\nis controlled through a procedure that ensures the segregation of duties and\nbreak glass procedures.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.385774	2025-06-13 09:08:46.385774	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-2,AC-2(11),AC-2(12),IA-8,IA-8(4),SA-8,SA-8(22),SC-34,SC-34(1),SC-34(2),SC-36,SI-4,SI-4(5)}	{10.3.1,10.3.2,10.3.3,10.3.4}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
417	IAM-13	Uniquely Identifiable Users	Define, implement and evaluate processes, procedures and technical\nmeasures that ensure users are identifiable through unique IDs or which can\nassociate individuals to the usage of user IDs.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.417888	2025-06-13 09:08:46.417888	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-3,AC-3(14),AC-24,AC-24(2),AU-10,AU-10(1),IA-2,IA-2(1),IA-2(2),IA-2(12),IA-4,IA-4(1),SA-8,SA-8(22),SC-23,SC-23(3),SC-40(4)}	{8.2.1,8.2.2,8.2.4}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
418	IAM-14	Strong Authentication	Define, implement and evaluate processes, procedures and technical\nmeasures for authenticating access to systems, application and data assets,\nincluding multifactor authentication for at least privileged user and sensitive\ndata access. Adopt digital certificates or alternatives which achieve an equivalent\nlevel of security for system identities.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.451116	2025-06-13 09:08:46.451116	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-6,AC-6(5),AC-7,AC-7(4),AU-10,AU-10(2),IA-2,IA-2(1),IA-2(2),IA-2(8),IA-2(12),IA-3,IA-3(1),IA-5,IA-5(2),IA-5(7),IA-5(9),IA-5(10),IA-5(12),IA-5(14)-(16),IA-8,IA-8(1),IA-8(6),SC-23,SC-23(3)}	{7.2.1,8.3.1,8.3.2,8.4.1,8.4.2,8.4.3}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
419	IAM-15	Passwords Management	Define, implement and evaluate processes, procedures and technical\nmeasures for the secure management of passwords.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.483728	2025-06-13 09:08:46.483728	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{IA-4,IA-4(8),IA-5,IA-5(1),IA-5(8),IA-5(18)}	{2.2.2,2.3.1,8.3.5,8.3.6,8.3.7,8.3.8,8.3.9,8.3.10,8.3.10.1,8.6.2}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
420	IAM-16	Authorization Mechanisms	Define, implement and evaluate processes, procedures and technical\nmeasures to verify access to data and system functions is authorized.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Identity & Access Management	{}	{}	2025-06-13 09:08:46.516306	2025-06-13 09:08:46.516306	\N	\N	\N	\N	\N	\N	\N	CCM	IAM	{AC-3,AC-3(5),AC-4,AC-4(17),AC-4(21),AC-4(22),AC-6,AC-6(8),AC-6(9),AC-12,AC-12(1),AC-20,AC-20(1),AU-10,AU-10(1),AU-10(2),IA-2,IA-2(1),IA-2(2),IA-2(12),IA-3,IA-3(1),IA-5(1),IA-5(2),IA-5(5),IA-5(8),IA-5(10),IA-5(12),IA-8,IA-8(1),IA-8(2)}	{7.2.4,7.2.3,7.2.5.1}	{5.1,5.2,5.3,6.1,6.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
421	IPY-01	Interoperability and Portability Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for interoperability and portability including\nrequirements for:\na. Communications between application interfaces\nb. Information processing interoperability\nc. Application development portability\nd. Information/Data exchange, usage, portability, integrity, and persistence\nReview and update the policies and procedures at least annually.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Interoperability & Portability	{}	{}	2025-06-13 09:08:46.550006	2025-06-13 09:08:46.550006	\N	\N	\N	\N	\N	\N	\N	CCM	IPY	{PT-2,PT-2(1),PT-3,PT-3(1),SC-1,SA-8,SA-8(8),SC-27,SC-29,SC-29(1)}	{12.1.1,12.1.2}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
422	IPY-02	Application Interface Availability	Provide application interface(s) to CSCs so that they programmatically\nretrieve their data to enable interoperability and portability.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Interoperability & Portability	{}	{}	2025-06-13 09:08:46.582664	2025-06-13 09:08:46.582664	\N	\N	\N	\N	\N	\N	\N	CCM	IPY	{CM-13,PT-2,PT-2(1),PT-2(2),PT-3,PT-3(1),PT-3(2),SA-8,SA-8(20)}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
423	IPY-03	Secure Interoperability and Portability Management	Implement cryptographically secure and standardized network protocols\nfor the management, import and export of data.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Interoperability & Portability	{}	{}	2025-06-13 09:08:46.621567	2025-06-13 09:08:46.621567	\N	\N	\N	\N	\N	\N	\N	CCM	IPY	{PT-2,PT-2(2),SA-4,SC-16,SC-16(3)}	{1.2.1,1.2.5,1.2.6,2.2.4,2.2.5,2.2.7,4.2.1}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
424	IPY-04	Data Portability Contractual Obligations	Agreements must include provisions specifying CSCs access to data\nupon contract termination and will include:\na. Data format\nb. Length of time the data will be stored\nc. Scope of the data retained and made available to the CSCs\nd. Data deletion policy	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Interoperability & Portability	{}	{}	2025-06-13 09:08:46.653854	2025-06-13 09:08:46.653854	\N	\N	\N	\N	\N	\N	\N	CCM	IPY	{PT-2,PT-2(1),PT-3,PT-3(1),PT-4(3),SA-4,SA-4(11),SA-4(12),SI-12,SI-12(3)}	{12.8.2}	{}	Partial Gap	Recommend adding the full V4 control specification to the NIST 800-53r5 addendum.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
425	IVS-01	Infrastructure and Virtualization Security Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for infrastructure and virtualization security. Review\nand update the policies and procedures at least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.686625	2025-06-13 09:08:46.686625	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{AC-1,CM-1,IA-1,RA-1,SA-1,SC-1,SI-1,SC-46,SC-49,SC-50}	{12.1.1,12.1.2,2.1.1,2.2.1}	{4.1,4.2}	Partial Gap	Missing specification(s) in NIST 800-53:\n'policies and procedures for virtualization security'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
426	IVS-02	Capacity and Resource Planning	Plan and monitor the availability, quality, and adequate capacity\nof resources in order to deliver the required system performance as determined\nby the business.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.719295	2025-06-13 09:08:46.719295	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{CP-2,CP-2(2),SC-5,SC-5(2),SC-4,SI-4}	{"No Mapping"}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
427	IVS-03	Network Security	Monitor, encrypt and restrict communications between environments\nto only authenticated and authorized connections, as justified by the business.\nReview these configurations at least annually, and support them by a documented\njustification of all allowed services, protocols, ports, and compensating controls.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.752791	2025-06-13 09:08:46.752791	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{SC-1,SC-4,SC-7,SC-7(4),SC-7(5),SC-7(8),SC-7(9),SC-7(11),SC-8,SC-8(1),SC-11,SC-12,SC-16,SC-23,SC-29,SC-29(1)}	{1.2.5,1.2.6,1.2.7,1.4.2,2.2.4,2.2.5,2.2.7,4.2.1,10.1.1}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
436	LOG-03	Security Monitoring and Alerting	Identify and monitor security-related events within applications\nand the underlying infrastructure. Define and implement a system to generate\nalerts to responsible stakeholders based on such events and corresponding metrics.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.045019	2025-06-13 09:08:47.045019	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-5,AU-5(2),AU-13}	{10.2.1,10.2.2,10.4.1.1,10.4.2.1,10.4.3}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
428	IVS-04	OS Hardening and Base Controls	Harden host and guest OS, hypervisor or infrastructure control plane\naccording to their respective best practices, and supported by technical controls,\nas part of a security baseline.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.785435	2025-06-13 09:08:46.785435	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{CM-6,CM-6(1),SC-29,SC-29(1),SC-2,SC-7,SC-7(12),SC-30,SC-34,SC-35,SC-39,SC-44}	{2.2.1}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
429	IVS-05	Production and Non-Production Environments	Separate production and non-production environments.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.8177	2025-06-13 09:08:46.8177	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{CM-2,CM-2(6),CM-5,CM-5(5),SA-3,SA-3(1),SA-8,SA-8(1),SA-8(2),SA-8(3),SA-8(6),SC-3,SC-3(2)}	{6.5.3,6.5.4}	{4.1,4.2}	No Gap	N/A	{"Phys":false,"Network":false,"Compute":false,"Storage":false,"App":true,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
430	IVS-06	Segmentation and Segregation	Design, develop, deploy and configure applications and infrastructures\nsuch that CSP and CSC (tenant) user access and intra-tenant access is appropriately\nsegmented and segregated, monitored and restricted from other tenants.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.849983	2025-06-13 09:08:46.849983	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{SC-3,SC-7,SC-7(20)}	{A1.1.1,A1.1.2,A1.1.3}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":false,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
431	IVS-07	Migration to Cloud Environments	Use secure and encrypted communication channels when migrating servers,\nservices, applications, or data to cloud environments. Such channels must include\nonly up-to-date and approved protocols.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.882317	2025-06-13 09:08:46.882317	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{AC-17,AC-20,SC-7,SC-7(28),SC-8,SC-8(1),SC-12,SC-23,SC-29,SI-7,SI-7(1)-(3),SI-7(5)-(10),SI-7(12)}	{4.2.1}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
432	IVS-08	Network Architecture Documentation	Identify and document high-risk environments.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.91526	2025-06-13 09:08:46.91526	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{PL-8,PL-8(1),SA-8,SA-8(3),SA-8(17)}	{1.2.3}	{4.1,4.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":false}	{"Cybersecurity":false,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
433	IVS-09	Network Defense	Define, implement and evaluate processes, procedures and defense-in-depth\ntechniques for protection, detection, and timely response to network-based attacks.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Infrastructure & Virtualization Security	{}	{}	2025-06-13 09:08:46.947534	2025-06-13 09:08:46.947534	\N	\N	\N	\N	\N	\N	\N	CCM	IVS	{PL-8,PL-8(1),SC-5,SC-5(1),SC-5(3),SC-7,SC-7(13)}	{1.1.1,1.3.1,1.3.2,1.3.3,1.4.1,1.4.2,1.4.3,1.4.4,1.4.5,1.5.1,12.10.1}	{4.1,4.2}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":false,"Storage":false,"App":false,"Data":false}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
434	LOG-01	Logging and Monitoring Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for logging and monitoring. Review and update the policies\nand procedures at least annually.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:46.980163	2025-06-13 09:08:46.980163	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-1}	{12.1.1,12.1.2,10.1.1,10.4.1,10.4.2,10.4.3,10.5.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
435	LOG-02	Audit Logs Protection	Define, implement and evaluate processes, procedures and technical\nmeasures to ensure the security and retention of audit logs.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.012584	2025-06-13 09:08:47.012584	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-4,AU-11}	{10.3.1,10.3.2,10.3.3,10.3.4,10.5.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
437	LOG-04	Audit Logs Access and Accountability	Restrict audit logs access to authorized personnel and maintain records\nthat provide unique access accountability.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.080268	2025-06-13 09:08:47.080268	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-9,AU-9(4),AU-9(6),AU-10}	{10.2.1.3,10.3.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
438	LOG-05	Audit Logs Monitoring and Response	Monitor security audit logs to detect activity outside of typical\nor expected patterns. Establish and follow a defined process to review and take\nappropriate and timely actions on detected anomalies.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.112574	2025-06-13 09:08:47.112574	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-6,AU-6(1),AU-6(5)}	{10.4.1.1,10.4.2.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
439	LOG-06	Clock Synchronization	Use a reliable time source across all relevant information processing\nsystems.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.144866	2025-06-13 09:08:47.144866	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-8}	{10.6.1,10.6.2,10.6.3}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
440	LOG-07	Logging Scope	Establish, document and implement which information meta/data system\nevents should be logged. Review and update the scope at least annually or whenever\nthere is a change in the threat environment.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.176979	2025-06-13 09:08:47.176979	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-1,AU-14,AU-16}	{10.2.1,10.2.2}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
441	LOG-08	Log Records	Generate audit records containing relevant security information.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.209905	2025-06-13 09:08:47.209905	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-3,AU-3(1),AU-3(3),AU-6,AU-6(8),AU-12,AU-12(1),AU-12(2),AU-12(3)}	{10.2.2}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
442	LOG-09	Log Protection	The information system protects audit records from unauthorized access,\nmodification, and deletion.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.242321	2025-06-13 09:08:47.242321	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-9,AU-9(2),AU-9(3),AU-9(4),AU-12(3),AU-12(3)}	{10.3.1,10.3.2,10.3.3,10.3.4}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
443	LOG-10	Encryption Monitoring and Reporting	Establish and maintain a monitoring and internal reporting capability\nover the operations of cryptographic, encryption and key management policies,\nprocesses, procedures, and controls.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.27485	2025-06-13 09:08:47.27485	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-1,AU-9,AU-9(3)}	{10.1.1,10.2.1,10.4.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
444	LOG-11	Transaction/Activity Logging	Log and monitor key lifecycle management events to enable auditing\nand reporting on usage of cryptographic keys.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.30709	2025-06-13 09:08:47.30709	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-9,AU-9(3)}	{"No Mapping"}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
445	LOG-12	Access Control Logs	Monitor and log physical access using an auditable access control\nsystem.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.339198	2025-06-13 09:08:47.339198	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-6,AU-6(6),AU-14}	{9.2.1.1}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
446	LOG-13	Failures and Anomalies Reporting	Define, implement and evaluate processes, procedures and technical\nmeasures for the reporting of anomalies and failures of the monitoring system\nand provide immediate notification to the accountable party.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Logging and Monitoring	{}	{}	2025-06-13 09:08:47.371426	2025-06-13 09:08:47.371426	\N	\N	\N	\N	\N	\N	\N	CCM	LOG	{AU-5,AU-5(2),AU-6,AU-6(3),AU-6(4),AU-6(5),AU-16}	{10.4.3,10.7.1,10.7.2,10.7.3}	{8.1,8.2,8.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
447	SEF-01	Security Incident Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for Security Incident Management, E-Discovery, and Cloud\nForensics. Review and update the policies and procedures at least annually.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.404117	2025-06-13 09:08:47.404117	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{IR-1,IR-2,IR-2(1),IR-4,IR-4(12),IR-4(14),PM-1,PM-12}	{12.1.1,12.1.2,12.10.1,12.10.2,12.10.6,12.10.7}	{17.1,17.2}	Partial Gap	Missing specification(s) in NIST 800-53:\n'policies and procedures for E-Discovery'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
448	SEF-02	Service Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the timely management of security incidents. Review\nand update the policies and procedures at least annually.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.436712	2025-06-13 09:08:47.436712	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{PM-1,PM-6,IR-4,IR-4(6),IR-4(9),IR-4(14)}	{12.1.1,12.1.2,12.10.1,12.10.2,12.10.3,12.10.6}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
449	SEF-03	Incident Response Plans	'Establish, document, approve, communicate, apply, evaluate and maintain\na security incident response plan, which includes but is not limited to: relevant\ninternal departments, impacted CSCs, and other business critical relationships\n(such as supply-chain) that may be impacted.'	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.469236	2025-06-13 09:08:47.469236	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{IR-1,IR-2,IR-2(1)-(3),IR-3,IR-3(1)-(3),IR-4,IR-4(1)-(15),IR-5,IR-5(1),IR-6,IR-6(1)-(3),IR-7,IR-7(1),IR-7(2),IR-8,IR-8(1),IR-9,IR-9(1)-(4),PM-12}	{12.10.1,12.10.5}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
450	SEF-04	Incident Response Testing	Test and update as necessary incident response plans at planned intervals\nor upon significant organizational or environmental changes for effectiveness.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.502045	2025-06-13 09:08:47.502045	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{IR-2,IR-2(1)-(3),IR-3,IR-3(1)-(3),IR-8,IR-9,IR-9(2)}	{12.10.2,12.10.6}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
451	SEF-05	Incident Response Metrics	Establish and monitor information security incident metrics.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.534396	2025-06-13 09:08:47.534396	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{CA-7,CA-7(3),CA-7(4),IR-5,IR-4,IR-6,IR-6(2),IR-6(3),PM-6,PM-31}	{"No Mapping"}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
452	SEF-06	Event Triage Processes	Define, implement and evaluate processes, procedures and technical\nmeasures supporting business processes to triage security-related events.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.566889	2025-06-13 09:08:47.566889	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{CA-7,CA-7(3),CA-7(4),CA-7(5),CA-7(6),IR-4,IR-4(1),IR-4(3),IR-4(4)}	{12.10.1}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
453	SEF-07	Security Breach Notification	Define and implement, processes, procedures and technical measures\nfor security breach notifications. Report security breaches and assumed security\nbreaches including any relevant supply chain breaches, as per applicable SLAs,\nlaws and regulations.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.604009	2025-06-13 09:08:47.604009	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{AU-13,AU-13(1)-(3),IR-4,IR-4(15),IR-6,IR-6(1)-(3),PM-21,PM-23}	{12.10.1}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
454	SEF-08	Points of Contact Maintenance	Maintain points of contact for applicable regulation authorities,\nnational and local law enforcement, and other legal jurisdictional authorities.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Security Incident Management, E-Discovery, & Cloud Forensics	{}	{}	2025-06-13 09:08:47.635953	2025-06-13 09:08:47.635953	\N	\N	\N	\N	\N	\N	\N	CCM	SEF	{IR-4,IR-4(8),IR-6,IR-6(3),IR-7,IR-7(2),PM-21,PM-23,PM-26}	{12.10.1}	{17.1,17.2}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
455	STA-01	SSRM Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for the application of the Shared Security Responsibility\nModel (SSRM) within the organization. Review and update the policies and procedures\nat least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.668665	2025-06-13 09:08:47.668665	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SR-1,SR-2,SR-3,SR-5,SA-4,SA-4(1),SA-4(2),SA-4(5),SA-4(9),SA-4(10),PM-30}	{12.1.1,12.1.2,12.8.1,12.8.2,12.8.3,12.8.4,12.8.5}	{}	Partial Gap	Missing specification(s) in NIST 800-53:\n'policies and procedures for the application of the Shared Security Responsibility Model (SSRM) within the organization'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
456	STA-02	SSRM Supply Chain	Apply, document, implement and manage the SSRM throughout the supply\nchain for the cloud service offering.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.701102	2025-06-13 09:08:47.701102	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SR-1,SR-2,SR-3,SR-3(1)-(3),SR-5,PM-30}	{12.8.3,12.8.4,12.8.5}	{}	Partial Gap	Missing specification(s) in NIST 800-53:\n'SSRM'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
457	STA-03	SSRM Guidance	Provide SSRM Guidance to the CSC detailing information about the\nSSRM applicability throughout the supply chain.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.733513	2025-06-13 09:08:47.733513	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{"No Mapping"}	{12.8.5,12.9.1,12.9.2}	{}	Full Gap	The full V4 control specification is missing from NIST 800-53r5 and has to be used to close the gap.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
458	STA-04	SSRM Control Ownership	Delineate the shared ownership and applicability of all CSA CCM controls\naccording to the SSRM for the cloud service offering.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.766045	2025-06-13 09:08:47.766045	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{"No Mapping"}	{12.8.5}	{}	Full Gap	The full V4 control specification is missing from NIST 800-53r5 and has to be used to close the gap.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	CSP-Owned	{IaaS,PaaS,SaaS}
459	STA-05	SSRM Documentation Review	Review and validate SSRM documentation for all cloud services offerings\nthe organization uses.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.800177	2025-06-13 09:08:47.800177	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SR-1,SR-2,SR-3,SR-6,SR-6(1)}	{12.1.1,12.2.1,12.8.4,12.8.5}	{}	Partial Gap	Missing specification(s) in NIST 800-53:\n'SSRM'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
460	STA-06	SSRM Control Implementation	Implement, operate, and audit or assess the portions of the SSRM\nwhich the organization is responsible for.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.832608	2025-06-13 09:08:47.832608	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SA-4,SA-4(11),SR-1,SR-2,SR-3,SR-5,SR-6}	{12.8.5}	{}	Partial Gap	Missing specification(s) in NIST 800-53:\n'SSRM'.	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
461	STA-07	Supply Chain Inventory	Develop and maintain an inventory of all supply chain relationships.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.865282	2025-06-13 09:08:47.865282	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{CM-8,CM-8(4),SR-4,SR-4(1)-(4)}	{12.5.1,12.8.1}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
462	STA-08	Supply Chain Risk Management	CSPs periodically review risk factors associated with all organizations\nwithin their supply chain.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.897564	2025-06-13 09:08:47.897564	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SR-2,SR-2(1),SR-4,SR-5,SR-5(1),SR-5(2),SR-6}	{12.8.3,12.8.4}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
471	TVM-03	Vulnerability Remediation Schedule	Define, implement and evaluate processes, procedures and technical\nmeasures to enable both scheduled and emergency responses to vulnerability identifications,\nbased on the identified risk.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.19163	2025-06-13 09:08:48.19163	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{PM-31,RA-3,RA-3(1),RA-5,RA-5(2)-(4),RA-5(6),SI-3,SI-3(10)}	{6.1.1,6.3.1,6.3.2,6.3.3,12.10.1}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
463	STA-09	Primary Service and Contractual Agreement	Service agreements between CSPs and CSCs (tenants) must incorporate at least the following mutually-agreed upon provisions and/or terms:\n• Scope, characteristics and location of business relationship and services offered\n• Information security requirements (including SSRM)\n• Change management process\n• Logging and monitoring capability\n• Incident management and communication procedures\n• Right to audit and third party assessment\n• Service termination\n• Interoperability and portability requirements\n• Data privacy	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.929841	2025-06-13 09:08:47.929841	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SA-4,SA-4(1),SA-4(2),SA-4(5),SA-4(9),SA-4(10),SR-8}	{12.8.2,12.9.1,12.9.2}	{}	Partial Gap	Missing specification(s) in NIST 800-53:\n'Information security requirements (including SSRM)'	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
464	STA-10	Supply Chain Agreement Review	Review supply chain agreements between CSPs and CSCs at least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.963106	2025-06-13 09:08:47.963106	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{PM-30,PM-30(1),SR-2,SR-6}	{12.8.2,12.8.4}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
465	STA-11	Internal Compliance Testing	Define and implement a process for conducting internal assessments\nto confirm conformance and effectiveness of standards, policies, procedures,\nand service level agreement activities at least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:47.995798	2025-06-13 09:08:47.995798	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{PM-30,PM-30(1),SR-6,SR-6(1)}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":false,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
466	STA-12	Supply Chain Service Agreement Compliance	Implement policies requiring all CSPs throughout the supply chain\nto comply with information security, confidentiality, access control, privacy,\naudit, personnel policy and service level requirements and standards.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:48.028329	2025-06-13 09:08:48.028329	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SA-9,SA-9(5),SR-6}	{12.8.3,12.8.4}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
467	STA-13	Supply Chain Governance Review	Periodically review the organization's supply chain partners' IT\ngovernance policies and procedures.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:48.060421	2025-06-13 09:08:48.060421	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SA-9,SA-9(1)-(8),SR-2,SR-2(1)}	{12.8.3,12.8.4}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
468	STA-14	Supply Chain Data Security Assessment	Define and implement a process for conducting security assessments\nperiodically for all organizations within the supply chain.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Supply Chain Management, Transparency, and Accountability	{}	{}	2025-06-13 09:08:48.093258	2025-06-13 09:08:48.093258	\N	\N	\N	\N	\N	\N	\N	CCM	STA	{SA-9,SA-9(2),SR-4,SR-4(3),SR-6,SR-6(1),SR-7,SR-9,SR-9(1),SR-11,SR-11(1),SR-11(3),PM-23,PM-30}	{12.8.4}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":false,"Legal/Privacy":false,"GRC Team":false,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
469	TVM-01	Threat and Vulnerability Management Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures to identify, report and prioritize the remediation of\nvulnerabilities, in order to protect systems against vulnerability exploitation.\nReview and update the policies and procedures at least annually.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.126525	2025-06-13 09:08:48.126525	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{PM-16,PM-16(1),PM-31,RA-5,SA-11,SA-11(2),SA-11(5),SA-15,SA-15(5),SA-15(8)}	{12.1.1,12.1.2,6.1.1,6.3.1,6.3.2,6.3.3,11.3.1,11.3.2}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
470	TVM-02	Malware Protection Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures to protect against malware on managed assets. Review\nand update the policies and procedures at least annually.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.159144	2025-06-13 09:08:48.159144	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{RA-3,RA-3(3),RA-5,RA-5(3),RA-5(5),SI-3,SI-3(4),SI-3(10)}	{12.1.1,12.1.2,5.1.1,5.3.2.1}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
472	TVM-04	Detection Updates	Define, implement and evaluate processes, procedures and technical\nmeasures to update detection tools, threat signatures, and indicators of compromise\non a weekly, or more frequent basis.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.22373	2025-06-13 09:08:48.22373	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{CM-7,CM-7(4),RA-3,RA-3(3),RA-5(2),SA-10,SA-10(5),SA-11,SA-11(2),SI-2,SI-2(4),SI-3,SI-3(4),SI-4,SI-4(9),SI-4(24),SI-8,SI-8(2),SI-8(3)}	{5.3.1}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
473	TVM-05	External Library Vulnerabilities	Define, implement and evaluate processes, procedures and technical\nmeasures to identify updates for applications which use third party or open\nsource libraries according to the organization's vulnerability management policy.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.256825	2025-06-13 09:08:48.256825	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{RA-5,RA-5(3),SA-11,SA-11(2),SA-11(5)}	{6.3.1,6.3.2,6.3.3}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":true}	Shared	{IaaS,PaaS,SaaS}
474	TVM-06	Penetration Testing	Define, implement and evaluate processes, procedures and technical\nmeasures for the periodic performance of penetration testing by independent\nthird parties.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.289325	2025-06-13 09:08:48.289325	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{CA-8,CA-8(1)-(3),SA-11,SA-11(5)}	{11.4.1,11.4.2,11.4.3,11.4.4,11.4.5,11.4.6,11.4.7}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
475	TVM-07	Vulnerability Identification	Define, implement and evaluate processes, procedures and technical\nmeasures for the detection of vulnerabilities on organizationally managed assets\nat least monthly.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.32324	2025-06-13 09:08:48.32324	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{RA-5,RA-5(4),RA-5(5),SA-11,SA-11(5),SA-15(5),SC-7,SC-7(10),SI-3(8),SI-3(10),SI-7,SI-7(9)}	{6.3.1,6.3.2,6.3.3,11.3.2,11.3.2.1}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
476	TVM-08	Vulnerability Prioritization	Use a risk-based model for effective prioritization of vulnerability\nremediation using an industry recognized framework.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.356221	2025-06-13 09:08:48.356221	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{RA-2,RA-2(1),SA-11,SA-11(1),SA-15,SA-15(8),SI-2,SI-2(2),SI-3,SI-3(10)}	{11.3.1.1,11.3.1.3}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
477	TVM-09	Vulnerability Management Reporting	Define and implement a process for tracking and reporting vulnerability\nidentification and remediation activities that includes stakeholder notification.	detective	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.38853	2025-06-13 09:08:48.38853	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{RA-5,RA-5(8),RA-5(11),SA-15,SA-15(1)}	{6.3.1,6.3.2,6.6.6,11.3.1,11.3.1.1,11.3.1.3,11.3.2,11.3.2.1}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":false,"Architecture Team":true,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
478	TVM-10	Vulnerability Management Metrics	Establish, monitor and report metrics for vulnerability identification\nand remediation at defined intervals.	detective	technical	planned	6	0.00	0.00	f	CCM Domain: Threat & Vulnerability Management	{}	{}	2025-06-13 09:08:48.421047	2025-06-13 09:08:48.421047	\N	\N	\N	\N	\N	\N	\N	CCM	TVM	{PM-31,RA-5,RA-5(6),RA-5(8),RA-5(10),SA-15,SA-15(1),SI-2,SI-2(3)}	{"No Mapping"}	{7.1,7.2,7.3}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":false,"SW Development":false,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":true}	Shared	{IaaS,PaaS,SaaS}
479	UEM-01	Endpoint Devices Policy and Procedures	Establish, document, approve, communicate, apply, evaluate and maintain\npolicies and procedures for all endpoints. Review and update the policies and\nprocedures at least annually.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.454162	2025-06-13 09:08:48.454162	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{CM-1,CM-11,AC-19}	{12.1.1,12.1.2,2.1.1,2.2.1,12.2.1}	{}	No Gap	N/A	{"Phys":true,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
480	UEM-02	Application and Service Approval	Define, document, apply and evaluate a list of approved services,\napplications and sources of applications (stores) acceptable for use by endpoints\nwhen accessing or storing organization-managed data.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.486205	2025-06-13 09:08:48.486205	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{CM-7,CM-7(6),CM-8(3),CM-11,SC-18,SC-18(2),SC-18(3)}	{2.2.4,2.2.5,12.2.1}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":false,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
481	UEM-03	Compatibility	Define and implement a process for the validation of the endpoint\ndevice's compatibility with operating systems and applications.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.51898	2025-06-13 09:08:48.51898	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{AC-19,CM-1,CM-2,CM-2(2),CM-6,CM-8(3),SI-7}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
482	UEM-04	Endpoint Inventory	Maintain an inventory of all endpoints used to store and access company\ndata.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.551118	2025-06-13 09:08:48.551118	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{CM-8,CM-8(7)}	{12.2.1,12.5.1}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
483	UEM-05	Endpoint Management	Define, implement and evaluate processes, procedures and technical\nmeasures to enforce policies and controls for all endpoints permitted to access\nsystems and/or store, transmit, or process organizational data.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.583242	2025-06-13 09:08:48.583242	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{AU-6,AC-19,AC-24,CM-2,CM-2(2),CM-8(3),SC-1}	{2.1.1,2.2.1,12.2.1}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
484	UEM-06	Automatic Lock Screen	Configure all relevant interactive-use endpoints to require an automatic\nlock screen.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.615577	2025-06-13 09:08:48.615577	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{AC-11,AC-11(1)}	{8.2.8}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
485	UEM-07	Operating Systems	Manage changes to endpoint operating systems, patch levels, and/or\napplications through the company's change management processes.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.647924	2025-06-13 09:08:48.647924	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{CM-1,CM-3,CM-4,CM-8,CM-8(3),CM-9,CM-9(1),CM-11,SI-7}	{6.5.1,6.3.3}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":false}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":true,"HR":false}	Shared	{IaaS,PaaS,SaaS}
486	UEM-08	Storage Encryption	Protect information from unauthorized disclosure on managed endpoint\ndevices with storage encryption.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.680011	2025-06-13 09:08:48.680011	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{AC-19(5),SC-28,SC-28(1)}	{3.5.1,3.6}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
487	UEM-09	Anti-Malware Detection and Prevention	Configure managed endpoints with anti-malware detection and prevention\ntechnology and services.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.711934	2025-06-13 09:08:48.711934	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{IR-1,SI-17,SI-7(17)}	{5.2.1}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
488	UEM-10	Software Firewall	Configure managed endpoints with properly configured software firewalls.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.743869	2025-06-13 09:08:48.743869	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{SC-7,SC-7(12),SC-7(17)}	{1.5.1}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
489	UEM-11	Data Loss Prevention	Configure managed endpoints with Data Loss Prevention (DLP) technologies\nand rules in accordance with a risk assessment.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.776607	2025-06-13 09:08:48.776607	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{SC-7,SC-7(10)}	{A3.2.6}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
491	UEM-13	Remote Wipe	Define, implement and evaluate processes, procedures and technical\nmeasures to enable the deletion of company data remotely on managed endpoint\ndevices.	preventive	technical	fully_implemented	7.5	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.841668	2025-06-13 09:08:48.841668	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{AC-7,AC-7(2),MP-6,MP-6(8)}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":false,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
492	UEM-14	Third-Party Endpoint Security Posture	Define, implement and evaluate processes, procedures and technical\nand/or contractual measures to maintain proper security of third-party endpoints\nwith access to organizational assets.	preventive	technical	planned	6	0.00	0.00	f	CCM Domain: Universal Endpoint Management	{}	{}	2025-06-13 09:08:48.874171	2025-06-13 09:08:48.874171	\N	\N	\N	\N	\N	\N	\N	CCM	UEM	{SR-5,SR-5(2),SR-6,SR-6(1)}	{"No Mapping"}	{}	No Gap	N/A	{"Phys":false,"Network":true,"Compute":true,"Storage":true,"App":true,"Data":true}	{"Cybersecurity":true,"Internal Audit":true,"Architecture Team":true,"SW Development":true,"Operations":true,"Legal/Privacy":true,"GRC Team":true,"Supply Chain Management":false,"HR":false}	Shared	{IaaS,PaaS,SaaS}
\.


--
-- Data for Name: controls; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.controls (id, control_id, name, description, associated_risks, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, notes, created_at, updated_at, cost_per_agent, is_per_agent_pricing, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, compliance_framework) FROM stdin;
29	3.11-7203	Encrypt Sensitive Data at Rest	Use server-side or client-side encryption on storage.	{53}	preventive	technical	fully_implemented	7.40	10.00		2025-06-10 23:22:37.219441	2025-06-10 23:22:37.219441	0.00	f	54	instance	\N	53	\N	0	CIS
28	10.2-2530	Deploy Anti-Malware/EDR on All End-Points	Install agents enterprise-wide.	{52}	preventive	technical	fully_implemented	7.70	0.00		2025-06-10 23:05:22.54647	2025-06-10 23:05:22.54647	20.00	t	107	instance	\N	52	\N	0	CIS
31	UEM-12-2208	Remote Locate	Enable remote geo-location capabilities for all managed mobile endpoints.	{53}	preventive	technical	not_implemented	6.00	0.00	CCM Domain: Universal Endpoint Management	2025-06-13 09:26:02.228625	2025-06-13 09:26:02.228625	0.00	f	490	instance	\N	53	\N	0	CIS
32	TEST-001	Test Control with FAIR Fields	Testing all database fields	{}	preventive	technical	planned	5.50	1000.00		2025-06-13 09:39:48.229225	2025-06-13 09:39:48.229225	0.00	f	\N	instance	\N	\N	\N	0	CIS
33	FAIR-TEST-002	FAIR Control Test with All Fields	Testing complete FAIR methodology field mapping	{}	preventive	technical	planned	7.20	2500.00		2025-06-13 09:40:44.191168	2025-06-13 09:40:44.191168	0.00	f	\N	instance	\N	\N	\N	0	CIS
34	FAIR-COMPLETE-003	Complete FAIR Schema Test Control	Testing all database fields with updated schema	{}	preventive	technical	planned	8.50	5000.00		2025-06-13 09:42:11.258644	2025-06-13 09:42:11.258644	25.50	t	\N	instance	\N	\N	\N	150	CIS
35	FAIR-DEBUG-004	Debug FAIR Fields Test	Testing with enhanced logging	{}	preventive	technical	planned	7.00	3000.00		2025-06-13 09:42:39.502827	2025-06-13 09:42:39.502827	0.00	f	\N	instance	\N	\N	\N	0	CIS
36	CLEAN-TEST-005	Clean Control Test	Testing control without FAIR effectiveness fields	{}	preventive	technical	planned	8.00	2500.00		2025-06-13 10:02:34.616137	2025-06-13 10:02:34.616137	0.00	f	\N	instance	\N	\N	\N	0	CIS
37	FINAL-TEST-006	Final Clean Control	Control without FAIR effectiveness fields	{}	preventive	technical	planned	7.50	1500.00		2025-06-13 10:03:04.627015	2025-06-13 10:03:04.627015	0.00	f	\N	instance	\N	\N	\N	0	CIS
\.


--
-- Data for Name: cost_modules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cost_modules (id, name, cis_control, cost_factor, cost_type, description, created_at) FROM stdin;
1	Breach Investigation	{7,7.1,7.2}	10000	fixed	Fixed cost for conducting a breach investigation	2025-05-18 08:06:57.349881
2	Breach Notification	{13,13.1,13.2}	5	per_event	Cost per affected record for notification	2025-05-18 08:06:57.349881
4	Legal Consultation	{17,17.1,17.2}	350	per_hour	Legal consultation costs per hour	2025-05-18 08:06:57.349881
6	Lost Productivity	{8,8.1,8.2}	0.15	percentage	Percentage of total loss from lost productivity	2025-05-18 08:06:57.349881
7	Reputation Damage	{4,14,14.1}	0.2	percentage	Percentage of total loss from reputation damage	2025-05-18 08:06:57.349881
8	Customer Loss	{5,15,15.1}	0.25	percentage	Percentage of total loss from customer churn	2025-05-18 08:06:57.349881
9	Incident Response Team	{10,10.1,10.2}	15000	fixed	Cost for incident response team deployment	2025-05-18 08:06:57.349881
10	Forensic Services	{12,12.1,12.2}	20000	fixed	Cost for forensic analysis services	2025-05-18 08:06:57.349881
5	Regulatory Fines	{2,2.1,2.2}	0.06	percentage	Percentage of total loss for regulatory fines	2025-05-18 08:06:57.349881
3	System Recovery	{11,11.1,11.2}	5000	fixed	Fixed cost for system recovery after breach	2025-05-18 08:06:57.349881
\.


--
-- Data for Name: enterprise_architecture; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.enterprise_architecture (id, asset_id, name, description, level, type, architecture_domain, parent_id, created_at, updated_at) FROM stdin;
1	SC-902	Information Security		L1	strategic_capability	Information Security	\N	2025-05-21 12:05:15.850044	2025-05-21 12:05:15.850044
2	VC-401	Cyber Defense Department		L2	value_capability	Information Security	1	2025-05-21 12:05:39.764466	2025-05-21 12:05:39.764466
3	BS-609	Threat Detection & Monitoring		L3	business_service	Information Security	2	2025-05-21 12:06:32.31958	2025-05-21 12:06:32.31958
\.


--
-- Data for Name: legal_entities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.legal_entities (id, entity_id, name, description, parent_entity_id, created_at) FROM stdin;
3	ENT-003	Company Group			2025-05-04 17:49:40.227684
1	ENT-001	Company X Emea		ENT-003	2025-05-04 17:32:30.066449
2	ENT-002	Company Y US		ENT-003	2025-05-04 17:49:19.248602
4	ENT-004	another-company	0	ENT-001	2025-05-06 20:58:23.472788
11	ENT-005	group-entity			2025-06-12 11:40:54.574724
\.


--
-- Data for Name: risk_library; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risk_library (id, risk_id, name, description, threat_community, vulnerability, risk_category, severity, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, recommended_controls, created_at, updated_at) FROM stdin;
1	RISK-ORPHANED-ACCOUN-276-TPL	Orphaned accounts, excessive privileges	Risk of orphaned accounts, excessive privileges incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	69	medium	0.01	0.3	0.1	high	3	5	8	high	2	4	9	high	1.0561117e+07	3.168335e+07	6.33667e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
2	RISK-LACK-OF-VISIBIL-973-TPL	Lack of visibility, undetected breaches	Risk of lack of visibility, undetected breaches incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	1.5061117e+07	4.5183352e+07	9.0366704e+07	medium	0.1	0.3	0.5	medium	5000	10000	1.1e+06	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
3	RISK-UNKNOWN-VULNERA-913-TPL	Unknown vulnerabilities	Risk of unknown vulnerabilities incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	5e+06	1.5e+07	3e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
4	RISK-EXPLOITED-SOFTW-277-TPL	Exploited software flaws	Risk of exploited software flaws incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	4	6	10	medium	4	6	10	high	9.5e+06	2.85e+07	5.7e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
6	RISK-UNSEGMENTED-NET-571-TPL	Unsegmented network, rogue devices	Risk of unsegmented network, rogue devices incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	10000	50000	200000	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
7	RISK-THIRD-PARTY-RIS-177-TPL	Third-party risk, vendor compromise	Risk of third-party risk, vendor compromise incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	9	medium	2	4	8	medium	10000	50000	200000	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
8	RISK-UNMANAGED-DEVIC-414-TPL	Unmanaged devices, shadow IT	Risk of unmanaged devices, shadow it incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	9.5e+06	2.85e+07	5.7e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
9	RISK-UNAUTHORIZED-SO-757-TPL	Unauthorized software, unpatched vulnerabilities	Risk of unauthorized software, unpatched vulnerabilities incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	100000	5e+06	2e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
10	RISK-PHISHING-ATTACK-407-TPL	Phishing attacks, malware delivery	Risk of phishing attacks, malware delivery incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	65	medium	0.1	0.3	0.5	medium	3	5	8	medium	2	4	6	medium	1.5561117e+07	4.6683352e+07	9.3366704e+07	medium	0.1	0.3	0.5	medium	158879	294393	1.1e+07	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
11	RISK-UNCOORDINATED-R-583-TPL	Uncoordinated response, delayed recovery	Risk of uncoordinated response, delayed recovery incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	4.5e+06	1.35e+07	2.7e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
12	RISK-INSECURE-SOFTWA-165-TPL	Insecure software, OWASP Top 10	Risk of insecure software, owasp top 10 incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	10000	50000	200000	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
13	RISK-PHISHING--SOCIA-698-TPL	Phishing, social engineering	Risk of phishing, social engineering incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	10000	50000	200000	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
14	RISK-DATA-LEAKAGE--U-151-TPL	Test Risk	Risk of data leakage, unauthorized access incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	8	8	1e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
15	RISK-UNAUTHORIZED-AC-969-TPL	Unauthorized access, privilege escalation	Risk of unauthorized access, privilege escalation incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	medium	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	202797	384615	1e+07	medium	0.1	0.3	0.5	medium	5000	25000	100000	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
16	RISK-MISCONFIGURATIO-345-TPL	Misconfigurations, default credentials	Risk of misconfigurations, default credentials incidents affecting enterprise assets and data.	External Threat Actor	System Vulnerability	operational	high	12	24	48	medium	0.1	0.3	0.5	medium	3	5	7	medium	2	4	6	medium	10000	50000	2e+07	medium	0.1	0.3	0.5	medium	5000	25000	1e+07	medium	{}	2025-05-15 11:42:04.947472	2025-05-15 11:42:04.947472
18	TPL-RANSOMWARE-001	Ransomware Attack Template	Template for ransomware attacks on enterprise systems	External Threat Actor	System Vulnerability	operational	high	12	24	48	medium	0.1	0.3	0.5	medium	3	5	9	medium	2	4	8	medium	100000	500000	2e+06	medium	0	0	0	Medium	0	0	0	Medium	{}	2025-05-18 11:10:03.766034	2025-05-18 11:10:03.766034
19	TPL-PHISHING-001	Phishing Campaign Template	Template for targeted phishing campaigns against employees	External Threat Actor	Social Engineering	operational	medium	24	52	104	medium	0.2	0.4	0.6	medium	2	4	7	medium	3	5	8	medium	50000	200000	750000	medium	0	0	0	Medium	0	0	0	Medium	{}	2025-05-18 11:10:03.766034	2025-05-18 11:10:03.766034
20	TPL-DATA-BREACH-001	Data Breach Template	Template for data breaches exposing sensitive customer information	External Threat Actor	Inadequate Access Controls	compliance	critical	6	12	24	medium	0.3	0.5	0.8	medium	5	7	10	medium	3	5	7	medium	500000	2e+06	5e+06	medium	0	0	0	Medium	0	0	0	Medium	{}	2025-05-18 11:10:03.766034	2025-05-18 11:10:03.766034
21	TPL-INSIDER-THREAT-001	Insider Threat Template	Template for malicious insider activities including data theft and sabotage	Internal Threat Actor	Excessive Privileges	operational	high	2	4	8	medium	0.05	0.1	0.2	medium	6	8	10	medium	3	5	7	medium	250000	750000	2e+06	medium	0	0	0	Medium	0	0	0	Medium	{}	2025-05-18 11:10:03.766034	2025-05-18 11:10:03.766034
22	TPL-SUPPLY-CHAIN-001	Supply Chain Attack Template	Template for attacks targeting the organization supply chain or vendors	External Threat Actor	Third-Party Security	operational	high	4	8	16	medium	0.1	0.2	0.4	medium	7	8	10	medium	2	4	6	medium	300000	1e+06	3e+06	medium	0	0	0	Medium	0	0	0	Medium	{}	2025-05-18 11:10:03.766034	2025-05-18 11:10:03.766034
23	RL-DATA-BREACH-001	Data breach of customer PII	Unauthorized access to personally identifiable information	External cybercriminals	Insufficient access controls	operational	critical	2	5	12	medium	0.1	0.3	0.5	medium	0.5	0.7	0.85	high	0.3	0.5	0.7	medium	500000	2e+06	5e+06	medium	0.3	0.6	0.9	medium	100000	500000	1.5e+06	medium	{1.1,3.6,5.4,10.2}	2025-05-18 11:24:14.702727	2025-05-18 11:24:14.702727
24	RL-RANSOMWARE-002	Ransomware attack	Malicious encryption of systems for ransom	Organized cybercrime	Unpatched systems and social engineering	operational	critical	1	3	8	medium	0.2	0.4	0.6	medium	0.6	0.8	0.9	high	0.4	0.6	0.8	medium	1e+06	3e+06	1e+07	medium	0.4	0.7	0.95	medium	500000	1e+06	3e+06	medium	{4.4,7.4,11.2,17.1}	2025-05-18 11:24:14.702727	2025-05-18 11:24:14.702727
25	RL-COMPLIANCE-003	Regulatory non-compliance	Failure to comply with data protection regulations	Regulatory authorities	Incomplete compliance program	compliance	high	1	2	4	high	0.3	0.5	0.7	high	0.7	0.85	0.95	high	0.3	0.5	0.7	medium	750000	2.5e+06	8e+06	medium	0.5	0.8	1	high	1e+06	3e+06	7e+06	high	{3.1,5.6,15.3,17.5}	2025-05-18 11:24:14.702727	2025-05-18 11:24:14.702727
26	RL-SUPPLY-CHAIN-004	Supply chain compromise	Security breach via third-party vendor or supplier	Nation-state actors	Inadequate third-party risk management	strategic	high	1	2	5	low	0.1	0.25	0.4	low	0.7	0.9	0.98	high	0.2	0.4	0.6	low	1e+06	5e+06	1.5e+07	low	0.6	0.85	1	medium	2e+06	8e+06	2e+07	low	{15.1,15.6,15.7}	2025-05-18 11:24:14.702727	2025-05-18 11:24:14.702727
27	RL-CREDENTIAL-005	Credential theft	Unauthorized acquisition of login credentials	Individual hackers	Weak password policies	operational	medium	10	50	100	high	0.3	0.6	0.8	medium	0.3	0.5	0.7	medium	0.4	0.6	0.8	medium	50000	200000	500000	medium	0.2	0.5	0.8	medium	25000	100000	300000	medium	{5.2,5.6,6.4,6.5}	2025-05-18 11:24:14.702727	2025-05-18 11:24:14.702727
\.


--
-- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risks (id, risk_id, name, description, associated_assets, threat_community, vulnerability, risk_category, severity, contact_frequency, probability_of_action, threat_event_frequency, threat_capability, resistance_strength, susceptibility, loss_event_frequency, primary_loss_magnitude, secondary_loss_event_frequency, secondary_loss_magnitude, probable_loss_magnitude, inherent_risk, residual_risk, rank_percentile, created_at, updated_at, contact_frequency_min, contact_frequency_avg, contact_frequency_max, contact_frequency_confidence, probability_of_action_min, probability_of_action_avg, probability_of_action_max, probability_of_action_confidence, threat_event_frequency_min, threat_event_frequency_avg, threat_event_frequency_max, threat_event_frequency_confidence, threat_capability_min, threat_capability_avg, threat_capability_max, threat_capability_confidence, resistance_strength_min, resistance_strength_avg, resistance_strength_max, resistance_strength_confidence, susceptibility_min, susceptibility_avg, susceptibility_max, susceptibility_confidence, loss_event_frequency_min, loss_event_frequency_avg, loss_event_frequency_max, loss_event_frequency_confidence, primary_loss_magnitude_min, primary_loss_magnitude_avg, primary_loss_magnitude_max, primary_loss_magnitude_confidence, secondary_loss_event_frequency_min, secondary_loss_event_frequency_avg, secondary_loss_event_frequency_max, secondary_loss_event_frequency_confidence, secondary_loss_magnitude_min, secondary_loss_magnitude_avg, secondary_loss_magnitude_max, secondary_loss_magnitude_confidence, loss_magnitude_min, loss_magnitude_avg, loss_magnitude_max, loss_magnitude_confidence, notes, library_item_id, item_type, vulnerability_ids, cis_controls, applicable_cost_modules, ale_p10, ale_p25, ale_p50, ale_p75, ale_p90, ale_p95, ale_p99, inherent_p10, inherent_p25, inherent_p50, inherent_p75, inherent_p90, inherent_p95, inherent_p99, residual_p10, residual_p25, residual_p50, residual_p75, residual_p90, residual_p95, residual_p99) FROM stdin;
52	RISK-RANSOMWARE-439	Ransomware Attack Template	Template for ransomware attacks on enterprise systems	{AST-002}	External Threat Actor	System Vulnerability	operational	high	0	0	0	0	0	0.00000000	0	0	0	0	0	50293905.98	30930752.17	0	2025-05-18 11:10:03.766	2025-05-18 11:10:03.766	12	24	48	medium	0.1	0.3	0.5	medium	1.2	0	24	medium	1	2	5	medium	10	10	10	medium	0	0	0	Medium	0	0	0	Medium	3000000.00	9000000.00	18000000.00	medium	0.1	0.5	1	medium	195000.00	555000.00	1095000.00	high	3195000.00	9555000.00	19095000.00	medium		18	instance	\N	{}	{}	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00
53	RISK-DATA-299	Data breach of customer PII	Unauthorized access to personally identifiable information	{AST-001}	External cybercriminals	Insufficient access controls	operational	critical	0	0	0	0	0	0.00000000	0	0	0	0	0	2771772.46	2258994.55	0	2025-05-18 11:24:14.702	2025-05-18 11:24:14.702	2	5	12	medium	0.1	0.3	0.5	medium	0.2	0	6	medium	0.5	0.7	0.85	high	10	10	10	medium	0	0	0	Medium	0	0	0	Medium	1000000.00	2500000.00	4000000.00	medium	0.3	0.6	0.9	medium	260005.00	650005.00	1040005.00	medium	1260005.00	3150005.00	5040005.00	medium		23	instance	\N	{}	{}	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00
54	RISK-CREDENTIAL-534	Credential theft	Unauthorized acquisition of login credentials	{AST-001}	Individual hackers	Weak password policies	operational	medium	0	0	0	0	0	0.00000000	0	0	0	0	0	13492236.02	13492236.02	0	2025-05-18 11:24:14.702	2025-05-18 11:24:14.702	10	50	100	high	0.3	0.6	0.8	medium	3	0	80	medium	0.3	0.5	0.7	medium	0.4	0.6	0.8	medium	0	0	0	Medium	0	0	0	Medium	250000.00	750000.00	1500000.00	medium	0.2	0.5	0.8	medium	25000.00	100000.00	300000.00	medium	255000.00	800000.00	1740000.00	medium		27	instance	\N	{}	{}	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00
\.


--
-- Data for Name: risk_responses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risk_responses (id, risk_id, response_type, justification, assigned_controls, transfer_method, avoidance_strategy, acceptance_reason, created_at, updated_at, cost_module_ids) FROM stdin;
\.


--
-- Data for Name: response_cost_modules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.response_cost_modules (id, response_id, cost_module_id, multiplier, created_at) FROM stdin;
\.


--
-- Data for Name: risk_controls; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risk_controls (id, risk_id, control_id, effectiveness, notes, created_at, updated_at) FROM stdin;
4	52	28	0		2025-06-10 23:05:22.78189	2025-06-10 23:05:22.78189
5	53	29	0		2025-06-10 23:22:37.403271	2025-06-10 23:22:37.403271
6	53	31	0		2025-06-13 09:26:02.46496	2025-06-13 09:26:02.46496
\.


--
-- Data for Name: risk_costs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risk_costs (id, risk_id, cost_module_id, weight, created_at) FROM stdin;
13	52	9	9.5	2025-06-10 23:07:33.752071
14	52	5	0.4	2025-06-10 23:07:33.752071
18	53	2	10	2025-06-10 23:22:04.739918
19	53	5	0.4	2025-06-10 23:22:04.739918
20	53	7	2.4	2025-06-10 23:22:04.739918
\.


--
-- Data for Name: risk_summaries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.risk_summaries (id, year, month, legal_entity_id, tenth_percentile_exposure, most_likely_exposure, ninetieth_percentile_exposure, minimum_exposure, maximum_exposure, average_exposure, created_at, updated_at, total_risks, critical_risks, high_risks, medium_risks, low_risks, total_inherent_risk, total_residual_risk, mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure, exposure_curve_data, percentile_10_exposure, percentile_25_exposure, percentile_50_exposure, percentile_75_exposure, percentile_90_exposure, twenty_fifth_percentile_exposure, fiftieth_percentile_exposure, seventy_fifth_percentile_exposure) FROM stdin;
16	2025	5	\N	90000000	270000000	550000000	90000000	550000000	270000000	2025-05-18 14:33:47.852022	2025-05-18 14:33:47.852022	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
24	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:23:38.138	2025-05-18 18:23:38.155342	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
25	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:27:33.038	2025-05-18 18:27:33.054802	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
26	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:35:53.907	2025-05-18 18:35:53.926524	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
27	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:35:56.175	2025-05-18 18:35:56.190779	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
28	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:36:06.864	2025-05-18 18:36:06.879814	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
29	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:40:01.958	2025-05-18 18:40:01.973916	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
30	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:52:02.246	2025-05-18 18:52:02.262524	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
31	2025	5	\N	0	0	0	0	0	0	2025-05-18 18:58:06.595	2025-05-18 18:58:06.611794	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
32	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:01:40.633	2025-05-18 19:01:40.650194	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
33	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:04:17.468	2025-05-18 19:04:17.484638	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
34	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:04:19.322	2025-05-18 19:04:19.341423	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
35	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:04:25.265	2025-05-18 19:04:25.281103	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
36	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:04:32.706	2025-05-18 19:04:32.722343	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
37	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:46:42.507	2025-05-18 19:46:42.526861	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
38	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:48:36.513	2025-05-18 19:48:36.529348	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
39	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:50:54.215	2025-05-18 19:50:54.231625	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
40	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:53:34.394	2025-05-18 19:53:34.410525	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
41	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:53:47.072	2025-05-18 19:53:47.088488	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
42	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:54:02.839	2025-05-18 19:54:02.855971	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
43	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:54:27.68	2025-05-18 19:54:27.696574	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
44	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:54:43.152	2025-05-18 19:54:43.168556	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
45	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:55:02.735	2025-05-18 19:55:02.752698	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
46	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:56:57.781	2025-05-18 19:56:57.796955	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
47	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:58:53.923	2025-05-18 19:58:53.94749	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
48	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:59:15.279	2025-05-18 19:59:15.295606	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
49	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:59:40.512	2025-05-18 19:59:40.529486	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
50	2025	5	\N	0	0	0	0	0	0	2025-05-18 19:59:50.418	2025-05-18 19:59:50.434351	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
51	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:02:07.501	2025-05-18 20:02:07.5325	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
52	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:02:21.788	2025-05-18 20:02:21.805799	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
53	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:04:37.591	2025-05-18 20:04:37.610516	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
54	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:05:16.443	2025-05-18 20:05:16.458776	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
55	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:05:37.305	2025-05-18 20:05:37.320985	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
56	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:06:19.053	2025-05-18 20:06:19.069287	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
57	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:09:27.027	2025-05-18 20:09:27.04329	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
58	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:13:28.131	2025-05-18 20:13:28.150438	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
59	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:18:52.963	2025-05-18 20:18:52.980532	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
60	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:19:05.926	2025-05-18 20:19:05.945445	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
61	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:19:08.598	2025-05-18 20:19:08.614729	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
62	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:19:20.712	2025-05-18 20:19:20.727819	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
63	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:19:21.421	2025-05-18 20:19:21.438047	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
64	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:21:14.921	2025-05-18 20:21:14.936764	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
65	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:22:27.732	2025-05-18 20:22:27.750654	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
66	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:23:17.088	2025-05-18 20:23:17.110777	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
67	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:23:38.665	2025-05-18 20:23:38.682128	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
68	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:25:05.73	2025-05-18 20:25:05.74776	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
69	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:26:48.989	2025-05-18 20:26:49.005218	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
70	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:26:52.464	2025-05-18 20:26:52.480142	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
71	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:26:57.696	2025-05-18 20:26:57.712245	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
72	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:27:05.88	2025-05-18 20:27:05.89712	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
73	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:27:10.207	2025-05-18 20:27:10.223895	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
74	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:27:31.158	2025-05-18 20:27:31.174045	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
75	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:30:51.556	2025-05-18 20:30:51.575125	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
76	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:31:25.316	2025-05-18 20:31:25.33569	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
77	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:31:47.817	2025-05-18 20:31:47.837113	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
78	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:36:45.539	2025-05-18 20:36:45.555107	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
79	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:43:02.569	2025-05-18 20:43:02.586378	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
80	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:45:17.506	2025-05-18 20:45:17.521629	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
81	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:48:38.131	2025-05-18 20:48:38.154302	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
82	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:48:47.508	2025-05-18 20:48:47.524308	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
83	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:50:07.333	2025-05-18 20:50:07.348585	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
84	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:50:12.967	2025-05-18 20:50:12.986066	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
85	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:50:22.016	2025-05-18 20:50:22.031548	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
86	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:51:06.155	2025-05-18 20:51:06.173529	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
87	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:51:25.806	2025-05-18 20:51:25.82252	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
88	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:51:28.762	2025-05-18 20:51:28.778236	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
89	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:51:36.737	2025-05-18 20:51:36.75402	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
90	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:12.481	2025-05-18 20:52:12.496811	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
91	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:24.201	2025-05-18 20:52:24.21781	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
92	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:24.998	2025-05-18 20:52:25.016038	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
93	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:25.822	2025-05-18 20:52:25.839635	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
94	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:26.323	2025-05-18 20:52:26.34328	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
95	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:26.806	2025-05-18 20:52:26.823775	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
96	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:27.278	2025-05-18 20:52:27.293929	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
97	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:27.825	2025-05-18 20:52:27.840894	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
98	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:28.32	2025-05-18 20:52:28.338055	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
99	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:28.807	2025-05-18 20:52:28.825009	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
100	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:29.318	2025-05-18 20:52:29.333694	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
101	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:29.843	2025-05-18 20:52:29.858907	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
102	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:30.338	2025-05-18 20:52:30.355481	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
103	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:30.833	2025-05-18 20:52:30.848856	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
104	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:31.347	2025-05-18 20:52:31.363334	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
105	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:31.814	2025-05-18 20:52:31.829663	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
106	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:31.897	2025-05-18 20:52:31.912239	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
107	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:32.283	2025-05-18 20:52:32.305855	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
108	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:32.769	2025-05-18 20:52:32.786078	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
109	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:33.233	2025-05-18 20:52:33.248648	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
110	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:33.701	2025-05-18 20:52:33.716607	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
111	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:51.408	2025-05-18 20:52:51.422839	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
112	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:52:56.782	2025-05-18 20:52:56.797568	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
113	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:53:01.302	2025-05-18 20:53:01.317862	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
114	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:55:24.439	2025-05-18 20:55:24.454606	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
115	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:55:30.344	2025-05-18 20:55:30.360239	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
116	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:48.988	2025-05-18 20:56:49.006953	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
117	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:51.293	2025-05-18 20:56:51.309348	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
118	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:52.055	2025-05-18 20:56:52.07254	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
119	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:52.868	2025-05-18 20:56:52.891945	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
120	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:53.397	2025-05-18 20:56:53.416111	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
121	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:53.879	2025-05-18 20:56:53.893751	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
122	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:54.351	2025-05-18 20:56:54.369077	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
123	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:54.836	2025-05-18 20:56:54.856637	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
124	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:55.338	2025-05-18 20:56:55.355191	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
125	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:55.815	2025-05-18 20:56:55.832426	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
126	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:56.285	2025-05-18 20:56:56.30238	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
127	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:56.466	2025-05-18 20:56:56.486283	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
128	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:56.77	2025-05-18 20:56:56.793994	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
129	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:57.243	2025-05-18 20:56:57.259745	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
130	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:57.715	2025-05-18 20:56:57.730817	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
131	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:56:59.315	2025-05-18 20:56:59.340834	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
132	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:57:01.019	2025-05-18 20:57:01.034594	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
133	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:57:25.66	2025-05-18 20:57:25.681157	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
134	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:57:43.449	2025-05-18 20:57:43.464894	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
135	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:48.176	2025-05-18 20:58:48.192833	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
136	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:50.215	2025-05-18 20:58:50.231649	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
137	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:51.018	2025-05-18 20:58:51.034824	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
138	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:51.514	2025-05-18 20:58:51.530001	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
139	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:51.998	2025-05-18 20:58:52.013794	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
140	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:52.488	2025-05-18 20:58:52.50383	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
141	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:52.979	2025-05-18 20:58:52.995478	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
142	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:53.468	2025-05-18 20:58:53.483835	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
143	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:53.936	2025-05-18 20:58:53.952496	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
144	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:53.964	2025-05-18 20:58:53.979981	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
145	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:54.579	2025-05-18 20:58:54.596351	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
146	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:55.065	2025-05-18 20:58:55.081778	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
147	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:55.596	2025-05-18 20:58:55.611901	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
148	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:56.364	2025-05-18 20:58:56.380881	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
149	2025	5	\N	0	0	0	0	0	0	2025-05-18 20:58:58.793	2025-05-18 20:58:58.810415	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
150	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:02.007	2025-05-18 21:01:02.025367	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
151	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:03.917	2025-05-18 21:01:03.932611	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
152	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:07.081	2025-05-18 21:01:07.105019	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
153	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:11.17	2025-05-18 21:01:11.185858	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
154	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:12.043	2025-05-18 21:01:12.059383	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
155	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:12.885	2025-05-18 21:01:12.906253	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
156	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:13.753	2025-05-18 21:01:13.774226	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
157	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:14.326	2025-05-18 21:01:14.342047	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
158	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:14.882	2025-05-18 21:01:14.898895	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
159	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:15.46	2025-05-18 21:01:15.47946	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
160	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:16.008	2025-05-18 21:01:16.030273	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
161	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:16.582	2025-05-18 21:01:16.600401	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
162	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:17.121	2025-05-18 21:01:17.141111	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
163	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:17.642	2025-05-18 21:01:17.661195	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
164	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:17.715	2025-05-18 21:01:17.73815	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
165	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:18.311	2025-05-18 21:01:18.329857	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
166	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:18.974	2025-05-18 21:01:18.9942	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
167	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:19.529	2025-05-18 21:01:19.553215	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
168	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:20.278	2025-05-18 21:01:20.294776	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
169	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:22.429	2025-05-18 21:01:22.445017	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
170	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:36.542	2025-05-18 21:01:36.558151	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
171	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:01:39.08	2025-05-18 21:01:39.098252	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
172	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:19.753	2025-05-18 21:04:19.770397	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
173	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:49.334	2025-05-18 21:04:49.357509	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
174	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:50.227	2025-05-18 21:04:50.243507	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
175	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:50.781	2025-05-18 21:04:50.797298	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
176	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:51.335	2025-05-18 21:04:51.351326	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
177	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:51.879	2025-05-18 21:04:51.895129	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
178	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:52.432	2025-05-18 21:04:52.449483	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
179	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:52.979	2025-05-18 21:04:52.99406	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
180	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:53.542	2025-05-18 21:04:53.557947	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
181	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:54.017	2025-05-18 21:04:54.034889	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
182	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:54.155	2025-05-18 21:04:54.175011	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
183	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:54.734	2025-05-18 21:04:54.74949	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
184	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:55.301	2025-05-18 21:04:55.317857	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
185	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:04:55.883	2025-05-18 21:04:55.899472	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
186	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:05:00.636	2025-05-18 21:05:00.651268	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
187	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:05:03.231	2025-05-18 21:05:03.25213	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
188	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:07:03.177	2025-05-18 21:07:03.196924	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
189	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:28.975	2025-05-18 21:11:28.993096	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
190	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:30.408	2025-05-18 21:11:30.424498	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
191	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:30.984	2025-05-18 21:11:30.999225	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
192	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:31.54	2025-05-18 21:11:31.555818	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
193	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:32.098	2025-05-18 21:11:32.113255	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
194	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:32.652	2025-05-18 21:11:32.668286	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
195	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:32.821	2025-05-18 21:11:32.837676	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
196	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:33.327	2025-05-18 21:11:33.341786	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
197	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:33.927	2025-05-18 21:11:33.943462	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
198	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:34.507	2025-05-18 21:11:34.523778	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
199	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:36.03	2025-05-18 21:11:36.0454	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
200	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:11:38.057	2025-05-18 21:11:38.079116	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
201	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:12:56.759	2025-05-18 21:12:56.778222	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
202	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:14:58.65	2025-05-18 21:14:58.666455	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
203	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:00.022	2025-05-18 21:15:00.038966	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
204	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:00.495	2025-05-18 21:15:00.512773	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
205	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:00.668	2025-05-18 21:15:00.691459	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
206	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:01.284	2025-05-18 21:15:01.299385	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
207	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:01.873	2025-05-18 21:15:01.891077	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
208	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:02.465	2025-05-18 21:15:02.482486	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
209	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:03.043	2025-05-18 21:15:03.060471	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
210	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:03.598	2025-05-18 21:15:03.61481	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
211	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:04.163	2025-05-18 21:15:04.179447	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
212	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:04.721	2025-05-18 21:15:04.736774	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
213	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:05.268	2025-05-18 21:15:05.284876	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
214	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:05.851	2025-05-18 21:15:05.867446	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
215	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:06.4	2025-05-18 21:15:06.416316	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
216	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:06.97	2025-05-18 21:15:06.986416	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
217	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:07.532	2025-05-18 21:15:07.549713	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
218	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:08.089	2025-05-18 21:15:08.105681	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
219	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:08.677	2025-05-18 21:15:08.697401	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
220	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:09.396	2025-05-18 21:15:09.420225	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
221	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:10.004	2025-05-18 21:15:10.02731	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
222	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:10.609	2025-05-18 21:15:10.626172	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
223	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:11.232	2025-05-18 21:15:11.247238	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
224	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:11.803	2025-05-18 21:15:11.819119	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
225	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:12.359	2025-05-18 21:15:12.374593	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
226	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:12.92	2025-05-18 21:15:12.935365	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
227	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:13.502	2025-05-18 21:15:13.522892	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
228	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:14.109	2025-05-18 21:15:14.127127	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
229	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:14.722	2025-05-18 21:15:14.741038	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
230	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:15.353	2025-05-18 21:15:15.37095	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
231	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:15.916	2025-05-18 21:15:15.932273	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
232	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:16.485	2025-05-18 21:15:16.501589	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
233	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:17.057	2025-05-18 21:15:17.074673	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
234	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:17.617	2025-05-18 21:15:17.63266	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
235	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:18.188	2025-05-18 21:15:18.208852	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
236	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:18.802	2025-05-18 21:15:18.820293	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
237	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:19.458	2025-05-18 21:15:19.477626	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
238	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:20.053	2025-05-18 21:15:20.071831	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
239	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:20.611	2025-05-18 21:15:20.626493	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
240	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:21.165	2025-05-18 21:15:21.183327	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
241	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:21.73	2025-05-18 21:15:21.746598	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
242	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:22.282	2025-05-18 21:15:22.298224	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
243	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:22.826	2025-05-18 21:15:22.841833	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
244	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:23.377	2025-05-18 21:15:23.393331	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
245	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:23.928	2025-05-18 21:15:23.944997	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
246	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:24.471	2025-05-18 21:15:24.489596	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
247	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:24.772	2025-05-18 21:15:24.78842	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
248	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:25.565	2025-05-18 21:15:25.582624	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
249	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:26.17	2025-05-18 21:15:26.186272	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
250	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:26.747	2025-05-18 21:15:26.763443	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
251	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:15:27.296	2025-05-18 21:15:27.311642	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
252	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:19:19.962	2025-05-18 21:19:19.978303	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
253	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:19:26.781	2025-05-18 21:19:26.797784	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
254	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:19:34.798	2025-05-18 21:19:34.814923	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
255	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:19:41.819	2025-05-18 21:19:41.835475	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
256	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:26:30.649	2025-05-18 21:26:30.669629	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
257	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:26:34.431	2025-05-18 21:26:34.448638	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
258	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:26:35.935	2025-05-18 21:26:35.950089	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
259	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:35:10.941	2025-05-18 21:35:10.958252	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
260	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:35:52.451	2025-05-18 21:35:52.469322	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
261	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:36:48.966	2025-05-18 21:36:48.98176	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
262	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:37:04.443	2025-05-18 21:37:04.465416	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
263	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:37:12.568	2025-05-18 21:37:12.584649	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
264	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:37:13.306	2025-05-18 21:37:13.321232	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
265	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:37:29.346	2025-05-18 21:37:29.362269	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
266	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:37:35.111	2025-05-18 21:37:35.127392	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
267	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:38:30.837	2025-05-18 21:38:30.852805	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
268	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:39:57.667	2025-05-18 21:39:57.684316	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
269	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:40:22.817	2025-05-18 21:40:22.838064	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
270	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:40:26.057	2025-05-18 21:40:26.072781	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
271	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:40:26.813	2025-05-18 21:40:26.829661	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
272	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:40:35.031	2025-05-18 21:40:35.047137	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
273	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:40:59.283	2025-05-18 21:40:59.298569	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
274	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:41:15.416	2025-05-18 21:41:15.432034	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
275	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:41:21.733	2025-05-18 21:41:21.748745	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
276	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:42:31.466	2025-05-18 21:42:31.485156	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
277	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:42:43.482	2025-05-18 21:42:43.499648	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
278	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:43:22.6	2025-05-18 21:43:22.616265	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
279	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:43:33.163	2025-05-18 21:43:33.180266	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
280	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:43:48.952	2025-05-18 21:43:48.968257	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
281	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:44:48.02	2025-05-18 21:44:48.036877	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
282	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:44:59.682	2025-05-18 21:44:59.696465	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
283	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:45:35.737	2025-05-18 21:45:35.758343	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
284	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:49:39.447	2025-05-18 21:49:39.467242	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
285	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:50:23.354	2025-05-18 21:50:23.368622	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
286	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:51:35.287	2025-05-18 21:51:35.303438	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
287	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:54:27.873	2025-05-18 21:54:27.889229	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
288	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:54:35.67	2025-05-18 21:54:35.685964	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
289	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:54:55.677	2025-05-18 21:54:55.693615	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
290	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:07.439	2025-05-18 21:55:07.461833	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
291	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:08.105	2025-05-18 21:55:08.121175	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
292	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:08.774	2025-05-18 21:55:08.790536	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
293	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:09.482	2025-05-18 21:55:09.50034	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
294	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:10.195	2025-05-18 21:55:10.211997	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
295	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:10.749	2025-05-18 21:55:10.76446	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
296	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:10.869	2025-05-18 21:55:10.885934	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
297	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:11.518	2025-05-18 21:55:11.533773	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
298	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:12.154	2025-05-18 21:55:12.170498	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
299	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:12.803	2025-05-18 21:55:12.819626	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
300	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:13.916	2025-05-18 21:55:13.936331	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
301	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:58.696	2025-05-18 21:55:58.71144	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
302	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:59.315	2025-05-18 21:55:59.333501	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
303	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:55:59.951	2025-05-18 21:55:59.965356	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
304	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:00.6	2025-05-18 21:56:00.615991	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
305	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:01.297	2025-05-18 21:56:01.313079	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
306	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:01.928	2025-05-18 21:56:01.943977	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
307	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:02.563	2025-05-18 21:56:02.578312	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
308	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:03.204	2025-05-18 21:56:03.22049	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
309	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:03.875	2025-05-18 21:56:03.892567	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
310	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:04.511	2025-05-18 21:56:04.527175	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
311	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:05.131	2025-05-18 21:56:05.146329	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
312	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:05.747	2025-05-18 21:56:05.762984	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
313	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:06.361	2025-05-18 21:56:06.377209	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
314	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:06.977	2025-05-18 21:56:06.992309	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
315	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:07.595	2025-05-18 21:56:07.609622	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
316	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:08.216	2025-05-18 21:56:08.230524	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
317	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:08.848	2025-05-18 21:56:08.863414	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
318	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:09.572	2025-05-18 21:56:09.59038	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
319	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:10.254	2025-05-18 21:56:10.269525	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
320	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:10.947	2025-05-18 21:56:10.970862	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
321	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:11.604	2025-05-18 21:56:11.619211	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
322	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:12.222	2025-05-18 21:56:12.237855	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
323	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:12.836	2025-05-18 21:56:12.851987	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
324	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:13.453	2025-05-18 21:56:13.4688	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
325	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:14.07	2025-05-18 21:56:14.085291	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
326	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:14.69	2025-05-18 21:56:14.705517	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
327	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:15.305	2025-05-18 21:56:15.320767	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
328	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:15.922	2025-05-18 21:56:15.937112	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
329	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:16.538	2025-05-18 21:56:16.553875	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
330	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:17.157	2025-05-18 21:56:17.172303	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
331	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:17.79	2025-05-18 21:56:17.805404	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
332	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:18.465	2025-05-18 21:56:18.480953	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
333	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:19.105	2025-05-18 21:56:19.121983	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
334	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:19.809	2025-05-18 21:56:19.826206	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
335	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:20.469	2025-05-18 21:56:20.484554	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
336	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:21.084	2025-05-18 21:56:21.099837	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
337	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:21.701	2025-05-18 21:56:21.716228	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
338	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:22.318	2025-05-18 21:56:22.333764	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
339	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:22.934	2025-05-18 21:56:22.949382	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
340	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:23.549	2025-05-18 21:56:23.564151	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
341	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:24.175	2025-05-18 21:56:24.190371	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
342	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:24.793	2025-05-18 21:56:24.808098	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
343	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:25.416	2025-05-18 21:56:25.431905	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
344	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:26.067	2025-05-18 21:56:26.084457	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
345	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:26.863	2025-05-18 21:56:26.887394	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
346	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:27.547	2025-05-18 21:56:27.564183	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
347	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:28.235	2025-05-18 21:56:28.25192	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
348	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:28.963	2025-05-18 21:56:28.979424	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
349	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:29.598	2025-05-18 21:56:29.613428	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
350	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:30.218	2025-05-18 21:56:30.23392	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
351	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:30.899	2025-05-18 21:56:30.914353	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
352	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:31.513	2025-05-18 21:56:31.527538	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
353	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:32.135	2025-05-18 21:56:32.151	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
354	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:32.761	2025-05-18 21:56:32.777563	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
355	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:33.394	2025-05-18 21:56:33.40981	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
356	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:34.014	2025-05-18 21:56:34.031133	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
357	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:34.678	2025-05-18 21:56:34.69367	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
358	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:35.296	2025-05-18 21:56:35.312375	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
359	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:35.921	2025-05-18 21:56:35.935878	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
360	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:36.539	2025-05-18 21:56:36.554157	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
361	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:37.17	2025-05-18 21:56:37.18568	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
362	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:37.625	2025-05-18 21:56:37.641004	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
363	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:37.629	2025-05-18 21:56:37.645195	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
364	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:37.848	2025-05-18 21:56:37.866909	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
365	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:38.201	2025-05-18 21:56:38.217894	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
366	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:38.308	2025-05-18 21:56:38.323229	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
367	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:38.525	2025-05-18 21:56:38.540814	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
368	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:38.769	2025-05-18 21:56:38.785527	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
369	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:39.19	2025-05-18 21:56:39.205373	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
370	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:39.819	2025-05-18 21:56:39.83487	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
371	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:40.45	2025-05-18 21:56:40.466089	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
372	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:41.067	2025-05-18 21:56:41.082934	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
373	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:41.689	2025-05-18 21:56:41.704447	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
374	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:42.314	2025-05-18 21:56:42.329398	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
375	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:42.966	2025-05-18 21:56:42.981203	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
376	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:43.616	2025-05-18 21:56:43.633329	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
377	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:44.254	2025-05-18 21:56:44.269524	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
378	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:44.87	2025-05-18 21:56:44.885168	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
379	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:45.141	2025-05-18 21:56:45.156766	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
380	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:45.535	2025-05-18 21:56:45.550827	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
381	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:46.198	2025-05-18 21:56:46.213411	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
382	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:46.845	2025-05-18 21:56:46.860485	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
383	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:47.47	2025-05-18 21:56:47.489324	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
384	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:48.118	2025-05-18 21:56:48.134028	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
385	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:48.74	2025-05-18 21:56:48.755073	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
386	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:49.367	2025-05-18 21:56:49.382648	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
387	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:50.001	2025-05-18 21:56:50.016312	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
388	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:50.508	2025-05-18 21:56:50.523498	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
389	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:50.568	2025-05-18 21:56:50.58433	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
390	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:50.75	2025-05-18 21:56:50.765965	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
391	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:51.234	2025-05-18 21:56:51.250418	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
392	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:51.385	2025-05-18 21:56:51.401091	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
393	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:52.056	2025-05-18 21:56:52.07321	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
394	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:52.723	2025-05-18 21:56:52.739102	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
395	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:53.361	2025-05-18 21:56:53.376908	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
396	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:54.032	2025-05-18 21:56:54.048356	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
397	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:54.715	2025-05-18 21:56:54.73127	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
398	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:55.361	2025-05-18 21:56:55.377314	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
399	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:55.679	2025-05-18 21:56:55.694047	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
400	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:56.001	2025-05-18 21:56:56.017142	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
401	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:56.639	2025-05-18 21:56:56.655529	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
402	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:57.214	2025-05-18 21:56:57.230992	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
403	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:57.275	2025-05-18 21:56:57.290731	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
404	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:57.822	2025-05-18 21:56:57.83835	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
405	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:57.911	2025-05-18 21:56:57.92677	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
406	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:58.547	2025-05-18 21:56:58.563186	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
407	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:58.659	2025-05-18 21:56:58.676781	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
408	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:58.775	2025-05-18 21:56:58.790602	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
409	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:59.151	2025-05-18 21:56:59.166571	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
410	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:59.242	2025-05-18 21:56:59.259396	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
411	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:59.466	2025-05-18 21:56:59.482087	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
412	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:59.767	2025-05-18 21:56:59.788884	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
413	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:56:59.935	2025-05-18 21:56:59.950895	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
414	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:00.672	2025-05-18 21:57:00.689376	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
415	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:00.859	2025-05-18 21:57:00.875018	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
416	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:01.461	2025-05-18 21:57:01.477858	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
417	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:02.084	2025-05-18 21:57:02.102385	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
418	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:02.101	2025-05-18 21:57:02.117164	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
419	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:02.16	2025-05-18 21:57:02.176431	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
420	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:02.796	2025-05-18 21:57:02.811164	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
421	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:03.42	2025-05-18 21:57:03.437305	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
422	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:04.043	2025-05-18 21:57:04.058536	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
423	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:04.666	2025-05-18 21:57:04.681984	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
424	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:05.286	2025-05-18 21:57:05.301283	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
425	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:05.909	2025-05-18 21:57:05.924997	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
426	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:06.143	2025-05-18 21:57:06.158708	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
427	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:06.472	2025-05-18 21:57:06.487206	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
428	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:06.577	2025-05-18 21:57:06.595204	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
429	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:07.157	2025-05-18 21:57:07.173427	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
433	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:07.844	2025-05-18 21:57:07.859789	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
434	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:08.432	2025-05-18 21:57:08.447621	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
437	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:09.237	2025-05-18 21:57:09.25339	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
438	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:09.886	2025-05-18 21:57:09.902094	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
440	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:10.531	2025-05-18 21:57:10.549573	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
442	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:11.165	2025-05-18 21:57:11.181242	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
444	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:11.706	2025-05-18 21:57:11.723891	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
446	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:12.346	2025-05-18 21:57:12.362383	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
455	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:17.063	2025-05-18 21:57:17.080623	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
456	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:17.712	2025-05-18 21:57:17.727947	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
457	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:18.237	2025-05-18 21:57:18.253408	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
459	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:18.902	2025-05-18 21:57:18.918787	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
462	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:19.735	2025-05-18 21:57:19.751645	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
465	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:20.381	2025-05-18 21:57:20.39671	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
467	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:20.944	2025-05-18 21:57:20.961094	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
472	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:23.087	2025-05-18 21:57:23.10301	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
474	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:23.607	2025-05-18 21:57:23.623461	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
475	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:24.26	2025-05-18 21:57:24.277023	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
476	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:24.906	2025-05-18 21:57:24.921838	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
477	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:25.607	2025-05-18 21:57:25.625937	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
479	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:26.304	2025-05-18 21:57:26.321441	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
480	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:26.989	2025-05-18 21:57:27.005597	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
482	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:27.575	2025-05-18 21:57:27.59273	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
484	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:28.229	2025-05-18 21:57:28.248916	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
487	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:28.802	2025-05-18 21:57:28.818103	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
489	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:29.425	2025-05-18 21:57:29.440959	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
492	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:30.229	2025-05-18 21:57:30.244938	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
493	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:30.866	2025-05-18 21:57:30.882134	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
495	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:31.497	2025-05-18 21:57:31.513457	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
496	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:32.116	2025-05-18 21:57:32.137177	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
499	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:32.795	2025-05-18 21:57:32.811463	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
501	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:33.439	2025-05-18 21:57:33.454635	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
502	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:34.076	2025-05-18 21:57:34.092411	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
503	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:34.734	2025-05-18 21:57:34.750343	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
504	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:35.38	2025-05-18 21:57:35.396045	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
510	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:38.062	2025-05-18 21:57:38.078693	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
511	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:38.689	2025-05-18 21:57:38.710147	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
512	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:39.345	2025-05-18 21:57:39.366358	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
514	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:40.004	2025-05-18 21:57:40.020391	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
516	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:40.686	2025-05-18 21:57:40.707164	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
518	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:41.283	2025-05-18 21:57:41.298874	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
522	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:42.056	2025-05-18 21:57:42.075249	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
524	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:42.751	2025-05-18 21:57:42.773317	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
525	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:43.417	2025-05-18 21:57:43.433131	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
526	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:44.059	2025-05-18 21:57:44.07507	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
537	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:48.649	2025-05-18 21:57:48.666055	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
539	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:49.296	2025-05-18 21:57:49.313728	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
542	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:49.9	2025-05-18 21:57:49.921373	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
545	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:50.591	2025-05-18 21:57:50.609046	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
546	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:51.196	2025-05-18 21:57:51.212082	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
430	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:07.209	2025-05-18 21:57:07.224442	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
432	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:07.784	2025-05-18 21:57:07.799619	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
435	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:08.476	2025-05-18 21:57:08.491266	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
436	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:09.083	2025-05-18 21:57:09.099399	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
439	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:10.309	2025-05-18 21:57:10.324337	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
441	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:10.958	2025-05-18 21:57:10.973735	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
443	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:11.545	2025-05-18 21:57:11.560606	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
463	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:20.114	2025-05-18 21:57:20.129612	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
466	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:20.717	2025-05-18 21:57:20.733031	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
473	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:23.103	2025-05-18 21:57:23.118272	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
478	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:26.236	2025-05-18 21:57:26.25154	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
481	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:27.471	2025-05-18 21:57:27.486809	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
486	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:28.719	2025-05-18 21:57:28.734267	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
431	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:07.427	2025-05-18 21:57:07.443474	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
445	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:11.839	2025-05-18 21:57:11.855158	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
447	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:12.493	2025-05-18 21:57:12.509461	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
448	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:13.136	2025-05-18 21:57:13.15227	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
449	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:13.777	2025-05-18 21:57:13.792037	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
450	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:14.417	2025-05-18 21:57:14.435053	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
451	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:15.059	2025-05-18 21:57:15.075189	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
452	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:15.747	2025-05-18 21:57:15.762602	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
453	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:16.385	2025-05-18 21:57:16.400061	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
454	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:16.978	2025-05-18 21:57:16.993168	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
458	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:18.389	2025-05-18 21:57:18.409011	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
460	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:19.067	2025-05-18 21:57:19.084089	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
461	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:19.687	2025-05-18 21:57:19.704289	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
464	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:20.318	2025-05-18 21:57:20.333457	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
468	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:21.031	2025-05-18 21:57:21.047375	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
469	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:21.669	2025-05-18 21:57:21.685002	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
470	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:22.306	2025-05-18 21:57:22.321934	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
471	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:22.966	2025-05-18 21:57:22.981867	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
483	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:27.684	2025-05-18 21:57:27.699998	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
485	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:28.323	2025-05-18 21:57:28.338996	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
488	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:28.961	2025-05-18 21:57:28.977151	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
490	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:29.594	2025-05-18 21:57:29.609825	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
491	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:30.201	2025-05-18 21:57:30.217416	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
494	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:31.497	2025-05-18 21:57:31.512659	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
497	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:32.134	2025-05-18 21:57:32.149445	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
498	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:32.675	2025-05-18 21:57:32.691165	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
500	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:33.324	2025-05-18 21:57:33.340361	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
505	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:35.381	2025-05-18 21:57:35.397294	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
506	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:36.085	2025-05-18 21:57:36.10493	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
507	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:36.731	2025-05-18 21:57:36.747615	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
508	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:37.374	2025-05-18 21:57:37.390357	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
509	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:38.014	2025-05-18 21:57:38.030647	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
513	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:39.857	2025-05-18 21:57:39.873215	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
515	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:40.654	2025-05-18 21:57:40.671884	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
517	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:41.258	2025-05-18 21:57:41.27432	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
519	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:41.352	2025-05-18 21:57:41.368726	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
520	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:41.851	2025-05-18 21:57:41.867397	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
521	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:41.948	2025-05-18 21:57:41.966652	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
523	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:42.058	2025-05-18 21:57:42.0772	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
527	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:44.166	2025-05-18 21:57:44.182353	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
528	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:44.564	2025-05-18 21:57:44.580694	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
529	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:44.692	2025-05-18 21:57:44.70756	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
530	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:45.322	2025-05-18 21:57:45.337657	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
531	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:45.961	2025-05-18 21:57:45.977217	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
532	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:46.596	2025-05-18 21:57:46.611473	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
533	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:47.223	2025-05-18 21:57:47.238487	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
534	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:47.85	2025-05-18 21:57:47.866231	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
535	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:48.433	2025-05-18 21:57:48.448287	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
536	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:48.495	2025-05-18 21:57:48.510706	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
538	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:49.182	2025-05-18 21:57:49.20429	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
540	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:49.665	2025-05-18 21:57:49.680843	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
541	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:49.786	2025-05-18 21:57:49.802164	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
543	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:50.374	2025-05-18 21:57:50.390584	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
544	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:50.558	2025-05-18 21:57:50.575581	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
547	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:51.252	2025-05-18 21:57:51.26773	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
548	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:51.957	2025-05-18 21:57:51.974165	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
549	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:52.497	2025-05-18 21:57:52.512596	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
550	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:52.617	2025-05-18 21:57:52.633803	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
551	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:53.095	2025-05-18 21:57:53.110398	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
552	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:53.294	2025-05-18 21:57:53.311098	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
553	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:53.76	2025-05-18 21:57:53.776008	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
554	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:53.997	2025-05-18 21:57:54.013218	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
555	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:54.397	2025-05-18 21:57:54.412654	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
556	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:54.712	2025-05-18 21:57:54.727603	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
557	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:55.354	2025-05-18 21:57:55.370691	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
558	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:55.994	2025-05-18 21:57:56.009811	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
559	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:56.347	2025-05-18 21:57:56.363381	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
560	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:56.648	2025-05-18 21:57:56.663723	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
561	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:57.291	2025-05-18 21:57:57.307238	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
562	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:57.943	2025-05-18 21:57:57.959004	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
563	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:57.967	2025-05-18 21:57:57.982699	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
564	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:59.132	2025-05-18 21:57:59.148276	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
565	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:59.408	2025-05-18 21:57:59.423022	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
566	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:59.742	2025-05-18 21:57:59.759885	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
569	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:00.96	2025-05-18 21:58:00.976245	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
571	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.583	2025-05-18 21:58:01.599213	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
572	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.604	2025-05-18 21:58:01.62049	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
576	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.231	2025-05-18 21:58:02.247854	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
577	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.233	2025-05-18 21:58:02.248205	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
583	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.873	2025-05-18 21:58:02.889186	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
584	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.925	2025-05-18 21:58:02.940827	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
587	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:03.57	2025-05-18 21:58:03.585712	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
588	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:04.221	2025-05-18 21:58:04.236779	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
590	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:04.868	2025-05-18 21:58:04.885205	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
592	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:05.51	2025-05-18 21:58:05.525336	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
597	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:08.1	2025-05-18 21:58:08.115787	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
599	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:08.854	2025-05-18 21:58:08.870258	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
602	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:09.581	2025-05-18 21:58:09.598704	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
603	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.187	2025-05-18 21:58:10.203313	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
606	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.745	2025-05-18 21:58:10.760982	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
608	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.874	2025-05-18 21:58:10.889874	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
609	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:11.515	2025-05-18 21:58:11.530415	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
612	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:12.156	2025-05-18 21:58:12.173602	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
613	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:12.82	2025-05-18 21:58:12.835828	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
614	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:13.444	2025-05-18 21:58:13.459815	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
617	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:14.108	2025-05-18 21:58:14.125284	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
618	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:14.703	2025-05-18 21:58:14.7183	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
621	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:15.42	2025-05-18 21:58:15.436801	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
622	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:16.091	2025-05-18 21:58:16.106348	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
623	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:16.796	2025-05-18 21:58:16.811798	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
625	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:17.474	2025-05-18 21:58:17.489655	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
626	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:18.135	2025-05-18 21:58:18.151124	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
627	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:18.77	2025-05-18 21:58:18.785647	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
629	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:19.403	2025-05-18 21:58:19.41825	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
630	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:19.635	2025-05-18 21:58:19.650982	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
646	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:29.783	2025-05-18 21:58:29.798909	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
647	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:30.424	2025-05-18 21:58:30.440529	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
648	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:31.09	2025-05-18 21:58:31.10651	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
649	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:31.731	2025-05-18 21:58:31.7482	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
650	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:32.389	2025-05-18 21:58:32.405475	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
651	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:33.031	2025-05-18 21:58:33.047	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
652	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:37.073	2025-05-18 21:58:37.089432	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
653	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:38.025	2025-05-18 21:58:38.040785	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
654	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:38.982	2025-05-18 21:58:38.997623	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
655	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:39.629	2025-05-18 21:58:39.644615	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
656	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:40.271	2025-05-18 21:58:40.286674	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
657	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:40.923	2025-05-18 21:58:40.938907	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
658	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:41.564	2025-05-18 21:58:41.580041	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
659	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:42.205	2025-05-18 21:58:42.221211	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
660	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:42.841	2025-05-18 21:58:42.857106	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
661	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:43.526	2025-05-18 21:58:43.545585	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
662	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:44.181	2025-05-18 21:58:44.196868	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
663	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:44.823	2025-05-18 21:58:44.83863	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
664	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:45.523	2025-05-18 21:58:45.539402	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
666	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:46.219	2025-05-18 21:58:46.24341	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
667	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:47.476	2025-05-18 21:58:47.492161	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
668	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:48.14	2025-05-18 21:58:48.155843	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
669	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:48.787	2025-05-18 21:58:48.802862	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
670	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:49.432	2025-05-18 21:58:49.448526	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
671	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:50.084	2025-05-18 21:58:50.100256	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
672	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:50.815	2025-05-18 21:58:50.830853	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
567	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:57:59.853	2025-05-18 21:57:59.869878	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
568	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:00.518	2025-05-18 21:58:00.533665	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
570	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.204	2025-05-18 21:58:01.219874	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
573	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.768	2025-05-18 21:58:01.783054	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
574	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.782	2025-05-18 21:58:01.800776	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
575	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:01.911	2025-05-18 21:58:01.933085	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
578	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.287	2025-05-18 21:58:02.302502	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
579	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.445	2025-05-18 21:58:02.464387	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
580	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.515	2025-05-18 21:58:02.531828	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
581	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.758	2025-05-18 21:58:02.773854	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
582	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:02.85	2025-05-18 21:58:02.865393	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
585	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:03.102	2025-05-18 21:58:03.11742	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
586	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:03.212	2025-05-18 21:58:03.227642	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
589	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:04.406	2025-05-18 21:58:04.435623	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
591	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:05.134	2025-05-18 21:58:05.15008	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
593	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:05.579	2025-05-18 21:58:05.595371	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
594	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:06.207	2025-05-18 21:58:06.225438	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
595	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:06.879	2025-05-18 21:58:06.894829	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
596	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:07.531	2025-05-18 21:58:07.547248	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
598	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:08.19	2025-05-18 21:58:08.206959	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
600	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:08.881	2025-05-18 21:58:08.897032	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
601	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:09.456	2025-05-18 21:58:09.472695	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
604	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.243	2025-05-18 21:58:10.25889	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
605	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.674	2025-05-18 21:58:10.691583	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
607	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:10.862	2025-05-18 21:58:10.877364	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
610	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:11.518	2025-05-18 21:58:11.535197	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
611	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:12.157	2025-05-18 21:58:12.173291	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
615	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:13.459	2025-05-18 21:58:13.478573	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
616	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:14.056	2025-05-18 21:58:14.071698	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
619	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:14.78	2025-05-18 21:58:14.797117	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
620	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:15.359	2025-05-18 21:58:15.377442	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
624	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:17.363	2025-05-18 21:58:17.380613	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
628	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:18.939	2025-05-18 21:58:18.955651	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
631	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:20.106	2025-05-18 21:58:20.12208	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
632	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:20.788	2025-05-18 21:58:20.803711	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
633	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:21.441	2025-05-18 21:58:21.457185	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
634	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:22.081	2025-05-18 21:58:22.097301	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
635	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:22.718	2025-05-18 21:58:22.733971	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
636	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:23.375	2025-05-18 21:58:23.392436	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
637	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:24.028	2025-05-18 21:58:24.044585	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
638	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:24.674	2025-05-18 21:58:24.690371	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
639	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:25.305	2025-05-18 21:58:25.322117	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
640	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:25.944	2025-05-18 21:58:25.960778	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
641	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:26.6	2025-05-18 21:58:26.615683	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
642	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:27.238	2025-05-18 21:58:27.253702	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
643	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:27.879	2025-05-18 21:58:27.894616	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
644	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:28.553	2025-05-18 21:58:28.570162	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
645	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:28.769	2025-05-18 21:58:28.785703	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
665	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:46.133	2025-05-18 21:58:46.151158	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
673	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:53.13	2025-05-18 21:58:53.146378	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
674	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:54.093	2025-05-18 21:58:54.11183	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
675	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:54.267	2025-05-18 21:58:54.285791	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
676	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:55.653	2025-05-18 21:58:55.668385	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
677	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:56.292	2025-05-18 21:58:56.307191	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
678	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:58:56.934	2025-05-18 21:58:56.949554	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
679	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:08.298	2025-05-18 21:59:08.314806	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
680	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:08.937	2025-05-18 21:59:08.952595	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
681	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:09.623	2025-05-18 21:59:09.638815	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
682	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:10.343	2025-05-18 21:59:10.35812	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
683	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:10.506	2025-05-18 21:59:10.521796	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
684	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:11.461	2025-05-18 21:59:11.476592	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
685	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:12.093	2025-05-18 21:59:12.108744	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
686	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:12.712	2025-05-18 21:59:12.72777	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
687	2025	5	\N	0	0	0	0	0	0	2025-05-18 21:59:13.361	2025-05-18 21:59:13.37845	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
688	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:03:16.679	2025-05-18 22:03:16.695811	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
689	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:03:43.309	2025-05-18 22:03:43.325467	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
690	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:03:48.561	2025-05-18 22:03:48.576829	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
691	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:04:26.661	2025-05-18 22:04:26.677467	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
692	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:06:21.159	2025-05-18 22:06:21.1767	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
693	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:06:27.443	2025-05-18 22:06:27.460239	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
694	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:12:13.605	2025-05-18 22:12:13.622781	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
695	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:13:51.927	2025-05-18 22:13:51.944563	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
696	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:14:17.431	2025-05-18 22:14:17.448054	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
697	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:15:42.961	2025-05-18 22:15:42.978884	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
698	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:15:56.009	2025-05-18 22:15:56.025734	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
699	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:17:34.946	2025-05-18 22:17:34.963375	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
700	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:22:20.651	2025-05-18 22:22:20.670912	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
701	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:22:50.739	2025-05-18 22:22:50.75479	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
702	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:22:59.636	2025-05-18 22:22:59.652015	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
703	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:23:00.259	2025-05-18 22:23:00.275937	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
704	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:23:04.894	2025-05-18 22:23:04.911397	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
705	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:23:10.836	2025-05-18 22:23:10.851624	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
706	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:23:11.986	2025-05-18 22:23:12.002276	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
707	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:23:12.535	2025-05-18 22:23:12.552654	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
708	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:28:01.588	2025-05-18 22:28:01.605068	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
709	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:28:22.172	2025-05-18 22:28:22.188433	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
710	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:28:42.268	2025-05-18 22:28:42.283843	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
711	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:03.476	2025-05-18 22:29:03.492547	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
712	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:06.578	2025-05-18 22:29:06.594244	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
713	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:07.148	2025-05-18 22:29:07.164309	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
714	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:14.645	2025-05-18 22:29:14.661627	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
715	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:15.421	2025-05-18 22:29:15.437382	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
716	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:24.132	2025-05-18 22:29:24.149028	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
717	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:28.076	2025-05-18 22:29:28.096046	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
718	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:29:28.711	2025-05-18 22:29:28.72735	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
719	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:31:42.189	2025-05-18 22:31:42.208131	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
720	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:31:45.728	2025-05-18 22:31:45.746611	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
721	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:32:54.643	2025-05-18 22:32:54.669028	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
722	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:33:15.861	2025-05-18 22:33:15.876314	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
723	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:33:31.534	2025-05-18 22:33:31.559817	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
724	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:34:35.856	2025-05-18 22:34:35.873051	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
725	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:34:47.074	2025-05-18 22:34:47.090531	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
726	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:35:02.183	2025-05-18 22:35:02.198972	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
727	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:35:02.744	2025-05-18 22:35:02.760358	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
728	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:37:49.554	2025-05-18 22:37:49.572037	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
729	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:39:47.798	2025-05-18 22:39:47.814178	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
730	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:43:23.572	2025-05-18 22:43:23.589674	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
731	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:44:01.653	2025-05-18 22:44:01.674347	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
732	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:44:06.419	2025-05-18 22:44:06.43787	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
733	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:44:51.899	2025-05-18 22:44:51.917758	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
734	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:45:58.699	2025-05-18 22:45:58.717506	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
735	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:48:17.859	2025-05-18 22:48:17.875637	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
736	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:48:19.304	2025-05-18 22:48:19.32192	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
737	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:48:19.887	2025-05-18 22:48:19.902176	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
738	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:03.93	2025-05-18 22:54:03.946828	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
739	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:05.65	2025-05-18 22:54:05.667609	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
740	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:14.509	2025-05-18 22:54:14.524226	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
741	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:15.05	2025-05-18 22:54:15.065754	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
742	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:20.588	2025-05-18 22:54:20.603301	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
743	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:21.373	2025-05-18 22:54:21.393858	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
744	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:25.901	2025-05-18 22:54:25.916552	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
745	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:54:26.631	2025-05-18 22:54:26.64801	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
746	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:55:05.42	2025-05-18 22:55:05.435404	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
747	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:55:06.011	2025-05-18 22:55:06.029737	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
748	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:57:38.953	2025-05-18 22:57:38.970243	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
749	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:57:40.063	2025-05-18 22:57:40.078567	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
750	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:14.4	2025-05-18 22:58:14.418022	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
751	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:14.954	2025-05-18 22:58:14.968442	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
752	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:37.413	2025-05-18 22:58:37.428692	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
753	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:40.01	2025-05-18 22:58:40.025742	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
754	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:41.827	2025-05-18 22:58:41.846826	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
755	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:42.411	2025-05-18 22:58:42.42692	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
756	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:58:57.244	2025-05-18 22:58:57.260439	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
757	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:01.851	2025-05-18 22:59:01.867709	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
758	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:04.602	2025-05-18 22:59:04.619633	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
759	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:05.224	2025-05-18 22:59:05.240998	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
760	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:05.51	2025-05-18 22:59:05.526685	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
761	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:06.577	2025-05-18 22:59:06.591899	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
762	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:28.498	2025-05-18 22:59:28.518966	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
763	2025	5	\N	0	0	0	0	0	0	2025-05-18 22:59:29.095	2025-05-18 22:59:29.113548	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
764	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:01:18.086	2025-05-18 23:01:18.102031	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
765	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:01:27.304	2025-05-18 23:01:27.319789	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
766	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:01:38.262	2025-05-18 23:01:38.279328	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
767	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:02:01.666	2025-05-18 23:02:01.682902	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
768	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:02:04.14	2025-05-18 23:02:04.157192	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
769	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:02:57.596	2025-05-18 23:02:57.612499	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
770	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:03:23.809	2025-05-18 23:03:23.827643	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
771	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:03:33.612	2025-05-18 23:03:33.627858	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
772	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:04:13.838	2025-05-18 23:04:13.853656	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
773	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:04:29.547	2025-05-18 23:04:29.563801	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
774	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:04:42.145	2025-05-18 23:04:42.161253	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
775	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:05:24.118	2025-05-18 23:05:24.134797	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
776	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:07:34.639	2025-05-18 23:07:34.657245	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
777	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:07:43.477	2025-05-18 23:07:43.494193	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
778	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:08:04.782	2025-05-18 23:08:04.798051	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
779	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:10:31.166	2025-05-18 23:10:31.182235	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
780	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:10:53.619	2025-05-18 23:10:53.633847	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
781	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:11:37.497	2025-05-18 23:11:37.516267	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
782	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:11:47.539	2025-05-18 23:11:47.555191	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
783	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:12:42.238	2025-05-18 23:12:42.254945	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
784	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:13:21.525	2025-05-18 23:13:21.542362	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
785	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:15:12.791	2025-05-18 23:15:12.807818	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
786	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:28:36.637	2025-05-18 23:28:36.654196	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
787	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:30:55.256	2025-05-18 23:30:55.272117	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
788	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:31:01.592	2025-05-18 23:31:01.611532	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
789	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:31:02.774	2025-05-18 23:31:02.790271	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
790	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:31:03.467	2025-05-18 23:31:03.485032	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
791	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:35:19.781	2025-05-18 23:35:19.797948	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
792	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:37:39.669	2025-05-18 23:37:39.685941	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
793	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:38:06.113	2025-05-18 23:38:06.132356	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
794	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:38:12.049	2025-05-18 23:38:12.065447	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
795	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:38:21.637	2025-05-18 23:38:21.653106	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
796	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:38:29.004	2025-05-18 23:38:29.020364	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
797	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:41:38.708	2025-05-18 23:41:38.724062	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
798	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:41:41.567	2025-05-18 23:41:41.583326	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
799	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:42:44.573	2025-05-18 23:42:44.593341	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
800	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:42:46.062	2025-05-18 23:42:46.081127	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
801	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:16.751	2025-05-18 23:44:16.741729	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
802	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:17.407	2025-05-18 23:44:17.397834	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
803	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:18.053	2025-05-18 23:44:18.044928	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
804	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:22.305	2025-05-18 23:44:22.32504	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
805	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:33.108	2025-05-18 23:44:33.125249	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
806	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:49.481	2025-05-18 23:44:49.502643	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
807	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:44:56.759	2025-05-18 23:44:56.775156	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
808	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:48:12.61	2025-05-18 23:48:12.62712	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
809	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:48:15.002	2025-05-18 23:48:15.018157	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
810	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:49:33.035	2025-05-18 23:49:33.051862	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
811	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:51:52.33	2025-05-18 23:51:52.347877	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
812	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:51:57.427	2025-05-18 23:51:57.443714	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
813	2025	5	\N	0	0	0	0	0	0	2025-05-18 23:52:33.964	2025-05-18 23:52:33.986745	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
814	2025	5	\N	0	0	0	0	0	0	2025-05-19 10:46:52.16	2025-05-19 10:46:52.178546	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
815	2025	5	\N	0	0	0	0	0	0	2025-05-19 10:46:54.654	2025-05-19 10:46:54.669775	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
816	2025	5	\N	0	0	0	0	0	0	2025-05-19 10:56:31.066	2025-05-19 10:56:31.084302	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
817	2025	5	\N	0	0	0	0	0	0	2025-05-19 10:58:57.827	2025-05-19 10:58:57.844982	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
818	2025	6	\N	0	0	0	0	0	0	2025-06-09 10:44:01.414	2025-06-09 10:44:01.429575	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
819	2025	6	\N	0	0	0	0	0	0	2025-06-09 10:44:14.904	2025-06-09 10:44:14.919925	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
820	2025	6	\N	0	0	0	0	0	0	2025-06-09 10:44:26.338	2025-06-09 10:44:26.353705	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
821	2025	6	\N	75051.052	75255.26	11293939.772000002	75000	14098610.9	4749622.053333334	2025-06-10 21:34:46.639743	2025-06-10 21:34:46.639743	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
822	2025	6	\N	0	0	0	0	0	0	2025-06-10 21:35:40.074	2025-06-10 21:35:40.091298	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
823	2025	6	\N	0	0	0	0	0	0	2025-06-10 21:35:44.514	2025-06-10 21:35:44.529837	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
824	2025	6	\N	0	0	0	0	0	0	2025-06-10 21:35:48.523	2025-06-10 21:35:48.538233	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
825	2025	6	\N	75051.052	75255.26	11293939.772000002	75000	14098610.9	4749622.053333334	2025-06-10 21:36:27.297237	2025-06-10 21:36:27.297237	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
826	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:01:53.229	2025-06-10 22:01:53.245664	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
827	2025	6	\N	75025.526	75127.63	75229.734	75000	75255.26	75127.63	2025-06-10 22:06:50.595918	2025-06-10 22:06:50.595918	2	0	1	1	0	293343.34	150255.27	75127.63	75127.63	75242.5	75252.71	[{"impact": 75255.26, "probability": 0.5}, {"impact": 75000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
828	2025	6	\N	75000	75000	75000	75000	75000	75000	2025-06-10 22:08:07.873057	2025-06-10 22:08:07.873057	1	0	1	0	0	150000	75000	75000	75000	75000	75000	[{"impact": 75000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
829	2025	6	\N	75000	75000	75000	75000	75000	75000	2025-06-10 22:08:39.849656	2025-06-10 22:08:39.849656	1	0	1	0	0	150000	75000	75000	75000	75000	75000	[{"impact": 75000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
830	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:19:23.528	2025-06-10 22:19:23.545141	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
831	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:27:26.916	2025-06-10 22:27:26.932259	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
832	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:32:32.215	2025-06-10 22:32:32.232871	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
833	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:36:25.87	2025-06-10 22:36:25.886083	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
834	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:53:07.178	2025-06-10 22:53:07.194155	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
835	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:53:14.786	2025-06-10 22:53:14.802068	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
836	2025	6	\N	0	0	0	0	0	0	2025-06-10 22:53:32.013	2025-06-10 22:53:32.028163	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
837	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:05:22.618	2025-06-10 23:05:22.633952	0	0	0	0	0	5.2636216e+07	5.2636216e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
838	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:05:53.289	2025-06-10 23:05:53.30457	0	0	0	0	0	5.2636216e+07	5.2636216e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
839	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:06:18.953	2025-06-10 23:06:18.969252	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
840	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:08:34.185	2025-06-10 23:08:34.200764	0	0	0	0	0	5.0293904e+07	2.7661648e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
841	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:09:11.591	2025-06-10 23:09:11.606736	0	0	0	0	0	5.0293904e+07	4.5013044e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
842	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:13:07.56	2025-06-10 23:13:07.576217	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
843	2025	6	\N	0	30930752.17	30930752.17	0	30930752.17	30930752.17	2025-06-10 23:18:05.992803	2025-06-10 23:18:05.992803	1	0	1	0	0	5.0293904e+07	3.0930752e+07	3.0930752e+07	3.0930752e+07	3.0930752e+07	3.0930752e+07	[]	0	0	0	0	0	\N	\N	\N
844	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:20:55.812	2025-06-10 23:20:55.827897	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
845	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:21:13.305	2025-06-10 23:21:13.320488	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
846	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:22:37.268	2025-06-10 23:22:37.283187	0	0	0	0	0	7.801159e+07	5.8648436e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
847	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:23:05.881	2025-06-10 23:23:05.897158	0	0	0	0	0	7.801159e+07	5.8648436e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
848	2025	6	\N	18684273.034	24127152.65	29570032.266000003	17323553.13	30930752.17	24127152.65	2025-06-10 23:29:18.505937	2025-06-10 23:29:18.505937	2	1	1	0	0	7.801159e+07	4.8254304e+07	2.4127152e+07	2.4127152e+07	3.0250392e+07	3.079468e+07	[{"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
849	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:31:12.426	2025-06-10 23:31:12.445829	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
850	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:31:26.428	2025-06-10 23:31:26.44396	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
851	2025	6	\N	20044992.938	30930752.17	108052532.39400001	17323553.13	127332977.45	58529094.25	2025-06-10 23:32:26.211916	2025-06-10 23:32:26.211916	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
852	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:37:45.211	2025-06-10 23:37:45.226652	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
853	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:39:35.146	2025-06-10 23:39:35.162354	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
854	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:40:04.488	2025-06-10 23:40:04.50423	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
855	2025	6	\N	5207565.939	24127152.65	98412309.86600001	15000	127332977.45	43900570.6875	2025-06-10 23:41:41.935875	2025-06-10 23:41:41.935875	4	1	1	2	0	2.0536957e+08	1.7560229e+08	4.3900572e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 15000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
856	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:43:34.225	2025-06-10 23:43:34.241902	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
857	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:44:43.999	2025-06-10 23:44:44.01693	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
858	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:45:29.201	2025-06-10 23:45:29.216857	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
859	2025	6	\N	0	0	0	0	0	0	2025-06-10 23:45:57.476	2025-06-10 23:45:57.492783	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
860	2025	6	\N	5207565.939	24127152.65	98412309.86600001	15000	127332977.45	43900570.6875	2025-06-10 23:46:10.163123	2025-06-10 23:46:10.163123	4	1	1	2	0	2.0536957e+08	1.7560229e+08	4.3900572e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 15000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
861	2025	6	\N	0	0	0	0	0	0	2025-06-11 17:06:47.397	2025-06-11 17:06:47.413615	0	0	0	0	0	0	0	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
862	2025	6	\N	0	0	0	15000	127332977.45	43900570.69	2025-06-12 10:14:09.93889	2025-06-12 10:14:09.93889	5	1	1	3	0	2.0538458e+08	1.7560229e+08	4.3900572e+07	2.4127152e+07	1.1287265e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 15000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
863	2025	6	\N	5207565.939	24127152.65	98412309.86600001	15000	127332977.45	43900570.6875	2025-06-12 10:19:26.517878	2025-06-12 10:19:26.517878	4	1	1	2	0	2.0536957e+08	1.7560229e+08	4.3900572e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 15000, "probability": 1}]	0	0	0	0	0	\N	\N	\N
864	2025	6	\N	0	0	0	1319889.55	127332977.45	44226793.075	2025-06-12 12:03:42.8	2025-06-12 12:03:42.8	4	1	1	2	0	2.0666446e+08	1.7690717e+08	4.4226792e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[]	0	0	0	0	0	\N	\N	\N
865	2025	6	\N	0	0	0	1319889.55	127332977.45	44226793.075	2025-06-12 12:05:57.219	2025-06-12 12:05:57.219	4	1	1	2	0	2.0666446e+08	1.7690717e+08	4.4226792e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.25}, {"impact": 30930752.17, "probability": 0.5}, {"impact": 17323553.13, "probability": 0.75}, {"impact": 1319889.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
866	2025	6	\N	20044992.938	30930752.17	108052532.39400001	17323553.13	127332977.45	58529094.25	2025-06-12 12:06:06.400616	2025-06-12 12:06:06.400616	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
867	2025	6	\N	0	0	0	17323553.13	127332977.45	58529094.25	2025-06-12 12:06:06.475	2025-06-12 12:06:06.475	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
868	2025	6	\N	0	0	0	0	127332977.45	43896820.6875	2025-06-12 12:06:24.127	2025-06-12 12:06:24.127	4	1	1	2	0	2.0534458e+08	1.7558728e+08	4.389682e+07	2.4127152e+07	1.1287264e+08	1.2444091e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
869	2025	6	\N	20044992.938	30930752.17	108052532.39400001	17323553.13	127332977.45	58529094.25	2025-06-12 12:19:02.577153	2025-06-12 12:19:02.577153	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
870	2025	6	\N	17323553.13	58529093.333333336	114599679.705	17323553.13	127332977.45	58529094.25	2025-06-12 12:19:02.712	2025-06-12 12:27:58.135445	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
871	2025	6	\N	0	0	0	0	0	0	2025-06-13 09:26:02.293	2025-06-13 09:26:02.310738	0	0	0	0	0	2.0534458e+08	1.7558728e+08	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
872	2025	6	\N	17323553.13	58529094.25	117692754.92199999	17323553.13	127332977.45	58529094.25	2025-06-13 09:55:47.974	2025-06-13 09:55:47.974	3	1	1	1	0	2.0534458e+08	1.7558728e+08	5.8529096e+07	3.0930752e+07	1.1769275e+08	1.25404936e+08	[{"impact": 127332977.45, "probability": 0.3333333333333333}, {"impact": 30930752.17, "probability": 0.6666666666666666}, {"impact": 17323553.13, "probability": 1}]	0	0	0	0	0	\N	\N	\N
873	2025	6	\N	13492236.02	20582180.44	29570032.266000003	13492236.02	30930752.17	20582180.44	2025-06-13 09:55:51.183	2025-06-13 09:55:51.183	3	1	1	1	0	9.1503824e+07	6.174654e+07	2.058218e+07	1.7323554e+07	2.9570032e+07	3.0658608e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 17323553.13, "probability": 0.6666666666666666}, {"impact": 13492236.02, "probability": 1}]	0	0	0	0	0	\N	\N	\N
874	2025	6	\N	13492236.02	20582180.44	29570032.266000003	13492236.02	30930752.17	20582180.44	2025-06-13 09:55:57.444	2025-06-13 09:55:57.444	3	1	1	1	0	9.1503824e+07	6.174654e+07	2.058218e+07	1.7323554e+07	2.9570032e+07	3.0658608e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 17323553.13, "probability": 0.6666666666666666}, {"impact": 13492236.02, "probability": 1}]	0	0	0	0	0	\N	\N	\N
875	2025	6	\N	0	0	0	0	0	0	2025-06-13 10:05:01.526	2025-06-13 10:05:01.544024	0	0	0	0	0	9.1503824e+07	6.174654e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
876	2025	6	\N	13492236.02	22314535.753333334	30089738.86	13492236.02	30930752.17	22314535.753333334	2025-06-13 10:18:45.024	2025-06-13 10:18:45.024	3	1	1	1	0	9.1503824e+07	6.6943608e+07	2.2314536e+07	2.252062e+07	3.0089738e+07	3.076255e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 22520619.07, "probability": 0.6666666666666666}, {"impact": 13492236.02, "probability": 1}]	0	0	0	0	0	\N	\N	\N
877	2025	6	\N	2252065.12	15558351.103333334	29186900.555	2252065.12	30930752.17	15558351.103333334	2025-06-13 10:18:49.591	2025-06-13 10:18:49.591	3	1	1	1	0	6.6557916e+07	4.6675052e+07	1.5558351e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2252065.12, "probability": 1}]	0	0	0	0	0	\N	\N	\N
878	2025	6	\N	0	0	0	0	0	0	2025-06-13 10:32:30.056	2025-06-13 10:32:30.071876	0	0	0	0	0	6.6557916e+07	4.6675052e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
879	2025	6	\N	0	0	0	0	0	0	2025-06-13 10:32:36.409	2025-06-13 10:32:36.424822	0	0	0	0	0	6.6557916e+07	4.6675052e+07	0	0	0	0	[]	0	0	0	0	0	\N	\N	\N
880	2025	6	\N	2258994.55	15560660.913333334	29186900.555	2258994.55	30930752.17	15560660.913333334	2025-06-13 10:33:50.794	2025-06-13 10:33:50.794	3	1	1	1	0	6.6557916e+07	4.6681984e+07	1.5560661e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2258994.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
881	2025	6	\N	2258994.55	15560660.913333334	29186900.555	2258994.55	30930752.17	15560660.913333334	2025-06-13 10:39:55.813	2025-06-13 10:39:55.813	3	1	1	1	0	6.6557916e+07	4.6681984e+07	1.5560661e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2258994.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
882	2025	6	\N	2258994.55	15560660.913333334	29186900.555	2258994.55	30930752.17	15560660.913333334	2025-06-13 10:39:56.318	2025-06-13 10:39:56.318	3	1	1	1	0	6.6557916e+07	4.6681984e+07	1.5560661e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2258994.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
883	2025	6	\N	2258994.55	15560660.913333334	29186900.555	2258994.55	30930752.17	15560660.913333334	2025-06-13 10:39:56.753	2025-06-13 10:39:56.753	3	1	1	1	0	6.6557916e+07	4.6681984e+07	1.5560661e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2258994.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
884	2025	6	\N	2258994.55	15560660.913333334	29186900.555	2258994.55	30930752.17	15560660.913333334	2025-06-13 10:39:57.386	2025-06-13 10:39:57.386	3	1	1	1	0	6.6557916e+07	4.6681984e+07	1.5560661e+07	1.3492236e+07	2.91869e+07	3.0581982e+07	[{"impact": 30930752.17, "probability": 0.3333333333333333}, {"impact": 13492236.02, "probability": 0.6666666666666666}, {"impact": 2258994.55, "probability": 1}]	0	0	0	0	0	\N	\N	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
Sn_zxGy9ySXmlaUy6gZzR3d8JoQItBKV	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-16T09:20:52.029Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-16 09:20:57
a99dgvgd5JotI99Kyagdgm0dhNGLl5WO	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-17T17:27:36.823Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-17 17:27:54
m8rAQcoooJVYfk-3NzSzpMW0QjCL4178	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-17T17:48:11.982Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-17 23:17:36
Xi8nywV_WGkhviXhPARkU-yu7g5GBIIy	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-17T17:41:51.578Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-17 17:42:15
DpfGyVk-RHBCwUSBHKWXM5UOmttVwbUN	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-16T12:51:26.830Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-16 12:51:27
y_xVnMpp_gmzIAa0hxMH6f9FuD5lDqCI	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-17T17:43:59.164Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-17 17:44:11
TrHVU7AIxYc1ccb2KGwOGioFco7Env8l	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-18T17:07:50.555Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-19 13:03:20
OS-LhknS7PrzPY6JC3T2y8A_i-q1Mt2z	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-18T17:05:29.134Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-18 17:07:24
NzFn5k4UXoFtMmX7kpO5e_dAQdr1VpmP	{"cookie":{"originalMaxAge":604800000,"expires":"2025-06-16T09:21:30.531Z","secure":false,"httpOnly":true,"path":"/"},"user":{"id":1,"authType":"local","role":"admin","username":"admin","email":"admin@company.com","displayName":"System Administrator"}}	2025-06-20 10:40:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) FROM stdin;
4	testadmin	test@company.com	Test Administrator	$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW	user	local	t	0	\N	\N	2025-05-23 12:45:49.838796	2025-06-11 17:00:40.329	\N	100	\N	\N	\N	Test	Admin	\N	\N	\N	f	\N	UTC	en	\N	\N	\N	\N	0	2025-05-23 12:45:57.139
1	admin	admin@company.com	System Administrator	$2b$12$9abLx/8d1W.mSMdq1PTu1uYV4zvaY1crKCFLiFLh47ezCBHg2f3Ky	admin	local	t	0	\N	2025-06-11 17:07:50.52	2025-05-23 11:42:24.459027	2025-06-10 17:48:17.243	\N	100	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	UTC	en	\N	\N	\N	\N	15	\N
\.


--
-- Data for Name: vulnerabilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vulnerabilities (id, cve_id, discovery_date, severity_cvss3, exploitability_subscore, impact_subscore, temporal_score, status, remediation_date, patchable, source, e_detect, e_resist, variance_freq, variance_duration, created_at, updated_at, title, description, cvss_score, cvss_vector, discovered_date, remediated_date, published_date, modified_date, e_detect_impact, e_resist_impact, vuln_references, tags, remediation, severity) FROM stdin;
8	CVE-2024-0001	2025-06-06 00:35:08.966349	9.80	\N	\N	\N	open	\N	t	scanner	\N	\N	\N	\N	2025-06-11 00:35:08.966349	2025-06-11 00:35:08.966349	Critical Remote Code Execution	A critical vulnerability allowing remote code execution in web applications	9.8	CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H	2025-06-06 00:35:08.966349	\N	\N	\N	0.3	0.4	[]	[]	\N	critical
9	CVE-2024-0002	2025-06-01 00:35:08.966349	8.10	\N	\N	\N	in_progress	\N	t	scanner	\N	\N	\N	\N	2025-06-11 00:35:08.966349	2025-06-11 00:35:08.966349	SQL Injection in Database Layer	SQL injection vulnerability in the database access layer	8.1	CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N	2025-06-01 00:35:08.966349	\N	\N	\N	0.2	0.3	[]	[]	\N	high
10	CVE-2024-0003	2025-06-08 00:35:08.966349	6.10	\N	\N	\N	open	\N	t	pen_test	\N	\N	\N	\N	2025-06-11 00:35:08.966349	2025-06-11 00:35:08.966349	Cross-Site Scripting Vulnerability	Stored XSS vulnerability in user input fields	6.1	CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N	2025-06-08 00:35:08.966349	\N	\N	\N	0.1	0.1	[]	[]	\N	medium
11	CVE-2024-0004	2025-05-27 00:35:08.966349	5.30	\N	\N	\N	remediated	\N	t	manual	\N	\N	\N	\N	2025-06-11 00:35:08.966349	2025-06-11 00:35:08.966349	Information Disclosure	Sensitive information disclosed in error messages	5.3	CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N	2025-05-27 00:35:08.966349	\N	\N	\N	0.05	0	[]	[]	\N	medium
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 308, true);


--
-- Name: asset_relationships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asset_relationships_id_seq', 1, false);


--
-- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assets_id_seq', 33, true);


--
-- Name: auth_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_config_id_seq', 1, true);


--
-- Name: control_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.control_library_id_seq', 492, true);


--
-- Name: controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.controls_id_seq', 37, true);


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

SELECT pg_catalog.setval('public.legal_entities_id_seq', 13, true);


--
-- Name: response_cost_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.response_cost_modules_id_seq', 1, false);


--
-- Name: risk_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_controls_id_seq', 6, true);


--
-- Name: risk_costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_costs_id_seq', 20, true);


--
-- Name: risk_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_library_id_seq', 27, true);


--
-- Name: risk_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_responses_id_seq', 3, true);


--
-- Name: risk_summaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risk_summaries_id_seq', 884, true);


--
-- Name: risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.risks_id_seq', 57, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vulnerabilities_id_seq', 11, true);


--
-- PostgreSQL database dump complete
--

