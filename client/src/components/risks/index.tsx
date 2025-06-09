// This index file acts as a central export point for risk-related components
// and lets us easily switch between different implementations

// Choose which risk form implementation to use
import { RiskForm as OriginalRiskForm } from './risk-form';

// Comment/uncomment to switch between implementations:
export const RiskForm = OriginalRiskForm; // Using our updated original implementation

// Other risk-related components
export { RiskOverview } from './risk-overview';
export * from './risk-utils';