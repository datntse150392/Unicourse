import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loginSystemGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  console.log('loginSystemGuard', localStorage.getItem('isLogin'));
  if (localStorage === undefined) {
    router.navigate(['/auth/login']);
  } else {
    const isLoginStr: string | null = localStorage.getItem('isLogin');
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
