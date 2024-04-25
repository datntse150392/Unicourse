import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SharedService } from '../services';

export const loginSystemGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const sharedService: SharedService = inject(SharedService);
  if (localStorage === undefined) {
    sharedService.turnOnSignInDialog();
    router.navigate(['/']);
  } else {
    const isLoginStr: string | null = localStorage.getItem('isLogin');
    if (isLoginStr === null) {
      sharedService.turnOnSignInDialog();
      router.navigate(['/']);
      return false; // Prevent navigation
    }

    let isLogin: boolean;
    try {
      isLogin = JSON.parse(isLoginStr);
    } catch (error) {
      console.error('Error parsing "isLogin" value from localStorage:', error);
      sharedService.turnOnSignInDialog();
      router.navigate(['/']);
      return false; // Prevent navigation
    }

    if (isLogin !== true) {
      sharedService.turnOnSignInDialog();
      router.navigate(['/']);
      return false; // Prevent navigation
    }
  }
  return true;
};
