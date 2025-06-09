import React, { useState, useEffect, useCallback } from 'react';
import { RiskCalculationParams } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  EdgeChange
} from '@xyflow/react';
import RiskNode from './components/RiskNode';
import { createRiskFlowData } from './utils/node-calculations';
import { defaultFlowStyle, themeConfig } from './utils/visualization-configs';
import '@xyflow/react/dist/style.css';

interface FairVisualizationTemplateProps {
  riskName: string;
  riskId: string;
  riskDescription?: string;
  riskParams: RiskCalculationParams;
  className?: string;
  darkMode?: boolean;
}

// Define available node types for ReactFlow
const nodeTypes = {
  riskNode: RiskNode
};

const FairVisualizationTemplate: React.FC<FairVisualizationTemplateProps> = ({
  riskName,
  riskId,
  riskDescription,
  riskParams,
  className = '',
  darkMode = true
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Add these callbacks for fluid dragging using ReactFlow's built-in functionality
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  
  // Helper to determine if an edge is connected to the selected node
  const isEdgeConnected = (edge: Edge, nodeId: string): boolean => {
    return edge.source === nodeId || edge.target === nodeId;
  };

  // Handler for node selection
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    console.log('Node selected:', node.id);
    
    // If already selected, deselect it
    if (selectedNode === node.id) {
      setSelectedNode(null);
      
      // Reset node appearance
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            selected: false
          }
        }))
      );
      
      // Reset edge styles
      setEdges((edgs) =>
        edgs.map((e) => ({
          ...e,
          animated: e.id.startsWith('e-risk-'), // Only keep top level animated
          style: {
            ...e.style,
            stroke: e.id.startsWith('e-risk-') ? 'rgba(99, 102, 241, 0.7)' : '#94a3b8',
            strokeWidth: e.id.startsWith('e-risk-') ? 2.5 : 1.5,
            opacity: 0.7
          }
        }))
      );
      return;
    }
    
    // Set the selected node
    setSelectedNode(node.id);
    
    // Update nodes - highlight the selected node
    setNodes((nds) => 
      nds.map((n) => ({
        ...n,
        // Visual feedback to show which node is selected for dragging
        data: {
          ...n.data,
          selected: n.id === node.id
        }
      }))
    );
    
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
  };
  
  // Handler for when nodes are dragged - this now complements onNodesChange
  const onNodeDrag = (_: React.MouseEvent, node: Node) => {
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
  };
  
  // When drag is completed, log the final position
  const onNodeDragStop = (_: React.MouseEvent, node: Node) => {
    console.log('Node position updated:', node.id, node.position);
    // Position updates are handled automatically via onNodesChange
  };

  // Extend riskParams with derived values
  const extendedParams = {
    ...riskParams,
    threatEventFrequencyMin: riskParams.contactFrequencyMin * riskParams.probabilityOfActionMin,
    threatEventFrequencyAvg: riskParams.contactFrequencyAvg * riskParams.probabilityOfActionAvg,
    threatEventFrequencyMax: riskParams.contactFrequencyMax * riskParams.probabilityOfActionMax,
    susceptibilityMin: riskParams.threatCapabilityMin / (riskParams.threatCapabilityMin + riskParams.resistanceStrengthMax),
    susceptibilityAvg: riskParams.threatCapabilityAvg / (riskParams.threatCapabilityAvg + riskParams.resistanceStrengthAvg),
    susceptibilityMax: riskParams.threatCapabilityMax / (riskParams.threatCapabilityMax + riskParams.resistanceStrengthMin)
  };

  // Set up the graph on mount, and when riskParams change
  useEffect(() => {
    try {
      console.log("Initializing FAIR visualization");
      
      // Default container size
      const containerWidth = 800;
      const containerHeight = 600;

      // Create flow data with default sizes (will be scaled automatically by ReactFlow)
      const { nodes: graphNodes, edges: graphEdges } = createRiskFlowData(
        extendedParams,
        containerWidth,
        containerHeight
      );

      // Set up nodes with the correct dragging state
      // We'll make the Risk node (top level) draggable by default to draw attention
      setNodes(graphNodes.map(node => {
        const isRiskNode = node.id === 'risk';
        return {
          ...node,
          draggable: isRiskNode, // Only the top risk node is draggable by default
          data: {
            ...node.data,
            selected: isRiskNode // Highlight the risk node by default
          }
        };
      }));
      
      // Set up edges
      setEdges(graphEdges.map(edge => ({
        ...edge,
        // Add animation to edges connected to the risk node by default
        animated: edge.source === 'risk' || edge.target === 'risk'
      })));
      
      console.log("FAIR visualization initialized with", graphNodes.length, "nodes and", graphEdges.length, "edges");
    } catch (error) {
      console.error("Failed to initialize FAIR visualization:", error);
    }
  }, [
    // Include all risk parameters that might change
    riskParams.contactFrequencyMin, 
    riskParams.contactFrequencyAvg,
    riskParams.contactFrequencyMax,
    riskParams.probabilityOfActionMin,
    riskParams.probabilityOfActionAvg,
    riskParams.probabilityOfActionMax,
    riskParams.threatCapabilityMin,
    riskParams.threatCapabilityAvg,
    riskParams.threatCapabilityMax,
    riskParams.resistanceStrengthMin,
    riskParams.resistanceStrengthAvg,
    riskParams.resistanceStrengthMax,
    riskParams.primaryLossMagnitudeMin,
    riskParams.primaryLossMagnitudeAvg,
    riskParams.primaryLossMagnitudeMax
  ]);

  return (
    <Card className={`overflow-hidden border-slate-700 bg-slate-900 ${className}`}>
      <CardHeader className="bg-slate-800 border-b border-slate-700 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-white mb-1">{riskName}</CardTitle>
            <CardDescription className="text-slate-400">
              {riskId} {riskDescription && `- ${riskDescription.slice(0, 120)}${riskDescription.length > 120 ? '...' : ''}`}
            </CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 cursor-help">
                  <InfoIcon className="h-4 w-4 text-slate-300" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md bg-slate-800 border-slate-700 p-3 text-white">
                <p className="font-medium mb-2">FAIR Risk Analysis</p>
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
        <div style={{ height: '600px', width: '100%', position: 'relative' }}>
          <div className="absolute top-2 left-2 right-2 z-10 bg-slate-800 bg-opacity-80 backdrop-blur-sm p-2 rounded text-xs text-slate-300 shadow">
            <span>
              <strong>Node Positioning:</strong> Click on a node to select it for dragging. Only the selected node can be moved.
              {selectedNode && (
                <span className="ml-2 text-indigo-400">Currently dragging: {selectedNode}</span>
              )}
            </span>
          </div>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              style={defaultFlowStyle}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.5}
              maxZoom={1.5}
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true} // Let nodes be draggable, we'll control which ones in the node data
              elementsSelectable={true}
              panOnScroll={true}
              onNodeClick={onNodeClick}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={onNodeDragStop}
              onPaneClick={() => {
                // Deselect nodes when clicking on the background
                setSelectedNode(null);
                setNodes(nds => nds.map(n => ({
                  ...n,
                  draggable: false,
                  data: {
                    ...n.data,
                    selected: false
                  }
                })));
                
                // Reset edge styles when deselecting
                setEdges(edgs => edgs.map(e => ({
                  ...e,
                  animated: e.id.startsWith('e-risk-'), // Only keep top level animated
                  style: {
                    ...e.style,
                    stroke: e.id.startsWith('e-risk-') ? 'rgba(99, 102, 241, 0.7)' : '#94a3b8',
                    strokeWidth: e.id.startsWith('e-risk-') ? 2.5 : 1.5,
                    opacity: 0.7
                  }
                })));
              }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={12}
                size={1}
                color={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
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

export default FairVisualizationTemplate;