import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Subscription } from 'rxjs';
import { Course, User } from 'src/app/core/models';
import { CourseService, SharedService } from 'src/app/core/services';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
    templateUrl: './list-course.component.html',
})
export class ListCourseComponent implements OnInit {
    products: Product[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];

    public listMyCourse: Course[] = [];
    public userInfo: User;
    public: number = 5;

    private subscriptions: Subscription[] = [];

    constructor(
        private productService: ProductService,
        private courseService: CourseService,
        private sharedService: SharedService
    ) {
        // Thiết lập tiêu đề cho trang
        window.document.title = 'Danh sách khóa học | Các khóa học của bạn';
        // Lấy thông tin user từ localStorage
        this.userInfo = this.sharedService.getUserInfo();
    }

    ngOnInit() {
        this.initForm();
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' },
        ];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' },
        ];

        this.sortOptions = [
            { label: 'Giá giảm dần', value: '!price' },
            { label: 'Giá tăng dần', value: 'price' },
        ];
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    initForm() {
        // Lấy danh sách khóa học của giảng viên
        const subGetCourseByLectureIdSubs$ = this.courseService
            .getCourseByLectureId(this.userInfo._id)
            .subscribe({
                next: (res: any) => {
                    if (res && res.status === 200) {
                        this.listMyCourse = res.data;
                    }
                },
            });
        this.subscriptions.push(subGetCourseByLectureIdSubs$);
    }

    onSortChange(event: any) {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }
}
