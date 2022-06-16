//FileName : quri.ts
/// <reference types="node" />
'use strict';
import { firebaseConfig } from './firebaseConfig';
import { firebaseAppCheckConfig } from './firebaseAppCheckConfig';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { IQuriApp } from './interfaces';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window {
    quri: IQuriApp;
    firebase: {
      apps: [FirebaseApp];
    };
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
const _quri: IQuriApp = {
  production:
    environment.production && firebaseConfig.projectId != 'quri-development',
  firebaseApp:
    window.firebase !== undefined &&
    window.firebase.apps !== undefined &&
    window.firebase.apps.length > 0 &&
    window.firebase.apps[0] !== undefined &&
    window.firebase.apps[0] !== null
      ? window.firebase.apps[0]
      : null,
  firebaseAppCheck: null,
  firebaseExtensionsLoaded: [],
  firebaseHosting:
    window.firebase !== undefined &&
    window.firebase.apps !== undefined &&
    window.firebase.apps.length > 0 &&
    window.firebase.apps[0] !== undefined &&
    window.firebase.apps[0] !== null,
  onLoad: function () {
    try {
      if (_quri.firebaseApp === null || _quri.firebaseApp === undefined) {
        _quri.firebaseApp = initializeApp(firebaseConfig);
      }
      _quri.firebaseAppCheck = initializeAppCheck(_quri.firebaseApp, {
        provider: new ReCaptchaV3Provider(firebaseAppCheckConfig.siteKey),

        // Optional argument. If true, the SDK automatically refreshes App Check
        // tokens as needed.
        isTokenAutoRefreshEnabled: true,
      });
      for (let x = 0; x < allFeatures.length; x++) {
        const feature = allFeatures[x];
        if (typeof _quri.firebaseApp[feature] === 'function') {
          _quri.firebaseExtensionsLoaded.push(feature);
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
};
window.quri = window.quri || _quri;

document.addEventListener('DOMContentLoaded', window.quri.onLoad);

if (_quri.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

export default { quri: _quri };
