import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/layout/default/default.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
export const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'detail', component: DetailPageComponent }
    ],
  },
];
