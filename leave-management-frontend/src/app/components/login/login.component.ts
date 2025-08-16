
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <div class="row">
                <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div class="col-lg-6">
                  <div class="p-5">
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                    </div>
                    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="user">
                      <div class="form-group">
                        <input type="text" 
                               class="form-control form-control-user" 
                               formControlName="username"
                               placeholder="Enter Username..."
                               [class.is-invalid]="isFieldInvalid('username')">
                        <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                          Username is required
                        </div>
                      </div>
                      <div class="form-group">
                        <input type="password" 
                               class="form-control form-control-user"
                               formControlName="password" 
                               placeholder="Password"
                               [class.is-invalid]="isFieldInvalid('password')">
                        <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                          Password is required
                        </div>
                      </div>
                      <button type="submit" 
                              class="btn btn-primary btn-user btn-block"
                              [disabled]="loginForm.invalid || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-2"></span>
                        Login
                      </button>
                    </form>
                    <div class="alert alert-danger mt-3" *ngIf="errorMessage">
                      {{errorMessage}}
                    </div>
                    <hr>
                    <div class="text-center">
                      <small class="text-muted">
                        Demo Users:<br>
                        Admin: admin / admin123<br>
                        HR: hr.manager / hr123<br>
                        Employee: john.doe / emp123
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-login-image {
      background: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    .form-control-user {
      border-radius: 10rem;
      padding: 1.5rem 1rem;
    }
    .btn-user {
      border-radius: 10rem;
      padding: 0.75rem 1rem;
    }
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
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.loginForm.get(field);
    return !!(fieldControl && fieldControl.invalid && (fieldControl.dirty || fieldControl.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.authService.login(username, password).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    }
  }
}
