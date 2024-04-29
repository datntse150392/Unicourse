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
  getCoursebySemester(semester: number): Observable<Course[]> {
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

  // Lấy chi tiết khóa học theo courseId
  getCourseDetail(courseId: string): Observable<Course> {
    return this.httpClient
      .get<Course>(`${environment.baseUrl}/api/course/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  // Tham gia khóa học mới
  enrollNewCourse(courseId: string): Observable<any> {
    return this.httpClient
      .post<any>(
        `${environment.baseUrl}/api/course/${courseId}/enroll-course`,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  // Lấy tất cả khóa học đã đăng ký
  getMyCourses(userId: string): Observable<any> {
    return this.httpClient
      .get<Course[]>(
        `${environment.baseUrl}/api/user/${userId}/get-enrolled-course`
      )
      .pipe(catchError(this.handleError));
  }

  // Lấy tất cả danh sách khóa học theo khóa
  getCourseByClass(classNum: number): Observable<Course[]> {
    return this.httpClient
      .get<Course[]>(
        `${environment.baseUrl}/api/course/classes/?classNum=${classNum}`
      )
      .pipe(catchError(this.handleError));
  }

  // Lấy khóa học theo title
  getCourseByTitle(title: string): Observable<Course> {
    return this.httpClient
      .get<Course>(
        `${environment.baseUrl}/api/course/get-course-title/${title}`
      )
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
