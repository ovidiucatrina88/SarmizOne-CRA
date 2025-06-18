/**
 * Control Recommendation Engine
 * Matches controls to risks based on threat vectors, asset types, and compliance requirements
 */

export interface ControlRecommendation {
  controlId: string;
  name: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  relevanceScore: number; // 0-100 score for how relevant this control is
  justification: string; // Why this control was recommended
  priority: 'high' | 'medium' | 'low';
}

export interface RiskCharacteristics {
  threatCommunity: string;
  vulnerability: string;
  riskCategory: string;
  severity: string;
  associatedAssets?: string[];
  legalEntityId?: string;
}

// Threat vector to control mappings
const THREAT_CONTROL_MAPPINGS = {
  ransomware: {
    preventive: [
      { pattern: 'endpoint.*protection|edr|anti.*malware', score: 95, priority: 'high' },
      { pattern: 'backup.*solution|data.*backup', score: 90, priority: 'high' },
      { pattern: 'email.*security|phishing.*protection', score: 85, priority: 'high' },
      { pattern: 'patch.*management|vulnerability.*management', score: 80, priority: 'medium' },
      { pattern: 'network.*segmentation|micro.*segmentation', score: 75, priority: 'medium' }
    ],
    detective: [
      { pattern: 'siem|security.*monitoring', score: 85, priority: 'high' },
      { pattern: 'threat.*hunting|anomaly.*detection', score: 80, priority: 'medium' },
      { pattern: 'log.*monitoring|audit.*logging', score: 70, priority: 'medium' }
    ],
    corrective: [
      { pattern: 'incident.*response|disaster.*recovery', score: 90, priority: 'high' },
      { pattern: 'backup.*restoration|data.*recovery', score: 85, priority: 'high' }
    ]
  },
  'data breach': {
    preventive: [
      { pattern: 'encrypt.*data|data.*encryption', score: 95, priority: 'high' },
      { pattern: 'access.*control|identity.*management', score: 90, priority: 'high' },
      { pattern: 'data.*loss.*prevention|dlp', score: 85, priority: 'high' },
      { pattern: 'network.*firewall|web.*application.*firewall', score: 75, priority: 'medium' },
      { pattern: 'data.*classification|sensitivity.*labeling', score: 70, priority: 'medium' }
    ],
    detective: [
      { pattern: 'data.*access.*monitoring|audit.*logging', score: 90, priority: 'high' },
      { pattern: 'user.*behavior.*analytics|anomaly.*detection', score: 80, priority: 'medium' },
      { pattern: 'database.*activity.*monitoring', score: 75, priority: 'medium' }
    ],
    corrective: [
      { pattern: 'data.*breach.*response|incident.*response', score: 85, priority: 'high' },
      { pattern: 'forensic.*analysis|evidence.*collection', score: 70, priority: 'medium' }
    ]
  },
  'credential theft': {
    preventive: [
      { pattern: 'multi.*factor.*authentication|mfa|2fa', score: 95, priority: 'high' },
      { pattern: 'password.*policy|password.*management', score: 90, priority: 'high' },
      { pattern: 'privileged.*access.*management|pam', score: 85, priority: 'high' },
      { pattern: 'single.*sign.*on|sso', score: 75, priority: 'medium' },
      { pattern: 'account.*lockout|brute.*force.*protection', score: 70, priority: 'medium' }
    ],
    detective: [
      { pattern: 'login.*monitoring|authentication.*logging', score: 90, priority: 'high' },
      { pattern: 'failed.*login.*detection|suspicious.*activity', score: 80, priority: 'medium' },
      { pattern: 'credential.*monitoring|dark.*web.*monitoring', score: 75, priority: 'medium' }
    ],
    corrective: [
      { pattern: 'password.*reset|credential.*revocation', score: 85, priority: 'high' },
      { pattern: 'account.*recovery|identity.*restoration', score: 70, priority: 'medium' }
    ]
  },
  phishing: {
    preventive: [
      { pattern: 'email.*security|anti.*phishing', score: 95, priority: 'high' },
      { pattern: 'security.*awareness.*training|phishing.*training', score: 90, priority: 'high' },
      { pattern: 'email.*filtering|spam.*protection', score: 85, priority: 'high' },
      { pattern: 'web.*filtering|url.*protection', score: 75, priority: 'medium' }
    ],
    detective: [
      { pattern: 'email.*monitoring|phishing.*detection', score: 85, priority: 'high' },
      { pattern: 'user.*reporting|suspicious.*email.*reporting', score: 80, priority: 'medium' }
    ],
    corrective: [
      { pattern: 'phishing.*response|email.*quarantine', score: 80, priority: 'medium' },
      { pattern: 'user.*education|security.*training', score: 70, priority: 'medium' }
    ]
  }
};

// Asset type to control mappings
const ASSET_CONTROL_MAPPINGS = {
  application: [
    { pattern: 'web.*application.*firewall|waf', score: 90, priority: 'high' },
    { pattern: 'application.*security.*testing|sast|dast', score: 85, priority: 'medium' },
    { pattern: 'code.*review|secure.*development', score: 75, priority: 'medium' }
  ],
  database: [
    { pattern: 'database.*encryption|data.*encryption', score: 95, priority: 'high' },
    { pattern: 'database.*activity.*monitoring|dam', score: 85, priority: 'high' },
    { pattern: 'database.*access.*control|privilege.*management', score: 80, priority: 'medium' }
  ],
  network: [
    { pattern: 'network.*firewall|perimeter.*security', score: 90, priority: 'high' },
    { pattern: 'network.*segmentation|vlan.*isolation', score: 85, priority: 'high' },
    { pattern: 'intrusion.*detection|network.*monitoring', score: 80, priority: 'medium' }
  ],
  endpoint: [
    { pattern: 'endpoint.*protection|edr|antivirus', score: 95, priority: 'high' },
    { pattern: 'device.*management|mobile.*device.*management', score: 80, priority: 'medium' },
    { pattern: 'patch.*management|software.*updates', score: 75, priority: 'medium' }
  ],
  cloud: [
    { pattern: 'cloud.*security.*posture|cspm', score: 90, priority: 'high' },
    { pattern: 'container.*security|kubernetes.*security', score: 85, priority: 'medium' },
    { pattern: 'cloud.*access.*security.*broker|casb', score: 80, priority: 'medium' }
  ]
};

// Compliance framework requirements
const COMPLIANCE_CONTROL_MAPPINGS = {
  'PCI DSS': [
    { pattern: 'encrypt.*cardholder.*data|payment.*encryption', score: 95, priority: 'high' },
    { pattern: 'network.*segmentation|cardholder.*environment', score: 90, priority: 'high' },
    { pattern: 'access.*control|least.*privilege', score: 85, priority: 'medium' }
  ],
  'SOX': [
    { pattern: 'financial.*reporting.*controls|sox.*compliance', score: 95, priority: 'high' },
    { pattern: 'change.*management|configuration.*control', score: 85, priority: 'medium' },
    { pattern: 'audit.*logging|financial.*audit.*trail', score: 80, priority: 'medium' }
  ],
  'HIPAA': [
    { pattern: 'phi.*encryption|healthcare.*data.*protection', score: 95, priority: 'high' },
    { pattern: 'access.*control.*healthcare|hipaa.*compliance', score: 90, priority: 'high' },
    { pattern: 'audit.*logging.*healthcare|phi.*monitoring', score: 85, priority: 'medium' }
  ]
};

/**
 * Calculate relevance score for a control based on risk characteristics
 */
function calculateRelevanceScore(
  controlName: string, 
  controlDescription: string,
  riskChars: RiskCharacteristics
): { score: number; justification: string; priority: 'high' | 'medium' | 'low' } {
  let totalScore = 0;
  const justifications: string[] = [];
  let highestPriority: 'high' | 'medium' | 'low' = 'low';

  const controlText = `${controlName} ${controlDescription}`.toLowerCase();
  
  // Check threat-based mappings
  const threatKey = riskChars.threatCommunity?.toLowerCase() || '';
  const vulnKey = riskChars.vulnerability?.toLowerCase() || '';
  
  // Map common threat patterns
  let threatPattern = '';
  if (threatKey.includes('ransomware') || vulnKey.includes('ransomware')) {
    threatPattern = 'ransomware';
  } else if (threatKey.includes('data') || vulnKey.includes('breach') || vulnKey.includes('data')) {
    threatPattern = 'data breach';
  } else if (threatKey.includes('credential') || vulnKey.includes('password') || vulnKey.includes('authentication')) {
    threatPattern = 'credential theft';
  } else if (threatKey.includes('phishing') || vulnKey.includes('email') || vulnKey.includes('social')) {
    threatPattern = 'phishing';
  }

  if (threatPattern && THREAT_CONTROL_MAPPINGS[threatPattern]) {
    const mappings = THREAT_CONTROL_MAPPINGS[threatPattern];
    
    ['preventive', 'detective', 'corrective'].forEach(controlType => {
      if (mappings[controlType]) {
        mappings[controlType].forEach(mapping => {
          const regex = new RegExp(mapping.pattern, 'i');
          if (regex.test(controlText)) {
            totalScore += mapping.score;
            justifications.push(`Addresses ${threatPattern} threat via ${controlType} control`);
            if (mapping.priority === 'high' && highestPriority !== 'high') {
              highestPriority = 'high';
            } else if (mapping.priority === 'medium' && highestPriority === 'low') {
              highestPriority = 'medium';
            }
          }
        });
      }
    });
  }

  // Check asset-based mappings
  if (riskChars.associatedAssets && riskChars.associatedAssets.length > 0) {
    riskChars.associatedAssets.forEach(assetId => {
      // Infer asset type from asset ID patterns
      const assetText = assetId.toLowerCase();
      let assetType = '';
      
      if (assetText.includes('app') || assetText.includes('web')) {
        assetType = 'application';
      } else if (assetText.includes('db') || assetText.includes('database')) {
        assetType = 'database';
      } else if (assetText.includes('net') || assetText.includes('router') || assetText.includes('switch')) {
        assetType = 'network';
      } else if (assetText.includes('endpoint') || assetText.includes('workstation') || assetText.includes('laptop')) {
        assetType = 'endpoint';
      } else if (assetText.includes('cloud') || assetText.includes('aws') || assetText.includes('azure')) {
        assetType = 'cloud';
      }

      if (assetType && ASSET_CONTROL_MAPPINGS[assetType]) {
        ASSET_CONTROL_MAPPINGS[assetType].forEach(mapping => {
          const regex = new RegExp(mapping.pattern, 'i');
          if (regex.test(controlText)) {
            totalScore += mapping.score * 0.7; // Asset mappings weighted lower than threat mappings
            justifications.push(`Protects ${assetType} assets`);
            if (mapping.priority === 'high' && highestPriority !== 'high') {
              highestPriority = 'high';
            } else if (mapping.priority === 'medium' && highestPriority === 'low') {
              highestPriority = 'medium';
            }
          }
        });
      }
    });
  }

  // Apply severity multiplier
  const severityMultiplier = {
    'critical': 1.2,
    'high': 1.1,
    'medium': 1.0,
    'low': 0.9
  }[riskChars.severity] || 1.0;

  totalScore *= severityMultiplier;

  // Normalize score to 0-100 range
  const finalScore = Math.min(100, Math.max(0, totalScore));
  
  return {
    score: finalScore,
    justification: justifications.length > 0 
      ? justifications.join('; ') 
      : 'General security control applicable to multiple risk types',
    priority: highestPriority
  };
}

/**
 * Get recommended controls for a specific risk
 */
export async function getRecommendedControls(
  riskCharacteristics: RiskCharacteristics,
  availableControls: any[]
): Promise<ControlRecommendation[]> {
  const recommendations: ControlRecommendation[] = [];

  for (const control of availableControls) {
    const { score, justification, priority } = calculateRelevanceScore(
      control.name,
      control.description || '',
      riskCharacteristics
    );

    // Only recommend controls with relevance score > 30
    if (score > 30) {
      recommendations.push({
        controlId: control.controlId,
        name: control.name,
        controlType: control.controlType,
        relevanceScore: score,
        justification,
        priority
      });
    }
  }

  // Sort by relevance score (highest first)
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get threat-specific control suggestions when no controls are associated
 */
export function getThreatSpecificSuggestions(
  threatCommunity: string,
  vulnerability: string
): ControlRecommendation[] {
  const suggestions: ControlRecommendation[] = [];
  
  const threatKey = `${threatCommunity} ${vulnerability}`.toLowerCase();
  
  // Ransomware suggestions
  if (threatKey.includes('ransomware')) {
    suggestions.push(
      {
        controlId: 'SUGGEST-EDR',
        name: 'Endpoint Detection and Response (EDR)',
        controlType: 'preventive',
        relevanceScore: 95,
        justification: 'Essential for detecting and blocking ransomware execution',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-BACKUP',
        name: 'Automated Backup Solution',
        controlType: 'corrective',
        relevanceScore: 90,
        justification: 'Critical for recovery from ransomware attacks',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-EMAIL-SEC',
        name: 'Email Security Gateway',
        controlType: 'preventive',
        relevanceScore: 85,
        justification: 'Blocks ransomware delivery via phishing emails',
        priority: 'high'
      }
    );
  }
  
  // Data breach suggestions
  else if (threatKey.includes('data') || threatKey.includes('breach')) {
    suggestions.push(
      {
        controlId: 'SUGGEST-ENCRYPTION',
        name: 'Data Encryption at Rest',
        controlType: 'preventive',
        relevanceScore: 95,
        justification: 'Protects sensitive data from unauthorized access',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-DLP',
        name: 'Data Loss Prevention (DLP)',
        controlType: 'detective',
        relevanceScore: 85,
        justification: 'Monitors and prevents unauthorized data exfiltration',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-ACCESS-CONTROL',
        name: 'Identity and Access Management',
        controlType: 'preventive',
        relevanceScore: 80,
        justification: 'Restricts data access to authorized users only',
        priority: 'medium'
      }
    );
  }
  
  // Credential theft suggestions
  else if (threatKey.includes('credential') || threatKey.includes('password')) {
    suggestions.push(
      {
        controlId: 'SUGGEST-MFA',
        name: 'Multi-Factor Authentication',
        controlType: 'preventive',
        relevanceScore: 95,
        justification: 'Prevents unauthorized access even with stolen credentials',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-PAM',
        name: 'Privileged Access Management',
        controlType: 'preventive',
        relevanceScore: 85,
        justification: 'Secures high-value administrative accounts',
        priority: 'high'
      },
      {
        controlId: 'SUGGEST-PWD-POLICY',
        name: 'Strong Password Policy',
        controlType: 'preventive',
        relevanceScore: 75,
        justification: 'Reduces likelihood of successful password attacks',
        priority: 'medium'
      }
    );
  }
  
  // Default general suggestions
  else {
    suggestions.push(
      {
        controlId: 'SUGGEST-FIREWALL',
        name: 'Network Firewall',
        controlType: 'preventive',
        relevanceScore: 70,
        justification: 'Basic network perimeter protection',
        priority: 'medium'
      },
      {
        controlId: 'SUGGEST-MONITORING',
        name: 'Security Monitoring (SIEM)',
        controlType: 'detective',
        relevanceScore: 65,
        justification: 'Detects suspicious activities and security events',
        priority: 'medium'
      },
      {
        controlId: 'SUGGEST-INCIDENT-RESPONSE',
        name: 'Incident Response Plan',
        controlType: 'corrective',
        relevanceScore: 60,
        justification: 'Ensures organized response to security incidents',
        priority: 'medium'
      }
    );
  }
  
  return suggestions;
}