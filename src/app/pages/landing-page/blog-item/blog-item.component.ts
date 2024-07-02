import { Component, Input } from '@angular/core';
import { Blog } from '../../../cores/models';
import { SharedModule } from '../../../shared';

@Component({
  selector: 'app-blog-item',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss',
})
export class BlogItemComponent {
  @Input() blog!: Blog;

  constructor() {}

  ngOnInit() {}
}
