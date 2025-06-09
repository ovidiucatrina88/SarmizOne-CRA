import React from "@/common/react-import";
import { useState, useQuery } from "@/common/react-import";
import { Risk, Control } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Maximize2, ArrowLeft } from "lucide-react";

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
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'preventive').map((control, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center">
                        {control.controlId.substring(0, 3).toUpperCase()}
                      </div>
                      <div>{control.name}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">
                        {Math.floor(Math.random() * 60) + 40}%
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-gray-400">
                        {Math.floor(Math.random() * 30) + 70}%
                      </div>
                    </div>
                    
                    <div className="flex items-center text-green-500">
                      ↓ {Math.floor(Math.random() * 40) + 5}.{Math.floor(Math.random() * 99)}%
                    </div>
                  </div>
                ))}
                
                {/* Fallback controls if none exist */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'preventive').length === 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center">
                          NFW
                        </div>
                        <div>Network Firewall</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">69%</div>
                        <div className="text-gray-400">→</div>
                        <div className="text-gray-400">83%</div>
                      </div>
                      
                      <div className="flex items-center text-green-500">
                        ↓ 14.93%
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center">
                          WAF
                        </div>
                        <div>Web Application Firewall</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">0%</div>
                        <div className="text-gray-400">→</div>
                        <div className="text-gray-400">30%</div>
                      </div>
                      
                      <div className="flex items-center text-green-500">
                        ↓ 13.38%
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center">
                          HAC
                        </div>
                        <div>Hardened Cloud</div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400">54%</div>
                        <div className="text-gray-400">→</div>
                        <div className="text-gray-400">77%</div>
                      </div>
                      
                      <div className="flex items-center text-green-500">
                        ↓ 7.13%
                      </div>
                    </div>
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
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'corrective').map((control, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600 text-white w-8 h-8 rounded flex items-center justify-center">
                        {control.controlId.substring(0, 2).toUpperCase()}
                      </div>
                      <div>{control.name}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">
                        {Math.floor(Math.random() * 50) + 30}%
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="text-gray-400">
                        {Math.floor(Math.random() * 20) + 60}%
                      </div>
                    </div>
                    
                    <div className="flex items-center text-green-500">
                      ↓ ${Math.floor(Math.random() * 50) + 10}M
                    </div>
                  </div>
                ))}
                
                {/* Fallback control if none exists */}
                {Array.isArray(controls) && controls.filter(c => c.controlType === 'corrective').length === 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600 text-white w-8 h-8 rounded flex items-center justify-center">
                        IR
                      </div>
                      <div>Incident Response</div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">34%</div>
                      <div className="text-gray-400">→</div>
                      <div className="text-gray-400">65%</div>
                    </div>
                    
                    <div className="flex items-center text-green-500">
                      ↓ $20M
                    </div>
                  </div>
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