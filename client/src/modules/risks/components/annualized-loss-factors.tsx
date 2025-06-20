import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { InfoIcon } from "lucide-react";

interface AnnualizedLossFactorsProps {
  aleFactor: number;
  aleValue: number;
  aleCurrency?: string;
}

export function AnnualizedLossFactors({
  aleFactor,
  aleValue,
  aleCurrency = "USD",
}: AnnualizedLossFactorsProps) {
  // Format the ALE based on currency
  const formattedALE = formatCurrency(aleValue);
  
  // Calculate the risk level based on ALE factor
  const getRiskLevel = (factor: number) => {
    if (factor >= 0.7) return { level: "High", color: "destructive" };
    if (factor >= 0.4) return { level: "Medium", color: "warning" };
    return { level: "Low", color: "secondary" };
  };
  
  const riskLevel = getRiskLevel(aleFactor);
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1">
        <span className="text-sm font-medium">{formattedALE}</span>
        <div className="flex items-center">
          <Badge variant={riskLevel.color as any} className="mr-1">
            {riskLevel.level}
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Annualized Loss Expectancy is calculated based on the
                  threat frequency and impact magnitude using FAIR principles.
                  <br />
                  <br />
                  Risk factor: {(aleFactor * 100).toFixed(1)}%
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}