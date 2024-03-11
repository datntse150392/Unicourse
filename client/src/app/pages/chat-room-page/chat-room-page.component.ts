import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared';
import { ChatRoomService } from '../../cores/services/chatRoom.service';
import { User } from '../../cores/models';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatRoom } from '../../cores/models/chatRoom.model';
import { environment } from '../../../environments/environment.development';
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
  public chatRoomId: string | null = null;
  public chatRoomDetail!: ChatRoom;
  public message!: string;
  Logo: string = environment.LOGO;

  private isScrollBottom = false;

  private subscriptions: Subscription[] = [];
  constructor(
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnDestory() {
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
    this.route.paramMap.subscribe((params) => {
      this.chatRoomId = params.get('id');
      if (this.chatRoomId) {
        this.getChatRoomByChatRoomId(this.chatRoomId);
      }
    });
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    if (localStorage !== undefined) {
      if (localStorage.getItem('isLogin')) {
        this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
      }
    }
  }

  // Lấy thông tin chat room theo id
  getChatRoomByChatRoomId(id: string) {
    const getChatRoomDetailSubs$ = this.chatRoomService
      .getChatRoomById(id)
      .subscribe((res) => {
        if (res && res.status === 200) {
          this.chatRoomDetail = res.data;
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
        .subscribe((res) => {
          if (res && res.status === 200) {
            if (this.chatRoomId) {
              this.getChatRoomByChatRoomId(this.chatRoomId);
              this.message = '';
            }
          }
        });
      this.subscriptions.push(sendMessageSubs$);
    }
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
