import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { RiskCalculationParams, Control, Risk } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// We're using a type assertion approach since the Risk type doesn't fully match the API response
// This is a simplification to focus on fixing the immediate issue
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge, 
  ReactFlowProvider, 
  Position, 
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  useReactFlow,
  ConnectionLineType,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RiskNode from './components/RiskNode';
import { getConfidenceColor, getRiskColor, getRiskLevel, formatValue } from './utils/visualization-configs';

// Utility to prioritize server-calculated values over client-calculated values
const getValueFromServerOrCalculated = (
  serverValue: string | number | undefined | null,
  calculatedValue: number,
  useServerValues: boolean = true
): number => {
  // If useServerValues is true, prioritize server values (when available)
  if (useServerValues && serverValue !== undefined && serverValue !== null) {
    // Convert string values to numbers
    const numericValue = typeof serverValue === 'string' 
      ? parseFloat(serverValue) 
      : serverValue;
    
    // Return the server value if it's a valid number
    if (!isNaN(numericValue)) {
      return numericValue;
    }
  }
  
  // Fall back to calculated value
  return calculatedValue;
};

// Utility to safely convert values to numbers
const safeNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) {
    return 0;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return typeof value === 'number' ? value : 0;
};

// Server-only approach: We use server values when available, but provide a simple fallback
// These utility functions are simplified placeholders that will rarely be used since 
// we prioritize server calculations
const getServerValue = (serverValue: any, fallback: number = 0): number => {
  if (serverValue === undefined || serverValue === null) return fallback;
  const numericValue = typeof serverValue === 'string' ? parseFloat(serverValue) : Number(serverValue);
  // Return fallback if NaN
  return isNaN(numericValue) ? fallback : numericValue;
};

// Simplified loss magnitude calculation that just returns the server value or a fallback
const getValueWithFallback = (
  serverValue: any,
  localParams: RiskCalculationParams,
  type: string = 'inherent'
): number => {
  // Use server value if available
  if (serverValue !== undefined && serverValue !== null) {
    return getServerValue(serverValue);
  }
  
  // Simple fallback calculation based on primary loss magnitude
  // This is an extreme simplification compared to the full FAIR calculation
  const fallbackValue = type === 'residual' 
    ? getServerValue(localParams.primaryLossMagnitudeAvg) * 0.5 // 50% reduction for residual risk
    : getServerValue(localParams.primaryLossMagnitudeAvg);
    
  console.warn(`No server value available for ${type} risk. Using fallback calculation.`);
  return fallbackValue;
};

interface XyflowFairVisualizationProps {
  riskName: string;
  riskId?: string;  // Make riskId optional
  riskDescription?: string;
  riskParams: RiskCalculationParams;
  controls?: any[];  // Add controls from Control Inventory with flexible typing
  className?: string;
  darkMode?: boolean;
  riskFromApi?: any; // Use any type to bypass TypeScript checking for now
  useServerCalculations?: boolean; // Flag to enforce using server-calculated values only
}

// Define available node types for ReactFlow
const nodeTypes = {
  riskNode: RiskNode
};

const XyflowFairVisualization: React.FC<XyflowFairVisualizationProps> = ({
  riskName,
  riskId,
  riskDescription,
  riskParams,
  controls = [],  // Default to empty array if not provided
  className = '',
  darkMode = true,
  riskFromApi, // The full risk object from API with server-calculated values
  useServerCalculations = false // Default to false for backward compatibility
}) => {
  // Debug log at component initialization with server calculation flag
  console.log('XyflowFairVisualization props:', {
    riskName,
    riskId,
    useServerCalculations,
    primaryLossFromParams: riskParams ? {
      min: riskParams.primaryLossMagnitudeMin,
      avg: riskParams.primaryLossMagnitudeAvg,
      max: riskParams.primaryLossMagnitudeMax
    } : 'No risk params',
    primaryLossFromApi: riskFromApi ? {
      min: riskFromApi.primaryLossMagnitudeMin,
      avg: riskFromApi.primaryLossMagnitudeAvg,
      max: riskFromApi.primaryLossMagnitudeMax
    } : 'No risk from API',
    serverValues: riskFromApi ? {
      inherentRisk: riskFromApi.inherentRisk,
      residualRisk: riskFromApi.residualRisk
    } : 'No server values',
    controlsCount: controls ? controls.length : 0
  });

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Use callbacks for node and edge changes - this makes dragging more fluid
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );
  
  // Helper to determine if an edge is connected to the selected node
  const isEdgeConnected = useCallback((edge: Edge, nodeId: string): boolean => {
    return edge.source === nodeId || edge.target === nodeId;
  }, []);

  // Handler for node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node selected:', node.id);
    
    // If already selected, deselect it
    if (selectedNode === node.id) {
      setSelectedNode(null);
      
      // Reset edge styles
      setEdges((edgs) =>
        edgs.map((e) => ({
          ...e,
          animated: e.source === 'risk',
          style: {
            ...e.style,
            stroke: e.source === 'risk' ? 'rgba(99, 102, 241, 0.7)' : '#94a3b8',
            strokeWidth: e.source === 'risk' ? 2.5 : 1.5,
            opacity: 0.7
          }
        }))
      );
      return;
    }
    
    // Set the selected node
    setSelectedNode(node.id);
    
    // Update edges - highlight only those connected to the selected node
    setEdges((edgs) =>
      edgs.map((e) => {
        const isConnected = isEdgeConnected(e, node.id);
        return {
          ...e,
          animated: isConnected, // Animate only edges connected to selected node
          style: {
            ...e.style,
            stroke: isConnected ? '#6366f1' : '#94a3b8',  // Highlight connected edges
            strokeWidth: isConnected ? 2.5 : 1.5,
            opacity: isConnected ? 1 : 0.6,
          }
        };
      })
    );
  }, [selectedNode, isEdgeConnected, setEdges]);
  
  // Handler for when nodes are dragged - this enhances visual feedback
  const onNodeDrag = useCallback((event: React.MouseEvent, node: Node) => {
    // Update connected edges while dragging for better visual feedback
    setEdges((edgs) =>
      edgs.map((e) => {
        const isConnected = isEdgeConnected(e, node.id);
        if (isConnected) {
          return {
            ...e,
            animated: true,
            style: {
              ...e.style,
              stroke: '#6366f1', // indigo-500
              strokeWidth: 2.5,
              opacity: 0.9,
            }
          };
        }
        return e;
      })
    );
  }, [isEdgeConnected, setEdges]);
  
  // Get risk parameters from server data with fallbacks
  const serverParams = useMemo(() => {
    console.log('Using server-calculated parameters');
    
    // Extract simple control effectiveness values for display only
    const controlEffectiveness = {
      eAvoid: getServerValue(riskFromApi?.eAvoid, 0),
      eDeter: getServerValue(riskFromApi?.eDeter, 0),
      eResist: getServerValue(riskFromApi?.eResist, 0),
      eDetect: getServerValue(riskFromApi?.eDetect, 0)
    };
    
    // Log control effectiveness values if available
    if (controls && controls.length > 0) {
      console.log('Controls present:', controls.length);
    }
    
    // Create a complete parameter set with server values or fallbacks
    return {
      ...riskParams,
      
      // Pre-calculated values from server
      threatEventFrequencyMin: getServerValue(riskFromApi?.threatEventFrequencyMin, riskParams.threatEventFrequencyMin || 0.3),
      threatEventFrequencyAvg: getServerValue(riskFromApi?.threatEventFrequencyAvg, riskParams.threatEventFrequencyAvg || 1),
      threatEventFrequencyMax: getServerValue(riskFromApi?.threatEventFrequencyMax, riskParams.threatEventFrequencyMax || 2),
      
      susceptibilityMin: getServerValue(riskFromApi?.susceptibilityMin, riskParams.susceptibilityMin || 0.1),
      susceptibilityAvg: getServerValue(riskFromApi?.susceptibilityAvg, riskParams.susceptibilityAvg || 0.2),
      susceptibilityMax: getServerValue(riskFromApi?.susceptibilityMax, riskParams.susceptibilityMax || 0.4),
      
      inherentRisk: getServerValue(riskFromApi?.inherentRisk, riskParams.primaryLossMagnitudeAvg || 100000),
      residualRisk: getServerValue(riskFromApi?.residualRisk, (riskParams.primaryLossMagnitudeAvg || 100000) * 0.7),
      
      // Basic FAIR parameters
      contactFrequencyMin: getServerValue(riskFromApi?.contactFrequencyMin, riskParams.contactFrequencyMin || 5),
      contactFrequencyAvg: getServerValue(riskFromApi?.contactFrequencyAvg, riskParams.contactFrequencyAvg || 10),
      contactFrequencyMax: getServerValue(riskFromApi?.contactFrequencyMax, riskParams.contactFrequencyMax || 15),
      contactFrequencyConfidence: riskFromApi?.contactFrequencyConfidence || riskParams.contactFrequencyConfidence || 'Medium',
      
      probabilityOfActionMin: getServerValue(riskFromApi?.probabilityOfActionMin, riskParams.probabilityOfActionMin || 0.1),
      probabilityOfActionAvg: getServerValue(riskFromApi?.probabilityOfActionAvg, riskParams.probabilityOfActionAvg || 0.3),
      probabilityOfActionMax: getServerValue(riskFromApi?.probabilityOfActionMax, riskParams.probabilityOfActionMax || 0.5),
      probabilityOfActionConfidence: riskFromApi?.probabilityOfActionConfidence || riskParams.probabilityOfActionConfidence || 'Medium',
      
      primaryLossMagnitudeMin: getServerValue(riskFromApi?.primaryLossMagnitudeMin, riskParams.primaryLossMagnitudeMin || 50000),
      primaryLossMagnitudeAvg: getServerValue(riskFromApi?.primaryLossMagnitudeAvg, riskParams.primaryLossMagnitudeAvg || 100000),
      primaryLossMagnitudeMax: getServerValue(riskFromApi?.primaryLossMagnitudeMax, riskParams.primaryLossMagnitudeMax || 250000),
      primaryLossMagnitudeConfidence: riskFromApi?.primaryLossMagnitudeConfidence || riskParams.primaryLossMagnitudeConfidence || 'Medium',
      
      // Control effectiveness values for UI display
      controlEffectiveness,
      eAvoid: controlEffectiveness.eAvoid,
      eDeter: controlEffectiveness.eDeter,
      eResist: controlEffectiveness.eResist,
      eDetect: controlEffectiveness.eDetect
    };
  }, [
    riskFromApi, 
    riskParams,
    controls 
  ]);
  
  // Utility function for safe number conversion
  const safeNumber = (value: any): number => {
    // Handle null, undefined, or empty string/values
    if (value === null || value === undefined || value === '') return 0;
    
    // Convert to number, ensuring strings are properly parsed
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    
    // Return 0 for NaN values or negative values (which shouldn't exist in risk parameters)
    return isNaN(num) ? 0 : Math.max(0, num);
  };
  
  // Use the global getValueFromServerOrCalculated function defined above
  
  // Debug function to log which values are being used (server vs client calculations)
  const logCalculationSource = useCallback((serverValue: any, calculatedValue: any, paramName: string) => {
    if (useServerCalculations && serverValue !== undefined && serverValue !== null) {
      console.log(`Using SERVER-calculated ${paramName}: ${safeNumber(serverValue)}`);
    } else {
      console.log(`Using CLIENT-calculated ${paramName}: ${calculatedValue}`);
    }
  }, [useServerCalculations]);

  // Create nodes for the FAIR visualization
  const createNodes = useCallback(() => {
    const levelSpacing = 180;  // Vertical spacing between levels
    const horizontalSpacing = 250;  // Horizontal spacing between nodes
    
    // If we're using server calculations or we have the full risk object from API
    if (useServerCalculations || riskFromApi) {
      console.log("Using server-calculated values for risk visualization");
      
      // Log server-calculated risk values for debugging
      if (riskFromApi) {
        console.log("Server-calculated values:", {
          inherentRisk: safeNumber(riskFromApi.inherentRisk),
          residualRisk: safeNumber(riskFromApi.residualRisk),
          usingServerCalcs: useServerCalculations
        });
        
        // Log all risk values for debugging
        console.log("Loss Event Frequency values (from API):", {
          min: safeNumber(riskFromApi.lossEventFrequencyMin),
          avg: safeNumber(riskFromApi.lossEventFrequencyAvg),
          max: safeNumber(riskFromApi.lossEventFrequencyMax)
        });
        
        console.log("Primary Loss Magnitude values (from API):", {
          min: safeNumber(riskFromApi.primaryLossMagnitudeMin),
          avg: safeNumber(riskFromApi.primaryLossMagnitudeAvg),
          max: safeNumber(riskFromApi.primaryLossMagnitudeMax)
        });
        
        console.log("Susceptibility values (from API):", {
          min: safeNumber(riskFromApi.susceptibilityMin),
          avg: safeNumber(riskFromApi.susceptibilityAvg),
          max: safeNumber(riskFromApi.susceptibilityMax)
        });
      }
      return [
        // Level 0 (Top)
        {
          id: 'risk',
          type: 'riskNode',
          data: {
            label: 'Risk (Loss Expectancy)',
            // Use server-calculated values for inherent and residual risk
            inherentValue: useServerCalculations ? safeNumber(riskFromApi.inherentRisk) : 
              (riskParams.inherentRisk || 0),
            value: useServerCalculations ? safeNumber(riskFromApi.residualRisk) : 
              (riskParams.residualRisk || 0),
            description: riskFromApi.description || riskDescription,
            valueLabel: 'Expected Annual Loss',
            hideMinMaxAvg: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 2, y: 0 },
          sourcePosition: Position.Bottom,
        },
        
        // Level 1 (First level of decomposition)
        {
          id: 'lef',
          type: 'riskNode',
          data: {
            label: 'Loss Event Frequency',
            description: 'How often losses occur',
            // Read from database
            value: safeNumber(riskFromApi.lossEventFrequencyAvg), // Set the value to avg for display
            min: safeNumber(riskFromApi.lossEventFrequencyMin),
            avg: safeNumber(riskFromApi.lossEventFrequencyAvg),
            max: safeNumber(riskFromApi.lossEventFrequencyMax),
            confidence: riskFromApi.lossEventFrequencyConfidence,
            valueLabel: 'Events per year',
            selected: false,
          },
          position: { x: horizontalSpacing, y: levelSpacing },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        {
          id: 'lm',
          type: 'riskNode',
          data: {
            label: 'Loss Magnitude',
            description: 'Value of losses when they occur',
            // Read Loss Magnitude values directly from database
            value: safeNumber(riskFromApi.lossMagnitudeAvg),
            min: safeNumber(riskFromApi.lossMagnitudeMin),
            avg: safeNumber(riskFromApi.lossMagnitudeAvg),
            max: safeNumber(riskFromApi.lossMagnitudeMax),
            confidence: riskFromApi.lossMagnitudeConfidence,
            valueLabel: '$ per event',
            formatAsCurrency: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 3, y: levelSpacing },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        
        // Level 2 (Second level of decomposition)
        {
          id: 'tef',
          type: 'riskNode',
          data: {
            label: 'Threat Event Frequency',
            description: 'How often threats occur',
            // Read from database
            value: safeNumber(riskFromApi.threatEventFrequencyAvg),
            min: safeNumber(riskFromApi.threatEventFrequencyMin),
            avg: safeNumber(riskFromApi.threatEventFrequencyAvg),
            max: safeNumber(riskFromApi.threatEventFrequencyMax),
            confidence: riskFromApi.threatEventFrequencyConfidence,
            valueLabel: 'Events per year',
            selected: false,
          },
          position: { x: horizontalSpacing * 0.5, y: levelSpacing * 2 },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        {
          id: 'vuln',
          type: 'riskNode',
          data: {
            label: 'Vulnerability',
            description: 'Likelihood of success given attempt',
            value: safeNumber(riskFromApi.susceptibilityAvg),
            min: safeNumber(riskFromApi.susceptibilityMin),
            avg: safeNumber(riskFromApi.susceptibilityAvg),
            max: safeNumber(riskFromApi.susceptibilityMax),
            confidence: riskFromApi.susceptibilityConfidence,
            valueLabel: 'Probability',
            formatAsPercentage: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 1.5, y: levelSpacing * 2 },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        {
          id: 'pl',
          type: 'riskNode',
          data: {
            label: 'Primary Loss',
            description: 'Direct losses from events',
            value: safeNumber(riskFromApi.primaryLossMagnitudeAvg),
            min: safeNumber(riskFromApi.primaryLossMagnitudeMin),
            avg: safeNumber(riskFromApi.primaryLossMagnitudeAvg),
            max: safeNumber(riskFromApi.primaryLossMagnitudeMax),
            confidence: riskFromApi.primaryLossMagnitudeConfidence,
            valueLabel: '$ per event',
            formatAsCurrency: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 2.5, y: levelSpacing * 2 },
          targetPosition: Position.Top,
        },
        {
          id: 'sl',
          type: 'riskNode',
          data: {
            label: 'Secondary Loss',
            description: 'Indirect consequences of events',
            // Calculate from database values
            value: safeNumber(riskFromApi.secondaryLossMagnitudeAvg) * safeNumber(riskFromApi.secondaryLossEventFrequencyAvg),
            min: safeNumber(riskFromApi.secondaryLossMagnitudeMin) * safeNumber(riskFromApi.secondaryLossEventFrequencyMin),
            avg: safeNumber(riskFromApi.secondaryLossMagnitudeAvg) * safeNumber(riskFromApi.secondaryLossEventFrequencyAvg),
            max: safeNumber(riskFromApi.secondaryLossMagnitudeMax) * safeNumber(riskFromApi.secondaryLossEventFrequencyMax),
            confidence: riskFromApi.secondaryLossMagnitudeConfidence,
            valueLabel: '$ per event',
            formatAsCurrency: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 3.5, y: levelSpacing * 2 },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        },
        
        // Level 3 (Third level of decomposition)
        {
          id: 'cf',
          type: 'riskNode',
          data: {
            label: 'Contact Frequency',
            description: 'How often threats attempt actions',
            value: safeNumber(riskFromApi.contactFrequencyAvg),
            min: safeNumber(riskFromApi.contactFrequencyMin),
            avg: safeNumber(riskFromApi.contactFrequencyAvg),
            max: safeNumber(riskFromApi.contactFrequencyMax),
            confidence: riskFromApi.contactFrequencyConfidence,
            valueLabel: 'Events per year',
            selected: false,
          },
          position: { x: horizontalSpacing * 0, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        },
        {
          id: 'poa',
          type: 'riskNode',
          data: {
            label: 'Probability of Action',
            description: 'Likelihood of attempted action',
            value: safeNumber(riskFromApi.probabilityOfActionAvg),
            min: safeNumber(riskFromApi.probabilityOfActionMin),
            avg: safeNumber(riskFromApi.probabilityOfActionAvg), 
            max: safeNumber(riskFromApi.probabilityOfActionMax),
            confidence: riskFromApi.probabilityOfActionConfidence,
            valueLabel: 'Probability',
            formatAsPercentage: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 1, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        },
        {
          id: 'tcap',
          type: 'riskNode',
          data: {
            label: 'Threat Capability',
            description: 'Attacker skill level (1-10)',
            value: safeNumber(riskFromApi.threatCapabilityAvg),
            min: safeNumber(riskFromApi.threatCapabilityMin),
            avg: safeNumber(riskFromApi.threatCapabilityAvg),
            max: safeNumber(riskFromApi.threatCapabilityMax),
            confidence: riskFromApi.threatCapabilityConfidence,
            valueLabel: 'Scale 1-10',
            selected: false,
          },
          position: { x: horizontalSpacing * 1.25, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        },
        {
          id: 'rs',
          type: 'riskNode',
          data: {
            label: 'Resistance Strength',
            description: 'Control effectiveness (1-10)',
            value: safeNumber(riskFromApi.resistanceStrengthAvg),
            min: safeNumber(riskFromApi.resistanceStrengthMin),
            avg: safeNumber(riskFromApi.resistanceStrengthAvg),
            max: safeNumber(riskFromApi.resistanceStrengthMax),
            confidence: riskFromApi.resistanceStrengthConfidence,
            valueLabel: 'Scale 1-10',
            controls: controls,
            controlEffectiveness: controls && controls.length > 0 
              ? controls.reduce((total, control) => total + (control.controlEffectiveness || 0), 0) / controls.length 
              : 0,
            selected: false,
          },
          position: { x: horizontalSpacing * 1.75, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        },
        {
          id: 'slef',
          type: 'riskNode',
          data: {
            label: 'Secondary Loss Event Frequency',
            description: 'How often secondary losses occur',
            min: safeNumber(riskFromApi.secondaryLossEventFrequencyMin) || 0.1,
            avg: safeNumber(riskFromApi.secondaryLossEventFrequencyAvg) || 0.3, 
            max: safeNumber(riskFromApi.secondaryLossEventFrequencyMax) || 0.5,
            confidence: riskFromApi.secondaryLossEventFrequencyConfidence,
            valueLabel: 'Probability',
            formatAsPercentage: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 3, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        },
        {
          id: 'slm',
          type: 'riskNode',
          data: {
            label: 'Secondary Loss Magnitude',
            description: 'Value of indirect losses',
            value: safeNumber(riskFromApi.secondaryLossMagnitudeAvg) || 25000,
            min: safeNumber(riskFromApi.secondaryLossMagnitudeMin) || 5000,
            avg: safeNumber(riskFromApi.secondaryLossMagnitudeAvg) || 25000,
            max: safeNumber(riskFromApi.secondaryLossMagnitudeMax) || 100000,
            confidence: riskFromApi.secondaryLossMagnitudeConfidence,
            valueLabel: '$ per event',
            formatAsCurrency: true,
            selected: false,
          },
          position: { x: horizontalSpacing * 4, y: levelSpacing * 3 },
          targetPosition: Position.Top,
        }
      ];
    }
    
    // Fallback to calculating from parameters if riskFromApi is not available
    return [
      // Level 0 (Top)
      {
        id: 'risk',
        type: 'riskNode',
        data: {
          label: 'Risk (Loss Expectancy)',
          // Calculate inherent risk (without controls)
          // Based on monteCarlo.ts: inherentRisk = lefUn * lmUn
          // Where:
          // lefUn = cf * poa * sus
          // lmUn = pl + slef * slm
          // When server calculations are enforced and available, use those
          inherentValue: (() => {
            const serverValue = riskFromApi?.inherentRisk;
            // Get server value with simple fallback if not available
            const value = getValueWithFallback(serverValue, riskParams, 'inherent');
            
            // Log which calculation source is being used
            console.log(`Using ${serverValue ? 'SERVER' : 'fallback'} value for inherent risk: ${value}`);
            
            return value;
          })(),
          
          // Calculate residual risk (with controls)
          value: (() => {
            const serverValue = riskFromApi?.residualRisk;
            // Get server value with simple fallback if not available
            const value = getValueWithFallback(serverValue, riskParams, 'residual');
            
            // Log which calculation source is being used
            console.log(`Using ${serverValue ? 'SERVER' : 'fallback'} value for residual risk: ${value}`);
            
            return value;
          })(),
                 
          // Show projections based on additional controls to be added (for demo purposes)
          // Using residual value with an additional 25% reduction for future projections
          futureValue: (() => {
            const serverValue = riskFromApi?.residualRisk;
            // Get server value with simple fallback
            const baseValue = getValueWithFallback(serverValue, riskParams, 'residual');
            
            // Apply a 25% reduction to model future improvements
            const projectedValue = baseValue * 0.75;
            
            console.log(`Using ${serverValue ? 'SERVER' : 'fallback'} value for future risk projection: ${projectedValue}`);
            
            return projectedValue;
          })(),
                 
          // Min values using the same formula as the main calculation
          // For min values, use server values with a small reduction factor to visually represent the lower bound
          min: (() => {
            const baseValue = getValueWithFallback(riskFromApi?.residualRisk, riskParams, 'residual');
            // Use a 90% factor of the actual value for the lower bound
            const minValue = baseValue * 0.9;
            
            console.log(`Using min value for visualization: ${minValue}`);
            return minValue;
          })(),
                
          // For max values, use server values with a small increase factor to visually represent the upper bound
          max: (() => {
            const baseValue = getValueWithFallback(riskFromApi?.residualRisk, riskParams, 'residual');
            // Use a 110% factor of the actual value for the upper bound
            const maxValue = baseValue * 1.1;
            
            console.log(`Using max value for visualization: ${maxValue}`);
            return maxValue;
          })(),
          confidence: 'Medium',
          isCurrency: true,
          selected: false,
          color: '#7e22ce', // purple-700
        },
        position: { x: horizontalSpacing * 2, y: 0 },
        sourcePosition: Position.Bottom,
      },
      
      // Level 1
      {
        id: 'lef',
        type: 'riskNode',
        data: {
          label: 'Loss Event Frequency',
          value: serverParams.threatEventFrequencyAvg,
          // Calculate future value (20% reduction for demo purposes)
          futureValue: serverParams.threatEventFrequencyAvg * 0.8,
          min: serverParams.threatEventFrequencyMin,
          max: serverParams.threatEventFrequencyMax,
          confidence: riskFromApi?.lossEventFrequencyConfidence || 'Medium',
          selected: false,
          color: '#f97316', // orange-500
        },
        position: { x: horizontalSpacing, y: levelSpacing },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: 'lm',
        type: 'riskNode',
        data: {
          label: 'Loss Magnitude',
          value: serverParams.primaryLossMagnitudeAvg,
          // Calculate future value (10% reduction for demo purposes)
          futureValue: serverParams.primaryLossMagnitudeAvg * 0.9,
          min: serverParams.primaryLossMagnitudeMin,
          max: serverParams.primaryLossMagnitudeMax,
          confidence: serverParams.primaryLossMagnitudeConfidence,
          isCurrency: true,
          selected: false,
          color: '#0ea5e9', // sky-500
        },
        position: { x: horizontalSpacing * 3, y: levelSpacing },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      
      // Level 2
      {
        id: 'tef',
        type: 'riskNode',
        data: {
          label: 'Threat Event Frequency',
          value: serverParams.threatEventFrequencyAvg,
          min: serverParams.threatEventFrequencyMin,
          max: serverParams.threatEventFrequencyMax,
          confidence: 'Medium',
          selected: false,
        },
        position: { x: horizontalSpacing * 0.5, y: levelSpacing * 2 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: 'vuln',
        type: 'riskNode',
        data: {
          label: 'Vulnerability',
          value: serverParams.susceptibilityAvg,
          min: serverParams.susceptibilityMin,
          max: serverParams.susceptibilityMax,
          confidence: 'Medium',
          selected: false,
        },
        position: { x: horizontalSpacing * 1.5, y: levelSpacing * 2 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      {
        id: 'pl',
        type: 'riskNode',
        data: {
          label: 'Primary Loss',
          value: serverParams.primaryLossMagnitudeAvg,
          min: serverParams.primaryLossMagnitudeMin,
          max: serverParams.primaryLossMagnitudeMax,
          confidence: serverParams.primaryLossMagnitudeConfidence,
          isCurrency: true,
          selected: false,
        },
        position: { x: horizontalSpacing * 2.5, y: levelSpacing * 2 },
        targetPosition: Position.Top,
      },
      {
        id: 'sl',
        type: 'riskNode',
        data: {
          label: 'Secondary Loss',
          value: serverParams.secondaryLossMagnitudeAvg || 0,
          min: serverParams.secondaryLossMagnitudeMin,
          max: serverParams.secondaryLossMagnitudeMax,
          confidence: serverParams.secondaryLossMagnitudeConfidence || 'Low',
          isCurrency: true,
          selected: false,
        },
        position: { x: horizontalSpacing * 3.5, y: levelSpacing * 2 },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      
      // Level 3
      {
        id: 'cf',
        type: 'riskNode',
        data: {
          label: 'Contact Frequency',
          value: serverParams.contactFrequencyAvg,
          min: serverParams.contactFrequencyMin,
          max: serverParams.contactFrequencyMax,
          confidence: serverParams.contactFrequencyConfidence,
          selected: false,
        },
        position: { x: horizontalSpacing * 0.25, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      },
      {
        id: 'poa',
        type: 'riskNode',
        data: {
          label: 'Probability of Action',
          value: serverParams.probabilityOfActionAvg,
          min: serverParams.probabilityOfActionMin,
          max: serverParams.probabilityOfActionMax,
          confidence: serverParams.probabilityOfActionConfidence,
          selected: false,
        },
        position: { x: horizontalSpacing * 0.75, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      },
      {
        id: 'tcap',
        type: 'riskNode',
        data: {
          label: 'Threat Capability',
          value: serverParams.threatCapabilityAvg,
          min: serverParams.threatCapabilityMin,
          max: serverParams.threatCapabilityMax,
          confidence: serverParams.threatCapabilityConfidence,
          selected: false,
        },
        position: { x: horizontalSpacing * 1.25, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      },
      {
        id: 'rs',
        type: 'riskNode',
        data: {
          label: 'Resistance Strength',
          value: serverParams.resistanceStrengthAvg,
          min: serverParams.resistanceStrengthMin,
          max: serverParams.resistanceStrengthMax,
          confidence: serverParams.resistanceStrengthConfidence,
          selected: false,
        },
        position: { x: horizontalSpacing * 1.75, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      },
      
      // Level 4
      {
        id: 'slef',
        type: 'riskNode',
        data: {
          label: 'Secondary Loss Event Frequency',
          value: serverParams.secondaryLossEventFrequencyAvg || 0,
          min: serverParams.secondaryLossEventFrequencyMin,
          max: serverParams.secondaryLossEventFrequencyMax,
          confidence: serverParams.secondaryLossEventFrequencyConfidence || 'Low',
          selected: false,
        },
        position: { x: horizontalSpacing * 3.25, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      },
      {
        id: 'slm',
        type: 'riskNode',
        data: {
          label: 'Secondary Loss Magnitude',
          value: serverParams.secondaryLossMagnitudeAvg || 0,
          min: serverParams.secondaryLossMagnitudeMin,
          max: serverParams.secondaryLossMagnitudeMax,
          confidence: serverParams.secondaryLossMagnitudeConfidence || 'Low',
          isCurrency: true,
          selected: false,
        },
        position: { x: horizontalSpacing * 3.75, y: levelSpacing * 3 },
        targetPosition: Position.Top,
      }
    ];
  }, [serverParams, riskFromApi, controls]);
  
  // Create edges for the FAIR visualization
  const createEdges = useCallback(() => {
    return [
      // Top level connections
      { 
        id: 'e-risk-lef', 
        source: 'risk', 
        target: 'lef',
        animated: true,
        type: 'smoothstep',
        style: { 
          stroke: '#8b5cf6', // purple-600 to match RISK gradient
          strokeWidth: 3,
          transition: 'all 0.3s ease',
          opacity: 0.8
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6', // purple-600 to match RISK gradient
          width: 20,
          height: 20,
        }
      },
      { 
        id: 'e-risk-lm', 
        source: 'risk', 
        target: 'lm',
        animated: true,
        type: 'smoothstep',
        style: { 
          stroke: '#8b5cf6', // purple-600 to match RISK gradient
          strokeWidth: 3,
          transition: 'all 0.3s ease',
          opacity: 0.8
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6', // purple-600 to match RISK gradient
          width: 20,
          height: 20,
        }
      },
      
      // First level connections - LEF connections
      { 
        id: 'e-lef-tef', 
        source: 'lef', 
        target: 'tef',
        type: 'smoothstep',
        style: { 
          stroke: '#ea580c', // orange-600 to match LEF gradient
          strokeWidth: 2.5,
          transition: 'all 0.3s ease',
          opacity: 0.7
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ea580c', // orange-600 to match LEF gradient
          width: 15,
          height: 15,
        }
      },
      { 
        id: 'e-lef-vuln', 
        source: 'lef', 
        target: 'vuln',
        type: 'smoothstep',
        style: { 
          stroke: '#ea580c', // orange-600 to match LEF gradient
          strokeWidth: 2.5,
          transition: 'all 0.3s ease',
          opacity: 0.7
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#ea580c', // orange-600 to match LEF gradient
          width: 15,
          height: 15,
        }
      },
      
      // First level connections - LM connections
      { 
        id: 'e-lm-pl', 
        source: 'lm', 
        target: 'pl',
        type: 'smoothstep',
        style: { 
          stroke: '#0284c7', // sky-600 to match LM gradient
          strokeWidth: 2.5,
          transition: 'all 0.3s ease',
          opacity: 0.7
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#0284c7', // sky-600 to match LM gradient
          width: 15,
          height: 15,
        }
      },
      { 
        id: 'e-lm-sl', 
        source: 'lm', 
        target: 'sl',
        type: 'smoothstep',
        style: { 
          stroke: '#0284c7', // sky-600 to match LM gradient
          strokeWidth: 2.5,
          transition: 'all 0.3s ease',
          opacity: 0.7
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#0284c7', // sky-600 to match LM gradient
          width: 15,
          height: 15,
        }
      },
      
      // Second level connections
      { 
        id: 'e-tef-cf', 
        source: 'tef', 
        target: 'cf',
        type: 'smoothstep',
        style: { 
          stroke: '#3b82f6', // blue-500 to match TEF gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6', // blue-500 to match TEF gradient
          width: 12,
          height: 12,
        }
      },
      { 
        id: 'e-tef-poa', 
        source: 'tef', 
        target: 'poa',
        type: 'smoothstep',
        style: { 
          stroke: '#3b82f6', // blue-500 to match TEF gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6', // blue-500 to match TEF gradient
          width: 12,
          height: 12,
        }
      },
      { 
        id: 'e-vuln-tcap', 
        source: 'vuln', 
        target: 'tcap',
        type: 'smoothstep',
        style: { 
          stroke: '#d97706', // amber-600 to match VULN gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#d97706', // amber-600 to match VULN gradient
          width: 12,
          height: 12,
        }
      },
      { 
        id: 'e-vuln-rs', 
        source: 'vuln', 
        target: 'rs',
        type: 'smoothstep',
        style: { 
          stroke: '#d97706', // amber-600 to match VULN gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#d97706', // amber-600 to match VULN gradient
          width: 12,
          height: 12,
        }
      },
      
      // Third level connections
      { 
        id: 'e-sl-slef', 
        source: 'sl', 
        target: 'slef',
        type: 'smoothstep',
        style: { 
          stroke: '#8b5cf6', // purple-500 to match SL gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6', // purple-500 to match SL gradient
          width: 12,
          height: 12,
        }
      },
      { 
        id: 'e-sl-slm', 
        source: 'sl', 
        target: 'slm',
        type: 'smoothstep',
        style: { 
          stroke: '#8b5cf6', // purple-500 to match SL gradient
          strokeWidth: 1.5,
          transition: 'all 0.3s ease'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8b5cf6', // purple-500 to match SL gradient
          width: 12,
          height: 12,
        }
      },
    ];
  }, []);
  
  // Create the graph when risk data changes
  useEffect(() => {
    try {
      if (!riskFromApi) {
        console.log("Waiting for risk data from database...");
        return;
      }
      
      console.log("Initializing FAIR visualization with database values");
      
      // Add more detailed debugging to see the actual structure of riskFromApi
      console.log("Full risk data structure:", JSON.stringify({
        id: riskFromApi.id,
        riskId: riskFromApi.riskId,
        name: riskFromApi.name,
        lef: {
          min: riskFromApi.lossEventFrequencyMin,
          avg: riskFromApi.lossEventFrequencyAvg,
          max: riskFromApi.lossEventFrequencyMax,
        },
        inherentRisk: riskFromApi.inherentRisk,
        residualRisk: riskFromApi.residualRisk
      }, null, 2));
      
      // Create nodes and edges from database values
      const graphNodes = createNodes();
      const graphEdges = createEdges();
      
      // Initialize the graph with the risk node selected by default
      setNodes(graphNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          selected: node.id === 'risk' // Highlight the risk node by default
        }
      })));
      
      setEdges(graphEdges);
      setSelectedNode('risk'); // Select the risk node by default
      
      console.log("FAIR visualization initialized with", graphNodes.length, "nodes and", graphEdges.length, "edges");
    } catch (error) {
      console.error("Failed to initialize FAIR visualization:", error);
    }
  }, [
    riskFromApi,
    createNodes,
    createEdges
  ]);
  
  // Styling for the flow container
  const flowStyles = {
    background: darkMode ? 'radial-gradient(circle at center, #11152b, #070b1a)' : '#f8fafc',
    height: '100%',
    width: '100%',
    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)'
  };
  
  // Handle pane click - deselect all nodes
  const onPaneClick = useCallback(() => {
    // Deselect nodes when clicking on the background
    setSelectedNode(null);
    setNodes(nds => nds.map(n => ({
      ...n,
      data: {
        ...n.data,
        selected: false
      }
    })));
    
    // Reset edge styles
    setEdges(edgs => edgs.map(e => ({
      ...e,
      animated: e.source === 'risk', // Only keep top level animated
      style: {
        ...e.style,
        stroke: e.source === 'risk' ? 'rgba(99, 102, 241, 0.7)' : '#94a3b8',
        strokeWidth: e.source === 'risk' ? 2.5 : 1.5,
        opacity: 0.7
      }
    })));
  }, [setNodes, setEdges]);
  
  return (
    <Card className={`overflow-hidden border-slate-800 bg-slate-950 shadow-2xl rounded-xl ${className}`}>
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              FAIR Risk Analysis
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 cursor-help">
                  <InfoIcon className="h-4 w-4 text-purple-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md bg-slate-900 border-slate-700 p-3 text-white">
                <p className="font-medium mb-2 text-indigo-400">FAIR Risk Analysis</p>
                <p className="text-sm text-slate-300">
                  This visualization follows the FAIR framework (Factor Analysis of Information Risk), 
                  showing how different factors contribute to the overall risk. Nodes higher in the 
                  hierarchy are derived from those below them.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: '550px', width: '100%', position: 'relative' }}>
          {/* ReactFlow container with explicit height for consistent display */}
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              style={flowStyles}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.5}
              maxZoom={1.5}
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true}
              elementsSelectable={true}
              panOnScroll={true}
              panOnDrag={true}
              connectionLineType={ConnectionLineType.SmoothStep}
              onNodeClick={onNodeClick}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={(event, node) => {
                console.log('Node drag stopped:', node.id);
                // Reset edge styles when dragging stops
                setEdges((edgs) =>
                  edgs.map((e) => ({
                    ...e,
                    animated: e.source === 'risk',
                    style: {
                      ...e.style,
                      stroke: e.source === 'risk' ? 'rgba(99, 102, 241, 0.7)' : '#94a3b8',
                      strokeWidth: e.source === 'risk' ? 2.5 : 1.5,
                      opacity: 0.7
                    }
                  }))
                );
              }}
              onPaneClick={onPaneClick}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color={darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)'}
                style={{ opacity: 0.6 }}
              />
              <Controls
                showInteractive={false}
                className="bg-slate-800 bg-opacity-70 backdrop-blur-sm border-slate-700 shadow-lg"
              />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default XyflowFairVisualization;