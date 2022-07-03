import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { QuriUserProfile } from 'src/quriUserProfile';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  user$: Observable<User | null> | undefined;
  profile$: Observable<QuriUserProfile | null> | undefined;

  constructor(
    private afAuth: Auth,
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    onAuthStateChanged(this.afAuth, (user: User | null) => {
      this.user$ = this.authService.user$;
      this.profile$ = this.authService.profile$;
      if (user !== null && user.email !== null) {
        //console.log('Admin Dashboard: user', user);
      } else {
        //console.log('Admin Dashboard: user is null');
      }
      if (!this.authService.isAdmin()) {
        this.router.navigate(['/']);
      }
    });
  }
}
