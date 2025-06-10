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
      p90: getPercentile(exposures, 90)
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
   * Update risk summaries for a specific legal entity or globally
   */
  async updateRiskSummaries(legalEntityId?: string): Promise<void> {
    try {
      const riskData = await this.getRisksForEntity(legalEntityId);
      const stats = this.calculateExposureStatistics(riskData);
      
      const now = new Date();
      const summaryData: InsertRiskSummary = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        legalEntityId: legalEntityId || null,
        minimumExposure: stats.min,
        maximumExposure: stats.max,
        averageExposure: stats.avg,
        tenthPercentileExposure: stats.p10,
        mostLikelyExposure: stats.median,
        ninetiethPercentileExposure: stats.p90
      };

      await db.insert(riskSummaries).values(summaryData);
      
      console.log(`Risk summary updated: entity=${legalEntityId || 'global'}, risks=${riskData.length}, max=${stats.max}`);
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