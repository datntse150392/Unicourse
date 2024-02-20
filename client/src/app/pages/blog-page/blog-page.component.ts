import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { BlogService } from '../../cores/services';
import { Blog } from '../../cores/models';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
})
export class BlogPageComponent {
  public blogHighLight!: Blog[];
  public blogs!: Blog[];
  public blogsByPage!: Blog[];
  public first: number = 0;
  public rows: number = 6;
  public page!: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Tổng hợp các bài viết tại Unicourse';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
  }

  ngOndestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initForm() {
    const blogHighLightSubs$ = this.blogService
      .getHighLightBlog()
      .subscribe((res) => {
        this.blogHighLight = res.data;
      });

    const blogsSubs$ = this.blogService.getAllBlogs().subscribe({
      next: (res) => {
        this.blogs = res.data;
      },
    });

    // Lấy params page
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'];
      this.blogService.getBlogByPage(this.page).subscribe({
        next: (res) => {
          this.blogsByPage = res.data;
          // Scroll smooth to top lên đầu trang
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err: Error) => {
          console.log(err);
        },
      });
    });

    this.subscriptions.push(blogHighLightSubs$);
    this.subscriptions.push(blogsSubs$);
  }

  onPageChange(event: any) {
    this.router.navigate(['/blog'], {
      queryParams: {
        page: event.first + 1 === 1 ? event.first + 1 : event.first - 6 + 2,
      },
    });
  }
}
