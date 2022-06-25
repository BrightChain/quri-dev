//FileName : quriWindow.ts
/// <reference types="node" />
'use strict';
import { IQuriWindow } from './interfaces';
import { QuriApp } from './quriApp';
import { environment } from './environments/environment';

export class QuriWindow implements IQuriWindow {
  constructor() {
    this.environmentIsProduction = environment.production;
    this.quri = null;
  }
  environmentIsProduction: boolean;
  quri: QuriApp | null;
}
