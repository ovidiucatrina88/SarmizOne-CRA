import { ControlROIAnalysis } from "@/components/controls/control-roi-analysis";

export default function ControlROIPage() {
  return (
    <Layout
      pageTitle="Control Return on Investment"
      pageIcon="ROI"
      pageDescription="Analyze the effectiveness and financial impact of security controls to optimize your cybersecurity investment strategy."
    >
      <ControlROIAnalysis />
    
  );
}