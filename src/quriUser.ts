//FileName : quriUser.ts
/// <reference types="node" />
'use strict';
import { User } from 'firebase/auth';
import { IQuriRating, IQuriUri, IQuriUser } from './interfaces';

export class QuriUser implements IQuriUser {
  constructor(user: User) {
    this.firebaseUser = user;
  }
  firebaseUser: User;
  getUser(id: string): Promise<IQuriUser> {
    throw new Error('Method not implemented.');
  }
  rateUri(uri: IQuriUri): Promise<IQuriRating> {
    throw new Error('Method not implemented');
  }
}
