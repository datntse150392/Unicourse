import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription } from 'rxjs';
import { CoinService, CourseService } from '../../cores/services';
import { CheckingDailyEvent, Course, User } from '../../cores/models';
import { Router } from '@angular/router';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';
import { CheckingDailyEventService } from '../../cores/services/checking-daily-event.service';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public userInfo!: User;
  public myCourses!: any;
  public value = 5;
  public courseClass10: Course[] = [];
  public courseClass11: Course[] = [];
  public courseClass12: Course[] = [];
  public dataCheckingDailyEvent: CheckingDailyEvent[] = [];
  public getTotalCoin: number = 0;

  private subscriptions: Subscription[] = [];
  constructor(
    private courseService: CourseService,
    private router: Router,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly checkingDailyEventService: CheckingDailyEventService,
    private readonly coinService: CoinService
  ) {
    // Thiết lặp title cho trang
    window.document.title = 'Unicourse - Nền Tảng Học Tập Trực Tuyến';
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Config on init
  initForm(): void {
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    if (localStorage !== undefined) {
      if (localStorage.getItem('isLogin')) {
        this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
        this.getMyCourses();
      }
    }

    // Lấy danh sách khóa học của khối 10
    const courseClass10Sub$ = this.courseService
      .getCourseByClass(10)
      .subscribe({
        next: (res: any) => {
          this.courseClass10 = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách khóa học của khối 11
    const courseClass11Sub$ = this.courseService
      .getCourseByClass(11)
      .subscribe({
        next: (res: any) => {
          this.courseClass11 = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách khóa học của khối 12
    const courseClass12Sub$ = this.courseService
      .getCourseByClass(12)
      .subscribe({
        next: (res: any) => {
          this.courseClass12 = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách sự kiện kiểm tra hàng ngày
    const checkingDailyEventSub$ = this.checkingDailyEventService
      .getAllDataCheckingDailyEvent()
      .subscribe({
        next: (res: any) => {
          this.dataCheckingDailyEvent = res.data;
          console.log(this.dataCheckingDailyEvent);
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy tổng số coin của user
    const getTotalCoinByUserIdSub$ = this.coinService
      .getTotalCoinByUserId()
      .subscribe({
        next: (res: any) => {
          this.getTotalCoin = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    this.subscriptions.push(courseClass10Sub$);
    this.subscriptions.push(courseClass11Sub$);
    this.subscriptions.push(courseClass12Sub$);
    this.subscriptions.push(checkingDailyEventSub$);
    this.subscriptions.push(getTotalCoinByUserIdSub$);
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
        if (course.trackProgress[0]) {
          this.router.navigate([
            `/learning-course`,
            courseId,
            course.trackProgress[0].subTrackProgress[0].subTrackId.content_url,
          ]);
        } else {
          this.dialogBroadcastService.broadcastDialog({
            header: 'Thông báo',
            message:
              'Khóa học đang trong quá trình cập nhật, vui lòng quay lại sau!',
            type: 'info',
            display: true,
          });
        }
      } else {
        this.router.navigate([`/course`, courseId]);
      }
    } else {
      this.router.navigate([`/course`, courseId]);
    }
  }

  checkEventToday(day: Date): any {
    const today = new Date();
    if (new Date(day).getDate() === today.getDate()) {
      return true;
    }
    return false;
  }

  checkEventExpired(day: Date): any {
    const today = new Date();
    if (new Date(day).getDate() < today.getDate()) {
      return true;
    }
    return false;
  }

  // Kiểm tra xem user đã tham gia sự kiện kiểm tra hàng ngày chưa
  checkUserJoinEvent(listUsers: string[]): any {
    if (listUsers.includes(this.userInfo._id)) {
      return true;
    }
    return false;
  }

  // Tham gia sự kiện kiểm tra hàng ngày
  attendCheckingDailyEvent(dailyId: string): void {
    const attendCheckingDailyEventSub$ = this.checkingDailyEventService
      .attendCheckingDailyEvent(dailyId)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.dialogBroadcastService.broadcastDialog({
              header: 'Thông báo',
              message: 'Tham gia sự kiện kiểm tra hàng ngày thành công!',
              type: 'success',
              display: true,
            });
            this.initForm();
          }
        },
        error: (err: any) => {
          this.dialogBroadcastService.broadcastDialog({
            header: 'Thông báo',
            message:
              'Bạn đã điểm danh sự kiện này rồi, quay lại vào ngày mai nhé!',
            type: 'error',
            display: true,
          });
          console.log(err);
        },
      });
    this.subscriptions.push(attendCheckingDailyEventSub$);
  }
}
