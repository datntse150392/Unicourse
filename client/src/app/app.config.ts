import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
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
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig),
      MessageService
    ),
  ],
};
