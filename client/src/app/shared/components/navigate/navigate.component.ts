import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { User } from '../../../cores/models';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../../cores/services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-navigate',
  standalone: true,
  imports: [AvatarModule, SharedModule],
  templateUrl: './navigate.component.html',
  styleUrl: './navigate.component.scss',
  providers: [MessageService],
})
export class NavigateComponent implements OnInit, OnDestroy {
  Logo: string = environment.LOGO;
  items: MenuItem[] | undefined;
  user: User | undefined;
  subscriptions: Subscription[] = [];

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.settingUserInfo();
    this.configItemMenu();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  configItemMenu() {
    this.items = [
      {
        label: 'Tài khoản',
        items: [
          {
            label: 'Trang cá nhân',
            command: () => {
              this.redirectToProfile();
            },
          },
        ],
      },
      {
        label: 'Cài đặt',
        items: [
          {
            label: 'Cài đặt',
            url: 'http://angular.io',
          },
          {
            label: 'Đăng xuất',
            command: () => {
              this.logout();
            },
          },
        ],
      },
    ];
  }

  logout() {
    this.authService.doLogout();
    // Đăng xuất thì xóa hết dữ liệu trong localStorage
    localStorage.clear();
    this.user = undefined;
    window.location.reload();
  }
  settingUserInfo() {
    if (typeof localStorage !== 'undefined') {
      // Use localStorage here
      // Example: localStorage.setItem('key', 'value');
      const userLocal = localStorage.getItem('UserInfo');
      if (userLocal) {
        this.user = JSON.parse(localStorage.getItem('UserInfo') || '');
      }
    }

    const settingLocalSub = this.sharedService.settingLocal$.subscribe({
      next: (res: boolean) => {
        if (res === true) {
          this.user = JSON.parse(localStorage.getItem('UserInfo') || '');
          this.messageService.add({
            severity: 'success',
            summary: 'Đăng nhập',
            detail: 'Đăng nhập tài khoản thành công',
          });
        }
      },
    });
    this.subscriptions.push(settingLocalSub);
  }

  openDialogSignUp() {
    this.sharedService.turnOnSignUpDialog();
    this.sharedService.turnOffSignInDialog();
  }
  openDialogSignIn() {
    this.sharedService.turnOnSignInDialog();
    this.sharedService.turnOffSignUpDialog();
  }

  redirectToProfile() {
    // Navigate without updating the URL
    this.router.navigate([`/profile/${this.user?._id}`], {
      skipLocationChange: true,
    });
  }
}
