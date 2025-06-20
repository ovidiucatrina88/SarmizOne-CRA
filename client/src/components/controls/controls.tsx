export interface Control {
  id: string;
  name: string;
  implementationCost: number;
  costPerAgent: number;
  isPerAgentPricing: boolean;
  controlEffectiveness: number; // 0–10
  associatedRisks: string[];
}

export interface Asset {
  assetId: string;
  agentCount: number;
}

export interface ControlROI {
  id: string;
  name: string;
  implementationCost: number;
  totalAgentCount: number;
  riskReduction: number;
  associatedRisksCount: number;
  roi: number;
}
