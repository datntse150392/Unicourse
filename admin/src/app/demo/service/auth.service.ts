import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  // Dùng để gọi hàm setting localStorage khi đăng nhập
  private settingLocal = new BehaviorSubject<boolean>(false);
  settingLocal$ = this.settingLocal.asObservable();

  constructor(public afAuth: AngularFireAuth, private httpClient: HttpClient) {}

  // Đăng nhập bằng tài khoản google
  doGoogleLogin() {
    return this.authLogin(new GoogleAuthProvider());
  }

  doLogout() {
    // Đăng xuất khỏi firebase
    localStorage.removeItem('access_token');
    return this.afAuth.signOut();
  }

  private authLogin(provider: any): any {
    return this.afAuth
      .signInWithPopup(provider)
      .then(() => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  checkLogin(): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  // Call API Login
  signIn(
    email: string,
    fullName: string,
    profileImage: string
  ): Observable<any> {
    const body = { email, fullName, profileImage };
    return this.httpClient.post(`${environment.baseUrl}/api/auth/signUp`, body)
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }

  settingLocalStorage() {
    this.settingLocal.next(true);
  }
}
