
import { db } from '../server/db';
import { risks } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { RiskService } from '../server/services/riskService';
import { repositoryStorage } from '../server/services/repositoryStorage';

async function fixRiskData() {
    console.log('Fixing data for risk ID 1...');

    const riskService = new RiskService(repositoryStorage);
    const riskId = 1;

    // 1. Update risk with valid FAIR parameters
    console.log('Updating risk with valid FAIR parameters...');
    const updateData = {
        contactFrequencyMin: 10,
        contactFrequencyAvg: 20,
        contactFrequencyMax: 50,
        contactFrequencyConfidence: 'medium',

        probabilityOfActionMin: 0.2,
        probabilityOfActionAvg: 0.5,
        probabilityOfActionMax: 0.8,
        probabilityOfActionConfidence: 'medium',

        threatCapabilityMin: 10,
        threatCapabilityAvg: 50,
        threatCapabilityMax: 90,
        threatCapabilityConfidence: 'medium',

        resistanceStrengthMin: 10,
        resistanceStrengthAvg: 40,
        resistanceStrengthMax: 80,
        resistanceStrengthConfidence: 'medium',

        primaryLossMagnitudeMin: 1000,
        primaryLossMagnitudeAvg: 5000,
        primaryLossMagnitudeMax: 10000,
        primaryLossMagnitudeConfidence: 'medium',

        secondaryLossEventFrequencyMin: 0.1,
        secondaryLossEventFrequencyAvg: 0.5,
        secondaryLossEventFrequencyMax: 0.9,
        secondaryLossEventFrequencyConfidence: 'medium',

        secondaryLossMagnitudeMin: 500,
        secondaryLossMagnitudeAvg: 2000,
        secondaryLossMagnitudeMax: 5000,
        secondaryLossMagnitudeConfidence: 'medium'
    };

    // Use the service to update, which handles parameter flattening/structuring and triggers recalculation
    const updatedRisk = await riskService.updateRisk(riskId, updateData);

    if (!updatedRisk) {
        console.error('Failed to update risk');
        process.exit(1);
    }

    console.log('Risk updated.');
    console.log('New Inherent Risk:', updatedRisk.inherentRisk);
    console.log('New Residual Risk:', updatedRisk.residualRisk);

    if (Number(updatedRisk.inherentRisk) > 0) {
        console.log('SUCCESS: Risk values are now non-zero.');
    } else {
        console.error('FAIL: Risk values are still zero.');
    }

    process.exit(0);
}

fixRiskData().catch(console.error);
