import React, { memo, useState, useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  getRiskLevel,
  getRiskColor,
  getConfidenceColor,
  formatValue,
} from "../utils/visualization-configs";
import { GripVertical, ArrowDown, ArrowUp } from "lucide-react";

export interface RiskNodeData {
  label: string;
  value: number;         // Residual risk (after controls)
  inherentValue?: number; // Inherent risk (before controls)
  futureValue?: number;   // Future risk (projected)
  min?: number;
  max?: number;
  confidence: string;
  isCurrency?: boolean;
  color?: string;
  draggableOverride?: boolean;
}

const RiskNode = ({
  data,
  id,
  selected,
  sourcePosition,
  targetPosition,
  isConnectable,
  dragging,
}: NodeProps) => {
  // For active/inactive state tracking
  const [isActive, setIsActive] = useState(false);

  // Type assertion for data with proper error handling
  const nodeData = data as unknown as RiskNodeData;

  // Default values in case of missing properties
  const {
    label = "Node",
    value = 0,           // Residual risk (with controls)
    inherentValue,       // Inherent risk (without controls)
    futureValue,         // Future risk (with additional controls)
    min,
    max,
    confidence = "Medium",
    isCurrency = false,
    color,
    draggableOverride,
  } = nodeData;

  // Visual calculations
  const actualMax = max || value * 2;
  const riskLevel = getRiskLevel(value, actualMax);
  const riskColor = color || getRiskColor(riskLevel, "dark");
  const confidenceColor = getConfidenceColor(confidence, "dark");

  // Calculate if the future value is better (lower) than current
  const hasFutureValue = futureValue !== undefined;
  const improved = hasFutureValue && futureValue < value;
  const changePercentage = hasFutureValue
    ? Math.abs(Math.round(((futureValue - value) / value) * 100))
    : 0;

  // Handle undefined source/target positions
  const handleSourcePosition = sourcePosition || Position.Bottom;
  const handleTargetPosition = targetPosition || Position.Top;

  // Import the color scheme from VisualizationConfig
  const getNodeClass = () => {
    switch (id) {
      case "risk":
        return "bg-gradient-to-br from-purple-500 to-indigo-700";
      case "lef":
        return "bg-gradient-to-br from-orange-500 to-red-700";
      case "lm":
        return "bg-gradient-to-br from-blue-500 to-cyan-700";
      case "tef":
        return "bg-gradient-to-br from-blue-400 to-indigo-600";
      case "vuln":
        return "bg-gradient-to-br from-amber-400 to-amber-600";
      case "pl":
        return "bg-gradient-to-br from-green-400 to-emerald-600";
      case "sl":
        return "bg-gradient-to-br from-purple-400 to-violet-600";
      case "cf":
        return "bg-gradient-to-br from-indigo-400 to-blue-600";
      case "poa":
        return "bg-gradient-to-br from-pink-400 to-rose-600";
      case "tcap":
        return "bg-gradient-to-br from-red-400 to-red-600";
      case "rs":
        return "bg-gradient-to-br from-lime-400 to-green-600";
      case "slef":
        return "bg-gradient-to-br from-fuchsia-400 to-purple-600";
      case "slm":
        return "bg-gradient-to-br from-violet-400 to-indigo-600";
      default:
        return "bg-gradient-to-br from-slate-700 to-slate-900";
    }
  };

  // Generate title color based on node type
  const getTitleColor = () => {
    if (id === "risk") return "text-purple-300";
    if (id === "lef") return "text-orange-300";
    if (id === "lm") return "text-blue-300";
    if (id === "tef") return "text-blue-300";
    if (id === "vuln") return "text-amber-300";
    if (id === "pl") return "text-green-300";
    if (id === "sl") return "text-purple-300";
    if (id === "cf") return "text-indigo-300";
    if (id === "poa") return "text-pink-300";
    if (id === "tcap") return "text-red-300";
    if (id === "rs") return "text-lime-300";
    if (id === "slef") return "text-fuchsia-300";
    if (id === "slm") return "text-violet-300";
    return "text-slate-300";
  };
  
  // Generate gradient text style for values
  const getGradientTextStyle = (isImproved: boolean = false) => {
    if (id === "risk") return { background: "linear-gradient(to right, #c084fc, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
    if (id === "lef") return { background: "linear-gradient(to right, #fb923c, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
    if (id === "lm") return { background: "linear-gradient(to right, #60a5fa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
    
    // For improved metrics (green gradient)
    if (isImproved) return { background: "linear-gradient(to right, #4ade80, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" };
    
    // Default white
    return { color: "white" };
  };

  // Generate memoized classes based on selection/dragging/active state for better performance
  const nodeClasses = useCallback(() => {
    return `
      relative rounded-xl border shadow-xl w-[280px] h-[120px] text-white p-0
      ${selected ? "border-indigo-400 ring-2 ring-indigo-500 ring-opacity-70" : "border-slate-700"}
      ${dragging ? "opacity-90 shadow-2xl scale-105 z-50" : ""}
      ${isActive ? "ring-2 ring-indigo-500 ring-opacity-50" : ""}
      cursor-move
      transition-all duration-75 ease-in-out
      overflow-hidden
    `;
  }, [selected, dragging, isActive])();

  // Click handler to toggle active state, using memoization for better performance
  const handleNodeClick = useCallback(() => {
    setIsActive((prev) => !prev);
    console.log(`Node ${id} active state: ${!isActive}`);
  }, [id, isActive]);

  return (
    <div
      className={`${nodeClasses} ${getNodeClass()}`}
      onClick={handleNodeClick}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
      }}
    >
      {targetPosition && (
        <Handle
          type="target"
          position={handleTargetPosition}
          className="w-3 h-3 bg-slate-300"
          isConnectable={isConnectable}
        />
      )}

      {/* Drag handle indicator - more prominent when selected */}
      <div
        className={`
          absolute -top-3 left-1/2 transform -translate-x-1/2 
          ${selected ? "bg-indigo-600" : "bg-slate-700"} 
          rounded-t-md px-2 py-0.5 text-xs 
          ${selected ? "text-white" : "text-slate-300"} 
          cursor-grab hover:bg-indigo-500 transition-colors
        `}
      >
        <GripVertical size={14} className="inline-block" />
      </div>

      <div className="flex flex-col">
        {/* Node Header */}
        <div
          className={`text-sm text-center font-medium py-2 px-3 border-b border-opacity-25 w-full truncate ${getTitleColor()}`}
          style={{
            borderColor: "rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {label}
        </div>

        {/* Node Body */}
        <div className="p-4">
          {/* For Risk node: Show Inherent vs. Residual Risk (with controls) */}
          {id === 'risk' && inherentValue !== undefined ? (
            <div className="flex items-center h-full">
              {/* Inherent Risk */}
              <div className="w-1/3">
                <p className="text-xs text-slate-300 mb-1 text-center uppercase">
                  Inherent
                </p>
                <p
                  className="text-lg font-bold truncate text-center"
                  style={getGradientTextStyle()}
                >
                  {formatValue(inherentValue, isCurrency)}
                </p>
              </div>

              {/* Change indicator in the middle */}
              <div className="flex flex-col items-center w-1/3 px-1">
                <span className="text-xs text-slate-300">Reduction</span>
                <span
                  className="text-xs text-green-400 flex items-center mt-1"
                >
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                  {Math.round(100 - (value / inherentValue * 100))}%
                </span>
              </div>

              {/* Residual Risk */}
              <div className="w-1/3">
                <p className="text-xs text-slate-300 mb-1 text-center uppercase">
                  Residual
                </p>
                <p
                  className="text-lg font-bold truncate text-center"
                  style={getGradientTextStyle(true)} // Use green gradient for improved value
                >
                  {formatValue(value, isCurrency)}
                </p>
              </div>
            </div>
          ) : hasFutureValue ? (
            <div className="flex items-center h-full">
              {/* Current */}
              <div className="w-1/3">
                <p className="text-xs text-slate-300 mb-1 text-center uppercase">
                  Current
                </p>
                <p
                  className="text-lg font-bold truncate text-center"
                  style={getGradientTextStyle()}
                >
                  {formatValue(value, isCurrency)}
                </p>
              </div>

              {/* Change indicator in the middle */}
              <div className="flex flex-col items-center w-1/3 px-1">
                <span className="text-xs text-slate-300">Change</span>
                <span
                  className={`text-xs ${improved ? "text-green-400" : "text-red-400"} flex items-center mt-1`}
                >
                  {improved ? (
                    <ArrowDown className="h-3 w-3 mr-0.5" />
                  ) : (
                    <ArrowUp className="h-3 w-3 mr-0.5" />
                  )}
                  {changePercentage}%
                </span>
              </div>

              {/* Future */}
              <div className="w-1/3">
                <p className="text-xs text-slate-300 mb-1 text-center uppercase">
                  Future
                </p>
                <p
                  className="text-lg font-bold truncate text-center"
                  style={getGradientTextStyle(improved)}
                >
                  {formatValue(futureValue, isCurrency)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div
                className="text-lg font-bold py-2 px-2 truncate"
                style={getGradientTextStyle()}
              >
                {formatValue(value, isCurrency)}
              </div>

              {min !== undefined && max !== undefined && (
                <div className="text-xs text-slate-300 mt-1 px-2 truncate">
                  {formatValue(min, isCurrency)} -{" "}
                  {formatValue(max, isCurrency)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confidence badge - smaller and more subtle */}
      <div
        className="absolute top-1 right-1 text-xs px-1 py-0.5 rounded-sm opacity-80"
        style={{
          backgroundColor: confidenceColor,
          fontSize: "0.65rem",
        }}
      >
        {confidence}
      </div>

      {sourcePosition && (
        <Handle
          type="source"
          position={handleSourcePosition}
          className="w-3 h-3 bg-slate-300"
          isConnectable={isConnectable}
        />
      )}
    </div>
  );
};

export default memo(RiskNode);