import { DatabaseStorage } from './repositoryStorage';
import { RiskResponse, InsertRiskResponse } from '@shared/schema';

// Define filter types for responses
export interface ResponseFilterOptions {
  responseType?: 'accept' | 'avoid' | 'transfer' | 'mitigate';
  riskId?: string;
  sortBy?: 'riskId' | 'responseType';
  sortOrder?: 'asc' | 'desc';
}

export class ResponseService {
  private repository: DatabaseStorage;
  
  constructor(repository: DatabaseStorage) {
    this.repository = repository;
  }
  
  /**
   * Get all responses with optional filtering
   */
  async getAllResponses(filters?: ResponseFilterOptions): Promise<RiskResponse[]> {
    // For now we'll get all risks from the repository and filter in memory
    // In a real-world scenario, we would extend the repository to handle filtering at the DB level
    let responses: RiskResponse[] = [];
    
    // Get all risk responses for the specified risk or get all responses
    if (filters?.riskId) {
      responses = await this.repository.getRiskResponsesForRisk(filters.riskId);
    } else {
      // We need to compile all responses from various risks
      // This is a temporary solution until we add a proper getAllRiskResponses method to the repository
      const risks = await this.repository.getAllRisks();
      for (const risk of risks) {
        if (risk.riskId) {
          const riskResponses = await this.repository.getRiskResponsesForRisk(risk.riskId);
          responses = [...responses, ...riskResponses];
        }
      }
    }
    
    if (!filters || Object.keys(filters).length === 0) {
      return responses;
    }
    
    // Apply additional filters (like responseType)
    let filteredResponses = responses.filter(response => {
      let match = true;
      
      if (filters.responseType && response.responseType !== filters.responseType) {
        match = false;
      }
      
      return match;
    });
    
    // Apply sorting if specified
    if (filters.sortBy) {
      filteredResponses.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (filters.sortBy) {
          case 'riskId':
            valueA = a.riskId;
            valueB = b.riskId;
            break;
          case 'responseType':
          default:
            valueA = a.responseType;
            valueB = b.responseType;
            break;
        }
        
        // Handle ascending/descending sort
        const sortMultiplier = (filters.sortOrder === 'desc') ? -1 : 1;
        
        return sortMultiplier * String(valueA).localeCompare(String(valueB));
      });
    }
    
    return filteredResponses;
  }
  
  /**
   * Get a response by ID
   */
  async getResponse(id: number): Promise<RiskResponse | undefined> {
    return this.repository.getRiskResponse(id);
  }
  
  /**
   * Get a response by riskId
   */
  async getResponseByRiskId(riskId: string): Promise<RiskResponse | undefined> {
    const responses = await this.repository.getRiskResponsesForRisk(riskId);
    // Return the first response if available
    return responses && responses.length > 0 ? responses[0] : undefined;
  }
  
  /**
   * Create a new response
   */
  async createResponse(responseData: InsertRiskResponse): Promise<RiskResponse> {
    // Create the response
    const response = await this.repository.createRiskResponse(responseData);
    
    // Ensure risk summaries are recalculated
    try {
      // The risk service is responsible for risk summary recalculation
      // Use the repository to find the associated risk service or
      // have a method in the repository to recalculate risk summaries
      const riskService = this.repository.getRiskService 
        ? this.repository.getRiskService() 
        : null;
          
      if (riskService && riskService.recalculateRiskSummaries) {
        await riskService.recalculateRiskSummaries();
      } else {
        console.log('Risk summaries could not be recalculated - missing method');
      }
    } catch (error) {
      console.error('Error recalculating risk summaries after response creation:', error);
    }
    
    // Log the response creation
    await this.logResponseActivity(response.id, 'create', 'Response created');
    
    return response;
  }
  
  /**
   * Update a response
   */
  async updateResponse(id: number, responseData: Partial<RiskResponse>): Promise<RiskResponse | undefined> {
    // Update the response
    const updatedResponse = await this.repository.updateRiskResponse(id, responseData);
    
    if (updatedResponse) {
      // Ensure risk summaries are recalculated
      try {
        // The risk service is responsible for risk summary recalculation
        const riskService = this.repository.getRiskService 
          ? this.repository.getRiskService() 
          : null;
            
        if (riskService && riskService.recalculateRiskSummaries) {
          await riskService.recalculateRiskSummaries();
        } else {
          console.log('Risk summaries could not be recalculated - missing method');
        }
      } catch (error) {
        console.error('Error recalculating risk summaries after response update:', error);
      }
      
      // Log the response update
      await this.logResponseActivity(updatedResponse.id, 'update', 'Response updated');
    }
    
    return updatedResponse;
  }
  
  /**
   * Delete a response
   */
  async deleteResponse(id: number): Promise<boolean> {
    // Get the response first to ensure it exists
    const response = await this.repository.getRiskResponse(id);
    if (!response) {
      return false;
    }
    
    // Delete the response
    const success = await this.repository.deleteRiskResponse(id);
    
    if (success) {
      // Ensure risk summaries are recalculated
      try {
        // The risk service is responsible for risk summary recalculation
        const riskService = this.repository.getRiskService 
          ? this.repository.getRiskService() 
          : null;
            
        if (riskService && riskService.recalculateRiskSummaries) {
          await riskService.recalculateRiskSummaries();
        } else {
          console.log('Risk summaries could not be recalculated - missing method');
        }
      } catch (error) {
        console.error('Error recalculating risk summaries after response deletion:', error);
      }
      
      // Log the response deletion
      await this.logResponseActivity(id, 'delete', 'Response deleted');
    }
    
    return success;
  }
  
  /**
   * Helper to log response activity
   */
  private async logResponseActivity(responseId: number, action: string, description: string): Promise<void> {
    await this.repository.createActivityLog({
      activity: description,
      user: 'System', // Default to system for now, could be passed from controller
      entity: `Response ${responseId}`,
      entityType: 'response',
      entityId: responseId.toString(),
      createdAt: new Date()
    });
  }
}

// Factory function to create a service instance with repository injection
export const responseService = (repository: DatabaseStorage) => new ResponseService(repository);