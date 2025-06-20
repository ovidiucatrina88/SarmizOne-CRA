import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Control, Asset, ControlROI } from "@shared/models/control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Loader } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateControlRoi } from "@shared/utils/controlRoi";

// Interface for API response types
interface ApiResponse<T> {
  success?: boolean;
  data: T;
}

// Risk data structure for ROI analysis
interface RiskData {
  id: number;
  riskId: string;
  name: string;
  inherentRisk: string | number;
  residualRisk: string | number;
  associatedAssets?: string[];
}

export function ControlROIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roiResults, setRoiResults] = useState<ControlROI[]>([]);

  // Fetch controls, risks, and assets for ROI analysis
  const { data: controlsResponse } = useQuery<ApiResponse<Control[]>>({
    queryKey: ["/api/controls"],
  });

  const { data: risksResponse } = useQuery<ApiResponse<RiskData[]>>({
    queryKey: ["/api/risks"],
  });

  const { data: assetsResponse } = useQuery<ApiResponse<Asset[]>>({
    queryKey: ["/api/assets"],
  });
  
  // Extract data from API responses
  const controls = controlsResponse?.data || [];
  const assets = assetsResponse?.data || [];
  let risksArray: any[] = [];

  // Calculate ROI when dependencies change
  useEffect(() => {
    if (!controls || !risksResponse || !assets || controls.length === 0) {
      return;
    }
    
    setIsAnalyzing(true);
    try {
      // Extract the risk data from the API response
      let risksArray: any[] = [];
      
          // Make sure we have risk data in the expected format
      if (risksResponse && typeof risksResponse === 'object') {
        // New API format where risks are in the data property
        if ('data' in risksResponse && Array.isArray(risksResponse.data)) {
          risksArray = risksResponse.data;
        } 
        // Fallback to handle direct array
        else if (Array.isArray(risksResponse)) {
          risksArray = risksResponse;
        } else {
          console.error("Invalid risk data format:", risksResponse);
          return;
        }
      } else {
        console.error("No risk data available:", risksResponse);
        return;
      }
      
      // Convert risk data to expected format
      const risksForAnalysis = risksArray.map((risk: any) => {
        // Get inherent and residual risk values from different possible sources
        // First try inherentRisk/residualRisk fields, then fall back to lossMagnitudeAvg/primaryLossMagnitudeAvg
        const inherentRiskValue = risk.inherentRisk !== undefined ? Number(risk.inherentRisk) :
          (risk.lossMagnitudeAvg !== undefined ? Number(risk.lossMagnitudeAvg) : 
            (risk.primaryLossMagnitudeAvg !== undefined ? Number(risk.primaryLossMagnitudeAvg) : 0));
        
        const residualRiskValue = risk.residualRisk !== undefined ? Number(risk.residualRisk) :
          (inherentRiskValue * 0.5); // If no residual risk value, assume it's 50% of inherent risk
        
        console.log(`Risk ${risk.riskId} (ID: ${risk.id}) - Inherent: ${inherentRiskValue}, Residual: ${residualRiskValue}`);
        
        return {
          riskId: risk.riskId, 
          id: risk.id,
          residualRisk: residualRiskValue,
          inherentRisk: inherentRiskValue,
          associatedAssets: risk.associatedAssets || [] // Include associated assets
        };
      });
      
      // Debug: Log the data to inspect the structure
      console.log("Debug - First Control:", controls[0]);
      console.log("Debug - First Risk for Analysis:", risksForAnalysis[0]);
      console.log("Debug - First Risk Original:", risksArray[0]);
      console.log("Debug - Assets:", assets);
      
      // Calculate ROI for each control
      const results: ControlROI[] = controls.map(control => {
        // Ensure associatedRisks is an array
        if (!control.associatedRisks) {
          control.associatedRisks = [];
        } else if (!Array.isArray(control.associatedRisks)) {
          // If it's not an array (e.g., it might be a string), convert to array
          control.associatedRisks = [control.associatedRisks].filter(Boolean);
        }
        
        // Convert string cost fields to numbers for proper calculation
        const processedControl = {
          ...control,
          implementationCost: typeof control.implementationCost === 'string' 
            ? parseFloat(control.implementationCost) || 0 
            : control.implementationCost || 0,
          costPerAgent: typeof control.costPerAgent === 'string' 
            ? parseFloat(control.costPerAgent) || 0 
            : control.costPerAgent || 0,
          controlEffectiveness: typeof control.controlEffectiveness === 'string' 
            ? parseFloat(control.controlEffectiveness) || 0 
            : control.controlEffectiveness || 0
        };
        
        console.log(`Processing control ${control.id} with associatedRisks:`, control.associatedRisks);
        console.log(`Control ${control.id} costs - implementation: ${processedControl.implementationCost}, costPerAgent: ${processedControl.costPerAgent}, isPerAgent: ${processedControl.isPerAgentPricing}`);
        
        const result = calculateControlRoi(processedControl, risksForAnalysis, assets);
        console.log(`Control ${control.id} ROI result - implementationCost: ${result.implementationCost}, riskReduction: ${result.riskReduction}, roi: ${result.roi}`);
        return result;
      });
      
      // Sort by ROI (highest first)
      setRoiResults(results.sort((a, b) => b.roi - a.roi));
    } catch (error) {
      console.error("Error calculating ROI:", error);
      setRoiResults([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [controls, risksResponse, assets]);

  // Get ROI class based on the value
  const getRoiClass = (roi: number) => {
    if (roi > 0.5) return "text-green-500";
    if (roi > 0) return "text-lime-500";
    return "text-red-500";
  };

  // Loading state for data fetching or analysis
  const isFetching = !controls || !risksResponse || !assets;
  if (isAnalyzing || isFetching) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Control ROI Analysis</h2>
        <div className="flex justify-center py-6">
          <div className="flex flex-col items-center">
            <Loader className="h-8 w-8 animate-spin text-blue-400 mb-2" />
            <p className="text-sm text-gray-300">Analyzing control effectiveness and ROI...</p>
          </div>
        </div>
      </div>
    );
  }

  // No controls or results
  if (!roiResults || roiResults.length === 0 || !controls || controls.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Control ROI Analysis</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-300 mb-2">No Control Data Available</p>
          <p className="text-sm text-gray-400">
            Add controls and associate them with risks to see ROI analysis.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get maturity level and color
  // Current Maturity is based on control effectiveness (0-10 scale):
  // M4 (9-10): Optimized - Comprehensive security with continuous improvement
  // M3 (7-8.9): Managed - Well-implemented with regular monitoring
  // M2 (5-6.9): Defined - Standardized processes in place
  // M1 (3-4.9): Basic - Minimal security measures implemented
  // M0 (0-2.9): Initial - Ad-hoc or no security controls
  const getMaturityLevel = (effectiveness: number) => {
    if (effectiveness >= 9) return { level: 'M4', color: 'bg-green-100 text-green-700 border-green-200' };
    if (effectiveness >= 7) return { level: 'M3', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (effectiveness >= 5) return { level: 'M2', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    if (effectiveness >= 3) return { level: 'M1', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { level: 'M0', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  // Helper function to get recommendation level
  // Recommended Changes are based primarily on ROI potential:
  // Excellent ROI (>100%) = Invest more (M4 recommendation)
  // Good ROI (>50%) = Enhance investment (M3 recommendation)  
  // Moderate ROI (>10%) = Optimize current (M2 recommendation)
  // Low positive ROI (>0%) = Maintain current (M1 recommendation)
  // Negative ROI = Reduce investment (M0 recommendation)
  const getRecommendationLevel = (roi: number, effectiveness: number) => {
    if (roi > 1.0) return { level: 'M4', color: 'bg-green-100 text-green-700 border-green-200' };
    if (roi > 0.5) return { level: 'M3', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    if (roi > 0.1) return { level: 'M2', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    if (roi > 0) return { level: 'M1', color: 'bg-orange-100 text-orange-700 border-orange-200' };
    return { level: 'M0', color: 'bg-red-100 text-red-700 border-red-200' };
  };

  // Helper function to get arrow direction and colors
  const getArrowDirection = (currentLevel: string, recommendedLevel: string) => {
    const levels = ['M0', 'M1', 'M2', 'M3', 'M4'];
    const currentIndex = levels.indexOf(currentLevel);
    const recommendedIndex = levels.indexOf(recommendedLevel);
    
    if (recommendedIndex > currentIndex) {
      // Upgrade recommendation
      return {
        leftArrow: { icon: 'ArrowUpRight', color: 'text-blue-400' },
        rightArrow: { icon: 'ArrowUpRight', color: 'text-green-400' },
        direction: 'upgrade'
      };
    } else if (recommendedIndex < currentIndex) {
      // Downgrade recommendation  
      return {
        leftArrow: { icon: 'ArrowDownRight', color: 'text-orange-400' },
        rightArrow: { icon: 'ArrowDownRight', color: 'text-red-400' },
        direction: 'downgrade'
      };
    } else {
      // Maintain current level
      return {
        leftArrow: { icon: 'ArrowUpRight', color: 'text-gray-400' },
        rightArrow: { icon: 'ArrowUpRight', color: 'text-gray-400' },
        direction: 'maintain'
      };
    }
  };

  // Helper function to get control type abbreviation
  const getControlTypeAbbr = (type: string) => {
    switch (type) {
      case 'preventive': return 'PRV';
      case 'detective': return 'DET';
      case 'corrective': return 'COR';
      default: return 'CTL';
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header with summary stats */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Control ROI Analysis</h2>
            <div className="text-xs text-gray-400">
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-100">{roiResults.length}</div>
              <div className="text-sm text-gray-300">Total Controls</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(roiResults.reduce((sum, r) => {
                  const cost = typeof r.riskReduction === 'string' ? parseFloat(r.riskReduction) : r.riskReduction;
                  return sum + (cost || 0);
                }, 0))}
              </div>
              <div className="text-sm text-gray-300">Total Risk Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatCurrency(roiResults.reduce((sum, r) => {
                  const cost = typeof r.implementationCost === 'string' ? parseFloat(r.implementationCost) : r.implementationCost;
                  return sum + (cost || 0);
                }, 0))}
              </div>
              <div className="text-sm text-gray-300">Total Investment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {roiResults.length > 0 ? ((roiResults.reduce((sum, r) => {
                  const roi = typeof r.roi === 'string' ? parseFloat(r.roi) : r.roi;
                  return sum + (roi || 0);
                }, 0) / roiResults.length) * 100).toFixed(1) : '0.0'}%
              </div>
              <div className="text-sm text-gray-300">Average ROI</div>
            </div>
          </div>
        </div>

      {/* Enhanced table with modern design */}
      <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-600 bg-gray-700">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-300 uppercase tracking-wide">
            <div>Control Name</div>
            <div>Parameter</div>
            <div>Current Maturity</div>
            <div>Recommended Changes</div>
            <div></div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {roiResults.map((result) => {
            const control = controls.find(c => c.id === result.id);
            const currentMaturity = getMaturityLevel(control?.controlEffectiveness || 0);
            const recommendation = getRecommendationLevel(result.roi || 0, control?.controlEffectiveness || 0);
            const controlTypeAbbr = getControlTypeAbbr(control?.controlType || '');
            const arrows = getArrowDirection(currentMaturity.level, recommendation.level);
            
            return (
              <div key={result.id} className="px-6 py-4 hover:bg-gray-700 transition-colors">
                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Control Name */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center border border-gray-500">
                        <span className="text-xs font-medium text-gray-200">{controlTypeAbbr}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{result.name}</div>
                      <div className="text-xs text-gray-400">ID: {result.controlId}</div>
                    </div>
                  </div>

                  {/* Parameter */}
                  <div>
                    <div className="text-sm text-gray-300">
                      {control?.controlCategory === 'technical' ? 'Capability' : 
                       control?.controlCategory === 'administrative' ? 'Process' : 'Physical'}
                    </div>
                  </div>

                  {/* Current Maturity */}
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${currentMaturity.color}`}>
                      {currentMaturity.level}
                    </span>
                  </div>

                  {/* Recommended Changes */}
                  <div className="flex items-center space-x-2">
                    {arrows.leftArrow.icon === 'ArrowUpRight' && <ArrowUpRight className={`h-4 w-4 ${arrows.leftArrow.color}`} />}
                    {arrows.leftArrow.icon === 'ArrowDownRight' && <ArrowDownRight className={`h-4 w-4 ${arrows.leftArrow.color}`} />}
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${recommendation.color}`}>
                      {recommendation.level}
                    </span>
                    {arrows.rightArrow.icon === 'ArrowUpRight' && <ArrowUpRight className={`h-4 w-4 ${arrows.rightArrow.color}`} />}
                    {arrows.rightArrow.icon === 'ArrowDownRight' && <ArrowDownRight className={`h-4 w-4 ${arrows.rightArrow.color}`} />}
                  </div>

                  {/* ROI and Details */}
                  <div className="flex items-center justify-end space-x-3">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getRoiClass(result.roi || 0)}`}>
                        {(result.roi || 0) > 0 ? '+' : ''}{((result.roi || 0) * 100).toFixed(1)}% ROI
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatCurrency(result.implementationCost || 0)} cost
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional details row */}
                <div className="mt-3 pl-15 grid grid-cols-3 gap-4 text-xs text-gray-400">
                  <div>
                    <span className="font-medium">Risk Reduction:</span> {formatCurrency(result.riskReduction || 0)}
                  </div>
                  <div>
                    <span className="font-medium">Associated Risks:</span> {result.associatedRisksCount || 0}
                  </div>
                  <div>
                    <span className="font-medium">Agent Count:</span> {result.totalAgentCount || 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROI Performance Chart */}
      <div className="bg-gray-800 rounded-lg border border-gray-600 p-6">
        <h3 className="text-lg font-medium text-white mb-4">ROI Performance Overview</h3>
        <div className="space-y-3">
          {roiResults.slice(0, 5).map((result, index) => {
            const maxRoi = Math.max(...roiResults.map(r => r.roi || 0));
            const widthPercentage = maxRoi > 0 ? ((result.roi || 0) / maxRoi) * 100 : 0;
            
            return (
              <div key={result.id} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-300">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{result.name}</span>
                    <span className={`text-sm font-medium ${getRoiClass(result.roi || 0)}`}>
                      {((result.roi || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (result.roi || 0) > 0.3 ? 'bg-green-500' : 
                        (result.roi || 0) > 0.1 ? 'bg-yellow-500' : 
                        (result.roi || 0) > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(widthPercentage, 2)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Side Legend Card */}
      <div className="w-80">
        <div className="bg-gray-800 rounded-lg border border-gray-600 p-6 sticky top-6">
          <h3 className="text-lg font-medium text-white mb-4">Investment Direction Legend</h3>
          <div className="space-y-4">
            {/* Upgrade Direction */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ArrowUpRight className="h-5 w-5 text-blue-400" />
                <ArrowUpRight className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium text-sm">Increase Investment</span>
              </div>
              <div className="text-xs text-gray-300 ml-2">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Blue: Initiate</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Green: Confirm</span>
                  </span>
                </div>
                <p>High ROI controls justify increased investment</p>
              </div>
            </div>

            {/* Downgrade Direction */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ArrowDownRight className="h-5 w-5 text-orange-400" />
                <ArrowDownRight className="h-5 w-5 text-red-400" />
                <span className="text-white font-medium text-sm">Reduce Investment</span>
              </div>
              <div className="text-xs text-gray-300 ml-2">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>Orange: Warning</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Red: Reduce</span>
                  </span>
                </div>
                <p>Controls cost more than risk prevented</p>
              </div>
            </div>

            {/* Maintain Direction */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
                <span className="text-white font-medium text-sm">Maintain Current</span>
              </div>
              <div className="text-xs text-gray-300 ml-2">
                <div className="flex items-center space-x-3 mb-1">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Gray: Optimal</span>
                  </span>
                </div>
                <p>Current investment level matches ideal ROI</p>
              </div>
            </div>

            {/* ROI Thresholds */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3 text-sm">ROI Thresholds</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-medium text-xs">M4 - Excellent</span>
                  <span className="text-gray-300 text-xs">ROI {'>'} 100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-medium text-xs">M3 - Good</span>
                  <span className="text-gray-300 text-xs">ROI {'>'} 50%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-medium text-xs">M2 - Moderate</span>
                  <span className="text-gray-300 text-xs">ROI {'>'} 10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-medium text-xs">M1 - Low</span>
                  <span className="text-gray-300 text-xs">ROI {'>'} 0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}