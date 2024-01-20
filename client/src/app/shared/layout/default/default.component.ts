import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '../../components';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../cores/models/index';

import {
  AngularFireAuthModule,
  AngularFireAuth,
} from '@angular/fire/compat/auth';
import { AuthService } from '../../../cores/services';

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
  ],
  providers: [AuthService],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent implements OnInit, OnDestroy {
  visibleSignIn: boolean = false;
  visibleSignUp: boolean = false;
  helper = new JwtHelperService();
  user!: User;

  private subScriptions: Subscription[] = [];
  constructor(
    private sharedService: SharedService,
    public authService: AuthService,
    public afAuth: AngularFireAuth
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
            email: user.uid + '@gmail.com',
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
}
