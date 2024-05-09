import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserQuizResult, UserQuiz } from '../../cores/models';
import { cloneDeep } from 'lodash';
import { QuizService } from '../../cores/services';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';


interface Flashcard {
  _id: number;
  title: string;
  numberItems: string;
  items: any[];
}

@Component({
  selector: 'app-flashcard-result-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './flashcard-result-page.component.html',
  styleUrl: './flashcard-result-page.component.scss'
})

export class FlashcardResultPageComponent implements OnInit, OnDestroy {
  // Biến dành cho trang chi tiết flashcard
  flashcardResult: UserQuizResult = {} as UserQuizResult;
  userFlashcardAnswers: any;
  markRate: number = 0;

  // Biến behavior của flashcard detail page
  value: number = 50;
  isShowDropdown: boolean = true;

  // userFlashcard: Flashcard = {} as Flashcard;
  blockedUI: boolean = false;

  // Biến cục bộ
  private subscriptions: Subscription[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private dialogBroadcastService: DialogBroadcastService
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Chi tiết flashcard';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.blockedUI = true;
    // Lấy data từ route
    this.activeRoute.paramMap.subscribe(params => {
      const state = history.state;
      if (state && state.data) {
        this.userFlashcardAnswers = state.data;
        this.quizService.calculateResult(this.userFlashcardAnswers).subscribe({
          next: (res: any) => {
            if (res && res.status === 200) {
              this.blockedUI = false;
              this.flashcardResult = res.data;
              this.calculateMarkRate(res.data); // Tính trả lời đúng
              history.replaceState(null, ''); // Clear history state
            } else {
              this.blockedUI = false;
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Lỗi',
                message: 'Không thể tính toán kết quả flashcard',
                type: 'error',
                return: false,
                numberBtn: 1
              })
              history.replaceState(null, ''); // Clear history state
              this.router.navigate(['/flashcard']);
            }
          },
          error: (error) => {
            this.blockedUI = false;
            this.dialogBroadcastService.broadcastConfirmationDialog({
              header: 'Lỗi',
              message: 'Không thể tính toán kết quả flashcard',
              type: 'error',
              return: false,
              numberBtn: 1
            })
            history.replaceState(null, ''); // Clear history state
            this.router.navigate(['/flashcard']);
          }
        })
      } else {
        this.blockedUI = false;
        this.dialogBroadcastService.broadcastConfirmationDialog({
          header: 'Lỗi',
          message: 'Không thể tính toán kết quả flashcard',
          type: 'error',
          return: false,
          numberBtn: 1
        })
        // Clear history state
        history.replaceState(null, '');
        this.router.navigate(['/flashcard']);
      }
    });
  }

  // Tính tỉ lệ đúng
  calculateMarkRate(flashcardResult: UserQuizResult) {
    if (flashcardResult && flashcardResult.number_right_answer && flashcardResult.questions.length) {
      const total = flashcardResult.number_right_answer / flashcardResult.questions.length;
      this.markRate = Math.round(total * 100);
    }
  }

  toggleDropdown() {
    this.isShowDropdown = !this.isShowDropdown;
  }

  scrollToItem(item: string) {
    const el = document.getElementById(item);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
