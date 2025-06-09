import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileType, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportGenerator } from "@/components/reports/report-generator";
import { exportToPdf } from "@/utils/export-pdf";
import { exportToExcel } from "@/utils/export-excel";

export default function Reports() {
  const [reportType, setReportType] = useState("risks");
  const [exportLoading, setExportLoading] = useState({ pdf: false, excel: false });

  // Fetch data needed for reports
  const { data: assetsResponse, isLoading: assetsLoading } = useQuery({
    queryKey: ["/api/assets"],
  });
  const assets = assetsResponse?.data || [];

  const { data: risksResponse, isLoading: risksLoading } = useQuery({
    queryKey: ["/api/risks"],
  });
  const risks = risksResponse?.data || [];

  const { data: controlsResponse, isLoading: controlsLoading } = useQuery({
    queryKey: ["/api/controls"],
  });
  const controls = controlsResponse?.data || [];

  const { data: responsesResponse, isLoading: responsesLoading } = useQuery({
    queryKey: ["/api/risk-responses"],
  });
  const responses = responsesResponse?.data || [];

  const { data: summaryResponse, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/dashboard/summary"],
  });
  const summary = summaryResponse?.data || {};

  const isLoading = assetsLoading || risksLoading || controlsLoading || responsesLoading || summaryLoading;

  // Handle export to PDF
  const handleExportPdf = async () => {
    setExportLoading(prev => ({ ...prev, pdf: true }));
    try {
      const data = {
        reportType,
        assets,
        risks,
        controls,
        responses,
        summary
      };
      await exportToPdf(data);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    } finally {
      setExportLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  // Handle export to Excel
  const handleExportExcel = async () => {
    setExportLoading(prev => ({ ...prev, excel: true }));
    try {
      const data = {
        reportType,
        assets,
        risks,
        controls,
        responses,
        summary
      };
      await exportToExcel(data);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setExportLoading(prev => ({ ...prev, excel: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <Layout
      pageTitle="Report Generation"
      pageIcon="RPT"
      pageDescription="Generate comprehensive reports for risk management analysis and documentation"
      pageActions={
        <div className="flex gap-2">
          <Button onClick={handleExportPdf} disabled={exportLoading.pdf}>
            {exportLoading.pdf ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export to PDF
          </Button>
          <Button onClick={handleExportExcel} variant="outline" disabled={exportLoading.excel}>
            {exportLoading.excel ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileType className="mr-2 h-4 w-4" />
            )}
            Export to Excel
          </Button>
        </div>
      }
    >

      <div className="bg-gray-800 rounded-lg border border-gray-600">
        <div className="bg-gray-700 px-6 py-4 border-b border-gray-600 rounded-t-lg">
          <h3 className="text-lg font-semibold text-white">Report Preview</h3>
        </div>
        <div className="p-6">
          <Tabs defaultValue="risks" onValueChange={setReportType}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="risks">Risk Register</TabsTrigger>
              <TabsTrigger value="assets">Asset Inventory</TabsTrigger>
              <TabsTrigger value="controls">Control Library</TabsTrigger>
              <TabsTrigger value="responses">Risk Responses</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <ReportGenerator 
                type="summary" 
                data={{ 
                  assets, 
                  risks, 
                  controls, 
                  responses, 
                  summary,
                  dashboard: summary
                }} 
              />
            </TabsContent>
            <TabsContent value="risks">
              <ReportGenerator type="risks" data={{ risks }} />
            </TabsContent>
            <TabsContent value="assets">
              <ReportGenerator type="assets" data={{ assets }} />
            </TabsContent>
            <TabsContent value="controls">
              <ReportGenerator type="controls" data={{ controls }} />
            </TabsContent>
            <TabsContent value="responses">
              <ReportGenerator 
                type="responses" 
                data={{ 
                  responses, 
                  risks 
                }} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    
  );
}
