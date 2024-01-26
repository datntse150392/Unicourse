import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { CourseService } from '../../cores/services';
import { Subscription, map } from 'rxjs';
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
  courseId!: string;
  course!: Course;
  conntent_url!: string;
  files!: TreeNode[];
  sidebar: boolean = false;
  sizes!: any[];
  selectedSize: any = '';
  track: Track | undefined
  videoUrl!: any;

  private subScriptions: Subscription[] = [];
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe((res: any) => {
      this.courseId = res.params.id;
      this.conntent_url = res.params.contennt_url;
      this.track = this.course?.tracks.find((track: any) => track.track_steps.find((step: any) => step.content_url == this.conntent_url));
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.conntent_url}`
      );
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
          this.course.tracks.sort((a: any, b: any) => a.position - b.position);
          this.getFilesystem(this.course).then((files) => (this.files = files));
          this.track = this.course?.tracks.find((track: any) => track.track_steps.find((step: any) => step.content_url == this.conntent_url));
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
}
