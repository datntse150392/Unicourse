import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Cart } from '../models/cart.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
