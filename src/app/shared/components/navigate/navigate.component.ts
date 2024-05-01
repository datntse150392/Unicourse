import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { Cart, User } from '../../../cores/models';
import { Subscription } from 'rxjs';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import {
  AuthService,
  CartService,
  CourseService,
} from '../../../cores/services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { ChatRoomService } from '../../../cores/services/chatRoom.service';
import { DialogBroadcastService } from '../../../cores/services/dialog-broadcast.service';
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
  toggleMenu: boolean = false;
  subscriptions: Subscription[] = [];
  public lengthOfCartItems = 0;
  public cart!: Cart;
  public updateCartSub$: Subscription | undefined;
  items1: MegaMenuItem[] | undefined;

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private chatRoomService: ChatRoomService,
    private readonly dialogBroadcastService: DialogBroadcastService,
    private readonly courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.settingUserInfo();
    this.configItemMenu();
    this.initForm();
    // Lắng nghe sự kiện cập nhật giỏ hàng
    this.updateCartSub$ = this.sharedService.isUpdateCart$.subscribe(
      (res: boolean) => {
        if (res === true) {
          this.initForm();
        }
      }
    );

    this.items1 = [
      {
        label: 'Danh mục',
        items: [
          [
            {
              label: 'Chuyên Ngành 1',
              items: [
                { label: 'CSI104', command: () => this.goToCourse('CSI104') },
                { label: 'PRF192', command: () => this.goToCourse('PRF192') },
                { label: 'MAE101', command: () => this.goToCourse('MAE101') },
                { label: 'CEA201', command: () => this.goToCourse('CEA201') },
              ],
            },
            {
              label: 'Chuyên Ngành 2',
              items: [
                { label: 'PRO192', command: () => this.goToCourse('PRO192') },
                { label: 'MAD101', command: () => this.goToCourse('MAD101') },
                { label: 'OSG202', command: () => this.goToCourse('OSG202') },
                { label: 'SSG104', command: () => this.goToCourse('SSG104') },
              ],
            },
            {
              label: 'Chuyên Ngành 3',
              items: [
                { label: 'JPD113', command: () => this.goToCourse('JPD113') },
                { label: 'CSD201', command: () => this.goToCourse('CSD201') },
                { label: 'DBI202', command: () => this.goToCourse('DBI202') },
                { label: 'LAB211', command: () => this.goToCourse('LAB211') },
              ],
            },
          ],
          [
            {
              label: 'Chuyên Ngành 4',
              items: [
                { label: 'JPD123', command: () => this.goToCourse('JPD123') },
                { label: 'IOT102', command: () => this.goToCourse('IOT102') },
                { label: 'PRJ301', command: () => this.goToCourse('PRJ301') },
                { label: 'MAS291', command: () => this.goToCourse('MAS291') },
              ],
            },
            {
              label: 'Chuyên Ngành 5',
              items: [
                { label: 'SWR302', command: () => this.goToCourse('SWR302') },
                { label: 'SWT301', command: () => this.goToCourse('SWT301') },
                { label: 'PRJ301', command: () => this.goToCourse('PRJ301') },
                { label: 'SWP391', command: () => this.goToCourse('SWP391') },
              ],
            },
            {
              label: 'Chuyên Ngành 7',
              items: [
                { label: 'SWD392', command: () => this.goToCourse('SWD392') },
                { label: 'ISC301', command: () => this.goToCourse('ISC301') },
                { label: 'PRM392', command: () => this.goToCourse('PRM392') },
                { label: 'SDN301m', command: () => this.goToCourse('SDN301') },
              ],
            },
          ],
          [
            {
              label: 'Chuyên Ngành 8-9',
              items: [
                { label: 'MMA301', command: () => this.goToCourse('MMA301') },
                { label: 'MLN111', command: () => this.goToCourse('MLN111') },
                { label: 'MLN122', command: () => this.goToCourse('MLN122') },
                { label: 'HCM202', command: () => this.goToCourse('HCM202') },
                { label: 'MLN131', command: () => this.goToCourse('MLN131') },
                { label: 'VNR202', command: () => this.goToCourse('VNR202') },
              ],
            },
          ],
        ],
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    if (this.updateCartSub$) {
      this.updateCartSub$.unsubscribe();
    }
  }

  initForm() {
    const cartSub$ = this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;

        if (this.cart) {
          this.lengthOfCartItems = this.cart.items ? this.cart.items.length : 0;
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.subscriptions.push(cartSub$);
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
          {
            label: 'UNI Point',
            command: () => {
              this.redirectToUniCoin();
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
    this.router.navigate([`/profile/${this.user?._id}`]);
  }

  redirectToCart() {
    this.router.navigate([`profile/${this.user?._id}/cart`]);
  }

  redirectToSettingPersonal() {
    this.router.navigate([`/setting/personal`]);
  }

  redirectToUniCoin() {
    this.router.navigate([`uni-coins`]);
  }

  // Lắng nghe sự kiện gia nhập phòng chat - Đây là sự kiện socket.io
  joinRoom(roomId: string) {
    if (roomId && this.user) {
      const checkUserInChatRoomSub$ = this.chatRoomService
        .checkUserInChatRoom(roomId)
        .subscribe({
          next: (res: any) => {
            if (res && res.data === true) {
              this.router.navigate([`/chat-room/${roomId}`]);
            } else {
              const joinChatRoomSub$ = this.chatRoomService
                .joinChatRoom(roomId)
                .subscribe({
                  next: (res: any) => {
                    if (res && res.status === 200) {
                      this.router.navigate([`/chat-room/${roomId}`]);
                    }
                  },
                });
              this.subscriptions.push(joinChatRoomSub$);
            }
          },
        });
      this.subscriptions.push(checkUserInChatRoomSub$);
      this.router.navigate([`/chat-room/${roomId}`]);
    } else {
      this.sharedService.turnOnSignInDialog();
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  // Chuyển trang đến khóa học
  goToCourse(title: string): void {
    const getCourseByTitleSub$ = this.courseService
      .getCourseByTitle(title)
      .subscribe({
        next: (res: any) => {
          const result = res.data;
          if (res.status === 200 && result && result._id) {
            // Check user nếu đã đăng ký khóa học thì chuyển trang đến khóa học
            if (this.user && this.user._id) {
            }
            this.router.navigate([`/course`, result._id]);
          }
        },
        error: (err: any) => {
          console.log(err);
          this.dialogBroadcastService.broadcastDialog({
            header: 'Thông báo',
            message:
              'Khóa học đang trong quá trình phát triển, vui lòng quay lại sau!',
            type: 'info',
            display: true,
          });
        },
      });
    this.subscriptions.push(getCourseByTitleSub$);
  }
}
