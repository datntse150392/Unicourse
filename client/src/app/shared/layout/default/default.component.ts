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
import { AuthService } from '../../../cores/services';
import { DialogBroadcastService } from '../../../cores/services/dialog-broadcast.service';
import { environment } from '../../../../environments/environment.development';

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

  private subScriptions: Subscription[] = [];
  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    private dialogBroadcastService: DialogBroadcastService
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
  }

  ngOnDestroy(): void {
    // Unsubscribe tất cả các subscription
    this.subScriptions.forEach((sub) => sub.unsubscribe());
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
                const token = res && res.data.access_token.split(' ')[1];
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
}
