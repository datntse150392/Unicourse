import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if ([401, 403].includes(error.status)) {
        console.log('Unauthorized request');
      } else if ([404].includes(error.status)) {
        console.log('Not found');
      } else if ([500].includes(error.status)) {
        console.log('Internal server error');
      }
      const e = error.error.message || error.statusText;
      console.error(e);
      return throwError(() => new Error(error));
    })
  );
};
