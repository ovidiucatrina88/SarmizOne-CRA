
// Production build compatibility
// __dirname and __filename are already available in CommonJS

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
var __copyProps = (to, from, except, desc4) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc4 = __getOwnPropDesc(from, key)) || desc4.enumerable });
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
  authConfig: () => authConfig,
  authTypeEnum: () => authTypeEnum,
  backstageSyncLogs: () => backstageSyncLogs,
  ciaRatingEnum: () => ciaRatingEnum,
  complianceFrameworkEnum: () => complianceFrameworkEnum,
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
var import_pg_core, import_drizzle_zod, import_drizzle_orm, costModuleTypeEnum, assetTypeEnum, assetStatusEnum, ciaRatingEnum, externalInternalEnum, hierarchyLevelEnum, relationshipTypeEnum, riskCategoryEnum, controlTypeEnum, controlCategoryEnum, implementationStatusEnum, riskResponseTypeEnum, severityEnum, currencyEnum, userRoleEnum, authTypeEnum, itemTypeEnum, complianceFrameworkEnum, assets, assetRelationships, enterpriseArchitecture, enterpriseArchitectureRelations, insertEnterpriseArchitectureSchema, risks, controls, controlLibrary, riskLibrary, riskControls, riskResponses, riskCosts, legalEntities, activityLogs, insertAssetSchema, insertRiskSchema, insertControlSchema, insertRiskResponseSchema, insertLegalEntitySchema, insertActivityLogSchema, insertAssetRelationshipSchema, riskSummaries, insertRiskSummarySchema, users, sessions, insertUserSchema, authConfig, vulnerabilityStatusEnum, vulnerabilitySeverityEnum, vulnerabilities, vulnerabilityAssets, vulnerabilityRelations, vulnerabilityAssetRelations, insertVulnerabilitySchema, insertVulnerabilityAssetSchema, insertAuthConfigSchema, backstageSyncLogs;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    import_pg_core = require("drizzle-orm/pg-core");
    import_drizzle_zod = require("drizzle-zod");
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
      "admin",
      "analyst",
      "viewer"
    ]);
    authTypeEnum = (0, import_pg_core.pgEnum)("auth_type", [
      "local",
      // Local username/password
      "sso"
      // Single Sign-On (OpenID Connect)
    ]);
    itemTypeEnum = (0, import_pg_core.pgEnum)("item_type", [
      "template",
      // Original template from library
      "instance"
      // Instance created for a specific risk/asset
    ]);
    complianceFrameworkEnum = (0, import_pg_core.pgEnum)("compliance_framework", [
      "CIS",
      // CIS Controls v8
      "NIST",
      // NIST Cybersecurity Framework
      "ISO27001",
      // ISO/IEC 27001
      "SOC2",
      // SOC 2 Type II
      "PCI_DSS",
      // PCI Data Security Standard
      "HIPAA",
      // Health Insurance Portability and Accountability Act
      "GDPR",
      // General Data Protection Regulation
      "CCM",
      // Cloud Security Alliance Cloud Controls Matrix
      "Custom"
      // Custom or organization-specific controls
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
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      // Backstage integration fields
      backstageEntityRef: (0, import_pg_core.text)("backstage_entity_ref"),
      backstageMetadata: (0, import_pg_core.json)("backstage_metadata"),
      lastBackstageSync: (0, import_pg_core.timestamp)("last_backstage_sync")
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
        references: [enterpriseArchitecture.id]
      })
    }));
    insertEnterpriseArchitectureSchema = (0, import_drizzle_zod.createInsertSchema)(enterpriseArchitecture).omit({ id: true, createdAt: true, updatedAt: true });
    risks = (0, import_pg_core.pgTable)("risks", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.text)("risk_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description").notNull(),
      riskCategory: riskCategoryEnum("risk_category").notNull(),
      severity: severityEnum("severity").notNull(),
      inherentRisk: (0, import_pg_core.numeric)("inherent_risk", { precision: 15, scale: 2 }),
      residualRisk: (0, import_pg_core.numeric)("residual_risk", { precision: 15, scale: 2 }),
      associatedAssets: (0, import_pg_core.json)("associated_assets").default([]),
      libraryItemId: (0, import_pg_core.integer)("library_item_id"),
      // Reference to risk library template
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    controls = (0, import_pg_core.pgTable)("controls", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      controlId: (0, import_pg_core.text)("control_id").notNull(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description"),
      controlType: controlTypeEnum("control_type").notNull(),
      controlCategory: controlCategoryEnum("control_category").notNull(),
      implementationStatus: implementationStatusEnum("implementation_status").notNull(),
      controlEffectiveness: (0, import_pg_core.real)("control_effectiveness"),
      implementationCost: (0, import_pg_core.numeric)("implementation_cost", { precision: 15, scale: 2 }),
      isPerAgent: (0, import_pg_core.boolean)("is_per_agent").default(false),
      costPerAgent: (0, import_pg_core.numeric)("cost_per_agent", { precision: 15, scale: 2 }),
      associatedRisks: (0, import_pg_core.json)("associated_risks").default([]),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow(),
      libraryItemId: (0, import_pg_core.integer)("library_item_id"),
      // Reference to control library template
      complianceFramework: (0, import_pg_core.text)("compliance_framework"),
      cloudDomain: (0, import_pg_core.text)("cloud_domain"),
      nistMappings: (0, import_pg_core.json)("nist_mappings"),
      pciMappings: (0, import_pg_core.json)("pci_mappings"),
      cisMappings: (0, import_pg_core.json)("cis_mappings")
    });
    controlLibrary = (0, import_pg_core.pgTable)("control_library", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      controlId: (0, import_pg_core.text)("control_id").notNull().unique(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description"),
      controlType: controlTypeEnum("control_type").notNull(),
      controlCategory: controlCategoryEnum("control_category").notNull(),
      complianceFramework: complianceFrameworkEnum("compliance_framework").notNull(),
      cloudDomain: (0, import_pg_core.text)("cloud_domain"),
      nistMappings: (0, import_pg_core.json)("nist_mappings").default([]),
      pciMappings: (0, import_pg_core.json)("pci_mappings").default([]),
      cisMappings: (0, import_pg_core.json)("cis_mappings").default([]),
      gapLevel: (0, import_pg_core.text)("gap_level").default("No Gap"),
      addendum: (0, import_pg_core.text)("addendum").default("N/A"),
      architecturalRelevance: (0, import_pg_core.json)("architectural_relevance"),
      organizationalRelevance: (0, import_pg_core.json)("organizational_relevance"),
      ownershipMapping: (0, import_pg_core.text)("ownership_mapping"),
      serviceModels: (0, import_pg_core.json)("service_models").default([]),
      itemType: itemTypeEnum("item_type").notNull().default("template"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskLibrary = (0, import_pg_core.pgTable)("risk_library", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.text)("risk_id").notNull().unique(),
      name: (0, import_pg_core.text)("name").notNull(),
      description: (0, import_pg_core.text)("description"),
      riskCategory: riskCategoryEnum("risk_category").notNull(),
      severity: severityEnum("severity").notNull(),
      threatActor: (0, import_pg_core.text)("threat_actor"),
      threatCapability: (0, import_pg_core.json)("threat_capability"),
      threatEvent: (0, import_pg_core.text)("threat_event"),
      vulnerability: (0, import_pg_core.text)("vulnerability"),
      primaryLoss: (0, import_pg_core.json)("primary_loss"),
      secondaryLoss: (0, import_pg_core.json)("secondary_loss"),
      complianceFramework: complianceFrameworkEnum("compliance_framework").default("Custom"),
      itemType: itemTypeEnum("item_type").notNull().default("template"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskControls = (0, import_pg_core.pgTable)("risk_controls", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.integer)("risk_id").notNull().references(() => risks.id, { onDelete: "cascade" }),
      controlId: (0, import_pg_core.integer)("control_id").notNull().references(() => controls.id, { onDelete: "cascade" }),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    riskResponses = (0, import_pg_core.pgTable)("risk_responses", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.integer)("risk_id").notNull().references(() => risks.id, { onDelete: "cascade" }),
      responseType: riskResponseTypeEnum("response_type").notNull(),
      description: (0, import_pg_core.text)("description"),
      implementationCost: (0, import_pg_core.numeric)("implementation_cost", { precision: 15, scale: 2 }),
      expectedEffectiveness: (0, import_pg_core.real)("expected_effectiveness"),
      responsibleParty: (0, import_pg_core.text)("responsible_party"),
      targetDate: (0, import_pg_core.timestamp)("target_date"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    riskCosts = (0, import_pg_core.pgTable)("risk_costs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      riskId: (0, import_pg_core.integer)("risk_id").notNull().references(() => risks.id, { onDelete: "cascade" }),
      costModuleId: (0, import_pg_core.integer)("cost_module_id").notNull(),
      costValue: (0, import_pg_core.numeric)("cost_value", { precision: 15, scale: 2 }).notNull(),
      frequency: (0, import_pg_core.text)("frequency").notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    legalEntities = (0, import_pg_core.pgTable)("legal_entities", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      entityId: (0, import_pg_core.text)("entity_id").notNull().unique(),
      name: (0, import_pg_core.text)("name").notNull(),
      type: (0, import_pg_core.text)("type").notNull(),
      jurisdiction: (0, import_pg_core.text)("jurisdiction").notNull(),
      regulatoryFramework: (0, import_pg_core.text)("regulatory_framework").array().notNull(),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    activityLogs = (0, import_pg_core.pgTable)("activity_logs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      action: (0, import_pg_core.text)("action").notNull(),
      entityType: (0, import_pg_core.text)("entity_type").notNull(),
      entityId: (0, import_pg_core.text)("entity_id").notNull(),
      userId: (0, import_pg_core.text)("user_id").notNull(),
      details: (0, import_pg_core.json)("details"),
      timestamp: (0, import_pg_core.timestamp)("timestamp").notNull().defaultNow()
    });
    insertAssetSchema = (0, import_drizzle_zod.createInsertSchema)(assets).omit({
      id: true,
      createdAt: true
    });
    insertRiskSchema = (0, import_drizzle_zod.createInsertSchema)(risks).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertControlSchema = (0, import_drizzle_zod.createInsertSchema)(controls).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertRiskResponseSchema = (0, import_drizzle_zod.createInsertSchema)(riskResponses).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertLegalEntitySchema = (0, import_drizzle_zod.createInsertSchema)(legalEntities).omit({ id: true, createdAt: true, updatedAt: true });
    insertActivityLogSchema = (0, import_drizzle_zod.createInsertSchema)(activityLogs).omit({
      id: true,
      timestamp: true
    });
    insertAssetRelationshipSchema = (0, import_drizzle_zod.createInsertSchema)(assetRelationships).omit({
      id: true,
      createdAt: true
    });
    riskSummaries = (0, import_pg_core.pgTable)("risk_summaries", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      year: (0, import_pg_core.integer)("year").notNull(),
      month: (0, import_pg_core.integer)("month").notNull(),
      totalRisks: (0, import_pg_core.integer)("total_risks").notNull().default(0),
      criticalRisks: (0, import_pg_core.integer)("critical_risks").notNull().default(0),
      highRisks: (0, import_pg_core.integer)("high_risks").notNull().default(0),
      mediumRisks: (0, import_pg_core.integer)("medium_risks").notNull().default(0),
      lowRisks: (0, import_pg_core.integer)("low_risks").notNull().default(0),
      totalInherentRisk: (0, import_pg_core.numeric)("total_inherent_risk", { precision: 15, scale: 2 }).notNull().default("0"),
      totalResidualRisk: (0, import_pg_core.numeric)("total_residual_risk", { precision: 15, scale: 2 }).notNull().default("0"),
      riskReduction: (0, import_pg_core.real)("risk_reduction").notNull().default(0),
      exposureCurveData: (0, import_pg_core.json)("exposure_curve_data").notNull().default([]),
      minimumExposure: (0, import_pg_core.numeric)("minimum_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
      maximumExposure: (0, import_pg_core.numeric)("maximum_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
      meanExposure: (0, import_pg_core.numeric)("mean_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
      medianExposure: (0, import_pg_core.numeric)("median_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
      percentile95Exposure: (0, import_pg_core.numeric)("percentile_95_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
      percentile99Exposure: (0, import_pg_core.numeric)("percentile_99_exposure", { precision: 15, scale: 2 }).notNull().default("0"),
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
      username: (0, import_pg_core.text)("username").notNull().unique(),
      email: (0, import_pg_core.text)("email"),
      passwordHash: (0, import_pg_core.text)("password_hash").notNull(),
      firstName: (0, import_pg_core.text)("first_name"),
      lastName: (0, import_pg_core.text)("last_name"),
      role: userRoleEnum("role").notNull().default("viewer"),
      authType: authTypeEnum("auth_type").notNull().default("local"),
      lastLogin: (0, import_pg_core.timestamp)("last_login"),
      isActive: (0, import_pg_core.boolean)("is_active").notNull().default(true),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    sessions = (0, import_pg_core.pgTable)("sessions", {
      sid: (0, import_pg_core.text)("sid").primaryKey(),
      sess: (0, import_pg_core.json)("sess").notNull(),
      expire: (0, import_pg_core.timestamp)("expire").notNull()
    });
    insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      lastLogin: true
    });
    authConfig = (0, import_pg_core.pgTable)("auth_config", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      oidcEnabled: (0, import_pg_core.boolean)("oidc_enabled").notNull().default(false),
      oidcIssuer: (0, import_pg_core.text)("oidc_issuer"),
      oidcClientId: (0, import_pg_core.text)("oidc_client_id"),
      oidcClientSecret: (0, import_pg_core.text)("oidc_client_secret"),
      oidcRedirectUri: (0, import_pg_core.text)("oidc_redirect_uri"),
      oidcScopes: (0, import_pg_core.json)("oidc_scopes").$type().default(["openid", "profile", "email"]),
      allowLocalAuth: (0, import_pg_core.boolean)("allow_local_auth").notNull().default(true),
      defaultRole: userRoleEnum("default_role").notNull().default("viewer"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    vulnerabilityStatusEnum = (0, import_pg_core.pgEnum)("vulnerability_status", [
      "open",
      "in_progress",
      "resolved",
      "false_positive",
      "accepted_risk"
    ]);
    vulnerabilitySeverityEnum = (0, import_pg_core.pgEnum)("vulnerability_severity", [
      "info",
      "low",
      "medium",
      "high",
      "critical"
    ]);
    vulnerabilities = (0, import_pg_core.pgTable)("vulnerabilities", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      vulnerabilityId: (0, import_pg_core.text)("vulnerability_id").notNull(),
      title: (0, import_pg_core.text)("title").notNull(),
      description: (0, import_pg_core.text)("description"),
      severity: vulnerabilitySeverityEnum("severity").notNull(),
      cvssScore: (0, import_pg_core.real)("cvss_score"),
      cvssVector: (0, import_pg_core.text)("cvss_vector"),
      cveId: (0, import_pg_core.text)("cve_id"),
      cweId: (0, import_pg_core.text)("cwe_id"),
      status: vulnerabilityStatusEnum("status").notNull().default("open"),
      discoveredDate: (0, import_pg_core.timestamp)("discovered_date").notNull().defaultNow(),
      lastSeenDate: (0, import_pg_core.timestamp)("last_seen_date"),
      remediation: (0, import_pg_core.text)("remediation"),
      references: (0, import_pg_core.json)("references").default([]),
      tags: (0, import_pg_core.json)("tags").default([]),
      scanner: (0, import_pg_core.text)("scanner"),
      scanId: (0, import_pg_core.text)("scan_id"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow(),
      updatedAt: (0, import_pg_core.timestamp)("updated_at").notNull().defaultNow()
    });
    vulnerabilityAssets = (0, import_pg_core.pgTable)("vulnerability_assets", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      vulnerabilityId: (0, import_pg_core.integer)("vulnerability_id").notNull().references(() => vulnerabilities.id, { onDelete: "cascade" }),
      assetId: (0, import_pg_core.integer)("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
      hostName: (0, import_pg_core.text)("host_name"),
      ipAddress: (0, import_pg_core.text)("ip_address"),
      port: (0, import_pg_core.integer)("port"),
      protocol: (0, import_pg_core.text)("protocol"),
      service: (0, import_pg_core.text)("service"),
      affectedComponent: (0, import_pg_core.text)("affected_component"),
      createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
    });
    vulnerabilityRelations = (0, import_drizzle_orm.relations)(vulnerabilities, ({ many }) => ({
      assets: many(vulnerabilityAssets)
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
    insertAuthConfigSchema = (0, import_drizzle_zod.createInsertSchema)(authConfig).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    backstageSyncLogs = (0, import_pg_core.pgTable)("backstage_sync_logs", {
      id: (0, import_pg_core.serial)("id").primaryKey(),
      syncType: (0, import_pg_core.text)("sync_type").notNull(),
      entitiesProcessed: (0, import_pg_core.integer)("entities_processed").default(0),
      assetsCreated: (0, import_pg_core.integer)("assets_created").default(0),
      assetsUpdated: (0, import_pg_core.integer)("assets_updated").default(0),
      relationshipsCreated: (0, import_pg_core.integer)("relationships_created").default(0),
      syncStatus: (0, import_pg_core.text)("sync_status").notNull(),
      // 'success', 'failed', 'partial'
      errorDetails: (0, import_pg_core.json)("error_details"),
      syncDuration: (0, import_pg_core.integer)("sync_duration"),
      // in milliseconds
      createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
    });
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  checkDatabaseConnection: () => checkDatabaseConnection,
  db: () => db,
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
var import_pg, import_node_postgres, isConnected, lastError, reconnectAttempts, MAX_RECONNECT_ATTEMPTS, pool, db;
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
      connectionTimeoutMillis: 1e4,
      // 10 seconds timeout
      max: 20,
      // Maximum 20 connections in the pool
      min: 2,
      // Minimum 2 connections always available
      idleTimeoutMillis: 6e4,
      // 60 seconds idle timeout
      statement_timeout: 6e4,
      // 60 seconds statement timeout
      query_timeout: 6e4,
      // 60 seconds query timeout
      keepAlive: true,
      keepAliveInitialDelayMillis: 1e4
    });
    pool.on("connect", (client) => {
      console.log("New database client connected");
      isConnected = true;
      reconnectAttempts = 0;
      lastError = null;
      client.query("SET statement_timeout = 60000").catch(() => {
      });
      client.query("SET idle_in_transaction_session_timeout = 60000").catch(() => {
      });
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
    db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });
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

// server/services/riskSummaryService.ts
var riskSummaryService_exports = {};
__export(riskSummaryService_exports, {
  RiskSummaryService: () => RiskSummaryService,
  riskSummaryService: () => riskSummaryService
});
var import_drizzle_orm2, RiskSummaryService, riskSummaryService;
var init_riskSummaryService = __esm({
  "server/services/riskSummaryService.ts"() {
    "use strict";
    init_db();
    init_schema();
    import_drizzle_orm2 = require("drizzle-orm");
    RiskSummaryService = class {
      /**
       * Calculate exposure statistics from risk data
       */
      calculateExposureStatistics(risks2) {
        const exposures = risks2.map((risk) => parseFloat(risk.residualRisk || risk.inherentRisk || "0")).filter((exposure) => exposure > 0).sort((a, b) => a - b);
        if (exposures.length === 0) {
          return {
            min: 0,
            max: 0,
            avg: 0,
            p10: 0,
            median: 0,
            p90: 0
          };
        }
        const sum = exposures.reduce((a, b) => a + b, 0);
        const avg = sum / exposures.length;
        const getPercentile = (arr, percentile) => {
          const index = percentile / 100 * (arr.length - 1);
          const lower = Math.floor(index);
          const upper = Math.ceil(index);
          const weight = index % 1;
          if (upper >= arr.length) return arr[arr.length - 1];
          return arr[lower] * (1 - weight) + arr[upper] * weight;
        };
        return {
          min: Math.min(...exposures),
          max: Math.max(...exposures),
          avg,
          p10: getPercentile(exposures, 10),
          median: getPercentile(exposures, 50),
          p90: getPercentile(exposures, 90),
          p95: getPercentile(exposures, 95),
          p99: getPercentile(exposures, 99)
        };
      }
      /**
       * Get risks filtered by legal entity if specified
       */
      async getRisksForEntity(legalEntityId) {
        const allRisks = await db.select().from(risks);
        console.log(`[RiskSummary] Found ${allRisks.length} total risks`);
        const instanceRisks = allRisks.filter((r) => r.itemType === "instance" || !r.itemType);
        console.log(`[RiskSummary] After filtering instances: ${instanceRisks.length} risks`);
        if (!legalEntityId) {
          return instanceRisks;
        }
        return instanceRisks;
      }
      /**
       * Generate exposure curve data for loss exceedance visualization
       */
      generateExposureCurveData(risks2) {
        if (risks2.length === 0) return [];
        const residualRisks = risks2.map((r) => parseFloat(r.residualRisk) || 0).filter((v) => v > 0).sort((a, b) => b - a);
        if (residualRisks.length === 0) return [];
        const curveData = [];
        for (let i = 0; i < residualRisks.length; i++) {
          const probability = (i + 1) / residualRisks.length;
          const impact = residualRisks[i];
          curveData.push({ probability, impact });
        }
        return curveData;
      }
      /**
       * Update risk summaries for a specific legal entity or globally
       */
      async updateRiskSummaries(legalEntityId) {
        try {
          const riskData = await this.getRisksForEntity(legalEntityId);
          console.log(`DEBUG: getRisksForEntity returned ${riskData.length} risks:`, riskData.map((r) => ({ id: r.id, riskId: r.riskId, severity: r.severity, inherentRisk: r.inherentRisk, residualRisk: r.residualRisk })));
          const stats = this.calculateExposureStatistics(riskData);
          console.log(`DEBUG: calculateExposureStatistics returned:`, stats);
          const totalRisks = riskData.length;
          const criticalRisks = riskData.filter((r) => r.severity === "critical").length;
          const highRisks = riskData.filter((r) => r.severity === "high").length;
          const mediumRisks = riskData.filter((r) => r.severity === "medium").length;
          const lowRisks = riskData.filter((r) => r.severity === "low").length;
          console.log(`DEBUG: Risk counts - total: ${totalRisks}, critical: ${criticalRisks}, high: ${highRisks}, medium: ${mediumRisks}, low: ${lowRisks}`);
          const totalInherentRisk = riskData.reduce((sum, r) => sum + (parseFloat(r.inherentRisk) || 0), 0);
          const totalResidualRisk = riskData.reduce((sum, r) => sum + (parseFloat(r.residualRisk) || 0), 0);
          const exposureCurveData = this.generateExposureCurveData(riskData);
          const now = /* @__PURE__ */ new Date();
          const summaryData = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            legalEntityId: legalEntityId || null,
            // Risk count metrics
            totalRisks,
            criticalRisks,
            highRisks,
            mediumRisks,
            lowRisks,
            // Risk value metrics
            totalInherentRisk,
            totalResidualRisk,
            // Exposure statistics for loss exceedance curve
            minimumExposure: stats.min,
            maximumExposure: stats.max,
            meanExposure: stats.avg,
            medianExposure: stats.median,
            percentile95Exposure: stats.p95,
            percentile99Exposure: stats.p99,
            // Exposure curve data for visualization
            exposureCurveData,
            // Legacy compatibility fields
            averageExposure: stats.avg,
            tenthPercentileExposure: stats.p10,
            mostLikelyExposure: stats.median,
            ninetiethPercentileExposure: stats.p90
          };
          await db.insert(riskSummaries).values(summaryData);
          console.log(`Risk summary updated: entity=${legalEntityId || "global"}, risks=${totalRisks}, critical=${criticalRisks}, high=${highRisks}, totalResidual=${totalResidualRisk}`);
        } catch (error) {
          console.error("Error updating risk summaries:", error);
          throw error;
        }
      }
      /**
       * Get the latest risk summary
       */
      async getLatestRiskSummary(legalEntityId) {
        try {
          let query = db.select().from(riskSummaries).orderBy((0, import_drizzle_orm2.desc)(riskSummaries.createdAt)).limit(1);
          if (legalEntityId) {
            const results2 = await db.select().from(riskSummaries).where((0, import_drizzle_orm2.eq)(riskSummaries.legalEntityId, legalEntityId)).orderBy((0, import_drizzle_orm2.desc)(riskSummaries.createdAt)).limit(1);
            return results2.length > 0 ? results2[0] : null;
          }
          const results = await query;
          return results.length > 0 ? results[0] : null;
        } catch (error) {
          console.error("Error fetching latest risk summary:", error);
          return null;
        }
      }
      /**
       * Force recalculation of all risk summaries
       */
      async recalculateAllSummaries() {
        try {
          await this.updateRiskSummaries();
          console.log("All risk summaries recalculated successfully");
        } catch (error) {
          console.error("Error recalculating risk summaries:", error);
          throw error;
        }
      }
    };
    riskSummaryService = new RiskSummaryService();
  }
});

// server/services/repositoryStorage.ts
var repositoryStorage_exports = {};
__export(repositoryStorage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  repositoryStorage: () => repositoryStorage
});
var import_drizzle_orm3, DatabaseStorage, repositoryStorage;
var init_repositoryStorage = __esm({
  "server/services/repositoryStorage.ts"() {
    "use strict";
    init_schema();
    init_db();
    import_drizzle_orm3 = require("drizzle-orm");
    DatabaseStorage = class {
      /**
       * ASSET REPOSITORY METHODS
       */
      async getAllAssets() {
        return db.select().from(assets);
      }
      async getAsset(id) {
        const [asset] = await db.select().from(assets).where((0, import_drizzle_orm3.eq)(assets.id, id));
        return asset;
      }
      async getAssetByAssetId(assetId) {
        const [asset] = await db.select().from(assets).where((0, import_drizzle_orm3.eq)(assets.assetId, assetId));
        return asset;
      }
      async getAssetsByIds(assetIds) {
        if (!assetIds || assetIds.length === 0) {
          console.log("Warning: getAssetsByIds called with empty array");
          return [];
        }
        console.log(`Looking up assets by IDs: ${assetIds.join(", ")}`);
        const fetchedAssets = await db.select().from(assets).where((0, import_drizzle_orm3.inArray)(assets.assetId, assetIds));
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
        const [createdAsset] = await db.insert(assets).values(asset).returning();
        return createdAsset;
      }
      async updateAsset(id, data) {
        const [updatedAsset] = await db.update(assets).set(data).where((0, import_drizzle_orm3.eq)(assets.id, id)).returning();
        return updatedAsset;
      }
      async deleteAsset(id) {
        await db.delete(assets).where((0, import_drizzle_orm3.eq)(assets.id, id));
        return true;
      }
      async deleteAssetWithCascade(id) {
        const asset = await this.getAsset(id);
        if (!asset) {
          return false;
        }
        console.log(`Starting cascade deletion for asset ${asset.assetId} (ID: ${id})`);
        try {
          const allRisks = await db.select().from(risks);
          const affectedRisks = allRisks.filter(
            (risk) => risk.associatedAssets && risk.associatedAssets.includes(asset.assetId)
          );
          console.log(`Found ${affectedRisks.length} risks associated with asset ${asset.assetId}`);
          for (const risk of affectedRisks) {
            const updatedAssets = risk.associatedAssets.filter((a) => a !== asset.assetId);
            if (updatedAssets.length === 0) {
              console.log(`Risk ${risk.riskId} has no remaining assets - deleting risk and dependencies`);
              await db.delete(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.riskId, risk.id));
              await db.delete(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.riskId, risk.riskId));
              await db.execute(import_drizzle_orm3.sql`DELETE FROM risk_costs WHERE risk_id = ${risk.id}`);
              await db.delete(risks).where((0, import_drizzle_orm3.eq)(risks.id, risk.id));
              console.log(`Deleted risk ${risk.riskId} and all its dependencies`);
            } else {
              await db.update(risks).set({ associatedAssets: updatedAssets }).where((0, import_drizzle_orm3.eq)(risks.id, risk.id));
              console.log(`Updated risk ${risk.riskId} - removed asset ${asset.assetId} from associations`);
            }
          }
          await db.delete(assetRelationships).where((0, import_drizzle_orm3.or)(
            (0, import_drizzle_orm3.eq)(assetRelationships.sourceAssetId, id),
            (0, import_drizzle_orm3.eq)(assetRelationships.targetAssetId, id)
          ));
          console.log(`Deleted asset relationships for asset ${asset.assetId}`);
          try {
            await db.delete(vulnerabilityAssets).where((0, import_drizzle_orm3.eq)(vulnerabilityAssets.assetId, id));
            console.log(`Deleted vulnerability associations for asset ${asset.assetId}`);
          } catch (error) {
            console.log(`No vulnerability associations to delete for asset ${asset.assetId}`);
          }
          await db.delete(assets).where((0, import_drizzle_orm3.eq)(assets.id, id));
          console.log(`Deleted asset ${asset.assetId} (ID: ${id})`);
          try {
            const { riskSummaryService: riskSummaryService2 } = await Promise.resolve().then(() => (init_riskSummaryService(), riskSummaryService_exports));
            await riskSummaryService2.updateRiskSummaries();
            console.log(`Updated risk summaries after asset deletion`);
          } catch (error) {
            console.error(`Failed to update risk summaries:`, error);
          }
          await this.createActivityLog({
            activity: "cascade_delete",
            user: "System User",
            entity: `Asset ${asset.assetId}`,
            entityType: "asset",
            entityId: id.toString()
          });
          console.log(`Completed cascade deletion for asset ${asset.assetId}`);
          return true;
        } catch (error) {
          console.error(`Error during cascade deletion of asset ${asset.assetId}:`, error);
          throw error;
        }
      }
      /**
       * RISK REPOSITORY METHODS
       */
      async getAllRisks() {
        return db.select().from(risks);
      }
      async getRisksByIds(ids) {
        return db.select().from(risks).where((0, import_drizzle_orm3.inArray)(risks.id, ids));
      }
      async getRisk(id) {
        const [risk] = await db.select().from(risks).where((0, import_drizzle_orm3.eq)(risks.id, id));
        return risk;
      }
      async getRiskByRiskId(riskId) {
        const [risk] = await db.select().from(risks).where((0, import_drizzle_orm3.eq)(risks.riskId, riskId));
        return risk;
      }
      async createRisk(risk) {
        const [createdRisk] = await db.insert(risks).values(risk).returning();
        return createdRisk;
      }
      async updateRisk(id, data) {
        const [updatedRisk] = await db.update(risks).set(data).where((0, import_drizzle_orm3.eq)(risks.id, id)).returning();
        return updatedRisk;
      }
      async deleteRisk(id) {
        await db.delete(risks).where((0, import_drizzle_orm3.eq)(risks.id, id));
        try {
          const { riskSummaryService: riskSummaryService2 } = await Promise.resolve().then(() => (init_riskSummaryService(), riskSummaryService_exports));
          await riskSummaryService2.updateRiskSummaries();
          console.log("Risk summaries updated after risk deletion (database layer)");
        } catch (error) {
          console.error("Error updating risk summaries after deletion (database layer):", error);
        }
        return true;
      }
      /**
       * CONTROL REPOSITORY METHODS
       */
      async getAllControls() {
        return db.select().from(controls);
      }
      async getControlsByIds(ids) {
        return db.select().from(controls).where((0, import_drizzle_orm3.inArray)(controls.id, ids));
      }
      async getControl(id) {
        const [control] = await db.select().from(controls).where((0, import_drizzle_orm3.eq)(controls.id, id));
        return control;
      }
      async getControlByControlId(controlId) {
        const [control] = await db.select().from(controls).where((0, import_drizzle_orm3.eq)(controls.controlId, controlId));
        return control;
      }
      async createControl(control) {
        const [createdControl] = await db.insert(controls).values(control).returning();
        return createdControl;
      }
      async updateControl(id, data) {
        console.log("Updating control with data:", data);
        const validData = {};
        if (data.controlEffectiveness !== void 0) validData.controlEffectiveness = data.controlEffectiveness;
        if (data.eAvoid !== void 0) validData.eAvoid = data.eAvoid;
        if (data.eDeter !== void 0) validData.eDeter = data.eDeter;
        if (data.eDetect !== void 0) validData.eDetect = data.eDetect;
        if (data.eResist !== void 0) validData.eResist = data.eResist;
        if (data.varFreq !== void 0) validData.varFreq = data.varFreq;
        if (data.varDuration !== void 0) validData.varDuration = data.varDuration;
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
        const [updatedControl] = await db.update(controls).set(validData).where((0, import_drizzle_orm3.eq)(controls.id, id)).returning();
        return updatedControl;
      }
      async deleteControl(id) {
        await db.delete(controls).where((0, import_drizzle_orm3.eq)(controls.id, id));
        return true;
      }
      /**
       * CONTROL LIBRARY REPOSITORY METHODS
       */
      async getAllControlLibraryItems() {
        return db.select().from(controlLibrary);
      }
      async getControlLibraryItem(id) {
        const [template] = await db.select().from(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
        return template;
      }
      async createControlLibraryItem(item) {
        const [createdItem] = await db.insert(controlLibrary).values(item).returning();
        return createdItem;
      }
      async updateControlLibraryItem(id, data) {
        const [updatedItem] = await db.update(controlLibrary).set(data).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id)).returning();
        return updatedItem;
      }
      async deleteControlLibraryItem(id) {
        await db.delete(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
        return true;
      }
      /**
       * RISK RESPONSE REPOSITORY METHODS
       */
      async getAllRiskResponses() {
        return db.select().from(riskResponses);
      }
      async getRiskResponse(id) {
        const [response] = await db.select().from(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.id, id));
        return response;
      }
      async getRiskResponsesForRisk(riskId) {
        return db.select().from(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.riskId, riskId));
      }
      async createRiskResponse(response) {
        const [createdResponse] = await db.insert(riskResponses).values(response).returning();
        return createdResponse;
      }
      async updateRiskResponse(id, data) {
        const [updatedResponse] = await db.update(riskResponses).set(data).where((0, import_drizzle_orm3.eq)(riskResponses.id, id)).returning();
        return updatedResponse;
      }
      async deleteRiskResponse(id) {
        await db.delete(riskResponses).where((0, import_drizzle_orm3.eq)(riskResponses.id, id));
        return true;
      }
      /**
       * ACTIVITY LOG REPOSITORY METHODS
       */
      async getAllActivityLogs() {
        return db.select().from(activityLogs).orderBy((0, import_drizzle_orm3.desc)(activityLogs.createdAt));
      }
      async createActivityLog(log2) {
        const [createdLog] = await db.insert(activityLogs).values(log2).returning();
        return createdLog;
      }
      /**
       * LEGAL ENTITY REPOSITORY METHODS
       */
      async getAllLegalEntities() {
        return db.select().from(legalEntities);
      }
      async getLegalEntity(id) {
        const [entity] = await db.select().from(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.id, id));
        return entity;
      }
      async getLegalEntityByEntityId(entityId) {
        const [entity] = await db.select().from(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.entityId, entityId));
        return entity;
      }
      async createLegalEntity(entity) {
        const [createdEntity] = await db.insert(legalEntities).values(entity).returning();
        return createdEntity;
      }
      async updateLegalEntity(id, data) {
        const [updatedEntity] = await db.update(legalEntities).set(data).where((0, import_drizzle_orm3.eq)(legalEntities.id, id)).returning();
        return updatedEntity;
      }
      async deleteLegalEntity(id) {
        await db.delete(legalEntities).where((0, import_drizzle_orm3.eq)(legalEntities.id, id));
        return true;
      }
      /**
       * RISK SUMMARY REPOSITORY METHODS
       */
      async getLatestRiskSummary() {
        const results = await db.select().from(riskSummaries).orderBy((0, import_drizzle_orm3.desc)(riskSummaries.createdAt)).limit(1);
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
        const [createdSummary] = await db.insert(riskSummaries).values(summaryWithDate).returning();
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
          const joinRecords = await db.select().from(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.riskId, riskId));
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
        const joinRecords = await db.select().from(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.controlId, controlId));
        if (joinRecords.length === 0) return [];
        const riskIds = joinRecords.map((record) => record.riskId);
        return this.getRisksByIds(riskIds);
      }
      async addControlToRisk(riskId, controlId) {
        const [existing] = await db.select().from(riskControls).where(
          (0, import_drizzle_orm3.and)(
            (0, import_drizzle_orm3.eq)(riskControls.riskId, riskId),
            (0, import_drizzle_orm3.eq)(riskControls.controlId, controlId)
          )
        );
        if (!existing) {
          await db.insert(riskControls).values({
            riskId,
            controlId
          });
        }
      }
      async removeControlFromRisk(riskId, controlId) {
        await db.delete(riskControls).where(
          (0, import_drizzle_orm3.and)(
            (0, import_drizzle_orm3.eq)(riskControls.riskId, riskId),
            (0, import_drizzle_orm3.eq)(riskControls.controlId, controlId)
          )
        );
      }
      async removeControlsFromRisk(riskId) {
        await db.delete(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.riskId, riskId));
      }
      async removeControlFromAllRisks(controlId) {
        await db.delete(riskControls).where((0, import_drizzle_orm3.eq)(riskControls.controlId, controlId));
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
        return db.select().from(controlLibrary);
      }
      async getControlLibraryItem(id) {
        const [item] = await db.select().from(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
        return item;
      }
      async createControlLibraryItem(data) {
        const [item] = await db.insert(controlLibrary).values(data).returning();
        return item;
      }
      async updateControlLibraryItem(id, data) {
        const [item] = await db.update(controlLibrary).set(data).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id)).returning();
        return item;
      }
      async deleteControlLibraryItem(id) {
        await db.delete(controlLibrary).where((0, import_drizzle_orm3.eq)(controlLibrary.id, id));
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
        const result = await db.execute(import_drizzle_orm3.sql`
      SELECT rc.*, cm.name as module_name, cm.cost_type, cm.cost_factor, cm.cis_control
      FROM risk_costs rc
      JOIN cost_modules cm ON rc.cost_module_id = cm.id
      WHERE rc.risk_id = ${riskId}
    `);
        return result.rows;
      }
      async getCostModule(id) {
        const result = await db.execute(import_drizzle_orm3.sql`
      SELECT * FROM cost_modules WHERE id = ${id}
    `);
        return result.rows[0];
      }
      /**
       * RISK LIBRARY REPOSITORY METHODS
       */
      async getAllRiskLibraryItems() {
        return db.select().from(riskLibrary);
      }
      async getRiskLibraryItem(id) {
        const [item] = await db.select().from(riskLibrary).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id));
        return item;
      }
      async createRiskLibraryItem(data) {
        const [item] = await db.insert(riskLibrary).values(data).returning();
        return item;
      }
      async updateRiskLibraryItem(id, data) {
        const [item] = await db.update(riskLibrary).set(data).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id)).returning();
        return item;
      }
      async deleteRiskLibraryItem(id) {
        await db.delete(riskLibrary).where((0, import_drizzle_orm3.eq)(riskLibrary.id, id));
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
    repositoryStorage = new DatabaseStorage();
  }
});

// server/db/production.ts
var production_exports = {};
__export(production_exports, {
  db: () => db2,
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
var import_pg2, import_node_postgres2, connectionConfig, requiredVars, missing, pool2, db2;
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
    db2 = (0, import_node_postgres2.drizzle)(pool2, { schema: schema_exports });
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

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
var import_vite, import_plugin_react, import_path, import_vite_plugin_runtime_error_modal, import_meta, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    import_vite = require("vite");
    import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
    import_path = __toESM(require("path"), 1);
    import_vite_plugin_runtime_error_modal = __toESM(require("@replit/vite-plugin-runtime-error-modal"), 1);
    import_meta = {};
    vite_config_default = (0, import_vite.defineConfig)({
      plugins: [
        (0, import_plugin_react.default)(),
        (0, import_vite_plugin_runtime_error_modal.default)(),
        ...false ? [
          null.then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": import_path.default.resolve(import_meta.dirname, "client", "src"),
          "@shared": import_path.default.resolve(import_meta.dirname, "shared"),
          "@assets": import_path.default.resolve(import_meta.dirname, "attached_assets")
        }
      },
      root: import_path.default.resolve(import_meta.dirname, "client"),
      build: {
        outDir: import_path.default.resolve(import_meta.dirname, "dist/public"),
        emptyOutDir: true
      }
    });
  }
});

// server/index.ts
var import_express28 = __toESM(require("express"), 1);

// server/routes/index.ts
var import_express26 = __toESM(require("express"), 1);
var import_http = require("http");

// server/routes/assets/index.ts
var import_express = __toESM(require("express"), 1);

// server/services/index.ts
init_repositoryStorage();

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

// server/services/automatedRiskSummary.ts
init_db();
var import_drizzle_orm4 = require("drizzle-orm");
var AutomatedRiskSummaryService = class _AutomatedRiskSummaryService {
  static instance;
  isRecalculating = false;
  pendingRecalculation = false;
  static getInstance() {
    if (!_AutomatedRiskSummaryService.instance) {
      _AutomatedRiskSummaryService.instance = new _AutomatedRiskSummaryService();
    }
    return _AutomatedRiskSummaryService.instance;
  }
  /**
   * Trigger automatic recalculation (debounced to prevent multiple simultaneous runs)
   */
  async triggerRecalculation() {
    if (this.isRecalculating) {
      this.pendingRecalculation = true;
      return;
    }
    try {
      this.isRecalculating = true;
      await this.recalculateRiskSummaries();
      if (this.pendingRecalculation) {
        this.pendingRecalculation = false;
        await this.recalculateRiskSummaries();
      }
    } finally {
      this.isRecalculating = false;
    }
  }
  /**
   * Core recalculation logic using direct SQL for performance
   */
  async recalculateRiskSummaries() {
    try {
      console.log("[AutoRiskSummary] Starting automated risk summary recalculation");
      const result = await db.execute(import_drizzle_orm4.sql`
        SELECT 
          COUNT(*) as total_risks,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_risks,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_risks,
          COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_risks,
          COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_risks,
          COALESCE(SUM(inherent_risk), 0) as total_inherent_risk,
          COALESCE(SUM(residual_risk), 0) as total_residual_risk,
          COALESCE(MIN(residual_risk), 0) as minimum_exposure,
          COALESCE(MAX(residual_risk), 0) as maximum_exposure,
          COALESCE(AVG(residual_risk), 0) as mean_exposure,
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY residual_risk), 0) as median_exposure,
          COALESCE(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY residual_risk), 0) as percentile_95_exposure,
          COALESCE(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY residual_risk), 0) as percentile_99_exposure
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
          AND residual_risk IS NOT NULL;
      `);
      const stats = result.rows[0];
      if (!stats) {
        console.log("[AutoRiskSummary] No risk data found, creating empty summary");
        await this.createEmptyRiskSummary();
        return;
      }
      const exposureCurveData = await this.generateExposureCurveData();
      const now = /* @__PURE__ */ new Date();
      await db.execute(import_drizzle_orm4.sql`
        INSERT INTO risk_summaries (
          year, month, legal_entity_id,
          total_risks, critical_risks, high_risks, medium_risks, low_risks,
          total_inherent_risk, total_residual_risk,
          minimum_exposure, maximum_exposure, average_exposure,
          mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure,
          tenth_percentile_exposure, most_likely_exposure, ninetieth_percentile_exposure,
          exposure_curve_data, created_at, updated_at
        ) VALUES (
          ${now.getFullYear()}, ${now.getMonth() + 1}, NULL,
          ${stats.total_risks}, ${stats.critical_risks}, ${stats.high_risks}, ${stats.medium_risks}, ${stats.low_risks},
          ${stats.total_inherent_risk}, ${stats.total_residual_risk},
          ${stats.minimum_exposure}, ${stats.maximum_exposure}, ${stats.mean_exposure},
          ${stats.mean_exposure}, ${stats.median_exposure}, ${stats.percentile_95_exposure}, ${stats.percentile_99_exposure},
          ${stats.minimum_exposure}, ${stats.mean_exposure}, ${stats.percentile_95_exposure},
          ${JSON.stringify(exposureCurveData)}::jsonb, ${now}, ${now}
        )
      `);
      console.log(`[AutoRiskSummary] Updated: ${stats.total_risks} risks, $${Number(stats.total_residual_risk).toLocaleString()} total exposure`);
    } catch (error) {
      console.error("[AutoRiskSummary] Error during recalculation:", error);
      throw error;
    }
  }
  /**
   * Generate exposure curve data for loss exceedance visualization
   */
  async generateExposureCurveData() {
    try {
      const result = await db.execute(import_drizzle_orm4.sql`
        SELECT residual_risk
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
          AND residual_risk IS NOT NULL
          AND residual_risk > 0
        ORDER BY residual_risk DESC
      `);
      const exposures = result.rows.map((row) => Number(row.residual_risk));
      if (exposures.length === 0) return [];
      const curveData = [];
      for (let i = 0; i < exposures.length; i++) {
        const probability = (i + 1) / exposures.length;
        const impact = exposures[i];
        curveData.push({ impact, probability });
      }
      return curveData.slice(0, 10);
    } catch (error) {
      console.error("[AutoRiskSummary] Error generating exposure curve:", error);
      return [];
    }
  }
  /**
   * Create empty risk summary when no risks exist
   */
  async createEmptyRiskSummary() {
    const now = /* @__PURE__ */ new Date();
    await db.execute(import_drizzle_orm4.sql`
      INSERT INTO risk_summaries (
        year, month, legal_entity_id,
        total_risks, critical_risks, high_risks, medium_risks, low_risks,
        total_inherent_risk, total_residual_risk,
        minimum_exposure, maximum_exposure, average_exposure,
        mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure,
        exposure_curve_data, created_at, updated_at
      ) VALUES (
        ${now.getFullYear()}, ${now.getMonth() + 1}, NULL,
        0, 0, 0, 0, 0,
        0, 0,
        0, 0, 0,
        0, 0, 0, 0,
        '[]'::jsonb, ${now}, ${now}
      )
    `);
  }
  /**
   * Clean up old risk summary entries (keep last 100)
   */
  async cleanupOldSummaries() {
    try {
      await db.execute(import_drizzle_orm4.sql`
        DELETE FROM risk_summaries 
        WHERE id NOT IN (
          SELECT id FROM risk_summaries 
          ORDER BY created_at DESC 
          LIMIT 100
        )
      `);
      console.log("[AutoRiskSummary] Cleaned up old summary entries");
    } catch (error) {
      console.error("[AutoRiskSummary] Error cleaning up old summaries:", error);
    }
  }
};
var automatedRiskSummary = AutomatedRiskSummaryService.getInstance();

// server/services/riskService.ts
var RiskService = class {
  repository;
  constructor(repository3) {
    this.repository = repository3;
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
    await automatedRiskSummary.triggerRecalculation();
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
      await automatedRiskSummary.triggerRecalculation();
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
          await automatedRiskSummary.triggerRecalculation();
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
        } else {
          numericAssetValue = 0;
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
var riskService = (repository3) => new RiskService(repository3);

// server/services/assetService.ts
var AssetService = class {
  repository;
  constructor(repository3) {
    this.repository = repository3;
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
   * Delete an asset with cascade operations
   */
  async deleteAssetWithCascade(id) {
    const asset = await this.repository.getAsset(id);
    if (!asset) {
      return false;
    }
    const success = await this.repository.deleteAssetWithCascade(id);
    if (success) {
      await this.logAssetActivity(id, "Deleted asset with cascade", asset.name);
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
  async logAssetActivity(assetId, activity, entity) {
    await this.repository.createActivityLog({
      activity,
      user: "System User",
      entity,
      entityType: "asset",
      entityId: assetId.toString()
    });
  }
};
var assetService = (repository3) => new AssetService(repository3);

// server/services/controlService.ts
var ControlService = class {
  repository;
  constructor(repository3) {
    this.repository = repository3;
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
var controlService = (repository3) => new ControlService(repository3);

// server/services/responseService.ts
var ResponseService = class {
  repository;
  constructor(repository3) {
    this.repository = repository3;
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
var responseService = (repository3) => new ResponseService(repository3);

// server/services/index.ts
var repository = new DatabaseStorage();
var riskServiceInstance = riskService(repository);
var assetServiceInstance = assetService(repository);
var controlServiceInstance = controlService(repository);
var responseServiceInstance = responseService(repository);

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
var import_zod = require("zod");
var router = import_express.default.Router();
var assetSchema = import_zod.z.object({
  name: import_zod.z.string().min(1, "Name is required"),
  description: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  assetId: import_zod.z.string().min(1, "Asset ID is required"),
  type: import_zod.z.enum(["data", "application", "device", "system", "network", "facility", "personnel", "other"]),
  status: import_zod.z.enum(["Active", "Decommissioned", "To Adopt"]),
  businessUnit: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  confidentiality: import_zod.z.enum(["low", "medium", "high"]),
  integrity: import_zod.z.enum(["low", "medium", "high"]),
  availability: import_zod.z.enum(["low", "medium", "high"]),
  criticality: import_zod.z.enum(["low", "medium", "high", "critical"]).optional().default("medium"),
  legalEntity: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  currency: import_zod.z.enum(["USD", "EUR"]).optional().default("USD"),
  assetValue: import_zod.z.union([import_zod.z.number(), import_zod.z.string()]).transform(
    (val) => typeof val === "string" ? Number(val.replace(/[^0-9.-]/g, "")) : val
  ),
  regulatoryImpact: import_zod.z.array(import_zod.z.string()).optional().default([]),
  externalInternal: import_zod.z.enum(["external", "internal"]).default("internal"),
  owner: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  custodian: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  location: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  dependencies: import_zod.z.array(import_zod.z.string()).optional().default([]),
  notes: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  agentCount: import_zod.z.number().optional().default(1),
  // Additional fields that UI might send
  hierarchy_level: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional(),
  architecture_domain: import_zod.z.union([import_zod.z.string(), import_zod.z.null()]).optional()
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
router.get("/vulnerabilities", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { sql: sql10 } = await import("drizzle-orm");
    const result = await db3.execute(sql10`
      SELECT 
        v.id,
        v.title,
        v.description,
        v.severity,
        v.status,
        v.discovered_date as discovery_date,
        v.created_at,
        COUNT(va.id) as affected_assets
      FROM vulnerabilities v
      LEFT JOIN vulnerability_assets va ON v.id = va.vulnerability_id
      GROUP BY v.id, v.title, v.description, v.severity, v.status, v.discovered_date, v.created_at
      ORDER BY v.created_at DESC
      LIMIT 50
    `);
    sendSuccess(res, result.rows || []);
  } catch (error) {
    console.error("Error fetching asset vulnerabilities:", error);
    sendError(res, "Failed to fetch asset vulnerabilities", 500);
  }
});
router.get("/vulnerabilities/:id", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilities: vulnerabilities2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq15 } = await import("drizzle-orm");
    const vulnerabilityId = parseInt(req.params.id);
    const vulnerability = await db3.select({
      id: vulnerabilities2.id,
      cve_id: vulnerabilities2.cveId,
      title: vulnerabilities2.title,
      description: vulnerabilities2.description,
      discovery_date: vulnerabilities2.discoveryDate,
      severity_cvss3: vulnerabilities2.severityCvss3,
      patchable: vulnerabilities2.patchable,
      source: vulnerabilities2.source,
      created_at: vulnerabilities2.createdAt,
      updated_at: vulnerabilities2.updatedAt,
      severity: vulnerabilities2.severity,
      status: vulnerabilities2.status,
      e_detect: vulnerabilities2.eDetect,
      e_resist: vulnerabilities2.eResist,
      remediation: vulnerabilities2.remediation
    }).from(vulnerabilities2).where(eq15(vulnerabilities2.id, vulnerabilityId));
    if (vulnerability.length === 0) {
      return sendError(res, "Vulnerability not found", 404);
    }
    sendSuccess(res, vulnerability[0]);
  } catch (error) {
    console.error("Error fetching vulnerability:", error);
    sendError(res, "Failed to fetch vulnerability", 500);
  }
});
router.get("/vulnerabilities/:id/assets", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilityAssets: vulnerabilityAssets2, assets: assets2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq15 } = await import("drizzle-orm");
    const vulnerabilityId = parseInt(req.params.id);
    const affectedAssets = await db3.select({
      id: assets2.id,
      assetId: assets2.assetId,
      name: assets2.name,
      type: assets2.type,
      status: assets2.status,
      value: assets2.assetValue
    }).from(vulnerabilityAssets2).innerJoin(assets2, eq15(vulnerabilityAssets2.assetId, assets2.id)).where(eq15(vulnerabilityAssets2.vulnerabilityId, vulnerabilityId));
    sendSuccess(res, affectedAssets);
  } catch (error) {
    console.error("Error fetching vulnerability assets:", error);
    sendError(res, "Failed to fetch vulnerability assets", 500);
  }
});
router.post("/vulnerabilities", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilities: vulnerabilities2, vulnerabilityAssets: vulnerabilityAssets2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const {
      cveId,
      title,
      description,
      cvssScore,
      severity,
      status,
      eDetectImpact,
      eResistImpact,
      selectedAssets,
      remediation,
      references
    } = req.body;
    const [newVulnerability] = await db3.insert(vulnerabilities2).values({
      cveId,
      title,
      description,
      severityCvss3: cvssScore?.toString() || "0",
      severity,
      status,
      eDetect: eDetectImpact?.toString() || null,
      eResist: eResistImpact?.toString() || null,
      source: "manual"
    }).returning();
    if (selectedAssets && selectedAssets.length > 0) {
      const assetAssociations = selectedAssets.map((assetId) => ({
        vulnerabilityId: newVulnerability.id,
        assetId
      }));
      await db3.insert(vulnerabilityAssets2).values(assetAssociations);
    }
    sendSuccess(res, newVulnerability);
  } catch (error) {
    console.error("Error creating vulnerability:", error);
    sendError(res, "Failed to create vulnerability", 500);
  }
});
router.post("/vulnerabilities/import", async (req, res) => {
  try {
    const result = { imported: 0, message: "Vulnerability import not yet implemented" };
    sendSuccess(res, result);
  } catch (error) {
    console.error("Error importing vulnerabilities:", error);
    sendError(res, "Failed to import vulnerabilities", 500);
  }
});
router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const assets2 = await assetServiceInstance.getAllAssets();
    return sendSuccess(res, assets2);
  } catch (error) {
    return sendError(res, error);
  }
});
router.get("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const asset = await assetServiceInstance.getAsset(id);
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
    const existingAsset = await assetServiceInstance.getAssetByAssetId(asset.assetId);
    if (existingAsset) {
      return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
    }
    const newAsset = await assetServiceInstance.createAsset(asset);
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
    const existingAsset = await assetServiceInstance.getAsset(id);
    if (!existingAsset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    if (asset.assetId !== existingAsset.assetId) {
      const conflictingAsset = await assetServiceInstance.getAssetByAssetId(asset.assetId);
      if (conflictingAsset) {
        return sendError(res, { message: `Asset ID ${asset.assetId} already exists` }, 400);
      }
    }
    const updatedAsset = await assetServiceInstance.updateAsset(id, asset);
    return sendSuccess(res, updatedAsset);
  } catch (error) {
    return sendError(res, error);
  }
});
router.delete("/:id", validateId, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Attempting to delete asset with ID: ${id}`);
    const asset = await assetServiceInstance.getAsset(id);
    if (!asset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    console.log(`Found asset with assetId: ${asset.assetId}, proceeding with cascade deletion`);
    const deleted = await assetServiceInstance.deleteAssetWithCascade(id);
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
    const asset = await assetServiceInstance.getAsset(id);
    if (!asset) {
      return sendError(res, { message: "Asset not found" }, 404);
    }
    const risks2 = await assetServiceInstance.getRisksForAsset(asset.assetId);
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

// server/services/storage.ts
init_schema();
init_db();
var import_drizzle_orm5 = require("drizzle-orm");
var DatabaseStorage2 = class {
  async getAllAssets() {
    return await db.select().from(assets);
  }
  async getAsset(id) {
    try {
      if (isNaN(id)) {
        console.error("Invalid asset ID (NaN) provided to getAsset");
        return void 0;
      }
      const [asset] = await db.select().from(assets).where((0, import_drizzle_orm5.eq)(assets.id, id));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by id:", error);
      throw error;
    }
  }
  async getAssetByAssetId(assetId) {
    try {
      const [asset] = await db.select().from(assets).where((0, import_drizzle_orm5.eq)(assets.assetId, assetId));
      return asset;
    } catch (error) {
      console.error("Error fetching asset by assetId:", error);
      throw error;
    }
  }
  async createAsset(asset) {
    const [newAsset] = await db.insert(assets).values(asset).returning();
    return newAsset;
  }
  async updateAsset(id, asset) {
    const [updatedAsset] = await db.update(assets).set(asset).where((0, import_drizzle_orm5.eq)(assets.id, id)).returning();
    return updatedAsset;
  }
  async deleteAsset(id) {
    await db.delete(assets).where((0, import_drizzle_orm5.eq)(assets.id, id));
    return true;
  }
  async deleteAssetWithCascade(id) {
    const repositoryStorage2 = await Promise.resolve().then(() => (init_repositoryStorage(), repositoryStorage_exports)).then((m) => m.repositoryStorage);
    return await repositoryStorage2.deleteAssetWithCascade(id);
  }
  async getAllRisks() {
    return await db.select().from(risks);
  }
  async getRisk(id) {
    const [risk] = await db.select().from(risks).where((0, import_drizzle_orm5.eq)(risks.id, id));
    return risk;
  }
  async getRiskByRiskId(riskId) {
    const [risk] = await db.select().from(risks).where((0, import_drizzle_orm5.eq)(risks.riskId, riskId));
    return risk;
  }
  async createRisk(risk) {
    const [newRisk] = await db.insert(risks).values(risk).returning();
    return newRisk;
  }
  async updateRisk(id, risk) {
    const [updatedRisk] = await db.update(risks).set(risk).where((0, import_drizzle_orm5.eq)(risks.id, id)).returning();
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
        await db.delete(riskResponses).where((0, import_drizzle_orm5.eq)(riskResponses.riskId, risk.riskId)).execute();
        console.log(`Deleted risk responses for risk ${risk.riskId}`);
      } catch (error) {
        console.error(`Error deleting risk responses for risk ${risk.riskId}:`, error);
      }
      try {
        await db.delete(riskControls).where((0, import_drizzle_orm5.eq)(riskControls.riskId, id)).execute();
        console.log(`Deleted risk-control mappings for risk ID ${id}`);
        await db.execute(import_drizzle_orm5.sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-control mappings for risk ID ${id}:`, error);
        try {
          await db.execute(import_drizzle_orm5.sql`DELETE FROM risk_controls WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-control mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-control mappings failed:`, fallbackError);
        }
      }
      try {
        await db.delete(riskCosts).where((0, import_drizzle_orm5.eq)(riskCosts.riskId, id)).execute();
        console.log(`Deleted risk-cost mappings for risk ID ${id}`);
        await db.execute(import_drizzle_orm5.sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
      } catch (error) {
        console.error(`Error deleting risk-cost mappings for risk ID ${id}:`, error);
        try {
          await db.execute(import_drizzle_orm5.sql`DELETE FROM risk_costs WHERE risk_id = ${id}`);
          console.log(`Used direct SQL to delete risk-cost mappings for risk ID ${id}`);
        } catch (fallbackError) {
          console.error(`Final attempt to delete risk-cost mappings failed:`, fallbackError);
        }
      }
      console.log(`Attempting to delete the risk record with ID ${id}`);
      try {
        console.log(`Using direct SQL for risk deletion to ensure success`);
        await db.execute(import_drizzle_orm5.sql`DELETE FROM risks WHERE id = ${id}`);
        console.log(`Direct SQL deletion executed for risk ID ${id}`);
        if (risk && risk.riskId) {
          await db.execute(import_drizzle_orm5.sql`DELETE FROM risks WHERE risk_id = ${risk.riskId}`);
          console.log(`Also attempted deletion by risk_id = ${risk.riskId}`);
        }
        const verifyCheck = await db.execute(import_drizzle_orm5.sql`SELECT id FROM risks WHERE id = ${id}`);
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
    return await db.select().from(controls);
  }
  async getControl(id) {
    const [control] = await db.select().from(controls).where((0, import_drizzle_orm5.eq)(controls.id, id));
    return control;
  }
  async getControlByControlId(controlId) {
    const [control] = await db.select().from(controls).where((0, import_drizzle_orm5.eq)(controls.controlId, controlId));
    return control;
  }
  async createControl(control) {
    const [newControl] = await db.insert(controls).values(control).returning();
    return newControl;
  }
  async updateControl(id, control) {
    const [updatedControl] = await db.update(controls).set(control).where((0, import_drizzle_orm5.eq)(controls.id, id)).returning();
    return updatedControl;
  }
  async deleteControl(id) {
    await db.delete(controls).where((0, import_drizzle_orm5.eq)(controls.id, id));
    return true;
  }
  async getAllRiskResponses() {
    return await db.select().from(riskResponses);
  }
  async getRiskResponse(id) {
    const [response] = await db.select().from(riskResponses).where((0, import_drizzle_orm5.eq)(riskResponses.id, id));
    return response;
  }
  async getRiskResponseByRiskId(riskId) {
    const [response] = await db.select().from(riskResponses).where((0, import_drizzle_orm5.eq)(riskResponses.riskId, riskId));
    return response;
  }
  async createRiskResponse(response) {
    const [newResponse] = await db.insert(riskResponses).values(response).returning();
    return newResponse;
  }
  async updateRiskResponse(id, response) {
    const [updatedResponse] = await db.update(riskResponses).set(response).where((0, import_drizzle_orm5.eq)(riskResponses.id, id)).returning();
    return updatedResponse;
  }
  async deleteRiskResponse(id) {
    await db.delete(riskResponses).where((0, import_drizzle_orm5.eq)(riskResponses.id, id));
    return true;
  }
  async getAllActivityLogs() {
    return await db.select().from(activityLogs).orderBy((0, import_drizzle_orm5.desc)(activityLogs.createdAt));
  }
  async getActivityLog(id) {
    const [log2] = await db.select().from(activityLogs).where((0, import_drizzle_orm5.eq)(activityLogs.id, id));
    return log2;
  }
  async createActivityLog(log2) {
    const [newLog] = await db.insert(activityLogs).values(log2).returning();
    return newLog;
  }
  async getAllLegalEntities() {
    return await db.select().from(legalEntities);
  }
  async getLegalEntity(id) {
    const [entity] = await db.select().from(legalEntities).where((0, import_drizzle_orm5.eq)(legalEntities.id, id));
    return entity;
  }
  async getLegalEntityByEntityId(entityId) {
    const [entity] = await db.select().from(legalEntities).where((0, import_drizzle_orm5.eq)(legalEntities.entityId, entityId));
    return entity;
  }
  async createLegalEntity(entity) {
    const [newEntity] = await db.insert(legalEntities).values(entity).returning();
    return newEntity;
  }
  async updateLegalEntity(id, entity) {
    const [updatedEntity] = await db.update(legalEntities).set(entity).where((0, import_drizzle_orm5.eq)(legalEntities.id, id)).returning();
    return updatedEntity;
  }
  async deleteLegalEntity(id) {
    await db.delete(legalEntities).where((0, import_drizzle_orm5.eq)(legalEntities.id, id));
    return true;
  }
  async getAssetsForLegalEntity(entityId) {
    return await db.select().from(assets).where((0, import_drizzle_orm5.eq)(assets.legalEntity, entityId));
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
    return await db.select().from(assets).where((0, import_drizzle_orm5.inArray)(assets.assetId, risk.associatedAssets));
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
var storage = new DatabaseStorage2();

// server/routes/entities/index.ts
var import_zod2 = require("zod");
var router2 = import_express2.default.Router();
var entitySchema = import_zod2.z.object({
  name: import_zod2.z.string().min(1, "Name is required"),
  description: import_zod2.z.string().optional(),
  entityId: import_zod2.z.string().min(1, "Entity ID is required"),
  parentEntityId: import_zod2.z.string().nullable().optional()
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
      const automatedSummaryService = AutomatedRiskSummaryService.getInstance();
      automatedSummaryService.triggerRecalculation().catch((error) => {
        console.warn("Failed to trigger risk summary recalculation:", error);
      });
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
var import_zod3 = require("zod");
var confidenceEnum = import_zod3.z.enum(["low", "medium", "high"]).transform(
  (val) => val.toLowerCase()
);
var numericStringOrNumber = import_zod3.z.union([
  import_zod3.z.string(),
  import_zod3.z.number().transform((n) => n.toString())
]);
var decimalNumber = import_zod3.z.union([
  import_zod3.z.number(),
  import_zod3.z.string().transform((val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  })
]);
var riskBaseSchema = import_zod3.z.object({
  riskId: import_zod3.z.string(),
  name: import_zod3.z.string(),
  description: import_zod3.z.string().default(""),
  associatedAssets: import_zod3.z.array(import_zod3.z.string()).default([]),
  threatCommunity: import_zod3.z.string().default(""),
  vulnerability: import_zod3.z.string().default(""),
  riskCategory: import_zod3.z.enum(["operational", "strategic", "compliance", "financial"]).transform((val) => val.toLowerCase()),
  severity: import_zod3.z.enum(["low", "medium", "high", "critical"]),
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
  threatEventFrequencyNotes: import_zod3.z.string().optional(),
  vulnerabilityNotes: import_zod3.z.string().optional(),
  primaryLossNotes: import_zod3.z.string().optional(),
  secondaryLossNotes: import_zod3.z.string().optional(),
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
var riskFilterSchema = import_zod3.z.object({
  category: import_zod3.z.enum(["operational", "strategic", "compliance", "financial"]).optional(),
  severity: import_zod3.z.enum(["low", "medium", "high", "critical"]).optional(),
  assetId: import_zod3.z.string().optional(),
  entityId: import_zod3.z.string().optional(),
  search: import_zod3.z.string().optional(),
  sortBy: import_zod3.z.enum(["name", "riskId", "createdAt", "residualRisk", "severity"]).optional(),
  sortOrder: import_zod3.z.enum(["asc", "desc"]).optional(),
  page: import_zod3.z.number().optional(),
  limit: import_zod3.z.number().optional()
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
var import_zod4 = require("zod");
var controlTypeEnum2 = import_zod4.z.enum(["preventive", "detective", "corrective"]);
var controlCategoryEnum2 = import_zod4.z.enum(["technical", "administrative", "physical"]);
var implementationStatusEnum2 = import_zod4.z.enum(["not_implemented", "in_progress", "fully_implemented", "planned"]);
var controlBaseSchema = import_zod4.z.object({
  controlId: import_zod4.z.string(),
  name: import_zod4.z.string().min(1),
  description: import_zod4.z.string().default(""),
  controlType: controlTypeEnum2,
  controlCategory: controlCategoryEnum2,
  implementationStatus: implementationStatusEnum2,
  implementationCost: import_zod4.z.number().optional(),
  implementationTime: import_zod4.z.number().optional(),
  maintainCost: import_zod4.z.number().optional(),
  effectivenessRating: import_zod4.z.number().min(0).max(100).optional(),
  // FAIR-U Control Effectiveness
  controlEffectiveness: import_zod4.z.number().min(0).max(10).optional(),
  // FAIR-CAM effectiveness parameters
  e_avoid: import_zod4.z.number().min(0).max(1).optional(),
  e_deter: import_zod4.z.number().min(0).max(1).optional(),
  e_detect: import_zod4.z.number().min(0).max(1).optional(),
  e_resist: import_zod4.z.number().min(0).max(1).optional(),
  // Cost calculation fields
  costPerAgent: import_zod4.z.number().min(0).optional(),
  isPerAgentPricing: import_zod4.z.boolean().optional(),
  deployedAgentCount: import_zod4.z.number().min(0).optional(),
  vendor: import_zod4.z.string().optional(),
  technicalDetails: import_zod4.z.string().optional(),
  implementationNotes: import_zod4.z.string().optional(),
  attachments: import_zod4.z.array(import_zod4.z.string()).default([]),
  frameworkReferences: import_zod4.z.array(import_zod4.z.string()).default([]),
  legalEntityId: import_zod4.z.string().nullable().optional(),
  riskId: import_zod4.z.number().nullable().optional(),
  assetId: import_zod4.z.string().nullable().optional()
});
var createControlSchema = controlBaseSchema;
var updateControlSchema = controlBaseSchema.partial();
var controlFilterSchema = import_zod4.z.object({
  type: controlTypeEnum2.optional(),
  category: controlCategoryEnum2.optional(),
  status: implementationStatusEnum2.optional(),
  riskId: import_zod4.z.number().optional(),
  assetId: import_zod4.z.string().optional(),
  entityId: import_zod4.z.string().optional(),
  search: import_zod4.z.string().optional(),
  sortBy: import_zod4.z.enum(["name", "controlId", "controlType", "implementationStatus", "effectivenessRating"]).optional(),
  sortOrder: import_zod4.z.enum(["asc", "desc"]).optional(),
  page: import_zod4.z.number().optional(),
  limit: import_zod4.z.number().optional()
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
var import_drizzle_orm6 = require("drizzle-orm");
var ResponseController = class {
  /**
   * Get all responses with optional filtering
   */
  async getAllResponses(req, res) {
    try {
      const responses = await db.select().from(riskResponses);
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
      const [response] = await db.select().from(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.id, id));
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
      const responses = await db.select().from(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.riskId, riskId));
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
      const existingResponses = await db.select().from(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.riskId, responseData.riskId));
      if (existingResponses && existingResponses.length > 0) {
        return sendError(res, { message: "A response already exists for this risk" }, 400);
      }
      const [newResponse] = await db.insert(riskResponses).values({
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
      await db.insert(activityLogs).values({
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
      const [existingResponse] = await db.select().from(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.id, id));
      if (!existingResponse) {
        return sendError(res, { message: "Response not found" }, 404);
      }
      const [updatedResponse] = await db.update(riskResponses).set({
        ...responseData,
        updatedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm6.eq)(riskResponses.id, id)).returning();
      await db.insert(activityLogs).values({
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
      const [existingResponse] = await db.select().from(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.id, id));
      if (!existingResponse) {
        return sendError(res, { message: "Response not found" }, 404);
      }
      await db.delete(riskResponses).where((0, import_drizzle_orm6.eq)(riskResponses.id, id));
      await db.insert(activityLogs).values({
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
var import_zod5 = require("zod");
var responseTypeEnum = import_zod5.z.enum(["accept", "avoid", "transfer", "mitigate"]);
var responseBaseSchema = import_zod5.z.object({
  riskId: import_zod5.z.string(),
  responseType: responseTypeEnum,
  justification: import_zod5.z.string().default(""),
  assignedControls: import_zod5.z.array(import_zod5.z.string()).default([]),
  transferMethod: import_zod5.z.string().default(""),
  avoidanceStrategy: import_zod5.z.string().default(""),
  acceptanceReason: import_zod5.z.string().default("")
});
var createResponseSchema = responseBaseSchema;
var updateResponseSchema = responseBaseSchema.partial();
var responseFilterSchema = import_zod5.z.object({
  type: responseTypeEnum.optional(),
  riskId: import_zod5.z.string().optional(),
  search: import_zod5.z.string().optional(),
  page: import_zod5.z.number().optional(),
  limit: import_zod5.z.number().optional()
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
var import_drizzle_orm7 = require("drizzle-orm");
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
      const results = await db.execute(import_drizzle_orm7.sql`
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
   * Get new cost module form data
   */
  async getNewCostModuleForm(req, res) {
    try {
      const formData = {
        costTypes: [
          { value: "fixed", label: "Fixed Cost", description: "One-time cost regardless of impact size" },
          { value: "per_event", label: "Per Event", description: "Cost applied per occurrence" },
          { value: "per_hour", label: "Per Hour", description: "Hourly cost rate" },
          { value: "percentage", label: "Percentage", description: "Percentage of total loss" }
        ],
        cisControls: [
          "1.1",
          "1.2",
          "1.3",
          "1.4",
          "1.5",
          "2.1",
          "2.2",
          "2.3",
          "2.4",
          "2.5",
          "2.6",
          "2.7",
          "3.1",
          "3.2",
          "3.3",
          "3.4",
          "3.5",
          "3.6",
          "3.7",
          "3.8",
          "3.9",
          "3.10",
          "3.11",
          "3.12",
          "4.1",
          "4.2",
          "4.3",
          "4.4",
          "4.5",
          "4.6",
          "4.7",
          "4.8",
          "4.9",
          "4.10",
          "4.11",
          "4.12",
          "5.1",
          "5.2",
          "5.3",
          "5.4",
          "5.5",
          "6.1",
          "6.2",
          "6.3",
          "6.4",
          "6.5",
          "6.6",
          "6.7",
          "6.8",
          "7.1",
          "7.2",
          "7.3",
          "7.4",
          "7.5",
          "7.6",
          "7.7",
          "8.1",
          "8.2",
          "8.3",
          "8.4",
          "8.5",
          "8.6",
          "8.7",
          "8.8",
          "8.9",
          "8.10",
          "8.11",
          "8.12",
          "9.1",
          "9.2",
          "9.3",
          "9.4",
          "9.5",
          "9.6",
          "9.7",
          "10.1",
          "10.2",
          "10.3",
          "10.4",
          "10.5",
          "10.6",
          "10.7",
          "11.1",
          "11.2",
          "11.3",
          "11.4",
          "11.5",
          "12.1",
          "12.2",
          "12.3",
          "12.4",
          "12.5",
          "12.6",
          "12.7",
          "12.8",
          "13.1",
          "13.2",
          "13.3",
          "13.4",
          "13.5",
          "13.6",
          "13.7",
          "13.8",
          "13.9",
          "13.10",
          "13.11",
          "14.1",
          "14.2",
          "14.3",
          "14.4",
          "14.5",
          "14.6",
          "14.7",
          "14.8",
          "14.9",
          "15.1",
          "15.2",
          "15.3",
          "15.4",
          "15.5",
          "15.6",
          "15.7",
          "16.1",
          "16.2",
          "16.3",
          "16.4",
          "16.5",
          "16.6",
          "16.7",
          "16.8",
          "16.9",
          "16.10",
          "16.11",
          "16.12",
          "16.13",
          "16.14",
          "17.1",
          "17.2",
          "17.3",
          "17.4",
          "17.5",
          "17.6",
          "17.7",
          "17.8",
          "17.9",
          "18.1",
          "18.2",
          "18.3",
          "18.4",
          "18.5",
          "19.1",
          "19.2",
          "19.3",
          "19.4",
          "19.5",
          "19.6",
          "19.7"
        ]
      };
      return sendSuccess2(res, formData);
    } catch (error) {
      console.error("Error getting new cost module form:", error);
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
      const result = await db.execute(import_drizzle_orm7.sql`
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
        const cisControlValue = import_drizzle_orm7.sql`ARRAY[${import_drizzle_orm7.sql.join(cisControlArray, import_drizzle_orm7.sql`,`)}]::text[]`;
        const result = await db.execute(import_drizzle_orm7.sql`
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
      const existingResult = await db.execute(import_drizzle_orm7.sql`
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
          cisControlValue = import_drizzle_orm7.sql`ARRAY[${import_drizzle_orm7.sql.join(cisControlArray, import_drizzle_orm7.sql`,`)}]::text[]`;
        } catch (e) {
          console.error("Error processing cisControl:", e);
          return sendError2(res, { message: "Invalid cisControl format" }, 400);
        }
      }
      const updateResult = await db.execute(import_drizzle_orm7.sql`
        UPDATE cost_modules
        SET 
          name = ${name !== void 0 ? name : existing.name},
          ${cisControl !== void 0 ? import_drizzle_orm7.sql`cis_control = ${cisControlValue},` : import_drizzle_orm7.sql``}
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
      const existingResult = await db.execute(import_drizzle_orm7.sql`
        SELECT id FROM cost_modules WHERE id = ${id}
      `);
      if (!existingResult.rows.length) {
        return sendError2(res, { message: `Cost module with ID ${id} not found` }, 404);
      }
      await db.execute(import_drizzle_orm7.sql`
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
router7.get("/new", controller_default.getNewCostModuleForm.bind(controller_default));
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
var import_drizzle_orm8 = require("drizzle-orm");
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
      const result = await db.execute(import_drizzle_orm8.sql`
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
      const riskResult = await db.execute(import_drizzle_orm8.sql`
        SELECT inherent_risk, residual_risk FROM risks WHERE id = ${riskId}
      `);
      if (!riskResult.rows.length) {
        return sendError3(res, { message: "Risk not found" }, 404);
      }
      const risk = riskResult.rows[0];
      const riskMagnitude = parseFloat(risk.inherent_risk) || 0;
      const assignmentsResult = await db.execute(import_drizzle_orm8.sql`
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
        await db.execute(import_drizzle_orm8.sql`BEGIN`);
        await db.execute(import_drizzle_orm8.sql`
          DELETE FROM risk_costs WHERE risk_id = ${riskId}
        `);
        for (const assignment of assignments) {
          const { costModuleId, weight } = assignment;
          if (!costModuleId || typeof costModuleId !== "number") {
            await db.execute(import_drizzle_orm8.sql`ROLLBACK`);
            return sendError3(res, { message: "Each assignment must have a valid costModuleId" }, 400);
          }
          const effectiveWeight = weight || 1;
          console.log(`Inserting cost module ${costModuleId} with weight ${effectiveWeight}`);
          await db.execute(import_drizzle_orm8.sql`
            INSERT INTO risk_costs (risk_id, cost_module_id, weight)
            VALUES (${riskId}, ${costModuleId}, ${effectiveWeight})
          `);
        }
        await db.execute(import_drizzle_orm8.sql`COMMIT`);
        console.log("Risk cost assignments saved successfully");
        return sendSuccess3(res, { message: "Risk cost assignments saved successfully" });
      } catch (error) {
        await db.execute(import_drizzle_orm8.sql`ROLLBACK`);
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
      const risksResult = await db.execute(import_drizzle_orm8.sql`
        SELECT id, risk_id, name, inherent_risk, residual_risk FROM risks
      `);
      if (!risksResult.rows.length) {
        return sendSuccess3(res, []);
      }
      const results = [];
      for (const risk of risksResult.rows) {
        const assignmentsResult = await db.execute(import_drizzle_orm8.sql`
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
var import_express11 = __toESM(require("express"), 1);
init_riskSummaryService();
init_repositoryStorage();

// server/routes/dashboard/iris-benchmarks.ts
var import_express10 = require("express");
init_db();
var router9 = (0, import_express10.Router)();
var IRIS_BENCHMARKS = {
  SMB: {
    geometricMean: 357e3,
    standardDeviation: 1.77,
    logMean: 12.79
  },
  ENTERPRISE: {
    geometricMean: 29e5,
    standardDeviation: 1.95,
    logMean: 14.88
  }
};
function generateExceedanceCurve(geometricMean, standardDeviation, points = 50) {
  const curve = [];
  for (let i = 0; i < points; i++) {
    const probability = 1e-4 + (0.9999 - 1e-4) * (i / (points - 1));
    const zScore = inverseNormalCDF(1 - probability);
    const lnGeometricMean = Math.log(geometricMean);
    const lnImpact = lnGeometricMean + standardDeviation * zScore;
    const impact = Math.exp(lnImpact);
    curve.push({ probability, impact });
  }
  return curve.sort((a, b) => b.probability - a.probability);
}
function inverseNormalCDF(p) {
  if (p <= 0 || p >= 1) return 0;
  const a = [0, -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [0, -54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [0, -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0, 0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  let x = 0;
  let t = 0;
  if (p < 0.5) {
    t = Math.sqrt(-2 * Math.log(p));
    x = (((((c[1] * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) * t + c[6]) / ((((d[1] * t + d[2]) * t + d[3]) * t + d[4]) * t + 1);
  } else {
    t = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[1] * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) * t + c[6]) / ((((d[1] * t + d[2]) * t + d[3]) * t + d[4]) * t + 1);
  }
  return x;
}
router9.get("/", async (req, res) => {
  try {
    const risksQuery = `
      SELECT r.name, r.risk_id, r.severity, 
             CAST(r.residual_risk AS NUMERIC) as residual_risk,
             CAST(r.inherent_risk AS NUMERIC) as inherent_risk
      FROM risks r
      WHERE CAST(r.residual_risk AS NUMERIC) > 0
      ORDER BY CAST(r.residual_risk AS NUMERIC) DESC
    `;
    const client = await pool.connect();
    try {
      const risksResult = await client.query(risksQuery);
      const risks2 = risksResult.rows;
      if (risks2.length === 0) {
        return res.json({
          success: true,
          data: {
            currentRisk: 0,
            totalPortfolioRisk: 0,
            smbBenchmark: IRIS_BENCHMARKS.SMB.geometricMean,
            enterpriseBenchmark: IRIS_BENCHMARKS.ENTERPRISE.geometricMean,
            industryPosition: "below_enterprise",
            maturityScore: 0,
            recommendations: ["No risks found. Consider conducting a risk assessment."],
            riskCount: 0,
            avgRiskSize: 0,
            portfolioComparison: {
              smbMultiple: 0,
              enterpriseMultiple: 0,
              positioning: "No data available"
            }
          }
        });
      }
      const totalPortfolioRisk = risks2.reduce((sum, risk) => sum + parseFloat(risk.residual_risk), 0);
      const avgRiskSize = totalPortfolioRisk / risks2.length;
      const smbMultiple = totalPortfolioRisk / IRIS_BENCHMARKS.SMB.geometricMean;
      const enterpriseMultiple = totalPortfolioRisk / IRIS_BENCHMARKS.ENTERPRISE.geometricMean;
      let industryPosition;
      if (totalPortfolioRisk > IRIS_BENCHMARKS.ENTERPRISE.geometricMean) {
        industryPosition = "above_enterprise";
      } else if (totalPortfolioRisk > IRIS_BENCHMARKS.SMB.geometricMean) {
        industryPosition = "between";
      } else if (totalPortfolioRisk > IRIS_BENCHMARKS.SMB.geometricMean * 0.5) {
        industryPosition = "above_smb";
      } else {
        industryPosition = "below_enterprise";
      }
      const inherentTotal = risks2.reduce((sum, risk) => sum + parseFloat(risk.inherent_risk), 0);
      const riskReduction = inherentTotal > 0 ? (inherentTotal - totalPortfolioRisk) / inherentTotal * 100 : 0;
      const maturityScore = Math.min(100, Math.max(0, riskReduction));
      const recommendations = [];
      if (industryPosition === "above_enterprise") {
        recommendations.push("Risk exposure significantly exceeds enterprise benchmarks");
        recommendations.push("Consider implementing additional risk mitigation controls");
        recommendations.push("Review and strengthen existing security measures");
      } else if (industryPosition === "between") {
        recommendations.push("Risk levels are within enterprise range but above SMB average");
        recommendations.push("Focus on optimizing existing controls for better efficiency");
      } else {
        recommendations.push("Risk exposure is well-managed compared to industry standards");
        recommendations.push("Maintain current security posture and monitor for emerging threats");
      }
      const smbCurve = generateExceedanceCurve(
        IRIS_BENCHMARKS.SMB.geometricMean,
        IRIS_BENCHMARKS.SMB.standardDeviation
      );
      const enterpriseCurve = generateExceedanceCurve(
        IRIS_BENCHMARKS.ENTERPRISE.geometricMean,
        IRIS_BENCHMARKS.ENTERPRISE.standardDeviation
      );
      const benchmarkData = {
        currentRisk: totalPortfolioRisk,
        totalPortfolioRisk,
        smbBenchmark: IRIS_BENCHMARKS.SMB.geometricMean,
        enterpriseBenchmark: IRIS_BENCHMARKS.ENTERPRISE.geometricMean,
        industryPosition,
        maturityScore: Math.round(maturityScore),
        recommendations,
        riskCount: risks2.length,
        avgRiskSize,
        portfolioComparison: {
          smbMultiple: Number(smbMultiple.toFixed(2)),
          enterpriseMultiple: Number(enterpriseMultiple.toFixed(2)),
          positioning: industryPosition === "above_enterprise" ? "Above Enterprise Average" : industryPosition === "between" ? "Between SMB and Enterprise" : industryPosition === "above_smb" ? "Above SMB Average" : "Below Industry Average"
        },
        exceedanceCurves: {
          smb: smbCurve,
          enterprise: enterpriseCurve
        }
      };
      res.json({
        success: true,
        data: benchmarkData
      });
    } catch (error) {
      console.error("Error fetching IRIS benchmarks:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch IRIS benchmarks"
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    res.status(500).json({
      success: false,
      error: "Database connection failed"
    });
  }
});
var iris_benchmarks_default = router9;

// server/routes/dashboard/index.ts
init_db();
var import_drizzle_orm9 = require("drizzle-orm");
var router10 = import_express11.default.Router();
var repository2 = new DatabaseStorage();
router10.get("/summary", async (req, res) => {
  try {
    const risks2 = await riskServiceInstance.getAllRisks();
    const totalRisks = risks2.length;
    const criticalRisks = risks2.filter((r) => r.severity === "critical").length;
    const highRisks = risks2.filter((r) => r.severity === "high").length;
    const mediumRisks = risks2.filter((r) => r.severity === "medium").length;
    const lowRisks = risks2.filter((r) => r.severity === "low").length;
    const operationalRisks = risks2.filter((r) => r.riskCategory === "operational").length;
    const strategicRisks = risks2.filter((r) => r.riskCategory === "strategic").length;
    const complianceRisks = risks2.filter((r) => r.riskCategory === "compliance").length;
    const financialRisks = risks2.filter((r) => r.riskCategory === "financial").length;
    let totalInherentRisk = 0;
    let totalResidualRisk = 0;
    console.log(`[Dashboard] Processing ${risks2.length} risks for exposure calculation`);
    risks2.forEach((risk, index) => {
      const inherentRiskValue = parseFloat(risk.inherentRisk) || 0;
      const residualRiskValue = parseFloat(risk.residualRisk) || 0;
      if (index < 3) {
        console.log(`[Dashboard] Risk ${risk.riskId}: inherent=${risk.inherentRisk} (${inherentRiskValue}), residual=${risk.residualRisk} (${residualRiskValue})`);
      }
      totalInherentRisk += inherentRiskValue;
      totalResidualRisk += residualRiskValue;
    });
    console.log(`[Dashboard] Total calculated exposure - Inherent: ${totalInherentRisk}, Residual: ${totalResidualRisk}`);
    const controls2 = await controlServiceInstance.getAllControls();
    const implementedControls = controls2.filter((c) => c.implementationStatus === "fully_implemented").length;
    const inProgressControls = controls2.filter((c) => c.implementationStatus === "in_progress").length;
    const plannedControls = controls2.filter((c) => c.implementationStatus === "planned").length;
    const notImplementedControls = controls2.filter((c) => c.implementationStatus === "not_implemented").length;
    const assets2 = await assetServiceInstance.getAllAssets();
    const activityQuery = await db.execute(import_drizzle_orm9.sql`SELECT activity, "user", entity, entity_type, entity_id, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 10`);
    const recentLogs = activityQuery.rows || [];
    const exposureCurveData = [];
    const sortedRisks = [...risks2].filter((r) => parseFloat(r.residualRisk) > 0).sort((a, b) => parseFloat(b.residualRisk) - parseFloat(a.residualRisk));
    if (sortedRisks.length > 0) {
      sortedRisks.forEach((risk, index) => {
        const impact = parseFloat(risk.residualRisk);
        const probability = (index + 1) / sortedRisks.length;
        exposureCurveData.push({ impact, probability });
      });
    }
    const residualValues = risks2.map((r) => parseFloat(r.residualRisk)).filter((v) => v > 0).sort((a, b) => b - a);
    const minimumExposure = residualValues.length > 0 ? Math.min(...residualValues) : 0;
    const maximumExposure = residualValues.length > 0 ? Math.max(...residualValues) : 0;
    const meanExposure = residualValues.length > 0 ? residualValues.reduce((a, b) => a + b, 0) / residualValues.length : 0;
    const medianExposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length / 2)] : 0;
    const percentile95Exposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length * 0.05)] || maximumExposure : 0;
    const percentile99Exposure = residualValues.length > 0 ? residualValues[Math.floor(residualValues.length * 0.01)] || maximumExposure : 0;
    console.log(`[Dashboard] Calculated exposure metrics - Min: ${minimumExposure}, Max: ${maximumExposure}, Mean: ${meanExposure}`);
    return sendSuccess(res, {
      riskSummary: {
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        totalInherentRisk,
        totalResidualRisk,
        riskReduction: totalInherentRisk > 0 ? (1 - totalResidualRisk / totalInherentRisk) * 100 : 0,
        // Use freshly calculated exposure curve data
        exposureCurveData,
        minimumExposure,
        maximumExposure,
        meanExposure,
        medianExposure,
        percentile95Exposure,
        percentile99Exposure
      },
      riskByCategory: {
        operational: operationalRisks,
        strategic: strategicRisks,
        compliance: complianceRisks,
        financial: financialRisks
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
router10.get("/risk-summary/latest", async (req, res) => {
  try {
    const { entityId } = req.query;
    const summary = await riskSummaryService.getLatestRiskSummary(entityId);
    if (!summary) {
      return sendError(res, { message: "No risk summary found" }, 404);
    }
    return sendSuccess(res, summary);
  } catch (error) {
    return sendError(res, error);
  }
});
router10.post("/risk-summary/force-update", async (req, res) => {
  try {
    console.log("Force updating risk summaries...");
    await riskSummaryService.updateRiskSummaries();
    console.log("Risk summaries force update completed");
    return sendSuccess(res, { message: "Risk summaries updated successfully" });
  } catch (error) {
    console.error("Error force updating risk summaries:", error);
    return sendError(res, error);
  }
});
router10.use("/iris-benchmarks", iris_benchmarks_default);
var dashboard_default = router10;

// server/routes/logs/index.ts
var import_express12 = require("express");

// server/auth.ts
var import_passport = __toESM(require("passport"), 1);
var import_passport_local = require("passport-local");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
init_db();
init_schema();
var import_drizzle_orm10 = require("drizzle-orm");
var configurePassport = () => {
  import_passport.default.use(new import_passport_local.Strategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
      try {
        const [user] = await db.select().from(users).where((0, import_drizzle_orm10.and)(
          (0, import_drizzle_orm10.eq)(users.username, username),
          (0, import_drizzle_orm10.eq)(users.authType, "local"),
          (0, import_drizzle_orm10.eq)(users.isActive, true)
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
          await db.update(users).set({
            failedLoginAttempts: failedAttempts,
            lastFailedLogin: /* @__PURE__ */ new Date(),
            // Lock account after 5 failed attempts for 5 minutes
            ...failedAttempts >= 5 && {
              accountLockedUntil: new Date(Date.now() + 5 * 60 * 1e3)
            }
          }).where((0, import_drizzle_orm10.eq)(users.id, user.id));
          return done(null, false, { message: "Invalid username or password" });
        }
        await db.update(users).set({
          failedLoginAttempts: 0,
          lastFailedLogin: null,
          accountLockedUntil: null,
          lastLogin: /* @__PURE__ */ new Date(),
          loginCount: (user.loginCount || 0) + 1
        }).where((0, import_drizzle_orm10.eq)(users.id, user.id));
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
            const [existingUser] = await db.select().from(users).where((0, import_drizzle_orm10.eq)(users.sub, profile.id));
            if (existingUser) {
              await db.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm10.eq)(users.id, existingUser.id));
              return done(null, existingUser);
            }
            const [newUser] = await db.insert(users).values({
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
      const [user] = await db.select().from(users).where((0, import_drizzle_orm10.eq)(users.id, id));
      done(null, user || null);
    } catch (err) {
      done(err);
    }
  });
  console.log("Passport strategies configured");
};
var isAuthenticated = (req, res, next) => {
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
var isAdmin = (req, res, next) => {
  if (false) {
    return next();
  }
  if (req.isAuthenticated() && req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

// server/routes/logs/index.ts
var router11 = (0, import_express12.Router)();
router11.get("/activity-logs", isAuthenticated, async (req, res) => {
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
var logs_default = router11;

// server/routes/enterprise-architecture/index.ts
var import_express13 = __toESM(require("express"), 1);
init_db();
init_schema();
var import_drizzle_orm11 = require("drizzle-orm");
var router12 = import_express13.default.Router();
router12.get("/", async (req, res) => {
  try {
    const items = await db.select().from(enterpriseArchitecture);
    return sendSuccess3(res, items);
  } catch (error) {
    return sendError3(res, "Error fetching enterprise architecture items", error);
  }
});
router12.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError3(res, "Invalid ID format");
    }
    const [item] = await db.select().from(enterpriseArchitecture).where((0, import_drizzle_orm11.eq)(enterpriseArchitecture.id, id));
    if (!item) {
      return sendError3(res, "Item not found");
    }
    return sendSuccess3(res, item);
  } catch (error) {
    return sendError3(res, "Error fetching enterprise architecture item", error);
  }
});
router12.post("/", async (req, res) => {
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
    const [newItem] = await db.insert(enterpriseArchitecture).values(data).returning();
    return sendSuccess3(res, newItem);
  } catch (error) {
    return sendError3(res, "Error creating enterprise architecture item", error);
  }
});
router12.put("/:id", async (req, res) => {
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
    const [updatedItem] = await db.update(enterpriseArchitecture).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm11.eq)(enterpriseArchitecture.id, id)).returning();
    if (!updatedItem) {
      return sendError3(res, "Item not found", null, 404);
    }
    return sendSuccess3(res, updatedItem);
  } catch (error) {
    return sendError3(res, "Error updating enterprise architecture item", error);
  }
});
router12.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendError3(res, "Invalid ID format");
    }
    const [deletedItem] = await db.delete(enterpriseArchitecture).where((0, import_drizzle_orm11.eq)(enterpriseArchitecture.id, id)).returning();
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
var enterprise_architecture_default = router12;

// server/routes/auth.ts
var import_express14 = require("express");
init_db();
init_schema();
var import_drizzle_orm12 = require("drizzle-orm");
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var router13 = (0, import_express14.Router)();
router13.post("/auth/login/local", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password required"
      });
    }
    const [user] = await db.select().from(users).where((0, import_drizzle_orm12.eq)(users.username, username)).limit(1);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }
    const isValidPassword = await import_bcryptjs2.default.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }
    console.log("PRODUCTION LOGIN DEBUG - Before session creation:", {
      hasSession: !!req.session,
      sessionId: req.session?.id,
      nodeEnv: "production",
      secure: req.secure,
      protocol: req.protocol,
      headers: {
        host: req.headers.host,
        "x-forwarded-proto": req.headers["x-forwarded-proto"]
      }
    });
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username,
      role: user.role,
      authType: "local"
    };
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("Session save error:", saveErr);
        return res.status(500).json({
          success: false,
          error: "Session save failed"
        });
      }
      console.log("PRODUCTION LOGIN SUCCESS - Session saved:", {
        sessionId: req.session.id,
        userId: req.session.user?.id,
        username: req.session.user?.username,
        cookieConfig: {
          secure: req.secure,
          sameSite: true ? "none" : "strict"
        }
      });
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName || user.username,
          role: user.role,
          authType: "local"
        }
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed"
    });
  }
});
router13.get("/auth/user", async (req, res) => {
  try {
    const session2 = req.session;
    console.log("Production /auth/user check:", {
      sessionExists: !!session2,
      sessionId: session2?.id,
      hasUser: !!session2?.user,
      cookies: req.headers.cookie ? "present" : "missing",
      host: req.headers.host,
      protocol: req.protocol,
      forwardedProto: req.get("x-forwarded-proto"),
      isSecure: req.secure
    });
    if (!session2?.user) {
      return res.status(401).json({
        success: false,
        error: "Not authenticated"
      });
    }
    res.json({
      id: session2.user.id,
      username: session2.user.username,
      email: session2.user.email,
      displayName: session2.user.displayName,
      role: session2.user.role,
      authType: session2.user.authType
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user"
    });
  }
});
router13.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({
        success: false,
        error: "Logout failed"
      });
    }
    res.json({ success: true });
  });
});
var auth_default = router13;

// server/routes/admin.ts
var import_express15 = __toESM(require("express"), 1);
init_riskSummaryService();
var router14 = import_express15.default.Router();
router14.post("/recalculate-summaries", isAdmin, async (req, res) => {
  try {
    await riskSummaryService.recalculateAllSummaries();
    return sendSuccess(res, {
      message: "Risk summaries recalculated successfully",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Error in admin recalculate summaries:", error);
    return sendError(res, error);
  }
});
router14.get("/risk-summary/latest", isAdmin, async (req, res) => {
  try {
    const { entityId } = req.query;
    const summary = await riskSummaryService.getLatestRiskSummary(entityId);
    if (!summary) {
      return sendError(res, { message: "No risk summary found" }, 404);
    }
    return sendSuccess(res, summary);
  } catch (error) {
    console.error("Error getting latest risk summary:", error);
    return sendError(res, error);
  }
});
var admin_default = router14;

// server/routes/vulnerabilities.ts
var import_express16 = __toESM(require("express"), 1);
var import_drizzle_orm13 = require("drizzle-orm");
var router15 = import_express16.default.Router();
router15.get("/", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilities: vulnerabilities2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const result = await db3.execute(import_drizzle_orm13.sql`SELECT id, title, description, severity, status, discovered_date as "discoveredDate", created_at as "createdAt" FROM vulnerabilities LIMIT 50`);
    sendSuccess(res, result.rows || []);
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error);
    sendError(res, "Failed to fetch vulnerabilities", 500);
  }
});
router15.get("/:id", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilities: vulnerabilities2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const { eq: eq15 } = await import("drizzle-orm");
    const vulnerabilityId = parseInt(req.params.id);
    const vulnerability = await db3.select({
      id: vulnerabilities2.id,
      cve_id: vulnerabilities2.cveId,
      title: vulnerabilities2.title,
      description: vulnerabilities2.description,
      discovery_date: vulnerabilities2.discoveryDate,
      severity_cvss3: vulnerabilities2.severityCvss3,
      patchable: vulnerabilities2.patchable,
      source: vulnerabilities2.source,
      created_at: vulnerabilities2.createdAt,
      updated_at: vulnerabilities2.updatedAt,
      severity: vulnerabilities2.severity,
      status: vulnerabilities2.status,
      e_detect: vulnerabilities2.eDetect,
      e_resist: vulnerabilities2.eResist,
      remediation: vulnerabilities2.remediation
    }).from(vulnerabilities2).where(eq15(vulnerabilities2.id, vulnerabilityId));
    if (vulnerability.length === 0) {
      return sendError(res, "Vulnerability not found", 404);
    }
    sendSuccess(res, vulnerability[0]);
  } catch (error) {
    console.error("Error fetching vulnerability:", error);
    sendError(res, "Failed to fetch vulnerability", 500);
  }
});
router15.post("/", async (req, res) => {
  try {
    const { db: db3 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const { vulnerabilities: vulnerabilities2, vulnerabilityAssets: vulnerabilityAssets2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const {
      cveId,
      title,
      description,
      cvssScore,
      severity,
      status,
      eDetectImpact,
      eResistImpact,
      selectedAssets,
      remediation,
      references
    } = req.body;
    const [newVulnerability] = await db3.insert(vulnerabilities2).values({
      cveId,
      title,
      description,
      severityCvss3: cvssScore?.toString() || "0",
      severity,
      status,
      eDetect: eDetectImpact?.toString() || null,
      eResist: eResistImpact?.toString() || null,
      source: "manual"
    }).returning();
    if (selectedAssets && selectedAssets.length > 0) {
      const assetAssociations = selectedAssets.map((assetId) => ({
        vulnerabilityId: newVulnerability.id,
        assetId
      }));
      await db3.insert(vulnerabilityAssets2).values(assetAssociations);
    }
    sendSuccess(res, newVulnerability);
  } catch (error) {
    console.error("Error creating vulnerability:", error);
    sendError(res, "Failed to create vulnerability", 500);
  }
});
var vulnerabilities_default = router15;

// server/routes/reports.ts
var import_express17 = __toESM(require("express"), 1);
var router16 = import_express17.default.Router();
router16.get("/", async (req, res) => {
  try {
    const reports = [
      {
        id: "risk-summary",
        name: "Risk Summary Report",
        description: "Comprehensive risk assessment across the organization",
        type: "executive"
      },
      {
        id: "control-effectiveness",
        name: "Control Effectiveness Report",
        description: "Analysis of security control implementation and effectiveness",
        type: "operational"
      },
      {
        id: "asset-risk-matrix",
        name: "Asset Risk Matrix",
        description: "Risk exposure breakdown by asset category",
        type: "technical"
      }
    ];
    sendSuccess(res, reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    sendError(res, "Failed to fetch reports", 500);
  }
});
router16.get("/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    let reportData;
    switch (reportId) {
      case "risk-summary":
        const risks2 = await storage.getRisks();
        reportData = {
          title: "Risk Summary Report",
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          summary: {
            totalRisks: risks2.length,
            criticalRisks: risks2.filter((r) => r.inherentRiskLevel === "critical").length,
            highRisks: risks2.filter((r) => r.inherentRiskLevel === "high").length
          },
          risks: risks2
        };
        break;
      case "control-effectiveness":
        const controls2 = await storage.getControls();
        reportData = {
          title: "Control Effectiveness Report",
          generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          summary: {
            totalControls: controls2.length,
            implementedControls: controls2.filter((c) => c.implementationStatus === "implemented").length
          },
          controls: controls2
        };
        break;
      default:
        return sendError(res, "Report not found", 404);
    }
    sendSuccess(res, reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    sendError(res, "Failed to generate report", 500);
  }
});
var reports_default = router16;

// server/routes/integrations.ts
var import_express18 = __toESM(require("express"), 1);
var router17 = import_express18.default.Router();
router17.get("/", async (req, res) => {
  try {
    const integrations = [
      {
        id: "jira",
        name: "Jira Integration",
        description: "Connect with Jira for issue tracking and project management",
        status: "available",
        configured: false
      },
      {
        id: "iris-2025",
        name: "IRIS 2025 Benchmarks",
        description: "Industry risk intelligence and benchmarking data",
        status: "active",
        configured: true
      },
      {
        id: "openai",
        name: "OpenAI Integration",
        description: "AI-powered risk analysis and recommendations",
        status: "available",
        configured: false
      },
      {
        id: "vulnerability-scanner",
        name: "Vulnerability Scanner",
        description: "Automated vulnerability assessment integration",
        status: "available",
        configured: false
      },
      {
        id: "backstage",
        name: "Backstage Integration",
        description: "Import service catalog from on-premise Backstage deployment",
        status: "available",
        configured: false
      }
    ];
    sendSuccess(res, integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    sendError(res, "Failed to fetch integrations", 500);
  }
});
router17.get("/:id", async (req, res) => {
  try {
    const integrationId = req.params.id;
    const integration = {
      id: integrationId,
      name: `${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} Integration`,
      status: integrationId === "iris-2025" ? "active" : "available",
      configured: integrationId === "iris-2025",
      settings: {},
      lastSync: integrationId === "iris-2025" ? (/* @__PURE__ */ new Date()).toISOString() : null
    };
    sendSuccess(res, integration);
  } catch (error) {
    console.error("Error fetching integration:", error);
    sendError(res, "Failed to fetch integration", 500);
  }
});
router17.post("/:id/configure", async (req, res) => {
  try {
    const integrationId = req.params.id;
    const settings = req.body;
    const result = {
      id: integrationId,
      configured: true,
      settings,
      message: `${integrationId} integration configured successfully`
    };
    sendSuccess(res, result);
  } catch (error) {
    console.error("Error configuring integration:", error);
    sendError(res, "Failed to configure integration", 500);
  }
});
var integrations_default = router17;

// server/routes/backstage.ts
var import_express19 = __toESM(require("express"), 1);
var import_zod6 = require("zod");

// server/integrations/backstage.ts
var import_axios = __toESM(require("axios"), 1);
init_db();
init_schema();
var import_drizzle_orm14 = require("drizzle-orm");
var BackstageClient = class {
  client;
  config;
  constructor(config) {
    this.config = config;
    this.client = import_axios.default.create({
      baseURL: config.baseUrl,
      headers: {
        "Content-Type": "application/json",
        ...config.token && { "Authorization": `Bearer ${config.token}` }
      },
      timeout: 3e4
    });
  }
  /**
   * Test connection to Backstage
   */
  async testConnection() {
    try {
      const response = await this.client.get("/api/catalog/entities", {
        params: { limit: 1 }
      });
      return {
        success: true,
        message: `Connected to Backstage. Found ${response.data.length || 0} entities.`
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }
  /**
   * Fetch entities from Backstage catalog
   */
  async fetchEntities(filter) {
    const entities = [];
    let offset = 0;
    const limit = 100;
    try {
      while (true) {
        const params = {
          limit,
          offset
        };
        if (filter || this.config.catalogFilter) {
          params.filter = filter || this.config.catalogFilter;
        }
        const response = await this.client.get("/api/catalog/entities", { params });
        const batch = response.data || [];
        if (batch.length === 0) break;
        entities.push(...batch);
        offset += batch.length;
        if (offset > 1e4) {
          console.warn("[Backstage] Stopping fetch at 10,000 entities limit");
          break;
        }
      }
      console.log(`[Backstage] Fetched ${entities.length} entities from catalog`);
      return entities;
    } catch (error) {
      console.error("[Backstage] Error fetching entities:", error.message);
      throw new Error(`Failed to fetch entities: ${error.message}`);
    }
  }
  /**
   * Transform Backstage entity to platform asset
   */
  transformEntityToAsset(entity) {
    const { metadata, spec, kind } = entity;
    let assetType = "application_service";
    if (kind === "API") assetType = "technical_component";
    if (kind === "Resource") {
      if (spec?.type === "database") assetType = "data";
      else if (spec?.type === "queue") assetType = "system";
      else assetType = "system";
    }
    if (kind === "System") assetType = "application";
    const namespace = metadata.namespace || this.config.namespace || "default";
    const assetId = `BST-${namespace.toUpperCase()}-${metadata.name.toUpperCase()}`;
    const assetData = {
      assetId,
      name: metadata.title || metadata.name,
      description: metadata.description || `${kind} from Backstage catalog`,
      assetType,
      assetStatus: spec?.lifecycle === "deprecated" ? "Decommissioned" : "Active",
      owner: spec?.owner || "Unknown",
      tags: metadata.tags || [],
      businessCriticalityRating: this.mapCriticalityFromLabels(metadata.labels),
      ciaConfidentialityRating: "medium",
      ciaIntegrityRating: "medium",
      ciaAvailabilityRating: "medium",
      externalInternal: "internal",
      backstageEntityRef: `${kind}:${namespace}/${metadata.name}`,
      backstageMetadata: {
        kind,
        namespace,
        uid: metadata.uid,
        labels: metadata.labels,
        annotations: metadata.annotations,
        spec,
        lastSyncAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
    const relationships = [];
    if (spec?.dependsOn) {
      spec.dependsOn.forEach((dep) => {
        relationships.push({ type: "depends_on", targetRef: dep });
      });
    }
    if (spec?.system) {
      relationships.push({ type: "part_of", targetRef: `system:${namespace}/${spec.system}` });
    }
    if (entity.relations) {
      relationships.push(...entity.relations);
    }
    return { assetData, relationships };
  }
  /**
   * Map business criticality from Backstage labels
   */
  mapCriticalityFromLabels(labels) {
    if (!labels) return "medium";
    const criticality = labels["backstage.io/business-criticality"] || labels["criticality"] || labels["tier"];
    switch (criticality?.toLowerCase()) {
      case "critical":
      case "tier-1":
      case "high":
        return "high";
      case "low":
      case "tier-3":
        return "low";
      default:
        return "medium";
    }
  }
  /**
   * Sync entities to platform assets
   */
  async syncEntities(dryRun = false) {
    const result = {
      success: false,
      entitiesProcessed: 0,
      assetsCreated: 0,
      assetsUpdated: 0,
      relationshipsCreated: 0,
      errors: [],
      summary: ""
    };
    try {
      console.log("[Backstage] Starting entity sync...");
      const entities = await this.fetchEntities();
      result.entitiesProcessed = entities.length;
      if (dryRun) {
        result.summary = `Dry run completed. Would process ${entities.length} entities.`;
        result.success = true;
        return result;
      }
      const relationshipsToCreate = [];
      for (const entity of entities) {
        try {
          const { assetData, relationships } = this.transformEntityToAsset(entity);
          const existingAsset = await db.select().from(assets).where((0, import_drizzle_orm14.eq)(assets.backstageEntityRef, assetData.backstageEntityRef)).limit(1);
          if (existingAsset.length > 0) {
            await db.update(assets).set({
              ...assetData,
              updatedAt: /* @__PURE__ */ new Date()
            }).where((0, import_drizzle_orm14.eq)(assets.id, existingAsset[0].id));
            result.assetsUpdated++;
          } else {
            await db.insert(assets).values({
              ...assetData,
              createdAt: /* @__PURE__ */ new Date(),
              updatedAt: /* @__PURE__ */ new Date()
            });
            result.assetsCreated++;
          }
          relationships.forEach((rel) => {
            relationshipsToCreate.push({
              assetId: assetData.assetId,
              targetRef: rel.targetRef,
              type: rel.type
            });
          });
        } catch (error) {
          result.errors.push(`Entity ${entity.metadata.name}: ${error.message}`);
          console.error(`[Backstage] Error processing entity ${entity.metadata.name}:`, error);
        }
      }
      await this.createRelationships(relationshipsToCreate);
      result.relationshipsCreated = relationshipsToCreate.length;
      result.success = true;
      result.summary = `Sync completed: ${result.assetsCreated} created, ${result.assetsUpdated} updated, ${result.relationshipsCreated} relationships created`;
      console.log("[Backstage] Sync completed:", result.summary);
    } catch (error) {
      result.errors.push(`Sync failed: ${error.message}`);
      console.error("[Backstage] Sync failed:", error);
    }
    return result;
  }
  /**
   * Create asset relationships
   */
  async createRelationships(relationships) {
    for (const rel of relationships) {
      try {
        const targetAsset = await db.select().from(assets).where((0, import_drizzle_orm14.eq)(assets.backstageEntityRef, rel.targetRef)).limit(1);
        if (targetAsset.length === 0) {
          console.warn(`[Backstage] Target asset not found for relationship: ${rel.targetRef}`);
          continue;
        }
        const sourceAsset = await db.select().from(assets).where((0, import_drizzle_orm14.eq)(assets.assetId, rel.assetId)).limit(1);
        if (sourceAsset.length === 0) {
          console.warn(`[Backstage] Source asset not found: ${rel.assetId}`);
          continue;
        }
        const existingRel = await db.select().from(assetRelationships).where(
          (0, import_drizzle_orm14.and)(
            (0, import_drizzle_orm14.eq)(assetRelationships.sourceAssetId, sourceAsset[0].id),
            (0, import_drizzle_orm14.eq)(assetRelationships.targetAssetId, targetAsset[0].id),
            (0, import_drizzle_orm14.eq)(assetRelationships.relationshipType, rel.type)
          )
        ).limit(1);
        if (existingRel.length === 0) {
          await db.insert(assetRelationships).values({
            sourceAssetId: sourceAsset[0].id,
            targetAssetId: targetAsset[0].id,
            relationshipType: rel.type,
            createdAt: /* @__PURE__ */ new Date()
          });
        }
      } catch (error) {
        console.error(`[Backstage] Error creating relationship:`, error);
      }
    }
  }
};
var backstage_default = BackstageClient;

// server/routes/backstage.ts
init_db();
init_schema();
var import_drizzle_orm15 = require("drizzle-orm");
var router18 = import_express19.default.Router();
var backstageConfigSchema = import_zod6.z.object({
  baseUrl: import_zod6.z.string().url(),
  token: import_zod6.z.string().optional(),
  namespace: import_zod6.z.string().default("default"),
  catalogFilter: import_zod6.z.string().optional(),
  syncInterval: import_zod6.z.string().default("1h")
});
router18.post("/test-connection", async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const client = new backstage_default(config);
    const result = await client.testConnection();
    if (result.success) {
      sendSuccess3(res, result);
    } else {
      sendError3(res, result.message, 400);
    }
  } catch (error) {
    console.error("Error testing Backstage connection:", error);
    if (error instanceof import_zod6.z.ZodError) {
      sendError3(res, "Invalid configuration", 400, error.errors);
    } else {
      sendError3(res, "Failed to test connection", 500);
    }
  }
});
router18.post("/sync", async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const dryRun = req.query.dryRun === "true";
    const client = new backstage_default(config);
    const startTime = Date.now();
    console.log(`[Backstage] Starting ${dryRun ? "dry run" : "sync"}...`);
    const result = await client.syncEntities(dryRun);
    const syncDuration = Date.now() - startTime;
    if (!dryRun) {
      await db.insert(backstageSyncLogs).values({
        syncType: "manual",
        entitiesProcessed: result.entitiesProcessed,
        assetsCreated: result.assetsCreated,
        assetsUpdated: result.assetsUpdated,
        relationshipsCreated: result.relationshipsCreated,
        syncStatus: result.success ? "success" : "failed",
        errorDetails: result.errors.length > 0 ? result.errors : null,
        syncDuration
      });
    }
    sendSuccess3(res, {
      ...result,
      syncDuration,
      dryRun
    });
  } catch (error) {
    console.error("Error syncing Backstage entities:", error);
    await db.insert(backstageSyncLogs).values({
      syncType: "manual",
      syncStatus: "failed",
      errorDetails: [error.message],
      syncDuration: 0
    });
    if (error instanceof import_zod6.z.ZodError) {
      sendError3(res, "Invalid configuration", 400, error.errors);
    } else {
      sendError3(res, "Sync failed", 500);
    }
  }
});
router18.get("/sync-history", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const syncHistory = await db.select().from(backstageSyncLogs).orderBy(backstageSyncLogs.createdAt).limit(limit);
    sendSuccess3(res, syncHistory);
  } catch (error) {
    console.error("Error fetching sync history:", error);
    sendError3(res, "Failed to fetch sync history", 500);
  }
});
router18.get("/assets", async (req, res) => {
  try {
    const backstageAssets = await db.select().from(assets).where((0, import_drizzle_orm15.eq)(assets.backstageEntityRef, assets.backstageEntityRef)).orderBy(assets.lastBackstageSync);
    const validAssets = backstageAssets.filter((asset) => asset.backstageEntityRef);
    sendSuccess3(res, validAssets);
  } catch (error) {
    console.error("Error fetching Backstage assets:", error);
    sendError3(res, "Failed to fetch Backstage assets", 500);
  }
});
router18.post("/entities/preview", async (req, res) => {
  try {
    const config = backstageConfigSchema.parse(req.body);
    const limit = parseInt(req.query.limit) || 10;
    const client = new backstage_default(config);
    const entities = await client.fetchEntities();
    const preview = entities.slice(0, limit).map((entity) => {
      const { assetData } = client.transformEntityToAsset(entity);
      return {
        entityRef: `${entity.kind}:${entity.metadata.namespace || "default"}/${entity.metadata.name}`,
        name: entity.metadata.title || entity.metadata.name,
        kind: entity.kind,
        type: entity.spec?.type,
        owner: entity.spec?.owner,
        lifecycle: entity.spec?.lifecycle,
        description: entity.metadata.description,
        willCreateAsset: assetData
      };
    });
    sendSuccess3(res, {
      totalEntities: entities.length,
      preview,
      previewCount: preview.length
    });
  } catch (error) {
    console.error("Error previewing Backstage entities:", error);
    if (error instanceof import_zod6.z.ZodError) {
      sendError3(res, "Invalid configuration", 400, error.errors);
    } else {
      sendError3(res, "Failed to preview entities", 500);
    }
  }
});
router18.delete("/assets", async (req, res) => {
  try {
    const result = await db.delete(assets).where((0, import_drizzle_orm15.eq)(assets.backstageEntityRef, assets.backstageEntityRef)).returning({ id: assets.id });
    const deletedCount = result.filter((r) => r.id).length;
    sendSuccess3(res, {
      message: `Removed ${deletedCount} Backstage assets`,
      deletedCount
    });
  } catch (error) {
    console.error("Error removing Backstage assets:", error);
    sendError3(res, "Failed to remove Backstage assets", 500);
  }
});
var backstage_default2 = router18;

// server/routes/risk-summary/index.ts
var import_express20 = __toESM(require("express"), 1);
init_riskSummaryService();
var router19 = import_express20.default.Router();
router19.get("/latest", async (req, res) => {
  try {
    const { entityId } = req.query;
    const summary = await riskSummaryService.getLatestRiskSummary(entityId);
    if (!summary) {
      return sendError(res, { message: "No risk summary found" }, 404);
    }
    return sendSuccess(res, summary);
  } catch (error) {
    return sendError(res, error);
  }
});
var risk_summary_default = router19;

// server/routes/controlMappings.ts
var import_express21 = require("express");
init_db();
var router20 = (0, import_express21.Router)();
router20.get("/assets", async (req, res) => {
  try {
    const mappings = await pool.query(`
      SELECT * FROM control_asset_mappings 
      ORDER BY relevance_score DESC, control_id
    `);
    return sendSuccess(res, mappings.rows);
  } catch (error) {
    console.error("Error fetching asset mappings:", error);
    return sendError(res, error);
  }
});
router20.post("/assets", async (req, res) => {
  try {
    const { control_id, asset_type, relevance_score, reasoning } = req.body;
    if (!control_id || !asset_type || !reasoning) {
      return sendError(res, new Error("Missing required fields"), 400);
    }
    const result = await pool.query(`
      INSERT INTO control_asset_mappings (control_id, asset_type, relevance_score, reasoning)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (control_id, asset_type) 
      DO UPDATE SET relevance_score = EXCLUDED.relevance_score, reasoning = EXCLUDED.reasoning
      RETURNING *
    `, [control_id, asset_type, relevance_score || 50, reasoning]);
    return sendSuccess(res, result.rows[0]);
  } catch (error) {
    console.error("Error creating asset mapping:", error);
    return sendError(res, error);
  }
});
router20.delete("/assets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      DELETE FROM control_asset_mappings WHERE id = $1 RETURNING *
    `, [id]);
    if (result.rows.length === 0) {
      return sendError(res, new Error("Asset mapping not found"), 404);
    }
    return sendSuccess(res, { message: "Asset mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset mapping:", error);
    return sendError(res, error);
  }
});
router20.get("/risks", async (req, res) => {
  try {
    const mappings = await pool.query(`
      SELECT * FROM control_risk_mappings 
      ORDER BY relevance_score DESC, control_id
    `);
    return sendSuccess(res, mappings.rows);
  } catch (error) {
    console.error("Error fetching risk mappings:", error);
    return sendError(res, error);
  }
});
router20.post("/risks", async (req, res) => {
  try {
    const {
      control_id,
      risk_library_id,
      relevance_score,
      impact_type,
      reasoning
    } = req.body;
    if (!control_id || !risk_library_id || !reasoning) {
      return sendError(res, new Error("Control ID, Risk Library ID, and reasoning are required"), 400);
    }
    const result = await pool.query(`
      INSERT INTO control_risk_mappings 
      (control_id, risk_library_id, relevance_score, impact_type, reasoning)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      control_id,
      risk_library_id,
      relevance_score || 50,
      impact_type || "both",
      reasoning
    ]);
    return sendSuccess(res, result.rows[0]);
  } catch (error) {
    console.error("Error creating risk mapping:", error);
    return sendError(res, error);
  }
});
router20.delete("/risks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      DELETE FROM control_risk_mappings WHERE id = $1 RETURNING *
    `, [id]);
    if (result.rows.length === 0) {
      return sendError(res, new Error("Risk mapping not found"), 404);
    }
    return sendSuccess(res, { message: "Risk mapping deleted successfully" });
  } catch (error) {
    console.error("Error deleting risk mapping:", error);
    return sendError(res, error);
  }
});
var controlMappings_default = router20;

// server/routes/risks/controlSuggestions.ts
var import_express22 = require("express");

// server/services/controlSuggestionEngine.ts
init_db();
init_schema();
var import_drizzle_orm16 = require("drizzle-orm");
function categorizeControlImpact(control) {
  const name = (control.name || "").toLowerCase();
  const description = (control.description || "").toLowerCase();
  const controlType = (control.control_type || "").toLowerCase();
  if (name.includes("mfa") || name.includes("authentication") || name.includes("access control") || name.includes("firewall") || name.includes("antivirus") || name.includes("prevention") || controlType === "preventive") {
    return {
      category: "likelihood",
      score: 85,
      reasoning: "Preventive control that reduces attack probability"
    };
  }
  if (name.includes("backup") || name.includes("recovery") || name.includes("insurance") || name.includes("redundancy") || name.includes("encryption") || name.includes("isolation")) {
    return {
      category: "magnitude",
      score: 80,
      reasoning: "Control that limits impact when incidents occur"
    };
  }
  if (name.includes("monitoring") || name.includes("siem") || name.includes("logging") || controlType === "detective") {
    return {
      category: "both",
      score: 75,
      reasoning: "Detective control that reduces both likelihood and impact"
    };
  }
  return {
    category: "likelihood",
    score: 60,
    reasoning: "General security control with moderate effectiveness"
  };
}
async function getControlSuggestions(riskId) {
  try {
    let risk;
    risk = await db.select().from(risks).where((0, import_drizzle_orm16.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0 && /^\d+$/.test(riskId)) {
      risk = await db.select().from(risks).where((0, import_drizzle_orm16.eq)(risks.id, parseInt(riskId))).limit(1);
    }
    if (risk.length === 0) {
      const partialResults = await db.execute(import_drizzle_orm16.sql`SELECT * FROM risks WHERE risk_id LIKE ${"%-" + riskId} LIMIT 1`);
      if (Array.isArray(partialResults) && partialResults.length > 0) {
        risk = partialResults;
      }
    }
    if (risk.length === 0) {
      throw new Error("Risk not found");
    }
    const riskData = risk[0];
    console.log(`[ControlSuggestions] Risk data:`, { id: riskData.id, riskId: riskData.riskId, category: riskData.riskCategory });
    console.log(`[ControlSuggestions] Testing database connection...`);
    let relevantControls = [];
    try {
      const testResult = await db.execute(import_drizzle_orm16.sql`SELECT COUNT(*) as count FROM control_library`);
      console.log(`[ControlSuggestions] Control library has ${testResult[0]?.count || 0} records`);
      const mappingResult = await db.execute(import_drizzle_orm16.sql`SELECT COUNT(*) as count FROM control_risk_mappings WHERE risk_category = 'operational'`);
      console.log(`[ControlSuggestions] Found ${mappingResult[0]?.count || 0} operational mappings`);
      const riskLibraryId = riskData.libraryItemId;
      console.log(`[ControlSuggestions] Looking for controls mapped to risk library ID: ${riskLibraryId}`);
      let queryResult;
      if (riskLibraryId) {
        queryResult = await db.execute(import_drizzle_orm16.sql`
          SELECT cl.control_id, cl.name, cl.description, cl.control_type, 
                 crm.relevance_score as risk_relevance,
                 crm.impact_type as risk_impact_type,
                 crm.reasoning
          FROM control_library cl
          INNER JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
          WHERE crm.risk_library_id = ${riskLibraryId}
            AND crm.relevance_score > 0
          ORDER BY crm.relevance_score DESC
          LIMIT 20
        `);
        console.log(`[ControlSuggestions] Found ${queryResult.length} controls mapped to risk library ID ${riskLibraryId}`);
      } else {
        queryResult = await db.execute(import_drizzle_orm16.sql`
          SELECT cl.control_id, cl.name, cl.description, cl.control_type, 
                 crm.relevance_score as risk_relevance,
                 crm.impact_type as risk_impact_type,
                 crm.reasoning
          FROM control_library cl
          INNER JOIN control_risk_mappings crm ON cl.control_id = crm.control_id 
          WHERE crm.risk_category = 'operational'
            AND crm.relevance_score > 0
          ORDER BY crm.relevance_score DESC
          LIMIT 10
        `);
        console.log(`[ControlSuggestions] Using fallback category mapping, found ${queryResult.length} controls`);
      }
      console.log(`[ControlSuggestions] Query result structure:`, {
        isArray: Array.isArray(queryResult),
        hasRows: queryResult?.rows ? queryResult.rows.length : "no rows property",
        directLength: queryResult?.length || 0
      });
      relevantControls = queryResult?.rows || [];
    } catch (error) {
      console.error(`[ControlSuggestions] Database query failed:`, error);
      relevantControls = [];
    }
    console.log(`[ControlSuggestions] Final controls array length: ${relevantControls.length}`);
    if (relevantControls.length > 0) {
      console.log(`[ControlSuggestions] First control:`, relevantControls[0]);
    }
    const associatedControlsQuery = await db.execute(import_drizzle_orm16.sql`
      SELECT c.control_id
      FROM risk_controls rc
      JOIN controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${riskData.id}
    `);
    const associatedRows = Array.isArray(associatedControlsQuery) ? associatedControlsQuery : associatedControlsQuery.rows || [];
    const associatedControlIds = new Set(associatedRows.map((c) => c.control_id));
    const currentExposure = {
      inherent: parseFloat(riskData.inherentRisk || "0"),
      residual: parseFloat(riskData.residualRisk || "0")
    };
    const suggestions = [];
    for (const control of relevantControls) {
      let impactCategory;
      if (control.risk_impact_type) {
        impactCategory = {
          category: control.risk_impact_type,
          score: parseFloat(control.risk_relevance || "75"),
          reasoning: "Control mapped based on risk characteristics"
        };
      } else {
        impactCategory = categorizeControlImpact(control);
      }
      const riskRelevance = parseFloat(control.risk_relevance || "0");
      const baseScore = Math.max(riskRelevance, impactCategory.score);
      const suggestion = {
        controlId: String(control.control_id || ""),
        name: String(control.name || ""),
        description: String(control.description || ""),
        controlType: String(control.control_type || "preventive"),
        controlCategory: String(control.control_category || "technical"),
        implementationStatus: String(control.implementation_status || "not_implemented"),
        controlEffectiveness: Number(control.control_effectiveness || 70),
        implementationCost: String(control.implementation_cost || "1000"),
        costPerAgent: String(control.cost_per_agent || "100"),
        isPerAgentPricing: Boolean(control.is_per_agent_pricing || false),
        impactCategory: impactCategory.category,
        matchScore: baseScore,
        priority: baseScore >= 80 ? "high" : baseScore >= 60 ? "medium" : "low",
        reasoning: impactCategory.reasoning,
        estimatedRiskReduction: Math.min(25, baseScore / 4),
        roi: 2.5,
        paybackMonths: 12,
        isAssociated: associatedControlIds.has(String(control.control_id || ""))
      };
      suggestions.push(suggestion);
    }
    suggestions.sort((a, b) => {
      if (a.isAssociated !== b.isAssociated) return a.isAssociated ? -1 : 1;
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
      return b.roi - a.roi;
    });
    const likelihoodControls = suggestions.filter((s) => s.impactCategory === "likelihood");
    const magnitudeControls = suggestions.filter((s) => s.impactCategory === "magnitude");
    const bothControls = suggestions.filter((s) => s.impactCategory === "both");
    return {
      likelihoodControls,
      magnitudeControls,
      bothControls,
      currentRiskExposure: currentExposure
    };
  } catch (error) {
    console.error("Error in getControlSuggestions:", error);
    throw error;
  }
}

// server/routes/risks/controlSuggestions.ts
var router21 = (0, import_express22.Router)();
router21.get("/:riskId/control-suggestions", async (req, res) => {
  try {
    const { riskId } = req.params;
    console.log(`[ControlSuggestions] Getting suggestions for risk: ${riskId}`);
    const suggestions = await getControlSuggestions(riskId);
    console.log(`[ControlSuggestions] Found ${suggestions.likelihoodControls.length} likelihood controls, ${suggestions.magnitudeControls.length} magnitude controls, ${suggestions.bothControls.length} both controls`);
    console.log(`[ControlSuggestions] Sample controls:`, suggestions.likelihoodControls.slice(0, 2).map((c) => c.name), suggestions.magnitudeControls.slice(0, 2).map((c) => c.name));
    return sendSuccess(res, suggestions);
  } catch (error) {
    console.error("Error getting control suggestions:", error);
    return sendError(res, error);
  }
});
var controlSuggestions_default = router21;

// server/routes/risks/roiCalculation.ts
var import_express23 = require("express");
var import_zod7 = require("zod");
init_db();
init_schema();
var import_drizzle_orm17 = require("drizzle-orm");
var router22 = (0, import_express23.Router)();
var roiCalculationSchema = import_zod7.z.object({
  controlIds: import_zod7.z.array(import_zod7.z.string()).min(1, "At least one control ID required")
});
router22.post("/:riskId/calculate-roi", async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds } = roiCalculationSchema.parse(req.body);
    console.log(`[ROICalculation] Calculating ROI for risk ${riskId} with controls:`, controlIds);
    const risk = await db.select().from(risks).where((0, import_drizzle_orm17.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error("Risk not found"), 404);
    }
    const riskData = risk[0];
    const selectedControls = await db.select().from(controls).where((0, import_drizzle_orm17.inArray)(controls.controlId, controlIds));
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error("Some controls not found"), 404);
    }
    const inherentParams = {
      contactFrequency: { min: riskData.contactFrequencyMin || 0.1, avg: riskData.contactFrequencyAvg || 1, max: riskData.contactFrequencyMax || 10 },
      probabilityOfAction: { min: riskData.probabilityOfActionMin || 0.1, avg: riskData.probabilityOfActionAvg || 0.5, max: riskData.probabilityOfActionMax || 1 },
      threatCapability: { min: riskData.threatCapabilityMin || 1, avg: riskData.threatCapabilityAvg || 5, max: riskData.threatCapabilityMax || 10 },
      resistanceStrength: { min: riskData.resistanceStrengthMin || 1, avg: riskData.resistanceStrengthAvg || 5, max: riskData.resistanceStrengthMax || 10 },
      primaryLossMagnitude: { min: riskData.primaryLossMagnitudeMin || 1e3, avg: riskData.primaryLossMagnitudeAvg || 1e4, max: riskData.primaryLossMagnitudeMax || 1e5 },
      secondaryLossMagnitude: { min: riskData.secondaryLossMagnitudeMin || 100, avg: riskData.secondaryLossMagnitudeAvg || 1e3, max: riskData.secondaryLossMagnitudeMax || 1e4 }
    };
    const inherentRisk = Number(inherentParams.primaryLossMagnitude.avg) * Number(inherentParams.contactFrequency.avg) * Number(inherentParams.probabilityOfAction.avg) || 1e4;
    const totalEffectiveness = selectedControls.reduce((total, control) => {
      return total + (control.controlEffectiveness || 7.5);
    }, 0);
    const residualRisk = inherentRisk * (1 - Math.min(totalEffectiveness / 100, 0.95));
    const totalImplementationCost = selectedControls.reduce((sum, control) => {
      return sum + parseFloat(control.implementationCost || "0");
    }, 0);
    const totalAgentCost = selectedControls.reduce((sum, control) => {
      if (control.isPerAgentPricing) {
        const agentCount = control.deployedAgentCount || 0;
        const costPerAgent = parseFloat(control.costPerAgent || "0");
        return sum + agentCount * costPerAgent;
      }
      return sum;
    }, 0);
    const totalCost = totalImplementationCost + totalAgentCost;
    const riskReduction = inherentRisk - residualRisk;
    const riskReductionPercentage = inherentRisk > 0 ? riskReduction / inherentRisk * 100 : 0;
    const roi = totalCost > 0 ? (riskReduction - totalCost) / totalCost * 100 : 0;
    const paybackMonths = totalCost > 0 && riskReduction > 0 ? totalCost / (riskReduction / 12) : 0;
    const controlContributions = [];
    for (const control of selectedControls) {
      const singleControlEffectiveness = (control.controlEffectiveness || 7.5) / 100;
      const singleControlReduction = inherentRisk * singleControlEffectiveness;
      const singleControlCost = parseFloat(control.implementationCost || "0") + (control.isPerAgentPricing ? (control.deployedAgentCount || 0) * parseFloat(control.costPerAgent || "0") : 0);
      controlContributions.push({
        controlId: control.controlId,
        name: control.name,
        riskReduction: singleControlReduction,
        cost: singleControlCost,
        roi: singleControlCost > 0 ? (singleControlReduction - singleControlCost) / singleControlCost * 100 : 0,
        effectiveness: control.controlEffectiveness || 0
      });
    }
    const result = {
      riskExposure: {
        inherent: inherentRisk,
        residual: residualRisk,
        reduction: riskReduction,
        reductionPercentage: riskReductionPercentage
      },
      costs: {
        implementation: totalImplementationCost,
        agents: totalAgentCost,
        total: totalCost
      },
      metrics: {
        roi,
        paybackMonths,
        netBenefit: riskReduction - totalCost
      },
      controlContributions,
      simulationDetails: {
        inherentPercentiles: {
          p10: inherentRisk * 0.1,
          p50: inherentRisk * 0.5,
          p90: inherentRisk * 0.9,
          p95: inherentRisk * 0.95,
          p99: inherentRisk * 0.99
        },
        residualPercentiles: {
          p10: residualRisk * 0.1,
          p50: residualRisk * 0.5,
          p90: residualRisk * 0.9,
          p95: residualRisk * 0.95,
          p99: residualRisk * 0.99
        }
      }
    };
    console.log(`[ROICalculation] Risk reduction: ${riskReduction.toFixed(2)}, ROI: ${roi.toFixed(2)}%`);
    return sendSuccess(res, result);
  } catch (error) {
    console.error("Error calculating ROI:", error);
    return sendError(res, error);
  }
});
var roiCalculation_default = router22;

// server/routes/risks/controlAssociations.ts
var import_express24 = require("express");
var import_zod8 = require("zod");
init_db();
init_schema();
var import_drizzle_orm18 = require("drizzle-orm");
var router23 = (0, import_express24.Router)();
var associateControlsSchema = import_zod8.z.object({
  controlIds: import_zod8.z.array(import_zod8.z.string()).min(1, "At least one control ID required"),
  associationType: import_zod8.z.enum(["manual", "wizard", "bulk"]).default("manual")
});
var removeControlSchema = import_zod8.z.object({
  controlId: import_zod8.z.string().min(1, "Control ID required")
});
router23.post("/:riskId/controls", async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds, associationType } = associateControlsSchema.parse(req.body);
    console.log(`[ControlAssociation] Associating controls ${controlIds} with risk ${riskId}`);
    const risk = await db.select().from(risks).where((0, import_drizzle_orm18.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error("Risk not found"), 404);
    }
    const riskData = risk[0];
    const selectedControls = await db.select().from(controls).where((0, import_drizzle_orm18.inArray)(controls.controlId, controlIds));
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error("Some controls not found"), 404);
    }
    const existingAssociations = await db.select().from(riskControls).where(
      (0, import_drizzle_orm18.and)(
        (0, import_drizzle_orm18.eq)(riskControls.riskId, riskData.id),
        (0, import_drizzle_orm18.inArray)(riskControls.controlId, selectedControls.map((c) => c.id))
      )
    );
    const existingControlIds = new Set(existingAssociations.map((a) => a.controlId));
    const newControls = selectedControls.filter((c) => !existingControlIds.has(c.id));
    const newAssociations = [];
    for (const control of newControls) {
      const association = await db.insert(riskControls).values({
        riskId: riskData.id,
        controlId: control.id
      }).returning();
      newAssociations.push(association[0]);
    }
    console.log(`[ControlAssociation] Created ${newAssociations.length} new associations`);
    const allAssociatedControls = await db.select({
      id: controls.id,
      controlId: controls.controlId,
      name: controls.name,
      description: controls.description,
      controlType: controls.controlType,
      controlCategory: controls.controlCategory,
      implementationStatus: controls.implementationStatus,
      controlEffectiveness: controls.controlEffectiveness,
      implementationCost: controls.implementationCost,
      costPerAgent: controls.costPerAgent,
      isPerAgentPricing: controls.isPerAgentPricing
    }).from(riskControls).innerJoin(controls, (0, import_drizzle_orm18.eq)(riskControls.controlId, controls.id)).where((0, import_drizzle_orm18.eq)(riskControls.riskId, riskData.id));
    return sendSuccess(res, {
      message: `Associated ${newAssociations.length} new controls with risk`,
      newAssociations: newAssociations.length,
      skippedExisting: selectedControls.length - newAssociations.length,
      allAssociatedControls
    });
  } catch (error) {
    console.error("Error associating controls:", error);
    return sendError(res, error);
  }
});
router23.delete("/:riskId/controls/:controlId", async (req, res) => {
  try {
    const { riskId, controlId } = req.params;
    console.log(`[ControlAssociation] Removing control ${controlId} from risk ${riskId}`);
    const risk = await db.select().from(risks).where((0, import_drizzle_orm18.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error("Risk not found"), 404);
    }
    const control = await db.select().from(controls).where((0, import_drizzle_orm18.eq)(controls.controlId, controlId)).limit(1);
    if (control.length === 0) {
      return sendError(res, new Error("Control not found"), 404);
    }
    const riskData = risk[0];
    const controlData = control[0];
    const deletedAssociations = await db.delete(riskControls).where(
      (0, import_drizzle_orm18.and)(
        (0, import_drizzle_orm18.eq)(riskControls.riskId, riskData.id),
        (0, import_drizzle_orm18.eq)(riskControls.controlId, controlData.id)
      )
    );
    if (deletedAssociations.rowCount === 0) {
      return sendError(res, new Error("Association not found"), 404);
    }
    console.log(`[ControlAssociation] Removed association successfully`);
    return sendSuccess(res, {
      message: "Control association removed successfully",
      riskId: riskData.riskId,
      controlId: controlData.controlId
    });
  } catch (error) {
    console.error("Error removing control association:", error);
    return sendError(res, error);
  }
});
router23.get("/:riskId/controls", async (req, res) => {
  try {
    const { riskId } = req.params;
    const risk = await db.select().from(risks).where((0, import_drizzle_orm18.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error("Risk not found"), 404);
    }
    const riskData = risk[0];
    const associatedControls = await db.select({
      id: controls.id,
      controlId: controls.controlId,
      name: controls.name,
      description: controls.description,
      controlType: controls.controlType,
      controlCategory: controls.controlCategory,
      implementationStatus: controls.implementationStatus,
      controlEffectiveness: controls.controlEffectiveness,
      implementationCost: controls.implementationCost,
      costPerAgent: controls.costPerAgent,
      isPerAgentPricing: controls.isPerAgentPricing,
      deployedAgentCount: controls.deployedAgentCount
    }).from(riskControls).innerJoin(controls, (0, import_drizzle_orm18.eq)(riskControls.controlId, controls.id)).where((0, import_drizzle_orm18.eq)(riskControls.riskId, riskData.id));
    return sendSuccess(res, associatedControls);
  } catch (error) {
    console.error("Error getting associated controls:", error);
    return sendError(res, error);
  }
});
router23.put("/:riskId/controls", async (req, res) => {
  try {
    const { riskId } = req.params;
    const { controlIds } = associateControlsSchema.parse(req.body);
    console.log(`[ControlAssociation] Bulk updating controls for risk ${riskId}`);
    const risk = await db.select().from(risks).where((0, import_drizzle_orm18.eq)(risks.riskId, riskId)).limit(1);
    if (risk.length === 0) {
      return sendError(res, new Error("Risk not found"), 404);
    }
    const riskData = risk[0];
    const selectedControls = await db.select().from(controls).where((0, import_drizzle_orm18.inArray)(controls.controlId, controlIds));
    if (selectedControls.length !== controlIds.length) {
      return sendError(res, new Error("Some controls not found"), 404);
    }
    await db.delete(riskControls).where((0, import_drizzle_orm18.eq)(riskControls.riskId, riskData.id));
    const newAssociations = [];
    for (const control of selectedControls) {
      const association = await db.insert(riskControls).values({
        riskId: riskData.id,
        controlId: control.id
      }).returning();
      newAssociations.push(association[0]);
    }
    console.log(`[ControlAssociation] Created ${newAssociations.length} associations`);
    return sendSuccess(res, {
      message: `Updated control associations for risk`,
      associationCount: newAssociations.length,
      controlIds: selectedControls.map((c) => c.controlId)
    });
  } catch (error) {
    console.error("Error bulk updating control associations:", error);
    return sendError(res, error);
  }
});
var controlAssociations_default = router23;

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
var import_express25 = require("express");
var healthRouter = (0, import_express25.Router)();
async function getTestConnection() {
  const isProduction2 = true;
  if (isProduction2) {
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
  const apiRouter = import_express26.default.Router();
  apiRouter.use(requestLogger);
  apiRouter.use("/assets", assets_default);
  apiRouter.use("/legal-entities", entities_default);
  apiRouter.use("/risks", risks_default);
  apiRouter.use("/controls", controls_default);
  apiRouter.use("/control-library", routes_default);
  apiRouter.use("/risk-library", routes_default2);
  apiRouter.use("/risk-responses", responses_default);
  apiRouter.use("/risk-summary", risk_summary_default);
  apiRouter.use("/dashboard", dashboard_default);
  apiRouter.use("/logs", logs_default);
  apiRouter.use("/cost-modules", routes_default3);
  apiRouter.use("/risk-costs", routes_default4);
  apiRouter.use("/enterprise-architecture", enterprise_architecture_default);
  apiRouter.use("/admin", admin_default);
  apiRouter.use("/vulnerabilities", vulnerabilities_default);
  apiRouter.use("/reports", reports_default);
  apiRouter.use("/integrations", integrations_default);
  apiRouter.use("/backstage", backstage_default2);
  apiRouter.use("/", auth_default);
  apiRouter.use("/control-mappings", controlMappings_default);
  apiRouter.use("/risks", controlSuggestions_default);
  apiRouter.use("/risks", roiCalculation_default);
  apiRouter.use("/risks", controlAssociations_default);
  app2.use("/api", apiRouter);
  app2.use(errorHandler);
  const server = new import_http.Server(app2);
  return server;
}

// server/utils/vite.ts
var import_express27 = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_meta2 = {};
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  if (true) {
    throw new Error("setupVite should not be called in production");
  }
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = (await Promise.resolve().then(() => (init_vite_config(), vite_config_exports))).default;
  const { nanoid } = await import("nanoid");
  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path2.default.resolve(
        import_meta2.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const isProduction2 = true;
  if (isProduction2) {
    const productionPaths = ["/app/dist/public", "/app/public"];
    for (const staticPath of productionPaths) {
      if (import_fs.default.existsSync(staticPath)) {
        console.log(`Serving static files from: ${staticPath}`);
        app2.use(import_express27.default.static(staticPath));
        return;
      }
    }
    console.log("Static files not found, serving minimal content");
    app2.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) return;
      res.send('<!DOCTYPE html><html><head><title>Risk Platform</title></head><body><div id="root">Loading...</div></body></html>');
    });
    return;
  }
  const possiblePaths = [
    import_path2.default.resolve(process.cwd(), "dist", "public"),
    import_path2.default.resolve(process.cwd(), "public")
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
  app2.use(import_express27.default.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path2.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var import_express_session = __toESM(require("express-session"), 1);
var import_connect_pg_simple = __toESM(require("connect-pg-simple"), 1);
init_db();
var app = (0, import_express28.default)();
app.set("trust proxy", 1);
app.use(import_express28.default.json({ limit: "10mb" }));
app.use(import_express28.default.urlencoded({ extended: true }));
var PgSession = (0, import_connect_pg_simple.default)(import_express_session.default);
var sessionStore = new PgSession({
  pool,
  tableName: "sessions",
  createTableIfMissing: true
});
console.log("PostgreSQL session store configured");
var isProduction = true;
var sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "keyboard cat fallback secret",
  resave: false,
  saveUninitialized: true,
  rolling: true,
  name: "connect.sid",
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3,
    sameSite: isProduction ? "none" : "strict",
    path: "/",
    // Don't set domain in production to allow for subdomain flexibility
    domain: void 0
  }
};
console.log("Session configuration:", {
  nodeEnv: "production",
  cookieSecure: sessionConfig.cookie.secure,
  sameSite: sessionConfig.cookie.sameSite,
  domain: sessionConfig.cookie.domain,
  trustProxy: app.get("trust proxy")
});
app.use((0, import_express_session.default)(sessionConfig));
app.use((req, res, next) => {
  if (req.path.includes("/auth/")) {
    console.log("AUTH REQUEST DEBUG:", {
      method: req.method,
      path: req.path,
      hasSession: !!req.session,
      sessionId: req.session?.id,
      cookies: req.headers.cookie ? "present" : "missing",
      host: req.headers.host,
      userAgent: req.headers["user-agent"]?.substring(0, 50),
      protocol: req.protocol,
      secure: req.secure,
      forwardedProto: req.get("x-forwarded-proto"),
      nodeEnv: "production"
    });
  }
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name, value) {
    if (name.toLowerCase() === "set-cookie") {
      console.log("SET-COOKIE HEADER:", {
        path: req.path,
        cookieValue: Array.isArray(value) ? value : [value],
        hostname: req.hostname,
        protocol: req.protocol,
        secure: req.secure,
        isProduction: true,
        trustProxy: req.app.get("trust proxy"),
        headers: {
          host: req.headers.host,
          "x-forwarded-proto": req.headers["x-forwarded-proto"],
          "x-forwarded-for": req.headers["x-forwarded-for"]
        }
      });
    }
    return originalSetHeader.call(this, name, value);
  };
  res.on("finish", () => {
    if (req.path.includes("/auth/")) {
      console.log("AUTH RESPONSE COMPLETE:", {
        path: req.path,
        statusCode: res.statusCode,
        hasSetCookie: res.getHeaders()["set-cookie"] ? "yes" : "no"
      });
    }
  });
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
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
(async () => {
  console.log("Starting server without database schema fixes");
  configurePassport();
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
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
