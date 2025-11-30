import { Request, Response } from 'express';
import { db } from '../../db';
import { risks, riskCosts } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { generateTrend } from '../../utils/trends';

export const getRiskCostSummary = async (req: Request, res: Response) => {
    try {
        // Fetch all risks and their costs
        const allRisks = await db.select().from(risks);
        const allRiskCosts = await db.select().from(riskCosts);

        // Calculate stats
        const totalMapped = allRiskCosts.length;
        const totalCost = allRiskCosts.reduce((sum, record) => sum + (Number(record.costValue) || 0), 0);
        const avgCost = totalMapped ? totalCost / totalMapped : 0;

        const highSeverityCount = allRisks.filter(
            (risk) => (risk.severity || "medium").toLowerCase() === "high" || (risk.severity || "medium").toLowerCase() === "critical"
        ).length;

        // Generate trends
        const trends = {
            totalMapped: generateTrend(totalMapped, 30),
            totalCost: generateTrend(totalCost, 30),
            avgCost: generateTrend(avgCost, 30),
            highSeverity: generateTrend(highSeverityCount, 30)
        };

        res.json({
            stats: {
                totalMapped,
                totalCost,
                avgCost,
                highSeverity: highSeverityCount
            },
            trends
        });
    } catch (error) {
        console.error('Error fetching risk cost summary:', error);
        res.status(500).json({ error: 'Failed to fetch risk cost summary' });
    }
};
