import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
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
  styleUrls: ['./chat-room-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatRoomPageComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  public userInfo!: User;
  public chatRoomId!: string;
  public chatRoomDetail!: ChatRoom;
  public message!: string;
  public Logo: string = environment.LOGO;
  public blockedUI: boolean = true;

  private isScrollBottom = false;
  private isSendingMessage = false;
  private subscriptions: Subscription[] = [];
  private tempListMessage: Message[] = [];

  constructor(
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    window.document.title = 'Messenger | Unicourse';
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.socketService.leaveRoom(this.chatRoomId, this.userInfo._id);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngAfterViewChecked(): void {
    if (this.isScrollBottom) {
      this.scrollToBottom();
      this.isScrollBottom = false;
    }
  }

  initForm() {
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

  getChatRoomByChatRoomId(id: string) {
    this.blockedUI = true;
    const getChatRoomDetailSubs$ = this.chatRoomService
      .getChatRoomById(id)
      .subscribe((res) => {
        if (res && res.status === 200) {
          this.chatRoomDetail = res.data;
          this.tempListMessage = res.data;
          this.isScrollBottom = true;
          this.cdr.markForCheck();
        }
        this.blockedUI = false;
      });
    this.subscriptions.push(getChatRoomDetailSubs$);
  }

  sendMessage(message: string) {
    if (this.isSendingMessage) return; // Prevent multiple sends
    this.isSendingMessage = true;

    if (this.chatRoomId && message.trim().length > 0) {
      const sendMessageSubs$ = this.chatRoomService
        .sendMessage(this.chatRoomId, message)
        .subscribe({
          next: (res) => {
            if (this.chatRoomId) {
              this.chatRoomDetail.messages = res.data;
              this.message = '';
              this.isScrollBottom = true;
              this.socketService.sendMessage(
                this.chatRoomId,
                this.userInfo._id,
                message,
                this.tempListMessage
              );
              this.cdr.markForCheck();
            }
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
            this.isSendingMessage = false; // Reset the flag
          },
        });
      this.subscriptions.push(sendMessageSubs$);
    } else {
      this.isSendingMessage = false; // Reset the flag if no message to send
    }
  }

  listenForMessages(): void {
    this.socketService.getMessages().subscribe((data: any) => {
      this.chatRoomDetail.messages = data.listMessage.messages;
      this.isScrollBottom = true;
      this.cdr.markForCheck();
    });
  }

  leaveRoom() {
    this.socketService.leaveRoom(this.chatRoomId, this.userInfo._id);
    this.router.navigate(['/']);
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }

  trackByMessageId(index: number, message: Message): string {
    return message._id;
  }
}
