import { db } from "../db/index";
import { controls, controlLibrary } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * One-time script to import all existing control instances into the control library as templates
 */

function generateRandomSuffix(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

async function importControlsToLibrary() {
  console.log("Starting import of control instances to control library...");
  
  try {
    // 1. Get all existing control instances
    const existingControls = await db.select().from(controls);
    console.log(`Found ${existingControls.length} existing controls to import`);
    
    if (existingControls.length === 0) {
      console.log("No controls found to import.");
      return;
    }
    
    // 2. Get existing templates from library to check for duplicates
    const existingTemplates = await db.select().from(controlLibrary);
    const existingTemplateIds = new Set(existingTemplates.map(t => t.controlId));
    
    console.log(`Found ${existingTemplates.length} existing templates in the library`);
    
    // 3. Import each control to the library
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const control of existingControls) {
      // Create a template version of the control ID (add -TPL suffix)
      let templateId = `${control.controlId}-TPL`;
      
      // Check if this ID already exists in the library
      if (existingTemplateIds.has(templateId)) {
        // Generate a unique template ID
        templateId = `${control.controlId}-TPL-${generateRandomSuffix(3)}`;
        console.log(`Control with ID ${control.controlId}-TPL already exists, using ${templateId} instead`);
      }
      
      // Create template entry
      const controlTemplate = {
        controlId: templateId,
        name: control.name,
        description: control.description,
        controlType: control.controlType,
        controlCategory: control.controlCategory,
        implementationStatus: control.implementationStatus,
        controlEffectiveness: control.controlEffectiveness,
        implementationCost: control.implementationCost,
        costPerAgent: control.costPerAgent,
        isPerAgentPricing: control.isPerAgentPricing,
        notes: control.notes,
        nistCsf: [], // Default to empty arrays for new fields
        iso27001: []
      };
      
      try {
        // Insert the template into the control library
        const [newTemplate] = await db.insert(controlLibrary).values(controlTemplate).returning();
        
        console.log(`Imported control ${control.controlId} to library as ${newTemplate.controlId}`);
        importedCount++;
        
        // Add the new template ID to our list of existing IDs
        existingTemplateIds.add(newTemplate.controlId);
      } catch (error) {
        console.error(`Error importing control ${control.controlId}:`, error);
        skippedCount++;
      }
    }
    
    console.log(`Import completed: ${importedCount} controls imported, ${skippedCount} skipped`);
  } catch (error) {
    console.error("Import failed:", error);
  }
}

// Run the import function
importControlsToLibrary()
  .then(() => {
    console.log("Import script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Import script failed:", error);
    process.exit(1);
  });