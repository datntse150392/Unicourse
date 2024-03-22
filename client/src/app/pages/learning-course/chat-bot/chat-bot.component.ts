import { Component } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ChatBotService } from '../../../cores/services/chatbot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss'
})
export class ChatBotComponent {
  questionText: string = '';
  displayText: string = '';
  currentIndex: number = 0;
  i = 0;
  speed = 10;
  private subscriptions: Subscription[] = [];

  constructor(
    private chatbotService: ChatBotService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Toggle chatbot
  toggleOverlay(op: OverlayPanel, event: MouseEvent) {
    op.toggle(event);
    this.displayText = '';
    // this.displayText = ``;
    this.questionText = '';
  }

  askQuestion(): void {
    // Check nếu questionText rỗng thì return
    if (this.questionText.trim() === '') {
      return;
    }
    this.displayText = 'Unicourse Assitant đang suy nghĩ...'
    const sendMessageSubs$ = this.chatbotService
      .askQuestion(this.questionText)
      .subscribe({
        next: (res) => {
          this.displayText = '';
          this.typeWriter(res.data.response.text);
        },
        error: (err) => {
          this.displayText = 'Xin lỗi, Unicourse Assistant hiện đang bận. Vui lòng thử lại sau!';
        },
        complete: () => {}
      });
      this.subscriptions.push(sendMessageSubs$);
  }

  // Some event or function to trigger typing animation
  typeWriter(message: string) {
    if (this.i < message.length) {
      this.displayText += message.charAt(this.i);
      this.i++;
      setTimeout(() => {
        this.typeWriter(message);
      }, this.speed);
    }
  }

  // Clear chatbot message
  clearForm() {
    this.displayText = '';
    this.questionText = '';
  }
}
