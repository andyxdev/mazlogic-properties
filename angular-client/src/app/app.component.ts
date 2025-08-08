import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { PropertyItemComponent } from './property-item/property-item.component';
import { RequestInfoComponent } from './request-info/request-info.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AgentInfoComponent } from './agent-info/agent-info.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { Property } from './models/property.model';
import { PropertyService } from './services/property.service';
import { AgentService } from './services/agent.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PropertyListComponent,
    PropertyFormComponent,
    PropertyItemComponent,
    RequestInfoComponent,
    AppointmentComponent,
    AgentInfoComponent,
    PropertyDetailsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-client';
  properties: Property[] = [];
  editingProperty: Property | null = null;
  showForm = false;
  showRequestForm = false;
  requestProperty: Property | null = null;
  showAppointmentForm = false;
  appointmentProperty: Property | null = null;
  showAll = false;
  selectedProperty: Property | null = null;
  showPropertyDetails = false;
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private propertyService: PropertyService,
    private agentService: AgentService
  ) {}
  
  ngOnInit() {
    this.loadPropertiesFromBackend();
  }
  
  loadPropertiesFromBackend() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        if (properties.length === 0) {
          this.errorMessage = 'No properties found. Add a new property to get started.';
        }
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.errorMessage = 'Failed to load properties. Using sample data instead.';
        // Fallback to sample data if backend isn't available
        this.loadSampleProperties();
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  // Refresh properties from backend
  refreshProperties() {
    this.loadPropertiesFromBackend();
  }
  
  // Load sample properties with placeholder images
  loadSampleProperties() {
    this.properties = [
      {
        id: 1,
        title: 'Modern Lakefront Home',
        description: 'Stunning modern home with panoramic lake views, featuring 4 bedrooms and 3 bathrooms.',
        price: 450000,
        type: 'sale',
        location: '123 Lakeview Dr, Waterfront, CA',
        agent: {
          name: 'Alex Johnson',
          email: 'alex@mazlogic.com',
          phone: '(555) 123-4567'
        },
        imageUrls: [
          'assets/property-images/property1.jpg',
          'assets/property-images/property4.jpg',
          'assets/property-images/property5.jpg'
        ]
      },
      {
        id: 2,
        title: 'Downtown Luxury Apartment',
        description: 'Upscale city living in this 2-bedroom luxury apartment with high-end finishes.',
        price: 2500,
        type: 'rent',
        location: '456 Urban Ave, Downtown, CA',
        agent: {
          name: 'Sarah Williams',
          email: 'sarah@mazlogic.com',
          phone: '(555) 987-6543'
        },
        imageUrls: [
          'assets/property-images/property4.jpg',
          'assets/property-images/property3.jpg'
        ]
      },
      {
        id: 3,
        title: 'Suburban Family Home',
        description: 'Spacious 5-bedroom home in a quiet neighborhood, perfect for families.',
        price: 375000,
        type: 'sale',
        location: '789 Maple St, Suburbia, CA',
        agent: {
          name: 'Michael Davis',
          email: 'michael@mazlogic.com',
          phone: '(555) 567-8901'
        },
        imageUrls: [
          'assets/property-images/property5.jpg'
        ]
      }
    ];
  }

  // Add property
  addProperty(property: Property) {
    this.isLoading = true;
    
    // Ensure agent has an ID
    if (!property.agent.id) {
      property.agent.id = 1; // Default agent ID if not provided
      console.log('AppComponent: Setting default agent ID for new property:', property.agent);
    }
    
    console.log('AppComponent: Creating new property:', property);
    
    this.propertyService.createProperty(property).subscribe({
      next: (createdProperty) => {
        console.log('AppComponent: Property created successfully:', createdProperty);
        
        // Replace the property ID in the original property object
        // This allows the property form component to upload images for this property ID
        property.id = createdProperty.id;
        console.log('AppComponent: Assigned ID to original property object:', property.id);
        
        // Add the property to the array
        this.properties = [...this.properties, createdProperty];
        
        // Notify the console that the property ID should now be available for image uploads
        console.log('AppComponent: Property ID is now available for image uploads:', property.id);
        
        // Verify the property exists on the backend to ensure synchronization
        setTimeout(() => {
          this.propertyService.getPropertyById(createdProperty.id).subscribe({
            next: (verifiedProperty) => {
              console.log('AppComponent: Property verified on backend:', verifiedProperty);
            },
            error: (err) => {
              console.error('AppComponent: Error verifying property on backend:', err);
            }
          });
        }, 1000);
        
        // Don't hide the form immediately as it may be still uploading images
        // The form component will handle its own hiding after image uploads complete
        setTimeout(() => {
          if (this.showForm) {
            this.showForm = false;
          }
          
          // After a longer delay, refresh the properties list to ensure we have the latest data
          setTimeout(() => this.refreshProperties(), 5000);
        }, 15000); // Extended time for image uploads to complete (15 seconds)
      },
      error: (error) => {
        console.error('AppComponent: Error creating property:', error);
        alert('Failed to create property. Please try again.');
        this.showForm = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Update property
  updateProperty(updated: Property) {
    this.isLoading = true;
    
    this.propertyService.updateProperty(updated.id, updated).subscribe({
      next: (updatedProperty) => {
        // Replace the local entry with the one from the server
        this.properties = this.properties.map(p => 
          p.id === updatedProperty.id ? updatedProperty : p
        );
        this.editingProperty = null;
        this.showForm = false;
      },
      error: (error) => {
        console.error('Error updating property:', error);
        alert('Failed to update property. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Delete property
  deleteProperty(id: number) {
    this.isLoading = true;
    
    this.propertyService.deleteProperty(id).subscribe({
      next: () => {
        // Remove from the local list
        this.properties = this.properties.filter(p => p.id !== id);
      },
      error: (error) => {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Edit property
  handleEdit(property: any) {
    this.editingProperty = property;
    this.showForm = true;
  }

  // Add property button
  handleAdd() {
    this.editingProperty = null;
    this.showForm = true;
  }

  // Cancel form
  handleCancel() {
    this.editingProperty = null;
    this.showForm = false;
  }

  // Request info
  handleRequestInfo(property: any) {
    this.requestProperty = property;
    this.showRequestForm = true;
  }

  handleRequestSubmit(request: any) {
    alert(`Request sent for ${request.property.title} by ${request.name}`);
    this.showRequestForm = false;
    this.requestProperty = null;
  }

  // Make appointment
  handleMakeAppointment(property: any) {
    this.appointmentProperty = property;
    this.showAppointmentForm = true;
  }

  handleAppointmentSubmit(appointment: any) {
    alert(`Appointment requested for ${appointment.property.title} by ${appointment.name} on ${appointment.date} at ${appointment.time}`);
    this.showAppointmentForm = false;
    this.appointmentProperty = null;
  }

  // View all properties
  handleViewAll() {
    this.showAll = true;
    // In a real app, you might fetch all properties from backend here
  }
  
  // View property details
  viewPropertyDetails(property: Property) {
    this.selectedProperty = property;
    this.showPropertyDetails = true;
  }
  
  // Close property details
  closePropertyDetails() {
    this.selectedProperty = null;
    this.showPropertyDetails = false;
  }

  // Show the request info form when "Request More Info" is clicked
  public scrollToRequestInfo() {
    // If we already have a selected property, use that
    if (this.selectedProperty) {
      this.handleRequestInfo(this.selectedProperty);
    } else {
      // If no property is currently selected, show a generic form or message
      alert('Please select a property first to request more information.');
    }
  }
  
  // Alias for backwards compatibility with existing components
  public showRequestInfoModal() {
    this.scrollToRequestInfo();
  }
}
