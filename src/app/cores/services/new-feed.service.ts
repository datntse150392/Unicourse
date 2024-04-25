import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class NewFeedService {
  constructor(private httpClient: HttpClient) {}

  // Lấy ra rất cả các new feed
  getAllNewFeeds() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/new-feeds/getAll`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
