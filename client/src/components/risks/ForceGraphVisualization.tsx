import React, { useCallback, useEffect, useRef, useState } from 'react';
// Import A-Frame setup first to ensure global availability
import '@/utils/aframe-setup';
import { ForceGraph2D } from 'react-force-graph';
import { RiskCalculationParams } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getConfidenceColor, getRiskColor, getRiskLevel, formatValue } from './utils/visualization-configs';

interface ForceGraphVisualizationProps {
  riskName: string;
  riskId: string;
  riskDescription?: string;
  riskParams: RiskCalculationParams;
  className?: string;
  darkMode?: boolean;
}

// Node types in the visualization
interface GraphNode {
  id: string;
  name: string;
  value: number;
  min?: number;
  max?: number;
  confidence: string;
  isCurrency?: boolean;
  group: number; // For coloring by levels
  level: number; // Hierarchical level
}

// Edge types connecting nodes
interface GraphLink {
  source: string;
  target: string;
  highlighted?: boolean;
}

// Main data structure for the graph
interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const ForceGraphVisualization: React.FC<ForceGraphVisualizationProps> = ({
  riskName,
  riskId,
  riskDescription,
  riskParams,
  className = '',
  darkMode = true
}) => {
  // Graph state
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Ref for the graph container to measure dimensions
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref for the graph instance to access its methods
  const graphRef = useRef<any>(null);

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

  // Update the container dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create graph data from risk parameters
  useEffect(() => {
    const nodes: GraphNode[] = [
      // Level 0 (Top)
      {
        id: 'risk',
        name: 'Risk',
        value: riskParams.primaryLossMagnitudeAvg * (riskParams.contactFrequencyAvg * riskParams.probabilityOfActionAvg *
          (riskParams.threatCapabilityAvg / (riskParams.threatCapabilityAvg + riskParams.resistanceStrengthAvg))),
        min: riskParams.primaryLossMagnitudeMin * (riskParams.contactFrequencyMin * riskParams.probabilityOfActionMin *
          (riskParams.threatCapabilityMin / (riskParams.threatCapabilityMin + riskParams.resistanceStrengthMax))),
        max: riskParams.primaryLossMagnitudeMax * (riskParams.contactFrequencyMax * riskParams.probabilityOfActionMax *
          (riskParams.threatCapabilityMax / (riskParams.threatCapabilityMax + riskParams.resistanceStrengthMin))),
        confidence: 'Medium',
        isCurrency: true,
        group: 0,
        level: 0
      },

      // Level 1
      {
        id: 'lef',
        name: 'Loss Event Frequency',
        value: riskParams.contactFrequencyAvg * riskParams.probabilityOfActionAvg *
          (riskParams.threatCapabilityAvg / (riskParams.threatCapabilityAvg + riskParams.resistanceStrengthAvg)),
        min: riskParams.contactFrequencyMin * riskParams.probabilityOfActionMin *
          (riskParams.threatCapabilityMin / (riskParams.threatCapabilityMin + riskParams.resistanceStrengthMax)),
        max: riskParams.contactFrequencyMax * riskParams.probabilityOfActionMax *
          (riskParams.threatCapabilityMax / (riskParams.threatCapabilityMax + riskParams.resistanceStrengthMin)),
        confidence: 'Medium',
        group: 1,
        level: 1
      },
      {
        id: 'lm',
        name: 'Loss Magnitude',
        value: riskParams.primaryLossMagnitudeAvg,
        min: riskParams.primaryLossMagnitudeMin,
        max: riskParams.primaryLossMagnitudeMax,
        confidence: riskParams.primaryLossMagnitudeConfidence,
        isCurrency: true,
        group: 1,
        level: 1
      },

      // Level 2
      {
        id: 'tef',
        name: 'Threat Event Frequency',
        value: riskParams.contactFrequencyAvg * riskParams.probabilityOfActionAvg,
        min: riskParams.contactFrequencyMin * riskParams.probabilityOfActionMin,
        max: riskParams.contactFrequencyMax * riskParams.probabilityOfActionMax,
        confidence: 'Medium',
        group: 2,
        level: 2
      },
      {
        id: 'vuln',
        name: 'Vulnerability',
        value: riskParams.threatCapabilityAvg / (riskParams.threatCapabilityAvg + riskParams.resistanceStrengthAvg),
        min: riskParams.threatCapabilityMin / (riskParams.threatCapabilityMin + riskParams.resistanceStrengthMax),
        max: riskParams.threatCapabilityMax / (riskParams.threatCapabilityMax + riskParams.resistanceStrengthMin),
        confidence: 'Medium',
        group: 2,
        level: 2
      },
      {
        id: 'pl',
        name: 'Primary Loss',
        value: riskParams.primaryLossMagnitudeAvg,
        min: riskParams.primaryLossMagnitudeMin,
        max: riskParams.primaryLossMagnitudeMax,
        confidence: riskParams.primaryLossMagnitudeConfidence,
        isCurrency: true,
        group: 2,
        level: 2
      },
      {
        id: 'sl',
        name: 'Secondary Loss',
        value: riskParams.secondaryLossMagnitudeAvg || 0,
        min: riskParams.secondaryLossMagnitudeMin,
        max: riskParams.secondaryLossMagnitudeMax,
        confidence: riskParams.secondaryLossMagnitudeConfidence || 'Low',
        isCurrency: true,
        group: 2,
        level: 2
      },

      // Level 3
      {
        id: 'cf',
        name: 'Contact Frequency',
        value: riskParams.contactFrequencyAvg,
        min: riskParams.contactFrequencyMin,
        max: riskParams.contactFrequencyMax,
        confidence: riskParams.contactFrequencyConfidence,
        group: 3,
        level: 3
      },
      {
        id: 'poa',
        name: 'Probability of Action',
        value: riskParams.probabilityOfActionAvg,
        min: riskParams.probabilityOfActionMin,
        max: riskParams.probabilityOfActionMax,
        confidence: riskParams.probabilityOfActionConfidence,
        group: 3,
        level: 3
      },
      {
        id: 'tcap',
        name: 'Threat Capability',
        value: riskParams.threatCapabilityAvg,
        min: riskParams.threatCapabilityMin,
        max: riskParams.threatCapabilityMax,
        confidence: riskParams.threatCapabilityConfidence,
        group: 3,
        level: 3
      },
      {
        id: 'rs',
        name: 'Resistance Strength',
        value: riskParams.resistanceStrengthAvg,
        min: riskParams.resistanceStrengthMin,
        max: riskParams.resistanceStrengthMax,
        confidence: riskParams.resistanceStrengthConfidence,
        group: 3,
        level: 3
      },

      // Level 4
      {
        id: 'slef',
        name: 'Secondary Loss Event Frequency',
        value: riskParams.secondaryLossEventFrequencyAvg || 0,
        min: riskParams.secondaryLossEventFrequencyMin,
        max: riskParams.secondaryLossEventFrequencyMax,
        confidence: riskParams.secondaryLossEventFrequencyConfidence || 'Low',
        group: 4,
        level: 4
      },
      {
        id: 'slm',
        name: 'Secondary Loss Magnitude',
        value: riskParams.secondaryLossMagnitudeAvg || 0,
        min: riskParams.secondaryLossMagnitudeMin,
        max: riskParams.secondaryLossMagnitudeMax,
        confidence: riskParams.secondaryLossMagnitudeConfidence || 'Low',
        isCurrency: true,
        group: 4,
        level: 4
      }
    ];

    const links: GraphLink[] = [
      // Top level connections
      { source: 'risk', target: 'lef' },
      { source: 'risk', target: 'lm' },

      // First level connections
      { source: 'lef', target: 'tef' },
      { source: 'lef', target: 'vuln' },
      { source: 'lm', target: 'pl' },
      { source: 'lm', target: 'sl' },

      // Second level connections
      { source: 'tef', target: 'cf' },
      { source: 'tef', target: 'poa' },
      { source: 'vuln', target: 'tcap' },
      { source: 'vuln', target: 'rs' },

      // Third level connections
      { source: 'sl', target: 'slef' },
      { source: 'sl', target: 'slm' }
    ];

    setGraphData({ nodes, links });
  }, [riskParams]);

  // Node object custom rendering
  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const graphNode = node as GraphNode;
    const label = graphNode.name;
    const fontSize = 12 / globalScale;
    const nodeSize = 12;

    // Check if the node is highlighted
    const isHighlighted = highlightedNode === graphNode.id;

    // Calculate colors
    const actualMax = graphNode.max || graphNode.value * 2;
    const riskLevel = getRiskLevel(graphNode.value, actualMax);
    const riskColor = getRiskColor(riskLevel, darkMode ? 'dark' : 'light');
    const confidenceColor = getConfidenceColor(graphNode.confidence, darkMode ? 'dark' : 'light');

    // Node background
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? riskColor : `rgba(30, 41, 59, ${isHighlighted ? 1 : 0.8})`;
    ctx.fill();

    // Node border
    ctx.strokeStyle = isHighlighted ? riskColor : '#4b5563';
    ctx.lineWidth = isHighlighted ? 3 : 1.5;
    ctx.stroke();

    // Node label
    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(label, node.x, node.y + nodeSize + fontSize);

    // Node value
    const valueText = formatValue(graphNode.value, graphNode.isCurrency);
    ctx.font = `bold ${fontSize}px Sans-Serif`;
    ctx.fillStyle = riskColor;
    ctx.fillText(valueText, node.x, node.y + nodeSize + fontSize * 2.2);

    // Confidence indicator
    ctx.beginPath();
    ctx.arc(node.x + nodeSize, node.y - nodeSize, nodeSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = confidenceColor;
    ctx.fill();

    // Set node val to influence forces
    node.val = graphNode.value / 1000 + 1;
  }, [highlightedNode, darkMode]);

  // Node interaction handlers
  const handleNodeHover = (node: any) => {
    if (node) {
      setHighlightedNode(node.id);
      setGraphData(prev => ({
        nodes: prev.nodes,
        links: prev.links.map(link => ({
          ...link,
          highlighted: link.source === node.id || link.target === node.id
        }))
      }));
    } else {
      setHighlightedNode(null);
      setGraphData(prev => ({
        nodes: prev.nodes,
        links: prev.links.map(link => ({ ...link, highlighted: false }))
      }));
    }
  };

  // Link color based on highlighting
  const linkColor = useCallback((link: GraphLink) => {
    if (link.highlighted) {
      return darkMode ? 'rgba(99, 102, 241, 0.8)' : 'rgba(79, 70, 229, 0.8)';
    }
    return darkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.3)';
  }, [darkMode]);

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
                <p className="font-medium mb-2"></p>
                <p className="text-sm text-slate-300">
                  This visualization follows the FAIR framework (Factor Analysis of Information Risk),
                  showing how different factors contribute to the overall risk.
                  Hover over nodes to see relationships and drag to reposition.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          ref={containerRef}
          style={{ height: '600px', width: '100%', position: 'relative' }}
        >
          <div className="absolute top-2 left-2 right-2 z-10 bg-slate-800 bg-opacity-80 backdrop-blur-sm p-2 rounded text-xs text-slate-300 shadow">
            <span>
              <strong>Interactive FAIR Visualization:</strong> Hover over nodes to highlight relationships. Drag nodes to reposition them.
              {highlightedNode && (
                <span className="ml-2 text-indigo-400">Selected: {highlightedNode}</span>
              )}
            </span>
          </div>

          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeRelSize={8}
            nodeCanvasObject={nodeCanvasObject}
            linkColor={linkColor}
            linkWidth={(link: GraphLink) => link.highlighted ? 3 : 1}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={(link: GraphLink) => link.highlighted ? 3 : 0}
            cooldownTicks={100}
            onNodeHover={handleNodeHover}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.2}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor={darkMode ? '#0f172a' : '#f8fafc'}
            dagMode="td" // Tree graph, top to bottom
            dagLevelDistance={100} // Distance between levels
            onEngineStop={() => {
              // Optional: Center the graph when it stops
              if (graphRef.current) {
                graphRef.current.zoomToFit(400, 40);
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ForceGraphVisualization;