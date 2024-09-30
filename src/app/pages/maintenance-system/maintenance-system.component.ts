import { Component } from '@angular/core';
import { SharedModule } from '../../shared';

@Component({
  selector: 'app-maintenance-system',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './maintenance-system.component.html',
  styleUrl: './maintenance-system.component.scss'
})
export class MaintenanceSystemComponent {
  constructor() { }
}
