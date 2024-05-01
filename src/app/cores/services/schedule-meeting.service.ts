import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ScheduleMeetingService {
  constructor(private httpClient: HttpClient) {}

  // Thực hiện việc lấy tất cả dữ liệu của lịch hẹn
  getAllScheduleMeetings() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/schedule-meetings`)
      .pipe(catchError(this.handleError));
  }

  // Thực hiện việc đăng ký lịch hẹn
  registerScheduleMeeting(scheduleMeetingId: string) {
    return this.httpClient
      .put<any>(
        `${environment.baseUrl}/api/schedule-meetings/register/${scheduleMeetingId}`,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
