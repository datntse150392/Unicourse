import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
import { LecturerCardComponent } from './lecturer-card/lecturer-card.component';

@Component({
  selector: 'app-detail-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule, LecturerCardComponent],
  templateUrl: './detail-page.component.html',
  styleUrl: './detail-page.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailPageComponent implements OnInit {
  value: number = 19;
  starValue: number = 5;

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
