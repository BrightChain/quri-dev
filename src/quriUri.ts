//FileName : quriUri.ts
/// <reference types="node" />
'use strict';
import { IQuriUri } from './interfaces';

export class QuriUri implements IQuriUri {
  constructor(uri: string, hash: string) {
    this.uri = uri;
    this.hash = hash;
    this.dateAdded = BigInt(-1);
  }
  addUri(uri: string): Promise<IQuriUri> {
    throw new Error('Method not implemented.');
  }
  getUri(
    uri: string,
    autoCreate: boolean | undefined
  ): Promise<IQuriUri | null> {
    throw new Error('Method not implemented.');
  }
  getScore(): Promise<bigint> {
    throw new Error('Method not implemented.');
  }
  uri: string;
  hash: string;
  dateAdded: bigint;
}
