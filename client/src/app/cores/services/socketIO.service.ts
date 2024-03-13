import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket;

  constructor(private httpClient: HttpClient) {
    this.socket = io(environment.socketURL);
  }

  joinRoom(roomId: string, userId: string) {
    this.socket.emit('joinRoom', { roomId, userId });
  }

  leaveRoom(roomId: string, userId: string) {
    this.socket.emit('leaveRoom', { roomId, userId });
  }

  sendMessage(
    roomId: string,
    userId: string,
    message: string,
    listMessage: object[]
  ) {
    this.socket.emit('sendMessage', { roomId, userId, message, listMessage });
  }

  getMessages() {
    return new Observable((observer) => {
      this.socket.on('newMessage', (message) => {
        console.log('newMessage', message);
        observer.next(message);
      });
    });
  }
}
