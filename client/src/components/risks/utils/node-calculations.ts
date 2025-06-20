import { Node, Edge, Position } from '@xyflow/react';
import { RiskCalculationParams } from '@shared/schema';

// Extend the RiskCalculationParams interface to include derived properties
interface ExtendedRiskCalculationParams extends RiskCalculationParams {
  threatEventFrequencyMin?: number;
  threatEventFrequencyAvg?: number;
  threatEventFrequencyMax?: number;
  susceptibilityMin?: number;
  susceptibilityAvg?: number;
  susceptibilityMax?: number;
}

/**
 * Calculates node positions and sizes based on screen dimensions
 * @param width - Available width for visualization
 * @param height - Available height for visualization 
 * @returns Object with position calculations
 */
export const calculatePositions = (width: number, height: number) => {
  // Calculate a base unit for proportional scaling
  const baseUnit = Math.min(width, height) / 10;
  
  // Use responsive calculations based on container dimensions with more compact vertical spacing
  const levels = {
    top: height * 0.05,
    firstLevel: height * 0.18,
    secondLevel: height * 0.36,
    thirdLevel: height * 0.56,
    fourthLevel: height * 0.74
  };
  
  // Adjust columns for better spacing and less overlap
  const columns = {
    center: width * 0.5,
    left: width * 0.3,
    right: width * 0.7,
    farLeft: width * 0.15,
    midLeft: width * 0.4,
    midRight: width * 0.6,
    farRight: width * 0.85,
  };
  
  // Node size calculation based on available space - make them more compact
  const nodeSize = {
    width: Math.max(baseUnit * 1.2, 280), // Ensure minimum width matches RiskNode width
    height: Math.max(baseUnit * 0.6, 120)  // Match the RiskNode height for consistency
  };
  
  return {
    levels,
    columns,
    nodeSize
  };
};

/**
 * Maps risk calculation parameters to node data
 * @param params Risk calculation parameters
 * @returns Object containing node data
 */
export const mapParamsToNodeData = (params: ExtendedRiskCalculationParams) => {
  return {
    // Top level
    risk: {
      label: 'RISK',
      value: params.primaryLossMagnitudeAvg * params.probabilityOfActionAvg,
      min: params.primaryLossMagnitudeMin * params.probabilityOfActionMin,
      max: params.primaryLossMagnitudeMax * params.probabilityOfActionMax,
      confidence: 'Derived'
    },
    
    // LEF and LM
    lef: {
      label: 'Loss Event Frequency (LEF)',
      value: params.probabilityOfActionAvg,
      min: params.probabilityOfActionMin,
      max: params.probabilityOfActionMax,
      confidence: params.probabilityOfActionConfidence
    },
    lm: {
      label: 'Loss Magnitude (LM)',
      value: params.primaryLossMagnitudeAvg,
      min: params.primaryLossMagnitudeMin,
      max: params.primaryLossMagnitudeMax,
      confidence: params.primaryLossMagnitudeConfidence
    },
    
    // Second level
    tef: {
      label: 'Threat Event Frequency (TEF)',
      value: params.threatEventFrequencyAvg,
      min: params.threatEventFrequencyMin,
      max: params.threatEventFrequencyMax,
      confidence: 'Derived'
    },
    vuln: {
      label: 'Vulnerability',
      value: params.susceptibilityAvg,
      min: params.susceptibilityMin, 
      max: params.susceptibilityMax,
      confidence: 'Derived'
    },
    pl: {
      label: 'Primary Loss (PL)',
      value: params.primaryLossMagnitudeAvg,
      min: params.primaryLossMagnitudeMin,
      max: params.primaryLossMagnitudeMax,
      confidence: params.primaryLossMagnitudeConfidence
    },
    sl: {
      label: 'Secondary Loss (SL)',
      value: params.secondaryLossMagnitudeAvg || 0,
      min: params.secondaryLossMagnitudeMin || 0,
      max: params.secondaryLossMagnitudeMax || 0,
      confidence: params.secondaryLossMagnitudeConfidence || 'Low'
    },
    
    // Third level 
    cf: {
      label: 'Contact Frequency (CF)',
      value: params.contactFrequencyAvg,
      min: params.contactFrequencyMin,
      max: params.contactFrequencyMax,
      confidence: params.contactFrequencyConfidence
    },
    poa: {
      label: 'Probability of Action (POA)',
      value: params.probabilityOfActionAvg,
      min: params.probabilityOfActionMin,
      max: params.probabilityOfActionMax, 
      confidence: params.probabilityOfActionConfidence
    },
    tcap: {
      label: 'Threat Capability (TCap)',
      value: params.threatCapabilityAvg,
      min: params.threatCapabilityMin,
      max: params.threatCapabilityMax,
      confidence: params.threatCapabilityConfidence
    },
    rs: {
      label: 'Resistance Strength (RS)',
      value: params.resistanceStrengthAvg,
      min: params.resistanceStrengthMin,
      max: params.resistanceStrengthMax,
      confidence: params.resistanceStrengthConfidence
    },
    
    // Fourth level
    slef: {
      label: 'Secondary Loss Event Frequency (SLEF)',
      value: params.secondaryLossEventFrequencyAvg || 0,
      min: params.secondaryLossEventFrequencyMin || 0,
      max: params.secondaryLossEventFrequencyMax || 0,
      confidence: params.secondaryLossEventFrequencyConfidence || 'Low'
    },
    slm: {
      label: 'Secondary Loss Magnitude (SLM)',
      value: params.secondaryLossMagnitudeAvg || 0,
      min: params.secondaryLossMagnitudeMin || 0,
      max: params.secondaryLossMagnitudeMax || 0,
      confidence: params.secondaryLossMagnitudeConfidence || 'Low'
    }
  };
};

/**
 * Creates nodes array for ReactFlow based on risk params and container dimensions
 * @param params Risk calculation parameters
 * @param width Container width
 * @param height Container height
 * @returns Array of nodes and edges for ReactFlow
 */
export const createRiskFlowData = (params: ExtendedRiskCalculationParams, width: number, height: number): { nodes: Node[], edges: Edge[] } => {
  const { levels, columns, nodeSize } = calculatePositions(width, height);
  const nodeData = mapParamsToNodeData(params);
  
  // Create nodes
  const nodes: Node[] = [
    // Top level
    {
      id: 'risk',
      type: 'riskNode',
      position: { x: columns.center - nodeSize.width/2, y: levels.top },
      data: nodeData.risk,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    
    // First level - LEF and LM
    {
      id: 'lef',
      type: 'riskNode',
      position: { x: columns.left - nodeSize.width/2, y: levels.firstLevel },
      data: nodeData.lef,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'lm',
      type: 'riskNode',
      position: { x: columns.right - nodeSize.width/2, y: levels.firstLevel },
      data: nodeData.lm,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    
    // Second level
    {
      id: 'tef',
      type: 'riskNode',
      position: { x: columns.farLeft - nodeSize.width/2, y: levels.secondLevel },
      data: nodeData.tef,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'vuln',
      type: 'riskNode',
      position: { x: columns.midLeft - nodeSize.width/2, y: levels.secondLevel },
      data: nodeData.vuln,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'pl',
      type: 'riskNode',
      position: { x: columns.midRight - nodeSize.width/2, y: levels.secondLevel },
      data: nodeData.pl,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'sl',
      type: 'riskNode',
      position: { x: columns.farRight - nodeSize.width/2, y: levels.secondLevel },
      data: nodeData.sl,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    
    // Third level - better distributed
    {
      id: 'cf',
      type: 'riskNode',
      position: { x: columns.farLeft - nodeSize.width/2 - nodeSize.width/3, y: levels.thirdLevel },
      data: nodeData.cf,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'poa',
      type: 'riskNode',
      position: { x: columns.farLeft - nodeSize.width/2 + nodeSize.width/3, y: levels.thirdLevel },
      data: nodeData.poa,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'tcap',
      type: 'riskNode',
      position: { x: columns.midLeft - nodeSize.width/2 - nodeSize.width/3, y: levels.thirdLevel },
      data: nodeData.tcap,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'rs',
      type: 'riskNode',
      position: { x: columns.midLeft - nodeSize.width/2 + nodeSize.width/3, y: levels.thirdLevel },
      data: nodeData.rs,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    
    // Fourth level - better distributed
    {
      id: 'slef',
      type: 'riskNode',
      position: { x: columns.farRight - nodeSize.width/2 - nodeSize.width/3, y: levels.fourthLevel },
      data: nodeData.slef,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
    {
      id: 'slm',
      type: 'riskNode',
      position: { x: columns.farRight - nodeSize.width/2 + nodeSize.width/3, y: levels.fourthLevel },
      data: nodeData.slm,
      targetPosition: Position.Top,
      draggable: true, // Enable dragging
    },
  ];
  
  // Create edges with improved styling and animation
  const edges: Edge[] = [
    // Top level connections
    { 
      id: 'e-risk-lef', 
      source: 'risk', 
      target: 'lef', 
      animated: true,
      style: { 
        stroke: 'rgba(99, 102, 241, 0.7)',
        strokeWidth: 2.5,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-risk-lm', 
      source: 'risk', 
      target: 'lm', 
      animated: true,
      style: { 
        stroke: 'rgba(99, 102, 241, 0.7)',
        strokeWidth: 2.5,
        transition: 'all 0.3s ease'
      }
    },
    
    // First level connections
    { 
      id: 'e-lef-tef', 
      source: 'lef', 
      target: 'tef',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 2,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-lef-vuln', 
      source: 'lef', 
      target: 'vuln',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 2,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-lm-pl', 
      source: 'lm', 
      target: 'pl',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 2,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-lm-sl', 
      source: 'lm', 
      target: 'sl',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 2,
        transition: 'all 0.3s ease'
      }
    },
    
    // Second level connections
    { 
      id: 'e-tef-cf', 
      source: 'tef', 
      target: 'cf',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-tef-poa', 
      source: 'tef', 
      target: 'poa',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-vuln-tcap', 
      source: 'vuln', 
      target: 'tcap',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-vuln-rs', 
      source: 'vuln', 
      target: 'rs',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
    
    // Third level connections
    { 
      id: 'e-sl-slef', 
      source: 'sl', 
      target: 'slef',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
    { 
      id: 'e-sl-slm', 
      source: 'sl', 
      target: 'slm',
      style: { 
        stroke: '#94a3b8',
        strokeWidth: 1.5,
        transition: 'all 0.3s ease'
      }
    },
  ];
  
  return { nodes, edges };
};