import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";

export interface ControlFilters {
  search: string;
  type: string;
  category: string;
  status: string;
  framework: string;
}

interface ControlFiltersProps {
  filters: ControlFilters;
  onFiltersChange: (filters: ControlFilters) => void;
  controlCounts?: {
    total: number;
    filtered: number;
  };
}

export function ControlFiltersComponent({
  filters,
  onFiltersChange,
  controlCounts,
}: ControlFiltersProps) {
  const hasActiveFilters = 
    filters.search ||
    filters.type ||
    filters.category ||
    filters.status ||
    filters.framework;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: '',
      category: '',
      status: '',
      framework: ''
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search controls..."
                value={filters.search}
                onChange={(e) =>
                  onFiltersChange({ ...filters, search: e.target.value })
                }
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="preventive">Preventive</SelectItem>
                <SelectItem value="detective">Detective</SelectItem>
                <SelectItem value="corrective">Corrective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="fully_implemented">Fully Implemented</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="not_implemented">Not Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Framework</Label>
            <Select
              value={filters.framework}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, framework: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Frameworks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Frameworks</SelectItem>
                <SelectItem value="ISO27001">ISO 27001</SelectItem>
                <SelectItem value="NIST">NIST</SelectItem>
                <SelectItem value="SOC2">SOC 2</SelectItem>
                <SelectItem value="CIS">CIS Controls</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
            {controlCounts && (
              <span className="text-sm text-muted-foreground">
                Showing {controlCounts.filtered} of {controlCounts.total} controls
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}