import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../../db';

const router = Router();

// IRIS 2025 benchmarking constants
const IRIS_BENCHMARKS = {
  SMB: {
    geometricMean: 357000,
    standardDeviation: 1.77,
    logMean: 12.79
  },
  ENTERPRISE: {
    geometricMean: 2900000,
    standardDeviation: 1.95,
    logMean: 14.88
  }
};

/**
 * Generate loss exceedance curve data from lognormal distribution
 * @param geometricMean - median of the distribution
 * @param standardDeviation - standard deviation of ln(values)
 * @param points - number of points to generate
 * @returns Array of {probability, impact} points for the curve
 */
function generateExceedanceCurve(geometricMean: number, standardDeviation: number, points: number = 50): Array<{probability: number, impact: number}> {
  const curve: Array<{probability: number, impact: number}> = [];
  
  // Generate points from 0.01% to 99.99% exceedance probability
  for (let i = 0; i < points; i++) {
    const probability = 0.0001 + (0.9999 - 0.0001) * (i / (points - 1));
    
    // Convert probability to z-score for normal distribution
    const zScore = inverseNormalCDF(1 - probability);
    
    // Calculate impact using lognormal distribution
    const lnGeometricMean = Math.log(geometricMean);
    const lnImpact = lnGeometricMean + standardDeviation * zScore;
    const impact = Math.exp(lnImpact);
    
    curve.push({ probability, impact });
  }
  
  // Sort by probability descending (exceedance probability)
  return curve.sort((a, b) => b.probability - a.probability);
}

/**
 * Approximate inverse normal CDF using Beasley-Springer-Moro algorithm
 */
function inverseNormalCDF(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  
  // Constants for the approximation
  const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  
  let x = 0;
  let t = 0;
  
  if (p < 0.5) {
    t = Math.sqrt(-2 * Math.log(p));
    x = (((((c[1] * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) * t + c[6]) / 
        ((((d[1] * t + d[2]) * t + d[3]) * t + d[4]) * t + 1);
  } else {
    t = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[1] * t + c[2]) * t + c[3]) * t + c[4]) * t + c[5]) * t + c[6]) / 
         ((((d[1] * t + d[2]) * t + d[3]) * t + d[4]) * t + 1);
  }
  
  return x;
}

interface IRISBenchmarkData {
  currentRisk: number;
  totalPortfolioRisk: number;
  smbBenchmark: number;
  enterpriseBenchmark: number;
  industryPosition: 'above_smb' | 'below_enterprise' | 'between' | 'above_enterprise';
  maturityScore: number;
  recommendations: string[];
  riskCount: number;
  avgRiskSize: number;
  portfolioComparison: {
    smbMultiple: number;
    enterpriseMultiple: number;
    positioning: string;
  };
  exceedanceCurves: {
    smb: Array<{probability: number, impact: number}>;
    enterprise: Array<{probability: number, impact: number}>;
  };
}

// GET /api/dashboard/iris-benchmarks - Fetch IRIS 2025 benchmarking data
router.get('/', async (req, res) => {
  try {
    // Fetch current risks from database
    const risksQuery = `
      SELECT r.name, r.risk_id, r.severity, 
             CAST(r.residual_risk AS NUMERIC) as residual_risk,
             CAST(r.inherent_risk AS NUMERIC) as inherent_risk
      FROM risks r
      WHERE CAST(r.residual_risk AS NUMERIC) > 0
      ORDER BY CAST(r.residual_risk AS NUMERIC) DESC
    `;
    
    const client = await pool.connect();
    try {
      const risksResult = await client.query(risksQuery);
      const risks = risksResult.rows;
    
      if (risks.length === 0) {
        return res.json({
          success: true,
          data: {
            currentRisk: 0,
            totalPortfolioRisk: 0,
            smbBenchmark: IRIS_BENCHMARKS.SMB.geometricMean,
            enterpriseBenchmark: IRIS_BENCHMARKS.ENTERPRISE.geometricMean,
            industryPosition: 'below_enterprise' as const,
            maturityScore: 0,
            recommendations: ['No risks found. Consider conducting a risk assessment.'],
            riskCount: 0,
            avgRiskSize: 0,
            portfolioComparison: {
              smbMultiple: 0,
              enterpriseMultiple: 0,
              positioning: 'No data available'
            }
          }
        });
      }

      // Calculate portfolio metrics
      const totalPortfolioRisk = risks.reduce((sum, risk) => sum + parseFloat(risk.residual_risk), 0);
      const avgRiskSize = totalPortfolioRisk / risks.length;

      // Calculate industry position
      const smbMultiple = totalPortfolioRisk / IRIS_BENCHMARKS.SMB.geometricMean;
      const enterpriseMultiple = totalPortfolioRisk / IRIS_BENCHMARKS.ENTERPRISE.geometricMean;

      let industryPosition: 'above_smb' | 'below_enterprise' | 'between' | 'above_enterprise';
      if (totalPortfolioRisk > IRIS_BENCHMARKS.ENTERPRISE.geometricMean) {
        industryPosition = 'above_enterprise';
      } else if (totalPortfolioRisk > IRIS_BENCHMARKS.SMB.geometricMean) {
        industryPosition = 'between';
      } else if (totalPortfolioRisk > IRIS_BENCHMARKS.SMB.geometricMean * 0.5) {
        industryPosition = 'above_smb';
      } else {
        industryPosition = 'below_enterprise';
      }

      // Calculate maturity score (0-100 based on risk management effectiveness)
      const inherentTotal = risks.reduce((sum, risk) => sum + parseFloat(risk.inherent_risk), 0);
      const riskReduction = inherentTotal > 0 ? ((inherentTotal - totalPortfolioRisk) / inherentTotal) * 100 : 0;
      const maturityScore = Math.min(100, Math.max(0, riskReduction));

      // Generate recommendations based on benchmarking
      const recommendations = [];
      if (industryPosition === 'above_enterprise') {
        recommendations.push('Risk exposure significantly exceeds enterprise benchmarks');
        recommendations.push('Consider implementing additional risk mitigation controls');
        recommendations.push('Review and strengthen existing security measures');
      } else if (industryPosition === 'between') {
        recommendations.push('Risk levels are within enterprise range but above SMB average');
        recommendations.push('Focus on optimizing existing controls for better efficiency');
      } else {
        recommendations.push('Risk exposure is well-managed compared to industry standards');
        recommendations.push('Maintain current security posture and monitor for emerging threats');
      }

      // Generate exceedance curves for industry benchmarks
      const smbCurve = generateExceedanceCurve(
        IRIS_BENCHMARKS.SMB.geometricMean, 
        IRIS_BENCHMARKS.SMB.standardDeviation
      );
      const enterpriseCurve = generateExceedanceCurve(
        IRIS_BENCHMARKS.ENTERPRISE.geometricMean, 
        IRIS_BENCHMARKS.ENTERPRISE.standardDeviation
      );

      const benchmarkData: IRISBenchmarkData = {
        currentRisk: totalPortfolioRisk,
        totalPortfolioRisk,
        smbBenchmark: IRIS_BENCHMARKS.SMB.geometricMean,
        enterpriseBenchmark: IRIS_BENCHMARKS.ENTERPRISE.geometricMean,
        industryPosition,
        maturityScore: Math.round(maturityScore),
        recommendations,
        riskCount: risks.length,
        avgRiskSize,
        portfolioComparison: {
          smbMultiple: Number(smbMultiple.toFixed(2)),
          enterpriseMultiple: Number(enterpriseMultiple.toFixed(2)),
          positioning: industryPosition === 'above_enterprise' ? 'Above Enterprise Average' :
                      industryPosition === 'between' ? 'Between SMB and Enterprise' :
                      industryPosition === 'above_smb' ? 'Above SMB Average' : 'Below Industry Average'
        },
        exceedanceCurves: {
          smb: smbCurve,
          enterprise: enterpriseCurve
        }
      };

      res.json({
        success: true,
        data: benchmarkData
      });

    } catch (error) {
      console.error('Error fetching IRIS benchmarks:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch IRIS benchmarks'
      });
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

export default router;