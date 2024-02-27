import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({ providedIn: 'root' })
export class TransactionService {
  constructor(private httpClient: HttpClient) {}

  // Thực hiện việc thanh toán với hình thức là PayPal
  payWithPaypal(
    payer: Object,
    cart_id: string,
    payment_method: string,
    total_new_amount: number,
    voucher_id: string | null,
    status: string,
    transaction_code: string
  ) {
    const body = {
      payer,
      cart_id,
      payment_method,
      total_new_amount,
      voucher_id,
      status,
      transaction_code,
    };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/transactions/pay`, body)
      .pipe(catchError(this.handleError));
  }

  // Xử lí khi có lỗi
  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
