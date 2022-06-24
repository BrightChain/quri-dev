import { URL } from 'url';
import { IQuriUser } from './interfaces';

export class QuriUserProfile {
  public user: IQuriUser;
  public isLoggedIn: boolean;
  public lastSeen: bigint;
  public bio: string | null;
  public links: Array<URL>;
  public avatar: URL | null;
  public dirty: boolean;
  public dateCreated: bigint;
  public dateModified: bigint;

  constructor(user: IQuriUser) {
    this.user = user;
    this.lastSeen = BigInt(-1);
    this.isLoggedIn = false;
    this.bio = null;
    this.links = [];
    this.avatar = null;
    this.dirty = true;
    this.dateCreated = BigInt(-1);
    this.dateModified = BigInt(-1);
  }
  addLink(link: URL) {
    this.links.push(link);
    this.dirty = true;
  }
  updateProfile() {
    throw new Error('not implemented');
    this.dateModified = BigInt(Date.now());
  }
}
