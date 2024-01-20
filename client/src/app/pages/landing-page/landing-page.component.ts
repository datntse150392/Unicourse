import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription } from 'rxjs';
import { CourseService } from '../../cores/services';
import { Course } from '../../cores/models';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public coursesFree: Course[] = [];
  public courseSemester1: Course[] = [];
  public coursePro: Course[] = [];
  public value = 5;

  private subscription = new Subscription();
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Config on init
  initForm(): void {
    const coursesFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        this.coursesFree = res.data;
        this.courseService.listcoursesPro = res.data;

      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const courseSemester1Sub$ = this.courseService
      .getCoursebySemester('1')
      .subscribe({
        next: (res: any) => {
          this.courseSemester1 = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách khóa học PRO
    const courseProSub$ = this.courseService.getCoursePro().subscribe({
      next: (res: any) => {
        this.coursePro = res.data;
        this.courseService.listcoursesPro = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.subscription.add(coursesFreeSub$);
    this.subscription.add(courseSemester1Sub$);
    this.subscription.add(courseProSub$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
