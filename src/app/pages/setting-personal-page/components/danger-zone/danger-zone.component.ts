import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared';

@Component({
  selector: 'app-danger-zone',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './danger-zone.component.html',
  styleUrl: './danger-zone.component.scss'
})
export class DangerZoneComponent {

}
