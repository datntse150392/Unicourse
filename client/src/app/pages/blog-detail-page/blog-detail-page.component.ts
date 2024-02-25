import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import { BlogService, SharedService } from '../../cores/services';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Blog, Comment, User } from '../../cores/models';
import { DomSanitizer } from '@angular/platform-browser';
import { Sidebar } from 'primeng/sidebar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CommentService } from '../../cores/services/comment.service';
import { MenuItem } from 'primeng/api';
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent, EditorModule],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
})
export class BlogDetailPageComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  public blogId: string | null = null;
  public blogDetail!: Blog;
  public sidebarComment: boolean = false;
  public userInfo!: User;
  public toggleEditor: boolean = false;
  public editorContentComment: string = '';

  public isLikeBlog: boolean = false;

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  private subscriptions: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private readonly commentService: CommentService,
    private readonly dialogBroadcastService: DialogBroadcastService,
    private readonly sharedService: SharedService
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
    // Kiểm tra nếu user đăng nhập vào thì lấy thông tin user
    if (localStorage !== undefined) {
      if (localStorage.getItem('isLogin')) {
        this.userInfo = JSON.parse(localStorage.getItem('UserInfo') || '');
      }
    }
  }

  // CALL API getBlogByBlogId
  getBlogByBlogId(blogId: string) {
    // Call API here
    const getBlogDetailSubs$ = this.blogService.getBlogById(blogId).subscribe({
      next: (res: any) => {
        if (res && res.status === 200) {
          this.blogDetail = res.data;
          this.blogDetail.comment_obj = this.blogDetail.comment_obj.sort(
            (a: Comment, b: Comment) => (a.created_at > b.created_at ? -1 : 1)
          );
          if (this.userInfo) {
            this.blogDetail.like.map((item: any) => {
              if (item === this.userInfo._id) {
                this.isLikeBlog = true;
                console.log('isLikeBlog', this.isLikeBlog);
              }
            });
          }
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

  // Bật tắt editor
  toggleEditorComment() {
    this.toggleEditor = !this.toggleEditor;
  }

  // Gửi comment
  sendComment() {
    if (this.editorContentComment && this.userInfo) {
      const createCommentSubs$ = this.commentService
        .createComment(this.blogId || '', this.editorContentComment)
        .subscribe({
          next: (res: any) => {
            if (res && res.status === 201) {
              this.getBlogByBlogId(this.blogId || '');
              this.editorContentComment = '';
              this.toggleEditor = false;
              this.inItForm();
            }
          },
          error: (err: Error) => {
            console.log(err);
          },
        });
      this.subscriptions.push(createCommentSubs$);
    }
  }

  // Báo cáo bình luận
  reportComment() {
    // Call API here
    this.dialogBroadcastService.broadcastDialog({
      header: 'Báo cáo bình luận',
      message: 'Tính năng này đang trong quá trình xây dựng',
      type: 'info',
      display: true,
    });
  }

  // Like bình luận
  likeComment() {
    // Call API here
    this.dialogBroadcastService.broadcastDialog({
      header: 'Like bình luận',
      message: 'Tính năng này đang trong quá trình xây dựng',
      type: 'info',
      display: true,
    });
  }

  // Phản hồi bình luận
  replyComment() {
    // Call API here
    this.dialogBroadcastService.broadcastDialog({
      header: 'Phản hồi bình luận',
      message: 'Tính năng này đang trong quá trình xây dựng',
      type: 'info',
      display: true,
    });
  }

  // Like bài viết
  likeBlog() {
    if (this.blogId && this.userInfo) {
      const likeBlogSubs$ = this.blogService.likeBlog(this.blogId).subscribe({
        next: (res: any) => {
          if (res && res.status === 200) {
            this.inItForm();
          }
        },
        error: (err: Error) => {
          console.log(err);
        },
      });
      this.subscriptions.push(likeBlogSubs$);
    } else if (!this.userInfo) {
      this.sharedService.turnOnSignInDialog();
    }
  }

  // Unlike bài viết
  unlikeBlog() {
    if (this.blogId) {
      const unlikeBlogSubs$ = this.blogService
        .unlikeBlog(this.blogId)
        .subscribe({
          next: (res: any) => {
            if (res && res.status === 200) {
              this.isLikeBlog = false;
              this.inItForm();
            }
          },
          error: (err: Error) => {
            console.log(err);
          },
        });
      this.subscriptions.push(unlikeBlogSubs$);
    }
  }
}
