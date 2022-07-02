/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { User } from 'firebase/auth';
import { Query, Timestamp } from 'firebase/firestore';
export interface IConfigurationPair {
  source: ConfigurationSource;
  options: FirebaseOptions;
}
export interface IFirebaseAppCheckConfig {
  siteKey: string;
}
export interface IQuriUser {
  uid: string;
  user: User;
  profile: IQuriUserProfile;
  ratingsQuery(): Query;
  static getUser(id: string): Promise<IQuriUser>;
  static rateUri(uri: IQuriUri): Promise<IQuriRating>;
}
export interface IQuriUri {
  uri: URL;
  hash: string;
  dateAdded: Timestamp;
  static addUri(uri: URL): Promise<IQuriUri>;
  static getUri(
    uri: URL,
    autoCreate: boolean | undefined
  ): Promise<IQuriUri | null>;
  getScore(): Promise<bigint>;
  save(firestore: Firestore): Promise<void>;
  validate(): boolean;
  static hashUrl(uri: URL): string;
}
export interface IQuriRating {
  id: string;
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: Timestamp;
  static addRating(
    uri: IQuriUri,
    user: IQuriUser,
    rating: bigint
  ): Promise<IQuriRating>;
  static getRating(id: string): Promise<IQuriRating>;
  getQuriUri(): Promise<IQuriUri>;
  getQuriUser(): Promise<IQuriUser>;
}

export interface IQuriUserProfile {
  avatar: URL | null;
  bio: string | null;
  dateCreated: Timestamp;
  dateModified: Timestamp;
  dirty: boolean;
  isLoggedIn: boolean;
  lastSeen: Timestamp;
  links: Array<URL>;
  uid: string;
  displayName: string | null;
  email: string | null;
  emails: Array<string>;
  phones: Array<string>;
  photoURL: string | null;
  user(): User;
  addLink(link: URL);
  updateProfile(firestore: Firestore): Promise<void>;
  updateLastSeen();
}
