/**
 * Configuration options for FAIR risk visualization
 */

// Theme for risk nodes with dark mode compatibility
export const themeConfig = {
  dark: {
    nodeBg: "#1e293b", // slate-800
    nodeText: "#f8fafc", // slate-50
    edgeStroke: "#94a3b8", // slate-400
    highRiskColor: "#ef4444", // red-500
    mediumRiskColor: "#f97316", // orange-500
    lowRiskColor: "#22c55e", // green-500
    highConfidenceColor: "#10b981", // emerald-500
    mediumConfidenceColor: "#f59e0b", // amber-500
    lowConfidenceColor: "#ef4444", // red-500
    animatedEdgeStroke: "rgba(99, 102, 241, 0.8)", // indigo-500 with opacity
    gradientStart: "#0f172a", // slate-900
    gradientEnd: "#0f1d37", // slightly lighter slate-900
  },
  light: {
    nodeBg: "#f8fafc", // slate-50
    nodeText: "#1e293b", // slate-800
    edgeStroke: "#64748b", // slate-500
    highRiskColor: "#ef4444", // red-500
    mediumRiskColor: "#f97316", // orange-500
    lowRiskColor: "#22c55e", // green-500
    highConfidenceColor: "#10b981", // emerald-500
    mediumConfidenceColor: "#f59e0b", // amber-500
    lowConfidenceColor: "#ef4444", // red-500
    animatedEdgeStroke: "rgba(99, 102, 241, 0.8)", // indigo-500 with opacity
    gradientStart: "#f1f5f9", // slate-100
    gradientEnd: "#e2e8f0", // slate-200
  },
};

// Responsive size config for different screen sizes
export const sizeConfig = {
  sm: {
    nodeWidth: 120,
    nodeHeight: 40,
    fontSize: 10,
    badgeSize: 10,
    strokeWidth: 1,
    cornerRadius: 4,
    edgeStrokeWidth: 1.5,
    spacingMultiplier: 0.8,
  },
  md: {
    nodeWidth: 160,
    nodeHeight: 80,
    fontSize: 12,
    badgeSize: 18,
    strokeWidth: 1.5,
    cornerRadius: 6,
    edgeStrokeWidth: 2,
    spacingMultiplier: 1,
  },
  lg: {
    nodeWidth: 200,
    nodeHeight: 80,
    fontSize: 14,
    badgeSize: 22,
    strokeWidth: 2,
    cornerRadius: 8,
    edgeStrokeWidth: 2.5,
    spacingMultiplier: 1.2,
  },
};

// Get size config based on container width
export const getSizeConfig = (width: number) => {
  if (width < 768) {
    return sizeConfig.sm;
  } else if (width < 1280) {
    return sizeConfig.md;
  } else {
    return sizeConfig.lg;
  }
};

// Risk level calculation helper
export const getRiskLevel = (
  value: number,
  max: number,
): "low" | "medium" | "high" => {
  const percentage = value / max;
  if (percentage < 0.33) return "low";
  if (percentage < 0.66) return "medium";
  return "high";
};

// Confidence color mapping
export const getConfidenceColor = (
  confidence: string,
  theme: "dark" | "light" = "dark",
): string => {
  const colors = themeConfig[theme];
  switch (confidence.toLowerCase()) {
    case "high":
      return colors.highConfidenceColor;
    case "medium":
      return colors.mediumConfidenceColor;
    case "low":
    default:
      return colors.lowConfidenceColor;
  }
};

// Risk color mapping
export const getRiskColor = (
  level: "low" | "medium" | "high",
  theme: "dark" | "light" = "dark",
): string => {
  const colors = themeConfig[theme];
  switch (level) {
    case "low":
      return colors.lowRiskColor;
    case "medium":
      return colors.mediumRiskColor;
    case "high":
    default:
      return colors.highRiskColor;
  }
};

// Format number as currency or percentage
export const formatValue = (
  value: number,
  isCurrency: boolean = true,
  decimals: number = 0,
): string => {
  // For non-currency values, handle decimal places based on the value
  if (!isCurrency) {
    // For values less than 10, show 2 decimal places
    if (value < 10) {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    
    // For values between 10 and 100, show 1 decimal place
    if (value < 100) {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }
  }

  // For currency or large numbers, use the specified decimals
  if (isCurrency) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Default flow style configuration
export const defaultFlowStyle = {
  background: "transparent",
  height: "100%",
  width: "100%",
};

// Edge style configurations
export const edgeStyles = {
  default: {
    stroke: "#94a3b8", // slate-400
    strokeWidth: 2,
    opacity: 0.7,
    transition: "stroke 0.2s ease, opacity 0.2s ease",
    animate: false,
  },
  animated: {
    stroke: "rgba(99, 102, 241, 0.8)", // indigo-500 with opacity
    strokeWidth: 2.5,
    opacity: 0.9,
    transition: "all 0.2s ease",
    animate: true,
  },
  selected: {
    stroke: "#6366f1", // indigo-500
    strokeWidth: 3,
    opacity: 1,
    transition: "all 0.1s ease",
    animate: false,
  },
};
