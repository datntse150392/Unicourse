import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Coin } from '../models';
@Injectable({ providedIn: 'root' })
export class CommonService {
  constructor(private httpClient: HttpClient) {}

  searchAll(text: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.baseUrl}/api/common/search?text=${text}`
    );
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
