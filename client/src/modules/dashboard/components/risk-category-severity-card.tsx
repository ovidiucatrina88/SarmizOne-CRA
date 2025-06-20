import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface RiskCategorySeverityCardProps {
  riskByCategory: {
    operational: number;
    strategic: number;
    compliance: number;
    financial: number;
  };
  riskBySeverity: {
    critical: { count: number; percentage: number; color: string };
    high: { count: number; percentage: number; color: string };
    medium: { count: number; percentage: number; color: string };
    low: { count: number; percentage: number; color: string };
  };
}

const CATEGORY_COLORS = {
  operational: "#3b82f6", // blue
  strategic: "#10b981", // emerald
  compliance: "#f59e0b", // amber
  financial: "#ef4444", // red
};

const SEVERITY_COLORS = {
  critical: "#dc2626", // red-600
  high: "#f59e0b", // amber-500
  medium: "#eab308", // yellow-400
  low: "#22c55e", // green-500
};

export function RiskCategorySeverityCard({ riskByCategory, riskBySeverity }: RiskCategorySeverityCardProps) {
  // Prepare category data for pie chart
  const categoryData = Object.entries(riskByCategory)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
    }));

  // Prepare severity data for bar chart
  const severityData = Object.entries(riskBySeverity)
    .map(([severity, data]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count: data.count,
      color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS],
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.payload.name || data.payload.severity}</p>
          <p className="text-sm text-muted-foreground">
            Count: <span className="font-medium text-foreground">{data.value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <ul className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 shadow-lg rounded-xl border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <CardHeader className="relative bg-gradient-to-r from-muted/50 to-muted/20 pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/20" />
          </div>
          Risk Distribution Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk by Category - Pie Chart */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-foreground">Risk by Category</h3>
            {categoryData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No category data available</p>
              </div>
            )}
          </div>

          {/* Risk by Severity - Bar Chart */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-foreground">Risk by Severity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="severity" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    radius={[4, 4, 0, 0]}
                    fill={(entry: any) => entry.color}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(riskByCategory).map(([category, count]) => (
              <div key={category} className="text-center">
                <div className="text-lg font-semibold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}