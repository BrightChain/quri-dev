/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { userInfo } from 'os';

interface IQuriApp {
  angularProduction: boolean;
  production: boolean;
  firebaseAppCheck: AppCheck | null;
  firebaseHosting: boolean;
  firebaseApp: FirebaseApp | null;
  firebaseExtensionsLoaded: Array<string>;
  onLoad: () => void;
}
interface IQuriUser implements User {
  static getUser(id: string): Promise<IQuriUser>;
  static rateUri(uri: IQuriUri): Promise<IQuriRating>;
};
interface IQuriUri {
  uri: string;
  hash: string;
  dateAdded: bigint;
  static addUri(uri: string): Promise<IQuriUri>;
  static getUri(uri: string, autoCreate: boolean | undefined): Promise<IQuriUri | null>;
  getScore(): Promise<bigint>;
}
interface IQuriRating {
  id: string;
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
  static addRating(uri: IQuriUri, user: IQuriUser, rating: bigint): Promise<IQuriRating>;
  static getRating(id: string): Promise<IQuriRating>;
  getQuriUri(): Promise<IQuriUri>;
  getQuriUser(): Promise<IQuriUser>;
}