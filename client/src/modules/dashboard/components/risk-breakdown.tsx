import { Card, CardContent } from "@/components/ui/card";

interface RiskBreakdownItem {
  count: number;
  percentage: number;
  color: string;
}

interface RiskBreakdownProps {
  title: string;
  items: {
    [key: string]: RiskBreakdownItem
  };
}

export function RiskBreakdown({ title, items }: RiskBreakdownProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
        <div className="space-y-3">
          {Object.entries(items).map(([key, item]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <div className="text-sm font-medium capitalize text-white">{key}</div>
                </div>
                <div className="text-sm text-white">
                  {item.count} ({Math.round(item.percentage)}%)
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}