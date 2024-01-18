import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { LecturerCardComponent } from './lecturer-card/lecturer-card.component';
import { CourseListComponent } from './course-list/course-list.component';
import { Course } from '../../cores/models';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule, LecturerCardComponent, CourseListComponent],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailPageComponent implements OnInit {
  value: number = 19;
  starValue: number = 5;
  courses: Course[] = [
    {
      id: 1,
      image: './assets/images/course-1.png',
      title: 'Khóa học JPD123',
      description: 'Kiến thức các bài giảng của khóa JPD123 - CN4',
      price: 0,
    },
    {
      id: 2,
      image: './assets/images/course-2.png',
      title: 'Ôn ENW492c Cấp Tốc',
      description: 'Giúp pass môn trong vài buổi ôn',
      price: 350000,
    },
    {
      id: 3,
      image: './assets/images/course-2.png',
      title: 'Khóa học SDN302m',
      description: 'Viết Rest API chuẩn men với NodeJS',
      price: 350000,
    }
  ];

  files!: TreeNode[];

  constructor() { }

  /* Fake data */
  ngOnInit() {
    this.files = [
      {
        key: '0',
        label: '1. Lập trình JavaScript nâng cao Buổi 1,2 -Spring 2024',
        data: 'Documents Folder',
        children: [
          {
            key: '0-0',
            label: '1. Video buổi 1-2',
            data: 'Work Folder',
            icon: 'pi pi-video'
          }
        ]
      },
      {
        key: '0',
        label: '2. Lập trình JavaScript nâng cao Buổi 3,4 -Spring 2024',
        data: 'Documents Folder',
        children: [
          {
            key: '0-0',
            label: '2. Video buổi 3-4',
            data: 'Work Folder',
            icon: 'pi pi-video'
          }
        ]
      }
    ]
  }
}
