//FileName : quri.ts
/// <reference types="node" />
'use strict';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  collection as firestoreCollection,
  doc as firestoreDoc,
  QuerySnapshot as firestoreQuerySnapshot,
  DocumentData as firestoreDocumentData,
  getFirestore,
  onSnapshot as firestoreOnSnapshot,
  query as firestoreQuery,
  serverTimestamp as firestoreServerTimestamp,
  setDoc as firestoreSetDoc,
  where as firestoreWhere,
  Firestore,
  FieldValue,
} from 'firebase/firestore';
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
  public static getInstance(): QuriApp {
    if (QuriApp.instance === null) {
      throw new Error('QuriApp not instantiated');
    }
    return QuriApp.instance;
  }
  constructor(firebaseApp: FirebaseApp) {
    if (QuriApp.instance !== null) {
      throw new Error('QuriApp already instantiated');
    }
    QuriApp.instance = this;
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

    this.auth = getAuth();
    this.firestore = getFirestore(this.firebaseApp);

    if (this.production) {
      enableProdMode();
    }

    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }
  private static instance: QuriApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  production: boolean;
  firebaseAppCheck: AppCheck;
  firebaseApp: FirebaseApp;
  firebaseExtensionsLoaded: string[];
}
