import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../models/property.model';
import { ImageService } from '../services/image.service';
import { PropertyService } from '../services/property.service';
import { AgentService } from '../services/agent.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  @Input() initialData: any;
  @Output() submitForm = new EventEmitter<Property>();
  @Output() cancel = new EventEmitter<void>();

  form: Property = {
    id: 0, // Default ID
    title: '',
    description: '',
    price: 0,
    type: 'rent',
    location: '',
    agent: { name: '', email: '', phone: '' },
    imageUrls: []
  };

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isUploading = false;
  maxFiles = 5;
  uploadProgress: number = 0;
  uploadErrors: string[] = [];

  constructor(
    private imageService: ImageService,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    if (this.initialData) {
      this.form = { ...this.initialData };
      if (this.form.imageUrls) {
        this.previewUrls = [...this.form.imageUrls];
      }
    }
  }

  async onFileChange(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Limit the number of files
    const availableSlots = this.maxFiles - this.previewUrls.length;
    if (availableSlots <= 0) {
      alert(`Maximum ${this.maxFiles} images allowed`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots) as File[];
    this.selectedFiles = [...this.selectedFiles, ...filesToProcess];
    this.uploadErrors = [];

    // Generate previews locally using FileReader
    for (const file of filesToProcess) {
      try {
        // For preview only - use the local service to generate data URLs
        const previewUrl = await this.imageService.fileToDataUrl(file);
        this.previewUrls.push(previewUrl);
      } catch (error) {
        console.error('Error generating preview:', error);
        this.uploadErrors.push(`Failed to generate preview for ${file.name}`);
      }
    }
  }

  removeImage(index: number) {
    if (index >= 0 && index < this.previewUrls.length) {
      // Remove from preview
      this.previewUrls.splice(index, 1);
      
      // If this is a selected file (not yet uploaded), remove from selected files
      if (index < this.selectedFiles.length) {
        this.selectedFiles.splice(index, 1);
      } 
      // If this is an already uploaded image and we have the property ID
      else if (this.initialData?.id && this.initialData?.imageUrls && this.initialData.imageUrls[index]) {
        // Get the image ID from URL
        const imageUrl = this.initialData.imageUrls[index];
        const imageId = this.extractImageIdFromUrl(imageUrl);
        
        if (imageId) {
          // Delete image on server
          this.propertyService.deletePropertyImage(imageId).subscribe({
            next: () => {
              // Remove from the property's image URLs
              if (this.form.imageUrls) {
                this.form.imageUrls = this.form.imageUrls.filter((_, i) => i !== index);
              }
              console.log('Image deleted successfully');
            },
            error: (error) => {
              console.error('Error deleting image:', error);
              alert('Failed to delete image. Please try again.');
              // Restore the preview since deletion failed
              this.previewUrls.splice(index, 0, imageUrl);
            }
          });
        }
      }
    }
  }

  // Helper method to extract image ID from URL
  private extractImageIdFromUrl(url: string): number | null {
    // Implement based on your URL structure
    // Example: if URL is like 'http://localhost:8081/images/123.jpg'
    // where 123 is the ID
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const id = parseInt(fileName.split('.')[0], 10);
      return isNaN(id) ? null : id;
    } catch (e) {
      console.error('Failed to extract image ID from URL:', url);
      return null;
    }
  }

  async onSubmit() {
    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadErrors = [];
    
    try {
      console.log('Starting property submission process...');
      // First create/update the property to get an ID
      let property: Property;
      
      if (this.initialData?.id) {
        // Update existing property without images first
        const propertyToUpdate = { ...this.form };
        propertyToUpdate.imageUrls = this.initialData.imageUrls || [];
        
        console.log('Updating existing property:', propertyToUpdate);
        // Submit the form with existing images initially
        this.submitForm.emit(propertyToUpdate);
        property = propertyToUpdate;
      } else {
        // Create new property without images first
        const propertyToCreate = { ...this.form };
        propertyToCreate.imageUrls = [];
        
        // Make sure agent has an ID
        if (!propertyToCreate.agent.id) {
          propertyToCreate.agent.id = 1; // Default to agent ID 1 if not provided
          console.log('Added default agent ID:', propertyToCreate.agent);
        }
        
        console.log('Creating new property:', propertyToCreate);
        // Submit the form without images initially
        this.submitForm.emit(propertyToCreate);
        property = propertyToCreate;
      }
      
      // For new property creation, we need to wait for the parent component to handle
      // the API call and get back a property with an ID
      if (!this.initialData?.id) {
        console.log('Waiting for property creation and ID assignment...');
        // Wait for property ID to be assigned - parent component must handle this
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (property.id > 0) {
              console.log('Property ID assigned:', property.id);
              clearInterval(checkInterval);
              // Add a longer delay after ID is assigned to ensure backend has fully processed
              setTimeout(() => {
                console.log('Proceeding after delay to ensure backend processing completed');
                resolve();
              }, 5000); // 5-second delay after ID assignment (increased from 2s)
            }
          }, 300); // Check more frequently
          
          // Timeout after 20 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            if (!property.id) {
              console.error('Timed out waiting for property ID');
              this.uploadErrors.push('Failed to get property ID for image upload');
              resolve(); // Resolve anyway to continue
            }
          }, 20000); // Increased from 15s to 20s
        });
      }
      
      if (!property.id) {
        console.error('Failed to get property ID after submission');
        this.uploadErrors.push('Failed to create property record');
        return;
      }
      
      // If we have files to upload and the property has an ID
      if (this.selectedFiles.length > 0 && property.id) {
        const totalFiles = this.selectedFiles.length;
        let completedUploads = 0;
        let uploadedImageUrls: string[] = [];
        
        console.log(`Uploading ${totalFiles} files for property ID ${property.id}`);
        
        try {
          // Upload each file individually but with proper error handling
          for (const [index, file] of this.selectedFiles.entries()) {
            console.log(`Starting upload of file ${index + 1}/${totalFiles}: ${file.name}`);
            
            try {
              const response = await new Promise<any>((resolve, reject) => {
                // Add a delay before uploading to ensure property is fully saved in backend
                console.log(`Preparing to upload image for property ID ${property.id} after delay...`);
                
                // Check if property ID is valid before proceeding
                if (!property.id || property.id <= 0) {
                  console.error('Invalid property ID for image upload:', property.id);
                  reject(new Error('Invalid property ID for image upload'));
                  return;
                }
                
                setTimeout(() => {
                  console.log(`Now uploading file ${index + 1}/${totalFiles} for property ID ${property.id}`);
                  
                  // Log the FormData being sent
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('description', `Image ${index + 1} for ${property.title}`);
                  formData.append('displayOrder', index.toString());
                  
                  console.log(`FormData prepared for property ID ${property.id}:`, {
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    description: `Image ${index + 1} for ${property.title}`,
                    displayOrder: index
                  });
                  
                  // Retry mechanism for image upload
                  let retries = 0;
                  const maxRetries = 2;
                  
                  const attemptUpload = () => {
                    this.propertyService.uploadPropertyImage(
                      property.id!, 
                      file, 
                      `Image ${index + 1} for ${property.title}`, 
                      index
                    ).pipe(
                      finalize(() => {
                        completedUploads++;
                        this.uploadProgress = Math.floor((completedUploads / totalFiles) * 100);
                        console.log(`Upload progress: ${this.uploadProgress}%`);
                      })
                    ).subscribe({
                      next: (response) => {
                        console.log(`Successfully uploaded image ${index + 1} for property ID ${property.id}:`, response);
                        resolve(response);
                      },
                      error: (err) => {
                        console.error(`Error uploading image ${index + 1} for property ID ${property.id}:`, err);
                        console.error('Error details:', err.error?.message || err.message);
                        
                        if (retries < maxRetries) {
                          retries++;
                          console.log(`Retrying upload attempt ${retries}/${maxRetries} after 2 seconds...`);
                          setTimeout(() => attemptUpload(), 2000);
                        } else {
                          reject(err);
                        }
                      }
                    });
                  };
                  
                  attemptUpload();
                }, 4000); // Increased delay (4s) before upload to ensure property is saved
              });
              
              // Store the image URL from the response
              if (response && response.imageUrl) {
                console.log('Got image URL from response:', response.imageUrl);
                uploadedImageUrls.push(response.imageUrl);
              }
            } catch (error) {
              console.error(`Error uploading file ${index + 1}:`, error);
              this.uploadErrors.push(`Failed to upload ${file.name}`);
            }
          }
        } catch (error) {
          console.error('Error in upload batch:', error);
          this.uploadErrors.push('An error occurred during image uploads');
        }
        
        // After uploads, fetch the updated property with new image URLs to ensure we have everything
        if (property.id) {
          try {
            // Add another delay before fetching images to ensure backend has processed all uploads
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Fetch any newly uploaded images
            const images = await new Promise<any[]>((resolve, reject) => {
              console.log(`Fetching images for property ID ${property.id} after uploads completed...`);
              this.propertyService.getPropertyImages(property.id!).subscribe({
                next: (images) => {
                  console.log(`Successfully fetched ${images.length} images for property ID ${property.id}`);
                  resolve(images);
                },
                error: (err) => {
                  console.error('Error fetching property images:', err);
                  // Use what we have from upload responses if image fetch fails
                  resolve(uploadedImageUrls.map(url => ({ imageUrl: url })));
                }
              });
            });
            
            console.log('Retrieved property images:', images);
            
            // Transform the image data to URLs
            const imageUrls = images.map(img => img.imageUrl);
            
            if (imageUrls.length === 0 && uploadedImageUrls.length > 0) {
              // Fallback to our upload responses if the fetch returned empty
              console.log('Using uploaded image URLs as fallback:', uploadedImageUrls);
              property.imageUrls = uploadedImageUrls;
            } else {
              // Update with fetched image URLs
              console.log('Setting property image URLs to:', imageUrls);
              property.imageUrls = imageUrls;
            }
            
            // Create an updated property with the new images
            const updatedProperty = { ...property };
            
            // Submit the final form with updated image URLs
            this.submitForm.emit(updatedProperty);
          } catch (error) {
            console.error('Error processing property images:', error);
            this.uploadErrors.push('Failed to process uploaded images');
            
            // Use what we have if there was an error
            if (uploadedImageUrls.length > 0) {
              property.imageUrls = uploadedImageUrls;
              this.submitForm.emit({ ...property });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing property:', error);
      alert('Error saving property. Please try again.');
    } finally {
      this.isUploading = false;
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
