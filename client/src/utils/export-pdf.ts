import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Asset, Risk, Control, RiskResponse } from '@shared/schema';

// Format currency display
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage display
const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Get severity level text
const getSeverityText = (severity: string): string => {
  return severity.charAt(0).toUpperCase() + severity.slice(1);
};

// Format implementation status for display
const formatImplementationStatus = (status: string): string => {
  switch (status) {
    case "fully_implemented":
      return "Fully Implemented";
    case "in_progress":
      return "In Progress";
    case "not_implemented":
      return "Not Implemented";
    default:
      return status;
  }
};

/**
 * Generate PDF from data
 */
export const exportToPdf = async (data: any): Promise<void> => {
  const { reportType, assets, risks, controls, responses, summary } = data;
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleDateString();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title and date
  doc.setFontSize(20);
  doc.text('Cybersecurity Risk Assessment Report', 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated on ${currentDate}`, 14, 28);
  doc.text('RiskQuantify - FAIR-U Methodology', pageWidth - 14, 28, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setLineWidth(0.5);
  doc.line(14, 32, pageWidth - 14, 32);
  
  let currentY = 40;

  if (reportType === 'summary') {
    // Executive Summary
    doc.setFontSize(16);
    doc.text('Executive Summary', 14, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.text('This report provides an assessment of the organization\'s cybersecurity risk posture using FAIR-U quantitative risk analysis methodology.', 14, currentY, { maxWidth: pageWidth - 28 });
    currentY += 12;
    
    // Key Metrics
    const metrics = [
      ['Total Assets', assets?.length.toString() || '0'],
      ['Identified Risks', risks?.length.toString() || '0'],
      ['Implemented Controls', (Array.isArray(controls) ? controls.filter((c: Control) => c.implementationStatus === 'fully_implemented').length : 0).toString()],
      ['Risk Exposure', formatCurrency(summary?.counts?.riskExposure || 0)],
      ['Inherent Risk', formatCurrency(summary?.riskReduction?.inherentRisk || 0)],
      ['Residual Risk', formatCurrency(summary?.riskReduction?.residualRisk || 0)],
      ['Risk Reduction', `${formatCurrency(summary?.riskReduction?.reduction || 0)} (${formatPercentage(summary?.riskReduction?.reductionPercentage || 0)})`]
    ];
    
    autoTable(doc, {
      startY: currentY,
      head: [['Metric', 'Value']],
      body: metrics,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Top Risks
    if (summary?.topRisks && summary.topRisks.length > 0) {
      doc.setFontSize(16);
      doc.text('Top Risks by Expected Loss', 14, currentY);
      currentY += 8;
      
      const topRisksData = summary.topRisks.map((risk: Risk) => [
        risk.riskId,
        risk.name,
        getSeverityText(risk.severity),
        risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1),
        formatCurrency(risk.inherentRisk || 0),
        formatCurrency(risk.residualRisk || 0)
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Risk ID', 'Name', 'Severity', 'Category', 'Inherent Risk', 'Residual Risk']],
        body: topRisksData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Risk Breakdown
    doc.setFontSize(16);
    doc.text('Risk Analysis', 14, currentY);
    currentY += 8;
    
    if (summary?.riskBySeverity) {
      const severityData = [
        ['Critical', (summary.riskBySeverity.critical || 0).toString(), formatPercentage((summary.riskBySeverity.critical / summary.counts.risks) * 100 || 0)],
        ['High', (summary.riskBySeverity.high || 0).toString(), formatPercentage((summary.riskBySeverity.high / summary.counts.risks) * 100 || 0)],
        ['Medium', (summary.riskBySeverity.medium || 0).toString(), formatPercentage((summary.riskBySeverity.medium / summary.counts.risks) * 100 || 0)],
        ['Low', (summary.riskBySeverity.low || 0).toString(), formatPercentage((summary.riskBySeverity.low / summary.counts.risks) * 100 || 0)]
      ];
      
      autoTable(doc, {
        startY: currentY,
        head: [['Severity', 'Count', 'Percentage']],
        body: severityData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
    }
    
    // Add new page for recommendations
    doc.addPage();
    currentY = 20;
    
    doc.setFontSize(16);
    doc.text('Recommendations', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(12);
    doc.text('High Priority Actions', 14, currentY);
    currentY += 6;
    
    doc.setFontSize(10);
    const highPriorityActions = [
      'Implement additional controls for critical risks, especially in the operational category.',
      'Complete the implementation of in-progress controls to improve overall resistance strength.',
      'Perform a quarterly review of the top 5 risks to ensure control effectiveness.'
    ];
    
    highPriorityActions.forEach(action => {
      doc.text(`• ${action}`, 18, currentY, { maxWidth: pageWidth - 36 });
      currentY += 10;
    });
    
    currentY += 5;
    doc.setFontSize(12);
    doc.text('Medium Priority Actions', 14, currentY);
    currentY += 6;
    
    doc.setFontSize(10);
    const mediumPriorityActions = [
      'Expand the asset inventory to ensure all critical assets are properly identified.',
      'Review compliance risks to address any regulatory gaps.',
      'Consider additional detective controls to balance the control portfolio.'
    ];
    
    mediumPriorityActions.forEach(action => {
      doc.text(`• ${action}`, 18, currentY, { maxWidth: pageWidth - 36 });
      currentY += 10;
    });
    
    currentY += 5;
    doc.setFontSize(12);
    doc.text('Long-term Strategy', 14, currentY);
    currentY += 6;
    
    doc.setFontSize(10);
    const longTermActions = [
      'Develop a continuous monitoring program for cybersecurity risks.',
      'Implement a regular review cycle for all risk responses.',
      'Establish automated control testing where possible to improve accuracy of effectiveness ratings.',
      'Consider developing risk appetite statements for each business unit to guide future risk decisions.'
    ];
    
    longTermActions.forEach(action => {
      doc.text(`• ${action}`, 18, currentY, { maxWidth: pageWidth - 36 });
      currentY += 10;
    });
    
  } else if (reportType === 'risks') {
    // Risk Register Report
    doc.setFontSize(16);
    doc.text('Risk Register Report', 14, currentY);
    currentY += 8;
    
    if (risks && risks.length > 0) {
      const risksData = risks.map((risk: Risk) => [
        risk.riskId,
        risk.name,
        risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1),
        getSeverityText(risk.severity),
        formatCurrency(risk.inherentRisk || 0),
        formatCurrency(risk.residualRisk || 0)
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Risk ID', 'Name', 'Category', 'Severity', 'Inherent Risk', 'Residual Risk']],
        body: risksData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Risks: ${risks.length}`, pageWidth - 14, currentY, { align: 'right' });
    }
    
  } else if (reportType === 'assets') {
    // Asset Inventory Report
    doc.setFontSize(16);
    doc.text('Asset Inventory Report', 14, currentY);
    currentY += 8;
    
    if (assets && assets.length > 0) {
      const assetsData = assets.map((asset: Asset) => [
        asset.assetId,
        asset.name,
        asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
        asset.businessUnit,
        asset.owner,
        `C:${asset.confidentiality.charAt(0).toUpperCase()}, I:${asset.integrity.charAt(0).toUpperCase()}, A:${asset.availability.charAt(0).toUpperCase()}`,
        formatCurrency(asset.assetValue)
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Asset ID', 'Name', 'Type', 'Business Unit', 'Owner', 'CIA Rating', 'Value']],
        body: assetsData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Assets: ${assets.length}`, pageWidth - 14, currentY, { align: 'right' });
    }
    
  } else if (reportType === 'controls') {
    // Control Library Report
    doc.setFontSize(16);
    doc.text('Control Library Report', 14, currentY);
    currentY += 8;
    
    if (controls && controls.length > 0) {
      const controlsData = controls.map((control: Control) => [
        control.controlId,
        control.name,
        control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1),
        control.controlCategory.charAt(0).toUpperCase() + control.controlCategory.slice(1),
        formatImplementationStatus(control.implementationStatus),
        `${control.controlEffectiveness.toFixed(1)}/10`,
        formatCurrency(control.implementationCost || 0)
      ]);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Control ID', 'Name', 'Type', 'Category', 'Status', 'Effectiveness', 'Cost']],
        body: controlsData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Controls: ${controls.length}`, pageWidth - 14, currentY, { align: 'right' });
    }
    
  } else if (reportType === 'responses') {
    // Risk Response Report
    doc.setFontSize(16);
    doc.text('Risk Response Report', 14, currentY);
    currentY += 8;
    
    if (responses && responses.length > 0) {
      // Get risk name from risk ID
      const getRiskName = (riskId: string): string => {
        if (!risks) return "Unknown Risk";
        const risk = risks.find((r: Risk) => r.riskId === riskId);
        return risk ? risk.name : "Unknown Risk";
      };
      
      const responsesData = responses.map((response: RiskResponse) => {
        const detailsColumn = (() => {
          if (response.responseType === "transfer" && response.transferMethod) {
            return `Transfer: ${response.transferMethod}`;
          } else if (response.responseType === "avoid" && response.avoidanceStrategy) {
            return `Avoidance: ${response.avoidanceStrategy}`;
          } else if (response.responseType === "accept" && response.acceptanceReason) {
            return `Acceptance: ${response.acceptanceReason}`;
          }
          return '';
        })();
        
        const controlsColumn = response.responseType === "mitigate" && response.assignedControls 
          ? `${response.assignedControls.length} controls`
          : 'N/A';
        
        return [
          response.riskId,
          getRiskName(response.riskId),
          response.responseType.charAt(0).toUpperCase() + response.responseType.slice(1),
          response.justification,
          detailsColumn,
          controlsColumn
        ];
      });
      
      autoTable(doc, {
        startY: currentY,
        head: [['Risk ID', 'Risk Name', 'Response Type', 'Justification', 'Details', 'Controls']],
        body: responsesData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.text(`Total Responses: ${responses.length}`, pageWidth - 14, currentY, { align: 'right' });
    }
  }
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text('CONFIDENTIAL', 14, doc.internal.pageSize.getHeight() - 10);
  }
  
  // Save the PDF
  const fileName = `${reportType}_report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
