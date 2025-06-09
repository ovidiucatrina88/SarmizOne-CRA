import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  NodeChange,
  EdgeChange,
  NodeTypes
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { RiskCalculationParams } from '@shared/schema';
import { createRiskFlowData } from './utils/node-calculations';
import { defaultFlowStyle, themeConfig } from './utils/visualization-configs';
import RiskNode from './components/RiskNode';

// Define available node types for ReactFlow
const nodeTypes: NodeTypes = {
  riskNode: RiskNode
};

interface FairRiskMapProps {
  riskParams: RiskCalculationParams;
  className?: string;
  darkMode?: boolean;
}

const FairRiskMap: React.FC<FairRiskMapProps> = ({ 
  riskParams, 
  className = '', 
  darkMode = true 
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // State
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
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

  // Initialize with size measurement and graph creation
  useEffect(() => {
    // Initial setup
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      const width = offsetWidth || 800;
      const height = offsetHeight || 600;
      
      setDimensions({ width, height });
      
      try {
        // Generate initial graph data
        const { nodes: initialNodes, edges: initialEdges } = createRiskFlowData(
          extendedParams, 
          width, 
          height
        );
        
        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (error) {
        console.error('Failed to initialize graph:', error);
      }
    }
    
    // Setup resize observer
    const observer = new ResizeObserver(entries => {
      if (!containerRef.current) return;
      
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({
        width: offsetWidth || 800,
        height: offsetHeight || 600
      });
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []); // Empty dependency array - runs only on mount
  
  // Regenerate graph when dimensions or params change
  useEffect(() => {
    // Skip if dimensions aren't initialized
    if (dimensions.width === 0 || dimensions.height === 0) return;
    
    try {
      // Generate graph data with current dimensions
      const { nodes: updatedNodes, edges: updatedEdges } = createRiskFlowData(
        extendedParams, 
        dimensions.width, 
        dimensions.height
      );
      
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    } catch (error) {
      console.error('Failed to update graph:', error);
    }
  }, [dimensions.width, dimensions.height, extendedParams]);
  
  // Node changes handler
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes(nds => {
      return changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter(node => node.id !== change.id);
        }
        return acc;
      }, [...nds]);
    });
  }, []);
  
  // Edge changes handler
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges(eds => {
      return changes.reduce((acc, change) => {
        if (change.type === 'remove') {
          return acc.filter(edge => edge.id !== change.id);
        }
        return acc;
      }, [...eds]);
    });
  }, []);
  
  return (
    <div 
      className={`w-full h-full min-h-[500px] bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg ${className}`}
      ref={containerRef}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        style={defaultFlowStyle}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.5}
        maxZoom={1.5}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
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
    </div>
  );
};

// Wrap component with ReactFlowProvider for standalone usage
const WrappedFairRiskMap: React.FC<FairRiskMapProps> = (props) => (
  <ReactFlowProvider>
    <FairRiskMap {...props} />
  </ReactFlowProvider>
);

export default WrappedFairRiskMap;