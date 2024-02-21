import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SharedService {
  // Dùng để hiển thị dialog đăng nhập
  private turnOnSignIn = new BehaviorSubject<boolean>(false);
  turnOnSignIn$ = this.turnOnSignIn.asObservable();

  // Dùng để hiển thị dialog đăng ký
  private turnOnSignUp = new BehaviorSubject<boolean>(false);
  turnOnSignUp$ = this.turnOnSignUp.asObservable();

  // Dùng để gọi hàm setting localStorage khi đăng nhập
  private settingLocal = new BehaviorSubject<boolean>(false);
  settingLocal$ = this.settingLocal.asObservable();

  // Dùng để gửi thông báo khi cập nhật thông tin user
  private isUpdateUser = new BehaviorSubject<boolean>(false);
  isUpdateUser$ = this.isUpdateUser.asObservable();

  // Dùng để gửi thông báo khi cập nhật giỏ hàng
  private isUpdateCart = new BehaviorSubject<boolean>(false);
  isUpdateCart$ = this.isUpdateCart.asObservable();

  constructor() {}

  turnOnSignInDialog() {
    this.turnOnSignIn.next(true);
  }

  turnOffSignInDialog() {
    this.turnOnSignIn.next(false);
  }

  turnOnSignUpDialog() {
    this.turnOnSignUp.next(true);
  }

  turnOffSignUpDialog() {
    this.turnOnSignUp.next(false);
  }

  settingLocalStorage() {
    this.settingLocal.next(true);
  }

  isUpdateUserInfo() {
    this.isUpdateUser.next(true);
  }

  isUpdateCartItem() {
    this.isUpdateCart.next(true);
  }
}
