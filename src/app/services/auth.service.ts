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
import { BehaviorSubject, Observable } from 'rxjs';
import { QuriUser } from '../../quriUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn: boolean; // other components can check on this variable for the login status of the user

  constructor(
    private router: Router,
    private afAuth: Auth,
    private afs: Firestore
  ) {
    this.afAuth = afAuth;
    this.afs = afs;
    this.router = router;
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      // set up a subscription to always know the login status of the user
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  async loginUser(email: string, password: string): Promise<any> {
    return await signInWithEmailAndPassword(this.afAuth, email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
        // this.router.navigate(['/dashboard']);
      })
      .catch((error) => {
        console.log('Auth Service: login error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) return { isValid: false, message: error.message };
        return Promise.reject(error);
      });
  }

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
        const emailLower = user.email.toLowerCase();

        const d = await doc(this.afs, '/users/' + emailLower); // on a successful signup, create a document in 'users' collection with the new user's info
        setDoc(d, {
          accountType: 'endUser',
          displayName: user.displayName,
          displayName_lower: user.displayName.toLowerCase(),
          email: user.email,
          email_lower: emailLower,
        });

        await sendEmailVerification(result.user); // immediately send the user a verification email
      })
      .catch((error) => {
        console.log('Auth Service: signup error', error);
        if (error.code) return { isValid: false, message: error.message };
        return Promise.reject(error);
      });
  }

  async resetPassword(email: string): Promise<any> {
    return await sendPasswordResetEmail(this.afAuth, email)
      .then(() => {
        console.log('Auth Service: reset password success');
        // this.router.navigate(['/amount']);
      })
      .catch((error) => {
        console.log('Auth Service: reset password error...');
        console.log(error.code);
        console.log(error);
        if (error.code) return error;
      });
  }

  async resendVerificationEmail() {
    if (this.afAuth === null) {
      return false;
    }
    const afAuthUser = await this.afAuth.currentUser;
    if (afAuthUser === null) {
      return false;
    }
    // verification email is sent in the Sign Up function, but if you need to resend, call this function
    sendEmailVerification(afAuthUser)
      .then(() => {
        // this.router.navigate(['home']);
      })
      .catch((error) => {
        console.log('Auth Service: sendVerificationEmail error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) return error;
      });
  }

  logoutUser(): Promise<void> {
    return this.afAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/home']); // when we log the user out, navigate them to home
      })
      .catch((error) => {
        console.log('Auth Service: logout error...');
        console.log('error code', error.code);
        console.log('error', error);
        if (error.code) return error;
      });
  }
  async setUserInfo(payload: object) {
    console.log('Auth Service: saving user info...');
    if (
      this.afAuth === null ||
      this.afAuth.currentUser === null ||
      this.afAuth.currentUser.email === null
    ) {
      return false;
    }
    const emailLower = this.afAuth.currentUser.email.toLowerCase();
    const d = await doc(this.afs, '/users/' + emailLower);
    //const col = collection(this.afs, 'users') as CollectionReference<QuriUser>;
    setDoc(d, payload).then(function (res) {
      console.log('Auth Service: setUserInfo response...');
      console.log(res);
    });
  }

  getCurrentUser() {
    return this.afAuth.currentUser; // returns user object for logged-in users, otherwise returns null
  }
}
