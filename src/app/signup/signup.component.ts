import { UserService } from './../services/user.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    public notificationService: NotificationService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/home']);
      this.authService.setIsAuthentic(true);
    }
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return
    try {
      this.userService.register(this.registerForm.value).subscribe((user) => {
        if (!user.data) return;
        this.notificationService.showSuccess('Registration Successfully!');
        this.initForm();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }
}
