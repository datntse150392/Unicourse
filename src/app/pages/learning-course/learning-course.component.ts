import { Component, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { CourseService, UserService } from '../../cores/services';
import { Subscription, catchError, forkJoin, of, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, EnrollCourse, Track, TrackProcess, TrackStep, TrackStepProcess, User } from '../../cores/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { environment } from '../../../environments/environment.development';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

interface TrackFlag {
  currentTrackIndex: number;
  currentStepIndex: number;
  hasStepCompletedInsideTrack: boolean; // Đánh dấu track có bài học hoàn thành
  isAllTracksCompleted: boolean
}

@Component({
  selector: 'app-learning-course',
  standalone: true,
  imports: [SharedModule, ChatBotComponent],
  templateUrl: './learning-course.component.html',
  styleUrls: ['./learning-course.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService],
})
export class LearningCourseComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement> | undefined;
  activeIndex: any[] = [];
  courseId!: string;
  course!: Course;
  conntent_url!: string;
  files!: TreeNode[];
  sizes!: any[];
  selectedSize: any = '';
  track: Track | undefined;
  trackSteps: TrackStep[] = [];
  nextLesson: string = '';
  previousLesson: string = '';
  indexLesson!: number;
  videoUrl: SafeResourceUrl | undefined;
  user!: User;
  public LOGO = environment.LOGO;

  // Variables cho việc check tiến độ học tập
  enrollCourse!: EnrollCourse;
  trackProcess!: TrackProcess[];
  subTrackProgress!: TrackStepProcess[];
  currentTrack: TrackProcess | undefined;
  currentSubTrack: TrackStepProcess | undefined;
  trackFlag!: TrackFlag;
  isLoadingStep: boolean = false;


  private subscriptions: Subscription[] = [];
  private youTubePlayer: any;

  constructor(
    public messageService: MessageService,
    private router: Router,
    private courseService: CourseService,
    private userService: UserService,
    private routeActive: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.routeActive.paramMap.subscribe((res: any) => {
      this.courseId = res.params.id;
      this.conntent_url = res.params.contennt_url;
      this.course?.tracks.map((track: any) => {
        track.showBody = false;
        track.track_steps.find((step: any) => {
          if (step.content_url === this.conntent_url) {
            track.showBody = true;
            this.track = track;
          }
        });
      });
      this.getNextLesson();
      this.getPrevLesson();
      this.mappingVideoUrlWithPlatform(this.trackSteps[this.indexLesson]);
    });
  }

  ngOnInit() {
    this.initData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.youTubePlayer) {
      this.youTubePlayer.destroy();
    }
  }

  initData() {
    // Lấy thông tin user
    this.user = JSON.parse(localStorage.getItem('UserInfo') || '{}');
    forkJoin({
      courseDetail: this.getCourseDetail(this.courseId),
      enrolledCourse: this.initDataEnrollCourse(this.user)
    }).subscribe({
      next: ({courseDetail, enrolledCourse}) => {
        this.mappingLearningProcess();
      },
      error: (err) => {
        console.error('Error loading data', err);
      }
    });
    this.sizes = [{ name: 'Large', class: 'p-treetable-lg' }];
  }

  isDirectVideo(): boolean {
    if (!this.videoUrl) return false;
    let videoUrlBoolean: string = this.videoUrl.toString();
    return (videoUrlBoolean).endsWith('.mp4');
  }

  private initDataEnrollCourse(user: User) {
    return this.userService.getEnrolledCourse(user._id).pipe(
      tap((res: any) => {
        if (res.status === 200 && res.data.length > 0) {
          this.enrollCourse = res.data.find(
            (enrollCourse: EnrollCourse) =>
              enrollCourse.course._id === this.courseId
          );
          this.trackProcess = this.enrollCourse.trackProgress;
        }
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  private getCourseDetail(courseId: string) {
    return this.courseService.getCourseDetail(courseId).pipe(
      tap((res: any) => {
        this.course = res.data;
        
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
        this.mappingVideoUrlWithPlatform(this.trackSteps[this.indexLesson]);
      }),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  getFilesystem(course: Course) {
    return Promise.resolve(this.getFileSystemNodesData(course));
  }

  getFileSystemNodesData(course: Course) {
    return course.tracks.map((track: Track) => ({
      data: {
        name: track.chapterTitle,
      },
      children: track.track_steps.map((step: TrackStep) => ({
        data: {
          name: `<p>${step.title}</p>`,
        },
      })),
    }));
  }

  getTrackSteps(course: Course) {
    let trackSteps: TrackStep[] = [];
    course?.tracks.forEach((track: Track) => {
      trackSteps = [...trackSteps, ...track.track_steps];
    });
    return trackSteps;
  }

  getNextLesson() {
    const index = this.trackSteps.findIndex(
      (step: TrackStep) => step.content_url == this.conntent_url
    );
    this.indexLesson = index;
    if (index < this.trackSteps.length - 1) {
      this.nextLesson = this.trackSteps[index + 1].content_url;
    }
  }

  getPrevLesson() {
    const index = this.trackSteps.findIndex(
      (step: TrackStep) => step.content_url == this.conntent_url
    );
    this.indexLesson = index;
    if (index > 0) {
      this.previousLesson = this.trackSteps[index - 1].content_url;
    }
  }

  handleMoveNextLesson(nextLesson: string) {
    this.trackProcess.forEach((track: TrackProcess) => {
        const step = track.subTrackProgress.find((subTrack: TrackStepProcess) => subTrack.subTrackId.content_url === nextLesson);
        if (step) {
            const stepItem: any = {
                ...step.subTrackId,
                isCompleted: step.completed,
            };
            this.checkCanMoveVideo(stepItem, track.track);
        }
    });
}


  convertToHour = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours} giờ ${minutes} phút`;
  };

  mappingVideoUrlWithPlatform(step: TrackStep) {
    switch (step?.platform) {
      case 'youtube':
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${step?.content_url}`
        );
        break;
      case 'backblaze':
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://f002.backblazeb2.com/file/UnicourseBucket/${step?.content_url}`
        );
        break;
      case 'google-drive':
        // Add video url corresponding
        break;
      default:
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${step?.content_url}`
        );
    }
  }

  mappingLearningProcess() {
    this.course.tracks.sort((a: any, b: any) => a.position - b.position);
    this.trackProcess.sort((a: any, b: any) => a.track.position - b.track.position);

    if (this.enrollCourse.completed) { // Nếu khóa học đã hoàn thành
      this.trackFlag = {
        currentTrackIndex: this.trackProcess.length - 1,
        currentStepIndex: this.trackProcess[this.trackProcess.length - 1].subTrackProgress.length - 1,
        hasStepCompletedInsideTrack: true,
        isAllTracksCompleted: this.enrollCourse.completed,
      };
      return;
    }
    
    // Init data for track flag
    // GIẢI THÍCH LOGIC:
    // - Đầu tiên, tìm track đầu tiên chưa hoàn thành
    // - Kiểm tra xem trong track đó có bài học nào đã hoàn thành chưa
    // - Nếu có, thì lấy ra bài học đó và gán vào trackFlag
    // - Nếu không, thì kiểm tra xem track đó có phải là track đầu tiên không
    // - Nếu là track đầu tiên, thì gán trackFlag là track đó và step đầu tiên
    // - Nếu không phải track đầu tiên, thì gán trackFlag là track trước đó và step cuối cùng của track đó
    let firstUncompletedTrack = this.trackProcess.find((track: TrackProcess) => !track.completed);
    firstUncompletedTrack ? this.subTrackProgress = firstUncompletedTrack.subTrackProgress : this.subTrackProgress = [];
    let isHasStepCompletedInsideTrack = firstUncompletedTrack?.subTrackProgress.some((subTrack: TrackStepProcess) => subTrack.completed);

    if (isHasStepCompletedInsideTrack && firstUncompletedTrack) {
      this.trackFlag = {
        currentTrackIndex: firstUncompletedTrack.track.position,
        currentStepIndex: firstUncompletedTrack.subTrackProgress.findIndex((subTrack: TrackStepProcess) => !subTrack.completed) - 1,
        hasStepCompletedInsideTrack: true,
        isAllTracksCompleted: false,
      };
    } else {
      let isTheFirstTrack = firstUncompletedTrack?.track.position === 1;
      if (isTheFirstTrack && firstUncompletedTrack) {
        this.trackFlag = {
          currentTrackIndex: firstUncompletedTrack.track.position,
          currentStepIndex: 1,
          hasStepCompletedInsideTrack: false,
          isAllTracksCompleted: false,
        };
      } else if (!isTheFirstTrack && firstUncompletedTrack) {
        this.trackFlag = {
          currentTrackIndex: firstUncompletedTrack.track.position - 1,
          currentStepIndex: firstUncompletedTrack.subTrackProgress.length,
          hasStepCompletedInsideTrack: false,
          isAllTracksCompleted: false,
        };
      }
    }

    // Gán dữ liệu trackflag vào currentTrack và currentSubTrack
    this.currentTrack = this.trackProcess[this.trackFlag.currentTrackIndex - 1];
    this.currentSubTrack = this.currentTrack.subTrackProgress[this.trackFlag.currentStepIndex - 1];
    this.track = this.course.tracks[this.trackFlag.currentTrackIndex - 1];

    if (!this.track) {
      return;
    }
  
    // Show body of the current track
    this.track.showBody = true;
  
    // Update completion status of tracks and steps
    this.course.tracks.forEach((item: Track) => {
      if (this.track) {
        item.isCompleted = this.track.position >= item.position;
        item.track_steps.forEach((step: TrackStep) => {
          if (this.currentSubTrack) {
            step.isCompleted = item.isCompleted && this.currentSubTrack.subTrackId.position >= step.position;
          }
        });
      } else {
        item.isCompleted = false;
        item.track_steps.forEach((step: TrackStep) => {
          step.isCompleted = false;
        });
      }
    });
  
    // Map video URL with platform and navigate to it
    if (this.currentSubTrack) {
      this.conntent_url = this.currentSubTrack.subTrackId.content_url;
      this.trackSteps = this.getTrackSteps(this.course);
      this.getNextLesson();
      this.getPrevLesson();
      this.mappingVideoUrlWithPlatform(this.trackSteps[this.indexLesson]);
  
      // Check if current subtrack is first in the track and is not completed, then update learning progress
      if (this.currentSubTrack.subTrackId.position === 1 && !this.currentSubTrack.completed) {
        this.userService.updateLearningProgress(this.enrollCourse._id, {
          trackId: this.track._id,
          subTrackId: this.currentSubTrack.subTrackId._id,
          courseId: this.courseId,
        }).subscribe({
          next: (res) => {
          },
          error: (err) => {
          }
        });
      }
      // Navigate to the new URL
      this.isLoadingStep = false;
      this.router.navigate(['/learning-course', this.courseId, this.conntent_url]);
    }
  }
  
  

  checkCanMoveVideo(step: TrackStep, track: Track): void {
    // If the current step is completed, allow navigation
    if (step.isCompleted && this.track) {
      this.router.navigate(['/learning-course', this.courseId, step.content_url]);
      return;
    }

    // LOGIC
    // - Track Flag hiện tại có đang chứa bài học chưa hoàn thành không? (2 trường hợp)
    // - Trường hợp 1: Track Flag hiện tại chứa bài học chưa hoàn thành
    // - Kiểm tra xem track move có nhỏ hơn track flag không
    // - Kiểm tra xem step move có nhỏ hơn step flag hoặc bằng step flag + 1 không
    // Trường hợp 2: Track Flag hiện tại đã hoàn thành và không chứa bài học nào chưa hoàn thành
    // - Kiểm tra xem track move có nhỏ hơn track flag hoặc bằng track flag + 1 không
    // - Kiểm tra xem step move có phải next track + 1 không

    let firstCondition: boolean;
    let secondCondition: boolean;
    if (this.trackFlag.hasStepCompletedInsideTrack) {
      firstCondition = track.position <= this.trackFlag.currentTrackIndex;
      secondCondition = step.position <= this.trackFlag.currentStepIndex || step.position === this.trackFlag.currentStepIndex + 1;
    } else {
      firstCondition = track.position <= this.trackFlag.currentTrackIndex || track.position === this.trackFlag.currentTrackIndex + 1;
      secondCondition = step.position === 1;
    }

    if (firstCondition && secondCondition) {
      this.isLoadingStep = true;
      this.conntent_url = step.content_url;
      this.userService.updateLearningProgress(this.enrollCourse._id, {
        trackId: track._id,
        subTrackId: step._id,
        courseId: this.courseId,
      }).subscribe({
        next: (res) => {
          this.initDataEnrollCourse(this.user).subscribe({
            next: (res) => {
              this.mappingLearningProcess();
            },
            error: (err) => {
              console.error('Error loading data', err);
            }
          }); // Update learning process
        },
        error: (err) => {}
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Bạn cần hoàn thành bài học trước đó để tiếp tục bài học này',
      });
    }
  }
}
