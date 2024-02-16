import { UserService } from '../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private authService: AuthService,
    private router: Router, private notificationService: NotificationService) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
      this.authService.setIsAuthentic(true);
    }
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return
    try {
      this.userService.login(this.loginForm.value).subscribe(user => {
        if (!user?.token) return;
        localStorage.setItem('token', JSON.stringify(user?.token));
        this.authService.setToken(user?.token);
        this.authService.setIsAuthentic(true);
        this.initForm();
        this.router.navigate(['/home']);
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }
}
