import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calculator, Zap } from "lucide-react";

interface Risk {
  id: number;
  name: string;
  riskId: string;
  severity: string;
  inherentRisk: number;
  residualRisk: number;
  riskCategory: string;
}

interface ScenarioModelerProps {
  risks: Risk[];
  currentExposure: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  riskMultipliers: Record<string, number>;
  totalImpact: number;
  impactType: 'increase' | 'decrease';
}

const PREDEFINED_SCENARIOS = [
  {
    id: 'cyber-attack',
    name: 'Major Cyber Attack',
    description: 'Advanced persistent threat targeting critical infrastructure',
    riskMultipliers: {
      'operational': 2.5,
      'strategic': 1.8,
      'compliance': 2.0,
      'financial': 3.0
    }
  },
  {
    id: 'regulatory-change',
    name: 'New Regulatory Requirements',
    description: 'Stricter compliance requirements with higher penalties',
    riskMultipliers: {
      'operational': 1.2,
      'strategic': 1.5,
      'compliance': 3.5,
      'financial': 1.8
    }
  },
  {
    id: 'market-downturn',
    name: 'Economic Recession',
    description: 'Significant market volatility and reduced funding',
    riskMultipliers: {
      'operational': 1.8,
      'strategic': 2.2,
      'compliance': 1.3,
      'financial': 2.8
    }
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Disruption',
    description: 'Major vendor failure affecting operations',
    riskMultipliers: {
      'operational': 3.0,
      'strategic': 2.0,
      'compliance': 1.5,
      'financial': 2.2
    }
  }
];

export function RiskScenarioModeler({ risks, currentExposure }: ScenarioModelerProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [customMultipliers, setCustomMultipliers] = useState<Record<string, number>>({
    operational: 1.0,
    strategic: 1.0,
    compliance: 1.0,
    financial: 1.0
  });
  const [customScenarioName, setCustomScenarioName] = useState('Custom Scenario');
  const [activeScenarios, setActiveScenarios] = useState<Scenario[]>([]);

  // Calculate scenario impact
  const scenarioImpact = useMemo(() => {
    const multipliers = selectedScenario ? 
      PREDEFINED_SCENARIOS.find(s => s.id === selectedScenario)?.riskMultipliers || customMultipliers :
      customMultipliers;

    let totalNewExposure = 0;
    const categoryBreakdown: Record<string, { current: number; projected: number; impact: number }> = {};

    // Calculate impact by risk category
    risks.forEach(risk => {
      const category = risk.riskCategory || 'operational';
      const multiplier = multipliers[category] || 1.0;
      const newExposure = risk.residualRisk * multiplier;
      const impact = newExposure - risk.residualRisk;

      totalNewExposure += newExposure;

      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { current: 0, projected: 0, impact: 0 };
      }
      categoryBreakdown[category].current += risk.residualRisk;
      categoryBreakdown[category].projected += newExposure;
      categoryBreakdown[category].impact += impact;
    });

    const totalImpact = totalNewExposure - currentExposure;
    const percentageChange = currentExposure > 0 ? (totalImpact / currentExposure) * 100 : 0;

    return {
      totalNewExposure,
      totalImpact,
      percentageChange,
      categoryBreakdown,
      impactType: totalImpact >= 0 ? 'increase' as const : 'decrease' as const
    };
  }, [selectedScenario, customMultipliers, risks, currentExposure]);

  const handleAddScenario = () => {
    const scenario = selectedScenario ? 
      PREDEFINED_SCENARIOS.find(s => s.id === selectedScenario) :
      {
        id: `custom-${Date.now()}`,
        name: customScenarioName,
        description: 'Custom risk scenario',
        riskMultipliers: { ...customMultipliers }
      };

    if (scenario) {
      const newScenario: Scenario = {
        ...scenario,
        totalImpact: scenarioImpact.totalImpact,
        impactType: scenarioImpact.impactType
      };
      setActiveScenarios([...activeScenarios, newScenario]);
    }
  };

  const handleRemoveScenario = (scenarioId: string) => {
    setActiveScenarios(activeScenarios.filter(s => s.id !== scenarioId));
  };

  const combinedScenarioImpact = useMemo(() => {
    if (activeScenarios.length === 0) return 0;
    return activeScenarios.reduce((total, scenario) => total + scenario.totalImpact, 0);
  }, [activeScenarios]);

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Calculator className="mr-2 h-5 w-5" />
          Risk Scenario Modeler
        </CardTitle>
        <CardDescription className="text-gray-300">
          Model potential risk scenarios and analyze their impact on overall exposure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-200">Predefined Scenarios</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select a scenario" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_SCENARIOS.map(scenario => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-200">Custom Scenario Name</Label>
              <Input
                value={customScenarioName}
                onChange={(e) => setCustomScenarioName(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter scenario name"
              />
            </div>
          </div>

          {/* Custom Multipliers */}
          <div className="space-y-3">
            <Label className="text-gray-200">Risk Category Multipliers</Label>
            {Object.entries(customMultipliers).map(([category, value]) => (
              <div key={category} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-gray-300 capitalize">{category}</div>
                <div className="flex-1">
                  <Slider
                    value={[value]}
                    onValueChange={(values) => 
                      setCustomMultipliers(prev => ({ ...prev, [category]: values[0] }))
                    }
                    max={5}
                    min={0.1}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
                <div className="w-12 text-sm text-gray-300">{value.toFixed(1)}x</div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Analysis */}
        <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
          <h4 className="text-white font-medium">Scenario Impact Analysis</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(currentExposure)}
              </div>
              <div className="text-sm text-gray-400">Current Exposure</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(scenarioImpact.totalNewExposure)}
              </div>
              <div className="text-sm text-gray-400">Projected Exposure</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center ${
                scenarioImpact.impactType === 'increase' ? 'text-red-400' : 'text-green-400'
              }`}>
                {scenarioImpact.impactType === 'increase' ? <TrendingUp className="mr-1 h-5 w-5" /> : <TrendingDown className="mr-1 h-5 w-5" />}
                {formatCurrency(Math.abs(scenarioImpact.totalImpact))}
              </div>
              <div className="text-sm text-gray-400">
                {scenarioImpact.percentageChange > 0 ? '+' : ''}{scenarioImpact.percentageChange.toFixed(1)}% Change
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-200">Impact by Category</h5>
            {Object.entries(scenarioImpact.categoryBreakdown).map(([category, data]) => (
              <div key={category} className="flex justify-between items-center text-sm">
                <span className="text-gray-300 capitalize">{category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{formatCurrency(data.current)}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-white">{formatCurrency(data.projected)}</span>
                  <Badge variant={data.impact >= 0 ? "destructive" : "secondary"} className="text-xs">
                    {data.impact >= 0 ? '+' : ''}{formatCurrency(data.impact)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Scenario Button */}
        <Button 
          onClick={handleAddScenario}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          Add Scenario to Analysis
        </Button>

        {/* Active Scenarios */}
        {activeScenarios.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Active Scenarios</h4>
            {activeScenarios.map(scenario => (
              <div key={scenario.id} className="flex items-center justify-between bg-gray-800/30 rounded p-3">
                <div>
                  <div className="text-white font-medium">{scenario.name}</div>
                  <div className="text-sm text-gray-400">{scenario.description}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={scenario.impactType === 'increase' ? "destructive" : "secondary"}>
                    {scenario.impactType === 'increase' ? '+' : ''}{formatCurrency(scenario.totalImpact)}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveScenario(scenario.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Combined Impact */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">Combined Scenario Impact</div>
                <div className={`text-3xl font-bold ${combinedScenarioImpact >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {combinedScenarioImpact >= 0 ? '+' : ''}{formatCurrency(combinedScenarioImpact)}
                </div>
                <div className="text-sm text-gray-300">
                  Total projected exposure: {formatCurrency(currentExposure + combinedScenarioImpact)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}