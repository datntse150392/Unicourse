import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class PayOSService {
  constructor(private httpClient: HttpClient) {}

  // Thực hiện việc tạo mới payment link
  createPaymentLink(data: object) {
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/payOS/create-payment-link`, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
