import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { CartItemComponent } from './cart-item/cart-item.component';
import { Course, User } from '../../cores/models';
import { Cart, UserInfo, CartItem } from '../../cores/models';
import { Router } from '@angular/router';
import { ListRelatedCourseComponent } from './list-related-course/list-related-course.component';
import { Subscription } from 'rxjs';
import { CourseService, CartService } from '../../cores/services';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent, CartItemComponent, ListRelatedCourseComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit, OnDestroy {
  public user: User | undefined;
  public cart: Cart | undefined;
  public coursesFree: Course[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private courseService: CourseService,
    private cartService: CartService,
    private router: Router
  ) {
    // Thiết lặp title cho trang
    window.document.title = 'Unicourse - Nền Tảng Học Tập Trực Tuyến';
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  settingUserInfo() {
    if (typeof localStorage !== 'undefined') {
      // Use localStorage here
      // Example: localStorage.setItem('key', 'value');
      const userLocal = localStorage.getItem('UserInfo');
      if (userLocal) {
        this.user = JSON.parse(localStorage.getItem('UserInfo') || '');
      } else {
        // If can't get user info, redirect to home page
        this.router.navigate(['/']);
      }
    }
  }

  // Config on init
  initForm(): void {
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    this.settingUserInfo();

    const coursesFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        this.coursesFree = res.data;
        this.courseService.listcoursesPro = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const cartSub$ = this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cart = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.subscriptions.push(coursesFreeSub$);
    this.subscriptions.push(cartSub$);
  }
}
