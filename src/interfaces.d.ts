/// <reference types="node" />
'use strict';
import { AppCheck } from '@angular/fire/app-check';
import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { userInfo } from 'os';

interface IQuriApp {
  production: boolean;
  firebaseAppCheck: AppCheck | null;
  firebaseHosting: boolean;
  firebaseApp: FirebaseApp | null;
  firebaseExtensionsLoaded: Array<string>;
  onLoad: () => void;
}
interface IQuriUser implements User {

};
interface IQuriUri {
  uri: string;
  hash: string;
  dateAdded: bigint;
}
interface IQuriRating {
  hash: string;
  creatorId: string;
  rating: bigint;
  weight: number;
  signature: string;
  dateAdded: bigint;
}