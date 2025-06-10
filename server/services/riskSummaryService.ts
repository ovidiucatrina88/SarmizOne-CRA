import { db } from '../db';
import { risks, riskSummaries, type InsertRiskSummary } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

export class RiskSummaryService {
  /**
   * Calculate exposure statistics from risk data
   */
  private calculateExposureStatistics(risks: any[]) {
    const exposures = risks
      .map(risk => parseFloat(risk.residualRisk || risk.inherentRisk || '0'))
      .filter(exposure => exposure > 0)
      .sort((a, b) => a - b);

    if (exposures.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        p10: 0,
        median: 0,
        p90: 0
      };
    }

    const sum = exposures.reduce((a, b) => a + b, 0);
    const avg = sum / exposures.length;
    
    // Calculate percentiles
    const getPercentile = (arr: number[], percentile: number) => {
      const index = (percentile / 100) * (arr.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index % 1;
      
      if (upper >= arr.length) return arr[arr.length - 1];
      return arr[lower] * (1 - weight) + arr[upper] * weight;
    };

    return {
      min: Math.min(...exposures),
      max: Math.max(...exposures),
      avg,
      p10: getPercentile(exposures, 10),
      median: getPercentile(exposures, 50),
      p90: getPercentile(exposures, 90),
      p95: getPercentile(exposures, 95),
      p99: getPercentile(exposures, 99)
    };
  }

  /**
   * Get risks filtered by legal entity if specified
   */
  private async getRisksForEntity(legalEntityId?: string) {
    const allRisks = await db.select().from(risks);
    
    if (!legalEntityId) {
      return allRisks;
    }

    // Filter risks by legal entity if needed
    // This would require additional logic based on how risks are associated with legal entities
    return allRisks;
  }

  /**
   * Generate exposure curve data for loss exceedance visualization
   */
  private generateExposureCurveData(risks: any[]): Array<{probability: number, impact: number}> {
    if (risks.length === 0) return [];
    
    // Extract residual risk values and sort them
    const residualRisks = risks
      .map(r => parseFloat(r.residualRisk) || 0)
      .filter(v => v > 0)
      .sort((a, b) => b - a); // Sort descending for exceedance curve
    
    if (residualRisks.length === 0) return [];
    
    // Generate curve points (probability of exceeding vs impact level)
    const curveData: Array<{probability: number, impact: number}> = [];
    
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
      const summaryData: InsertRiskSummary = {
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
        exposureCurveData: JSON.stringify(exposureCurveData),
        
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