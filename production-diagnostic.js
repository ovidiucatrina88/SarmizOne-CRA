#!/usr/bin/env node

/**
 * Production Diagnostic Script for Risk Exposure Issues
 * This script helps identify why risk exposure shows 0 in production
 */

const { Pool } = require('pg');
require('dotenv').config();

async function runDiagnostics() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('=== PRODUCTION RISK EXPOSURE DIAGNOSTICS ===\n');

    // 1. Check if risks table exists and has data
    console.log('1. Checking risks table...');
    const risksCount = await pool.query('SELECT COUNT(*) as count FROM risks');
    console.log(`   Total risks in database: ${risksCount.rows[0].count}`);

    if (risksCount.rows[0].count > 0) {
      // 2. Check risk exposure values
      console.log('\n2. Checking risk exposure values...');
      const riskExposure = await pool.query(`
        SELECT 
          COUNT(*) as total_risks,
          COUNT(CASE WHEN inherent_risk IS NOT NULL THEN 1 END) as has_inherent,
          COUNT(CASE WHEN residual_risk IS NOT NULL THEN 1 END) as has_residual,
          COALESCE(SUM(inherent_risk), 0) as total_inherent,
          COALESCE(SUM(residual_risk), 0) as total_residual,
          MIN(residual_risk) as min_residual,
          MAX(residual_risk) as max_residual
        FROM risks 
        WHERE (item_type = 'instance' OR item_type IS NULL)
      `);
      
      const exposure = riskExposure.rows[0];
      console.log(`   Risks with inherent_risk: ${exposure.has_inherent}/${exposure.total_risks}`);
      console.log(`   Risks with residual_risk: ${exposure.has_residual}/${exposure.total_risks}`);
      console.log(`   Total inherent risk: $${Number(exposure.total_inherent).toLocaleString()}`);
      console.log(`   Total residual risk: $${Number(exposure.total_residual).toLocaleString()}`);
      console.log(`   Min residual risk: $${Number(exposure.min_residual || 0).toLocaleString()}`);
      console.log(`   Max residual risk: $${Number(exposure.max_residual || 0).toLocaleString()}`);

      // 3. Check sample risk data
      console.log('\n3. Sample risk data:');
      const sampleRisks = await pool.query(`
        SELECT risk_id, name, severity, inherent_risk, residual_risk, item_type
        FROM risks 
        ORDER BY id 
        LIMIT 5
      `);
      
      sampleRisks.rows.forEach((risk, i) => {
        console.log(`   ${i+1}. ${risk.risk_id} (${risk.severity}): inherent=${risk.inherent_risk}, residual=${risk.residual_risk}, type=${risk.item_type}`);
      });
    }

    // 4. Check risk summaries table
    console.log('\n4. Checking risk_summaries table...');
    const summariesCount = await pool.query('SELECT COUNT(*) as count FROM risk_summaries');
    console.log(`   Total risk summaries: ${summariesCount.rows[0].count}`);

    if (summariesCount.rows[0].count > 0) {
      const latestSummary = await pool.query(`
        SELECT 
          total_risks, total_inherent_risk, total_residual_risk,
          minimum_exposure, maximum_exposure, mean_exposure,
          created_at
        FROM risk_summaries 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      const latest = latestSummary.rows[0];
      console.log(`   Latest summary (${latest.created_at}):`);
      console.log(`     Total risks: ${latest.total_risks}`);
      console.log(`     Total inherent: $${Number(latest.total_inherent_risk || 0).toLocaleString()}`);
      console.log(`     Total residual: $${Number(latest.total_residual_risk || 0).toLocaleString()}`);
      console.log(`     Min exposure: $${Number(latest.minimum_exposure || 0).toLocaleString()}`);
      console.log(`     Max exposure: $${Number(latest.maximum_exposure || 0).toLocaleString()}`);
    }

    // 5. Check data types
    console.log('\n5. Checking column data types...');
    const columnTypes = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'risks' 
      AND column_name IN ('inherent_risk', 'residual_risk')
      ORDER BY column_name
    `);
    
    columnTypes.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type}`);
    });

    console.log('\n=== DIAGNOSTIC COMPLETE ===');
    console.log('\nIf total_residual_risk is 0 but you have risks in the database,');
    console.log('the issue is likely that risk calculations have not been performed.');
    console.log('Run risk calculations for each risk to populate the exposure values.');

  } catch (error) {
    console.error('Diagnostic error:', error);
  } finally {
    await pool.end();
  }
}

// Run diagnostics if called directly
if (require.main === module) {
  runDiagnostics();
}

module.exports = runDiagnostics;