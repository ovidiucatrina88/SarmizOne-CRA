import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
} from 'recharts'
import { formatCurrency } from '@shared/utils/calculations'

interface DataPoint {
  lossExposure: number;
  probability: number;
  previousProbability?: number | null;
  toleranceProbability?: number | null;
  redAreaTop?: number;
  redAreaBottom?: number;
  greenAreaTop?: number;
  greenAreaBottom?: number;
  formattedLoss: string;
  isThresholdPoint?: boolean;
  exposureData?: {
    minimum: number;
    average: number;
    maximum: number;
  };
}

interface LossExceedanceCurveModernProps {
  risks: any[];
  currentExposure?: {
    // Primary fields (preferred)
    minimumExposure?: number;
    averageExposure?: number;
    maximumExposure?: number;
    // Legacy fields (for backward compatibility)
    tenthPercentile?: number;
    mostLikely?: number;
    ninetiethPercentile?: number;
  };
  previousExposure?: {
    // Primary fields (preferred)
    minimumExposure?: number;
    averageExposure?: number;
    maximumExposure?: number;
    // Legacy fields (for backward compatibility)
    tenthPercentile?: number;
    mostLikely?: number;
    ninetiethPercentile?: number;
  };
  // Filtering properties
  filterType?: 'all' | 'entity' | 'asset' | 'l1' | 'l2' | 'l3' | 'l4';
  selectedEntityId?: string | null;
  selectedAssetId?: string | null;
  selectedArchitectureId?: string | null;
}

// Default tolerance thresholds
const DEFAULT_THRESHOLDS = {
  FULL_ACCEPTANCE: 1000000,    // $1M - 100% acceptance
  HIGH_ACCEPTANCE: 5000000,    // $5M - 75% acceptance  
  MEDIUM_ACCEPTANCE: 10000000, // $10M - 50% acceptance
  LOW_ACCEPTANCE: 20000000,    // $20M - 25% acceptance
  ZERO_ACCEPTANCE: 50000000,   // $50M - 0% acceptance
};

export function LossExceedanceCurveModern({ 
  risks, 
  currentExposure, 
  previousExposure,
  filterType = 'all',
  selectedEntityId,
  selectedAssetId,
  selectedArchitectureId
}: LossExceedanceCurveModernProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showTolerance, setShowTolerance] = useState(true);

  // Filter risks based on the filter criteria
  const filteredRisks = useMemo(() => {
    if (!risks || risks.length === 0) return [];
    
    return risks.filter(risk => {
      if (filterType === 'entity' && selectedEntityId) {
        return risk.legalEntityId === selectedEntityId;
      }
      if (filterType === 'asset' && selectedAssetId) {
        return risk.assetId === selectedAssetId;
      }
      if (filterType === 'l1' && selectedArchitectureId) {
        return risk.enterpriseArchitectureL1 === selectedArchitectureId;
      }
      if (filterType === 'l2' && selectedArchitectureId) {
        return risk.enterpriseArchitectureL2 === selectedArchitectureId;
      }
      if (filterType === 'l3' && selectedArchitectureId) {
        return risk.enterpriseArchitectureL3 === selectedArchitectureId;
      }
      if (filterType === 'l4' && selectedArchitectureId) {
        return risk.enterpriseArchitectureL4 === selectedArchitectureId;
      }
      return true; // 'all' or no specific filter
    });
  }, [risks, filterType, selectedEntityId, selectedAssetId, selectedArchitectureId]);

  console.log(`Using ${filteredRisks.length} risks for chart calculations (filter: ${filterType})`);

  // Calculate exposure data
  const exposureData = useMemo(() => {
    let minimum, average, maximum;
    
    // Use currentExposure if provided, otherwise calculate from filtered risks
    if (currentExposure) {
      minimum = currentExposure.minimumExposure ?? currentExposure.tenthPercentile ?? 0;
      average = currentExposure.averageExposure ?? currentExposure.mostLikely ?? 0;
      maximum = currentExposure.maximumExposure ?? currentExposure.ninetiethPercentile ?? 0;
    } else if (filteredRisks && filteredRisks.length > 0) {
      // Calculate from filtered risks
      const riskValues = filteredRisks.map(risk => {
        const riskValue = parseFloat(risk.residualRisk || risk.inherentRisk || '0');
        return riskValue;
      });
      
      const totalRisk = riskValues.reduce((sum, val) => sum + val, 0);
      minimum = totalRisk * 0.4; // 40% of total risk
      average = totalRisk; // Total risk as average
      maximum = totalRisk * 2.0; // 200% of total risk
    } else {
      // Fallback values
      minimum = 100000;
      average = 1000000;
      maximum = 10000000;
    }
    
    return { minimum, average, maximum };
  }, [currentExposure, filteredRisks]);

  const previousData = useMemo(() => {
    if (!previousExposure) return null;
    
    return {
      minimum: previousExposure.minimumExposure ?? previousExposure.tenthPercentile ?? 0,
      average: previousExposure.averageExposure ?? previousExposure.mostLikely ?? 0,
      maximum: previousExposure.maximumExposure ?? previousExposure.ninetiethPercentile ?? 0
    };
  }, [previousExposure]);

  const formatExposure = useCallback((value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${Math.round(value)}`;
  }, []);

  const toleranceThresholds = useMemo(() => ({
    fullAcceptance: DEFAULT_THRESHOLDS.FULL_ACCEPTANCE,
    highAcceptance: DEFAULT_THRESHOLDS.HIGH_ACCEPTANCE,
    mediumAcceptance: DEFAULT_THRESHOLDS.MEDIUM_ACCEPTANCE,
    lowAcceptance: DEFAULT_THRESHOLDS.LOW_ACCEPTANCE,
    zeroAcceptance: DEFAULT_THRESHOLDS.ZERO_ACCEPTANCE,
  }), []);

  const chartData = useMemo(() => {
    if (!filteredRisks || filteredRisks.length === 0) return [];
    
    const data: DataPoint[] = [];
    
    // Calculate exposure values
    const minExposure = exposureData.minimum;
    const avgExposure = exposureData.average;
    const maxExposure = exposureData.maximum;
    
    console.log(`Calculated exposure values: min=${minExposure}, avg=${avgExposure}, max=${maxExposure}`);
    
    // Define key points for smooth curve
    const keyPoints = [
      0,
      minExposure * 0.25,
      minExposure * 0.5,
      minExposure,
      avgExposure,
      maxExposure,
      maxExposure * 1.5,
      maxExposure * 2.0
    ].sort((a, b) => a - b);
    
    // Generate more data points for smoother curve
    const additionalPoints = [];
    for (let i = 0; i < keyPoints.length - 1; i++) {
      const start = keyPoints[i];
      const end = keyPoints[i + 1];
      const step = (end - start) / 3; // Add 2 intermediate points
      for (let j = 1; j < 3; j++) {
        additionalPoints.push(start + (step * j));
      }
    }
    
    const allPoints = [...keyPoints, ...additionalPoints].sort((a, b) => a - b);
    
    // Generate curve data points
    for (const lossExposure of allPoints) {
      // Calculate probability using smooth exponential decay
      let probability;
      if (lossExposure <= 0) {
        probability = 100;
      } else {
        // Use exponential decay based on position relative to exposure ranges
        const normalizedPosition = lossExposure / maxExposure;
        probability = 100 * Math.exp(-normalizedPosition * 2.5); // Smooth exponential decay
        probability = Math.max(probability, 0.1); // Minimum 0.1%
        probability = Math.min(probability, 100); // Maximum 100%
      }
      
      // Calculate previous data if available
      let previousProbability = null;
      if (previousData) {
        const prevMaxExposure = previousData.maximum;
        if (lossExposure <= 0) {
          previousProbability = 100;
        } else {
          const prevNormalizedPosition = lossExposure / prevMaxExposure;
          previousProbability = 100 * Math.exp(-prevNormalizedPosition * 2.5);
          previousProbability = Math.max(previousProbability, 0.1);
          previousProbability = Math.min(previousProbability, 100);
        }
      }
      
      // Calculate tolerance probability
      let toleranceProbability;
      if (lossExposure <= toleranceThresholds.fullAcceptance) {
        toleranceProbability = 100;
      } else if (lossExposure <= toleranceThresholds.highAcceptance) {
        toleranceProbability = 75;
      } else if (lossExposure <= toleranceThresholds.mediumAcceptance) {
        toleranceProbability = 50;
      } else if (lossExposure <= toleranceThresholds.lowAcceptance) {
        toleranceProbability = 25;
      } else {
        toleranceProbability = 0;
      }
      
      // Calculate areas for red/green shading
      let redAreaTop = 0;
      let redAreaBottom = 0;
      let greenAreaTop = 0;
      let greenAreaBottom = 0;
      
      if (probability > toleranceProbability) {
        // Red area where probability exceeds tolerance
        redAreaTop = probability - toleranceProbability;
        redAreaBottom = 0;
      } else if (toleranceProbability > probability) {
        // Green area where tolerance exceeds probability
        greenAreaTop = toleranceProbability - probability;
        greenAreaBottom = 0;
      }
        
      data.push({
        lossExposure,
        probability,
        previousProbability,
        toleranceProbability,
        redAreaTop,
        redAreaBottom,
        greenAreaTop,
        greenAreaBottom,
        formattedLoss: formatExposure(lossExposure),
        isThresholdPoint: keyPoints.includes(lossExposure),
        exposureData: {
          minimum: minExposure,
          average: avgExposure,
          maximum: maxExposure
        }
      });
    }
    
    return data.sort((a, b) => a.lossExposure - b.lossExposure);
  }, [exposureData, previousData, toleranceThresholds, filteredRisks]);

  const formatExposure = useCallback((value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${Math.round(value)}`;
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Loss: ${data.formattedLoss}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(1)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getFilterDescription = () => {
    switch (filterType) {
      case 'entity': return 'Legal Entity';
      case 'asset': return 'Asset';
      case 'l1': return 'L1 Architecture';
      case 'l2': return 'L2 Architecture';
      case 'l3': return 'L3 Architecture';
      case 'l4': return 'L4 Architecture';
      default: return 'All Risks';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">
            Loss Exceedance Curve
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-history"
                checked={showHistory}
                onCheckedChange={setShowHistory}
                disabled={!previousData}
              />
              <Label htmlFor="show-history" className="text-sm text-gray-300">
                Previous Period
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-tolerance"
                checked={showTolerance}
                onCheckedChange={setShowTolerance}
              />
              <Label htmlFor="show-tolerance" className="text-sm text-gray-300">
                Risk Tolerance
              </Label>
            </div>
          </div>
        </div>
        
        {filterType !== 'all' && (
          <div className="text-sm text-gray-400 mt-2">
            Filtered by: {getFilterDescription()} ({filteredRisks.length} risks)
          </div>
        )}
      </CardHeader>
      
      <CardContent className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-[350px]"
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={chartData} 
                margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
              >
                <defs>
                  {/* Gradient for current line */}
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  
                  {/* Gradient for unacceptable risk area */}
                  <linearGradient id="riskAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.2} />
                  </linearGradient>
                  
                  {/* Gradient for acceptable risk area */}
                  <linearGradient id="acceptableAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid stroke="rgba(255,255,255,0.1)" />
                
                <XAxis 
                  dataKey="formattedLoss" 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                
                <YAxis 
                  tickFormatter={(v) => `${v}%`} 
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  domain={[0, 100]}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                {/* Red shaded area - where probability exceeds tolerance */}
                {chartData.length > 1 && showTolerance && (
                  <Area
                    dataKey="redAreaTop"
                    stroke="none"
                    fill="url(#riskAreaGradient)"
                    fillOpacity={0.7}
                    stackId="1"
                  />
                )}
                
                {/* Green shaded area - where tolerance exceeds probability */}
                {chartData.length > 1 && showTolerance && (
                  <Area
                    dataKey="greenAreaTop"
                    stroke="none"
                    fill="url(#acceptableAreaGradient)"
                    fillOpacity={0.6}
                    stackId="2"
                  />
                )}
                
                {/* Median line */}
                {chartData.length > 0 && (
                  <ReferenceLine 
                    y="50" 
                    stroke="rgba(255,255,255,0.4)" 
                    strokeDasharray="3 3" 
                    label={{
                      value: "50%",
                      position: "insideLeft",
                      fill: 'rgba(255,255,255,0.7)'
                    }}
                  />
                )}
                
                {/* Tolerance line */}
                {showTolerance && (
                  <Line 
                    type="natural"
                    dataKey="toleranceProbability"
                    name="Risk Tolerance"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1000}
                    isAnimationActive={true}
                  />
                )}
                
                {/* Previous line */}
                {showHistory && previousData && (
                  <Line 
                    type="natural"
                    dataKey="previousProbability"
                    name="Previous Loss Probability"
                    stroke="#facc15"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={false}
                    animationDuration={800}
                    isAnimationActive={true}
                  />
                )}
                
                {/* Current line */}
                <Line 
                  type="natural"
                  dataKey="probability"
                  name="Current Loss Probability"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                  animationDuration={1200}
                  isAnimationActive={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No data available for chart</p>
            </div>
          )}
        </motion.div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Current Loss Probability</span>
          </div>
          {showHistory && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Previous Loss Probability</span>
            </div>
          )}
          {showTolerance && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Risk Tolerance Profile</span>
            </div>
          )}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Acceptable Risk Area</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span className="text-gray-300">Unacceptable Risk Area</span>
          </div>
        </div>
        
        {/* Exposure summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Minimum Exposure</p>
            <p className="text-xl font-bold text-white">
              {filteredRisks && filteredRisks.length > 0 ? (
                formatExposure(
                  filteredRisks.reduce((sum, risk) => {
                    const riskValue = parseFloat(risk.residualRisk || risk.inherentRisk || '0');
                    return sum + riskValue * 0.4; // Minimum as 40% of risk value
                  }, 0) || 100000
                )
              ) : (
                formatExposure(100000)
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Current Exposure</p>
            <p className="text-xl font-bold text-blue-400">
              {filteredRisks && filteredRisks.length > 0 ? (
                formatExposure(
                  filteredRisks.reduce((sum, risk) => {
                    const riskValue = parseFloat(risk.residualRisk || risk.inherentRisk || '0');
                    return sum + riskValue; // Current is the average risk value
                  }, 0) || 1000000
                )
              ) : (
                formatExposure(1000000)
              )}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Maximum Exposure</p>
            <p className="text-xl font-bold text-white">
              {filteredRisks && filteredRisks.length > 0 ? (
                formatExposure(
                  filteredRisks.reduce((sum, risk) => {
                    const riskValue = parseFloat(risk.residualRisk || risk.inherentRisk || '0');
                    return sum + riskValue * 2.0; // Maximum as 200% of risk value
                  }, 0) || 10000000
                )
              ) : (
                formatExposure(10000000)
              )}
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}