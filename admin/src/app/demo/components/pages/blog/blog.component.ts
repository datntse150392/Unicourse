import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Blog } from 'src/app/demo/api/blog';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BlogService } from 'src/app/demo/service';
import { Subscription } from 'rxjs';
import * as FileSaver from 'file-saver';

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
  blog!: Blog;
  private subscriptions: Subscription[] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(private customerService: CustomerService, private productService: ProductService, private blogService: BlogService) {
    // Thiết lập title cho trang
    window.document.title = 'Tổng hợp các bài viết tại Unicourse';
    // Scroll smooth to top lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();

    this.statuses = [
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' }
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

  saveBLog() {}

  // Xử lý CRUD Blog
  editBlog(blog: Blog) {
    this.blog = { ...blog };
    this.blogDialog = true;
  }

  deleteBlog(blog: Blog) {
      this.deleteBlogDialog = true;
      this.blog = { ...blog };
  }
}