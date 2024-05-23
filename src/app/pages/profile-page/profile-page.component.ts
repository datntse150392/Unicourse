import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components';
import { UserService } from '../../cores/services/user.service';
import { Course, User } from '../../cores/models';
import { Subscription, filter, switchMap } from 'rxjs';
import { CourseService } from '../../cores/services';
import { Router } from '@angular/router';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  public userDetail!: User;
  public userId!: string;
  public userInfo!: User;
  public myCourses!: any;
  public userCreatedTime!: string;
  public blockUI: boolean = true;
  public myWishList: Course[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private courseService: CourseService,
    private router: Router,
    private dialogBroadcastService: DialogBroadcastService
  ) {
    // Thiết lặp title cho trang
    window.document.title = 'Unicourse - Nền Tảng Học Tập Trực Tuyến';
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    //Sử dụng switchMap để lấy giá trị của tham số 'id' từ paramMap
    this.route.paramMap
      .pipe(
        filter((params) => params.has('id')),
        switchMap(async (params) => params.get('id' as string))
      )
      .subscribe((id) => {
        this.userId = id!;
        this.initForm(id!);
      });
  }

  // Config on init
  initForm(_id: string) {
    const userSub$ = this.userService.getUser(_id).subscribe({
      next: (res: any) => {
        this.userDetail = res.data;
        this.userCreatedTime = this.publishedAtString(
          this.userDetail.published_at
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    if (localStorage.getItem('isLogin')) {
      this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
      this.getMyCourses();
    }
    this.subscriptions.push(userSub$);

    this.getMyWishList();

    setTimeout(() => {
      this.blockUI = false;
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // hanle time since publication
  publishedAtString(published_at: string): string {
    const publishedAt: Date = new Date(published_at);
    const currentTime: Date = new Date();
    const timeDifference: number =
      currentTime.getTime() - publishedAt.getTime();
    const days: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes: number = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return `vài phút trước`;
    }
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
      var course = this.myCourses.find((item: any) => item._id === courseId);
      if (course) {
        if (course.trackProgress[0]) {
          this.router.navigate([
            `/learning-course`,
            course.course._id,
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

  // Thực hiện lấy danh sách các khoá học yêu thích
  getMyWishList() {
    const getMyWishListSub$ = this.userService.getMyWishList().subscribe({
      next: (res: any) => {
        if (res) {
          this.myWishList = res.data;
        }
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
    this.subscriptions.push(getMyWishListSub$);
  }
}
