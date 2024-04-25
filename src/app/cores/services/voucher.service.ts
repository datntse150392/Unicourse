import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({ providedIn: 'root' })
export class VoucherService {
  constructor(private httpClient: HttpClient) {}

  // Lấy tất cả voucher
  getAllVouchers() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/voucher`)
      .pipe(catchError(this.handleError));
  }

  // Áp dụng voucher cho giỏ hàng
  applyVoucherToCart(code: string) {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/voucher?code=${code}`)
      .pipe(catchError(this.handleError));
  }

  // Xử lí khi có lỗi
  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
