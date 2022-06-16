/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp } from 'firebase/app';
interface IQuriApp {
  production: boolean;
  firebaseAppCheck: AppCheck | null;
  firebaseHosting: boolean;
  firebaseApp: FirebaseApp | null;
  firebaseExtensionsLoaded: Array<string>;
  onLoad: () => void;
}
