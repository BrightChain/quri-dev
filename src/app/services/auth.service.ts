import { AnimationDriver } from '@angular/animations/browser';
import { Injectable } from '@angular/core';

import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  UserCredential,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  UserInfo,
} from '@angular/fire/auth';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  setDoc,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';

import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { QuriUserProfile } from '../../quriUserProfile';
import { QuriUser } from '../../quriUser';
import { environment } from '../../environments/environment';
import * as jwt from 'jsonwebtoken';
import { LoggingService } from './logging.service';

//// <summary>
//// The URL of the JWKS endpoint.
//// </summary>
export const FirebaseJwksUrl =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn: boolean; // other components can check on this variable for the login status of the user
  user$: Observable<User | null> | undefined;
  profile$: Observable<QuriUserProfile | null> | undefined;
  private tokenValidated: boolean;
  public isValidated() {
    return this.tokenValidated;
  }
  private isAdministrator: boolean;
  public isAdmin() {
    return this.isAdministrator;
  }

  constructor(
    private router: Router,
    private afAuth: Auth,
    private afs: Firestore
  ) {
    this.afAuth = afAuth;
    this.afs = afs;
    this.router = router;
    this.userLoggedIn = false;
    this.tokenValidated = false;
    this.isAdministrator = false;

    onAuthStateChanged(this.afAuth, async (user: User | null) => {
      // set up a subscription to always know the login status of the user
      //console.log('Auth Service: onAuthStateChanged: user', user);
      if (user !== null) {
        this.userLoggedIn = true;
        const userDoc = doc(this.afs, `users/${user.uid}`);
        this.user$ = docData(userDoc) as Observable<User>;

        const profileDoc = doc(this.afs, `profiles/${user.uid}`);
        this.profile$ = docData(profileDoc) as Observable<QuriUserProfile>;

        const token = await user.getIdToken(true);
        console.debug('Auth Service: onAuthStateChanged: validating token');
        await this.validateToken(token)
          .then((validationResult) => {
            this.tokenValidated = true;
            const role =
              typeof validationResult === 'object' &&
              validationResult['role'] !== undefined
                ? validationResult['role']
                : 'endUser';
            this.isAdministrator = role.toLowerCase() === 'admin';
            return token;
          })
          .catch(() => {
            this.tokenValidated = false;
            this.isAdministrator = false;
            return token;
          });

        if (!this.tokenValidated) {
          LoggingService.error(
            'Auth Service: onAuthStateChanged: token is invalid'
          );
          this.logoutUser();
        }
      } else {
        this.userLoggedIn = false;
        this.user$ = of(null);
        this.profile$ = of(null);
        this.tokenValidated = false;
      }
    });
  }

  async verifyJwt(idToken: string): Promise<string | jwt.JwtPayload> {
    const response: Response = await fetch(FirebaseJwksUrl);
    if (response === undefined) {
      //console.log('Auth Service: verifyJwt: response is undefined');
      return Promise.reject('response is undefined');
    }
    const publicKeys = JSON.parse(await response.text());
    try {
      const header64 = idToken.split('.')[0];
      const header = JSON.parse(atob(header64));
      return Promise.resolve(
        jwt.verify(idToken, publicKeys[header.kid], {
          algorithms: ['RS256'],
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async validateToken(jwt: string): Promise<string | jwt.JwtPayload> {
    console.debug('Auth Service: validateToken: jwt');
    try {
      const result = await this.verifyJwt(jwt);
      console.debug('Auth Service: validateToken: result', result);
      return Promise.resolve(result);
    } catch (error) {
      console.debug('Auth Service: validateToken: error', error);
      return Promise.reject(error);
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    return await signInWithEmailAndPassword(this.afAuth, email, password)
      .then(() => {
        //console.log('Auth Service: loginUser: success');
        // this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        //console.log('Auth Service: login error...');
        //console.log('error code', error.code);
        //console.log('error', error);
        if (error.code) return { isValid: false, message: error.message };
        return Promise.reject(error);
      });
  }

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    //console.log(provider);
    await signInWithRedirect(this.afAuth, provider);

    const result = await getRedirectResult(this.afAuth);
    //console.log(result);
    return this.updateUserData(result);
  }
  // const credential = await this.afAuth.signInWithPopup(provider);
  // return this.updateUserData(credential.user);

  async signupUser(user: any): Promise<any> {
    return await createUserWithEmailAndPassword(
      this.afAuth,
      user.email,
      user.password
    )
      .then(async (result: UserCredential) => {
        if (result.user === undefined || result.user === null) {
          return Promise.reject(
            'Auth Service: signupUser: user is undefined or null'
          );
        }
        this.updateUserData(result); // on a successful signup, create a document in 'users' collection with the new user's info
        this.updateUserProfile(result.user, new QuriUserProfile(result.user));

        await sendEmailVerification(result.user); // immediately send the user a verification email
        return Promise.resolve();
      })
      .catch((error) => {
        //console.log('Auth Service: signup error', error);
        if (error.code) return { isValid: false, message: error.message };
        return Promise.reject(error);
      });
  }

  async resetPassword(email: string): Promise<any> {
    return await sendPasswordResetEmail(this.afAuth, email)
      .then(() => {
        //console.log('Auth Service: reset password success');
        // this.router.navigate(['/amount']);
      })
      .catch((error) => {
        //console.log('Auth Service: reset password error...');
        //console.log(error.code);
        //console.log(error);
        if (error.code) return error;
      });
  }

  async resendVerificationEmail(): Promise<boolean> {
    if (this.afAuth === null) {
      return Promise.resolve(false);
    }
    const afAuthUser = await this.afAuth.currentUser;
    if (afAuthUser === null) {
      return Promise.resolve(false);
    }
    // verification email is sent in the Sign Up function, but if you need to resend, call this function
    return sendEmailVerification(afAuthUser)
      .then(() => {
        // this.router.navigate(['home']);
        return Promise.resolve(true);
      })
      .catch((error) => {
        //('Auth Service: sendVerificationEmail error...');
        //console.log('error code', error.code);
        //console.log('error', error);
        if (error.code) return Promise.reject(error);
        return Promise.reject();
      });
  }

  logoutUser(): Promise<void> {
    return this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/home']); // when we log the user out, navigate them to home
      })
      .catch((error) => {
        //console.log('Auth Service: logout error...');
        //console.log('error code', error.code);
        //console.log('error', error);
        if (error.code) return error;
      });
  }

  // async signOut() {
  //   await this.afAuth.signOut();
  //   return this.router.navigate(['/']);
  // }

  async setUserInfo(payload: object) {
    //console.log('Auth Service: saving user info...');
    if (
      this.afAuth === null ||
      this.afAuth.currentUser === null ||
      this.afAuth.currentUser.email === null
    ) {
      return false;
    }
    const userPayload = payload as User;
    const userRef = doc(this.afs, `users/${userPayload.uid}`);
    return setDoc(userRef, userPayload, { merge: true }).then(function (res) {
      //console.log('Auth Service: setUserInfo response...');
      //console.log(res);
    });
  }

  private updateUserData(user: UserCredential | null) {
    const userRef = doc(this.afs, `users/${user?.user.uid}`);
    const data: UserInfo = {
      displayName: user?.user.displayName || null,
      email: user?.user.email || null,
      phoneNumber: user?.user.phoneNumber || null,
      photoURL: user?.user.photoURL || null,
      providerId: user?.user.providerId || '',
      uid: user?.user.uid || '',
    };
    return setDoc(userRef, data as User, { merge: true });
  }

  private updateUserProfile(user: User, profile: QuriUserProfile) {
    const profileRef = doc(this.afs, `profiles/${user.uid}`);
    //const data: QuriUserProfile = new QuriUserProfile(user);
    return setDoc(profileRef, profile, { merge: true });
  }

  getCurrentUser() {
    return this.afAuth.currentUser; // returns user object for logged-in users, otherwise returns null
  }
}
