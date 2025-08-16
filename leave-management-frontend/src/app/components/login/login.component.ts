
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container-fluid h-100">
      <div class="row justify-content-center align-items-center h-100">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <h2>Leave Management System</h2>
                <p class="text-muted">Sign in to your account</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="username" 
                    formControlName="username"
                    [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                    placeholder="Enter your username">
                  <div class="invalid-feedback" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                    Username is required
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    formControlName="password"
                    [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    placeholder="Enter your password">
                  <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                    Password is required
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{errorMessage}}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100" 
                  [disabled]="loginForm.invalid || loading">
                  <span class="spinner-border spinner-border-sm me-2" *ngIf="loading"></span>
                  {{loading ? 'Signing in...' : 'Sign In'}}
                </button>
              </form>

              <div class="mt-4">
                <h6>Demo Accounts:</h6>
                <small class="text-muted">
                  <strong>Admin:</strong> admin / admin123<br>
                  <strong>HR:</strong> hr.manager / hr123<br>
                  <strong>Employee:</strong> john.doe / emp123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
