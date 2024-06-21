import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription, of, forkJoin, catchError } from 'rxjs';
import {
  CoinService,
  CourseService,
  ScheduleMeetingService,
  SharedService,
  UserService,
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
  public maxSelections = 5;
  public selectedCount = 0;
  public selectedInterests: string[] = [];
  public dataRecommenCourses: Course[] = [];

  public isToggleRegisterScheduleMeeting: boolean = false;
  public isToggleDepositPoint: boolean = false;
  public isBlockUI: boolean = false;
  public isToggleSetInterest: boolean = false;

  private subscriptions: Subscription[] = [];

  interests = [
    {
      title: 'Javascript',
      imgSrc: 'https://img.icons8.com/color/96/javascript--v1.png',
      selected: false,
    },
    {
      title: 'Typescript',
      imgSrc: 'https://img.icons8.com/color/96/typescript.png',
      selected: false,
    },
    {
      title: 'Java',
      imgSrc: 'https://img.icons8.com/color/96/java-coffee-cup-logo--v1.png',
      selected: false,
    },
    {
      title: 'Mathematics',
      imgSrc: 'https://img.icons8.com/ios-glyphs/96/math.png',
      selected: false,
    },
    {
      title: 'HTML/CSS',
      imgSrc: 'https://img.icons8.com/color/96/css3.png',
      selected: false,
    },
    {
      title: 'React/React Native',
      imgSrc: 'https://img.icons8.com/plasticine/100/react.png',
      selected: false,
    },
    {
      title: 'MongoDB',
      imgSrc: 'https://img.icons8.com/color/96/mongo-db.png',
      selected: false,
    },
    {
      title: 'SQL/MySQL',
      imgSrc: 'https://img.icons8.com/color/96/microsoft-sql-server.png',
      selected: false,
    },
    {
      title: 'Node.js',
      imgSrc: 'https://img.icons8.com/color/96/nodejs.png',
      selected: false,
    },
    {
      title: 'Android Studio',
      imgSrc: 'https://img.icons8.com/color/96/android-studio--v3.png',
      selected: false,
    },
    {
      title: 'Back-end',
      imgSrc: 'https://img.icons8.com/nolan/96/backend-development.png',
      selected: false,
    },
    {
      title: 'Japanese',
      imgSrc: 'https://img.icons8.com/fluency/96/torii.png',
      selected: false,
    },
    {
      title: 'Fullstack',
      imgSrc:
        'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/96/external-full-stack-web-development-flaticons-lineal-color-flat-icons-2.png',
      selected: false,
    },
    {
      title: 'Mobile',
      imgSrc:
        'https://img.icons8.com/external-smashingstocks-circular-smashing-stocks/96/external-mobile-app-raksha-bandhan-smashingstocks-circular-smashing-stocks.png',
      selected: false,
    },
    {
      title: 'Game',
      imgSrc: 'https://img.icons8.com/bubbles/96/controller.png',
      selected: false,
    },
  ];

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
    private readonly bannerService: BannerService,
    private readonly userService: UserService
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

    // Và kiểm tra xem nếu trên local có isTurnOnNewFeed
    if (localStorage.getItem('isTurnOnNewFeed') !== 'true') {
      this.sharedService.turnOnNewFeedDialog();
      localStorage.setItem('isTurnOnNewFeed', 'true');
    }
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
        if (
          this.userInfo &&
          this.userInfo.interests &&
          this.userInfo.interests.length <= 0
        ) {
          this.isToggleSetInterest = true;
        } else {
          if (
            this.userInfo &&
            this.userInfo.interests &&
            this.userInfo.interests.length > 0
          ) {
            if (localStorage.getItem('recommended_courses')) {
              this.dataRecommenCourses = JSON.parse(
                localStorage.getItem('recommended_courses') || ''
              );
            } else {
              this.dataRecommenCourses = [];
            }
            // this.getRecommendedCourses(this.userInfo.interests);
          }
        }
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

  scrollLeft() {
    const carousel = document.getElementById('carousel');
    if (carousel) {
      carousel.scrollBy({
        left: -300, // Điều chỉnh giá trị này nếu cần
        behavior: 'smooth',
      });
    }
  }

  scrollRight() {
    const carousel = document.getElementById('carousel');
    if (carousel) {
      carousel.scrollBy({
        left: 300, // Điều chỉnh giá trị này nếu cần
        behavior: 'smooth',
      });
    }
  }

  toggleSelection(interest: any) {
    if (interest.selected) {
      this.selectedInterests = this.selectedInterests.filter(
        (item) => item !== interest.title
      );
      interest.selected = false;
      this.selectedCount--;
    } else if (this.selectedCount < this.maxSelections) {
      this.selectedInterests.push(interest.title);
      interest.selected = true;
      this.selectedCount++;
    }
  }

  selectMoreInterests() {
    // Xử lý logic khi người dùng chọn thêm 5 mục và kiểm tra xem đã chọn đủ chưa
    if (this.selectedCount < this.maxSelections) {
      this.dialogBroadcastService.broadcastDialog({
        header: 'Thông báo',
        message: 'Vui lòng chọn đủ 5 mục quan tâm!',
        type: 'info',
        display: true,
      });
    } else {
      this.isBlockUI = true;
      // this.getRecommendedCourses(this.selectedInterests);
      this.isToggleSetInterest = false;
    }
  }

  getRecommendedCourses(selectedInterests: string[]) {
    const setInterestSub$ = this.userService
      .getRecommendation(selectedInterests)
      .subscribe({
        next: (res: any) => {
          this.dataRecommenCourses = res.data;
          localStorage.setItem('recommended_courses', JSON.stringify(res.data));
          this.getUserById(this.userInfo._id);
          this.isToggleSetInterest = false;
          this.isBlockUI = false;
        },
        error: (err: any) => {
          // Thông báo lỗi
          this.dialogBroadcastService.broadcastDialog({
            header: 'Thông báo',
            message: 'Có lỗi xảy ra, vui lòng thử lại sau!',
            type: 'error',
            display: true,
          });
          console.log(err);
        },
      });
    this.subscriptions.push(setInterestSub$);
  }

  getRemainingSelections() {
    return this.maxSelections - this.selectedCount;
  }

  getUserById(userId: string): void {
    const getUserSub$ = this.userService.getUser(userId).subscribe({
      next: (res: any) => {
        //  và cập nhật thông tin user trên localStorage
        localStorage.setItem('UserInfo', JSON.stringify(res.data));
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.subscriptions.push(getUserSub$);
  }
}
