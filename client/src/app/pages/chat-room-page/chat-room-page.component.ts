import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared';
import { ChatRoomService } from '../../cores/services/chatRoom.service';
import { User } from '../../cores/models';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatRoom, Message } from '../../cores/models/chatRoom.model';
import { environment } from '../../../environments/environment.development';
import { SocketService } from '../../cores/services/socketIO.service';
@Component({
  selector: 'app-chat-room-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat-room-page.component.html',
  styleUrl: './chat-room-page.component.scss',
})
export class ChatRoomPageComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public userInfo!: User;
  public chatRoomId!: string;
  public chatRoomDetail!: ChatRoom;
  public message!: string;
  public Logo: string = environment.LOGO;

  private isScrollBottom = false;

  private subscriptions: Subscription[] = [];
  private tempListMessage: Message[] = [];
  constructor(
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private router: Router
  ) {
    // Set title cho trang
    window.document.title = 'Messenger | Unicourse';
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestory() {
    this.socketService.leaveRoom(this.chatRoomId, this.userInfo._id);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewChecked(): void {
    // If shouldScrollToBottom is true, then scroll to the bottom
    if (this.isScrollBottom) {
      this.scrollToBottom();
      this.isScrollBottom = false; // Reset the flag
    }
  }

  initForm() {
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    if (localStorage !== undefined) {
      if (localStorage.getItem('isLogin')) {
        this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
      }
    }
    this.route.paramMap.subscribe((params) => {
      this.chatRoomId = params.get('id') || '';
      if (this.chatRoomId && this.userInfo) {
        this.getChatRoomByChatRoomId(this.chatRoomId);
        this.listenForMessages();
      }
    });
    this.setupRoom();
  }

  private setupRoom(): void {
    if (this.chatRoomId) {
      this.socketService.joinRoom(this.chatRoomId, this.userInfo._id);
    }
  }

  // Lấy thông tin chat room theo id
  getChatRoomByChatRoomId(id: string) {
    const getChatRoomDetailSubs$ = this.chatRoomService
      .getChatRoomById(id)
      .subscribe((res) => {
        if (res && res.status === 200) {
          this.chatRoomDetail = res.data;
          this.tempListMessage = res.data;
          this.isScrollBottom = true; // Set the flag to scroll after view checks
        }
      });
    this.subscriptions.push(getChatRoomDetailSubs$);
  }

  // Gửi tin nhắn trong chat room
  sendMessage(message: string) {
    if (this.chatRoomId && message.length > 0) {
      const sendMessageSubs$ = this.chatRoomService
        .sendMessage(this.chatRoomId, message)
        .subscribe({
          next: (res) => {
            if (this.chatRoomId) {
              this.chatRoomDetail.messages = res.data;
              this.message = '';
              this.isScrollBottom = true; // Set the flag to scroll after view checks
              this.socketService.sendMessage(
                this.chatRoomId,
                this.userInfo._id,
                message,
                this.tempListMessage
              );
            }
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {},
        });
      this.subscriptions.push(sendMessageSubs$);
    }
  }

  // Lấy danh sách tin nhắn trong phòng chat
  getMessagesByChatRoomId(chatRoomId: string) {}

  listenForMessages(): void {
    this.socketService.getMessages().subscribe((data: any) => {
      // Fetch new messages after a delay to allow time for the DOM to update
      setTimeout(() => {
        this.chatRoomDetail.messages = data.listMessage.messages;
        console.log(this.chatRoomDetail.messages);
        this.isScrollBottom = true;
      }, 1000);
    });
  }

  LeaveRoom() {
    this.socketService.leaveRoom(this.chatRoomId, this.userInfo._id);
    this.router.navigate(['/']);
  }

  // Scroll xuống cuối cùng
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
