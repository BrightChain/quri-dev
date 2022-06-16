import { FirebaseOptions } from 'firebase/app';

export class FirebaseConfig implements FirebaseOptions {
  constructor(other?: FirebaseOptions) {
    if (other !== undefined) {
      if (other.apiKey !== undefined) {
        this.apiKey = other.apiKey;
      }
      if (other.appId !== undefined) {
        this.appId = other.appId;
      }
      if (other.authDomain !== undefined) {
        this.authDomain = other.authDomain;
      }
      if (other.databaseURL !== undefined) {
        this.databaseURL = other.databaseURL;
      }
      if (other.measurementId !== undefined) {
        this.measurementId = other.measurementId;
      }
      if (other.messagingSenderId !== undefined) {
        this.messagingSenderId = other.messagingSenderId;
      }
      if (other.projectId !== undefined) {
        this.projectId = other.projectId;
      }
      if (other.storageBucket !== undefined) {
        this.storageBucket = other.storageBucket;
      }
    }
  }
  projectId?: string;
  appId?: string;
  databaseURL?: string;
  storageBucket?: string;
  apiKey?: string;
  authDomain?: string;
  messagingSenderId?: string;
  measurementId?: string;
}
