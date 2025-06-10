import React from "@/common/react-import";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBackgroundColor: string;
  iconColor: string;
  changeValue?: string | number;
  changeType?: "increase" | "decrease";
  changeLabel?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBackgroundColor,
  iconColor,
  changeValue,
  changeType = "increase",
  changeLabel = "from last month",
}: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`relative p-3 rounded-xl ${iconBackgroundColor} shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h2>
              <p className="text-3xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{value}</p>
            </div>
          </div>
        </div>
        {changeValue !== undefined && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  changeType === "increase" 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  <span className="text-sm">
                    {changeType === "increase" ? "↗" : "↘"}
                  </span>
                  <span>{changeValue}</span>
                </div>
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
