
import { riskSummaryService } from '../server/services/riskSummaryService';

// Mock risks
const mockRisks = [
    {
        riskId: 'risk-1',
        residualRisk: '100000',
        inherentRisk: '200000',
        parameters: {}
    },
    {
        riskId: 'risk-2',
        residualRisk: '50000',
        inherentRisk: '100000',
        parameters: {}
    }
];

// Access private method via any cast (for testing purposes)
const service = riskSummaryService as any;

console.log('Running Monte Carlo simulation verification...');
const stats = service.calculateExposureStatistics(mockRisks);

console.log('Results:', JSON.stringify(stats, null, 2));

if (stats.p10 < stats.median && stats.median < stats.p90) {
    console.log('SUCCESS: Percentiles are distinct and ordered correctly.');
} else {
    console.error('FAILURE: Percentiles are not distinct or ordered correctly.');
    console.error(`p10: ${stats.p10}, median: ${stats.median}, p90: ${stats.p90}`);
    process.exit(1);
}

if (stats.min < stats.max) {
    console.log('SUCCESS: Min is less than Max.');
} else {
    console.error('FAILURE: Min is not less than Max.');
    process.exit(1);
}
