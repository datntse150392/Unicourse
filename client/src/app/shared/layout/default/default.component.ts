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

  private subScriptions: Subscription[] = [];
  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public afAuth: AngularFireAuth,
    private dialogBroadcastService: DialogBroadcastService,
    private readonly newFeedService: NewFeedService
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
}
