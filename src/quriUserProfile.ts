import { IQuriUser } from '../interfaces';

export class QuriUserProfile {
  public user: IQuriUser;
  public isLoggedIn: boolean;
  public bio: string | null;
  public links: Array<string>;
  public avatar: string | null;

  constructor(user: IQuriUser) {
    this.user = user;
    this.isLoggedIn = false;
    this.bio = null;
    this.links = [];
    this.avatar = null;
  }
}
