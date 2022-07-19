import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VirtualTimeScheduler } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  email: string;
  mailSent: boolean;
  isProgressVisible: boolean;
  firebaseErrorMessage: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    public auth: Auth
  ) {
    this.email = '';
    this.mailSent = false;
    this.isProgressVisible = false;

    this.firebaseErrorMessage = '';
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      // if the user is logged in, update the form value with their email address
      if (user !== null && user.email !== null) {
        this.email = user.email;
      } else {
        this.email = '';
        //console.log('user is not logged in for subscribe');
      }
    });
  }

  resendVerificationEmail() {
    this.isProgressVisible = true; // show the progress indicator as we start the Firebase password reset process

    this.authService
      .resendVerificationEmail()
      .then(() => {
        this.isProgressVisible = false; // no matter what, when the auth service returns, we hide the progress indicator
        //console.log('verification email resent...');
        this.mailSent = true;
      })
      .catch((error) => {
        //console.log('verification error', error);
        this.mailSent = false;
      });
  }
}
