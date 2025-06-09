import React from "react";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type LegalEntityCostMatrixProps = {
  risks: any[];
  assets: any[];
  legalEntities: any[];
  riskCosts: any[];
  isLoading: boolean;
};

export function LegalEntityCostMatrix({ 
  risks, 
  assets, 
  legalEntities, 
  riskCosts, 
  isLoading 
}: LegalEntityCostMatrixProps) {
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <DollarSign className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
          <p className="mt-2 text-sm text-muted-foreground">Loading entity cost data...</p>
        </div>
      </div>
    );
  }
  
  // If no entities or cost data, show empty state
  if (!riskCosts.length || !legalEntities.length) {
    return (
      <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No Legal Entity Cost Data</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create legal entities and assign assets to them to see cost exposure
          </p>
        </div>
      </div>
    );
  }
  
  // Calculate costs by legal entity
  const entityCostMap = new Map();
  
  // Initialize with all legal entities
  legalEntities.forEach((entity: any) => {
    entityCostMap.set(entity.entityId, 0);
  });
  
  // Sum up costs for each legal entity
  riskCosts.forEach((riskCost: any) => {
    // Get risk details to find associated assets
    const risk = risks.find((r: any) => r.id === riskCost.id);
    if (!risk || !risk.associatedAssets || !Array.isArray(risk.associatedAssets)) return;
    
    // Get assets to determine legal entities
    risk.associatedAssets.forEach((assetId: string) => {
      const asset = assets.find((a: any) => a.assetId === assetId);
      if (!asset || !asset.legalEntity) return;
      
      const entityId = asset.legalEntity;
      if (entityCostMap.has(entityId)) {
        const currentTotal = entityCostMap.get(entityId) || 0;
        const costImpact = riskCost.costImpact || 0;
        
        // Divide cost by number of assets if multiple assets
        const costPerEntity = risk.associatedAssets.length > 1 
          ? costImpact / risk.associatedAssets.length 
          : costImpact;
          
        entityCostMap.set(entityId, currentTotal + costPerEntity);
      }
    });
  });
  
  // No actual data to display
  if (Array.from(entityCostMap.values()).every((v: number) => v === 0)) {
    return (
      <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
        <div className="text-center">
          <DollarSign className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No Cost Data By Entity</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Assign costs to risks associated with legal entities to view this visualization
          </p>
        </div>
      </div>
    );
  }
  
  // Get total for percentage calculation
  const totalEntityCost = Array.from(entityCostMap.values()).reduce((a: number, b: number) => a + b, 0);
  
  // Colors for different entities
  const entityColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];
  
  // Sort by highest value first
  const sortedEntries = Array.from(entityCostMap.entries())
    .sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Entity Cost Distribution</h3>
        <div className="text-sm text-muted-foreground">
          Total: {formatCurrency(totalEntityCost, 'USD')}
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedEntries.map(([entityId, value], index) => {
          if (value === 0) return null;
          
          const entity = legalEntities.find((e: any) => e.entityId === entityId);
          const entityName = entity?.name || entityId;
          const percentage = (value / totalEntityCost) * 100;
          const colorClass = entityColors[index % entityColors.length];
          
          return (
            <div key={entityId} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></div>
                  <span>{entityName}</span>
                </div>
                <div className="font-medium">
                  {formatCurrency(value, 'USD')} ({percentage.toFixed(1)}%)
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-2 rounded-full ${colorClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-md">
            <h3 className="text-base font-medium mb-3">Entity Regulatory Impact</h3>
            <div className="space-y-2">
              {legalEntities.map((entity: any) => {
                // Count distinct regulatory impacts for this entity
                const entityAssets = assets.filter((a: any) => a.legalEntity === entity.entityId);
                const regulations = new Set();
                
                entityAssets.forEach((asset: any) => {
                  if (asset.regulatoryImpact && Array.isArray(asset.regulatoryImpact)) {
                    asset.regulatoryImpact.forEach((reg: string) => regulations.add(reg));
                  }
                });
                
                return (
                  <div key={entity.entityId} className="flex items-center justify-between text-sm">
                    <div>{entity.name}</div>
                    <div className="font-medium">
                      {regulations.size} regulation{regulations.size !== 1 ? 's' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="border p-4 rounded-md">
            <h3 className="text-base font-medium mb-3">Top Asset by Entity</h3>
            <div className="space-y-2">
              {legalEntities.map((entity: any) => {
                const entityAssets = assets.filter((a: any) => a.legalEntity === entity.entityId);
                
                // Sort by asset value if available
                const topAsset = entityAssets.length 
                  ? entityAssets.sort((a: any, b: any) => {
                      const valueA = parseFloat(a.assetValue) || 0;
                      const valueB = parseFloat(b.assetValue) || 0;
                      return valueB - valueA;
                    })[0]
                  : null;
                  
                return (
                  <div key={entity.entityId} className="flex items-center justify-between text-sm">
                    <div>{entity.name}</div>
                    <div className="font-medium text-xs italic truncate max-w-[160px]">
                      {topAsset?.name || "No assets"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}