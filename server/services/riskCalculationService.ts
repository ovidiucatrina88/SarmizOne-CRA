/**
 * Risk Calculation Service
 * 
 * Enhanced service for risk calculations incorporating vulnerability metrics
 */
import { pool } from "../db";
import { getVulnerabilityMetricsForRisk } from "./vulnerabilityService";
import { 
  calculateResidualRiskWithFairCam, 
  FairCamParams 
} from "../../shared/utils/monteCarloEnhanced";

/**
 * Interface for risk calculation results
 */
interface RiskCalculationResult {
  inherentRisk: {
    min: number;
    avg: number;
    max: number;
  };
  residualRisk: {
    min: number;
    avg: number;
    max: number;
  };
  controlsApplied: boolean;
  vulnerabilitiesApplied: boolean;
  reliability: number;
}

/**
 * Calculate risk values for a specific risk with vulnerabilities included
 * 
 * @param riskId Risk ID to calculate values for
 * @returns Promise with calculation results
 */
export async function calculateRiskWithVulnerabilities(riskId: number): Promise<RiskCalculationResult> {
  try {
    // Get the risk details
    const riskResult = await pool.query(`
      SELECT 
        r.*,
        COALESCE(
          (SELECT json_agg(c.*)
           FROM controls c
           JOIN risk_controls rc ON c.id = rc.control_id
           WHERE rc.risk_id = r.id), 
          '[]'::json
        ) as controls
      FROM risks r
      WHERE r.id = $1
    `, [riskId]);
    
    if (riskResult.rows.length === 0) {
      throw new Error(`Risk with ID ${riskId} not found`);
    }
    
    const risk = riskResult.rows[0];
    
    // Calculate inherent risk (without controls)
    const inherentRiskParams: FairCamParams = {
      tefMin: risk.tefMin,
      tefMost: risk.tefMost, 
      tefMax: risk.tefMax,
      lmMin: risk.lmMin,
      lmMost: risk.lmMost,
      lmMax: risk.lmMax
    };
    
    // Get vulnerability metrics if available
    const vulnerabilityMetrics = await getVulnerabilityMetricsForRisk(riskId);
    
    // Create a complete risk object with all needed parameters
    const enhancedRisk = {
      ...risk,
      // Add vulnerability-derived metrics
      eDetect: vulnerabilityMetrics.e_detect, 
      eResist: vulnerabilityMetrics.e_resist,
      varFreq: vulnerabilityMetrics.var_freq,
      varDuration: vulnerabilityMetrics.var_duration
    };
    
    // Calculate residual risk with controls and vulnerability metrics
    const residualRisk = calculateResidualRiskWithFairCam(enhancedRisk);
    
    // Calculate reliability based on variance metrics
    let reliability = 1;
    if (vulnerabilityMetrics.var_freq > 0 && vulnerabilityMetrics.var_duration > 0) {
      reliability = Math.pow(1 - (vulnerabilityMetrics.var_freq / 365), vulnerabilityMetrics.var_duration);
      reliability = Math.max(0, Math.min(1, reliability));
    }
    
    // For the inherent risk calculation (no controls or vulnerability adjustments)
    // We run the standard calculation with the base risk parameters
    const inherentRisk = {
      min: risk.tefMin * risk.lmMin,
      avg: risk.tefMost * risk.lmMost,
      max: risk.tefMax * risk.lmMax
    };
    
    return {
      inherentRisk,
      residualRisk,
      controlsApplied: risk.controls && risk.controls.length > 0,
      vulnerabilitiesApplied: vulnerabilityMetrics.vulnerability_count > 0,
      reliability
    };
  } catch (error: any) {
    console.error(`Error calculating risk values: ${error.message}`);
    throw error;
  }
}

/**
 * Update risk values in database based on vulnerability metrics
 * 
 * @param riskId Risk ID to update
 * @returns Promise indicating success
 */
export async function updateRiskValuesWithVulnerabilities(riskId: number): Promise<boolean> {
  try {
    // Calculate risk values
    const calculationResult = await calculateRiskWithVulnerabilities(riskId);
    
    // Update the risk in the database with calculated values
    await pool.query(`
      UPDATE risks
      SET 
        residual_risk_min = $1,
        residual_risk_avg = $2,
        residual_risk_max = $3,
        vulnerability_count = $4,
        control_reliability = $5,
        updated_at = NOW()
      WHERE id = $6
    `, [
      calculationResult.residualRisk.min,
      calculationResult.residualRisk.avg,
      calculationResult.residualRisk.max,
      await getVulnerabilityMetricsForRisk(riskId).then(m => m.vulnerability_count),
      calculationResult.reliability,
      riskId
    ]);
    
    return true;
  } catch (error: any) {
    console.error(`Error updating risk values: ${error.message}`);
    return false;
  }
}

/**
 * Calculate risk values for all risks in the system
 * 
 * @returns Promise indicating success
 */
export async function calculateAllRisksWithVulnerabilities(): Promise<boolean> {
  try {
    // Get all risk IDs
    const risksResult = await pool.query(`
      SELECT id FROM risks
      WHERE is_template = false
      ORDER BY id
    `);
    
    // Process each risk
    for (const row of risksResult.rows) {
      try {
        await updateRiskValuesWithVulnerabilities(row.id);
        console.log(`Updated risk values for risk ID: ${row.id}`);
      } catch (error: any) {
        console.error(`Error updating risk ID ${row.id}: ${error.message}`);
        // Continue with next risk even if this one fails
      }
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error calculating all risks: ${error.message}`);
    return false;
  }
}