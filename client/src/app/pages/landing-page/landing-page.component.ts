import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription } from 'rxjs';
import { AuthService, CourseService } from '../../cores/services';
import { Course, User } from '../../cores/models';
import { Router } from '@angular/router';
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
  public userInfo!: User;
  public myCourses!: any;
  public value = 5;

  private subscriptions: Subscription[] = [];
  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Config on init
  initForm(): void {
    // Lấy thông tin user
    this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
    this.getMyCourses();
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

    this.subscriptions.push(coursesFreeSub$);
    this.subscriptions.push(courseSemester1Sub$);
    this.subscriptions.push(courseProSub$);
  }

  // Lấy tất cả các khóa học đã đăng ký
  getMyCourses(): void {
    const myCoursesSub$ = this.courseService
      .getMyCourses(this.userInfo._id)
      .subscribe({
        next: (res: any) => {
          this.myCourses = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    this.subscriptions.push(myCoursesSub$);
  }

  // hanleGetCourseDetail
  hanleGetCourseDetail(courseId: string): void {
    if (this.myCourses) {
      var course = this.myCourses.find(
        (item: any) => item.course._id === courseId
      );
      if (course) {
        this.router.navigate([
          `/learning-course`,
          courseId,
          course.trackProgress[0].subTrackProgress[0].subTrackId.content_url,
        ]);
      } else {
        this.router.navigate([`/course`, courseId]);
      }
    }
  }
}
