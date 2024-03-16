import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment.development';
@Injectable({ providedIn: 'root' })
export class CourseService {
    constructor(private httpClient: HttpClient) {}

    // Lấy danh sách tất cả các khóa học của giảng viên
    getCourseByLectureId(teacherId: string): Observable<Course[]> {
        return this.httpClient
            .get<Course[]>(
                `${environment.baseUrl}/api/course/lecturer/${teacherId}`
            )
            .pipe(catchError(this.handleError));
    }

    // Lấy chi tiết khóa học theo khóa học ID
    getCourseById(courseId: string): Observable<Course> {
        return this.httpClient
            .get<Course>(`${environment.baseUrl}/api/course/${courseId}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        // Handle the error appropriately here
        return throwError(() => new Error(error));
    }
}
