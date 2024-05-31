import { Component, Input, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../shared';
import { Cart, CartItem, Course, User } from '../../../cores/models';
import {
  CourseService,
  SharedService,
  CartService,
  UserService,
} from '../../../cores/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  cart: Cart | undefined;
  public courseId!: string | null;
  public isExistedCourseInsideCart: boolean = false;
  public blockedUI: boolean = false;
  public userInfo!: User;

  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private cartService: CartService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private sharedService: SharedService,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly userService: UserService
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.activeRouter.paramMap.subscribe((params) => {
      this.courseId = params.get('id');
    });
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
      }
    }

    const cartSub$ = this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
        if (this.cart) {
          this.isExistedCourseInsideCart = false;
          if (this.cart.items && this.cart.items.length > 0) {
            this.cart.items.map((item: CartItem) => {
              if (item._id === this.courseId) {
                this.isExistedCourseInsideCart = true;
              }
            });
          }
        }
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
          this.blockedUI = true;
          const enrollCourseSub$ = this.courseService
            .enrollNewCourse(courseId)
            .subscribe({
              next: (res: any) => {
                if (res.status === 201) {
                  if (
                    res.data.trackProgress[0] &&
                    res.data.trackProgress[0].subTrackProgress[0]
                  ) {
                    this.blockedUI = false;
                    this.router.navigate([
                      `/learning-course`,
                      courseId,
                      res.data.trackProgress[0].subTrackProgress[0].subTrackId
                        .content_url,
                    ]);
                  } else {
                    this.dialogBroadcastService.broadcastConfirmationDialog({
                      header: 'Lỗi',
                      message: 'Thêm khóa học không thành công',
                      type: 'error',
                      return: false,
                      numberBtn: 1,
                    });
                    this.blockedUI = false;
                  }
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
          const addtoCartSub$ = this.cartService.addToCart(courseId).subscribe({
            next: (res: any) => {
              if (res.status === 201) {
                this.dialogBroadcastService.broadcastConfirmationDialog({
                  header: 'Thông báo',
                  message: 'Đã thêm khóa học vào giỏ hàng',
                  type: 'success',
                  return: false,
                  numberBtn: 1,
                });
                this.sharedService.isUpdateCartItem();
                this.initForm();
              }
            },
            error: (err: any) => {
              this.dialogBroadcastService.broadcastDialog({
                header: 'Giỏ hàng',
                message: 'Thêm khóa học vào giỏ hàng thất bại',
                type: 'error',
                display: true,
              });
            },
          });
          this.subscriptions.push(addtoCartSub$);
        }
      }
    }
  }

  handleRemoveFromCart(courseId: string) {
    if (localStorage !== undefined) {
      if (!localStorage.getItem('isLogin')) {
        this.sharedService.turnOnSignInDialog();
      } else {
        if (courseId && this.cart?._id) {
          const deleteItemCartSub$ = this.cartService
            .deleteItemCart(courseId, this.cart._id)
            .subscribe({
              next: (res: any) => {
                if (res.status === 201) {
                  this.dialogBroadcastService.broadcastConfirmationDialog({
                    header: 'Thông báo',
                    message: 'Đã xóa khóa học khỏi giỏ hàng',
                    type: 'success',
                    return: false,
                    numberBtn: 1,
                  });
                  this.sharedService.isUpdateCartItem();
                  this.initForm();
                }
              },
              error: (err: any) => {
                this.dialogBroadcastService.broadcastDialog({
                  header: 'Giỏ hàng',
                  message: 'Xóa khóa học thất bại',
                  type: 'error',
                  display: true,
                });
              },
            });
          this.subscriptions.push(deleteItemCartSub$);
        }
      }
    }
  }

  checkCourseInWishList(): boolean {
    if (typeof localStorage !== 'undefined') {
      const wishListString = localStorage.getItem('my_wish_list');
      if (wishListString) {
        try {
          const myWishList = JSON.parse(wishListString) as Array<{
            _id: string;
          }>;
          if (
            Array.isArray(myWishList) &&
            myWishList.some((course) => course._id === this.course._id)
          ) {
            return true;
          }
        } catch (e) {
          console.error('Error parsing my_wish_list from localStorage', e);
        }
      }
    }
    return false;
  }

  addCourseInWishList() {
    if (!localStorage.getItem('isLogin')) {
      this.sharedService.turnOnSignInDialog();
    } else {
      const addWishListSub$ = this.userService
        .addCourseInWishList(this.course._id)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Thông báo',
                message: 'Đã thêm khóa học vào danh sách yêu thích',
                type: 'success',
                return: false,
                numberBtn: 1,
              });
              const getWishListSub$ = this.userService
                .getMyWishList()
                .subscribe({
                  next: (res: any) => {
                    localStorage.setItem(
                      'my_wish_list',
                      JSON.stringify(res.data)
                    );
                    this.initForm();
                  },
                });
              this.subscriptions.push(getWishListSub$);
            }
          },
          error: (err: any) => {
            this.dialogBroadcastService.broadcastDialog({
              header: 'thông báo',
              message:
                'Thêm khoá học vào danh sách yêu thích thất bại, mời bạn thử lại',
              type: 'error',
              display: true,
            });
          },
        });
      this.subscriptions.push(addWishListSub$);
    }
  }

  removeCourseInWishList() {
    if (!localStorage.getItem('isLogin')) {
      this.sharedService.turnOnSignInDialog();
    } else {
      const addWishListSub$ = this.userService
        .removeCourseOutWishList(this.course._id)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Thông báo',
                message: 'Đã gỡ khóa học ra khỏi danh sách yêu thích',
                type: 'success',
                return: false,
                numberBtn: 1,
              });
              const getWishListSub$ = this.userService
                .getMyWishList()
                .subscribe({
                  next: (res: any) => {
                    localStorage.setItem(
                      'my_wish_list',
                      JSON.stringify(res.data)
                    );
                    this.initForm();
                  },
                });
              this.subscriptions.push(getWishListSub$);
            }
          },
          error: (err: any) => {
            this.dialogBroadcastService.broadcastDialog({
              header: 'thông báo',
              message: 'Thêm gỡ khoá học thất bại, mời bạn thử lại',
              type: 'error',
              display: true,
            });
          },
        });
      this.subscriptions.push(addWishListSub$);
    }
  }

  redirectToCart() {
    if (!localStorage.getItem('isLogin')) {
      this.sharedService.turnOnSignInDialog();
    }
    this.router.navigate([`/profile/${this.userInfo._id}/cart`]);
  }

  handleAddToCartAndRedirectCart(courseId: string) {
    if (localStorage !== undefined) {
      if (!localStorage.getItem('isLogin')) {
        this.sharedService.turnOnSignInDialog();
      } else {
        if (courseId) {
          const addtoCartSub$ = this.cartService.addToCart(courseId).subscribe({
            next: (res: any) => {
              if (res.status === 201) {
                this.sharedService.isUpdateCartItem();
                this.initForm();
                this.redirectToCart();
              }
            },
            error: (err: any) => {
              this.dialogBroadcastService.broadcastDialog({
                header: 'Giỏ hàng',
                message: 'Thêm khóa học vào giỏ hàng thất bại',
                type: 'error',
                display: true,
              });
            },
          });
          this.subscriptions.push(addtoCartSub$);
        }
      }
    }
  }
}
