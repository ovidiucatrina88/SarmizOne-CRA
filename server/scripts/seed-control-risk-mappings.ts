#!/usr/bin/env tsx

/**
 * Seed control_risk_mappings with approved CIS safeguard proposals.
 * - control_id: CIS safeguard id (text)
 * - risk_library_id: risk_id from risk_library
 * - relevance_score: default 75 unless specified
 * - impact_type: 'both' by default
 * - reasoning: brief justification
 *
 * The script removes any existing rows with the same (control_id, risk_library_id)
 * before inserting, to avoid duplicates in the absence of a unique constraint.
 */

import { config } from 'dotenv';
import { Pool } from 'pg';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
config({ path: envFile, override: false });
config({ path: '.env', override: false });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        host: process.env.PGHOST || process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
        user: process.env.PGUSER || process.env.DB_USER || 'risk_dev',
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'risk_dev',
        database: process.env.PGDATABASE || process.env.DB_NAME || 'risk_dev',
      }
);

type Mapping = {
  control_id: string;
  risk_library_id: string;
  relevance_score?: number;
  impact_type?: 'inherent' | 'residual' | 'both';
  reasoning: string;
};

const mappings: Mapping[] = [
  // RL-DATA-BREACH-001
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '3.10', reasoning: 'Encrypt data in transit to reduce breach impact' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '3.11', reasoning: 'Encrypt data at rest to reduce breach impact' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '3.12', reasoning: 'Segment data by sensitivity to limit blast radius' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '3.13', reasoning: 'Prevent data exfiltration via DLP' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '3.14', reasoning: 'Log sensitive data access for detection' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '11.1', reasoning: 'Recovery process to restore after breach/ransom' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '11.3', reasoning: 'Protect recovery data from compromise' },
  { risk_library_id: 'RL-DATA-BREACH-001', control_id: '8.1', reasoning: 'Audit logging process to detect breaches' },

  // RISK-DATA-LEAKAGE--U-151-TPL
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '3.10', reasoning: 'Encrypt in transit to reduce leakage' },
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '3.11', reasoning: 'Encrypt at rest to reduce leakage' },
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '3.13', reasoning: 'DLP to prevent data exfiltration' },
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '3.14', reasoning: 'Logging to monitor data access' },
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '8.1', reasoning: 'Audit log management for visibility' },
  { risk_library_id: 'RISK-DATA-LEAKAGE--U-151-TPL', control_id: '8.2', reasoning: 'Collect audit logs for coverage' },

  // RL-CREDENTIAL-005
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '5.1', reasoning: 'Account inventory to spot risky accounts' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '5.2', reasoning: 'Unique passwords to prevent shared credential abuse' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '5.3', reasoning: 'Disable dormant accounts to reduce attack surface' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '6.1', reasoning: 'Controlled access granting' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '6.2', reasoning: 'Timely access revocation' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '14.3', reasoning: 'Train on authentication best practices' },
  { risk_library_id: 'RL-CREDENTIAL-005', control_id: '9.1', reasoning: 'Use supported clients to reduce phishing/malware risk' },

  // RISK-UNAUTHORIZED-AC-969-TPL
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '5.1', reasoning: 'Account inventory for access control' },
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '5.3', reasoning: 'Disable dormant accounts' },
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '6.1', reasoning: 'Access granting governance' },
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '6.2', reasoning: 'Access revocation governance' },
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '12.5', reasoning: 'Centralize AAA' },
  { risk_library_id: 'RISK-UNAUTHORIZED-AC-969-TPL', control_id: '14.3', reasoning: 'Authentication training' },

  // RISK-ORPHANED-ACCOUN-276-TPL
  { risk_library_id: 'RISK-ORPHANED-ACCOUN-276-TPL', control_id: '5.1', reasoning: 'Find orphaned accounts' },
  { risk_library_id: 'RISK-ORPHANED-ACCOUN-276-TPL', control_id: '5.3', reasoning: 'Disable orphaned/dormant accounts' },
  { risk_library_id: 'RISK-ORPHANED-ACCOUN-276-TPL', control_id: '6.2', reasoning: 'Revoke access on departure' },
  { risk_library_id: 'RISK-ORPHANED-ACCOUN-276-TPL', control_id: '14.3', reasoning: 'Train on account hygiene' },
  { risk_library_id: 'RISK-ORPHANED-ACCOUN-276-TPL', control_id: '8.1', reasoning: 'Logs to detect misuse' },

  // RISK-MISCONFIGURATIO-345-TPL
  { risk_library_id: 'RISK-MISCONFIGURATIO-345-TPL', control_id: '4.1', reasoning: 'Secure configuration process' },
  { risk_library_id: 'RISK-MISCONFIGURATIO-345-TPL', control_id: '4.2', reasoning: 'Secure network configuration process' },
  { risk_library_id: 'RISK-MISCONFIGURATIO-345-TPL', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'RISK-MISCONFIGURATIO-345-TPL', control_id: '7.2', reasoning: 'Remediation process' },
  { risk_library_id: 'RISK-MISCONFIGURATIO-345-TPL', control_id: '12.3', reasoning: 'Securely manage network infrastructure' },

  // RISK-UNAUTHORIZED-SO-757-TPL
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.1', reasoning: 'Software inventory' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.2', reasoning: 'Support lifecycle enforcement' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.3', reasoning: 'Remove unauthorized software' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.4', reasoning: 'Automate software inventory' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.5', reasoning: 'Allowlist software' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.6', reasoning: 'Allowlist libraries' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '2.7', reasoning: 'Allowlist scripts' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '7.1', reasoning: 'Vulnerability management for software' },
  { risk_library_id: 'RISK-UNAUTHORIZED-SO-757-TPL', control_id: '7.3', reasoning: 'Automated patching' },

  // RISK-EXPLOITED-SOFTW-277-TPL
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.1', reasoning: 'Software inventory' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.2', reasoning: 'Supported software only' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.3', reasoning: 'Remove unauthorized software' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.4', reasoning: 'Automated software inventory' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.5', reasoning: 'Allowlist software' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.6', reasoning: 'Allowlist libraries' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '2.7', reasoning: 'Allowlist scripts' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'RISK-EXPLOITED-SOFTW-277-TPL', control_id: '7.3', reasoning: 'Automated patching' },

  // RISK-INSECURE-SOFTWA-165-TPL
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '16.1', reasoning: 'Secure SDLC' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '16.2', reasoning: 'Vulnerability intake and fix' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '16.3', reasoning: 'Root cause analysis for vulns' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '7.2', reasoning: 'Remediation process' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '7.3', reasoning: 'Patch management' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '2.6', reasoning: 'Allowlist libraries' },
  { risk_library_id: 'RISK-INSECURE-SOFTWA-165-TPL', control_id: '2.7', reasoning: 'Allowlist scripts' },

  // RISK-UNKNOWN-VULNERA-913-TPL
  { risk_library_id: 'RISK-UNKNOWN-VULNERA-913-TPL', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'RISK-UNKNOWN-VULNERA-913-TPL', control_id: '7.2', reasoning: 'Remediation process' },
  { risk_library_id: 'RISK-UNKNOWN-VULNERA-913-TPL', control_id: '7.3', reasoning: 'Patch management' },
  { risk_library_id: 'RISK-UNKNOWN-VULNERA-913-TPL', control_id: '18.2', reasoning: 'External penetration tests' },
  { risk_library_id: 'RISK-UNKNOWN-VULNERA-913-TPL', control_id: '18.1', reasoning: 'Penetration testing program' },

  // RISK-UNMANAGED-DEVIC-414-TPL
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '1.1', reasoning: 'Asset inventory' },
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '1.3', reasoning: 'Active discovery' },
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '1.4', reasoning: 'DHCP logging' },
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '1.5', reasoning: 'Passive discovery' },
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '2.1', reasoning: 'Software inventory on devices' },
  { risk_library_id: 'RISK-UNMANAGED-DEVIC-414-TPL', control_id: '2.3', reasoning: 'Remove unauthorized software' },

  // RISK-UNSEGMENTED-NET-571-TPL
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '12.1', reasoning: 'Up-to-date network infrastructure' },
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '12.2', reasoning: 'Secure network architecture' },
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '12.3', reasoning: 'Secure management of network infra' },
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '12.4', reasoning: 'Architecture diagrams for segmentation' },
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '12.5', reasoning: 'Centralized AAA' },
  { risk_library_id: 'RISK-UNSEGMENTED-NET-571-TPL', control_id: '3.12', reasoning: 'Data segmentation by sensitivity' },

  // RISK-LACK-OF-VISIBIL-973-TPL
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '8.1', reasoning: 'Audit log management' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '8.2', reasoning: 'Collect audit logs' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '8.3', reasoning: 'Adequate log storage' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '13.1', reasoning: 'Centralize security alerting' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '13.2', reasoning: 'Host-based IDS' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '1.3', reasoning: 'Active discovery for visibility' },
  { risk_library_id: 'RISK-LACK-OF-VISIBIL-973-TPL', control_id: '1.5', reasoning: 'Passive discovery for visibility' },

  // RISK-UNCOORDINATED-R-583-TPL
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '17.1', reasoning: 'Designate incident handlers' },
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '17.2', reasoning: 'Maintain incident contact info' },
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '11.1', reasoning: 'Recovery process' },
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '11.2', reasoning: 'Automated backups' },
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '11.5', reasoning: 'Test data recovery' },
  { risk_library_id: 'RISK-UNCOORDINATED-R-583-TPL', control_id: '18.1', reasoning: 'Pen test program to exercise response' },

  // Phishing risks/templates
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '14.1', reasoning: 'Awareness program' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '14.2', reasoning: 'Train on social engineering' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '14.3', reasoning: 'Auth best practices' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '9.1', reasoning: 'Supported browsers/email clients' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '9.2', reasoning: 'DNS filtering' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '13.1', reasoning: 'Centralize alerting for phishing' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '10.1', reasoning: 'Anti-malware' },
  { risk_library_id: 'RISK-PHISHING-ATTACK-407-TPL', control_id: '10.2', reasoning: 'Auto signature updates' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '14.1', reasoning: 'Awareness program' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '14.2', reasoning: 'Train on social engineering' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '14.3', reasoning: 'Auth best practices' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '9.1', reasoning: 'Supported browsers/email clients' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '9.2', reasoning: 'DNS filtering' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '13.1', reasoning: 'Central alerting for phishing' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '10.1', reasoning: 'Anti-malware' },
  { risk_library_id: 'RISK-PHISHING--SOCIA-698-TPL', control_id: '10.2', reasoning: 'Auto signature updates' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '14.1', reasoning: 'Awareness program' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '14.2', reasoning: 'Train on social engineering' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '14.3', reasoning: 'Auth best practices' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '9.1', reasoning: 'Supported browsers/email clients' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '9.2', reasoning: 'DNS filtering' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '13.1', reasoning: 'Central alerting for phishing' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '10.1', reasoning: 'Anti-malware' },
  { risk_library_id: 'TPL-PHISHING-001', control_id: '10.2', reasoning: 'Auto signature updates' },

  // Ransomware
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '10.1', reasoning: 'Anti-malware' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '10.2', reasoning: 'Auto signature updates' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '7.3', reasoning: 'Patch management' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '11.1', reasoning: 'Recovery process' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '11.2', reasoning: 'Automated backups' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '11.5', reasoning: 'Test recovery' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '12.2', reasoning: 'Network segmentation/architecture' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '17.1', reasoning: 'Incident handling personnel' },
  { risk_library_id: 'RL-RANSOMWARE-002', control_id: '17.2', reasoning: 'Incident contact info' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '10.1', reasoning: 'Anti-malware' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '10.2', reasoning: 'Auto signature updates' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '7.1', reasoning: 'Vulnerability management' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '7.3', reasoning: 'Patch management' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '11.1', reasoning: 'Recovery process' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '11.2', reasoning: 'Automated backups' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '11.5', reasoning: 'Test recovery' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '12.2', reasoning: 'Network segmentation/architecture' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '17.1', reasoning: 'Incident handling personnel' },
  { risk_library_id: 'TPL-RANSOMWARE-001', control_id: '17.2', reasoning: 'Incident contact info' },

  // Supply chain / third-party
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '15.1', reasoning: 'Inventory service providers' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '15.2', reasoning: 'Provider management policy' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '12.4', reasoning: 'Document architectures with vendors' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '3.10', reasoning: 'Encrypt data in transit with providers' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '3.11', reasoning: 'Encrypt data at rest' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '7.1', reasoning: 'Vulnerability management for supplier findings' },
  { risk_library_id: 'RISK-THIRD-PARTY-RIS-177-TPL', control_id: '7.2', reasoning: 'Remediation for supplier findings' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '15.1', reasoning: 'Inventory service providers' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '15.2', reasoning: 'Provider management policy' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '12.4', reasoning: 'Document architectures with vendors' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '3.10', reasoning: 'Encrypt data in transit with providers' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '3.11', reasoning: 'Encrypt data at rest' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '7.1', reasoning: 'Vulnerability management for supplier findings' },
  { risk_library_id: 'RL-SUPPLY-CHAIN-004', control_id: '7.2', reasoning: 'Remediation for supplier findings' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '15.1', reasoning: 'Inventory service providers' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '15.2', reasoning: 'Provider management policy' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '12.4', reasoning: 'Document architectures with vendors' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '3.10', reasoning: 'Encrypt data in transit with providers' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '3.11', reasoning: 'Encrypt data at rest' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '7.1', reasoning: 'Vulnerability management for supplier findings' },
  { risk_library_id: 'TPL-SUPPLY-CHAIN-001', control_id: '7.2', reasoning: 'Remediation for supplier findings' },

  // Compliance
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '3.10', reasoning: 'Data protection requirement (transit)' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '3.11', reasoning: 'Data protection requirement (rest)' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '3.14', reasoning: 'Logging for compliance evidence' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '11.1', reasoning: 'Recovery process for resilience mandates' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '11.3', reasoning: 'Protect recovery data' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '14.1', reasoning: 'Awareness training requirements' },
  { risk_library_id: 'RL-COMPLIANCE-003', control_id: '15.2', reasoning: 'Vendor policy for regulatory clauses' },
];

async function main() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `SELECT setval('control_risk_mappings_id_seq', (SELECT COALESCE(MAX(id), 0) FROM control_risk_mappings));`
    );

    let inserted = 0;
    for (const m of mappings) {
      await client.query(
        `DELETE FROM control_risk_mappings WHERE control_id = $1 AND risk_library_id = $2`,
        [m.control_id, m.risk_library_id]
      );

      const res = await client.query(
        `
        INSERT INTO control_risk_mappings
          (control_id, risk_library_id, relevance_score, impact_type, reasoning)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
        `,
        [
          m.control_id,
          m.risk_library_id,
          m.relevance_score ?? 75,
          m.impact_type ?? 'both',
          m.reasoning,
        ]
      );
      inserted += res.rowCount ?? 0;
    }

    await client.query('COMMIT');
    console.log(`Inserted ${inserted} control_risk_mappings (previous duplicates removed).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to seed control_risk_mappings:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
