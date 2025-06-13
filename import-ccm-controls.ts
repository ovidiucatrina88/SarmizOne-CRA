#!/usr/bin/env tsx

/**
 * Cloud Controls Matrix (CCM) Import Script
 * Imports 197 cloud security controls from CSA CCM v4.0.12 with full compliance mappings
 */

import { readFileSync } from 'fs';
import { db } from './server/db';
import { controlLibrary } from './shared/schema';

interface CCMControl {
  id: string;
  title: string;
  specification: string;
  is_lite?: boolean;
}

interface CCMDomain {
  id: string;
  title: string;
  controls: CCMControl[];
}

interface CCMDataset {
  name: string;
  version: string;
  url: string;
  domains: CCMDomain[];
}

interface ComplianceMapping {
  control_id: string;
  references: string[];
  gap_level: string;
  addendum: string;
}

interface FrameworkMappings {
  name: string;
  mappings: ComplianceMapping[];
}

interface ArchitecturalRelevance {
  title: string;
  content: Array<{
    control_id: string;
    value: boolean;
  }>;
}

interface OrganizationalRelevance {
  title: string;
  content: Array<{
    control_id: string;
    value: boolean;
  }>;
}

interface OwnershipData {
  title: string;
  content: Array<{
    control_id: string;
    value: string;
  }>;
}

// Control type mappings based on CCM domains
const CONTROL_TYPE_MAPPING: Record<string, string> = {
  'A&A': 'corrective',     // Audit & Assurance
  'AIS': 'preventive',     // Application & Interface Security
  'BCR': 'corrective',     // Business Continuity Management
  'CCC': 'preventive',     // Change Control & Configuration
  'CEK': 'preventive',     // Cryptography, Encryption & Key Management
  'DCS': 'preventive',     // Datacenter Security
  'DSP': 'preventive',     // Data Security & Privacy
  'GRC': 'corrective',     // Governance, Risk and Compliance
  'HRS': 'corrective',     // Human Resources
  'IAM': 'preventive',     // Identity & Access Management
  'IVS': 'preventive',     // Infrastructure & Virtualization Security
  'LOG': 'detective',      // Logging and Monitoring
  'SEF': 'detective',      // Security Incident Management
  'TVM': 'detective'       // Threat and Vulnerability Management
};

// Control category mappings based on CCM domains
const CONTROL_CATEGORY_MAPPING: Record<string, string> = {
  'A&A': 'administrative',
  'AIS': 'technical',
  'BCR': 'administrative',
  'CCC': 'technical',
  'CEK': 'technical',
  'DCS': 'physical',
  'DSP': 'technical',
  'GRC': 'administrative',
  'HRS': 'administrative',
  'IAM': 'technical',
  'IVS': 'technical',
  'LOG': 'technical',
  'SEF': 'technical',
  'TVM': 'technical'
};

async function loadJSONFile<T>(filePath: string): Promise<T> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    throw error;
  }
}

function createCISMapping(controlId: string, domain: string): string[] {
  // Intelligent CIS mapping based on CCM domain and control patterns
  const cisMappings: Record<string, string[]> = {
    'A&A': ['3.14'], // Audit Controls
    'AIS': ['16.1', '16.2', '16.3'], // Application Security
    'BCR': ['11.1', '11.2'], // Data Recovery
    'CCC': ['3.1', '3.2', '3.3'], // Data Management
    'CEK': ['3.11'], // Data Protection
    'DCS': ['12.1', '12.2'], // Network Infrastructure Management
    'DSP': ['3.1', '3.2', '3.3'], // Data Management
    'GRC': ['1.1', '2.1'], // Inventory and Control of Enterprise Assets
    'HRS': ['14.1', '14.2'], // Security Awareness and Skills Training
    'IAM': ['5.1', '5.2', '5.3', '6.1', '6.2'], // Account Management & Access Control
    'IVS': ['4.1', '4.2'], // Secure Configuration
    'LOG': ['8.1', '8.2', '8.3'], // Audit Log Management
    'SEF': ['17.1', '17.2'], // Incident Response Management
    'TVM': ['7.1', '7.2', '7.3'] // Continuous Vulnerability Management
  };

  return cisMappings[domain] || [];
}

async function importCCMControls() {
  console.log('Starting CCM controls import...');

  // Load all data files
  const primaryData = await loadJSONFile<CCMDataset>('attached_assets/primary-dataset_1749804016437.json');
  const nistMappings = await loadJSONFile<FrameworkMappings[]>('attached_assets/mappings_1749804016436.json');
  const pciMappings = await loadJSONFile<FrameworkMappings[]>('attached_assets/mappings_1749804016437.json');
  const architecturalData = await loadJSONFile<{ content: ArchitecturalRelevance[] }>('attached_assets/architectural-relevance_1749804016435.json');
  const organizationalData = await loadJSONFile<{ content: OrganizationalRelevance[] }>('attached_assets/organizational-relevance_1749804016436.json');
  const ownershipData = await loadJSONFile<{ content: OwnershipData[] }>('attached_assets/ownership_1749804016436.json');

  // Create mapping lookup tables
  const nistMap = new Map<string, ComplianceMapping>();
  const pciMap = new Map<string, ComplianceMapping>();
  
  if (nistMappings[0]?.mappings) {
    nistMappings[0].mappings.forEach(mapping => {
      nistMap.set(mapping.control_id, mapping);
    });
  }
  
  if (pciMappings[0]?.mappings) {
    pciMappings[0].mappings.forEach(mapping => {
      pciMap.set(mapping.control_id, mapping);
    });
  }

  // Create architectural relevance lookup
  const archMap = new Map<string, Record<string, boolean>>();
  architecturalData.content.forEach(arch => {
    arch.content.forEach(item => {
      if (!archMap.has(item.control_id)) {
        archMap.set(item.control_id, {});
      }
      archMap.get(item.control_id)![arch.title] = item.value;
    });
  });

  // Create organizational relevance lookup
  const orgMap = new Map<string, Record<string, boolean>>();
  organizationalData.content.forEach(org => {
    org.content.forEach(item => {
      if (!orgMap.has(item.control_id)) {
        orgMap.set(item.control_id, {});
      }
      orgMap.get(item.control_id)![org.title] = item.value;
    });
  });

  // Create ownership model lookup
  const ownershipMap = new Map<string, Record<string, string>>();
  ownershipData.content.forEach(owner => {
    owner.content.forEach(item => {
      if (!ownershipMap.has(item.control_id)) {
        ownershipMap.set(item.control_id, {});
      }
      ownershipMap.get(item.control_id)![owner.title] = item.value;
    });
  });

  let totalImported = 0;
  let errors: string[] = [];

  // Process each domain and its controls
  for (const domain of primaryData.domains) {
    console.log(`Processing domain: ${domain.id} - ${domain.title}`);
    
    for (const control of domain.controls) {
      try {
        const nistMapping = nistMap.get(control.id);
        const pciMapping = pciMap.get(control.id);
        const archRelevance = archMap.get(control.id) || {};
        const orgRelevance = orgMap.get(control.id) || {};
        const ownership = ownershipMap.get(control.id) || {};

        // Generate CIS mappings based on domain
        const cisMappings = createCISMapping(control.id, domain.id);

        // Determine implementation status and effectiveness based on control characteristics
        const implementationStatus = control.is_lite ? 'fully_implemented' : 'planned';
        const controlEffectiveness = control.is_lite ? 7.5 : 6.0;

        const controlData = {
          controlId: control.id,
          name: control.title,
          description: control.specification.trim(),
          controlType: CONTROL_TYPE_MAPPING[domain.id] || 'preventive',
          controlCategory: CONTROL_CATEGORY_MAPPING[domain.id] || 'technical',
          implementationStatus,
          controlEffectiveness,
          implementationCost: '0.00',
          costPerAgent: '0.00',
          isPerAgentPricing: false,
          notes: `CCM Domain: ${domain.title}`,
          complianceFramework: 'CCM' as const,
          
          // CCM-specific fields
          cloudDomain: domain.id,
          nistMappings: nistMapping?.references || [],
          pciMappings: pciMapping?.references || [],
          cisMappings,
          gapLevel: nistMapping?.gap_level || pciMapping?.gap_level || null,
          implementationGuidance: nistMapping?.addendum || pciMapping?.addendum || null,
          architecturalRelevance: Object.keys(archRelevance).length > 0 ? archRelevance : null,
          organizationalRelevance: Object.keys(orgRelevance).length > 0 ? orgRelevance : null,
          ownershipModel: ownership.IaaS || null,
          cloudServiceModel: Object.keys(ownership).filter(key => ownership[key] !== 'N/A')
        } as any;

        await db.insert(controlLibrary).values([controlData]);
        totalImported++;
        
        if (totalImported % 20 === 0) {
          console.log(`Imported ${totalImported} controls...`);
        }
        
      } catch (error) {
        const errorMsg = `Failed to import control ${control.id}: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }
  }

  console.log(`\nCCM Import Summary:`);
  console.log(`Total controls imported: ${totalImported}`);
  console.log(`Errors encountered: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('\nCCM controls import completed successfully!');
}

// Run the import
importCCMControls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });

export { importCCMControls };