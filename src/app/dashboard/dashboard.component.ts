import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: Observable<any> | null; // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.afAuth = afAuth;
    this.firestore = firestore;
    this.user = null;
  }

  afAuthUser(): Observable<any> {
    return this.afAuth.user;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      console.log('Dashboard: user', user);

      if (user !== null && user.email !== null) {
        const emailLower = user.email.toLowerCase();
        this.user = this.firestore
          .collection('users')
          .doc(emailLower)
          .valueChanges();
      } else {
        console.log('Dashboard: user is null');
      }
    });
  }
}
