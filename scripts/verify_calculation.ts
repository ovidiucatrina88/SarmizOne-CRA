
import { calculateRiskValues } from '../shared/utils/calculations';

const mockRisk = {
    contactFrequencyAvg: 1,
    probabilityOfActionAvg: 1,
    threatCapabilityAvg: 5,
    primaryLossMagnitudeAvg: 0, // Manual value is 0
    assetObjects: [
        { assetValue: 100000 }
    ]
};

console.log('Testing calculation with mock risk:', JSON.stringify(mockRisk, null, 2));

try {
    const result = calculateRiskValues(mockRisk as any);

    console.log('Calculation Result:');
    console.log('Inherent Risk:', result.inherentRisk);
    console.log('Primary Loss Magnitude (Avg):', result.lossMagnitude.avg);

    if (result.inherentRisk > 0 && result.lossMagnitude.avg > 0) {
        console.log('SUCCESS: Risk calculated from assets');
        process.exit(0);
    } else {
        console.log('FAILURE: Risk is still 0');
        process.exit(1);
    }
} catch (error) {
    console.error('Error during calculation:', error);
    process.exit(1);
}
