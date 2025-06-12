import { db } from '../db';
import { risks, riskSummaries } from '../../shared/schema';
import { sql } from 'drizzle-orm';

/**
 * Automated Risk Summary Service
 * 
 * Automatically recalculates risk summaries when risks are created, updated, or deleted.
 * This service is triggered by database events and ensures dashboard data stays current.
 */
export class AutomatedRiskSummaryService {
  private static instance: AutomatedRiskSummaryService;
  private isRecalculating = false;
  private pendingRecalculation = false;

  static getInstance(): AutomatedRiskSummaryService {
    if (!AutomatedRiskSummaryService.instance) {
      AutomatedRiskSummaryService.instance = new AutomatedRiskSummaryService();
    }
    return AutomatedRiskSummaryService.instance;
  }

  /**
   * Trigger automatic recalculation (debounced to prevent multiple simultaneous runs)
   */
  async triggerRecalculation(): Promise<void> {
    if (this.isRecalculating) {
      this.pendingRecalculation = true;
      return;
    }

    try {
      this.isRecalculating = true;
      await this.recalculateRiskSummaries();
      
      // If another recalculation was requested while we were running, do it now
      if (this.pendingRecalculation) {
        this.pendingRecalculation = false;
        await this.recalculateRiskSummaries();
      }
    } finally {
      this.isRecalculating = false;
    }
  }

  /**
   * Core recalculation logic using direct SQL for performance
   */
  private async recalculateRiskSummaries(): Promise<void> {
    try {
      console.log('[AutoRiskSummary] Starting automated risk summary recalculation');
      
      // Get current risk statistics using a single SQL query
      const result = await db.execute(sql`
        SELECT 
          COUNT(*) as total_risks,
          COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical_risks,
          COUNT(CASE WHEN severity = 'high' THEN 1 END) as high_risks,
          COUNT(CASE WHEN severity = 'medium' THEN 1 END) as medium_risks,
          COUNT(CASE WHEN severity = 'low' THEN 1 END) as low_risks,
          COALESCE(SUM(inherent_risk), 0) as total_inherent_risk,
          COALESCE(SUM(residual_risk), 0) as total_residual_risk,
          COALESCE(MIN(residual_risk), 0) as minimum_exposure,
          COALESCE(MAX(residual_risk), 0) as maximum_exposure,
          COALESCE(AVG(residual_risk), 0) as mean_exposure,
          COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY residual_risk), 0) as median_exposure,
          COALESCE(PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY residual_risk), 0) as percentile_95_exposure,
          COALESCE(PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY residual_risk), 0) as percentile_99_exposure
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
          AND residual_risk IS NOT NULL;
      `);

      const stats = result.rows[0];
      if (!stats) {
        console.log('[AutoRiskSummary] No risk data found, creating empty summary');
        await this.createEmptyRiskSummary();
        return;
      }

      // Generate exposure curve data for visualization
      const exposureCurveData = await this.generateExposureCurveData();
      
      // Create new risk summary entry
      const now = new Date();
      await db.execute(sql`
        INSERT INTO risk_summaries (
          year, month, legal_entity_id,
          total_risks, critical_risks, high_risks, medium_risks, low_risks,
          total_inherent_risk, total_residual_risk,
          minimum_exposure, maximum_exposure, average_exposure,
          mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure,
          exposure_curve_data, created_at, updated_at
        ) VALUES (
          ${now.getFullYear()}, ${now.getMonth() + 1}, NULL,
          ${stats.total_risks}, ${stats.critical_risks}, ${stats.high_risks}, ${stats.medium_risks}, ${stats.low_risks},
          ${stats.total_inherent_risk}, ${stats.total_residual_risk},
          ${stats.minimum_exposure}, ${stats.maximum_exposure}, ${stats.mean_exposure},
          ${stats.mean_exposure}, ${stats.median_exposure}, ${stats.percentile_95_exposure}, ${stats.percentile_99_exposure},
          ${JSON.stringify(exposureCurveData)}::jsonb, ${now}, ${now}
        )
      `);

      console.log(`[AutoRiskSummary] Updated: ${stats.total_risks} risks, $${Number(stats.total_residual_risk).toLocaleString()} total exposure`);
      
    } catch (error) {
      console.error('[AutoRiskSummary] Error during recalculation:', error);
      throw error;
    }
  }

  /**
   * Generate exposure curve data for loss exceedance visualization
   */
  private async generateExposureCurveData(): Promise<Array<{impact: number, probability: number}>> {
    try {
      const result = await db.execute(sql`
        SELECT residual_risk
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
          AND residual_risk IS NOT NULL
          AND residual_risk > 0
        ORDER BY residual_risk DESC
      `);

      const exposures = result.rows.map(row => Number(row.residual_risk));
      
      if (exposures.length === 0) return [];

      // Create probability curve points
      const curveData: Array<{impact: number, probability: number}> = [];
      
      for (let i = 0; i < exposures.length; i++) {
        const probability = (i + 1) / exposures.length; // Probability of exceeding this impact
        const impact = exposures[i];
        curveData.push({ impact, probability });
      }

      return curveData.slice(0, 10); // Limit to 10 points for performance
      
    } catch (error) {
      console.error('[AutoRiskSummary] Error generating exposure curve:', error);
      return [];
    }
  }

  /**
   * Create empty risk summary when no risks exist
   */
  private async createEmptyRiskSummary(): Promise<void> {
    const now = new Date();
    await db.execute(sql`
      INSERT INTO risk_summaries (
        year, month, legal_entity_id,
        total_risks, critical_risks, high_risks, medium_risks, low_risks,
        total_inherent_risk, total_residual_risk,
        minimum_exposure, maximum_exposure, average_exposure,
        mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure,
        exposure_curve_data, created_at, updated_at
      ) VALUES (
        ${now.getFullYear()}, ${now.getMonth() + 1}, NULL,
        0, 0, 0, 0, 0,
        0, 0,
        0, 0, 0,
        0, 0, 0, 0,
        '[]'::jsonb, ${now}, ${now}
      )
    `);
  }

  /**
   * Clean up old risk summary entries (keep last 100)
   */
  async cleanupOldSummaries(): Promise<void> {
    try {
      await db.execute(sql`
        DELETE FROM risk_summaries 
        WHERE id NOT IN (
          SELECT id FROM risk_summaries 
          ORDER BY created_at DESC 
          LIMIT 100
        )
      `);
      console.log('[AutoRiskSummary] Cleaned up old summary entries');
    } catch (error) {
      console.error('[AutoRiskSummary] Error cleaning up old summaries:', error);
    }
  }
}

// Export singleton instance
export const automatedRiskSummary = AutomatedRiskSummaryService.getInstance();