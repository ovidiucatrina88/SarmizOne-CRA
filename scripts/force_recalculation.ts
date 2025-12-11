
import { riskSummaryService } from '../server/services/riskSummaryService';
import { db } from '../server/db';

async function main() {
    console.log('Forcing recalculation of all risk summaries...');
    try {
        await riskSummaryService.recalculateAllSummaries();
        console.log('Successfully recalculated all risk summaries.');
    } catch (error) {
        console.error('Error recalculating summaries:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
