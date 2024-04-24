import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Blog } from '../../demo/api/blog';
@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private httpClient: HttpClient) {}

  // Lấy danh sách các blog flag === true
  getHighLightBlog() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/blog/highlight`)
      .pipe(catchError(this.handleError));
  }

  // Lấy tất cả blog
  getAllBlogs() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/blogs`)
      .pipe(catchError(this.handleError));
  }

  // Lấy Blog theo page
  getBlogByPage(page: number) {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/blog?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  // Lấy Blog theo id
  getBlogById(id: string) {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/blog/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Tạo mới blog
  createBlog(data: any) {
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/blog`, data)
      .pipe(catchError(this.handleError));
  }

  // Update blog
  updateBlog(data: Blog) {
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/blog/${data._id}`, data,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })
      .pipe(catchError(this.handleError))
  }

  // Xóa blog
  deleteBlog(id: string) {
    return this.httpClient
      .delete<any>(`${environment.baseUrl}/api/blog/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
