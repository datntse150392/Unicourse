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
import {
  IPayPalConfig,
  ICreateOrderRequest,
  NgxPayPalModule,
} from 'ngx-paypal';
import { TransactionService } from '../../cores/services/transaction.service';
import {
  PaymentMethod,
  StatusOfPayment,
} from '../../cores/models/transaction.model';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    SharedModule,
    HeaderComponent,
    CartItemComponent,
    ListRelatedCourseComponent,
    NgxPayPalModule,
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
  public payPalConfig?: IPayPalConfig;
  public isProgressSpinner: boolean = false;
  public blockedUI: boolean = false;

  private subscriptions: Subscription[] = [];
  constructor(
    private courseService: CourseService,
    private cartService: CartService,
    private router: Router,
    private sharedService: SharedService,
    private dialogBroadcastService: DialogBroadcastService,
    private voucherService: VoucherService,
    private readonly transactionService: TransactionService
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

  // Function to convert from VND to EUR
  convertVNDtoEUR(amountInVND: number, exchangeRate: number) {
    return amountInVND / exchangeRate;
  }

  // Function to convert from EUR to VND
  convertEURtoVND(amountInEUR: number, exchangeRate: number) {
    return amountInEUR * exchangeRate;
  }

  // Mã giao dịch (transaction code) thường được sử dụng để định danh một giao dịch cụ thể hoặc một loạt các giao dịch liên quan đến nhau
  generateTransactionCode(length: number): string {
    const prefix = 'UNC';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let transactionCode = prefix;
    const remainingLength = length - prefix.length; // Tính toán độ dài còn lại sau khi trừ đi độ dài của prefix
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      transactionCode += characters[randomIndex];
    }
    return transactionCode;
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

          // Config paypal
          this.configPaypal(this.totalAmountBeforeApplyVoucher);
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

  configPaypal(totalAmountBeforeApplyVoucher: number) {
    // Config giá tiền
    // Số tiền thanh toán trong VND
    // Tỉ giá hối đoái từ VND sang EUR (ví dụ)
    const exchangeRate = 25000;

    // Chuyển đổi số tiền sang EUR
    const amountInEUR = this.convertVNDtoEUR(
      totalAmountBeforeApplyVoucher,
      exchangeRate
    );
    console.log('amountInEUR ===>', amountInEUR);
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data: any) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: amountInEUR.toFixed(2), // Giữ hai chữ số thập phân
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: amountInEUR.toFixed(2),
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: amountInEUR.toFixed(2),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data: any, actions: any) => {
        // Block UI
        this.blockedUI = true;
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
          try {
            if (this.cart) {
              // Tạo mã giao dịch ngẫu nhiên
              const transactionCodeLength = Math.floor(Math.random() * 3) + 8; // Độ dài ngẫu nhiên từ 8 đến 10
              const transactionCode = this.generateTransactionCode(
                transactionCodeLength
              );

              // Tạo object thanh toán
              const paymentObject = {
                cart_id: this.cart._id,
                total_new_amount: this.totalAmountBeforeApplyVoucher,
                voucher_id: this.voucherDetail ? this.voucherDetail._id : null,
              };

              console.log('paymentObject ===>', paymentObject);
              console.log('transactionCode ===>', transactionCode);

              // Xử lí việc call API thanh toán
              const payWithPaypalSub$ = this.transactionService
                .payWithPaypal(
                  details.payer,
                  paymentObject.cart_id,
                  PaymentMethod.PAYPAL,
                  paymentObject.total_new_amount,
                  paymentObject.voucher_id,
                  StatusOfPayment.SUCCESS,
                  transactionCode
                )
                .subscribe({
                  next: (res: any) => {
                    if (res.status === 201) {
                      // Unblock UI
                      this.blockedUI = false;
                      this.dialogBroadcastService.broadcastDialog({
                        header: 'Thanh toán',
                        message: 'Thanh toán thành công',
                        type: 'success',
                        display: true,
                      });
                      // Redirect to home page
                      this.router.navigate(['/']);
                    }
                  },
                  error: (err: any) => {
                    this.dialogBroadcastService.broadcastDialog({
                      header: 'Thanh toán',
                      message: 'Thanh toán thất bại',
                      type: 'error',
                      display: true,
                    });
                  },
                });
              this.subscriptions.push(payWithPaypalSub$);
            }
          } catch (error) {
            console.error(error);
          }
        });
      },
      onClientAuthorization: (data: any) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
      },
      onCancel: (data: any, actions: any) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err: any) => {
        console.log('OnError', err);
      },
      onClick: (data: any, actions: any) => {
        console.log('onClick', data, actions);
      },
    };
  }

  applyVoucher(code: string) {
    if (this.cart && this.cart.items.length > 0) {
      this.isProgressSpinner = true;
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
                this.isProgressSpinner = false;

                // Config paypal when apply voucher
                this.configPaypal(this.totalAmountBeforeApplyVoucher);
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
}
