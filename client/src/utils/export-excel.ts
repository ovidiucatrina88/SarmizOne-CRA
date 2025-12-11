import ExcelJS from 'exceljs';
import { Asset, Risk, Control, RiskResponse } from '@shared/schema';

// Format currency display
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
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
 * Generate Excel workbook from data
 */
export const exportToExcel = async (data: any): Promise<void> => {
  const { reportType, assets, risks, controls, responses, summary } = data;

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Risk Platform';
  workbook.lastModifiedBy = 'Risk Platform';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Helper to auto-size columns
  const autoSizeColumns = (worksheet: ExcelJS.Worksheet) => {
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column["eachCell"]({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });
  };

  if (reportType === 'summary' || reportType === 'risks') {
    // Risk Register Sheet
    if (risks && risks.length > 0) {
      const worksheet = workbook.addWorksheet('Risk Register');

      worksheet.columns = [
        { header: 'Risk ID', key: 'riskId' },
        { header: 'Name', key: 'name' },
        { header: 'Category', key: 'category' },
        { header: 'Severity', key: 'severity' },
        { header: 'Threat Community', key: 'threatCommunity' },
        { header: 'Vulnerability', key: 'vulnerability' },
        { header: 'Contact Frequency', key: 'contactFrequency' },
        { header: 'Probability of Action', key: 'probabilityOfAction' },
        { header: 'Threat Capability', key: 'threatCapability' },
        { header: 'Probable Loss Magnitude', key: 'probableLossMagnitude' },
        { header: 'Inherent Risk', key: 'inherentRisk' },
        { header: 'Residual Risk', key: 'residualRisk' },
        { header: 'Risk Reduction', key: 'riskReduction' },
        { header: 'Risk Reduction %', key: 'riskReductionPercent' },
        { header: 'Associated Assets', key: 'associatedAssets' }
      ];

      risks.forEach((risk: Risk) => {
        worksheet.addRow({
          riskId: risk.riskId,
          name: risk.name,
          category: risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1),
          severity: risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1),
          threatCommunity: risk.threatCommunity,
          vulnerability: risk.vulnerability,
          contactFrequency: risk.contactFrequency?.toFixed(2) || '0',
          probabilityOfAction: risk.probabilityOfAction ? `${(risk.probabilityOfAction * 100).toFixed(0)}%` : '0%',
          threatCapability: risk.threatCapability?.toFixed(1) || '0',
          probableLossMagnitude: formatCurrency(risk.probableLossMagnitude || 0),
          inherentRisk: formatCurrency(risk.inherentRisk || 0),
          residualRisk: formatCurrency(risk.residualRisk || 0),
          riskReduction: risk.inherentRisk && risk.residualRisk
            ? formatCurrency(risk.inherentRisk - risk.residualRisk)
            : '$0',
          riskReductionPercent: risk.inherentRisk && risk.residualRisk && risk.inherentRisk > 0
            ? `${((risk.inherentRisk - risk.residualRisk) / risk.inherentRisk * 100).toFixed(1)}%`
            : '0%',
          associatedAssets: risk.associatedAssets ? risk.associatedAssets.join(', ') : ''
        });
      });

      autoSizeColumns(worksheet);
    }
  }

  if (reportType === 'summary' || reportType === 'assets') {
    // Asset Inventory Sheet
    if (assets && assets.length > 0) {
      const worksheet = workbook.addWorksheet('Asset Inventory');

      worksheet.columns = [
        { header: 'Asset ID', key: 'assetId' },
        { header: 'Name', key: 'name' },
        { header: 'Type', key: 'type' },
        { header: 'Business Unit', key: 'businessUnit' },
        { header: 'Owner', key: 'owner' },
        { header: 'Confidentiality', key: 'confidentiality' },
        { header: 'Integrity', key: 'integrity' },
        { header: 'Availability', key: 'availability' },
        { header: 'Asset Value', key: 'assetValue' },
        { header: 'Location', key: 'location' },
        { header: 'Regulatory Impact', key: 'regulatoryImpact' },
        { header: 'Dependencies', key: 'dependencies' },
        { header: 'Description', key: 'description' }
      ];

      assets.forEach((asset: Asset) => {
        worksheet.addRow({
          assetId: asset.assetId,
          name: asset.name,
          type: asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
          businessUnit: asset.businessUnit,
          owner: asset.owner,
          confidentiality: asset.confidentiality.charAt(0).toUpperCase(),
          integrity: asset.integrity.charAt(0).toUpperCase(),
          availability: asset.availability.charAt(0).toUpperCase(),
          assetValue: formatCurrency(asset.assetValue),
          location: asset.externalInternal.charAt(0).toUpperCase() + asset.externalInternal.slice(1),
          regulatoryImpact: asset.regulatoryImpact ? asset.regulatoryImpact.join(', ') : '',
          dependencies: asset.dependencies ? asset.dependencies.join(', ') : '',
          description: asset.description || ''
        });
      });

      autoSizeColumns(worksheet);
    }
  }

  if (reportType === 'summary' || reportType === 'controls') {
    // Control Library Sheet
    if (controls && controls.length > 0) {
      const worksheet = workbook.addWorksheet('Control Library');

      worksheet.columns = [
        { header: 'Control ID', key: 'controlId' },
        { header: 'Name', key: 'name' },
        { header: 'Type', key: 'type' },
        { header: 'Category', key: 'category' },
        { header: 'Status', key: 'status' },
        { header: 'Effectiveness', key: 'effectiveness' },
        { header: 'Cost', key: 'cost' },
        { header: 'Associated Risks', key: 'associatedRisks' },
        { header: 'Description', key: 'description' },
        { header: 'Notes', key: 'notes' }
      ];

      controls.forEach((control: Control) => {
        worksheet.addRow({
          controlId: control.controlId,
          name: control.name,
          type: control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1),
          category: control.controlCategory.charAt(0).toUpperCase() + control.controlCategory.slice(1),
          status: formatImplementationStatus(control.implementationStatus),
          effectiveness: `${control.controlEffectiveness.toFixed(1)}/10`,
          cost: formatCurrency(control.implementationCost || 0),
          associatedRisks: control.associatedRisks ? control.associatedRisks.join(', ') : '',
          description: control.description || '',
          notes: control.notes || ''
        });
      });

      autoSizeColumns(worksheet);
    }
  }

  if (reportType === 'summary' || reportType === 'responses') {
    // Risk Response Sheet
    if (responses && responses.length > 0) {
      const worksheet = workbook.addWorksheet('Risk Responses');

      worksheet.columns = [
        { header: 'Risk ID', key: 'riskId' },
        { header: 'Risk Name', key: 'riskName' },
        { header: 'Response Type', key: 'responseType' },
        { header: 'Justification', key: 'justification' },
        { header: 'Assigned Controls', key: 'assignedControls' },
        { header: 'Transfer Method', key: 'transferMethod' },
        { header: 'Avoidance Strategy', key: 'avoidanceStrategy' },
        { header: 'Acceptance Reason', key: 'acceptanceReason' }
      ];

      // Get risk name from risk ID
      const getRiskName = (riskId: string): string => {
        if (!risks) return "Unknown Risk";
        const risk = risks.find((r: Risk) => r.riskId === riskId);
        return risk ? risk.name : "Unknown Risk";
      };

      responses.forEach((response: RiskResponse) => {
        const row: any = {
          riskId: response.riskId,
          riskName: getRiskName(response.riskId),
          responseType: response.responseType.charAt(0).toUpperCase() + response.responseType.slice(1),
          justification: response.justification || '',
        };

        if (response.responseType === 'mitigate') {
          row.assignedControls = response.assignedControls ? response.assignedControls.join(', ') : '';
          row.transferMethod = 'N/A';
          row.avoidanceStrategy = 'N/A';
          row.acceptanceReason = 'N/A';
        } else if (response.responseType === 'transfer') {
          row.assignedControls = 'N/A';
          row.transferMethod = response.transferMethod || '';
          row.avoidanceStrategy = 'N/A';
          row.acceptanceReason = 'N/A';
        } else if (response.responseType === 'avoid') {
          row.assignedControls = 'N/A';
          row.transferMethod = 'N/A';
          row.avoidanceStrategy = response.avoidanceStrategy || '';
          row.acceptanceReason = 'N/A';
        } else if (response.responseType === 'accept') {
          row.assignedControls = 'N/A';
          row.transferMethod = 'N/A';
          row.avoidanceStrategy = 'N/A';
          row.acceptanceReason = response.acceptanceReason || '';
        }

        worksheet.addRow(row);
      });

      autoSizeColumns(worksheet);
    }
  }

  if (reportType === 'summary') {
    // Summary Sheet
    const worksheet = workbook.addWorksheet('Summary');

    worksheet.columns = [
      { header: 'Metric', key: 'metric', width: 40 },
      { header: 'Value', key: 'value', width: 20 }
    ];

    worksheet.addRow({ metric: 'Total Assets', value: assets?.length || 0 });
    worksheet.addRow({ metric: 'Identified Risks', value: risks?.length || 0 });
    worksheet.addRow({ metric: 'Implemented Controls', value: Array.isArray(controls) ? controls.filter((c: Control) => c.implementationStatus === 'fully_implemented').length : 0 });
    worksheet.addRow({ metric: 'Risk Exposure', value: formatCurrency(summary?.counts?.riskExposure || 0) });
    worksheet.addRow({ metric: 'Inherent Risk', value: formatCurrency(summary?.riskReduction?.inherentRisk || 0) });
    worksheet.addRow({ metric: 'Residual Risk', value: formatCurrency(summary?.riskReduction?.residualRisk || 0) });
    worksheet.addRow({ metric: 'Risk Reduction', value: formatCurrency(summary?.riskReduction?.reduction || 0) });
    worksheet.addRow({ metric: 'Risk Reduction Percentage', value: `${(summary?.riskReduction?.reductionPercentage || 0).toFixed(1)}%` });

    // Risk Severity Breakdown
    if (summary?.riskBySeverity) {
      worksheet.addRow({ metric: '', value: '' });
      worksheet.addRow({ metric: 'Risk Severity Breakdown', value: '' }).font = { bold: true };
      worksheet.addRow({ metric: 'Critical Risks', value: summary.riskBySeverity.critical || 0 });
      worksheet.addRow({ metric: 'High Risks', value: summary.riskBySeverity.high || 0 });
      worksheet.addRow({ metric: 'Medium Risks', value: summary.riskBySeverity.medium || 0 });
      worksheet.addRow({ metric: 'Low Risks', value: summary.riskBySeverity.low || 0 });
    }

    // Control Implementation Status
    if (summary?.controlByStatus) {
      worksheet.addRow({ metric: '', value: '' });
      worksheet.addRow({ metric: 'Control Implementation Status', value: '' }).font = { bold: true };
      worksheet.addRow({ metric: 'Fully Implemented', value: summary.controlByStatus.implemented || 0 });
      worksheet.addRow({ metric: 'In Progress', value: summary.controlByStatus.inProgress || 0 });
      worksheet.addRow({ metric: 'Not Implemented', value: summary.controlByStatus.notImplemented || 0 });
    }

    // Control Type Breakdown
    if (summary?.controlByType) {
      worksheet.addRow({ metric: '', value: '' });
      worksheet.addRow({ metric: 'Control Type Breakdown', value: '' }).font = { bold: true };
      worksheet.addRow({ metric: 'Preventive', value: summary.controlByType.preventive || 0 });
      worksheet.addRow({ metric: 'Detective', value: summary.controlByType.detective || 0 });
      worksheet.addRow({ metric: 'Corrective', value: summary.controlByType.corrective || 0 });
    }
  }

  // Generate filename
  const fileName = `${reportType}_report_${new Date().toISOString().slice(0, 10)}.xlsx`;

  // Write buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
};
