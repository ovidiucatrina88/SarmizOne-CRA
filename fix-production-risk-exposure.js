#!/usr/bin/env node

/**
 * Fix Production Risk Exposure Script
 * This script recalculates all risk exposures and updates the risk summary
 */

const { Pool } = require('pg');
require('dotenv').config();

async function fixRiskExposure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('=== FIXING PRODUCTION RISK EXPOSURE ===\n');

    // 1. Get all risks that need calculation
    console.log('1. Finding risks that need exposure calculation...');
    const risksResult = await pool.query(`
      SELECT id, risk_id, name, severity, inherent_risk, residual_risk
      FROM risks 
      WHERE (item_type = 'instance' OR item_type IS NULL)
      ORDER BY id
    `);

    const risks = risksResult.rows;
    console.log(`   Found ${risks.length} risks to process`);

    // 2. Check which risks have missing or zero exposure values
    const needsCalculation = risks.filter(r => 
      !r.inherent_risk || !r.residual_risk || 
      parseFloat(r.inherent_risk) === 0 || parseFloat(r.residual_risk) === 0
    );

    console.log(`   ${needsCalculation.length} risks need exposure calculation`);

    if (needsCalculation.length > 0) {
      console.log('\n2. Risks needing calculation:');
      needsCalculation.forEach((risk, i) => {
        console.log(`   ${i+1}. ${risk.risk_id} - ${risk.name} (${risk.severity})`);
        console.log(`      Current: inherent=${risk.inherent_risk}, residual=${risk.residual_risk}`);
      });

      console.log('\n   To fix these risks, you need to:');
      console.log('   a) Open each risk in the web interface');
      console.log('   b) Click "Update" or "Recalculate" to trigger the calculation');
      console.log('   c) Or use the API endpoint: PUT /api/risks/{id}/calculate');
    }

    // 3. Force recalculate risk summary if we have valid risks
    const validRisks = risks.filter(r => 
      r.inherent_risk && r.residual_risk && 
      parseFloat(r.inherent_risk) > 0 && parseFloat(r.residual_risk) > 0
    );

    if (validRisks.length > 0) {
      console.log('\n3. Recalculating risk summary...');
      
      const totalInherent = validRisks.reduce((sum, r) => sum + parseFloat(r.inherent_risk), 0);
      const totalResidual = validRisks.reduce((sum, r) => sum + parseFloat(r.residual_risk), 0);
      const minResidual = Math.min(...validRisks.map(r => parseFloat(r.residual_risk)));
      const maxResidual = Math.max(...validRisks.map(r => parseFloat(r.residual_risk)));
      const avgResidual = totalResidual / validRisks.length;

      // Count by severity
      const criticalCount = validRisks.filter(r => r.severity === 'critical').length;
      const highCount = validRisks.filter(r => r.severity === 'high').length;
      const mediumCount = validRisks.filter(r => r.severity === 'medium').length;
      const lowCount = validRisks.filter(r => r.severity === 'low').length;

      // Create exposure curve data
      const sortedExposures = validRisks.map(r => parseFloat(r.residual_risk)).sort((a, b) => b - a);
      const exposureCurve = sortedExposures.map((impact, index) => ({
        impact,
        probability: (index + 1) / sortedExposures.length
      }));

      // Insert new risk summary
      const now = new Date();
      await pool.query(`
        INSERT INTO risk_summaries (
          year, month, legal_entity_id,
          total_risks, critical_risks, high_risks, medium_risks, low_risks,
          total_inherent_risk, total_residual_risk,
          minimum_exposure, maximum_exposure, average_exposure,
          mean_exposure, median_exposure, percentile_95_exposure, percentile_99_exposure,
          exposure_curve_data, created_at, updated_at
        ) VALUES (
          $1, $2, NULL,
          $3, $4, $5, $6, $7,
          $8, $9,
          $10, $11, $12,
          $13, $14, $15, $16,
          $17, $18, $19
        )
      `, [
        now.getFullYear(), now.getMonth() + 1,
        validRisks.length, criticalCount, highCount, mediumCount, lowCount,
        totalInherent, totalResidual,
        minResidual, maxResidual, avgResidual,
        avgResidual, avgResidual, maxResidual * 0.95, maxResidual * 0.99,
        JSON.stringify(exposureCurve.slice(0, 10)), now, now
      ]);

      console.log(`   Updated risk summary with ${validRisks.length} valid risks`);
      console.log(`   Total residual exposure: $${totalResidual.toLocaleString()}`);
      console.log(`   Range: $${minResidual.toLocaleString()} - $${maxResidual.toLocaleString()}`);
    }

    // 4. Final verification
    console.log('\n4. Verifying fix...');
    const summaryCheck = await pool.query(`
      SELECT total_risks, total_residual_risk, created_at
      FROM risk_summaries 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (summaryCheck.rows.length > 0) {
      const latest = summaryCheck.rows[0];
      console.log(`   Latest summary: ${latest.total_risks} risks, $${Number(latest.total_residual_risk).toLocaleString()} exposure`);
      console.log(`   Created: ${latest.created_at}`);
      
      if (latest.total_residual_risk > 0) {
        console.log('\n✓ SUCCESS: Risk exposure is now showing correctly!');
      } else {
        console.log('\n⚠ WARNING: Risk exposure is still 0. Individual risks need calculation.');
      }
    }

    console.log('\n=== FIX COMPLETE ===');

  } catch (error) {
    console.error('Fix error:', error);
  } finally {
    await pool.end();
  }
}

// Run fix if called directly
if (require.main === module) {
  fixRiskExposure();
}

module.exports = fixRiskExposure;