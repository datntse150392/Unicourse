import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { QuizService } from '../../cores/services';
import { Quiz } from '../../cores/models';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';

interface Filter {
  title: String | undefined;
  newest: Boolean | undefined;
  topView: Boolean | undefined;
  category: String | undefined;
  pageNumber: number;
  limit: number;
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
        animate('0.5s ease-in') // Adjust the duration and easing as needed
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

  // Biến behavior của flashcard page
  isShowDropdown: boolean = false;

  // Biến cục bộ
  private subscriptions: Subscription[] = [];
  private userId: string = '';
  public blockedUI: boolean = true;
  search: string = '';
  emptySearchResult: boolean = false;
  categoryText: string = 'Chuyên ngành'
  
  flashcards: any[] = [];
  first: number = 0;
  rows: number = 6;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private dialogBroadcastService: DialogBroadcastService,
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Tổng hợp các bộ quiz tại Unicourse';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.userId = JSON.parse(localStorage.getItem('UserInfo') || '{}')._id;
    const originalFlashcards$ = this.quizService
      .getQuiz(this.userId, this.filterObject)
      .subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            //Convert Date to Number of day to now: Ex: 2024-05-04T05:54:52.828Z -> 1 day ago
            const convertData = res.data.quizzes.map((quiz: Quiz) => {
              const dateToNow = Math.floor((new Date().getTime() - new Date(quiz.created_at).getTime()) / (1000 * 3600 * 24));
              return { ...quiz, date_to_now: dateToNow };
            });
            this.originalFlashcards.push(...convertData);
            this.totalPages = res.data.totalPages;
            this.originalFlashcards.length === 0 ? this.emptySearchResult = true : this.emptySearchResult = false;
            this.blockedUI = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.blockedUI = false;
        }
      })

    this.subscriptions.push(originalFlashcards$);
  }

  onPageChange() {}

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
        this.categoryText = 'Chuyên ngành';
        break;
    }
    this.originalFlashcards = [];
    this.initForm();
    this.filter = filter;
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
          this.dialogBroadcastService.broadcastDialog({
            header: 'Thông báo',
            message: 'Thay đổi trạng thái yêu thích thất bại! Vui lòng thử lại sau!',
            type: 'error',
            display: true,
          });
        }
      });
      this.subscriptions.push(quizInteresting$);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
