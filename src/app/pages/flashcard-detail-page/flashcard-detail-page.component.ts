import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { QuizService, UserService } from '../../cores/services';
import { Quiz, UserQuiz, UserQuestion, CorrectAnswer, UserAnswer } from '../../cores/models';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';
import * as _ from 'lodash';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-flashcard-detail-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './flashcard-detail-page.component.html',
  styleUrl: './flashcard-detail-page.component.scss',
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void <=> *', animate(500)),
    ]),
  ],
})
export class FlashcardDetailPageComponent implements OnInit, OnDestroy {
  // Biến dành cho trang chi tiết flashcard
  originalFlashcards: Quiz[] = [];
  quizId: string | null = null;
  userFlashcard: UserQuiz = {} as UserQuiz;
  currentItems: UserQuestion = {} as UserQuestion;

  // Biến behavior của flashcard detail page
  isShowRightAnswer: boolean = false;
  currentIndex: number = 0;
  isShowDropdown: boolean = false;
  isActive: boolean[] = [];
  isDisabledPrevios: boolean = true;
  isDisabledNext: boolean = false;
  filter: string = '';
  progressValue: number = 20;
  faCircleXmark = faCircleXmark;

  // Biến cục bộ
  private subscriptions: Subscription[] = [];
  public blockedUI: boolean = true;
  private UserInfo: any = localStorage.getItem('UserInfo');
  private userId = JSON.parse(localStorage.getItem('UserInfo') || '{}')._id;
  private skipDisplayConfirmDialog: boolean = false;
  private isUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private dialogBroadcastService: DialogBroadcastService,
    private userService: UserService
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
    this.route.paramMap.subscribe((params) => {
      this.quizId = params.get('id');
      if (this.quizId) {
        this.findQuizWithUserProgress(this.quizId);
      }
    });
    this.currentIndex = 0;
    this.filter = 'quiz'
  }

  findQuizWithUserProgress(quizId: string) {
    // Nếu không có thông tin user thì lấy quiz từ API
    if (!this.userId) {
      this.getQuizByQuizId(quizId);
      return;
    }

    const userProgress$ = this.userService.getUser(this.userId).subscribe({
      next: (res: any) => {
        if (res.data.quiz_process.length > 0) {
          this.userFlashcard = res.data.quiz_process.find((x: any) => x._id === quizId);
          if (!this.userFlashcard) { // Nếu không tìm thấy quizId trong quiz_process thì lấy quiz từ API
            this.getQuizByQuizId(quizId);
          } else { // Nếu tìm thấy quizId trong quiz_process thì lấy quiz từ quiz_process
            const unansweredQuestion = this.userFlashcard.questions.find((x: UserQuestion) => !x.is_answered);
            if (unansweredQuestion) {
              this.currentItems = unansweredQuestion;
              this.currentIndex = this.userFlashcard.questions.indexOf(unansweredQuestion);
              this.currentIndex > 0 ? this.isDisabledPrevios = false : this.isDisabledPrevios = true;
              this.currentIndex < this.userFlashcard.questions.length - 1 ? this.isDisabledNext = false : this.isDisabledNext = true;
              this.progressValue = ((this.currentIndex + 1) / this.userFlashcard.questions.length) * 100;
            }
            this.blockedUI = false;
          }
        } else {
          this.getQuizByQuizId(quizId);
        }
      }
    });

    this.subscriptions.push(userProgress$);
  }

  // Call Api get quiz by quizId
  getQuizByQuizId(quizId: string) {
    // Call API here
    const getQuizDetailSub$ = this.quizService.getQuizById(quizId).subscribe({
      next: (res: any) => {
        //Convert Date to Number of day to now: Ex: 2024-05-04T05:54:52.828Z -> 1 day ago
        const convertData = res.data.map((quiz: Quiz) => {
          const dateToNow = Math.floor((new Date().getTime() - new Date(quiz.created_at).getTime()) / (1000 * 3600 * 24));
          return { ...quiz, date_to_now: dateToNow };
        });
        this.originalFlashcards.push(...convertData);

        // Init userFlashcard: Lưu vào tiến trình trả lời câu hỏi của user
        let clonedObject: any = _.cloneDeep(this.originalFlashcards[0]);
        clonedObject.questions.map((x: any) => {
          x.answer.map((y: any) => {
            y.is_checked = false;
            y.is_answered = false;
          });
        });
        this.userFlashcard = clonedObject;
        this.currentItems = this.userFlashcard.questions[this.currentIndex];
        this.blockedUI = false;
      },
      error: (err:  Error) => {
        console.log(err);
        this.blockedUI = false;
      }
    });
    this.subscriptions.push(getQuizDetailSub$);
  }

  toggleActive(item: any, currentItems: any) {
    this.updateUserAnswer(item, currentItems);
  }

  nextQuestion() {
    if (this.currentIndex < this.userFlashcard.questions.length - 1) {
      this.userFlashcard.questions[this.currentIndex].is_answered = !this.currentItems.answer.every((x: any) => x.is_checked === false) // Kiểm tra xem câu hỏi có trả lời không
      this.currentIndex++;
      this.currentItems = this.userFlashcard.questions[this.currentIndex];
      this.handleToggleDisabledButton();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.userFlashcard.questions[this.currentIndex].is_answered = !this.currentItems.answer.every((x: any) => x.is_checked === false) // Kiểm tra xem câu hỏi có trả lời không
      this.currentIndex--;
      this.currentItems = this.userFlashcard.questions[this.currentIndex];
      this.handleToggleDisabledButton();
    }
  }

  // Scroll smooth to top tới title của câu hỏi
  scrollToTitle() {
    const el = document.getElementById('titleScroll');
    console.log(el);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Update câu trả lời của user: userflashcardAnwers
  updateUserAnswer(item: any, currentItems: any) {
    // Kiểm tra câu trả hỏi có phải là multiple choice hay không?
    switch (currentItems.type) {
      case 'single':
        this.updateWithSingleChoice(item, currentItems);
        break;
      case 'multiple':
        this.updateWithMultipleChoice(item, currentItems);
        break;
      default:
        break;
    }
    this.userFlashcard.questions[this.currentIndex].is_answered = !this.currentItems.answer.every((x: any) => x.is_checked === false) // Kiểm tra xem câu hỏi có trả lời không
  }

  updateWithSingleChoice(item: any, currentItems: any) {
    this.userFlashcard.questions.map((x) => {
      if (x._id === currentItems._id) {
        x.answer.map((y: any) => {
          if (y.answer_text === item.answer_text && y.is_checked) {
            y.is_checked = false;
          } else if (y.answer_text === item.answer_text && !y.is_checked) {
            y.is_checked = true;
          } else {
            y.is_checked = false;
          }
        });
      }
    });
  }

  updateWithMultipleChoice(item: any, currentItems: any) {
    this.userFlashcard.questions.map((x) => {
      if (x._id === currentItems._id) {
        x.answer.map((y: any) => {
          if (y.answer_text === item.answer_text && y.is_checked) {
            y.is_checked = false;
          } else if (y.answer_text === item.answer_text && !y.is_checked) {
            y.is_checked = true;
          }
        });
      }
    });
  }

  onCalculateScore() {}

  handleToggleDisabledButton() {
    if (this.currentIndex === 0) {
      this.isDisabledPrevios = true;
    } else {
      this.isDisabledPrevios = false;
    }

    if (this.currentIndex === this.userFlashcard.questions.length - 1) {
      this.isDisabledNext = true;
    } else {
      this.isDisabledNext = false;
    }

    this.progressValue = ((this.currentIndex + 1) / (this.userFlashcard.questions.length) * 100);
  }

  handleMouseInOut(isHovering: boolean) {
    this.isShowDropdown = isHovering;
  }

  onChangeMode(filter: string) {
    if (filter === 'flashcard') {
      this.dialogBroadcastService.broadcastConfirmationDialog({
        header: 'Thông báo',
        message: 'Tính năng này đang được phát triển!',
        type: 'info',
        return: false,
        numberBtn: 1
      });
    } else {
      this.filter = filter;
    }
  }

  handleExistFlashcard(behavior: String) {
    // Check nếu có thông tin user flashcard thì hiển thị dialog thông báo
    if (this.UserInfo) {
      switch (behavior) { // Nếu behavior la exitBtn thì chuyển hướng về trang flashcard // Nếu behavior là ngOnDestroy thì không làm gì cả
        case 'ngOnDestroy':
          break;
        case 'exitBtn':
          this.router.navigate(['/flashcard']);
          break;
        case 'finishQuiz':
          this.router.navigate([`/flashcard/${this.quizId}/result`], { state: { data: this.userFlashcard } });
          break;
        default:
          this.router.navigate(['/flashcard']);
          break;

      };
    } else {
      switch (behavior) { // Nếu behavior la exitBtn thì chuyển hướng về trang flashcard // Nếu behavior là ngOnDestroy thì không làm gì cả
        case 'ngOnDestroy':
          break;
        case 'exitBtn':
          this.router.navigate(['/flashcard']);
          break;
        case 'finishQuiz':
          this.router.navigate([`/flashcard/${this.quizId}/result`], { state: { data: this.userFlashcard } });
          break;
        default:
          this.router.navigate(['/flashcard']);
          break;
      };
    }
  }

  handleDisplayConfirmDialog() {
    if (this.skipDisplayConfirmDialog) {
      return;
    }
    // Hiển thị dialog thông báo
    this.dialogBroadcastService.broadcastConfirmationDialog({
      header: 'Thông báo',
      message: 'Bạn có muốn lưu lại tiến trình hiện tại không?',
      type: 'info',
      return: true,
      numberBtn: 2
    });

    // Lắng nghe giá trị trả về của confirm dialog
    this.dialogBroadcastService.getDialogConfirm().subscribe((confirm) => {
      if (confirm && !this.isUpdate) {
        // Call API here
        const saveUserQuiz$ = this.quizService.saveUserQuiz(this.userFlashcard).subscribe({
          next: (res: any) => {
            if (res.status === 201) {
              this.dialogBroadcastService.broadcastConfirmationDialog({
                header: 'Thông báo',
                message: 'Lưu tiến trình thành công!',
                type: 'success',
                return: false,
                numberBtn: 1
              });
              this.isUpdate = true;
              this.quizService.setRefreshQuiz(true);
            }
          },
          error: (err: any) => {
            console.log(err);
            this.dialogBroadcastService.broadcastConfirmationDialog({
              header: 'Thông báo',
              message: 'Lưu tiến trình thất bại!',
              type: 'error',
              return: false,
              numberBtn: 1
            });
          }
        });
        this.subscriptions.push(saveUserQuiz$);
      }
    });
  }

  finishQuiz() {
    this.userFlashcard.questions[this.currentIndex].is_answered = !this.currentItems.answer.every((x: any) => x.is_checked === false) // Kiểm tra xem câu hỏi có trả lời không
    // Navigate to result page with data userFlashcard
    this.skipDisplayConfirmDialog = true;
    this.handleExistFlashcard('finishQuiz');
  }

  ngOnDestroy(): void {
    this.handleDisplayConfirmDialog();
    this.handleExistFlashcard('ngOnDestroy');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
