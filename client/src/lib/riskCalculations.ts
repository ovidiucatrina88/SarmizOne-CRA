import { apiRequest } from '@/lib/queryClient';
import { RiskCalculationParams } from '@shared/schema';

/**
 * Client-side utility to interact with server-side risk calculation endpoints
 * Following the server-first calculation approach, all risk calculations are performed server-side.
 * This module provides methods to request those calculations without requiring local computation.
 */

/**
 * Fetch calculated risk values for an existing risk
 * @param riskId The risk ID to calculate values for
 * @returns Promise with calculated risk values or undefined if calculation fails
 */
export async function fetchRiskCalculation(riskId: string): Promise<any> {
  try {
    if (!riskId) {
      throw new Error('Risk ID is required for calculation');
    }
    
    return await apiRequest(`/api/risks/${riskId}/calculate`);
  } catch (error) {
    console.error('Error fetching risk calculation:', error);
    throw error;
  }
}

/**
 * Run an ad-hoc Monte Carlo calculation with provided parameters
 * This doesn't require an existing risk record - it calculates on-the-fly
 * @param params The risk parameters to use for calculation
 * @param controlEffectiveness Optional overall effectiveness of controls (0-10 scale)
 * @returns Promise with calculated risk values or undefined if calculation fails
 */
export async function runAdHocMonteCarloCalculation(
  params: RiskCalculationParams,
  controlEffectiveness: number = 0
): Promise<any> {
  try {
    if (!params) {
      throw new Error('Risk parameters are required for calculation');
    }
    
    // Add control effectiveness to the parameters
    const calculationParams = {
      ...params,
      controlEffectiveness
    };
    
    // Make POST request to the ad-hoc calculation endpoint
    return await apiRequest('/api/risks/calculate/monte-carlo', {
      method: 'POST',
      body: JSON.stringify(calculationParams),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error running ad-hoc Monte Carlo calculation:', error);
    throw error;
  }
}

/**
 * Helper function to get a value with fallback from server calculation results
 * Ensures consistent handling of potentially undefined server values
 * @param value The value to check
 * @param fallback Fallback value to use if the provided value is undefined/null/NaN
 * @returns The value or fallback
 */
export function getValueWithFallback<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
    return fallback;
  }
  return value;
}