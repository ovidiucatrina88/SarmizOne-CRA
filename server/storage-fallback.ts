// Fallback in-memory storage for development and testing when database is unavailable
import { IStorage } from './storage';
import { 
  Asset, InsertAsset, Risk, InsertRisk, 
  Control, InsertControl, RiskControl, InsertRiskControl,
  RiskResponse, InsertRiskResponse, LegalEntity, InsertLegalEntity,
  CostModule, InsertCostModule, RiskCost, InsertRiskCost,
  RiskSummary, InsertRiskSummary, ActivityLog, InsertActivityLog
} from '@shared/schema';

export class FallbackStorage implements IStorage {
  private assets: Asset[] = [];
  private risks: Risk[] = [];
  private controls: Control[] = [];
  private riskControls: RiskControl[] = [];
  private responses: RiskResponse[] = [];
  private entities: LegalEntity[] = [];
  private costModules: CostModule[] = [];
  private riskCosts: RiskCost[] = [];
  private riskSummaries: RiskSummary[] = [];
  private activityLogs: ActivityLog[] = [];
  private lastId = 1;

  constructor() {
    console.warn('🚨 USING FALLBACK STORAGE - Database connection unavailable');
    this.initializeWithSampleData();
  }

  // Assets
  async getAssets(): Promise<Asset[]> {
    return this.assets;
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.find(asset => asset.id === id);
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return this.assets.find(asset => asset.assetId === assetId);
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const newAsset = { 
      id: this.getNextId(), 
      ...asset,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Asset;
    this.assets.push(newAsset);
    return newAsset;
  }

  async updateAsset(id: number, asset: Partial<Asset>): Promise<Asset | undefined> {
    const index = this.assets.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    
    this.assets[index] = { 
      ...this.assets[index], 
      ...asset,
      updatedAt: new Date()
    };
    return this.assets[index];
  }

  async deleteAsset(id: number): Promise<boolean> {
    const initialLength = this.assets.length;
    this.assets = this.assets.filter(asset => asset.id !== id);
    return this.assets.length !== initialLength;
  }

  // Risks
  async getRisks(): Promise<Risk[]> {
    return this.risks;
  }

  async getRisk(id: number): Promise<Risk | undefined> {
    return this.risks.find(risk => risk.id === id);
  }

  async getRiskByRiskId(riskId: string): Promise<Risk | undefined> {
    return this.risks.find(risk => risk.riskId === riskId);
  }

  async createRisk(risk: InsertRisk): Promise<Risk> {
    const newRisk = { 
      id: this.getNextId(), 
      ...risk,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Risk;
    this.risks.push(newRisk);
    
    // Trigger risk summary update after creation
    try {
      const { riskSummaryService } = await import('./services/riskSummaryService');
      await riskSummaryService.updateRiskSummaries();
      console.log('Risk summaries updated after risk creation (fallback storage)');
    } catch (error) {
      console.error('Error updating risk summaries after creation (fallback storage):', error);
    }
    
    return newRisk;
  }

  async updateRisk(id: number, risk: Partial<Risk>): Promise<Risk | undefined> {
    const index = this.risks.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.risks[index] = { 
      ...this.risks[index], 
      ...risk,
      updatedAt: new Date()
    };
    
    // Trigger risk summary update after modification
    try {
      const { riskSummaryService } = await import('./services/riskSummaryService');
      await riskSummaryService.updateRiskSummaries();
      console.log('Risk summaries updated after risk modification (fallback storage)');
    } catch (error) {
      console.error('Error updating risk summaries after modification (fallback storage):', error);
    }
    
    return this.risks[index];
  }

  async deleteRisk(id: number): Promise<boolean> {
    const initialLength = this.risks.length;
    this.risks = this.risks.filter(risk => risk.id !== id);
    const wasDeleted = this.risks.length !== initialLength;
    
    // Trigger risk summary update after deletion
    if (wasDeleted) {
      try {
        const { riskSummaryService } = await import('./services/riskSummaryService');
        await riskSummaryService.updateRiskSummaries();
        console.log('Risk summaries updated after risk deletion (fallback storage)');
      } catch (error) {
        console.error('Error updating risk summaries after deletion (fallback storage):', error);
      }
    }
    
    return wasDeleted;
  }

  // Controls
  async getControls(): Promise<Control[]> {
    return this.controls;
  }

  async getControl(id: number): Promise<Control | undefined> {
    return this.controls.find(control => control.id === id);
  }

  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    return this.controls.find(control => control.controlId === controlId);
  }

  async createControl(control: InsertControl): Promise<Control> {
    const newControl = { 
      id: this.getNextId(), 
      ...control,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Control;
    this.controls.push(newControl);
    return newControl;
  }

  async updateControl(id: number, control: Partial<Control>): Promise<Control | undefined> {
    const index = this.controls.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.controls[index] = { 
      ...this.controls[index], 
      ...control,
      updatedAt: new Date()
    };
    return this.controls[index];
  }

  async deleteControl(id: number): Promise<boolean> {
    const initialLength = this.controls.length;
    this.controls = this.controls.filter(control => control.id !== id);
    return this.controls.length !== initialLength;
  }

  // Risk-Control Mappings
  async getRiskControls(riskId?: number): Promise<RiskControl[]> {
    if (riskId) {
      return this.riskControls.filter(rc => rc.riskId === riskId);
    }
    return this.riskControls;
  }

  async createRiskControl(riskControl: InsertRiskControl): Promise<RiskControl> {
    const newRiskControl = { 
      id: this.getNextId(), 
      ...riskControl,
      createdAt: new Date()
    } as RiskControl;
    this.riskControls.push(newRiskControl);
    return newRiskControl;
  }

  async deleteRiskControl(id: number): Promise<boolean> {
    const initialLength = this.riskControls.length;
    this.riskControls = this.riskControls.filter(rc => rc.id !== id);
    return this.riskControls.length !== initialLength;
  }

  // Risk Responses
  async getRiskResponses(): Promise<RiskResponse[]> {
    return this.responses;
  }

  async getRiskResponse(id: number): Promise<RiskResponse | undefined> {
    return this.responses.find(response => response.id === id);
  }

  async getRiskResponseByRiskId(riskId: string): Promise<RiskResponse | undefined> {
    return this.responses.find(response => response.riskId === riskId);
  }

  async createRiskResponse(response: InsertRiskResponse): Promise<RiskResponse> {
    const newResponse = { 
      id: this.getNextId(), 
      ...response,
      createdAt: new Date(),
      updatedAt: new Date()
    } as RiskResponse;
    this.responses.push(newResponse);
    return newResponse;
  }

  async updateRiskResponse(id: number, response: Partial<RiskResponse>): Promise<RiskResponse | undefined> {
    const index = this.responses.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    
    this.responses[index] = { 
      ...this.responses[index], 
      ...response,
      updatedAt: new Date()
    };
    return this.responses[index];
  }

  async deleteRiskResponse(id: number): Promise<boolean> {
    const initialLength = this.responses.length;
    this.responses = this.responses.filter(response => response.id !== id);
    return this.responses.length !== initialLength;
  }

  // Legal Entities
  async getLegalEntities(): Promise<LegalEntity[]> {
    return this.entities;
  }

  async getLegalEntity(id: number): Promise<LegalEntity | undefined> {
    return this.entities.find(entity => entity.id === id);
  }

  async getLegalEntityByEntityId(entityId: string): Promise<LegalEntity | undefined> {
    return this.entities.find(entity => entity.entityId === entityId);
  }

  async createLegalEntity(entity: InsertLegalEntity): Promise<LegalEntity> {
    const newEntity = { 
      id: this.getNextId(), 
      ...entity,
      createdAt: new Date(),
      updatedAt: new Date()
    } as LegalEntity;
    this.entities.push(newEntity);
    return newEntity;
  }

  async updateLegalEntity(id: number, entity: Partial<LegalEntity>): Promise<LegalEntity | undefined> {
    const index = this.entities.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    
    this.entities[index] = { 
      ...this.entities[index], 
      ...entity,
      updatedAt: new Date()
    };
    return this.entities[index];
  }

  async deleteLegalEntity(id: number): Promise<boolean> {
    const initialLength = this.entities.length;
    this.entities = this.entities.filter(entity => entity.id !== id);
    return this.entities.length !== initialLength;
  }

  // Cost Modules
  async getCostModules(): Promise<CostModule[]> {
    return this.costModules;
  }

  async getCostModule(id: number): Promise<CostModule | undefined> {
    return this.costModules.find(module => module.id === id);
  }

  async createCostModule(module: InsertCostModule): Promise<CostModule> {
    const newModule = { 
      id: this.getNextId(), 
      ...module,
      createdAt: new Date(),
      updatedAt: new Date()
    } as CostModule;
    this.costModules.push(newModule);
    return newModule;
  }

  async updateCostModule(id: number, module: Partial<CostModule>): Promise<CostModule | undefined> {
    const index = this.costModules.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    
    this.costModules[index] = { 
      ...this.costModules[index], 
      ...module,
      updatedAt: new Date()
    };
    return this.costModules[index];
  }

  async deleteCostModule(id: number): Promise<boolean> {
    const initialLength = this.costModules.length;
    this.costModules = this.costModules.filter(module => module.id !== id);
    return this.costModules.length !== initialLength;
  }

  // Risk Costs
  async getRiskCosts(riskId?: number): Promise<RiskCost[]> {
    if (riskId) {
      return this.riskCosts.filter(rc => rc.riskId === riskId);
    }
    return this.riskCosts;
  }

  async getRiskCost(id: number): Promise<RiskCost | undefined> {
    return this.riskCosts.find(cost => cost.id === id);
  }

  async createRiskCost(cost: InsertRiskCost): Promise<RiskCost> {
    const newCost = { 
      id: this.getNextId(), 
      ...cost,
      createdAt: new Date()
    } as RiskCost;
    this.riskCosts.push(newCost);
    return newCost;
  }

  async updateRiskCost(id: number, cost: Partial<RiskCost>): Promise<RiskCost | undefined> {
    const index = this.riskCosts.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    
    this.riskCosts[index] = { 
      ...this.riskCosts[index], 
      ...cost
    };
    return this.riskCosts[index];
  }

  async deleteRiskCost(id: number): Promise<boolean> {
    const initialLength = this.riskCosts.length;
    this.riskCosts = this.riskCosts.filter(cost => cost.id !== id);
    return this.riskCosts.length !== initialLength;
  }

  // Risk Summaries
  async getRiskSummaries(): Promise<RiskSummary[]> {
    return this.riskSummaries;
  }

  async getLatestRiskSummary(legalEntityId?: string): Promise<RiskSummary | undefined> {
    const filteredSummaries = legalEntityId 
      ? this.riskSummaries.filter(s => s.legalEntityId === legalEntityId)
      : this.riskSummaries;
      
    if (filteredSummaries.length === 0) return undefined;
    
    return filteredSummaries.reduce((latest, current) => {
      if (!latest) return current;
      if (current.year > latest.year) return current;
      if (current.year === latest.year && current.month > latest.month) return current;
      return latest;
    }, undefined as RiskSummary | undefined);
  }

  async createRiskSummary(summary: InsertRiskSummary): Promise<RiskSummary> {
    const newSummary = { 
      id: this.getNextId(), 
      ...summary,
      createdAt: new Date()
    } as RiskSummary;
    this.riskSummaries.push(newSummary);
    return newSummary;
  }

  // Activity Logs
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const newLog = { 
      id: this.getNextId(), 
      ...log,
      createdAt: new Date()
    } as ActivityLog;
    this.activityLogs.push(newLog);
    return newLog;
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    return this.activityLogs;
  }

  // Utility methods
  private getNextId(): number {
    return this.lastId++;
  }

  private initializeWithSampleData() {
    // Legal Entities
    this.entities = [
      {
        id: this.getNextId(),
        entityId: 'LE-GLOBAL',
        name: 'Company X Global',
        country: 'United States',
        region: 'Global',
        currency: 'USD',
        riskAppetite: 5000000,
        riskTolerance: 7500000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        entityId: 'LE-AMERICAS',
        name: 'Company X Americas',
        country: 'United States',
        region: 'Americas',
        currency: 'USD',
        riskAppetite: 2000000,
        riskTolerance: 3000000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        entityId: 'LE-EMEA',
        name: 'Company X EMEA',
        country: 'United Kingdom',
        region: 'EMEA',
        currency: 'USD',
        riskAppetite: 1500000,
        riskTolerance: 2500000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as LegalEntity[];

    // Sample Assets
    this.assets = [
      {
        id: this.getNextId(),
        assetId: 'AST-001',
        name: 'SalesForce Instance',
        type: 'application',
        status: 'Active',
        businessUnit: 'Sales',
        owner: 'CRM Team',
        legalEntity: 'LE-GLOBAL',
        confidentiality: 'high',
        integrity: 'high',
        availability: 'high',
        assetValue: 10000000,
        currency: 'USD',
        regulatoryImpact: ['GDPR', 'CCPA'],
        externalInternal: 'external',
        dependencies: ['AWS'],
        agentCount: 0,
        description: 'Primary CRM system',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        assetId: 'AST-002',
        name: 'Financial Database',
        type: 'data',
        status: 'Active',
        businessUnit: 'Finance',
        owner: 'Database Team',
        legalEntity: 'LE-AMERICAS',
        confidentiality: 'high',
        integrity: 'high',
        availability: 'high',
        assetValue: 25000000,
        currency: 'USD',
        regulatoryImpact: ['SOX', 'GDPR'],
        externalInternal: 'internal',
        dependencies: ['Oracle Server'],
        agentCount: 0,
        description: 'Contains all financial records',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        assetId: 'AST-003',
        name: 'Customer Database',
        type: 'data',
        status: 'Active',
        businessUnit: 'Business',
        owner: 'Tech Platform',
        legalEntity: 'LE-EMEA',
        confidentiality: 'high',
        integrity: 'medium',
        availability: 'high',
        assetValue: 50000000,
        currency: 'USD',
        regulatoryImpact: ['GDPR'],
        externalInternal: 'internal',
        dependencies: [],
        agentCount: 10,
        description: 'Test description',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as Asset[];

    // Sample Risks
    this.risks = [
      {
        id: this.getNextId(),
        riskId: 'RISK-DB-1',
        name: 'Customer Database Breach',
        description: 'Unauthorized access to customer database containing PII',
        associatedAssets: ['AST-003'],
        severity: 'critical',
        threatCommunity: 'External Hackers',
        vulnerability: 'Weak database security',
        riskCategory: 'compliance',
        contactFrequencyMin: 12,
        contactFrequencyAvg: 24,
        contactFrequencyMax: 36,
        contactFrequencyConfidence: 'medium',
        probabilityOfActionMin: 0.3,
        probabilityOfActionAvg: 0.5,
        probabilityOfActionMax: 0.7,
        probabilityOfActionConfidence: 'medium',
        threatCapabilityMin: 0.6,
        threatCapabilityAvg: 0.8,
        threatCapabilityMax: 0.9,
        threatCapabilityConfidence: 'medium',
        resistanceStrengthMin: 0.4,
        resistanceStrengthAvg: 0.6,
        resistanceStrengthMax: 0.7,
        resistanceStrengthConfidence: 'medium',
        susceptibilityMin: 0.5,
        susceptibilityAvg: 0.5,
        susceptibilityMax: 0.5,
        susceptibilityConfidence: 'medium',
        vulnerabilityMin: 0.3,
        vulnerabilityAvg: 0.5,
        vulnerabilityMax: 0.7,
        vulnerabilityConfidence: 'medium',
        lossEventFrequencyMin: 2,
        lossEventFrequencyAvg: 5,
        lossEventFrequencyMax: 10,
        lossEventFrequencyConfidence: 'medium',
        primaryLossMin: 1000000,
        primaryLossAvg: 2500000,
        primaryLossMax: 5000000,
        primaryLossConfidence: 'medium',
        secondaryLossMin: 500000,
        secondaryLossAvg: 1000000,
        secondaryLossMax: 2000000,
        secondaryLossConfidence: 'medium',
        lossMagnitudeMin: 1500000,
        lossMagnitudeAvg: 3500000,
        lossMagnitudeMax: 7000000,
        lossMagnitudeConfidence: 'medium',
        itemType: 'instance',
        legalEntityId: 'LE-GLOBAL',
        rankPercentile: 90.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        riskId: 'RISK-RW-1',
        name: 'Financial System Ransomware',
        description: 'Ransomware targeting financial systems',
        associatedAssets: ['AST-002'],
        severity: 'high',
        threatCommunity: 'Cybercriminals',
        vulnerability: 'Missing critical patches',
        riskCategory: 'operational',
        contactFrequencyMin: 6,
        contactFrequencyAvg: 12,
        contactFrequencyMax: 24,
        contactFrequencyConfidence: 'medium',
        probabilityOfActionMin: 0.2,
        probabilityOfActionAvg: 0.4,
        probabilityOfActionMax: 0.6,
        probabilityOfActionConfidence: 'medium',
        threatCapabilityMin: 0.5,
        threatCapabilityAvg: 0.7,
        threatCapabilityMax: 0.8,
        threatCapabilityConfidence: 'medium',
        resistanceStrengthMin: 0.5,
        resistanceStrengthAvg: 0.7,
        resistanceStrengthMax: 0.8,
        resistanceStrengthConfidence: 'medium',
        susceptibilityMin: 0.5,
        susceptibilityAvg: 0.5,
        susceptibilityMax: 0.5,
        susceptibilityConfidence: 'medium',
        vulnerabilityMin: 0.2,
        vulnerabilityAvg: 0.3,
        vulnerabilityMax: 0.4,
        vulnerabilityConfidence: 'medium',
        lossEventFrequencyMin: 1,
        lossEventFrequencyAvg: 3,
        lossEventFrequencyMax: 6,
        lossEventFrequencyConfidence: 'medium',
        primaryLossMin: 500000,
        primaryLossAvg: 2000000,
        primaryLossMax: 5000000,
        primaryLossConfidence: 'medium',
        secondaryLossMin: 250000,
        secondaryLossAvg: 1000000,
        secondaryLossMax: 2500000,
        secondaryLossConfidence: 'medium',
        lossMagnitudeMin: 750000,
        lossMagnitudeAvg: 3000000,
        lossMagnitudeMax: 7500000,
        lossMagnitudeConfidence: 'medium',
        itemType: 'instance',
        legalEntityId: 'LE-AMERICAS',
        rankPercentile: 85.2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as Risk[];

    // Sample Controls
    this.controls = [
      {
        id: this.getNextId(),
        controlId: 'CTL-MFA-1',
        name: 'Database MFA Implementation',
        description: 'Multi-factor authentication for database administrators',
        controlType: 'preventive',
        controlCategory: 'technical',
        implementationStatus: 'fully_implemented',
        controlEffectiveness: 8,
        implementationCost: 30000,
        associatedRisks: ['RISK-DB-1'],
        itemType: 'instance',
        assetId: 'AST-003',
        eAvoid: 0.2,
        eDeter: 0.6,
        eDetect: 0.1,
        eResist: 0.8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        controlId: 'CTL-EPP-1',
        name: 'Financial Systems EPP',
        description: 'Advanced endpoint protection for financial systems',
        controlType: 'detective',
        controlCategory: 'technical',
        implementationStatus: 'in_progress',
        controlEffectiveness: 6,
        implementationCost: 85000,
        costPerAgent: 0,
        isPerAgentPricing: false,
        deployedAgentCount: 0,
        associatedRisks: ['RISK-RW-1'],
        itemType: 'instance',
        assetId: 'AST-002',
        eAvoid: 0.1,
        eDeter: 0.3,
        eDetect: 0.8,
        eResist: 0.5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as Control[];

    // Sample Risk-Control Mappings
    this.riskControls = [
      {
        id: this.getNextId(),
        riskId: 1,
        controlId: 1,
        effectivenessScore: 8,
        notes: 'MFA has significantly reduced unauthorized access attempts',
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        riskId: 2,
        controlId: 2,
        effectivenessScore: 6,
        notes: 'Implementation still in progress, not fully effective yet',
        createdAt: new Date()
      }
    ] as RiskControl[];

    // Sample Risk Responses
    this.responses = [
      {
        id: this.getNextId(),
        riskId: 'RISK-DB-1',
        responseType: 'mitigate',
        justification: 'Critical risk requiring active mitigation',
        assignedControls: ['CTL-MFA-1'],
        transferMethod: null,
        avoidanceStrategy: null,
        acceptanceReason: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        riskId: 'RISK-RW-1',
        responseType: 'transfer',
        justification: 'Partial risk transfer through cyber insurance',
        assignedControls: ['CTL-EPP-1'],
        transferMethod: 'Cyber insurance policy #CYB-12345',
        avoidanceStrategy: null,
        acceptanceReason: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as RiskResponse[];

    // Sample Cost Modules
    this.costModules = [
      {
        id: this.getNextId(),
        name: 'Breach Investigation',
        cisControl: ['14.5', '14.6', '14.7'],
        costFactor: 15000,
        costType: 'fixed',
        description: 'Fixed cost for conducting a data breach investigation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        name: 'Incident Response Team',
        cisControl: ['19.1', '19.2', '19.3'],
        costFactor: 250,
        costType: 'per_hour',
        description: 'Hourly cost for incident response team',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: this.getNextId(),
        name: 'Customer Notification',
        cisControl: ['13.1', '13.4'],
        costFactor: 5,
        costType: 'per_event',
        description: 'Cost per customer for breach notification',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ] as CostModule[];

    // Sample Risk Costs
    this.riskCosts = [
      {
        id: this.getNextId(),
        riskId: 1,
        costModuleId: 1,
        quantity: 1,
        hours: 0,
        customFactor: null,
        notes: 'Initial breach investigation cost',
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        riskId: 1,
        costModuleId: 3,
        quantity: 10000,
        hours: 0,
        customFactor: null,
        notes: 'Notification for 10,000 affected customers',
        createdAt: new Date()
      }
    ] as RiskCost[];

    // Sample Risk Summaries
    this.riskSummaries = [
      {
        id: this.getNextId(),
        year: 2025,
        month: 5,
        legalEntityId: 'LE-GLOBAL',
        minimumExposure: 2500000,
        averageExposure: 5000000,
        maximumExposure: 10000000,
        tenthPercentileExposure: 3000000,
        mostLikelyExposure: 5000000,
        ninetiethPercentileExposure: 8000000,
        residualMinimumExposure: 1000000,
        residualAverageExposure: 2000000,
        residualMaximumExposure: 4000000,
        residualTenthPercentileExposure: 1200000,
        residualMostLikelyExposure: 2000000,
        residualNinetiethPercentileExposure: 3200000,
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        year: 2025,
        month: 5,
        legalEntityId: 'LE-AMERICAS',
        minimumExposure: 1500000,
        averageExposure: 3000000,
        maximumExposure: 6000000,
        tenthPercentileExposure: 1800000,
        mostLikelyExposure: 3000000,
        ninetiethPercentileExposure: 4800000,
        residualMinimumExposure: 600000,
        residualAverageExposure: 1200000,
        residualMaximumExposure: 2400000,
        residualTenthPercentileExposure: 720000,
        residualMostLikelyExposure: 1200000,
        residualNinetiethPercentileExposure: 1920000,
        createdAt: new Date()
      }
    ] as RiskSummary[];

    // Sample Activity Logs
    this.activityLogs = [
      {
        id: this.getNextId(),
        actionType: 'CREATE',
        entityType: 'risk',
        entityId: 'RISK-DB-1',
        userId: 'user@company.com',
        details: { severity: 'critical', name: 'Customer Database Breach' },
        createdAt: new Date()
      },
      {
        id: this.getNextId(),
        actionType: 'UPDATE',
        entityType: 'control',
        entityId: 'CTL-EPP-1',
        userId: 'admin@company.com',
        details: { field: 'implementation_status', old_value: 'not_implemented', new_value: 'in_progress' },
        createdAt: new Date()
      }
    ] as ActivityLog[];
  }
}