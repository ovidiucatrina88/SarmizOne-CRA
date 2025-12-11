import { db } from '../db';
import { risks, riskSummaries, type InsertRiskSummary } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

export class RiskSummaryService {
  /**
   * Calculate exposure statistics from risk data
   */
  /**
   * Calculate exposure statistics from risk data using Monte Carlo simulation
   */
  public calculateExposureStatistics(risks: any[]) {
    if (risks.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        p10: 0,
        median: 0,
        p90: 0,
        p95: 0,
        p99: 0
      };
    }

    // Helper for Triangular distribution
    const triangular = (min: number, mode: number, max: number): number => {
      const u = Math.random();
      const c = (mode - min) / (max - min);
      if (u < c) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
      } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
      }
    };

    // Number of iterations for Monte Carlo simulation
    const ITERATIONS = 1000;
    const portfolioResults: number[] = [];

    // Perform simulation
    for (let i = 0; i < ITERATIONS; i++) {
      let iterationTotalRisk = 0;

      for (const risk of risks) {
        // Determine the distribution parameters for this risk
        // Priority: 
        // 1. Explicit parameters (if available)
        // 2. Residual risk (as mode) with default spread
        // 3. Inherent risk (as mode) with default spread

        let min = 0, mode = 0, max = 0;

        // Try to get values from parameters
        if (risk.parameters && risk.parameters.primaryLossMagnitude) {
          // If we have full FAIR parameters, use them
          // Note: This is a simplification. Ideally we'd simulate the full FAIR chain for each risk
          // But for portfolio aggregation, we can approximate by sampling the loss magnitude
          // multiplied by the probability of loss event.

          // However, to keep it consistent with the current "Residual Risk" value being displayed,
          // we should center the distribution around the calculated residual risk.

          const residual = parseFloat(risk.residualRisk || '0');
          if (residual > 0) {
            min = residual * 0.7;  // Default spread if not explicitly defined
            mode = residual;
            max = residual * 1.3;
          }
        } else {
          // Fallback to simple residual risk value
          const residual = parseFloat(risk.residualRisk || risk.inherentRisk || '0');
          if (residual > 0) {
            // Create a synthetic distribution around the point value
            // We assume some uncertainty exists
            min = residual * 0.8;
            mode = residual;
            max = residual * 1.5; // Skewed slightly right for risk
          }
        }

        // If we have a valid risk value, sample from it
        if (mode > 0) {
          // Ensure min <= mode <= max
          min = Math.min(min, mode);
          max = Math.max(max, mode);

          if (min === max) {
            iterationTotalRisk += mode;
          } else {
            iterationTotalRisk += triangular(min, mode, max);
          }
        }
      }

      portfolioResults.push(iterationTotalRisk);
    }

    // Sort results to calculate percentiles
    portfolioResults.sort((a, b) => a - b);

    // Calculate percentiles
    const getPercentile = (arr: number[], percentile: number) => {
      const index = (percentile / 100) * (arr.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index % 1;

      if (upper >= arr.length) return arr[arr.length - 1];
      return arr[lower] * (1 - weight) + arr[upper] * weight;
    };

    const sum = portfolioResults.reduce((a, b) => a + b, 0);
    const avg = sum / portfolioResults.length;

    return {
      min: portfolioResults[0],
      max: portfolioResults[portfolioResults.length - 1],
      avg,
      p10: getPercentile(portfolioResults, 10),
      median: getPercentile(portfolioResults, 50),
      p90: getPercentile(portfolioResults, 90),
      p95: getPercentile(portfolioResults, 95),
      p99: getPercentile(portfolioResults, 99)
    };
  }

  /**
   * Get risks filtered by legal entity if specified
   */
  private async getRisksForEntity(legalEntityId?: string) {
    const allRisks = await db.select().from(risks);
    console.log(`[RiskSummary] Found ${allRisks.length} total risks`);

    // Filter out template risks - only count instance risks
    const instanceRisks = allRisks.filter(r => r.itemType === 'instance' || !r.itemType);
    console.log(`[RiskSummary] After filtering instances: ${instanceRisks.length} risks`);

    if (!legalEntityId) {
      return instanceRisks;
    }

    // Filter risks by legal entity if needed
    // This would require additional logic based on how risks are associated with legal entities
    return instanceRisks;
  }

  /**
   * Generate exposure curve data for loss exceedance visualization
   */
  private generateExposureCurveData(risks: any[]): Array<{ probability: number, impact: number }> {
    if (risks.length === 0) return [];

    // Extract residual risk values and sort them
    const residualRisks = risks
      .map(r => parseFloat(r.residualRisk) || 0)
      .filter(v => v > 0)
      .sort((a, b) => b - a); // Sort descending for exceedance curve

    if (residualRisks.length === 0) return [];

    // Generate curve points (probability of exceeding vs impact level)
    const curveData: Array<{ probability: number, impact: number }> = [];

    for (let i = 0; i < residualRisks.length; i++) {
      const probability = (i + 1) / residualRisks.length; // Probability of exceeding this value
      const impact = residualRisks[i];
      curveData.push({ probability, impact });
    }

    return curveData;
  }

  /**
   * Update risk summaries for a specific legal entity or globally
   */
  async updateRiskSummaries(legalEntityId?: string): Promise<void> {
    try {
      const riskData = await this.getRisksForEntity(legalEntityId);
      console.log(`DEBUG: getRisksForEntity returned ${riskData.length} risks:`, riskData.map(r => ({ id: r.id, riskId: r.riskId, severity: r.severity, inherentRisk: r.inherentRisk, residualRisk: r.residualRisk })));

      const stats = this.calculateExposureStatistics(riskData);
      console.log(`DEBUG: calculateExposureStatistics returned:`, stats);

      // Calculate risk counts by severity
      const totalRisks = riskData.length;
      const criticalRisks = riskData.filter(r => r.severity === 'critical').length;
      const highRisks = riskData.filter(r => r.severity === 'high').length;
      const mediumRisks = riskData.filter(r => r.severity === 'medium').length;
      const lowRisks = riskData.filter(r => r.severity === 'low').length;

      console.log(`DEBUG: Risk counts - total: ${totalRisks}, critical: ${criticalRisks}, high: ${highRisks}, medium: ${mediumRisks}, low: ${lowRisks}`);

      // Calculate total risk values
      const totalInherentRisk = riskData.reduce((sum, r) => sum + (parseFloat(r.inherentRisk) || 0), 0);
      const totalResidualRisk = riskData.reduce((sum, r) => sum + (parseFloat(r.residualRisk) || 0), 0);

      // Generate exposure curve data
      const exposureCurveData = this.generateExposureCurveData(riskData);

      const now = new Date();
      const summaryData = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        legalEntityId: legalEntityId || null,

        // Risk count metrics
        totalRisks,
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,

        // Risk value metrics
        totalInherentRisk,
        totalResidualRisk,

        // Exposure statistics for loss exceedance curve
        minimumExposure: stats.min,
        maximumExposure: stats.max,
        meanExposure: stats.avg,
        medianExposure: stats.median,
        percentile95Exposure: stats.p95,
        percentile99Exposure: stats.p99,

        // Exposure curve data for visualization
        exposureCurveData: exposureCurveData,

        // Legacy compatibility fields
        averageExposure: stats.avg,
        tenthPercentileExposure: stats.p10,
        mostLikelyExposure: stats.median,
        ninetiethPercentileExposure: stats.p90
      };

      await db.insert(riskSummaries).values(summaryData);

      console.log(`Risk summary updated: entity=${legalEntityId || 'global'}, risks=${totalRisks}, critical=${criticalRisks}, high=${highRisks}, totalResidual=${totalResidualRisk}`);
    } catch (error) {
      console.error('Error updating risk summaries:', error);
      throw error;
    }
  }

  /**
   * Get the latest risk summary
   */
  async getLatestRiskSummary(legalEntityId?: string) {
    try {
      let query = db
        .select()
        .from(riskSummaries)
        .orderBy(desc(riskSummaries.createdAt))
        .limit(1);

      if (legalEntityId) {
        const results = await db
          .select()
          .from(riskSummaries)
          .where(eq(riskSummaries.legalEntityId, legalEntityId))
          .orderBy(desc(riskSummaries.createdAt))
          .limit(1);
        return results.length > 0 ? results[0] : null;
      }

      const results = await query;
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error fetching latest risk summary:', error);
      return null;
    }
  }

  /**
   * Force recalculation of all risk summaries
   */
  async recalculateAllSummaries(): Promise<void> {
    try {
      // Update global summary
      await this.updateRiskSummaries();

      // You could also update per legal entity if needed
      // const entities = await db.select().from(legalEntities);
      // for (const entity of entities) {
      //   await this.updateRiskSummaries(entity.entityId);
      // }

      console.log('All risk summaries recalculated successfully');
    } catch (error) {
      console.error('Error recalculating risk summaries:', error);
      throw error;
    }
  }
}

export const riskSummaryService = new RiskSummaryService();