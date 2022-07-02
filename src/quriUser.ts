//FileName : quriUser.ts
/// <reference types="node" />
'use strict';
import { User } from 'firebase/auth';
import {
  Query,
  DocumentData,
  collection,
  query,
  Firestore,
} from 'firebase/firestore';
import {
  IQuriRating,
  IQuriUri,
  IQuriUser,
  IQuriUserProfile,
} from './interfaces';
import { QuriUserProfile } from './quriUserProfile';

export class QuriUser implements IQuriUser {
  constructor(firestore: Firestore, user: User) {
    this.firestore = firestore;
    this.uid = user.uid;
    this.user = user;
    this.profile = new QuriUserProfile(user);
  }
  private firestore: Firestore;
  uid: string;
  ratingsQuery(...args: any[]): Query<DocumentData> {
    const ratingsRef = collection(this.firestore, 'ratings');
    return query(ratingsRef, ...args);
  }
  profile: IQuriUserProfile;
  user: User;
  async getUser(id: string): Promise<IQuriUser> {
    throw new Error('Method not implemented');
    //let user = new QuriUser();
    //user.profile = await QuriUserProfile.getProfile(quri, user.uid);
  }
  async rateUri(uri: IQuriUri): Promise<IQuriRating> {
    throw new Error('Method not implemented');
  }
}
