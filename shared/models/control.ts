export interface Control {
  id: number;
  controlId: string;
  name: string;
  description: string;
  associatedRisks: string[];
  controlType: 'preventive' | 'detective' | 'corrective';
  controlCategory: 'technical' | 'administrative' | 'physical';
  implementationStatus: 'not_implemented' | 'in_progress' | 'fully_implemented';
  controlEffectiveness: number;
  implementationCost: number;
  costPerAgent: number;
  isPerAgentPricing: boolean;
  deployedAgentCount?: number; // For 'in_progress' controls: how many agents have been deployed so far
  notes: string;
}

export interface Asset {
  id: number;
  assetId: string;
  name: string;
  assetValue: number;
  agentCount?: number;
}

export interface ControlROI {
  id: number;
  controlId: string;
  name: string;
  implementationCost: number;
  totalAgentCount: number;
  riskReduction: number;
  associatedRisksCount: number;
  inherentRisk: number;  // Total inherent risk from associated risks
  roi: number;
}