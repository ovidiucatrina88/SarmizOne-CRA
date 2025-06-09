import * as XLSX from 'xlsx';
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
  const wb = XLSX.utils.book_new();
  
  if (reportType === 'summary' || reportType === 'risks') {
    // Risk Register Sheet
    if (risks && risks.length > 0) {
      const risksData = risks.map((risk: Risk) => ({
        'Risk ID': risk.riskId,
        'Name': risk.name,
        'Category': risk.riskCategory.charAt(0).toUpperCase() + risk.riskCategory.slice(1),
        'Severity': risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1),
        'Threat Community': risk.threatCommunity,
        'Vulnerability': risk.vulnerability,
        'Contact Frequency': risk.contactFrequency?.toFixed(2) || '0',
        'Probability of Action': risk.probabilityOfAction ? `${(risk.probabilityOfAction * 100).toFixed(0)}%` : '0%',
        'Threat Capability': risk.threatCapability?.toFixed(1) || '0',
        'Probable Loss Magnitude': formatCurrency(risk.probableLossMagnitude || 0),
        'Inherent Risk': formatCurrency(risk.inherentRisk || 0),
        'Residual Risk': formatCurrency(risk.residualRisk || 0),
        'Risk Reduction': risk.inherentRisk && risk.residualRisk 
          ? formatCurrency(risk.inherentRisk - risk.residualRisk) 
          : '$0',
        'Risk Reduction %': risk.inherentRisk && risk.residualRisk && risk.inherentRisk > 0
          ? `${((risk.inherentRisk - risk.residualRisk) / risk.inherentRisk * 100).toFixed(1)}%`
          : '0%',
        'Associated Assets': risk.associatedAssets ? risk.associatedAssets.join(', ') : ''
      }));
      
      const riskWs = XLSX.utils.json_to_sheet(risksData);
      XLSX.utils.book_append_sheet(wb, riskWs, 'Risk Register');
    }
  }
  
  if (reportType === 'summary' || reportType === 'assets') {
    // Asset Inventory Sheet
    if (assets && assets.length > 0) {
      const assetsData = assets.map((asset: Asset) => ({
        'Asset ID': asset.assetId,
        'Name': asset.name,
        'Type': asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
        'Business Unit': asset.businessUnit,
        'Owner': asset.owner,
        'Confidentiality': asset.confidentiality.charAt(0).toUpperCase(),
        'Integrity': asset.integrity.charAt(0).toUpperCase(),
        'Availability': asset.availability.charAt(0).toUpperCase(),
        'Asset Value': formatCurrency(asset.assetValue),
        'Location': asset.externalInternal.charAt(0).toUpperCase() + asset.externalInternal.slice(1),
        'Regulatory Impact': asset.regulatoryImpact ? asset.regulatoryImpact.join(', ') : '',
        'Dependencies': asset.dependencies ? asset.dependencies.join(', ') : '',
        'Description': asset.description || ''
      }));
      
      const assetWs = XLSX.utils.json_to_sheet(assetsData);
      XLSX.utils.book_append_sheet(wb, assetWs, 'Asset Inventory');
    }
  }
  
  if (reportType === 'summary' || reportType === 'controls') {
    // Control Library Sheet
    if (controls && controls.length > 0) {
      const controlsData = controls.map((control: Control) => ({
        'Control ID': control.controlId,
        'Name': control.name,
        'Type': control.controlType.charAt(0).toUpperCase() + control.controlType.slice(1),
        'Category': control.controlCategory.charAt(0).toUpperCase() + control.controlCategory.slice(1),
        'Status': formatImplementationStatus(control.implementationStatus),
        'Effectiveness': `${control.controlEffectiveness.toFixed(1)}/10`,
        'Cost': formatCurrency(control.implementationCost || 0),
        'Associated Risks': control.associatedRisks ? control.associatedRisks.join(', ') : '',
        'Description': control.description || '',
        'Notes': control.notes || ''
      }));
      
      const controlWs = XLSX.utils.json_to_sheet(controlsData);
      XLSX.utils.book_append_sheet(wb, controlWs, 'Control Library');
    }
  }
  
  if (reportType === 'summary' || reportType === 'responses') {
    // Risk Response Sheet
    if (responses && responses.length > 0) {
      // Get risk name from risk ID
      const getRiskName = (riskId: string): string => {
        if (!risks) return "Unknown Risk";
        const risk = risks.find((r: Risk) => r.riskId === riskId);
        return risk ? risk.name : "Unknown Risk";
      };
      
      const responsesData = responses.map((response: RiskResponse) => {
        // Create a base object for all response types
        const baseResponse: any = {
          'Risk ID': response.riskId,
          'Risk Name': getRiskName(response.riskId),
          'Response Type': response.responseType.charAt(0).toUpperCase() + response.responseType.slice(1),
          'Justification': response.justification || '',
        };
        
        // Add response type specific fields
        if (response.responseType === 'mitigate') {
          baseResponse['Assigned Controls'] = response.assignedControls ? response.assignedControls.join(', ') : '';
          baseResponse['Transfer Method'] = 'N/A';
          baseResponse['Avoidance Strategy'] = 'N/A';
          baseResponse['Acceptance Reason'] = 'N/A';
        } else if (response.responseType === 'transfer') {
          baseResponse['Assigned Controls'] = 'N/A';
          baseResponse['Transfer Method'] = response.transferMethod || '';
          baseResponse['Avoidance Strategy'] = 'N/A';
          baseResponse['Acceptance Reason'] = 'N/A';
        } else if (response.responseType === 'avoid') {
          baseResponse['Assigned Controls'] = 'N/A';
          baseResponse['Transfer Method'] = 'N/A';
          baseResponse['Avoidance Strategy'] = response.avoidanceStrategy || '';
          baseResponse['Acceptance Reason'] = 'N/A';
        } else if (response.responseType === 'accept') {
          baseResponse['Assigned Controls'] = 'N/A';
          baseResponse['Transfer Method'] = 'N/A';
          baseResponse['Avoidance Strategy'] = 'N/A';
          baseResponse['Acceptance Reason'] = response.acceptanceReason || '';
        }
        
        return baseResponse;
      });
      
      const responseWs = XLSX.utils.json_to_sheet(responsesData);
      XLSX.utils.book_append_sheet(wb, responseWs, 'Risk Responses');
    }
  }
  
  if (reportType === 'summary') {
    // Summary Sheet
    const summaryData = [
      { 'Metric': 'Total Assets', 'Value': assets?.length || 0 },
      { 'Metric': 'Identified Risks', 'Value': risks?.length || 0 },
      { 'Metric': 'Implemented Controls', 'Value': Array.isArray(controls) ? controls.filter((c: Control) => c.implementationStatus === 'fully_implemented').length : 0 },
      { 'Metric': 'Risk Exposure', 'Value': formatCurrency(summary?.counts?.riskExposure || 0) },
      { 'Metric': 'Inherent Risk', 'Value': formatCurrency(summary?.riskReduction?.inherentRisk || 0) },
      { 'Metric': 'Residual Risk', 'Value': formatCurrency(summary?.riskReduction?.residualRisk || 0) },
      { 'Metric': 'Risk Reduction', 'Value': formatCurrency(summary?.riskReduction?.reduction || 0) },
      { 'Metric': 'Risk Reduction Percentage', 'Value': `${(summary?.riskReduction?.reductionPercentage || 0).toFixed(1)}%` }
    ];
    
    // Risk Severity Breakdown
    if (summary?.riskBySeverity) {
      summaryData.push({ 'Metric': '', 'Value': '' });
      summaryData.push({ 'Metric': 'Risk Severity Breakdown', 'Value': '' });
      summaryData.push({ 'Metric': 'Critical Risks', 'Value': summary.riskBySeverity.critical || 0 });
      summaryData.push({ 'Metric': 'High Risks', 'Value': summary.riskBySeverity.high || 0 });
      summaryData.push({ 'Metric': 'Medium Risks', 'Value': summary.riskBySeverity.medium || 0 });
      summaryData.push({ 'Metric': 'Low Risks', 'Value': summary.riskBySeverity.low || 0 });
    }
    
    // Control Implementation Status
    if (summary?.controlByStatus) {
      summaryData.push({ 'Metric': '', 'Value': '' });
      summaryData.push({ 'Metric': 'Control Implementation Status', 'Value': '' });
      summaryData.push({ 'Metric': 'Fully Implemented', 'Value': summary.controlByStatus.implemented || 0 });
      summaryData.push({ 'Metric': 'In Progress', 'Value': summary.controlByStatus.inProgress || 0 });
      summaryData.push({ 'Metric': 'Not Implemented', 'Value': summary.controlByStatus.notImplemented || 0 });
    }
    
    // Control Type Breakdown
    if (summary?.controlByType) {
      summaryData.push({ 'Metric': '', 'Value': '' });
      summaryData.push({ 'Metric': 'Control Type Breakdown', 'Value': '' });
      summaryData.push({ 'Metric': 'Preventive', 'Value': summary.controlByType.preventive || 0 });
      summaryData.push({ 'Metric': 'Detective', 'Value': summary.controlByType.detective || 0 });
      summaryData.push({ 'Metric': 'Corrective', 'Value': summary.controlByType.corrective || 0 });
    }
    
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
  }
  
  // Generate filename
  const fileName = `${reportType}_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  
  // Write the workbook and trigger download
  XLSX.writeFile(wb, fileName);
};
