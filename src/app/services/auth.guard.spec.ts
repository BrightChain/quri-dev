import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthGuard } from './auth.guard';
import { Route, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<Auth>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreSpy: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      [
        'isAdmin',
        'verifyJwt',
        'validateToken',
        'loginUser',
        'googleSignIn',
        'signupUser',
        'resetPassword',
        'resendVerificationEmail',
        'logoutUser',
        'setUserInfo',
        'getCurrentUser',
      ],
      ['isAdmin']
    );
    firestoreSpy = jasmine.createSpyObj<Firestore>('Firestore', ['app']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Firestore, useValue: firestoreSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
