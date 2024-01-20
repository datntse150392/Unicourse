import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Course } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private httpClient: HttpClient) {}

  // Lấy danh sách tất cả các khóa học
  getCourseFree(): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${environment.baseUrl}/api/course/free-course`)
      .pipe(catchError(this.handleError));
  }

  // Lấy danh sách khóa học theo chuyên ngành
  getCoursebySemester(semester: string): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${environment.baseUrl}/api/course/semester/${semester}`)
      .pipe(catchError(this.handleError));
  }

  // Lấy danh sách khóa học PRO
  getCoursePro(): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(`${environment.baseUrl}/api/course/pro-course`)
      .pipe(catchError(this.handleError));
  }

  // Lấy danh sách khóa học by id
  getCourseById(courseId: string): Observable<Course> {
    return this.httpClient
      .get<Course>(`${environment.baseUrl}/api/course/get-course/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }

  // Share common value between components
  public courseDetail!: Course;
  public listcoursesFree!: Course[];
  public listcoursesPro!: Course[];
}
