import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class CheckingDailyEventService {
  constructor(private httpClient: HttpClient) {}

  getAllDataCheckingDailyEvent(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/checkingDaily`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
