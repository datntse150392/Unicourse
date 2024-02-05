import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
})
export class BlogPageComponent {}
