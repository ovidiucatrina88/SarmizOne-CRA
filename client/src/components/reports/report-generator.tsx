import React, { useState } from "react";
import { Asset, Risk, Control, RiskResponse } from "@shared/schema";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heatmap } from "@/components/ui/heatmap";

interface ReportGeneratorProps {
  type: "summary" | "risks" | "assets" | "controls" | "responses";
  data: any;
}

export function ReportGenerator({ type, data }: ReportGeneratorProps) {
  const [summaryTab, setSummaryTab] = useState("overview");

  // Calculate control effectiveness metrics
  const getControlEffectiveness = () => {
    // Check if we have controls data
    if (!data.controls || !Array.isArray(data.controls) || data.controls.length === 0) {
      // Return default values if no controls
      return {
        eAvoid: 0.25,
        eDeter: 0.25,
        eDetect: 0.25,
        eResist: 0.25
      };
    }

    // Count fully implemented and in-progress controls
    const fullyImplemented = data.controls.filter(
      c => c.implementationStatus === "fully_implemented" || c.implementationStatus === "Fully Implemented"
    );

    const inProgress = data.controls.filter(
      c => c.implementationStatus === "in_progress" || c.implementationStatus === "In Progress"
    );

    // Initialize effectiveness values
    let effectiveness = {
      eAvoid: 0.05,
      eDeter: 0.05,
      eDetect: 0.05,
      eResist: 0.05
    };

    // Apply a weighted factor for in-progress controls (50% effectiveness)
    const inProgressFactor = 0.5;

    // Track counts for averaging
    let avoidCount = 0;
    let deterCount = 0;
    let resistCount = 0;
    let detectCount = 0;

    // Process fully implemented controls
    for (const control of fullyImplemented) {
      // Convert from 0-10 scale to 0-1 scale
      const effectivenessValue = control.controlEffectiveness ? control.controlEffectiveness / 10 : 0.5;

      // Apply effectiveness based on control type
      if (control.controlType === "preventive") {
        effectiveness.eAvoid += effectivenessValue * 0.5;
        effectiveness.eDeter += effectivenessValue * 0.5;
        avoidCount++;
        deterCount++;
      } else if (control.controlType === "detective") {
        effectiveness.eDetect += effectivenessValue;
        detectCount++;
      } else if (control.controlType === "corrective") {
        effectiveness.eResist += effectivenessValue;
        resistCount++;
      }
    }

    // Process in-progress controls at 50% effectiveness
    for (const control of inProgress) {
      // Convert from 0-10 scale to 0-1 scale and apply progress factor
      const effectivenessValue = control.controlEffectiveness ?
        (control.controlEffectiveness / 10) * inProgressFactor :
        0.25;

      // Apply effectiveness based on control type
      if (control.controlType === "preventive") {
        effectiveness.eAvoid += effectivenessValue * 0.5;
        effectiveness.eDeter += effectivenessValue * 0.5;
        avoidCount++;
        deterCount++;
      } else if (control.controlType === "detective") {
        effectiveness.eDetect += effectivenessValue;
        detectCount++;
      } else if (control.controlType === "corrective") {
        effectiveness.eResist += effectivenessValue;
        resistCount++;
      }
    }

    // Calculate averages
    if (avoidCount > 0) effectiveness.eAvoid /= avoidCount;
    if (deterCount > 0) effectiveness.eDeter /= deterCount;
    if (resistCount > 0) effectiveness.eResist /= resistCount;
    if (detectCount > 0) effectiveness.eDetect /= detectCount;

    // Cap effectiveness values at 0.95 (95%)
    effectiveness.eAvoid = Math.min(effectiveness.eAvoid, 0.95);
    effectiveness.eDeter = Math.min(effectiveness.eDeter, 0.95);
    effectiveness.eResist = Math.min(effectiveness.eResist, 0.95);
    effectiveness.eDetect = Math.min(effectiveness.eDetect, 0.95);

    // If we have at least one control, ensure minimum effectiveness of 0.1 (10%)
    if (fullyImplemented.length > 0 || inProgress.length > 0) {
      effectiveness.eAvoid = Math.max(effectiveness.eAvoid, 0.1);
      effectiveness.eDeter = Math.max(effectiveness.eDeter, 0.1);
      effectiveness.eResist = Math.max(effectiveness.eResist, 0.1);
      effectiveness.eDetect = Math.max(effectiveness.eDetect, 0.1);
    }

    return effectiveness;
  };

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-amber-100 text-amber-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get control type badge color
  const getControlTypeColor = (controlType: string) => {
    switch (controlType) {
      case "preventive": return "bg-green-100 text-green-800";
      case "detective": return "bg-blue-100 text-blue-800";
      case "corrective": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get response type badge color
  const getResponseTypeColor = (responseType: string) => {
    switch (responseType) {
      case "mitigate": return "bg-blue-100 text-blue-800";
      case "transfer": return "bg-purple-100 text-purple-800";
      case "avoid": return "bg-red-100 text-red-800";
      case "accept": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format implementation status for display
  const formatImplementationStatus = (status: string) => {
    switch (status) {
      case "fully_implemented": return "Fully Implemented";
      case "in_progress": return "In Progress";
      case "not_implemented": return "Not Implemented";
      default: return status;
    }
  };

  // Get risk name from risk ID
  const getRiskName = (riskId: string) => {
    if (!data.risks || !Array.isArray(data.risks)) return "Unknown Risk";
    const risk = data.risks.find((r: Risk) => r.riskId === riskId);
    return risk ? risk.name : "Unknown Risk";
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render Summary Report
  const renderSummaryReport = () => {
    const { assets, risks, controls, responses, summary, dashboard } = data;

    // Ensure dashboard data is properly parsed for numeric display
    const totalInherentRisk = dashboard?.riskSummary?.totalInherentRisk ?
      parseFloat(dashboard.riskSummary.totalInherentRisk) : 0;

    const totalResidualRisk = dashboard?.riskSummary?.totalResidualRisk ?
      parseFloat(dashboard.riskSummary.totalResidualRisk) : 0;

    const riskReduction = dashboard?.riskSummary?.riskReduction ?
      parseFloat(dashboard.riskSummary.riskReduction) : 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-between pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold">Cybersecurity Risk Assessment Report</h1>
            <p className="text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">RiskQuantify</p>
            <p className="text-sm text-gray-500">FAIR-U Methodology</p>
          </div>
        </div>

        <Tabs value={summaryTab} onValueChange={setSummaryTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="control-effectiveness">Control Effectiveness</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    This report provides an assessment of the organization's cybersecurity risk posture
                    using FAIR-U quantitative risk analysis methodology.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Assets:</span>
                      <span>{summary?.data?.assetSummary?.totalAssets || assets?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Identified Risks:</span>
                      <span>{summary?.data?.riskSummary?.totalRisks || risks?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Implemented Controls:</span>
                      <span>{summary?.data?.controlSummary?.implementedControls || (Array.isArray(controls) ? controls.filter((c: Control) => c.implementationStatus === "fully_implemented").length : 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Risk Exposure:</span>
                      <span className="font-bold">{formatCurrency(summary?.data?.riskSummary?.totalResidualRisk || summary?.riskSummary?.totalResidualRisk || 0, 'USD')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Key Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Inherent Risk:</span>
                        <span className="text-sm font-medium">{formatCurrency(summary?.data?.riskSummary?.totalInherentRisk || summary?.riskSummary?.totalInherentRisk || 0, 'USD')}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Residual Risk:</span>
                        <span className="text-sm font-medium">{formatCurrency(summary?.data?.riskSummary?.totalResidualRisk || summary?.riskSummary?.totalResidualRisk || 0, 'USD')}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Risk Reduction:</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency((summary?.data?.riskSummary?.totalInherentRisk || summary?.riskSummary?.totalInherentRisk || 0) - (summary?.data?.riskSummary?.totalResidualRisk || summary?.riskSummary?.totalResidualRisk || 0), 'USD')}
                          ({(summary?.data?.riskSummary?.riskReduction || summary?.riskSummary?.riskReduction || 0).toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={summary?.data?.riskSummary?.riskReduction || summary?.riskSummary?.riskReduction || 0} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <span className="text-sm font-medium">Critical Risks:</span>
                        <p className="font-bold text-xl text-red-600">{summary?.data?.riskSummary?.criticalRisks || summary?.riskSummary?.criticalRisks || 0}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">High Risks:</span>
                        <p className="font-bold text-xl text-amber-600">{summary?.data?.riskSummary?.highRisks || summary?.riskSummary?.highRisks || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {summary?.heatmap && (
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Heatmap</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Heatmap
                    data={summary.heatmap}
                    width={600}
                    height={400}
                    title="Risk Distribution - Loss Event Frequency vs Probable Loss Magnitude"
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="risk-analysis" className="pt-4">
            <GlowCard className="space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">Risk Analysis</p>
                  <p className="text-lg font-semibold text-white">Top Risks by Expected Loss</p>
                </div>
              </div>
              {(Array.isArray(risks) && risks.length > 0) ? (
                <div className="overflow-hidden rounded-[28px] border border-white/10">
                  <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                    Top Risks
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="text-xs uppercase tracking-wide text-white/50">
                        <TableRow className="border-b border-white/5">
                          <TableHead>Risk ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Inherent Risk</TableHead>
                          <TableHead>Residual Risk</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(risks) ?
                          [...risks]
                            // Sort by residual risk (highest first)
                            .sort((a, b) => {
                              const valA = parseFloat(a.residualRisk);
                              const valB = parseFloat(b.residualRisk);
                              return (isNaN(valB) ? 0 : valB) - (isNaN(valA) ? 0 : valA);
                            })
                            // Take top 5 risks
                            .slice(0, 5)
                            .map((risk: Risk) => (
                              <TableRow key={risk.id} className="border-b border-white/5">
                                <TableCell className="font-medium text-white">{risk.riskId}</TableCell>
                                <TableCell className="text-white">{risk.name}</TableCell>
                                <TableCell>
                                  <Badge className={getSeverityColor(risk.severity)}>
                                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="capitalize text-white/70">{risk.riskCategory}</TableCell>
                                <TableCell className="text-white/70">{formatCurrency(risk.inherentRisk || 0, 'USD')}</TableCell>
                                <TableCell className="text-white/70">{formatCurrency(risk.residualRisk || 0, 'USD')}</TableCell>
                              </TableRow>
                            ))
                          : <TableRow><TableCell colSpan={6} className="text-center text-white/50">No risk data available</TableCell></TableRow>}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500">No risk data available</p>
              )}
            </GlowCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk by Severity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {risks && risks.length > 0 ? (
                      <>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Critical</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.severity === 'critical').length} ({((risks.filter(r => r.severity === 'critical').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-red-600 rounded-full"
                              style={{ width: `${((risks.filter(r => r.severity === 'critical').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>High</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.severity === 'high').length} ({((risks.filter(r => r.severity === 'high').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-amber-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.severity === 'high').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Medium</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.severity === 'medium').length} ({((risks.filter(r => r.severity === 'medium').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-yellow-400 rounded-full"
                              style={{ width: `${((risks.filter(r => r.severity === 'medium').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Low</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.severity === 'low').length} ({((risks.filter(r => r.severity === 'low').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-green-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.severity === 'low').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No risk data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {risks && risks.length > 0 ? (
                      <>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Operational</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.riskCategory === 'operational').length} ({((risks.filter(r => r.riskCategory === 'operational').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.riskCategory === 'operational').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Compliance</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.riskCategory === 'compliance').length} ({((risks.filter(r => r.riskCategory === 'compliance').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-purple-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.riskCategory === 'compliance').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Strategic</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.riskCategory === 'strategic').length} ({((risks.filter(r => r.riskCategory === 'strategic').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-indigo-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.riskCategory === 'strategic').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <div>Financial</div>
                            <div className="font-medium text-gray-900">
                              {risks.filter(r => r.riskCategory === 'financial').length} ({((risks.filter(r => r.riskCategory === 'financial').length / risks.length) * 100).toFixed(0)}%)
                            </div>
                          </div>
                          <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-teal-500 rounded-full"
                              style={{ width: `${((risks.filter(r => r.riskCategory === 'financial').length / risks.length) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No risk data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="control-effectiveness" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Control Implementation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Use dashboard control summary or fallback to controls array to create data */}
                  <div className="space-y-3">
                    {(() => {
                      // Create control status data from actual controls if available
                      const totalControls = controls?.length || 1;
                      const implementedControls = controls?.filter(c =>
                        c.implementationStatus === "fully_implemented" ||
                        c.implementationStatus === "Fully Implemented"
                      ).length || 1;
                      const inProgressControls = controls?.filter(c =>
                        c.implementationStatus === "in_progress" ||
                        c.implementationStatus === "In Progress"
                      ).length || 0;
                      const notImplementedControls = controls?.filter(c =>
                        c.implementationStatus === "not_implemented" ||
                        c.implementationStatus === "Not Implemented" ||
                        !c.implementationStatus
                      ).length || 0;

                      // Calculate percentages (avoid division by zero)
                      const implementedPercent = (implementedControls / totalControls) * 100;
                      const inProgressPercent = (inProgressControls / totalControls) * 100;
                      const notImplementedPercent = (notImplementedControls / totalControls) * 100;

                      return (
                        <>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>Fully Implemented</div>
                              <div className="font-medium text-gray-900">
                                {implementedControls} ({Math.round(implementedPercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-600 rounded-full"
                                style={{ width: `${implementedPercent}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>In Progress</div>
                              <div className="font-medium text-gray-900">
                                {inProgressControls} ({Math.round(inProgressPercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-amber-500 rounded-full"
                                style={{ width: `${inProgressPercent}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>Not Implemented</div>
                              <div className="font-medium text-gray-900">
                                {notImplementedControls} ({Math.round(notImplementedPercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-red-600 rounded-full"
                                style={{ width: `${notImplementedPercent}%` }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Control by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Generate control type distribution from actual controls */}
                  <div className="space-y-3">
                    {(() => {
                      // Create control type data from actual controls
                      const totalControls = controls?.length || 1;
                      const preventiveControls = controls?.filter(c =>
                        c.controlType === "preventive" || c.controlType === "Preventive"
                      ).length || 1;
                      const detectiveControls = controls?.filter(c =>
                        c.controlType === "detective" || c.controlType === "Detective"
                      ).length || 0;
                      const correctiveControls = controls?.filter(c =>
                        c.controlType === "corrective" || c.controlType === "Corrective"
                      ).length || 0;

                      // Calculate percentages
                      const preventivePercent = (preventiveControls / totalControls) * 100;
                      const detectivePercent = (detectiveControls / totalControls) * 100;
                      const correctivePercent = (correctiveControls / totalControls) * 100;

                      return (
                        <>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>Preventive</div>
                              <div className="font-medium text-gray-900">
                                {preventiveControls} ({Math.round(preventivePercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-600 rounded-full"
                                style={{ width: `${preventivePercent}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>Detective</div>
                              <div className="font-medium text-gray-900">
                                {detectiveControls} ({Math.round(detectivePercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${detectivePercent}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <div>Corrective</div>
                              <div className="font-medium text-gray-900">
                                {correctiveControls} ({Math.round(correctivePercent)}%)
                              </div>
                            </div>
                            <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-amber-500 rounded-full"
                                style={{ width: `${correctivePercent}%` }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Control Effectiveness Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {controls && controls.length > 0 ? (
                      <>
                        <div>
                          <h3 className="text-sm font-medium mb-2">Resistance Strength (by control type)</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <div>Avoid (Preventive)</div>
                                <div className="font-medium text-gray-900">
                                  {Math.round((getControlEffectiveness()?.eAvoid || 0.25) * 100)}%
                                </div>
                              </div>
                              <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-green-600 rounded-full"
                                  style={{ width: `${(getControlEffectiveness()?.eAvoid || 0.25) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <div>Deter (Preventive)</div>
                                <div className="font-medium text-gray-900">
                                  {Math.round((getControlEffectiveness().eDeter || 0.25) * 100)}%
                                </div>
                              </div>
                              <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{ width: `${(getControlEffectiveness().eDeter || 0.25) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <div>Detect (Detective)</div>
                                <div className="font-medium text-gray-900">
                                  {Math.round((getControlEffectiveness().eDetect || 0.25) * 100)}%
                                </div>
                              </div>
                              <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-purple-600 rounded-full"
                                  style={{ width: `${(getControlEffectiveness().eDetect || 0.25) * 100}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between text-sm">
                                <div>Resist (Corrective)</div>
                                <div className="font-medium text-gray-900">
                                  {Math.round((getControlEffectiveness().eResist || 0.25) * 100)}%
                                </div>
                              </div>
                              <div className="w-full h-2 mt-1 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-amber-600 rounded-full"
                                  style={{ width: `${(getControlEffectiveness().eResist || 0.25) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No control effectiveness data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Control Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  {controls && controls.length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium">Overall Control Effectiveness</h3>
                          <span className="text-lg font-bold">
                            {Math.round(((
                              (getControlEffectiveness().eAvoid || 0.25) +
                              (getControlEffectiveness().eDeter || 0.25) +
                              (getControlEffectiveness().eDetect || 0.25) +
                              (getControlEffectiveness().eResist || 0.25)
                            ) / 4) * 100)}%
                          </span>
                        </div>
                        <div className="w-full h-4 mb-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-4 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                            style={{
                              width: `${((
                                (getControlEffectiveness().eAvoid || 0.25) +
                                (getControlEffectiveness().eDeter || 0.25) +
                                (getControlEffectiveness().eDetect || 0.25) +
                                (getControlEffectiveness().eResist || 0.25)
                              ) / 4) * 100}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div>0%</div>
                          <div>50%</div>
                          <div>100%</div>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <h3 className="text-sm font-medium mb-2">Top Effective Controls</h3>
                        {Array.isArray(controls) && controls.length > 0 ? (
                          // Sort controls by effectiveness and display up to 3
                          [...controls]
                            .sort((a, b) => (b.controlEffectiveness || 0) - (a.controlEffectiveness || 0))
                            .slice(0, 3)
                            .map((control, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
                                  <span className="text-sm">{control.name || `Control ${control.controlId}`}</span>
                                </div>
                                <span className="text-sm font-medium">{Math.round((control.controlEffectiveness || 0.5) * 10)}/10</span>
                              </div>
                            ))
                        ) : (
                          // If no controls, show empty state message
                          <div className="p-4 text-center text-sm text-gray-500">
                            No control data available. Add controls to see them ranked here.
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No control effectiveness data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Risk Mitigation Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-md font-medium mb-3">Risk Reduction Analysis</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Inherent Risk:</p>
                        <p className="text-lg font-bold">{formatCurrency(data.dashboard?.riskSummary?.totalInherentRisk || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Residual Risk After Controls:</p>
                        <p className="text-lg font-bold">{formatCurrency(data.dashboard?.riskSummary?.totalResidualRisk || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Risk Reduction:</p>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency((data.dashboard?.riskSummary?.totalInherentRisk || 0) - (data.dashboard?.riskSummary?.totalResidualRisk || 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Percentage Reduced:</p>
                        <p className="text-lg font-bold text-green-600">
                          {(data.dashboard?.riskSummary?.riskReduction || 0).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-4 mb-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500"
                        style={{ width: `${data.dashboard?.riskSummary?.riskReduction || 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div>0%</div>
                      <div>50%</div>
                      <div>100%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-medium mb-2">High Priority Actions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Implement additional controls for critical risks, especially in the operational category.</li>
                      <li>Complete the implementation of in-progress controls to improve overall resistance strength.</li>
                      <li>Perform a quarterly review of the top 5 risks to ensure control effectiveness.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Medium Priority Actions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Expand the asset inventory to ensure all critical assets are properly identified.</li>
                      <li>Review compliance risks to address any regulatory gaps.</li>
                      <li>Consider additional detective controls to balance the control portfolio.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Long-term Strategy</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Develop a continuous monitoring program for cybersecurity risks.</li>
                      <li>Implement a regular review cycle for all risk responses.</li>
                      <li>Establish automated control testing where possible to improve accuracy of effectiveness ratings.</li>
                      <li>Consider developing risk appetite statements for each business unit to guide future risk decisions.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Render Asset Inventory Report
  const renderAssetReport = () => {
    const assets = data.assets;

    return (
      <GlowCard className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Asset Management</p>
            <p className="text-lg font-semibold text-white">Asset Inventory Report</p>
          </div>
          <div className="text-sm text-white/60">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="p-0">
          {(assets && assets.length > 0) ? (
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Asset Inventory
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="text-xs uppercase tracking-wide text-white/50">
                    <TableRow className="border-b border-white/5">
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Business Unit</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>CIA Rating</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset: Asset) => (
                      <TableRow key={asset.id} className="border-b border-white/5">
                        <TableCell className="font-medium text-white">{asset.assetId}</TableCell>
                        <TableCell className="text-white">{asset.name}</TableCell>
                        <TableCell className="capitalize text-white/70">{asset.type}</TableCell>
                        <TableCell className="text-white/70">{asset.businessUnit}</TableCell>
                        <TableCell className="text-white/70">{asset.owner}</TableCell>
                        <TableCell className="text-white/70">
                          C:{asset.confidentiality.charAt(0).toUpperCase()},
                          I:{asset.integrity.charAt(0).toUpperCase()},
                          A:{asset.availability.charAt(0).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-green-400 font-medium">{formatCurrency(asset.assetValue, asset.currency)}</TableCell>
                        <TableCell className="capitalize text-white/70">{asset.externalInternal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No assets data available</p>
          )}
        </div>

        <div className="text-sm text-gray-400 text-right px-6 py-4 border-t border-gray-600">
          Total Assets: {assets?.length || 0}
        </div>
      </GlowCard>
    );
  };

  // Render Risk Register Report
  const renderRiskReport = () => {
    const risks = data.risks;

    return (
      <GlowCard className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Risk Management</p>
            <p className="text-lg font-semibold text-white">Risk Register Report</p>
          </div>
          <div className="text-sm text-white/60">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="p-0">
          {(risks && risks.length > 0) ? (
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Risk Register
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="text-xs uppercase tracking-wide text-white/50">
                    <TableRow className="border-b border-white/5">
                      <TableHead>Risk ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Threat Community</TableHead>
                      <TableHead>Vulnerability</TableHead>
                      <TableHead>Inherent Risk</TableHead>
                      <TableHead>Residual Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.map((risk: Risk) => (
                      <TableRow key={risk.id} className="border-b border-white/5">
                        <TableCell className="font-medium text-white">{risk.riskId}</TableCell>
                        <TableCell className="text-white">{risk.name}</TableCell>
                        <TableCell className="capitalize text-white/70">{risk.riskCategory}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(risk.severity)}>
                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{risk.threatCommunity}</TableCell>
                        <TableCell className="text-white/70">{risk.vulnerability}</TableCell>
                        <TableCell className="text-red-400 font-medium">{formatCurrency(risk.inherentRisk || 0, 'USD')}</TableCell>
                        <TableCell className="text-green-400 font-medium">{formatCurrency(risk.residualRisk || 0, 'USD')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No risks data available</p>
          )}
        </div>

        <div className="text-sm text-gray-400 text-right px-6 py-4 border-t border-gray-600">
          Total Risks: {risks?.length || 0}
        </div>
      </GlowCard>
    );
  };

  // Render Control Library Report
  const renderControlReport = () => {
    const controls = data.controls;

    return (
      <GlowCard className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Control Management</p>
            <p className="text-lg font-semibold text-white">Control Library Report</p>
          </div>
          <div className="text-sm text-white/60">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="p-0">
          {(Array.isArray(controls) && controls.length > 0) ? (
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Control Library
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="text-xs uppercase tracking-wide text-white/50">
                    <TableRow className="border-b border-white/5">
                      <TableHead>Control ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effectiveness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controls.map((control: Control) => (
                      <TableRow key={control.id} className="border-b border-white/5">
                        <TableCell className="font-medium text-white">{control.controlId}</TableCell>
                        <TableCell className="text-white">{control.name}</TableCell>
                        <TableCell>
                          <Badge className={getControlTypeColor(control.controlType)}>
                            {control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{formatImplementationStatus(control.implementationStatus)}</TableCell>
                        <TableCell className="text-white/70">
                          {control.controlEffectiveness ? `${control.controlEffectiveness}/10` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No control data available</p>
          )}
        </div>

        <div className="text-sm text-gray-400 text-right px-6 py-4 border-t border-gray-600">
          Total Controls: {controls?.length || 0}
        </div>
      </GlowCard>
    );
  };

  // Render Risk Response Report
  const renderResponseReport = () => {
    const { responses, risks } = data;

    return (
      <GlowCard className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Risk Treatment</p>
            <p className="text-lg font-semibold text-white">Risk Response Plan</p>
          </div>
          <div className="text-sm text-white/60">
            Generated on {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="p-0">
          {(responses && responses.length > 0) ? (
            <div className="overflow-hidden rounded-[28px] border border-white/10">
              <div className="bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Risk Responses
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="text-xs uppercase tracking-wide text-white/50">
                    <TableRow className="border-b border-white/5">
                      <TableHead>Risk ID</TableHead>
                      <TableHead>Risk Name</TableHead>
                      <TableHead>Response Type</TableHead>
                      <TableHead>Justification</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Controls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response: RiskResponse) => (
                      <TableRow key={response.id} className="border-b border-white/5">
                        <TableCell className="font-medium text-white">{response.riskId}</TableCell>
                        <TableCell className="text-white">{getRiskName(response.riskId)}</TableCell>
                        <TableCell>
                          <Badge className={getResponseTypeColor(response.responseType)}>
                            {response.responseType.charAt(0).toUpperCase() + response.responseType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{response.justification}</TableCell>
                        <TableCell className="text-white/70">
                          {response.responseType === "transfer" && response.transferMethod && (
                            <span>Transfer: {response.transferMethod}</span>
                          )}
                          {response.responseType === "avoid" && response.avoidanceStrategy && (
                            <span>Avoidance: {response.avoidanceStrategy}</span>
                          )}
                          {response.responseType === "accept" && response.acceptanceReason && (
                            <span>Acceptance: {response.acceptanceReason}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {response.responseType === "mitigate" && response.assignedControls ? (
                            <span>{response.assignedControls.length} controls</span>
                          ) : (
                            <span>N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No risk responses data available</p>
          )}
        </div>

        <div className="text-sm text-gray-400 text-right px-6 py-4 border-t border-gray-600">
          Total Responses: {responses?.length || 0}
        </div>
      </GlowCard>
    );
  };

  // Render the appropriate report based on type
  switch (type) {
    case "summary":
      return renderSummaryReport();
    case "assets":
      return renderAssetReport();
    case "risks":
      return renderRiskReport();
    case "controls":
      return renderControlReport();
    case "responses":
      return renderResponseReport();
    default:
      return <div>Invalid report type</div>;
  }
}
