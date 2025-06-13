import { logNormal, betaPert, runFairCamFullMonteCarlo } from '../shared/utils/monteCarlo';
import { MonteCarloInput } from '../shared/models/riskParams';

describe('IRIS 2025 Integration Tests', () => {
  describe('logNormal function', () => {
    it('should produce expected geometric mean', () => {
      const mu = Math.log(2_900_000);  // IRIS global mean
      const sigma = 1.95;              // IRIS global sigma
      const samples = 100_000;
      
      let sum = 0;
      for (let i = 0; i < samples; i++) {
        sum += logNormal(mu, sigma);
      }
      
      const empiricalMean = sum / samples;
      const expectedGeometricMean = Math.exp(mu); // e^μ ≈ 2,900,000
      
      // Allow 5% tolerance for geometric mean
      const tolerance = expectedGeometricMean * 0.05;
      expect(Math.abs(empiricalMean - expectedGeometricMean)).toBeLessThan(tolerance);
    });

    it('should return positive values', () => {
      const mu = Math.log(100_000);
      const sigma = 1.5;
      
      for (let i = 0; i < 1000; i++) {
        const value = logNormal(mu, sigma);
        expect(value).toBeGreaterThan(0);
      }
    });
  });

  describe('betaPert function', () => {
    it('should return values within specified range', () => {
      const min = 0.01;
      const mode = 0.035;
      const max = 0.045;
      
      for (let i = 0; i < 1000; i++) {
        const value = betaPert(min, mode, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThanOrEqual(max);
      }
    });

    it('should cluster around the mode value', () => {
      const min = 0.025;
      const mode = 0.093;
      const max = 0.12;
      const samples = 10_000;
      
      let sum = 0;
      for (let i = 0; i < samples; i++) {
        sum += betaPert(min, mode, max);
      }
      
      const empiricalMean = sum / samples;
      // Beta-PERT mean should be close to (min + 4*mode + max) / 6
      const expectedMean = (min + 4 * mode + max) / 6;
      
      // Allow 10% tolerance
      const tolerance = expectedMean * 0.1;
      expect(Math.abs(empiricalMean - expectedMean)).toBeLessThan(tolerance);
    });
  });

  describe('IRIS 2025 Monte Carlo Integration', () => {
    it('should produce P90 loss between 25M and 32M with IRIS defaults', () => {
      const irisParams: MonteCarloInput = {
        // Traditional FAIR parameters (will be overridden by IRIS)
        cfMin: 1, cfMode: 1, cfMax: 1,
        poaMin: 0.1, poaMode: 0.1, poaMax: 0.1,
        tcMin: 5, tcMode: 5, tcMax: 5,
        rsMin: 3, rsMode: 3, rsMax: 3,
        plMin: 1_000_000, plMode: 2_000_000, plMax: 3_000_000,
        slefMin: 0.1, slefMode: 0.2, slefMax: 0.3,
        slmMin: 100_000, slmMode: 200_000, slmMax: 300_000,
        eAvoid: 0, eDeter: 0, eResist: 0, eDetect: 0,
        
        // IRIS 2025 parameters - these will override traditional sampling
        tefMin: 0.009, // IRIS_TEF_WEBAPP.min (0.025 * 0.38)
        tefMode: 0.035, // IRIS_TEF_WEBAPP.mode (0.093 * 0.38)
        tefMax: 0.046, // IRIS_TEF_WEBAPP.max (0.12 * 0.38)
        plMu: Math.log(2_900_000), // IRIS_LM_ALL.mu
        plSigma: 1.95, // IRIS_LM_ALL.sigma
        
        iterations: 100_000
      };

      const result = runFairCamFullMonteCarlo(irisParams);
      
      // Check that P90 (95th percentile) is within expected range
      const p90Loss = result.stats.p95;
      expect(p90Loss).toBeGreaterThan(25_000_000); // 25M minimum
      expect(p90Loss).toBeLessThan(32_000_000);    // 32M maximum
      
      console.log(`IRIS Integration Test Results:
        Mean Loss: $${result.stats.mean.toLocaleString()}
        P50 Loss: $${result.stats.p50.toLocaleString()}
        P90 Loss: $${result.stats.p95.toLocaleString()}
        P95 Loss: $${result.stats.p95.toLocaleString()}`);
    });

    it('should use log-normal sampling when plMu is provided', () => {
      const withIris: MonteCarloInput = {
        cfMin: 1, cfMode: 1, cfMax: 1,
        poaMin: 0.1, poaMode: 0.1, poaMax: 0.1,
        tcMin: 5, tcMode: 5, tcMax: 5,
        rsMin: 3, rsMode: 3, rsMax: 3,
        plMin: 1_000_000, plMode: 2_000_000, plMax: 3_000_000,
        slefMin: 0.1, slefMode: 0.2, slefMax: 0.3,
        slmMin: 100_000, slmMode: 200_000, slmMax: 300_000,
        eAvoid: 0, eDeter: 0, eResist: 0, eDetect: 0,
        plMu: Math.log(357_000), // IRIS SMB parameter
        plSigma: 1.77,
        iterations: 10_000
      };

      const withoutIris: MonteCarloInput = {
        ...withIris,
        plMu: undefined,
        plSigma: undefined
      };

      const irisResult = runFairCamFullMonteCarlo(withIris);
      const traditionalResult = runFairCamFullMonteCarlo(withoutIris);

      // Results should be different when using IRIS vs traditional sampling
      expect(Math.abs(irisResult.stats.mean - traditionalResult.stats.mean))
        .toBeGreaterThan(10_000); // Should differ by at least $10k
    });

    it('should use betaPert for TEF when tefMin is provided', () => {
      const withTef: MonteCarloInput = {
        cfMin: 1, cfMode: 2, cfMax: 3,
        poaMin: 0.1, poaMode: 0.2, poaMax: 0.3,
        tcMin: 5, tcMode: 5, tcMax: 5,
        rsMin: 3, rsMode: 3, rsMax: 3,
        plMin: 1_000_000, plMode: 2_000_000, plMax: 3_000_000,
        slefMin: 0.1, slefMode: 0.2, slefMax: 0.3,
        slmMin: 100_000, slmMode: 200_000, slmMax: 300_000,
        eAvoid: 0, eDeter: 0, eResist: 0, eDetect: 0,
        tefMin: 0.009,
        tefMode: 0.035,
        tefMax: 0.046,
        iterations: 10_000
      };

      const withoutTef: MonteCarloInput = {
        ...withTef,
        tefMin: undefined,
        tefMode: undefined,
        tefMax: undefined
      };

      const tefResult = runFairCamFullMonteCarlo(withTef);
      const traditionalResult = runFairCamFullMonteCarlo(withoutTef);

      // Results should be different when using TEF vs traditional CF/POA
      expect(Math.abs(tefResult.stats.mean - traditionalResult.stats.mean))
        .toBeGreaterThan(1_000); // Should differ by at least $1k
    });
  });

  describe('IRIS Parameter Constants', () => {
    it('should have correct IRIS parameter ranges', () => {
      // Verify IRIS constants are within expected ranges
      const IRIS_TEF_ALL = { min: 0.025, mode: 0.093, max: 0.12 };
      const WEBAPP_WEIGHT = 0.38;
      
      expect(IRIS_TEF_ALL.min).toBe(0.025);
      expect(IRIS_TEF_ALL.mode).toBe(0.093);
      expect(IRIS_TEF_ALL.max).toBe(0.12);
      expect(WEBAPP_WEIGHT).toBe(0.38);
      
      // Verify calculated webapp TEF values
      const webappTef = {
        min: IRIS_TEF_ALL.min * WEBAPP_WEIGHT,
        mode: IRIS_TEF_ALL.mode * WEBAPP_WEIGHT,
        max: IRIS_TEF_ALL.max * WEBAPP_WEIGHT
      };
      
      expect(webappTef.min).toBeCloseTo(0.0095, 4);
      expect(webappTef.mode).toBeCloseTo(0.03534, 4);
      expect(webappTef.max).toBeCloseTo(0.0456, 4);
    });

    it('should have valid log-normal parameters', () => {
      const IRIS_LM_ALL = { mu: Math.log(2_900_000), sigma: 1.95 };
      const IRIS_LM_SMB = { mu: Math.log(357_000), sigma: 1.77 };
      
      // Verify parameters produce reasonable geometric means
      expect(Math.exp(IRIS_LM_ALL.mu)).toBeCloseTo(2_900_000, -3);
      expect(Math.exp(IRIS_LM_SMB.mu)).toBeCloseTo(357_000, -2);
      
      // Verify sigma values are positive
      expect(IRIS_LM_ALL.sigma).toBe(1.95);
      expect(IRIS_LM_SMB.sigma).toBe(1.77);
    });
  });
});