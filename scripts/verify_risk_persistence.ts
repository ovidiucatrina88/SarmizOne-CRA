
import { db } from '../server/db';
import { risks } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { RiskService } from '../server/services/riskService';
import { repositoryStorage } from '../server/services/repositoryStorage';

async function verifyRiskPersistence() {
    console.log('Starting verification of risk persistence...');

    const riskService = new RiskService(repositoryStorage);

    // 1. Create a test risk
    const riskId = `RISK-TEST-${Date.now()}`;
    console.log(`Creating test risk: ${riskId}`);

    const newRisk = await db.insert(risks).values({
        riskId,
        name: 'Test Risk for Persistence',
        description: 'Testing JSONB persistence',
        riskCategory: 'operational',
        severity: 'medium',
        inherentRisk: '0',
        residualRisk: '0',
        associatedAssets: [],
        parameters: {
            primaryLossMagnitude: { min: 0, avg: 0, max: 0, confidence: 'medium' }
        }
    }).returning();

    const id = newRisk[0].id;

    // 2. Update risk with distinct Min/Max/Avg values
    console.log('Updating risk with distinct FAIR parameters...');
    const updateData = {
        contactFrequencyMin: 10,
        contactFrequencyAvg: 20,
        contactFrequencyMax: 50,
        contactFrequencyConfidence: 0.8,

        probabilityOfActionMin: 0.2,
        probabilityOfActionAvg: 0.5,
        probabilityOfActionMax: 0.8,

        primaryLossMagnitudeMin: 1000,
        primaryLossMagnitudeAvg: 5000,
        primaryLossMagnitudeMax: 10000,
    };

    await riskService.updateRisk(id, updateData as any);

    // 3. Retrieve risk and verify persistence
    console.log('Retrieving risk to verify persistence...');
    const updatedRisk = await riskService.getRisk(id);

    if (!updatedRisk) {
        console.error('Failed to retrieve risk');
        process.exit(1);
    }

    // Verify flat columns (should match Avg)
    console.log('Verifying flat columns (should match Avg)...');
    if (updatedRisk.contactFrequency !== 20) {
        console.error(`Mismatch: contactFrequency is ${updatedRisk.contactFrequency}, expected 20`);
    } else {
        console.log('OK: contactFrequency matches Avg');
    }

    if (Number(updatedRisk.primaryLossMagnitude) !== 5000) {
        console.error(`Mismatch: primaryLossMagnitude is ${updatedRisk.primaryLossMagnitude}, expected 5000`);
    } else {
        console.log('OK: primaryLossMagnitude matches Avg');
    }

    // Verify parameters JSON
    console.log('Verifying parameters JSON...');
    const params = (updatedRisk as any).parameters;
    console.log('Parameters:', JSON.stringify(params, null, 2));

    // Check for structured format
    if (params.contactFrequency?.min !== 10 || params.contactFrequency?.max !== 50) {
        console.error('Mismatch: contactFrequency Min/Max not persisted correctly in structured JSON');
        console.error(`Expected 10/50, got ${params.contactFrequency?.min}/${params.contactFrequency?.max}`);
    } else {
        console.log('OK: contactFrequency Min/Max persisted in structured JSON');
    }

    // Verify top-level fields (UI expectation - enriched by service)
    console.log('Verifying top-level fields (UI expectation)...');
    if ((updatedRisk as any).contactFrequencyMin !== 10) {
        console.error(`FAIL: contactFrequencyMin not present at top level. Value: ${(updatedRisk as any).contactFrequencyMin}`);
    } else {
        console.log('OK: contactFrequencyMin present at top level');
    }

    // 4. Run calculation
    console.log('Running calculation...');
    // We need to simulate the calculation call which uses calculateRiskValues internally
    // But calculateRiskValues is private or part of the service logic called by calculateAndUpdateRiskValues
    // Let's call calculateAndUpdateRiskValues

    try {
        const calculatedRisk = await riskService.calculateAndUpdateRiskValues(id);
        console.log('Calculation complete.');
        console.log('Inherent Risk:', calculatedRisk.inherentRisk);
        console.log('Residual Risk:', calculatedRisk.residualRisk);

        if (Number(calculatedRisk.inherentRisk) > 0) {
            console.log('OK: Calculated risk is non-zero');
        } else {
            console.error('FAIL: Calculated risk is zero');
        }
    } catch (error) {
        console.error('Calculation failed:', error);
    }

    // Cleanup
    console.log('Cleaning up...');
    await db.delete(risks).where(eq(risks.id, id));

    console.log('Verification complete.');
    process.exit(0);
}

verifyRiskPersistence().catch(console.error);
