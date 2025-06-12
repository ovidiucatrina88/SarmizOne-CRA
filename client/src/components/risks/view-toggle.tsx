import React from "react";
import { Button } from "@/components/ui/button";
import { List, Building2 } from "lucide-react";

interface ViewToggleProps {
  currentView: 'list' | 'grouped';
  onViewChange: (view: 'list' | 'grouped') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
      <Button
        variant={currentView === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="h-8 px-3"
      >
        <List className="w-4 h-4 mr-2" />
        List View
      </Button>
      <Button
        variant={currentView === 'grouped' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grouped')}
        className="h-8 px-3"
      >
        <Building2 className="w-4 h-4 mr-2" />
        Asset Groups
      </Button>
    </div>
  );
}