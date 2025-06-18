import React from 'react';
import { Link } from 'wouter';
import { formatCurrency } from '@shared/utils/calculations';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface RiskResponseStatusProps {
  responseTypeData: {
    mitigate: { count: number; percentage: number };
    accept: { count: number; percentage: number };
    transfer: { count: number; percentage: number };
    avoid: { count: number; percentage: number };
  };
  riskReduction: {
    inherentRisk: number;
    residualRisk: number;
    reduction: number;
    reductionPercentage: number;
  };
}

interface TopRisksProps {
  risks: any[];
  maxItems?: number;
}

interface RiskOverviewCombinedProps extends RiskResponseStatusProps, TopRisksProps {}

export function RiskOverviewCombined({
  responseTypeData = {
    mitigate: { count: 0, percentage: 0 },
    accept: { count: 0, percentage: 0 },
    transfer: { count: 0, percentage: 0 },
    avoid: { count: 0, percentage: 0 }
  },
  riskReduction = {
    inherentRisk: 0,
    residualRisk: 0,
    reduction: 0,
    reductionPercentage: 0
  },
  risks = [],
  maxItems = 5
}: RiskOverviewCombinedProps) {
  
  // Get severity badge class for dark theme
  const getSeverityBadgeClass = (severity: string = "medium") => {
    switch (severity) {
      case "critical":
        return "bg-red-900/30 text-red-300";
      case "high":
        return "bg-amber-900/30 text-amber-300";
      case "medium":
        return "bg-yellow-900/30 text-yellow-300";
      case "low":
        return "bg-green-900/30 text-green-300";
      default:
        return "bg-gray-800/30 text-gray-300";
    }
  };

  // Get category badge class for dark theme
  const getCategoryBadgeClass = (category: string = "operational") => {
    switch (category) {
      case "operational":
        return "bg-blue-900/30 text-blue-300";
      case "strategic":
        return "bg-indigo-900/30 text-indigo-300";
      case "compliance":
        return "bg-purple-900/30 text-purple-300";
      case "financial":
        return "bg-teal-900/30 text-teal-300";
      default:
        return "bg-gray-800/30 text-gray-300";
    }
  };

  // Prepare pie chart data
  const pieChartData = {
    labels: ['Mitigate', 'Accept', 'Transfer', 'Avoid'],
    datasets: [
      {
        data: [
          responseTypeData.mitigate.percentage || 0,
          responseTypeData.accept.percentage || 0,
          responseTypeData.transfer.percentage || 0,
          responseTypeData.avoid.percentage || 0,
        ],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)', // Blue for Mitigate
          'rgba(245, 158, 11, 0.8)', // Amber for Accept
          'rgba(147, 51, 234, 0.8)', // Purple for Transfer
          'rgba(220, 38, 38, 0.8)',  // Red for Avoid
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(220, 38, 38, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const count = responseTypeData[label.toLowerCase() as keyof typeof responseTypeData]?.count || 0;
            return `${label}: ${count} (${value.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <h2 className="mb-6 text-lg font-semibold text-white">Risk Overview & Response Status</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Risks Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-white">Top Risks</h3>
              <Link href="/risks" className="text-sm font-medium text-blue-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {risks.slice(0, maxItems).map((risk, index) => (
                <div key={risk.id || index} className="px-3 py-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20">
                          <span className="text-xs font-medium leading-none text-blue-400">{index + 1}</span>
                        </span>
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">{risk.name}</p>
                        <div className="flex mt-1 space-x-1">
                          {risk.severity && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getSeverityBadgeClass(risk.severity)}`}>
                              {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                            </span>
                          )}
                          {risk.riskCategory && (
                            <span className={`inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded ${getCategoryBadgeClass(risk.riskCategory)}`}>
                              {risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-sm font-medium text-white">{formatCurrency(parseFloat(risk.residualRisk) || 0)}</span>
                      <span className="text-xs text-gray-400">Expected Loss</span>
                    </div>
                  </div>
                </div>
              ))}

              {(!risks || risks.length === 0) && (
                <div className="px-3 py-6 text-center text-gray-400 bg-gray-700/50 rounded-lg">
                  No risks found
                </div>
              )}
            </div>
          </div>

          {/* Risk Response Status Section */}
          <div>
            <h3 className="text-base font-medium text-white mb-4">Response Status</h3>
            
            <div className="space-y-4">
              {/* Response Types - Pie Chart */}
              <div>
                <div className="text-sm font-medium text-white/80 mb-3">By Response Type</div>
                <div className="h-48 mb-4">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
                
                {/* Summary stats below the chart */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                      <span className="text-white/80">Mitigate</span>
                    </div>
                    <span className="text-white font-medium">{responseTypeData.mitigate.count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                      <span className="text-white/80">Accept</span>
                    </div>
                    <span className="text-white font-medium">{responseTypeData.accept.count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                      <span className="text-white/80">Transfer</span>
                    </div>
                    <span className="text-white font-medium">{responseTypeData.transfer.count}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                      <span className="text-white/80">Avoid</span>
                    </div>
                    <span className="text-white font-medium">{responseTypeData.avoid.count}</span>
                  </div>
                </div>
              </div>

              {/* Risk Reduction */}
              <div>
                <div className="text-sm font-medium text-white/80 mb-3">Risk Reduction</div>
                <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-white/70">Inherent Risk:</div>
                      <div className="font-medium text-white">{formatCurrency(Number(riskReduction.inherentRisk) || 0)}</div>
                    </div>
                    <div>
                      <div className="text-white/70">Residual Risk:</div>
                      <div className="font-medium text-white">{formatCurrency(Number(riskReduction.residualRisk) || 0)}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-white/70">Risk Reduction:</div>
                      <div className="text-xs font-medium text-green-500">
                        {formatCurrency(Number(riskReduction.reduction) || 0)} ({(Number(riskReduction.reductionPercentage) || 0).toFixed(0)}%)
                      </div>
                    </div>
                    <div className="w-full h-3 mb-1 bg-gray-600 rounded-full">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-red-500/80 via-amber-500/80 to-green-500/80"
                        style={{ width: `${Math.min(riskReduction.reductionPercentage || 0, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <div>0%</div>
                      <div>50%</div>
                      <div>100%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}