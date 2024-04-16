import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { Cart, User } from '../../../cores/models';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService, CartService } from '../../../cores/services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { ChatRoomService } from '../../../cores/services/chatRoom.service';
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
  public lengthOfCartItems = 0;
  public cart!: Cart;
  public updateCartSub$: Subscription | undefined;

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private chatRoomService: ChatRoomService
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
        this.lengthOfCartItems = this.cart.items.length || 0;
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
            label: 'Uni Coin',
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
}
