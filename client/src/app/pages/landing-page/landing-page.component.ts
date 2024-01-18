import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { Subscription } from 'rxjs';
import { CourseService } from '../../cores/services';
import { Course } from '../../cores/models';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  public coursesFree: Course[] = [];
  public value = 5;

  private subscription = new Subscription();
  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    const coursesFreeSub$ = this.courseService.getCourseFree().subscribe({
      next: (res: any) => {
        this.coursesFree = res.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.subscription.add(coursesFreeSub$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
