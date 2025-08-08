import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Property } from '../models/property.model';
import { AgentInfoComponent } from '../agent-info/agent-info.component';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, AgentInfoComponent],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss'
})
export class PropertyDetailsComponent {
  @Input() property!: Property;
  @Output() close = new EventEmitter<void>();
  @Output() requestInfo = new EventEmitter<Property>();
  @Output() makeAppointment = new EventEmitter<Property>();
  @Output() requestInfoScroll = new EventEmitter<void>();
  
  currentImageIndex = 0;
  
  closeDetails() {
    this.close.emit();
  }
  
  prevImage() {
    if (this.property?.imageUrls?.length) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.imageUrls.length) % this.property.imageUrls.length;
    }
  }
  
  nextImage() {
    if (this.property?.imageUrls?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.imageUrls.length;
    }
  }
  
  onRequestInfo() {
    this.requestInfo.emit(this.property);
  }
  
  onMakeAppointment() {
    this.makeAppointment.emit(this.property);
  }
}
