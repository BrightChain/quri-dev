//FileName : index.ts
/// <reference types="node" />
'use strict';
import { QuriApp } from './quri';
import { IQuriWindow, IWebConfig } from './interfaces';
import { environment } from './environments/environment';
import { FirebaseApp } from 'firebase/app';

declare global {
  interface Window {
    quri: IQuriWindow;
    firebase: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}
const _isFirebaseHosting: boolean =
  window.firebase !== undefined &&
  window.firebase.apps !== undefined &&
  window.firebase.apps.length > 0 &&
  window.firebase.apps[0] !== undefined &&
  window.firebase.apps[0] !== null;
const _firebaseHostingApp: FirebaseApp | null = _isFirebaseHosting
  ? window.firebase.apps[0]
  : null;

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
