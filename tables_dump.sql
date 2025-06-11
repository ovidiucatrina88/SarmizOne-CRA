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

DROP INDEX IF EXISTS public.idx_cost_modules_cis_control;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.risk_library DROP CONSTRAINT IF EXISTS risk_library_risk_id_unique;
ALTER TABLE IF EXISTS ONLY public.risk_library DROP CONSTRAINT IF EXISTS risk_library_pkey;
ALTER TABLE IF EXISTS ONLY public.cost_modules DROP CONSTRAINT IF EXISTS cost_modules_pkey;
ALTER TABLE IF EXISTS ONLY public.control_library DROP CONSTRAINT IF EXISTS control_library_pkey;
ALTER TABLE IF EXISTS ONLY public.control_library DROP CONSTRAINT IF EXISTS control_library_control_id_unique;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.risk_library ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.cost_modules ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.control_library ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.risk_library_id_seq;
DROP TABLE IF EXISTS public.risk_library;
DROP SEQUENCE IF EXISTS public.cost_modules_id_seq;
DROP TABLE IF EXISTS public.cost_modules;
DROP SEQUENCE IF EXISTS public.control_library_id_seq;
DROP TABLE IF EXISTS public.control_library;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: control_library; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.control_library (
    id integer NOT NULL,
    control_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    control_type public.control_type NOT NULL,
    control_category public.control_category NOT NULL,
    implementation_status public.implementation_status DEFAULT 'planned'::public.implementation_status NOT NULL,
    control_effectiveness real DEFAULT 0 NOT NULL,
    implementation_cost numeric(38,2) DEFAULT 0 NOT NULL,
    cost_per_agent numeric(38,2) DEFAULT 0 NOT NULL,
    is_per_agent_pricing boolean DEFAULT false NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    nist_csf text[] DEFAULT '{}'::text[] NOT NULL,
    iso27001 text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    associated_risks text[],
    library_item_id integer,
    item_type text,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer,
    CONSTRAINT control_library_item_type_check CHECK ((item_type = ANY (ARRAY['template'::text, 'instance'::text])))
);


ALTER TABLE public.control_library OWNER TO neondb_owner;

--
-- Name: control_library_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.control_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.control_library_id_seq OWNER TO neondb_owner;

--
-- Name: control_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.control_library_id_seq OWNED BY public.control_library.id;


--
-- Name: cost_modules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cost_modules (
    id integer NOT NULL,
    name text NOT NULL,
    cis_control text[] NOT NULL,
    cost_factor numeric NOT NULL,
    cost_type text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.cost_modules OWNER TO neondb_owner;

--
-- Name: cost_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cost_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cost_modules_id_seq OWNER TO neondb_owner;

--
-- Name: cost_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cost_modules_id_seq OWNED BY public.cost_modules.id;


--
-- Name: risk_library; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.risk_library (
    id integer NOT NULL,
    risk_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    threat_community text DEFAULT ''::text NOT NULL,
    vulnerability text DEFAULT ''::text NOT NULL,
    risk_category public.risk_category NOT NULL,
    severity public.severity DEFAULT 'medium'::public.severity NOT NULL,
    contact_frequency_min real DEFAULT 0 NOT NULL,
    contact_frequency_avg real DEFAULT 0 NOT NULL,
    contact_frequency_max real DEFAULT 0 NOT NULL,
    contact_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    probability_of_action_min real DEFAULT 0 NOT NULL,
    probability_of_action_avg real DEFAULT 0 NOT NULL,
    probability_of_action_max real DEFAULT 0 NOT NULL,
    probability_of_action_confidence text DEFAULT 'Medium'::text NOT NULL,
    threat_capability_min real DEFAULT 0 NOT NULL,
    threat_capability_avg real DEFAULT 0 NOT NULL,
    threat_capability_max real DEFAULT 0 NOT NULL,
    threat_capability_confidence text DEFAULT 'Medium'::text NOT NULL,
    resistance_strength_min real DEFAULT 0 NOT NULL,
    resistance_strength_avg real DEFAULT 0 NOT NULL,
    resistance_strength_max real DEFAULT 0 NOT NULL,
    resistance_strength_confidence text DEFAULT 'Medium'::text NOT NULL,
    primary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_event_frequency_min real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_max real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    recommended_controls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.risk_library OWNER TO neondb_owner;

--
-- Name: risk_library_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.risk_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.risk_library_id_seq OWNER TO neondb_owner;

--
-- Name: risk_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.risk_library_id_seq OWNED BY public.risk_library.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50),
    email character varying(255),
    display_name character varying(255) NOT NULL,
    password_hash character varying(255),
    role character varying(10) DEFAULT 'user'::character varying NOT NULL,
    auth_type character varying(10) DEFAULT 'local'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp without time zone,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    password_salt character varying(255),
    password_iterations integer DEFAULT 100,
    account_locked_until timestamp without time zone,
    sso_subject character varying(255),
    sso_provider character varying(100),
    first_name character varying(255),
    last_name character varying(255),
    profile_image_url character varying(500),
    created_by integer,
    updated_by integer,
    is_email_verified boolean DEFAULT false,
    email_verified_at timestamp without time zone,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    language character varying(10) DEFAULT 'en'::character varying,
    phone character varying(20),
    department character varying(100),
    job_title character varying(100),
    manager_id integer,
    login_count integer DEFAULT 0,
    last_failed_login timestamp without time zone
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: control_library id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.control_library ALTER COLUMN id SET DEFAULT nextval('public.control_library_id_seq'::regclass);


--
-- Name: cost_modules id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cost_modules ALTER COLUMN id SET DEFAULT nextval('public.cost_modules_id_seq'::regclass);


--
-- Name: risk_library id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_library ALTER COLUMN id SET DEFAULT nextval('public.risk_library_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: control_library; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.control_library (id, control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count) FROM stdin;
5	CIS-6-TPL	Access Control Management	Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts for enterprise assets and software.	preventive	administrative	not_implemented	8.2	9000.00	45.00	t	CIS Controls v8.1.2, March 2025	{}	{}	2025-05-15 13:17:57.9737	2025-05-15 13:17:57.9737	\N	\N	template	\N	\N	\N	\N
54	3.11	Encrypt Sensitive Data at Rest	Use server-side or client-side encryption on storage.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
55	3.12	Segment Data Processing and Storage Based on Sensitivity	Isolate sensitive data in separate enclaves.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
56	3.13	Deploy a Data Loss Prevention Solution	Monitor and block unauthorized data exfiltration.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
57	3.14	Log Sensitive Data Access	Record read/write on high-value data.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
58	4.1	Establish and Maintain a Secure Configuration Process	Define and document secure baselines & change controls.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
59	4.2	Establish and Maintain a Secure Configuration Process for Network Infrastructure	Document secure baselines for firewalls, switches, routers.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
60	4.3	Configure Automatic Session Locking on Enterprise Assets	Lock sessions after defined inactivity periods.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
77	6.2	Establish and Maintain an Inventory of Access Permissions	Catalog all permission assignments.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
78	6.3	User Access Reviews	Quarterly review of user permissions.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
79	6.4	Implement MFA for all Remote Access	Enforce MFA on VPN, RDP, SSH.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
80	6.5	Implement MFA for All User Access to Privileged Accounts	Require MFA for admin consoles, APIs.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
81	6.6	Ensure Use of Unique Credentials for Each Person	Eliminate shared accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
82	6.7	Deny Access Based on Geolocation/IP Reputation	Block high-risk geos or Tor exit nodes.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
83	6.8	Remove/Disable Access Immediately Upon Role Change or Termination	Automate deprovisioning.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
101	9.2	Ensure Use of Safe Email Gateways	Enforce URL/link scanning in mail.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
102	9.3	Block Access to Known Malicious Websites	DNS/URL filtering at perimeter.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
103	9.4	Restrict Execution of Office Macros	Block or sandbox untrusted macros.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
104	9.5	Enforce Browser Sandboxing	Isolate web sessions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
105	9.6	Enforce URL Reputation/DNS Filtering	Block domains with bad reputations.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
111	11.1	Establish and Maintain a Data Recovery Process	Document RTO/RPO & workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
112	11.2	Perform Regular Automated Backups of Critical Data	Schedule frequent backups.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
113	11.3	Store Backups Offline and/or Off-site	Air-gap or cloud storage.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
114	11.4	Perform Backup Integrity Verification	Regularly test restoration.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
115	11.5	Document and Test Recovery Procedures	Run DR drills.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
116	11.6	Maintain Backup Logs and Monitoring	Track backup success/failures.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
117	12.1	Establish and Maintain a Network Infrastructure Process	Document network standards & review cycles.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
118	12.2	Ensure Use of Secure Network Diagrams	Maintain up-to-date, access-controlled maps.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
119	12.3	Manage Network Device Configurations Securely	Version control & peer reviews.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
120	12.4	Perform Regular Network Device Firmware Updates	Stay current on patches.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
121	12.5	Enforce Network Segmentation	Isolate critical assets.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
122	12.6	Implement Secure Remote Management	Use VPN/SSH with MFA.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
32	1.1	Establish and Maintain Detailed Enterprise Asset Inventory	Maintain an accurate, detailed inventory of all enterprise assets.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
33	1.2	Address Unauthorized Assets	Process to identify and remove or quarantine unauthorized assets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
34	1.3	Utilize an Active Discovery Tool	Automate daily active scans to discover assets on the network.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
35	1.4	Use DHCP Logging to Update Enterprise Asset Inventory	Parse DHCP logs to enrich asset inventory.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
36	1.5	Use a Passive Asset Discovery Tool	Monitor network traffic passively to identify assets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
37	2.1	Establish and Maintain a Software Inventory	Maintain a current inventory of all installed software.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
38	2.2	Ensure Authorized Software is Currently Supported	Flag unsupported software and document exceptions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
39	2.3	Address Unauthorized Software	Remove or quarantine unauthorized software installations.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
40	2.4	Utilize Automated Software Inventory Tools	Use automated tools to discover and catalog software.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
41	2.5	Allowlist Authorized Software	Only permit execution of approved software.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
42	2.6	Allowlist Authorized Libraries	Only permit loading of approved system libraries.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
43	2.7	Allowlist Authorized Scripts	Only permit execution of approved scripts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
44	3.1	Establish and Maintain a Data Management Process	Document processes for data classification, handling, retention, and disposal.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
45	3.2	Establish and Maintain a Data Inventory	Catalog all sensitive data and its locations.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
46	3.3	Configure Data Access Control Lists	Enforce least-privilege data access permissions.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
47	3.4	Enforce Data Retention	Ensure data is kept only as long as permitted.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
48	3.5	Securely Dispose of Data	Destroy data in accordance with retention policies.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
84	7.1	Establish and Maintain a Vulnerability Management Process	Document VM workflow & SLAs.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
85	7.2	Ensure Use of Up-to-Date Vulnerability Scanning Tools	Regularly update scanning engine/DB.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
86	7.3	Perform Authenticated Vulnerability Scans	Use credentials for deeper discovery.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
87	7.4	Remediate Identified Vulnerabilities in a Timely Manner	Track & fix CVEs per SLA.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
88	7.5	Perform Malware Scanning of All Files	Endpoint scanning of all file sources.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
89	7.6	Perform Internal Vulnerability Scanning	Scan internal subnets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
90	7.7	Perform External Vulnerability Scanning	Scan public IPs from the Internet.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
91	7.8	Facilitate Automated Threat Intelligence Feeds	Ingest CVE/IOC feeds.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
92	7.9	Remediate Vulnerabilities in Custom Code	SDLC integration for code flaws.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
93	7.10	Perform Automated Configuration Management Scans	Detect drift from secure baselines.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
94	8.1	Establish and Maintain an Audit Log Management Process	Document log types, retention, and review.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
95	8.2	Ensure Logging is Enabled on All Systems	Enable OS, application, network logs.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
96	8.3	Ensure Logs are Collected Centrally	Ship logs to SIEM or log server.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
97	8.4	Secure Audit Logs Against Unauthorized Access	Protect integrity of log store.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
98	8.5	Perform Log Reviews at Least Daily	Automated or manual daily reviews.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
99	8.6	Retain Audit Logs for at Least One Year	Ensure compliance retention.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
100	9.1	Deploy Email Anti-Phishing and Spam Filtering	Block malicious email campaigns.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.539812	\N	\N	\N	\N	\N	\N	\N
106	10.1	Establish and Maintain Malware Defense Process	Document AV/EDR workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
107	10.2	Deploy Anti-Malware/EDR on All End-Points	Install agents enterprise-wide.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
108	10.3	Ensure Automatic Updates of Signatures/Engines	Keep EDR definitions current.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
109	10.4	Enforce Host-Based Detection Policies	Configure policies in EDR.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
110	10.5	Perform Automated Quarantine and Remediation	Block or auto-remediate infections.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
49	3.6	Encrypt Data on End-User Devices	Use full-disk encryption on laptops and mobiles.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
50	3.7	Establish and Maintain a Data Classification Scheme	Apply labels such as Confidential, Internal, Public.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
51	3.8	Document Data Flows	Diagram how data moves among systems and services.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
52	3.9	Encrypt Data on Removable Media	Enforce encryption on USBs, external drives.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
53	3.10	Encrypt Sensitive Data in Transit	Use TLS/SSH for all sensitive communications.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
61	4.4	Implement and Manage a Firewall on Servers	Use host-based or network firewalls on servers.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
62	4.5	Implement and Manage a Firewall on End-User Devices	Enforce host firewalls on workstations/laptops.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
63	4.6	Securely Manage Enterprise Assets and Software	Use SSH/HTTPS for admin and IaC for configs.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
64	4.7	Manage Default Accounts on Enterprise Assets and Software	Disable or rename vendor default accounts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
65	4.8	Uninstall or Disable Unnecessary Services on Enterprise Assets and Software	Remove unused services and applications.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
66	4.9	Configure Trusted DNS Servers on Enterprise Assets	Point to enterprise or known-good DNS.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
67	4.10	Enforce Automatic Device Lockout on Portable End-User Devices	Lock after failed auth attempts.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
68	4.11	Enforce Remote Wipe Capability on Portable End-User Devices	Be able to erase lost/stolen devices.	corrective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
69	4.12	Separate Enterprise Workspaces on Mobile End-User Devices	Use containerization or work profiles.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
70	5.1	Establish and Maintain an Inventory of Accounts	Catalog user, admin, and service accounts.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
71	5.2	Use Unique Passwords	Prevent password reuse across accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
72	5.3	Disable Dormant Accounts	Disable accounts after 45 days of inactivity.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
73	5.4	Restrict Administrator Privileges to Dedicated Administrator Accounts	Do not do general computing with admin accounts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
74	5.5	Establish and Maintain an Inventory of Service Accounts	Track purpose, owner, and review dates.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
75	5.6	Centralize Account Management	Use AD, LDAP, or equivalent directory.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
76	6.1	Establish and Maintain an Access Control Policy	Document roles & permission models.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.889698	2025-05-18 17:18:40.475497	\N	\N	\N	\N	\N	\N	\N
123	12.7	Restrict Unused Network Ports and Protocols	Disable non-essential ports.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
124	12.8	Continuously Monitor Network Device Health	Alert on anomalies.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
125	13.1	Establish and Maintain a Network Monitoring Process	Document NOC/SOC workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
126	13.2	Deploy IDS/IPS and NDR Solutions	Detect network threats in real-time.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
127	13.3	Monitor for Unauthorized Lateral Movement	Alert on horizontal traffic anomalies.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
128	13.4	Analyze Network Flows for Anomalies	Use NetFlow, packet analysis.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
129	13.5	Implement Network Deception Technologies	Deploy honeypots/honeynets.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
130	13.6	Ensure High-Fidelity Alerting	Reduce false positives.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
131	13.7	Perform Regular Network Traffic Baseline Analysis	Establish normal patterns.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
132	13.8	Detect and Respond to Rogue Wireless Access Points	Scan for unauthorized APs.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
133	13.9	Integrate Network Alerts into SIEM	Centralize network event correlation.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:40.976626	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
134	14.1	Establish and Maintain a Security Awareness Program	Document annual training plans.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
135	14.2	Provide Role-Based Security Training	Customize content by job function.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
136	14.3	Test User Phishing Susceptibility Quarterly	Simulate phishing campaigns.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
137	14.4	Measure and Report Training Effectiveness	Track metrics & KPIs.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
138	14.5	Update Training Content Annually	Refresh modules each year.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
139	15.1	Establish and Maintain a Service Provider Management Process	Document third-party risk workflows.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
140	15.2	Inventory All Third-Party Service Providers	Catalog vendors & services.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
141	15.3	Define and Enforce Security Requirements in SLAs	Embed controls into contracts.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
142	15.4	Perform Onboarding and Offboarding Reviews	Validate vendor access lifecycle.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
143	15.5	Monitor Third-Party Compliance Continuously	Use questionnaires & attestations.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
144	15.6	Conduct Periodic Third-Party Assessments	Audit or pen-test vendors.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
145	15.7	Maintain Evidence of Third-Party Security Compliance	Store reports & certifications.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
146	16.1	Establish and Maintain an Application Security Process	Document SDLC security gates.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
147	16.2	Inventory All In-House and Third-Party Apps	Catalog codebases & binaries.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
148	16.3	Implement DevSecOps Toolchain	Integrate SAST/DAST into CI/CD.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
149	16.4	Perform Static Application Security Testing (SAST)	Scan source code for flaws.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
150	16.5	Perform Dynamic Application Security Testing (DAST)	Test APIs/web apps at runtime.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
151	16.6	Enforce Secure Coding Standards	Adopt OWASP/SEI rules.	preventive	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
152	16.7	Conduct Periodic Code Reviews	Peer review security logic.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
153	16.8	Remediate Application Vulnerabilities	Track & fix in sprint backlog.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
154	16.9	Monitor Application Behavior in Production	Runtime protection & logging.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
155	17.1	Establish and Maintain an Incident Response Process	Document IR plan & SLAs.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
156	17.2	Define and Train IR Team Roles	Assign roles & run drills.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
157	17.3	Maintain Incident Playbooks	Keep runbooks for common events.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
158	17.4	Conduct Table-Top Exercises Quarterly	Simulate incidents with stakeholders.	detective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
159	17.5	Perform Post-Incident Reviews and Lessons Learned	Update processes after each event.	corrective	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
160	18.1	Establish and Maintain a Pen Test Program	Define scope, cadence, and reporting.	preventive	administrative	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
161	18.2	Perform External Penetration Testing Annually	Engage third-parties externally.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
162	18.3	Perform Internal Penetration Testing Annually	Run internal red-team exercises.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
163	18.4	Validate Remediation of Pen Test Findings	Re-test to confirm fixes.	detective	technical	planned	0	0.00	0.00	f		{}	{}	2025-05-18 12:40:41.015923	2025-05-18 17:18:40.577296	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: cost_modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Data for Name: risk_library; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) FROM stdin;
2	M-admin	m@admin.com	M-admin admin	$2b$12$WKKV/3V0TeqXY/y3op4Ksurl1rQPmbovmvlxbpS8c1sUmKtiU4tKG	admin	local	t	0	\N	\N	2025-05-23 12:24:14.509455	2025-05-23 12:24:14.509455	\N	100	\N	\N	\N	M-admin	admin	\N	1	\N	f	\N	UTC	en	\N	\N	\N	\N	0	\N
1	admin	admin@company.com	System Administrator	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	admin	local	t	0	\N	2025-06-10 17:48:16.863	2025-05-23 11:42:24.459027	2025-06-10 17:48:17.243	\N	100	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	UTC	en	\N	\N	\N	\N	13	\N
4	testadmin	test@company.com	Test Administrator	$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW	admin	local	t	1	\N	\N	2025-05-23 12:45:49.838796	2025-06-10 17:30:09.639	\N	100	\N	\N	\N	Test	Admin	\N	\N	\N	f	\N	UTC	en	\N	\N	\N	\N	0	2025-05-23 12:45:57.139
\.


--
-- Name: control_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.control_library_id_seq', 295, true);


--
-- Name: cost_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cost_modules_id_seq', 10, true);


--
-- Name: risk_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.risk_library_id_seq', 27, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: control_library control_library_control_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.control_library
    ADD CONSTRAINT control_library_control_id_unique UNIQUE (control_id);


--
-- Name: control_library control_library_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.control_library
    ADD CONSTRAINT control_library_pkey PRIMARY KEY (id);


--
-- Name: cost_modules cost_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cost_modules
    ADD CONSTRAINT cost_modules_pkey PRIMARY KEY (id);


--
-- Name: risk_library risk_library_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_library
    ADD CONSTRAINT risk_library_pkey PRIMARY KEY (id);


--
-- Name: risk_library risk_library_risk_id_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.risk_library
    ADD CONSTRAINT risk_library_risk_id_unique UNIQUE (risk_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_cost_modules_cis_control; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_cost_modules_cis_control ON public.cost_modules USING gin (cis_control);


--
-- PostgreSQL database dump complete
--

