//FileName : index.ts
/// <reference types="node" />
'use strict';
import { QuriApp } from './quriApp';
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
window.quri = window.quri || _quri;

const _quriFunc = async () => {
  console.debug('reloading quri and setting new window instance');
  const configuration = await ConfigurationHelper.EnsureConfiguration();
  environment.configurationSource = configuration.source;
  const newApp = new QuriApp(
    await ConfigurationHelper.EnsureApp(configuration.options)
  );
  _quri.quri = newApp;
  window.quri = _quri;
};

document.addEventListener('DOMContentLoaded', _quriFunc);

export default { quri: _quri };
