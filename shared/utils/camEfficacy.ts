/**
 * FAIR-CAM operational efficacy:
 * Ef = IntEff × (1 − VF/365) ^ VD
 */
export function camEfficacy(
  intEff: number,
  vfDays: number,
  vdDays: number,
): number {
  const reliability = Math.pow(1 - vfDays / 365, vdDays);
  return intEff * reliability;
}
