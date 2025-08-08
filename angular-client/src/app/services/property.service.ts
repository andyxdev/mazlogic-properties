import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Property } from '../models/property.model';
import { PropertyMapperService } from './property-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8081/api/properties';

  constructor(
    private http: HttpClient,
    private mapper: PropertyMapperService
  ) { }

  getProperties(): Observable<Property[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(backendProperties => this.mapper.mapPropertiesBackendToFrontend(backendProperties))
    );
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(backendProperty => this.mapper.mapBackendToFrontend(backendProperty))
    );
  }

  createProperty(property: Property): Observable<Property> {
    // Create an observable that will use our async mapper
    return new Observable<Property>(observer => {
      // First map the property to backend format using the async mapper
      this.mapper.mapFrontendToBackendAsync(property)
        .then(backendProperty => {
          console.log('Sending property to backend with agent:', backendProperty);
          
          // Then make the API call
          this.http.post<any>(this.apiUrl, backendProperty).subscribe({
            next: createdProperty => {
              console.log('Response from backend:', createdProperty);
              const mappedProperty = this.mapper.mapBackendToFrontend(createdProperty);
              observer.next(mappedProperty);
              observer.complete();
            },
            error: error => {
              console.error('Error creating property:', error);
              if (error.error && error.error.message) {
                console.error('Backend error message:', error.error.message);
              }
              observer.error(error);
            }
          });
        })
        .catch(error => {
          console.error('Error mapping property:', error);
          observer.error(error);
        });
    });
  }

  updateProperty(id: number, property: Property): Observable<Property> {
    // Use our async mapper for proper agent handling
    return new Observable<Property>(observer => {
      this.mapper.mapFrontendToBackendAsync(property)
        .then(backendProperty => {
          console.log('Sending updated property to backend with agent:', backendProperty);
          
          this.http.put<any>(`${this.apiUrl}/${id}`, backendProperty).subscribe({
            next: updatedProperty => {
              console.log('Response from backend:', updatedProperty);
              const mappedProperty = this.mapper.mapBackendToFrontend(updatedProperty);
              observer.next(mappedProperty);
              observer.complete();
            },
            error: error => {
              console.error('Error updating property:', error);
              observer.error(error);
            }
          });
        })
        .catch(error => {
          console.error('Error mapping property for update:', error);
          observer.error(error);
        });
    });
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPropertiesByType(type: string): Observable<Property[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/${type}`).pipe(
      map(properties => this.mapper.mapPropertiesBackendToFrontend(properties))
    );
  }

  searchProperties(keyword: string): Observable<Property[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params }).pipe(
      map(properties => this.mapper.mapPropertiesBackendToFrontend(properties))
    );
  }

  getPropertiesByMaxPrice(maxPrice: number): Observable<Property[]> {
    const params = new HttpParams().set('maxPrice', maxPrice.toString());
    return this.http.get<any[]>(`${this.apiUrl}/price`, { params }).pipe(
      map(properties => this.mapper.mapPropertiesBackendToFrontend(properties))
    );
  }

  // Upload property image
  uploadPropertyImage(
    propertyId: number, 
    file: File, 
    description?: string, 
    displayOrder?: number
  ): Observable<any> {
    console.log(`PropertyService: Starting upload for property ID ${propertyId}`);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (description) {
      formData.append('description', description);
    }
    
    if (displayOrder !== undefined) {
      formData.append('displayOrder', displayOrder.toString());
    }
    
    // Log the upload details
    console.log(`PropertyService: Uploading file "${file.name}" (${file.size} bytes) to property ID ${propertyId}`);
    console.log(`PropertyService: Upload endpoint: ${this.apiUrl}/${propertyId}/images`);
    
    // Return an observable that includes error handling and logging with a timeout
    return this.http.post<any>(`${this.apiUrl}/${propertyId}/images`, formData, {
      // Increase timeout for large files
      // NOTE: This requires HttpClientModule config with timeoutAll, not included here
      // but can be added if needed
      reportProgress: true
    }).pipe(
      catchError(error => {
        console.error(`PropertyService: Upload failed for property ID ${propertyId}:`, error);
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          console.error('Client-side error:', error.error.message);
        } else {
          // Server-side error
          console.error(`Server returned code ${error.status}, body:`, error.error);
        }
        throw error;
      })
    );
  }

  // Delete property image
  deletePropertyImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/images/${imageId}`);
  }

  // Get property images
  getPropertyImages(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${propertyId}/images`);
  }
}
