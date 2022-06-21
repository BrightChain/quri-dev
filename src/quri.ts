//FileName : quri.ts
/// <reference types="node" />
'use strict';
import { firebaseConfig } from './firebaseConfig';
import { firebaseAppCheckConfig } from './firebaseAppCheckConfig';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { IQuriApp, IQuriWindow, IWebConfig } from './interfaces';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppCheck } from '@angular/fire/app-check';

declare global {
  interface Window {
    quri: IQuriWindow;
    firebase: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}
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
const _isFirebaseHosting: boolean =
  window.firebase !== undefined &&
  window.firebase.apps !== undefined &&
  window.firebase.apps.length > 0 &&
  window.firebase.apps[0] !== undefined &&
  window.firebase.apps[0] !== null;
const _firebaseHostingApp: FirebaseApp | null = _isFirebaseHosting
  ? window.firebase.apps[0]
  : null;

export class QuriApp implements IQuriApp {
  constructor(firebaseApp: FirebaseApp | null) {
    if (firebaseApp === null) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    this.firebaseApp = firebaseApp;
    this.firebaseAppCheck = initializeAppCheck(_quri.firebaseApp, {
      provider: new ReCaptchaV3Provider(firebaseAppCheckConfig.siteKey),

      // Optional argument. If true, the SDK automatically refreshes App Check
      // tokens as needed.
      isTokenAutoRefreshEnabled: true,
    });
    this.firebaseHosting = _isFirebaseHosting;
    this.production = environment.production;
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
  firebaseHosting: boolean;
  firebaseApp: FirebaseApp;
  firebaseExtensionsLoaded: string[];
}

const _quri: IQuriWindow = {
  environmentIsProduction: environment.production,
  firebaseHosting: false,
  getConfigFromHosting: function (): Promise<IWebConfig> {
    throw new Error('Function not implemented.');
  },
  quri: null,
};

document.addEventListener('DOMContentLoaded', () => {
  _quri.quri = new QuriApp(_firebaseHostingApp);
  window.quri = window.quri || _quri;
});

export default { quri: _quri };
