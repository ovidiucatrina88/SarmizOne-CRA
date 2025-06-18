/**
 * Control Auto-Mapping Service
 * Automatically associates controls with risks based on threat patterns and control capabilities
 */

import { db } from '../db';
import { risks, controls, riskControls } from '../../shared/schema';
import { eq, sql } from 'drizzle-orm';

interface MappingRule {
  threatPattern: RegExp;
  vulnerabilityPattern?: RegExp;
  controlPattern: RegExp;
  score: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

// Enhanced mapping rules based on your actual control inventory
const CONTROL_MAPPING_RULES: MappingRule[] = [
  // Ransomware protection
  {
    threatPattern: /ransomware|crypto|encryption malware/i,
    vulnerabilityPattern: /system|endpoint|malware/i,
    controlPattern: /anti.*malware|edr|endpoint.*detection|endpoint.*protection/i,
    score: 95,
    priority: 'high',
    reasoning: 'EDR/Anti-malware directly prevents ransomware execution'
  },
  {
    threatPattern: /ransomware/i,
    controlPattern: /backup|data.*backup|recovery/i,
    score: 90,
    priority: 'high',
    reasoning: 'Backup systems enable recovery from ransomware attacks'
  },
  
  // Data protection
  {
    threatPattern: /data.*breach|information.*disclosure|data.*leak/i,
    vulnerabilityPattern: /access.*control|insufficient.*access/i,
    controlPattern: /encrypt.*data|encryption|data.*encryption/i,
    score: 95,
    priority: 'high',
    reasoning: 'Encryption protects data confidentiality during breaches'
  },
  {
    threatPattern: /data.*breach|unauthorized.*access/i,
    controlPattern: /access.*control|identity.*management|authentication/i,
    score: 90,
    priority: 'high',
    reasoning: 'Access controls prevent unauthorized data access'
  },
  {
    threatPattern: /data.*breach/i,
    controlPattern: /data.*loss.*prevention|dlp|monitoring/i,
    score: 85,
    priority: 'high',
    reasoning: 'DLP systems detect and prevent data exfiltration'
  },
  
  // Credential protection
  {
    threatPattern: /credential.*theft|password.*attack|authentication.*bypass/i,
    vulnerabilityPattern: /weak.*password|password.*policy/i,
    controlPattern: /multi.*factor|mfa|two.*factor|2fa|authentication/i,
    score: 95,
    priority: 'high',
    reasoning: 'MFA prevents unauthorized access with stolen credentials'
  },
  {
    threatPattern: /credential.*theft|password.*attack/i,
    controlPattern: /password.*policy|password.*management|privileged.*access/i,
    score: 85,
    priority: 'high',
    reasoning: 'Strong password policies reduce credential vulnerability'
  },
  
  // Mobile device protection
  {
    threatPattern: /mobile.*device|device.*theft|lost.*device/i,
    controlPattern: /remote.*locate|remote.*wipe|device.*management|mobile.*management/i,
    score: 90,
    priority: 'high',
    reasoning: 'Remote device controls mitigate mobile security risks'
  },
  
  // General security controls (lower priority)
  {
    threatPattern: /external.*threat|cyber.*attack/i,
    controlPattern: /firewall|network.*security|perimeter.*security/i,
    score: 70,
    priority: 'medium',
    reasoning: 'Network security controls provide defense against external threats'
  },
  {
    threatPattern: /system.*vulnerability|software.*vulnerability/i,
    controlPattern: /patch.*management|vulnerability.*management|software.*update/i,
    score: 80,
    priority: 'medium',
    reasoning: 'Patch management addresses system vulnerabilities'
  },
  
  // Catch-all rules for common control types
  {
    threatPattern: /.*/i, // Matches any threat
    controlPattern: /incident.*response|emergency.*response/i,
    score: 60,
    priority: 'medium',
    reasoning: 'Incident response is valuable for all security threats'
  },
  {
    threatPattern: /.*/i,
    controlPattern: /security.*monitoring|siem|logging|audit.*log/i,
    score: 65,
    priority: 'medium',
    reasoning: 'Security monitoring helps detect various threats'
  }
];

/**
 * Calculate mapping score between a risk and control
 */
function calculateMappingScore(
  risk: any, 
  control: any
): { score: number; reasoning: string; priority: 'high' | 'medium' | 'low' } | null {
  
  const riskText = `${risk.name} ${risk.threatCommunity} ${risk.vulnerability}`.toLowerCase();
  const controlText = `${control.name} ${control.description}`.toLowerCase();
  
  let bestMatch = { score: 0, reasoning: '', priority: 'low' as const };
  
  for (const rule of CONTROL_MAPPING_RULES) {
    let matches = 0;
    let totalChecks = 1; // Always check threat pattern
    
    // Check threat pattern (required)
    if (rule.threatPattern.test(riskText)) {
      matches++;
    } else {
      continue; // Skip if threat pattern doesn't match
    }
    
    // Check vulnerability pattern (optional)
    if (rule.vulnerabilityPattern) {
      totalChecks++;
      if (rule.vulnerabilityPattern.test(riskText)) {
        matches++;
      }
    }
    
    // Check control pattern (required)
    totalChecks++;
    if (rule.controlPattern.test(controlText)) {
      matches++;
    } else {
      continue; // Skip if control pattern doesn't match
    }
    
    // Calculate match percentage and adjust score
    const matchPercentage = matches / totalChecks;
    const adjustedScore = rule.score * matchPercentage;
    
    if (adjustedScore > bestMatch.score) {
      bestMatch = {
        score: adjustedScore,
        reasoning: rule.reasoning,
        priority: rule.priority
      };
    }
  }
  
  // Only return mappings with score > 50
  return bestMatch.score > 50 ? bestMatch : null;
}

/**
 * Auto-map controls to risks based on intelligent matching
 */
export async function autoMapControlsToRisks(dryRun: boolean = false): Promise<{
  mappings: Array<{
    riskId: string;
    controlId: string;
    score: number;
    reasoning: string;
    priority: string;
  }>;
  summary: {
    totalMappings: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
}> {
  
  // Get all risks and controls
  const allRisks = await db.select().from(risks);
  const allControls = await db.select().from(controls);
  
  const mappings: Array<{
    riskId: string;
    controlId: string;
    score: number;
    reasoning: string;
    priority: string;
  }> = [];
  
  console.log(`[AutoMapper] Analyzing ${allRisks.length} risks and ${allControls.length} controls`);
  
  // Check each risk-control combination
  for (const risk of allRisks) {
    for (const control of allControls) {
      const match = calculateMappingScore(risk, control);
      
      if (match) {
        mappings.push({
          riskId: risk.riskId,
          controlId: control.controlId,
          score: match.score,
          reasoning: match.reasoning,
          priority: match.priority
        });
        
        // If not dry run, create the actual association
        if (!dryRun) {
          try {
            // Check if association already exists
            const existing = await db
              .select()
              .from(riskControls)
              .where(sql`risk_id = ${risk.id} AND control_id = ${control.id}`)
              .limit(1);
            
            if (existing.length === 0) {
              await db.insert(riskControls).values({
                riskId: risk.id,
                controlId: control.id
              });
              console.log(`[AutoMapper] Associated ${control.controlId} with ${risk.riskId} (score: ${match.score.toFixed(1)})`);
            }
          } catch (error) {
            console.error(`[AutoMapper] Error creating association: ${error}`);
          }
        }
      }
    }
  }
  
  // Sort by score (highest first)
  mappings.sort((a, b) => b.score - a.score);
  
  // Calculate summary
  const summary = {
    totalMappings: mappings.length,
    highPriority: mappings.filter(m => m.priority === 'high').length,
    mediumPriority: mappings.filter(m => m.priority === 'medium').length,
    lowPriority: mappings.filter(m => m.priority === 'low').length,
  };
  
  console.log(`[AutoMapper] Analysis complete: ${summary.totalMappings} potential mappings found`);
  console.log(`[AutoMapper] Priority breakdown: ${summary.highPriority} high, ${summary.mediumPriority} medium, ${summary.lowPriority} low`);
  
  return { mappings, summary };
}

/**
 * Remove all auto-generated control mappings
 */
export async function clearAutoMappings(): Promise<number> {
  // Note: This removes ALL mappings, not just auto-generated ones
  // In a production system, you'd want to track which are auto-generated
  const result = await db.delete(riskControls);
  return result.rowCount || 0;
}

/**
 * Get current control mappings for review
 */
export async function getCurrentMappings(): Promise<Array<{
  riskId: string;
  riskName: string;
  controlId: string;
  controlName: string;
  controlType: string;
}>> {
  const result = await db
    .select({
      riskId: risks.riskId,
      riskName: risks.name,
      controlId: controls.controlId,
      controlName: controls.name,
      controlType: controls.controlType
    })
    .from(riskControls)
    .innerJoin(risks, eq(riskControls.riskId, risks.id))
    .innerJoin(controls, eq(riskControls.controlId, controls.id))
    .orderBy(risks.riskId, controls.controlType);
    
  return result;
}