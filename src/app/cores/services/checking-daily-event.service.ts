import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ScheduleMeeting } from '../models';
@Injectable({ providedIn: 'root' })
export class CheckingDailyEventService {
  constructor(private httpClient: HttpClient) {}

  getAllDataCheckingDailyEvent(): Observable<ScheduleMeeting> {
    // Tham số ngẫu nhiên
    const randomParam = new Date().getTime();
    return this.httpClient
      .get<ScheduleMeeting>(
        `${environment.baseUrl}/api/checkingDaily?random=${randomParam}`
      )
      .pipe(catchError(this.handleError));
  }

  attendCheckingDailyEvent(dailyId: string): Observable<any> {
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/checkingDaily/mark/${dailyId}`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
