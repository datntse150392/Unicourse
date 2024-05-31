import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
@Injectable({ providedIn: 'root' })
export class BannerService {
  constructor(private httpClient: HttpClient) {}

  // Lấy tất cả banner hiện có
  getAllBanners() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/banner`)
      .pipe(catchError(this.handleError));
  }

  // Xử lí khi có lỗi
  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
