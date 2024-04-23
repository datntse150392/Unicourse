import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, User } from 'src/app/core/models';
import { CourseService, SharedService } from 'src/app/core/services';
import { SharedModule } from 'src/app/shared';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent {
    public courseDetail: Course;
    public userInfo: User;
    public courseId: string;

    private subscriptions: Subscription[] = [];
    constructor(
        private courseService: CourseService,
        private sharedService: SharedService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer
    ) {
        // Thiết lập tiêu đề cho trang
        window.document.title = 'Chi tiết khóa học';
        // Lấy thông tin user từ localStorage
        this.userInfo = this.sharedService.getUserInfo();
    }

    ngOnInit() {
        this.inItForm();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    inItForm() {
        this.route.paramMap.subscribe((params) => {
            this.courseId = params.get('id');
            console.log(this.courseId);
        });

        // Lấy thông tin khóa học theo courseId
        if (this.courseId) {
            const getDetailCourseSubs$ = this.courseService
                .getCourseById(this.courseId)
                .subscribe({
                    next: (res: any) => {
                        if (res && res.status === 200) {
                            this.courseDetail = res.data;
                        }
                    },
                });
            this.subscriptions.push(getDetailCourseSubs$);
        }
    }

    // Xử lý hiển thị thẻ video
    getVideoUrl(contentUrl: string): any {
        return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${contentUrl}`
        );
    }

    convertToHHMMSS(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        const remainingSeconds = remainingMinutes * 60;

        const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
        const minutesStr =
            remainingMinutes < 10
                ? `0${remainingMinutes}`
                : `${remainingMinutes}`;
        const secondsStr =
            remainingSeconds < 10
                ? `0${remainingSeconds}`
                : `${remainingSeconds}`;

        if (hours > 0) {
            return `${hoursStr}:${minutesStr}:${secondsStr}`;
        } else {
            return `${minutesStr}:${secondsStr}`;
        }
    }
}
