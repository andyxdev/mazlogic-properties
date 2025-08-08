import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyItemComponent } from '../property-item/property-item.component';
import { Property } from '../models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, PropertyItemComponent],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent {
  @Input() properties: Property[] = [];
  @Output() edit = new EventEmitter<Property>();
  @Output() delete = new EventEmitter<number>();
  @Output() requestInfo = new EventEmitter<Property>();
  @Output() makeAppointment = new EventEmitter<Property>();
  @Output() viewAll = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<Property>();
  @Output() requestInfoScroll = new EventEmitter<void>();

  onEdit(property: Property) {
    this.edit.emit(property);
  }
  onDelete(id: number | undefined) {
    if (id !== undefined) {
      this.delete.emit(id);
    } else {
      console.error('Cannot delete property with undefined id');
    }
  }
  onRequestInfo(property: Property) {
    this.requestInfo.emit(property);
  }
  onMakeAppointment(property: Property) {
    this.makeAppointment.emit(property);
  }
  onViewAll() {
    this.viewAll.emit();
  }
  onViewDetails(property: Property) {
    this.viewDetails.emit(property);
  }
}
