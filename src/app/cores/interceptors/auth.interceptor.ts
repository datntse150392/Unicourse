import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`Request is on its way to ${req.url}`);
  const token = localStorage && localStorage.getItem('access_token');
  // If a token exists in localStorage, add it to the Authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Fix the quotes here
      },
    });
    return next(authReq);
  }
  return next(req);
};
