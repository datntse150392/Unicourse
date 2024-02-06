import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { CartItemComponent } from './cart-item/cart-item.component';
import { User } from '../../cores/models';
import { Cart, UserInfo, CartItem } from '../../cores/models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent, CartItemComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit, OnDestroy {
  user: User | undefined;
  cart: Cart | undefined;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.settingUserInfo();

    // Fake data to display
    this.fakeData();
  }

  ngOnDestroy(): void { }

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

  fakeData() {
    this.cart = {
      _id: "65c2132877474f8ebdfd2b9a",
      user_id: {
        _id: "65b646dade16088a25a41d68",
        email: "khainhse161766@fpt.edu.vn"
      },
      amount: 0,
      items: [
        {
          _id: "65a8790ba30979a347d026c9",
          title: "Khóa học CSI104",
          amount: 0,
          thumbnail: "https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Course%2FCSI.jpg?alt=media&token=205ce9a1-47b3-4a72-b186-3318851262ec"
        },
        {
          _id: "65a878bfa30979a347d026c6",
          title: "Khóa học JPD123",
          amount: 0,
          thumbnail: "https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Course%2FJPD123.jpg?alt=media&token=d212132b-28f3-4b7b-821b-d199420265d2"
        },
        {
          _id: "65a8791ea30979a347d026ca",
          title: "Khóa học PRF192",
          amount: 0,
          thumbnail: "https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Course%2FPRF192.jpg?alt=media&token=884d2ceb-8c73-4cee-ba9b-c8cc113cd7be"
        }
      ],
      created_at: new Date("2024-01-25T07:21:01.746Z"),
      updated_at: new Date("2024-01-25T07:21:01.746Z")
    }
  }
}
