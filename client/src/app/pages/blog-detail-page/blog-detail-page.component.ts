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
import { DialogBroadcastService } from '../../cores/services/dialog-broadcast.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-blog-detail-page',
  standalone: true,
  imports: [SharedModule, HeaderComponent, EditorModule],
  templateUrl: './blog-detail-page.component.html',
  styleUrl: './blog-detail-page.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class BlogDetailPageComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  public blogId: string | null = null;
  public blogDetail!: Blog;
  public sidebarComment: boolean = false;
  public userInfo!: User;
  public toggleEditor: boolean = false;
  public editorContentComment: string = '';
  public editorUpdateComment: string = '';
  public editorVisible: { [key: string]: boolean } = {};
  public editorReplyComment: string = '';
  public editorVisibleReplyComment: { [key: string]: boolean } = {};
  public showRepliesComment: { [key: string]: boolean } = {};

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
    private readonly sharedService: SharedService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
      return `vài giây trước`;
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
  likeorUnLikeComment(commentId: any) {
    try {
      const likeCommentSubs$ = this.commentService
        .likeOrUnLikeComment(commentId)
        .subscribe({
          next: (res: any) => {
            if (res && res.status === 200) {
              this.inItForm();
            }
          },
        });
    } catch (error) {}

    // this.dialogBroadcastService.broadcastDialog({
    //   header: 'Like bình luận',
    //   message: 'Tính năng này đang trong quá trình xây dựng',
    //   type: 'info',
    //   display: true,
    // });
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

  toggleEditorUpdateCommentFunc(commentId: number, currentComment: any) {
    // Nếu chưa có trạng thái cho comment này, mặc định là false
    if (this.editorVisible[commentId] === undefined) {
      this.editorVisible[commentId] = false;
    }
    // Toggle trạng thái hiển thị
    // Lưu giá trị comment hiện tại vào biến editorUpdateComment
    this.editorUpdateComment = currentComment;
    this.editorVisible[commentId] = !this.editorVisible[commentId];

    // Tắt visible editor reply comment
    this.editorVisibleReplyComment[commentId] = false;
  }

  confirm(comment_id: any) {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        const deleteCommentSubs$ = this.commentService
          .deleteComment(comment_id)
          .subscribe({
            next: (res: any) => {
              if (res && res.status === 200) {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Bình luận',
                  detail: 'Đã xóa thành công',
                  life: 3000,
                });
                this.inItForm();
              }
            },
          });
        this.subscriptions.push(deleteCommentSubs$);
      },
    });
  }

  // Sửa binh luận
  updateComment(commentId: any, currentToggle: any) {
    if (this.editorUpdateComment && this.userInfo) {
      const editCommentSubs$ = this.commentService
        .editComment(commentId, this.editorUpdateComment)
        .subscribe({
          next: (res: any) => {
            if (res && res.status === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Bình luận',
                detail: 'Cập nhật thành công',
                life: 3000,
              });
              this.inItForm();
              this.toggleEditorUpdateCommentFunc(currentToggle, '');
            }
          },
          error: (err: Error) => {
            console.log(err);
          },
        });
      this.subscriptions.push(editCommentSubs$);
    }
  }

  // Bật tắt editor phản hồi bình luận
  toggleEditorReplyCommentFunc(commentId: number, currentComment: any) {
    // Nếu chưa có trạng thái cho comment này, mặc định là false
    if (this.editorVisibleReplyComment[commentId] === undefined) {
      this.editorVisibleReplyComment[commentId] = false;
    }

    // Toggle trạng thái hiển thị
    // Lưu giá trị comment hiện tại vào biến editorUpdateComment
    this.editorReplyComment = currentComment;
    this.editorVisibleReplyComment[commentId] =
      !this.editorVisibleReplyComment[commentId];

    // Tắt visible editor comment
    this.editorVisible[commentId] = false;
  }

  // Gửi phản hồi bình luận
  sendReplyComment(commentId: any, currentComment: any) {
    if (this.editorReplyComment && this.userInfo) {
      const createReplyCommentSubs$ = this.commentService
        .replyComment(commentId, this.editorReplyComment)
        .subscribe({
          next: (res: any) => {
            if (res && res.status === 201) {
              this.messageService.add({
                severity: 'success',
                summary: 'Bình luận',
                detail: 'Gửi phản hồi thành công',
                life: 3000,
              });
              this.inItForm();
              this.editorReplyComment = '';
              this.editorVisibleReplyComment[commentId] = false;
              this.toggleEditorReplyCommentFunc(currentComment, '');
            }
          },
          error: (err: Error) => {
            console.log(err);
          },
        });
      this.subscriptions.push(createReplyCommentSubs$);
    }
  }

  // Bật tắt hiển thị phản hồi bình luận
  toggleRepliesComment(indexCurrent: any) {
    // Nếu chưa có trạng thái cho comment này, mặc định là false
    if (this.showRepliesComment[indexCurrent] === undefined) {
      this.showRepliesComment[indexCurrent] = false;
    }

    // Toggle trạng thái hiển thị
    this.showRepliesComment[indexCurrent] =
      !this.showRepliesComment[indexCurrent];
  }

  // Kiểm tra xem đã có thích bình luận hay chưa
  checkLikeComment(comment: Comment): boolean {
    console.log('comment', comment);

    if (this.userInfo && comment) {
      console.log('comment.interactions', comment.interactions);

      if (comment.interactions) {
        return comment.interactions.includes(this.userInfo._id);
      }
    }
    return false;
  }
}
