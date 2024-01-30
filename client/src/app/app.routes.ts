import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/layout/default/default.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { LearningCourseComponent } from './pages/learning-course/learning-course.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'detail/:id', component: DetailPageComponent },
      { path: 'profile/:id', component: ProfilePageComponent}
    ],
  },
  {
    path: 'learning-course/:id/:contennt_url',
    component: LearningCourseComponent,
  },
];
