import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Cart } from '../models/cart.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private httpClient: HttpClient) {}

  // Lấy danh sách giỏ hàng của người dùng
  getCart(): Observable<Cart> {
    return this.httpClient
      .get<Cart>(`${environment.baseUrl}/api/cart/retrieve-user-cart`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
