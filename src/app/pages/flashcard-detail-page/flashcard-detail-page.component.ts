import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface Flashcard {
  _id: number;
  title: string;
  numberItems: string;
  items: any[];
}

interface CurrentItem {
  _id: number;
  question: string;
  answer: [
    {
      _id: number;
      content: string;
      isChoiced: boolean;
    }
  ];
  rightAnswer: string[];
}

interface UserflashcardAnwers {
  userItemAnwer: Map<number, UserItemAnwer>;
}

interface UserItemAnwer {
  _id: number;
  answer: [
    {
      _id: number;
      content: string;
      isChoiced: boolean;
    }
  ];
}

@Component({
  selector: 'app-flashcard-detail-page',
  standalone: true,
  imports: [HeaderComponent ,SharedModule],
  templateUrl: './flashcard-detail-page.component.html',
  styleUrl: './flashcard-detail-page.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(500)),
    ]),
  ]
})
export class FlashcardDetailPageComponent implements OnInit, OnDestroy {
  originFlashcard: Flashcard = {} as Flashcard;
  userFlashcard: Flashcard = {} as Flashcard;

  isShowRightAnswer: boolean = false;
  finalScore: number = 0;
  currentIndex: number = 0;
  currentItems: CurrentItem = {} as CurrentItem;

  userflashcardAnwers: UserflashcardAnwers = {
    userItemAnwer: new Map<number, UserItemAnwer>()
  } as UserflashcardAnwers;

  isActive: boolean[] = [];
  isDisabledPrevios: boolean = true;
  isDisabledNext: boolean = false;
  filter: string = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
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
    this.originFlashcard = {
      _id: 1,
      title: 'MKT208c',
      numberItems: '5 câu hỏi',
      items: [
        {
          _id: 1,
          question: 'Which is a good starting point for writing a blog?',
          type: 'single',
          answer: [
            {
              _id: 1,
              content: 'Our target audience is so overwhelmed with much information, so you can start with a filter and focus blog',
              isChoiced: false,
              rightAnswer: true
            },
            {
              _id: 2,
              content: 'Our target audience is very demanding, so you should be genius to impress them',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 3,
              content: 'Our target audience is very smart, so try to be smarter than them',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 4,
              content: 'Writing blog is too traditional, it is not relevant in social marketing',
              isChoiced: false,
              rightAnswer: false
            }
          ],
          rightAnswer: [
            {
              _id: 1,
              content: 'Our target audience is so overwhelmed with much information, so you can start with a filter and focus blog',
            }
          ]
        },
        {
          _id: 2,
          question: 'Display ads, magazine ads, acquisition programs, endorsements, affiliate program, pay-per-click, banner ads are examples of',
          type: 'single',
          answer: [
            {
              _id: 1,
              content: 'owned media',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 2,
              content: 'paid media',
              isChoiced: false,
              rightAnswer: true
            },
            {
              _id: 3,
              content: 'earned media',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 4,
              content: 'traditional media',
              isChoiced: false,
              rightAnswer: false
            }
          ],
          rightAnswer: [
            {
              _id: 2,
              content: 'paid media',
            }
          ]
        },
        {
          _id: 3,
          question: 'In Social marketing budget, there are four areas as follows, except:',
          type: 'single',
          answer: [
            {
              _id: 1,
              content: 'Empowering',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 2,
              content: 'Technology',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 3,
              content: 'Marketing program',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 4,
              content: 'Production',
              isChoiced: false,
              rightAnswer: true
            }
          ],
          rightAnswer: [
            {
              _id: 4,
              content: 'Production',
            }
          ]
        },
        {
          _id: 4,
          question: 'Which of the following are tools for Search Analytics? Check all that apply.',
          type: 'multiple',
          answer: [
            {
              _id: 1,
              content: 'Google Trends',
              isChoiced: false,
              rightAnswer: true
            },
            {
              _id: 2,
              content: 'Keyhole.co',
              isChoiced: false,
              rightAnswer: true
            },
            {
              _id: 3,
              content: 'Boardreader',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 4,
              content: 'Answer the Public',
              isChoiced: false,
              rightAnswer: true
            }
          ],
          rightAnswer: [
            {
              _id: 1,
              content: 'Google Trends'
            },
            {
              _id: 2,
              content: 'Keyhole.co'
            },
            {
              _id: 4,
              content: 'Answer the Public'
            }
          ]
        },
        {
          _id: 5,
          question: 'If you want to develop a great blog, you should avoid .......',
          type: 'single',
          answer: [
            {
              _id: 1,
              content: 'Using Google Suggest for finding suitable topics',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 2,
              content: 'having a great headline',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 3,
              content: 'using images',
              isChoiced: false,
              rightAnswer: false
            },
            {
              _id: 4,
              content: 'writing a lot of long paragraphs',
              isChoiced: false,
              rightAnswer: true
            }
          ],
          rightAnswer: [
            {
              _id: 4,
              content: 'writing a lot of long paragraphs',
            }
          ]
        }
      ]
    }

    this.userFlashcard = this.originFlashcard;
    this.currentIndex = 0;
    this.currentItems = this.userFlashcard.items[this.currentIndex];
    // this.currentItems.answer.forEach(_ => this.isActive.push(false));// Khởi tạo mảng isActive với giá trị false
  }

  toggleActive(item: any, currentItems: any) {
    this.updateUserAnswer(item, currentItems);
  }


  nextQuestion() {
    if (this.currentIndex < this.userFlashcard.items.length - 1) {
      this.currentIndex++;
      this.currentItems = this.userFlashcard.items[this.currentIndex];
      this.handleToggleDisabledButton();
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentItems = this.userFlashcard.items[this.currentIndex];
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
    this.userFlashcard.items.map((x) => {
      if (x._id === currentItems._id) {
        x.answer.map((y: any) => {
          if (y.content === item.content && y.isChoiced) {
            y.isChoiced = false;
          } else if (y.content === item.content && !y.isChoiced) {
            y.isChoiced = true;
          } else {
            y.isChoiced = false;
          }
        });
      }
    });
  }

  updateWithMultipleChoice(item: any, currentItems: any) {
    this.userFlashcard.items.map((x) => {
      if (x._id === currentItems._id) {
        x.answer.map((y: any) => {
          if (y.content === item.content && y.isChoiced) {
            y.isChoiced = false;
          } else if (y.content === item.content && !y.isChoiced) {
            y.isChoiced = true;
          }
        });
      }
    });

  }

  onCalculateScore() {
  }

  resetValues() {
    this.finalScore = 0;
    this.currentIndex = 0;
    this.currentItems = this.userFlashcard.items[this.currentIndex];
    this.isShowRightAnswer = false;
    this.isActive = [];
    this.currentItems.answer.forEach(_ => this.isActive.push(false));
  }

  handleToggleDisabledButton() {
    if (this.currentIndex === 0) {
      this.isDisabledPrevios = true;
    } else {
      this.isDisabledPrevios = false;
    }

    if (this.currentIndex === this.userFlashcard.items.length - 1) {
      this.isDisabledNext = true;
    } else {
      this.isDisabledNext = false;
    }
  }

  finishQuiz() {
  }

  onChangeMode(filter: string) {
    this.filter = filter;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
