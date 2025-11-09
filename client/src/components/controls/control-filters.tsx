import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";

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

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "preventive", label: "Preventive" },
  { value: "detective", label: "Detective" },
  { value: "corrective", label: "Corrective" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "technical", label: "Technical" },
  { value: "administrative", label: "Administrative" },
  { value: "physical", label: "Physical" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "fully_implemented", label: "Fully Implemented" },
  { value: "in_progress", label: "In Progress" },
  { value: "planned", label: "Planned" },
  { value: "not_implemented", label: "Not Implemented" },
];

const frameworkOptions = [
  { value: "all", label: "All Frameworks" },
  { value: "nist", label: "NIST CSF" },
  { value: "iso", label: "ISO 27001" },
  { value: "cis", label: "CIS Controls" },
  { value: "soc2", label: "SOC 2" },
];

export function ControlFiltersComponent({ filters, onFiltersChange, controlCounts }: ControlFiltersProps) {
  const hasActiveFilters =
    !!filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.framework !== "all";

  const badgeMap: Array<{ key: keyof ControlFilters; label: string }> = [
    { key: "type", label: "Type" },
    { key: "category", label: "Category" },
    { key: "status", label: "Status" },
    { key: "framework", label: "Framework" },
  ];

  const handleFilterChange = (key: keyof ControlFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "all",
      category: "all",
      status: "all",
      framework: "all",
    });
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 shadow-[0_0_120px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-white/60">
            <Filter className="h-4 w-4 text-primary" />
            Control filters
          </div>
          <p className="text-lg font-semibold text-white">
            Refine by capability, owner, or framework coverage
          </p>
        </div>
        {controlCounts && (
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            Showing {controlCounts.filtered.toLocaleString()} of {controlCounts.total.toLocaleString()} controls
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/70">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={filters.search}
              onChange={(event) => handleFilterChange("search", event.target.value)}
              placeholder="Search by name, ID, or description"
              className="h-11 border-white/10 bg-white/5 pl-9 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        {[typeOptions, categoryOptions, statusOptions, frameworkOptions].map((options, index) => {
          const keys: Array<keyof ControlFilters> = ["type", "category", "status", "framework"];
          const labels = ["Type", "Category", "Status", "Framework"];
          const key = keys[index];
          return (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-white/70">{labels[index]}</label>
              <Select value={filters[key]} onValueChange={(value) => handleFilterChange(key, value)}>
                <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder={labels[index]} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-slate-900/95 text-white">
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-[24px] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          {!hasActiveFilters && <span>No filters applied</span>}
          {filters.search && <Badge variant="secondary" className="rounded-full border-white/10 bg-white/10 text-xs text-white">Search: “{filters.search}”</Badge>}
          {badgeMap.map(({ key, label }) => {
            const value = filters[key];
            if (value === "all" || value === "") return null;
            return (
              <Badge key={key} variant="secondary" className="rounded-full border-white/10 bg-white/10 text-xs text-white">
                {label}: {value.replace(/_/g, " ")}
              </Badge>
            );
          })}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <X className="mr-2 h-4 w-4" />
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );
}
