import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent {
  @Input() property: any;
  @Output() submitAppointment = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  appointmentInfo: any = { name: '', email: '', phone: '', date: '', time: '' };

  onSubmit() {
    this.submitAppointment.emit({ ...this.appointmentInfo, property: this.property });
  }

  onCancel() {
    this.cancel.emit();
  }
}
