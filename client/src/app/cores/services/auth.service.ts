import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  User,
} from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private httpClient: HttpClient) {}

  // Đăng nhập bằng tài khoản facebook
  doFacebookLogin() {
    return this.authLogin(new FacebookAuthProvider());
  }

  // Đăng nhập bằng tài khoản google
  doGoogleLogin() {
    return this.authLogin(new GoogleAuthProvider());
  }

  // Đăng nhập bằng tài khoản github
  doGitHubLogin() {
    return this.authLogin(new GithubAuthProvider());
  }

  doLogout() {
    // Đăng xuất khỏi firebase
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
    return this.httpClient.post(`${environment.baseUrl}/api/auth/signUp`, body);
  }

  // Call API kiểm tra xem user đã đăng ký khóa học chưa
  checkUserRegisterCourse(userId: string, courseId: string): Observable<any> {
    const body = { userId, courseId };
    return this.httpClient
      .post(`${environment.baseUrl}/api/user/checkUserRegisterCourse`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
