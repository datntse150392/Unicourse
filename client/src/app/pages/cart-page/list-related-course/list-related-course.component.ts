import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Course } from '../../../cores/models';

@Component({
  selector: 'app-list-related-course',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './list-related-course.component.html',
  styleUrl: './list-related-course.component.scss'
})
export class ListRelatedCourseComponent {
  @Input() course: Course | undefined;
}
