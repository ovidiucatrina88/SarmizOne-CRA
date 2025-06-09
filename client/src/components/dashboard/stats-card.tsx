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
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${iconBackgroundColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-card-foreground/80">{title}</h2>
            <p className="text-2xl font-semibold text-card-foreground">{value}</p>
          </div>
        </div>
        {changeValue !== undefined && (
          <div className="mt-4">
            <span className={`text-xs font-medium ${
              changeType === "increase" ? "text-green-500" : "text-red-500"
            }`}>
              {changeType === "increase" ? "↑" : "↓"} {changeValue}{" "}
            </span>
            <span className="text-xs text-card-foreground/60">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
