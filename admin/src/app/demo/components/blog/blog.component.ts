import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { Blog, UserBlog, Tags, Tag } from 'src/app/demo/api/blog';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BlogService } from 'src/app/demo/service';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadEvent } from 'primeng/fileupload';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { User } from '../../api/user';
import { GalleriaThumbnails } from 'primeng/galleria';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface StatusOption {

}


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class BlogComponent {
  @ViewChild('filter') filter!: ElementRef;
  private subscriptions: Subscription[] = [];

  user!: User;
  blogDialog: boolean = false;
  deleteBlogDialog: boolean = false;
  statuses: any[] = [];
  loading: boolean = true;
  blogs!: Blog[] | undefined;
  blog!: Blog | any;
  tags: Tag[] = Tags;
  selectedTags!: Tag[]
  statusOptions!: StatusOption[];
  selectedStatus: String = '';
  blogContent!: String;
  preview: boolean = true;
  updateBlog!: Blog; // Biến lưu trữ new blog
  originalBlog!: Blog; // Biến lưu trữ blog ban đầu
  disableSubmitBtn: boolean = false; // Biến kiểm tra xem có thể submit form không
  isUpdateThumbnail: boolean = false; // Biến kiểm tra xem có thể update thumbnail không

  constructor(
    private blogService: BlogService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
    // Thiết lập title cho trang
    window.document.title = 'Tổng hợp các bài viết tại Unicourse';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
    this.statusOptions = [
      { name: 'Đang chờ', value: 'pending' },
      { name: 'Duyệt', value: 'approved' },
      { name: 'Hủy', value: 'rejected' }
    ];
  }

  // Khởi tạo data
  initForm() {
    const blogsSubs$ = this.blogService.getAllBlogs().subscribe({
      next: (res) => {
        this.blogs = res.data;
        this.loading = false;
      },
    });
    this.subscriptions.push(blogsSubs$);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  // Xử lý xuất file
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.blogs);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'blogs');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // Mở dialog chỉnh sửa blog: Khởi tạo biến originalBlog và updateBlog
  popupEditDialog(blog: Blog) {
    this.blog = { ...blog }; // Khởi tạo giá trị ban đầu cho blog
    this.selectedTags = blog.tags.length === 0 ? [{name: 'Chọn nhãn dán', code: 'none', color: '#CCCCCC'}] : blog.tags; // Khởi tạo giá trị ban đầu cho tags
    this.selectedStatus = blog.status; // Khởi tạo giá trị ban đầu cho status
    this.blogContent = blog.content; // Khởi tạo giá trị ban đầu cho content
    this.updateBlog = { ...blog };
    this.originalBlog = { ...blog };
    this.isUpdateThumbnail = false;
    this.blogDialog = true;
  }

  // Xử lý xóa blog
  deleteBlog(blog: Blog) {
    this.deleteBlogDialog = true;
    this.blog = { ...blog };
  }

  confirmDelete() {
    this.blogService.deleteBlog(this.blog._id).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Xóa bài viết thành công' });
          this.deleteBlogDialog = false;
          this.initForm();
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Xóa bài viết thất bại' });
        this.deleteBlogDialog = false;
      }
    });
  }

  // Xử lý thay đổi value blog
  onBlogChange(value: any, name: string) {
    this.updateBlog = { ...this.blog, [name]: value };
    // Check field là content, title null thì set biến disableSubmitBtn = true
    if (this.updateBlog.content === '' || this.updateBlog.title === '') {
      this.disableSubmitBtn = true;
    } else {
      this.disableSubmitBtn = false;
    }
  }

  // Xử lý lưu thay đổi blog -> call API update blog
  saveBLog() {
    this.blogService.updateBlog(this.updateBlog).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật bài viết thành công' });
          this.blogDialog = false;
          this.blog = { ...this.updateBlog };
          this.isUpdateThumbnail = false;
          this.initForm();
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật bài viết thất bại' });
        this.blogDialog = false;
        this.blog = { ...this.originalBlog };
        this.isUpdateThumbnail = false;
        this.initForm();
      }
    });
  }

  // Xử lý close dialog chỉnh sửa
  hideDialog() {
    this.blog = this.originalBlog;
    this.blogDialog = false;
  }

  // Sanitize content: Chuyển content từ string sang HTML
  sanitizeContent(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  
  // Xử lý preview blog
  togglePreview() {
    this.preview = !this.preview;
  }

  // Xử lý upload ảnh thumnaill
  storage = inject(Storage);
  async onUpload($event: FileUploadEvent) {
    try {
      const storageRef = ref(this.storage, 'Blog/' + $event.files[0].name);
      const uploadTask = await uploadBytes(storageRef, $event.files[0]);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      this.blog.thumbnail_url = downloadUrl;
      this.onBlogChange(downloadUrl, 'thumbnail_url')
      this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Upload ảnh thành công' });
      this.isUpdateThumbnail = true;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Upload ảnh thất bại' });
      this.isUpdateThumbnail = false;
    }
  }
}