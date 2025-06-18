import { Risk, Control } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Maximize2, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getThreatSpecificSuggestions, type ControlRecommendation } from "@shared/utils/controlRecommendation";

interface RiskDetailViewProps {
  risk: Risk;
  onBack: () => void;
}

// Helper functions for confidence labels and colors
const getConfidenceBadge = (confidence: string) => {
  switch (confidence.toLowerCase()) {
    case "low":
      return <Badge className="text-amber-500 border-amber-500 bg-transparent">LOW</Badge>;
    case "medium":
      return <Badge className="text-orange-500 border-orange-500 bg-transparent">MEDIUM</Badge>;
    case "high":
      return <Badge className="text-emerald-500 border-emerald-500 bg-transparent">HIGH</Badge>;
    default:
      return <Badge className="bg-transparent">MEDIUM</Badge>;
  }
};

// Lines for the timeline charts
const TimelineChart: React.FC<{
  data?: number[];
  color?: string;
  height?: number;
}> = ({ data = [0.3, 0.5, 0.4, 0.7, 0.3, 0.2, 0.5], color = "#f97316", height = 80 }) => {
  const svgWidth = 100;
  const svgHeight = height;
  const points = data.map((value, index) => 
    `${(index / (data.length - 1)) * svgWidth},${svgHeight - (value * svgHeight)}`
  ).join(" ");

  return (
    <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export function RiskDetailView({ risk, onBack }: RiskDetailViewProps) {
  const [activeTab, setActiveTab] = useState("factors");
  
  // Fetch controls associated with this risk
  const { data: controlsData } = useQuery<Control[]>({
    queryKey: ["/api/risks", risk.riskId, "controls"],
    enabled: !!risk.riskId,
  });
  
  // Ensure controls is always an array
  const controls = Array.isArray(controlsData) ? controlsData : [];
  
  // Get threat-specific control suggestions when no real controls exist
  const controlSuggestions = useMemo(() => {
    if (controls.length === 0) {
      return getThreatSpecificSuggestions(
        risk.threatCommunity || '',
        risk.vulnerability || ''
      );
    }
    return [];
  }, [controls.length, risk.threatCommunity, risk.vulnerability]);

  // For demo purposes - random data for timeline charts
  const likelihoodTimelineData = [0.4, 0.5, 0.6, 0.3, 0.5, 0.4, 0.3];
  const lossTimelineData = [0.2, 0.7, 0.6, 0.5, 0.2, 0.3, 0.5];

  // Calculate the risk likelihood percentage based on loss event frequency
  const riskFrequency = typeof risk.lossEventFrequencyAvg === 'number' ? risk.lossEventFrequencyAvg : 0;
  const likelihoodPercentage = Math.round(riskFrequency * 100);
  
  // Format loss magnitude
  const lossMagnitude = typeof risk.lossMagnitudeAvg === 'number' ? risk.lossMagnitudeAvg : 0;
  const formattedLossMagnitude = formatCurrency(lossMagnitude, 'USD');
  
  // Format annualized loss
  const riskLossMagnitude = typeof risk.lossMagnitudeAvg === 'number' ? risk.lossMagnitudeAvg : 0;
  const riskLossEventFrequency = typeof risk.lossEventFrequencyAvg === 'number' ? risk.lossEventFrequencyAvg : 0;
  const annualizedLoss = riskLossMagnitude * riskLossEventFrequency;
  const formattedAnnualizedLoss = formatCurrency(annualizedLoss, 'USD');

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#121212] text-white">
      {/* Header with back button and title */}
      <div className="p-4 flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-medium truncate">{risk.name}</h1>
      </div>

      {/* Main content with tabs */}
      <Tabs
        defaultValue="factors"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1"
      >
        <div className="border-b border-gray-800">
          <div className="px-4">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger
                value="factors"
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] text-gray-400 rounded-none px-4 py-2"
              >
                Factors
              </TabsTrigger>
              <TabsTrigger
                value="curve"
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] text-gray-400 rounded-none px-4 py-2"
              >
                Loss Exceedance Curve
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Factors Tab Content */}
        <TabsContent value="factors" className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Annualized Loss Section */}
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Annualized Loss</h2>
                <div className="text-amber-500">MED</div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-2xl font-bold">$0</div>
                <div className="text-2xl font-bold">{formattedLossMagnitude.replace('$', '$')}</div>
                <div className="text-2xl font-bold">{formattedAnnualizedLoss.replace('$', '$')}</div>
              </div>
              
              <div className="h-1 bg-gray-700 mt-4 relative">
                <div className="absolute w-full h-1 flex justify-between px-1">
                  <div className="w-1 h-3 bg-gray-600 -mt-1"></div>
                  <div className="w-1 h-3 bg-gray-600 -mt-1"></div>
                  <div className="w-1 h-3 bg-gray-600 -mt-1"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mt-10 mb-2">
                {/* Likelihood */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Likelihood</h3>
                    <div className="text-amber-500">MED</div>
                  </div>
                  
                  <div className="flex justify-between items-baseline mt-4">
                    <div className="text-3xl font-bold">{likelihoodPercentage}%</div>
                  </div>
                  
                  <div className="mt-6 h-20">
                    <TimelineChart data={likelihoodTimelineData} />
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-1">
                    +4% LAST YEAR
                  </div>
                </div>
                
                {/* Loss Magnitude */}
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-medium">Loss Magnitude</h3>
                    <div className="text-amber-500">MED</div>
                  </div>
                  
                  <div className="flex justify-between items-baseline mt-4">
                    <div className="text-3xl font-bold">{formattedLossMagnitude}</div>
                  </div>
                  
                  <div className="mt-6 h-20">
                    <TimelineChart data={lossTimelineData} />
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-1">
                    +$9.3M LAST YEAR
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls that Reduce Likelihood */}
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Reduce Likelihood</h2>
                <Button variant="outline" size="sm" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Real controls */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'preventive').map((control, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center">
                        {control.controlId.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{control.name}</div>
                        <div className="text-xs text-gray-400">Implemented</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500">Effectiveness:</div>
                      <div className="text-blue-400 font-medium">
                        {Math.round((control.controlEffectiveness / 10) * 100)}%
                      </div>
                    </div>
                    
                    <div className="flex items-center text-green-500">
                      <div className="text-xs">
                        Status: {control.implementationStatus?.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Suggested controls if no real preventive controls exist */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'preventive').length === 0 && (
                  <>
                    {controlSuggestions.filter((s: ControlRecommendation) => s.controlType === 'preventive').map((suggestion: ControlRecommendation, index: number) => (
                      <div key={suggestion.controlId} className="flex items-center justify-between border border-amber-600/30 bg-amber-900/20 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-600 text-white w-8 h-8 rounded flex items-center justify-center">
                            {suggestion.controlId.split('-')[1]?.substring(0, 3).toUpperCase() || 'SUG'}
                          </div>
                          <div>
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-xs text-amber-400">Suggested - {suggestion.justification}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-xs text-gray-500">Relevance:</div>
                          <div className="text-amber-400 font-medium">
                            {Math.round(suggestion.relevanceScore)}%
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`text-xs px-2 py-1 rounded ${
                            suggestion.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                            suggestion.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-green-600/20 text-green-400'
                          }`}>
                            {suggestion.priority.toUpperCase()} PRIORITY
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            {/* Controls that Reduce Loss Magnitude */}
            <div className="bg-[#1e1e1e] rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Reduce Loss Magnitude</h2>
                <Button variant="outline" size="sm" className="bg-transparent border-gray-700 hover:bg-gray-800">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* Real controls */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'corrective').map((control, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600 text-white w-8 h-8 rounded flex items-center justify-center">
                        {control.controlId.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{control.name}</div>
                        <div className="text-xs text-gray-400">Implemented</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-gray-500">Effectiveness:</div>
                      <div className="text-purple-400 font-medium">
                        {Math.round((control.controlEffectiveness / 10) * 100)}%
                      </div>
                    </div>
                    
                    <div className="flex items-center text-green-500">
                      <div className="text-xs">
                        Status: {control.implementationStatus?.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Suggested controls if no real corrective controls exist */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'corrective').length === 0 && (
                  <>
                    {controlSuggestions.filter((s: ControlRecommendation) => s.controlType === 'corrective').map((suggestion: ControlRecommendation, index: number) => (
                      <div key={suggestion.controlId} className="flex items-center justify-between border border-amber-600/30 bg-amber-900/20 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-amber-600 text-white w-8 h-8 rounded flex items-center justify-center">
                            {suggestion.controlId.split('-')[1]?.substring(0, 2).toUpperCase() || 'SG'}
                          </div>
                          <div>
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-xs text-amber-400">Suggested - {suggestion.justification}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-xs text-gray-500">Relevance:</div>
                          <div className="text-amber-400 font-medium">
                            {Math.round(suggestion.relevanceScore)}%
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`text-xs px-2 py-1 rounded ${
                            suggestion.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                            suggestion.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                            'bg-green-600/20 text-green-400'
                          }`}>
                            {suggestion.priority.toUpperCase()} PRIORITY
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Loss Exceedance Curve Tab Content */}
        <TabsContent value="curve" className="flex-1 p-4">
          <div className="bg-[#1e1e1e] rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Loss Exceedance Curve</h2>
            <p className="text-gray-400 mb-8">
              The curve will be implemented in a future update.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}