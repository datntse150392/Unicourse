import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  ],
})
export class FlashcardPageComponent implements OnInit, OnDestroy {
  flashcards: any[] = [];
  first: number = 0;
  rows: number = 6;
  // isLike: boolean = false;
  ingredient!: string;
  filter: string = 'none';

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
    this.flashcards = [
      {
        _id: 1,
        title: 'MKT208c',
        numberItems: '5 Câu hỏi',
        author: 'Nguyễn Huy Khải',
        role: 'Giảng viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-1.png',
        picture: 'https://firebasestorage.googleapis.com/v0/b/nha-trang-ntne.appspot.com/o/Unicourse%20Project%2Fuser5.jpg?alt=media&token=cfaa77cb-0586-4271-84ad-3ecd9a4f4dd4',
        createdDate: 430,
        viewer: 100,
        isLike: false,
      },
      {
        _id: 2,
        title: 'CSD301',
        numberItems: '102 Câu hỏi',
        author: 'Đinh Gia Bảo',
        role: 'Thành viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-2.png',
        picture: 'https://randomuser.me/api/portraits/men/43.jpg',
        createdDate: 40,
        viewer: 198,
        isLike: false,
      },
      {
        _id: 3,
        title: 'PMG201c',
        numberItems: '102 Câu hỏi',
        author: 'Nguyễn Trung Kiên',
        role: 'Thành viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-3.png',
        picture: 'https://randomuser.me/api/portraits/men/62.jpg',
        createDate: 15,
        viewer: 202,
        isLike: false,
      },
      {
        _id: 4,
        title: 'SSL101c',
        numberItems: '299 Câu hỏi',
        author: 'Nguyễn Thành Đạt',
        role: 'Giảng viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-2.png',
        picture: 'https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/images%2Fdownload.jpg?alt=media&token=27ffa58c-b776-4f6a-9492-9e48bb71e008',
        createDate: 2,
        viewer: 300,
        isLike: false,
      },
      {
        _id: 5,
        title: 'EXE101c',
        numberItems: '100 Câu hỏi',
        author: 'Đinh Gia Bảo',
        role: 'Thành viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-3.png',
        picture: 'https://randomuser.me/api/portraits/men/43.jpg',
        createDate: 31,
        viewer: 100,
        isLike: false,
      },
      {
        _id: 6,
        title: 'EXE201c',
        numberItems: '30 Câu hỏi',
        author: 'Nguyễn Thành Đạt',
        role: 'Giảng viên',
        thumbnail: 'https://apollo.primeng.org/assets/demo/images/blog/blog-1.png',
        picture: 'https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/images%2Fdownload.jpg?alt=media&token=27ffa58c-b776-4f6a-9492-9e48bb71e008',
        createDate: 78,
        viewer: 145,
        isLike: false,
      }
    ];
  }

  onPageChange() {}

  onFilterChange(filter: string) {
    this.filter = filter;
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  toggleLike(_id: string) {
    const index = this.flashcards.findIndex((flashcard) => flashcard._id === _id);
    this.flashcards[index].isLike = !this.flashcards[index].isLike;
  }

}
