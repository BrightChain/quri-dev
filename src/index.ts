//FileName : index.ts
/// <reference types="node" />
'use strict';
import { QuriApp } from './quri';
import { QuriWindow } from './quriWindow';
import { ConfigurationHelper } from './configurationHelper';
import { IQuriWindow } from './interfaces';
import { environment } from './environments/environment';
import { FirebaseApp } from 'firebase/app';

declare global {
  interface Window {
    quri: IQuriWindow;
    firebase?: {
      apps: Array<FirebaseApp>;
    } | null;
  }
}

const _quri: QuriWindow = new QuriWindow();

document.addEventListener('DOMContentLoaded', async () => {
  const configuration = await ConfigurationHelper.EnsureConfiguration();
  environment.configurationSource = configuration.source;
  _quri.quri = new QuriApp(
    await ConfigurationHelper.EnsureApp(configuration.options)
  );
  window.quri = window.quri || _quri;
});

export default { quri: _quri };
