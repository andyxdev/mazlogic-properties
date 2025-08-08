import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent-info.component.html',
  styleUrl: './agent-info.component.scss'
})
export class AgentInfoComponent {
  @Input() agent: any;
}
