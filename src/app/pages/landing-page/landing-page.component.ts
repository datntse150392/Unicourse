import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription } from 'rxjs';
import {
  CoinService,
  CourseService,
  ScheduleMeetingService,
  SharedService,
} from '../../cores/services';
import {
  CheckingDailyEvent,
  Course,
  ScheduleMeeting,
  User,
} from '../../cores/models';
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
  public semester1: Course[] = [];
  public semester2: Course[] = [];
  public semester3: Course[] = [];
  public dataCheckingDailyEvent: CheckingDailyEvent[] = [];
  public getTotalCoin: number = 0;
  public currentDateTime = new Date();
  public dataScheduleMeetings: ScheduleMeeting[] = [];
  public dataBanner: any[] = [];
  public responsiveOptions: any[] | undefined;

  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly checkingDailyEventService: CheckingDailyEventService,
    private readonly coinService: CoinService,
    private readonly sharedService: SharedService,
    private readonly scheduleMeetingService: ScheduleMeetingService
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
    // const courseClass10Sub$ = this.courseService
    //   .getCourseByClass(10)
    //   .subscribe({
    //     next: (res: any) => {
    //       this.courseClass10 = res.data;
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });

    // Lấy danh sách khóa học của khối 11
    // const courseClass11Sub$ = this.courseService
    //   .getCourseByClass(11)
    //   .subscribe({
    //     next: (res: any) => {
    //       this.courseClass11 = res.data;
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });

    // Lấy danh sách khóa học của khối 12
    // const courseClass12Sub$ = this.courseService
    //   .getCourseByClass(12)
    //   .subscribe({
    //     next: (res: any) => {
    //       this.courseClass12 = res.data;
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });

    // Lấy danh sách khóa học của học kỳ 1
    const semester1Sub$ = this.courseService.getCoursebySemester(1).subscribe({
      next: (res: any) => {
        this.semester1 = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    // Lấy danh sách khóa học của học kỳ 2
    const semester2Sub$ = this.courseService.getCoursebySemester(2).subscribe({
      next: (res: any) => {
        this.semester2 = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    // Lấy danh sách khóa học của học kỳ 3
    const semester3Sub$ = this.courseService.getCoursebySemester(3).subscribe({
      next: (res: any) => {
        this.semester3 = res.data;
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

    // Lấy ra tất cả dữ liệu của lịch hẹn
    const getAllScheduleMeetingsSub$ = this.scheduleMeetingService
      .getAllScheduleMeetings()
      .subscribe({
        next: (res: any) => {
          this.dataScheduleMeetings = res.data;
          // Nếu có thì sắp xếp theo thời gian từ mới nhất đến cũ nhất
          if (this.dataScheduleMeetings.length > 0) {
            this.dataScheduleMeetings.sort(
              (a: ScheduleMeeting, b: ScheduleMeeting) => {
                return (
                  new Date(b.timeStart).getTime() -
                  new Date(a.timeStart).getTime()
                );
              }
            );
            this.dataScheduleMeetings = this.dataScheduleMeetings.slice(0, 2);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách banner fake data
    this.dataBanner = [
      {
        id: '1',
        image:
          'https://daihoc.fpt.edu.vn/wp-content/uploads/2023/12/Hocbong-100_-e-thumb-2.png',
        title: 'Khám phá khóa học mới',
        description: 'Học tập không bao giờ là đủ',
      },
      {
        id: '2',
        image:
          'https://dnuni.fpt.edu.vn/wp-content/uploads/2022/02/Untitled-design-12-min-1600x900.png',
        title: 'Học từ những chuyên gia',
        description: 'Học từ những chuyên gia hàng đầu',
      },
    ];

    // this.subscriptions.push(courseClass10Sub$);
    // this.subscriptions.push(courseClass11Sub$);
    // this.subscriptions.push(courseClass12Sub$);
    this.subscriptions.push(checkingDailyEventSub$);
    this.subscriptions.push(getTotalCoinByUserIdSub$);
    this.subscriptions.push(getAllScheduleMeetingsSub$);
    this.subscriptions.push(semester1Sub$);
    this.subscriptions.push(semester2Sub$);
    this.subscriptions.push(semester3Sub$);
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
    if (!this.userInfo) {
      // Nếu không thấy user thì tự động bật form đăng nhập
      this.sharedService.turnOnSignInDialog();
    } else {
      const attendCheckingDailyEventSub$ = this.checkingDailyEventService
        .attendCheckingDailyEvent(dailyId)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              // Lấy danh sách sự kiện kiểm tra hàng ngày
              this.checkingDailyEventService
                .getAllDataCheckingDailyEvent()
                .subscribe({
                  next: (res: any) => {
                    this.dataCheckingDailyEvent = res.data;
                  },
                  error: (err: any) => {
                    console.log(err);
                  },
                });
              this.dialogBroadcastService.broadcastDialog({
                header: 'Thông báo',
                message: 'Chúc mừng bạn đã nhận được phần thưởng',
                type: 'success',
                display: true,
              });
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
}