//FileName : quriUser.ts
/// <reference types="node" />
'use strict';
import { User } from 'firebase/auth';
import { Query, DocumentData, collection, query } from 'firebase/firestore';
import {
  IQuriRating,
  IQuriUri,
  IQuriUser,
  IQuriUserProfile,
} from './interfaces';
import { QuriApp } from './quriApp';
import { QuriUserProfile } from './quriUserProfile';

export class QuriUser implements IQuriUser {
  constructor(quri: QuriApp, user: User) {
    this.quri = quri;
    this.uid = user.uid;
    this.user = user;
    this.profile = new QuriUserProfile(user);
  }
  private quri: QuriApp;
  uid: string;
  ratingsQuery(...args: any[]): Query<DocumentData> {
    const ratingsRef = collection(this.quri.firestore, 'ratings');
    return query(ratingsRef, ...args);
  }
  profile: IQuriUserProfile;
  user: User;
  async getUser(quri: QuriApp, id: string): Promise<IQuriUser> {
    throw new Error('Method not implemented');
    //let user = new QuriUser();
    //user.profile = await QuriUserProfile.getProfile(quri, user.uid);
  }
  async rateUri(quri: QuriApp, uri: IQuriUri): Promise<IQuriRating> {
    throw new Error('Method not implemented');
  }
}
