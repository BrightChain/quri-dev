/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { User } from 'firebase/auth';
export interface IConfigurationPair {
  source: ConfigurationSource;
  options: FirebaseOptions;
}
export interface IFirebaseAppCheckConfig {
  siteKey: string;
}
export interface IQuriApp {
  production: boolean;
  firebaseAppCheck: AppCheck;
  firebaseApp: FirebaseApp;
  firebaseExtensionsLoaded: Array<string>;
}
export interface IQuriWindow {
  environmentIsProduction: boolean;
  quri: IQuriApp | null;
}
export interface IQuriUser {
  firebaseUser: User;
  static getUser(id: string): Promise<IQuriUser>;
  static rateUri(uri: IQuriUri): Promise<IQuriRating>;
}
export interface IQuriUri {
  uri: URL;
  hash: string;
  dateAdded: bigint;
  static addUri(uri: URL): Promise<IQuriUri>;
  static getUri(
    uri: URL,
    autoCreate: boolean | undefined
  ): Promise<IQuriUri | null>;
  getScore(): Promise<bigint>;
  static hashUrl(uri: URL): string;
}
export interface IQuriRating {
  id: string;
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
  static addRating(
    uri: IQuriUri,
    user: IQuriUser,
    rating: bigint
  ): Promise<IQuriRating>;
  static getRating(id: string): Promise<IQuriRating>;
  getQuriUri(): Promise<IQuriUri>;
  getQuriUser(): Promise<IQuriUser>;
}
