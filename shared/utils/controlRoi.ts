import { Control, Asset, ControlROI } from "../models/control";

// Interface for risk data in ROI calculation
interface RiskForRoi {
  riskId: string;
  residualRisk: number;
  inherentRisk?: number; 
  id?: number | string;
  associatedAssets?: string[];
}

/**
 * Calculate ROI for a single control
 */
export function calculateControlRoi(
  control: Control,
  risks: Array<RiskForRoi>,
  assets: Asset[],
): ControlROI {
  // Convert associatedRisks to strings if they're numbers
  const controlRiskIds = control.associatedRisks ? 
    control.associatedRisks.map(id => id.toString()) : [];
  
  console.log(`Control ${control.id} associatedRisks:`, controlRiskIds);
  
  // Find all risks that are associated with this control by checking both riskId and id
  const assocRisks = risks.filter((r) => {
    // Check if either the risk's ID or riskId matches any of the control's associatedRisks
    const riskIdStr = r.riskId ? r.riskId.toString() : '';
    const riskNumId = r.id ? r.id.toString() : '';
    
    // Check if either ID is in the control's associatedRisks array
    const matchByRiskId = controlRiskIds.includes(riskIdStr);
    const matchById = controlRiskIds.includes(riskNumId);
    const isAssociated = matchByRiskId || matchById;
    
    console.log(`Risk ${riskIdStr} (ID: ${riskNumId}) matched with control ${control.id}: ${isAssociated}`);
    return isAssociated;
  });
  
  // Calculate total residual risk (after controls)
  const totalRiskImpact = assocRisks.reduce(
    (sum, r) => sum + r.residualRisk,
    0,
  );
  
  // Calculate total inherent risk (before controls)
  const totalInherentRisk = assocRisks.reduce(
    (sum, r) => sum + (r.inherentRisk || r.residualRisk),
    0,
  );

  // Collect unique asset IDs that are associated with the risks this control handles
  const uniqueAssetIds = new Set<string>();
  
  // For each risk associated with this control
  assocRisks.forEach((risk) => {
    // Find the full risk object to get its associated assets
    const fullRisk = risks.find(r => r.riskId === risk.riskId);
    if (fullRisk && (fullRisk as any).associatedAssets) {
      // Add each associated asset ID to our set of unique asset IDs
      (fullRisk as any).associatedAssets.forEach((assetId: string) => {
        uniqueAssetIds.add(assetId);
      });
    }
  });
  
  // Helper function to get all child assets recursively
  // Note: Asset hierarchy not fully implemented in current schema
  const getAllChildAssets = (parentAssetId: string): Asset[] => {
    // For now, return empty array as asset hierarchy is not implemented
    // This could be extended when asset parent-child relationships are added
    return [];
  };

  // Calculate total agent count based on implementation status
  let totalAgents = 0;
  
  // Implementation status determines how we count agents
  if (control.implementationStatus === 'fully_implemented') {
    // If fully implemented, count all agents from associated assets AND their children
    totalAgents = Array.from(uniqueAssetIds).reduce(
      (sum, assetId) => {
        const asset = assets.find(a => a.assetId === assetId);
        let assetAgentCount = asset?.agentCount || 0;
        
        // Add agents from all child assets recursively
        const childAssets = getAllChildAssets(assetId);
        const childAgentCount = childAssets.reduce((childSum, childAsset) => {
          return childSum + (childAsset.agentCount || 0);
        }, 0);
        
        console.log(`Asset ${assetId}: direct agents=${assetAgentCount}, child agents=${childAgentCount}, children:`, childAssets.map(c => `${c.assetId}(${c.agentCount})`));
        
        return sum + assetAgentCount + childAgentCount;
      },
      0
    );
  } else if (control.implementationStatus === 'in_progress') {
    // For in progress, use the control's deployedAgentCount if available
    // This would need to be added to the Control interface and database
    totalAgents = control.deployedAgentCount || 0;
  } else {
    // For not_implemented, agent count is 0
    totalAgents = 0;
  }

  // Convert string costs to numbers (database returns strings)
  const baseImplementationCost = typeof control.implementationCost === 'string' 
    ? parseFloat(control.implementationCost) || 0 
    : control.implementationCost || 0;
    
  const costPerAgent = typeof control.costPerAgent === 'string' 
    ? parseFloat(control.costPerAgent) || 0 
    : control.costPerAgent || 0;

  let implCost = baseImplementationCost;
  if (control.isPerAgentPricing) {
    implCost = costPerAgent * totalAgents;
  }

  // Calculate actual risk reduction as the difference between inherent and residual risk
  const riskReduction = totalInherentRisk - totalRiskImpact;

  const roi = implCost > 0 ? (riskReduction - implCost) / implCost : 0;

  return {
    id: control.id,
    controlId: control.controlId || `CTRL-${control.id}`,
    name: control.name,
    implementationCost: implCost,
    totalAgentCount: totalAgents,
    riskReduction,
    associatedRisksCount: assocRisks.length,
    inherentRisk: totalInherentRisk,
    roi,
  };
}
