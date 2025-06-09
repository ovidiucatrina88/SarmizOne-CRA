import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@shared/utils/calculations";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

interface RiskRankingTableProps {
  risks: any[];
  title?: string;
}

export function RiskRankingTable({ risks, title = "Risk Ranking by Percentile" }: RiskRankingTableProps) {
  // No risks to display
  if (!risks || risks.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No risk data available</p>
      </div>
    );
  }

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-800";
      case "high": return "bg-amber-100 text-amber-800 border-amber-800";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-800";
      case "low": return "bg-green-100 text-green-800 border-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get percentile color class
  const getPercentileColorClass = (percentile: number) => {
    if (percentile >= 90) return "text-red-600 font-bold";
    if (percentile >= 75) return "text-amber-600 font-semibold";
    if (percentile >= 50) return "text-yellow-600";
    if (percentile >= 25) return "text-blue-600";
    return "text-green-600";
  };

  // Get percentile icon
  const getPercentileIcon = (percentile: number) => {
    if (percentile >= 75) {
      return <AlertTriangle className="h-4 w-4 inline-block mr-1 text-red-600" />;
    } else if (percentile >= 50) {
      return <TrendingUp className="h-4 w-4 inline-block mr-1 text-amber-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 inline-block mr-1 text-green-600" />;
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="overflow-hidden overflow-x-auto rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-3">Rank</TableHead>
              <TableHead>Risk ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Associated Assets</TableHead>
              <TableHead className="text-right">Residual Risk</TableHead>
              <TableHead className="text-right">Percentile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk, index) => (
              <TableRow key={risk.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{risk.riskId}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={risk.name}>
                  {risk.name}
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(risk.severity)}>
                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={risk.associatedAssets?.join(', ')}>
                  {risk.associatedAssets?.length || 0} asset(s)
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(risk.residualRisk || 0)}
                </TableCell>
                <TableCell className="text-right">
                  <span className={getPercentileColorClass(risk.rankPercentile)}>
                    {getPercentileIcon(risk.rankPercentile)}
                    {risk.rankPercentile}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <p>
          <span className="text-red-600 font-bold mr-2">90-100%</span>
          High priority risks that need immediate attention
        </p>
        <p>
          <span className="text-green-600 mr-2">0-25%</span>
          Lower priority risks
        </p>
      </div>
    </div>
  );
}