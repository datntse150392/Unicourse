import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CourseService } from '../services';
import { User } from '../models';

export const viewCouruseDetailGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const courseService: CourseService = inject(CourseService);
  const { id } = route.params;
  if (localStorage !== undefined) {
    const tempInfo = localStorage.getItem('UserInfo');
    if (tempInfo) {
      const UserInfo: User = JSON.parse(tempInfo || '');
      const userId = UserInfo._id;
      courseService.getMyCourses(userId).subscribe({
        next: (res: any) => {
          var course = res.data.find((item: any) => item.course._id === id);
          if (course) {
            router.navigate([
              `/learning-course`,
              id,
              course.trackProgress[0].subTrackProgress[0].subTrackId
                .content_url,
            ]);
          }
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }
  return true;
};
