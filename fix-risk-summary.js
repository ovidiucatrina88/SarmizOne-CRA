import pkg from 'pg';
const { Pool } = pkg;

async function fixRiskSummary() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('Fetching risks from database...');
    const risksResult = await pool.query('SELECT * FROM risks');
    const risks = risksResult.rows;
    
    console.log('Found risks:', risks.length);
    risks.forEach(risk => {
      console.log(`- ${risk.name}: severity=${risk.severity}, inherent=${risk.inherent_risk}, residual=${risk.residual_risk}`);
    });

    // Calculate risk counts by severity
    const totalRisks = risks.length;
    const criticalRisks = risks.filter(r => r.severity === 'critical').length;
    const highRisks = risks.filter(r => r.severity === 'high').length;
    const mediumRisks = risks.filter(r => r.severity === 'medium').length;
    const lowRisks = risks.filter(r => r.severity === 'low').length;

    // Calculate total risk values
    const totalInherentRisk = risks.reduce((sum, r) => sum + (parseFloat(r.inherent_risk) || 0), 0);
    const totalResidualRisk = risks.reduce((sum, r) => sum + (parseFloat(r.residual_risk) || 0), 0);

    console.log('Calculated values:');
    console.log(`Total Risks: ${totalRisks}`);
    console.log(`Critical: ${criticalRisks}, High: ${highRisks}, Medium: ${mediumRisks}, Low: ${lowRisks}`);
    console.log(`Total Inherent Risk: ${totalInherentRisk}`);
    console.log(`Total Residual Risk: ${totalResidualRisk}`);

    const now = new Date();
    const summaryData = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      legal_entity_id: null,
      total_risks: totalRisks,
      critical_risks: criticalRisks,
      high_risks: highRisks,
      medium_risks: mediumRisks,
      low_risks: lowRisks,
      total_inherent_risk: totalInherentRisk,
      total_residual_risk: totalResidualRisk,
      minimum_exposure: 0,
      maximum_exposure: totalResidualRisk,
      average_exposure: totalResidualRisk / (totalRisks || 1),
      tenth_percentile_exposure: 0,
      most_likely_exposure: totalResidualRisk,
      ninetieth_percentile_exposure: totalResidualRisk,
      mean_exposure: totalResidualRisk / (totalRisks || 1),
      median_exposure: totalResidualRisk,
      percentile_95_exposure: totalResidualRisk,
      percentile_99_exposure: totalResidualRisk,
      exposure_curve_data: JSON.stringify([])
    };

    // Insert new summary
    const insertQuery = `
      INSERT INTO risk_summaries (
        year, month, legal_entity_id, total_risks, critical_risks, high_risks, medium_risks, low_risks,
        total_inherent_risk, total_residual_risk, minimum_exposure, maximum_exposure, average_exposure,
        tenth_percentile_exposure, most_likely_exposure, ninetieth_percentile_exposure,
        mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure, exposure_curve_data
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      )
    `;

    await pool.query(insertQuery, [
      summaryData.year, summaryData.month, summaryData.legal_entity_id,
      summaryData.total_risks, summaryData.critical_risks, summaryData.high_risks,
      summaryData.medium_risks, summaryData.low_risks, summaryData.total_inherent_risk,
      summaryData.total_residual_risk, summaryData.minimum_exposure, summaryData.maximum_exposure,
      summaryData.average_exposure, summaryData.tenth_percentile_exposure, summaryData.most_likely_exposure,
      summaryData.ninetieth_percentile_exposure, summaryData.mean_exposure, summaryData.median_exposure,
      summaryData.percentile_95_exposure, summaryData.percentile_99_exposure, summaryData.exposure_curve_data
    ]);

    console.log('Risk summary inserted successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

fixRiskSummary();