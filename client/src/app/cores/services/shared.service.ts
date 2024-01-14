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

  constructor() {}

  turnOnSignInDialog() {
    this.turnOnSignIn.next(true);
  }

  turnOnSignUpDialog() {
    this.turnOnSignIn.next(true);
  }
}
