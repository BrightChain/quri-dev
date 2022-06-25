import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { URL } from 'url';
import { IQuriUser, IQuriUserProfile } from './interfaces';
import { QuriApp } from './quri';

export class QuriUserProfile implements IQuriUserProfile {
  public avatar: URL | null;
  public bio: string | null;
  public dateCreated: Timestamp;
  public dateModified: Timestamp;
  public dirty: boolean;
  public isLoggedIn: boolean;
  public lastSeen: Timestamp;
  public links: Array<URL>;
  public uid: string;
  public user: User;

  constructor(user: User) {
    this.avatar = null;
    this.bio = null;
    this.dirty = true;
    this.dateCreated = serverTimestamp() as Timestamp;
    this.dateModified = serverTimestamp() as Timestamp;
    this.isLoggedIn = false;
    this.lastSeen = serverTimestamp() as Timestamp;
    this.links = [];
    this.uid = user.uid;
    this.user = user;
  }
  updateLastSeen() {
    this.lastSeen = serverTimestamp() as Timestamp;
    this.dirty = true;
  }
  addLink(link: URL) {
    this.links.push(link);
    this.dirty = true;
  }
  async updateProfile(quri: QuriApp): Promise<void> {
    if (!this.dirty) {
      return Promise.resolve();
    }
    this.dateModified = serverTimestamp() as Timestamp;
    const profilesRef = collection(quri.firestore, 'profiles');

    await setDoc(doc(profilesRef, this.uid), this);
    return Promise.resolve();
  }
  static async getProfile(
    quri: QuriApp,
    uid: string
  ): Promise<QuriUserProfile> {
    if (uid === null || uid === undefined) {
      return Promise.reject('uid is null');
    }
    const profilesRef = collection(quri.firestore, 'profiles');
    const snapshot = await getDoc(doc(profilesRef, uid));
    // TODO: if no profile, create one
    return Promise.resolve(snapshot.data() as QuriUserProfile);
  }
}
