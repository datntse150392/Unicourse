import { Component, Input, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Cart, Course } from '../../../cores/models';
import { CourseService, SharedService, CartService } from '../../../cores/services';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogBroadcastService } from '../../../cores/services/dialog-broadcast.service';
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
  isExistedCourseInsideCart: boolean = false;
  cart: Cart | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private cartService: CartService,
    private router: Router,
    private sharedService: SharedService,
    private dialogBroadcastService: DialogBroadcastService
  ) {}
  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Config on init
  initForm(): void {
    const cartSub$ = this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
        this.cart?.items.forEach((item) => {
          if (item._id === this.course._id) {
            this.isExistedCourseInsideCart = true;
          }
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.subscriptions.push(cartSub$);
  }

  // Hàm xử lí click enroll khóa học
  handleEnrollCoures(courseId: string) {
    if (localStorage !== undefined) {
      if (!localStorage.getItem('isLogin')) {
        this.sharedService.turnOnSignInDialog();
      } else {
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
  }

  // Hàm xử lí click thêm vào giỏ hàng
  handleAddToCart(courseId: string) {
    if (localStorage !== undefined) {
      if (!localStorage.getItem('isLogin')) {
        this.sharedService.turnOnSignInDialog();
      } else {
        if (courseId) {
          const addtoCartSub$ = this.cartService
            .addToCart(courseId)
            .subscribe({
              next: (res: any) => {
                if (res.status === 201) {
                  this.dialogBroadcastService.broadcastDialog({
                    header: 'Giỏ hàng',
                    message: 'Thêm khóa học vào giỏ hàng thành công',
                    type: 'success',
                    display: true,
                  });
                }}, error: (err: any) => {
                  this.dialogBroadcastService.broadcastDialog({
                    header: 'Giỏ hàng',
                    message: 'Thêm khóa học vào giỏ hàng thất bại',
                    type: 'error',
                    display: true,
                  });
              }
            });
            this.subscriptions.push(addtoCartSub$);
          }
      }
    }
  }

  handleRemoveFromCart(courseId: string) {
    this.dialogBroadcastService.broadcastDialog({
      header: 'Giỏ hàng',
      message: 'Chức năng đang trong qua trình xây dựng',
      type: 'success',
      display: true,
    });
  }
}
