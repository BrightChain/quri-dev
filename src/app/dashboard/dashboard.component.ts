import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import {
  collection,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  Firestore,
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

import { Observable, of } from 'rxjs';
import { QuriUserProfile } from 'src/quriUserProfile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null> | undefined;
  profile$: Observable<QuriUserProfile | null> | undefined;

  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.afAuth = afAuth;
    this.firestore = firestore;
    this.authService = authService;
  }

  afAuthUser(): Observable<User | null> {
    return this.authService.user$ || of(null);
  }

  ngOnInit(): void {
    onAuthStateChanged(this.afAuth, (user: User | null) => {
      this.user$ = this.authService.user$;
      this.profile$ = this.authService.profile$;
      if (user !== null && user.email !== null) {
        console.log('Dashboard: user', user);
      } else {
        console.log('Dashboard: user is null');
      }
    });
  }
}
