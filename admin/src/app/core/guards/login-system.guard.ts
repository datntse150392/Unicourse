import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginSystemGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (localStorage === undefined) {
    router.navigate(['/auth/login']);
    return false; // Prevent navigation
  } else {
    const isLoginStr: string | null = localStorage.getItem('isLogin');
    let user: any | null = localStorage.getItem('UserInfo');

    if (user !== null) {
      try {
        user = JSON.parse(user);
        if (user === null || user.role !== 'admin') {
          console.log("USER: ", user[0])
          router.navigate(['/auth/login']);
          return false; // Prevent navigation
        }
      } catch (error) {
        console.error('Error parsing "user" value from localStorage:', error);
        router.navigate(['/auth/login']);
        return false; // Prevent navigation
      }
    }

    if (isLoginStr === null) {
      router.navigate(['/auth/login']);
      return false; // Prevent navigation
    }

    let isLogin: boolean;
    try {
      isLogin = JSON.parse(isLoginStr);
    } catch (error) {
      console.error('Error parsing "isLogin" value from localStorage:', error);
      router.navigate(['/auth/login']);
      return false; // Prevent navigation
    }

    if (isLogin !== true) {
      router.navigate(['/auth/login']);
      return false; // Prevent navigation
    }
  }
  return true;
};
