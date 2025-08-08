import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentInfoComponent } from '../agent-info/agent-info.component';
import { Property } from '../models/property.model';

@Component({
  selector: 'app-property-item',
  standalone: true,
  imports: [CommonModule, AgentInfoComponent],
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.scss']
})
export class PropertyItemComponent implements OnInit {
  @Input() property!: Property; // Using non-null assertion operator
  @Output() edit = new EventEmitter<Property>();
  @Output() delete = new EventEmitter<number>();
  @Output() requestInfo = new EventEmitter<Property>();
  @Output() makeAppointment = new EventEmitter<Property>();
  @Output() viewDetails = new EventEmitter<Property>();
  @Output() requestInfoScroll = new EventEmitter<void>();

  currentImageIndex = 0;
  fallbackImageUrl = 'assets/property-images/property-placeholder.svg';
  
  ngOnInit(): void {
    // Initialize with first image
    this.currentImageIndex = 0;
  }
  
  nextImage(): void {
    if (this.property.imageUrls && this.property.imageUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.imageUrls.length;
    }
  }
  
  prevImage(): void {
    if (this.property.imageUrls && this.property.imageUrls.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.imageUrls.length) % this.property.imageUrls.length;
    }
  }
  
  handleImageError(event: any): void {
    console.log('Image failed to load:', this.property.imageUrls?.[this.currentImageIndex]);
    
    // Create a placeholder image URL - either from assets or a base64 image
    const imgElement = event.target;
    imgElement.src = this.fallbackImageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIiBkeT0iLjNlbSI+SW1hZ2UgbG9hZCBlcnJvcjwvdGV4dD48L3N2Zz4=';
    imgElement.onerror = null; // Prevent infinite loop if fallback also fails
  }
}
