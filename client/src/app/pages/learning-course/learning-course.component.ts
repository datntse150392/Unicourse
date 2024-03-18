import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { CourseService } from '../../cores/services';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Course, Track, TrackStep } from '../../cores/models';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-learning-course',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './learning-course.component.html',
  styleUrl: './learning-course.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class LearningCourseComponent implements OnDestroy {
  activeIndex: any[] = [];
  courseId!: string;
  course!: Course;
  conntent_url!: string;
  files!: TreeNode[];
  sidebar: boolean = false;
  sizes!: any[];
  selectedSize: any = '';
  track: Track | undefined;
  trackSteps: TrackStep[] = [];
  nextLesson: string = '';
  previousLesson: string = '';
  indexLesson!: number;
  videoUrl!: any;

  private subScriptions: Subscription[] = [];
  constructor(
    private courseService: CourseService,
    private routeActive: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.routeActive.paramMap.subscribe((res: any) => {
      this.courseId = res.params.id;
      this.conntent_url = res.params.contennt_url;
      this.track = this.course?.tracks.find((track: any) =>
        track.track_steps.find((step: any) => {
          if (step.content_url === this.conntent_url) {
            return track;
          }
        })
      );
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.conntent_url}`
      );
      this.getNextLesson();
      this.getPrevLesson();
    });
  }

  ngOnInit() {
    this.getCourseDetail(this.courseId);
    this.sizes = [{ name: 'Large', class: 'p-treetable-lg' }];
  }

  ngOnDestroy(): void {
    this.subScriptions.forEach((sub) => sub.unsubscribe());
  }

  private getCourseDetail(courseId: string) {
    const getCourseDetailSub = this.courseService
      .getCourseDetail(courseId)
      .subscribe({
        next: (res: any) => {
          this.course = res.data;
          // Thiết lập title cho trang
          window.document.title = this.course.title;
          this.course.tracks.sort((a: any, b: any) => a.position - b.position);
          this.getFilesystem(this.course).then((files) => (this.files = files));
          this.track = this.course?.tracks.find((track: any) =>
            track.track_steps.find(
              (step: any) => step.content_url == this.conntent_url
            )
          );
          this.trackSteps = this.getTrackSteps(this.course);
          this.getNextLesson();
          this.getPrevLesson();
        },
        error: (err) => console.log(err),
      });
    this.subScriptions.push(getCourseDetailSub);
  }

  getFilesystem(course: Course) {
    return Promise.resolve(this.getFileSystemNodesData(course));
  }

  getFileSystemNodesData(course: Course) {
    return course.tracks.map((track: Track) => ({
      data: {
        name: track.chapterTitle,
      },
      // Track Step
      children: track.track_steps.map((step: TrackStep) => ({
        data: {
          name: `<p>${step.title}</p>`,
        },
      })),
    }));
  }

  // Hàm gộp các bài học thành 1 mảng
  getTrackSteps(course: Course) {
    let trackSteps: TrackStep[] = [];
    course?.tracks.forEach((track: Track) => {
      trackSteps = [...trackSteps, ...track.track_steps];
    });
    return trackSteps;
  }

  // Hàm thực hiện việc ấn kế tiếp bài học tiếp theo
  getNextLesson() {
    const index = this.trackSteps.findIndex(
      (step: TrackStep) => step.content_url == this.conntent_url
    );
    this.indexLesson = index;
    if (index < this.trackSteps.length - 1) {
      this.nextLesson = this.trackSteps[index + 1].content_url;
    }
  }

  // Hàm thực hiện việc ấn bài học trước đó
  getPrevLesson() {
    const index = this.trackSteps.findIndex(
      (step: TrackStep) => step.content_url == this.conntent_url
    );
    this.indexLesson = index;
    if (index > 0) {
      this.previousLesson = this.trackSteps[index - 1].content_url;
    }
  }

  // Bật tắt sidebar
  toggleSidebar() {
    this.sidebar = !this.sidebar;
    this.activeIndex = this.course.tracks.map(
      (track: Track) => track.position - 1
    );
  }

  convertToHHMMSS(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = Math.floor(remainingMinutes * 60);

    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const minutesStr =
      remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
    let secondsStr =
      remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    // Ensure secondsStr is always two digits or defaults to '00'
    secondsStr = secondsStr.length === 0 ? '00' : secondsStr.padStart(2, '0');

    return `${hoursStr}:${minutesStr}:00`;
  }
}
