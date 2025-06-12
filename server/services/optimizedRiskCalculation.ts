/**
 * Optimized Risk Calculation Service
 * Reduces database queries and improves performance for risk calculations
 */

import { db } from '../db';
import { risks, riskSummaries } from '../../shared/schema';
import { eq, sql, desc, and } from 'drizzle-orm';

export class OptimizedRiskCalculationService {
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached result or execute query
   */
  private async getCached<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const expiry = this.cacheExpiry.get(key);
    
    if (expiry && now < expiry && this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = await queryFn();
    this.cache.set(key, result);
    this.cacheExpiry.set(key, now + this.CACHE_TTL);
    
    return result;
  }

  /**
   * Clear cache for specific patterns
   */
  private clearCachePattern(pattern: string) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  /**
   * Optimized risk aggregation with single query
   */
  async calculateAggregatedRiskExposure(): Promise<{
    totalRisks: number;
    totalInherentRisk: number;
    totalResidualRisk: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    exposureCurveData: Array<{ impact: number; probability: number }>;
    minimumExposure: number;
    maximumExposure: number;
    meanExposure: number;
    medianExposure: number;
    percentile10Exposure: number;
    percentile25Exposure: number;
    percentile50Exposure: number;
    percentile75Exposure: number;
    percentile90Exposure: number;
    percentile95Exposure: number;
    percentile99Exposure: number;
  }> {
    return this.getCached('aggregated-risk-exposure', async () => {
      console.log('[OptimizedRisk] Starting single-query risk aggregation');

      // Single optimized query to get all risk data including enhanced percentiles
      const riskData = await db
        .select({
          id: risks.id,
          severity: risks.severity,
          inherentRisk: risks.inherentRisk,
          residualRisk: risks.residualRisk,
          primaryLossMagnitudeMin: risks.primaryLossMagnitudeMin,
          primaryLossMagnitudeAvg: risks.primaryLossMagnitudeAvg,
          primaryLossMagnitudeMax: risks.primaryLossMagnitudeMax,
          threatEventFrequencyMin: risks.threatEventFrequencyMin,
          threatEventFrequencyAvg: risks.threatEventFrequencyAvg,
          threatEventFrequencyMax: risks.threatEventFrequencyMax,
          // Enhanced percentiles
          residualP10: risks.residualP10,
          residualP25: risks.residualP25,
          residualP50: risks.residualP50,
          residualP75: risks.residualP75,
          residualP90: risks.residualP90,
          residualP95: risks.residualP95,
          residualP99: risks.residualP99
        })
        .from(risks)
        .orderBy(desc(risks.residualRisk));

      console.log(`[OptimizedRisk] Retrieved ${riskData.length} risks in single query`);

      if (riskData.length === 0) {
        return {
          totalRisks: 0,
          totalInherentRisk: 0,
          totalResidualRisk: 0,
          criticalRisks: 0,
          highRisks: 0,
          mediumRisks: 0,
          lowRisks: 0,
          exposureCurveData: [],
          minimumExposure: 0,
          maximumExposure: 0,
          meanExposure: 0,
          medianExposure: 0,
          percentile95Exposure: 0,
          percentile99Exposure: 0
        };
      }

      // Process all calculations in memory
      let totalInherentRisk = 0;
      let totalResidualRisk = 0;
      let criticalRisks = 0;
      let highRisks = 0;
      let mediumRisks = 0;
      let lowRisks = 0;
      const exposureValues: number[] = [];
      const curveData: Array<{ impact: number; probability: number }> = [];

      for (const risk of riskData) {
        // Parse numeric values safely
        const inherent = parseFloat(risk.inherentRisk || '0');
        const residual = parseFloat(risk.residualRisk || '0');
        
        totalInherentRisk += inherent;
        totalResidualRisk += residual;
        exposureValues.push(residual);

        // Count by severity
        switch (risk.severity) {
          case 'critical': criticalRisks++; break;
          case 'high': highRisks++; break;
          case 'medium': mediumRisks++; break;
          case 'low': lowRisks++; break;
        }

        // Create exposure curve point
        const probability = riskData.length > 0 ? (riskData.indexOf(risk) + 1) / riskData.length : 0;
        curveData.push({
          impact: residual,
          probability: probability
        });
      }

      // Calculate percentiles and statistics
      exposureValues.sort((a, b) => b - a); // Sort descending
      const count = exposureValues.length;
      
      const minimumExposure = exposureValues[count - 1] || 0;
      const maximumExposure = exposureValues[0] || 0;
      const meanExposure = totalResidualRisk / count;
      const medianExposure = count > 0 ? 
        (count % 2 === 0 ? 
          (exposureValues[Math.floor(count/2) - 1] + exposureValues[Math.floor(count/2)]) / 2 :
          exposureValues[Math.floor(count/2)]
        ) : 0;

      const percentile95Index = Math.floor(count * 0.05);
      const percentile99Index = Math.floor(count * 0.01);
      const percentile95Exposure = exposureValues[percentile95Index] || 0;
      const percentile99Exposure = exposureValues[percentile99Index] || 0;

      console.log(`[OptimizedRisk] Calculated totals - Inherent: ${totalInherentRisk}, Residual: ${totalResidualRisk}`);

      return {
        totalRisks: riskData.length,
        totalInherentRisk: Math.round(totalInherentRisk),
        totalResidualRisk: Math.round(totalResidualRisk),
        criticalRisks,
        highRisks,
        mediumRisks,
        lowRisks,
        exposureCurveData: curveData,
        minimumExposure,
        maximumExposure,
        meanExposure: Math.round(meanExposure),
        medianExposure: Math.round(medianExposure),
        percentile95Exposure: Math.round(percentile95Exposure),
        percentile99Exposure: Math.round(percentile99Exposure)
      };
    });
  }

  /**
   * Fast risk summary update with optimized queries
   */
  async updateRiskSummaryOptimized(): Promise<void> {
    console.log('[OptimizedRisk] Starting optimized risk summary update');
    
    try {
      const aggregatedData = await this.calculateAggregatedRiskExposure();
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Use UPSERT to avoid duplicate checks
      await db
        .insert(riskSummaries)
        .values({
          year,
          month,
          legalEntityId: null,
          totalRisks: aggregatedData.totalRisks,
          criticalRisks: aggregatedData.criticalRisks,
          highRisks: aggregatedData.highRisks,
          mediumRisks: aggregatedData.mediumRisks,
          lowRisks: aggregatedData.lowRisks,
          totalInherentRisk: aggregatedData.totalInherentRisk,
          totalResidualRisk: aggregatedData.totalResidualRisk,
          minimumExposure: aggregatedData.minimumExposure,
          maximumExposure: aggregatedData.maximumExposure,
          meanExposure: aggregatedData.meanExposure,
          medianExposure: aggregatedData.medianExposure,
          percentile95Exposure: aggregatedData.percentile95Exposure,
          percentile99Exposure: aggregatedData.percentile99Exposure,
          exposureCurveData: JSON.stringify(aggregatedData.exposureCurveData)
        })
        .onConflictDoUpdate({
          target: [riskSummaries.year, riskSummaries.month, riskSummaries.legalEntityId],
          set: {
            totalRisks: aggregatedData.totalRisks,
            criticalRisks: aggregatedData.criticalRisks,
            highRisks: aggregatedData.highRisks,
            mediumRisks: aggregatedData.mediumRisks,
            lowRisks: aggregatedData.lowRisks,
            totalInherentRisk: aggregatedData.totalInherentRisk,
            totalResidualRisk: aggregatedData.totalResidualRisk,
            minimumExposure: aggregatedData.minimumExposure,
            maximumExposure: aggregatedData.maximumExposure,
            meanExposure: aggregatedData.meanExposure,
            medianExposure: aggregatedData.medianExposure,
            percentile95Exposure: aggregatedData.percentile95Exposure,
            percentile99Exposure: aggregatedData.percentile99Exposure,
            exposureCurveData: JSON.stringify(aggregatedData.exposureCurveData),
            updatedAt: sql`CURRENT_TIMESTAMP`
          }
        });

      // Clear relevant cache entries
      this.clearCachePattern('risk-summary');
      this.clearCachePattern('aggregated-risk');

      console.log('[OptimizedRisk] Risk summary updated successfully');
    } catch (error) {
      console.error('[OptimizedRisk] Error updating risk summary:', error);
      throw error;
    }
  }

  /**
   * Trigger recalculation on risk changes
   */
  async onRiskChange(): Promise<void> {
    // Clear cache immediately
    this.clearCachePattern('aggregated-risk');
    this.clearCachePattern('risk-summary');
    
    // Update risk summary in background
    setImmediate(() => {
      this.updateRiskSummaryOptimized().catch(error => {
        console.error('[OptimizedRisk] Background update failed:', error);
      });
    });
  }
}

export const optimizedRiskCalculation = new OptimizedRiskCalculationService();