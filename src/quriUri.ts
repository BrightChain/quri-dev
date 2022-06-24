//FileName : quriUri.ts
/// <reference types="node" />
'use strict';
import { IQuriUri } from './interfaces';
import { createHash } from 'crypto';

export class QuriUri implements IQuriUri {
  constructor(uri: URL, hash?: string) {
    this.uri = uri;
    if (hash === undefined) {
      this.hash = this.hashUrl(uri);
    } else {
      this.hash = hash;
    }
    this.dateAdded = BigInt(-1);
  }
  hashUrl(uri: URL): string {
    // take the sha-256 hash of the URL/URI string
    const hash = createHash('sha256');
    hash.update(uri.toString());
    return hash.digest('hex');
  }
  async addUri(uri: URL): Promise<IQuriUri> {
    const hash = this.hashUrl(uri);
    const quriUri = new QuriUri(uri, hash);
    // TODO: upsert to firebase
    throw new Error('Method not implemented.');
    return Promise.resolve(quriUri);
  }
  async getUri(
    uri: URL,
    autoCreate: boolean | undefined
  ): Promise<IQuriUri | null> {
    throw new Error('Method not implemented.');
  }
  async getScore(): Promise<bigint> {
    throw new Error('Method not implemented.');
  }
  uri: URL;
  hash: string;
  dateAdded: bigint;
}
