import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  User,
} from '@angular/fire/auth';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

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

  // doRegister(email: string, password: string) {
  //   return this.afAuth.createUserWithEmailAndPassword(email, password);
  // }

  // doLogin(email: string, password: string) {
  //   return this.afAuth.signInWithEmailAndPassword(email, password);
  // }

  doLogout() {
    // Đăng xuất thì xóa hết dữ liệu trong localStorage
    localStorage.clear();

    // Đăng xuất khỏi firebase
    return this.afAuth.signOut();
  }

  //
  authLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
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
}
