import { DatabaseStorage } from './repositoryStorage';
import { Control, InsertControl } from '@shared/schema';

// Define filter types for controls
export interface ControlFilterOptions {
  controlType?: 'preventive' | 'detective' | 'corrective';
  implementationStatus?: 'not_implemented' | 'in_progress' | 'fully_implemented' | 'planned';
  controlCategory?: 'technical' | 'administrative' | 'physical';
  riskId?: number;
  assetId?: string;
  legalEntityId?: string;
}

export class ControlService {
  private repository: DatabaseStorage;
  
  constructor(repository: DatabaseStorage) {
    this.repository = repository;
  }
  
  /**
   * CONTROL LIBRARY METHODS
   */
   
  /**
   * Get all control library templates
   */
  async getAllControlLibraryItems(): Promise<any[]> {
    return this.repository.getAllControlLibraryItems();
  }
  
  /**
   * Get a control library template by ID
   */
  async getControlLibraryItem(id: number): Promise<any | undefined> {
    return this.repository.getControlLibraryItem(id);
  }
  
  /**
   * Create a new control library template
   */
  async createControlLibraryItem(itemData: any): Promise<any> {
    const item = await this.repository.createControlLibraryItem(itemData);
    
    // Log the creation
    await this.repository.createActivityLog({
      activity: 'create',
      user: 'System User',
      entity: `Control Template ${item.name || item.controlId}`,
      entityType: 'control_library',
      entityId: item.id.toString()
    });
    
    return item;
  }
  
  /**
   * Update a control library template
   */
  async updateControlLibraryItem(id: number, itemData: any): Promise<any | undefined> {
    const updatedItem = await this.repository.updateControlLibraryItem(id, itemData);
    
    if (updatedItem) {
      // Log the update
      await this.repository.createActivityLog({
        activity: 'update',
        user: 'System User',
        entity: `Control Template ${updatedItem.name || updatedItem.controlId}`,
        entityType: 'control_library',
        entityId: updatedItem.id.toString()
      });
    }
    
    return updatedItem;
  }
  
  /**
   * Delete a control library template
   */
  async deleteControlLibraryItem(id: number): Promise<boolean> {
    // Get the item first to ensure it exists and for logging
    const item = await this.repository.getControlLibraryItem(id);
    if (!item) {
      return false;
    }
    
    // Delete the template
    const success = await this.repository.deleteControlLibraryItem(id);
    
    if (success) {
      // Log the deletion
      await this.repository.createActivityLog({
        activity: 'delete',
        user: 'System User',
        entity: `Control Template ${item.name || item.controlId}`,
        entityType: 'control_library',
        entityId: id.toString()
      });
    }
    
    return success;
  }
  
  /**
   * Get all controls with optional filtering
   */
  async getAllControls(filters?: ControlFilterOptions): Promise<Control[]> {
    const controls = await this.repository.getAllControls();
    
    if (!filters || Object.keys(filters).length === 0) {
      return controls;
    }
    
    // Apply filters
    return controls.filter(control => {
      let match = true;
      
      if (filters.controlType && control.controlType !== filters.controlType) {
        match = false;
      }
      
      if (filters.implementationStatus && control.implementationStatus !== filters.implementationStatus) {
        match = false;
      }
      
      if (filters.controlCategory && control.controlCategory !== filters.controlCategory) {
        match = false;
      }
      
      if (filters.riskId && control.riskId !== filters.riskId) {
        match = false;
      }
      
      if (filters.assetId && control.assetId !== filters.assetId) {
        match = false;
      }
      
      if (filters.legalEntityId && control.legalEntityId !== filters.legalEntityId) {
        match = false;
      }
      
      return match;
    });
  }
  
  /**
   * Get a control by ID
   */
  async getControl(id: number): Promise<Control | undefined> {
    return this.repository.getControl(id);
  }
  
  /**
   * Get a control by controlId
   */
  async getControlByControlId(controlId: string): Promise<Control | undefined> {
    return this.repository.getControlByControlId(controlId);
  }
  
  /**
   * Create a new control
   */
  async createControl(controlData: InsertControl): Promise<Control> {
    // Create the control
    const control = await this.repository.createControl(controlData);
    
    // If control is associated with a risk, recalculate risk summaries
    if (control.riskId) {
      try {
        await this.repository.recalculateRiskSummaries();
        console.log(`Risk summaries recalculated after creating control ${control.id}`);
      } catch (error) {
        console.error('Error recalculating risk summaries after control creation:', error);
      }
    }
    
    // Log the control creation
    try {
      await this.logControlActivity(control.id, 'create', 'Control created');
    } catch (error) {
      console.warn('Failed to log control activity:', error);
    }
    
    return control;
  }
  
  /**
   * Update a control
   */
  async updateControl(id: number, controlData: Partial<Control>): Promise<Control | undefined> {
    // Get control before update to check for changes in effectiveness
    const existingControl = await this.repository.getControl(id);
    
    // Update the control
    const updatedControl = await this.repository.updateControl(id, controlData);
    
    if (updatedControl) {
      // Check if we need to recalculate risks (if effectiveness or implementation status changed)
      const effectivenessChanged = existingControl && 
        (existingControl.effectiveness !== updatedControl.effectiveness ||
         existingControl.implementationStatus !== updatedControl.implementationStatus);
         
      // If effectiveness changed or control is linked to a risk, recalculate risk summaries
      if (effectivenessChanged || updatedControl.riskId) {
        try {
          await this.repository.recalculateRiskSummaries();
          console.log(`Risk summaries recalculated after updating control ${id}`);
        } catch (error) {
          console.error('Error recalculating risk summaries after control update:', error);
        }
      }
      
      // Log the control update
      await this.logControlActivity(updatedControl.id, 'update', 'Control updated');
    }
    
    return updatedControl;
  }
  
  /**
   * Delete a control
   */
  async deleteControl(id: number): Promise<boolean> {
    // Get the control first to ensure it exists
    const control = await this.repository.getControl(id);
    if (!control) {
      return false;
    }
    
    // Check if control is associated with risks before removal
    const associatedRisks = await this.repository.getRisksForControl(id);
    const hasAssociatedRisks = associatedRisks && associatedRisks.length > 0;
    
    // First remove this control from any associated risks
    await this.removeControlFromRisks(id);
    
    // Then delete the control
    const success = await this.repository.deleteControl(id);
    
    if (success) {
      // If control was associated with risks, recalculate risk summaries
      if (hasAssociatedRisks) {
        try {
          await this.repository.recalculateRiskSummaries();
          console.log(`Risk summaries recalculated after deleting control ${id}`);
        } catch (error) {
          console.error('Error recalculating risk summaries after control deletion:', error);
        }
      }
      
      // Log the control deletion
      await this.logControlActivity(id, 'delete', 'Control deleted');
    }
    
    return success;
  }
  
  /**
   * Get risks associated with a control
   */
  async getRisksForControl(controlId: number): Promise<any[]> {
    return this.repository.getRisksForControl(controlId);
  }
  
  /**
   * Associate a control with a risk
   */
  async addControlToRisk(riskId: number, controlId: number): Promise<void> {
    // Add control to risk
    await this.repository.addControlToRisk(riskId, controlId);
    
    // Log the association
    await this.logControlActivity(
      controlId, 
      'associate', 
      `Control associated with risk ID ${riskId}`
    );
  }
  
  /**
   * Remove a control from a risk
   */
  async removeControlFromRisk(riskId: number, controlId: number): Promise<void> {
    await this.repository.removeControlFromRisk(riskId, controlId);
    
    // Log the disassociation
    await this.logControlActivity(
      controlId, 
      'disassociate', 
      `Control disassociated from risk ID ${riskId}`
    );
  }
  
  /**
   * Remove a control from all associated risks
   */
  private async removeControlFromRisks(controlId: number): Promise<void> {
    // Get all risks associated with this control
    const risks = await this.repository.getRisksForControl(controlId);
    
    // Remove control from each risk
    for (const risk of risks) {
      await this.repository.removeControlFromRisk(risk.id, controlId);
    }
  }
  
  /**
   * Helper to log control activity
   */
  private async logControlActivity(controlId: number, actionType: string, description: string): Promise<void> {
    // Get control name to use in log entry
    let controlName = 'Control';
    try {
      const control = await this.repository.getControl(controlId);
      if (control && control.name) {
        controlName = control.name;
      } else if (control && control.controlId) {
        controlName = `Control ${control.controlId}`;
      }
    } catch (error) {
      console.log('Could not get control details for logging, using default name');
    }
    
    await this.repository.createActivityLog({
      activity: actionType, // Map actionType to the required activity field
      user: 'System User', // Required field
      entity: controlName, // Required field - use control name
      entityType: 'control', // Required field
      entityId: controlId.toString() // Required field
    });
  }
}

// Factory function to create a service instance with repository injection
export const controlService = (repository: DatabaseStorage) => new ControlService(repository);