/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { userInfo } from 'os';

export interface IFirebaseAppCheckConfig {
  siteKey: string;
}
export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  locationId?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: nukmber;
  appId: string;
  measurementId: string;
}
export interface IWebConfig {
  projectId: string;
  appId?: string;
  databaseURL?: string;
  storageBucket?: string;
  locationId?: string;
  apiKey?: string;
  authDomain?: string;
  messagingSenderId?: string;
}
export interface IQuriApp {
  angularProduction: boolean;
  production: boolean;
  firebaseAppCheck: AppCheck | null;
  firebaseHosting: boolean;
  firebaseApp: FirebaseApp | null;
  firebaseExtensionsLoaded: Array<string>;
  static async getConfigFromHosting(): Promise<IWebConfig>;
  static onLoad(): void;
}
export interface IQuriUser implements User {
  static async getUser(id: string): Promise<IQuriUser>;
  static async rateUri(uri: IQuriUri): Promise<IQuriRating>;
};
export interface IQuriUri {
  uri: string;
  hash: string;
  dateAdded: bigint;
  static async addUri(uri: string): Promise<IQuriUri>;
  static async getUri(uri: string, autoCreate: boolean | undefined): Promise<IQuriUri | null>;
  async getScore(): Promise<bigint>;
}
export interface IQuriRating {
  id: string;
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
  static async addRating(uri: IQuriUri, user: IQuriUser, rating: bigint): Promise<IQuriRating>;
  static async getRating(id: string): Promise<IQuriRating>;
  async getQuriUri(): Promise<IQuriUri>;
  async getQuriUser(): Promise<IQuriUser>;
}