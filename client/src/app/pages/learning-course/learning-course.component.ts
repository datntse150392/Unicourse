import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { TreeNode } from 'primeng/api';
@Component({
  selector: 'app-learning-course',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './learning-course.component.html',
  styleUrl: './learning-course.component.scss',
})
export class LearningCourseComponent {
  files!: TreeNode[];

  constructor() {}

  ngOnInit() {
    this.getFiles().then((data) => (this.files = data));
  }

  expandAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.files.forEach((node) => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  getTreeNodesData() {
    return [
      {
        key: '0',
        label: '1. Bắt đầu',
        data: 'Documents Folder',
        children: [
          {
            key: '1-0',
            label: '9. Template engine (handlebars)',
            icon: 'pi pi-video',
            data: 'Meeting',
          },
        ],
      },
      {
        key: '1',
        label: '2. Kiến thức cốt lõi',
        data: 'Events Folder',
        children: [
          {
            key: '1-0',
            label: '9. Template engine (handlebars)',
            icon: 'pi pi-video',
            data: 'Meeting',
          },
        ],
      },
    ];
  }

  getFiles() {
    return Promise.resolve(this.getTreeNodesData());
  }
}
