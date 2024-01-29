import { Component, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared';

@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './learning-page.component.html',
  styleUrl: './learning-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LearningPageComponent {

  constructor() {}

  ngOnInit(): void { }
}
