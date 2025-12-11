CREATE TYPE "public"."asset_status" AS ENUM('Active', 'Decommissioned', 'To Adopt');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('data', 'application', 'device', 'system', 'network', 'facility', 'personnel', 'other', 'application_service', 'technical_component');--> statement-breakpoint
CREATE TYPE "public"."auth_type" AS ENUM('local', 'sso');--> statement-breakpoint
CREATE TYPE "public"."cia_rating" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."compliance_framework" AS ENUM('CIS', 'NIST', 'ISO27001', 'SOC2', 'PCI_DSS', 'HIPAA', 'GDPR', 'CCM', 'Custom');--> statement-breakpoint
CREATE TYPE "public"."control_category" AS ENUM('technical', 'administrative', 'physical');--> statement-breakpoint
CREATE TYPE "public"."control_type" AS ENUM('preventive', 'detective', 'corrective');--> statement-breakpoint
CREATE TYPE "public"."cost_module_type" AS ENUM('fixed', 'per_event', 'per_hour', 'percentage');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('USD', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."external_internal" AS ENUM('external', 'internal');--> statement-breakpoint
CREATE TYPE "public"."hierarchy_level" AS ENUM('strategic_capability', 'value_capability', 'business_service', 'application_service', 'technical_component');--> statement-breakpoint
CREATE TYPE "public"."implementation_status" AS ENUM('not_implemented', 'in_progress', 'fully_implemented', 'planned');--> statement-breakpoint
CREATE TYPE "public"."item_type" AS ENUM('template', 'instance');--> statement-breakpoint
CREATE TYPE "public"."relationship_type" AS ENUM('part_of', 'depends_on', 'contains');--> statement-breakpoint
CREATE TYPE "public"."risk_category" AS ENUM('operational', 'strategic', 'compliance', 'financial');--> statement-breakpoint
CREATE TYPE "public"."risk_response_type" AS ENUM('accept', 'avoid', 'transfer', 'mitigate');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'analyst', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."vulnerability_severity" AS ENUM('info', 'low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."vulnerability_status" AS ENUM('open', 'in_progress', 'resolved', 'false_positive', 'accepted_risk');--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"user_id" text NOT NULL,
	"details" json,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_asset_id" integer NOT NULL,
	"target_asset_id" integer NOT NULL,
	"relationship_type" "relationship_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "asset_type" NOT NULL,
	"status" "asset_status" DEFAULT 'Active' NOT NULL,
	"owner" text NOT NULL,
	"legal_entity" text DEFAULT 'Unknown' NOT NULL,
	"confidentiality" "cia_rating" NOT NULL,
	"integrity" "cia_rating" NOT NULL,
	"availability" "cia_rating" NOT NULL,
	"asset_value" numeric(38, 2) NOT NULL,
	"currency" "currency" DEFAULT 'USD' NOT NULL,
	"regulatory_impact" text[] DEFAULT ARRAY['none'],
	"external_internal" "external_internal" NOT NULL,
	"dependencies" text[] DEFAULT ARRAY[]::text[],
	"agent_count" integer DEFAULT 1 NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"business_unit" text DEFAULT 'Information Technology',
	"hierarchy_level" text DEFAULT 'application_service',
	"architecture_domain" text DEFAULT 'Application',
	"parent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"backstage_entity_ref" text,
	"backstage_metadata" json,
	"last_backstage_sync" timestamp
);
--> statement-breakpoint
CREATE TABLE "auth_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"oidc_enabled" boolean DEFAULT false NOT NULL,
	"oidc_issuer" text,
	"oidc_client_id" text,
	"oidc_client_secret" text,
	"oidc_redirect_uri" text,
	"oidc_scopes" json DEFAULT '["openid","profile","email"]'::json,
	"allow_local_auth" boolean DEFAULT true NOT NULL,
	"default_role" "user_role" DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "backstage_sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_type" text NOT NULL,
	"entities_processed" integer DEFAULT 0,
	"assets_created" integer DEFAULT 0,
	"assets_updated" integer DEFAULT 0,
	"relationships_created" integer DEFAULT 0,
	"sync_status" text NOT NULL,
	"error_details" json,
	"sync_duration" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "control_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"control_type" "control_type" NOT NULL,
	"control_category" "control_category" NOT NULL,
	"compliance_framework" "compliance_framework" NOT NULL,
	"cloud_domain" text,
	"nist_mappings" json DEFAULT '[]'::json,
	"pci_mappings" json DEFAULT '[]'::json,
	"cis_mappings" json DEFAULT '[]'::json,
	"gap_level" text DEFAULT 'No Gap',
	"addendum" text DEFAULT 'N/A',
	"architectural_relevance" json,
	"organizational_relevance" json,
	"ownership_mapping" text,
	"service_models" json DEFAULT '[]'::json,
	"item_type" "item_type" DEFAULT 'template' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "control_library_control_id_unique" UNIQUE("control_id")
);
--> statement-breakpoint
CREATE TABLE "controls" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"control_type" "control_type" NOT NULL,
	"control_category" "control_category" NOT NULL,
	"implementation_status" "implementation_status" NOT NULL,
	"control_effectiveness" real DEFAULT 0.75,
	"implementation_cost" numeric(15, 2),
	"is_per_agent" boolean DEFAULT false,
	"cost_per_agent" numeric(15, 2),
	"associated_risks" text[] DEFAULT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"library_item_id" integer,
	"compliance_framework" text,
	"cloud_domain" text,
	"nist_mappings" json,
	"pci_mappings" json,
	"cis_mappings" json
);
--> statement-breakpoint
CREATE TABLE "enterprise_architecture" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"level" text NOT NULL,
	"type" text NOT NULL,
	"architecture_domain" text,
	"parent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legal_entities" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"jurisdiction" text NOT NULL,
	"regulatory_framework" text[] DEFAULT ARRAY[]::text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "legal_entities_entity_id_unique" UNIQUE("entity_id")
);
--> statement-breakpoint
CREATE TABLE "risk_controls" (
	"id" serial PRIMARY KEY NOT NULL,
	"risk_id" integer NOT NULL,
	"control_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risk_costs" (
	"id" serial PRIMARY KEY NOT NULL,
	"risk_id" integer NOT NULL,
	"cost_module_id" integer NOT NULL,
	"cost_value" numeric(15, 2) NOT NULL,
	"frequency" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risk_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"risk_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"risk_category" "risk_category" NOT NULL,
	"severity" "severity" NOT NULL,
	"threat_actor" text,
	"threat_capability" json,
	"threat_event" text,
	"vulnerability" text,
	"primary_loss" json,
	"secondary_loss" json,
	"compliance_framework" "compliance_framework" DEFAULT 'Custom',
	"item_type" "item_type" DEFAULT 'template' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "risk_library_risk_id_unique" UNIQUE("risk_id")
);
--> statement-breakpoint
CREATE TABLE "risk_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"risk_id" text,
	"response_type" "risk_response_type" NOT NULL,
	"justification" text DEFAULT '',
	"assigned_controls" text[] DEFAULT '{}',
	"transfer_method" text DEFAULT '',
	"avoidance_strategy" text DEFAULT '',
	"acceptance_reason" text DEFAULT '',
	"cost_module_ids" integer[] DEFAULT '{}',
	"description" text,
	"implementation_cost" numeric(15, 2),
	"expected_effectiveness" real,
	"responsible_party" text,
	"target_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risk_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"total_risks" integer DEFAULT 0 NOT NULL,
	"critical_risks" integer DEFAULT 0 NOT NULL,
	"high_risks" integer DEFAULT 0 NOT NULL,
	"medium_risks" integer DEFAULT 0 NOT NULL,
	"low_risks" integer DEFAULT 0 NOT NULL,
	"total_inherent_risk" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_residual_risk" numeric(15, 2) DEFAULT '0' NOT NULL,
	"risk_reduction" real DEFAULT 0 NOT NULL,
	"exposure_curve_data" json DEFAULT '[]'::json NOT NULL,
	"minimum_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"maximum_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"mean_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"median_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"percentile_95_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"percentile_99_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"tenth_percentile_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"ninetieth_percentile_exposure" numeric(15, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "risks" (
	"id" serial PRIMARY KEY NOT NULL,
	"risk_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"risk_category" "risk_category" NOT NULL,
	"severity" "severity" NOT NULL,
	"inherent_risk" numeric(15, 2),
	"residual_risk" numeric(15, 2),
	"associated_assets" text[] DEFAULT ARRAY[]::text[],
	"parameters" json DEFAULT '{}'::json,
	"library_item_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"password_hash" text,
	"display_name" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"role" text DEFAULT 'viewer' NOT NULL,
	"auth_type" text DEFAULT 'local' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"failed_login_attempts" integer,
	"locked_until" timestamp,
	"last_login" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	"password_salt" text,
	"password_iterations" integer,
	"account_locked_until" timestamp,
	"sso_subject" text,
	"sso_provider" text,
	"profile_image_url" text,
	"created_by" integer,
	"updated_by" integer,
	"is_email_verified" boolean,
	"email_verified_at" timestamp,
	"timezone" text,
	"language" text,
	"phone" text,
	"department" text,
	"job_title" text,
	"manager_id" integer,
	"login_count" integer,
	"last_failed_login" timestamp
);
--> statement-breakpoint
CREATE TABLE "vulnerabilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"vulnerability_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"severity" "vulnerability_severity" NOT NULL,
	"cvss_score" real,
	"cvss_vector" text,
	"cve_id" text,
	"cwe_id" text,
	"status" "vulnerability_status" DEFAULT 'open' NOT NULL,
	"discovered_date" timestamp DEFAULT now() NOT NULL,
	"last_seen_date" timestamp,
	"remediation" text,
	"references" json DEFAULT '[]'::json,
	"tags" json DEFAULT '[]'::json,
	"scanner" text,
	"scan_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vulnerability_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"vulnerability_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"host_name" text,
	"ip_address" text,
	"port" integer,
	"protocol" text,
	"service" text,
	"affected_component" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "asset_relationships" ADD CONSTRAINT "asset_relationships_source_asset_id_assets_id_fk" FOREIGN KEY ("source_asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_relationships" ADD CONSTRAINT "asset_relationships_target_asset_id_assets_id_fk" FOREIGN KEY ("target_asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enterprise_architecture" ADD CONSTRAINT "enterprise_architecture_parent_id_enterprise_architecture_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enterprise_architecture"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_controls" ADD CONSTRAINT "risk_controls_risk_id_risks_id_fk" FOREIGN KEY ("risk_id") REFERENCES "public"."risks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_controls" ADD CONSTRAINT "risk_controls_control_id_controls_id_fk" FOREIGN KEY ("control_id") REFERENCES "public"."controls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_costs" ADD CONSTRAINT "risk_costs_risk_id_risks_id_fk" FOREIGN KEY ("risk_id") REFERENCES "public"."risks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vulnerability_assets" ADD CONSTRAINT "vulnerability_assets_vulnerability_id_vulnerabilities_id_fk" FOREIGN KEY ("vulnerability_id") REFERENCES "public"."vulnerabilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vulnerability_assets" ADD CONSTRAINT "vulnerability_assets_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE cascade ON UPDATE no action;