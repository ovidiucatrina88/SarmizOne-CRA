/**
 * Test script to verify cascade deletion functionality
 * This will test deleting an asset and ensure all related data is properly cleaned up
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testCascadeDeletion() {
  try {
    console.log('=== Starting Cascade Deletion Test ===\n');

    // Step 1: Get current assets
    console.log('1. Fetching current assets...');
    const assetsResponse = await axios.get(`${BASE_URL}/assets`);
    const assets = assetsResponse.data.data;
    console.log(`   Found ${assets.length} assets`);
    
    if (assets.length === 0) {
      console.log('   No assets found to test deletion');
      return;
    }

    // Step 2: Get current risks
    console.log('\n2. Fetching current risks...');
    const risksResponse = await axios.get(`${BASE_URL}/risks`);
    const risks = risksResponse.data.data;
    console.log(`   Found ${risks.length} risks`);

    // Step 3: Select an asset that has associated risks
    const assetToDelete = assets.find(asset => 
      risks.some(risk => risk.associatedAssets && risk.associatedAssets.includes(asset.assetId))
    );

    if (!assetToDelete) {
      console.log('   No asset with associated risks found for testing');
      // Use the first asset for testing
      const testAsset = assets[0];
      console.log(`   Using asset ${testAsset.assetId} for deletion test`);
      
      // Step 4: Delete the asset
      console.log(`\n3. Deleting asset ${testAsset.assetId} (ID: ${testAsset.id})...`);
      await axios.delete(`${BASE_URL}/assets/${testAsset.id}`);
      console.log('   Asset deleted successfully');
      
    } else {
      console.log(`   Found asset ${assetToDelete.assetId} with associated risks`);
      
      // Count affected risks
      const affectedRisks = risks.filter(risk => 
        risk.associatedAssets && risk.associatedAssets.includes(assetToDelete.assetId)
      );
      console.log(`   This asset is associated with ${affectedRisks.length} risks`);

      // Step 4: Delete the asset with cascade
      console.log(`\n3. Deleting asset ${assetToDelete.assetId} (ID: ${assetToDelete.id})...`);
      await axios.delete(`${BASE_URL}/assets/${assetToDelete.id}`);
      console.log('   Asset deleted successfully with cascade operations');
      
      // Step 5: Verify risks are updated
      console.log('\n4. Verifying risk updates...');
      const updatedRisksResponse = await axios.get(`${BASE_URL}/risks`);
      const updatedRisks = updatedRisksResponse.data.data;
      
      for (const originalRisk of affectedRisks) {
        const updatedRisk = updatedRisks.find(r => r.riskId === originalRisk.riskId);
        if (updatedRisk) {
          const stillHasAsset = updatedRisk.associatedAssets && 
                               updatedRisk.associatedAssets.includes(assetToDelete.assetId);
          console.log(`   Risk ${originalRisk.riskId}: ${stillHasAsset ? 'STILL HAS ASSET (ERROR)' : 'asset reference removed ✓'}`);
        } else {
          console.log(`   Risk ${originalRisk.riskId}: risk deleted (had no remaining assets) ✓`);
        }
      }
    }

    // Step 6: Verify final state
    console.log('\n5. Verifying final state...');
    const finalAssetsResponse = await axios.get(`${BASE_URL}/assets`);
    const finalAssets = finalAssetsResponse.data.data;
    console.log(`   Assets remaining: ${finalAssets.length}`);
    
    const finalRisksResponse = await axios.get(`${BASE_URL}/risks`);
    const finalRisks = finalRisksResponse.data.data;
    console.log(`   Risks remaining: ${finalRisks.length}`);

    console.log('\n=== Cascade Deletion Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCascadeDeletion();