import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth, AuthModule } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from '../services/auth.guard';
import { AuthService } from '../services/auth.service';
import { ConfigurationHelper } from '../../configurationHelper';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { Router } from '@angular/router';
import {
  Firestore,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  FirebaseApp,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authSpy: jasmine.SpyObj<Auth>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let firestoreSpy: jasmine.SpyObj<Firestore>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj('Auth', ['signOut', 'onAuthStateChanged']);
    firestoreSpy = jasmine.createSpyObj('Firestore', ['app']);
    authServiceSpy = jasmine.createSpyObj('AuthService', [
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
    ]);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminDashboardComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: Auth, useValue: authSpy },
        { provide: Firestore, useValue: firestoreSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
