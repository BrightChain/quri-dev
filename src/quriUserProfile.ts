import { User } from 'firebase/auth';
import {
  collection,
  doc,
  Firestore,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { URL } from 'url';
import { IQuriUserProfile } from './interfaces';

export class QuriUserProfile implements IQuriUserProfile {
  public avatar: URL | null;
  public bio: string | null;
  public dateCreated: Timestamp;
  public dateModified: Timestamp;
  public dirty: boolean;
  public emails: Array<string>;
  public isLoggedIn: boolean;
  public lastSeen: Timestamp;
  public links: Array<URL>;
  public uid: string;
  private _user: User;
  public user(): User {
    return this._user;
  }
  public displayName: string | null;
  public email: string | null;
  public phones: Array<string>;
  public photoURL: string | null;

  constructor(user: User) {
    this.avatar = null;
    this.bio = null;
    this.dateCreated = serverTimestamp() as Timestamp;
    this.dateModified = serverTimestamp() as Timestamp;
    this.dirty = true;
    this.displayName = user.displayName || null;
    this.email = user.email || null;
    this.emails = user.email ? [user.email] : [];
    this.isLoggedIn = false;
    this.lastSeen = serverTimestamp() as Timestamp;
    this.links = [];
    this.uid = user.uid;
    this._user = user;
    this.phones = [];
    this.photoURL = null;
  }
  updateLastSeen() {
    this.lastSeen = serverTimestamp() as Timestamp;
    this.dirty = true;
  }
  addLink(link: URL) {
    this.links.push(link);
    this.dirty = true;
  }
  async updateProfile(firestore: Firestore): Promise<void> {
    if (!this.dirty) {
      return Promise.resolve();
    }
    this.dateModified = serverTimestamp() as Timestamp;
    const profilesRef = collection(firestore, 'profiles');

    await setDoc(doc(profilesRef, this.uid), this);
    return Promise.resolve();
  }
  static async getProfile(
    firestore: Firestore,
    uid: string
  ): Promise<QuriUserProfile> {
    if (uid === null || uid === undefined) {
      return Promise.reject('uid is null');
    }
    const profilesRef = collection(firestore, 'profiles');
    const snapshot = await getDoc(doc(profilesRef, uid));
    // TODO: if no profile, create one
    return Promise.resolve(snapshot.data() as QuriUserProfile);
  }
}
