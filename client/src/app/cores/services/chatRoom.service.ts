import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ChatRoomService {
  constructor(private httpClient: HttpClient) {}

  // Lấy chi tiết chat room theo id
  getChatRoomById(id: string) {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/chatRoom/get-room/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Gửi tin nhắn trong chat room cụ thể
  sendMessage(chatRoomId: string, message: string) {
    const body = { chatRoomId, message };
    return this.httpClient
      .put<any>(`${environment.baseUrl}/api/chatRoom/send-message`, body)
      .pipe(catchError(this.handleError));
  }

  // Lấy danh sách tất cả các phòng chat
  getAllChatRoom() {
    return this.httpClient
      .get<any>(`${environment.baseUrl}/api/chatRoom/get-room`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
