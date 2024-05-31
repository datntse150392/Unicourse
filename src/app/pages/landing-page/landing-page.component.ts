import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription, of, forkJoin, catchError } from 'rxjs';
import {
  CoinService,
  CourseService,
  ScheduleMeetingService,
  SharedService,
} from '../../cores/services';
import {
  Banner,
  CheckingDailyEvent,
  Course,
  ScheduleMeeting,
  User,
} from '../../cores/models';
import { Router } from '@angular/router';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';
import { CheckingDailyEventService } from '../../cores/services/checking-daily-event.service';
import { switchMap } from 'rxjs/operators';
import { PayOSService } from '../../cores/services/payOS.service';
import { Meta, Title } from '@angular/platform-browser';
import { BannerService } from '../../cores/services/banner.service';

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
  public dataCheckingDailyEvent: CheckingDailyEvent[] = [];
  public getTotalCoin: number = 0;
  public currentDateTime = new Date();
  public dataScheduleMeetings: ScheduleMeeting[] = [];
  public dataBanner: any[] = [];
  public responsiveOptions: any[] | undefined;
  public scheduleData: ScheduleMeeting | undefined;
  public listCourseFree: Course[] = [];
  public listCourseFee: Course[] = [];
  public hoveredImage: string | null = null; // Khởi tạo biến hoveredImage và gán giá trị ban đầu là null
  public dataBanners: Banner[] = [];

  public isToggleRegisterScheduleMeeting: boolean = false;
  public isToggleDepositPoint: boolean = false;
  public isBlockUI: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private router: Router,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly checkingDailyEventService: CheckingDailyEventService,
    private readonly coinService: CoinService,
    private readonly sharedService: SharedService,
    private readonly scheduleMeetingService: ScheduleMeetingService,
    private readonly payOSService: PayOSService,
    private readonly meta: Meta,
    private readonly titleService: Title,
    private readonly bannerService: BannerService
  ) {
    // Thiết lặp title cho trang
    window.document.title = 'Unicourse - Nền Tảng Học Tập Trực Tuyến';
    // Cập nhật tiêu đề trang
    this.titleService.setTitle(
      'Unicourse - Khóa học dành riêng cho sinh viên ĐH FPT'
    );

    // Cập nhật các thẻ meta
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Unicourse cung cấp các khóa học và lộ trình học tập dành riêng cho sinh viên Đại học FPT. Tìm hiểu ngay tại unicourse.vn!',
      },
      {
        name: 'keywords',
        content:
          'Unicourse, unicourse.vn, khóa học, sinh viên ĐH FPT, học tập, lộ trình, lộ trình, unicourse ĐH FPT',
      },
      { name: 'author', content: 'Unicourse Team' },
      {
        property: 'og:title',
        content: 'Unicourse - Khóa học dành riêng cho sinh viên ĐH FPT',
      },
      {
        property: 'og:description',
        content:
          'Khám phá các khóa học và lộ trình học tập tại Unicourse, dành riêng cho sinh viên ĐH FPT.',
      },
      {
        property: 'og:image',
        content:
          'https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Baner%2FTo%CC%82%CC%89ng%20ho%CC%9B%CC%A3p%20thie%CC%82%CC%81t%20ke%CC%82%CC%81%20banner.jpg?alt=media&token=c9d4ee1a-1ecf-4fa0-a397-0a6c041bf62chttps://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Baner%2F6.png?alt=media&token=1f9d38c2-782a-4578-8ccd-89386815bd0a',
      },
    ]);
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
    this.isBlockUI = true;
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    if (localStorage !== undefined) {
      if (localStorage.getItem('isLogin')) {
        this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
        this.getMyCourses();
      }
    }

    // Lấy danh sách khoá học miễn phí
    const getListCourseFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        // Filter course active
        res.data = res.data.filter((item: Course) => item.status === 'active');
        this.listCourseFree = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    // Lấy danh sách khoá học có phí
    const getListCourseFeeSub$ = this.courseService.getCoursesFee().subscribe({
      next: (res: any) => {
        // Filter course active
        res.data = res.data.filter((item: Course) => item.status === 'active');
        this.listCourseFee = res.data;
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

    // Lấy tổng số coin của user khi thay đổi
    this.sharedService.isRefreshTotalCoin$.subscribe((res) => {
      if (res && res === true) {
        this.coinService.getTotalCoinByUserId().subscribe({
          next: (res: any) => {
            this.getTotalCoin = res.data;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
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

    // Lấy danh sách banner
    const getAllBannerSub$ = this.bannerService.getAllBanners().subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.dataBanner = res.data;
        }
      },
    });

    this.subscriptions.push(checkingDailyEventSub$);
    this.subscriptions.push(getTotalCoinByUserIdSub$);
    this.subscriptions.push(getAllScheduleMeetingsSub$);
    this.subscriptions.push(getAllBannerSub$);
    this.subscriptions.push(getListCourseFeeSub$);
    this.subscriptions.push(getListCourseFreeSub$);
    this.isBlockUI = false;
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
      this.isBlockUI = true;
      this.checkingDailyEventService
        .attendCheckingDailyEvent(dailyId)
        .pipe(
          switchMap((attendResponse: any) => {
            if (attendResponse.status === 200) {
              return forkJoin({
                totalCoinReponse: this.coinService.getTotalCoinByUserId(),
                allDataResponse: this.checkingDailyEventService
                  .getAllDataCheckingDailyEvent()
                  .pipe(
                    catchError((error: any) => {
                      // Xử lý lỗi nếu có

                      // Trả về một giá trị Observable rỗng nếu có lỗi
                      return of(null);
                    })
                  ),
              });
            } else {
              // Nếu attendCheckingDailyEvent không thành công, trả về một giá trị Observable rỗng
              return of(null);
            }
          })
        )
        .subscribe({
          next: (results: any) => {
            if (
              results &&
              results.totalCoinReponse &&
              results.allDataResponse
            ) {
              // Nếu getAllDataCheckingDailyEvent thành công, xử lý dữ liệu ở đây
              console.log('Dữ liệu mới nhận được:', results);
              this.dataCheckingDailyEvent = results.allDataResponse.data;
              this.getTotalCoin = results.totalCoinReponse.data;

              // Hiển thị thông báo
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Thông báo',
                message: 'Chúc mừng bạn đã nhận được phần thưởng!',
                type: 'success',
                return: false,
                numberBtn: 1,
              });

              this.isBlockUI = false;
            } else {
              // Nếu attendCheckingDailyEvent không thành công, hiển thị thông báo lỗi
              this.dialogBroadcastService.broadcastDialog({
                header: 'Thông báo',
                message:
                  'Bạn đã điểm danh sự kiện này rồi, quay lại vào ngày mai nhé!',
                type: 'error',
                display: true,
              });

              this.isBlockUI = false;
            }
          },
          error: (err: any) => {
            // Xử lý lỗi nếu có
            // Hiển thị thông báo
            this.dialogBroadcastService.broadcastConfirmationDialog({
              header: 'Thông báo',
              message: 'Hệ thống hiện tại có vấn đề, mời bạn thử lại',
              type: 'error',
              return: false,
              numberBtn: 1,
            });
            this.isBlockUI = false;
            console.log(err);
          },
        });
    }
  }

  // Check user already register schedule meeting
  checkUserRegisterScheduleMeeting(data: ScheduleMeeting) {
    if (this.userInfo === undefined) return false;
    else {
      if (data.list_register.includes(this.userInfo._id)) {
        return true;
      }
      return false;
    }
  }

  // Toggle form đăng ký lịch hẹn
  toggleRegisterScheduleMeeting(data: ScheduleMeeting): void {
    // Kiểm tra user phải đăng nhập
    if (!this.userInfo) {
      this.sharedService.turnOnSignInDialog();
    } else {
      this.scheduleData = data;
      if (this.getTotalCoin < data.price) {
        this.isToggleDepositPoint = true;
      } else {
        this.isToggleRegisterScheduleMeeting = true;
      }
    }
  }

  handleRegisterScheduleMeeting() {
    if (this.scheduleData) {
      this.isBlockUI = true;
      const registerScheduleMeetingSub$ = this.scheduleMeetingService
        .registerScheduleMeeting(this.scheduleData._id)
        .pipe(
          switchMap((registerResponse: any) => {
            if (registerResponse.status === 200) {
              return forkJoin({
                totalCoinReponse: this.coinService.getTotalCoinByUserId(),
                allDataResponse: this.scheduleMeetingService
                  .getAllScheduleMeetings()
                  .pipe(
                    catchError((error: any) => {
                      // Xử lý lỗi nếu có
                      console.error(
                        'Error fetching data after attending event:',
                        error
                      );
                      // Trả về một giá trị Observable rỗng nếu có lỗi
                      return of(null);
                    })
                  ),
              });
            } else {
              // Nếu registerScheduleMeeting không thành công, trả về một giá trị Observable rỗng
              return of(null);
            }
          })
        )
        .subscribe({
          next: (results: any) => {
            if (
              results &&
              results.totalCoinReponse &&
              results.allDataResponse
            ) {
              // Nếu getAllScheduleMeetings thành công, xử lý dữ liệu ở đây
              console.log('Dữ liệu mới nhận được:', results);
              this.dataScheduleMeetings = results.allDataResponse.data;
              this.getTotalCoin = results.totalCoinReponse.data;

              // Hiển thị thông báo
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Thông báo',
                message: 'Đăng ký lịch hẹn thành công!',
                type: 'success',
                return: false,
                numberBtn: 1,
              });

              this.isToggleRegisterScheduleMeeting = false;
              this.isToggleDepositPoint = false;
              this.isBlockUI = false;
            } else {
              // Nếu registerScheduleMeeting không thành công, hiển thị thông báo lỗi
              this.dialogBroadcastService.broadcastDialog({
                header: 'Thông báo',
                message:
                  'Bạn đã đăng ký lịch hẹn này rồi, vui lòng chọn lịch hẹn khác!',
                type: 'error',
                display: true,
              });
              this.isBlockUI = false;
            }
          },
          error: (err: any) => {
            // Xử lý lỗi nếu có
            console.log(err);
          },
        });
      this.subscriptions.push(registerScheduleMeetingSub$);
    }
  }

  // Thực hiện gọi API để tạo link payment nạp point
  handleCreatePaymentLink(): void {
    this.isBlockUI = true;
    // Tạo orderCode ngẫu nhiên không trùng lặp theo thời gian
    const orderCode = new Date().getTime();
    const data = {
      orderCode: orderCode,
      amount:
        (this.scheduleData && this.scheduleData.price - this.getTotalCoin) || 0,
      description: 'nap point',
      items: [
        {
          name: 'Nạp point',
          quantity: 1,
          price: this.scheduleData?.price,
          currency: 'VND',
        },
      ],
    };

    this.payOSService.createPaymentLink(data).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // Lưu vào localStorage trạng thái nạp point
          localStorage.setItem('isDepositPoint', 'true');
          // Chuyển thẳng sang trang thanh toán
          window.location.href = res.data.checkoutUrl;
          this.isBlockUI = false;
        }
      },
      error: (err: any) => {
        console.log(err);
        this.isBlockUI = false;
      },
    });
  }
}
