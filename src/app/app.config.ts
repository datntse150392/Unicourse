import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { FirebaseOptions } from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './cores/interceptors/auth.interceptor';
import { errorInterceptor } from './cores/interceptors/error.interceptor';

// Setting Firebase Storage
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { MarkdownModule } from 'ngx-markdown';
import { IMAGE_CONFIG } from '@angular/common';

// Paypayl config

export const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCrH3nRPoIYgBtcCMdFwtu4IgayGz5EXps',
  authDomain: 'unicourse-f4020.firebaseapp.com',
  projectId: 'unicourse-f4020',
  storageBucket: 'unicourse-f4020.appspot.com',
  messagingSenderId: '571256265329',
  appId: '1:571256265329:web:1390beeaed0b4e767819d0',
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig),
      MessageService,
      BrowserAnimationsModule,
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideStorage(() => getStorage()),
      MarkdownModule.forRoot()
    ),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
};
