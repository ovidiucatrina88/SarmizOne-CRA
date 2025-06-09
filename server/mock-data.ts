// Development-only mock data for use during database outages
// This provides a consistent dataset to use when the database is unavailable

export const mockData = {
  // Legal entities
  legalEntities: [
    {
      id: 1,
      entityId: 'LE-GLOBAL',
      name: 'Company X Global',
      country: 'United States',
      region: 'Global',
      currency: 'USD',
      riskAppetite: 5000000,
      riskTolerance: 7500000,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      entityId: 'LE-AMERICAS',
      name: 'Company X Americas',
      country: 'United States',
      region: 'Americas',
      currency: 'USD',
      riskAppetite: 2000000,
      riskTolerance: 3000000,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 3,
      entityId: 'LE-EMEA',
      name: 'Company X EMEA',
      country: 'United Kingdom',
      region: 'EMEA',
      currency: 'USD',
      riskAppetite: 1500000,
      riskTolerance: 2500000,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Assets
  assets: [
    {
      id: 1,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 3,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Risks
  risks: [
    {
      id: 1,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Controls
  controls: [
    {
      id: 1,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
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
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Risk-control relationships
  riskControls: [
    {
      id: 1,
      riskId: 1,
      controlId: 1,
      effectivenessScore: 8,
      notes: 'MFA has significantly reduced unauthorized access attempts',
      createdAt: new Date('2023-01-01')
    },
    {
      id: 2,
      riskId: 2,
      controlId: 2,
      effectivenessScore: 6,
      notes: 'Implementation still in progress, not fully effective yet',
      createdAt: new Date('2023-01-01')
    }
  ],
  
  // Risk responses
  riskResponses: [
    {
      id: 1,
      riskId: 'RISK-DB-1',
      responseType: 'mitigate',
      justification: 'Critical risk requiring active mitigation',
      assignedControls: ['CTL-MFA-1'],
      transferMethod: null,
      avoidanceStrategy: null,
      acceptanceReason: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      riskId: 'RISK-RW-1',
      responseType: 'transfer',
      justification: 'Partial risk transfer through cyber insurance',
      assignedControls: ['CTL-EPP-1'],
      transferMethod: 'Cyber insurance policy #CYB-12345',
      avoidanceStrategy: null,
      acceptanceReason: null,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Cost modules
  costModules: [
    {
      id: 1,
      name: 'Breach Investigation',
      cisControl: ['14.5', '14.6', '14.7'],
      costFactor: 15000,
      costType: 'fixed',
      description: 'Fixed cost for conducting a data breach investigation',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 2,
      name: 'Incident Response Team',
      cisControl: ['19.1', '19.2', '19.3'],
      costFactor: 250,
      costType: 'per_hour',
      description: 'Hourly cost for incident response team',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: 3,
      name: 'Customer Notification',
      cisControl: ['13.1', '13.4'],
      costFactor: 5,
      costType: 'per_event',
      description: 'Cost per customer for breach notification',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ],
  
  // Risk costs
  riskCosts: [
    {
      id: 1,
      riskId: 1,
      costModuleId: 1,
      quantity: 1,
      hours: 0,
      customFactor: null,
      notes: 'Initial breach investigation cost',
      createdAt: new Date('2023-01-01')
    },
    {
      id: 2,
      riskId: 1,
      costModuleId: 3,
      quantity: 10000,
      hours: 0,
      customFactor: null,
      notes: 'Notification for 10,000 affected customers',
      createdAt: new Date('2023-01-01')
    }
  ],
  
  // Risk summaries (for loss exceedance curve)
  riskSummaries: [
    {
      id: 1,
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
      createdAt: new Date('2023-01-01')
    },
    {
      id: 2,
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
      createdAt: new Date('2023-01-01')
    }
  ],
  
  // Activity logs
  activityLogs: [
    {
      id: 1,
      actionType: 'CREATE',
      entityType: 'risk',
      entityId: 'RISK-DB-1',
      userId: 'user@company.com',
      details: { severity: 'critical', name: 'Customer Database Breach' },
      createdAt: new Date('2023-01-01')
    },
    {
      id: 2,
      actionType: 'UPDATE',
      entityType: 'control',
      entityId: 'CTL-EPP-1',
      userId: 'admin@company.com',
      details: { field: 'implementation_status', old_value: 'not_implemented', new_value: 'in_progress' },
      createdAt: new Date('2023-01-01')
    }
  ]
};