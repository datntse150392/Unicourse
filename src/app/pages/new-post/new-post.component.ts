import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SharedModule } from '../../shared';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../cores/models';
import { AuthService, BlogService } from '../../cores/services';
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [SharedModule, EditorModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
  providers: [MessageService],
})
export class NewPostComponent {
  Logo: string = environment.LOGO;
  editorContent!: string; // Khai báo biến editorContent
  preview: boolean = true;
  title!: string;
  user!: User;
  items: MenuItem[] | undefined;
  public suggestions: string[] = [];
  public isRecommend: boolean = false;

  private subscriptions: Subscription[] = [];
  constructor(
    private sanitizer: DomSanitizer,
    private blogService: BlogService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  initForm() {
    if (localStorage !== undefined) {
      const user = localStorage.getItem('UserInfo');
      if (user !== null) {
        this.user = JSON.parse(user);
        console.log(this.user);
      }
    }
    this.configItemMenu();
  }

  configItemMenu() {
    this.items = [
      {
        label: 'Tài khoản',
        items: [
          {
            label: 'Trang cá nhân',
            command: () => {
              this.redirectToProfile();
            },
          },
          {
            label: 'Giỏ hàng',
            command: () => {
              this.redirectToCart();
            },
          },
        ],
      },
      {
        label: 'Cài đặt',
        items: [
          {
            label: 'Cài đặt',
            command: () => {
              this.redirectToSettingPersonal();
            },
          },
          {
            label: 'Đăng xuất',
            command: () => {
              this.logout();
            },
          },
        ],
      },
    ];
  }

  logout() {
    this.authService.doLogout();
    // Đăng xuất thì xóa hết dữ liệu trong localStorage
    localStorage.clear();
    window.location.reload();
  }

  redirectToProfile() {
    this.router.navigate([`/profile/${this.user._id}`]);
  }

  redirectToCart() {
    this.router.navigate([`profile/${this.user?._id}/cart`]);
  }

  redirectToSettingPersonal() {
    this.router.navigate([`/setting/personal`]);
  }

  togglePreview() {
    this.preview = !this.preview;
  }

  sanitizeContent(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // Xử lí tạo một blog mới
  handleCreateBlog() {
    const newBlog = {
      title: this.title,
      content: this.editorContent,
    };

    const createBlogSubs$ = this.blogService.createBlog(newBlog).subscribe({
      next: (res: any) => {
        if (res && res.status === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Tạo blog thành công',
          });
          this.editorContent = '';
          this.title = '';
          if (this.preview === false) {
            this.togglePreview();
          }
        }
      },
      error: (err: Error) => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Thất bại',
          detail: 'Quá tải, vui lòng chờ các bài blog trước được duyệt',
        });
      },
    });
    this.subscriptions.push(createBlogSubs$);
  }

  getSuggestions() {
    this.isRecommend = true;
    this.blogService.generateBlogAI(this.title).subscribe({
      next: (response) => {
        this.editorContent = response.data;
        this.isRecommend = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể lấy gợi ý từ AI',
        });
        this.isRecommend = false;
      },
    });
  }
}
