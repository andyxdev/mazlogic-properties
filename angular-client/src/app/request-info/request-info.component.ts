import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-info.component.html',
  styleUrls: ['./request-info.component.scss']
})
export class RequestInfoComponent {
  @Input() property: any;
  @Output() submitRequest = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  requestInfo: any = { name: '', email: '', phone: '' };

  onSubmit() {
    this.submitRequest.emit({ ...this.requestInfo, property: this.property });
  }

  onCancel() {
    this.cancel.emit();
  }
}
