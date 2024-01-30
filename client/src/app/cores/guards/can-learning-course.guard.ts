import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { User } from '../models';
export const canLearningCourseGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const { id } = route.params;
  const UserInfo: User = JSON.parse(localStorage.getItem('UserInfo') || '');
  const userId = UserInfo._id;
  const isCheckRegisterCourseSub$ = authService
    .checkUserRegisterCourse(userId, id)
    .subscribe({
      next: (res) => {
        if (res && res.status !== 200) {
          router.navigate(['/']);
        }
      },
      error: () => router.navigate(['/']),
    });
  return true;
};
