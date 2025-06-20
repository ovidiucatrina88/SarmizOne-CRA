import React from "react";
import { Asset } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CornerDownRight } from "lucide-react";

type AssetHierarchyDisplayProps = {
  assets: Asset[];
  enterpriseItems?: any[];
};

export function AssetHierarchyDisplay({ assets, enterpriseItems = [] }: AssetHierarchyDisplayProps) {
  // Find L3 business services (either in assets or enterprise items)
  const businessServices = enterpriseItems.filter(item => 
    item.level === 'L3' || item.hierarchyLevel === 'business_service'
  );
  
  // Find L4 application services
  const applicationServices = assets.filter(asset => 
    asset.type === 'application_service' || 
    asset.hierarchy_level === 'application_service'
  );
  
  // Find L5 technical components
  const technicalComponents = assets.filter(asset => 
    asset.type === 'technical_component' || 
    asset.hierarchy_level === 'technical_component'
  );
  
  // Function to find children of a parent asset
  const findChildren = (parentId: number, childrenList: any[]) => {
    return childrenList.filter(child => child.parentId === parentId);
  };
  
  // Function to find parent name
  const findParentName = (parentId: number, parentList: any[]) => {
    const parent = parentList.find(item => item.id === parentId);
    return parent ? parent.name : 'Unknown';
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Asset Hierarchy Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* L3 Business Services */}
          {businessServices.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-md font-medium">
                <Badge variant="outline" className="mr-2 bg-blue-50">L3</Badge>
                Business Services
              </h3>
              <div className="pl-4 space-y-2">
                {businessServices.map(bs => {
                  // Find L4 application service children
                  const childAppServices = findChildren(bs.id, applicationServices);
                  
                  return (
                    <div key={bs.id} className="border-l-2 pl-4 pb-2">
                      <div className="font-medium">{bs.name} {bs.id && `(ID: ${bs.id})`}</div>
                      
                      {/* L4 Application Services under this Business Service */}
                      {childAppServices.length > 0 ? (
                        <div className="mt-2 pl-4 space-y-2">
                          {childAppServices.map(app => {
                            // Find L5 technical component children
                            const childTechComponents = findChildren(app.id, technicalComponents);
                            
                            return (
                              <div key={app.id} className="border-l-2 border-dashed pl-4 pb-2">
                                <div className="flex items-center">
                                  <CornerDownRight className="h-4 w-4 mr-2 text-gray-400" />
                                  <div>
                                    <Badge variant="outline" className="mr-2 bg-green-50">L4</Badge>
                                    <span className="font-medium">{app.name}</span>
                                    <span className="text-xs text-gray-500 ml-1">({app.assetId})</span>
                                  </div>
                                </div>
                                
                                {/* L5 Technical Components under this Application Service */}
                                {childTechComponents.length > 0 ? (
                                  <div className="mt-2 pl-6 space-y-1">
                                    {childTechComponents.map(tech => (
                                      <div key={tech.id} className="flex items-center">
                                        <CornerDownRight className="h-3 w-3 mr-2 text-gray-400" />
                                        <div>
                                          <Badge variant="outline" className="mr-2 bg-purple-50">L5</Badge>
                                          <span>{tech.name}</span>
                                          <span className="text-xs text-gray-500 ml-1">({tech.assetId})</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="pl-6 mt-1 text-gray-500 text-sm italic">No Application Services attached</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Orphaned L4 Application Services (no parent) */}
          {applicationServices.filter(app => !app.parentId).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-md font-medium">
                <Badge variant="outline" className="mr-2 bg-green-50">L4</Badge>
                Standalone Application Services
              </h3>
              <div className="pl-4 space-y-2">
                {applicationServices.filter(app => !app.parentId).map(app => {
                  const childTechComponents = findChildren(app.id, technicalComponents);
                  
                  return (
                    <div key={app.id} className="border-l-2 pl-4 pb-2">
                      <div className="font-medium">{app.name} <span className="text-xs text-gray-500">({app.assetId})</span></div>
                      
                      {/* L5 Technical Components under this Application Service */}
                      {childTechComponents.length > 0 ? (
                        <div className="mt-2 pl-4 space-y-1">
                          {childTechComponents.map(tech => (
                            <div key={tech.id} className="flex items-center">
                              <CornerDownRight className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <Badge variant="outline" className="mr-2 bg-purple-50">L5</Badge>
                                <span>{tech.name}</span>
                                <span className="text-xs text-gray-500 ml-1">({tech.assetId})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="pl-6 mt-1 text-gray-500 text-sm italic">No Technical Components attached</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Orphaned L5 Technical Components (no parent) */}
          {technicalComponents.filter(tech => !tech.parentId).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-md font-medium">
                <Badge variant="outline" className="mr-2 bg-purple-50">L5</Badge>
                Standalone Technical Components
              </h3>
              <div className="pl-4 space-y-2">
                {technicalComponents.filter(tech => !tech.parentId).map(tech => (
                  <div key={tech.id} className="border-l-2 pl-4 py-1">
                    <div className="font-medium">{tech.name} <span className="text-xs text-gray-500">({tech.assetId})</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* If no hierarchical data exists */}
          {businessServices.length === 0 && 
            applicationServices.length === 0 && 
            technicalComponents.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                No hierarchy data available. Try creating assets with parent-child relationships.
              </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}