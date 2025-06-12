#!/usr/bin/env node

/**
 * Update Production Risk Summaries Script
 * This script fixes existing risk_summaries records that show 0 exposure values
 */

const { Pool } = require('pg');
require('dotenv').config();

async function updateRiskSummaries() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('=== UPDATING PRODUCTION RISK SUMMARIES ===\n');

    // 1. Check current state
    console.log('1. Checking current risk summaries...');
    const currentSummaries = await pool.query(`
      SELECT id, total_risks, total_residual_risk, most_likely_exposure, 
             minimum_exposure, maximum_exposure, created_at
      FROM risk_summaries 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log('   Current summaries:');
    currentSummaries.rows.forEach((row, i) => {
      console.log(`   ${i+1}. ID ${row.id}: ${row.total_risks} risks, residual=${row.total_residual_risk}, exposure=${row.most_likely_exposure}`);
    });

    // 2. Get actual risk data from database
    console.log('\n2. Recalculating from actual risk data...');
    const riskData = await pool.query(`
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
        AND residual_risk IS NOT NULL
    `);

    const stats = riskData.rows[0];
    console.log('   Calculated from database:');
    console.log(`   Total risks: ${stats.total_risks}`);
    console.log(`   Total residual risk: $${Number(stats.total_residual_risk).toLocaleString()}`);
    console.log(`   Exposure range: $${Number(stats.minimum_exposure).toLocaleString()} - $${Number(stats.maximum_exposure).toLocaleString()}`);

    if (stats.total_risks > 0 && stats.total_residual_risk > 0) {
      // 3. Generate exposure curve data
      const exposureData = await pool.query(`
        SELECT residual_risk
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
          AND residual_risk IS NOT NULL
          AND residual_risk > 0
        ORDER BY residual_risk DESC
      `);

      const exposures = exposureData.rows.map(row => Number(row.residual_risk));
      const exposureCurve = exposures.map((impact, index) => ({
        impact,
        probability: (index + 1) / exposures.length
      }));

      console.log(`   Generated exposure curve with ${exposureCurve.length} points`);

      // 4. Update the most recent risk summary
      const latestSummary = await pool.query(`
        SELECT id FROM risk_summaries 
        ORDER BY created_at DESC 
        LIMIT 1
      `);

      if (latestSummary.rows.length > 0) {
        const summaryId = latestSummary.rows[0].id;
        
        console.log('\n3. Updating latest risk summary...');
        await pool.query(`
          UPDATE risk_summaries SET
            total_risks = $1,
            critical_risks = $2,
            high_risks = $3,
            medium_risks = $4,
            low_risks = $5,
            total_inherent_risk = $6,
            total_residual_risk = $7,
            minimum_exposure = $8,
            maximum_exposure = $9,
            average_exposure = $10,
            mean_exposure = $11,
            median_exposure = $12,
            percentile_95_exposure = $13,
            percentile_99_exposure = $14,
            tenth_percentile_exposure = $15,
            most_likely_exposure = $16,
            ninetieth_percentile_exposure = $17,
            exposure_curve_data = $18,
            updated_at = NOW()
          WHERE id = $19
        `, [
          stats.total_risks,
          stats.critical_risks,
          stats.high_risks,
          stats.medium_risks,
          stats.low_risks,
          stats.total_inherent_risk,
          stats.total_residual_risk,
          stats.minimum_exposure,
          stats.maximum_exposure,
          stats.mean_exposure,
          stats.mean_exposure,
          stats.median_exposure,
          stats.percentile_95_exposure,
          stats.percentile_99_exposure,
          stats.minimum_exposure, // tenth_percentile_exposure
          stats.mean_exposure,    // most_likely_exposure
          stats.percentile_95_exposure, // ninetieth_percentile_exposure
          JSON.stringify(exposureCurve.slice(0, 10)),
          summaryId
        ]);

        console.log(`   Updated risk summary ID ${summaryId}`);

        // 5. Verify the update
        console.log('\n4. Verifying update...');
        const verifyResult = await pool.query(`
          SELECT total_risks, total_residual_risk, most_likely_exposure,
                 minimum_exposure, maximum_exposure, updated_at
          FROM risk_summaries 
          WHERE id = $1
        `, [summaryId]);

        const updated = verifyResult.rows[0];
        console.log(`   ✓ Risks: ${updated.total_risks}`);
        console.log(`   ✓ Total residual risk: $${Number(updated.total_residual_risk).toLocaleString()}`);
        console.log(`   ✓ Most likely exposure: $${Number(updated.most_likely_exposure).toLocaleString()}`);
        console.log(`   ✓ Updated: ${updated.updated_at}`);

        if (updated.total_residual_risk > 0 && updated.most_likely_exposure > 0) {
          console.log('\n✓ SUCCESS: Risk exposure values updated successfully!');
          console.log('   The dashboard should now show correct risk exposure values.');
        } else {
          console.log('\n⚠ WARNING: Some exposure values are still 0.');
        }
      }
    } else {
      console.log('\n⚠ No valid risk data found. Risks need to be calculated first.');
      console.log('   Each risk needs to have its inherent_risk and residual_risk calculated.');
    }

    console.log('\n=== UPDATE COMPLETE ===');

  } catch (error) {
    console.error('Update error:', error);
  } finally {
    await pool.end();
  }
}

// Run update if called directly
if (require.main === module) {
  updateRiskSummaries();
}

module.exports = updateRiskSummaries;