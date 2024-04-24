import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Course, User, Track, TrackStep, TrackStepCreate } from 'src/app/core/models';
import { CourseService, SharedService, TrackStepService } from 'src/app/core/services';
import { SharedModule } from 'src/app/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, SharedModule],
    templateUrl: './course-detail.component.html',
    styleUrl: './course-detail.component.scss',
})
export class CourseDetailComponent implements OnInit{
    public courseDetail: Course;
    public userInfo: User;
    public courseId: string;
    public blockedUI: boolean = false;

    // Khai báo upload file
    newTrackStep: TrackStepCreate = {} as TrackStepCreate;
    uploadedFiles: any[] = [];
    valSelect1: string = "";
    trackSelect: string = "";
    formGroup!: FormGroup;
    uploadOptions: any[] = [
        { label: 'Google Drive', value: 'googleDrive' },
        { label: 'Youtube', value: 'youtube' }
    ];
    youtubeUrl: string = '';
    videoId: string = '';

    private subscriptions: Subscription[] = [];
    constructor(
        private courseService: CourseService,
        private sharedService: SharedService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private messageService: MessageService,
        private trackStepService: TrackStepService,
    ) {
        // Thiết lập tiêu đề cho trang
        window.document.title = 'Chi tiết khóa học';
        // Lấy thông tin user từ localStorage
        this.userInfo = this.sharedService.getUserInfo();
    }

    ngOnInit() {
        this.inItForm();
        this.valSelect1 = 'googleDrive';
        this.formGroup = new FormGroup({
            value: new FormControl('googleDrive')
        });
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


    // LOGIC XỬ LÝ FILE

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    // Xử lý khi chọn loại upload
    onChangeUploadType(event: any, track: Track) {
        console.log(track);
        this.valSelect1 = event.value;
        this.trackSelect = track._id;
    }

    onBasicUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
    }

    // 1. UPLOAD BY YOUTUBE
    // Xử lý lấy Id dựa trên link url
    extractVideoId(): void {
        const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const match = this.youtubeUrl.match(youtubeRegex);
        if (match && match[1]) {
            this.videoId = match[1];
        } else {
            this.videoId = '';
        }
    }

    // Xử lý upload Track video
    uploadTrackVideo() {
        if (this.valSelect1 === 'youtube' && this.youtubeUrl !== '' && this.videoId !== '' && this.trackSelect !== '') {
            this.blockedUI = true;
            this.newTrackStep.content_url = this.videoId;
            this.newTrackStep.type = 'video';
            this.newTrackStep.platform = 'youtube';
            this.newTrackStep.video_url = this.youtubeUrl;
            this.newTrackStep.position = this.courseDetail.tracks.find(track => track._id === this.trackSelect).track_steps.length + 1;
            this.trackStepService.addTrackStep(this.courseId, this.trackSelect, this.newTrackStep).subscribe({
                next: (res: any) => {
                    if (res && res.status === 201) {
                        this.blockedUI = false;
                        this.showToast('success', 'Thành công', 'Upload video thành công');
                        this.inItForm();
                        this.resetValues();
                    } else {
                        this.blockedUI = false;
                        this.resetValues();
                        this.showToast('error', 'Lỗi', 'Upload video không thành công')
                    }
                },
                error: (error) => {
                    this.blockedUI = false;
                    this.resetValues();
                    this.showToast('error', 'Lỗi', 'Upload video không thành công')
                }
            });
        }
    }

    resetValues() {
        this.youtubeUrl = '';
        this.videoId = '';
        this.trackSelect = '';
        this.newTrackStep = {} as TrackStepCreate;
    }

    showToast(severity, summary, detail) {
        this.messageService.add({ key: 'tst', severity: severity, summary: summary, detail: detail });
    }

}
