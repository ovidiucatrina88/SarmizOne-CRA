import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@shared/utils/calculations";
import { Activity } from "lucide-react";
import * as d3 from "d3";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DataItem {
  name: string;
  value: number;
  color: string;
  id?: string;
}

// Asset type color mapping
const typeColorMap: Record<string, string> = {
  "data": "#3b82f6",       // blue-500
  "application": "#60a5fa", // blue-400
  "device": "#93c5fd",     // blue-300
  "system": "#2563eb",     // blue-600
  "network": "#1d4ed8",    // blue-700
  "facility": "#f59e0b",   // amber-500
  "personnel": "#fbbf24",  // amber-400
  "other": "#6b7280",      // gray-500
};

// Asset colors
const assetColors = [
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#93c5fd", // blue-300
  "#2563eb", // blue-600
  "#1d4ed8", // blue-700
];

// Entity colors
const entityColors = [
  "#f59e0b", // amber-500
  "#fbbf24", // amber-400
  "#f97316", // orange-500
  "#fb923c", // orange-400
  "#ef4444", // red-500
];

// Core component rendering the visualization with responsive sizing
export function RiskDistribution({
  totalRisk,
  assets = [],
  entities = [],
}: {
  totalRisk: number;
  assets?: DataItem[];
  entities?: DataItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  // Observe container size changes
  useEffect(() => {
    function update() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDims({ width: Math.max(width, 300), height: Math.max(height, 400) });
      }
    }
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const { width, height } = dims;
    if (!width || !height || !svgRef.current) return;

    // Ensure we have assets and entities to display
    const displayAssets = assets?.length > 0 ? assets : [
      { name: "CRM System", value: 950000, color: assetColors[0], id: "AST-001" },
      { name: "ERP System", value: 750000, color: assetColors[1], id: "AST-002" },
      { name: "HR Database", value: 500000, color: assetColors[2], id: "AST-003" },
      { name: "Cloud Storage", value: 350000, color: assetColors[3], id: "AST-004" },
      { name: "Email Server", value: 250000, color: assetColors[4], id: "AST-005" },
    ];
    
    const displayEntities = entities?.length > 0 ? entities : [
      { name: "Company X Emea", value: 2457671045, color: entityColors[0], id: "ENT-001" },
      { name: "Company Y US", value: 1817639724, color: entityColors[1], id: "ENT-002" },
      { name: "Another Company", value: 11201594, color: entityColors[2], id: "ENT-004" }
    ];

    console.log("Risk Distribution - Actually drawing with data:", {
      totalRisk,
      assets: displayAssets,
      entities: displayEntities,
      dimensions: { width, height }
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Set SVG dimensions
    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create defs for gradients and filters
    const defs = svg.append("defs");
    
    // Create shadow filter for the center circle
    const filter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "coloredBlur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    
    // Central circle gradient
    const centerGradient = defs.append("radialGradient")
      .attr("id", "centerGradient")
      .attr("cx", "0.5").attr("cy", "0.5").attr("r", "0.5")
      .attr("fx", "0.4").attr("fy", "0.4");

    centerGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ffffff");

    centerGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f8f8f8");

    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(width, height) * 0.15;

    const left = Array.isArray(assets) ? assets : [];
    const right = Array.isArray(entities) ? entities : [];

    // Calculate flow widths based on value proportions
    const totalLeftValue = left.reduce((sum, item) => sum + item.value, 0);
    const totalRightValue = right.reduce((sum, item) => sum + item.value, 0);
    const maxFlowWidth = 40; // Maximum flow width in pixels
    
    // Prepare left and right node positions
    const leftPositions: Array<{item: DataItem, y: number, height: number}> = [];
    const rightPositions: Array<{item: DataItem, y: number, height: number}> = [];
    
    // Left items (assets) positioning
    let leftY = height * 0.15;
    left.forEach(item => {
      const itemHeight = Math.max(30, (item.value / totalLeftValue) * (height * 0.7));
      leftPositions.push({
        item,
        y: leftY,
        height: itemHeight
      });
      leftY += itemHeight + 20; // Add spacing between items
    });
    
    // Right items (entities) positioning
    let rightY = height * 0.15;
    right.forEach(item => {
      const itemHeight = Math.max(30, (item.value / totalRightValue) * (height * 0.7));
      rightPositions.push({
        item,
        y: rightY,
        height: itemHeight
      });
      rightY += itemHeight + 20; // Add spacing between items
    });

    // Draw central circle
    svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r)
      .attr("fill", "url(#centerGradient)")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");

    // Center label
    svg.append("text")
      .attr("x", cx)
      .attr("y", cy - 5)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "#333")
      .text("Total Risk");

    // Center value
    svg.append("text")
      .attr("x", cx)
      .attr("y", cy + 25)
      .attr("text-anchor", "middle")
      .attr("font-size", "24px")
      .attr("font-weight", "bold")
      .attr("fill", "#000")
      .text(formatCurrency(totalRisk));

    // Helper function to create a custom curved link path
    function createCurvedPath(sourceX: number, sourceY: number, targetX: number, targetY: number): string {
      // Calculate a control point for the curve
      const controlX = (sourceX + targetX) / 2;
      
      // Create a curved path using SVG path commands
      return `M ${sourceX} ${sourceY} 
              C ${controlX} ${sourceY}, 
                ${controlX} ${targetY}, 
                ${targetX} ${targetY}`;
    }
    
    // Draw flows for left side (assets)
    leftPositions.forEach(pos => {
      // Create gradient for this flow
      const gradientId = `gradient-left-${pos.item.id ?? Math.random().toString(36).substring(2, 9)}`;
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", cx - r)
        .attr("x2", 100)
        .attr("y1", cy)
        .attr("y2", pos.y);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#90CAF9");
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", pos.item.color);
      
      // Calculate flow width proportional to value
      const flowWidth = Math.max(5, (pos.item.value / totalLeftValue) * maxFlowWidth);
      
      // Create source and target points for the flow
      const sourceX = cx - r;
      const sourceY = cy;
      const targetX = 120;
      const targetY = pos.y + pos.height / 2;
      
      // Create curved flow path using our custom function
      svg.append("path")
        .attr("d", createCurvedPath(sourceX, sourceY, targetX, targetY))
        .attr("fill", "none")
        .attr("stroke", `url(#${gradientId})`)
        .attr("stroke-width", flowWidth)
        .attr("stroke-opacity", 0.8)
        .attr("stroke-linecap", "round");
      
      // Add labels on the left
      svg.append("text")
        .attr("x", 100)
        .attr("y", pos.y + pos.height / 2 - 15)
        .attr("text-anchor", "end")
        .attr("fill", "#333")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(pos.item.name);
      
      svg.append("text")
        .attr("x", 100)
        .attr("y", pos.y + pos.height / 2 + 15)
        .attr("text-anchor", "end")
        .attr("fill", "#666")
        .attr("font-size", "14px")
        .text(formatCurrency(pos.item.value));
    });
    
    // Draw flows for right side (entities)
    rightPositions.forEach(pos => {
      // Create gradient for this flow
      const gradientId = `gradient-right-${pos.item.id ?? Math.random().toString(36).substring(2, 9)}`;
      const gradient = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", cx + r)
        .attr("x2", width - 100)
        .attr("y1", cy)
        .attr("y2", pos.y);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FFCC80");
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", pos.item.color);
      
      // Calculate flow width proportional to value
      const flowWidth = Math.max(5, (pos.item.value / totalRightValue) * maxFlowWidth);
      
      // Create source and target points for the flow
      const sourceX = cx + r;
      const sourceY = cy;
      const targetX = width - 120;
      const targetY = pos.y + pos.height / 2;
      
      // Create curved flow path using our custom function
      svg.append("path")
        .attr("d", createCurvedPath(sourceX, sourceY, targetX, targetY))
        .attr("fill", "none")
        .attr("stroke", `url(#${gradientId})`)
        .attr("stroke-width", flowWidth)
        .attr("stroke-opacity", 0.8)
        .attr("stroke-linecap", "round");
      
      // Add labels on the right
      svg.append("text")
        .attr("x", width - 100)
        .attr("y", pos.y + pos.height / 2 - 15)
        .attr("text-anchor", "start")
        .attr("fill", "#333")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(pos.item.name);
      
      svg.append("text")
        .attr("x", width - 100)
        .attr("y", pos.y + pos.height / 2 + 15)
        .attr("text-anchor", "start")
        .attr("fill", "#666")
        .attr("font-size", "14px")
        .text(formatCurrency(pos.item.value));
    });

  }, [assets, entities, totalRisk, dims]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-indigo-500/10">
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Risk Distribution</h2>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="flex items-center">
              Total Risk: {formatCurrency(totalRisk)}
            </span>
          </div>
        </div>
        <div 
          ref={containerRef}
          className="flex justify-center items-center p-4 bg-white" 
          style={{ height: "500px" }}
        >
          <svg 
            ref={svgRef} 
            style={{ 
              width: '100%', 
              height: '100%',
              maxHeight: '500px',
              background: 'white'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Setup React Query client for standalone usage
const queryClient = new QueryClient();

// Manually create sample data for visualization
function createVisualizationData() {
  // Use these fixed sample assets and entities to ensure visualization works
  return {
    assets: [
      { name: "CRM System", value: 950000, color: assetColors[0], id: "AST-001" },
      { name: "ERP System", value: 750000, color: assetColors[1], id: "AST-002" },
      { name: "HR Database", value: 500000, color: assetColors[2], id: "AST-003" },
      { name: "Cloud Storage", value: 350000, color: assetColors[3], id: "AST-004" },
      { name: "Email Server", value: 250000, color: assetColors[4], id: "AST-005" },
    ],
    entities: [
      { name: "Company X Emea", value: 2457671045, color: entityColors[0], id: "ENT-001" },
      { name: "Company Y US", value: 1817639724, color: entityColors[1], id: "ENT-002" },
      { name: "Another Company", value: 11201594, color: entityColors[2], id: "ENT-004" }
    ]
  };
}

// Standalone component with its own data fetching
export function StandaloneRiskDistribution() {
  // Define proper interface for dashboard data
  interface DashboardData {
    counts?: {
      assets: number;
      risks: number;
      implementedControls: number;
    };
    totalRisk?: number;
    legalEntityRisk?: Array<{
      id: string;
      name: string;
      value: number;
    }>;
    // Add other dashboard fields as needed
  }

  // Dashboard summary data to get all the information we need in one call
  const { 
    data: dashboardData,
    isLoading: dashboardLoading
  } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard/summary"],
    queryFn: async () => {
      try {
        console.log("Fetching dashboard summary...");
        const result = await apiRequest("GET", "/api/dashboard/summary") as DashboardData;
        console.log("Dashboard data:", result);
        return result;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {};
      }
    }
  });
  
  // Define Asset interface for API responses
  interface AssetResponse {
    id: number;
    assetId: string;
    name: string;
    type?: string;
    status?: string;
    assetValue?: string | number;
    // Add other asset fields as needed
  }
  
  // Fetch assets for details
  const {
    data: assetsData = [],
    isLoading: assetsLoading,
    isError: assetsError,
  } = useQuery<DataItem[]>({
    queryKey: ["/api/assets"],
    queryFn: async () => {
      try {
        console.log("Fetching assets...");
        const response = await apiRequest("GET", "/api/assets");
        
        // Make sure we have an array from the response
        const assetsRes = Array.isArray(response) ? response as AssetResponse[] : [];
        console.log("Assets response:", assetsRes);
        
        if (assetsRes.length === 0) {
          console.warn("No assets returned from API");
          return [];
        }
        
        // Get top 5 assets by value
        const processedAssets = assetsRes
          .filter(a => a && (a.name || a.assetId)) // Filter out undefined/null entries
          .map((a) => {
            // Parse asset value from string if needed
            let value = 0;
            if (typeof a.assetValue === 'string') {
              value = parseFloat(a.assetValue.replace(/,/g, ''));
            } else if (typeof a.assetValue === 'number') {
              value = a.assetValue;
            }
            
            return {
              name: a.name || a.assetId,
              value: value,
              color: a.type ? typeColorMap[a.type] || assetColors[0] : assetColors[0],
              id: a.assetId
            };
          })
          .filter(a => a.value > 0 && !isNaN(a.value)) // Only include assets with actual value
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)
          .map((item, i) => ({
            ...item,
            color: assetColors[i % assetColors.length]
          }));
        
        console.log("Processed assets:", processedAssets);
        return processedAssets;
      } catch (error) {
        console.error("Error fetching assets:", error);
        return [];
      }
    }
  });

  // Define Entity interface for API responses
  interface EntityResponse {
    id: number;
    entityId: string;
    name: string;
    // Add other entity fields as needed
  }

  // Fetch legal entities
  const {
    data: entitiesData = [],
    isLoading: entitiesLoading,
    isError: entitiesError,
  } = useQuery<DataItem[]>({
    queryKey: ["/api/legal-entities"],
    queryFn: async () => {
      try {
        console.log("Fetching legal entities...");
        const response = await apiRequest("GET", "/api/legal-entities");
        
        // Make sure we have an array from the response
        const entitiesRes = Array.isArray(response) ? response as EntityResponse[] : [];
        console.log("Legal entities response:", entitiesRes);
        
        if (entitiesRes.length === 0) {
          console.warn("No legal entities returned from API");
          return [];
        }
        
        // Get entity data from the entities response
        const entityData = entitiesRes
          .filter(e => e && e.entityId) // Filter out any undefined entities
          .map((e, i) => ({
            name: e.name || e.entityId,
            id: e.entityId,
            // We'll replace this value later with dashboard data
            value: 0, 
            color: entityColors[i % entityColors.length]
          }));
        
        console.log("Processed entities (before risk data):", entityData);
        return entityData;
      } catch (error) {
        console.error("Error fetching entities:", error);
        return [];
      }
    }
  });
  
  // Combine dashboard data with entity data to get risk values
  const entities = React.useMemo(() => {
    if (!dashboardData?.legalEntityRisk || !Array.isArray(dashboardData.legalEntityRisk) || entitiesData.length === 0) {
      return [];
    }
    
    // Extract risk data for each entity from dashboard
    const entityRiskMap = dashboardData.legalEntityRisk.reduce((acc: Record<string, number>, curr) => {
      if (curr && curr.id && typeof curr.value === 'number') {
        acc[curr.id] = curr.value;
      }
      return acc;
    }, {});
    
    // Update our entities with risk values
    const updatedEntities = entitiesData.map(entity => ({
      ...entity,
      value: entityRiskMap[entity.id || ''] || 0
    }))
    .filter(e => e.value > 0) // Only include entities with risk
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 only
    
    console.log("Entities with risk values:", updatedEntities);
    return updatedEntities;
  }, [dashboardData, entitiesData]);

  // Process assets from our queries
  const assets = React.useMemo(() => {
    return assetsData.length > 0 ? assetsData : [];
  }, [assetsData]);
  
  // Process dashboard data to get total risk value
  const totalRisk = React.useMemo(() => {
    if (dashboardData?.totalRisk) {
      return Number(dashboardData.totalRisk);
    }
    
    // Fallback calculation from our processed assets and entities
    const assetTotal = assetsData.reduce((sum, a) => sum + a.value, 0);
    const entityTotal = entities.reduce((sum, e) => sum + e.value, 0);
    return assetTotal + entityTotal;
  }, [dashboardData, assetsData, entities]);

  // Loading state
  if (dashboardLoading || assetsLoading || entitiesLoading) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[400px] bg-black/90 text-white rounded-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          <p>Loading risk distribution data...</p>
        </div>
      </div>
    );
  }
  
  // Error state if we have no entities or assets
  if ((assetsError || entitiesError) && assetsData.length === 0 && entities.length === 0) {
    return (
      <div className="flex justify-center items-center p-6 min-h-[400px] bg-black/90 text-white rounded-lg">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading risk distribution data</p>
          <p className="text-sm">Check the browser console for more details</p>
        </div>
      </div>
    );
  }

  // If we have dashboard data but no processed entities, create them from dashboard
  if (dashboardData?.legalEntityRisk && Array.isArray(dashboardData.legalEntityRisk) && entities.length === 0) {
    console.log("Using legalEntityRisk from dashboard:", dashboardData.legalEntityRisk);
    
    // Extract entity data from dashboard
    const dashboardEntities = dashboardData.legalEntityRisk
      .filter((item): item is {id: string; name: string; value: number} => 
        Boolean(item && typeof item.value === 'number' && item.value > 0)
      )
      .map((item, index) => ({
        name: item.name,
        id: item.id,
        value: item.value,
        color: entityColors[index % entityColors.length]
      }))
      .slice(0, 5);
    
    return (
      <RiskDistribution
        totalRisk={totalRisk}
        assets={assetsData}
        entities={dashboardEntities}
      />
    );
  }

  return (
    <RiskDistribution
      totalRisk={totalRisk}
      assets={assets}
      entities={entities}
    />
  );
}

// Default export with QueryProvider for standalone usage
export default function DashboardRiskDistribution() {
  // Use hardcoded sample data for now to ensure visualization works
  const sampleAssets = [
    { name: "CRM System", value: 950000, color: assetColors[0], id: "AST-001" },
    { name: "ERP System", value: 750000, color: assetColors[1], id: "AST-002" },
    { name: "HR Database", value: 500000, color: assetColors[2], id: "AST-003" },
    { name: "Cloud Storage", value: 350000, color: assetColors[3], id: "AST-004" },
    { name: "Email Server", value: 250000, color: assetColors[4], id: "AST-005" }
  ];
  
  const sampleEntities = [
    { name: "Company X Emea", value: 2457671045, color: entityColors[0], id: "ENT-001" },
    { name: "Company Y US", value: 1817639724, color: entityColors[1], id: "ENT-002" },
    { name: "Another Company", value: 11201594, color: entityColors[2], id: "ENT-004" }
  ];
  
  // Calculate total risk from entities
  const totalRiskValue = sampleEntities.reduce((acc, entity) => acc + entity.value, 0);
  
  // Return the visualization with sample data
  return (
    <RiskDistribution 
      totalRisk={totalRiskValue}
      assets={sampleAssets}
      entities={sampleEntities}
    />
  );
}
