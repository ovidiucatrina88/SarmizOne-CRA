import { CostModuleList } from "@/components/cost-modules/cost-module-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function CostModulesPage() {
  const pageActions = (
    <Button asChild variant="outline">
      <Link href="/dashboard">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
    </Button>
  );

  return (
    <Layout
      pageTitle="Cost Modules"
      pageIcon="CST"
      pageDescription="Manage cost factors related to CIS controls for ROI calculations"
      pageActions={pageActions}
    >
      <CostModuleList />
      
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">About Cost Modules</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Cost modules help map CIS controls to specific financial impacts, enabling more accurate ROI calculations
          for security investments. Each module defines a cost factor that is applied when calculating the financial
          impact of risks and controls.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Fixed Cost</h4>
            <p className="text-xs text-muted-foreground">
              A one-time cost that applies regardless of the impact size (e.g., Incident Response Team cost).
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Per Event Cost</h4>
            <p className="text-xs text-muted-foreground">
              A cost that applies per occurrence of an event (e.g., Breach Notification cost per affected record).
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Per Hour Cost</h4>
            <p className="text-xs text-muted-foreground">
              A cost that applies hourly (e.g., Legal Consultation fees charged per hour).
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium text-sm mb-1">Percentage of Loss</h4>
            <p className="text-xs text-muted-foreground">
              A cost represented as a percentage of total loss (e.g., Regulatory Fines as percentage of total impact).
            </p>
          </div>
        </div>
      </div>
    
  );
}