import { Request, Response } from 'express';
import { db } from '../../db';
import { risks, riskCosts } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { generateTrend } from '../../utils/trends';

export const getRiskCostSummary = async (req: Request, res: Response) => {
    try {
        // Fetch all risks to count severity
        const allRisks = await db.select().from(risks);

        // Calculate total cost using SQL logic matching the controller
        // Note: quantity/hours are assumed 1.0 as they don't exist in DB schema
        const costResult = await db.execute(sql`
            SELECT 
                COUNT(*) as total_mapped,
                SUM(
                    CASE 
                        WHEN cm.cost_type = 'percentage' THEN 
                            (CAST(COALESCE(r.inherent_risk, 0) AS DECIMAL) * CAST(COALESCE(cm.cost_factor, 0) AS DECIMAL) * CAST(COALESCE(rc.weight, 1) AS DECIMAL))
                        ELSE 
                            (CAST(COALESCE(cm.cost_factor, 0) AS DECIMAL) * CAST(COALESCE(rc.weight, 1) AS DECIMAL))
                    END
                ) as total_cost
            FROM risk_costs rc
            JOIN cost_modules cm ON rc.cost_module_id = cm.id
            JOIN risks r ON rc.risk_id = r.id
        `);

        // Calculate stats
        const params = costResult.rows[0] as any;
        const totalMapped = parseInt(params.total_mapped) || 0;
        const totalCost = parseFloat(params.total_cost) || 0;
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
    } catch (error: any) {
        console.error('Error fetching risk cost summary:', error);
        res.status(500).json({ error: 'Failed to fetch risk cost summary', details: error.message });
    }
};
