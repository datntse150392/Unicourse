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
import { FlashcardPageComponent } from './pages/flashcard-page/flashcard-page.component';
import { FlashcardDetailPageComponent } from './pages/flashcard-detail-page/flashcard-detail-page.component';
import { CoinBankingComponent } from './pages/coin-banking/coin-banking.component';
import { FlashcardResultPageComponent } from './pages/flashcard-result-page/flashcard-result-page.component';
import { TransactionHistoryPageComponent } from './pages/transaction-history-page/transaction-history-page.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { MaintenanceSystemComponent } from './pages/maintenance-system/maintenance-system.component';
import { PolicyPageComponent } from './pages/policy-page/policy-page.component';
import { SettingPersonalPageComponent } from './pages/setting-personal-page/setting-personal-page.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: DefaultComponent,
  //   children: [
  //     { path: '', component: LandingPageComponent },
  //     {
  //       path: 'course/:id',
  //       component: DetailPageComponent,
  //       canActivate: [viewCouruseDetailGuard],
  //     },
  //     {
  //       path: 'profile/:id',
  //       component: ProfilePageComponent,
  //       canActivate: [loginSystemGuard],
  //     },
  //     { path: 'blog', component: BlogPageComponent },
  //     { path: 'blog/:id', component: BlogDetailPageComponent },
  //     {
  //       path: 'profile/:id/cart',
  //       component: CartPageComponent,
  //       canActivate: [loginSystemGuard],
  //     },
  //     {
  //       path: 'uni-coins',
  //       component: UniCoinPageComponent,
  //     },
  //     {
  //       path: 'flashcard',
  //       component: FlashcardPageComponent,
  //     },
  //     {
  //       path: 'flashcard/:id',
  //       component: FlashcardDetailPageComponent,
  //     },
  //     {
  //       path: 'flashcard/:id/result',
  //       component: FlashcardResultPageComponent,
  //     },
  //     {
  //       path: 'coin-banking',
  //       component: CoinBankingComponent,
  //       canActivate: [loginSystemGuard],
  //     },
  //     {
  //       path: 'transaction-history',
  //       component: TransactionHistoryPageComponent,
  //       canActivate: [loginSystemGuard],
  //     },
  //     {
  //       path: 'contact-page',
  //       component: ContactPageComponent,
  //     },
  //     {
  //       path: 'about-us',
  //       component: AboutUsPageComponent,
  //     },
  //   ],
  // },
  // {
  //   path: 'learning-course/:id/:contennt_url',
  //   component: LearningCourseComponent,
  //   canActivate: [canLearningCourseGuard],
  // },
  // {
  //   path: 'new-post',
  //   component: NewPostComponent,
  //   canActivate: [loginSystemGuard],
  // },
  // {
  //   path: 'setting',
  //   component: SettingComponent,
  //   canActivate: [loginSystemGuard],
  //   children: [{ path: 'personal', component: SettingPersonalComponent }],
  // },
  // {
  //   path: 'chat-room/:id',
  //   component: ChatRoomPageComponent,
  //   canActivate: [loginSystemGuard],
  // },

  { path: 'policy', component: PolicyPageComponent },
  { path: 'user/close-account', component: SettingPersonalPageComponent },
  { path: '**', component: MaintenanceSystemComponent },
];
