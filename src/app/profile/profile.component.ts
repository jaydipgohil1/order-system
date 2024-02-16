import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private router: Router, private authService: AuthService, private sharedService: SharedService) { }

  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '');
    this.sharedService.setIsAuthentic('Profile');
  }

  logOut() {
    this.authService.logOut();
  }
}
