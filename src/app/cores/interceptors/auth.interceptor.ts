import { HttpInterceptorFn } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '../services';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  console.log(`Request is on its way to ${req.url}`);
  const token = localStorage && localStorage.getItem('access_token');

  if (token) {
    try {
      const decodedToken: any = jwt_decode.jwtDecode(token);
      // Kiểm tra nếu token đã hết hạn
      if (decodedToken.exp * 1000 < Date.now()) {
        authService.doLogout();
        // Đăng xuất thì xóa hết dữ liệu trong localStorage
        localStorage.clear();
        window.location.reload();
        return next(req); // Dừng xử lý yêu cầu tiếp theo vì trang sẽ reload
      }

      // Nếu token hợp lệ, thêm vào header Authorization
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    } catch (error) {
      console.error('Error decoding token', error);
      localStorage.clear();
      window.location.reload();
      return next(req);
    }
  } else {
    localStorage.clear();
    window.location.reload();
    return next(req);
  }
};
