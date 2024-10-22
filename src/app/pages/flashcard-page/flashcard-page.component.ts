import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription, forkJoin, Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { QuizService, UserService } from '../../cores/services';
import { Quiz, UserQuiz } from '../../cores/models';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';
import { catchError } from 'rxjs/operators';

interface Filter {
  title: String | undefined;
  newest: Boolean | undefined;
  topView: Boolean | undefined;
  category: String | undefined;
  pageNumber: number;
  limit: number;
}

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-flashcard-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './flashcard-page.component.html',
  styleUrl: './flashcard-page.component.scss',
  animations: [
    trigger('likeAnimation', [
      state('liked', style({
        transform: 'scale(1.1)', // Example animation: scale up
      })),
      state('unliked', style({
        transform: 'scale(1)', // Example animation: return to normal size
      })),
      transition('liked <=> unliked', [
        animate('0.1s ease-in') // Adjust the duration and easing as needed
      ]),
    ]),
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
export class FlashcardPageComponent implements OnInit, OnDestroy {
  // Biến dành cho flashcard page
  originalFlashcards: Quiz[] = [];
  filter: string = 'default'; // newest, mostView, default
  filterObject: Filter = {} as Filter;
  totalPages: number = 1;
  userFlashcardProgress: UserQuiz[] = [];

  // Biến behavior của flashcard page
  isShowDropdown: boolean = false;
  first: number = 0;
  rows: number = 6;
  totalRecords: number = 0;

  // Biến cục bộ
  private subscriptions: Subscription[] = [];
  private userId: string = '';
  public blockedUI: boolean = true;
  search: string = '';
  emptySearchResult: boolean = false;
  categoryText: string = 'Học kỳ';
  
  flashcards: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private dialogBroadcastService: DialogBroadcastService,
    private userService: UserService
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Tổng hợp các bộ quiz tại Unicourse';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
    const listener$ = this.quizService.getRefreshQuiz().subscribe({
      next: (res: any) => {
        if (res) {
          this.initForm();
        }
      }
    });
    this.subscriptions.push(listener$);
  }

  initForm() {
    this.userId = JSON.parse(localStorage.getItem('UserInfo') || '{}')._id;

    const forkJoinSubscription = forkJoin([
      this.quizService.getQuiz(this.userId, this.filterObject).pipe(
        catchError(error => {
          // Handle error from getQuiz()
          return of(null); // Emit null to continue with forkJoin
        })
      ),
      this.userService.getUser(this.userId).pipe(
        catchError(error => {
          // Handle error from getUser()
          return of(null); // Emit null to continue with forkJoin
        })
      )
    ]).subscribe(results => {
      // results will contain either the quiz and user data, or null if an error occurred
      if (results[0] !== null
        && results[1] !== null
        && results[0].status === 200
        && results[1].status === 200
      ) {
        this.originalFlashcards = [];
        //Convert Date to Number of day to now: Ex: 2024-05-04T05:54:52.828Z -> 1 day ago
        const convertData = results[0].data.quizzes.map((quiz: Quiz) => {
          const dateToNow = Math.floor((new Date().getTime() - new Date(quiz.created_at).getTime()) / (1000 * 3600 * 24));
          return { ...quiz, date_to_now: dateToNow };
        });
        this.originalFlashcards.push(...convertData);
        this.totalPages = results[0].data.totalPages;
        this.totalRecords = results[0].data.totalRecords;
        this.originalFlashcards.length === 0 ? this.emptySearchResult = true : this.emptySearchResult = false;
        this.mappingQuizProgress(this.originalFlashcards, results[1].data.quiz_process);
        this.blockedUI = false;
      } else if (results[0] !== null && results[1] === null && results[0].status === 200) {
        this.originalFlashcards = [];
        //Convert Date to Number of day to now: Ex: 2024-05-04T05:54:52.828Z -> 1 day ago
        const convertData = results[0].data.quizzes.map((quiz: Quiz) => {
          const dateToNow = Math.floor((new Date().getTime() - new Date(quiz.created_at).getTime()) / (1000 * 3600 * 24));
          return { ...quiz, date_to_now: dateToNow };
        });
        this.originalFlashcards.push(...convertData);
        this.totalPages = results[0].data.totalPages;
        this.totalRecords = results[0].data.totalRecords;
        this.originalFlashcards.length === 0 ? this.emptySearchResult = true : this.emptySearchResult = false;
        this.blockedUI = false;
      } else {
        this.emptySearchResult = true;
        this.blockedUI = false;
      }
    });

    this.subscriptions.push(forkJoinSubscription);
  }

  onPageChange(event: any) {
    this.filterObject.pageNumber = event.page + 1;
    this.initForm();
  }

  onFilterChange(filter: string) {
    switch(filter) {
      case 'newest':
        this.filterObject.newest = true;
        this.filterObject.topView = false;
        break;
      case 'mostView':
        this.filterObject.newest = false;
        this.filterObject.topView = true;
        break;
      default:
        this.filterObject.newest = false;
        this.filterObject.topView = false;
        this.filterObject.category = undefined;
        this.filterObject.title = undefined;
        this.categoryText = 'Học kỳ';
        break;
    }
    this.originalFlashcards = [];
    this.initForm();
    this.filter = filter;
  }

  mappingQuizProgress(quiz: Quiz[], userProgress: any) {
    this.userFlashcardProgress = userProgress;
    quiz.map((quiz: Quiz) => {
      userProgress.map((progress: any) => {
        if (quiz._id === progress._id) {
          quiz.isInProgress = true;
        }
      });
    });
  }

  onResetQuiz(quiz_id: String) {
    this.blockedUI = true;
    this.quizService.resetQuiz(quiz_id).subscribe({
      next: (res: any) => {
        if (res.status === 201) {
          this.blockedUI = false;
          this.router.navigate(['/flashcard/' + quiz_id]);
        } else {
          this.blockedUI = false;
          this.dialogBroadcastService.broadcastConfirmationDialog({
            header: 'Thông báo',
            message: 'Reset bộ quiz thất bại! Vui lòng thử lại sau!',
            type: 'error',
            return: false,
            numberBtn: 1
          });
          this.router.navigate(['/flashcard/' + quiz_id]);
      }},
      error: (err: any) => {
        this.blockedUI = false;
        this.dialogBroadcastService.broadcastConfirmationDialog({
          header: 'Thông báo',
          message: 'Reset bộ quiz thất bại! Vui lòng thử lại sau!',
          type: 'error',
          return: false,
          numberBtn: 1
        });
        this.router.navigate(['/flashcard/' + quiz_id]);
    }});
  }

  onChangeSearch(event: any) {
    this.filterObject.title = event.target.value.trim();
  }

  onSearch() {
    this.originalFlashcards = [];
    this.initForm();
  }

  onSearchByCategory(category: string, categoryText: string) {
    this.filterObject.category = category;
    this.categoryText = categoryText;
    this.originalFlashcards = [];
    this.initForm();
  }

  handleMouseInOut(isHovering: boolean) {
    this.isShowDropdown = isHovering;
  }

  toggleLike(_id: any) {
    if (!this.userId) {
      this.dialogBroadcastService.broadcastConfirmationDialog({
        header: 'Thông báo',
        message: 'Vui lòng đăng nhập để thực hiện chức năng này!',
        type: 'error',
        return: false,
        numberBtn: 1
      });
      return;
    }
    const quizInteresting$ = this.quizService
      .toggleFavoriteQuiz(_id)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            const index = this.originalFlashcards.findIndex((quiz: Quiz) => quiz._id === _id);
            this.originalFlashcards[index].isQuizInterest = !this.originalFlashcards[index].isQuizInterest;
          }
        },
        error: (err: any) => {
          this.dialogBroadcastService.broadcastConfirmationDialog({
            header: 'Thông báo',
            message: 'Có lỗi xảy ra! Vui lòng thử lại sau!',
            type: 'error',
            return: false,
            numberBtn: 1
          });
        }
      });
      this.subscriptions.push(quizInteresting$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
