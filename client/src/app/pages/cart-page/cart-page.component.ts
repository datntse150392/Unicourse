import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { CartItemComponent } from './cart-item/cart-item.component';
import { Course, User, Voucher } from '../../cores/models';
import { Cart, UserInfo, CartItem } from '../../cores/models';
import { Router } from '@angular/router';
import { ListRelatedCourseComponent } from './list-related-course/list-related-course.component';
import { Subscription } from 'rxjs';
import {
  CourseService,
  CartService,
  SharedService,
  VoucherService,
} from '../../cores/services';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    CartItemComponent,
    ListRelatedCourseComponent,
  ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit, OnDestroy {
  public user: User | undefined;
  public cart: Cart | undefined;
  public coursesFree: Course[] = [];
  public vouchers: Voucher[] = [];
  public voucherDetail: Voucher | undefined;
  public voucherCode: string | undefined;
  public isApplyVoucher: boolean = false;
  public errorVoucher: boolean = false;
  public totalAmountBeforeApplyVoucher = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private cartService: CartService,
    private router: Router,
    private sharedService: SharedService,
    private dialogBroadcastService: DialogBroadcastService,
    private voucherService: VoucherService
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

  settingUserInfo() {
    if (typeof localStorage !== 'undefined') {
      // Use localStorage here
      // Example: localStorage.setItem('key', 'value');
      const userLocal = localStorage.getItem('UserInfo');
      if (userLocal) {
        this.user = JSON.parse(localStorage.getItem('UserInfo') || '');
      } else {
        // If can't get user info, redirect to home page
        this.router.navigate(['/']);
      }
    }
  }

  // Config on init
  initForm(): void {
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    this.settingUserInfo();

    const coursesFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        this.coursesFree = res.data;
        this.courseService.listcoursesPro = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const cartSub$ = this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
        if (this.cart) {
          this.totalAmountBeforeApplyVoucher = this.cart.amount;
          if (this.cart.items.length === 0) {
            this.removeVoucher();
          }
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const getAllVoucherSubs$ = this.voucherService.getAllVouchers().subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.vouchers = res.data;
        }
      },
    });
    this.subscriptions.push(coursesFreeSub$);
    this.subscriptions.push(cartSub$);
    this.subscriptions.push(getAllVoucherSubs$);
  }

  applyVoucher(code: string) {
    if (this.cart && this.cart.items.length > 0) {
      const applyVoucherSub$ = this.voucherService
      .applyVoucherToCart(code)
      .subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.voucherDetail = res.data;
            if (this.voucherDetail && this.cart) {
              this.voucherCode = this.voucherDetail.code;
              this.isApplyVoucher = true;
              this.errorVoucher = false;
              this.totalAmountBeforeApplyVoucher =
                this.cart.amount - this.voucherDetail.discount_amount;
            }
          }
        },
        error: (err: Error) => {
          console.log(err);
          this.errorVoucher = true;
          this.isApplyVoucher = false;
          this.voucherDetail = undefined;
          if (this.cart) {
            this.totalAmountBeforeApplyVoucher = this.cart.amount;
          }
        },
      });
    this.subscriptions.push(applyVoucherSub$);
    } else {
      this.dialogBroadcastService.broadcastDialog({
        header: 'Giỏ hàng',
        message: 'Giỏ hàng của bạn đang trống',
        type: 'info',
        display: true,
      });
    }
  }

  removeVoucher() {
    if (this.cart) {
      this.isApplyVoucher = false;
      this.voucherCode = '';
      this.totalAmountBeforeApplyVoucher = this.cart.amount || 0;
      this.voucherDetail = undefined;
    }
  }

  // Hàm xử lý xóa course trong giỏ hàng
  handleRemoveFromCart(courseId: string) {
    if (localStorage !== undefined) {
      if (!localStorage.getItem('isLogin')) {
        this.sharedService.turnOnSignInDialog();
      } else {
        if (courseId && this.cart && this.cart._id) {
          const deleteItemCartSub$ = this.cartService
            .deleteItemCart(courseId, this.cart._id)
            .subscribe({
              next: (res: any) => {
                if (res.status === 201) {
                  this.dialogBroadcastService.broadcastDialog({
                    header: 'Giỏ hàng',
                    message: 'Xóa khóa học thành công',
                    type: 'success',
                    display: true,
                  });
                  this.sharedService.isUpdateCartItem();
                  this.initForm();
                 
                }
              }, error: (err: any) => {
                this.dialogBroadcastService.broadcastDialog({
                  header: 'Giỏ hàng',
                  message: 'Xóa khóa học thất bại',
                  type: 'error',
                  display: true,
                });
              }
            });
          this.subscriptions.push(deleteItemCartSub$);
        }
      }
    }
  }

}
