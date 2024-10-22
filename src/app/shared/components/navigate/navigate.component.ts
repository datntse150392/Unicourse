import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
import { Blog, Cart, Course, Quiz, User } from '../../../cores/models';
import { Subscription } from 'rxjs';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import {
  AuthService,
  CartService,
  CoinService,
  CommonService,
} from '../../../cores/services';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { ChatRoomService } from '../../../cores/services/chatRoom.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

interface DataSearch {
  course: [Course];
  quiz: [Quiz];
  blog: [Blog];
}

@Component({
  selector: 'app-navigate',
  standalone: true,
  imports: [AvatarModule, SharedModule],
  templateUrl: './navigate.component.html',
  styleUrl: './navigate.component.scss',
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavigateComponent implements OnInit, OnDestroy {
  @ViewChild('searchForm') searchForm!: OverlayPanel;

  public Logo: string = environment.LOGO;
  public items: MenuItem[] | undefined;
  public user: User | undefined;
  public toggleMenu: boolean = false;
  public subscriptions: Subscription[] = [];
  public lengthOfCartItems = 0;
  public cart!: Cart;
  public updateCartSub$: Subscription | undefined;
  public items1: MegaMenuItem[] | undefined;
  public totalCoin: number = 0;
  public searchText: string = '';
  public dataSearch!: DataSearch;

  public isToggle: boolean = false;

  constructor(
    private sharedService: SharedService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private chatRoomService: ChatRoomService,
    private readonly coinService: CoinService,
    private readonly commonService: CommonService
  ) {}

  ngOnInit(): void {
    // Định nghĩa custom element cho lord-icon
    defineElement(lottie.loadAnimation);

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
    this.retrieveUserCart();

    // Lắng nghe sự kiện cập nhật cart
    this.sharedService.isRetrieveCart$.subscribe({
      next: (res: boolean) => {
        if (res === true) {
          this.retrieveUserCart();
        }
      },
    });

    // Lấy tổng số coin
    const getTotalCoinSub$ = this.coinService.getTotalCoinByUserId().subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.totalCoin = res.data;
        }
      },
    });
    this.subscriptions.push(getTotalCoinSub$);
  }

  retrieveUserCart() {
    const retrieveUserCartSub$ = this.cartService.getCart().subscribe({
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
    this.subscriptions.push(retrieveUserCartSub$);
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
            label: 'Lịch sử Point',
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
    this.router.navigate(['/']);
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

  redirectToFlashcard() {
    this.router.navigate([`flashcard`]);
  }

  redirectToDepositPoint() {
    this.router.navigate(['coin-banking']);
  }

  redirectToWriteBlog() {
    this.router.navigate(['new-post']);
  }

  redirectToHistoryPoint() {
    this.router.navigate(['uni-coins']);
  }

  redirectToTransactionHistory() {
    this.router.navigate(['transaction-history']);
  }

  redirectToContactPage() {
    this.router.navigate(['contact-page']);
  }

  redirectToAboutUs() {
    this.router.navigate(['about-us']);
  }

  // Lắng nghe sự kiện gia nhập phòng chat - Đây là sự kiện socket.io
  joinRoom(roomId: string) {
    if (roomId && this.user) {
      const checkUserInChatRoom$ =
        this.chatRoomService.checkUserInChatRoom(roomId);

      const subscription = checkUserInChatRoom$
        .pipe(
          switchMap((res: any) => {
            if (res && res.status === 200 && res.data === false) {
              return this.chatRoomService.joinChatRoom(roomId);
            } else if (res && res.status === 200 && res.data === true) {
              this.router.navigate([`/chat-room/${roomId}`]);
              return of(null); // Return an empty observable if no need to join room
            } else {
              return of(null); // Return an empty observable for any other cases
            }
          }),
          catchError((err: any) => {
            console.log(err);
            return of(null); // Handle error and return an empty observable
          })
        )
        .subscribe((res: any) => {
          if (res && res.status === 200) {
            this.router.navigate([`/chat-room/${roomId}`]);
          }
        });

      this.subscriptions.push(subscription);
    } else {
      this.sharedService.turnOnSignInDialog();
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  // Chuyển trang đến khóa học
  goToCourse(id: string): void {
    this.router.navigate([`/course`, id]);
  }

  // Chuyển trang đến khóa học
  goToBlogDetail(id: string): void {
    this.router.navigate([`/blog`, id]);
  }

  toggleOverlayForSearch(event: Event) {
    if (this.searchText === '') {
      this.searchForm.toggle(event);
    } else if (!this.searchForm.overlayVisible) {
      this.searchForm.show(event);
    }

    const searchAllSub$ = this.commonService
      .searchAll(this.searchText)
      .subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.dataSearch = res.data;
          }
        },
        error: (err: Error) => {
          console.log(err);
        },
      });
    this.subscriptions.push(searchAllSub$);
  }
}
