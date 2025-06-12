import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface RiskFilters {
  asset: string;
  severity: string;
  category: string;
}

interface RiskFiltersProps {
  filters: RiskFilters;
  onFiltersChange: (filters: RiskFilters) => void;
  availableAssets: Array<{ assetId: string; name: string }>;
  riskCounts?: {
    total: number;
    filtered: number;
  };
}

export function RiskFiltersComponent({ 
  filters, 
  onFiltersChange, 
  availableAssets,
  riskCounts
}: RiskFiltersProps) {
  const handleFilterChange = (key: keyof RiskFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      asset: '',
      severity: '',
      category: ''
    });
  };

  const hasActiveFilters = filters.asset || filters.severity || filters.category;
  const activeFilterCount = [filters.asset, filters.severity, filters.category].filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Filters</h3>
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Asset Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Asset</label>
              <Select
                value={filters.asset || 'all'}
                onValueChange={(value) => handleFilterChange('asset', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Assets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.assetId} value={asset.assetId}>
                      {asset.name} ({asset.assetId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Severity</label>
              <Select
                value={filters.severity || 'all'}
                onValueChange={(value) => handleFilterChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Critical
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          {riskCounts && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">
                Showing {riskCounts.filtered} of {riskCounts.total} risks
              </span>
              {hasActiveFilters && riskCounts.filtered !== riskCounts.total && (
                <Badge variant="outline" className="text-xs">
                  {riskCounts.total - riskCounts.filtered} hidden
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}