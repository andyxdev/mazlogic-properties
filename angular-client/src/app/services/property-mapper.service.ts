import { Injectable } from '@angular/core';
import { Property, Agent } from '../models/property.model';
import { AgentService } from './agent.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyMapperService {
  
  constructor(private agentService: AgentService) {}
  
  /**
   * Maps backend property data to frontend Property model
   */
  mapBackendToFrontend(backendProperty: any): Property {
    // Extract image URLs from the backend property
    let imageUrls: string[] = [];
    
    // Handle case where backend might return empty images array
    if (backendProperty.images && backendProperty.images.length > 0) {
      console.log('PropertyMapper: Property has images:', backendProperty.images);
      imageUrls = backendProperty.images.map((img: any) => {
        if (!img.imageUrl) {
          console.warn('PropertyMapper: Image missing URL:', img);
          return null;
        }
        // Log the image URL to help debug
        console.log('PropertyMapper: Processing image URL:', img.imageUrl);
        return img.imageUrl;
      }).filter((url: string | null) => url !== null);
      
      console.log('PropertyMapper: Extracted image URLs:', imageUrls);
    } 
    
    // If no valid images were found, use a placeholder
    if (imageUrls.length === 0) {
      // Provide a default placeholder image for properties without images
      // Use property ID to vary the image (cycling through 5 sample images)
      const imageIndex = (backendProperty.id % 5) || 1;
      imageUrls = [`assets/property-images/property${imageIndex}.jpg`];
      console.log(`Using placeholder image for property ID ${backendProperty.id}: ${imageUrls[0]}`);
    }
    
    // Validate image URLs - ensure they start with http:// or https://
    imageUrls = imageUrls.map((url: string) => {
      if (!url) return null;
      
      // Skip assets paths as they're served by Angular
      if (url && url.startsWith('assets/')) {
        return url;
      }
      
      // If URL doesn't start with http:// or https://, prepend http://localhost:8081
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return `http://localhost:8081${url.startsWith('/') ? '' : '/'}${url}`;
      }
      return url;
    }).filter((url: string | null) => url !== null) as string[];
    
    console.log('Mapped image URLs for property ID ' + backendProperty.id + ':', imageUrls);
    
    // Map the property data
    return {
      id: backendProperty.id,
      title: backendProperty.title,
      description: backendProperty.description,
      price: backendProperty.price,
      type: backendProperty.type as 'rent' | 'sale',
      location: backendProperty.location,
      agent: backendProperty.agent,
      imageUrls: imageUrls
    };
  }
  
  /**
   * Maps array of backend properties to frontend Property model array
   */
  mapPropertiesBackendToFrontend(backendProperties: any[]): Property[] {
    return backendProperties.map(prop => this.mapBackendToFrontend(prop));
  }
  
  /**
   * Prepares a frontend Property model for sending to the backend
   * Returns a promise to allow for async agent handling
   */
  async mapFrontendToBackendAsync(frontendProperty: Property): Promise<any> {
    // The backend doesn't expect imageUrls but separate image handling
    const { imageUrls, ...propertyData } = frontendProperty;
    
    // Ensure agent has an ID or get/create one
    let agent = { ...propertyData.agent }; // Clone to avoid modifying original
    
    try {
      if (!agent.id) {
        console.log('Agent has no ID, checking if exists in backend:', agent);
        
        // Try to get the agent by email first
        const agents = await firstValueFrom(this.agentService.getAgents());
        const existingAgent = agents.find(a => a.email === agent.email);
        
        if (existingAgent) {
          console.log('Found existing agent:', existingAgent);
          agent = existingAgent;
        } else {
          // Agent doesn't exist yet, create a new one
          console.log('Creating new agent:', agent);
          const newAgent = await firstValueFrom(this.agentService.createAgent(agent));
          console.log('New agent created:', newAgent);
          agent = newAgent;
        }
      }
    } catch (error) {
      console.error('Error handling agent:', error);
      // Fallback to using a default agent ID
      if (!agent.id) {
        console.log('Using default agent ID 1');
        agent.id = 1; // Default to first agent if we can't create/find one
      }
    }
    
    console.log('Final agent data for backend:', agent);
    
    return {
      ...propertyData,
      agent: agent,
      // If backend expects empty images array
      images: []
    };
  }
  
  /**
   * Synchronous version for backwards compatibility
   */
  mapFrontendToBackend(frontendProperty: Property): any {
    // The backend doesn't expect imageUrls but separate image handling
    const { imageUrls, ...propertyData } = frontendProperty;
    
    // Ensure agent has an ID or it's properly structured
    let agent = propertyData.agent;
    if (!agent.id) {
      // If we're creating a new property, we'll need to look up the agent by email
      // For now, let's assign a default agent ID - we'll handle this better in a real app
      agent = {
        ...agent,
        id: this.getAgentIdByEmail(agent.email) || 1 // Default to agent ID 1 if not found
      };
      console.log('Added agent ID for backend:', agent);
      
      // Schedule an async agent creation for later
      this.ensureAgentExists(agent).catch(err => 
        console.error('Failed to ensure agent exists:', err));
    }
    
    return {
      ...propertyData,
      agent: agent,
      // If backend expects empty images array
      images: []
    };
  }
  
  /**
   * Helper method to get agent ID by email
   * In a real app, this would be a lookup to the backend
   */
  private getAgentIdByEmail(email: string): number | null {
    const agentMap: {[email: string]: number} = {
      'alex@mazlogic.com': 1,
      'sarah@mazlogic.com': 2,
      'michael@mazlogic.com': 3
    };
    
    return agentMap[email] || null;
  }
  
  /**
   * Ensures an agent exists in the backend system
   * @param agent Agent to ensure exists
   */
  private async ensureAgentExists(agent: Agent): Promise<Agent> {
    try {
      // Try to get all agents
      const agents = await firstValueFrom(this.agentService.getAgents());
      
      // Look for an agent with the same email
      const existingAgent = agents.find(a => a.email === agent.email);
      if (existingAgent) {
        console.log('Found existing agent:', existingAgent);
        return existingAgent;
      }
      
      // If not found, create a new agent
      console.log('Creating new agent:', agent);
      const newAgent = await firstValueFrom(this.agentService.createAgent(agent));
      console.log('New agent created:', newAgent);
      return newAgent;
    } catch (error) {
      console.error('Failed to ensure agent exists:', error);
      throw error;
    }
  }
}
