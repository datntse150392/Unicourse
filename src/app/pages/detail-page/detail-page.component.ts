import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { LecturerCardComponent } from './lecturer-card/lecturer-card.component';
import { CourseListComponent } from './course-list/course-list.component';
import { Course, Feedback, Track, TrackStep } from '../../cores/models';
import { CourseService } from '../../cores/services';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter, switchMap } from 'rxjs';
import { ListTrackComponent } from './list-track/list-track.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    SharedModule,
    LecturerCardComponent,
    CourseListComponent,
    ListTrackComponent,
    CourseDetailComponent,
  ],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailPageComponent implements OnInit, OnDestroy {
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private el: ElementRef
  ) {
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0 });
  }
  courseId!: string;
  numberLesson: number = 0;
  numberChapter: number = 0;
  starValue: number = 5;
  files!: TreeNode[];

  public courseDetail!: Course;
  public coursesFree: Course[] = [];
  public courseSemester1: Course[] = [];
  public coursePro: Course[] = [];
  public blockedUI: boolean = true;
  public showCount: number = 6;
  public visible: boolean = false;
  public videoUrl: any = '';
  public totalTime: number = 0;
  public avgRating: any = 0;
  public listFeedback: Feedback[] = [];
  public visibleDialogListFeedback: boolean = false;

  private subscription = new Subscription();

  ngOnInit(): void {
    //Sử dụng switchMap để lấy giá trị của tham số 'id' từ paramMap
    this.route.paramMap
      .pipe(
        filter((params) => params.has('id')),
        switchMap(async (params) => params.get('id' as string))
      )
      .subscribe((id) => {
        this.courseId = id!;
        this.initForm(id!);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Config on init
  initForm(_id: string): void {
    const coursesFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        this.coursesFree = res.data;
        this.courseService.listcoursesPro = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    const courseSemester1Sub$ = this.courseService
      .getCoursebySemester(1)
      .subscribe({
        next: (res: any) => {
          this.courseSemester1 = res.data;
        },
        error: (err: any) => {
          console.log(err);
        },
      });

    // Lấy danh sách khóa học PRO
    const courseProSub$ = this.courseService.getCoursePro().subscribe({
      next: (res: any) => {
        this.coursePro = res.data;
        this.courseService.listcoursesPro = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    // Xử lý call API lấy course detail
    const courseDetailSub$ = this.courseService.getCourseDetail(_id).subscribe({
      next: async (res: any) => {
        this.courseDetail = res.data;
        // Sắp xếp track theo position
        this.courseDetail.tracks = this.courseDetail.tracks.sort(
          (a, b) => a.position - b.position
        );
        // Và thêm thuộc tính showBody cho mỗi track và tính tổng thời gian các track
        this.courseDetail.tracks.forEach((track) => {
          track.showBody = false;
          // Tính tổng thời gian các track
          this.totalTime += track.track_steps.reduce(
            (acc, cur) => acc + cur.duration,
            0
          );
        });
        // Tính trung bình rating (tổng rating / số lượng rating) lecture.lecture_info.feedback.rating
        this.avgRating =
          this.courseDetail.lecture.lecture_info.feedback.reduce(
            (acc, cur) => acc + cur.rating,
            0
          ) / this.courseDetail.lecture.lecture_info.feedback.length;

        // Sẽ lấy các feedback có trạng thái là 'active'
        this.courseDetail.lecture.lecture_info.feedback =
          this.courseDetail.lecture.lecture_info.feedback.filter(
            (feedback) => feedback.status === 'active'
          );

        window.document.title = this.courseDetail.title;
        if (this.courseDetail && this.courseDetail?.tracks?.length > 0) {
          this.files = await this.mapToTreeNode(this.courseDetail.tracks);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.subscription.add(coursesFreeSub$);
    this.subscription.add(courseSemester1Sub$);
    this.subscription.add(courseProSub$);
    this.subscription.add(courseDetailSub$);

    setTimeout(() => {
      this.blockedUI = false;
    }, 1000);
  }

  // SERVICE XỬ LÝ DỮ LIỆU CHO COMPONENT

  // Xử lý mapping data Component TreeNode[]
  mapToTreeNode = async (tracks: Track[]): Promise<TreeNode<any>[]> => {
    const treeNodePromises = tracks.map(async (track: Track) => {
      const children: TreeNode[] = await this.mapTrackStepsToTreeNode(
        track.track_steps
      );
      return {
        key: track._id,
        label: track.chapterTitle,
        data: track,
        position: track.position,
        children: children,
      };
    });
    const treeNodes = await Promise.all(treeNodePromises);

    // Xử lý tính toán số lượng bài học và số lượng chương
    this.numberChapter = treeNodes.length;
    this.numberLesson = treeNodes.reduce(
      (acc, cur) => acc + cur.children!.length,
      0
    );

    // Xử lý sort track theo thuộc tính 'position'
    return treeNodes.sort((a, b) => a.position - b.position);
  };

  // Xử lý mapping node children của Component TreeNode
  mapTrackStepsToTreeNode = (track_steps: TrackStep[]): Promise<any[]> => {
    const array: any[] = [];
    const handlePush = (track_steps: TrackStep[]) => {
      track_steps.map((trackStep: TrackStep) => {
        array.push({
          key: trackStep.title,
          label: trackStep.title,
          data: trackStep.content_url,
          position: trackStep.position,
          icon: 'pi pi-video',
        });
      });
    };
    handlePush(track_steps);

    // Xử lý sort track theo thuộc tính 'position'
    array.sort((a, b) => a.position - b.position);

    return Promise.resolve(array);
  };

  // Hàm chuyển đổi giá trị sáng giờ
  // Ví dụ 71 phút sẽ là 1 giờ 11 phút
  convertToHour = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} giờ ${minutes} phút`;
  };

  showDialog(trackStep: TrackStep) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${trackStep.content_url}`
    );
    this.visible = true;
  }

  scrollToFeedback() {
    const feedbackSection =
      this.el.nativeElement.querySelector('#feedback-section');
    if (feedbackSection) {
      feedbackSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToLecture() {
    const lectureSection =
      this.el.nativeElement.querySelector('#lecture-section');
    if (lectureSection) {
      lectureSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Hàm xử lý hiển thị thời gian từ ngày tham gia hệ thống
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

  showDialogListFeedback(listFeedback: Feedback[]) {
    this.listFeedback = listFeedback;
    console.log(this.listFeedback);

    this.visibleDialogListFeedback = true;
  }
}
