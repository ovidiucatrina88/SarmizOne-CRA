/**
 * IRIS 2025 Benchmarking Demonstration
 * This script shows how to use the IRIS integration for risk comparison and benchmarking
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// IRIS 2025 Constants for reference
const IRIS_CONSTANTS = {
  // Threat Event Frequency for web applications (annual)
  TEF_WEBAPP: { min: 0.009, mode: 0.035, max: 0.046 },
  
  // Loss Magnitude parameters (log-normal distribution)
  LM_GLOBAL: { mu: 14.88, sigma: 1.95, geometricMean: 2900000 },
  LM_SMB: { mu: 12.79, sigma: 1.77, geometricMean: 357000 }
};

async function demonstrateIrisBenchmarking() {
  console.log('='.repeat(60));
  console.log('IRIS 2025 BENCHMARKING DEMONSTRATION');
  console.log('='.repeat(60));

  try {
    // 1. Show current risk calculations with IRIS parameters
    console.log('\n1. CURRENT RISK CALCULATIONS WITH IRIS 2025');
    console.log('-'.repeat(50));
    
    const riskResponse = await axios.get(`${API_BASE}/risks/RISK-DATA-299/calculate`);
    const riskData = riskResponse.data.data;
    
    console.log('Risk ID:', riskData.risk.riskId);
    console.log('Risk Name:', riskData.risk.name);
    console.log('Inherent Risk:', `$${riskData.inherentRisk.toLocaleString()}`);
    console.log('Residual Risk:', `$${riskData.residualRisk.toLocaleString()}`);
    console.log('Risk Reduction:', `$${(riskData.inherentRisk - riskData.residualRisk).toLocaleString()}`);
    
    console.log('\nMonte Carlo Results (IRIS-enhanced):');
    const mc = riskData.monteCarloResults;
    console.log(`  P05 (5th percentile): $${mc.p05.toLocaleString()}`);
    console.log(`  P25 (25th percentile): $${mc.p25.toLocaleString()}`);
    console.log(`  P50 (median): $${mc.p50.toLocaleString()}`);
    console.log(`  P75 (75th percentile): $${mc.p75.toLocaleString()}`);
    console.log(`  P95 (95th percentile): $${mc.p95.toLocaleString()}`);
    console.log(`  Maximum: $${mc.max.toLocaleString()}`);

    // 2. Compare with industry benchmarks
    console.log('\n2. INDUSTRY BENCHMARK COMPARISON');
    console.log('-'.repeat(50));
    
    console.log('IRIS 2025 Web Application Baselines:');
    console.log(`  Annual Threat Frequency: ${IRIS_CONSTANTS.TEF_WEBAPP.min}-${IRIS_CONSTANTS.TEF_WEBAPP.max} (${(IRIS_CONSTANTS.TEF_WEBAPP.min*100).toFixed(1)}%-${(IRIS_CONSTANTS.TEF_WEBAPP.max*100).toFixed(1)}%)`);
    console.log(`  SMB Loss Magnitude (geometric mean): $${IRIS_CONSTANTS.LM_SMB.geometricMean.toLocaleString()}`);
    console.log(`  Enterprise Loss Magnitude (geometric mean): $${IRIS_CONSTANTS.LM_GLOBAL.geometricMean.toLocaleString()}`);
    
    const actualRisk = riskData.residualRisk;
    const smbBenchmark = IRIS_CONSTANTS.LM_SMB.geometricMean;
    const enterpriseBenchmark = IRIS_CONSTANTS.LM_GLOBAL.geometricMean;
    
    console.log('\nYour Risk vs Industry Benchmarks:');
    console.log(`  Current Risk: $${actualRisk.toLocaleString()}`);
    console.log(`  vs SMB Average: ${actualRisk > smbBenchmark ? 'ABOVE' : 'BELOW'} industry average`);
    console.log(`    Difference: ${actualRisk > smbBenchmark ? '+' : ''}$${(actualRisk - smbBenchmark).toLocaleString()}`);
    console.log(`  vs Enterprise Average: ${actualRisk > enterpriseBenchmark ? 'ABOVE' : 'BELOW'} industry average`);
    console.log(`    Difference: ${actualRisk > enterpriseBenchmark ? '+' : ''}$${(actualRisk - enterpriseBenchmark).toLocaleString()}`);

    // 3. Portfolio-level analysis
    console.log('\n3. PORTFOLIO RISK ANALYSIS');
    console.log('-'.repeat(50));
    
    const allRisksResponse = await axios.get(`${API_BASE}/risks`);
    const allRisks = allRisksResponse.data.data;
    
    const totalInherentRisk = allRisks.reduce((sum, risk) => sum + parseFloat(risk.inherentRisk || 0), 0);
    const totalResidualRisk = allRisks.reduce((sum, risk) => sum + parseFloat(risk.residualRisk || 0), 0);
    const riskReduction = totalInherentRisk - totalResidualRisk;
    const reductionPercentage = ((riskReduction / totalInherentRisk) * 100);
    
    console.log('Portfolio Summary:');
    console.log(`  Total Risks: ${allRisks.length}`);
    console.log(`  Total Inherent Risk: $${totalInherentRisk.toLocaleString()}`);
    console.log(`  Total Residual Risk: $${totalResidualRisk.toLocaleString()}`);
    console.log(`  Risk Reduction: $${riskReduction.toLocaleString()} (${reductionPercentage.toFixed(1)}%)`);
    
    // Risk severity distribution
    const severityCount = allRisks.reduce((acc, risk) => {
      acc[risk.severity] = (acc[risk.severity] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nRisk Severity Distribution:');
    Object.entries(severityCount).forEach(([severity, count]) => {
      console.log(`  ${severity.toUpperCase()}: ${count} risks`);
    });

    // 4. Control effectiveness analysis
    console.log('\n4. CONTROL EFFECTIVENESS ANALYSIS');
    console.log('-'.repeat(50));
    
    const controlsResponse = await axios.get(`${API_BASE}/controls`);
    const controls = controlsResponse.data.data;
    
    const implementedControls = controls.filter(c => c.implementationStatus === 'fully_implemented');
    const controlsByType = controls.reduce((acc, control) => {
      acc[control.controlType] = (acc[control.controlType] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Control Portfolio:');
    console.log(`  Total Controls: ${controls.length}`);
    console.log(`  Implemented: ${implementedControls.length} (${((implementedControls.length/controls.length)*100).toFixed(1)}%)`);
    
    console.log('\nControl Types:');
    Object.entries(controlsByType).forEach(([type, count]) => {
      console.log(`  ${type.toUpperCase()}: ${count} controls`);
    });

    // 5. IRIS-based recommendations
    console.log('\n5. IRIS 2025 BENCHMARKING INSIGHTS');
    console.log('-'.repeat(50));
    
    const avgRiskPerAsset = totalResidualRisk / allRisks.length;
    
    console.log('Risk Maturity Assessment:');
    if (avgRiskPerAsset > IRIS_CONSTANTS.LM_GLOBAL.geometricMean) {
      console.log('  ⚠️  HIGH RISK: Above enterprise industry average');
      console.log('  📋 Recommendation: Implement additional preventive controls');
    } else if (avgRiskPerAsset > IRIS_CONSTANTS.LM_SMB.geometricMean) {
      console.log('  ⚡ MODERATE RISK: Between SMB and enterprise averages');
      console.log('  📋 Recommendation: Focus on detective controls');
    } else {
      console.log('  ✅ LOW RISK: Below industry averages');
      console.log('  📋 Recommendation: Maintain current control posture');
    }
    
    console.log('\nIndustry Positioning:');
    const percentilePosition = (avgRiskPerAsset / IRIS_CONSTANTS.LM_GLOBAL.geometricMean) * 100;
    console.log(`  Risk Level: ${percentilePosition.toFixed(0)}% of enterprise benchmark`);
    
    if (reductionPercentage < 20) {
      console.log('  Control Effectiveness: Below average (industry standard ~30-40% reduction)');
    } else if (reductionPercentage < 35) {
      console.log('  Control Effectiveness: Average (industry standard ~30-40% reduction)');
    } else {
      console.log('  Control Effectiveness: Above average (industry standard ~30-40% reduction)');
    }

  } catch (error) {
    console.error('Error running IRIS benchmarking demo:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.statusText);
    }
  }
}

// Example queries for advanced benchmarking
function printAdvancedQueries() {
  console.log('\n6. ADVANCED BENCHMARKING QUERIES');
  console.log('-'.repeat(50));
  
  console.log('SQL queries for deeper analysis:');
  console.log(`
-- Compare risk exposure by asset type
SELECT 
  a.type as asset_type,
  COUNT(r.id) as risk_count,
  AVG(CAST(r.residual_risk AS NUMERIC)) as avg_exposure,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY CAST(r.residual_risk AS NUMERIC)) as p95_exposure
FROM risks r
JOIN assets a ON a.asset_id = ANY(r.associated_assets)
GROUP BY a.type
ORDER BY avg_exposure DESC;

-- Control ROI analysis with IRIS baselines
SELECT 
  c.name,
  c.implementation_cost,
  SUM(CAST(r.inherent_risk AS NUMERIC) - CAST(r.residual_risk AS NUMERIC)) as risk_reduction,
  CASE 
    WHEN c.implementation_cost > 0 
    THEN (SUM(CAST(r.inherent_risk AS NUMERIC) - CAST(r.residual_risk AS NUMERIC)) / c.implementation_cost) 
    ELSE NULL 
  END as roi_ratio
FROM controls c
JOIN risk_controls rc ON rc.control_id = c.id
JOIN risks r ON r.id = rc.risk_id
GROUP BY c.id, c.name, c.implementation_cost
HAVING c.implementation_cost > 0
ORDER BY roi_ratio DESC;

-- Risk trend analysis
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_risks,
  AVG(CAST(residual_risk AS NUMERIC)) as avg_risk
FROM risks 
WHERE created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;
  `);
}

// Run the demonstration
if (require.main === module) {
  demonstrateIrisBenchmarking().then(() => {
    printAdvancedQueries();
    console.log('\n' + '='.repeat(60));
    console.log('IRIS 2025 BENCHMARKING DEMONSTRATION COMPLETE');
    console.log('='.repeat(60));
  });
}

module.exports = { demonstrateIrisBenchmarking, IRIS_CONSTANTS };