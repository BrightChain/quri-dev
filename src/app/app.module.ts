// ---- Angular base requirements
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ---- App modules and components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { environment } from '../environments/environment';
import { LoggingService } from './services/logging.service';

// ---- Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

// ---- More Angular functions
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  AppCheck,
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';

import { ServiceWorkerModule } from '@angular/service-worker';

import { HttpClientModule } from '@angular/common/http';
import { ConfigurationHelper } from '../configurationHelper';
import { firebaseAppCheckConfig } from '../firebaseAppCheckConfig';
import { FirebaseApp } from 'firebase/app';

let _appRef: FirebaseApp | null = null;
const _getAppRef = (): FirebaseApp => {
  if (_appRef !== null) {
    return _appRef;
  }
  const configPair = ConfigurationHelper.EnsureConfiguration();
  const app = initializeApp(configPair.options);
  environment.firebase = configPair.options;
  _appRef = app;
  return app;
};

const allFeatures: Array<string> = [
  'auth',
  'database',
  'firestore',
  'functions',
  'messaging',
  'storage',
  'analytics',
  'remoteConfig',
  'performance',
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    DashboardComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideAnalytics(() => getAnalytics()),
    provideFirebaseApp(() => {
      console.debug('provideFirebaseApp');
      const configPair = ConfigurationHelper.EnsureConfiguration();
      const app = initializeApp(configPair.options);
      environment.firebase = configPair.options;
      _appRef = app;
      return app;
    }),
    provideAppCheck((): AppCheck => {
      (<any>self).FIREBASE_APPCHECK_DEBUG_TOKEN = !environment.production;
      const appCheck: AppCheck = initializeAppCheck(_getAppRef(), {
        provider: new ReCaptchaV3Provider(firebaseAppCheckConfig.siteKey),
        isTokenAutoRefreshEnabled: true,
      });
      return appCheck;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      LoggingService.Initialize(firestore, environment.production);
      //connectFirestoreEmulator(firestore, 'localhost', 8080);
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      //connectAuthEmulator(auth, 'http://localhost:9099');
      return auth;
    }),
    provideStorage(() => {
      const storage = getStorage();
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      return functions;
    }),
    provideAnalytics(() => {
      const analytics = getAnalytics(_getAppRef());
      return analytics;
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }), // database
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  private static _instance: AppModule | null = null;
  constructor() {
    if (AppModule._instance !== null) {
      throw new Error('AppModule is a singleton and is already loaded');
    }
    AppModule._instance = this;
  }

  public static getInstance(): AppModule {
    if (AppModule._instance === null) {
      throw new Error('AppModule must be initialized before use');
    }
    return AppModule._instance;
  }

  private static examineFirebaseLoadedModules(
    firebaseApp: FirebaseApp
  ): Array<string> {
    const loadedModules: Array<string> = [];
    for (let x = 0; x < allFeatures.length; x++) {
      const feature = allFeatures[x];
      if (typeof (firebaseApp as any)[feature] === 'function') {
        loadedModules.push(feature);
      }
    }
    return loadedModules;
  }
}
