import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { LecturerCardComponent } from './lecturer-card/lecturer-card.component';
import { CourseListComponent } from './course-list/course-list.component';
import { Course, Track, TrackStep } from '../../cores/models';
import { CourseService } from '../../cores/services';
import { ActivatedRoute } from '@angular/router';
import { Subscription, filter, switchMap } from 'rxjs';
import { ListTrackComponent } from './list-track/list-track.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    SharedModule,
    LecturerCardComponent,
    CourseListComponent,
    ListTrackComponent
  ],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailPageComponent implements OnInit, OnDestroy {
  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute
  ) { }
  courseId!: string;
  numberLesson: number = 0;
  numberChapter: number = 0;
  starValue: number = 5;
  files!: TreeNode[];

  public courseDetail!: Course;
  public coursesFree: Course[] = [];
  public courseSemester1: Course[] = [];
  public coursePro: Course[] = [];
  private subscription = new Subscription();

  ngOnInit(): void {
    //Sử dụng switchMap để lấy giá trị của tham số 'id' từ paramMap
    this.route.paramMap
      .pipe(
        filter(params => params.has('id')),
        switchMap(async (params) => params.get('id' as string))
      ).subscribe(id => {
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
      .getCoursebySemester('1')
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
  }


  // SERVICE XỬ LÝ DỮ LIỆU CHO COMPONENT

  // Xử lý mapping data Component TreeNode[]
  mapToTreeNode = async (tracks: Track[]): Promise<TreeNode<any>[]> => {
    const treeNodePromises = tracks.map(async (track: Track) => {
      const children: TreeNode[] = await this.mapTrackStepsToTreeNode(track.track_steps);
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
    this.numberLesson = treeNodes.reduce((acc, cur) => acc + cur.children!.length, 0);

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
    }
    handlePush(track_steps);

    // Xử lý sort track theo thuộc tính 'position'
    array.sort((a, b) => a.position - b.position);

    return Promise.resolve(array);
  }
}