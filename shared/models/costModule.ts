/**
 * Cost Module Types
 * 
 * Definitions for cost modules used in the FAIR-CAM cost calculations
 */

/**
 * Cost types supported by the system
 */
export type CostType = 'fixed' | 'per_event' | 'per_hour' | 'percentage';

/**
 * Base cost module interface
 */
export interface CostModule {
  id: number;
  name: string;
  cisControl: string[];
  costFactor: number;
  costType: CostType;
  description?: string;
  createdAt: Date;
}

/**
 * Cost module with relationship data to risk responses
 */
export interface CostModuleWithRelations extends CostModule {
  responseIds?: number[]; // IDs of related risk responses
  multiplier?: number;    // Applied multiplier for specific response
}

/**
 * Model to create new cost module
 */
export interface CreateCostModule {
  name: string;
  cisControl: string[];
  costFactor: number;
  costType: CostType;
  description?: string;
}

/**
 * Model to update existing cost module
 */
export interface UpdateCostModule {
  name?: string;
  cisControl?: string[];
  costFactor?: number;
  costType?: CostType;
  description?: string;
}

/**
 * Relationship between risk response and cost module
 */
export interface ResponseCostModule {
  id: number;
  responseId: number;
  costModuleId: number;
  multiplier: number;
  createdAt: Date;
}