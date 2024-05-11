import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface UserResponse {
  status: number,
  message: string,
  data: User
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private httpClient: HttpClient) {}

  // Lấy thông tin người dùng theo userId
  getUser(userId: string): Observable<UserResponse> {
    return this.httpClient
      .get<UserResponse>(`${environment.baseUrl}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      .pipe(catchError(this.handleError));
  }

  // Cập nhật thông tin người dùng
  updateUser(userId: string, data: Object): Observable<User> {
    return this.httpClient
      .put<User>(
        `${environment.baseUrl}/api/user/updateUserLevel/${userId}`,
        data
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
