import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/layout/default/default.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { LearningCourseComponent } from './pages/learning-course/learning-course.component';
import { canLearningCourseGuard } from './cores/guards/can-learning-course.guard';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { viewCouruseDetailGuard } from './cores/guards/view-couruse-detail.guard';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { NewPostComponent } from './pages/new-post/new-post.component';
import { SettingComponent } from './shared/layout/setting/setting.component';
import { SettingPersonalComponent } from './pages/setting-personal/setting-personal.component';
import { BlogDetailPageComponent } from './pages/blog-detail-page/blog-detail-page.component';
import { loginSystemGuard } from './cores/guards/login-system.guard';
import { ChatRoomPageComponent } from './pages/chat-room-page/chat-room-page.component';
import { UniCoinPageComponent } from './pages/uni-coin-page/uni-coin-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: LandingPageComponent },
      {
        path: 'course/:id',
        component: DetailPageComponent,
        canActivate: [viewCouruseDetailGuard],
      },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        canActivate: [loginSystemGuard],
      },
      { path: 'blog', component: BlogPageComponent },
      { path: 'blog/:id', component: BlogDetailPageComponent },
      {
        path: 'profile/:id/cart',
        component: CartPageComponent,
        canActivate: [loginSystemGuard],
      },
      {
        path: 'uni-coins',
        component: UniCoinPageComponent,
      },
    ],
  },
  {
    path: 'learning-course/:id/:contennt_url',
    component: LearningCourseComponent,
    canActivate: [canLearningCourseGuard],
  },
  {
    path: 'new-post',
    component: NewPostComponent,
    canActivate: [loginSystemGuard],
  },
  {
    path: 'setting',
    component: SettingComponent,
    canActivate: [loginSystemGuard],
    children: [{ path: 'personal', component: SettingPersonalComponent }],
  },
  {
    path: 'chat-room/:id',
    component: ChatRoomPageComponent,
    canActivate: [loginSystemGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];