import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  user: Observable<any> | null; // Example: store the user's info here (Cloud Firestore: collection is 'users', docId is the user's email, lower case)

  constructor(
    private afAuth: Auth,
    private firestore: Firestore
  ) {
    this.user = null;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      // grab the user object from Firebase Authorization
      if (user !== null && user.email !== null) {
        const emailLower = user.email.toLowerCase();
        this.user = this.firestore
          .collection('users')
          .doc(emailLower)
          .valueChanges(); // get the user's doc in Cloud Firestore
      } else {
        console.log('Dashboard: user is null');
      }
    });
  }
}
