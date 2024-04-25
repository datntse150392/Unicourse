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
    transaction_code: string,
    used_coin: boolean
  ) {
    const body = {
      payer,
      cart_id,
      payment_method,
      total_new_amount,
      voucher_id,
      status,
      transaction_code,
      used_coin,
    };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/transactions/pay`, body)
      .pipe(catchError(this.handleError));
  }

  // Thực hiện lấy link gửi đến gateway của VNPAY
  getLinkVnPay(
    cart_id: string,
    payment_method: string,
    total_new_amount: number,
    voucher_id: string | null,
    transactionCode: string
  ) {
    const body = {
      amount: total_new_amount,
      bankCode: 'VNBANK',
      locale: 'vn',
      transactionCode: transactionCode,
    };
    localStorage.setItem('cart_id', cart_id);
    localStorage.setItem('payment_method', payment_method);
    localStorage.setItem('total_new_amount', total_new_amount.toString());
    voucher_id && localStorage.setItem('voucher_id', voucher_id);
    localStorage.setItem('transaction_code', transactionCode);
    return this.httpClient
      .post<any>(
        `${environment.baseUrl}/api/transactions/create_payment_url`,
        body,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      )
      .pipe(catchError(this.handleError));
  }

  // Xử lí khi có lỗi
  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
