
import { storage } from '../services/storage';
import { db } from '../db';
import { risks, controls, riskControls, assets } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Mocking the calculateControlRoi from shared/utils/controlRoi.ts to ensure we use exact same logic
// We copy it here to avoid import issues with aliases in the script environment
function calculateControlRoi_Mock(
    control: any,
    risks: any[],
    assets: any[],
) {
    // Convert associatedRisks to strings if they're numbers
    const controlRiskIds = control.associatedRisks ?
        control.associatedRisks.map((id: any) => id.toString()) : [];

    // Find all risks that are associated with this control
    const assocRisks = risks.filter((r) => {
        const riskIdStr = r.riskId ? r.riskId.toString() : '';
        const riskNumId = r.id ? r.id.toString() : '';
        const matchByRiskId = controlRiskIds.includes(riskIdStr);
        const matchById = controlRiskIds.includes(riskNumId);
        return matchByRiskId || matchById;
    });

    // Calculate total residual risk (after controls)
    const totalRiskImpact = assocRisks.reduce(
        (sum, r) => sum + (Number(r.residualRisk) || 0),
        0,
    );

    // Calculate total inherent risk (before controls)
    const totalInherentRisk = assocRisks.reduce(
        (sum, r) => sum + (Number(r.inherentRisk) || Number(r.residualRisk) || 0),
        0,
    );

    // Collect unique asset IDs
    const uniqueAssetIds = new Set<string>();
    assocRisks.forEach((risk) => {
        const fullRisk = risks.find(r => r.riskId === risk.riskId);
        if (fullRisk && (fullRisk as any).associatedAssets) {
            (fullRisk as any).associatedAssets.forEach((assetId: string) => {
                uniqueAssetIds.add(assetId);
            });
        }
    });

    // Calculate total agent count
    let totalAgents = 0;
    if (control.implementationStatus === 'fully_implemented') {
        totalAgents = Array.from(uniqueAssetIds).reduce(
            (sum, assetId) => {
                const asset = assets.find(a => a.assetId === assetId);
                return sum + (asset?.agentCount || 0);
            },
            0
        );
    } else if (control.implementationStatus === 'in_progress') {
        totalAgents = control.deployedAgentCount || 0;
    }

    // Calculate Cost
    const baseImplementationCost = typeof control.implementationCost === 'string'
        ? parseFloat(control.implementationCost) || 0
        : control.implementationCost || 0;

    const costPerAgent = typeof control.costPerAgent === 'string'
        ? parseFloat(control.costPerAgent) || 0
        : control.costPerAgent || 0;

    let implCost = baseImplementationCost;
    if (control.isPerAgent || control.isPerAgentPricing) { // Handle both property names
        implCost = costPerAgent * totalAgents;
    }

    // Calculate Risk Reduction
    const riskReduction = totalInherentRisk - totalRiskImpact;

    const roi = implCost > 0 ? (riskReduction - implCost) / implCost : 0;

    return {
        method: "Control ROI Page Logic",
        riskReduction,
        implCost,
        roi: roi * 100,
        details: {
            totalInherentRisk,
            totalRiskImpact,
            totalAgents,
            uniqueAssetIds: Array.from(uniqueAssetIds)
        }
    };
}

async function investigateDiscrepancy() {
    try {
        console.log("Starting Investigation...");

        const allControls = await storage.getAllControls();
        const allRisks = await storage.getAllRisks();
        const allAssets = await storage.getAllAssets();

        // Find the control that likely has the discrepancy
        // We'll look for one with 'fully_implemented' status and high effectiveness
        const targetControl = allControls.find(c =>
            (c.implementationStatus === 'fully_implemented' || c.implementationStatus === 'in_progress') &&
            c.associatedRisks && c.associatedRisks.length > 0
        );

        if (!targetControl) {
            console.log("No suitable control found for investigation.");
            return;
        }

        console.log(`Investigating Control: ${targetControl.name} (${targetControl.controlId})`);

        // --- 1. Dashboard Logic (Hybrid) ---
        console.log("\n--- Dashboard Logic (Hybrid) ---");
        const associatedRiskIds = targetControl.associatedRisks || [];
        const associatedRisks = allRisks.filter(r => associatedRiskIds.includes(r.id.toString()) || associatedRiskIds.includes(r.riskId));

        let totalRiskReduction_Dash = 0;
        const uniqueAssetIds_Dash = new Set<string>();

        console.log(`Associated Risks: ${associatedRisks.length}`);

        associatedRisks.forEach(r => {
            let inherentRisk = parseFloat(r.inherentRisk || '0');
            if (inherentRisk === 0 && r.parameters) {
                const params = r.parameters as any;
                const lossMagnitude = parseFloat(params.primaryLossMagnitude?.avg || '0');
                const probability = parseFloat(params.probabilityOfAction?.avg || '0');
                inherentRisk = lossMagnitude * probability;
            }

            let effectiveness = targetControl.controlEffectiveness || 0;
            if (effectiveness > 1) {
                if (effectiveness <= 10) effectiveness = effectiveness / 10;
                else if (effectiveness <= 100) effectiveness = effectiveness / 100;
                else effectiveness = 1;
            }

            const reduction = inherentRisk * effectiveness;
            totalRiskReduction_Dash += reduction;

            console.log(`- Risk ${r.riskId}: Inherent=${inherentRisk}, Eff=${effectiveness}, Reduction=${reduction}`);

            if (r.associatedAssets && Array.isArray(r.associatedAssets)) {
                r.associatedAssets.forEach(assetId => uniqueAssetIds_Dash.add(assetId));
            }
        });

        const implementationCost_Dash = parseFloat(targetControl.implementationCost || '0');

        let totalAgentCount_Dash = 0;
        if (targetControl.isPerAgent) {
            uniqueAssetIds_Dash.forEach(assetId => {
                const asset = allAssets.find(a => a.assetId === assetId);
                if (asset) {
                    totalAgentCount_Dash += (asset.agentCount || 0);
                }
            });
        }

        const agentCost_Dash = targetControl.isPerAgent
            ? totalAgentCount_Dash * parseFloat(targetControl.costPerAgent || '0')
            : 0;

        const totalCost_Dash = implementationCost_Dash + agentCost_Dash;

        let roi_Dash = 0;
        if (totalCost_Dash > 0) {
            roi_Dash = ((totalRiskReduction_Dash - totalCost_Dash) / totalCost_Dash) * 100;
        }

        console.log(`Total Risk Reduction: ${totalRiskReduction_Dash}`);
        console.log(`Total Cost: ${totalCost_Dash} (Impl: ${implementationCost_Dash}, Agent: ${agentCost_Dash})`);
        console.log(`ROI: ${roi_Dash.toFixed(2)}%`);


        // --- 2. Control ROI Page Logic ---
        console.log("\n--- Control ROI Page Logic ---");

        // Prepare risks data as the frontend expects it (with inherent/residual values)
        const risksForAnalysis = allRisks.map(risk => {
            const inherent = parseFloat(risk.inherentRisk || '0') ||
                (parseFloat((risk.parameters as any)?.primaryLossMagnitude?.avg || '0') *
                    parseFloat((risk.parameters as any)?.probabilityOfAction?.avg || '0')) || 0;

            const residual = parseFloat(risk.residualRisk || '0') || (inherent * 0.5); // Fallback logic from frontend

            return {
                id: risk.id,
                riskId: risk.riskId,
                inherentRisk: inherent,
                residualRisk: residual,
                associatedAssets: risk.associatedAssets || []
            };
        });

        const result_Page = calculateControlRoi_Mock(targetControl, risksForAnalysis, allAssets);

        console.log(`Total Risk Reduction: ${result_Page.riskReduction}`);
        console.log(`Total Cost: ${result_Page.implCost}`);
        console.log(`ROI: ${result_Page.roi.toFixed(2)}%`);
        console.log(`Details:`, result_Page.details);

        // --- Comparison ---
        console.log("\n--- Comparison ---");
        console.log(`Dashboard ROI: ${roi_Dash.toFixed(2)}%`);
        console.log(`Page ROI:      ${result_Page.roi.toFixed(2)}%`);
        console.log(`Diff Reduction: ${totalRiskReduction_Dash} vs ${result_Page.riskReduction}`);
        console.log(`Diff Cost:      ${totalCost_Dash} vs ${result_Page.implCost}`);

    } catch (error) {
        console.error("Error during investigation:", error);
    }
}

investigateDiscrepancy();
