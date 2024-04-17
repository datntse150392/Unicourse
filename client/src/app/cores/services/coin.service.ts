import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Coin } from '../models';
@Injectable({ providedIn: 'root' })
export class CoinService {
  constructor(private httpClient: HttpClient) {}

  getCoinByUserId(): Observable<Coin> {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/coins/get-coin`, {
        headers: {},
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
