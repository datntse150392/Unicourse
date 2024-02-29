import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private httpClient: HttpClient) {}

  // Create comment
  createComment(blogId: string, comment: string) {
    const body = { blogId, comment };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/comment`, body)
      .pipe(catchError(this.handleError));
  }

  // Chỉnh sửa bình luận
  editComment(commentId: string, comment: string) {
    const body = { commentId, comment };
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/comment`, body)
      .pipe(catchError(this.handleError));
  }

  // Xóa bình luận
  deleteComment(commentId: string) {
    return this.httpClient
      .delete<any>(`${environment.baseUrl}/api/comment/${commentId}`)
      .pipe(catchError(this.handleError));
  }

  // Phản hồi comment
  replyComment(commentId: string, comment: string) {
    const body = { commentId, comment };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/comment/reply`, body)
      .pipe(catchError(this.handleError));
  }

  // Like or unlike comment
  likeOrUnLikeComment(commentId: string) {
    const body = { commentId };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/comment/like_or_unlike`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
