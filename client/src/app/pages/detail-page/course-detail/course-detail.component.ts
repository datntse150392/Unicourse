import { Component, Input } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Course } from '../../../cores/models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent {
  @Input() course!: Course;
  @Input() number!: number;
  starValue: number = 5;

  ngOnInit(): void {
    console.log(this.course);
  }
}
