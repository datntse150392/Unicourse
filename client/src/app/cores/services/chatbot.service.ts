import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ChatBotService {
  constructor(private httpClient: HttpClient) {}

  // Hỏi chatbot
  askQuestion(message: string) {
    const body = { message };
    return this.httpClient
      .post<any>(`${environment.baseUrl}/api/chatbot`, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
