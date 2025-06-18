import { Risk, Control } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Maximize2, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getThreatSpecificSuggestions, type ControlRecommendation } from "@shared/utils/controlRecommendation";
import { ControlSuggestionsPanel } from "./ControlSuggestionsPanel";

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
  const [activeTab, setActiveTab] = useState("suggestions");
  
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
        defaultValue="suggestions"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1"
      >
        <div className="border-b border-gray-800">
          <div className="px-4">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger
                value="suggestions"
                className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#f97316] text-gray-400 rounded-none px-4 py-2"
              >
                Control Suggestions
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



        {/* Control Suggestions Tab Content */}
        <TabsContent value="suggestions" className="flex-1 p-4">
          <ControlSuggestionsPanel riskId={risk.riskId} />
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