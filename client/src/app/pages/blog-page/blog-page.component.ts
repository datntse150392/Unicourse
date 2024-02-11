import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { BlogService } from '../../cores/services';
import { Blog } from '../../cores/models';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
})
export class BlogPageComponent {
  public blogHighLight!: Blog[];

  private subscriptions: Subscription[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.initForm();
  }

  ngOndestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  initForm() {
    const blogHighLightSubs$ = this.blogService
      .getHighLightBlog()
      .subscribe((res) => {
        this.blogHighLight = res.data;
        console.log(this.blogHighLight);
      });
    this.subscriptions.push(blogHighLightSubs$);
  }
}
