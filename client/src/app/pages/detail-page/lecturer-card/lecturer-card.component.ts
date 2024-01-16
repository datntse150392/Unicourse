import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-lecturer-card',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lecturer-card.component.html',
  styleUrl: './lecturer-card.component.scss'
})
export class LecturerCardComponent {
  starValue: number = 5;
}
