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
      this.track = this.course?.tracks.find((track: any) =>
        track.track_steps.find((step: any) => {
          if (step.content_url === this.conntent_url) {
            return track;
          }
        })
      );

      this.getNextLesson();
      this.getPrevLesson();
      this.mappingVideoUrlWithPlatform(this.trackSteps[this.indexLesson]);
    });
  }

  ngOnInit() {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.youTubePlayer) {
      this.youTubePlayer.destroy();
    }
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
    // Sort track processes by position
    this.trackProcess.sort((a: any, b: any) => a.track.position - b.track.position);
    
    // Find the first incomplete track
    this.currentTrack = this.trackProcess.find((trackProcess: TrackProcess) => trackProcess.completed === false);
    if (!this.currentTrack) {
      console.error('No incomplete track found');
      return;
    }
  
    // Find the first incomplete subtrack within the current track
    this.currentSubTrack = this.currentTrack.subTrackProgress.find((subTrack: TrackStepProcess) => subTrack.completed === false);
    if (!this.currentSubTrack) {
      console.error('No incomplete subtrack found');
      return;
    }
  
    // Sort course tracks by position
    this.course.tracks.sort((a: any, b: any) => a.position - b.position);
    
    // Find the current track based on the subtrack ID
    let tempCurrentSubTrack = this.currentSubTrack;
    this.track = this.course.tracks.find((track: any) =>
      track.track_steps.some((step: any) => step._id === tempCurrentSubTrack.subTrackId._id)
    );
  
    if (!this.track) {
      console.error('No track found for the current subtrack');
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
            console.log('Learning progress updated', res);
          },
          error: (err) => {
            console.error('Error updating learning progress', err);
          }
        });
      }
      // Navigate to the new URL
      this.router.navigate(['/learning-course', this.courseId, this.conntent_url]);
    }
  }
  
  

  checkCanMoveVideo(step: TrackStep, track: Track): void {
    this.course.tracks.sort((a: any, b: any) => a.position - b.position);
  
    const currentTrackIndex = track.position - 1;
    const currentStepIndex = step.position - 1;
  
    // If the current step is completed, allow navigation
    if (step.isCompleted) {
      this.router.navigate(['/learning-course', this.courseId, step.content_url]);
      return;
    }
  
    // Check if there is a previous track and if it is completed
    if (currentTrackIndex > 0) {
      const isPreviousTrackComplete = this.course.tracks[currentTrackIndex - 1].isCompleted;
      if (!isPreviousTrackComplete) {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Bạn cần hoàn thành track trước đó để tiếp tục bài học này',
        });
        return;
      }
    }
  
    // Check if there is a previous step in the current track and if it is completed
    if (currentStepIndex > 0) {
      const isPreviousStepComplete = this.course.tracks[currentTrackIndex].track_steps[currentStepIndex - 1].isCompleted;
      if (!isPreviousStepComplete) {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Bạn cần hoàn thành bài học trước đó để tiếp tục bài học này',
        });
        return;
      }
    }
  
    // If all checks pass, update learning progress in the background and navigate to the desired video
    this.userService.updateLearningProgress(this.enrollCourse._id, {
      trackId: track._id,
      subTrackId: step._id,
      courseId: this.courseId,
    }).subscribe({
      next: (res) => {
        console.log('Learning progress updated', res);
      },
      error: (err) => {
        console.error('Error updating learning progress', err);
      }
    });
  
    this.router.navigate(['/learning-course', this.courseId, step.content_url]);
  }
  
  
}
