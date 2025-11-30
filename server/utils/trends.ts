/**
 * Generates a random walk trend ending at the current value.
 * @param currentValue The current value to end the trend at.
 * @param days The number of data points to generate (default: 30).
 * @returns An object containing the trend series, delta string, and direction.
 */
export function generateTrend(currentValue: number, days: number = 30): { series: number[], delta: string, direction: 'up' | 'down' | 'flat' } {
    // Generate a random walk that ends at currentValue
    const series: number[] = [];
    let val = currentValue;

    // Work backwards from current value
    for (let i = 0; i < days; i++) {
        series.unshift(Number(val.toFixed(2)));
        // Random change between -5% and +5%
        const change = val * (Math.random() * 0.1 - 0.05);
        val -= change;
        // Ensure no negative values
        val = Math.max(0, val);
    }

    const startValue = series[0];
    const endValue = series[series.length - 1];

    let percentChange = 0;
    if (startValue > 0) {
        percentChange = ((endValue - startValue) / startValue) * 100;
    }

    const direction = percentChange > 0.5 ? 'up' : percentChange < -0.5 ? 'down' : 'flat';
    const sign = percentChange > 0 ? '+' : '';

    return {
        series,
        delta: `${sign}${percentChange.toFixed(1)}% vs last month`,
        direction
    };
}
