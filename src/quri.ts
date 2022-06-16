//FileName : quri.ts
/// <reference types="node" />
'use strict';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { AppCheck } from '@angular/fire/app-check';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { IQuriApp } from './interfaces';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { firebaseAppCheckConfig } from './firebaseAppCheckConfig';

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

export class QuriApp implements IQuriApp {
  constructor(firebaseApp: FirebaseApp) {
    this.firebaseApp = firebaseApp;
    this.firebaseAppCheck = initializeAppCheck(this.firebaseApp, {
      provider: new ReCaptchaV3Provider(firebaseAppCheckConfig.siteKey),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });
    this.production =
      environment.production &&
      this.firebaseApp.options.projectId == 'quri-social';
    this.firebaseExtensionsLoaded = [];
    for (let x = 0; x < allFeatures.length; x++) {
      const feature = allFeatures[x];
      if (typeof this.firebaseApp[feature] === 'function') {
        this.firebaseExtensionsLoaded.push(feature);
      }
    }

    if (this.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }
  production: boolean;
  firebaseAppCheck: AppCheck;
  firebaseApp: FirebaseApp;
  firebaseExtensionsLoaded: string[];
}
