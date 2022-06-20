//FileName : quriUri.ts
/// <reference types="node" />
'use strict';
import { IQuriUri } from './interfaces';

export class QuriUri implements IQuriUri {
  uri: string;
  hash: string;
  dateAdded: bigint;
}
