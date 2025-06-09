export function triangular(min: number, mode: number, max: number): number {
  // First ensure all inputs are valid numbers
  min = typeof min === 'number' && !isNaN(min) ? min : 0;
  mode = typeof mode === 'number' && !isNaN(mode) ? mode : min;
  max = typeof max === 'number' && !isNaN(max) ? max : mode;

  // Ensure min <= mode <= max
  if (min > mode) mode = min;
  if (max < mode) max = mode;
  if (min > max) min = max;

  // If all values are the same, just return that value
  if (min === max) return min;

  // Generate a random value using the triangular distribution
  const u = Math.random();
  
  // Handle edge cases to prevent NaN
  // If mode is at either endpoint, use a simplified calculation
  if (mode === min) {
    return min + Math.sqrt(u) * (max - min);
  } else if (mode === max) {
    return max - Math.sqrt(1 - u) * (max - min);
  }
  
  // Standard triangular distribution with safety checks
  const c = (mode - min) / (max - min);
  
  try {
    return u < c
      ? min + Math.sqrt(u * (max - min) * (mode - min))
      : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  } catch (e) {
    // Fallback to uniform distribution if calculations fail
    console.error('Triangular distribution calculation failed:', e);
    return min + (max - min) * u;
  }
}
