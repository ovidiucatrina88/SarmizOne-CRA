// Card components removed - using dark container styling
import { Progress } from "@/components/ui/progress";

interface RiskResponseStatusProps {
  responseTypeData?: {
    mitigate: { count: number; percentage: number };
    accept: { count: number; percentage: number };
    transfer: { count: number; percentage: number };
    avoid: { count: number; percentage: number };
  };
  riskReduction?: {
    inherentRisk: number;
    residualRisk: number;
    reduction: number;
    reductionPercentage: number;
  };
}

export function RiskResponseStatus({
  responseTypeData = {
    mitigate: { count: 28, percentage: 65 },
    accept: { count: 8, percentage: 19 },
    transfer: { count: 5, percentage: 12 },
    avoid: { count: 2, percentage: 4 }
  },
  riskReduction = {
    inherentRisk: 181500000,
    residualRisk: 106000000,
    reduction: 75500000,
    reductionPercentage: 41.6
  }
}: RiskResponseStatusProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Risk Response Status</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white/80">By Response Type</div>
            </div>
            <div className="mt-2 space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/80">Mitigate</div>
                  <div className="font-medium text-white">
                    {responseTypeData.mitigate.count} ({responseTypeData.mitigate.percentage.toFixed(0)}%)
                  </div>
                </div>
                <div className="w-full h-2 mt-1 bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-blue-600/80 rounded-full"
                    style={{ width: `${responseTypeData.mitigate.percentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/80">Accept</div>
                  <div className="font-medium text-white">
                    {responseTypeData.accept.count} ({responseTypeData.accept.percentage.toFixed(0)}%)
                  </div>
                </div>
                <div className="w-full h-2 mt-1 bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-amber-500/80 rounded-full"
                    style={{ width: `${responseTypeData.accept.percentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/80">Transfer</div>
                  <div className="font-medium text-white">
                    {responseTypeData.transfer.count} ({responseTypeData.transfer.percentage.toFixed(0)}%)
                  </div>
                </div>
                <div className="w-full h-2 mt-1 bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-purple-600/80 rounded-full"
                    style={{ width: `${responseTypeData.transfer.percentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/80">Avoid</div>
                  <div className="font-medium text-white">
                    {responseTypeData.avoid.count} ({responseTypeData.avoid.percentage.toFixed(0)}%)
                  </div>
                </div>
                <div className="w-full h-2 mt-1 bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-red-600/80 rounded-full"
                    style={{ width: `${responseTypeData.avoid.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-white/80">Risk Reduction</div>
            </div>
            <div className="p-4 mt-2 bg-gray-700/50 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white/70">Inherent Risk:</div>
                <div className="text-sm font-medium text-white">
                  {formatCurrency(riskReduction.inherentRisk)}
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white/70">Residual Risk:</div>
                <div className="text-sm font-medium text-white">
                  {formatCurrency(riskReduction.residualRisk)}
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-white/70">Risk Reduction:</div>
                <div className="text-sm font-medium text-green-500">
                  {formatCurrency(riskReduction.reduction)} ({riskReduction.reductionPercentage.toFixed(0)}%)
                </div>
              </div>
              <div className="w-full h-4 mb-2 bg-gray-600 rounded-full">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-red-500/80 via-amber-500/80 to-green-500/80"
                  style={{ width: `${riskReduction.reductionPercentage}%` }}
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
  );
}
