import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public auth: Auth, private firestore: Firestore) {}

  ngOnInit(): void {
    //console.log('ngOnInit');
  }

  logout(): void {
    this.auth.signOut();
  }
}
