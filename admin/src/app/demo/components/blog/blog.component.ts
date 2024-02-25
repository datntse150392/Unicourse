import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Blog, jsonData, UserBlog, Tags, Tag } from 'src/app/demo/api/blog';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BlogService } from 'src/app/demo/service';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';

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
  blogDialog: boolean = false;
  deleteBlogDialog: boolean = false;
  statuses: any[] = [];
  loading: boolean = true;
  blogs!: Blog[] | undefined;
  blog!: Blog | any;
  uploadedFiles: any;
  tags: Tag[] = Tags;
  selectedTags!: Tag[]
  statusOptions!: StatusOption[];
  selectedStatus: String = '';
  blogContent!: String;
  preview: boolean = true;
  private subscriptions: Subscription[] = [];
  @ViewChild('filter') filter!: ElementRef;
  updateBlog!: Blog; // Biến lưu trữ new blog
  originalBlog!: Blog; // Biến lưu trữ blog ban đầu

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
    console.log("BLog", blog)
    this.blog = { ...blog }; // Khởi tạo giá trị ban đầu cho blog
    this.selectedTags = blog.tags[0].name === '' ? [{name: 'Chọn nhãn dán', code: 'none', color: ''}] : blog.tags; // Khởi tạo giá trị ban đầu cho tags
    this.selectedStatus = blog.status; // Khởi tạo giá trị ban đầu cho status
    this.blogContent = blog.content; // Khởi tạo giá trị ban đầu cho content
    this.updateBlog = { ...blog };
    this.originalBlog = { ...blog };
    this.blogDialog = true;
  }

  // Xử lý xóa blog
  deleteBlog(blog: Blog) {
    this.deleteBlogDialog = true;
    this.blog = { ...blog };
  }

  // Xử lý thay đổi value blog
  onBlogChange(value: any, name: string) {
    this.updateBlog = { ...this.blog, [name]: value };
    console.log(this.updateBlog)
  }

  // Xử lý lưu thay đổi blog -> call API update blog
  saveBLog() {
    this.blogService.updateBlog(this.updateBlog).subscribe({
      next: (res) => {
        if (res && res.status === 200) {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật bài viết thành công' });
          this.blogDialog = false;
          this.blog = { ...this.updateBlog };
        }
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Cập nhật bài viết thất bại' });
        this.blogDialog = false;
        this.blog = { ...this.originalBlog };
      }
    });
  }

  // Xử lý close dialog chỉnh sửa
  hideDialog() {
    this.blog = this.originalBlog;
    this.blogDialog = false;
  }

  // Xử lý upload ảnh thumbnail
  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles = file;
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  // Sanitize content: Chuyển content từ string sang HTML
  sanitizeContent(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  
  // Xử lý preview blog
  togglePreview() {
    this.preview = !this.preview;
  }
}