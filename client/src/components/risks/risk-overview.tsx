import React, { useEffect, useState, useMemo } from "react";
import { Risk, RiskCalculationParams, Control } from "@shared/schema";
import XyflowFairVisualization from "./XyflowFairVisualization";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@shared/utils/calculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RiskOverviewProps {
  risk: Risk;
}

interface RiskQuantifyProps {
  riskParams: RiskCalculationParams;
  controls: Control[];
}

function RiskQuantify({ riskParams, controls }: RiskQuantifyProps) {
  // Simply use the riskId from the parameters
  const effectiveRiskId = riskParams.riskId;

  // Get the inherent and residual risk directly from the risk parameters
  // These values are already loaded from the database in the parent component
  let inherentRisk = Number(riskParams.inherentRisk || 0);
  let residualRisk = Number(riskParams.residualRisk || 0);
  
  // Validate residual risk - it should never be higher than inherent risk and should never be NaN
  if (isNaN(residualRisk) || residualRisk > inherentRisk) {
    console.log("Invalid residual risk detected. Applying correction.");

    // If there are controls, apply a reasonable reduction based on control effectiveness
    if (controls && controls.length > 0) {
      // Calculate average control effectiveness (scale 0-10)
      const avgControlEffectiveness = controls.reduce(
        (sum, control) => sum + (Number(control.controlEffectiveness) || 0), 
        0
      ) / controls.length;
      
      // Calculate reduction percentage based on control effectiveness
      const reductionPercentage = (avgControlEffectiveness / 10) * 0.5; // 50% maximum reduction
      
      // Apply reduction to inherent risk
      residualRisk = inherentRisk * (1 - reductionPercentage);
    } else {
      // If no controls, residual risk equals inherent risk
      residualRisk = inherentRisk;
    }
  }
  
  // Calculate the risk reduction percentage
  const riskReduction = inherentRisk > 0 
    ? Math.round((1 - residualRisk / inherentRisk) * 100) 
    : 0;
    
  // Log the values we're using
  console.log(`Using risk values: inherentRisk=${inherentRisk}, residualRisk=${residualRisk}, reduction=${riskReduction}%`);
  
  // Simple loading state for the UI
  const [isLoading, setIsLoading] = useState(false);

  // Format the risk values for display
  const formattedRisk = {
    inherent: inherentRisk.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    residual: residualRisk.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    reduction: `${riskReduction}%`
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center gap-3">
        <div className="bg-blue-600 text-white py-2 px-3 rounded-md flex-1">
          <div className="text-xs uppercase tracking-wide mb-0.5">Inherent Risk</div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
            <div className="text-xl font-bold">
              {formattedRisk.inherent}
            </div>
          )}
        </div>

        <div className="bg-green-600 text-white py-2 px-3 rounded-md flex-1">
          <div className="text-xs uppercase tracking-wide mb-0.5">Residual Risk</div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
            <div className="text-xl font-bold">
              {formattedRisk.residual}
            </div>
          )}
        </div>

        <div className="bg-purple-600 text-white py-2 px-3 rounded-md flex-1">
          <div className="text-xs uppercase tracking-wide mb-0.5">Risk Reduction</div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span className="text-xs">Loading...</span>
            </div>
          ) : (
            <div className="text-xl font-bold">
              {formattedRisk.reduction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// RiskOverview component that displays the risk information and calculations
function RiskOverviewComponent({ risk }: RiskOverviewProps) {
  // Initialize query client and toast hooks
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Load controls associated with this risk
  const effectiveRiskId = risk.riskId; // Always use the string riskId for API calls

  // Query to get the latest calculated risk values from the server
  const {
    data: latestRiskCalculation,
    isLoading: calculationLoading,
  } = useQuery({
    queryKey: ["risk-calculation", effectiveRiskId],
    enabled: !!effectiveRiskId,
    queryFn: () => apiRequest("GET", `/api/risks/${effectiveRiskId}/calculate`),
  });

  // Always use the most recently calculated values from the server if available
  const riskWithLatestValues = useMemo(() => {
    if (latestRiskCalculation && latestRiskCalculation.inherentRisk) {
      console.log("Using latest risk calculation values:", latestRiskCalculation);
      return {
        ...risk,
        inherentRisk: latestRiskCalculation.inherentRisk,
        residualRisk: latestRiskCalculation.residualRisk,
      };
    }
    return risk;
  }, [risk, latestRiskCalculation]);

  const {
    data: controls = [],
    isLoading: controlsLoading,
    error: controlsError,
  } = useQuery({
    queryKey: ["risk-controls", effectiveRiskId],
    enabled: !!effectiveRiskId,
    queryFn: () => apiRequest("GET", `/api/risks/${effectiveRiskId}/controls`),
  });

  // Log controls data for debugging
  useEffect(() => {
    console.log("Risk data loaded, fetching controls for:", effectiveRiskId);
    console.log("Current controls:", controls);
  }, [effectiveRiskId, controls]);

  // Extract risk parameters from the risk object for visualization purposes
  // Note: All actual calculations are done server-side, these are just for display
  const riskParams: RiskCalculationParams = {
    riskId: riskWithLatestValues.riskId,

    // Contact Frequency parameters
    contactFrequencyMin: Number(risk.contactFrequencyMin || 0),
    contactFrequencyAvg: Number(risk.contactFrequencyAvg || 0),
    contactFrequencyMax: Number(risk.contactFrequencyMax || 0),
    contactFrequencyConfidence: risk.contactFrequencyConfidence || "medium",

    // Probability of Action parameters
    probabilityOfActionMin: Number(risk.probabilityOfActionMin || 0),
    probabilityOfActionAvg: Number(risk.probabilityOfActionAvg || 0),
    probabilityOfActionMax: Number(risk.probabilityOfActionMax || 0),
    probabilityOfActionConfidence:
      risk.probabilityOfActionConfidence || "medium",

    // Threat Capability parameters
    threatCapabilityMin: Number(risk.threatCapabilityMin || 0),
    threatCapabilityAvg: Number(risk.threatCapabilityAvg || 0),
    threatCapabilityMax: Number(risk.threatCapabilityMax || 0),
    threatCapabilityConfidence: risk.threatCapabilityConfidence || "medium",

    // Resistance Strength parameters
    resistanceStrengthMin: Number(risk.resistanceStrengthMin || 0),
    resistanceStrengthAvg: Number(risk.resistanceStrengthAvg || 0),
    resistanceStrengthMax: Number(risk.resistanceStrengthMax || 0),
    resistanceStrengthConfidence: risk.resistanceStrengthConfidence || "medium",

    // Primary Loss Magnitude parameters
    primaryLossMagnitudeMin: Number(risk.primaryLossMagnitudeMin || 0),
    primaryLossMagnitudeAvg: Number(risk.primaryLossMagnitudeAvg || 0),
    primaryLossMagnitudeMax: Number(risk.primaryLossMagnitudeMax || 0),
    primaryLossMagnitudeConfidence:
      risk.primaryLossMagnitudeConfidence || "medium",

    // Secondary Loss Event Frequency parameters (optional)
    secondaryLossEventFrequencyMin: risk.secondaryLossEventFrequencyMin
      ? Number(risk.secondaryLossEventFrequencyMin)
      : undefined,
    secondaryLossEventFrequencyAvg: risk.secondaryLossEventFrequencyAvg
      ? Number(risk.secondaryLossEventFrequencyAvg)
      : undefined,
    secondaryLossEventFrequencyMax: risk.secondaryLossEventFrequencyMax
      ? Number(risk.secondaryLossEventFrequencyMax)
      : undefined,
    secondaryLossEventFrequencyConfidence:
      risk.secondaryLossEventFrequencyConfidence || "medium",

    // Secondary Loss Magnitude parameters (optional)
    secondaryLossMagnitudeMin: risk.secondaryLossMagnitudeMin
      ? Number(risk.secondaryLossMagnitudeMin)
      : undefined,
    secondaryLossMagnitudeAvg: risk.secondaryLossMagnitudeAvg
      ? Number(risk.secondaryLossMagnitudeAvg)
      : undefined,
    secondaryLossMagnitudeMax: risk.secondaryLossMagnitudeMax
      ? Number(risk.secondaryLossMagnitudeMax)
      : undefined,
    secondaryLossMagnitudeConfidence:
      risk.secondaryLossMagnitudeConfidence || "medium",

    // Pre-calculated values from the server
    inherentRisk: risk.inherentRisk ? Number(risk.inherentRisk) : 0,
    residualRisk: risk.residualRisk ? Number(risk.residualRisk) : 0,
  };

  // Function to force a recalculation of risk values
  const recalculateRisk = async () => {
    if (!effectiveRiskId) return;
    
    try {
      // First clear the cached calculation to force a fresh calculation
      queryClient.removeQueries({ queryKey: ["risk-calculation", effectiveRiskId] });
      
      // Call the calculate endpoint to get fresh values
      const result = await apiRequest("GET", `/api/risks/${effectiveRiskId}/calculate`);
      
      if (result) {
        console.log("Recalculated risk values:", result);
        // Force a refresh of the risk values by invalidating queries
        queryClient.invalidateQueries({ queryKey: ["risk-calculation", effectiveRiskId] });
        queryClient.invalidateQueries({ queryKey: ["/api/risks"] });
        
        // Show success toast
        toast({
          title: "Risk Calculation Complete",
          description: "All risk values have been updated with the latest calculations",
        });
      }
    } catch (error) {
      console.error("Error recalculating risk:", error);
      toast({
        title: "Calculation Failed",
        description: "Unable to update risk values. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Top section with Risk Details and Inherent Risk cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Details Card */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-800 text-white pb-2">
            <CardTitle className="text-xl font-bold">Risk Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-2">
              <strong>Risk ID:</strong> {risk.riskId}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {risk.riskCategory}
            </p>
            <p className="mb-2">
              <strong>Severity:</strong> {risk.severity}
            </p>
            <p className="mb-2">
              <strong>Description:</strong>
            </p>
            <p className="mb-4 whitespace-pre-wrap">{risk.description}</p>
            
            {/* Run Calculations button */}
            <Button 
              onClick={recalculateRisk} 
              className="w-full"
              variant="secondary"
              disabled={calculationLoading}
            >
              {calculationLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                "Run Calculations"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Inherent Risk Card - moved from RiskQuantify to here */}
        <div className="space-y-4">
          <RiskQuantify riskParams={riskParams} controls={controls} />
        </div>
      </div>

      {/* Risk Overview Card - Full width for FAIR visualization */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Risk Overview: {risk.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-2">
          {/* Direct component without extra wrapper */}
          <XyflowFairVisualization
            riskParams={riskParams}
            riskName={risk.name}
            riskId={risk.riskId}
            className="w-full"
            controls={controls}
            riskFromApi={risk} // Pass the full risk object with server-calculated values
            useServerCalculations={true} // Explicitly flag to use server calculations only
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Create a memoized version of RiskOverview for better performance
export const RiskOverview = React.memo(
  RiskOverviewComponent,
  (prevProps, nextProps) => {
    // Always re-render when risk ID changes
    if (prevProps.risk.id !== nextProps.risk.id) return false;

    // Re-render when risk values change
    if (prevProps.risk.inherentRisk !== nextProps.risk.inherentRisk)
      return false;
    if (prevProps.risk.residualRisk !== nextProps.risk.residualRisk)
      return false;

    // Re-render when FAIR parameters change that affect calculations
    if (
      prevProps.risk.contactFrequencyAvg !== nextProps.risk.contactFrequencyAvg
    )
      return false;
    if (
      prevProps.risk.probabilityOfActionAvg !==
      nextProps.risk.probabilityOfActionAvg
    )
      return false;
    if (
      prevProps.risk.threatCapabilityAvg !== nextProps.risk.threatCapabilityAvg
    )
      return false;
    if (
      prevProps.risk.resistanceStrengthAvg !==
      nextProps.risk.resistanceStrengthAvg
    )
      return false;
    if (
      prevProps.risk.primaryLossMagnitudeAvg !==
      nextProps.risk.primaryLossMagnitudeAvg
    )
      return false;

    // Allow optimization - no re-render if nothing relevant changed
    return true;
  },
);
