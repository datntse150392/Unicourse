import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { EnrollCourse, User } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface UserResponse {
  status: number;
  message: string;
  data: User;
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

  //  Lấy danh sách wish list
  getMyWishList(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/user/get-wish-list`)
      .pipe(catchError(this.handleError));
  }

  // Thêm khoá học vào wish_list
  addCourseInWishList(courseId: string): Observable<any> {
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/user/add-wish-list/${courseId}`, {})
      .pipe(catchError(this.handleError));
  }

  // Remove khoá học ra wish_list
  removeCourseOutWishList(courseId: string): Observable<any> {
    return this.httpClient
      .put<any>(
        `${environment.baseUrl}/api/user/remove-wish-list/${courseId}`,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  // GET RECOMMENDATION
  getRecommendation(interests: string[]): Observable<any> {
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/user/get-recommendation`, {
        interests,
      })
      .pipe(catchError(this.handleError));
  }

  // Update tiến độ học tập khóa học của user
  updateLearningProgress(courseId: string, data: any): Observable<any> {
    return this.httpClient
      .put<any>(
        `${environment.baseUrl}/api/user/update-learning-progress/${courseId}`,
        data
      )
      .pipe(catchError(this.handleError));
  }

  // Lấy danh sách enroll course của user
  getEnrolledCourse(userId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${environment.baseUrl}/api/user/${userId}/get-enrolled-course`
      )
      .pipe(catchError(this.handleError));
  }
  

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
