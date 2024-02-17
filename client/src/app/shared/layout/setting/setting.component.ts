import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../cores/models';
import { FooterComponent } from '../../components';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService, SharedService } from '../../../cores/services';
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [SharedModule, FooterComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  Logo: string = environment.LOGO;
  user!: User;
  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.initForm();

    this.sharedService.isUpdateUser$.subscribe({
      next: (res: any) => {
        if (res === true) {
          this.initForm();
        }
      },
    });
  }

  initForm() {
    if (localStorage !== undefined) {
      const user = localStorage.getItem('UserInfo');
      if (user !== null) {
        this.user = JSON.parse(user);
        this.configItemMenu();
      }
    }
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
          {
            label: 'Giỏ hàng',
            command: () => {
              this.redirectToCart();
            },
          },
        ],
      },
      {
        label: 'Cài đặt',
        items: [
          {
            label: 'Cài đặt',
            command: () => {
              this.redirectToSettingPersonal();
            },
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
    window.location.reload();
  }

  redirectToProfile() {
    this.router.navigate([`/profile/${this.user._id}`]);
  }

  redirectToCart() {
    this.router.navigate([`profile/${this.user?._id}/cart`]);
  }

  redirectToSettingPersonal() {
    this.router.navigate([`/setting/personal`]);
  }
}
