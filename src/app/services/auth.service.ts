import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthentic$ = new BehaviorSubject(false);

  constructor(private router: Router) { }

  setIsAuthentic(isActive: boolean) {
    this.isAuthentic$.next(isActive)
  }

  static getToken() {
    let token = localStorage.getItem('token');
    if (token)
      token = JSON.parse(token);
    return token;
  }

  setToken(token: any) {
    localStorage.removeItem('user');
    const decodedToken: any = jwt_decode.jwtDecode(token);
    const data = {
      email: decodedToken.email,
      name: decodedToken.name,
      userId: decodedToken.userId
    }
    localStorage.setItem('user', JSON.stringify(data));
    return token;
  }

  logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
    this.setIsAuthentic(false);
  }
}
