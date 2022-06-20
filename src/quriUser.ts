//FileName : quriUser.ts
/// <reference types="node" />
'use strict';
import { IdTokenResult, UserInfo, UserMetadata } from 'firebase/auth';
import { IQuriRating, IQuriUri, IQuriUser } from './interfaces';

export class QuriUser implements IQuriUser {
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  providerData: UserInfo[];
  refreshToken: string;
  tenantId: string | null;
  delete(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getIdToken(forceRefresh?: boolean | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getIdTokenResult(forceRefresh?: boolean | undefined): Promise<IdTokenResult> {
    throw new Error('Method not implemented.');
  }
  getUser(id: string): Promise<IQuriUser> {
    throw new Error('Method not implemented.');
  }
  rateUri(uri: IQuriUri): Promise<IQuriRating> {
    throw new Error('Method not implemented');
  }
  reload(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  toJSON(): object {
    throw new Error('Method not implemented.');
  }
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
}
