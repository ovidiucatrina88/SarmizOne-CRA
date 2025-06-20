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
    <div className="flex border rounded-lg overflow-hidden">
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        className="rounded-none border-0"
        onClick={() => onViewModeChange('list')}
      >
        <List className="w-4 h-4 mr-2" />
        List View
      </Button>
      <Button
        variant={viewMode === 'cards' ? 'default' : 'outline'}
        size="sm"
        className="rounded-none border-0 border-l"
        onClick={() => onViewModeChange('cards')}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Card View
      </Button>
      <Button
        variant={viewMode === 'risk' ? 'default' : 'outline'}
        size="sm"
        className="rounded-none border-0 border-l"
        onClick={() => onViewModeChange('risk')}
      >
        <ShieldCheck className="w-4 h-4 mr-2" />
        Risk View
      </Button>
      <Button
        variant={viewMode === 'framework' ? 'default' : 'outline'}
        size="sm"
        className="rounded-none border-0 border-l"
        onClick={() => onViewModeChange('framework')}
      >
        <Shield className="w-4 h-4 mr-2" />
        Framework View
      </Button>
    </div>
  );
}