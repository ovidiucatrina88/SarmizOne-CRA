/**
 * Simple test script to verify IRIS 2025 integration is working
 */

// Import the functions we need to test
const { logNormal, betaPert } = require('./shared/utils/monteCarlo');

console.log('Testing IRIS 2025 Integration...\n');

// Test 1: logNormal function
console.log('Test 1: Log-Normal Distribution');
const mu = Math.log(357_000);  // IRIS SMB parameter
const sigma = 1.77;
const samples = 10_000;

let sum = 0;
let values = [];
for (let i = 0; i < samples; i++) {
  const value = logNormal(mu, sigma);
  sum += value;
  values.push(value);
}

const empiricalMean = sum / samples;
const expectedGeometricMean = Math.exp(mu); // Should be ~357,000

console.log(`Expected geometric mean: $${expectedGeometricMean.toLocaleString()}`);
console.log(`Empirical mean: $${empiricalMean.toLocaleString()}`);
console.log(`Difference: ${Math.abs(empiricalMean - expectedGeometricMean).toLocaleString()}`);

// Test 2: betaPert function  
console.log('\nTest 2: Beta-PERT Distribution');
const tefMin = 0.009;   // IRIS webapp TEF min
const tefMode = 0.035;  // IRIS webapp TEF mode  
const tefMax = 0.046;   // IRIS webapp TEF max

let tefSum = 0;
let tefValues = [];
for (let i = 0; i < samples; i++) {
  const value = betaPert(tefMin, tefMode, tefMax);
  tefSum += value;
  tefValues.push(value);
}

const tefMean = tefSum / samples;
const expectedTefMean = (tefMin + 4 * tefMode + tefMax) / 6;

console.log(`Expected TEF mean: ${expectedTefMean.toFixed(4)}`);
console.log(`Empirical TEF mean: ${tefMean.toFixed(4)}`);
console.log(`TEF values in range [${tefMin}, ${tefMax}]: ${tefValues.every(v => v >= tefMin && v <= tefMax)}`);

// Test 3: Integration verification
console.log('\nTest 3: IRIS Constants Verification');
const IRIS_TEF_ALL = { min: 0.025, mode: 0.093, max: 0.12 };
const WEBAPP_WEIGHT = 0.38;

const webappTef = {
  min: IRIS_TEF_ALL.min * WEBAPP_WEIGHT,
  mode: IRIS_TEF_ALL.mode * WEBAPP_WEIGHT,
  max: IRIS_TEF_ALL.max * WEBAPP_WEIGHT
};

console.log(`IRIS TEF (all orgs): ${JSON.stringify(IRIS_TEF_ALL)}`);
console.log(`Web app weight: ${WEBAPP_WEIGHT}`);
console.log(`Web app TEF: ${JSON.stringify(webappTef)}`);

const IRIS_LM_ALL = { mu: Math.log(2_900_000), sigma: 1.95 };
const IRIS_LM_SMB = { mu: Math.log(357_000), sigma: 1.77 };

console.log(`IRIS LM (global): μ=${IRIS_LM_ALL.mu.toFixed(2)}, σ=${IRIS_LM_ALL.sigma}`);
console.log(`IRIS LM (SMB): μ=${IRIS_LM_SMB.mu.toFixed(2)}, σ=${IRIS_LM_SMB.sigma}`);
console.log(`Expected losses - Global: $${Math.exp(IRIS_LM_ALL.mu).toLocaleString()}, SMB: $${Math.exp(IRIS_LM_SMB.mu).toLocaleString()}`);

console.log('\nIRIS 2025 Integration Test Complete ✓');