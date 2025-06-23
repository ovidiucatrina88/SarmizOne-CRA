import React from "react";
import { Button } from "@/components/ui/button";
import { List, Grid3X3, Shield, ShieldCheck } from "lucide-react";

export type ControlViewMode = 'list' | 'cards' | 'framework' | 'risk';

interface ControlViewToggleProps {
  viewMode: ControlViewMode;
  onViewModeChange: (mode: ControlViewMode) => void;
}

export function ControlViewToggle({ viewMode, onViewModeChange }: ControlViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-600 rounded-lg p-1">
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`h-8 px-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-500'}`}
      >
        <List className="w-4 h-4 mr-1" />
        List
      </Button>
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('cards')}
        className={`h-8 px-3 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-500'}`}
      >
        <Grid3X3 className="w-4 h-4 mr-1" />
        Cards
      </Button>
      <Button
        variant={viewMode === 'risk' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('risk')}
        className={`h-8 px-3 ${viewMode === 'risk' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-500'}`}
      >
        <ShieldCheck className="w-4 h-4 mr-1" />
        Risk Groups
      </Button>
      <Button
        variant={viewMode === 'framework' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('framework')}
        className={`h-8 px-3 ${viewMode === 'framework' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-500'}`}
      >
        <Shield className="w-4 h-4 mr-1" />
        Framework
      </Button>
    </div>
  );
}