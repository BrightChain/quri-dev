//FileName : quriApp.ts
/// <reference types="node" />
'use strict';

import { FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { AppCheck } from '@angular/fire/app-check';
import { enableProdMode } from '@angular/core';

import { IQuriApp } from './interfaces';
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
    if (firebaseApp === undefined) {
      throw new Error('firebaseApp is undefined');
    }
    this.firebaseApp = firebaseApp;
    this.firebaseAppCheck = initializeAppCheck(this.firebaseApp, {
      provider: new ReCaptchaV3Provider(firebaseAppCheckConfig.siteKey),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });
    this.firebaseExtensionsLoaded = this.examineFirebaseLoadedModules();
    this.auth = getAuth();
    this.firestore = getFirestore(this.firebaseApp);
    this.production = QuriApp.isProduction(firebaseApp);
    if (this.production) {
      enableProdMode();
    }
  }
  auth: Auth;
  firestore: Firestore;
  production: boolean;
  firebaseAppCheck: AppCheck;
  firebaseApp: FirebaseApp;
  firebaseExtensionsLoaded: string[];

  private static isProduction(firebaseApp: FirebaseApp): boolean {
    return (
      environment.production && firebaseApp.options.projectId == 'quri-social'
    );
  }

  private examineFirebaseLoadedModules(): Array<string> {
    const loadedModules: Array<string> = [];
    for (let x = 0; x < allFeatures.length; x++) {
      const feature = allFeatures[x];
      if (typeof this.firebaseApp[feature] === 'function') {
        loadedModules.push(feature);
      }
    }
    return loadedModules;
  }
}
