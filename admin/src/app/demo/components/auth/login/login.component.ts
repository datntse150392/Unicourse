import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { User } from 'src/app/demo/api/user';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService, ConfirmationService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    user!: User;
    password!: string;
    helper = new JwtHelperService();
    private subScriptions: Subscription[] = [];

    constructor(
        public layoutService: LayoutService,
        public messageService: MessageService,
        public authService: AuthService,
        public afAuth: AngularFireAuth,
        public router: Router
    ) {
        // Thiết lập title cho trang
        window.document.title = 'Đăng nhập Unicourse';
        // Scroll smooth to top lên đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                      this.authService.settingLocalStorage();
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Đăng nhập thành công',
                        detail: 'Chào mừng bạn đến với Unicourse',
                      });
                      this.router.navigate(['/']);
                    }
                  },
                  (error) => {
                    // Phát thông tin dialog đăng nhập không thành công
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Lỗi đăng nhập',
                      detail: 'Yêu cầu đăng nhập với mail @fpt.edu.vn',
                    });
                  }
                );
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
}
