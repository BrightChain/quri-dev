//FileName : index.ts
/// <reference types="node" />
'use strict';
import { FirebaseApp } from 'firebase/app';

declare global {
  interface Window {
    quri: AppModule | null;
    firebase?: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}

import { environment } from './environments/environment';
import { ConfigurationHelper } from './configurationHelper';
import { IConfigurationPair } from './interfaces';

let _firebaseConfig = environment.firebase;
const configPair: IConfigurationPair =
  ConfigurationHelper.EnsureConfiguration();
_firebaseConfig = configPair.options;
environment.firebase = configPair.options;
environment.configurationSource = configPair.source;
if (_firebaseConfig === null) {
  throw new Error('Firebase configuration not found');
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { NgModuleRef } from '@angular/core';

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((module: NgModuleRef<AppModule>) => {
      window.quri = module.instance;
    })
    .catch((err) => console.error(err));
});
