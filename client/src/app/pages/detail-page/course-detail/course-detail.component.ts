import { Component, Input, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Course } from '../../../cores/models';
import { CourseService } from '../../../cores/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnDestroy {
  @Input() course!: Course;
  @Input() number!: number;
  starValue: number = 5;

  private subscriptions: Subscription[] = [];

  constructor(private courseService: CourseService, private router: Router) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Hàm xử lí click enroll khóa học
  handleEnrollCoures(courseId: string) {
    if (courseId) {
      const enrollCourseSub$ = this.courseService
        .enrollNewCourse(courseId)
        .subscribe({
          next: (res: any) => {
            if (res.status === 201) {
              this.router.navigate([
                `/learning-course`,
                courseId,
                res.data.trackProgress[0].subTrackProgress[0].subTrackId
                  .content_url,
              ]);
            }
          },
        });
      this.subscriptions.push(enrollCourseSub$);
    }
  }
}
