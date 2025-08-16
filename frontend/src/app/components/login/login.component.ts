
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container-fluid h-100 bg-dark">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-md-6 col-lg-4">
          <div class="card card-login mx-auto mt-5">
            <div class="card-header">Leave Management System - Login</div>
            <div class="card-body">
              <div class="alert alert-danger" *ngIf="errorMessage">
                {{errorMessage}}
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="form-group mb-3">
                  <label for="username">Username</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    formControlName="username"
                    [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                    placeholder="Enter username">
                  <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                    Username is required
                  </div>
                </div>

                <div class="form-group mb-3">
                  <label for="password">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="Password">
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                    Password is required
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary btn-block w-100" 
                  [disabled]="loginForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  {{loading ? 'Logging in...' : 'Login'}}
                </button>
              </form>

              <div class="text-center mt-3">
                <p class="small">Default Login: admin / admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .h-100 { height: 100vh !important; }
    .card-login { width: 100%; max-width: 25rem; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/dashboard']);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
    }
  }
}
