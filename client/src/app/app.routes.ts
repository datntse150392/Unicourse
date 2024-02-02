import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/layout/default/default.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { LearningCourseComponent } from './pages/learning-course/learning-course.component';
import { canLearningCourseGuard } from './cores/guards/can-learning-course.guard';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'course/:id', component: DetailPageComponent },
      { path: 'profile/:id', component: ProfilePageComponent },
    ],
  },
  {
    path: 'learning-course/:id/:contennt_url',
    component: LearningCourseComponent,
    canActivate: [canLearningCourseGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
