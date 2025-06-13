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