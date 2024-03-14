import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '../../components';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../cores/models/index';
import { DialogComponent } from './dialog/dialog.component';
import {
  AngularFireAuthModule,
  AngularFireAuth,
} from '@angular/fire/compat/auth';
import { AuthService, NewFeedService } from '../../../cores/services';
import { DialogBroadcastService } from '../../../cores/services/dialog-broadcast.service';
import { environment } from '../../../../environments/environment.development';
import { NewFeed } from '../../../cores/models/new-feed.model';
import {
  PaymentMethod,
  StatusOfPayment,
} from '../../../cores/models/transaction.model';
import { TransactionService } from '../../../cores/services/transaction.service';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
    SharedModule,
    AngularFireAuthModule,
    DialogComponent,
  ],
  providers: [AuthService],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent implements OnInit, OnDestroy {
  Logo: string = environment.LOGO;
  visibleSignIn: boolean = false;
  visibleSignUp: boolean = false;
  helper = new JwtHelperService();
  user!: User;
  visibleDialogNewFeed: boolean = false;
  public listNewFeeds: NewFeed[] = [];
  public blockedUI: boolean = false;

  private subScriptions: Subscription[] = [];
  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly newFeedService: NewFeedService,
    private readonly transactionService: TransactionService
  ) {}
  ngOnInit(): void {
    // Đăng ký nhận thông báo hiển thị dialog đăng ký
    const turnOnSignInSub = this.sharedService.turnOnSignIn$.subscribe({
      next: (res: boolean) => {
        this.visibleSignIn = res;
      },
      error: (err) => console.log(err),
    });

    // Đăng ký nhận thông báo hiển thị dialog đăng ký
    const turnOnSignUpSub = this.sharedService.turnOnSignUp$.subscribe({
      next: (res: boolean) => {
        this.visibleSignUp = res;
      },
      error: (err) => console.log(err),
    });

    // Lưu các subscription vào mảng để unsubscribe
    this.subScriptions.push(turnOnSignUpSub);
    this.subScriptions.push(turnOnSignInSub);

    this.initForm();
    // Check if url has query params
    if (window.location.href.includes('?vnp_Amount')) {
      this.getResponseFromVnPay();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe tất cả các subscription
    this.subScriptions.forEach((sub) => sub.unsubscribe());
  }

  initForm() {
    const getListNewFeedsSubs$ = this.newFeedService
      .getAllNewFeeds()
      .subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.listNewFeeds = res.data;
          }
        },
      });
    this.subScriptions.push(getListNewFeedsSubs$);
  }

  // Đóng dialog đăng nhập
  closeDialogSignIn() {
    this.visibleSignIn = false;
  }

  // Đóng dialog đăng ký
  closeDialogSignUp() {
    this.visibleSignUp = false;
  }

  // Mở dialog đăng ký
  openDialogSignUp() {
    this.closeDialogSignIn();
    this.visibleSignUp = true;
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin().then(() => {
      const userInfo = this.getCurrentUser();
      if (userInfo) {
        userInfo.then((res) => {
          const userSub$ = this.authService
            .signIn(res.email, res.displayName, res.photoURL)
            .subscribe(
              (res) => {
                if (res.status === 200 || res.status === 201) {
                  const token = res && res.data.access_token.split(' ')[1];
                  // Decode the token
                  const decoded = this.helper.decodeToken(token);
                  this.user = decoded;
                  localStorage.setItem('access_token', token);
                  localStorage.setItem('isLogin', 'true');
                  localStorage.setItem('UserInfo', JSON.stringify(this.user));
                  window.location.reload();
                  this.sharedService.settingLocalStorage();
                  this.closeDialogSignIn();
                  this.closeDialogSignUp();
                }
              },
              (error) => {
                // Phát thông tin dialog đăng nhập không thành công
                this.closeDialogSignIn();
                this.closeDialogSignUp();
                this.dialogBroadcastService.broadcastDialog({
                  header: 'Lỗi đăng nhập',
                  message: 'Yêu cầu đăng nhập với mail @fpt.edu.vn',
                  type: 'error',
                  display: true,
                });
              }
            );
          this.subScriptions.push(userSub$);
        });
      }
    });
  }

  tryGibHubLogin() {
    this.authService.doGitHubLogin().then(() => {
      const userInfo = this.getCurrentUser();
      if (userInfo) {
        userInfo.then((res) => {
          const userSub$ = this.authService
            .signIn(res.email, res.displayName, res.photoURL)
            .subscribe((res) => {
              if (res.status === 200 || res.status === 201) {
                const token = res && res.data.split(' ')[1];
                // Decode the token
                const decoded = this.helper.decodeToken(token);
                this.user = decoded;
                localStorage.setItem('access_token', token);
                localStorage.setItem('isLogin', 'true');
                localStorage.setItem('UserInfo', JSON.stringify(this.user));
                this.sharedService.settingLocalStorage();
                this.closeDialogSignIn();
                this.closeDialogSignUp();
              }
            });
          this.subScriptions.push(userSub$);
        });
      }
    });
  }

  getCurrentUser(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (user) {
        if (user) {
          const userInfo = {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
          resolve(userInfo);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  showDialog() {
    this.visibleDialogNewFeed = true;
  }

  // Hanle time since publication
  publishedAtString(published_at: Date): string {
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

  // Handle get response from VNPAY gateway
  getResponseFromVnPay() {
    const url = window.location.href;
    var payer: { [key: string]: any } = {};
    // Convert url to object
    const urlParams = new URLSearchParams(url);
    //Kiểm tra nếu response trả về từ VNPAY thành công
    if (localStorage !== undefined) {
      this.blockedUI = true;
      if (urlParams.get('vnp_ResponseCode') === '00') {
        let cart_id = localStorage.getItem('cart_id') as string;
        let payment_method = localStorage.getItem('payment_method') as string;
        let total_new_amount = localStorage.getItem('total_new_amount') ?? '0';
        let amount = parseFloat(total_new_amount);
        let voucher_id = localStorage.getItem('voucher_id') as string;
        let transaction_code = localStorage.getItem(
          'transaction_code'
        ) as string;
        payer['vnp_Amount'] = total_new_amount;
        payer['vnp_BankCode'] = urlParams.get('vnp_BankCode');
        payer['vnp_BankTranNo'] = urlParams.get('vnp_BankTranNo');
        payer['vnp_CardType'] = urlParams.get('vnp_CardType');
        payer['vnp_OrderInfo'] = urlParams.get('vnp_OrderInfo');
        payer['vnp_ResponseCode'] = urlParams.get('vnp_ResponseCode');
        payer['vnp_TmnCode'] = urlParams.get('vnp_TmnCode');
        payer['vnp_TransactionNo'] = urlParams.get('vnp_TransactionNo');
        payer['vnp_TransactionStatus'] = urlParams.get('vnp_TransactionStatus');
        payer['vnp_TxnRef'] = urlParams.get('vnp_TxnRef');
        payer['vnp_SecureHash'] = urlParams.get('vnp_SecureHash');
        // Xử lí việc call API thanh toán
        const payWithPaypalSub$ = this.transactionService
          .payWithPaypal(
            payer,
            cart_id,
            payment_method,
            amount,
            voucher_id,
            StatusOfPayment.SUCCESS,
            transaction_code
          )
          .subscribe({
            next: (res: any) => {
              if (res.status === 201) {
                this.blockedUI = false;
                this.clearUrlQueryParams('Thanh toán thành công', 'Thanh toán');
              }
            },
            error: (err: any) => {
              setTimeout(() => {
                this.blockedUI = false;
                this.clearUrlQueryParams('Thanh toán thất bại', 'Thanh toán');
              }, 1000);
            },
          });
        this.subScriptions.push(payWithPaypalSub$);
      } else {
        setTimeout(() => {
          this.blockedUI = false;
          this.clearUrlQueryParams('Thanh toán thất bại', 'Thanh toán');
        }, 1000);
      }
    }
  }

  // Clear url query params && local storage
  clearUrlQueryParams(message: string, header: string) {
    localStorage.removeItem('cart_id');
    localStorage.removeItem('payment_method');
    localStorage.removeItem('total_new_amount');
    localStorage.removeItem('voucher_id');
    localStorage.removeItem('transaction_code');
    window.history.replaceState({}, document.title, 'http://localhost:4200/');
    this.dialogBroadcastService.broadcastDialog({
      header: header,
      message: message,
      type: 'info',
      display: true,
    });
  }
}
