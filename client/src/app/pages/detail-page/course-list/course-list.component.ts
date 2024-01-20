import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Course } from '../../../cores/models';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss',
})
export class CourseListComponent {
  @Input() course: Course | undefined;

  ngOnInit() {
    console.log(this.course);
  }
}
