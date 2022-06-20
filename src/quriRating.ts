//FileName : quriRating.ts
/// <reference types="node" />
'use strict';
import { IQuriRating, IQuriUri, IQuriUser } from './interfaces';

export class QuriRating implements IQuriRating {
  getQuriUri(): Promise<IQuriUri> {
    throw new Error('Method not implemented.');
  }
  getQuriUser(): Promise<IQuriUser> {
    throw new Error('Method not implemented.');
  }
  id: string;
  addRating(
    uri: IQuriUri,
    user: IQuriUser,
    rating: bigint
  ): Promise<IQuriRating> {
    throw new Error('Method not implemented.');
  }
  getRating(id: string): Promise<IQuriRating> {
    throw new Error('Method not implemented.');
  }
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
}
