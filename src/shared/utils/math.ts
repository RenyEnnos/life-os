/**
 * Math utilities for LifeOS
 */

/**
 * Calculates a simple linear regression (y = mx + b)
 * @param data Array of {x, y} points
 * @returns Object with slope (m), intercept (b), and a projection function
 */
export function calculateLinearRegression(data: { x: number; y: number }[]) {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: 0, project: (x: number) => 0 };

    const sumX = data.reduce((a, b) => a + b.x, 0);
    const sumY = data.reduce((a, b) => a + b.y, 0);
    const sumXY = data.reduce((a, b) => a + b.x * b.y, 0);
    const sumXX = data.reduce((a, b) => a + b.x * b.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope,
        intercept,
        project: (x: number) => slope * x + intercept
    };
}
