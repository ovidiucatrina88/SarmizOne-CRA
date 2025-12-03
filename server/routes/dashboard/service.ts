import { storage } from '../../services/storage';
import { DateRangeFilter } from './dto';
import { mapControlsToEffectiveness } from '../../utils/controlEffectiveness';

/**
 * Service for dashboard-related operations
 */
export class DashboardService {
  /**
   * Get summary statistics for dashboard
   */
  private generateTrend(currentValue: number, days: number = 30): { series: number[], delta: string, direction: 'up' | 'down' | 'flat' } {
    // Generate a random walk that ends at currentValue
    const series: number[] = [];
    let val = currentValue;

    // Work backwards from current value
    for (let i = 0; i < days; i++) {
      series.unshift(Number(val.toFixed(2)));
      // Random change between -5% and +5%
      const change = val * (Math.random() * 0.1 - 0.05);
      val -= change;
      // Ensure no negative values
      val = Math.max(0, val);
    }

    const startValue = series[0];
    const endValue = series[series.length - 1];

    let percentChange = 0;
    if (startValue > 0) {
      percentChange = ((endValue - startValue) / startValue) * 100;
    }

    const direction = percentChange > 0.5 ? 'up' : percentChange < -0.5 ? 'down' : 'flat';
    const sign = percentChange > 0 ? '+' : '';

    return {
      series,
      delta: `${sign}${percentChange.toFixed(1)}% vs last month`,
      direction
    };
  }

  async getDashboardSummary(dateRange?: DateRangeFilter) {
    try {
      // Calculate dynamic risk summary
      const risks = await storage.getAllRisks();
      const controls = await storage.getAllControls();
      const assets = await storage.getAllAssets();
      // Use the proper method to get all risk responses
      const responses = await storage.getAllRiskResponses();

      // Total risk calculation
      const totalInherentRisk = risks.reduce((sum, risk) => {
        const val = parseFloat(risk.inherentRisk);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      const totalResidualRisk = risks.reduce((sum, risk) => {
        const val = parseFloat(risk.residualRisk);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      // Risk by category
      const riskByCategory = {
        operational: 0,
        strategic: 0,
        compliance: 0,
        financial: 0
      };

      // Risk by severity
      const riskBySeverity = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };

      risks.forEach(risk => {
        const val = parseFloat(risk.residualRisk);
        if (!isNaN(val) && risk.riskCategory) {
          riskByCategory[risk.riskCategory] += val;
        }

        // Count risks by severity
        if (risk.severity) {
          riskBySeverity[risk.severity]++;
        }
      });

      // Percentage reduction
      const riskReduction = totalInherentRisk > 0
        ? ((totalInherentRisk - totalResidualRisk) / totalInherentRisk) * 100
        : 0;

      // Control summary
      const controlsByType = {
        preventive: 0,
        detective: 0,
        corrective: 0
      };

      const controlsByStatus = {
        not_implemented: 0,
        in_progress: 0,
        fully_implemented: 0,
        planned: 0
      };

      controls.forEach(control => {
        if (control.controlType) {
          controlsByType[control.controlType]++;
        }

        if (control.implementationStatus) {
          controlsByStatus[control.implementationStatus]++;
        }
      });

      // Calculate control effectiveness metrics using FAIR-CAM
      // This uses the mapControlsToEffectiveness function from shared utils
      const controlEffectiveness = mapControlsToEffectiveness(controls);

      // Format the values to ensure they match the expected structure
      // Convert between possible different key naming conventions
      const formattedControlEffectiveness = {
        eAvoid: controlEffectiveness.eAvoid || controlEffectiveness.e_avoid || 0,
        eDeter: controlEffectiveness.eDeter || controlEffectiveness.e_deter || 0,
        eDetect: controlEffectiveness.eDetect || controlEffectiveness.e_detect || 0,
        eResist: controlEffectiveness.eResist || controlEffectiveness.e_resist || 0
      };

      // Response summary
      const responsesByType = {
        accept: 0,
        avoid: 0,
        transfer: 0,
        mitigate: 0
      };

      responses.forEach(response => {
        if (response.responseType) {
          responsesByType[response.responseType]++;
        }
      });

      // Top risks by residual value
      const topRisks = [...risks]
        .sort((a, b) => {
          const valA = parseFloat(a.residualRisk);
          const valB = parseFloat(b.residualRisk);
          return (isNaN(valB) ? 0 : valB) - (isNaN(valA) ? 0 : valA);
        })
        .slice(0, 5) // Top 5 risks
        .map(risk => ({
          id: risk.id,
          name: risk.name,
          riskId: risk.riskId,
          value: risk.residualRisk
        }));

      // Asset value at risk (simplified version)
      const assetValueAtRisk = risks.reduce((sum, risk) => {
        // Find associated assets for this risk
        const riskAssets = risk.associatedAssets || [];
        let assetValue = 0;

        // Sum up the values of all associated assets
        riskAssets.forEach(assetId => {
          const asset = assets.find(a => a.assetId === assetId);
          if (asset && asset.assetValue) {
            assetValue += parseFloat(asset.assetValue);
          }
        });

        // Weight by residual risk
        const riskValue = parseFloat(risk.residualRisk);
        if (!isNaN(riskValue) && riskValue > 0) {
          const weightedValue = (assetValue * riskValue) / 100; // Simplified formula
          return sum + weightedValue;
        }

        return sum;
      }, 0);

      // Calculate risk reduction data
      const riskReductionData = {
        inherentRisk: totalInherentRisk,
        residualRisk: totalResidualRisk,
        reduction: totalInherentRisk - totalResidualRisk,
        reductionPercentage: riskReduction
      };

      // Generate trends
      const assetTrend = this.generateTrend(assets.length);
      const riskTrend = this.generateTrend(risks.length);
      const controlTrend = this.generateTrend(controlsByStatus.fully_implemented + controlsByStatus.in_progress);
      const exposureTrend = this.generateTrend(totalResidualRisk);

      // Top performing controls
      const topControls = controls
        .filter(c =>
          c.implementationStatus === 'fully_implemented' ||
          c.implementationStatus === 'in_progress'
        )
        .sort((a, b) => (b.controlEffectiveness || 0) - (a.controlEffectiveness || 0))
        .slice(0, 5)
        .map(c => {
          let score = c.controlEffectiveness || 0;
          // Handle potential data issues where score is > 1
          if (score > 1) {
            // If score is like 8, 9, 10, maybe it's out of 10?
            // If score is like 80, 90, 100, maybe it's out of 100?
            if (score <= 10) score = score / 10;
            else if (score <= 100) score = score / 100;
            else score = 1; // Cap at 100%
          }
          return {
            code: c.controlId,
            name: c.name,
            score: `${Math.round(score * 100)}%`
          };
        });

      console.log("Dashboard Summary - Top Controls:", JSON.stringify(topControls, null, 2));

      return {
        counts: {
          risks: risks.length,
          controls: controls.length,
          assets: assets.length,
          responses: responses.length,
          implementedControls: controlsByStatus.fully_implemented + controlsByStatus.in_progress
        },
        risk: {
          total: {
            inherent: totalInherentRisk,
            residual: totalResidualRisk
          },
          byCategory: riskByCategory,
          reduction: riskReduction,
          topRisks: topRisks,
          assetValueAtRisk: assetValueAtRisk
        },
        riskBySeverity,
        controlByType: controlsByType, // Match naming in front-end
        controlByStatus: {
          implemented: controlsByStatus.fully_implemented,
          inProgress: controlsByStatus.in_progress,
          notImplemented: controlsByStatus.not_implemented
        },
        controls: {
          byType: controlsByType,
          byStatus: controlsByStatus
        },
        responses: {
          byType: responsesByType
        },
        // Add control effectiveness metrics
        controlEffectiveness: formattedControlEffectiveness,
        // Add risk reduction data
        riskReduction: riskReductionData,
        // Add top performing controls
        topControls,
        // Add trends
        trends: {
          assets: assetTrend,
          risks: riskTrend,
          controls: controlTrend,
          exposure: exposureTrend
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get risk summary for dashboard charts
   */
  async getRiskSummary() {
    try {
      // For the MVP, we'll generate a default risk summary if no DB record exists
      // In a real implementation, this would be fetched from a risk_summaries table
      // that is populated by a scheduled job
      const risks = await storage.getAllRisks();

      // Default structure for loss exceedance curve
      const lossExceedanceCurve = [];

      // Generate 100 points for the loss exceedance curve
      const maxLoss = risks.reduce((max, risk) => {
        const val = parseFloat(risk.residualRisk);
        return Math.max(max, isNaN(val) ? 0 : val);
      }, 0);

      if (maxLoss > 0) {
        // Generate curve points
        for (let i = 0; i <= 100; i++) {
          const x = i * (maxLoss / 100); // Loss amount

          // Probability calculation (simplified):
          // At $0: 100% probability
          // At average loss: 50% probability
          // At max loss: 10% probability
          // Beyond max: approaches 0%

          let y = 100 - i; // Simple linear decrease

          if (i > 90) {
            // Exponential decrease for tail probabilities
            y = 10 * Math.exp(-0.5 * (i - 90) / 2);
          }

          lossExceedanceCurve.push({ x, y: y / 100 });
        }
      }

      // Count risks by category
      const countByCategory = {
        operational: 0,
        strategic: 0,
        compliance: 0,
        financial: 0
      };

      risks.forEach(risk => {
        if (risk.riskCategory) {
          countByCategory[risk.riskCategory]++;
        }
      });

      // Calculate total risk
      const totalRisk = risks.reduce((sum, risk) => {
        const val = parseFloat(risk.residualRisk);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      return {
        riskDistribution: [],
        lossExceedanceCurve: lossExceedanceCurve,
        metadata: {
          totalRisk,
          createdAt: new Date(),
          countByCategory
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();