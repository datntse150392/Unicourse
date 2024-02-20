import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { BlogService } from '../../cores/services';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Blog } from '../../cores/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent {
  public blogId: string | null = null;
  public blogDetail!: Blog;

  private subscriptions: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Chi tiết bài viết';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.inItForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  inItForm() {
    this.route.paramMap.subscribe((params) => {
      this.blogId = params.get('id');
      if (this.blogId) {
        this.getBlogByBlogId(this.blogId);
      }
    });
  }

  // CALL API getBlogByBlogId
  getBlogByBlogId(blogId: string) {
    // Call API here
    const getBlogDetailSubs$ = this.blogService.getBlogById(blogId).subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.blogDetail = res.data;
        }
      },
      error: (err: Error) => {
        console.log(err);
      },
    });
    this.subscriptions.push(getBlogDetailSubs$);
  }

  // Sanitize content
  sanitizeContent(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // Hanle time since publication
  publishedAtString(published_at: Date): string {
    const publishedAt: Date = new Date(published_at);
    const currentTime: Date = new Date();
    const timeDifference: number =
      currentTime.getTime() - publishedAt.getTime();
    const days: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes: number = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return `vài phút trước`;
    }
  }
}
