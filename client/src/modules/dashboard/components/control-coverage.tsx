// Card components removed - using dark container styling
import { Progress } from "@/components/ui/progress";

interface ControlCoverageItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface ControlCoverageProps {
  title: string;
  data: Record<string, { count: number; percentage: number; color: string }>;
}

export function ControlCoverage({ title, data }: ControlCoverageProps) {
  // Convert data object to array for mapping
  const items = Object.entries(data).map(([name, { count, percentage, color }]) => ({
    name,
    count,
    percentage,
    color,
  }));

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm">
                <div className="capitalize text-white/80">{item.name}</div>
                <div className="font-medium text-white">
                  {item.count} ({item.percentage.toFixed(0)}%)
                </div>
              </div>
              <div className="w-full h-2 mt-1 bg-gray-600 rounded-full">
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
