import { riskSummaryService } from './server/services/riskSummaryService.js';

async function triggerUpdate() {
  try {
    console.log('Manually triggering risk summary update...');
    await riskSummaryService.updateRiskSummaries();
    console.log('Risk summary update completed successfully');
  } catch (error) {
    console.error('Error during risk summary update:', error);
  }
}

triggerUpdate();