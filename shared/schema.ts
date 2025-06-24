import { pgTable, text, serial, integer, boolean, json, real, timestamp, pgEnum, numeric, foreignKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, eq, sql } from "drizzle-orm";

// Cost Module Types
export const costModuleTypeEnum = pgEnum('cost_module_type', [
  'fixed',
  'per_event', 
  'per_hour',
  'percentage'
]);

// Enums
export const assetTypeEnum = pgEnum('asset_type', [
  'data',
  'application',
  'device',
  'system',
  'network',
  'facility',
  'personnel',
  'other',
  // Only L4 and L5 types for assets
  'application_service',   // L4
  'technical_component'    // L5
]);

export const assetStatusEnum = pgEnum('asset_status', [
  'Active',
  'Decommissioned',
  'To Adopt'
]);

export const ciaRatingEnum = pgEnum('cia_rating', [
  'low',
  'medium',
  'high'
]);

export const externalInternalEnum = pgEnum('external_internal', [
  'external',
  'internal'
]);

export const hierarchyLevelEnum = pgEnum('hierarchy_level', [
  'strategic_capability',  // L1 - Strategic Capability
  'value_capability',      // L2 - Value Capability
  'business_service',      // L3 - Business Service
  'application_service',   // L4 - Application Service
  'technical_component'    // L5 - Technical Component
]);

export const relationshipTypeEnum = pgEnum('relationship_type', [
  'part_of',     // Component is part of a larger system
  'depends_on',  // Asset depends on another asset
  'contains'     // Asset contains sub-assets
]);

export const riskCategoryEnum = pgEnum('risk_category', [
  'operational',
  'strategic',
  'compliance',
  'financial'
]);

export const controlTypeEnum = pgEnum('control_type', [
  'preventive',
  'detective',
  'corrective'
]);

export const controlCategoryEnum = pgEnum('control_category', [
  'technical',
  'administrative',
  'physical'
]);

export const implementationStatusEnum = pgEnum('implementation_status', [
  'not_implemented',
  'in_progress',
  'fully_implemented',
  'planned'
]);

export const riskResponseTypeEnum = pgEnum('risk_response_type', [
  'accept',
  'avoid',
  'transfer',
  'mitigate'
]);

export const severityEnum = pgEnum('severity', [
  'low',
  'medium',
  'high',
  'critical'
]);

// Currency enum
export const currencyEnum = pgEnum('currency', ['USD', 'EUR']);

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'analyst', 
  'viewer'
]);

export const authTypeEnum = pgEnum('auth_type', [
  'local',   // Local username/password
  'sso'      // Single Sign-On (OpenID Connect)
]);

export const itemTypeEnum = pgEnum('item_type', [
  'template',  // Original template from library
  'instance'   // Instance created for a specific risk/asset
]);

export const complianceFrameworkEnum = pgEnum('compliance_framework', [
  'CIS',       // CIS Controls v8
  'NIST',      // NIST Cybersecurity Framework
  'ISO27001',  // ISO/IEC 27001
  'SOC2',      // SOC 2 Type II
  'PCI_DSS',   // PCI Data Security Standard
  'HIPAA',     // Health Insurance Portability and Accountability Act
  'GDPR',      // General Data Protection Regulation
  'CCM',       // Cloud Security Alliance Cloud Controls Matrix
  'Custom'     // Custom or organization-specific controls
]);

// Asset Inventory Module
export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  assetId: text('asset_id').notNull(), // Unique constraint already added in DB
  name: text('name').notNull(),
  type: assetTypeEnum('type').notNull(),
  status: assetStatusEnum('status').notNull().default('Active'), // Asset status (Active, Decommissioned, To Adopt)
  owner: text('owner').notNull(),
  legalEntity: text('legal_entity').notNull().default('Unknown'), // Legal entity that owns this asset
  confidentiality: ciaRatingEnum('confidentiality').notNull(),
  integrity: ciaRatingEnum('integrity').notNull(),
  availability: ciaRatingEnum('availability').notNull(),
  assetValue: numeric('asset_value', { precision: 38, scale: 2 }).notNull(), // Monetary value with high precision
  currency: currencyEnum('currency').notNull().default('USD'), // USD or EUR
  regulatoryImpact: text('regulatory_impact').array().notNull().default(['none']), // GDPR, HIPAA, etc.
  externalInternal: externalInternalEnum('external_internal').notNull(),
  dependencies: text('dependencies').array().notNull().default([]),
  agentCount: integer('agent_count').notNull().default(1), // Number of agents required for this asset
  description: text('description').notNull().default(''),
  // Enterprise architecture fields
  business_unit: text('business_unit').default('Information Technology'), // Business unit that owns this asset
  hierarchy_level: text('hierarchy_level').default('application_service'), // Hierarchy level (L4, L5)
  architecture_domain: text('architecture_domain').default('Application'), // Architecture domain
  parentId: integer('parent_id'), // Hierarchical relationship (for connecting to higher level architecture items)
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // Backstage integration fields
  backstageEntityRef: text('backstage_entity_ref'),
  backstageMetadata: json('backstage_metadata'),
  lastBackstageSync: timestamp('last_backstage_sync')
});

// Asset relationships for enterprise architecture
export const assetRelationships = pgTable('asset_relationships', {
  id: serial('id').primaryKey(),
  sourceAssetId: integer('source_asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  targetAssetId: integer('target_asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  relationshipType: relationshipTypeEnum('relationship_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Enterprise Architecture table (L1-L3 capabilities)
export const enterpriseArchitecture = pgTable('enterprise_architecture', {
  id: serial('id').primaryKey(),
  assetId: text('asset_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  level: text('level').notNull(),  // L1, L2, or L3
  type: text('type').notNull(),    // strategic_capability, value_capability, business_service, product_service
  architectureDomain: text('architecture_domain'),
  parentId: integer('parent_id').references(() => enterpriseArchitecture.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Relations for enterprise architecture
export const enterpriseArchitectureRelations = relations(enterpriseArchitecture, ({ one }) => ({
  parent: one(enterpriseArchitecture, {
    fields: [enterpriseArchitecture.parentId],
    references: [enterpriseArchitecture.id],
  }),
}));

export const insertEnterpriseArchitectureSchema = createInsertSchema(enterpriseArchitecture)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type EnterpriseArchitecture = typeof enterpriseArchitecture.$inferSelect;
export type InsertEnterpriseArchitecture = z.infer<typeof insertEnterpriseArchitectureSchema>;

// Risk Management Module
export const risks = pgTable('risks', {
  id: serial('id').primaryKey(),
  riskId: text('risk_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  riskCategory: riskCategoryEnum('risk_category').notNull(),
  severity: severityEnum('severity').notNull(),
  inherentRisk: numeric('inherent_risk', { precision: 15, scale: 2 }),
  residualRisk: numeric('residual_risk', { precision: 15, scale: 2 }),
  associatedAssets: json('associated_assets').default([]),
  libraryItemId: integer('library_item_id'), // Reference to risk library template
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Controls Module
export const controls = pgTable('controls', {
  id: serial('id').primaryKey(),
  controlId: text('control_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  controlType: controlTypeEnum('control_type').notNull(),
  controlCategory: controlCategoryEnum('control_category').notNull(),
  implementationStatus: implementationStatusEnum('implementation_status').notNull(),
  controlEffectiveness: real('control_effectiveness'),
  implementationCost: numeric('implementation_cost', { precision: 15, scale: 2 }),
  isPerAgent: boolean('is_per_agent').default(false),
  costPerAgent: numeric('cost_per_agent', { precision: 15, scale: 2 }),
  associatedRisks: json('associated_risks').default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  libraryItemId: integer('library_item_id'), // Reference to control library template
  complianceFramework: text('compliance_framework'),
  cloudDomain: text('cloud_domain'),
  nistMappings: json('nist_mappings'),
  pciMappings: json('pci_mappings'),
  cisMappings: json('cis_mappings'),
});

// Control Library Module
export const controlLibrary = pgTable('control_library', {
  id: serial('id').primaryKey(),
  controlId: text('control_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  controlType: controlTypeEnum('control_type').notNull(),
  controlCategory: controlCategoryEnum('control_category').notNull(),
  complianceFramework: complianceFrameworkEnum('compliance_framework').notNull(),
  cloudDomain: text('cloud_domain'),
  nistMappings: json('nist_mappings').default([]),
  pciMappings: json('pci_mappings').default([]),
  cisMappings: json('cis_mappings').default([]),
  gapLevel: text('gap_level').default('No Gap'),
  addendum: text('addendum').default('N/A'),
  architecturalRelevance: json('architectural_relevance'),
  organizationalRelevance: json('organizational_relevance'),
  ownershipMapping: text('ownership_mapping'),
  serviceModels: json('service_models').default([]),
  itemType: itemTypeEnum('item_type').notNull().default('template'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Risk Library Module  
export const riskLibrary = pgTable('risk_library', {
  id: serial('id').primaryKey(),
  riskId: text('risk_id').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  riskCategory: riskCategoryEnum('risk_category').notNull(),
  severity: severityEnum('severity').notNull(),
  threatActor: text('threat_actor'),
  threatCapability: json('threat_capability'),
  threatEvent: text('threat_event'),
  vulnerability: text('vulnerability'),
  primaryLoss: json('primary_loss'),
  secondaryLoss: json('secondary_loss'),
  complianceFramework: complianceFrameworkEnum('compliance_framework').default('Custom'),
  itemType: itemTypeEnum('item_type').notNull().default('template'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Risk-Control associations
export const riskControls = pgTable('risk_controls', {
  id: serial('id').primaryKey(),
  riskId: integer('risk_id').notNull().references(() => risks.id, { onDelete: 'cascade' }),
  controlId: integer('control_id').notNull().references(() => controls.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Risk Response Management
export const riskResponses = pgTable('risk_responses', {
  id: serial('id').primaryKey(),
  riskId: integer('risk_id').notNull().references(() => risks.id, { onDelete: 'cascade' }),
  responseType: riskResponseTypeEnum('response_type').notNull(),
  description: text('description'),
  implementationCost: numeric('implementation_cost', { precision: 15, scale: 2 }),
  expectedEffectiveness: real('expected_effectiveness'),
  responsibleParty: text('responsible_party'),
  targetDate: timestamp('target_date'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Risk Cost Management
export const riskCosts = pgTable('risk_costs', {
  id: serial('id').primaryKey(),
  riskId: integer('risk_id').notNull().references(() => risks.id, { onDelete: 'cascade' }),
  costModuleId: integer('cost_module_id').notNull(),
  costValue: numeric('cost_value', { precision: 15, scale: 2 }).notNull(),
  frequency: text('frequency').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Legal Entities
export const legalEntities = pgTable('legal_entities', {
  id: serial('id').primaryKey(),
  entityId: text('entity_id').notNull().unique(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  jurisdiction: text('jurisdiction').notNull(),
  regulatoryFramework: text('regulatory_framework').array().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  userId: text('user_id').notNull(),
  details: json('details'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Zod schemas for validation
export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true
});

export const insertRiskSchema = createInsertSchema(risks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertControlSchema = createInsertSchema(controls).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertRiskResponseSchema = createInsertSchema(riskResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertLegalEntitySchema = createInsertSchema(legalEntities)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true
});

// TypeScript types
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Risk = typeof risks.$inferSelect;
export type InsertRisk = z.infer<typeof insertRiskSchema>;

export type Control = typeof controls.$inferSelect;
export type InsertControl = z.infer<typeof insertControlSchema>;

export type RiskResponse = typeof riskResponses.$inferSelect;
export type InsertRiskResponse = z.infer<typeof insertRiskResponseSchema>;

export type LegalEntity = typeof legalEntities.$inferSelect;
export type InsertLegalEntity = z.infer<typeof insertLegalEntitySchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type RiskLibraryItem = typeof riskLibrary.$inferSelect;
export type ControlLibraryItem = typeof controlLibrary.$inferSelect;

export type AssetRelationship = typeof assetRelationships.$inferSelect;
export const insertAssetRelationshipSchema = createInsertSchema(assetRelationships).omit({
  id: true,
  createdAt: true,
});
export type InsertAssetRelationship = z.infer<typeof insertAssetRelationshipSchema>;

/**
 * Risk Summary table to store comprehensive risk analytics and exposure data
 * Used for dashboard metrics and Loss Exceedance Curve calculations
 */
export const riskSummaries = pgTable('risk_summaries', {
  id: serial('id').primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  totalRisks: integer('total_risks').notNull().default(0),
  criticalRisks: integer('critical_risks').notNull().default(0),
  highRisks: integer('high_risks').notNull().default(0),
  mediumRisks: integer('medium_risks').notNull().default(0),
  lowRisks: integer('low_risks').notNull().default(0),
  totalInherentRisk: numeric('total_inherent_risk', { precision: 15, scale: 2 }).notNull().default('0'),
  totalResidualRisk: numeric('total_residual_risk', { precision: 15, scale: 2 }).notNull().default('0'),
  riskReduction: real('risk_reduction').notNull().default(0),
  exposureCurveData: json('exposure_curve_data').notNull().default([]),
  minimumExposure: numeric('minimum_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  maximumExposure: numeric('maximum_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  meanExposure: numeric('mean_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  medianExposure: numeric('median_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  percentile95Exposure: numeric('percentile_95_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  percentile99Exposure: numeric('percentile_99_exposure', { precision: 15, scale: 2 }).notNull().default('0'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const insertRiskSummarySchema = createInsertSchema(riskSummaries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type RiskSummary = typeof riskSummaries.$inferSelect;
export type InsertRiskSummary = z.infer<typeof insertRiskSummarySchema>;

/**
 * Authentication and Authorization Tables
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email'),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').notNull().default('viewer'),
  authType: authTypeEnum('auth_type').notNull().default('local'),
  lastLogin: timestamp('last_login'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  sid: text('sid').primaryKey(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// FAIR Risk Calculation Parameters Interface
export interface RiskCalculationParams {
  // Risk ID for API calls
  riskId?: string;
  
  // Contact Frequency (CF)
  contactFrequencyMin: number;
  contactFrequencyAvg: number;
  contactFrequencyMax: number;
  contactFrequencyConfidence: string;
  
  // Probability of Action (POA)
  probabilityOfActionMin: number;
  probabilityOfActionAvg: number;
  probabilityOfActionMax: number;
  probabilityOfActionConfidence: string;
  
  // Threat Event Frequency (TEF)
  threatEventFrequencyMin?: number;
  threatEventFrequencyAvg?: number;
  threatEventFrequencyMax?: number;
  threatEventFrequencyConfidence?: string;
  
  // Threat Capability (TCap)
  threatCapabilityMin: number;
  threatCapabilityAvg: number;
  threatCapabilityMax: number;
  threatCapabilityConfidence: string;
  
  // Resistance Strength (RS)
  resistanceStrengthMin: number;
  resistanceStrengthAvg: number;
  resistanceStrengthMax: number;
  resistanceStrengthConfidence: string;
  
  // Susceptibility (Vulnerability)
  susceptibilityMin?: number;
  susceptibilityAvg?: number;
  susceptibilityMax?: number;
  susceptibilityConfidence?: string;
  
  // Primary Loss Magnitude (PL)
  primaryLossMagnitudeMin: number;
  primaryLossMagnitudeAvg: number;
  primaryLossMagnitudeMax: number;
  primaryLossMagnitudeConfidence: string;
  
  // Secondary Loss Event Frequency (SLEF)
  secondaryLossEventFrequencyMin?: number;
  secondaryLossEventFrequencyAvg?: number;
  secondaryLossEventFrequencyMax?: number;
  secondaryLossEventFrequencyConfidence?: string;
  
  // Secondary Loss Magnitude (SLM)
  secondaryLossMagnitudeMin?: number;
  secondaryLossMagnitudeAvg?: number;
  secondaryLossMagnitudeMax?: number;
  secondaryLossMagnitudeConfidence?: string;
  
  // Pre-calculated risk values
  inherentRisk?: number;
  residualRisk?: number;
}

export const authConfig = pgTable('auth_config', {
  id: serial('id').primaryKey(),
  oidcEnabled: boolean('oidc_enabled').notNull().default(false),
  oidcIssuer: text('oidc_issuer'),
  oidcClientId: text('oidc_client_id'),
  oidcClientSecret: text('oidc_client_secret'),
  oidcRedirectUri: text('oidc_redirect_uri'),
  oidcScope: text('oidc_scope').default('openid profile email'),
  allowLocalAuth: boolean('allow_local_auth').notNull().default(true),
  defaultRole: userRoleEnum('default_role').notNull().default('viewer'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const vulnerabilityStatusEnum = pgEnum('vulnerability_status', [
  'open',
  'in_progress', 
  'resolved',
  'false_positive',
  'accepted_risk'
]);

export const vulnerabilitySeverityEnum = pgEnum('vulnerability_severity', [
  'info',
  'low',
  'medium', 
  'high',
  'critical'
]);

export const vulnerabilities = pgTable('vulnerabilities', {
  id: serial('id').primaryKey(),
  vulnerabilityId: text('vulnerability_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  severity: vulnerabilitySeverityEnum('severity').notNull(),
  cvssScore: real('cvss_score'),
  cvssVector: text('cvss_vector'),
  cveId: text('cve_id'),
  cweId: text('cwe_id'),
  status: vulnerabilityStatusEnum('status').notNull().default('open'),
  discoveredDate: timestamp('discovered_date').notNull().defaultNow(),
  lastSeenDate: timestamp('last_seen_date'),
  remediation: text('remediation'),
  references: json('references').default([]),
  tags: json('tags').default([]),
  scanner: text('scanner'),
  scanId: text('scan_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const vulnerabilityAssets = pgTable('vulnerability_assets', {
  id: serial('id').primaryKey(),
  vulnerabilityId: integer('vulnerability_id').notNull().references(() => vulnerabilities.id, { onDelete: 'cascade' }),
  assetId: integer('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  hostName: text('host_name'),
  ipAddress: text('ip_address'),
  port: integer('port'),
  protocol: text('protocol'),
  service: text('service'),
  affectedComponent: text('affected_component'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const vulnerabilityRelations = relations(vulnerabilities, ({ many }) => ({
  assets: many(vulnerabilityAssets),
}));

export const vulnerabilityAssetRelations = relations(vulnerabilityAssets, ({ one }) => ({
  vulnerability: one(vulnerabilities, {
    fields: [vulnerabilityAssets.vulnerabilityId],
    references: [vulnerabilities.id],
  }),
  asset: one(assets, {
    fields: [vulnerabilityAssets.assetId],
    references: [assets.id],
  }),
}));

export type Vulnerability = typeof vulnerabilities.$inferSelect;
export type InsertVulnerability = typeof vulnerabilities.$inferInsert;
export type VulnerabilityAsset = typeof vulnerabilityAssets.$inferSelect;
export type InsertVulnerabilityAsset = typeof vulnerabilityAssets.$inferInsert;

export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities);
export const insertVulnerabilityAssetSchema = createInsertSchema(vulnerabilityAssets);

export const insertAuthConfigSchema = createInsertSchema(authConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AuthConfig = typeof authConfig.$inferSelect;
export type InsertAuthConfig = z.infer<typeof insertAuthConfigSchema>;

// User types for API responses (exclude sensitive data)
export type UserWithoutPassword = Omit<User, 'passwordHash'>;
export type CreateUserRequest = {
  username: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'analyst' | 'viewer';
};

export type LoginRequest = {
  username: string;
  password: string;
};

// Backstage Integration Tables
export const backstageSyncLogs = pgTable('backstage_sync_logs', {
  id: serial('id').primaryKey(),
  syncType: text('sync_type').notNull(),
  entitiesProcessed: integer('entities_processed').default(0),
  assetsCreated: integer('assets_created').default(0),
  assetsUpdated: integer('assets_updated').default(0),
  relationshipsCreated: integer('relationships_created').default(0),
  syncStatus: text('sync_status').notNull(), // 'success', 'failed', 'partial'
  errorDetails: json('error_details'),
  syncDuration: integer('sync_duration'), // in milliseconds
  createdAt: timestamp('created_at').defaultNow(),
});

export type BackstageSyncLog = typeof backstageSyncLogs.$inferSelect;
export type InsertBackstageSyncLog = typeof backstageSyncLogs.$inferInsert;