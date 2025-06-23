import React from "react";
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
      type: 'all',
      category: 'all',
      status: 'all',
      framework: 'all'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search controls..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-8 bg-gray-600 border-gray-500 text-white placeholder-gray-400"
          />
        </div>

        <Select
          value={filters.type}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, type: value })
          }
        >
          <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-500">
            <SelectItem value="all" className="text-white hover:bg-gray-600">All Types</SelectItem>
            <SelectItem value="preventive" className="text-white hover:bg-gray-600">Preventive</SelectItem>
            <SelectItem value="detective" className="text-white hover:bg-gray-600">Detective</SelectItem>
            <SelectItem value="corrective" className="text-white hover:bg-gray-600">Corrective</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, category: value })
          }
        >
          <SelectTrigger className="w-36 bg-gray-600 border-gray-500 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-500">
            <SelectItem value="all" className="text-white hover:bg-gray-600">All Categories</SelectItem>
            <SelectItem value="technical" className="text-white hover:bg-gray-600">Technical</SelectItem>
            <SelectItem value="administrative" className="text-white hover:bg-gray-600">Administrative</SelectItem>
            <SelectItem value="physical" className="text-white hover:bg-gray-600">Physical</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-500">
            <SelectItem value="all" className="text-white hover:bg-gray-600">All Statuses</SelectItem>
            <SelectItem value="implemented" className="text-white hover:bg-gray-600">Implemented</SelectItem>
            <SelectItem value="in_progress" className="text-white hover:bg-gray-600">In Progress</SelectItem>
            <SelectItem value="planned" className="text-white hover:bg-gray-600">Planned</SelectItem>
            <SelectItem value="not_implemented" className="text-white hover:bg-gray-600">Not Implemented</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.framework}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, framework: value })
          }
        >
          <SelectTrigger className="w-36 bg-gray-600 border-gray-500 text-white">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-500">
            <SelectItem value="all" className="text-white hover:bg-gray-600">All Frameworks</SelectItem>
            <SelectItem value="nist" className="text-white hover:bg-gray-600">NIST</SelectItem>
            <SelectItem value="iso" className="text-white hover:bg-gray-600">ISO 27001</SelectItem>
            <SelectItem value="cis" className="text-white hover:bg-gray-600">CIS Controls</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}