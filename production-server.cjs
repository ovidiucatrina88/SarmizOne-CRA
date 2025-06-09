"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activityLogs: () => activityLogs,
  assetRelationships: () => assetRelationships,
  assetStatusEnum: () => assetStatusEnum,
  assetTypeEnum: () => assetTypeEnum,
  assets: () => assets,
  authConfig: () => authConfig2,
  authTypeEnum: () => authTypeEnum,
  ciaRatingEnum: () => ciaRatingEnum,
  controlCategoryEnum: () => controlCategoryEnum,
  controlLibrary: () => controlLibrary,
  controlTypeEnum: () => controlTypeEnum,
  controls: () => controls,
  costModuleTypeEnum: () => costModuleTypeEnum,
  currencyEnum: () => currencyEnum,
  enterpriseArchitecture: () => enterpriseArchitecture,
  enterpriseArchitectureRelations: () => enterpriseArchitectureRelations,
  externalInternalEnum: () => externalInternalEnum,
  hierarchyLevelEnum: () => hierarchyLevelEnum,
  implementationStatusEnum: () => implementationStatusEnum,
  insertActivityLogSchema: () => insertActivityLogSchema,
  insertAssetRelationshipSchema: () => insertAssetRelationshipSchema,
  insertAssetSchema: () => insertAssetSchema,
  insertAuthConfigSchema: () => insertAuthConfigSchema,
  insertControlSchema: () => insertControlSchema,
  insertEnterpriseArchitectureSchema: () => insertEnterpriseArchitectureSchema,
  insertLegalEntitySchema: () => insertLegalEntitySchema,
  insertRiskResponseSchema: () => insertRiskResponseSchema,
  insertRiskSchema: () => insertRiskSchema,
  insertRiskSummarySchema: () => insertRiskSummarySchema,
  insertUserSchema: () => insertUserSchema,
  insertVulnerabilityAssetSchema: () => insertVulnerabilityAssetSchema,
  insertVulnerabilitySchema: () => insertVulnerabilitySchema,
  itemTypeEnum: () => itemTypeEnum,
  legalEntities: () => legalEntities,
  relationshipTypeEnum: () => relationshipTypeEnum,
  riskCategoryEnum: () => riskCategoryEnum,
  riskControls: () => riskControls,
  riskCosts: () => riskCosts,
  riskLibrary: () => riskLibrary,
  riskResponseTypeEnum: () => riskResponseTypeEnum,
  riskResponses: () => riskResponses,
  riskSummaries: () => riskSummaries,
  risks: () => risks,
  sessions: () => sessions,
  severityEnum: () => severityEnum,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  vulnerabilities: () => vulnerabilities,
  vulnerabilityAssetRelations: () => vulnerabilityAssetRelations,
  vulnerabilityAssets: () => vulnerabilityAssets,
  vulnerabilityRelations: () => vulnerabilityRelations,
  vulnerabilitySeverityEnum: () => vulnerabilitySeverityEnum,
  vulnerabilityStatusEnum: () => vulnerabilityStatusEnum
});
var import_pg_core, import_drizzle_zod, import_zod, import_drizzle_orm, costModuleTypeEnum, assetTypeEnum, assetStatusEnum, ciaRatingEnum, externalInternalEnum, hierarchyLevelEnum, relationshipTypeEnum, riskCategoryEnum, controlTypeEnum, controlCategoryEnum, implementationStatusEnum, riskResponseTypeEnum, severityEnum, currencyEnum, userRoleEnum, authTypeEnum, itemTypeEnum, assets, assetRelationships, enterpriseArchitecture, enterpriseArchitectureRelations, insertEnterpriseArchitectureSchema, risks, controls, controlLibrary, riskLibrary, riskControls, riskResponses, riskCosts, legalEntities, activityLogs, insertAssetSchema, insertRiskSchema, insertControlSchema, insertRiskResponseSchema, insertLegalEntitySchema, insertActivityLogSchema, insertAssetRelationshipSchema, riskSummaries, insertRiskSummarySchema, users, sessions, insertUserSchema, authConfig2, vulnerabilityStatusEnum, vulnerabilitySeverityEnum, vulnerabilities, vulnerabilityAssets, vulnerabilityRelations, vulnerabilityAssetRelations, insertVulnerabilitySchema, insertVulnerabilityAssetSchema, insertAuthConfigSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
    import_zod = require("zod");
    import_drizzle_orm = require("drizzle-orm");
    costModuleTypeEnum = (0, import_pg_core.pgEnum)("cost_module_type", [
      "fixed",
      "per_event",
      "per_hour",
      "percentage"
    ]);
    assetTypeEnum = (0, import_pg_core.pgEnum)("asset_type", [
      "data",
      "application",
      "device",
      "system",
      "network",
      "facility",
      "personnel",
      "other",
      // Only L4 and L5 types for assets
      "application_service",
      // L4
      "technical_component"
      // L5
    ]);
    assetStatusEnum = (0, import_pg_core.pgEnum)("asset_status", [
      "Active",
      "Decommissioned",
      "To Adopt"
    ]);
    ciaRatingEnum = (0, import_pg_core.pgEnum)("cia_rating", [
      "low",
      "medium",
      "high"
    ]);
    externalInternalEnum = (0, import_pg_core.pgEnum)("external_internal", [
      "external",
      "internal"
    ]);
    hierarchyLevelEnum = (0, import_pg_core.pgEnum)("hierarchy_level", [
      "strategic_capability",
      // L1 - Strategic Capability
      "value_capability",
      // L2 - Value Capability
      "business_service",
      // L3 - Business Service
      "application_service",
      // L4 - Application Service
      "technical_component"
      // L5 - Technical Component
    ]);
    relationshipTypeEnum = (0, import_pg_core.pgEnum)("relationship_type", [
      "part_of",
      // Component is part of a larger system
      "depends_on",
      // Asset depends on another asset
      "contains"
      // Asset contains sub-assets
    ]);
    riskCategoryEnum = (0, import_pg_core.pgEnum)("risk_category", [
      "operational",
      "strategic",
      "compliance",
      "financial"
    ]);
    controlTypeEnum = (0, import_pg_core.pgEnum)("control_type", [
      "preventive",
      "detective",
      "corrective"
    ]);
    controlCategoryEnum = (0, import_pg_core.pgEnum)("control_category", [
      "technical",
      "administrative",
      "physical"
    ]);
    implementationStatusEnum = (0, import_pg_core.pgEnum)("implementation_status", [
      "not_implemented",
      "in_progress",
      "fully_implemented",
      "planned"
    ]);
    riskResponseTypeEnum = (0, import_pg_core.pgEnum)("risk_response_type", [
      "accept",
      "avoid",
      "transfer",
      "mitigate"
    ]);
    severityEnum = (0, import_pg_core.pgEnum)("severity", [
      "low",
      "medium",
      "high",
      "critical"
    ]);
    currencyEnum = (0, import_pg_core.pgEnum)("currency", ["USD", "EUR"]);
    userRoleEnum = (0, import_pg_core.pgEnum)("user_role", [
      "user",
      // Read-only access
      "admin"
      // Read-write access
    ]);
    authTypeEnum = (0, import_pg_core.pgEnum)("auth_type", [
      "local",
      // Local username/password authentication
      "sso"
      // Single Sign-On (OpenID Connect)
    ]);
    itemTypeEnum = (0, import_pg_core.pgEnum)("item_type", [
      "template",
      // Original template from library
      "instance"
      // Instance created for a specific risk/asset
    ]);
    assets = (0, import_pg_core.pgTable)("assets", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      assetId: (0, import_pg_core.text)("asset_id").notNull(),
      // Unique constraint already added in DB
      name: (0, import_pg_core.text)("name").notNull(),
      type: assetTypeEnum("type").notNull(),
      status: assetStatusEnum("status").notNull().default("Active"),
      // Asset status (Active, Decommissioned, To Adopt)
      owner: (0, import_pg_core.text)("owner").notNull(),
      legalEntity: (0, import_pg_core.text)("legal_entity").notNull().default("Unknown"),
      // Legal entity that owns this asset
      confidentiality: ciaRatingEnum("confidentiality").notNull(),
      integrity: ciaRatingEnum("integrity").notNull(),
      availability: ciaRatingEnum("availability").notNull(),
      assetValue: (0, import_pg_core.numeric)("asset_value", { precision: 38, scale: 2 }).notNull(),
      // Monetary value with high precision
      currency: currencyEnum("currency").notNull().default("USD"),
      // USD or EUR
      regulatoryImpact: (0, import_pg_core.text)("regulatory_impact").array().notNull().default(["none"]),
      // GDPR, HIPAA, etc.
      externalInternal: externalInternalEnum("external_internal").notNull(),
      dependencies: (0, import_pg_core.text)("dependencies").array().notNull().default([]),
      agentCount: (0, import_pg_core.integer)("agent_count").notNull().default(1),
      // Number of agents required for this asset
      description: (0, import_pg_core.text)("description").notNull().default(""),
      // Enterprise architecture fields
      business_unit: (0, import_pg_core.text)("business_unit").default("Information Technology"),
      // Business unit that owns this asset
      hierarchy_level: (0, import_pg_core.text)("hierarchy_level").default("application_service"),
      // Hierarchy level (L4, L5)
      architecture_domain: (0, import_pg_core.text)("architecture_domain").default("Application"),
      // Architecture domain
      parentId: (0, import_pg_core.integer)("parent_id"),
      // Hierarchical relationship (for connecting to higher level architecture items)
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    assetRelationships = (0, import_pg_core.pgTable)("asset_relationships", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      sourceAssetId: (0, import_pg_core.integer)("source_asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
      targetAssetId: (0, import_pg_core.integer)("target_asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
      relationshipType: relationshipTypeEnum("relationship_type").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    enterpriseArchitecture = (0, import_pg_core.pgTable)("enterprise_architecture", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      assetId: (0, import_pg_core.text)("asset_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      level: (0, import_pg_core.text)("level").notNull(),
      // L1, L2, or L3
      type: (0, import_pg_core.text)("type").notNull(),
      // strategic_capability, value_capability, business_service, product_service
      architectureDomain: (0, import_pg_core.text)("architecture_domain"),
      parentId: (0, import_pg_core.integer)("parent_id").references(() => enterpriseArchitecture.id),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    enterpriseArchitectureRelations = (0, import_drizzle_orm.relations)(enterpriseArchitecture, ({ one }) => ({
      parent: one(enterpriseArchitecture, {
        fields: [enterpriseArchitecture.parentId],
        references: [enterpriseArchitecture.id],
        relationName: "parent_child"
      })
    }));
    insertEnterpriseArchitectureSchema = (0, import_drizzle_zod.createInsertSchema)(enterpriseArchitecture).omit({ id: true, createdAt: true, updatedAt: true });
    risks = (0, import_pg_core.pgTable)("risks", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.text)("risk_id").notNull(),
      // Unique constraint already added in DB
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      associatedAssets: (0, import_pg_core.text)("associated_assets").array().notNull(),
      // Array of assetIds
      threatCommunity: (0, import_pg_core.text)("threat_community").notNull(),
      vulnerability: (0, import_pg_core.text)("vulnerability").notNull(),
      riskCategory: riskCategoryEnum("risk_category").notNull(),
      severity: severityEnum("severity").notNull(),
      // Library integration fields
      libraryItemId: (0, import_pg_core.integer)("library_item_id").references(() => riskLibrary.id),
      // Reference to source risk library item
      itemType: itemTypeEnum("item_type").default("instance"),
      // Whether this is a template or instance
      // FAIR-U Specific values (Based on FAIR v3.0, April 2025)
      // Contact Frequency (CF) - How often threat agents come in contact
      contactFrequencyMin: (0, import_pg_core.real)("contact_frequency_min").notNull().default(0),
      contactFrequencyAvg: (0, import_pg_core.real)("contact_frequency_avg").notNull().default(0),
      contactFrequencyMax: (0, import_pg_core.real)("contact_frequency_max").notNull().default(0),
      contactFrequencyConfidence: (0, import_pg_core.text)("contact_frequency_confidence").notNull().default("Medium"),
      // Probability of Action (POA) - Likelihood of threat agent taking action
      probabilityOfActionMin: (0, import_pg_core.real)("probability_of_action_min").notNull().default(0),
      probabilityOfActionAvg: (0, import_pg_core.real)("probability_of_action_avg").notNull().default(0),
      probabilityOfActionMax: (0, import_pg_core.real)("probability_of_action_max").notNull().default(0),
      probabilityOfActionConfidence: (0, import_pg_core.text)("probability_of_action_confidence").notNull().default("Medium"),
      // Threat Event Frequency (TEF) - Calculated
      threatEventFrequencyMin: (0, import_pg_core.real)("threat_event_frequency_min").notNull().default(0),
      threatEventFrequencyAvg: (0, import_pg_core.real)("threat_event_frequency_avg").notNull().default(0),
      threatEventFrequencyMax: (0, import_pg_core.real)("threat_event_frequency_max").notNull().default(0),
      threatEventFrequencyConfidence: (0, import_pg_core.text)("threat_event_frequency_confidence").notNull().default("Medium"),
      // Threat Capability (TCap) - Capability of threat agent
      threatCapabilityMin: (0, import_pg_core.real)("threat_capability_min").notNull().default(0),
      threatCapabilityAvg: (0, import_pg_core.real)("threat_capability_avg").notNull().default(0),
      threatCapabilityMax: (0, import_pg_core.real)("threat_capability_max").notNull().default(0),
      threatCapabilityConfidence: (0, import_pg_core.text)("threat_capability_confidence").notNull().default("Medium"),
      // Resistance Strength (RS) - Strength of controls
      resistanceStrengthMin: (0, import_pg_core.real)("resistance_strength_min").notNull().default(0),
      resistanceStrengthAvg: (0, import_pg_core.real)("resistance_strength_avg").notNull().default(0),
      resistanceStrengthMax: (0, import_pg_core.real)("resistance_strength_max").notNull().default(0),
      resistanceStrengthConfidence: (0, import_pg_core.text)("resistance_strength_confidence").notNull().default("Medium"),
      // Susceptibility (Susc) - Calculated
      // susceptibility field isn't in the actual database, so commenting it out
      // susceptibility: numeric('susceptibility', { precision: 38, scale: 2 }).notNull().default(0), // Overall susceptibility value
      susceptibilityMin: (0, import_pg_core.real)("susceptibility_min").notNull().default(0),
      susceptibilityAvg: (0, import_pg_core.real)("susceptibility_avg").notNull().default(0),
      susceptibilityMax: (0, import_pg_core.real)("susceptibility_max").notNull().default(0),
      susceptibilityConfidence: (0, import_pg_core.text)("susceptibility_confidence").notNull().default("Medium"),
      // Loss Event Frequency (LEF) - Calculated
      lossEventFrequencyMin: (0, import_pg_core.real)("loss_event_frequency_min").notNull().default(0),
      lossEventFrequencyAvg: (0, import_pg_core.real)("loss_event_frequency_avg").notNull().default(0),
      lossEventFrequencyMax: (0, import_pg_core.real)("loss_event_frequency_max").notNull().default(0),
      lossEventFrequencyConfidence: (0, import_pg_core.text)("loss_event_frequency_confidence").notNull().default("Medium"),
      // Primary Loss (PL)
      primaryLossMagnitudeMin: (0, import_pg_core.numeric)("primary_loss_magnitude_min", { precision: 38, scale: 2 }).notNull().default("0"),
      primaryLossMagnitudeAvg: (0, import_pg_core.numeric)("primary_loss_magnitude_avg", { precision: 38, scale: 2 }).notNull().default("0"),
      primaryLossMagnitudeMax: (0, import_pg_core.numeric)("primary_loss_magnitude_max", { precision: 38, scale: 2 }).notNull().default("0"),
      primaryLossMagnitudeConfidence: (0, import_pg_core.text)("primary_loss_magnitude_confidence").notNull().default("Medium"),
      // Secondary Loss Event Frequency (SLEF)
      secondaryLossEventFrequencyMin: (0, import_pg_core.real)("secondary_loss_event_frequency_min").notNull().default(0),
      secondaryLossEventFrequencyAvg: (0, import_pg_core.real)("secondary_loss_event_frequency_avg").notNull().default(0),
      secondaryLossEventFrequencyMax: (0, import_pg_core.real)("secondary_loss_event_frequency_max").notNull().default(0),
      secondaryLossEventFrequencyConfidence: (0, import_pg_core.text)("secondary_loss_event_frequency_confidence").notNull().default("Medium"),
      // Secondary Loss Magnitude (SLM)
      secondaryLossMagnitudeMin: (0, import_pg_core.numeric)("secondary_loss_magnitude_min", { precision: 38, scale: 2 }).notNull().default("0"),
      secondaryLossMagnitudeAvg: (0, import_pg_core.numeric)("secondary_loss_magnitude_avg", { precision: 38, scale: 2 }).notNull().default("0"),
      secondaryLossMagnitudeMax: (0, import_pg_core.numeric)("secondary_loss_magnitude_max", { precision: 38, scale: 2 }).notNull().default("0"),
      secondaryLossMagnitudeConfidence: (0, import_pg_core.text)("secondary_loss_magnitude_confidence").notNull().default("Medium"),
      // Loss Magnitude (LM) - Calculated
      lossMagnitudeMin: (0, import_pg_core.numeric)("loss_magnitude_min", { precision: 38, scale: 2 }).notNull().default("0"),
      lossMagnitudeAvg: (0, import_pg_core.numeric)("loss_magnitude_avg", { precision: 38, scale: 2 }).notNull().default("0"),
      lossMagnitudeMax: (0, import_pg_core.numeric)("loss_magnitude_max", { precision: 38, scale: 2 }).notNull().default("0"),
      lossMagnitudeConfidence: (0, import_pg_core.text)("loss_magnitude_confidence").notNull().default("Medium"),
      // Risk values - store as text to avoid precision issues
      inherentRisk: (0, import_pg_core.text)("inherent_risk").notNull().default("0"),
      // In dollars (before controls)
      residualRisk: (0, import_pg_core.text)("residual_risk").notNull().default("0"),
      // In dollars (after controls)
      rankPercentile: (0, import_pg_core.real)("rank_percentile").notNull().default(0),
      // Percentile ranking of this risk
      // Additional metadata
      // notes field doesn't exist in the actual database, commented out to match DB schema
      // notes: text('notes').notNull().default(''), // Additional notes about the risk
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    controls = (0, import_pg_core.pgTable)("controls", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      controlId: (0, import_pg_core.text)("control_id").notNull(),
      // Unique constraint already added in DB
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      associatedRisks: (0, import_pg_core.text)("associated_risks").array().notNull().default([]),
      // Array of riskIds
      controlType: controlTypeEnum("control_type").notNull(),
      controlCategory: controlCategoryEnum("control_category").notNull(),
      implementationStatus: implementationStatusEnum("implementation_status").notNull(),
      controlEffectiveness: (0, import_pg_core.real)("control_effectiveness").notNull(),
      // 0-10 scale for FAIR-U resistance strength
      implementationCost: (0, import_pg_core.numeric)("implementation_cost", { precision: 38, scale: 2 }).notNull().default("0"),
      // Total implementation cost
      costPerAgent: (0, import_pg_core.numeric)("cost_per_agent", { precision: 38, scale: 2 }).notNull().default("0"),
      // Cost per agent/workload
      isPerAgentPricing: (0, import_pg_core.boolean)("is_per_agent_pricing").notNull().default(false),
      // Whether to use per-agent pricing
      deployedAgentCount: (0, import_pg_core.integer)("deployed_agent_count").default(0),
      // For in_progress controls: track deployed agents
      notes: (0, import_pg_core.text)("notes").notNull().default(""),
      // New fields for library integration
      libraryItemId: (0, import_pg_core.integer)("library_item_id"),
      // Reference to source library item 
      itemType: itemTypeEnum("item_type").default("instance"),
      // Whether this is a template or instance
      assetId: (0, import_pg_core.text)("asset_id"),
      // Link to associated asset (if applicable)
      riskId: (0, import_pg_core.integer)("risk_id"),
      // Link to associated risk (if applicable)
      legalEntityId: (0, import_pg_core.text)("legal_entity_id"),
      // Link to associated legal entity (if applicable)
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    controlLibrary = (0, import_pg_core.pgTable)("control_library", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      controlId: (0, import_pg_core.text)("control_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      controlType: controlTypeEnum("control_type").notNull(),
      controlCategory: controlCategoryEnum("control_category").notNull(),
      implementationStatus: implementationStatusEnum("implementation_status").notNull().default("planned"),
      controlEffectiveness: (0, import_pg_core.real)("control_effectiveness").notNull().default(0),
      // 0-10 scale for FAIR-U resistance strength
      implementationCost: (0, import_pg_core.numeric)("implementation_cost", { precision: 38, scale: 2 }).notNull().default("0"),
      costPerAgent: (0, import_pg_core.numeric)("cost_per_agent", { precision: 38, scale: 2 }).notNull().default("0"),
      isPerAgentPricing: (0, import_pg_core.boolean)("is_per_agent_pricing").notNull().default(false),
      notes: (0, import_pg_core.text)("notes").notNull().default(""),
      nistCsf: (0, import_pg_core.text)("nist_csf").array().notNull().default([]),
      // NIST Cybersecurity Framework mappings
      iso27001: (0, import_pg_core.text)("iso27001").array().notNull().default([]),
      // ISO 27001 control mappings
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskLibrary = (0, import_pg_core.pgTable)("risk_library", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.text)("risk_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      threatCommunity: (0, import_pg_core.text)("threat_community").notNull().default(""),
      vulnerability: (0, import_pg_core.text)("vulnerability").notNull().default(""),
      riskCategory: riskCategoryEnum("risk_category").notNull(),
      severity: severityEnum("severity").notNull().default("medium"),
      // FAIR-U Specific parameters (same as in risks table)
      contactFrequencyMin: (0, import_pg_core.real)("contact_frequency_min").notNull().default(0),
      contactFrequencyAvg: (0, import_pg_core.real)("contact_frequency_avg").notNull().default(0),
      contactFrequencyMax: (0, import_pg_core.real)("contact_frequency_max").notNull().default(0),
      contactFrequencyConfidence: (0, import_pg_core.text)("contact_frequency_confidence").notNull().default("Medium"),
      probabilityOfActionMin: (0, import_pg_core.real)("probability_of_action_min").notNull().default(0),
      probabilityOfActionAvg: (0, import_pg_core.real)("probability_of_action_avg").notNull().default(0),
      probabilityOfActionMax: (0, import_pg_core.real)("probability_of_action_max").notNull().default(0),
      probabilityOfActionConfidence: (0, import_pg_core.text)("probability_of_action_confidence").notNull().default("Medium"),
      threatCapabilityMin: (0, import_pg_core.real)("threat_capability_min").notNull().default(0),
      threatCapabilityAvg: (0, import_pg_core.real)("threat_capability_avg").notNull().default(0),
      threatCapabilityMax: (0, import_pg_core.real)("threat_capability_max").notNull().default(0),
      threatCapabilityConfidence: (0, import_pg_core.text)("threat_capability_confidence").notNull().default("Medium"),
      resistanceStrengthMin: (0, import_pg_core.real)("resistance_strength_min").notNull().default(0),
      resistanceStrengthAvg: (0, import_pg_core.real)("resistance_strength_avg").notNull().default(0),
      resistanceStrengthMax: (0, import_pg_core.real)("resistance_strength_max").notNull().default(0),
      resistanceStrengthConfidence: (0, import_pg_core.text)("resistance_strength_confidence").notNull().default("Medium"),
      primaryLossMagnitudeMin: (0, import_pg_core.real)("primary_loss_magnitude_min").notNull().default(0),
      primaryLossMagnitudeAvg: (0, import_pg_core.real)("primary_loss_magnitude_avg").notNull().default(0),
      primaryLossMagnitudeMax: (0, import_pg_core.real)("primary_loss_magnitude_max").notNull().default(0),
      primaryLossMagnitudeConfidence: (0, import_pg_core.text)("primary_loss_magnitude_confidence").notNull().default("Medium"),
      secondaryLossEventFrequencyMin: (0, import_pg_core.real)("secondary_loss_event_frequency_min").notNull().default(0),
      secondaryLossEventFrequencyAvg: (0, import_pg_core.real)("secondary_loss_event_frequency_avg").notNull().default(0),
      secondaryLossEventFrequencyMax: (0, import_pg_core.real)("secondary_loss_event_frequency_max").notNull().default(0),
      secondaryLossEventFrequencyConfidence: (0, import_pg_core.text)("secondary_loss_event_frequency_confidence").notNull().default("Medium"),
      secondaryLossMagnitudeMin: (0, import_pg_core.real)("secondary_loss_magnitude_min").notNull().default(0),
      secondaryLossMagnitudeAvg: (0, import_pg_core.real)("secondary_loss_magnitude_avg").notNull().default(0),
      secondaryLossMagnitudeMax: (0, import_pg_core.real)("secondary_loss_magnitude_max").notNull().default(0),
      secondaryLossMagnitudeConfidence: (0, import_pg_core.text)("secondary_loss_magnitude_confidence").notNull().default("Medium"),
      // Recommended controls
      recommendedControls: (0, import_pg_core.text)("recommended_controls").array().notNull().default([]),
      // Array of controlIds from control library
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskControls = (0, import_pg_core.pgTable)("risk_controls", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.integer)("risk_id").notNull(),
      controlId: (0, import_pg_core.integer)("control_id").notNull(),
      effectiveness: (0, import_pg_core.real)("effectiveness").notNull().default(0),
      // 0-10 effectiveness rating specific to this risk-control pairing
      notes: (0, import_pg_core.text)("notes").notNull().default(""),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskResponses = (0, import_pg_core.pgTable)("risk_responses", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.text)("risk_id").notNull().references(() => risks.riskId),
      responseType: riskResponseTypeEnum("response_type").notNull(),
      justification: (0, import_pg_core.text)("justification").notNull().default(""),
      assignedControls: (0, import_pg_core.text)("assigned_controls").array().notNull().default([]),
      // Array of controlIds, if mitigate
      transferMethod: (0, import_pg_core.text)("transfer_method").notNull().default(""),
      // Description of risk transfer, if transfer
      avoidanceStrategy: (0, import_pg_core.text)("avoidance_strategy").notNull().default(""),
      // Description of risk avoidance, if avoid
      acceptanceReason: (0, import_pg_core.text)("acceptance_reason").notNull().default(""),
      // Reason for acceptance, if accept
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskCosts = (0, import_pg_core.pgTable)("risk_costs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.integer)("risk_id").notNull(),
      // References risks.id (numeric ID)
      costModuleId: (0, import_pg_core.integer)("cost_module_id").notNull(),
      // References cost_modules.id
      weight: (0, import_pg_core.numeric)("weight", { precision: 10, scale: 2 }).notNull().default("1.0"),
      // Materiality weighting
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    legalEntities = (0, import_pg_core.pgTable)("legal_entities", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      entityId: (0, import_pg_core.text)("entity_id").notNull(),
      // Unique identifier
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull().default(""),
      parentEntityId: (0, import_pg_core.text)("parent_entity_id"),
      // For hierarchy
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    activityLogs = (0, import_pg_core.pgTable)("activity_logs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      activity: (0, import_pg_core.text)("activity").notNull(),
      user: (0, import_pg_core.text)("user").notNull(),
      entity: (0, import_pg_core.text)("entity").notNull(),
      entityType: (0, import_pg_core.text)("entity_type").notNull(),
      // asset, risk, control, response
      entityId: (0, import_pg_core.text)("entity_id").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    insertAssetSchema = (0, import_drizzle_zod.createInsertSchema)(assets).omit({
      id: true,
      createdAt: true
    }).extend({
      // Override the assetValue field to ensure it's always a number
      assetValue: import_zod.z.number().nonnegative(),
      // Override the agentCount field to ensure it's always a number
      agentCount: import_zod.z.number().int().nonnegative(),
      // Ensure description is handled as a string
      description: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Ensure business_unit is handled as a string
      businessUnit: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Ensure owner is handled as a string
      owner: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Ensure legal_entity is handled as a string
      legalEntity: import_zod.z.any().transform((val) => val?.toString() || "")
    });
    insertRiskSchema = (0, import_drizzle_zod.createInsertSchema)(risks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      // Include inherentRisk and residualRisk to save calculated values as strings
      inherentRisk: import_zod.z.string().default("0"),
      residualRisk: import_zod.z.string().default("0"),
      // Ensure string fields are properly handled
      description: import_zod.z.any().transform((val) => val?.toString() || ""),
      vulnerability: import_zod.z.any().transform((val) => val?.toString() || ""),
      threatCommunity: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Override all numeric fields to handle both string and number inputs
      // Contact frequency
      contactFrequencyMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      contactFrequencyAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      contactFrequencyMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Probability of action
      probabilityOfActionMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      probabilityOfActionAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      probabilityOfActionMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Threat event frequency
      threatEventFrequencyMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      threatEventFrequencyAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      threatEventFrequencyMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Threat capability
      threatCapabilityMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      threatCapabilityAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      threatCapabilityMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Resistance strength - Fixed to properly handle decimal values
      resistanceStrengthMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      })]),
      resistanceStrengthAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      })]),
      resistanceStrengthMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      })]),
      // Susceptibility
      susceptibilityMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      susceptibilityAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      susceptibilityMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Loss event frequency
      lossEventFrequencyMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      lossEventFrequencyAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      lossEventFrequencyMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Primary loss magnitude
      primaryLossMagnitudeMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      primaryLossMagnitudeAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      primaryLossMagnitudeMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Secondary loss event frequency
      secondaryLossEventFrequencyMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      secondaryLossEventFrequencyAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      secondaryLossEventFrequencyMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Secondary loss magnitude
      secondaryLossMagnitudeMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      secondaryLossMagnitudeAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      secondaryLossMagnitudeMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Loss magnitude
      lossMagnitudeMin: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      lossMagnitudeAvg: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      lossMagnitudeMax: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))]),
      // Risk values
      rankPercentile: import_zod.z.union([import_zod.z.number().nonnegative(), import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))])
    });
    insertControlSchema = (0, import_drizzle_zod.createInsertSchema)(controls).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      // Ensure string fields are properly handled
      description: import_zod.z.any().transform((val) => val?.toString() || ""),
      name: import_zod.z.any().transform((val) => val?.toString() || ""),
      notes: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Override numeric fields to handle both number and string inputs
      controlEffectiveness: import_zod.z.union([
        import_zod.z.number().nonnegative(),
        import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))
      ]),
      implementationCost: import_zod.z.union([
        import_zod.z.number().nonnegative(),
        import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))
      ]),
      costPerAgent: import_zod.z.union([
        import_zod.z.number().nonnegative(),
        import_zod.z.string().transform((val) => isNaN(Number(val)) ? 0 : Number(val))
      ])
    });
    insertRiskResponseSchema = (0, import_drizzle_zod.createInsertSchema)(riskResponses).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    }).extend({
      // Ensure string fields are properly handled
      justification: import_zod.z.any().transform((val) => val?.toString() || ""),
      transferMethod: import_zod.z.any().transform((val) => val?.toString() || ""),
      avoidanceStrategy: import_zod.z.any().transform((val) => val?.toString() || ""),
      acceptanceReason: import_zod.z.any().transform((val) => val?.toString() || ""),
      riskId: import_zod.z.any().transform((val) => val?.toString() || "")
    });
    insertLegalEntitySchema = (0, import_drizzle_zod.createInsertSchema)(legalEntities).omit({
      id: true,
      createdAt: true
    }).extend({
      // Ensure description is always handled as a string
      description: import_zod.z.any().transform((val) => val?.toString() || ""),
      // Ensure parentEntityId is always handled as a string or null
      parentEntityId: import_zod.z.any().nullable().transform((val) => val ? val.toString() : null)
    });
    insertActivityLogSchema = (0, import_drizzle_zod.createInsertSchema)(activityLogs).omit({
      id: true,
      createdAt: true
    });
    insertAssetRelationshipSchema = (0, import_drizzle_zod.createInsertSchema)(assetRelationships).omit({
      id: true,
      createdAt: true
    });
    riskSummaries = (0, import_pg_core.pgTable)("risk_summaries", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      year: (0, import_pg_core.integer)("year").notNull(),
      month: (0, import_pg_core.integer)("month").notNull(),
      legalEntityId: (0, import_pg_core.text)("legal_entity_id"),
      // Reference to entity_id in legalEntities
      // SIMPLIFIED APPROACH - These are the primary fields to use going forward
      // for all risk exposure calculations and visualizations:
      minimumExposure: (0, import_pg_core.real)("minimum_exposure").notNull().default(0),
      // Represents 10th percentile
      averageExposure: (0, import_pg_core.real)("average_exposure").notNull().default(0),
      // Represents most likely value
      maximumExposure: (0, import_pg_core.real)("maximum_exposure").notNull().default(0),
      // Represents 90th percentile
      // DEPRECATED FIELDS - These are duplicates that should be phased out:
      tenthPercentileExposure: (0, import_pg_core.real)("tenth_percentile_exposure").notNull().default(0),
      // Same as minimumExposure
      mostLikelyExposure: (0, import_pg_core.real)("most_likely_exposure").notNull().default(0),
      // Same as averageExposure
      ninetiethPercentileExposure: (0, import_pg_core.real)("ninetieth_percentile_exposure").notNull().default(0),
      // Same as maximumExposure
      // Standard date tracking
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    insertRiskSummarySchema = (0, import_drizzle_zod.createInsertSchema)(riskSummaries).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    users = (0, import_pg_core.pgTable)("users", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      // Authentication type and credentials
      authType: authTypeEnum("auth_type").notNull().default("local"),
      username: (0, import_pg_core.text)("username").unique(),
      // For local auth (required if authType = 'local')
      email: (0, import_pg_core.text)("email").notNull().unique(),
      // Secure password storage for local authentication
      passwordHash: (0, import_pg_core.text)("password_hash"),
      // bcrypt hash (required if authType = 'local')
      // SSO authentication
      ssoSubject: (0, import_pg_core.text)("sso_subject").unique(),
      // OpenID Connect subject identifier (required if authType = 'sso')
      ssoProvider: (0, import_pg_core.text)("sso_provider"),
      // SSO provider name (e.g., 'replit', 'google', 'azure')
      // User profile information
      firstName: (0, import_pg_core.text)("first_name"),
      lastName: (0, import_pg_core.text)("last_name"),
      displayName: (0, import_pg_core.text)("display_name"),
      profileImageUrl: (0, import_pg_core.text)("profile_image_url"),
      // Authorization and status
      role: userRoleEnum("role").notNull().default("user"),
      isActive: (0, import_pg_core.boolean)("is_active").notNull().default(true),
      isEmailVerified: (0, import_pg_core.boolean)("is_email_verified").notNull().default(false),
      // Session and activity tracking
      lastLogin: (0, import_pg_core.timestamp)("last_login"),
      loginCount: (0, import_pg_core.integer)("login_count").notNull().default(0),
      failedLoginAttempts: (0, import_pg_core.integer)("failed_login_attempts").notNull().default(0),
      lastFailedLogin: (0, import_pg_core.timestamp)("last_failed_login"),
      accountLockedUntil: (0, import_pg_core.timestamp)("account_locked_until"),
      // Metadata
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull(),
      createdBy: (0, import_pg_core.integer)("created_by").references(() => users.id)
      // Who created this user account
    });
    sessions = (0, import_pg_core.pgTable)("sessions", {
      sid: (0, import_pg_core.text)("sid").primaryKey().notNull(),
      sess: (0, import_pg_core.json)("sess").notNull(),
      expire: (0, import_pg_core.timestamp)("expire").notNull()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true
    });
    authConfig2 = (0, import_pg_core.pgTable)("auth_config", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      // Primary authentication method
      authType: authTypeEnum("auth_type").notNull().default("local"),
      // OIDC Configuration (configurable via UI)
      oidcEnabled: (0, import_pg_core.boolean)("oidc_enabled").default(false),
      oidcIssuer: (0, import_pg_core.text)("oidc_issuer"),
      oidcClientId: (0, import_pg_core.text)("oidc_client_id"),
      oidcClientSecret: (0, import_pg_core.text)("oidc_client_secret"),
      oidcCallbackUrl: (0, import_pg_core.text)("oidc_callback_url"),
      oidcScopes: (0, import_pg_core.json)("oidc_scopes").$type().default(["openid", "profile", "email"]),
      // Security Settings
      sessionTimeout: (0, import_pg_core.integer)("session_timeout").default(3600),
      // seconds
      maxLoginAttempts: (0, import_pg_core.integer)("max_login_attempts").default(5),
      lockoutDuration: (0, import_pg_core.integer)("lockout_duration").default(300),
      // seconds
      passwordMinLength: (0, import_pg_core.integer)("password_min_length").default(8),
      requirePasswordChange: (0, import_pg_core.boolean)("require_password_change").default(false),
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    vulnerabilityStatusEnum = (0, import_pg_core.pgEnum)("vulnerability_status", [
      "open",
      "in_progress",
      "mitigated",
      "resolved",
      "false_positive"
    ]);
    vulnerabilitySeverityEnum = (0, import_pg_core.pgEnum)("vulnerability_severity", [
      "critical",
      "high",
      "medium",
      "low",
      "info"
    ]);
    vulnerabilities = (0, import_pg_core.pgTable)("vulnerabilities", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      cveId: (0, import_pg_core.text)("cve_id").notNull().unique(),
      title: (0, import_pg_core.text)("title").notNull(),
      description: (0, import_pg_core.text)("description"),
      cvssScore: (0, import_pg_core.real)("cvss_score"),
      cvssVector: (0, import_pg_core.text)("cvss_vector"),
      severity: vulnerabilitySeverityEnum("severity").notNull().default("medium"),
      status: vulnerabilityStatusEnum("status").notNull().default("open"),
      discoveredDate: (0, import_pg_core.timestamp)("discovered_date").defaultNow(),
      remediatedDate: (0, import_pg_core.timestamp)("remediated_date"),
      publishedDate: (0, import_pg_core.timestamp)("published_date"),
      modifiedDate: (0, import_pg_core.timestamp)("modified_date"),
      // FAIR-U Control Impact
      eDetectImpact: (0, import_pg_core.real)("e_detect_impact").default(0),
      // How much this vuln reduces detection effectiveness (0-1)
      eResistImpact: (0, import_pg_core.real)("e_resist_impact").default(0),
      // How much this vuln reduces resistance effectiveness (0-1)
      // Additional fields
      references: (0, import_pg_core.json)("references").$type().default([]),
      tags: (0, import_pg_core.json)("tags").$type().default([]),
      remediation: (0, import_pg_core.text)("remediation"),
      workaround: (0, import_pg_core.text)("workaround"),
      exploitAvailable: (0, import_pg_core.boolean)("exploit_available").default(false),
      // Metadata
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    });
    vulnerabilityAssets = (0, import_pg_core.pgTable)("vulnerability_assets", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      vulnerabilityId: (0, import_pg_core.integer)("vulnerability_id").notNull().references(() => vulnerabilities.id, { onDelete: "cascade" }),
      assetId: (0, import_pg_core.integer)("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
      // Asset-specific vulnerability details
      affectedVersions: (0, import_pg_core.json)("affected_versions").$type().default([]),
      patchLevel: (0, import_pg_core.text)("patch_level"),
      exploitable: (0, import_pg_core.boolean)("exploitable").default(true),
      notes: (0, import_pg_core.text)("notes"),
      // Metadata
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow()
    }, (table) => ({
      uniqueVulnAsset: (0, import_pg_core.uniqueIndex)("unique_vuln_asset").on(table.vulnerabilityId, table.assetId)
    }));
    vulnerabilityRelations = (0, import_drizzle_orm.relations)(vulnerabilities, ({ many }) => ({
      vulnerabilityAssets: many(vulnerabilityAssets)
    }));
    vulnerabilityAssetRelations = (0, import_drizzle_orm.relations)(vulnerabilityAssets, ({ one }) => ({
      vulnerability: one(vulnerabilities, {
        fields: [vulnerabilityAssets.vulnerabilityId],
        references: [vulnerabilities.id]
      }),
      asset: one(assets, {
        fields: [vulnerabilityAssets.assetId],
        references: [assets.id]
      })
    }));
    insertVulnerabilitySchema = (0, import_drizzle_zod.createInsertSchema)(vulnerabilities);
    insertVulnerabilityAssetSchema = (0, import_drizzle_zod.createInsertSchema)(vulnerabilityAssets);
    insertAuthConfigSchema = (0, import_drizzle_zod.createInsertSchema)(authConfig2).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  checkDatabaseConnection: () => checkDatabaseConnection,
  db: () => db2,
  executeQueryWithRetry: () => executeQueryWithRetry,
  pool: () => pool
});
async function checkDatabaseConnection() {
  try {
    const result = await pool.query("SELECT 1 as connection_test");
    if (result.rows.length > 0) {
      if (!isConnected) {
        console.log("Successfully connected to the database");
      }
      isConnected = true;
      reconnectAttempts = 0;
      return true;
    }
    isConnected = false;
    return false;
  } catch (error) {
    console.error("Database connection check failed:", error);
    isConnected = false;
    lastError = error;
    return false;
  }
}
async function executeQueryWithRetry(queryFn, maxRetries = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await queryFn();
    } catch (error) {
      retries++;
      console.error(`Query failed (attempt ${retries}/${maxRetries}):`, error);
      if (retries >= maxRetries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3 * retries));
      await checkDatabaseConnection();
    }
  }
  throw new Error("Max retries exceeded");
}
var import_pg, import_node_postgres, isConnected, lastError, reconnectAttempts, MAX_RECONNECT_ATTEMPTS, pool, db2;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    import_pg = require("pg");
    import_node_postgres = require("drizzle-orm/node-postgres");
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    isConnected = false;
    lastError = null;
    reconnectAttempts = 0;
    MAX_RECONNECT_ATTEMPTS = 5;
    pool = new import_pg.Pool({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5e3,
      // 5 seconds timeout
      max: 10,
      // Maximum 10 connections in the pool
      idleTimeoutMillis: 3e4,
      // 30 seconds idle timeout
      statement_timeout: 3e4,
      // 30 seconds statement timeout
      query_timeout: 3e4
      // 30 seconds query timeout
    });
    pool.on("connect", (client) => {
      console.log("New database client connected");
      isConnected = true;
      reconnectAttempts = 0;
      lastError = null;
    });
    pool.on("error", (err) => {
      console.error("Database pool error:", err);
      isConnected = false;
      lastError = err;
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
        setTimeout(() => {
          checkDatabaseConnection().catch(
            (e) => console.error("Reconnection attempt failed:", e)
          );
        }, 5e3 * reconnectAttempts);
      }
    });
    db2 = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });
    console.log("Initializing database connection...");
    checkDatabaseConnection().then((isConnected2) => {
      if (isConnected2) {
        console.log("Database initialization successful");
      } else {
        console.error("Failed to connect to the database");
      }
    }).catch((err) => {
      console.error("Error during database initialization:", err);
    });
  }
});

// server/auth.ts
var auth_exports = {};
__export(auth_exports, {
  canWriteAssets: () => canWriteAssets,
  canWriteOtherResources: () => canWriteOtherResources,
  configurePassport: () => configurePassport,
  isAdmin: () => isAdmin,
  isAuthenticated: () => isAuthenticated
});
var import_passport, import_passport_local, import_bcryptjs, import_drizzle_orm7, configurePassport, isAuthenticated, isAdmin, canWriteAssets, canWriteOtherResources;
var init_auth = __esm({
  "server/auth.ts"() {
    "use strict";
    import_passport = __toESM(require("passport"), 1);
    import_passport_local = require("passport-local");
    import_bcryptjs = __toESM(require("bcryptjs"), 1);
    init_db();
    init_schema();
    import_drizzle_orm7 = require("drizzle-orm");
    configurePassport = () => {
      import_passport.default.use(new import_passport_local.Strategy(
        {
          usernameField: "username",
          passwordField: "password"
        },
        async (username, password, done) => {
          try {
            const [user] = await db2.select().from(users).where((0, import_drizzle_orm7.and)(
              (0, import_drizzle_orm7.eq)(users.username, username),
              (0, import_drizzle_orm7.eq)(users.authType, "local"),
              (0, import_drizzle_orm7.eq)(users.isActive, true)
            )).limit(1);
            if (!user) {
              return done(null, false, { message: "Invalid username or password" });
            }
            if (user.accountLockedUntil && user.accountLockedUntil > /* @__PURE__ */ new Date()) {
              return done(null, false, { message: "Account is temporarily locked" });
            }
            const isValidPassword = await import_bcryptjs.default.compare(password, user.passwordHash);
            if (!isValidPassword) {
              const failedAttempts = (user.failedLoginAttempts || 0) + 1;
              await db2.update(users).set({
                failedLoginAttempts: failedAttempts,
                lastFailedLogin: /* @__PURE__ */ new Date(),
                // Lock account after 5 failed attempts for 5 minutes
                ...failedAttempts >= 5 && {
                  accountLockedUntil: new Date(Date.now() + 5 * 60 * 1e3)
                }
              }).where((0, import_drizzle_orm7.eq)(users.id, user.id));
              return done(null, false, { message: "Invalid username or password" });
            }
            await db2.update(users).set({
              failedLoginAttempts: 0,
              lastFailedLogin: null,
              accountLockedUntil: null,
              lastLogin: /* @__PURE__ */ new Date(),
              loginCount: (user.loginCount || 0) + 1
            }).where((0, import_drizzle_orm7.eq)(users.id, user.id));
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      ));
      if (process.env.OIDC_ISSUER && process.env.OIDC_CLIENT_ID && process.env.OIDC_CLIENT_SECRET && process.env.OIDC_CALLBACK_URL) {
        import_passport.default.use(
          new OpenIDConnectStrategy(
            {
              issuer: process.env.OIDC_ISSUER,
              authorizationURL: process.env.OIDC_AUTHORIZATION_URL || `${process.env.OIDC_ISSUER}/authorize`,
              tokenURL: process.env.OIDC_TOKEN_URL || `${process.env.OIDC_ISSUER}/token`,
              userInfoURL: process.env.OIDC_USER_INFO_URL || `${process.env.OIDC_ISSUER}/userinfo`,
              clientID: process.env.OIDC_CLIENT_ID,
              clientSecret: process.env.OIDC_CLIENT_SECRET,
              callbackURL: process.env.OIDC_CALLBACK_URL,
              scope: ["openid", "profile", "email"]
            },
            async (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
              try {
                const [existingUser] = await db2.select().from(users).where((0, import_drizzle_orm7.eq)(users.sub, profile.id));
                if (existingUser) {
                  await db2.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm7.eq)(users.id, existingUser.id));
                  return done(null, existingUser);
                }
                const [newUser] = await db2.insert(users).values({
                  sub: profile.id,
                  email: profile.emails?.[0]?.value || "",
                  firstName: profile.name?.givenName,
                  lastName: profile.name?.familyName,
                  displayName: profile.displayName,
                  role: "standard"
                  // Default role for new users
                }).returning();
                return done(null, newUser);
              } catch (err) {
                return done(err);
              }
            }
          )
        );
        console.log("OpenID Connect strategy configured");
      } else {
        console.log("OpenID Connect not configured - missing environment variables");
      }
      import_passport.default.serializeUser((user, done) => {
        done(null, user.id);
      });
      import_passport.default.deserializeUser(async (id, done) => {
        try {
          const [user] = await db2.select().from(users).where((0, import_drizzle_orm7.eq)(users.id, id));
          done(null, user || null);
        } catch (err) {
          done(err);
        }
      });
      console.log("Passport strategies configured");
    };
    isAuthenticated = (req, res, next) => {
      if (false) {
        return next();
      }
      if (req.isAuthenticated()) {
        return next();
      }
      if (req.path.startsWith("/api/")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      res.redirect("/login");
    };
    isAdmin = (req, res, next) => {
      if (false) {
        return next();
      }
      if (req.isAuthenticated() && req.user?.role === "admin") {
        return next();
      }
      return res.status(403).json({ error: "Forbidden" });
    };
    canWriteAssets = (req, res, next) => {
      if (false) {
        return next();
      }
      if (req.isAuthenticated()) {
        return next();
      }
      return res.status(403).json({ error: "Forbidden" });
    };
    canWriteOtherResources = (req, res, next) => {
      if (false) {
        return next();
      }
      if (req.isAuthenticated() && req.user?.role === "admin") {
        return next();
      }
      return res.status(403).json({ error: "Forbidden" });
    };
  }
});

// server/db/production.ts
var production_exports = {};
__export(production_exports, {
  db: () => db3,
  pool: () => pool2,
  testConnection: () => testConnection
});
async function testConnection() {
  try {
    const client = await pool2.connect();
    const result = await client.query("SELECT NOW() as current_time, version() as version");
    client.release();
    console.log(`Production database connection successful: ${result.rows[0].current_time}`);
    console.log(`PostgreSQL version: ${result.rows[0].version.split(" ")[0]}`);
    return true;
  } catch (error) {
    console.error("Production database connection failed:", error);
    return false;
  }
}
var import_pg2, import_node_postgres2, connectionConfig, requiredVars, missing, pool2, db3;
var init_production = __esm({
  "server/db/production.ts"() {
    "use strict";
    import_pg2 = require("pg");
    import_node_postgres2 = require("drizzle-orm/node-postgres");
    init_schema();
    console.log("\u{1F680} Initializing production PostgreSQL connection");
    connectionConfig = {
      host: process.env.PGHOST || process.env.DB_HOST,
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || "5432"),
      user: process.env.PGUSER || process.env.DB_USER,
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
      database: process.env.PGDATABASE || process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
      max: parseInt(process.env.DB_POOL_MAX || "20"),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000"),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || "15000"),
      keepAlive: true,
      keepAliveInitialDelayMillis: 1e4
    };
    console.log("Production database configuration:", {
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      database: connectionConfig.database,
      ssl: connectionConfig.ssl,
      password: connectionConfig.password ? "***masked***" : "NOT SET"
    });
    requiredVars = ["host", "user", "password", "database"];
    missing = requiredVars.filter((key) => !connectionConfig[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required database environment variables: ${missing.join(", ")}`);
    }
    pool2 = new import_pg2.Pool(connectionConfig);
    pool2.on("error", (err) => {
      console.error("Production database connection error:", err.message);
    });
    pool2.on("connect", (client) => {
      console.log("New production database connection established");
    });
    pool2.on("remove", (client) => {
      console.log("Production database connection removed from pool");
    });
    db3 = (0, import_node_postgres2.drizzle)(pool2, { schema: schema_exports });
    process.on("SIGINT", async () => {
      console.log("Closing production database connections...");
      await pool2.end();
      process.exit(0);
    });
    process.on("SIGTERM", async () => {
      console.log("Closing production database connections...");
      await pool2.end();
      process.exit(0);
    });
  }
});

// server/production.ts
var import_express17 = __toESM(require("express"), 1);

// server/routes/index.ts
var import_express16 = __toESM(require("express"), 1);
var import_http = require("http");

// server/routes/assets/index.ts
var import_express = __toESM(require("express"), 1);

// server/services/storage.ts
init_schema();

// shared/utils/secondaryLossCalculations.ts
function moduleCostFor(mod, magnitude, hours) {
  switch (mod.type) {
    case "fixed":
      return mod.value;
    case "perEvent":
      return mod.value;
    case "perHour":
      return mod.value * hours;
    case "percent":
      return magnitude * mod.value;
    default:
      return 0;
  }
}
function calculateSecondaryLoss(inputs) {
  const { eventFrequency, lossMagnitude, costModules, context = {} } = inputs;
  const hours = context.hoursPerEvent ?? 8;
  let perEventMin = 0;
  let perEventAvg = 0;
  let perEventMax = 0;
  for (const mod of costModules) {
    perEventMin += moduleCostFor(mod, lossMagnitude.min, hours);
    perEventAvg += moduleCostFor(mod, lossMagnitude.avg, hours);
    perEventMax += moduleCostFor(mod, lossMagnitude.max, hours);
  }
  return {
    min: perEventMin * eventFrequency.min,
    avg: perEventAvg * eventFrequency.avg,
    max: perEventMax * eventFrequency.max
  };
}
function convertDatabaseCostModule(assignment) {
  const costType = assignment.cost_module?.costType || assignment.costType || assignment.cost_type;
  const costFactor = assignment.cost_module?.costFactor || assignment.costFactor || assignment.cost_factor;
  const moduleId = assignment.cost_module?.id || assignment.cost_module_id || assignment.id;
  const weight = assignment.materiality_weight || assignment.weight || 1;
  let type;
  switch (costType) {
    case "fixed":
      type = "fixed";
      break;
    case "per_event":
      type = "perEvent";
      break;
    case "per_hour":
      type = "perHour";
      break;
    case "percentage":
      type = "percent";
      break;
    default:
      type = "fixed";
  }
  const originalValue = parseFloat(costFactor) || 0;
  console.log(`DEBUG: Converting cost module assignment: ${JSON.stringify(assignment, null, 2)}`);
  console.log(`DEBUG: Extracted values - costType: ${costType}, costFactor: ${costFactor}, moduleId: ${moduleId}, name: ${assignment.cost_module?.name || assignment.name}`);
  console.log(`DEBUG: Converted to CostModule: { id: '${moduleId}', type: '${type}', value: ${originalValue} }`);
  return {
    id: moduleId?.toString() || "unknown",
    type,
    value: originalValue
  };
}

// shared/utils/calculations.ts
function calculateRiskValues(params, resistance = 0, controls2 = [], costModuleAssignments = []) {
  const monteCarloInput = {
    cfMin: params.contactFrequencyMin,
    cfMode: params.contactFrequencyAvg,
    cfMax: params.contactFrequencyMax,
    poaMin: params.probabilityOfActionMin,
    poaMode: params.probabilityOfActionAvg,
    poaMax: params.probabilityOfActionMax,
    tcMin: params.threatCapabilityMin,
    tcMode: params.threatCapabilityAvg,
    tcMax: params.threatCapabilityMax,
    rsMin: params.resistanceStrengthMin,
    rsMode: params.resistanceStrengthAvg,
    rsMax: params.resistanceStrengthMax,
    plMin: params.primaryLossMagnitudeMin,
    plMode: params.primaryLossMagnitudeAvg,
    plMax: params.primaryLossMagnitudeMax,
    // Generate SLEF values from distributions if cost modules exist, otherwise use form values
    slefMin: costModuleAssignments.length > 0 ? 0.1 : params.secondaryLossEventFrequencyMin,
    slefMode: costModuleAssignments.length > 0 ? 0.3 : params.secondaryLossEventFrequencyAvg,
    slefMax: costModuleAssignments.length > 0 ? 0.7 : params.secondaryLossEventFrequencyMax,
    slmMin: params.secondaryLossMagnitudeMin,
    slmMode: params.secondaryLossMagnitudeAvg,
    slmMax: params.secondaryLossMagnitudeMax,
    // Control effectiveness - only apply if controls are actually present
    eAvoid: controls2 && controls2.length > 0 ? resistance / 40 : 0,
    // Scale 0-10 to 0-0.25 only if controls exist
    eDeter: controls2 && controls2.length > 0 ? resistance / 40 : 0,
    eResist: controls2 && controls2.length > 0 ? resistance / 40 : 0,
    eDetect: controls2 && controls2.length > 0 ? resistance / 40 : 0,
    iterations: 1e4
    // Default to 10,000 iterations for accuracy
  };
  console.log(`STEP 4: Calculating PRIMARY loss magnitude for inherent risk (no cost modules)`);
  const primaryLossMin = calculateLossMagnitude(params, "min");
  const primaryLossAvg = calculateLossMagnitude(params, "avg");
  const primaryLossMax = calculateLossMagnitude(params, "max");
  console.log(`Primary Loss Magnitude: Min=${primaryLossMin}, Avg=${primaryLossAvg}, Max=${primaryLossMax}`);
  console.log(`STEP 5: Calculating TOTAL loss magnitude with ${costModuleAssignments.length} cost modules`);
  const totalLossMin = calculateLossMagnitude(params, "min", costModuleAssignments);
  const totalLossAvg = calculateLossMagnitude(params, "avg", costModuleAssignments);
  const totalLossMax = calculateLossMagnitude(params, "max", costModuleAssignments);
  console.log(`Total Loss Magnitude (Primary + Secondary): Min=${totalLossMin}, Avg=${totalLossAvg}, Max=${totalLossMax}`);
  const cf = params.contactFrequencyAvg || 0;
  const poa = params.probabilityOfActionAvg || 0;
  const tc = params.threatCapabilityAvg || 0;
  let rs = params.resistanceStrengthAvg || 0;
  if (controls2 && controls2.length > 0) {
    let totalEffectiveness = 0;
    let validControls = 0;
    for (const control of controls2) {
      if (control.controlEffectiveness && control.controlEffectiveness > 0) {
        const effectiveness = Number(control.controlEffectiveness) || 0;
        let implementationFactor = 0;
        if (control.implementationStatus === "fully_implemented") {
          implementationFactor = 1;
        } else if (control.implementationStatus === "in_progress") {
          implementationFactor = 0.5;
        } else {
          implementationFactor = 0;
        }
        const adjustedEffectiveness = effectiveness * implementationFactor;
        totalEffectiveness += adjustedEffectiveness;
        validControls++;
      }
    }
    if (validControls > 0) {
      const avgEffectiveness = totalEffectiveness / validControls;
      rs = Math.min(10, rs + avgEffectiveness);
      console.log(`Control effectiveness increased resistance strength from ${params.resistanceStrengthAvg || 0} to ${rs}`);
    }
  }
  const inherentResistance = 0;
  const inherentSus = 1 / (1 + Math.exp(-(tc - inherentResistance) / 2));
  const inherentLef = cf * poa * inherentSus;
  const inherentRisk = inherentLef * totalLossAvg;
  console.log(`INHERENT Risk (NO controls): LEF(${inherentLef}) \xD7 TotalLoss(PL+SL=${totalLossAvg}) = ${inherentRisk}`);
  const residualSus = 1 / (1 + Math.exp(-(tc - rs) / 2));
  const residualLef = cf * poa * residualSus;
  let residualRisk = inherentRisk;
  let finalInherentRisk = inherentRisk;
  let monteCarloResults;
  if (controls2 && controls2.length > 0) {
    console.log(`Calculating RESIDUAL risk - found ${controls2.length} controls`);
    let totalEffectiveness = 0;
    let validControls = 0;
    for (const control of controls2) {
      if (control.controlEffectiveness && control.controlEffectiveness > 0) {
        const effectiveness = Number(control.controlEffectiveness) || 0;
        let implementationFactor = 0;
        if (control.implementationStatus === "fully_implemented") {
          implementationFactor = 1;
        } else if (control.implementationStatus === "in_progress") {
          implementationFactor = 0.5;
        } else {
          implementationFactor = 0;
        }
        const adjustedEffectiveness = effectiveness * implementationFactor;
        totalEffectiveness += adjustedEffectiveness;
        validControls++;
        console.log(`Control ${control.controlId}: effectiveness=${effectiveness}, status=${control.implementationStatus}, factor=${implementationFactor}, adjusted=${adjustedEffectiveness}`);
      }
    }
    if (validControls > 0) {
      const avgEffectiveness = totalEffectiveness / validControls;
      const reductionPercentage = avgEffectiveness / 10 * 0.5;
      residualRisk = inherentRisk * (1 - reductionPercentage);
      console.log(`Applied control effectiveness: avgEffectiveness=${avgEffectiveness}, reductionPercentage=${reductionPercentage * 100}%, residualRisk=${residualRisk}`);
    } else {
      console.log("No effective controls found - residual risk equals inherent risk");
      residualRisk = inherentRisk;
    }
    monteCarloResults = {
      mean: residualRisk,
      p05: residualRisk * 0.3,
      p25: residualRisk * 0.6,
      p50: residualRisk,
      p75: residualRisk * 1.4,
      p95: residualRisk * 2,
      max: residualRisk * 3
    };
  } else {
    console.log("No controls present - residual risk equals inherent risk");
    residualRisk = inherentRisk;
    monteCarloResults = {
      mean: inherentRisk,
      p05: inherentRisk * 0.3,
      p25: inherentRisk * 0.6,
      p50: inherentRisk,
      p75: inherentRisk * 1.4,
      p95: inherentRisk * 2,
      max: inherentRisk * 3
    };
  }
  console.log(`STEP 5: Calculating TOTAL loss magnitude with ${costModuleAssignments.length} cost modules for return`);
  const returnTotalLossMin = calculateLossMagnitude(params, "min", costModuleAssignments);
  const returnTotalLossAvg = calculateLossMagnitude(params, "avg", costModuleAssignments);
  const returnTotalLossMax = calculateLossMagnitude(params, "max", costModuleAssignments);
  const baseSusceptibility = 1 / (1 + Math.exp(-(tc - rs) / 2));
  let secondaryLossMagnitudeResult;
  if (costModuleAssignments && costModuleAssignments.length > 0) {
    const primaryLossMinVal = Number(params.primaryLossMagnitudeMin) || 0;
    const primaryLossAvgVal = Number(params.primaryLossMagnitudeAvg) || 0;
    const primaryLossMaxVal = Number(params.primaryLossMagnitudeMax) || 0;
    secondaryLossMagnitudeResult = {
      min: returnTotalLossMin - primaryLossMinVal,
      avg: returnTotalLossAvg - primaryLossAvgVal,
      max: returnTotalLossMax - primaryLossMaxVal
    };
    console.log(`SECONDARY LOSS CALCULATED FROM COST MODULES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  } else {
    secondaryLossMagnitudeResult = {
      min: Number(params.secondaryLossMagnitudeMin) || 0,
      avg: Number(params.secondaryLossMagnitudeAvg) || 0,
      max: Number(params.secondaryLossMagnitudeMax) || 0
    };
    console.log(`SECONDARY LOSS FROM FORM VALUES: Min=${secondaryLossMagnitudeResult.min}, Avg=${secondaryLossMagnitudeResult.avg}, Max=${secondaryLossMagnitudeResult.max}`);
  }
  return {
    inherentRisk,
    residualRisk,
    susceptibility: baseSusceptibility,
    monteCarloResults,
    lossMagnitude: {
      min: returnTotalLossMin,
      avg: returnTotalLossAvg,
      max: returnTotalLossMax
    },
    secondaryLossMagnitude: secondaryLossMagnitudeResult
  };
}
var calculateLossMagnitude = (risk, type = "avg", costModuleAssignments = []) => {
  const safeCostModules = Array.isArray(costModuleAssignments) ? costModuleAssignments : [];
  const validCostModules = safeCostModules.filter((cm) => cm && cm.cost_module);
  console.log(`STEP 5: calculateLossMagnitude called with ${validCostModules.length} valid cost modules for type: ${type}`);
  const primaryLoss = type === "min" ? parseFloat(risk.primaryLossMagnitudeMin) || 0 : type === "max" ? parseFloat(risk.primaryLossMagnitudeMax) || 0 : parseFloat(risk.primaryLossMagnitudeAvg) || 0;
  if (validCostModules.length === 0) {
    const slef = type === "min" ? parseFloat(risk.secondaryLossEventFrequencyMin) || 0 : type === "max" ? parseFloat(risk.secondaryLossEventFrequencyMax) || 0 : parseFloat(risk.secondaryLossEventFrequencyAvg) || 0;
    const slm = type === "min" ? parseFloat(risk.secondaryLossMagnitudeMin) || 0 : type === "max" ? parseFloat(risk.secondaryLossMagnitudeMax) || 0 : parseFloat(risk.secondaryLossMagnitudeAvg) || 0;
    const basicSecondaryLoss = slef * slm;
    const totalLoss = primaryLoss + basicSecondaryLoss;
    console.log(`Basic Loss Magnitude (${type}): PL(${primaryLoss}) + FormSL(SLEF:${slef} \xD7 SLM:${slm} = ${basicSecondaryLoss}) = ${totalLoss}`);
    return totalLoss;
  }
  const costModules = validCostModules.map(convertDatabaseCostModule);
  console.log(`STEP 6: Converting ${validCostModules.length} cost modules for enhanced calculation`);
  costModules.forEach((cm) => {
    console.log(`  - Module: ${cm.id || "Unknown"}, Type: ${cm.type || "Unknown"}, Factor: ${cm.value || 0}`);
  });
  const secondaryLossInputs = {
    eventFrequency: { min: 1, avg: 1, max: 1 },
    // Single event for cost module calculation
    lossMagnitude: { min: primaryLoss, avg: primaryLoss, max: primaryLoss },
    // Primary loss for percentage calculations
    costModules,
    context: { hoursPerEvent: 8 }
    // Default 8 hours per incident
  };
  const enhancedSecondaryLoss = calculateSecondaryLoss(secondaryLossInputs);
  const secondaryLossValue = type === "min" ? enhancedSecondaryLoss.min : type === "max" ? enhancedSecondaryLoss.max : enhancedSecondaryLoss.avg;
  const totalLossMagnitude = primaryLoss + secondaryLossValue;
  console.log(`Enhanced Loss Magnitude (${type}): PL(${primaryLoss}) + CostModuleSL(${secondaryLossValue}) = ${totalLossMagnitude}`);
  console.log(`Cost modules applied: ${costModules.length} modules, ignoring form SLEF/SLM values`);
  return totalLossMagnitude;
};

// server/services/storage.ts
init_db();
var import_drizzle_orm2 = require("drizzle-orm");
var DatabaseStorage = class {
  async getAllAssets() {
    return await db2.select().from(assets);
  }
  async getAsset(id) {
    try {
      if (isNaN(id)) {
        console.error("Invalid asset ID (NaN) provided to getAsset");
        return void 0;
      }
      const [asset] = await db2.select().from(assets).where((0, import_drizzle_orm2.eq)(assets.id, id));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by id:", error);
      throw error;
    }
  }
  async getAssetByAssetId(assetId) {
    try {
      const [asset] = await db2.select().from(assets).where((0, import_drizzle_orm2.eq)(assets.assetId, assetId));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by assetId:", error);
      throw error;
    }
  }
  async createAsset(asset) {
    const [newAsset] = await db2.insert(assets).values(asset).returning();
    return newAsset;
  }
  async updateAsset(id, asset) {
    const [updatedAsset] = await db2.update(assets).set(asset).where((0, import_drizzle_orm2.eq)(assets.id, id)).returning();
    return updatedAsset;
  }
  async deleteAsset(id) {
    await db2.delete(assets).where((0, import_drizzle_orm2.eq)(assets.id, id));
    return true;
  }
  async getAllRisks() {
    return await db2.select().from(risks);
  }
  async getRisk(id) {
    const [risk] = await db2.select().from(risks).where((0, import_drizzle_orm2.eq)(risks.id, id));
    return risk;
  }
  async getRiskByRiskId(riskId) {
    const [risk] = await db2.select().from(risks).where((0, import_drizzle_orm2.eq)(risks.riskId, riskId));
    return risk;
  }
  async createRisk(risk) {
    const [newRisk] = await db2.insert(risks).values(risk).returning();
    return newRisk;
  }
  async updateRisk(id, risk) {
    const [updatedRisk] = await db2.update(risks).set(risk).where((0, import_drizzle_orm2.eq)(risks.id, id)).returning();
    return updatedRisk;
  }
  async deleteRisk(id) {
    try {
      console.log(`DatabaseStorage.deleteRisk: Deleting risk with ID ${id}`);
      const risk = await this.getRisk(id);
      if (!risk) {
        console.log(`Risk with ID ${id} not found, cannot delete.`);
        return false;
      }
      console.log(`Found risk: ${JSON.stringify(risk)}`);
      try {
        await db2.delete(riskResponses).where((0, import_drizzle_orm2.eq)(riskResponses.riskId, risk.riskId)).execute();
        console.log(`Deleted risk responses for risk ${risk.riskId}`);
      } catch (error) {
        console.error(`Error deleting risk responses for risk ${risk.riskId}:`, error);
      }
      try {
        await db2.delete(riskControls).where((0, import_drizzle_orm2.eq)(riskControls.riskId, id)).execute();
        console.log(`Deleted risk-control mappings for risk ID ${id}`);
        await db2.execute(import_drizzle_orm2.sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-control mappings for risk ID ${id}:`, error);
        try {
          await db2.execute(import_drizzle_orm2.sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-control mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-control mappings failed:`, fallbackError);
        }
      }
      try {
        await db2.delete(riskCosts).where((0, import_drizzle_orm2.eq)(riskCosts.riskId, id)).execute();
        console.log(`Deleted risk-cost mappings for risk ID ${id}`);
        await db2.execute(import_drizzle_orm2.sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-cost mappings for risk ID ${id}:`, error);
        try {
          await db2.execute(import_drizzle_orm2.sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-cost mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-cost mappings failed:`, fallbackError);
        }
      }
      console.log(`Attempting to delete the risk record with ID ${id}`);
      try {
        console.log(`Using direct SQL for risk deletion to ensure success`);
        await db2.execute(import_drizzle_orm2.sql`DELETE FROM risks WHERE id = ${id}`);
        console.log(`Direct SQL deletion executed for risk ID ${id}`);
        if (risk && risk.riskId) {
          await db2.execute(import_drizzle_orm2.sql`DELETE FROM risks WHERE risk_id = ${risk.riskId}`);
          console.log(`Also attempted deletion by risk_id = ${risk.riskId}`);
        }
        const verifyCheck = await db2.execute(import_drizzle_orm2.sql`SELECT id FROM risks WHERE id = ${id}`);
        const rows = verifyCheck.rows || [];
        const isDeleted = rows.length === 0;
        console.log(`Risk deletion verification: Risk ${id} is ${isDeleted ? "DELETED" : "STILL PRESENT"}`);
        return isDeleted;
      } catch (deleteError) {
        console.error(`Error during risk deletion for ID ${id}:`, deleteError);
        throw deleteError;
      }
    } catch (error) {
      console.error(`Error in deleteRisk(${id}):`, error);
      throw error;
    }
  }
  async getAllControls() {
    return await db2.select().from(controls);
  }
  async getControl(id) {
    const [control] = await db2.select().from(controls).where((0, import_drizzle_orm2.eq)(controls.id, id));
    return control;
  }
  async getControlByControlId(controlId) {
    const [control] = await db2.select().from(controls).where((0, import_drizzle_orm2.eq)(controls.controlId, controlId));
    return control;
  }
  async createControl(control) {
    const [newControl] = await db2.insert(controls).values(control).returning();
    return newControl;
  }
  async updateControl(id, control) {
    const [updatedControl] = await db2.update(controls).set(control).where((0, import_drizzle_orm2.eq)(controls.id, id)).returning();
    return updatedControl;
  }
  async deleteControl(id) {
    await db2.delete(controls).where((0, import_drizzle_orm2.eq)(controls.id, id));
    return true;
  }
  async getAllRiskResponses() {
    return await db2.select().from(riskResponses);
  }
  async getRiskResponse(id) {
    const [response] = await db2.select().from(riskResponses).where((0, import_drizzle_orm2.eq)(riskResponses.id, id));
    return response;
  }
  async getRiskResponseByRiskId(riskId) {
    const [response] = await db2.select().from(riskResponses).where((0, import_drizzle_orm2.eq)(riskResponses.riskId, riskId));
    return response;
  }
  async createRiskResponse(response) {
    const [newResponse] = await db2.insert(riskResponses).values(response).returning();
    return newResponse;
  }
  async updateRiskResponse(id, response) {
    const [updatedResponse] = await db2.update(riskResponses).set(response).where((0, import_drizzle_orm2.eq)(riskResponses.id, id)).returning();
    return updatedResponse;
  }
  async deleteRiskResponse(id) {
    await db2.delete(riskResponses).where((0, import_drizzle_orm2.eq)(riskResponses.id, id));
    return true;
  }
  async getAllActivityLogs() {
    return await db2.select().from(activityLogs).orderBy((0, import_drizzle_orm2.desc)(activityLogs.createdAt));
  }
  async getActivityLog(id) {
    const [log2] = await db2.select().from(activityLogs).where((0, import_drizzle_orm2.eq)(activityLogs.id, id));
    return log2;
  }
  async createActivityLog(log2) {
    const [newLog] = await db2.insert(activityLogs).values(log2).returning();
    return newLog;
  }
  async getAllLegalEntities() {
    return await db2.select().from(legalEntities);
  }
  async getLegalEntity(id) {
    const [entity] = await db2.select().from(legalEntities).where((0, import_drizzle_orm2.eq)(legalEntities.id, id));
    return entity;
  }
  async getLegalEntityByEntityId(entityId) {
    const [entity] = await db2.select().from(legalEntities).where((0, import_drizzle_orm2.eq)(legalEntities.entityId, entityId));
    return entity;
  }
  async createLegalEntity(entity) {
    const [newEntity] = await db2.insert(legalEntities).values(entity).returning();
    return newEntity;
  }
  async updateLegalEntity(id, entity) {
    const [updatedEntity] = await db2.update(legalEntities).set(entity).where((0, import_drizzle_orm2.eq)(legalEntities.id, id)).returning();
    return updatedEntity;
  }
  async deleteLegalEntity(id) {
    await db2.delete(legalEntities).where((0, import_drizzle_orm2.eq)(legalEntities.id, id));
    return true;
  }
  async getAssetsForLegalEntity(entityId) {
    return await db2.select().from(assets).where((0, import_drizzle_orm2.eq)(assets.legalEntity, entityId));
  }
  async getControlsForRisk(riskId) {
    const allControls = await this.getAllControls();
    return allControls.filter(
      (control) => control.associatedRisks && control.associatedRisks.includes(riskId)
    );
  }
  async getAssetsForRisk(riskId) {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk || !risk.associatedAssets || risk.associatedAssets.length === 0) {
      return [];
    }
    return await db2.select().from(assets).where((0, import_drizzle_orm2.inArray)(assets.assetId, risk.associatedAssets));
  }
  async getRisksForAsset(assetId) {
    const allRisks = await this.getAllRisks();
    return allRisks.filter(
      (risk) => risk.associatedAssets && risk.associatedAssets.includes(assetId)
    );
  }
  async getRisksForControl(controlId) {
    const control = await this.getControlByControlId(controlId);
    if (!control || !control.associatedRisks || control.associatedRisks.length === 0) {
      return [];
    }
    const risks2 = [];
    for (const riskId of control.associatedRisks) {
      const risk = await this.getRiskByRiskId(riskId);
      if (risk) {
        risks2.push(risk);
      }
    }
    return risks2;
  }
  async getControlEffectivenessForRisk(riskId) {
    const controls2 = await this.getControlsForRisk(riskId);
    if (controls2.length === 0) {
      return 0;
    }
    const maxEffectiveness = Math.max(...controls2.map((c) => c.controlEffectiveness));
    return maxEffectiveness;
  }
  async calculateRiskValues(riskId) {
    const risk = await this.getRiskByRiskId(riskId);
    if (!risk) {
      throw new Error(`Risk with ID ${riskId} not found`);
    }
    const resistance = await this.getControlEffectivenessForRisk(riskId);
    const results = await calculateRiskValues(risk, resistance);
    if (risk.id) {
      await this.updateRisk(risk.id, {
        inherentRisk: results.inherentRisk.toString(),
        residualRisk: results.residualRisk.toString()
      });
    }
    return results;
  }
  async recalculateRiskSummaries() {
    console.log("Risk summaries recalculation requested - placeholder implementation");
  }
};
var storage = new DatabaseStorage();

// server/routes/common/responses/apiResponse.ts
function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data
  });
}
function sendError(res, error, statusCode = 500) {
  const errorMessage = error instanceof Error ? error.message : error.message || "Internal server error";
  const errorDetails = true ? void 0 : error.stack || error;
  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details: errorDetails
  });
}

// server/routes/common/middleware/validate.ts
function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const formatted = result.error.format();
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: formatted
        });
      }
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  };
}
function validateId(req, res, next) {
  const id = req.params.id;
  const isNumericId = !isNaN(parseInt(id));
  const isRiskStringId = /^RISK-[A-Z0-9-]+$/.test(id);
  if (!isNumericId && !isRiskStringId) {
    return res.status(400).json({
      success: false,
      error: "Invalid ID format",
      details: "ID must be a number or a valid risk ID string (e.g., RISK-DATA-123)"
    });
  }
  next();
}

// server/routes/assets/index.ts
var import_zod2 = require("zod");
var router = import_express.default.Router();
var assetSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(1, "Name is required"),
  description: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  assetId: import_zod2.z.string().min(1, "Asset ID is required"),
  type: import_zod2.z.enum(["data", "application", "device", "system", "network", "facility", "personnel", "other"]),
  status: import_zod2.z.enum(["Active", "Decommissioned", "To Adopt"]),
  businessUnit: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  confidentiality: import_zod2.z.enum(["low", "medium", "high"]),
  integrity: import_zod2.z.enum(["low", "medium", "high"]),
  availability: import_zod2.z.enum(["low", "medium", "high"]),
  criticality: import_zod2.z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),
  legalEntity: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  currency: import_zod2.z.enum(["USD", "EUR"]).optional().default("USD"),
  assetValue: import_zod2.z.union([import_zod2.z.number(), import_zod2.z.string()]).transform(
    (val) => typeof val === "string" ? Number(val.replace(/[^0-9.-]/g, "")) : val
  ),
  regulatoryImpact: import_zod2.z.array(import_zod2.z.string()).optional().default([]),
  externalInternal: import_zod2.z.enum(["external", "internal"]).default("internal"),
  owner: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  custodian: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  location: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  dependencies: import_zod2.z.array(import_zod2.z.string()).optional().default([]),
  notes: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  agentCount: import_zod2.z.number().optional().default(1),
  // Additional fields that UI might send
  hierarchy_level: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional(),
  architecture_domain: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.null()]).optional()
}).transform((data) => ({
  ...data,
  // Clean up null values for database storage
  description: data.description || "",
  businessUnit: data.businessUnit || "Information Technology",
  owner: data.owner || "",
  custodian: data.custodian || "",
  location: data.location || "",
  notes: data.notes || ""
}));
router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const assets2 = await storage.getAllAssets();
    return sendSuccess(res, assets2);
  } catch (error) {
    return sendError(res, error);
  }
});
router.get("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = await storage.getAsset(id);
    if (!asset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    return sendSuccess(res, asset);
  } catch (error) {
    return sendError(res, error);
  }
});
router.post("/", async (req, res) => {
  try {
    let asset = req.body;
    if (!asset.name) {
      return sendError(res, { message: "Asset name is required" }, 400);
    }
    if (!asset.assetId) {
      return sendError(res, { message: "Asset ID is required" }, 400);
    }
    asset = {
      ...asset,
      type: asset.type || "application",
      status: asset.status || "Active",
      description: asset.description || "No description provided",
      hierarchy_level: asset.hierarchy_level || "application_service",
      // Handle both camelCase and snake_case field names
      business_unit: asset.business_unit || asset.businessUnit || "Information Technology",
      architecture_domain: asset.architecture_domain || asset.architectureDomain || "Application",
      confidentiality: asset.confidentiality || "medium",
      integrity: asset.integrity || "medium",
      availability: asset.availability || "medium",
      criticality: asset.criticality || "medium",
      assetValue: typeof asset.assetValue === "string" ? Number(asset.assetValue.replace(/[^0-9.-]/g, "")) : asset.assetValue || 0
    };
    const existingAsset = await storage.getAssetByAssetId(asset.assetId);
    if (existingAsset) {
      return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
    }
    const newAsset = await storage.createAsset(asset);
    return sendSuccess(res, newAsset, 201);
  } catch (error) {
    console.error("Error creating asset:", error);
    return sendError(res, { message: "Error creating asset", details: error.message || error }, 500);
  }
});
router.put("/:id", validateId, validate(assetSchema), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = req.body;
    const existingAsset = await storage.getAsset(id);
    if (!existingAsset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    if (asset.assetId !== existingAsset.assetId) {
      const conflictingAsset = await storage.getAssetByAssetId(asset.assetId);
      if (conflictingAsset) {
        return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
      }
    }
    const updatedAsset = await storage.updateAsset(id, asset);
    return sendSuccess(res, updatedAsset);
  } catch (error) {
    return sendError(res, error);
  }
});
router.delete("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Attempting to delete asset with ID: ${id}`);
    const asset = await storage.getAsset(id);
    if (!asset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    console.log(`Found asset with assetId: ${asset.assetId}, checking for associated risks`);
    try {
      const associatedRisks = await storage.getRisksForAsset(asset.assetId);
      if (Array.isArray(associatedRisks) && associatedRisks.length > 0) {
        return sendError(res, {
          message: "Cannot delete asset with associated risks",
          associatedRisks
        }, 400);
      }
      console.log("No associated risks found, proceeding with deletion");
    } catch (riskError) {
      console.error("Error checking for associated risks:", riskError);
    }
    const deleted = await storage.deleteAsset(id);
    if (!deleted) {
      return sendError(res, { message: "Failed to delete asset" }, 500);
    }
    console.log(`Asset ${id} deleted successfully`);
    return sendSuccess(res, { message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return sendError(res, {
      message: "Error deleting asset",
      details: error.message || String(error)
    }, 500);
  }
});
router.get("/:id/risks", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = await storage.getAsset(id);
    if (!asset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    const risks2 = await storage.getAllRisks();
    const assetRisks = risks2.filter(
      (risk) => risk.associatedAssets && risk.associatedAssets.includes(id.toString())
    );
    return sendSuccess(res, assetRisks);
  } catch (error) {
    return sendError(res, error);
  }
});
var assets_default = router;

// server/routes/entities/index.ts
var import_express2 = __toESM(require("express"), 1);
var import_zod3 = require("zod");
var router2 = import_express2.default.Router();
var entitySchema = import_zod3.z.object({
  name: import_zod3.z.string().min(1, "Name is required"),
  description: import_zod3.z.string().optional(),
  entityId: import_zod3.z.string().min(1, "Entity ID is required"),
  parentEntityId: import_zod3.z.string().nullable().optional()
});
router2.get("/", async (req, res) => {
  try {
    const entities = await storage.getAllLegalEntities();
    return sendSuccess(res, entities);
  } catch (error) {
    return sendError(res, error);
  }
});
router2.get("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const entity = await storage.getLegalEntity(id);
    if (!entity) {
      return sendError(res, { message: "Legal entity not found" }, 404);
    }
    return sendSuccess(res, entity);
  } catch (error) {
    return sendError(res, error);
  }
});
router2.post(
  "/",
  validate(entitySchema),
  async (req, res) => {
    try {
      const entity = req.body;
      const newEntity = await storage.createLegalEntity(entity);
      return sendSuccess(res, newEntity, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
);
router2.put(
  "/:id",
  validateId,
  validate(entitySchema),
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entity = req.body;
      const updatedEntity = await storage.updateLegalEntity(id, entity);
      if (!updatedEntity) {
        return sendError(res, { message: "Legal entity not found" }, 404);
      }
      return sendSuccess(res, updatedEntity);
    } catch (error) {
      return sendError(res, error);
    }
  }
);
router2.delete("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const allAssets = await storage.getAllAssets();
    const associatedAssets = allAssets.filter((asset) => asset.legalEntity === id.toString());
    if (associatedAssets.length > 0) {
      return sendError(res, {
        message: "Cannot delete entity with associated assets",
        associatedAssets
      }, 400);
    }
    const deleted = await storage.deleteLegalEntity(id);
    if (!deleted) {
      return sendError(res, { message: "Legal entity not found" }, 404);
    }
    return sendSuccess(res, { message: "Legal entity deleted successfully" });
  } catch (error) {
    return sendError(res, error);
  }
});
var entities_default = router2;

// server/routes/risks/router.ts
var import_express3 = __toESM(require("express"), 1);

// server/services/repositoryStorage.ts
init_schema();
init_db();
var import_drizzle_orm3 = require("drizzle-orm");
var DatabaseStorage2 = class {
  /**
   * ASSET REPOSITORY METHODS
   */
  async getAllAssets() {
    return db2.select().from(assets);
  }
  async getAsset(id) {
    const [asset] = await db2.select().from(assets).where((0, import_drizzle_orm3.eq)(assets.id, id));
    return asset;
  }
  async getAssetByAssetId(assetId) {
    const [asset] = await db2.select().from(assets).where((0, import_drizzle_orm3.eq)(assets.assetId, assetId));
    return asset;
  }
  async getAssetsByIds(assetIds) {
    if (!assetIds || assetIds.length === 0) {
      console.log("Warning: getAssetsByIds called with empty array");
      return [];
    }
    console.log(`Looking up assets by IDs: ${assetIds.join(", ")}`);
    const fetchedAssets = await db2.select().from(assets).where((0, import_drizzle_orm3.inArray)(assets.assetId, assetIds));
    console.log(`Found ${fetchedAssets.length} assets matching the IDs`);
    return fetchedAssets.map((asset) => {
      let numericAssetValue = 0;
      if (typeof asset.assetValue === "number") {
        numericAssetValue = asset.assetValue;
      } else if (typeof asset.assetValue === "string") {
        const cleanValue = asset.assetValue.replace(/[^0-9.-]/g, "");
        numericAssetValue = parseFloat(cleanValue);
      }
      if (isNaN(numericAssetValue)) {
        numericAssetValue = 0;
      }
      console.log(`Processed asset ${asset.assetId} with value: ${numericAssetValue}`);
      return {
        ...asset,
        assetValue: numericAssetValue,
        // Also ensure we have a value field for legacy compatibility
        value: numericAssetValue
      };
    });
  }
  async createAsset(asset) {
    const [createdAsset] = await db2.insert(assets).values(asset).returning();
    return createdAsset;
  }
  async updateAsset(id, data) {
    const [updatedAsset] = await db2.update(assets).set(data).where((0, import_drizzle_orm3.eq)(assets.id, id)).returning();
    return updatedAsset;
  }
  async deleteAsset(id) {
    await db2.delete(assets).where((0, import_drizzle_orm3.eq)(assets.id, id));
    return true;
  }
  /**
   * RISK REPOSITORY METHODS
   */
  async getAllRisks() {
    return db2.select().from(risks);
  }
  async getRisksByIds(ids) {
    return db2.select().from(risks).where((0, import_drizzle_orm3.inArray)(risks.id, ids));
  }
  async getRisk(id) {
    const [risk] = await db2.select().from(risks).where((0, import_drizzle_orm3.eq)(risks.id, id));
    return risk;
  }
  async getRiskByRiskId(riskId) {
    const [risk] = await db2.select().from(risks).where((0, import_drizzle_orm3.eq)(risks.riskId, riskId));
    return risk;
  }
  async createRisk(risk) {
    const [createdRisk] = await db2.insert(risks).values(risk).returning();
    return createdRisk;
  }
  async updateRisk(id, data) {
    const [updatedRisk] = await db2.update(risks).set(data).where((0, import_drizzle_orm3.eq)(risks.id, id)).returning();
    return updatedRisk;
  }
  async deleteRisk(id) {
    await db2.delete(risks).where((0, import_drizzle_orm3.eq)(risks.id, id));
    return true;
  }
  /**
   * CONTROL REPOSITORY METHODS
   */
  async getAllControls() {
    return db2.select().from(controls);
  }
  async getControlsByIds(ids) {
    return db2.select().from(controls).where((0, import_drizzle_orm3.inArray)(controls.id, ids));
  }
  async getControl(id) {
    const [control] = await db2.select().from(controls).where((0, import_drizzle_orm3.eq)(controls.id, id));
    return control;
  }
  async getControlByControlId(controlId) {
    const [control] = await db2.select().from(controls).where((0, import_drizzle_orm3.eq)(controls.controlId, controlId));
    return control;
  }
  async createControl(control) {
    const [createdControl] = await db2.insert(controls).values(control).returning();
    return createdControl;
  }
  async updateControl(id, data) {
    console.log("Updating control with data:", data);
    const validData = {};
    if (data.controlEffectiveness !== void 0) validData.controlEffectiveness = data.controlEffectiveness;
    if (data.e_avoid !== void 0) validData.e_avoid = data.e_avoid;
    if (data.e_deter !== void 0) validData.e_deter = data.e_deter;
    if (data.e_detect !== void 0) validData.e_detect = data.e_detect;
    if (data.e_resist !== void 0) validData.e_resist = data.e_resist;
    if (data.name !== void 0) validData.name = data.name;
    if (data.description !== void 0) validData.description = data.description;
    if (data.controlId !== void 0) validData.controlId = data.controlId;
    if (data.controlType !== void 0) validData.controlType = data.controlType;
    if (data.controlCategory !== void 0) validData.controlCategory = data.controlCategory;
    if (data.implementationStatus !== void 0) validData.implementationStatus = data.implementationStatus;
    if (data.implementationCost !== void 0) validData.implementationCost = data.implementationCost;
    if (data.costPerAgent !== void 0) validData.costPerAgent = data.costPerAgent;
    if (data.isPerAgentPricing !== void 0) validData.isPerAgentPricing = data.isPerAgentPricing;
    if (data.deployedAgentCount !== void 0) validData.deployedAgentCount = data.deployedAgentCount;
    if (data.notes !== void 0) validData.notes = data.notes;
    if (data.associatedRisks !== void 0) validData.associatedRisks = data.associatedRisks;
    console.log("Filtered valid data for update:", validData);
    if (Object.keys(validData).length === 0) {
      console.error("No valid data provided for update");
      return void 0;
    }
    const [updatedControl] = await db2.update(controls).set(validData).where((0, import_drizzle_orm3.eq)(controls.id, id)).returning();
    return updatedControl;
  }
  async deleteControl(id) {
    await db2.delete(controls).where((0, import_drizzle_orm3.eq)(controls.id, id));
    return true;
  }
  /**
   * CONTROL LIBRARY REPOSITORY METHODS
   */
  async getAllControlLibraryItems() {
    return db2.select().from(controlLibrary);
  }
  async getControlLibraryItem(id) {
    const [template] = await db2.select().from(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
    return template;
  }
  async createControlLibraryItem(item) {
    const [createdItem] = await db2.insert(controlLibrary).values(item).returning();
    return createdItem;
  }
  async updateControlLibraryItem(id, data) {
    const [updatedItem] = await db2.update(controlLibrary).set(data).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id)).returning();
    return updatedItem;
  }
  async deleteControlLibraryItem(id) {
    await db2.delete(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
    return true;
  }
  /**
   * RISK RESPONSE REPOSITORY METHODS
   */
  async getAllRiskResponses() {
    return db2.select().from(riskResponses);
  }
  async getRiskResponse(id) {
    const [response] = await db2.select().from(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.id, id));
    return response;
  }
  async getRiskResponsesForRisk(riskId) {
    return db2.select().from(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.riskId, riskId));
  }
  async createRiskResponse(response) {
    const [createdResponse] = await db2.insert(riskResponses).values(response).returning();
    return createdResponse;
  }
  async updateRiskResponse(id, data) {
    const [updatedResponse] = await db2.update(riskResponses).set(data).where((0, import_drizzle_orm3.eq)(riskResponses.id, id)).returning();
    return updatedResponse;
  }
  async deleteRiskResponse(id) {
    await db2.delete(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.id, id));
    return true;
  }
  /**
   * ACTIVITY LOG REPOSITORY METHODS
   */
  async getAllActivityLogs() {
    return db2.select().from(activityLogs).orderBy((0, import_drizzle_orm3.desc)(activityLogs.timestamp));
  }
  async createActivityLog(log2) {
    const [createdLog] = await db2.insert(activityLogs).values(log2).returning();
    return createdLog;
  }
  /**
   * LEGAL ENTITY REPOSITORY METHODS
   */
  async getAllLegalEntities() {
    return db2.select().from(legalEntities);
  }
  async getLegalEntity(id) {
    const [entity] = await db2.select().from(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.id, id));
    return entity;
  }
  async getLegalEntityByEntityId(entityId) {
    const [entity] = await db2.select().from(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.entityId, entityId));
    return entity;
  }
  async createLegalEntity(entity) {
    const [createdEntity] = await db2.insert(legalEntities).values(entity).returning();
    return createdEntity;
  }
  async updateLegalEntity(id, data) {
    const [updatedEntity] = await db2.update(legalEntities).set(data).where((0, import_drizzle_orm3.eq)(legalEntities.id, id)).returning();
    return updatedEntity;
  }
  async deleteLegalEntity(id) {
    await db2.delete(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.id, id));
    return true;
  }
  /**
   * RISK SUMMARY REPOSITORY METHODS
   */
  async getLatestRiskSummary() {
    const results = await db2.select().from(riskSummaries).orderBy((0, import_drizzle_orm3.desc)(riskSummaries.createdAt)).limit(1);
    return results.length > 0 ? results[0] : null;
  }
  async createRiskSummary(summary) {
    const now = /* @__PURE__ */ new Date();
    const summaryWithDate = {
      ...summary,
      year: summary.year || now.getFullYear(),
      month: summary.month || now.getMonth() + 1
      // JavaScript months are 0-based
    };
    const [createdSummary] = await db2.insert(riskSummaries).values(summaryWithDate).returning();
    return createdSummary;
  }
  /**
   * RISK-CONTROL RELATIONSHIP REPOSITORY METHODS
   */
  async getControlsForRisk(riskId) {
    try {
      const risk = await this.getRisk(riskId);
      if (!risk) {
        console.log(`No risk found with ID ${riskId}`);
        return [];
      }
      console.log(`Getting controls for risk ID ${riskId}, riskId: ${risk.riskId}`);
      const joinRecords = await db2.select().from(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.riskId, riskId));
      console.log(`Found ${joinRecords.length} risk-control relationships`);
      if (joinRecords.length === 0) return [];
      const controlIds = joinRecords.map((record) => record.controlId);
      console.log(`Control IDs: ${controlIds.join(", ")}`);
      const controlsList = await this.getControlsByIds(controlIds);
      console.log(`Found ${controlsList.length} controls`);
      return controlsList;
    } catch (error) {
      console.error(`Error getting controls for risk ${riskId}:`, error);
      return [];
    }
  }
  async getRisksForControl(controlId) {
    const joinRecords = await db2.select().from(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.controlId, controlId));
    if (joinRecords.length === 0) return [];
    const riskIds = joinRecords.map((record) => record.riskId);
    return this.getRisksByIds(riskIds);
  }
  async addControlToRisk(riskId, controlId) {
    const [existing] = await db2.select().from(riskControls).where(
      (0, import_drizzle_orm3.and)(
        (0, import_drizzle_orm3.eq)(riskControls.riskId, riskId),
        (0, import_drizzle_orm3.eq)(riskControls.controlId, controlId)
      )
    );
    if (!existing) {
      await db2.insert(riskControls).values({
        riskId,
        controlId
      });
    }
  }
  async removeControlFromRisk(riskId, controlId) {
    await db2.delete(riskControls).where(
      (0, import_drizzle_orm3.and)(
        (0, import_drizzle_orm3.eq)(riskControls.riskId, riskId),
        (0, import_drizzle_orm3.eq)(riskControls.controlId, controlId)
      )
    );
  }
  async removeControlsFromRisk(riskId) {
    await db2.delete(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.riskId, riskId));
  }
  async removeControlFromAllRisks(controlId) {
    await db2.delete(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.controlId, controlId));
  }
  /**
   * RISK SUMMARY REPOSITORY METHODS
   */
  async recalculateRiskSummaries() {
    console.log("Risk summaries recalculation requested - placeholder implementation");
  }
  /**
   * CONTROL LIBRARY REPOSITORY METHODS
   */
  async getAllControlLibraryItems() {
    return db2.select().from(controlLibrary);
  }
  async getControlLibraryItem(id) {
    const [item] = await db2.select().from(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
    return item;
  }
  async createControlLibraryItem(data) {
    const [item] = await db2.insert(controlLibrary).values(data).returning();
    return item;
  }
  async updateControlLibraryItem(id, data) {
    const [item] = await db2.update(controlLibrary).set(data).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id)).returning();
    return item;
  }
  async deleteControlLibraryItem(id) {
    await db2.delete(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
  }
  /**
   * RISK SUMMARY RECALCULATION
   */
  async recalculateRiskSummaries() {
    const allRisks = await this.getAllRisks();
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;
    for (const risk of allRisks) {
      if (risk.inherentRisk && !isNaN(Number(risk.inherentRisk))) {
        totalInherentRisk += Number(risk.inherentRisk);
      }
      if (risk.residualRisk && !isNaN(Number(risk.residualRisk))) {
        totalResidualRisk += Number(risk.residualRisk);
      }
    }
    const now = /* @__PURE__ */ new Date();
    await this.createRiskSummary({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      totalInherentRisk: String(totalInherentRisk),
      totalResidualRisk: String(totalResidualRisk),
      riskCount: allRisks.length,
      createdAt: now
    });
    console.log(`Risk summaries recalculated: inherent=${totalInherentRisk}, residual=${totalResidualRisk}`);
  }
  /**
   * COST MODULE REPOSITORY METHODS
   */
  async getRiskCosts(riskId) {
    const result = await db2.execute(import_drizzle_orm3.sql`
      SELECT rc.*, cm.name as module_name, cm.cost_type, cm.cost_factor, cm.cis_control
      FROM risk_costs rc
      JOIN cost_modules cm ON rc.cost_module_id = cm.id
      WHERE rc.risk_id = ${riskId}
    `);
    return result.rows;
  }
  async getCostModule(id) {
    const result = await db2.execute(import_drizzle_orm3.sql`
      SELECT * FROM cost_modules WHERE id = ${id}
    `);
    return result.rows[0];
  }
  /**
   * RISK LIBRARY REPOSITORY METHODS
   */
  async getAllRiskLibraryItems() {
    return db2.select().from(riskLibrary);
  }
  async getRiskLibraryItem(id) {
    const [item] = await db2.select().from(riskLibrary).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id));
    return item;
  }
  async createRiskLibraryItem(data) {
    const [item] = await db2.insert(riskLibrary).values(data).returning();
    return item;
  }
  async updateRiskLibraryItem(id, data) {
    const [item] = await db2.update(riskLibrary).set(data).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id)).returning();
    return item;
  }
  async deleteRiskLibraryItem(id) {
    await db2.delete(riskLibrary).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id));
  }
  /**
   * ASSET-RISK RELATIONSHIP METHODS
   */
  async getRisksByAssetId(assetId) {
    const assetRecord = await this.getAsset(assetId);
    if (!assetRecord) return [];
    const allRisks = await this.getAllRisks();
    return allRisks.filter(
      (risk) => risk.associatedAssets && risk.associatedAssets.includes(assetRecord.assetId)
    );
  }
  async getAssetsForLegalEntity(entityId) {
    const entity = await this.getLegalEntity(entityId);
    if (!entity) return [];
    const allAssets = await this.getAllAssets();
    return allAssets.filter((asset) => asset.legalEntity === entity.entityId);
  }
  async getAssetsByLegalEntity(entityId) {
    return this.getAssetsForLegalEntity(entityId);
  }
};
var repositoryStorage = new DatabaseStorage2();

// server/services/riskService.ts
var RiskService = class {
  repository;
  constructor(repository2) {
    this.repository = repository2;
  }
  /**
   * RISK LIBRARY METHODS
   */
  /**
   * Get all risk library templates
   */
  async getAllRiskLibraryItems() {
    return this.repository.getAllRiskLibraryItems();
  }
  /**
   * Get a single risk library template by ID
   */
  async getRiskLibraryItem(id) {
    return this.repository.getRiskLibraryItem(id);
  }
  /**
   * Create a new risk library template
   */
  async createRiskLibraryItem(data) {
    return this.repository.createRiskLibraryItem(data);
  }
  /**
   * Update an existing risk library template
   */
  async updateRiskLibraryItem(id, data) {
    return this.repository.updateRiskLibraryItem(id, data);
  }
  /**
   * Delete a risk library template
   */
  async deleteRiskLibraryItem(id) {
    await this.repository.deleteRiskLibraryItem(id);
    return true;
  }
  /**
   * Create a new risk instance from a library template
   */
  async createRiskFromTemplate(libraryItemId, assetId) {
    const template = await this.repository.getRiskLibraryItem(libraryItemId);
    if (!template) {
      throw new Error(`Risk library template with ID ${libraryItemId} not found`);
    }
    const uniqueId = Math.floor(Math.random() * 1e3);
    const riskId = `RISK-${template.riskId ? template.riskId.split("-")[1] : "TEMPLATE"}-${uniqueId}`;
    const riskData = {
      ...template,
      riskId,
      itemType: "instance",
      libraryItemId: template.id,
      associatedAssets: [assetId],
      // Exclude the primary key
      id: void 0
    };
    return this.createRisk(riskData);
  }
  /**
   * Get all risks with optional filtering
   */
  async getAllRisks(filters) {
    const risks2 = await this.repository.getAllRisks();
    if (!filters || Object.keys(filters).length === 0) {
      return risks2;
    }
    let filteredRisks = risks2.filter((risk) => {
      let match = true;
      if (filters.severity && risk.severity !== filters.severity) {
        match = false;
      }
      if (filters.riskCategory && risk.riskCategory !== filters.riskCategory) {
        match = false;
      }
      if (filters.assetId && (!risk.associatedAssets || !risk.associatedAssets.includes(filters.assetId))) {
        match = false;
      }
      if (filters.legalEntityId && (!risk.legalEntityId || risk.legalEntityId !== filters.legalEntityId)) {
        match = false;
      }
      if (filters.threatCommunity && risk.threatCommunity !== filters.threatCommunity) {
        match = false;
      }
      return match;
    });
    if (filters.sortBy) {
      filteredRisks.sort((a, b) => {
        let valueA, valueB;
        switch (filters.sortBy) {
          case "inherentRisk":
            valueA = parseFloat(a.inherentRisk);
            valueB = parseFloat(b.inherentRisk);
            break;
          case "residualRisk":
            valueA = parseFloat(a.residualRisk);
            valueB = parseFloat(b.residualRisk);
            break;
          case "severity":
            const severityMap = { "low": 1, "medium": 2, "high": 3, "critical": 4 };
            valueA = severityMap[a.severity] || 0;
            valueB = severityMap[b.severity] || 0;
            break;
          case "name":
          default:
            valueA = a.name;
            valueB = b.name;
            break;
        }
        const sortMultiplier = filters.sortOrder === "desc" ? -1 : 1;
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortMultiplier * valueA.localeCompare(valueB);
        } else {
          return sortMultiplier * (valueA - valueB);
        }
      });
    }
    return filteredRisks;
  }
  /**
   * Get a risk by ID
   */
  async getRisk(id) {
    return this.repository.getRisk(id);
  }
  /**
   * Alias method for getRisk to maintain compatibility with controller
   */
  async getRiskById(id) {
    return this.getRisk(id);
  }
  /**
   * Get a risk by riskId
   */
  async getRiskByRiskId(riskId) {
    return this.repository.getRiskByRiskId(riskId);
  }
  /**
   * Create a new risk
   */
  async createRisk(riskData) {
    const risk = await this.repository.createRisk(riskData);
    await this.recalculateRiskSummaries();
    return risk;
  }
  /**
   * Update a risk
   */
  async updateRisk(id, riskData) {
    const preservedSecondaryLossData = {};
    if (riskData.secondaryLossMagnitudeMin !== void 0) {
      preservedSecondaryLossData.secondaryLossMagnitudeMin = riskData.secondaryLossMagnitudeMin;
    }
    if (riskData.secondaryLossMagnitudeAvg !== void 0) {
      preservedSecondaryLossData.secondaryLossMagnitudeAvg = riskData.secondaryLossMagnitudeAvg;
    }
    if (riskData.secondaryLossMagnitudeMax !== void 0) {
      preservedSecondaryLossData.secondaryLossMagnitudeMax = riskData.secondaryLossMagnitudeMax;
    }
    if (riskData.secondaryLossMagnitudeConfidence !== void 0) {
      preservedSecondaryLossData.secondaryLossMagnitudeConfidence = riskData.secondaryLossMagnitudeConfidence;
    }
    if (riskData.secondaryLossEventFrequencyMin !== void 0) {
      preservedSecondaryLossData.secondaryLossEventFrequencyMin = riskData.secondaryLossEventFrequencyMin;
    }
    if (riskData.secondaryLossEventFrequencyAvg !== void 0) {
      preservedSecondaryLossData.secondaryLossEventFrequencyAvg = riskData.secondaryLossEventFrequencyAvg;
    }
    if (riskData.secondaryLossEventFrequencyMax !== void 0) {
      preservedSecondaryLossData.secondaryLossEventFrequencyMax = riskData.secondaryLossEventFrequencyMax;
    }
    if (riskData.secondaryLossEventFrequencyConfidence !== void 0) {
      preservedSecondaryLossData.secondaryLossEventFrequencyConfidence = riskData.secondaryLossEventFrequencyConfidence;
    }
    const updatedRisk = await this.repository.updateRisk(id, riskData);
    if (updatedRisk && Object.keys(preservedSecondaryLossData).length > 0) {
      await this.repository.updateRisk(id, preservedSecondaryLossData);
    }
    if (updatedRisk) {
      await this.recalculateRiskSummaries();
      return this.repository.getRisk(id);
    }
    return updatedRisk;
  }
  /**
   * Delete a risk
   */
  async deleteRisk(id) {
    try {
      if (isNaN(Number(id))) {
        throw new Error(`Invalid risk ID: ${id}`);
      }
      const numericId = Number(id);
      const success = await this.repository.deleteRisk(numericId);
      if (success) {
        try {
          await this.recalculateRiskSummaries();
        } catch (summaryError) {
          console.log("Non-fatal error recalculating risk summaries:", summaryError);
        }
      }
      return success;
    } catch (error) {
      console.error("Error in risk deletion:", error);
      throw error;
    }
  }
  /**
   * Calculate risk values for a risk
   * This service method orchestrates the data gathering and calculation process
   * but delegates actual calculation to the pure utility function
   * @param riskId Can be either a numeric ID or a string risk ID like "RISK-DATA-123"
   */
  async calculateRiskValues(riskId, options = {}) {
    let risk;
    if (typeof riskId === "string" && riskId.includes("-")) {
      risk = await this.repository.getRiskByRiskId(riskId);
    } else {
      risk = await this.repository.getRisk(Number(riskId));
    }
    if (!risk) {
      console.log(`Risk not found for ID: ${riskId}`);
      return void 0;
    }
    const numericId = typeof risk.id === "number" ? risk.id : Number(risk.id);
    let controls2 = options.controls || await this.repository.getControlsForRisk(numericId);
    if (options.includeControls === false) {
      console.log("Calculating INHERENT risk - ignoring controls");
      controls2 = [];
    } else {
      console.log(`Calculating RESIDUAL risk - found ${controls2 ? controls2.length : 0} controls`);
    }
    let assets2 = [];
    if (risk.associatedAssets && Array.isArray(risk.associatedAssets) && risk.associatedAssets.length > 0) {
      assets2 = await this.repository.getAssetsByIds(risk.associatedAssets);
      assets2 = assets2.map((asset) => {
        let numericAssetValue = 0;
        if (typeof asset.assetValue === "number") {
          numericAssetValue = asset.assetValue;
        } else if (typeof asset.assetValue === "string") {
          numericAssetValue = parseFloat(asset.assetValue.replace(/[^0-9.-]/g, ""));
        } else if (typeof asset.asset_value === "string" || typeof asset.asset_value === "number") {
          numericAssetValue = typeof asset.asset_value === "string" ? parseFloat(asset.asset_value.replace(/[^0-9.-]/g, "")) : asset.asset_value;
        }
        if (isNaN(numericAssetValue)) {
          numericAssetValue = 0;
        }
        console.log(`Asset ${asset.assetId || asset.id} value = $${numericAssetValue}`);
        return {
          ...asset,
          assetValue: numericAssetValue,
          // Also ensure we have a numeric backup in value field for legacy compatibility
          value: numericAssetValue,
          // Add the snake_case version too for complete compatibility
          asset_value: numericAssetValue
        };
      });
      console.log(`Retrieved ${assets2.length} assets for risk calculation: ${risk.riskId}`);
      console.log(`Processed asset values: ${assets2.map((a) => `${a.assetId}: $${a.assetValue}`).join(", ")}`);
    }
    let costModuleAssignments = [];
    console.log(`STEP 1: Fetching cost modules for risk ${numericId}`);
    try {
      const { pool: pool3 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const result = await pool3.query(`
        SELECT 
          rc.id,
          rc.risk_id,
          rc.cost_module_id,
          rc.weight,
          cm.name,
          cm.description,
          cm.cost_type,
          cm.cost_factor,
          cm.cis_control
        FROM risk_costs rc 
        JOIN cost_modules cm ON rc.cost_module_id = cm.id 
        WHERE rc.risk_id = $1
      `, [numericId]);
      const riskCostAssignments = result.rows;
      console.log(`STEP 2: Found ${riskCostAssignments.length} cost assignments for risk ${numericId}`);
      costModuleAssignments = riskCostAssignments.map((assignment) => ({
        id: assignment.id,
        risk_id: assignment.risk_id,
        cost_module_id: assignment.cost_module_id,
        materiality_weight: parseFloat(assignment.weight) || 1,
        cost_module: {
          id: assignment.cost_module_id,
          name: assignment.name,
          costType: assignment.cost_type,
          costFactor: parseFloat(assignment.cost_factor),
          description: assignment.description
        }
      }));
      console.log(`STEP 2: Found ${costModuleAssignments.length} cost modules for risk ${numericId}:`);
      costModuleAssignments.forEach((cm) => {
        console.log(`  - ${cm.cost_module.name}: ${cm.cost_module.costType} = $${cm.cost_module.costFactor}`);
      });
    } catch (error) {
      console.log(`Error fetching cost modules for risk ${numericId}:`, error?.message || "Unknown error");
      costModuleAssignments = [];
    }
    const riskWithEnhancedData = {
      ...risk,
      assetObjects: assets2,
      costModuleAssignments
    };
    console.log(`STEP 4: About to call calculateRiskValues with ${controls2?.length || 0} controls and ${costModuleAssignments.length} cost modules`);
    const calculationResults = calculateRiskValues(riskWithEnhancedData, 0, controls2, costModuleAssignments);
    console.log(`STEP 4: calculateRiskValues returned, inherentRisk=${calculationResults?.inherentRisk}, residualRisk=${calculationResults?.residualRisk}`);
    if (calculationResults && numericId) {
      console.log(`SERVICE DEBUG: calculationResults exists, controls.length = ${controls2?.length || 0}`);
      console.log(`SERVICE DEBUG: inherentRisk = ${calculationResults.inherentRisk}, residualRisk = ${calculationResults.residualRisk}`);
      if (calculationResults.inherentRisk > 0 || calculationResults.residualRisk > 0) {
        console.log(`Calculation result: inherentRisk = ${calculationResults.inherentRisk} residualRisk = ${calculationResults.residualRisk}`);
        const lossMagnitudeMin = risk.primaryLossMagnitudeMin || 0;
        const lossMagnitudeAvg = risk.primaryLossMagnitudeAvg || 0;
        const lossMagnitudeMax = risk.primaryLossMagnitudeMax || 0;
        console.log(`Loss magnitude values from calculation: Min=${lossMagnitudeMin}, Avg=${lossMagnitudeAvg}, Max=${lossMagnitudeMax}`);
        console.log(`Saving calculated risk values to database:
        Inherent Risk: ${calculationResults.inherentRisk}
        Residual Risk: ${calculationResults.residualRisk}`);
        const currentRisk = await this.repository.getRisk(numericId);
        let residualRiskValue = calculationResults.residualRisk;
        console.log(`Using calculation utility result: residualRisk=${residualRiskValue}`);
        let updatedResistanceMin = risk.resistanceStrengthMin || 0;
        let updatedResistanceAvg = risk.resistanceStrengthAvg || 0;
        let updatedResistanceMax = risk.resistanceStrengthMax || 0;
        if (controls2 && controls2.length > 0) {
          let totalEffectiveness = 0;
          let validControls = 0;
          for (const control of controls2) {
            if (control.controlEffectiveness && control.controlEffectiveness > 0) {
              const effectiveness = Number(control.controlEffectiveness) || 0;
              let implementationFactor = 0;
              if (control.implementationStatus === "fully_implemented") {
                implementationFactor = 1;
              } else if (control.implementationStatus === "in_progress") {
                implementationFactor = 0.5;
              } else {
                implementationFactor = 0;
              }
              const adjustedEffectiveness = effectiveness * implementationFactor;
              totalEffectiveness += adjustedEffectiveness;
              validControls++;
            }
          }
          if (validControls > 0) {
            const avgEffectiveness = totalEffectiveness / validControls;
            updatedResistanceMin = Math.min(10, updatedResistanceMin + avgEffectiveness * 0.8);
            updatedResistanceAvg = Math.min(10, updatedResistanceAvg + avgEffectiveness);
            updatedResistanceMax = Math.min(10, updatedResistanceMax + avgEffectiveness * 1.2);
            console.log(`Database update: Resistance Strength updated from (${risk.resistanceStrengthMin || 0}/${risk.resistanceStrengthAvg || 0}/${risk.resistanceStrengthMax || 0}) to (${updatedResistanceMin}/${updatedResistanceAvg}/${updatedResistanceMax})`);
          }
        }
        const calculatedSecondaryLoss = calculationResults.secondaryLossMagnitude;
        let secondaryLossMin = parseFloat(calculatedSecondaryLoss?.min) || parseFloat(risk.secondaryLossMagnitudeMin) || 0;
        let secondaryLossAvg = parseFloat(calculatedSecondaryLoss?.avg) || parseFloat(risk.secondaryLossMagnitudeAvg) || 0;
        let secondaryLossMax = parseFloat(calculatedSecondaryLoss?.max) || parseFloat(risk.secondaryLossMagnitudeMax) || 0;
        console.log(`USING CALCULATED SECONDARY LOSS VALUES: Min=${secondaryLossMin}, Avg=${secondaryLossAvg}, Max=${secondaryLossMax}`);
        const updateData = {
          inherentRisk: String(calculationResults.inherentRisk),
          residualRisk: String(residualRiskValue),
          // Update Resistance Strength values to reflect control effectiveness
          resistanceStrengthMin: updatedResistanceMin,
          resistanceStrengthAvg: updatedResistanceAvg,
          resistanceStrengthMax: updatedResistanceMax,
          // Store the Enhanced Loss Magnitude values that include cost modules
          lossMagnitudeMin: String(calculationResults.lossMagnitude?.min || lossMagnitudeMin),
          lossMagnitudeAvg: String(calculationResults.lossMagnitude?.avg || lossMagnitudeAvg),
          lossMagnitudeMax: String(calculationResults.lossMagnitude?.max || lossMagnitudeMax),
          lossMagnitudeConfidence: "medium",
          // Store calculated secondary loss values
          secondaryLossMagnitudeMin: String(secondaryLossMin),
          secondaryLossMagnitudeAvg: String(secondaryLossAvg),
          secondaryLossMagnitudeMax: String(secondaryLossMax)
        };
        console.log(`DATABASE UPDATE: Saving residual risk ${updateData.residualRisk} and resistance strength (${updateData.resistanceStrengthMin}/${updateData.resistanceStrengthAvg}/${updateData.resistanceStrengthMax})`);
        await this.repository.updateRisk(numericId, updateData);
        if (typeof riskId === "string" && riskId.includes("-")) {
          risk = await this.repository.getRiskByRiskId(riskId);
        } else {
          risk = await this.repository.getRisk(Number(riskId));
        }
        calculationResults.risk = risk;
      }
    }
    return calculationResults;
  }
  /**
   * Get controls associated with a risk
   * @param riskId The numeric ID of the risk
   * @returns Array of controls associated with the risk
   */
  async getControlsForRisk(riskId) {
    return this.repository.getControlsForRisk(riskId);
  }
  /**
   * Get assets associated with a risk
   * @param riskId The numeric ID of the risk
   * @returns Array of assets associated with the risk
   */
  async getAssetsForRisk(riskId) {
    return this.getAssetsForRiskInternal(riskId);
  }
  /**
   * Run ad-hoc Monte Carlo risk calculation without saving to database
   * This allows for immediate, on-demand calculation of risk values based on provided parameters
   * @param params Risk calculation parameters
   * @returns Calculated risk values including Monte Carlo simulation results
   */
  async runAdHocMonteCarloCalculation(params) {
    if (!params) return void 0;
    try {
      return calculateRiskValues(params, 0, []);
    } catch (error) {
      console.error("Error in ad-hoc Monte Carlo calculation:", error);
      return void 0;
    }
  }
  /**
   * Get assets associated with a risk (duplicate method - cleanup)
   */
  async getAssetsForRiskInternal(riskId) {
    const risk = await this.repository.getRisk(riskId);
    if (!risk || !risk.associatedAssets || risk.associatedAssets.length === 0) {
      return [];
    }
    return this.repository.getAssetsByIds(risk.associatedAssets);
  }
  /**
   * Calculate and update risk values - called by controller
   * This method handles all the logic that was removed from the controller
   */
  async calculateAndUpdateRiskValues(idParam) {
    try {
      let riskId = idParam;
      let risk = null;
      if (!isNaN(parseInt(idParam))) {
        const numericId = parseInt(idParam);
        risk = await this.getRiskById(numericId);
        if (risk) {
          riskId = risk.riskId;
        }
      } else {
        risk = await this.getRiskByRiskId(riskId);
      }
      if (!risk) {
        throw new Error("Risk not found");
      }
      const controls2 = await this.getControlsForRisk(risk.id);
      console.log(`Retrieved ${controls2 ? controls2.length : 0} controls for risk calculation: ${riskId}`);
      console.log("Calling unified calculation that handles both inherent and residual risk...");
      const calculationResult = await this.calculateRiskValues(risk.id, { includeControls: true, controls: controls2 });
      const updatedRisk = await this.getRiskById(risk.id);
      const finalInherentRisk = calculationResult?.inherentRisk || 0;
      const finalResidualRisk = updatedRisk?.residualRisk ? parseFloat(updatedRisk.residualRisk) : finalInherentRisk;
      console.log(`Service method returning CORRECTED VALUES: inherentRisk=${finalInherentRisk}, residualRisk=${finalResidualRisk}`);
      return {
        inherentRisk: finalInherentRisk,
        residualRisk: finalResidualRisk,
        ...calculationResult || {}
      };
    } catch (error) {
      console.error("Error in calculateAndUpdateRiskValues:", error);
      throw error;
    }
  }
  /**
   * Recalculate and store risk summaries
   */
  async recalculateRiskSummaries() {
    const risks2 = await this.repository.getAllRisks();
    const totalInherentRisk = risks2.reduce((sum, risk) => {
      const val = parseFloat(risk.inherentRisk);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const totalResidualRisk = risks2.reduce((sum, risk) => {
      const val = parseFloat(risk.residualRisk);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const maxLoss = risks2.reduce((max, risk) => {
      const val = parseFloat(risk.residualRisk);
      return Math.max(max, isNaN(val) ? 0 : val);
    }, 0);
    const lossExceedanceCurve = [];
    if (maxLoss > 0) {
      for (let i = 0; i <= 100; i++) {
        const x = i * (maxLoss / 100);
        let y = 100 - i;
        if (i > 90) {
          y = 10 * Math.exp(-0.5 * (i - 90) / 2);
        }
        lossExceedanceCurve.push({ x, y: y / 100 });
      }
    }
    try {
      const now = /* @__PURE__ */ new Date();
      if (typeof this.repository.createRiskSummary === "function") {
        await this.repository.createRiskSummary({
          createdAt: now,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          // JavaScript months are 0-based, add 1 for database
          totalRisk: totalResidualRisk,
          lossExceedanceCurve: JSON.stringify(lossExceedanceCurve),
          riskDistribution: JSON.stringify([])
        });
      } else if (typeof this.repository.addRiskSummary === "function") {
        await this.repository.addRiskSummary({
          createdAt: now,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          totalRisk: totalResidualRisk,
          lossExceedanceCurve: JSON.stringify(lossExceedanceCurve),
          riskDistribution: JSON.stringify([])
        });
      } else {
        console.log("Warning: Unable to save risk summary - no appropriate method found");
      }
    } catch (error) {
      console.log("Error saving risk summary (non-fatal):", error);
    }
  }
};
var riskService = (repository2) => new RiskService(repository2);

// server/services/assetService.ts
var AssetService = class {
  repository;
  constructor(repository2) {
    this.repository = repository2;
  }
  /**
   * Get all assets
   */
  async getAllAssets() {
    return this.repository.getAllAssets();
  }
  /**
   * Get an asset by ID
   */
  async getAsset(id) {
    return this.repository.getAsset(id);
  }
  /**
   * Get an asset by assetId
   */
  async getAssetByAssetId(assetId) {
    return this.repository.getAssetByAssetId(assetId);
  }
  /**
   * Create a new asset
   */
  async createAsset(assetData) {
    const asset = await this.repository.createAsset(assetData);
    await this.logAssetActivity(asset.id, "create", "Asset created");
    return asset;
  }
  /**
   * Update an asset
   */
  async updateAsset(id, assetData) {
    const updatedAsset = await this.repository.updateAsset(id, assetData);
    if (updatedAsset) {
      await this.logAssetActivity(updatedAsset.id, "update", "Asset updated");
    }
    return updatedAsset;
  }
  /**
   * Delete an asset
   */
  async deleteAsset(id) {
    const asset = await this.repository.getAsset(id);
    if (!asset) {
      return false;
    }
    const success = await this.repository.deleteAsset(id);
    if (success) {
      await this.logAssetActivity(id, "delete", "Asset deleted");
    }
    return success;
  }
  /**
   * Get risks associated with an asset
   */
  async getRisksForAsset(assetId) {
    const allRisks = await this.repository.getAllRisks();
    return allRisks.filter(
      (risk) => risk.associatedAssets && risk.associatedAssets.includes(assetId)
    );
  }
  /**
   * Helper to log asset activity
   */
  async logAssetActivity(assetId, actionType, description) {
    await this.repository.createActivityLog({
      entityType: "asset",
      entityId: assetId.toString(),
      actionType,
      description,
      userId: "system",
      // Default to system for now, could be passed from controller
      timestamp: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      details: JSON.stringify({})
    });
  }
};
var assetService = (repository2) => new AssetService(repository2);

// server/services/controlService.ts
var ControlService = class {
  repository;
  constructor(repository2) {
    this.repository = repository2;
  }
  /**
   * CONTROL LIBRARY METHODS
   */
  /**
   * Get all control library templates
   */
  async getAllControlLibraryItems() {
    return this.repository.getAllControlLibraryItems();
  }
  /**
   * Get a control library template by ID
   */
  async getControlLibraryItem(id) {
    return this.repository.getControlLibraryItem(id);
  }
  /**
   * Create a new control library template
   */
  async createControlLibraryItem(itemData) {
    const item = await this.repository.createControlLibraryItem(itemData);
    await this.repository.createActivityLog({
      activity: "create",
      user: "System User",
      entity: `Control Template ${item.name || item.controlId}`,
      entityType: "control_library",
      entityId: item.id.toString()
    });
    return item;
  }
  /**
   * Update a control library template
   */
  async updateControlLibraryItem(id, itemData) {
    const updatedItem = await this.repository.updateControlLibraryItem(id, itemData);
    if (updatedItem) {
      await this.repository.createActivityLog({
        activity: "update",
        user: "System User",
        entity: `Control Template ${updatedItem.name || updatedItem.controlId}`,
        entityType: "control_library",
        entityId: updatedItem.id.toString()
      });
    }
    return updatedItem;
  }
  /**
   * Delete a control library template
   */
  async deleteControlLibraryItem(id) {
    const item = await this.repository.getControlLibraryItem(id);
    if (!item) {
      return false;
    }
    const success = await this.repository.deleteControlLibraryItem(id);
    if (success) {
      await this.repository.createActivityLog({
        activity: "delete",
        user: "System User",
        entity: `Control Template ${item.name || item.controlId}`,
        entityType: "control_library",
        entityId: id.toString()
      });
    }
    return success;
  }
  /**
   * Get all controls with optional filtering
   */
  async getAllControls(filters) {
    const controls2 = await this.repository.getAllControls();
    if (!filters || Object.keys(filters).length === 0) {
      return controls2;
    }
    return controls2.filter((control) => {
      let match = true;
      if (filters.controlType && control.controlType !== filters.controlType) {
        match = false;
      }
      if (filters.implementationStatus && control.implementationStatus !== filters.implementationStatus) {
        match = false;
      }
      if (filters.controlCategory && control.controlCategory !== filters.controlCategory) {
        match = false;
      }
      if (filters.riskId && control.riskId !== filters.riskId) {
        match = false;
      }
      if (filters.assetId && control.assetId !== filters.assetId) {
        match = false;
      }
      if (filters.legalEntityId && control.legalEntityId !== filters.legalEntityId) {
        match = false;
      }
      return match;
    });
  }
  /**
   * Get a control by ID
   */
  async getControl(id) {
    return this.repository.getControl(id);
  }
  /**
   * Get a control by controlId
   */
  async getControlByControlId(controlId) {
    return this.repository.getControlByControlId(controlId);
  }
  /**
   * Create a new control
   */
  async createControl(controlData) {
    const control = await this.repository.createControl(controlData);
    if (control.riskId) {
      try {
        await this.repository.recalculateRiskSummaries();
        console.log(`Risk summaries recalculated after creating control ${control.id}`);
      } catch (error) {
        console.error("Error recalculating risk summaries after control creation:", error);
      }
    }
    await this.logControlActivity(control.id, "create", "Control created");
    return control;
  }
  /**
   * Update a control
   */
  async updateControl(id, controlData) {
    const existingControl = await this.repository.getControl(id);
    const updatedControl = await this.repository.updateControl(id, controlData);
    if (updatedControl) {
      const effectivenessChanged = existingControl && (existingControl.effectiveness !== updatedControl.effectiveness || existingControl.implementationStatus !== updatedControl.implementationStatus);
      if (effectivenessChanged || updatedControl.riskId) {
        try {
          await this.repository.recalculateRiskSummaries();
          console.log(`Risk summaries recalculated after updating control ${id}`);
        } catch (error) {
          console.error("Error recalculating risk summaries after control update:", error);
        }
      }
      await this.logControlActivity(updatedControl.id, "update", "Control updated");
    }
    return updatedControl;
  }
  /**
   * Delete a control
   */
  async deleteControl(id) {
    const control = await this.repository.getControl(id);
    if (!control) {
      return false;
    }
    const associatedRisks = await this.repository.getRisksForControl(id);
    const hasAssociatedRisks = associatedRisks && associatedRisks.length > 0;
    await this.removeControlFromRisks(id);
    const success = await this.repository.deleteControl(id);
    if (success) {
      if (hasAssociatedRisks) {
        try {
          await this.repository.recalculateRiskSummaries();
          console.log(`Risk summaries recalculated after deleting control ${id}`);
        } catch (error) {
          console.error("Error recalculating risk summaries after control deletion:", error);
        }
      }
      await this.logControlActivity(id, "delete", "Control deleted");
    }
    return success;
  }
  /**
   * Get risks associated with a control
   */
  async getRisksForControl(controlId) {
    return this.repository.getRisksForControl(controlId);
  }
  /**
   * Associate a control with a risk
   */
  async addControlToRisk(riskId, controlId) {
    await this.repository.addControlToRisk(riskId, controlId);
    await this.logControlActivity(
      controlId,
      "associate",
      `Control associated with risk ID ${riskId}`
    );
  }
  /**
   * Remove a control from a risk
   */
  async removeControlFromRisk(riskId, controlId) {
    await this.repository.removeControlFromRisk(riskId, controlId);
    await this.logControlActivity(
      controlId,
      "disassociate",
      `Control disassociated from risk ID ${riskId}`
    );
  }
  /**
   * Remove a control from all associated risks
   */
  async removeControlFromRisks(controlId) {
    const risks2 = await this.repository.getRisksForControl(controlId);
    for (const risk of risks2) {
      await this.repository.removeControlFromRisk(risk.id, controlId);
    }
  }
  /**
   * Helper to log control activity
   */
  async logControlActivity(controlId, actionType, description) {
    let controlName = "Control";
    try {
      const control = await this.repository.getControl(controlId);
      if (control && control.name) {
        controlName = control.name;
      } else if (control && control.controlId) {
        controlName = `Control ${control.controlId}`;
      }
    } catch (error) {
      console.log("Could not get control details for logging, using default name");
    }
    await this.repository.createActivityLog({
      activity: actionType,
      // Map actionType to the required activity field
      user: "System User",
      // Required field
      entity: controlName,
      // Required field - use control name
      entityType: "control",
      // Required field
      entityId: controlId.toString()
      // Required field
    });
  }
};
var controlService = (repository2) => new ControlService(repository2);

// server/services/responseService.ts
var ResponseService = class {
  repository;
  constructor(repository2) {
    this.repository = repository2;
  }
  /**
   * Get all responses with optional filtering
   */
  async getAllResponses(filters) {
    let responses = [];
    if (filters?.riskId) {
      responses = await this.repository.getRiskResponsesForRisk(filters.riskId);
    } else {
      const risks2 = await this.repository.getAllRisks();
      for (const risk of risks2) {
        if (risk.riskId) {
          const riskResponses2 = await this.repository.getRiskResponsesForRisk(risk.riskId);
          responses = [...responses, ...riskResponses2];
        }
      }
    }
    if (!filters || Object.keys(filters).length === 0) {
      return responses;
    }
    let filteredResponses = responses.filter((response) => {
      let match = true;
      if (filters.responseType && response.responseType !== filters.responseType) {
        match = false;
      }
      return match;
    });
    if (filters.sortBy) {
      filteredResponses.sort((a, b) => {
        let valueA, valueB;
        switch (filters.sortBy) {
          case "riskId":
            valueA = a.riskId;
            valueB = b.riskId;
            break;
          case "responseType":
          default:
            valueA = a.responseType;
            valueB = b.responseType;
            break;
        }
        const sortMultiplier = filters.sortOrder === "desc" ? -1 : 1;
        return sortMultiplier * String(valueA).localeCompare(String(valueB));
      });
    }
    return filteredResponses;
  }
  /**
   * Get a response by ID
   */
  async getResponse(id) {
    return this.repository.getRiskResponse(id);
  }
  /**
   * Get a response by riskId
   */
  async getResponseByRiskId(riskId) {
    const responses = await this.repository.getRiskResponsesForRisk(riskId);
    return responses && responses.length > 0 ? responses[0] : void 0;
  }
  /**
   * Create a new response
   */
  async createResponse(responseData) {
    const response = await this.repository.createRiskResponse(responseData);
    try {
      const riskService3 = this.repository.getRiskService ? this.repository.getRiskService() : null;
      if (riskService3 && riskService3.recalculateRiskSummaries) {
        await riskService3.recalculateRiskSummaries();
      } else {
        console.log("Risk summaries could not be recalculated - missing method");
      }
    } catch (error) {
      console.error("Error recalculating risk summaries after response creation:", error);
    }
    await this.logResponseActivity(response.id, "create", "Response created");
    return response;
  }
  /**
   * Update a response
   */
  async updateResponse(id, responseData) {
    const updatedResponse = await this.repository.updateRiskResponse(id, responseData);
    if (updatedResponse) {
      try {
        const riskService3 = this.repository.getRiskService ? this.repository.getRiskService() : null;
        if (riskService3 && riskService3.recalculateRiskSummaries) {
          await riskService3.recalculateRiskSummaries();
        } else {
          console.log("Risk summaries could not be recalculated - missing method");
        }
      } catch (error) {
        console.error("Error recalculating risk summaries after response update:", error);
      }
      await this.logResponseActivity(updatedResponse.id, "update", "Response updated");
    }
    return updatedResponse;
  }
  /**
   * Delete a response
   */
  async deleteResponse(id) {
    const response = await this.repository.getRiskResponse(id);
    if (!response) {
      return false;
    }
    const success = await this.repository.deleteRiskResponse(id);
    if (success) {
      try {
        const riskService3 = this.repository.getRiskService ? this.repository.getRiskService() : null;
        if (riskService3 && riskService3.recalculateRiskSummaries) {
          await riskService3.recalculateRiskSummaries();
        } else {
          console.log("Risk summaries could not be recalculated - missing method");
        }
      } catch (error) {
        console.error("Error recalculating risk summaries after response deletion:", error);
      }
      await this.logResponseActivity(id, "delete", "Response deleted");
    }
    return success;
  }
  /**
   * Helper to log response activity
   */
  async logResponseActivity(responseId, action, description) {
    await this.repository.createActivityLog({
      activity: description,
      user: "System",
      // Default to system for now, could be passed from controller
      entity: `Response ${responseId}`,
      entityType: "response",
      entityId: responseId.toString(),
      createdAt: /* @__PURE__ */ new Date()
    });
  }
};
var responseService = (repository2) => new ResponseService(repository2);

// server/services/index.ts
var repository = new DatabaseStorage2();
var riskServiceInstance = riskService(repository);
var assetServiceInstance = assetService(repository);
var controlServiceInstance = controlService(repository);
var responseServiceInstance = responseService(repository);

// server/routes/risks/controller.ts
var RiskController = class {
  /**
   * Get all risks with optional filtering
   */
  async getAllRisks(req, res) {
    try {
      const filterOptions = {};
      if (req.query.severity) {
        filterOptions.severity = req.query.severity;
      }
      if (req.query.riskCategory) {
        filterOptions.riskCategory = req.query.riskCategory;
      }
      if (req.query.assetId) {
        filterOptions.assetId = req.query.assetId;
      }
      if (req.query.legalEntityId) {
        filterOptions.legalEntityId = req.query.legalEntityId;
      }
      if (req.query.threatCommunity) {
        filterOptions.threatCommunity = req.query.threatCommunity;
      }
      if (req.query.sortBy) {
        filterOptions.sortBy = req.query.sortBy;
      }
      if (req.query.sortOrder) {
        filterOptions.sortOrder = req.query.sortOrder;
      }
      const risks2 = await riskServiceInstance.getAllRisks(filterOptions);
      return sendSuccess(res, risks2);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Get a single risk by ID
   */
  async getRiskById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const risk = await riskServiceInstance.getRisk(id);
      if (!risk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, risk);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create a new risk
   */
  async createRisk(req, res) {
    try {
      const riskData = req.body;
      const newRisk = await riskServiceInstance.createRisk(riskData);
      return sendSuccess(res, newRisk, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Update an existing risk
   */
  async updateRisk(req, res) {
    try {
      const id = parseInt(req.params.id);
      const riskData = req.body;
      const updatedRisk = await riskServiceInstance.updateRisk(id, riskData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Delete a risk
   */
  async deleteRisk(req, res) {
    try {
      const idParam = req.params.id;
      if (idParam.includes("-")) {
        const risk = await riskServiceInstance.getRiskByRiskId(idParam);
        if (!risk) {
          return sendError(res, { message: `Risk with ID ${idParam} not found` }, 404);
        }
        const success = await riskServiceInstance.deleteRisk(risk.id);
        if (!success) {
          return sendError(res, { message: "Error deleting risk" }, 500);
        }
        return sendSuccess(res, { message: "Risk deleted successfully" });
      } else {
        const id = parseInt(idParam);
        if (isNaN(id)) {
          return sendError(res, { message: `Invalid risk ID format: ${idParam}` }, 400);
        }
        const success = await riskServiceInstance.deleteRisk(id);
        if (!success) {
          return sendError(res, { message: "Risk not found" }, 404);
        }
        return sendSuccess(res, { message: "Risk deleted successfully" });
      }
    } catch (error) {
      console.error("Error in risk deletion controller:", error);
      return sendError(res, error);
    }
  }
  /**
   * Get controls associated with a risk
   */
  async getControlsForRisk(req, res) {
    try {
      const idParam = req.params.id;
      console.log(`Fetching controls for risk with ID parameter: ${idParam}`);
      let risk;
      if (!isNaN(parseInt(idParam))) {
        const numericId = parseInt(idParam);
        console.log(`ID appears to be numeric (${numericId}), looking up by numeric ID`);
        risk = await riskServiceInstance.getRiskById(numericId);
      }
      if (!risk) {
        console.log(`Risk not found by numeric ID or ID is not numeric, looking up by riskId string: ${idParam}`);
        const risks2 = await riskServiceInstance.getAllRisks();
        if (Array.isArray(risks2)) {
          console.log(`Found ${risks2.length} risks, searching for matching riskId`);
          risk = risks2.find((r) => r.riskId === idParam);
        } else {
          console.log(`Error: risks is not an array`);
        }
      }
      if (!risk) {
        console.log(`Risk not found for ID: ${idParam}`);
        return sendError(res, { message: `Risk with ID ${idParam} not found` }, 404);
      }
      console.log(`Found risk: ID=${risk.id}, riskId=${risk.riskId}, name=${risk.name}`);
      const controls2 = await riskServiceInstance.getControlsForRisk(risk.id);
      console.log(`Retrieved ${controls2 ? controls2.length : 0} controls for risk`);
      return sendSuccess(res, controls2 || []);
    } catch (error) {
      console.error("Error in getControlsForRisk:", error);
      return sendError(res, error);
    }
  }
  /**
   * Get assets associated with a risk
   */
  async getAssetsForRisk(req, res) {
    try {
      const idParam = req.params.id;
      if (idParam.includes("-")) {
        const risk = await riskServiceInstance.getRiskByRiskId(idParam);
        if (risk) {
          const assets2 = await riskServiceInstance.getAssetsForRisk(risk.id);
          return sendSuccess(res, assets2);
        } else {
          return sendError(res, new Error(`Risk not found with riskId: ${idParam}`));
        }
      } else {
        const id = parseInt(idParam);
        if (isNaN(id)) {
          return sendError(res, new Error(`Invalid risk ID: ${idParam}`));
        }
        const assets2 = await riskServiceInstance.getAssetsForRisk(id);
        return sendSuccess(res, assets2);
      }
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Calculate risk values with updated parameters (for recalculation with form changes)
   */
  async calculateRiskWithUpdatedParams(req, res) {
    try {
      const idParam = req.params.id;
      const updatedParams = req.body;
      console.log(`Recalculating risk ${idParam} with updated parameters:`, updatedParams);
      let risk = null;
      if (!isNaN(parseInt(idParam))) {
        risk = await riskServiceInstance.getRiskById(parseInt(idParam));
      } else {
        risk = await riskServiceInstance.getRiskByRiskId(idParam);
      }
      if (!risk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      const updatedRisk = { ...risk, ...updatedParams };
      const calculatedValues = await riskServiceInstance.calculateRiskValuesFromParams(updatedRisk);
      if (!calculatedValues) {
        return sendError(res, { message: "Risk calculation failed" }, 500);
      }
      if (updatedParams.saveToDatabase !== false) {
        await riskServiceInstance.updateRisk(risk.id, {
          ...updatedParams,
          inherentRisk: calculatedValues.inherentRisk.toString(),
          residualRisk: calculatedValues.residualRisk.toString()
        });
      }
      return sendSuccess(res, calculatedValues);
    } catch (error) {
      console.error("Error in calculateRiskWithUpdatedParams:", error);
      return sendError(res, error);
    }
  }
  /**
   * Calculate risk values - delegates all calculations to service layer
   */
  async calculateRiskValues(req, res) {
    try {
      const idParam = req.params.id;
      const result = await riskServiceInstance.calculateAndUpdateRiskValues(idParam);
      if (!result) {
        return sendError(res, { message: "Risk calculation failed" }, 500);
      }
      return sendSuccess(res, result);
    } catch (error) {
      console.error("Error in risk calculation:", error);
      return sendError(res, error);
    }
  }
  /**
   * Ad-hoc Monte Carlo calculation endpoint - always runs the full calculation on-demand
   * Used for immediate calculation without needing to save the risk parameters first
   */
  async runAdHocMonteCarloCalculation(req, res) {
    try {
      const params = req.body;
      if (!params) {
        return sendError(res, { message: "Missing risk parameters for calculation" }, 400);
      }
      const numericalParams = [
        "contactFrequencyMin",
        "contactFrequencyAvg",
        "contactFrequencyMax",
        "probabilityOfActionMin",
        "probabilityOfActionAvg",
        "probabilityOfActionMax",
        "threatCapabilityMin",
        "threatCapabilityAvg",
        "threatCapabilityMax",
        "resistanceStrengthMin",
        "resistanceStrengthAvg",
        "resistanceStrengthMax",
        "primaryLossMagnitudeMin",
        "primaryLossMagnitudeAvg",
        "primaryLossMagnitudeMax",
        "secondaryLossEventFrequencyMin",
        "secondaryLossEventFrequencyAvg",
        "secondaryLossEventFrequencyMax",
        "secondaryLossMagnitudeMin",
        "secondaryLossMagnitudeAvg",
        "secondaryLossMagnitudeMax"
      ];
      const safeParams = { ...params };
      numericalParams.forEach((param) => {
        if (param in safeParams) {
          const value = safeParams[param];
          if (typeof value === "string") {
            safeParams[param] = parseFloat(value.replace(/[^0-9.-]/g, ""));
          } else if (typeof value !== "number") {
            safeParams[param] = 0;
          }
          if (isNaN(safeParams[param])) {
            safeParams[param] = 0;
          }
        }
      });
      if (safeParams.associatedAssets && Array.isArray(safeParams.associatedAssets)) {
        try {
          const assetIds = safeParams.associatedAssets.map(
            (a) => typeof a === "string" ? a : a.assetId || a.id
          ).filter(Boolean);
          if (assetIds.length > 0) {
            console.log(`Looking up assets by IDs: ${assetIds.join(", ")}`);
            const assetObjects = await riskServiceInstance.getAssetsByIds(assetIds);
            if (assetObjects && assetObjects.length > 0) {
              safeParams.assetObjects = assetObjects;
            }
          }
        } catch (err) {
          console.error("Error looking up assets:", err);
        }
      }
      const calculatedValues = await riskServiceInstance.runAdHocMonteCarloCalculation(safeParams);
      if (!calculatedValues) {
        return sendError(res, { message: "Calculation failed - invalid parameters" }, 400);
      }
      const formattedValues = {
        ...calculatedValues,
        inherentRisk: typeof calculatedValues.inherentRisk === "number" ? calculatedValues.inherentRisk.toFixed(2) : "0.00",
        residualRisk: typeof calculatedValues.residualRisk === "number" ? calculatedValues.residualRisk.toFixed(2) : "0.00"
      };
      return sendSuccess(res, formattedValues);
    } catch (error) {
      console.error("Error in ad hoc calculation:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update Secondary Loss parameters
   * Separate endpoint to specifically update secondary loss values without
   * triggering the standard risk calculation
   */
  async updateSecondaryLoss(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      const secondaryLossData = req.body;
      if (!secondaryLossData.secondaryLossMagnitudeMin || !secondaryLossData.secondaryLossMagnitudeAvg || !secondaryLossData.secondaryLossMagnitudeMax || !secondaryLossData.secondaryLossEventFrequencyMin || !secondaryLossData.secondaryLossEventFrequencyAvg || !secondaryLossData.secondaryLossEventFrequencyMax) {
        return sendError(res, { message: "Missing required secondary loss parameters" }, 400);
      }
      const updateData = {
        secondaryLossMagnitudeMin: secondaryLossData.secondaryLossMagnitudeMin,
        secondaryLossMagnitudeAvg: secondaryLossData.secondaryLossMagnitudeAvg,
        secondaryLossMagnitudeMax: secondaryLossData.secondaryLossMagnitudeMax,
        secondaryLossMagnitudeConfidence: secondaryLossData.secondaryLossMagnitudeConfidence || "medium",
        secondaryLossEventFrequencyMin: secondaryLossData.secondaryLossEventFrequencyMin,
        secondaryLossEventFrequencyAvg: secondaryLossData.secondaryLossEventFrequencyAvg,
        secondaryLossEventFrequencyMax: secondaryLossData.secondaryLossEventFrequencyMax,
        secondaryLossEventFrequencyConfidence: secondaryLossData.secondaryLossEventFrequencyConfidence || "medium"
      };
      const updatedRisk = await riskServiceInstance.updateRisk(riskId, updateData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error("Error updating secondary loss values:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update Contact Frequency parameters
   * Separate endpoint to specifically update contact frequency values without
   * triggering the standard risk calculation
   */
  async updateContactFrequency(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      const contactFrequencyData = req.body;
      if (!contactFrequencyData.contactFrequencyMin || !contactFrequencyData.contactFrequencyAvg || !contactFrequencyData.contactFrequencyMax) {
        return sendError(res, { message: "Missing required contact frequency parameters" }, 400);
      }
      const updateData = {
        contactFrequencyMin: contactFrequencyData.contactFrequencyMin,
        contactFrequencyAvg: contactFrequencyData.contactFrequencyAvg,
        contactFrequencyMax: contactFrequencyData.contactFrequencyMax,
        contactFrequencyConfidence: contactFrequencyData.contactFrequencyConfidence || "medium"
      };
      const updatedRisk = await riskServiceInstance.updateRisk(riskId, updateData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error("Error updating contact frequency values:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update Probability of Action parameters
   * Separate endpoint to specifically update probability of action values without
   * triggering the standard risk calculation
   */
  async updateProbabilityOfAction(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      const poaData = req.body;
      if (!poaData.probabilityOfActionMin || !poaData.probabilityOfActionAvg || !poaData.probabilityOfActionMax) {
        return sendError(res, { message: "Missing required probability of action parameters" }, 400);
      }
      const updateData = {
        probabilityOfActionMin: poaData.probabilityOfActionMin,
        probabilityOfActionAvg: poaData.probabilityOfActionAvg,
        probabilityOfActionMax: poaData.probabilityOfActionMax,
        probabilityOfActionConfidence: poaData.probabilityOfActionConfidence || "medium"
      };
      const updatedRisk = await riskServiceInstance.updateRisk(riskId, updateData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error("Error updating probability of action values:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update Threat Capability parameters
   * Separate endpoint to specifically update threat capability values without
   * triggering the standard risk calculation
   */
  async updateThreatCapability(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      const tcData = req.body;
      if (!tcData.threatCapabilityMin || !tcData.threatCapabilityAvg || !tcData.threatCapabilityMax) {
        return sendError(res, { message: "Missing required threat capability parameters" }, 400);
      }
      const updateData = {
        threatCapabilityMin: tcData.threatCapabilityMin,
        threatCapabilityAvg: tcData.threatCapabilityAvg,
        threatCapabilityMax: tcData.threatCapabilityMax,
        threatCapabilityConfidence: tcData.threatCapabilityConfidence || "medium"
      };
      const updatedRisk = await riskServiceInstance.updateRisk(riskId, updateData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error("Error updating threat capability values:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update Resistance Strength parameters
   * Separate endpoint to specifically update resistance strength values without
   * triggering the standard risk calculation
   */
  async updateResistanceStrength(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      const rsData = req.body;
      if (!rsData.resistanceStrengthMin || !rsData.resistanceStrengthAvg || !rsData.resistanceStrengthMax) {
        return sendError(res, { message: "Missing required resistance strength parameters" }, 400);
      }
      const updateData = {
        resistanceStrengthMin: rsData.resistanceStrengthMin,
        resistanceStrengthAvg: rsData.resistanceStrengthAvg,
        resistanceStrengthMax: rsData.resistanceStrengthMax,
        resistanceStrengthConfidence: rsData.resistanceStrengthConfidence || "medium"
      };
      const updatedRisk = await riskServiceInstance.updateRisk(riskId, updateData);
      if (!updatedRisk) {
        return sendError(res, { message: "Risk not found" }, 404);
      }
      return sendSuccess(res, updatedRisk);
    } catch (error) {
      console.error("Error updating resistance strength values:", error);
      return sendError(res, error);
    }
  }
};
var riskController = new RiskController();

// server/routes/risks/dto.ts
var import_zod4 = require("zod");
var confidenceEnum = import_zod4.z.enum(["low", "medium", "high"]).transform(
  (val) => val.toLowerCase()
);
var numericStringOrNumber = import_zod4.z.union([
  import_zod4.z.string(),
  import_zod4.z.number().transform((n) => n.toString())
]);
var decimalNumber = import_zod4.z.union([
  import_zod4.z.number(),
  import_zod4.z.string().transform((val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })
]);
var riskBaseSchema = import_zod4.z.object({
  riskId: import_zod4.z.string(),
  name: import_zod4.z.string(),
  description: import_zod4.z.string().default(""),
  associatedAssets: import_zod4.z.array(import_zod4.z.string()).default([]),
  threatCommunity: import_zod4.z.string().default(""),
  vulnerability: import_zod4.z.string().default(""),
  riskCategory: import_zod4.z.enum(["operational", "strategic", "compliance", "financial"]).transform((val) => val.toLowerCase()),
  severity: import_zod4.z.enum(["low", "medium", "high", "critical"]),
  inherentRisk: numericStringOrNumber.default("0"),
  residualRisk: numericStringOrNumber.default("0"),
  // FAIR-U parameters
  threatEventFrequency: numericStringOrNumber.optional(),
  threatEventFrequencyMin: numericStringOrNumber.optional(),
  threatEventFrequencyMax: numericStringOrNumber.optional(),
  threatEventFrequencyML: numericStringOrNumber.optional(),
  threatEventFrequencyConfidence: confidenceEnum.optional(),
  vulnerabilityRating: numericStringOrNumber.optional(),
  vulnerabilityRatingMin: numericStringOrNumber.optional(),
  vulnerabilityRatingMax: numericStringOrNumber.optional(),
  vulnerabilityRatingML: numericStringOrNumber.optional(),
  vulnerabilityRatingConfidence: confidenceEnum.optional(),
  primaryLossMin: numericStringOrNumber.optional(),
  primaryLossMax: numericStringOrNumber.optional(),
  primaryLossML: numericStringOrNumber.optional(),
  primaryLossConfidence: confidenceEnum.optional(),
  secondaryLossMin: numericStringOrNumber.optional(),
  secondaryLossMax: numericStringOrNumber.optional(),
  secondaryLossML: numericStringOrNumber.optional(),
  secondaryLossConfidence: confidenceEnum.optional(),
  // Contact Frequency parameters - Fixed to handle decimal values properly
  contactFrequencyMin: decimalNumber.optional(),
  contactFrequencyAvg: decimalNumber.optional(),
  contactFrequencyMax: decimalNumber.optional(),
  contactFrequencyConfidence: confidenceEnum.optional(),
  // Probability of Action parameters - Fixed to handle decimal values properly
  probabilityOfActionMin: decimalNumber.optional(),
  probabilityOfActionAvg: decimalNumber.optional(),
  probabilityOfActionMax: decimalNumber.optional(),
  probabilityOfActionConfidence: confidenceEnum.optional(),
  // Secondary Loss parameters (crucial for risk calculation)
  secondaryLossMagnitudeMin: numericStringOrNumber.optional(),
  secondaryLossMagnitudeAvg: numericStringOrNumber.optional(),
  secondaryLossMagnitudeMax: numericStringOrNumber.optional(),
  secondaryLossMagnitudeConfidence: confidenceEnum.optional(),
  secondaryLossEventFrequencyMin: decimalNumber.optional(),
  secondaryLossEventFrequencyAvg: decimalNumber.optional(),
  secondaryLossEventFrequencyMax: decimalNumber.optional(),
  secondaryLossEventFrequencyConfidence: confidenceEnum.optional(),
  // Primary Loss Magnitude parameters
  primaryLossMagnitudeMin: numericStringOrNumber.optional(),
  primaryLossMagnitudeAvg: numericStringOrNumber.optional(),
  primaryLossMagnitudeMax: numericStringOrNumber.optional(),
  primaryLossMagnitudeConfidence: confidenceEnum.optional(),
  threatEventFrequencyNotes: import_zod4.z.string().optional(),
  vulnerabilityNotes: import_zod4.z.string().optional(),
  primaryLossNotes: import_zod4.z.string().optional(),
  secondaryLossNotes: import_zod4.z.string().optional(),
  // FAIR-CAM parameters - Fixed to handle decimal values properly
  threatCapability: decimalNumber.optional(),
  threatCapabilityMin: decimalNumber.optional(),
  threatCapabilityAvg: decimalNumber.optional(),
  threatCapabilityMax: decimalNumber.optional(),
  threatCapabilityML: decimalNumber.optional(),
  threatCapabilityConfidence: confidenceEnum.optional(),
  // Resistance Strength parameters - Fixed to handle decimal values properly
  resistanceStrengthMin: decimalNumber.optional(),
  resistanceStrengthAvg: decimalNumber.optional(),
  resistanceStrengthMax: decimalNumber.optional(),
  resistanceStrengthConfidence: confidenceEnum.optional(),
  controlStrength: numericStringOrNumber.optional(),
  controlStrengthMin: numericStringOrNumber.optional(),
  controlStrengthMax: numericStringOrNumber.optional(),
  controlStrengthML: numericStringOrNumber.optional(),
  controlStrengthConfidence: confidenceEnum.optional(),
  lossMagnitude: numericStringOrNumber.optional(),
  lossMagnitudeMin: numericStringOrNumber.optional(),
  lossMagnitudeMax: numericStringOrNumber.optional(),
  lossMagnitudeML: numericStringOrNumber.optional(),
  lossMagnitudeConfidence: confidenceEnum.optional()
});
var createRiskSchema = riskBaseSchema;
var updateRiskSchema = riskBaseSchema.partial();
var riskFilterSchema = import_zod4.z.object({
  category: import_zod4.z.enum(["operational", "strategic", "compliance", "financial"]).optional(),
  severity: import_zod4.z.enum(["low", "medium", "high", "critical"]).optional(),
  assetId: import_zod4.z.string().optional(),
  entityId: import_zod4.z.string().optional(),
  search: import_zod4.z.string().optional(),
  sortBy: import_zod4.z.enum(["name", "riskId", "createdAt", "residualRisk", "severity"]).optional(),
  sortOrder: import_zod4.z.enum(["asc", "desc"]).optional(),
  page: import_zod4.z.number().optional(),
  limit: import_zod4.z.number().optional()
});

// server/routes/risks/router.ts
var router3 = import_express3.default.Router();
router3.get(
  "/",
  validate(riskFilterSchema),
  riskController.getAllRisks.bind(riskController)
);
router3.get(
  "/:id",
  validateId,
  riskController.getRiskById.bind(riskController)
);
router3.post(
  "/",
  validate(createRiskSchema),
  riskController.createRisk.bind(riskController)
);
router3.put(
  "/:id",
  validateId,
  validate(updateRiskSchema),
  riskController.updateRisk.bind(riskController)
);
router3.delete(
  "/:id",
  validateId,
  riskController.deleteRisk.bind(riskController)
);
router3.get(
  "/:id/controls",
  validateId,
  riskController.getControlsForRisk.bind(riskController)
);
router3.get(
  "/:id/assets",
  validateId,
  riskController.getAssetsForRisk.bind(riskController)
);
router3.get(
  "/:id/calculate",
  validateId,
  riskController.calculateRiskValues.bind(riskController)
);
router3.post(
  "/calculate/monte-carlo",
  riskController.runAdHocMonteCarloCalculation.bind(riskController)
);
router3.post(
  "/:id/secondary-loss",
  validateId,
  riskController.updateSecondaryLoss.bind(riskController)
);
router3.post(
  "/:id/contact-frequency",
  validateId,
  riskController.updateContactFrequency.bind(riskController)
);
router3.post(
  "/:id/probability-of-action",
  validateId,
  riskController.updateProbabilityOfAction.bind(riskController)
);
router3.post(
  "/:id/threat-capability",
  validateId,
  riskController.updateThreatCapability.bind(riskController)
);
router3.post(
  "/:id/resistance-strength",
  validateId,
  riskController.updateResistanceStrength.bind(riskController)
);
var router_default = router3;

// server/routes/risks/index.ts
var risks_default = router_default;

// server/routes/controls/router.ts
var import_express4 = __toESM(require("express"), 1);

// server/routes/controls/controller.ts
var ControlController = class {
  /**
   * Get all controls with optional filtering
   */
  async getAllControls(req, res) {
    try {
      const filters = req.query;
      const controls2 = await controlServiceInstance.getAllControls(filters);
      return sendSuccess(res, controls2);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Get a single control by ID
   */
  async getControlById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const control = await controlServiceInstance.getControl(id);
      if (!control) {
        return sendError(res, { message: "Control not found" }, 404);
      }
      return sendSuccess(res, control);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create a new control
   */
  async createControl(req, res) {
    try {
      const controlData = req.body;
      const newControl = await controlServiceInstance.createControl(controlData);
      return sendSuccess(res, newControl, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Update an existing control
   */
  async updateControl(req, res) {
    try {
      const id = parseInt(req.params.id);
      console.log("Controller received update request for control ID:", id);
      console.log("Raw request body BEFORE typing:", JSON.stringify(req.body, null, 2));
      const controlData = req.body;
      console.log("Update data AFTER typing:", JSON.stringify(controlData, null, 2));
      if (typeof controlData.controlEffectiveness === "number" || typeof controlData.e_avoid === "number" || typeof controlData.e_deter === "number" || typeof controlData.e_detect === "number" || typeof controlData.e_resist === "number" || controlData.implementationCost !== void 0) {
        try {
          const control = await controlServiceInstance.getControl(id);
          if (!control) {
            return sendError(res, { message: "Control not found" }, 404);
          }
          const updateData = {};
          if (typeof controlData.controlEffectiveness === "number") {
            updateData.controlEffectiveness = controlData.controlEffectiveness;
          }
          if (typeof controlData.e_avoid === "number") {
            updateData.e_avoid = controlData.e_avoid;
          }
          if (typeof controlData.e_deter === "number") {
            updateData.e_deter = controlData.e_deter;
          }
          if (typeof controlData.e_detect === "number") {
            updateData.e_detect = controlData.e_detect;
          }
          if (typeof controlData.e_resist === "number") {
            updateData.e_resist = controlData.e_resist;
          }
          if (controlData.implementationCost !== void 0) {
            updateData.implementationCost = controlData.implementationCost;
          }
          if (controlData.implementationStatus !== void 0) {
            updateData.implementationStatus = controlData.implementationStatus;
          }
          console.log("Processing cost fields for status:", controlData.implementationStatus);
          if (controlData.implementationStatus === "fully_implemented") {
            if (controlData.isPerAgentPricing) {
              updateData.costPerAgent = controlData.costPerAgent || 0;
              updateData.isPerAgentPricing = true;
              updateData.implementationCost = 0;
              updateData.deployedAgentCount = 0;
              console.log("Fully implemented - agent-based cost:", controlData.costPerAgent);
            } else {
              updateData.implementationCost = controlData.implementationCost || 0;
              updateData.isPerAgentPricing = false;
              updateData.costPerAgent = 0;
              updateData.deployedAgentCount = 0;
              console.log("Fully implemented - total cost:", controlData.implementationCost);
            }
          } else if (controlData.implementationStatus === "in_progress") {
            updateData.deployedAgentCount = controlData.deployedAgentCount || 0;
            updateData.costPerAgent = controlData.costPerAgent || 0;
            updateData.isPerAgentPricing = true;
            updateData.implementationCost = 0;
            console.log("In progress - deployed agents:", controlData.deployedAgentCount, "cost per agent:", controlData.costPerAgent);
          } else {
            updateData.implementationCost = 0;
            updateData.costPerAgent = 0;
            updateData.deployedAgentCount = 0;
            updateData.isPerAgentPricing = false;
            console.log("Other status - clearing all cost fields");
          }
          console.log("Using filtered update data:", updateData);
          const updatedControl = await controlServiceInstance.updateControl(id, updateData);
          if (!updatedControl) {
            return sendError(res, { message: "Control update failed" }, 500);
          }
          return sendSuccess(res, updatedControl);
        } catch (error) {
          console.error("Error updating control effectiveness:", error);
          return sendError(res, error);
        }
      } else {
        const updatedControl = await controlServiceInstance.updateControl(id, controlData);
        if (!updatedControl) {
          return sendError(res, { message: "Control not found" }, 404);
        }
        return sendSuccess(res, updatedControl);
      }
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Delete a control
   */
  async deleteControl(req, res) {
    try {
      const id = parseInt(req.params.id);
      const success = await controlServiceInstance.deleteControl(id);
      if (!success) {
        return sendError(res, { message: "Error deleting control" }, 500);
      }
      return sendSuccess(res, { message: "Control deleted successfully" });
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Get risks associated with a control
   */
  async getRisksForControl(req, res) {
    try {
      const id = parseInt(req.params.id);
      const risks2 = await controlServiceInstance.getRisksForControl(id);
      return sendSuccess(res, risks2);
    } catch (error) {
      return sendError(res, error);
    }
  }
};
var controlController = new ControlController();

// server/routes/controls/dto.ts
var import_zod5 = require("zod");
var controlTypeEnum2 = import_zod5.z.enum(["preventive", "detective", "corrective"]);
var controlCategoryEnum2 = import_zod5.z.enum(["technical", "administrative", "physical"]);
var implementationStatusEnum2 = import_zod5.z.enum(["not_implemented", "in_progress", "fully_implemented", "planned"]);
var controlBaseSchema = import_zod5.z.object({
  controlId: import_zod5.z.string(),
  name: import_zod5.z.string().min(1),
  description: import_zod5.z.string().default(""),
  controlType: controlTypeEnum2,
  controlCategory: controlCategoryEnum2,
  implementationStatus: implementationStatusEnum2,
  implementationCost: import_zod5.z.number().optional(),
  implementationTime: import_zod5.z.number().optional(),
  maintainCost: import_zod5.z.number().optional(),
  effectivenessRating: import_zod5.z.number().min(0).max(100).optional(),
  // FAIR-U Control Effectiveness
  controlEffectiveness: import_zod5.z.number().min(0).max(10).optional(),
  // FAIR-CAM effectiveness parameters
  e_avoid: import_zod5.z.number().min(0).max(1).optional(),
  e_deter: import_zod5.z.number().min(0).max(1).optional(),
  e_detect: import_zod5.z.number().min(0).max(1).optional(),
  e_resist: import_zod5.z.number().min(0).max(1).optional(),
  // Cost calculation fields
  costPerAgent: import_zod5.z.number().min(0).optional(),
  isPerAgentPricing: import_zod5.z.boolean().optional(),
  deployedAgentCount: import_zod5.z.number().min(0).optional(),
  vendor: import_zod5.z.string().optional(),
  technicalDetails: import_zod5.z.string().optional(),
  implementationNotes: import_zod5.z.string().optional(),
  attachments: import_zod5.z.array(import_zod5.z.string()).default([]),
  frameworkReferences: import_zod5.z.array(import_zod5.z.string()).default([]),
  legalEntityId: import_zod5.z.string().nullable().optional(),
  riskId: import_zod5.z.number().nullable().optional(),
  assetId: import_zod5.z.string().nullable().optional()
});
var createControlSchema = controlBaseSchema;
var updateControlSchema = controlBaseSchema.partial();
var controlFilterSchema = import_zod5.z.object({
  type: controlTypeEnum2.optional(),
  category: controlCategoryEnum2.optional(),
  status: implementationStatusEnum2.optional(),
  riskId: import_zod5.z.number().optional(),
  assetId: import_zod5.z.string().optional(),
  entityId: import_zod5.z.string().optional(),
  search: import_zod5.z.string().optional(),
  sortBy: import_zod5.z.enum(["name", "controlId", "controlType", "implementationStatus", "effectivenessRating"]).optional(),
  sortOrder: import_zod5.z.enum(["asc", "desc"]).optional(),
  page: import_zod5.z.number().optional(),
  limit: import_zod5.z.number().optional()
});

// server/routes/controls/router.ts
var router4 = import_express4.default.Router();
router4.get(
  "/",
  validate(controlFilterSchema),
  controlController.getAllControls.bind(controlController)
);
router4.get(
  "/:id",
  validateId,
  controlController.getControlById.bind(controlController)
);
router4.post(
  "/",
  validate(createControlSchema),
  controlController.createControl.bind(controlController)
);
router4.put(
  "/:id",
  validateId,
  validate(updateControlSchema),
  controlController.updateControl.bind(controlController)
);
router4.delete(
  "/:id",
  validateId,
  controlController.deleteControl.bind(controlController)
);
router4.get(
  "/:id/risks",
  validateId,
  controlController.getRisksForControl.bind(controlController)
);
var router_default2 = router4;

// server/routes/controls/index.ts
var controls_default = router_default2;

// server/routes/control-library/routes.ts
var import_express5 = __toESM(require("express"), 1);

// server/routes/control-library/controller.ts
var ControlLibraryController = class {
  /**
   * Get all control library templates
   */
  async getAllTemplates(req, res) {
    try {
      const templates = await controlServiceInstance.getAllControlLibraryItems();
      return sendSuccess(res, templates);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Get a single control library template by ID
   */
  async getTemplateById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const template = await controlServiceInstance.getControlLibraryItem(id);
      if (!template) {
        return sendError(res, { message: "Control template not found" }, 404);
      }
      return sendSuccess(res, template);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create a new control template
   */
  async createTemplate(req, res) {
    try {
      const templateData = req.body;
      const newTemplate = await controlServiceInstance.createControlLibraryItem(templateData);
      return sendSuccess(res, newTemplate, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Update an existing control template
   */
  async updateTemplate(req, res) {
    try {
      const id = parseInt(req.params.id);
      const templateData = req.body;
      const updatedTemplate = await controlServiceInstance.updateControlLibraryItem(id, templateData);
      if (!updatedTemplate) {
        return sendError(res, { message: "Control template not found" }, 404);
      }
      return sendSuccess(res, updatedTemplate);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Delete a control template
   */
  async deleteTemplate(req, res) {
    try {
      const id = parseInt(req.params.id);
      const success = await controlServiceInstance.deleteControlLibraryItem(id);
      if (!success) {
        return sendError(res, { message: "Error deleting control template" }, 500);
      }
      return sendSuccess(res, { message: "Control template deleted successfully" });
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create a control instance from a template and associate it with a risk
   */
  async createInstanceFromTemplate(req, res) {
    try {
      const templateId = parseInt(req.params.id);
      const { riskId } = req.body;
      const template = await controlServiceInstance.getControlLibraryItem(templateId);
      if (!template) {
        return sendError(res, { message: "Control template not found" }, 404);
      }
      const controlData = {
        controlId: `${template.controlId}-${Date.now().toString().substring(9)}`,
        // Create unique ID
        name: template.name,
        description: template.description,
        controlType: template.controlType,
        controlCategory: template.controlCategory,
        implementationStatus: "not_implemented",
        // Default to not implemented
        controlEffectiveness: template.controlEffectiveness,
        implementationCost: template.implementationCost,
        costPerAgent: template.costPerAgent,
        isPerAgentPricing: template.isPerAgentPricing,
        notes: template.notes,
        libraryItemId: templateId,
        // Reference to the source template
        itemType: "instance",
        riskId: riskId || null,
        associatedRisks: riskId ? [riskId.toString()] : []
      };
      const newControl = await controlServiceInstance.createControl(controlData);
      if (riskId) {
        await controlServiceInstance.addControlToRisk(riskId, newControl.id);
      }
      return sendSuccess(res, newControl, 201);
    } catch (error) {
      return sendError(res, error);
    }
  }
};
var controlLibraryController = new ControlLibraryController();

// server/routes/control-library/routes.ts
var router5 = import_express5.default.Router();
router5.get("/", controlLibraryController.getAllTemplates);
router5.get("/:id", controlLibraryController.getTemplateById);
router5.post("/", controlLibraryController.createTemplate);
router5.put("/:id", controlLibraryController.updateTemplate);
router5.delete("/:id", controlLibraryController.deleteTemplate);
router5.post("/:id/create-instance", controlLibraryController.createInstanceFromTemplate);
var routes_default = router5;

// server/routes/risk-library/routes.ts
var import_express6 = __toESM(require("express"), 1);

// server/routes/risk-library/controller.ts
var RiskLibraryController = class {
  /**
   * Get all risk library templates
   */
  async getAllRiskLibraryItems(req, res) {
    try {
      const items = await riskServiceInstance.getAllRiskLibraryItems();
      return sendSuccess(res, items);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Get a single risk library template by ID
   */
  async getRiskLibraryItemById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const item = await riskServiceInstance.getRiskLibraryItem(id);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create a new risk library template
   */
  async createRiskLibraryItem(req, res) {
    try {
      const data = req.body;
      const item = await riskServiceInstance.createRiskLibraryItem(data);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Update an existing risk library template
   */
  async updateRiskLibraryItem(req, res) {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const item = await riskServiceInstance.updateRiskLibraryItem(id, data);
      return sendSuccess(res, item);
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Delete a risk library template
   */
  async deleteRiskLibraryItem(req, res) {
    try {
      const id = parseInt(req.params.id);
      await riskServiceInstance.deleteRiskLibraryItem(id);
      return sendSuccess(res, { message: "Risk library item deleted successfully" });
    } catch (error) {
      return sendError(res, error);
    }
  }
  /**
   * Create risk instance from template
   */
  async createRiskFromTemplate(req, res) {
    try {
      const templateId = parseInt(req.params.id);
      const { assetId } = req.body;
      if (!templateId || !assetId) {
        return sendError(res, new Error("Template ID and Asset ID are required"));
      }
      const risk = await riskServiceInstance.createRiskFromTemplate(templateId, assetId);
      return sendSuccess(res, risk);
    } catch (error) {
      return sendError(res, error);
    }
  }
};
var riskLibraryController = new RiskLibraryController();

// server/routes/risk-library/routes.ts
var riskLibraryRouter = import_express6.default.Router();
riskLibraryRouter.get("/", riskLibraryController.getAllRiskLibraryItems.bind(riskLibraryController));
riskLibraryRouter.get("/:id", riskLibraryController.getRiskLibraryItemById.bind(riskLibraryController));
riskLibraryRouter.post("/", riskLibraryController.createRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.put("/:id", riskLibraryController.updateRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.delete("/:id", riskLibraryController.deleteRiskLibraryItem.bind(riskLibraryController));
riskLibraryRouter.post("/from-template/:id", riskLibraryController.createRiskFromTemplate.bind(riskLibraryController));
var routes_default2 = riskLibraryRouter;

// server/routes/responses/router.ts
var import_express7 = __toESM(require("express"), 1);

// server/routes/responses/controller.ts
init_db();
init_schema();
var import_drizzle_orm4 = require("drizzle-orm");
var ResponseController = class {
  /**
   * Get all responses with optional filtering
   */
  async getAllResponses(req, res) {
    try {
      const responses = await db2.select().from(riskResponses);
      let filteredResponses = [...responses];
      if (req.query.responseType) {
        const responseType = req.query.responseType;
        filteredResponses = filteredResponses.filter(
          (r) => r.responseType === responseType
        );
      }
      if (req.query.riskId) {
        const riskId = req.query.riskId;
        filteredResponses = filteredResponses.filter(
          (r) => r.riskId === riskId
        );
      }
      return sendSuccess(res, filteredResponses);
    } catch (error) {
      console.error("Error getting responses:", error);
      return sendError(res, error);
    }
  }
  /**
   * Get a single response by ID
   */
  async getResponseById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [response] = await db2.select().from(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.id, id));
      if (!response) {
        return sendError(res, { message: "Response not found" }, 404);
      }
      return sendSuccess(res, response);
    } catch (error) {
      console.error("Error getting response by ID:", error);
      return sendError(res, error);
    }
  }
  /**
   * Get the response associated with a risk
   */
  async getResponseByRiskId(req, res) {
    try {
      const riskId = req.params.riskId;
      const responses = await db2.select().from(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.riskId, riskId));
      if (!responses || responses.length === 0) {
        return sendError(res, { message: "No response found for this risk" }, 404);
      }
      return sendSuccess(res, responses[0]);
    } catch (error) {
      console.error("Error getting response by risk ID:", error);
      return sendError(res, error);
    }
  }
  /**
   * Create a new response
   */
  async createResponse(req, res) {
    try {
      const responseData = req.body;
      const existingResponses = await db2.select().from(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.riskId, responseData.riskId));
      if (existingResponses && existingResponses.length > 0) {
        return sendError(res, { message: "A response already exists for this risk" }, 400);
      }
      const [newResponse] = await db2.insert(riskResponses).values({
        riskId: responseData.riskId,
        responseType: responseData.responseType,
        justification: responseData.justification || "",
        assignedControls: responseData.assignedControls || [],
        transferMethod: responseData.transferMethod || "",
        avoidanceStrategy: responseData.avoidanceStrategy || "",
        acceptanceReason: responseData.acceptanceReason || "",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }).returning();
      await db2.insert(activityLogs).values({
        activity: "Response created",
        user: "System",
        entity: `Response ${newResponse.id}`,
        entityType: "response",
        entityId: newResponse.id.toString(),
        createdAt: /* @__PURE__ */ new Date()
      });
      return sendSuccess(res, newResponse, 201);
    } catch (error) {
      console.error("Error creating response:", error);
      return sendError(res, error);
    }
  }
  /**
   * Update an existing response
   */
  async updateResponse(req, res) {
    try {
      const id = parseInt(req.params.id);
      const responseData = req.body;
      const [existingResponse] = await db2.select().from(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.id, id));
      if (!existingResponse) {
        return sendError(res, { message: "Response not found" }, 404);
      }
      const [updatedResponse] = await db2.update(riskResponses).set({
        ...responseData,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm4.eq)(riskResponses.id, id)).returning();
      await db2.insert(activityLogs).values({
        activity: "Response updated",
        user: "System",
        entity: `Response ${id}`,
        entityType: "response",
        entityId: id.toString(),
        createdAt: /* @__PURE__ */ new Date()
      });
      return sendSuccess(res, updatedResponse);
    } catch (error) {
      console.error("Error updating response:", error);
      return sendError(res, error);
    }
  }
  /**
   * Delete a response
   */
  async deleteResponse(req, res) {
    try {
      const id = parseInt(req.params.id);
      const [existingResponse] = await db2.select().from(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.id, id));
      if (!existingResponse) {
        return sendError(res, { message: "Response not found" }, 404);
      }
      await db2.delete(riskResponses).where((0, import_drizzle_orm4.eq)(riskResponses.id, id));
      await db2.insert(activityLogs).values({
        activity: "Response deleted",
        user: "System",
        entity: `Response ${id}`,
        entityType: "response",
        entityId: id.toString(),
        createdAt: /* @__PURE__ */ new Date()
      });
      return sendSuccess(res, { message: "Response deleted successfully" });
    } catch (error) {
      console.error("Error deleting response:", error);
      return sendError(res, error);
    }
  }
};
var responseController = new ResponseController();

// server/routes/responses/dto.ts
var import_zod6 = require("zod");
var responseTypeEnum = import_zod6.z.enum(["accept", "avoid", "transfer", "mitigate"]);
var responseBaseSchema = import_zod6.z.object({
  riskId: import_zod6.z.string(),
  responseType: responseTypeEnum,
  justification: import_zod6.z.string().default(""),
  assignedControls: import_zod6.z.array(import_zod6.z.string()).default([]),
  transferMethod: import_zod6.z.string().default(""),
  avoidanceStrategy: import_zod6.z.string().default(""),
  acceptanceReason: import_zod6.z.string().default("")
});
var createResponseSchema = responseBaseSchema;
var updateResponseSchema = responseBaseSchema.partial();
var responseFilterSchema = import_zod6.z.object({
  type: responseTypeEnum.optional(),
  riskId: import_zod6.z.string().optional(),
  search: import_zod6.z.string().optional(),
  page: import_zod6.z.number().optional(),
  limit: import_zod6.z.number().optional()
});

// server/routes/responses/router.ts
var router6 = import_express7.default.Router();
router6.get(
  "/",
  validate(responseFilterSchema),
  responseController.getAllResponses.bind(responseController)
);
router6.get(
  "/:id",
  validateId,
  responseController.getResponseById.bind(responseController)
);
router6.get(
  "/risk/:riskId",
  responseController.getResponseByRiskId.bind(responseController)
);
router6.post(
  "/",
  validate(createResponseSchema),
  responseController.createResponse.bind(responseController)
);
router6.put(
  "/:id",
  validateId,
  validate(updateResponseSchema),
  responseController.updateResponse.bind(responseController)
);
router6.delete(
  "/:id",
  validateId,
  responseController.deleteResponse.bind(responseController)
);
var router_default3 = router6;

// server/routes/responses/index.ts
var responses_default = router_default3;

// server/routes/cost-modules/routes.ts
var import_express8 = __toESM(require("express"), 1);

// server/routes/cost-modules/controller.ts
init_db();
var import_drizzle_orm5 = require("drizzle-orm");
var sendSuccess2 = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};
var sendError2 = (res, error, statusCode = 500) => {
  const message = error.message || "An unexpected error occurred";
  if (statusCode >= 500) {
    console.error(`Server error: ${message}`, error);
  }
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: error.code,
      details: error.details || void 0
    }
  });
};
var CostModulesController = class {
  /**
   * Get all cost modules
   */
  async getAllCostModules(req, res) {
    try {
      const results = await db2.execute(import_drizzle_orm5.sql`
        SELECT id, name, cis_control, cost_factor, cost_type, description 
        FROM cost_modules 
        ORDER BY name
        LIMIT 100
      `);
      console.log(`Retrieved ${results.rows.length} cost modules`);
      return sendSuccess2(res, results.rows);
    } catch (error) {
      console.error("Error getting cost modules:", error);
      return sendError2(res, error);
    }
  }
  /**
   * Get cost module by ID
   */
  async getCostModuleById(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError2(res, { message: "Invalid ID format" }, 400);
      }
      const result = await db2.execute(import_drizzle_orm5.sql`
        SELECT * FROM cost_modules WHERE id = ${id}
      `);
      if (!result.rows.length) {
        return sendError2(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      return sendSuccess2(res, result.rows[0]);
    } catch (error) {
      console.error("Error getting cost module:", error);
      return sendError2(res, error);
    }
  }
  /**
   * Create new cost module
   */
  async createCostModule(req, res) {
    try {
      const { name, cisControl, costFactor, costType, description = "" } = req.body;
      if (!name || !cisControl || !costFactor || !costType) {
        return sendError2(res, { message: "Missing required fields" }, 400);
      }
      const validCostTypes = ["fixed", "per_event", "per_hour", "percentage"];
      if (!validCostTypes.includes(costType)) {
        return sendError2(res, { message: "Invalid cost type. Must be one of: fixed, per_event, per_hour, percentage" }, 400);
      }
      try {
        const cisControlArray = Array.isArray(cisControl) ? cisControl : typeof cisControl === "string" ? JSON.parse(cisControl) : [cisControl];
        const cisControlValue = import_drizzle_orm5.sql`ARRAY[${import_drizzle_orm5.sql.join(cisControlArray, import_drizzle_orm5.sql`,`)}]::text[]`;
        const result = await db2.execute(import_drizzle_orm5.sql`
          INSERT INTO cost_modules (name, cis_control, cost_factor, cost_type, description)
          VALUES (${name}, ${cisControlValue}, ${costFactor}, ${costType}, ${description})
          RETURNING *
        `);
        return sendSuccess2(res, result.rows[0], 201);
      } catch (e) {
        console.error("Error processing cisControl:", e);
        return sendError2(res, { message: "Invalid cisControl format" }, 400);
      }
    } catch (error) {
      console.error("Error creating cost module:", error);
      return sendError2(res, error);
    }
  }
  /**
   * Update existing cost module
   */
  async updateCostModule(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError2(res, { message: "Invalid ID format" }, 400);
      }
      const existingResult = await db2.execute(import_drizzle_orm5.sql`
        SELECT * FROM cost_modules WHERE id = ${id}
      `);
      if (!existingResult.rows.length) {
        return sendError2(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      const existing = existingResult.rows[0];
      const { name, cisControl, costFactor, costType, description } = req.body;
      let cisControlValue = existing.cis_control;
      if (cisControl !== void 0) {
        try {
          const cisControlArray = Array.isArray(cisControl) ? cisControl : typeof cisControl === "string" ? JSON.parse(cisControl) : [cisControl];
          cisControlValue = import_drizzle_orm5.sql`ARRAY[${import_drizzle_orm5.sql.join(cisControlArray, import_drizzle_orm5.sql`,`)}]::text[]`;
        } catch (e) {
          console.error("Error processing cisControl:", e);
          return sendError2(res, { message: "Invalid cisControl format" }, 400);
        }
      }
      const updateResult = await db2.execute(import_drizzle_orm5.sql`
        UPDATE cost_modules
        SET 
          name = ${name !== void 0 ? name : existing.name},
          ${cisControl !== void 0 ? import_drizzle_orm5.sql`cis_control = ${cisControlValue},` : import_drizzle_orm5.sql``}
          cost_factor = ${costFactor !== void 0 ? costFactor : existing.cost_factor},
          cost_type = ${costType !== void 0 ? costType : existing.cost_type},
          description = ${description !== void 0 ? description : existing.description}
        WHERE id = ${id}
        RETURNING *
      `);
      return sendSuccess2(res, updateResult.rows[0]);
    } catch (error) {
      console.error("Error updating cost module:", error);
      return sendError2(res, error);
    }
  }
  /**
   * Delete cost module
   */
  async deleteCostModule(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return sendError2(res, { message: "Invalid ID format" }, 400);
      }
      const existingResult = await db2.execute(import_drizzle_orm5.sql`
        SELECT id FROM cost_modules WHERE id = ${id}
      `);
      if (!existingResult.rows.length) {
        return sendError2(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      await db2.execute(import_drizzle_orm5.sql`
        DELETE FROM cost_modules WHERE id = ${id}
      `);
      return sendSuccess2(res, { message: "Cost module deleted successfully" });
    } catch (error) {
      console.error("Error deleting cost module:", error);
      return sendError2(res, error);
    }
  }
};
var controller_default = new CostModulesController();

// server/routes/cost-modules/routes.ts
var router7 = import_express8.default.Router();
router7.get("/", controller_default.getAllCostModules.bind(controller_default));
router7.get("/:id", controller_default.getCostModuleById.bind(controller_default));
router7.post("/", controller_default.createCostModule.bind(controller_default));
router7.put("/:id", controller_default.updateCostModule.bind(controller_default));
router7.delete("/:id", controller_default.deleteCostModule.bind(controller_default));
var routes_default3 = router7;

// server/routes/risk-costs/routes.ts
var import_express9 = __toESM(require("express"), 1);

// server/routes/common/responses.ts
var sendSuccess3 = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};
var sendError3 = (res, error, statusCode = 500) => {
  if (!statusCode || statusCode === 500) {
    if (error.name === "ValidationError" || error.code === "VALIDATION_ERROR") {
      statusCode = 400;
    } else if (error.name === "NotFoundError" || error.code === "NOT_FOUND") {
      statusCode = 404;
    } else if (error.name === "UnauthorizedError" || error.code === "UNAUTHORIZED") {
      statusCode = 401;
    } else if (error.name === "ForbiddenError" || error.code === "FORBIDDEN") {
      statusCode = 403;
    }
  }
  const message = error.message || "An unexpected error occurred";
  if (statusCode >= 500) {
    console.error(`Server error: ${message}`, error);
  }
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: error.code,
      details: error.details || void 0
    }
  });
};

// server/routes/risk-costs/controller.ts
var import_drizzle_orm6 = require("drizzle-orm");
init_db();
var RiskCostsController = class {
  /**
   * Get risk cost assignments for a specific risk
   */
  async getRiskCosts(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError3(res, { message: "Invalid risk ID format" }, 400);
      }
      console.log(`Retrieving risk costs for risk ID: ${riskId}`);
      const result = await db2.execute(import_drizzle_orm6.sql`
        SELECT rc.*, cm.name as module_name, cm.cost_type, cm.cost_factor, cm.cis_control
        FROM risk_costs rc
        JOIN cost_modules cm ON rc.cost_module_id = cm.id
        WHERE rc.risk_id = ${riskId}
      `);
      console.log(`Found ${result.rows.length} risk cost assignments for risk ID ${riskId}`);
      return sendSuccess3(res, result.rows);
    } catch (error) {
      console.error("Error fetching risk costs:", error);
      return sendError3(res, error);
    }
  }
  /**
   * Calculate total cost impact for a specific risk based on assigned cost modules
   */
  async calculateCostImpact(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError3(res, { message: "Invalid risk ID format" }, 400);
      }
      const riskResult = await db2.execute(import_drizzle_orm6.sql`
        SELECT inherent_risk, residual_risk FROM risks WHERE id = ${riskId}
      `);
      if (!riskResult.rows.length) {
        return sendError3(res, { message: "Risk not found" }, 404);
      }
      const risk = riskResult.rows[0];
      const riskMagnitude = parseFloat(risk.inherent_risk) || 0;
      const assignmentsResult = await db2.execute(import_drizzle_orm6.sql`
        SELECT rc.*, cm.name as module_name, cm.cost_factor, cm.cost_type, cm.description, cm.cis_control
        FROM risk_costs rc
        JOIN cost_modules cm ON rc.cost_module_id = cm.id
        WHERE rc.risk_id = ${riskId}
      `);
      if (!assignmentsResult.rows.length) {
        return sendSuccess3(res, {
          totalCost: 0,
          weightedCosts: {},
          riskMagnitude
        });
      }
      let totalCost = 0;
      const weightedCosts = {};
      for (const assignment of assignmentsResult.rows) {
        let cost = 0;
        const weight = assignment.weight || 1;
        const costModuleId = assignment.cost_module_id;
        switch (assignment.cost_type) {
          case "fixed":
            cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
            break;
          case "per_event":
            cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
            break;
          case "per_hour":
            cost = parseFloat(assignment.cost_factor) * (assignment.hours || 1);
            break;
          case "percentage":
            cost = riskMagnitude * parseFloat(assignment.cost_factor);
            if (assignment.custom_factor) {
              cost = riskMagnitude * parseFloat(assignment.custom_factor);
            }
            break;
        }
        const weightedCost = cost * weight;
        totalCost += weightedCost;
        weightedCosts[costModuleId] = {
          id: costModuleId,
          name: assignment.module_name,
          costType: assignment.cost_type,
          baseCost: cost,
          weight,
          cost: weightedCost
        };
      }
      return sendSuccess3(res, {
        totalCost,
        weightedCosts,
        riskMagnitude
      });
    } catch (error) {
      console.error("Error calculating cost impact:", error);
      return sendError3(res, error);
    }
  }
  /**
   * Save risk cost assignments (replace existing)
   */
  async saveRiskCosts(req, res) {
    try {
      const riskId = parseInt(req.params.id);
      if (isNaN(riskId)) {
        return sendError3(res, { message: "Invalid risk ID format" }, 400);
      }
      const assignments = req.body;
      if (!Array.isArray(assignments)) {
        return sendError3(res, { message: "Request body must be an array of assignments" }, 400);
      }
      console.log("Saving risk costs for risk ID:", riskId, "Assignments:", JSON.stringify(assignments));
      try {
        await db2.execute(import_drizzle_orm6.sql`BEGIN`);
        await db2.execute(import_drizzle_orm6.sql`
          DELETE FROM risk_costs WHERE risk_id = ${riskId}
        `);
        for (const assignment of assignments) {
          const { costModuleId, weight } = assignment;
          if (!costModuleId || typeof costModuleId !== "number") {
            await db2.execute(import_drizzle_orm6.sql`ROLLBACK`);
            return sendError3(res, { message: "Each assignment must have a valid costModuleId" }, 400);
          }
          const effectiveWeight = weight || 1;
          console.log(`Inserting cost module ${costModuleId} with weight ${effectiveWeight}`);
          await db2.execute(import_drizzle_orm6.sql`
            INSERT INTO risk_costs (risk_id, cost_module_id, weight)
            VALUES (${riskId}, ${costModuleId}, ${effectiveWeight})
          `);
        }
        await db2.execute(import_drizzle_orm6.sql`COMMIT`);
        console.log("Risk cost assignments saved successfully");
        return sendSuccess3(res, { message: "Risk cost assignments saved successfully" });
      } catch (error) {
        await db2.execute(import_drizzle_orm6.sql`ROLLBACK`);
        throw error;
      }
    } catch (error) {
      console.error("Error saving risk costs:", error);
      return sendError3(res, error);
    }
  }
  /**
   * Calculate materiality-weighted costs for all risks (used in dashboard and cost mapping page)
   */
  async calculateAllRiskCosts(req, res) {
    try {
      const risksResult = await db2.execute(import_drizzle_orm6.sql`
        SELECT id, risk_id, name, inherent_risk, residual_risk FROM risks
      `);
      if (!risksResult.rows.length) {
        return sendSuccess3(res, []);
      }
      const results = [];
      for (const risk of risksResult.rows) {
        const assignmentsResult = await db2.execute(import_drizzle_orm6.sql`
          SELECT rc.*, cm.name as module_name, cm.cost_factor, cm.cost_type, cm.description, cm.cis_control
          FROM risk_costs rc
          JOIN cost_modules cm ON rc.cost_module_id = cm.id
          WHERE rc.risk_id = ${risk.id}
        `);
        const riskMagnitude = parseFloat(risk.inherent_risk) || 0;
        let totalCost = 0;
        if (assignmentsResult.rows.length > 0) {
          for (const assignment of assignmentsResult.rows) {
            let cost = 0;
            const weight = assignment.weight || 1;
            switch (assignment.cost_type) {
              case "fixed":
                cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
                break;
              case "per_event":
                cost = parseFloat(assignment.cost_factor) * (assignment.quantity || 1);
                break;
              case "per_hour":
                cost = parseFloat(assignment.cost_factor) * (assignment.hours || 1);
                break;
              case "percentage":
                cost = riskMagnitude * parseFloat(assignment.cost_factor);
                if (assignment.custom_factor) {
                  cost = riskMagnitude * parseFloat(assignment.custom_factor);
                }
                break;
            }
            totalCost += cost * weight;
          }
        }
        results.push({
          id: risk.id,
          riskId: risk.risk_id,
          name: risk.name,
          inherentRisk: riskMagnitude,
          costImpact: totalCost,
          assignmentCount: assignmentsResult.rows.length
        });
      }
      return sendSuccess3(res, results);
    } catch (error) {
      console.error("Error calculating all risk costs:", error);
      return sendError3(res, error);
    }
  }
};
var controller_default2 = new RiskCostsController();

// server/routes/risk-costs/routes.ts
var router8 = import_express9.default.Router();
router8.get(
  "/:id",
  controller_default2.getRiskCosts.bind(controller_default2)
);
router8.get(
  "/:id/calculate",
  controller_default2.calculateCostImpact.bind(controller_default2)
);
router8.post(
  "/:id",
  controller_default2.saveRiskCosts.bind(controller_default2)
);
router8.get(
  "/calculate/all",
  controller_default2.calculateAllRiskCosts.bind(controller_default2)
);
var routes_default4 = router8;

// server/routes/dashboard/index.ts
var import_express10 = __toESM(require("express"), 1);
var router9 = import_express10.default.Router();
router9.get("/summary", async (req, res) => {
  try {
    const risks2 = await storage.getAllRisks();
    const totalRisks = risks2.length;
    const criticalRisks = risks2.filter((r) => r.severity === "critical").length;
    const highRisks = risks2.filter((r) => r.severity === "high").length;
    const mediumRisks = risks2.filter((r) => r.severity === "medium").length;
    const lowRisks = risks2.filter((r) => r.severity === "low").length;
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;
    risks2.forEach((risk) => {
      const inherentRiskValue = parseFloat(risk.inherentRisk) || 0;
      const residualRiskValue = parseFloat(risk.residualRisk) || 0;
      totalInherentRisk += inherentRiskValue;
      totalResidualRisk += residualRiskValue;
    });
    const controls2 = await storage.getAllControls();
    const implementedControls = controls2.filter((c) => c.implementationStatus === "fully_implemented").length;
    const inProgressControls = controls2.filter((c) => c.implementationStatus === "in_progress").length;
    const plannedControls = controls2.filter((c) => c.implementationStatus === "planned").length;
    const notImplementedControls = controls2.filter((c) => c.implementationStatus === "not_implemented").length;
    const assets2 = await storage.getAllAssets();
    const allLogs = await storage.getAllActivityLogs();
    const recentLogs = allLogs.slice(0, 10);
    return sendSuccess(res, {
      riskSummary: {
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        totalInherentRisk,
        totalResidualRisk,
        riskReduction: totalInherentRisk > 0 ? (1 - totalResidualRisk / totalInherentRisk) * 100 : 0
      },
      controlSummary: {
        totalControls: controls2.length,
        implementedControls,
        inProgressControls,
        plannedControls,
        notImplementedControls,
        implementationRate: controls2.length > 0 ? implementedControls / controls2.length * 100 : 0
      },
      assetSummary: {
        totalAssets: assets2.length,
        byType: {
          data: assets2.filter((a) => a.type === "data").length,
          application: assets2.filter((a) => a.type === "application").length,
          system: assets2.filter((a) => a.type === "system").length,
          device: assets2.filter((a) => a.type === "device").length,
          network: assets2.filter((a) => a.type === "network").length,
          facility: assets2.filter((a) => a.type === "facility").length,
          personnel: assets2.filter((a) => a.type === "personnel").length,
          other: assets2.filter((a) => a.type === "other").length
        }
      },
      recentActivity: recentLogs || []
    });
  } catch (error) {
    return sendError(res, error);
  }
});
var dashboard_default = router9;

// server/routes/logs/index.ts
var import_express11 = require("express");
init_auth();
var router10 = (0, import_express11.Router)();
router10.get("/activity-logs", isAuthenticated, async (req, res) => {
  try {
    const logs = await storage.getActivityLogs();
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch activity logs"
    });
  }
});
var logs_default = router10;

// server/routes/enterprise-architecture/index.ts
var import_express12 = __toESM(require("express"), 1);
init_db();
init_schema();
var import_drizzle_orm8 = require("drizzle-orm");
var router11 = import_express12.default.Router();
router11.get("/", async (req, res) => {
  try {
    const items = await db2.select().from(enterpriseArchitecture);
    return sendSuccess3(res, items);
  } catch (error) {
    return sendError3(res, "Error fetching enterprise architecture items", error);
  }
});
router11.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError3(res, "Invalid ID format");
    }
    const [item] = await db2.select().from(enterpriseArchitecture).where((0, import_drizzle_orm8.eq)(enterpriseArchitecture.id, id));
    if (!item) {
      return sendError3(res, "Item not found");
    }
    return sendSuccess3(res, item);
  } catch (error) {
    return sendError3(res, "Error fetching enterprise architecture item", error);
  }
});
router11.post("/", async (req, res) => {
  try {
    const validation = insertEnterpriseArchitectureSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError3(res, "Validation error", validation.error);
    }
    const data = validation.data;
    if (!data.assetId) {
      const prefix = getAssetPrefix(data.type);
      const randomId = Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
      data.assetId = `${prefix}-${randomId}`;
    }
    const [newItem] = await db2.insert(enterpriseArchitecture).values(data).returning();
    return sendSuccess3(res, newItem);
  } catch (error) {
    return sendError3(res, "Error creating enterprise architecture item", error);
  }
});
router11.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError3(res, "Invalid ID format");
    }
    const validation = insertEnterpriseArchitectureSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError3(res, "Validation error", validation.error);
    }
    const data = validation.data;
    const [updatedItem] = await db2.update(enterpriseArchitecture).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm8.eq)(enterpriseArchitecture.id, id)).returning();
    if (!updatedItem) {
      return sendError3(res, "Item not found", null, 404);
    }
    return sendSuccess3(res, updatedItem);
  } catch (error) {
    return sendError3(res, "Error updating enterprise architecture item", error);
  }
});
router11.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError3(res, "Invalid ID format");
    }
    const [deletedItem] = await db2.delete(enterpriseArchitecture).where((0, import_drizzle_orm8.eq)(enterpriseArchitecture.id, id)).returning();
    if (!deletedItem) {
      return sendError3(res, "Item not found", null, 404);
    }
    return sendSuccess3(res, { message: "Item deleted successfully", id });
  } catch (error) {
    return sendError3(res, "Error deleting enterprise architecture item", error);
  }
});
function getAssetPrefix(type) {
  switch (type) {
    case "strategic_capability":
      return "SC";
    case "value_capability":
      return "VC";
    case "business_service":
      return "BS";
    case "product_service":
      return "PS";
    default:
      return "EA";
  }
}
var enterprise_architecture_default = router11;

// server/routes/auth.ts
var import_express13 = require("express");

// server/services/authService.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
init_db();
init_schema();
var import_drizzle_orm9 = require("drizzle-orm");
var AuthService = class _AuthService {
  static instance;
  currentAuthConfig = null;
  constructor() {
  }
  static getInstance() {
    if (!_AuthService.instance) {
      _AuthService.instance = new _AuthService();
    }
    return _AuthService.instance;
  }
  // Initialize authentication configuration
  async initializeAuth() {
    try {
      const [config] = await db2.select().from(authConfig2).limit(1);
      if (!config) {
        const [defaultConfig] = await db2.insert(authConfig2).values({
          authType: "local",
          oidcEnabled: false,
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          lockoutDuration: 300,
          passwordMinLength: 8
        }).returning();
        this.currentAuthConfig = defaultConfig;
        console.log("Created default authentication configuration");
      } else {
        this.currentAuthConfig = config;
      }
    } catch (error) {
      console.error("Failed to initialize auth configuration:", error);
      throw error;
    }
  }
  // Get current authentication configuration
  async getAuthConfig() {
    if (!this.currentAuthConfig) {
      await this.initializeAuth();
    }
    return this.currentAuthConfig;
  }
  // Update authentication configuration (for OIDC setup via UI)
  async updateAuthConfig(updates) {
    const [updated] = await db2.update(authConfig2).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm9.eq)(authConfig2.id, this.currentAuthConfig.id)).returning();
    this.currentAuthConfig = updated;
    console.log("Authentication configuration updated:", {
      authType: updated.authType,
      oidcEnabled: updated.oidcEnabled
    });
    return updated;
  }
  // Local Authentication Methods
  async createUser(userData, createdBy) {
    const config = await this.getAuthConfig();
    if (userData.password.length < config.passwordMinLength) {
      throw new Error(`Password must be at least ${config.passwordMinLength} characters long`);
    }
    const passwordHash = await import_bcryptjs2.default.hash(userData.password, 12);
    const existingUser = await db2.select().from(users).where((0, import_drizzle_orm9.eq)(users.username, userData.username)).limit(1);
    if (existingUser.length > 0) {
      throw new Error("Username already exists");
    }
    if (userData.email) {
      const existingEmail = await db2.select().from(users).where((0, import_drizzle_orm9.eq)(users.email, userData.email)).limit(1);
      if (existingEmail.length > 0) {
        throw new Error("Email already exists");
      }
    }
    const [newUser] = await db2.insert(users).values({
      username: userData.username,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      authType: "local",
      isActive: true,
      emailVerified: true,
      // Auto-verify for admin-created users
      createdBy
    }).returning();
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  async authenticateLocal(credentials) {
    const config = await this.getAuthConfig();
    const [user] = await db2.select().from(users).where((0, import_drizzle_orm9.and)(
      (0, import_drizzle_orm9.eq)(users.username, credentials.username),
      (0, import_drizzle_orm9.eq)(users.authType, "local"),
      (0, import_drizzle_orm9.eq)(users.isActive, true)
    )).limit(1);
    if (!user) {
      return null;
    }
    if (user.accountLockedUntil && user.accountLockedUntil > /* @__PURE__ */ new Date()) {
      throw new Error("Account is temporarily locked due to too many failed login attempts");
    }
    const isValidPassword = await import_bcryptjs2.default.compare(credentials.password, user.passwordHash);
    if (!isValidPassword) {
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updates = {
        failedLoginAttempts: failedAttempts,
        lastFailedLogin: /* @__PURE__ */ new Date()
      };
      if (failedAttempts >= config.maxLoginAttempts) {
        updates.accountLockedUntil = new Date(Date.now() + config.lockoutDuration * 1e3);
      }
      await db2.update(users).set(updates).where((0, import_drizzle_orm9.eq)(users.id, user.id));
      return null;
    }
    await db2.update(users).set({
      failedLoginAttempts: 0,
      lastFailedLogin: null,
      accountLockedUntil: null,
      lastLogin: /* @__PURE__ */ new Date(),
      loginCount: (user.loginCount || 0) + 1
    }).where((0, import_drizzle_orm9.eq)(users.id, user.id));
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  // User Management Methods
  async getAllUsers() {
    const allUsers = await db2.select().from(users);
    return allUsers.map((user) => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  async getUserById(id) {
    const [user] = await db2.select().from(users).where((0, import_drizzle_orm9.eq)(users.id, id)).limit(1);
    if (!user) return null;
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async updateUser(id, updates) {
    const { passwordHash, ...safeUpdates } = updates;
    const [updated] = await db2.update(users).set({ ...safeUpdates, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm9.eq)(users.id, id)).returning();
    const { passwordHash: _, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }
  async changePassword(id, newPassword) {
    const config = await this.getAuthConfig();
    if (newPassword.length < config.passwordMinLength) {
      throw new Error(`Password must be at least ${config.passwordMinLength} characters long`);
    }
    const passwordHash = await import_bcryptjs2.default.hash(newPassword, 12);
    await db2.update(users).set({
      passwordHash,
      mustChangePassword: false,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm9.eq)(users.id, id));
  }
  async deleteUser(id) {
    await db2.update(users).set({
      isActive: false,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm9.eq)(users.id, id));
  }
  // OIDC Support Methods (for future implementation)
  async upsertOidcUser(oidcProfile) {
    const [existingUser] = await db2.select().from(users).where((0, import_drizzle_orm9.eq)(users.oidcSub, oidcProfile.sub)).limit(1);
    if (existingUser) {
      const [updated] = await db2.update(users).set({
        email: oidcProfile.email,
        firstName: oidcProfile.given_name || oidcProfile.first_name,
        lastName: oidcProfile.family_name || oidcProfile.last_name,
        lastLogin: /* @__PURE__ */ new Date(),
        loginCount: (existingUser.loginCount || 0) + 1,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm9.eq)(users.id, existingUser.id)).returning();
      const { passwordHash: _2, ...userWithoutPassword2 } = updated;
      return userWithoutPassword2;
    }
    const [newUser] = await db2.insert(users).values({
      username: oidcProfile.preferred_username || oidcProfile.email || `oidc_${oidcProfile.sub}`,
      email: oidcProfile.email,
      firstName: oidcProfile.given_name || oidcProfile.first_name,
      lastName: oidcProfile.family_name || oidcProfile.last_name,
      authType: "oidc",
      oidcSub: oidcProfile.sub,
      role: "viewer",
      // Default role for OIDC users
      isActive: true,
      emailVerified: true,
      lastLogin: /* @__PURE__ */ new Date(),
      loginCount: 1
    }).returning();
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
  // Check if system has any admin users
  async hasAdminUsers() {
    const [adminUser] = await db2.select().from(users).where((0, import_drizzle_orm9.and)(
      (0, import_drizzle_orm9.eq)(users.role, "admin"),
      (0, import_drizzle_orm9.eq)(users.isActive, true)
    )).limit(1);
    return !!adminUser;
  }
  // Create initial admin user
  async createInitialAdmin(userData) {
    const hasAdmin = await this.hasAdminUsers();
    if (hasAdmin) {
      throw new Error("Admin user already exists");
    }
    return this.createUser({ ...userData, role: "admin" });
  }
};
var authService = AuthService.getInstance();

// shared/utils/passwordUtils.ts
var import_bcryptjs3 = __toESM(require("bcryptjs"), 1);
var PEPPER = process.env.PASSWORD_PEPPER || "default-pepper-change-in-production";
function validatePasswordStrength(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const score = metRequirements * 20;
  const feedback = [];
  if (!requirements.length) feedback.push("Password must be at least 8 characters long");
  if (!requirements.uppercase) feedback.push("Add at least one uppercase letter");
  if (!requirements.lowercase) feedback.push("Add at least one lowercase letter");
  if (!requirements.numbers) feedback.push("Add at least one number");
  if (!requirements.symbols) feedback.push("Add at least one symbol");
  return {
    isValid: metRequirements >= 4,
    // At least 4 of 5 requirements
    score,
    requirements,
    feedback
  };
}

// server/routes/auth.ts
var import_zod7 = require("zod");
var router12 = (0, import_express13.Router)();
var createUserSchema = import_zod7.z.object({
  username: import_zod7.z.string().min(3).max(50),
  email: import_zod7.z.string().email(),
  password: import_zod7.z.string().min(8),
  confirmPassword: import_zod7.z.string(),
  firstName: import_zod7.z.string().optional(),
  lastName: import_zod7.z.string().optional(),
  role: import_zod7.z.enum(["user", "admin"]).default("user")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var loginSchema = import_zod7.z.object({
  username: import_zod7.z.string().min(1),
  password: import_zod7.z.string().min(1)
});
var changePasswordSchema = import_zod7.z.object({
  currentPassword: import_zod7.z.string().min(1),
  newPassword: import_zod7.z.string().min(8),
  confirmPassword: import_zod7.z.string().min(8)
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"]
});
router12.post("/auth/login/local", async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = await authService.authenticateLocal({ username, password });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password"
      });
    }
    req.session.user = {
      id: user.id,
      authType: "local",
      role: user.role,
      username: user.username,
      email: user.email,
      displayName: user.displayName
    };
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        authType: "local"
      }
    });
  } catch (error) {
    console.error("Local login error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid login request"
    });
  }
});
router12.get("/auth/user", async (req, res) => {
  try {
    const session2 = req.session;
    if (session2?.user) {
      const user = await authService.getUserById(session2.user.id);
      if (user && user.isActive) {
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          authType: user.authType,
          profileImageUrl: user.profileImageUrl
        });
      }
    }
    if (req.isAuthenticated && req.isAuthenticated()) {
      const ssoUser = req.user;
      if (ssoUser?.claims?.sub) {
        const user = await authService.getUserById(ssoUser.claims.sub);
        if (user && user.isActive) {
          return res.json({
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            authType: user.authType,
            profileImageUrl: user.profileImageUrl
          });
        }
      }
    }
    res.status(401).json({ success: false, error: "Not authenticated" });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, error: "Failed to get user" });
  }
});
router12.post("/auth/change-password", async (req, res) => {
  try {
    const session2 = req.session;
    if (!session2?.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: "New password does not meet requirements",
        details: passwordValidation.feedback
      });
    }
    const user = await authService.authenticateLocal({ username: session2.user.username, password: currentPassword });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect"
      });
    }
    try {
      await authService.changePassword(session2.user.id, newPassword);
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to change password"
      });
    }
  } catch (error) {
    console.error("Change password error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request"
    });
  }
});
router12.post("/auth/logout", (req, res) => {
  const session2 = req.session;
  if (session2) {
    session2.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ success: false, error: "Logout failed" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  } else {
    res.json({ success: true, message: "No active session" });
  }
});
var requireAdmin = async (req, res, next) => {
  try {
    const session2 = req.session;
    let userRole = null;
    if (session2?.user) {
      const user = await authService.getUserById(session2.user.id);
      userRole = user?.role;
    } else if (req.isAuthenticated && req.isAuthenticated()) {
      const ssoUser = req.user;
      if (ssoUser?.claims?.sub) {
        const user = await authService.getUserById(ssoUser.claims.sub);
        userRole = user?.role;
      }
    }
    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required"
      });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ success: false, error: "Authorization check failed" });
  }
};
router12.post("/auth/users", requireAdmin, async (req, res) => {
  try {
    const userData = createUserSchema.parse(req.body);
    const passwordValidation = validatePasswordStrength(userData.password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Password does not meet requirements",
        details: passwordValidation.feedback
      });
    }
    let createdBy = null;
    const session2 = req.session;
    if (session2?.user) {
      createdBy = session2.user.id;
    } else if (req.isAuthenticated && req.isAuthenticated()) {
      const ssoUser = req.user;
      if (ssoUser?.claims?.sub) {
        createdBy = ssoUser.claims.sub;
      }
    }
    const result = await authService.createLocalUser({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      createdBy
    });
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }
    res.status(201).json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        displayName: result.user.displayName,
        role: result.user.role,
        authType: result.user.authType,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt
      }
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid user data"
    });
  }
});
router12.get("/auth/users", requireAdmin, async (req, res) => {
  try {
    const users2 = await authService.getAllUsers();
    res.json({
      success: true,
      users: users2.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        authType: user.authType,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch users"
    });
  }
});
router12.patch("/auth/users/:id/role", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = import_zod7.z.object({ role: import_zod7.z.enum(["user", "admin"]) }).parse(req.body);
    const success = await authService.updateUserRole(userId, role);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Failed to update user role"
      });
    }
    res.json({
      success: true,
      message: "User role updated successfully"
    });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request"
    });
  }
});
router12.patch("/auth/users/:id/deactivate", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const success = await authService.deactivateUser(userId);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Failed to deactivate user"
      });
    }
    res.json({
      success: true,
      message: "User deactivated successfully"
    });
  } catch (error) {
    console.error("Deactivate user error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request"
    });
  }
});
router12.patch("/auth/users/:id/reset-password", requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { newPassword } = import_zod7.z.object({ newPassword: import_zod7.z.string().min(8) }).parse(req.body);
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Password does not meet requirements",
        details: passwordValidation.feedback
      });
    }
    const success = await authService.resetUserPassword(userId, newPassword);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "Failed to reset password"
      });
    }
    res.json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({
      success: false,
      error: "Invalid request"
    });
  }
});
var oidcConfigSchema = import_zod7.z.object({
  oidcEnabled: import_zod7.z.boolean().optional(),
  oidcIssuer: import_zod7.z.string().url().optional().or(import_zod7.z.literal("")),
  oidcClientId: import_zod7.z.string().optional(),
  oidcClientSecret: import_zod7.z.string().optional(),
  oidcCallbackUrl: import_zod7.z.string().url().optional().or(import_zod7.z.literal("")),
  oidcScopes: import_zod7.z.array(import_zod7.z.string()).optional(),
  authType: import_zod7.z.enum(["local", "oidc", "hybrid"]).optional()
});
router12.get("/auth/oidc/config", requireAdmin, async (req, res) => {
  try {
    const [config] = await db.select().from(authConfig).limit(1);
    if (!config) {
      return res.json({
        success: true,
        config: {
          oidcEnabled: false,
          oidcIssuer: "",
          oidcClientId: "",
          oidcClientSecret: "",
          oidcCallbackUrl: "",
          oidcScopes: ["openid", "profile", "email"],
          authType: "local"
        }
      });
    }
    res.json({
      success: true,
      config: {
        oidcEnabled: config.oidcEnabled,
        oidcIssuer: config.oidcIssuer || "",
        oidcClientId: config.oidcClientId || "",
        oidcClientSecret: config.oidcClientSecret ? "***" : "",
        oidcCallbackUrl: config.oidcCallbackUrl || "",
        oidcScopes: config.oidcScopes || ["openid", "profile", "email"],
        authType: config.authType
      }
    });
  } catch (error) {
    console.error("Get OIDC config error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get OIDC configuration"
    });
  }
});
router12.put("/auth/oidc/config", requireAdmin, async (req, res) => {
  try {
    const updates = oidcConfigSchema.parse(req.body);
    if (updates.oidcClientSecret === "***") {
      delete updates.oidcClientSecret;
    }
    let [config] = await db.select().from(authConfig).limit(1);
    if (!config) {
      [config] = await db.insert(authConfig).values({
        authType: "local",
        oidcEnabled: false,
        sessionTimeout: 3600,
        maxLoginAttempts: 5,
        lockoutDuration: 300,
        passwordMinLength: 8,
        ...updates
      }).returning();
    } else {
      [config] = await db.update(authConfig).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(authConfig.id, config.id)).returning();
    }
    if (updates.oidcEnabled !== void 0 || updates.oidcIssuer || updates.oidcClientId) {
      try {
        const { configurePassport: configurePassport3 } = await Promise.resolve().then(() => (init_auth(), auth_exports));
        configurePassport3();
        console.log("OIDC configuration updated dynamically");
      } catch (error) {
        console.error("Failed to reconfigure OIDC:", error);
      }
    }
    res.json({
      success: true,
      message: "OIDC configuration updated successfully",
      config: {
        oidcEnabled: config.oidcEnabled,
        oidcIssuer: config.oidcIssuer || "",
        oidcClientId: config.oidcClientId || "",
        oidcClientSecret: config.oidcClientSecret ? "***" : "",
        oidcCallbackUrl: config.oidcCallbackUrl || "",
        oidcScopes: config.oidcScopes || ["openid", "profile", "email"],
        authType: config.authType
      }
    });
  } catch (error) {
    console.error("Update OIDC config error:", error);
    res.status(400).json({
      success: false,
      error: error.errors?.[0]?.message || error.message || "Failed to update OIDC configuration"
    });
  }
});
router12.post("/auth/oidc/test", requireAdmin, async (req, res) => {
  try {
    const [config] = await db.select().from(authConfig).limit(1);
    if (!config || !config.oidcEnabled || !config.oidcIssuer) {
      return res.status(400).json({
        success: false,
        error: "OIDC not configured"
      });
    }
    const response = await fetch(`${config.oidcIssuer}/.well-known/openid_configuration`);
    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: "Failed to connect to OIDC provider"
      });
    }
    const discovery = await response.json();
    res.json({
      success: true,
      message: "OIDC connection successful",
      provider: {
        issuer: discovery.issuer,
        authorizationEndpoint: discovery.authorization_endpoint,
        tokenEndpoint: discovery.token_endpoint,
        userInfoEndpoint: discovery.userinfo_endpoint
      }
    });
  } catch (error) {
    console.error("OIDC test error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to test OIDC connection"
    });
  }
});
var auth_default = router12;

// server/routes/vulnerabilities.ts
var import_express14 = require("express");
init_db();
init_schema();
var import_drizzle_orm10 = require("drizzle-orm");
var import_zod8 = require("zod");
var router13 = (0, import_express14.Router)();
var createVulnerabilitySchema = import_zod8.z.object({
  cveId: import_zod8.z.string().min(1, "CVE ID is required"),
  title: import_zod8.z.string().min(1, "Title is required"),
  description: import_zod8.z.string().optional(),
  severity: import_zod8.z.enum(["critical", "high", "medium", "low", "info"]),
  cvssScore: import_zod8.z.number().min(0).max(10).optional(),
  cvssVector: import_zod8.z.string().optional(),
  status: import_zod8.z.enum(["open", "in_progress", "mitigated", "resolved", "false_positive"]).default("open"),
  discoveredDate: import_zod8.z.string().optional(),
  eDetectImpact: import_zod8.z.number().min(0).max(1).optional(),
  eResistImpact: import_zod8.z.number().min(0).max(1).optional(),
  affectedAssets: import_zod8.z.array(import_zod8.z.string()).optional().default([])
});
router13.get("/vulnerabilities", async (req, res) => {
  try {
    const allVulnerabilities = await db2.select({
      id: vulnerabilities.id,
      cveId: vulnerabilities.cveId,
      title: vulnerabilities.title,
      description: vulnerabilities.description,
      cvssScore: vulnerabilities.cvssScore,
      cvssVector: vulnerabilities.cvssVector,
      severity: vulnerabilities.severity,
      status: vulnerabilities.status,
      discoveredDate: vulnerabilities.discoveredDate,
      remediatedDate: vulnerabilities.remediatedDate,
      publishedDate: vulnerabilities.publishedDate,
      modifiedDate: vulnerabilities.modifiedDate,
      eDetectImpact: vulnerabilities.eDetectImpact,
      eResistImpact: vulnerabilities.eResistImpact,
      remediation: vulnerabilities.remediation,
      createdAt: vulnerabilities.createdAt,
      updatedAt: vulnerabilities.updatedAt
    }).from(vulnerabilities);
    res.json({
      success: true,
      data: allVulnerabilities
    });
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vulnerabilities"
    });
  }
});
router13.post("/vulnerabilities", async (req, res) => {
  try {
    const validatedData = createVulnerabilitySchema.parse(req.body);
    const [newVulnerability] = await db2.insert(vulnerabilities).values({
      cveId: validatedData.cveId,
      title: validatedData.title,
      description: validatedData.description,
      severity: validatedData.severity,
      cvssScore: validatedData.cvssScore,
      cvssVector: validatedData.cvssVector,
      status: validatedData.status,
      discoveredDate: validatedData.discoveredDate ? new Date(validatedData.discoveredDate) : /* @__PURE__ */ new Date(),
      eDetectImpact: validatedData.eDetectImpact || 0,
      eResistImpact: validatedData.eResistImpact || 0,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).returning();
    if (validatedData.affectedAssets && validatedData.affectedAssets.length > 0) {
      for (const assetId of validatedData.affectedAssets) {
        const [asset] = await db2.select().from(assets).where((0, import_drizzle_orm10.eq)(assets.assetId, assetId));
        if (asset) {
          await db2.insert(vulnerabilityAssets).values({
            vulnerabilityId: newVulnerability.id,
            assetId: asset.id,
            createdAt: /* @__PURE__ */ new Date(),
            updatedAt: /* @__PURE__ */ new Date()
          });
        }
      }
    }
    res.status(201).json({
      success: true,
      data: newVulnerability
    });
  } catch (error) {
    console.error("Error creating vulnerability:", error);
    if (error instanceof import_zod8.z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create vulnerability"
    });
  }
});
router13.get("/vulnerabilities/:id", async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);
    const [vulnerability] = await db2.select().from(vulnerabilities).where((0, import_drizzle_orm10.eq)(vulnerabilities.id, vulnerabilityId));
    if (!vulnerability) {
      return res.status(404).json({
        success: false,
        error: "Vulnerability not found"
      });
    }
    const associatedAssets = await db2.select({
      assetId: assets.assetId,
      assetName: assets.name,
      assetType: assets.type
    }).from(vulnerabilityAssets).innerJoin(assets, (0, import_drizzle_orm10.eq)(vulnerabilityAssets.assetId, assets.id)).where((0, import_drizzle_orm10.eq)(vulnerabilityAssets.vulnerabilityId, vulnerabilityId));
    res.json({
      success: true,
      data: {
        ...vulnerability,
        affectedAssets: associatedAssets
      }
    });
  } catch (error) {
    console.error("Error fetching vulnerability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vulnerability"
    });
  }
});
router13.put("/vulnerabilities/:id", async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);
    const validatedData = createVulnerabilitySchema.partial().parse(req.body);
    const [updatedVulnerability] = await db2.update(vulnerabilities).set({
      ...validatedData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where((0, import_drizzle_orm10.eq)(vulnerabilities.id, vulnerabilityId)).returning();
    if (!updatedVulnerability) {
      return res.status(404).json({
        success: false,
        error: "Vulnerability not found"
      });
    }
    res.json({
      success: true,
      data: updatedVulnerability
    });
  } catch (error) {
    console.error("Error updating vulnerability:", error);
    if (error instanceof import_zod8.z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update vulnerability"
    });
  }
});
router13.delete("/vulnerabilities/:id", async (req, res) => {
  try {
    const vulnerabilityId = parseInt(req.params.id);
    await db2.delete(vulnerabilityAssets).where((0, import_drizzle_orm10.eq)(vulnerabilityAssets.vulnerabilityId, vulnerabilityId));
    const [deletedVulnerability] = await db2.delete(vulnerabilities).where((0, import_drizzle_orm10.eq)(vulnerabilities.id, vulnerabilityId)).returning();
    if (!deletedVulnerability) {
      return res.status(404).json({
        success: false,
        error: "Vulnerability not found"
      });
    }
    res.json({
      success: true,
      message: "Vulnerability deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting vulnerability:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete vulnerability"
    });
  }
});
router13.get("/vulnerability-metrics", async (req, res) => {
  try {
    const result = await db2.execute(import_drizzle_orm10.sql`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN severity_cvss3 >= 9.0 THEN 1 END) as critical,
             COUNT(CASE WHEN severity_cvss3 >= 7.0 AND severity_cvss3 < 9.0 THEN 1 END) as high,
             COUNT(CASE WHEN severity_cvss3 >= 4.0 AND severity_cvss3 < 7.0 THEN 1 END) as medium,
             COUNT(CASE WHEN severity_cvss3 < 4.0 THEN 1 END) as low,
             COUNT(CASE WHEN status = 'open' THEN 1 END) as open,
             COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
             AVG(COALESCE(severity_cvss3, 0)) as avg_cvss
      FROM vulnerabilities
    `);
    const metrics = {
      total: parseInt(result.rows[0]?.total || 0),
      critical: parseInt(result.rows[0]?.critical || 0),
      high: parseInt(result.rows[0]?.high || 0),
      medium: parseInt(result.rows[0]?.medium || 0),
      low: parseInt(result.rows[0]?.low || 0),
      open: parseInt(result.rows[0]?.open || 0),
      resolved: parseInt(result.rows[0]?.resolved || 0),
      avgCvss: parseFloat(result.rows[0]?.avg_cvss || 0)
    };
    res.json({
      success: true,
      data: {
        metrics,
        vulnerabilities: []
      }
    });
  } catch (error) {
    console.error("Error fetching vulnerability metrics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch vulnerability metrics"
    });
  }
});
var vulnerabilities_default = router13;

// server/routes/common/middleware/errorHandler.ts
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode = 500;
  if (err.status) {
    statusCode = err.status;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
  } else if (err.name === "ValidationError") {
    statusCode = 400;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
  } else if (err.name === "ForbiddenError") {
    statusCode = 403;
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
  }
  if (false) {
    console.error(`${statusCode} Error:`, err);
  }
  return sendError(res, err, statusCode);
}

// server/routes/common/middleware/requestLogger.ts
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  if (false) {
    console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${method} ${originalUrl} - Started`);
  }
  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    if (statusCode >= 500) {
      console.error(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    } else if (statusCode >= 400) {
      console.warn(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    } else if (false) {
      console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
    }
  });
  next();
}

// server/routes/health.ts
var import_express15 = require("express");
var healthRouter = (0, import_express15.Router)();
async function getTestConnection() {
  const isProduction = true;
  if (isProduction) {
    try {
      const dbModule = await Promise.resolve().then(() => (init_production(), production_exports));
      return dbModule.testConnection;
    } catch (error) {
      console.error("Failed to import production module:", error);
    }
  }
  const { pool: pool3 } = await Promise.resolve().then(() => (init_db(), db_exports));
  return async () => {
    try {
      await pool3.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  };
}
healthRouter.get("/health", async (req, res) => {
  try {
    const testConnection2 = await getTestConnection();
    const dbConnected = await testConnection2();
    if (dbConnected) {
      res.json({
        status: "healthy",
        database: "connected",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        environment: "production"
      });
    } else {
      res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
healthRouter.get("/ready", async (req, res) => {
  try {
    const testConnection2 = await getTestConnection();
    const dbConnected = await testConnection2();
    if (dbConnected) {
      res.json({ status: "ready" });
    } else {
      res.status(503).json({ status: "not ready" });
    }
  } catch (error) {
    res.status(503).json({ status: "not ready" });
  }
});

// server/routes/index.ts
function registerRoutes(app2) {
  app2.use("/", healthRouter);
  const apiRouter = import_express16.default.Router();
  apiRouter.use(requestLogger);
  apiRouter.use("/assets", assets_default);
  apiRouter.use("/legal-entities", entities_default);
  apiRouter.use("/risks", risks_default);
  apiRouter.use("/controls", controls_default);
  apiRouter.use("/control-library", routes_default);
  apiRouter.use("/risk-library", routes_default2);
  apiRouter.use("/risk-responses", responses_default);
  apiRouter.use("/dashboard", dashboard_default);
  apiRouter.use("/logs", logs_default);
  apiRouter.use("/cost-modules", routes_default3);
  apiRouter.use("/risk-costs", routes_default4);
  apiRouter.use("/enterprise-architecture", enterprise_architecture_default);
  apiRouter.use("/", vulnerabilities_default);
  apiRouter.use("/", auth_default);
  app2.use("/api", apiRouter);
  app2.use(errorHandler);
  const server = new import_http.Server(app2);
  return server;
}

// server/production.ts
var import_express_session = __toESM(require("express-session"), 1);
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);

// server/production-auth.ts
var configurePassport2 = () => {
  console.log("Production mode: Passport-free authentication configured");
};

// server/production.ts
init_db();
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var app = (0, import_express17.default)();
app.use(import_express17.default.json({ limit: "10mb" }));
app.use(import_express17.default.urlencoded({ extended: true }));
var PgSession = (0, import_connect_pg_simple.default)(import_express_session.default);
var sessionStore = new PgSession({
  pool,
  tableName: "sessions",
  createTableIfMissing: true
});
app.use((0, import_express_session.default)({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1e3
    // 1 week
  }
}));
configurePassport2();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
function serveStatic(app2) {
  const possiblePaths = [
    import_path.default.resolve(__dirname, "..", "dist", "public"),
    import_path.default.resolve(__dirname, "..", "public"),
    "/app/public",
    import_path.default.resolve(__dirname, "..", "dist", "client"),
    import_path.default.resolve(process.cwd(), "dist", "client"),
    import_path.default.resolve(process.cwd(), "public")
  ];
  let distPath = null;
  for (const pathToCheck of possiblePaths) {
    if (import_fs.default.existsSync(pathToCheck)) {
      distPath = pathToCheck;
      console.log(`Found client build files at: ${distPath}`);
      break;
    }
  }
  if (!distPath) {
    throw new Error(
      `Could not find the build directory in any of these locations: ${possiblePaths.join(", ")}, make sure to build the client first`
    );
  }
  app2.use(import_express17.default.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path.default.resolve(distPath, "index.html"));
  });
}
(async () => {
  console.log("Starting production server");
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({
      message,
      error: true ? "Server error" : err.stack || String(err)
    });
    console.error("Server error:", err);
  });
  serveStatic(app);
  const port = parseInt(process.env.PORT || "5000");
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
