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

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
