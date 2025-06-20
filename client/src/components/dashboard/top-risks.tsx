import React from "react";
import { Link } from "wouter";
// Card components removed - using dark container styling
import { formatCurrency } from "@/lib/utils";

interface TopRisksProps {
  risks: any[];
  maxItems?: number;
}

export function TopRisks({ risks = [], maxItems = 5 }: TopRisksProps) {
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

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Top Risks</h2>
          <Link href="/risks" className="text-sm font-medium text-blue-400 hover:underline">
            View all
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg divide-y divide-gray-600">
          {risks.slice(0, maxItems).map((risk, index) => (
            <div key={risk.id || index} className="px-4 py-4 sm:px-6 bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20">
                      <span className="text-sm font-medium leading-none text-blue-400">{index + 1}</span>
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-white">{risk.name}</h3>
                    <div className="flex mt-1">
                      {risk.severity && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSeverityBadgeClass(risk.severity)}`}>
                          {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                        </span>
                      )}
                      {risk.riskCategory && (
                        <span className={`inline-flex items-center px-2 py-0.5 ml-2 text-xs font-medium rounded ${getCategoryBadgeClass(risk.riskCategory)}`}>
                          {risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-white">{formatCurrency(risk.residualRisk || 0)}</span>
                  <span className="text-xs text-gray-400">Expected Loss</span>
                </div>
              </div>
            </div>
          ))}

          {(!risks || risks.length === 0) && (
            <div className="px-4 py-4 sm:px-6 text-center text-gray-400">
              No risks found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
