//FileName : index.ts
/// <reference types="node" />
'use strict';
import { QuriApp } from './quriApp';
import { FirebaseApp } from 'firebase/app';

declare global {
  interface Window {
    quri: QuriApp | null;
    loadQuri(): Promise<QuriApp>;
    firebase?: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}

import { environment } from './environments/environment';
import { ConfigurationHelper } from './configurationHelper';
import { IConfigurationPair } from './interfaces';

// start with environment firebase config if available
let _firebaseConfig = environment.firebase;
// try to get it from another source
ConfigurationHelper.EnsureConfiguration().then((config: IConfigurationPair) => {
  _firebaseConfig = config.options;
  environment.firebase = config.options;
  environment.configurationSource = config.source;
});
if (_firebaseConfig === null) {
  throw new Error('Firebase configuration not found');
}

export async function loadQueri(): Promise<QuriApp> {
  return Promise.resolve(
    new QuriApp(ConfigurationHelper.EnsureApp(_firebaseConfig))
  );
}

window.quri = null;
window.loadQuri = window.loadQuri || loadQueri;

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
