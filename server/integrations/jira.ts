import JiraClient from 'jira-client';
import { storage } from '../services/storage';
import { InsertRisk, InsertActivityLog } from '@shared/schema';

export interface JiraConfig {
  host: string;
  username: string;
  password?: string;
  apiToken?: string;
  projectKey: string;
  riskIssueType?: string; // Issue type used for risks in JIRA
}

export class JiraIntegration {
  private jira: any; // Using any type since JiraClient doesn't provide proper type definitions
  private config: JiraConfig;

  constructor(config: JiraConfig) {
    this.config = config;
    
    // Initialize JIRA client
    this.jira = new JiraClient({
      protocol: 'https',
      host: config.host,
      username: config.username,
      password: config.password,
      apiVersion: '2',
      strictSSL: true,
      ...(config.apiToken && { apiToken: config.apiToken }),
    });
  }

  /**
   * Import risks from JIRA and map them to assets
   * Uses the "component" field in JIRA to map to asset names
   */
  async importRisksFromJira(): Promise<{
    imported: number;
    updated: number;
    errors: string[];
  }> {
    const result = {
      imported: 0,
      updated: 0,
      errors: [] as string[],
    };

    try {
      // Get all issues from the specified project that are considered risks
      const issueTypeFilter = this.config.riskIssueType 
        ? `AND issuetype = "${this.config.riskIssueType}"` 
        : '';

      const jql = `project = ${this.config.projectKey} ${issueTypeFilter} ORDER BY created DESC`;
      
      const response = await this.jira.searchJira(jql);

      if (!response || !response.issues || !Array.isArray(response.issues)) {
        result.errors.push('No issues found or invalid response from JIRA');
        return result;
      }

      // Get all assets to map by name
      const allAssets = await storage.getAllAssets();
      const assetsMap = new Map(allAssets.map(asset => [asset.name.toLowerCase(), asset]));

      // Process each issue
      for (const issue of response.issues) {
        try {
          const riskId = issue.key;
          const summary = issue.fields.summary;
          const description = issue.fields.description || '';

          // Extract core risk details
          const existingRisk = await storage.getRiskByRiskId(riskId);
          
          // Determine the asset from the component field
          const components = issue.fields.components || [];
          const componentNames = components.map((comp: any) => comp.name);
          
          // Find matching asset by component name
          let assetId = '';
          for (const componentName of componentNames) {
            const asset = assetsMap.get(componentName.toLowerCase());
            if (asset) {
              assetId = asset.assetId;
              break;
            }
          }

          if (!assetId) {
            result.errors.push(`No matching asset found for risk ${riskId} with components: ${componentNames.join(', ')}`);
            continue;
          }

          // Create risk data object with basic information from JIRA
          // FAIR-U parameters will be set with default values since they're not available in JIRA
          const riskData: InsertRisk = {
            riskId,
            name: summary,
            description,
            associatedAssets: [assetId], // Connect with the asset
            threatCommunity: 'External hackers', // Default value
            vulnerability: 'System vulnerability', // Default value
            riskCategory: 'operational', // Default value
            severity: 'medium', // Default value
            
            // Set default FAIR-U parameters that will need to be updated later in the app
            // Default values for Contact Frequency (CF)
            contactFrequencyMin: 10,
            contactFrequencyAvg: 12,
            contactFrequencyMax: 16,
            contactFrequencyConfidence: 'Low', // Low confidence since it's just a default
            
            // Default values for Probability of Action (POA)
            probabilityOfActionMin: 0.2,
            probabilityOfActionAvg: 0.3,
            probabilityOfActionMax: 0.4,
            probabilityOfActionConfidence: 'Low',
            
            // Default calculated values for Threat Event Frequency (TEF)
            threatEventFrequencyMin: 2,
            threatEventFrequencyAvg: 3.6,
            threatEventFrequencyMax: 6.4,
            threatEventFrequencyConfidence: 'Low',
            
            // Default values for Threat Capability (TCap)
            threatCapabilityMin: 0.4,
            threatCapabilityAvg: 0.5,
            threatCapabilityMax: 0.6,
            threatCapabilityConfidence: 'Low',
            
            // Default values for Resistance Strength (RS)
            resistanceStrengthMin: 0.4,
            resistanceStrengthAvg: 0.5,
            resistanceStrengthMax: 0.6,
            resistanceStrengthConfidence: 'Low',
            
            // Default values for Susceptibility (Susc)
            susceptibilityMin: 0.4,
            susceptibilityAvg: 0.5,
            susceptibilityMax: 0.6,
            susceptibilityConfidence: 'Low',
            
            // Default values for Loss Event Frequency (LEF)
            lossEventFrequencyMin: 0.8,
            lossEventFrequencyAvg: 1.8,
            lossEventFrequencyMax: 3.8,
            lossEventFrequencyConfidence: 'Low',
            
            // Default values for Primary Loss Magnitude (PL)
            primaryLossMagnitudeMin: 30000,
            primaryLossMagnitudeAvg: 50000,
            primaryLossMagnitudeMax: 80000,
            primaryLossMagnitudeConfidence: 'Low',
            
            // Default values for Secondary Loss Event Frequency (SLEF)
            secondaryLossEventFrequencyMin: 0.3,
            secondaryLossEventFrequencyAvg: 0.5,
            secondaryLossEventFrequencyMax: 0.7,
            secondaryLossEventFrequencyConfidence: 'Low',
            
            // Default values for Secondary Loss Magnitude (SLM)
            secondaryLossMagnitudeMin: 5000,
            secondaryLossMagnitudeAvg: 10000,
            secondaryLossMagnitudeMax: 15000,
            secondaryLossMagnitudeConfidence: 'Low',
            
            // Default values for Loss Magnitude (LM)
            lossMagnitudeMin: 31500,
            lossMagnitudeAvg: 55000,
            lossMagnitudeMax: 90500,
            lossMagnitudeConfidence: 'Low',
            
            // Risk values will be recalculated
            inherentRisk: 0,
            residualRisk: 0,
            rankPercentile: 0
          };

          let risk;
          if (existingRisk) {
            // Update existing risk
            risk = await storage.updateRisk(existingRisk.id, riskData);
            if (risk) {
              result.updated++;
            }
          } else {
            // Create new risk
            risk = await storage.createRisk(riskData);
            if (risk) {
              result.imported++;
            }
          }

          // Log activity
          if (risk) {
            const activityLog: InsertActivityLog = {
              activity: `Risk ${existingRisk ? 'updated' : 'imported'} from JIRA: ${riskId}`,
              user: 'SYSTEM',
              entity: risk.name,
              entityType: 'risk',
              entityId: String(risk.id)
            };
            
            await storage.createActivityLog(activityLog);
          }
        } catch (err: any) {
          result.errors.push(`Error processing issue ${issue.key}: ${err.message}`);
        }
      }

      return result;
    } catch (err: any) {
      result.errors.push(`JIRA API Error: ${err.message}`);
      return result;
    }
  }
}

// Create a singleton instance with default empty config
let jiraIntegration: JiraIntegration | null = null;

export function initializeJiraIntegration(config: JiraConfig): JiraIntegration {
  jiraIntegration = new JiraIntegration(config);
  return jiraIntegration;
}

export function getJiraIntegration(): JiraIntegration | null {
  return jiraIntegration;
}