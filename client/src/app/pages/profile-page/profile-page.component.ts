import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components';
import { UserService } from '../../cores/services/user.service';
import { User } from '../../cores/models';
import { Subscription, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy{
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
    ) {
      // Thiết lặp title cho trang
    window.document.title = 'Unicourse - Nền Tảng Học Tập Trực Tuyến';
    // Scroll smooth lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  
  public userDetail!: User;
  public userId!: string;
  private subscription = new Subscription();
  public userCreatedTime!: string;

  ngOnInit(): void {
    //Sử dụng switchMap để lấy giá trị của tham số 'id' từ paramMap
    this.route.paramMap
      .pipe(
        filter(params => params.has('id')),
        switchMap(async (params) => params.get('id' as string))
      ).subscribe(id => {
        this.userId = id!;
        this.initForm(id!);
      });
  }

  // Config on init
  initForm(_id: string) {
    const userSub$ = this.userService.getUser(_id).subscribe({
      next: (res: any) => {
        this.userDetail = res.data;
        this.userCreatedTime = this.publishedAtString(this.userDetail.published_at);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
    this.subscription.add(userSub$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // hanle time since publication
  publishedAtString(published_at: string): string {
    const publishedAt: Date = new Date(published_at);
    const currentTime: Date = new Date();
    const timeDifference: number = currentTime.getTime() - publishedAt.getTime();
    const days: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes: number = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else if (minutes > 0) {
      return `${minutes} phút trước`;
    } else {
      return `vài phút trước`;
    }
  }
}
