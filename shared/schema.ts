import { pgTable, text, serial, integer, boolean, json, real, timestamp, pgEnum, numeric, foreignKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, eq } from "drizzle-orm";

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
  'user',    // Read-only access
  'admin'    // Read-write access
]);

export const authTypeEnum = pgEnum('auth_type', [
  'local',   // Local username/password authentication
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
    relationName: 'parent_child',
  }),
}));

// Insert schema for Enterprise Architecture
export const insertEnterpriseArchitectureSchema = createInsertSchema(enterpriseArchitecture)
  .omit({ id: true, createdAt: true, updatedAt: true });

// Types for Enterprise Architecture
export type EnterpriseArchitecture = typeof enterpriseArchitecture.$inferSelect;
export type InsertEnterpriseArchitecture = z.infer<typeof insertEnterpriseArchitectureSchema>;

// Risk Register Module
export const risks = pgTable('risks', {
  id: serial('id').primaryKey(),
  riskId: text('risk_id').notNull(), // Unique constraint already added in DB
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  associatedAssets: text('associated_assets').array().notNull(), // Array of assetIds
  threatCommunity: text('threat_community').notNull(),
  vulnerability: text('vulnerability').notNull(),
  riskCategory: riskCategoryEnum('risk_category').notNull(),
  severity: severityEnum('severity').notNull(),
  
  // Library integration fields
  libraryItemId: integer('library_item_id').references(() => riskLibrary.id), // Reference to source risk library item
  itemType: itemTypeEnum('item_type').default('instance'), // Whether this is a template or instance
  
  // FAIR-U Specific values (Based on FAIR v3.0, April 2025)
  
  // Contact Frequency (CF) - How often threat agents come in contact
  contactFrequencyMin: real('contact_frequency_min').notNull().default(0),
  contactFrequencyAvg: real('contact_frequency_avg').notNull().default(0),
  contactFrequencyMax: real('contact_frequency_max').notNull().default(0),
  contactFrequencyConfidence: text('contact_frequency_confidence').notNull().default('Medium'),
  
  // Probability of Action (POA) - Likelihood of threat agent taking action
  probabilityOfActionMin: real('probability_of_action_min').notNull().default(0),
  probabilityOfActionAvg: real('probability_of_action_avg').notNull().default(0),
  probabilityOfActionMax: real('probability_of_action_max').notNull().default(0),
  probabilityOfActionConfidence: text('probability_of_action_confidence').notNull().default('Medium'),
  
  // Threat Event Frequency (TEF) - Calculated
  threatEventFrequencyMin: real('threat_event_frequency_min').notNull().default(0),
  threatEventFrequencyAvg: real('threat_event_frequency_avg').notNull().default(0),
  threatEventFrequencyMax: real('threat_event_frequency_max').notNull().default(0),
  threatEventFrequencyConfidence: text('threat_event_frequency_confidence').notNull().default('Medium'),
  
  // Threat Capability (TCap) - Capability of threat agent
  threatCapabilityMin: real('threat_capability_min').notNull().default(0),
  threatCapabilityAvg: real('threat_capability_avg').notNull().default(0),
  threatCapabilityMax: real('threat_capability_max').notNull().default(0),
  threatCapabilityConfidence: text('threat_capability_confidence').notNull().default('Medium'),
  
  // Resistance Strength (RS) - Strength of controls
  resistanceStrengthMin: real('resistance_strength_min').notNull().default(0),
  resistanceStrengthAvg: real('resistance_strength_avg').notNull().default(0),
  resistanceStrengthMax: real('resistance_strength_max').notNull().default(0),
  resistanceStrengthConfidence: text('resistance_strength_confidence').notNull().default('Medium'),
  
  // Susceptibility (Susc) - Calculated
  // susceptibility field isn't in the actual database, so commenting it out
  // susceptibility: numeric('susceptibility', { precision: 38, scale: 2 }).notNull().default(0), // Overall susceptibility value
  susceptibilityMin: real('susceptibility_min').notNull().default(0),
  susceptibilityAvg: real('susceptibility_avg').notNull().default(0),
  susceptibilityMax: real('susceptibility_max').notNull().default(0),
  susceptibilityConfidence: text('susceptibility_confidence').notNull().default('Medium'),
  
  // Loss Event Frequency (LEF) - Calculated
  lossEventFrequencyMin: real('loss_event_frequency_min').notNull().default(0),
  lossEventFrequencyAvg: real('loss_event_frequency_avg').notNull().default(0),
  lossEventFrequencyMax: real('loss_event_frequency_max').notNull().default(0),
  lossEventFrequencyConfidence: text('loss_event_frequency_confidence').notNull().default('Medium'),
  
  // Primary Loss (PL)
  primaryLossMagnitudeMin: numeric('primary_loss_magnitude_min', { precision: 38, scale: 2 }).notNull().default('0'),
  primaryLossMagnitudeAvg: numeric('primary_loss_magnitude_avg', { precision: 38, scale: 2 }).notNull().default('0'),
  primaryLossMagnitudeMax: numeric('primary_loss_magnitude_max', { precision: 38, scale: 2 }).notNull().default('0'),
  primaryLossMagnitudeConfidence: text('primary_loss_magnitude_confidence').notNull().default('Medium'),
  
  // Secondary Loss Event Frequency (SLEF)
  secondaryLossEventFrequencyMin: real('secondary_loss_event_frequency_min').notNull().default(0),
  secondaryLossEventFrequencyAvg: real('secondary_loss_event_frequency_avg').notNull().default(0),
  secondaryLossEventFrequencyMax: real('secondary_loss_event_frequency_max').notNull().default(0),
  secondaryLossEventFrequencyConfidence: text('secondary_loss_event_frequency_confidence').notNull().default('Medium'),
  
  // Secondary Loss Magnitude (SLM)
  secondaryLossMagnitudeMin: numeric('secondary_loss_magnitude_min', { precision: 38, scale: 2 }).notNull().default('0'),
  secondaryLossMagnitudeAvg: numeric('secondary_loss_magnitude_avg', { precision: 38, scale: 2 }).notNull().default('0'),
  secondaryLossMagnitudeMax: numeric('secondary_loss_magnitude_max', { precision: 38, scale: 2 }).notNull().default('0'),
  secondaryLossMagnitudeConfidence: text('secondary_loss_magnitude_confidence').notNull().default('Medium'),
  
  // Loss Magnitude (LM) - Calculated
  lossMagnitudeMin: numeric('loss_magnitude_min', { precision: 38, scale: 2 }).notNull().default('0'),
  lossMagnitudeAvg: numeric('loss_magnitude_avg', { precision: 38, scale: 2 }).notNull().default('0'),
  lossMagnitudeMax: numeric('loss_magnitude_max', { precision: 38, scale: 2 }).notNull().default('0'),
  lossMagnitudeConfidence: text('loss_magnitude_confidence').notNull().default('Medium'),
  
  // Risk values - store as text to avoid precision issues
  inherentRisk: text('inherent_risk').notNull().default('0'), // In dollars (before controls)
  residualRisk: text('residual_risk').notNull().default('0'), // In dollars (after controls)
  rankPercentile: real('rank_percentile').notNull().default(0), // Percentile ranking of this risk
  
  // Enhanced percentile values from FAIR calculations
  aleP10: numeric('ale_p10', { precision: 38, scale: 2 }).default('0'),
  aleP25: numeric('ale_p25', { precision: 38, scale: 2 }).default('0'),
  aleP50: numeric('ale_p50', { precision: 38, scale: 2 }).default('0'),
  aleP75: numeric('ale_p75', { precision: 38, scale: 2 }).default('0'),
  aleP90: numeric('ale_p90', { precision: 38, scale: 2 }).default('0'),
  aleP95: numeric('ale_p95', { precision: 38, scale: 2 }).default('0'),
  aleP99: numeric('ale_p99', { precision: 38, scale: 2 }).default('0'),
  
  // Inherent risk percentiles (before controls)
  inherentP10: numeric('inherent_p10', { precision: 38, scale: 2 }).default('0'),
  inherentP25: numeric('inherent_p25', { precision: 38, scale: 2 }).default('0'),
  inherentP50: numeric('inherent_p50', { precision: 38, scale: 2 }).default('0'),
  inherentP75: numeric('inherent_p75', { precision: 38, scale: 2 }).default('0'),
  inherentP90: numeric('inherent_p90', { precision: 38, scale: 2 }).default('0'),
  inherentP95: numeric('inherent_p95', { precision: 38, scale: 2 }).default('0'),
  inherentP99: numeric('inherent_p99', { precision: 38, scale: 2 }).default('0'),
  
  // Residual risk percentiles (after controls)
  residualP10: numeric('residual_p10', { precision: 38, scale: 2 }).default('0'),
  residualP25: numeric('residual_p25', { precision: 38, scale: 2 }).default('0'),
  residualP50: numeric('residual_p50', { precision: 38, scale: 2 }).default('0'),
  residualP75: numeric('residual_p75', { precision: 38, scale: 2 }).default('0'),
  residualP90: numeric('residual_p90', { precision: 38, scale: 2 }).default('0'),
  residualP95: numeric('residual_p95', { precision: 38, scale: 2 }).default('0'),
  residualP99: numeric('residual_p99', { precision: 38, scale: 2 }).default('0'),
  
  // Additional metadata
  // notes field doesn't exist in the actual database, commented out to match DB schema
  // notes: text('notes').notNull().default(''), // Additional notes about the risk
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Control Library Module
export const controls = pgTable('controls', {
  id: serial('id').primaryKey(),
  controlId: text('control_id').notNull(), // Unique constraint already added in DB
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  associatedRisks: text('associated_risks').array().notNull().default([]), // Array of riskIds
  controlType: controlTypeEnum('control_type').notNull(),
  controlCategory: controlCategoryEnum('control_category').notNull(),
  implementationStatus: implementationStatusEnum('implementation_status').notNull(),
  controlEffectiveness: real('control_effectiveness').notNull(), // 0-10 scale for FAIR-U resistance strength
  implementationCost: numeric('implementation_cost', { precision: 38, scale: 2 }).notNull().default('0'), // Total implementation cost
  costPerAgent: numeric('cost_per_agent', { precision: 38, scale: 2 }).notNull().default('0'), // Cost per agent/workload
  isPerAgentPricing: boolean('is_per_agent_pricing').notNull().default(false), // Whether to use per-agent pricing
  deployedAgentCount: integer('deployed_agent_count').default(0), // For in_progress controls: track deployed agents
  notes: text('notes').notNull().default(''),
  
  // New fields for library integration
  libraryItemId: integer('library_item_id'), // Reference to source library item 
  itemType: itemTypeEnum('item_type').default('instance'), // Whether this is a template or instance
  assetId: text('asset_id'), // Link to associated asset (if applicable)
  riskId: integer('risk_id'), // Link to associated risk (if applicable)
  legalEntityId: text('legal_entity_id'), // Link to associated legal entity (if applicable)
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Control Library - Templates for reusable controls
export const controlLibrary = pgTable('control_library', {
  id: serial('id').primaryKey(),
  controlId: text('control_id').notNull(), 
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  controlType: controlTypeEnum('control_type').notNull(),
  controlCategory: controlCategoryEnum('control_category').notNull(),
  implementationStatus: implementationStatusEnum('implementation_status').notNull().default('planned'),
  controlEffectiveness: real('control_effectiveness').notNull().default(0), // 0-10 scale for FAIR-U resistance strength
  implementationCost: numeric('implementation_cost', { precision: 38, scale: 2 }).notNull().default('0'),
  costPerAgent: numeric('cost_per_agent', { precision: 38, scale: 2 }).notNull().default('0'),
  isPerAgentPricing: boolean('is_per_agent_pricing').notNull().default(false),
  notes: text('notes').notNull().default(''),
  complianceFramework: complianceFrameworkEnum('compliance_framework').notNull().default('Custom'), // Primary compliance framework
  nistCsf: text('nist_csf').array().notNull().default([]), // NIST Cybersecurity Framework mappings
  iso27001: text('iso27001').array().notNull().default([]), // ISO 27001 control mappings
  
  // CCM-specific fields
  cloudDomain: text('cloud_domain'), // CCM domain classification (A&A, AIS, etc.)
  nistMappings: text('nist_mappings').array().notNull().default([]), // NIST 800-53 references
  pciMappings: text('pci_mappings').array().notNull().default([]), // PCI DSS references
  cisMappings: text('cis_mappings').array().notNull().default([]), // CIS Controls mappings
  gapLevel: text('gap_level'), // No Gap, Partial Gap, Full Gap
  implementationGuidance: text('implementation_guidance'), // Implementation addendum
  architecturalRelevance: json('architectural_relevance'), // Cloud stack applicability
  organizationalRelevance: json('organizational_relevance'), // Department applicability
  ownershipModel: text('ownership_model'), // CSP-Owned, CSC-Owned, Shared
  cloudServiceModel: text('cloud_service_model').array().notNull().default([]), // IaaS, PaaS, SaaS
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Risk Library - Templates for reusable risks
export const riskLibrary = pgTable('risk_library', {
  id: serial('id').primaryKey(),
  riskId: text('risk_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  threatCommunity: text('threat_community').notNull().default(''),
  vulnerability: text('vulnerability').notNull().default(''),
  riskCategory: riskCategoryEnum('risk_category').notNull(),
  severity: severityEnum('severity').notNull().default('medium'),
  
  // FAIR-U Specific parameters (same as in risks table)
  contactFrequencyMin: real('contact_frequency_min').notNull().default(0),
  contactFrequencyAvg: real('contact_frequency_avg').notNull().default(0),
  contactFrequencyMax: real('contact_frequency_max').notNull().default(0),
  contactFrequencyConfidence: text('contact_frequency_confidence').notNull().default('Medium'),
  
  probabilityOfActionMin: real('probability_of_action_min').notNull().default(0),
  probabilityOfActionAvg: real('probability_of_action_avg').notNull().default(0),
  probabilityOfActionMax: real('probability_of_action_max').notNull().default(0),
  probabilityOfActionConfidence: text('probability_of_action_confidence').notNull().default('Medium'),
  
  threatCapabilityMin: real('threat_capability_min').notNull().default(0),
  threatCapabilityAvg: real('threat_capability_avg').notNull().default(0),
  threatCapabilityMax: real('threat_capability_max').notNull().default(0),
  threatCapabilityConfidence: text('threat_capability_confidence').notNull().default('Medium'),
  
  resistanceStrengthMin: real('resistance_strength_min').notNull().default(0),
  resistanceStrengthAvg: real('resistance_strength_avg').notNull().default(0),
  resistanceStrengthMax: real('resistance_strength_max').notNull().default(0),
  resistanceStrengthConfidence: text('resistance_strength_confidence').notNull().default('Medium'),
  
  primaryLossMagnitudeMin: real('primary_loss_magnitude_min').notNull().default(0),
  primaryLossMagnitudeAvg: real('primary_loss_magnitude_avg').notNull().default(0),
  primaryLossMagnitudeMax: real('primary_loss_magnitude_max').notNull().default(0),
  primaryLossMagnitudeConfidence: text('primary_loss_magnitude_confidence').notNull().default('Medium'),
  
  secondaryLossEventFrequencyMin: real('secondary_loss_event_frequency_min').notNull().default(0),
  secondaryLossEventFrequencyAvg: real('secondary_loss_event_frequency_avg').notNull().default(0),
  secondaryLossEventFrequencyMax: real('secondary_loss_event_frequency_max').notNull().default(0),
  secondaryLossEventFrequencyConfidence: text('secondary_loss_event_frequency_confidence').notNull().default('Medium'),
  
  secondaryLossMagnitudeMin: real('secondary_loss_magnitude_min').notNull().default(0),
  secondaryLossMagnitudeAvg: real('secondary_loss_magnitude_avg').notNull().default(0),
  secondaryLossMagnitudeMax: real('secondary_loss_magnitude_max').notNull().default(0),
  secondaryLossMagnitudeConfidence: text('secondary_loss_magnitude_confidence').notNull().default('Medium'),
  
  // Recommended controls
  recommendedControls: text('recommended_controls').array().notNull().default([]), // Array of controlIds from control library
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Junction table for risk-control relationships
export const riskControls = pgTable('risk_controls', {
  id: serial('id').primaryKey(),
  riskId: integer('risk_id').notNull(),
  controlId: integer('control_id').notNull(),
  effectiveness: real('effectiveness').notNull().default(0), // 0-10 effectiveness rating specific to this risk-control pairing
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Risk Response Module
export const riskResponses = pgTable('risk_responses', {
  id: serial('id').primaryKey(),
  riskId: text('risk_id').notNull().references(() => risks.riskId),
  responseType: riskResponseTypeEnum('response_type').notNull(),
  justification: text('justification').notNull().default(''),
  assignedControls: text('assigned_controls').array().notNull().default([]), // Array of controlIds, if mitigate
  transferMethod: text('transfer_method').notNull().default(''), // Description of risk transfer, if transfer
  avoidanceStrategy: text('avoidance_strategy').notNull().default(''), // Description of risk avoidance, if avoid
  acceptanceReason: text('acceptance_reason').notNull().default(''), // Reason for acceptance, if accept
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// FAIR-MAM Risk Cost Module - Junction table for cost module mapping
export const riskCosts = pgTable('risk_costs', {
  id: serial('id').primaryKey(),
  riskId: integer('risk_id').notNull(), // References risks.id (numeric ID)
  costModuleId: integer('cost_module_id').notNull(), // References cost_modules.id
  weight: numeric('weight', { precision: 10, scale: 2 }).notNull().default('1.0'), // Materiality weighting
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Legal Entities for organization structure
export const legalEntities = pgTable('legal_entities', {
  id: serial('id').primaryKey(),
  entityId: text('entity_id').notNull(), // Unique identifier
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  parentEntityId: text('parent_entity_id'), // For hierarchy
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Activity logs for dashboard
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  activity: text('activity').notNull(),
  user: text('user').notNull(),
  entity: text('entity').notNull(),
  entityType: text('entity_type').notNull(), // asset, risk, control, response
  entityId: text('entity_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Insert Schemas
// Use the original schema again with modifications
export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
}).extend({
  // Override the assetValue field to ensure it's always a number
  assetValue: z.number().nonnegative(),
  
  // Override the agentCount field to ensure it's always a number
  agentCount: z.number().int().nonnegative(),
  
  // Ensure description is handled as a string
  description: z.any().transform(val => val?.toString() || ''),
  
  // Ensure business_unit is handled as a string
  businessUnit: z.any().transform(val => val?.toString() || ''),
  
  // Ensure owner is handled as a string
  owner: z.any().transform(val => val?.toString() || ''),
  
  // Ensure legal_entity is handled as a string
  legalEntity: z.any().transform(val => val?.toString() || ''),
});

export const insertRiskSchema = createInsertSchema(risks).omit({
  id: true, 
  createdAt: true,
  updatedAt: true,
}).extend({
  // Include inherentRisk and residualRisk to save calculated values as strings
  inherentRisk: z.string().default('0'),
  residualRisk: z.string().default('0'),
  // Ensure string fields are properly handled
  description: z.any().transform(val => val?.toString() || ''),
  vulnerability: z.any().transform(val => val?.toString() || ''),
  threatCommunity: z.any().transform(val => val?.toString() || ''),

  // Override all numeric fields to handle both string and number inputs
  // Contact frequency
  contactFrequencyMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  contactFrequencyAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  contactFrequencyMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Probability of action
  probabilityOfActionMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  probabilityOfActionAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  probabilityOfActionMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Threat event frequency
  threatEventFrequencyMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  threatEventFrequencyAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  threatEventFrequencyMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Threat capability
  threatCapabilityMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  threatCapabilityAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  threatCapabilityMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Resistance strength - Fixed to properly handle decimal values
  resistanceStrengthMin: z.union([z.number().nonnegative(), z.string().transform(val => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })]),
  resistanceStrengthAvg: z.union([z.number().nonnegative(), z.string().transform(val => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })]),
  resistanceStrengthMax: z.union([z.number().nonnegative(), z.string().transform(val => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })]),
  
  // Susceptibility
  susceptibilityMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  susceptibilityAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  susceptibilityMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Loss event frequency
  lossEventFrequencyMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  lossEventFrequencyAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  lossEventFrequencyMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Primary loss magnitude
  primaryLossMagnitudeMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  primaryLossMagnitudeAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  primaryLossMagnitudeMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Secondary loss event frequency
  secondaryLossEventFrequencyMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  secondaryLossEventFrequencyAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  secondaryLossEventFrequencyMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Secondary loss magnitude
  secondaryLossMagnitudeMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  secondaryLossMagnitudeAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  secondaryLossMagnitudeMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Loss magnitude
  lossMagnitudeMin: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  lossMagnitudeAvg: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  lossMagnitudeMax: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
  
  // Risk values
  rankPercentile: z.union([z.number().nonnegative(), z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))]),
});

export const insertControlSchema = createInsertSchema(controls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Ensure string fields are properly handled
  description: z.any().transform(val => val?.toString() || ''),
  name: z.any().transform(val => val?.toString() || ''),
  notes: z.any().transform(val => val?.toString() || ''),
  
  // Override numeric fields to handle both number and string inputs
  controlEffectiveness: z.union([
    z.number().nonnegative(),
    z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))
  ]),
  implementationCost: z.union([
    z.number().nonnegative(),
    z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))
  ]),
  costPerAgent: z.union([
    z.number().nonnegative(),
    z.string().transform(val => isNaN(Number(val)) ? 0 : Number(val))
  ]),
});

export const insertRiskResponseSchema = createInsertSchema(riskResponses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  // Ensure string fields are properly handled
  justification: z.any().transform(val => val?.toString() || ''),
  transferMethod: z.any().transform(val => val?.toString() || ''),
  avoidanceStrategy: z.any().transform(val => val?.toString() || ''),
  acceptanceReason: z.any().transform(val => val?.toString() || ''),
  riskId: z.any().transform(val => val?.toString() || ''),
});

export const insertLegalEntitySchema = createInsertSchema(legalEntities)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    // Ensure description is always handled as a string
    description: z.any().transform(val => val?.toString() || ''),
    // Ensure parentEntityId is always handled as a string or null
    parentEntityId: z.any().nullable().transform(val => val ? val.toString() : null),
  });

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
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

// Define types for risk library and control library 
export type RiskLibraryItem = typeof riskLibrary.$inferSelect;
export type ControlLibraryItem = typeof controlLibrary.$inferSelect;

// Asset relationship types

export type AssetRelationship = typeof assetRelationships.$inferSelect;
export const insertAssetRelationshipSchema = createInsertSchema(assetRelationships).omit({
  id: true,
  createdAt: true
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
  legalEntityId: text('legal_entity_id'), // Reference to entity_id in legalEntities
  
  // Risk Count Metrics
  totalRisks: integer('total_risks').notNull().default(0),
  criticalRisks: integer('critical_risks').notNull().default(0),
  highRisks: integer('high_risks').notNull().default(0),
  mediumRisks: integer('medium_risks').notNull().default(0),
  lowRisks: integer('low_risks').notNull().default(0),
  
  // Risk Value Metrics
  totalInherentRisk: real('total_inherent_risk').notNull().default(0),
  totalResidualRisk: real('total_residual_risk').notNull().default(0),
  
  // Exposure Statistics for Loss Exceedance Curve
  minimumExposure: real('minimum_exposure').notNull().default(0),
  maximumExposure: real('maximum_exposure').notNull().default(0),
  meanExposure: real('mean_exposure').notNull().default(0),
  medianExposure: real('median_exposure').notNull().default(0),
  
  // Enhanced percentile exposures
  percentile10Exposure: real('percentile_10_exposure').notNull().default(0),
  percentile25Exposure: real('percentile_25_exposure').notNull().default(0),
  percentile50Exposure: real('percentile_50_exposure').notNull().default(0),
  percentile75Exposure: real('percentile_75_exposure').notNull().default(0),
  percentile90Exposure: real('percentile_90_exposure').notNull().default(0),
  percentile95Exposure: real('percentile_95_exposure').notNull().default(0),
  percentile99Exposure: real('percentile_99_exposure').notNull().default(0),
  
  // Exposure Curve Data (JSON array of probability/impact pairs)
  exposureCurveData: json('exposure_curve_data').$type<Array<{probability: number, impact: number}>>().default([]),
  
  // DEPRECATED FIELDS - Legacy compatibility
  averageExposure: real('average_exposure').notNull().default(0),
  tenthPercentileExposure: real('tenth_percentile_exposure').notNull().default(0),
  mostLikelyExposure: real('most_likely_exposure').notNull().default(0),
  ninetiethPercentileExposure: real('ninetieth_percentile_exposure').notNull().default(0),
  
  // Standard date tracking
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
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
  
  // Authentication type and credentials
  authType: authTypeEnum('auth_type').notNull().default('local'),
  username: text('username').unique(), // For local auth (required if authType = 'local')
  email: text('email').notNull().unique(),
  
  // Secure password storage for local authentication
  passwordHash: text('password_hash'), // bcrypt hash (required if authType = 'local')
  
  // SSO authentication
  ssoSubject: text('sso_subject').unique(), // OpenID Connect subject identifier (required if authType = 'sso')
  ssoProvider: text('sso_provider'), // SSO provider name (e.g., 'replit', 'google', 'azure')
  
  // User profile information
  firstName: text('first_name'),
  lastName: text('last_name'),
  displayName: text('display_name'),
  profileImageUrl: text('profile_image_url'),
  
  // Authorization and status
  role: userRoleEnum('role').notNull().default('user'),
  isActive: boolean('is_active').notNull().default(true),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  
  // Session and activity tracking
  lastLogin: timestamp('last_login'),
  loginCount: integer('login_count').notNull().default(0),
  failedLoginAttempts: integer('failed_login_attempts').notNull().default(0),
  lastFailedLogin: timestamp('last_failed_login'),
  accountLockedUntil: timestamp('account_locked_until'),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: integer('created_by').references(() => users.id), // Who created this user account
});

// Note: activityLogs already defined earlier in the schema

// Session store for express-session with connect-pg-simple
export const sessions = pgTable('sessions', {
  sid: text('sid').primaryKey().notNull(),
  sess: json('sess').notNull(),
  expire: timestamp('expire').notNull()
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Special types for risk calculation (FAIR-U based)
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

// Vulnerability Status Enum
// Authentication Configuration Table for Dynamic OIDC Setup
export const authConfig = pgTable('auth_config', {
  id: serial('id').primaryKey(),
  
  // Primary authentication method
  authType: authTypeEnum('auth_type').notNull().default('local'),
  
  // OIDC Configuration (configurable via UI)
  oidcEnabled: boolean('oidc_enabled').default(false),
  oidcIssuer: text('oidc_issuer'),
  oidcClientId: text('oidc_client_id'),
  oidcClientSecret: text('oidc_client_secret'),
  oidcCallbackUrl: text('oidc_callback_url'),
  oidcScopes: json('oidc_scopes').$type<string[]>().default(['openid', 'profile', 'email']),
  
  // Security Settings
  sessionTimeout: integer('session_timeout').default(3600), // seconds
  maxLoginAttempts: integer('max_login_attempts').default(5),
  lockoutDuration: integer('lockout_duration').default(300), // seconds
  passwordMinLength: integer('password_min_length').default(8),
  requirePasswordChange: boolean('require_password_change').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const vulnerabilityStatusEnum = pgEnum('vulnerability_status', [
  'open',
  'in_progress', 
  'mitigated',
  'resolved',
  'false_positive'
]);

// Vulnerability Severity Enum
export const vulnerabilitySeverityEnum = pgEnum('vulnerability_severity', [
  'critical',
  'high',
  'medium',
  'low',
  'info'
]);

// Vulnerabilities Table
export const vulnerabilities = pgTable('vulnerabilities', {
  id: serial('id').primaryKey(),
  cveId: text('cve_id').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  cvssScore: real('cvss_score'),
  cvssVector: text('cvss_vector'),
  severity: vulnerabilitySeverityEnum('severity').notNull().default('medium'),
  status: vulnerabilityStatusEnum('status').notNull().default('open'),
  discoveredDate: timestamp('discovered_date').defaultNow(),
  remediatedDate: timestamp('remediated_date'),
  publishedDate: timestamp('published_date'),
  modifiedDate: timestamp('modified_date'),
  
  // FAIR-U Control Impact
  eDetectImpact: real('e_detect_impact').default(0), // How much this vuln reduces detection effectiveness (0-1)
  eResistImpact: real('e_resist_impact').default(0), // How much this vuln reduces resistance effectiveness (0-1)
  
  // Additional fields
  references: json('references').$type<string[]>().default([]),
  tags: json('tags').$type<string[]>().default([]),
  remediation: text('remediation'),
  workaround: text('workaround'),
  exploitAvailable: boolean('exploit_available').default(false),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Vulnerability to Asset Mapping Table
export const vulnerabilityAssets = pgTable('vulnerability_assets', {
  id: serial('id').primaryKey(),
  vulnerabilityId: integer('vulnerability_id').notNull().references(() => vulnerabilities.id, { onDelete: 'cascade' }),
  assetId: integer('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  
  // Asset-specific vulnerability details
  affectedVersions: json('affected_versions').$type<string[]>().default([]),
  patchLevel: text('patch_level'),
  exploitable: boolean('exploitable').default(true),
  notes: text('notes'),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  uniqueVulnAsset: uniqueIndex('unique_vuln_asset').on(table.vulnerabilityId, table.assetId)
}));

// Vulnerability Relations
export const vulnerabilityRelations = relations(vulnerabilities, ({ many }) => ({
  vulnerabilityAssets: many(vulnerabilityAssets)
}));

export const vulnerabilityAssetRelations = relations(vulnerabilityAssets, ({ one }) => ({
  vulnerability: one(vulnerabilities, {
    fields: [vulnerabilityAssets.vulnerabilityId],
    references: [vulnerabilities.id]
  }),
  asset: one(assets, {
    fields: [vulnerabilityAssets.assetId],
    references: [assets.id]
  })
}));

// Types
export type Vulnerability = typeof vulnerabilities.$inferSelect;
export type InsertVulnerability = typeof vulnerabilities.$inferInsert;
export type VulnerabilityAsset = typeof vulnerabilityAssets.$inferSelect;
export type InsertVulnerabilityAsset = typeof vulnerabilityAssets.$inferInsert;

// Zod schemas
export const insertVulnerabilitySchema = createInsertSchema(vulnerabilities);
export const insertVulnerabilityAssetSchema = createInsertSchema(vulnerabilityAssets);

// Auth Configuration Schema and Types
export const insertAuthConfigSchema = createInsertSchema(authConfig).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type AuthConfig = typeof authConfig.$inferSelect;
export type InsertAuthConfig = z.infer<typeof insertAuthConfigSchema>;

// User Management Types for Local Auth
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
