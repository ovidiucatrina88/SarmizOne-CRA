import { Router } from 'express';
import { z } from 'zod';
import { executeQueryWithRetry } from '../../db';

const router = Router();

// IRIS 2025 benchmarking constants
const IRIS_BENCHMARKS = {
  SMB: {
    geometricMean: 357000,
    logNormalMu: 12.79,
    logNormalSigma: 1.77,
    tefMin: 0.009,
    tefMax: 0.046,
    tefMode: 0.0275
  },
  ENTERPRISE: {
    geometricMean: 2900000,
    logNormalMu: 14.88,
    logNormalSigma: 1.95,
    tefMin: 0.009,
    tefMax: 0.046,
    tefMode: 0.0275
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

router.get('/iris-benchmarks', async (req, res) => {
  try {
    // Fetch current risk portfolio data
    const risksQuery = `
      SELECT 
        r.risk_id,
        r.name,
        COALESCE(CAST(r.residual_risk AS NUMERIC), 0) as residual_risk,
        COALESCE(CAST(r.inherent_risk AS NUMERIC), 0) as inherent_risk,
        r.severity
      FROM risks r
      WHERE CAST(r.residual_risk AS NUMERIC) > 0
      ORDER BY CAST(r.residual_risk AS NUMERIC) DESC
    `;
    
    const risksResult = await executeQueryWithRetry(risksQuery, []);
    const risks = (risksResult as any).rows;
    
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
    const highestRisk = parseFloat(risks[0].residual_risk);
    
    // Determine industry positioning
    let industryPosition: 'above_smb' | 'below_enterprise' | 'between' | 'above_enterprise';
    if (avgRiskSize > IRIS_BENCHMARKS.ENTERPRISE.geometricMean) {
      industryPosition = 'above_enterprise';
    } else if (avgRiskSize > IRIS_BENCHMARKS.SMB.geometricMean) {
      industryPosition = 'between';
    } else {
      industryPosition = 'above_smb';
    }

    // Calculate maturity score based on risk distribution and control coverage
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const mediumRisks = risks.filter(r => r.severity === 'medium').length;
    const lowRisks = risks.filter(r => r.severity === 'low').length;
    
    // Maturity score: lower is better (0-100 scale)
    const severityScore = (criticalRisks * 25) + (highRisks * 15) + (mediumRisks * 8) + (lowRisks * 3);
    const normalizedScore = Math.min(100, (severityScore / risks.length) * 2);
    const maturityScore = Math.max(0, 100 - normalizedScore);

    // Portfolio comparison multiples
    const smbMultiple = totalPortfolioRisk / (IRIS_BENCHMARKS.SMB.geometricMean * risks.length);
    const enterpriseMultiple = totalPortfolioRisk / (IRIS_BENCHMARKS.ENTERPRISE.geometricMean * risks.length);
    
    // Generate recommendations based on analysis
    const recommendations: string[] = [];
    
    if (industryPosition === 'above_enterprise') {
      recommendations.push('Portfolio risk significantly exceeds enterprise benchmarks - prioritize risk reduction');
      recommendations.push('Consider implementing additional controls for highest-exposure risks');
    } else if (industryPosition === 'between') {
      recommendations.push('Risk levels align with enterprise standards - maintain current control effectiveness');
      recommendations.push('Monitor emerging threats to stay within industry benchmarks');
    } else {
      recommendations.push('Risk levels below SMB averages - consider if risk assessment is comprehensive');
      recommendations.push('Evaluate control coverage to ensure no blind spots exist');
    }
    
    if (criticalRisks > 0) {
      recommendations.push(`Address ${criticalRisks} critical risk${criticalRisks > 1 ? 's' : ''} immediately`);
    }
    
    if (maturityScore < 60) {
      recommendations.push('Risk maturity below industry standards - strengthen risk management processes');
    }

    const benchmarkData: IRISBenchmarkData = {
      currentRisk: highestRisk,
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
  }
});

export default router;