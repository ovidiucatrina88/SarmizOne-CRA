# Control Mapping System Guide

## How Control Recommendations Work

The system uses a two-tier approach to show controls for each risk:

### 1. Real Database Associations (Primary)
- Controls manually linked in the `risk_controls` table
- Shows actual effectiveness percentages from your control inventory
- Currently only 3 risks have manual associations:
  - **RISK-RANSOMWARE-439** → Deploy Anti-Malware/EDR (7.7% effectiveness)
  - **RISK-DATA-299** → Encrypt Sensitive Data at Rest (7.4% effectiveness)
  - **RISK-DATA-299** → Remote Locate (6.0% effectiveness)

### 2. Intelligent Pattern Matching (Fallback)
- Activates when no manual associations exist
- Uses regex patterns to match threat types with control capabilities
- Shows as amber/yellow "Suggested Controls" in the UI

## Current Pattern Rules

The intelligent mapping uses these rules (in `server/services/controlMapping.ts`):

```javascript
// Ransomware protection
{
  threatPattern: /ransomware|crypto|encryption malware/i,
  controlPattern: /anti.*malware|edr|endpoint.*detection/i,
  score: 95,
  priority: 'high',
  reasoning: 'EDR/Anti-malware directly prevents ransomware execution'
}

// Data breach protection  
{
  threatPattern: /data.*breach/i,
  vulnerabilityPattern: /access.*control|insufficient.*access/i,
  controlPattern: /encrypt|encryption|sensitive.*data/i,
  score: 92,
  priority: 'high',
  reasoning: 'Encryption is critical when access controls are insufficient'
}

// Credential theft protection
{
  threatPattern: /credential.*theft/i,
  controlPattern: /multi.*factor|mfa|authentication/i,
  score: 95,
  priority: 'high',
  reasoning: 'MFA prevents unauthorized access with stolen credentials'
}
```

## How to Customize the Logic

### Option 1: Add Manual Associations (Recommended)
```sql
-- Link a control to a risk
INSERT INTO risk_controls (risk_id, control_id) 
SELECT r.id, c.id 
FROM risks r, controls c 
WHERE r.risk_id = 'RISK-CREDENTIAL-534' 
AND c.control_id = 'CTRL-MFA-001';
```

### Option 2: Modify Pattern Rules
Edit `server/services/controlMapping.ts` to add new patterns:

```javascript
// Add new threat-control mapping
{
  threatPattern: /phishing|social.*engineering/i,
  controlPattern: /security.*awareness|training|education/i,
  score: 85,
  priority: 'high',
  reasoning: 'Security training reduces phishing susceptibility'
}
```

### Option 3: Use Auto-Mapping API
Preview potential mappings:
```bash
curl http://localhost:5000/api/control-mapping/preview
```

Apply all intelligent mappings:
```bash
curl -X POST http://localhost:5000/api/control-mapping/apply
```

Clear all mappings:
```bash
curl -X DELETE http://localhost:5000/api/control-mapping/clear
```

## Why Some Controls Aren't Mapped

Looking at your control inventory, several controls aren't being mapped because:

1. **Generic Names**: Controls like "Test Control Creation" don't match threat-specific patterns
2. **Missing Threat Patterns**: No rules exist for certain threat types in your risks
3. **Low Scores**: Pattern matches below 50% are filtered out

## Recommendations to Improve Mapping

### 1. Add Missing Threat Patterns
Your risks mention these threats that need pattern rules:
- "Individual hackers" → should map to access controls, monitoring
- "System Vulnerability" → should map to patch management, vulnerability scanning

### 2. Enhance Control Descriptions
Add more descriptive text to controls so patterns can match better:
- Instead of: "Test Control Creation"
- Use: "Multi-Factor Authentication for User Accounts"

### 3. Create Specific Rules for Your Environment
Add patterns that match your actual risk scenarios:

```javascript
// For your specific risks
{
  threatPattern: /individual.*hackers|unauthorized.*users/i,
  vulnerabilityPattern: /weak.*password/i,
  controlPattern: /authentication|password.*policy|access.*control/i,
  score: 90,
  priority: 'high',
  reasoning: 'Strong authentication prevents unauthorized access'
}
```

## Current Mapping Results

After running the auto-mapper, you should see controls properly associated with risks that match the patterns. The system prioritizes matches with higher scores and more specific pattern combinations.

To see all current mappings:
```bash
curl http://localhost:5000/api/control-mapping/current
```