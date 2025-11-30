#!/usr/bin/env tsx

/**
 * Import CIS Controls v8.1.2 safeguards from the bundled Excel file into control_library.
 * - Reads sheet "Controls v8.1.2" from CIS_Controls_Version_8.1.2___March_2025.xlsx
 * - Maps fields to the existing control_library schema
 * - Upserts on control_id so existing rows are updated, new ones are inserted
 */

import path from 'path';
import { config } from 'dotenv';
import xlsx from 'xlsx';
import { Pool } from 'pg';

// Load env (prefer NODE_ENV-specific file, then fall back to .env if present)
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

const CONTROL_TYPE_MAP: Record<string, 'preventive' | 'detective' | 'corrective'> = {
  Identify: 'preventive',
  Protect: 'preventive',
  Govern: 'preventive',
  Detect: 'detective',
  Respond: 'corrective',
  Recover: 'corrective',
};

const CONTROL_CATEGORY_MAP: Record<string, 'technical' | 'administrative' | 'physical'> = {
  Devices: 'technical',
  Software: 'technical',
  Data: 'technical',
  Network: 'technical',
  Users: 'administrative',
  Documentation: 'administrative',
};

type Row = {
  'CIS Control'?: string | null;
  'CIS Safeguard'?: string | null;
  'Asset Class'?: string | null;
  'Security Function'?: string | null;
  Title?: string | null;
  Description?: string | null;
  IG1?: string | null;
  IG2?: string | null;
  IG3?: string | null;
};

type MappedControl = {
  control_id: string;
  name: string;
  description: string;
  control_type: string;
  control_category: string;
  compliance_framework: string;
  cis_mappings: string[];
  cloud_domain: string | null;
};

function normalizeText(value: string | null | undefined): string {
  return (value || '').replace(/\s+/g, ' ').trim();
}

function mapRow(row: Row): MappedControl | null {
  if (!row['CIS Safeguard']) return null;

  const controlId = normalizeText(row['CIS Safeguard']);
  const title = normalizeText(row.Title);
  const description = normalizeText(row.Description);
  const assetClass = normalizeText(row['Asset Class']);
  const secFunction = normalizeText(row['Security Function']);

  const control_type = CONTROL_TYPE_MAP[secFunction] || 'preventive';
  const control_category = CONTROL_CATEGORY_MAP[assetClass] || 'technical';

  return {
    control_id: controlId,
    name: title,
    description,
    control_type,
    control_category,
    compliance_framework: 'CIS',
    cis_mappings: [controlId],
    cloud_domain: assetClass || null,
  };
}

async function loadControlsFromExcel(filePath: string): Promise<MappedControl[]> {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets['Controls v8.1.2'];
  if (!sheet) {
    throw new Error('Sheet "Controls v8.1.2" not found in workbook');
  }

  const rawRows = xlsx.utils.sheet_to_json<Row>(sheet, { defval: null, raw: false });
  const controls = rawRows
    .map(mapRow)
    .filter((c): c is MappedControl => !!c);

  return controls;
}

async function upsertControls(controls: MappedControl[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure sequence will not collide with existing ids
    await client.query(
      `SELECT setval('control_library_id_seq', (SELECT COALESCE(MAX(id), 0) FROM control_library));`
    );

    const upsertSql = `
      INSERT INTO control_library (
        control_id,
        name,
        description,
        control_type,
        control_category,
        compliance_framework,
        cis_mappings,
        gap_level,
        item_type,
        implementation_status,
        control_effectiveness,
        implementation_cost,
        cost_per_agent,
        is_per_agent_pricing,
        notes,
        nist_csf,
        iso27001,
        cloud_domain,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        'No Gap', 'template', 'planned', 0, 0, 0, false, '',
        '{}', '{}', $8, NOW()
      )
      ON CONFLICT (control_id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        control_type = EXCLUDED.control_type,
        control_category = EXCLUDED.control_category,
        compliance_framework = EXCLUDED.compliance_framework,
        cis_mappings = EXCLUDED.cis_mappings,
        gap_level = EXCLUDED.gap_level,
        item_type = EXCLUDED.item_type,
        implementation_status = EXCLUDED.implementation_status,
        control_effectiveness = EXCLUDED.control_effectiveness,
        implementation_cost = EXCLUDED.implementation_cost,
        cost_per_agent = EXCLUDED.cost_per_agent,
        is_per_agent_pricing = EXCLUDED.is_per_agent_pricing,
        notes = EXCLUDED.notes,
        nist_csf = EXCLUDED.nist_csf,
        iso27001 = EXCLUDED.iso27001,
        cloud_domain = EXCLUDED.cloud_domain,
        updated_at = NOW()
      RETURNING (xmax = 0) AS inserted;
    `;

    let inserted = 0;
    let updated = 0;

    for (const control of controls) {
      const params = [
        control.control_id,
        control.name,
        control.description,
        control.control_type,
        control.control_category,
        control.compliance_framework,
        control.cis_mappings,
        control.cloud_domain,
      ];
      const res = await client.query(upsertSql, params);
      if (res.rows[0]?.inserted) {
        inserted += 1;
      } else {
        updated += 1;
      }
    }

    await client.query('COMMIT');
    console.log(`Upsert complete: ${inserted} inserted, ${updated} updated (total ${controls.length}).`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to upsert controls:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  const excelPath = path.join(process.cwd(), 'CIS_Controls_Version_8.1.2___March_2025.xlsx');
  console.log('Loading controls from', excelPath);

  const controls = await loadControlsFromExcel(excelPath);
  console.log(`Parsed ${controls.length} safeguards from Excel.`);

  if (!controls.length) {
    throw new Error('No controls parsed from Excel; aborting import.');
  }

  await upsertControls(controls);

  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM control_library');
  console.log('control_library row count after import:', rows[0]?.count);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
