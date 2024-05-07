import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


interface Flashcard {
  _id: number;
  title: string;
  numberItems: string;
  items: any[];
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
      rightAnswer: boolean;
    }
  ];
}

@Component({
  selector: 'app-flashcard-result-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './flashcard-result-page.component.html',
  styleUrl: './flashcard-result-page.component.scss'
})

export class FlashcardResultPageComponent implements OnInit, OnDestroy {
  value: number = 50;
  isShowDropdown: boolean = true;
  userFlashcard: Flashcard = {} as Flashcard;

  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    // Thiết lập title cho trang
    window.document.title = 'Chi tiết flashcard';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.userFlashcard = {
      _id: 1,
      title: 'MKT208c',
      numberItems: '5 câu hỏi',
      items: [
        {
          _id: 1,
          question: 'Which is a good starting point for writing a blog?',
          type: 'single',
          userCorrect: true,
          answer: [
            {
              _id: 1,
              content:
                'Our target audience is so overwhelmed with much information, so you can start with a filter and focus blog',
              isChoiced: true,
              rightAnswer: true,
            },
            {
              _id: 2,
              content:
                'Our target audience is very demanding, so you should be genius to impress them',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 3,
              content:
                'Our target audience is very smart, so try to be smarter than them',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 4,
              content:
                'Writing blog is too traditional, it is not relevant in social marketing',
              isChoiced: false,
              rightAnswer: false,
            },
          ],
          rightAnswer: [
            {
              _id: 1,
              content:
                'Our target audience is so overwhelmed with much information, so you can start with a filter and focus blog',
            },
          ],
        },
        {
          _id: 2,
          question:
            'Display ads, magazine ads, acquisition programs, endorsements, affiliate program, pay-per-click, banner ads are examples of',
          type: 'single',
          userCorrect: false,
          answer: [
            {
              _id: 1,
              content: 'owned media',
              isChoiced: true,
              rightAnswer: false,
            },
            {
              _id: 2,
              content: 'paid media',
              isChoiced: false,
              rightAnswer: true,
            },
            {
              _id: 3,
              content: 'earned media',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 4,
              content: 'traditional media',
              isChoiced: false,
              rightAnswer: false,
            },
          ],
          rightAnswer: [
            {
              _id: 2,
              content: 'paid media',
            },
          ],
        },
        {
          _id: 3,
          question:
            'In Social marketing budget, there are four areas as follows, except:',
          type: 'single',
          userCorrect: true,
          answer: [
            {
              _id: 1,
              content: 'Empowering',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 2,
              content: 'Technology',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 3,
              content: 'Marketing program',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 4,
              content: 'Production',
              isChoiced: true,
              rightAnswer: true,
            },
          ],
          rightAnswer: [
            {
              _id: 4,
              content: 'Production',
            },
          ],
        },
        {
          _id: 4,
          question:
            'Which of the following are tools for Search Analytics? Check all that apply.',
          type: 'multiple',
          userCorrect: true,
          answer: [
            {
              _id: 1,
              content: 'Google Trends',
              isChoiced: true,
              rightAnswer: true,
            },
            {
              _id: 2,
              content: 'Keyhole.co',
              isChoiced: true,
              rightAnswer: true,
            },
            {
              _id: 3,
              content: 'Boardreader',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 4,
              content: 'Answer the Public',
              isChoiced: true,
              rightAnswer: true,
            },
          ],
          rightAnswer: [
            {
              _id: 1,
              content: 'Google Trends',
            },
            {
              _id: 2,
              content: 'Keyhole.co',
            },
            {
              _id: 4,
              content: 'Answer the Public',
            },
          ],
        },
        {
          _id: 5,
          question:
            'If you want to develop a great blog, you should avoid .......',
          type: 'single',
          userCorrect: false,
          answer: [
            {
              _id: 1,
              content: 'Using Google Suggest for finding suitable topics',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 2,
              content: 'having a great headline',
              isChoiced: false,
              rightAnswer: false,
            },
            {
              _id: 3,
              content: 'using images',
              isChoiced: true,
              rightAnswer: false,
            },
            {
              _id: 4,
              content: 'writing a lot of long paragraphs',
              isChoiced: false,
              rightAnswer: true,
            },
          ],
          rightAnswer: [
            {
              _id: 4,
              content: 'writing a lot of long paragraphs',
            },
          ],
        },
      ],
    };
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
