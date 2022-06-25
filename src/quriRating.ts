//FileName : quriRating.ts
/// <reference types="node" />
'use strict';
import { IQuriRating, IQuriUri, IQuriUser } from './interfaces';
import { v4 as uuidv4 } from 'uuid';
import { QuriUser } from './quriUser';
import { serverTimestamp, Timestamp } from 'firebase/firestore';

export class QuriRating implements IQuriRating {
  constructor(user: QuriUser, uri: IQuriUri, rating: bigint, weight: number) {
    this.id = uuidv4();
    this.creatorId = user.user.uid;
    this.dateAdded = serverTimestamp() as Timestamp;
    this.hash = uri.hash;
    this.rating = rating;
    this.signature = '';
    this.weight = weight;
  }
  async getQuriUri(): Promise<IQuriUri> {
    throw new Error('Method not implemented.');
  }
  async getQuriUser(): Promise<IQuriUser> {
    throw new Error('Method not implemented.');
  }
  id: string;
  async addRating(
    uri: IQuriUri,
    user: IQuriUser,
    rating: bigint
  ): Promise<IQuriRating> {
    throw new Error('Method not implemented.');
  }
  async getRating(id: string): Promise<IQuriRating> {
    throw new Error('Method not implemented.');
  }
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: Timestamp;
}
