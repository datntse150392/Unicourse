import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { QuizService } from '../../cores/services';
import { Quiz, UserQuiz, UserQuestion } from '../../cores/models';
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

  constructor(
    private route: ActivatedRoute,
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
    this.route.paramMap.subscribe((params) => {
      this.quizId = params.get('id');
      if (this.quizId) {
        this.getQuizByQuizId(this.quizId);
      }
    });
    this.currentIndex = 0;
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
      this.currentIndex++;
      this.currentItems = this.userFlashcard.questions[this.currentIndex];
      this.handleToggleDisabledButton();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentItems = this.userFlashcard.questions[this.currentIndex];
      this.handleToggleDisabledButton();
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

  finishQuiz() {}

  onChangeMode(filter: string) {
    this.filter = filter;
  }

  handleExistFlashcard(behavior: String) {
    // Check nếu có thông tin user flashcard thì hiển thị dialog thông báo
    if (this.UserInfo) {
      this.handleDisplayConfirmDialog();
      switch (behavior) { // Nếu behavior la exitBtn thì chuyển hướng về trang flashcard // Nếu behavior là ngOnDestroy thì không làm gì cả
          case 'ngOnDestroy':
            break;
          case 'exitBtn':
            this.router.navigate(['/flashcard']);
            break;
      };
    } else {
      this.router.navigate(['/flashcard']);
    }
  }

  handleDisplayConfirmDialog() {
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
      if (confirm) {
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

  ngOnDestroy(): void {
    this.handleExistFlashcard('ngOnDestroy');
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
